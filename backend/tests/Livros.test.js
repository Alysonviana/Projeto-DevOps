const request = require("supertest");
const { Sequelize } = require("sequelize");

// Banco em memória para testes
process.env.SQLALCHEMY_DATABASE_URI = "sqlite::memory:";

const app = require("../src/app");
const sequelize = require("../src/database");

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("GET /livros", () => {
  it("retorna lista vazia no início", async () => {
    const res = await request(app).get("/livros");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe("POST /livros", () => {
  it("cadastra um livro com sucesso", async () => {
    const res = await request(app).post("/livros").send({
      titulo: "Dom Casmurro",
      autor: "Machado de Assis",
      isbn: "978-85",
    });
    expect(res.status).toBe(201);
    expect(res.body.titulo).toBe("Dom Casmurro");
    expect(res.body.disponivel).toBe(true);
  });

  it("retorna 400 sem título", async () => {
    const res = await request(app).post("/livros").send({ autor: "Alguém" });
    expect(res.status).toBe(400);
  });
});

describe("PATCH /livros/:id/disponibilidade", () => {
  it("atualiza disponibilidade para false", async () => {
    await request(app).post("/livros").send({ titulo: "Livro A", autor: "Autor A" });
    const res = await request(app)
      .patch("/livros/1/disponibilidade")
      .send({ disponivel: false });
    expect(res.status).toBe(200);
    expect(res.body.disponivel).toBe(false);
  });
});

describe("DELETE /livros/:id", () => {
  it("remove um livro", async () => {
    await request(app).post("/livros").send({ titulo: "Livro B", autor: "Autor B" });
    const res = await request(app).delete("/livros/2");
    expect(res.status).toBe(200);
  });
});

describe("GET /livros?titulo=", () => {
  it("filtra por título", async () => {
    await request(app).post("/livros").send({ titulo: "Clean Code", autor: "Robert" });
    const res = await request(app).get("/livros?titulo=clean");
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].titulo).toBe("Clean Code");
  });
});