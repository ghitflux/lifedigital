## Auditoria - Correções Aplicadas (23/10/2025)

- Centralizamos o consumo de serviços utilizando `apiClient` e removemos URLs fixas `http://localhost:8080` dos hooks de dados (`apps/mobile/src/lib/hooks`).
- Reestruturamos o `authStore` para expor `accessToken`, `refreshToken` e ações alinhadas com o restante da aplicação, adicionando controle de hidratação via MMKV (`apps/mobile/src/stores/authStore.ts`).
- Sincronizamos os stores de Zustand com os contratos reais da API (`documentsStore`, `marginStore`, `simulationsStore`).
- Atualizamos toda a navegação para carregar as telas implementadas, eliminando placeholders e verificando o estado de autenticação real no `RootNavigator`.
- Adicionamos `metro.config.js` e `app.config.ts` para suportar o monorepo e variáveis públicas no Expo.
- Normalizamos strings/textos para ASCII em áreas críticas para evitar problemas de encoding durante o bundle.
