// Padrão: State (Comportamental)
// Motivo: último estágio operacional — não há próximo estágio na ordem; só permanece neste.

import type { Estagio } from "../../models/domain";
import type { Lead } from "../../models/Lead";
import type { NegociacaoState } from "./NegociacaoState";

export class AguardandoPagamentoState implements NegociacaoState {
  readonly nomeEstagio: Estagio = "Aguardando pagamento";

  assertTransicaoEstagioPermitida(lead: Lead, novoEstagio: Estagio): void {
    if (novoEstagio === this.nomeEstagio) return;
    throw new Error(
      `Transição de estágio inválida: não há estágio seguinte após "${this.nomeEstagio}".`
    );
  }
}
