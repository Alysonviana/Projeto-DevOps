# 📚 Biblioteca Acadêmica — Projeto DevOps PBL

Sistema de controle de livros para uma pequena biblioteca acadêmica.

## Stack

| Camada    | Tecnologia                      |
|-----------|---------------------------------|
| Frontend  | HTML + CSS + JS (Nginx)         |
| Backend   | Node.js + Express + Sequelize   |
| Banco     | PostgreSQL                      |
| DevOps    | Docker Compose + GitHub Actions |

## Como rodar

```bash
cp .env.example .env
docker compose up -d --build

# Frontend: http://localhost
# Backend:  http://localhost:5000/livros
```

## Endpoints da API

| Método | Rota                           | Descrição                     |
|--------|--------------------------------|-------------------------------|
| GET    | `/livros`                      | Listar (filtro `?titulo=`)    |
| POST   | `/livros`                      | Cadastrar livro               |
| GET    | `/livros/:id`                  | Buscar por ID                 |
| PATCH  | `/livros/:id/disponibilidade`  | Atualizar disponibilidade     |
| DELETE | `/livros/:id`                  | Remover livro                 |

## Rodar testes

```bash
cd backend
npm install
npm test
```