// Padrão: nenhum GoF específico — entrada do processo e bind da porta.
// Motivo: separar app (testável) de escuta HTTP.

import { criarApp } from "./app";

const PORT = process.env.PORT ?? 3000;
const app = criarApp();

app.listen(PORT, () => {
  console.log(`API escutando em http://localhost:${PORT}`);
});
