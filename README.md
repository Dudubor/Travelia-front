# 🎨 Frontend - Projeto React

## 📌 Objetivo
Este projeto é o **frontend** da aplicação, desenvolvido em **React.js** (Create React App).  
Ele fornece a interface do usuário, consome APIs do backend e é publicado na **AWS (Elastic Beanstalk)** de forma automatizada via GitHub Actions.

---


## 📂 Estrutura do Projeto
```bash
meu-app/
├── node_modules/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── logo.svg
├── package.json
├── README.md
└── .gitignore

---
## ⚙️ Instalação e Execução

### 1. Clonar o repositório
```bash
git clone https://github.com/Dudubor/Travelia-front
cd frontend
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do frontend com base no `.env.sample`:

```dotenv
REACT_APP_API_URL=http://localhost:5000
```

> **Observação:** em produção, `REACT_APP_API_URL` deve apontar para o backend hospedado no **Elastic Beanstalk**.  

### 4. Rodar a aplicação em desenvolvimento
```bash
npm start
```
Abra no navegador: [http://localhost:3000](http://localhost:3000)

### 5. Build para produção
```bash
npm run build
```
Gera a versão otimizada em `build/`.

---

## 🧪 Testes

Para rodar os testes locais (Jest + React Testing Library):
```bash
npm test
```

---

## 🔑 Orientações sobre credenciais

- Variáveis de ambiente precisam começar com `REACT_APP_` para serem lidas pelo React.  
- Nunca insira credenciais sensíveis diretamente no frontend.  
- Apenas URLs públicas (ex: API do backend) devem ser configuradas aqui.  
- No deploy AWS, as variáveis de ambiente devem ser configuradas no **Elastic Beanstalk** (Configuration → Software → Environment properties).

---

## 🔄 CI/CD (Workflows GitHub Actions)

Os workflows do frontend estão localizados em `.github/workflows/`.

- **pipeline-ecr-eb.yml** → Build da imagem Docker, push para AWS ECR e deploy no Elastic Beanstalk.  
- **pipeline-ecr-eb-provisioning.yml** → Provisiona infraestrutura (Terraform/Ansible).  
- **pipeline-ecr-eb-terraform.yml** → Infra como código com Terraform.  
- **pipeline-ecr-eb-destroy.yml** → Destrói a infraestrutura.  

### 🔧 Gatilhos
- `push` na branch `main`
- `pull_request` para `main`
- `workflow_dispatch` para execução manual

### 🔐 Segredos utilizados
- `AWS_ACCOUNT_ID`, `AWS_REGION`, `AWS_ECR_REPO`, `AWS_EB_APP`, `AWS_EB_ENV`
- Se não usar OIDC, também: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`

---

## 📜 Licença
MIT License
