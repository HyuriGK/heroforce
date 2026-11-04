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
npm.cmd run migration:run
npm.cmd run start:dev
```

Quando a API estiver em execução, verifique a conexão com o banco em:

```text
http://localhost:3000/health
```

A documentação interativa pode ser acessada em:

```text
http://localhost:3000/docs
```

Para testar uma rota protegida, faça login pela própria documentação, copie o
`accessToken` retornado e use o botão **Authorize**. Cole somente o token; a
interface adiciona o prefixo `Bearer` automaticamente.

Também estão disponíveis os comandos `npm.cmd run build`,
`npm.cmd run typecheck`, `npm.cmd test` e `npm.cmd run format:check`.

As migrations devem ser executadas com `npm.cmd run migration:run` após o
PostgreSQL estar saudável. Nunca use `synchronize: true` como substituto de
migrations.

## Autenticação local

Com a API em execução, os endpoints iniciais são:

- `POST http://localhost:3000/auth/register`;
- `POST http://localhost:3000/auth/login`;
- `GET http://localhost:3000/auth/me` com cabeçalho
  `Authorization: Bearer <accessToken>`.

O cadastro público sempre cria um usuário com papel `hero`. Usuários `admin`
devem ser criados pelo seed controlado, nunca pelo endpoint público:

```powershell
$env:ADMIN_NAME = 'Administrador HeroForce'
$env:ADMIN_EMAIL = 'admin@example.com'
$env:ADMIN_PASSWORD = 'troque-por-uma-senha-segura'
$env:ADMIN_CHARACTER = 'Nick Fury'
npm.cmd run seed:admin
```

O seed exige todas as variáveis `ADMIN_*`, recusa e-mails já existentes e nunca
exibe a senha. Feche o terminal ou remova as variáveis de ambiente após concluir
o procedimento.

## Projetos

Endpoints de projetos exigem JWT. Heróis recebem somente seus próprios
projetos. Operações de criação, edição e exclusão, assim como a lista de heróis
responsáveis, exigem token de administrador.

As metas `agility`, `enchantment`, `efficiency`, `excellence`, `transparency` e
`ambition` devem ser inteiros entre 0 e 100. O campo `progress` retornado pela
API é a média arredondada dessas seis metas e não é gravado no banco.

O frontend React será adicionado em um próximo ciclo.

## Segurança

Os valores de `.env.example` são adequados apenas para desenvolvimento local.
Em qualquer ambiente compartilhado, substitua senha, segredo JWT e demais
credenciais por valores fortes e fornecidos pelo gerenciador de ambiente.

