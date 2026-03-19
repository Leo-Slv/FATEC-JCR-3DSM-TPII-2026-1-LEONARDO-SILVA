// Padrão: State (Comportamental)
// Motivo: mapear a lead atual para a instância de estado correta (incluindo bloqueio se finalizada).

import type { Estagio } from "../../models/domain";
import { isStatusFinal } from "../../models/domain";
import type { Lead } from "../../models/Lead";
import { AguardandoPagamentoState } from "./AguardandoPagamentoState";
import { AguardandoRespostaState } from "./AguardandoRespostaState";
import { ContatoInicialState } from "./ContatoInicialState";
import { EnviouPropostaState } from "./EnviouPropostaState";
import { FinalizadoState } from "./FinalizadoState";
import type { NegociacaoState } from "./NegociacaoState";

const map: Record<Estagio, () => NegociacaoState> = {
  "Contato inicial": () => new ContatoInicialState(),
  "Enviou proposta": () => new EnviouPropostaState(),
  "Aguardando resposta do cliente": () => new AguardandoRespostaState(),
  "Aguardando pagamento": () => new AguardandoPagamentoState(),
};

export function resolveNegociacaoState(lead: Lead): NegociacaoState {
  if (isStatusFinal(lead.status)) {
    return new FinalizadoState(lead.estagio);
  }
  return map[lead.estagio]();
}
