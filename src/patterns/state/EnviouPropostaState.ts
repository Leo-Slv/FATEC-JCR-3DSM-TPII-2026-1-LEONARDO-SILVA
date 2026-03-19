// Padrão: State (Comportamental)
// Motivo: "Enviou proposta" só avança para "Aguardando resposta do cliente" na ordem definida.

import type { Estagio } from "../../models/domain";
import { ESTAGIOS_ORDEM, indiceEstagio } from "../../models/domain";
import type { Lead } from "../../models/Lead";
import type { NegociacaoState } from "./NegociacaoState";

export class EnviouPropostaState implements NegociacaoState {
  readonly nomeEstagio: Estagio = "Enviou proposta";

  assertTransicaoEstagioPermitida(lead: Lead, novoEstagio: Estagio): void {
    if (novoEstagio === this.nomeEstagio) return;
    const atual = indiceEstagio(this.nomeEstagio);
    const proximo = ESTAGIOS_ORDEM[atual + 1];
    if (novoEstagio !== proximo) {
      throw new Error(
        `Transição de estágio inválida: de "${lead.estagio}" para "${novoEstagio}".`
      );
    }
  }
}
