const API = (window.API_URL || "http://localhost:5000") + "/livros";

async function listar(titulo = "") {
  const url = titulo
    ? `${API}?titulo=${encodeURIComponent(titulo)}`
    : API;
  const res = await fetch(url);
  return res.ok ? res.json() : [];
}

function renderTabela(livros) {
  const tbody = document.getElementById("tabela-corpo");
  if (!livros.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty">Nenhum livro encontrado.</td></tr>`;
    return;
  }
  tbody.innerHTML = livros.map(l => `
    <tr>
      <td>${l.id}</td>
      <td>${l.titulo}</td>
      <td>${l.autor}</td>
      <td>${l.isbn || "—"}</td>
      <td>
        <span class="badge ${l.disponivel ? "disp" : "emp"}">
          ${l.disponivel ? "Disponível" : "Emprestado"}
        </span>
      </td>
      <td class="actions">
        <button
          class="btn-toggle ${l.disponivel ? "" : "emprestado"}"
          onclick="toggleDisp(${l.id}, ${l.disponivel})">
          ${l.disponivel ? "Emprestar" : "Devolver"}
        </button>
        <button class="btn-danger" onclick="remover(${l.id})">🗑 Remover</button>
      </td>
    </tr>
  `).join("");
}

function mostrarMsg(texto, tipo) {
  const el = document.getElementById("msg");
  el.textContent = texto;
  el.className = tipo;
  setTimeout(() => { el.className = ""; el.style.display = "none"; }, 3000);
}

async function buscar(titulo) {
  const t = titulo !== undefined
    ? titulo
    : document.getElementById("inp-busca").value.trim();
  const livros = await listar(t);
  renderTabela(livros);
}

async function cadastrar() {
  const titulo = document.getElementById("inp-titulo").value.trim();
  const autor  = document.getElementById("inp-autor").value.trim();
  const isbn   = document.getElementById("inp-isbn").value.trim();

  if (!titulo || !autor) {
    mostrarMsg("Título e autor são obrigatórios.", "erro");
    return;
  }

  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, autor, isbn: isbn || null })
  });

  if (res.ok) {
    mostrarMsg("Livro cadastrado com sucesso!", "ok");
    document.getElementById("inp-titulo").value = "";
    document.getElementById("inp-autor").value  = "";
    document.getElementById("inp-isbn").value   = "";
    buscar("");
  } else {
    mostrarMsg("Erro ao cadastrar livro.", "erro");
  }
}

async function toggleDisp(id, dispAtual) {
  await fetch(`${API}/${id}/disponibilidade`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ disponivel: !dispAtual })
  });
  buscar("");
}

async function remover(id) {
  if (!confirm("Confirmar remoção do livro?")) return;
  await fetch(`${API}/${id}`, { method: "DELETE" });
  buscar("");
}

buscar("");