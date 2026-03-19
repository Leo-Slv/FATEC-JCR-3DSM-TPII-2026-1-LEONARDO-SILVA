// Padrão: nenhum GoF específico — modelo de dados da entidade Lead.
// Motivo: representar o cadastro e o estado atual da negociação de forma explícita.

import type { CanalOrigem, Estagio, StatusLead } from "./domain";

export interface Lead {
  id: string;
  nomeCliente: string;
  telefone: string;
  canalOrigem: CanalOrigem;
  veiculoInteresse: string;
  estagio: Estagio;
  status: StatusLead;
}
