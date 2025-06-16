# 🛡️ User Auth API

API de autenticação de usuários construída com Node.js e Express, utilizando JSON Web Tokens (JWT), bcrypt para segurança de senhas e validação com Joi.

---

## ✨ Funcionalidades

- ✅ Registro de usuários com validação
- 📧 Confirmação de e-mail via token/OTP
- 🔐 Login com geração de JWT
- 🔁 Revalidação e redefinição de senha
- 👤 Acesso e edição de perfil autenticado
- 📬 Envio de e-mails (OTP, redefinição de senha)
- 🔒 Proteção de rotas com middleware JWT

---

## 🧰 Tecnologias Utilizadas

- **Node.js** + **Express**
- **JWT** para autenticação stateless
- **bcrypt** para hashing de senhas
- **Joi** para validação de entrada
- **dotenv** para gerenciamento de variáveis ambiente
- Serviço de envio de e-mail (SMTP ou integração externa)

---

## 🚀 Instalação e Execução

### 1. Clone o projeto

```
bash
git clone https://github.com/ConeBill/User-auth-api.git
cd User-auth-api
```
