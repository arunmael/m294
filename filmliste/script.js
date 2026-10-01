const USER = "admin";
const PASS = "m294";
const API_URL = "https://dummyjson.com/products?limit=9";

const statusBox = document.getElementById("statuszeile");
const statusText = statusBox.querySelector("p");
const form = document.getElementById("login");
const app = document.getElementById("app");
const filmsEl = document.getElementById("films");
const addBtn = document.getElementById("addBtn");

let rest = []; // Filme, die noch nicht angezeigt werden

function setStatus(text, type = "") {
  statusText.textContent = text;
  statusBox.className = type;
}

function renderFilm(film) {
  const li = document.createElement("li");
  const img = document.createElement("img");
  img.src = film.thumbnail;
  img.alt = film.title;
  const span = document.createElement("span");
  span.textContent = film.title + " (★ " + film.rating + ")";
  li.append(img, span);
  li.addEventListener("click", () => setStatus("Ausgewählt: " + film.title));
  return li;
}

function addThree() {
  rest.splice(0, 3).forEach((film) => filmsEl.append(renderFilm(film)));
  addBtn.disabled = rest.length === 0;
}

async function loadFilms() {
  setStatus("Lade…");
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("HTTP " + res.status);
    rest = (await res.json()).products;
    addThree();
    setStatus("Angemeldet als " + USER, "ok");
  } catch (err) {
    setStatus("Filme konnten nicht geladen werden.", "error");
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value;
  if (user === USER && pass === PASS) {
    form.hidden = true;
    app.hidden = false;
    loadFilms();
  } else {
    setStatus("Benutzername oder Passwort falsch.", "error");
    document.getElementById("password").value = "";
  }
});

addBtn.addEventListener("click", addThree);
