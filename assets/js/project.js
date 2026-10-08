/* ============================================================
   PROJECT.JS
   Projektseite. Vorerst zeigt sie immer den Platzhalter aus
   project.html. Der Slug aus der URL (project.html?slug=…) wird
   schon gelesen, aber noch nicht ausgewertet.
============================================================ */

import { initMenu } from "./menu.js";

const DEFAULT_SLUG = "platzhalter";

/* ============================================================
   RENDER
============================================================ */

function renderProject(slug) {

    // HIER SPÄTER TABELLE LESEN
    // Sobald die Daten aus der Tabelle (projects.xlsx → projects.json)
    // bereit sind: Projekt mit diesem Slug laden und den Inhalt von
    // <main id="project"> ersetzen. Bei "platzhalter" oder einem
    // unbekannten Slug einfach nichts tun, dann bleibt der Platzhalter.

    document.getElementById("project").dataset.slug = slug;

}

/* ============================================================
   INIT
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug") || DEFAULT_SLUG;

    renderProject(slug);
    initMenu();

});
