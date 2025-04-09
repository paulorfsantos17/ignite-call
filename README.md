# 📅 Ignite Call

Plataforma completa de agendamento de compromissos com integração ao Google Calendar.

## 🧾 Descrição

O **Ignite Call** permite que usuários configurem sua disponibilidade e compartilhem um link para que outras pessoas agendem compromissos automaticamente integrados com o Google Agenda.

## 🚀 Tecnologias utilizadas

- **Next.js 14** — Framework React fullstack
- **React 18 + React DOM**
- **TypeScript** — Tipagem estática
- **Prisma** — ORM para modelagem e acesso ao banco de dados
- **Next Auth** — Autenticação via OAuth com Google
- **React Hook Form + Zod** — Formulários e validações modernas
- **Axios** — Cliente HTTP
- **Day.js** — Manipulação de datas
- **Phosphor React** — Ícones
- **@ignite-ui/react** — Design System personalizado
- **@tanstack/react-query** — Gerenciamento de dados assíncronos
- **Next SEO** — Gerenciamento de meta tags para SEO
- **Nookies** — Manipulação de cookies no Next.js

## 📦 Como instalar e rodar

### Pré-requisitos

- Node.js 18+
- Conta Google (para integração com OAuth2 e Google Calendar)
- Banco de dados (ex: SQLite, PostgreSQL...)

### Instalação

```bash
# Clone o projeto
git clone https://github.com/paulorfsantos17/ignite-call.git

# Acesse a pasta
cd ignite-call

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com as credenciais do Google OAuth e URL do app

# Rode as migrations do banco
npx prisma migrate dev

# Rode o projeto
npm run dev
```
📸 Prints
(Adicione imagens/gifs da aplicação em funcionamento aqui para deixar mais atrativo)

📌 Status
✅ Concluído — MVP funcional com agendamento e autenticação Google

🏷️ Tags
nextjs react typescript prisma zod react-hook-form
google-calendar next-auth react-query design-system seo

