// Padrão: State (Comportamental)
// Motivo: cada estágio da negociação encapsula sua própria lógica de transição,
// impedindo avanços incoerentes sem precisar de condicionais espalhadas.

import type { Estagio } from "../../models/domain";
import type { Lead } from "../../models/Lead";

export interface NegociacaoState {
  readonly nomeEstagio: Estagio;
  /** Garante que a lead pode ir para `novoEstagio` (ou permanecer no atual). */
  assertTransicaoEstagioPermitida(lead: Lead, novoEstagio: Estagio): void;
}
