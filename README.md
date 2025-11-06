# Travelia — Frontend (React + Vite)

Aplicação web para planejamento de viagens com interface moderna, consumo de API própria e geração de roteiros.  
Este repositório contém **somente o frontend** (SPA em React + Vite). O backend pode estar em Render/Azure/etc. — configure o endpoint via variável de ambiente.

## ✨ Principais recursos

- UI responsiva com **React + Vite + TypeScript** (opcional), **Tailwind** e **Shadcn UI**  
- Formulários de viagem, autocomplete de destinos, listagem de viagens e exibição de roteiros  
- Integração com backend via `VITE_BACKEND_URL`  
- Build otimizado e **deploy automático na Azure Static Web Apps (SWA)** via GitHub Actions  
- Suporte a SPA fallback (refresh em rotas internas funciona em produção)

## 🧱 Stack

- **React** (Vite)
- **TypeScript** 
- **TailwindCSS / Shadcn UI / Lucide** 
- **Axios**
- **GitHub Actions** (CI/CD para Azure SWA)


## 🔧 Pré-requisitos

- **Node.js** 20+ (LTS recomendado)  
- **npm** ou **pnpm/yarn**  
- Acesso ao backend (URL pública) e **CORS** corretamente configurado

## 🔑 Variáveis de ambiente

Crie um `.env` na raiz (não commitar) e defina:

```bash
# URL pública do backend (Render/Azure/etc.)
VITE_BACKEND_URL="https://seu-backend.com"
```

No Vite, variáveis de ambiente **devem** começar com `VITE_`.  
No código, acessa com `import.meta.env.VITE_BACKEND_URL`.

## ▶️ Scripts

No `package.json` (exemplo):

```json
{
  "scripts": {
    "dev": "vite --host",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "lint": "eslint ."
  }
}
```

- `npm run dev` – modo desenvolvimento
- `npm run build` – build de produção em `dist/`

## 🚀 Rodando localmente

```bash
npm run dev
```

Acesse: `http://localhost:5173` (porta padrão do Vite).

---

## ☁️ Deploy na **Azure Static Web Apps**

A Azure SWA é ideal para SPAs; hospeda os arquivos estáticos e cuida do fallback de rotas.

### 1) Arquivo de rotas (SPA fallback)

Crie **`staticwebapp.config.json`** na raiz do projeto:

```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": [
      "/assets/*",
      "/*.{png,jpg,jpeg,svg,gif,webp,ico,css,js,txt,map,woff,woff2,ttf,eot}"
    ]
  },
  "routes": [
    {
      "route": "/index.html",
      "headers": {
        "cache-control": "no-cache, no-store, must-revalidate"
      }
    },
    {
      "route": "/assets/*",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    }
  ],
  "globalHeaders": {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()"
  },
  "mimeTypes": {
    ".webmanifest": "application/manifest+json",
    ".map": "application/json",
    ".md": "text/plain; charset=utf-8"
  }
}

```

### 2) Configurar ação do GitHub (CI/CD)

No repositório **frontend**, crie o arquivo  
`.github/workflows/azure-static-web-apps.yml`:

```yaml
name: Deploy Frontend to Azure Static Web Apps

on:
  push:
    branches: [ "main" ]
  workflow_dispatch:

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install
        run: npm ci

      - name: Build
        run: npm run build

      # Deploy para Azure SWA
      - name: Deploy to Azure Static Web Apps
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "upload"
          app_location: "/"
          output_location: "dist"
        env:
          VITE_BACKEND_URL: ${{ secrets.VITE_BACKEND_URL }}
```

#### Secrets necessários (GitHub → Settings → Secrets → Actions)
- `AZURE_STATIC_WEB_APPS_API_TOKEN` – obtido ao criar a SWA no portal da Azure (ou pelo botão “Manage deployment token”).
- `VITE_BACKEND_URL` – URL do backend para build/deploy (prod).


### 3) Criar o recurso na Azure

- Portal Azure → **Static Web Apps** → *Create*  
- **Source**: GitHub 
- **Framework preset**: *Custom* ou *Vite*  
- **App location**: `/`  
- **Output location**: `dist`  
- Concluir e copiar o **deployment token** para o secret do GitHub.

### 4) CORS (se o backend estiver em outro host)

Garanta que o backend aceite a origem da SWA (ex.: `https://purple-plant-1234.z01.web.core.windows.net`).  
No Express, por exemplo:

```ts
import cors from "cors";
app.use(cors({
  origin: ["https://SEU-SWA.azurestaticapps.net", "http://localhost:5173"],
  credentials: true
}));
```

---

## ✅ Boas práticas

- **Roteamento SPA:** use o `staticwebapp.config.json` para evitar 404 em refresh  
- **Env por ambiente:** `VITE_BACKEND_URL` via secrets do GitHub/Environments  
- **Segurança:** evite expor chaves; só valores públicos no front  
- **CORS:** sempre alinhar domínios (localhost + produção)  
- **Logs:** em produção, use `console.error` com parcimônia e monitoração no backend

## 🧰 Troubleshooting

- **404 ao recarregar rota interna:** faltou SPA fallback (`staticwebapp.config.json`)  
- **CORS/401/403:** backend não reconhece a origem da SWA — ajuste `cors()`  
- **Variáveis não aplicam em produção:** lembre-se que Vite “embute” env no **build**. Se mudar `VITE_BACKEND_URL`, precisa **rebuildar** e redeployar ou adotar estratégia de config dinâmica.  
- **Fonte/ícones quebrando:** confira caminhos relativos e seção `exclude` no fallback.

## 📜 Licença

Defina a licença do projeto (por exemplo, MIT).

