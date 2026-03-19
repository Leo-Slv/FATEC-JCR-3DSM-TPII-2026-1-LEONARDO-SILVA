// Padrão: nenhum GoF específico — composição raiz do Express.
// Motivo: registrar middleware JSON, observadores e rotas em um único ponto de montagem.

import express from "express";
import { LeadFacade } from "./facade/LeadFacade";
import { LeadEventEmitter } from "./patterns/observer/EventEmitter";
import { LogObserver } from "./patterns/observer/LogObserver";
import { LeadRepository } from "./repository/LeadRepository";
import { criarLeadRouter } from "./routes/leadRoutes";

export function criarApp(): express.Application {
  const app = express();
  app.use(express.json());

  const repository = new LeadRepository();
  const eventEmitter = new LeadEventEmitter();
  eventEmitter.subscribe(new LogObserver());
  const facade = new LeadFacade(repository, eventEmitter);

  app.use(criarLeadRouter(facade));
  return app;
}
