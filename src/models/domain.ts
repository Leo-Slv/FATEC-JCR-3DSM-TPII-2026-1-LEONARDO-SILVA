// Padrão: nenhum GoF específico — constantes de domínio compartilhadas entre camadas.
// Motivo: centralizar strings e listas válidas para validação consistente na API.

export const CANAIS_ORIGEM = [
  "visita presencial",
  "telefone",
  "whatsapp",
  "instagram",
] as const;

export type CanalOrigem = (typeof CANAIS_ORIGEM)[number];

export const ESTAGIOS_ORDEM = [
  "Contato inicial",
  "Enviou proposta",
  "Aguardando resposta do cliente",
  "Aguardando pagamento",
] as const;

export type Estagio = (typeof ESTAGIOS_ORDEM)[number];

export const STATUS_LEAD = [
  "Aberto",
  "Em negociação",
  "Finalizado com venda",
  "Finalizado sem venda",
] as const;

export type StatusLead = (typeof STATUS_LEAD)[number];

export const ESTAGIO_INICIAL: Estagio = "Contato inicial";
export const STATUS_INICIAL: StatusLead = "Aberto";

export function isCanalValido(c: string): c is CanalOrigem {
  return (CANAIS_ORIGEM as readonly string[]).includes(c);
}

export function isEstagioValido(e: string): e is Estagio {
  return (ESTAGIOS_ORDEM as readonly string[]).includes(e);
}

export function isStatusValido(s: string): s is StatusLead {
  return (STATUS_LEAD as readonly string[]).includes(s);
}

export function indiceEstagio(estagio: Estagio): number {
  return ESTAGIOS_ORDEM.indexOf(estagio);
}

export const STATUS_FINAIS: readonly StatusLead[] = [
  "Finalizado com venda",
  "Finalizado sem venda",
];

export function isStatusFinal(status: string): boolean {
  return (STATUS_FINAIS as readonly string[]).includes(status);
}
