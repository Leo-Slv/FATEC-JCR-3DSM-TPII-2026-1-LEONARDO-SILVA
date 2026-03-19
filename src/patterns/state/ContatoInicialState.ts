// Padrão: State (Comportamental)
// Motivo: o estágio "Contato inicial" só permite permanecer nele ou avançar para "Enviou proposta".

import type { Estagio } from "../../models/domain";
import { ESTAGIOS_ORDEM, indiceEstagio } from "../../models/domain";
import type { Lead } from "../../models/Lead";
import type { NegociacaoState } from "./NegociacaoState";

export class ContatoInicialState implements NegociacaoState {
  readonly nomeEstagio: Estagio = "Contato inicial";

  assertTransicaoEstagioPermitida(lead: Lead, novoEstagio: Estagio): void {
    if (novoEstagio === this.nomeEstagio) return;
    const atual = indiceEstagio(this.nomeEstagio);
    const alvo = indiceEstagio(novoEstagio);
    const proximo = ESTAGIOS_ORDEM[atual + 1];
    if (novoEstagio !== proximo) {
      throw new Error(
        `Transição de estágio inválida: de "${lead.estagio}" para "${novoEstagio}".`
      );
    }
  }
}
