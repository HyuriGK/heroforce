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

## Frontend

Com o backend em execução, abra outro terminal e execute:

```powershell
Set-Location frontend
Copy-Item .env.example .env
npm.cmd install
npm.cmd run dev
```

A aplicação ficará disponível em `http://localhost:5173`. O frontend usa
`VITE_API_URL=http://localhost:3000` por padrão. Mude essa variável apenas no
arquivo `frontend/.env` local quando a API estiver em outro endereço.

Os comandos de validação do frontend são:

```powershell
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run format:check
```

### Teste E2E no navegador

O teste E2E valida o fluxo real de um administrador: login, dashboard, abertura
de edição, criação de projeto e exclusão do projeto temporário. Ele não possui
credenciais versionadas; configure uma conta administrativa local antes de
executá-lo:

```powershell
$env:E2E_ADMIN_EMAIL = 'admin@example.com'
$env:E2E_ADMIN_PASSWORD = 'sua-senha-local'
$env:E2E_BROWSER_EXECUTABLE = 'C:\caminho\para\o\navegador.exe'
npm.cmd run test:e2e
```

No Windows, o executável do Microsoft Edge costuma estar em
`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`. Como
alternativa, instale o Chromium do Playwright com `npx playwright install
chromium` e omita `E2E_BROWSER_EXECUTABLE`.

## Projetos

Endpoints de projetos exigem JWT. Heróis recebem somente seus próprios
projetos. Operações de criação, edição e exclusão, assim como a lista de heróis
responsáveis, exigem token de administrador.

As metas `agility`, `enchantment`, `efficiency`, `excellence`, `transparency` e
`ambition` devem ser inteiros entre 0 e 100. O campo `progress` retornado pela
API é a média arredondada dessas seis metas e não é gravado no banco.

O frontend React disponibiliza login, cadastro de herói, dashboard com filtros
e formulário administrativo para projetos. A UI trata carregamento, lista vazia
e erro; as permissões continuam sendo confirmadas obrigatoriamente pela API.

## Roteiro de validação ponta a ponta

Use contas locais descartáveis e siga este roteiro antes de uma demonstração:

1. Confirme `GET /health` com resposta `database: up`.
2. Cadastre um herói pela tela `/register` e confirme que o papel retornado é
   `hero`.
3. Crie uma conta administrativa pelo seed controlado descrito acima e entre na
   aplicação com ela.
4. Crie um projeto atribuindo o herói e valores inteiros para as seis metas.
5. Confira se o progresso apresentado é a média arredondada das metas.
6. Entre como herói e confirme que somente os projetos sob sua responsabilidade
   estão visíveis, sem ações administrativas.
7. Pela API ou Swagger, confirme que o herói recebe `403 Forbidden` ao tentar
   criar, editar ou excluir projetos e ao acessar `GET /users/heroes`.

Não reutilize senhas de demonstração fora do ambiente local e não as registre
no repositório.

## Segurança

Os valores de `.env.example` são adequados apenas para desenvolvimento local.
Em qualquer ambiente compartilhado, substitua senha, segredo JWT e demais
credenciais por valores fortes e fornecidos pelo gerenciador de ambiente.

