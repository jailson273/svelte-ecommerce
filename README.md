# Svelte eCommerce

Este é um projeto de e-commerce desenvolvido com [SvelteKit](https://kit.svelte.dev/), utilizando tecnologias modernas como TailwindCSS, TypeScript e Clerk para autenticação. O objetivo é fornecer uma base sólida para criar uma aplicação de e-commerce funcional e escalável.

## Funcionalidades

- Autenticação de usuários com Clerk.
- Gerenciamento de carrinho de compras.
- Sistema de wishlist.
- Integração com banco de dados SQLite utilizando Drizzle ORM.
- Interface estilizada com TailwindCSS.

## Configuração do Projeto

Siga os passos abaixo para configurar e executar o projeto localmente:

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [PNPM](https://pnpm.io/) (gerenciador de pacotes)

### Passos para Configuração

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seu-usuario/svelte-ecommerce.git
   cd svelte-ecommerce
   ```

2. **Instalar as dependências:**

   ```bash
   pnpm install
   ```

3. **Criar de variaveis de ambiente com as chaves:**

   ```bash
   # .env
   DATABASE_URL=local.db
   PUBLIC_CLERK_PUBLISHABLE_KEY=you_clerk_key_here
   ```

   ```bash
   cp .env.example .env
   ```

4. **Criar o arquivo do banco de dados:**

   ```bash
   touch local.db
   ```

5. **Criar um conta no clerk e obter a chave:**

   ```bash
   https://clerk.com/docs
   ```

### Fontes

1. **Figma** https://www.figma.com/community/file/1357820302669976191
2. **Svelte** https://svelte.dev/docs
3. **Clerk** https://clerk.com/docs
4. **Drizzle** https://orm.drizzle.team/docs/overview
