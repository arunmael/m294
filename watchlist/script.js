const VALID_USER = "admin";
const VALID_PASS = "m294";
const API_URL = "https://dummyjson.com/products?limit=12";

const $ = (id) => document.getElementById(id);
const statusEl = $("status");
const cardsEl = $("cards");
const detailsEl = $("details");
const listEl = $("list");

let supply = [];          // Filme, die noch nicht angezeigt werden
const byId = new Map();   // id -> Film (alle geladenen)
let selectedId = null;

function setStatus(text, type = "") {
  statusEl.textContent = text;
  statusEl.className = "status " + type;
}

// ---------- Teil A: Login ----------
function showApp(user) {
  $("login").hidden = true;
  $("app").hidden = false;
  $("logout").hidden = false;
  setStatus("Angemeldet als " + user, "ok");
}

function login() {
  const user = $("username").value.trim();
  const pass = $("password").value;
  if (user === VALID_USER && pass === VALID_PASS) {
    sessionStorage.setItem("user", user);
    showApp(user);
    loadMovies().then(restoreWatchlist);
  } else {
    setStatus("Benutzername oder Passwort falsch.", "error");
    $("password").value = "";
  }
}

function logout() {
  sessionStorage.removeItem("user");
  cardsEl.innerHTML = "";
  byId.clear();
  supply = [];
  selectedId = null;
  $("app").hidden = true;
  $("logout").hidden = true;
  $("login").hidden = false;
  $("username").value = $("password").value = "";
  setStatus("Abgemeldet.");
}

// ---------- Teil B: API ----------
async function loadMovies() {
  setStatus("Lade…");
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    data.products.forEach((m) => byId.set(String(m.id), m));
    const all = data.products;
    all.slice(0, 6).forEach((m) => cardsEl.append(renderCard(m)));
    supply = all.slice(6);
    updateButtons();
    setStatus("Angemeldet als " + sessionStorage.getItem("user"), "ok");
  } catch (err) {
    setStatus("Filme konnten nicht geladen werden (" + err.message + "). Netzwerk prüfen.", "error");
  }
}

// ---------- Teil C: DOM ----------
function renderCard(movie) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.id = movie.id;

  const img = document.createElement("img");
  img.src = movie.thumbnail;
  img.alt = movie.title;

  const title = document.createElement("div");
  title.className = "title";
  title.textContent = movie.title;

  const rating = document.createElement("div");
  rating.className = "rating";
  rating.textContent = "★ " + movie.rating;

  card.append(img, title, rating);
  if (String(movie.id) === selectedId) card.classList.add("selected");
  return card;
}

function updateButtons() {
  $("addBtn").disabled = supply.length === 0;
}

function addThree() {
  supply.splice(0, 3).forEach((m) => cardsEl.append(renderCard(m)));
  updateButtons();
  applyFilter();
}

function removeFirstThree() {
  [...cardsEl.children].slice(0, 3).forEach((c) => c.remove());
}

function showDetails(movie) {
  selectedId = String(movie.id);
  cardsEl.querySelectorAll(".card").forEach((c) =>
    c.classList.toggle("selected", c.dataset.id === selectedId));

  detailsEl.innerHTML = "";
  const h = document.createElement("h2");
  h.textContent = "Details: " + movie.title;
  const cat = document.createElement("p");
  cat.textContent = "Kategorie: " + movie.category;
  const desc = document.createElement("p");
  desc.textContent = movie.description;
  const btn = document.createElement("button");
  btn.textContent = "Zur Merkliste";
  btn.addEventListener("click", () => addToWatchlist(movie));
  detailsEl.append(h, cat, desc, btn);
}

function addToWatchlist(movie) {
  if ([...listEl.children].some((li) => li.dataset.id === String(movie.id))) {
    setStatus(`«${movie.title}» ist schon in der Merkliste.`, "error");
    return;
  }
  const li = document.createElement("li");
  li.dataset.id = movie.id;
  li.append(movie.title);
  const x = document.createElement("button");
  x.textContent = "✕";
  x.addEventListener("click", () => { li.remove(); saveWatchlist(); });
  li.append(x);
  listEl.append(li);
  saveWatchlist();
  setStatus(`«${movie.title}» hinzugefügt.`, "ok");
}

function shuffleCards() {
  const cards = [...cardsEl.children];
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  cards.forEach((c) => cardsEl.append(c)); // verschiebt nur vorhandene Knoten
}

// ---------- Teil D: Filter & Persistenz ----------
function applyFilter() {
  const q = $("search").value.toLowerCase();
  [...cardsEl.children].forEach((c) => {
    c.hidden = !byId.get(c.dataset.id).title.toLowerCase().includes(q);
  });
}

function saveWatchlist() {
  const items = [...listEl.children].map((li) => byId.get(li.dataset.id));
  localStorage.setItem("watchlist", JSON.stringify(items));
}

function restoreWatchlist() {
  try {
    JSON.parse(localStorage.getItem("watchlist") || "[]").forEach((m) => {
      byId.set(String(m.id), m);
      addToWatchlist(m);
    });
  } catch { /* ignorieren */ }
}

// ---------- Events ----------
$("loginBtn").addEventListener("click", login);
$("password").addEventListener("keydown", (e) => e.key === "Enter" && login());
$("logout").addEventListener("click", logout);
$("addBtn").addEventListener("click", addThree);
$("removeBtn").addEventListener("click", removeFirstThree);
$("shuffleBtn").addEventListener("click", shuffleCards);
$("search").addEventListener("input", applyFilter);

// Event-Delegation: ein Listener für alle Karten
cardsEl.addEventListener("click", (e) => {
  if (!e.target.matches("img, .title")) return;
  const card = e.target.closest(".card");
  showDetails(byId.get(card.dataset.id));
});

// Start
const savedUser = sessionStorage.getItem("user");
if (savedUser) { showApp(savedUser); loadMovies().then(restoreWatchlist); }
