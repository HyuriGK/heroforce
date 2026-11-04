# HeroForce - Especificação do produto e da solução

**Versão:** 1.0.0

**Status:** baseline inicial para desenvolvimento spec-driven

**Última atualização:** 2026-11-04

## 1. Objetivo

Construir um portal web fullstack para a empresa fictícia HeroForce gerenciar e
acompanhar projetos heroicos. Heróis poderão se cadastrar, escolher um
personagem e consultar seus projetos. Administradores poderão cadastrar,
editar, acompanhar e excluir projetos.

O produto deve demonstrar domínio de NestJS, ReactJS, TypeScript, TypeORM,
PostgreSQL, autenticação, autorização, organização de código, UX responsiva,
testes e documentação.

## 2. Escopo

### Incluído

- Cadastro de heróis.
- Login e sessão autenticada com JWT.
- Escolha de personagem pelo usuário.
- Perfis `hero` e `admin`.
- Cadastro, consulta, edição e exclusão de projetos por administradores.
- Associação de cada projeto a um responsável principal.
- Status de projeto: `pendente`, `em andamento` e `concluído`.
- Seis metas de progresso: agilidade, encantamento, eficiência, excelência,
  transparência e ambição.
- Dashboard com projetos, status, metas, responsáveis e progresso.
- Filtros por status e herói.
- API REST documentada com Swagger.
- Ambiente local reproduzível com PostgreSQL e Docker Compose.
- Testes automatizados das regras críticas.

### Fora do escopo inicial

- Cadastro público de administradores.
- Recuperação de senha por e-mail.
- Múltiplos responsáveis ou equipes por projeto.
- Comentários, anexos, notificações e histórico de alterações.
- Integrações externas com catálogos oficiais da Marvel ou DC.
- Gestão financeira, vendas reais ou pagamentos.

## 3. Atores e permissões

### Visitante

- Acessar login.
- Acessar cadastro de herói.

### Herói (`hero`)

- Fazer login e sair da sessão.
- Visualizar o próprio perfil e personagem.
- Visualizar projetos dos quais é responsável.
- Consultar status, metas e percentual de progresso dos próprios projetos.
- Usar filtros aplicáveis à sua própria lista.
- Não criar, editar ou excluir projetos.

### Administrador (`admin`)

- Fazer login e sair da sessão.
- Visualizar todos os projetos.
- Filtrar projetos por status e responsável.
- Consultar a lista de heróis disponíveis como responsáveis.
- Criar projetos.
- Editar projetos.
- Excluir projetos.
- Alterar status, responsável e valores das metas.

O backend deve validar todas as permissões. Esconder um botão no frontend não é
considerado controle de acesso.

## 4. Requisitos funcionais

### RF-01 - Cadastro de herói

O visitante deve informar nome, e-mail, senha e personagem. O e-mail deve ser
único e normalizado para evitar duplicidade por diferença de maiúsculas ou
espaços. O papel criado deve ser sempre `hero`.

Critérios de aceite:

- Dados inválidos retornam erro de validação compreensível.
- Senha nunca é retornada pela API.
- E-mail já cadastrado não pode criar outro usuário.
- Cadastro válido permite login.

### RF-02 - Autenticação

O usuário deve fazer login com e-mail e senha e receber um token JWT. Rotas
protegidas devem rejeitar requisições sem token válido.

Critérios de aceite:

- Senha incorreta não revela se o e-mail existe.
- Token inválido ou expirado retorna `401 Unauthorized`.
- O frontend mantém a sessão apenas conforme a estratégia definida pelo cliente
  HTTP e remove a sessão quando o logout ocorrer.

### RF-03 - Usuário e personagem

Cada usuário deve possuir nome, e-mail, personagem, papel e datas de criação e
atualização. O personagem é texto livre validado, sem integração externa.

### RF-04 - Cadastro de projeto

Administrador deve informar nome, descrição, status, responsável e os seis
valores de meta. Os valores das metas devem ser números inteiros entre 0 e 100.

Campos obrigatórios:

- nome;
- descrição;
- status;
- responsável;
- agilidade;
- encantamento;
- eficiência;
- excelência;
- transparência;
- ambição.

### RF-05 - Consulta de projetos

Usuário autenticado acessa `GET /projects`. Administrador recebe todos os
projetos. Herói recebe somente projetos em que é o responsável.

A consulta deve aceitar filtros opcionais por status e responsável. Filtros
incompatíveis ou valores inválidos devem retornar erro de validação.

### RF-06 - Edição e exclusão de projeto

Somente administrador pode alterar ou remover projeto. A exclusão deve exigir
um identificador válido e retornar resposta consistente quando o projeto não
existir.

### RF-07 - Status

Os únicos valores aceitos são:

- `pendente`;
- `em_andamento`;
- `concluido`.

O status é controlado pelo administrador e não será alterado automaticamente
pelo cálculo das metas. A interface pode sinalizar visualmente quando um
projeto concluído ainda não atingiu 100%.

### RF-08 - Metas e progresso

Cada projeto possui seis metas independentes, todas no intervalo de 0 a 100:

| Campo técnico | Nome exibido |
| --- | --- |
| `agility` | Agilidade |
| `enchantment` | Encantamento |
| `efficiency` | Eficiência |
| `excellence` | Excelência |
| `transparency` | Transparência |
| `ambition` | Ambição |

O progresso geral não será armazenado como fonte independente. Ele será
calculado pela média aritmética das seis metas e exibido arredondado para o
inteiro mais próximo:

```text
progresso = round((agility + enchantment + efficiency + excellence
  + transparency + ambition) / 6)
```

### RF-09 - Dashboard

O dashboard deve apresentar:

- quantidade total de projetos visíveis ao usuário;
- distribuição por status;
- lista de projetos;
- responsável;
- progresso geral;
- visualização das seis metas;
- filtros por status e herói quando permitidos;
- estados de carregamento, lista vazia e erro.

### RF-10 - Formulário administrativo

O formulário de criação e edição deve validar os campos no frontend, mostrar
feedback de sucesso ou erro e atualizar a lista após operação concluída.

## 5. Modelo de domínio

### User

| Campo | Tipo | Regras |
| --- | --- | --- |
| `id` | UUID | Identificador primário |
| `name` | string | Obrigatório, tamanho limitado |
| `email` | string | Obrigatório, único, normalizado |
| `passwordHash` | string | Obrigatório, nunca exposto |
| `character` | string | Obrigatório, tamanho limitado |
| `role` | enum | `hero` ou `admin`; padrão `hero` |
| `createdAt` | timestamp | Gerado pelo banco |
| `updatedAt` | timestamp | Atualizado automaticamente |

### Project

| Campo | Tipo | Regras |
| --- | --- | --- |
| `id` | UUID | Identificador primário |
| `name` | string | Obrigatório, tamanho limitado |
| `description` | text | Obrigatório |
| `status` | enum | `pendente`, `em_andamento`, `concluido` |
| `agility` | integer | 0 a 100 |
| `enchantment` | integer | 0 a 100 |
| `efficiency` | integer | 0 a 100 |
| `excellence` | integer | 0 a 100 |
| `transparency` | integer | 0 a 100 |
| `ambition` | integer | 0 a 100 |
| `responsibleId` | UUID | FK obrigatória para `User` |
| `createdAt` | timestamp | Gerado pelo banco |
| `updatedAt` | timestamp | Atualizado automaticamente |

Relação: um `User` pode ser responsável por muitos `Project`; cada `Project`
possui um único responsável principal.

## 6. API REST inicial

### Autenticação

- `POST /auth/register` - cadastra herói.
- `POST /auth/login` - autentica usuário.
- `GET /auth/me` - retorna usuário autenticado sem senha.

### Usuários

- `GET /users/heroes` - lista heróis para seleção de responsável; admin only.
- `GET /users/me` - retorna o perfil atual.

### Projetos

- `GET /projects` - lista conforme perfil, com filtros opcionais.
- `GET /projects/:id` - detalha projeto permitido.
- `POST /projects` - cria projeto; admin only.
- `PATCH /projects/:id` - edita projeto; admin only.
- `DELETE /projects/:id` - exclui projeto; admin only.

Filtros previstos em `GET /projects`:

```text
GET /projects?status=em_andamento&responsibleId=<uuid>
```

Respostas de erro devem usar códigos HTTP apropriados e um formato consistente,
sem expor stack trace ou dados sensíveis.

## 7. Frontend inicial

### Rotas

- `/login` - login.
- `/register` - cadastro de herói.
- `/dashboard` - dashboard autenticado.
- `/projects/new` - criação; admin only.
- `/projects/:id/edit` - edição; admin only.

### Componentes e estados

- layout autenticado;
- navegação com nome, personagem e papel;
- cards de resumo;
- tabela ou cards responsivos de projetos;
- barras ou anéis de progresso;
- formulário reutilizável de projeto;
- confirmação antes de exclusão;
- loading, vazio, erro e sucesso;
- mensagens acessíveis e foco visível.

## 8. Requisitos não funcionais

- NestJS, ReactJS, TypeScript, TypeORM e PostgreSQL devem ser utilizados.
- TypeScript deve ser configurado em modo estrito sempre que suportado.
- Senhas devem ser armazenadas com hash seguro; nunca em texto puro.
- Segredos devem vir de variáveis de ambiente.
- Banco deve ser versionado por migrations.
- API deve possuir documentação Swagger.
- Interface deve funcionar em desktop e mobile.
- Formulários e mensagens devem considerar acessibilidade básica.
- Testes devem cobrir autenticação, autorização, cálculo de progresso e CRUD.
- README deve permitir que outra pessoa execute o projeto sem conhecimento
  prévio do ambiente local.

## 9. Critérios de aceite da entrega

Considerar a entrega pronta quando:

- visitante consegue cadastrar um herói e fazer login;
- herói consegue visualizar apenas seus projetos;
- administrador consegue visualizar, filtrar, criar, editar e excluir projetos;
- metas são validadas entre 0 e 100;
- progresso geral é calculado conforme a regra definida;
- permissões são aplicadas no backend;
- API possui Swagger funcional;
- frontend é responsivo e trata loading, vazio, erro e sucesso;
- testes críticos passam;
- Docker e README permitem execução local;
- histórico de commits e `docs/COMMITS.txt` estão organizados;
- build de produção é concluído sem erros.

## 10. Processo de alteração da spec

Qualquer mudança nos requisitos deve:

1. descrever o motivo;
2. atualizar esta especificação e sua versão;
3. ajustar critérios de aceite afetados;
4. atualizar testes e implementação;
5. registrar a mudança no histórico de commits.

Decisões técnicas menores podem ser registradas na seção de decisões ou em
`docs/ARCHITECTURE.md`, desde que não contradigam esta spec.

