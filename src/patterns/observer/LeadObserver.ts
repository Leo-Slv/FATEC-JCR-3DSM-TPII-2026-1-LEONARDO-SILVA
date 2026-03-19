// Padrão: Observer (Comportamental)
// Motivo: desacoplar quem notifica mudanças na lead de quem reage (ex.: logs, integrações futuras).

export interface LeadChangePayload {
  leadId: string;
  estagioAnterior: string;
  estagioNovo: string;
  statusAnterior: string;
  statusNovo: string;
}

export interface LeadObserver {
  onLeadNegociacaoAlterada(payload: LeadChangePayload): void;
}
