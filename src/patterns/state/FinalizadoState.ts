// Padrão: State (Comportamental)
// Motivo: lead finalizada não pode alterar estágio; o estado concentra essa regra de bloqueio.

import type { Estagio } from "../../models/domain";
import type { Lead } from "../../models/Lead";
import type { NegociacaoState } from "./NegociacaoState";

export class FinalizadoState implements NegociacaoState {
  constructor(readonly nomeEstagio: Estagio) {}

  assertTransicaoEstagioPermitida(lead: Lead, novoEstagio: Estagio): void {
    if (novoEstagio === lead.estagio) return;
    throw new Error(
      "Lead finalizada não pode avançar ou alterar o estágio da negociação."
    );
  }
}
