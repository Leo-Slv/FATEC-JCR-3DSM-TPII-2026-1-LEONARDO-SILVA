// Padrão: Observer (Comportamental)
// Motivo: mecanismo simples de publicação de eventos para múltiplos observadores.

import type { LeadChangePayload, LeadObserver } from "./LeadObserver";

export class LeadEventEmitter {
  private readonly observers: LeadObserver[] = [];

  subscribe(observer: LeadObserver): void {
    this.observers.push(observer);
  }

  emitLeadNegociacaoAlterada(payload: LeadChangePayload): void {
    for (const o of this.observers) {
      o.onLeadNegociacaoAlterada(payload);
    }
  }
}
