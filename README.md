# HeroForce

Portal web fullstack para gestão e acompanhamento de projetos heroicos.
O projeto foi desenvolvido como resposta a um desafio técnico de
Desenvolvedor(a) Web Fullstack.

## Objetivo

Permitir que heróis se cadastrem, escolham um personagem e acompanhem seus
projetos. Administradores poderão gerenciar projetos, responsáveis, status e
metas relacionadas aos valores da HeroForce:

- Agilidade
- Encantamento
- Eficiência
- Excelência
- Transparência
- Ambição

## Stack planejada

- Backend: NestJS, TypeScript, TypeORM e PostgreSQL
- Frontend: ReactJS, TypeScript e interface responsiva
- Autenticação: JWT e bcrypt
- Documentação: Swagger
- Ambiente local: Docker Compose
- Testes: Jest e testes de interface conforme a necessidade

## Estrutura

```text
heroforce/
├── backend/    # API NestJS
├── frontend/   # Aplicação React
├── docs/       # Decisões e rastreabilidade do projeto
├── .editorconfig
├── .gitattributes
├── .gitignore
└── README.md
```

## Status do desenvolvimento

O repositório está na etapa de preparação da fundação. A implementação do
backend, frontend, banco de dados, autenticação e dashboard será adicionada em
commits pequenos e rastreáveis.

## Documentação

- [Instruções para agentes de IA](AGENTS.md)
- [Especificação canônica do projeto](docs/SPEC.md)
- [Decisões de arquitetura](docs/ARCHITECTURE.md)
- [Rastreabilidade dos commits](docs/COMMITS.txt)

## Execução local

Pré-requisitos: Node.js 20 ou superior, npm e Docker Desktop com Docker Compose.

```powershell
Copy-Item .env.example .env
docker compose up -d postgres
docker compose ps

Set-Location backend
npm.cmd install
npm.cmd run migration:run
npm.cmd run start:dev
```

As instruções detalhadas estão em [Desenvolvimento local](docs/LOCAL-DEVELOPMENT.md).
Com o backend em execução, a verificação de saúde estará disponível em
`http://localhost:3000/health`.

## API disponível

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/health` | Verifica a API e o PostgreSQL. |
| `POST` | `/auth/register` | Cadastra um herói e retorna JWT. |
| `POST` | `/auth/login` | Autentica um usuário e retorna JWT. |
| `GET` | `/auth/me` | Retorna o usuário autenticado; exige Bearer token. |
| `GET` | `/users/heroes` | Lista heróis elegíveis como responsáveis; admin only. |
| `GET` | `/projects` | Lista projetos visíveis conforme o papel do usuário. |
| `GET` | `/projects/:id` | Detalha um projeto permitido ao usuário. |
| `POST` | `/projects` | Cria projeto; admin only. |
| `PATCH` | `/projects/:id` | Atualiza projeto; admin only. |
| `DELETE` | `/projects/:id` | Exclui projeto; admin only. |

Após instalar dependências, execute `npm.cmd run migration:run` dentro de
`backend` antes de testar cadastro ou login.

Para criar uma conta administrativa local de forma controlada, defina as quatro
variáveis `ADMIN_*` presentes em `.env.example` no seu `.env` local e execute
`npm.cmd run seed:admin` dentro de `backend`.

## Qualidade e histórico

O projeto adota commits coesos seguindo Conventional Commits. Cada alteração
relevante será validada antes do commit e registrada em `docs/COMMITS.txt` com a
mensagem utilizada, código incluído, arquivos afetados e validações executadas.

