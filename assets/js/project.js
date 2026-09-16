/* ============================================================
   PROJECT.JS
============================================================ */

import { loadProjects } from "./data.js";
import { getCurrentLang } from "./language.js";

/* ============================================================
   INIT
============================================================ */

document.addEventListener("DOMContentLoaded", async () => {

    const projects = await loadProjects();

    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");

    const project = projects.find(p => p.slug === slug);

    if (!project) {
        document.body.innerHTML = "<h1>Project not found.</h1>";
        return;
    }

    const title = document.getElementById("project-title");
    const description = document.getElementById("project-description");
    const gallery = document.getElementById("project-gallery");
    const year = document.getElementById("project-year");
    const client = document.getElementById("project-client");
    const projectType = document.getElementById("project-type");
    const credits = document.getElementById("project-credits");
    const copyright = document.getElementById("project-copyright");

    function updateContent() {

        const lang = getCurrentLang();

        title.textContent = project.title[lang];
        description.textContent = project.text[lang];
        year.textContent = project.year || "";
        client.textContent = project.client || "";
        projectType.textContent = project.projectType || "";
        credits.innerHTML = (project.credits || []).join("<br>");
        copyright.textContent = project.copyright || "";

    }

    updateContent();

    gallery.innerHTML = "";

    project.gallery.forEach(file => {

        const src = `media/${project.slug}/${file}`;

        let element;

        if (file.endsWith(".mp4") || file.endsWith(".mov")) {

            element = document.createElement("video");

            element.src = src;
            element.autoplay = true;
            element.loop = true;
            element.muted = true;
            element.playsInline = true;

        } else {

            element = document.createElement("img");

            element.src = src;
            element.alt = project.title[getCurrentLang()];

        }

        element.classList.add("gallery-item");

        gallery.appendChild(element);

    });

    document.addEventListener("languageChanged", () => {
        updateContent();
    });

});