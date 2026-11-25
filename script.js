// ====== CONFIGURAÇÃO (edite aqui) ======
const GITHUB_USER = "joaopedroduarteborges";
const HIDDEN_REPOS = ["joaopedroduarteborges"]; // repositório do README do perfil

const SKILLS = {
  "Linguagens e web": ["JavaScript", "CSS", "HTML", "Python"],
  "Banco de dados": ["MySQL", "SQL"],
  "Ferramentas": ["Git", "GitHub", "Databricks (introdução)"],
  "Idiomas": ["Português (nativo)", "Inglês B2"]
};

// Para adicionar um certificado, copie o PDF para a pasta assets/ e inclua um item aqui.
const CERTIFICATES = [
  {
    title: "Databricks Get Started Days (Data Engineering + SQL Analytics and BI)",
    issuer: "Databricks Academy",
    date: "25/11/2026",
    file: "assets/certificado-databricks.pdf"
  }
];

// Textos de apoio caso a API do GitHub esteja indisponível ou o repositório não tenha descrição.
const DESCRIPTIONS = {
  "techstore_banco_de_dados": "Projeto acadêmico de banco de dados.",
  "Engenharia_De_Requisitos_2026_2": "Trabalho da disciplina de Engenharia de Requisitos (2026/2).",
  "introducao-computacao-hardware-JoaoPedroBorges": "Atividades da disciplina de Introdução à Computação e Hardware.",
  "pk-estetica-automotiva": "Trabalho final de Desenvolvimento de Interfaces com Vite, Three.js e GSAP."
};

const FALLBACK_REPOS = [
  { name: "pk-estetica-automotiva", language: "JavaScript", fork: true },
  { name: "techstore_banco_de_dados", language: null, fork: false },
  { name: "Engenharia_De_Requisitos_2026_2", language: null, fork: false },
  { name: "introducao-computacao-hardware-JoaoPedroBorges", language: null, fork: false }
].map(r => ({ ...r, html_url: `https://github.com/${GITHUB_USER}/${r.name}` }));

// ====== FUNÇÕES AUXILIARES ======
const $ = id => document.getElementById(id);

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function prettyName(name) {
  return name
    .replace(/-?JoaoPedroBorges$/i, "")
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/^./, c => c.toUpperCase());
}

// ====== GITHUB ======
function renderRepos(repos, live) {
  const grid = $("repo-grid");
  grid.replaceChildren();

  repos.forEach(repo => {
    const card = el("a", "card");
    card.href = repo.html_url;
    card.target = "_blank";
    card.rel = "noopener";

    card.append(el("h3", "", prettyName(repo.name)));
    card.append(el("p", "", repo.description || DESCRIPTIONS[repo.name] || "Repositório no GitHub."));

    const tags = el("div", "tags");
    if (repo.language) tags.append(el("span", "tag", repo.language));
    if (repo.fork) tags.append(el("span", "tag alt", "Fork"));
    tags.append(el("span", "tag alt", "Ver no GitHub"));
    card.append(tags);

    grid.append(card);
  });

  $("repo-note").textContent = live
    ? "Atualizado automaticamente a partir do GitHub."
    : "Não foi possível consultar o GitHub agora. Exibindo a lista salva.";
}

async function loadGitHub() {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USER}`),
      fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`)
    ]);
    if (!userRes.ok || !reposRes.ok) throw new Error("GitHub API indisponível");

    const user = await userRes.json();
    const repos = (await reposRes.json()).filter(r => !HIDDEN_REPOS.includes(r.name));

    $("stat-repos").textContent = user.public_repos;
    $("stat-followers").textContent = user.followers;
    $("stat-following").textContent = user.following;
    renderRepos(repos, true);
  } catch (err) {
    renderRepos(FALLBACK_REPOS, false);
  }
}

// ====== HABILIDADES ======
function renderSkills() {
  const box = $("skills");
  Object.entries(SKILLS).forEach(([group, items]) => {
    const wrap = el("div", "skill-group");
    wrap.append(el("h3", "", group));
    const chips = el("div", "chips");
    items.forEach(item => chips.append(el("span", "chip", item)));
    wrap.append(chips);
    box.append(wrap);
  });
}

// ====== CERTIFICADOS ======
function renderCertificates() {
  const list = $("cert-list");
  if (!CERTIFICATES.length) {
    list.append(el("p", "empty", "Nenhum certificado cadastrado ainda."));
    return;
  }
  CERTIFICATES.forEach(c => {
    const card = el("article", "cert");
    card.append(el("h3", "", c.title));
    card.append(el("p", "", `${c.issuer} · Concluído em ${c.date}`));
    const link = el("a", "", "Ver certificado (PDF)");
    link.href = c.file;
    link.target = "_blank";
    link.rel = "noopener";
    card.append(link);
    list.append(card);
  });
}

// ====== INICIALIZAÇÃO ======
$("year").textContent = new Date().getFullYear();
renderSkills();
renderCertificates();
loadGitHub();