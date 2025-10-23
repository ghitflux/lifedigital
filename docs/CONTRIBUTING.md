# Contribuindo — Life Digital

## Guardrails para ferramentas de código
- NÃO criar ou editar arquivos fora de: apps/mobile, packages/*, services/api, infra/docker, docs, tools.
- NO MOBILE: nunca usar APIs Web/DOM.
- Design: apenas via tokens de `@life/tokens`. É proibido hardcode de cor/spacing.
- Padrões: Strategy/Factory/Singleton onde aplicável.
- Swagger SEMPRE atualizado ao mudar rotas.

## Commits
Conventional Commits (feat, fix, chore, refactor, docs, test).

## PR checklist
- Lint + typecheck OK
- Atualização de docs/swagger
- Screenshots (quando UI)
