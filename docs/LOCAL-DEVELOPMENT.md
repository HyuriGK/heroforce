# Desenvolvimento local

## Pré-requisitos

- Node.js 20 ou superior;
- npm;
- Docker Desktop com Docker Compose disponível no terminal.

## Configuração inicial

Na raiz do projeto, copie o arquivo de exemplo para criar sua configuração
local:

```powershell
Copy-Item .env.example .env
```

O arquivo `.env` é ignorado pelo Git e não deve ser enviado ao repositório.

## Banco de dados

Suba o PostgreSQL localmente:

```powershell
docker compose up -d postgres
```

Verifique o estado do serviço:

```powershell
docker compose ps
```

O banco ficará disponível em `localhost:5432` usando as credenciais definidas
no `.env`.

Para acompanhar os logs:

```powershell
docker compose logs -f postgres
```

Para parar os serviços sem remover os dados:

```powershell
docker compose down
```

Para parar os serviços e remover o volume local do PostgreSQL:

```powershell
docker compose down -v
```

O comando com `-v` remove os dados locais do banco e deve ser usado somente
quando essa perda for intencional.

## Backend

Instale as dependências e inicie a API em modo de desenvolvimento:

```powershell
Set-Location backend
npm.cmd install
npm.cmd run start:dev
```

Quando a API estiver em execução, verifique a conexão com o banco em:

```text
http://localhost:3000/health
```

Também estão disponíveis os comandos `npm.cmd run build`,
`npm.cmd run typecheck`, `npm.cmd test` e `npm.cmd run format:check`.

O frontend React será adicionado em um próximo ciclo.

## Segurança

Os valores de `.env.example` são adequados apenas para desenvolvimento local.
Em qualquer ambiente compartilhado, substitua senha, segredo JWT e demais
credenciais por valores fortes e fornecidos pelo gerenciador de ambiente.

