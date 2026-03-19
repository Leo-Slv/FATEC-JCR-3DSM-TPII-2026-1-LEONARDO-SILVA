// Padrão: nenhum GoF específico — camada HTTP fina que delega à Facade.
// Motivo: manter controllers sem regra de negócio, apenas traduzir request/response.

import type { Request, Response } from "express";
import type { LeadFacade } from "../facade/LeadFacade";

function responderErro(res: Response, err: unknown): void {
  const msg = err instanceof Error ? err.message : "Erro interno.";
  const eh404 = msg.includes("não encontrada");
  if (eh404) {
    res.status(404).json({ erro: msg });
    return;
  }
  res.status(400).json({ erro: msg });
}

export function criarLeadController(facade: LeadFacade) {
  return (req: Request, res: Response): void => {
    try {
      const lead = facade.criarLead(req.body);
      res.status(201).json(lead);
    } catch (e) {
      responderErro(res, e);
    }
  };
}

export function listarLeadsController(facade: LeadFacade) {
  return (_req: Request, res: Response): void => {
    const leads = facade.listarLeads();
    res.json(
      leads.map((l) => ({
        id: l.id,
        nome: l.nomeCliente,
        origem: l.canalOrigem,
        veiculo: l.veiculoInteresse,
        estagio: l.estagio,
        status: l.status,
      }))
    );
  };
}

export function obterLeadPorIdController(facade: LeadFacade) {
  return (req: Request, res: Response): void => {
    const lead = facade.obterLeadPorId(req.params.id);
    if (!lead) {
      res.status(404).json({ erro: "Lead não encontrada." });
      return;
    }
    res.json(lead);
  };
}

export function atualizarNegociacaoController(facade: LeadFacade) {
  return (req: Request, res: Response): void => {
    try {
      const lead = facade.atualizarNegociacao(req.params.id, req.body);
      res.json(lead);
    } catch (e) {
      responderErro(res, e);
    }
  };
}
