# Sistema de Gerenciamento de Comandas

Projeto desenvolvido para a disciplina **Programação Web II** (FURB). Consiste em uma API REST em C# com banco PostgreSQL e um frontend em Next.js para cadastro e consulta de comandas, com autenticação JWT.

---

## Índice

1. [Tecnologias utilizadas](#tecnologias-utilizadas)
2. [Estrutura do projeto](#estrutura-do-projeto)
3. [Pré-requisitos](#pré-requisitos)
4. [Como rodar o projeto localmente](#como-rodar-o-projeto-localmente)
5. [Documentação da API (Swagger)](#documentação-da-api-swagger)
6. [Endpoints disponíveis](#endpoints-disponíveis)
7. [Requisitos atendidos](#requisitos-atendidos)

---

## Tecnologias utilizadas

| Camada    | Tecnologia |
|-----------|------------|
| Backend   | ASP.NET Core 8, C#, Entity Framework Core, PostgreSQL, JWT, BCrypt, Swagger |
| Frontend  | Next.js 16, TypeScript, Tailwind CSS, shadcn/ui |
| Banco     | PostgreSQL |

---

## Estrutura do projeto

```
prova_furb/
├── backend/
│   └── FurbWeb/                    # API ASP.NET Core
│       ├── Controllers/            # Auth, Comandas, Usuarios
│       ├── Models/                 # Usuario, Cliente, Produto, Comanda, ComandaProduto
│       ├── Data/                   # ApplicationDbContext
│       ├── DAOs/                   # Acesso a dados (padrão DAO)
│       ├── Services/               # AuthService, ComandaService
│       ├── DTOs/                   # Objetos de entrada/saída da API
│       ├── Migrations/             # Migrations do Entity Framework
│       ├── appsettings.Example.json # Modelo de configuração (sem senhas)
│       └── Program.cs
├── frontend/                       # Aplicação Next.js
│   ├── app/                        # Rotas (login, register, comandas)
│   ├── components/                # Componentes UI (shadcn)
│   ├── lib/                        # api.ts, auth.ts, utils
│   └── types/                      # Tipos TypeScript
├── .gitignore
└── README.md
```

---

## Pré-requisitos

Antes de rodar o projeto, instale:

| Software        | Versão sugerida | Onde obter |
|-----------------|-----------------|------------|
| .NET SDK        | 8.0             | https://dotnet.microsoft.com/download |
| Node.js         | 18 ou superior  | https://nodejs.org |
| PostgreSQL      | 12 ou superior  | https://www.postgresql.org/download/ |

Verifique no terminal:

```bash
dotnet --version    # Ex.: 8.0.x
node --version      # Ex.: v18.x ou v20.x
npm --version       # Ex.: 9.x ou 10.x
psql --version      # Ex.: 14.x ou 16.x
```

---

## Como rodar o projeto localmente

Siga a ordem abaixo: primeiro o banco, depois o backend e por último o frontend.

### Passo 1: Banco de dados PostgreSQL

1. Inicie o PostgreSQL serviço no Windows

2. Crie o banco e o usuário (se ainda não existir). No terminal:

   **Windows (cmd/PowerShell) ou Linux/Mac:**

   ```bash
   psql -U postgres -c "CREATE DATABASE furbweb;"
   ```

   Se o `psql` não estiver no PATH, use o caminho completo da instalação do PostgreSQL ou o pgAdmin para criar o banco `furbweb`.

3. Anote:
   - **Host:** em geral `localhost`
   - **Porta:** em geral `5432`
   - **Banco:** `furbweb`
   - **Usuário:** ex.: `postgres`
   - **Senha:** a senha do usuário PostgreSQL

---

### Passo 2: Backend (API)

1. Abra um terminal na **pasta raiz do projeto** (onde está a pasta `backend`).

2. Crie o arquivo de configuração a partir do exemplo:

   ```bash
   cd backend/FurbWeb
   copy appsettings.Example.json appsettings.json
   ```

   No Linux/Mac:

   ```bash
   cd backend/FurbWeb
   cp appsettings.Example.json appsettings.json
   ```

3. Edite o arquivo **`appsettings.json`** e ajuste:

   - **ConnectionStrings:DefaultConnection**  
     Troque `SUA_SENHA_AQUI` pela senha real do usuário PostgreSQL. Exemplo:

     ```json
     "DefaultConnection": "Host=localhost;Port=5432;Database=furbweb;Username=postgres;Password=sua_senha"
     ```

   - **Jwt:Key**  
     Troque `SUA_CHAVE_SECRETA_JWT_AQUI_MINIMO_32_CARACTERES` por uma chave secreta com pelo menos 32 caracteres (pode ser uma frase longa ou uma string aleatória).

4. Restaurar pacotes e aplicar as migrations:

   ```bash
   dotnet restore
   dotnet ef database update
   ```

   Se aparecer erro de comando `ef`, instale a ferramenta global:

   ```bash
   dotnet tool install --global dotnet-ef
   ```

   Depois rode de novo:

   ```bash
   dotnet ef database update
   ```

5. Subir a API:

   ```bash
   dotnet run
   ```

   A API deve iniciar em **http://localhost:8080**.  
   O Swagger deve abrir em: **http://localhost:8080/swagger**

   Deixe este terminal aberto enquanto usar o sistema.

---

### Passo 3: Frontend (Next.js)

1. Abra **outro terminal** na pasta raiz do projeto.

2. Entre na pasta do frontend e instale as dependências:

   ```bash
   cd frontend
   npm install
   ```

3. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

   O frontend deve abrir em **http://localhost:3000**.

---

### Resumo rápido (já com banco e appsettings configurados)

**Terminal 1 – Backend:**

```bash
cd backend/FurbWeb
dotnet run
```

**Terminal 2 – Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Depois acesse: **http://localhost:3000**

---

## Primeiro uso: criar usuário e fazer login

1. Acesse **http://localhost:3000**.
2. Clique em **“Criar conta”** (ou acesse **http://localhost:3000/register**).
3. Cadastre um **login** e uma **senha** (mínimo 6 caracteres).
4. Volte para a tela de login e entre com esse usuário.
5. Após o login, você será redirecionado para a lista de comandas. A partir daí pode:
   - Criar nova comanda (cliente + produtos)
   - Ver detalhes de uma comanda
   - Excluir comanda
   - Sair (logout)

A senha é armazenada no banco **criptografada** (BCrypt). O acesso às comandas exige **token JWT** retornado no login.

---

## Documentação da API (Swagger)

Com o backend rodando (`dotnet run`), abra no navegador:

**http://localhost:8080/swagger**

No Swagger você pode:

- Ver todos os endpoints (auth, comandas, usuários).
- Testar as requisições (ex.: POST `/FurbWeb/v1/auth/login`, GET `/FurbWeb/v1/comandas`).
- Para endpoints que exigem login:
  1. Chame primeiro **POST /FurbWeb/v1/auth/login** com `login` e `senha`.
  2. Copie o valor de `access_token` da resposta.
  3. Clique em **“Authorize”** no topo do Swagger.
  4. Informe: `Bearer SEU_ACCESS_TOKEN_AQUI` e confirme.
  5. Depois teste GET/POST/PUT/DELETE em comandas.

---

## Endpoints disponíveis

URL base: **http://localhost:8080/FurbWeb/v1**

| Método | Rota | Autenticação | Descrição |
|--------|------|--------------|-----------|
| POST   | `/auth/login`    | Não | Login (retorna JWT) |
| POST   | `/auth/register` | Não | Cadastro de usuário |
| POST   | `/auth/logout`   | Sim | Logout (token Bearer) |
| GET    | `/comandas`      | Sim | Lista clientes das comandas |
| GET    | `/comandas/{id}` | Sim | Comanda por ID (ou primeira do cliente) |
| POST   | `/comandas`      | Sim | Criar comanda (cliente + produtos) |
| PUT    | `/comandas/{id}` | Sim | Atualizar comanda (ex.: produtos) |
| DELETE | `/comandas/{id}` | Sim | Remover comanda |
| POST   | `/usuarios`      | Não | Cadastrar usuário (alternativo ao register) |
| GET    | `/usuarios/{id}` | Não | Buscar usuário por ID |

Respostas de erro seguem códigos HTTP adequados (400, 401, 404, 409, 500). Autenticação: header `Authorization: Bearer {access_token}`.

---

## Requisitos atendidos

- **Web Service REST** com comunicação JSON e códigos de erro HTTP conforme boas práticas.
- **Persistência** em banco relacional (PostgreSQL) via **Entity Framework Core** (ORM); tabelas no **plural**, entidades no **singular**; tabelas/colunas geradas pelo framework.
- **Cadastro de usuário** com login e senha; **senha criptografada** (BCrypt) no banco; serviço de cadastro (register e/ou POST `/usuarios`).
- **Serviços protegidos por token**: comandas exigem autenticação; **token JWT** gerado no login (login/senha); uso de **Microsoft.AspNetCore.Authentication.JwtBearer**.
- **Documentação** da API com **Swagger**.
- **MVC + DAO**: Controllers (MVC), DAOs para acesso a dados (Usuario, Cliente, Produto, Comanda).
- **Validação** nos modelos (Data Annotations) e em DTOs quando aplicável.
- **IDs sequenciais**: cliente, produto e comanda com ID gerado pelo banco; não é necessário informar ID ao criar comanda ou produtos.

---

## Problemas comuns

**Backend não inicia / erro de conexão**

- Confira usuário e senha em `appsettings.json`.
- Verifique se o PostgreSQL está rodando e se o banco `furbweb` existe.
- Teste a conexão com `psql -U postgres -d furbweb -h localhost`.

**Frontend retorna 401 ao listar comandas**

- Faça login pelo frontend (ou pelo Swagger) e confirme que o token está sendo enviado (o frontend envia automaticamente após o login).
- Se estiver testando no Swagger, use **Authorize** com `Bearer {access_token}`.

**Erro ao rodar `dotnet ef database update`**

- Instale: `dotnet tool install --global dotnet-ef`.
- Execute o comando dentro da pasta `backend/FurbWeb`.

**Porta 8080 ou 3000 já em uso**

- Altere a porta do backend em `backend/FurbWeb/Properties/launchSettings.json` (e, se necessário, a URL da API no frontend em `frontend/lib/api.ts`).
- Para o frontend: `npm run dev -- -p 3001` (ou outra porta).

---

Para dúvidas sobre o funcionamento do projeto ou sobre como rodar localmente, utilize este README como guia passo a passo.
