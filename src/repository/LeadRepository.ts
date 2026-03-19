// Padrão: nenhum GoF específico — repositório em memória.
// Motivo: persistência simples sem banco, isolando o armazenamento do restante da aplicação.

import type { Lead } from "../models/Lead";

export class LeadRepository {
  private readonly leads = new Map<string, Lead>();
  private nextId = 1;

  generateId(): string {
    return String(this.nextId++);
  }

  save(lead: Lead): void {
    this.leads.set(lead.id, { ...lead });
  }

  findById(id: string): Lead | undefined {
    const l = this.leads.get(id);
    return l ? { ...l } : undefined;
  }

  findAll(): Lead[] {
    return [...this.leads.values()].map((l) => ({ ...l }));
  }
}
