// Padrão: Factory Method (Criacional)
// Motivo: a criação da lead é delegada a fabricas específicas por canal de origem,
// permitindo variar detalhes da construção sem acoplar o restante ao canal.

import type { CanalOrigem } from "../models/domain";
import { ESTAGIO_INICIAL, STATUS_INICIAL } from "../models/domain";
import type { Lead } from "../models/Lead";

export interface CriarLeadInput {
  nomeCliente: string;
  telefone: string;
  veiculoInteresse: string;
}

export abstract class LeadFactory {
  abstract readonly canal: CanalOrigem;

  /** Factory Method: subclasses podem especializar passos da criação. */
  protected factoryMethod(id: string, input: CriarLeadInput): Lead {
    return {
      id,
      nomeCliente: input.nomeCliente,
      telefone: input.telefone,
      canalOrigem: this.canal,
      veiculoInteresse: input.veiculoInteresse,
      estagio: ESTAGIO_INICIAL,
      status: STATUS_INICIAL,
    };
  }

  criarLead(id: string, input: CriarLeadInput): Lead {
    return this.factoryMethod(id, input);
  }
}

export class VisitaPresencialLeadFactory extends LeadFactory {
  readonly canal: CanalOrigem = "visita presencial";
}

export class TelefoneLeadFactory extends LeadFactory {
  readonly canal: CanalOrigem = "telefone";
}

export class WhatsAppLeadFactory extends LeadFactory {
  readonly canal: CanalOrigem = "whatsapp";
}

export class InstagramLeadFactory extends LeadFactory {
  readonly canal: CanalOrigem = "instagram";
}

const fabricas: Record<CanalOrigem, LeadFactory> = {
  "visita presencial": new VisitaPresencialLeadFactory(),
  telefone: new TelefoneLeadFactory(),
  whatsapp: new WhatsAppLeadFactory(),
  instagram: new InstagramLeadFactory(),
};

export function obterFabricaPorCanal(canal: CanalOrigem): LeadFactory {
  return fabricas[canal];
}
