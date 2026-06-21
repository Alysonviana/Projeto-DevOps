const express = require("express");
const router = express.Router();
const Livro = require("../models/Livro");
const { Op } = require("sequelize");

// GET /livros?titulo=xxx
router.get("/", async (req, res) => {
  try {
    const { titulo } = req.query;
    const where = titulo
      ? { titulo: { [Op.iLike]: `%${titulo}%` } }
      : {};
    const livros = await Livro.findAll({ where });
    res.json(livros);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao listar livros" });
  }
});

// GET /livros/:id
router.get("/:id", async (req, res) => {
  try {
    const livro = await Livro.findByPk(req.params.id);
    if (!livro) return res.status(404).json({ erro: "Livro não encontrado" });
    res.json(livro);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar livro" });
  }
});

// POST /livros
router.post("/", async (req, res) => {
  try {
    const { titulo, autor, isbn } = req.body;
    if (!titulo || !autor) {
      return res.status(400).json({ erro: "titulo e autor são obrigatórios" });
    }
    const livro = await Livro.create({ titulo, autor, isbn: isbn || null, disponivel: true });
    res.status(201).json(livro);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao cadastrar livro" });
  }
});

// PATCH /livros/:id/disponibilidade
router.patch("/:id/disponibilidade", async (req, res) => {
  try {
    const livro = await Livro.findByPk(req.params.id);
    if (!livro) return res.status(404).json({ erro: "Livro não encontrado" });

    const { disponivel } = req.body;
    if (typeof disponivel !== "boolean") {
      return res.status(400).json({ erro: "campo 'disponivel' deve ser boolean" });
    }

    livro.disponivel = disponivel;
    await livro.save();
    res.json(livro);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar disponibilidade" });
  }
});

// DELETE /livros/:id
router.delete("/:id", async (req, res) => {
  try {
    const livro = await Livro.findByPk(req.params.id);
    if (!livro) return res.status(404).json({ erro: "Livro não encontrado" });
    await livro.destroy();
    res.json({ mensagem: "Livro removido com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao remover livro" });
  }
});
router.get('/', (req, res) => {
  const { titulo } = req.query;
  if (titulo) {
    db.all('SELECT * FROM livros WHERE titulo LIKE ?', [`%${titulo}%`], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  } else {
    db.all('SELECT * FROM livros', [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  }
});

module.exports = router;