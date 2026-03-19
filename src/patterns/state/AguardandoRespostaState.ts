// Padrão: State (Comportamental)
// Motivo: "Aguardando resposta do cliente" só avança para "Aguardando pagamento".

import type { Estagio } from "../../models/domain";
import { ESTAGIOS_ORDEM, indiceEstagio } from "../../models/domain";
import type { Lead } from "../../models/Lead";
import type { NegociacaoState } from "./NegociacaoState";

export class AguardandoRespostaState implements NegociacaoState {
  readonly nomeEstagio: Estagio = "Aguardando resposta do cliente";

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
