# Aufgabe: Filmliste

Ergänze die HTML-Seite (Vorlage: handgeschriebenes HTML-File) um Login, API-Abruf und DOM-Aktionen.
Nur reines JavaScript, kein Framework.

## Dateien
`index.html`, `script.js`, `styles.css` (Styling frei, aber `[hidden]` muss funktionieren).

## HTML (Vorgabe)
- `<div id="statuszeile"><p></p></div>` im `<header>`
- `<form id="login">` mit `#username`, `#password` und Button `#loginBtn` (type="submit")
- Nach dem Formular: `<section id="app" hidden>` mit `<ul id="films">` und Button «Add three more» (`#addBtn`)

## A Login (4 P.)
1. Beim Laden ist nur das Login-Formular sichtbar, `#app` ist versteckt.
2. Beim Absenden (`submit`-Event, `preventDefault()` nicht vergessen) werden Benutzername und Passwort geprüft. Gültig: `admin` / `m294` (Konstanten im Script).
3. Falsch: Statuszeile zeigt «Benutzername oder Passwort falsch.» in Rot, Passwortfeld wird geleert.
4. Richtig: Formular verstecken, `#app` zeigen.

## B Daten laden (4 P.)
5. Per `fetch` + `async/await` von `https://dummyjson.com/products?limit=9` laden. Dabei zeigt die Statuszeile «Lade…».
6. Die ersten **3** Produkte als `<li>` in `#films` anzeigen (Bild, Titel, Bewertung), erzeugt mit `document.createElement`.
7. Die übrigen 6 bleiben in einem Array.
8. Bei Fehler (`try/catch`): Statuszeile zeigt «Filme konnten nicht geladen werden.» in Rot.
9. Nach Erfolg zeigt die Statuszeile «Angemeldet als admin» in Grün.

## C DOM (4 P.)
10. «Add three more»: fügt 3 weitere `<li>` aus dem Array hinzu. Ist das Array leer, wird der Button deaktiviert (`disabled`).
11. Klick auf einen `<li>`: Statuszeile zeigt «Ausgewählt: <Titel>».

## Selbstkontrolle
| Aktion | Erwartung |
|---|---|
| Falsches Passwort | Rote Meldung, Feld leer |
| Richtiger Login | 3 Filme, Statuszeile grün |
| 1× Add three more | 6 Filme |
| 2× Add three more | 9 Filme, Button deaktiviert |
| Klick auf Film | «Ausgewählt: …» |
| Internet aus | Rote Fehlermeldung |

Total 12 Punkte.
