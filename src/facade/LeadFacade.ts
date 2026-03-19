// Padrão: Facade (Estrutural)
// Motivo: o controller conversa só com esta fachada; ela orquestra fábrica, repositório,
// estados da negociação e notificação a observadores, escondendo a complexidade interna.

import { obterFabricaPorCanal } from "../factory/LeadFactory";
import type { Estagio, StatusLead } from "../models/domain";
import {
  isCanalValido,
  isEstagioValido,
  isStatusFinal,
  isStatusValido,
} from "../models/domain";
import type { Lead } from "../models/Lead";
import { LeadEventEmitter } from "../patterns/observer/EventEmitter";
import { resolveNegociacaoState } from "../patterns/state/resolveNegociacaoState";
import { LeadRepository } from "../repository/LeadRepository";

export interface CriarLeadDto {
  nome: string;
  telefone: string;
  canalOrigem: string;
  veiculoInteresse: string;
}

export interface AtualizarNegociacaoDto {
  estagio?: string;
  status?: string;
}

export class LeadFacade {
  constructor(
    private readonly repository: LeadRepository,
    private readonly eventEmitter: LeadEventEmitter
  ) {}

  criarLead(dto: CriarLeadDto): Lead {
    if (!dto.nome?.trim()) throw new Error("nome é obrigatório.");
    if (!dto.telefone?.trim()) throw new Error("telefone é obrigatório.");
    if (!dto.veiculoInteresse?.trim()) {
      throw new Error("veículo de interesse é obrigatório.");
    }
    if (!dto.canalOrigem || !isCanalValido(dto.canalOrigem)) {
      throw new Error("canal de origem inválido.");
    }

    const id = this.repository.generateId();
    const fabrica = obterFabricaPorCanal(dto.canalOrigem);
    const lead = fabrica.criarLead(id, {
      nomeCliente: dto.nome.trim(),
      telefone: dto.telefone.trim(),
      veiculoInteresse: dto.veiculoInteresse.trim(),
    });
    this.repository.save(lead);
    return lead;
  }

  listarLeads(): Lead[] {
    return this.repository.findAll();
  }

  obterLeadPorId(id: string): Lead | undefined {
    return this.repository.findById(id);
  }

  atualizarNegociacao(id: string, dto: AtualizarNegociacaoDto): Lead {
    const atual = this.repository.findById(id);
    if (!atual) throw new Error("Lead não encontrada.");

    const temEstagio = dto.estagio !== undefined;
    const temStatus = dto.status !== undefined;
    if (!temEstagio && !temStatus) {
      throw new Error("Informe estagio e/ou status para atualizar.");
    }

    let novoEstagio: Estagio = atual.estagio;
    let novoStatus: StatusLead = atual.status;

    if (temEstagio) {
      if (!isEstagioValido(dto.estagio!)) {
        throw new Error("Valor de estágio inválido.");
      }
      novoEstagio = dto.estagio as Estagio;
    }
    if (temStatus) {
      if (!isStatusValido(dto.status!)) {
        throw new Error("Valor de status inválido.");
      }
      novoStatus = dto.status as StatusLead;
    }

    if (isStatusFinal(atual.status)) {
      if (novoEstagio !== atual.estagio || novoStatus !== atual.status) {
        throw new Error(
          "Lead finalizada não pode ter estágio ou status alterados."
        );
      }
      return atual;
    }

    if (temEstagio) {
      const estado = resolveNegociacaoState(atual);
      estado.assertTransicaoEstagioPermitida(atual, novoEstagio);
    }
    if (temStatus) {
      this.assertTransicaoStatusPermitida(atual.status, novoStatus);
    }

    const estagioAnterior = atual.estagio;
    const statusAnterior = atual.status;

    const atualizada: Lead = {
      ...atual,
      estagio: novoEstagio,
      status: novoStatus,
    };

    this.repository.save(atualizada);

    if (estagioAnterior !== novoEstagio || statusAnterior !== novoStatus) {
      this.eventEmitter.emitLeadNegociacaoAlterada({
        leadId: atualizada.id,
        estagioAnterior,
        estagioNovo: novoEstagio,
        statusAnterior,
        statusNovo: novoStatus,
      });
    }

    return atualizada;
  }

  private assertTransicaoStatusPermitida(
    de: StatusLead,
    para: StatusLead
  ): void {
    if (para === de) return;
    if (de === "Aberto" && para === "Em negociação") return;
    if (
      de === "Em negociação" &&
      (para === "Finalizado com venda" || para === "Finalizado sem venda")
    ) {
      return;
    }
    throw new Error(`Transição de status inválida: de "${de}" para "${para}".`);
  }
}
