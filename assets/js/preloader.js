/* ============================================================
   PRELOADER
============================================================ */

import { typeScript, prefersReducedMotion, createCursor, reserveWidth } from "./terminal-type.js";

window.Preloader = (() => {

    const BAR_LENGTH = 10;
    const TYPE_SPEED = { minDelay: 15, maxDelay: 40 };
    const STAGGER_MS = 200;
    const MAX_WAIT_MS = 8000;

    function buildList(projects) {

        return projects
            .filter(project => project.slider)
            .map(project => ({
                slug: project.slug,
                file: project.slider,
                src: `media/${project.slug}/${project.slider}`
            }));

    }

    function preloadImage(item) {

        return new Promise(resolve => {

            const img = new Image();

            img.onload = () => resolve(item);
            img.onerror = () => resolve(item);

            img.src = item.src;

        });

    }

    function waitUntil(time) {

        return new Promise(resolve => {
            setTimeout(resolve, Math.max(0, time - performance.now()));
        });

    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function renderBar(loaded, total) {

        const ratio = total > 0 ? Math.min(loaded / total, 1) : 1;
        const filled = Math.round(ratio * BAR_LENGTH);
        const percent = String(Math.round(ratio * 100)).padStart(3, " ");

        return `[${"#".repeat(filled)}${" ".repeat(BAR_LENGTH - filled)}] ${percent}%`;

    }

    function appendLine(container, ariaLabel) {

        const line = document.createElement("div");
        line.className = "preloader-line";
        line.setAttribute("aria-label", ariaLabel);
        // Reserve the line's final width up front so it doesn't grow
        // (and re-center, since #preloader centers its lines) as it types.
        reserveWidth(line, ariaLabel.length);

        const prefix = document.createElement("span");
        prefix.setAttribute("aria-hidden", "true");
        prefix.textContent = "> ";

        const text = document.createElement("span");
        text.setAttribute("aria-hidden", "true");

        line.append(prefix, text);
        container.appendChild(line);

        return { line, text };

    }

    async function runProgress(text, prefix, items, total) {

        if (total === 0) {
            text.textContent = prefix + renderBar(0, 0);
            return;
        }

        const cursor = createCursor();
        text.parentNode.insertBefore(cursor, text.nextSibling);

        const pending = items.map(preloadImage);
        const startTime = performance.now();
        const deadline = startTime + MAX_WAIT_MS;

        for (let i = 0; i < pending.length; i++) {

            const targetTime = startTime + STAGGER_MS * (i + 1);

            await Promise.race([
                Promise.all([pending[i], waitUntil(targetTime)]),
                waitUntil(deadline)
            ]);

            text.textContent = prefix + renderBar(i + 1, total);

            if (performance.now() >= deadline) break;

        }

        text.textContent = prefix + renderBar(total, total);

        cursor.remove();

    }

    function hide(preloader) {
        // Abrupt, like a terminal "clear" — no fade.
        preloader.remove();
    }

    async function run(projects) {

        const preloader = document.getElementById("preloader");
        if (!preloader) return;

        const container = document.getElementById("preloader-lines");
        if (!container) return;

        const items = buildList(projects);
        const total = items.length;

        const line1Text = "loading delianiederberger.ch";
        const line2Prefix = "fetching projects ";
        const line2Final = () => line2Prefix + renderBar(total, total);
        const line3Text = "ready";

        if (prefersReducedMotion()) {

            const line1 = appendLine(container, `> ${line1Text}`);
            line1.text.textContent = line1Text;

            const line2 = appendLine(container, `> ${line2Final()}`);
            line2.text.textContent = line2Final();

            const line3 = appendLine(container, `> ${line3Text}`);
            line3.text.textContent = line3Text;

            hide(preloader);
            return;

        }

        const line1 = appendLine(container, `> ${line1Text}`);
        await typeScript([{ node: line1.text, text: line1Text }], TYPE_SPEED);

        const line2 = appendLine(container, `> ${line2Final()}`);
        await typeScript([{ node: line2.text, text: line2Prefix }], TYPE_SPEED);
        await runProgress(line2.text, line2Prefix, items, total);

        const line3 = appendLine(container, `> ${line3Text}`);
        await typeScript([{ node: line3.text, text: line3Text }], TYPE_SPEED);

        await wait(250);

        hide(preloader);

    }

    return { run };

})();
