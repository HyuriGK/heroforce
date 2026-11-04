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
```

As instruções detalhadas estão em [Desenvolvimento local](docs/LOCAL-DEVELOPMENT.md).
Os comandos de backend, frontend, migrations, testes e build serão adicionados
conforme os serviços forem implementados.

## Qualidade e histórico

O projeto adota commits coesos seguindo Conventional Commits. Cada alteração
relevante será validada antes do commit e registrada em `docs/COMMITS.txt` com a
mensagem utilizada, código incluído, arquivos afetados e validações executadas.

