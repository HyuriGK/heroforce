# Decisões de arquitetura

## Visão geral

O HeroForce será organizado como um monorepo simples, com frontend e backend
separados no mesmo repositório. A comunicação entre as aplicações será feita
por uma API REST protegida por JWT.

## Domínios principais

### Usuário

Representa o herói cadastrado na plataforma. Os campos principais serão nome,
email, senha, personagem e papel de acesso.

Os papéis previstos são:

- `hero`: consulta seus projetos e informações permitidas;
- `admin`: gerencia projetos, responsáveis e progresso.

O papel administrativo é necessário porque o desafio exige operações que não
devem estar disponíveis para todos os usuários.

### Projeto

Representa um projeto heroico acompanhado pela HeroForce. Cada projeto terá um
responsável principal, status, descrição e seis metas numéricas de 0 a 100.

O percentual geral de conclusão será calculado pela média das seis metas. Esse
critério será documentado na API e refletido na interface.

## Regras de acesso

- Qualquer pessoa poderá acessar login e cadastro.
- Usuários autenticados poderão consultar os projetos permitidos ao seu perfil.
- Apenas administradores poderão criar, editar e excluir projetos.
- O backend será a fonte de verdade das permissões; o frontend apenas refletirá
  as permissões para melhorar a experiência de uso.

## Organização prevista do backend

```text
backend/src/
├── auth/
├── users/
├── projects/
├── database/
├── health/
├── common/
└── main.ts
```

O módulo `health` é a primeira parte implementada da API. Ele verifica a
conectividade com o PostgreSQL por meio de `SELECT 1` e expõe `GET /health`.

## Organização prevista do frontend

```text
frontend/src/
├── components/
├── features/
│   ├── auth/
│   └── projects/
├── layouts/
├── pages/
├── routes/
├── services/
├── types/
└── main.tsx
```

## Critérios de implementação

- Tipagem explícita com TypeScript.
- Validação de entrada no backend e nos formulários.
- Migrations em vez de depender exclusivamente de sincronização automática.
- Configuração por variáveis de ambiente.
- Tratamento consistente de erros.
- Testes para autenticação, autorização e regras principais de projetos.
- Documentação atualizada junto com a evolução do código.

## Ambiente local

O PostgreSQL de desenvolvimento será executado por Docker Compose, usando um
volume nomeado para preservar os dados entre reinicializações. Backend e
frontend serão executados como processos de desenvolvimento em suas respectivas
pastas, com variáveis compartilhadas pelo arquivo `.env` local.

O arquivo `.env.example` documenta as variáveis necessárias sem expor segredos
reais. A configuração de produção não deve reutilizar as credenciais locais.

