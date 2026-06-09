const express = require("express");
const cors = require("cors");
const sequelize = require("./database");
const livrosRouter = require("./routes/livros");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/livros", livrosRouter);

// Sincroniza tabelas e sobe o servidor
const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
  });
}).catch((err) => {
  console.error("❌ Erro ao conectar ao banco:", err);
});

module.exports = app;