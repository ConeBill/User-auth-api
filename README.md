# 🛡️ User Auth API

API de autenticação de usuários desenvolvida em Node.js com Express, MongoDB e JWT. O projeto fornece endpoints para cadastro, login, verificação de sessão, autenticação via refresh token e controle de tipos de usuário (como comprador e vendedor).

## Tecnologias Utilizadas

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (access e refresh token)
- bcryptjs (hash de senhas)
- dotenv (variáveis de ambiente)
- cookie-parser (cookies HTTP-only)
- CORS

## Estrutura do Projeto

```
User-auth-api/
├── controllers/         # Lógica dos endpoints
├── middlewares/         # Autenticação e permissões
├── models/              # Schemas Mongoose
├── routes/              # Rotas de autenticação e usuários
├── utils/               # Funções auxiliares (ex: geração de tokens)
├── .env.example         # Exemplo de variáveis de ambiente
├── app.js               # Configuração do Express
├── server.js            # Inicialização do servidor
└── package.json
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/user-auth-db
JWT_SECRET=chave_secreta_do_jwt
JWT_REFRESH_SECRET=chave_secreta_do_refresh_token
```

Você pode usar o arquivo `.env.example` como base.

## Instalação e Execução

1. Clone o repositório:

```
git clone https://github.com/ConeBill/User-auth-api.git
cd User-auth-api
```

2. Instale as dependências:

```
npm install
```

3. Configure o arquivo `.env` com suas credenciais.

4. Inicie o servidor:

```
npm start
```
A aplicação estará disponível em: `http://localhost:5000`

## Documentação da API

A API possui documentação interativa disponível nos seguintes endpoints:

- Swagger: `http://localhost:5000/api-docs`
- Redoc: `http://localhost:5000/docs`


## Endpoints Principais

| Método | Rota               | Descrição                            |
|--------|--------------------|----------------------------------------|
| POST   | /api/auth/register | Cadastro de novo usuário               |
| POST   | /api/auth/login    | Login e geração de tokens              |
| GET    | /api/auth/refresh  | Gera novo access token via refresh     |
| GET    | /api/auth/logout   | Logout e remoção do refresh token      |
| GET    | /api/user/profile  | Retorna os dados do usuário logado     |

Algumas rotas requerem o envio do `accessToken` no header `Authorization` e o `refreshToken` como cookie HTTP-only.

## Observações

- O projeto segue uma arquitetura modular, facilitando manutenção e evolução.
- O refresh token é armazenado em cookie seguro, seguindo boas práticas de segurança.
- A documentação da API é gerada via Swagger/OpenAPI e servida com Swagger UI e Redoc.
