// Padrão: Observer (Comportamental)
// Motivo: observador concreto que registra histórico de mudanças no console, conforme enunciado.

import type { LeadChangePayload, LeadObserver } from "./LeadObserver";

export class LogObserver implements LeadObserver {
  onLeadNegociacaoAlterada(payload: LeadChangePayload): void {
    const linha = `[HISTÓRICO] lead=${payload.leadId} | estágio: "${payload.estagioAnterior}" → "${payload.estagioNovo}" | status: "${payload.statusAnterior}" → "${payload.statusNovo}"`;
    console.log(linha);
  }
}
