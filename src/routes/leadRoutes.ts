// Padrão: nenhum GoF específico — definição das rotas REST exigidas.
// Motivo: isolar o mapeamento URL → controller sem misturar com bootstrap do servidor.

import { Router } from "express";
import type { LeadFacade } from "../facade/LeadFacade";
import {
  atualizarNegociacaoController,
  criarLeadController,
  listarLeadsController,
  obterLeadPorIdController,
} from "../controllers/leadController";

export function criarLeadRouter(facade: LeadFacade): Router {
  const r = Router();
  r.post("/leads", criarLeadController(facade));
  r.get("/leads", listarLeadsController(facade));
  r.get("/leads/:id", obterLeadPorIdController(facade));
  r.patch("/leads/:id/negociacao", atualizarNegociacaoController(facade));
  return r;
}
