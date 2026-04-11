# Printable Apolo - Catalogo de Impressao 3D

Site estatico de catalogo de produtos de impressao 3D com botoes de compra direto no WhatsApp e integracao opcional com AppSheet.

## Stack

- **Vite** + **React** + **TypeScript**
- **Tailwind CSS v4** (tema via diretiva `@theme`, sem `tailwind.config.js`)
- **AppSheet API** - leitura de dados via endpoint `/Action` com `Find`

---

## Primeiros passos

```bash
npm install
npm run dev      # servidor de desenvolvimento em http://localhost:5173
npm run build    # compilação de produção (saída em dist/)
npm run preview  # pré-visualiza o build de produção localmente
npm run lint     # ESLint
```

---

## Configuracao

Configure o numero do WhatsApp em `src/config.ts` e copie `.env.example` para `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Depois preencha os valores:

```bash
VITE_APPSHEET_APP_ID=SEU_APP_ID
VITE_APPSHEET_TABLE_NAME=Produtos
VITE_APPSHEET_ACCESS_KEY=SUA_CHAVE_DE_ACESSO
```

### Seguranca (frontend-only)

- Este projeto eh estatico e usa AppSheet direto no navegador.
- Qualquer chave `VITE_*` pode ser extraida por usuarios finais.
- Use uma chave de baixo privilegio (somente leitura) e rotacione periodicamente.
- Nunca commite `.env` com credenciais reais.
- Mantenha no repositorio apenas `.env.example`.

### AppSheet

1. No AppSheet, abra o app e copie o `App ID`.
2. Gere uma `Application Access Key` em Security > Integrations > In: Server API.
3. Confirme o nome da tabela que contem o catalogo (ex: `Produtos`).
4. Garanta que existam colunas compativeis com os campos abaixo:

    | id | name (ou nome) | price (ou preco) | imageUrl (ou imagem) | tag (ou categoria) | salesCount (ou sales/vendas) | description (ou descricao) |
    |----|----------------|------------------|-----------------------|--------------------|-------------------------------|----------------------------|

5. O frontend chama o endpoint:

```text
POST https://api.appsheet.com/api/v2/apps/{APP_ID}/tables/{TABLE_NAME}/Action
Header: ApplicationAccessKey: {ACCESS_KEY}
Body: { "Action": "Find", "Properties": { ... }, "Rows": [] }
```

> Se o AppSheet nao estiver configurado ou estiver inacessivel, o site exibe automaticamente produtos de demonstracao com um aviso no topo do catalogo.
>
> Importante: a chave do AppSheet no frontend fica exposta no bundle. Se decidir continuar sem backend, trate a chave como publica e de baixo privilegio.

---

## Estrutura do projeto

```
src/
├── config.ts                        # numero WhatsApp e variaveis do AppSheet
├── types/product.ts                 # interface Product
├── services/
│   └── appSheetService.ts           # fetch AppSheet + fallback para mock
└── components/
    ├── HeroSection.tsx              # banner principal com CTAs WhatsApp
    ├── ProductCard.tsx              # card de produto
    ├── ProductCardSkeleton.tsx      # skeleton de carregamento
    ├── FilterBar.tsx                # busca, preço mín/máx e ordenação
    ├── ProductGrid.tsx              # grade de produtos + paginação
    └── Pagination.tsx               # paginação com ellipsis (30 itens/pág)
```

---

## Deploy

O projeto gera arquivos estáticos em `dist/` e pode ser hospedado em qualquer CDN estático (Vercel, Netlify, GitHub Pages, etc.).

```bash
npm run build
# faça o deploy da pasta dist/
```



