# Instruções do agente para o HeroForce

## Fonte de verdade

Antes de analisar, implementar, corrigir ou revisar qualquer solicitação,
leia este arquivo e `docs/SPEC.md`.

`docs/SPEC.md` é a especificação canônica do produto e da solução técnica.
Quando uma solicitação alterar comportamento, regras, modelo de dados, API,
permissões ou telas, a especificação deve ser atualizada antes ou junto da
implementação.

Se uma solicitação entrar em conflito com a especificação, não esconda a
decisão no código. Explique o conflito e proponha a alteração da spec. Mudanças
que alterem significativamente o escopo devem ser confirmadas pelo usuário.

## Fluxo obrigatório para cada solicitação

1. Ler `AGENTS.md`, `docs/SPEC.md` e a documentação relacionada ao módulo.
2. Identificar os requisitos e critérios de aceite afetados.
3. Verificar o estado atual do repositório e preservar alterações existentes.
4. Atualizar a especificação quando o comportamento esperado mudar.
5. Implementar a menor mudança coesa que atenda aos requisitos.
6. Adicionar ou atualizar testes para o comportamento alterado.
7. Executar as validações apropriadas e registrar seus resultados.
8. Atualizar README ou documentação técnica quando necessário.
9. Atualizar `docs/COMMITS.txt` com o código, arquivos e validações do ciclo.
10. Criar um commit coeso seguindo Conventional Commits.

## Regras de qualidade

- Usar TypeScript com tipagem explícita e modo estrito.
- Manter separação clara entre domínio, aplicação, infraestrutura e interface.
- Validar entradas no backend e nos formulários do frontend.
- Fazer autorização no backend; a interface não é uma barreira de segurança.
- Nunca versionar senhas, tokens, chaves ou arquivos `.env` reais.
- Preferir migrations versionadas a sincronização automática em ambientes reais.
- Tratar estados de carregamento, vazio, sucesso e erro na interface.
- Manter acessibilidade, responsividade e mensagens claras para o usuário.
- Evitar alterações não relacionadas à solicitação atual.
- Não registrar commits fictícios: usar hashes e mensagens reais do Git.

## Regras de decisão

- A solução atual usa API REST, não GraphQL.
- O papel padrão de cadastro público é `hero`.
- Contas `admin` não são criadas pelo cadastro público.
- Um projeto possui um responsável principal.
- O progresso geral é calculado a partir das seis metas definidas na spec.
- O backend é a fonte de verdade para autenticação, autorização e regras de
  negócio.
- Se um detalhe não estiver definido, escolher a alternativa mais simples,
  segura e consistente, documentando a decisão em `docs/SPEC.md`.

## Commits

Usar mensagens no formato:

```text
tipo(escopo): descrição curta
```

Tipos comuns: `feat`, `fix`, `test`, `docs`, `refactor`, `chore` e `style`.

Um commit deve representar uma mudança coesa e ser validável isoladamente.
Depois de cada commit, a rastreabilidade deve ser mantida em
`docs/COMMITS.txt`. Como o hash só existe após a criação, o registro do commit
mais recente será consolidado no ciclo seguinte.

## Entrega

Antes de considerar o projeto pronto, verificar os critérios de aceite em
`docs/SPEC.md`, executar build e testes, revisar o README e confirmar que o
histórico de commits está compreensível para uma pessoa avaliadora.

