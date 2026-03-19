# Tutorial — API de leads (revenda de automóveis)

API REST em **Node.js**, **Express** e **TypeScript**, com armazenamento **em memória** (os dados somem ao encerrar o processo).

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (versão LTS recomendada).

---

## Instalação

Na pasta do projeto (`TPII`):

```bash
npm install
```

---

## Como executar

### Modo desenvolvimento (recarrega ao salvar arquivos)

```bash
npm run dev
```

### Modo produção (compila e roda o JavaScript gerado)

```bash
npm run build
npm start
```

Por padrão o servidor sobe em **http://localhost:3000**. Para outra porta:

```bash
# Windows (PowerShell)
$env:PORT=4000; npm start

# Linux / macOS
PORT=4000 npm start
```

---

## Endpoints

Base URL de exemplo: `http://localhost:3000`

| Método | Caminho | Descrição |
|--------|---------|-----------|
| `POST` | `/leads` | Cadastra uma nova lead |
| `GET` | `/leads` | Lista todas as leads (campos resumidos) |
| `GET` | `/leads/:id` | Detalhes de uma lead |
| `PATCH` | `/leads/:id/negociacao` | Atualiza estágio e/ou status |

---

### 1. Cadastrar lead — `POST /leads`

**Corpo JSON (obrigatório):**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `nome` | string | Nome do cliente |
| `telefone` | string | Telefone |
| `canalOrigem` | string | Canal (veja valores válidos abaixo) |
| `veiculoInteresse` | string | Veículo de interesse |

**Canais de origem válidos** (exatamente estes textos):

- `visita presencial`
- `telefone`
- `whatsapp`
- `instagram`

Ao criar, a API define automaticamente:

- **estágio:** `Contato inicial`
- **status:** `Aberto`

**Exemplo com cURL** (Linux, macOS ou Windows com `curl`):

```bash
curl -s -X POST http://localhost:3000/leads \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "{\"nome\":\"Maria Silva\",\"telefone\":\"11988887777\",\"canalOrigem\":\"whatsapp\",\"veiculoInteresse\":\"HB20 2022\"}"
```

**Exemplo com PowerShell:**

```powershell
$body = @{
  nome = "Maria Silva"
  telefone = "11988887777"
  canalOrigem = "whatsapp"
  veiculoInteresse = "HB20 2022"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3000/leads -Method POST `
  -ContentType "application/json; charset=utf-8" -Body $body
```

**Resposta:** `201 Created` com o objeto completo da lead (inclui `id`, `estagio`, `status`).

---

### 2. Listar leads — `GET /leads`

Retorna um array. Cada item contém:

`id`, `nome`, `origem`, `veiculo`, `estagio`, `status`

```bash
curl -s http://localhost:3000/leads
```

---

### 3. Obter uma lead — `GET /leads/:id`

Retorna todos os campos da lead, por exemplo:

`id`, `nomeCliente`, `telefone`, `canalOrigem`, `veiculoInteresse`, `estagio`, `status`

```bash
curl -s http://localhost:3000/leads/1
```

Se o `id` não existir: **404** com `{ "erro": "Lead não encontrada." }`.

---

### 4. Evoluir negociação — `PATCH /leads/:id/negociacao`

**Corpo JSON:** informe **pelo menos um** dos campos:

| Campo | Obrigatório | Descrição |
|-------|-------------|-----------|
| `estagio` | não* | Próximo estágio (respeitando a ordem) |
| `status` | não* | Novo status (respeitando as transições) |

\* É obrigatório enviar `estagio` **ou** `status` (ou ambos).

#### Ordem dos estágios (só avanço de um em um)

1. `Contato inicial`
2. `Enviou proposta`
3. `Aguardando resposta do cliente`
4. `Aguardando pagamento`

Não é permitido pular estágios nem retroceder. Depois de `Aguardando pagamento` não há próximo estágio (só manter o mesmo).

#### Status possíveis

- `Aberto`
- `Em negociação`
- `Finalizado com venda`
- `Finalizado sem venda`

**Transições de status permitidas** (além de enviar o mesmo valor que já está na lead):

- `Aberto` → `Em negociação`
- `Em negociação` → `Finalizado com venda` ou `Finalizado sem venda`

#### Leads finalizadas

Se o status já for `Finalizado com venda` ou `Finalizado sem venda`, **não** é possível alterar estágio nem status.

**Exemplo — passar para “Em negociação” e depois avançar o estágio:**

```bash
curl -s -X PATCH http://localhost:3000/leads/1/negociacao \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "{\"status\":\"Em negociação\"}"

curl -s -X PATCH http://localhost:3000/leads/1/negociacao \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "{\"estagio\":\"Enviou proposta\"}"
```

**Resposta:** `200` com a lead atualizada.

---

## Erros comuns

- **400** — corpo inválido, canal inválido, transição de estágio/status inválida ou PATCH sem `estagio` e sem `status`. Corpo típico: `{ "erro": "mensagem" }`.
- **404** — lead não encontrada (`GET`/`PATCH` com `id` inexistente).

Use sempre **`Content-Type: application/json`** e, quando possível, **UTF-8** nos textos acentuados.

---

## Log de histórico (Observer)

Quando uma alteração em **PATCH** muda de fato o **estágio** ou o **status**, o servidor imprime no **console** uma linha no formato:

```text
[HISTÓRICO] lead=<id> | estágio: "..." → "..." | status: "..." → "..."
```

Útil para acompanhar a evolução durante testes com `npm run dev` ou `npm start`.

---

## Resumo rápido

1. `npm install` → `npm run dev` (ou `npm run build` + `npm start`).
2. `POST /leads` com os quatro campos e canal válido.
3. `GET /leads` e `GET /leads/:id` para consultar.
4. `PATCH /leads/:id/negociacao` para evoluir **estágio** (em ordem) e **status** (transições permitidas), até finalizar a venda.
