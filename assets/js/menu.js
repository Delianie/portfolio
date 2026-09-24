/* ============================================================
   MENU
   Fullscreen terminal-tree menu, shared by every page.
============================================================ */

import { fetchProjects } from "./data.js";
import { getCurrentLang } from "./language.js";
import { PROJECT_LINKS_ENABLED } from "./config.js";
import { typeScript, setScriptInstant, prefersReducedMotion, reserveWidth } from "./terminal-type.js";

const TYPE_SPEED = { minDelay: 4, maxDelay: 9 };

export async function initMenu() {

    const header = document.querySelector(".site-header");
    const menuButton = header?.querySelector(".site-header__menu");
    const menuLabel = menuButton?.querySelector(".site-header__menu-label");

    if (!header || !menuButton || !menuLabel) return;

    const main = document.querySelector("main");
    const overlay = buildOverlay();
    document.body.appendChild(overlay);

    menuButton.setAttribute("aria-controls", "site-menu");
    menuButton.setAttribute("aria-expanded", "false");

    let isOpen = false;
    let script = [];
    let abortController = null;

    function syncOverlayOffset() {
        overlay.style.top = `${header.getBoundingClientRect().bottom}px`;
    }

    function onKeydown(e) {
        if (e.key === "Escape") {
            e.preventDefault();
            closeMenu();
        }
    }

    async function playOpenAnimation() {

        abortController?.abort();

        if (prefersReducedMotion()) {
            setScriptInstant(script);
            return;
        }

        abortController = new AbortController();
        const { signal } = abortController;

        try {
            await typeScript(script, { ...TYPE_SPEED, signal });
        } catch (err) {
            if (err?.name !== "AbortError") throw err;
        }

    }

    function openMenu() {
        if (isOpen) return;
        isOpen = true;

        overlay.hidden = false;
        syncOverlayOffset();

        document.documentElement.classList.add("menu-open");
        if (main) main.inert = true;

        menuLabel.textContent = "close";
        menuButton.setAttribute("aria-expanded", "true");

        document.addEventListener("keydown", onKeydown);

        overlay.focus({ preventScroll: true });

        playOpenAnimation();
    }

    function closeMenu() {
        if (!isOpen) return;
        isOpen = false;

        abortController?.abort();

        // Abrupt, like a terminal "clear" — no fade/backspace-out.
        overlay.hidden = true;

        document.documentElement.classList.remove("menu-open");
        if (main) main.inert = false;

        menuLabel.textContent = "menu";
        menuButton.setAttribute("aria-expanded", "false");

        document.removeEventListener("keydown", onKeydown);

        menuButton.focus({ preventScroll: true });
    }

    window.addEventListener("resize", () => {
        if (isOpen) syncOverlayOffset();
    });

    menuButton.addEventListener("click", () => {
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    const built = await buildTree(closeMenu);
    script = built.script;
    overlay.appendChild(built.tree);

}

/* ============================================================
   BUILD
============================================================ */

function buildOverlay() {

    const overlay = document.createElement("div");
    overlay.id = "site-menu";
    overlay.className = "site-menu";
    overlay.hidden = true;
    overlay.tabIndex = -1;

    return overlay;

}

async function buildTree(closeMenu) {

    const tree = document.createElement("nav");
    tree.className = "site-menu__tree";
    tree.setAttribute("aria-label", "Hauptmenü");

    const rows = [];

    rows.push(createRow("┌─ ", createLink("index.html", "index//", closeMenu)));
    rows.push(createSpacerRow());

    rows.push(createRow("├─ ", createLink("about.html", "about//", closeMenu)));
    rows.push(createSpacerRow());

    rows.push(createRow("├─ ", "projects//"));
    rows.push(createRow("│  └─ ", "Internship at Several.club"));
    rows.push(...await buildProjectRows(closeMenu));
    rows.push(createSpacerRow());

    rows.push(createRow("├─ ", "settings//"));
    rows.push(createRow("│  ├─ ", "lang"));
    rows.push(createOptionRow("│  │  └─  ", "lang", ["de", "en"], getCurrentLang()));
    rows.push(createRow("│  └─ ", "Mode"));
    rows.push(createOptionRow("│     └─  ", "mode", ["light", "dark"], "light"));
    rows.push(createSpacerRow());

    rows.push(createRow("└─ ", "Contact"));
    rows.push(createRow("   ├─ ", createLink("https://www.delianiederberger.ch", "www.delianiederberger.ch", closeMenu)));
    rows.push(createRow("   ├─ ", createLink("mailto:dn@delianiederberger.ch", "dn@delianiederberger.ch", closeMenu)));
    rows.push(createRow("   └─ ", createLink("https://www.instagram.com/d.nie.graphic", "@d.nie.graphic", closeMenu, { external: true })));

    const script = rows.flatMap(row => row.segments);

    tree.append(...rows.map(row => row.el));

    return { tree, script };

}

async function buildProjectRows(closeMenu) {

    const projects = await fetchProjects();

    return projects.map((project, index) => {

        const number = String(index + 1).padStart(2, "0");
        const label = `${number}_${project.slug}`;
        const isLast = index === projects.length - 1;
        const prefix = `│     ${isLast ? "└─" : "├─"}  `;

        let content;

        if (PROJECT_LINKS_ENABLED) {
            content = createLink(`project.html?slug=${project.slug}`, label, closeMenu);
        } else {
            const span = document.createElement("span");
            span.className = "site-menu__disabled";
            span.setAttribute("aria-disabled", "true");
            span.setAttribute("aria-label", label);

            const typed = createTypedSpan();
            span.appendChild(typed);

            content = { el: span, segments: [{ node: typed, text: label }] };
        }

        return createRow(prefix, content);

    });

}

/* ============================================================
   ROW HELPERS
   Every row-building helper returns { el, segments }: `el` is the
   ready-to-insert DOM node (initially empty where it will be
   typed into), `segments` is the ordered { node, text } list that
   terminal-type.js reveals on open. The visible/typed nodes are
   aria-hidden; the full text lives in an aria-label on the
   accessible-name-bearing ancestor (link, or the row's own label)
   so screen readers get the whole word, never single characters.
============================================================ */

function createTypedSpan() {
    const span = document.createElement("span");
    span.setAttribute("aria-hidden", "true");
    return span;
}

function createTextContent(text) {

    const el = document.createElement("span");
    el.setAttribute("aria-label", text);

    const typed = createTypedSpan();
    el.appendChild(typed);

    return { el, segments: [{ node: typed, text }] };

}

function createRow(prefix, content) {

    const row = document.createElement("div");
    row.className = "tree-row";

    const prefixEl = document.createElement("span");
    prefixEl.className = "tree-prefix";
    prefixEl.setAttribute("aria-hidden", "true");

    const labelEl = document.createElement("span");
    labelEl.className = "tree-label";

    const segments = [{ node: prefixEl, text: prefix }];
    let labelSegments = [];

    if (typeof content === "string") {

        if (content !== "") {
            const built = createTextContent(content);
            labelEl.appendChild(built.el);
            labelSegments = built.segments;
        }

    } else if (content) {
        labelEl.appendChild(content.el);
        labelSegments = content.segments;
    }

    // Reserve the label's final width up front so the row never
    // grows/wraps as its text is typed in — reserved on the label
    // (the flex item), not on the growing leaf node, so the cursor
    // still ends up right after the last typed character.
    const labelChars = labelSegments.reduce((sum, s) => sum + s.text.length, 0);
    if (labelChars > 0) reserveWidth(labelEl, labelChars);

    segments.push(...labelSegments);

    row.append(prefixEl, labelEl);

    return { el: row, segments };

}

function createSpacerRow() {
    return createRow("│", "");
}

function createLink(href, text, closeMenu, { external = false } = {}) {

    const a = document.createElement("a");
    a.href = href;
    a.setAttribute("aria-label", text);

    if (external) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
    }

    if (isCurrentPage(href)) {
        a.addEventListener("click", e => {
            e.preventDefault();
            closeMenu();
        });
    }

    const typed = createTypedSpan();
    a.appendChild(typed);

    return { el: a, segments: [{ node: typed, text }] };

}

function createOptionRow(prefix, group, options, activeValue) {

    const wrapper = document.createElement("span");
    const composed = options
        .map(option => option === activeValue ? `[${option}]` : option)
        .join(" / ");
    wrapper.setAttribute("aria-label", composed);

    const segments = [];

    options.forEach((option, i) => {

        const span = document.createElement("span");
        span.className = "site-menu__option";
        span.dataset[group] = option;
        span.setAttribute("aria-hidden", "true");

        const isActive = option === activeValue;
        if (isActive) span.dataset.active = "true";

        wrapper.appendChild(span);
        segments.push({ node: span, text: isActive ? `[${option}]` : option });

        if (i < options.length - 1) {
            const separator = document.createElement("span");
            separator.setAttribute("aria-hidden", "true");
            wrapper.appendChild(separator);
            segments.push({ node: separator, text: " / " });
        }

    });

    return createRow(prefix, { el: wrapper, segments });

}

function isCurrentPage(href) {

    let target;

    try {
        target = new URL(href, window.location.href);
    } catch {
        return false;
    }

    if (target.origin !== window.location.origin) return false;

    const normalize = pathname => {
        const file = pathname.split("/").pop();
        return file === "" ? "index.html" : file;
    };

    return normalize(target.pathname) === normalize(window.location.pathname);

}
