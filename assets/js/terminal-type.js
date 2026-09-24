/* ============================================================
   TERMINAL-TYPE
   Reusable character-by-character "typing" effect, shared by
   the preloader and the fullscreen menu.

   A "script" is an ordered list of { node, text } entries.
   `node` is an existing DOM element whose content gets revealed
   one character at a time; `text` is its final value. A single
   blinking block cursor (█) is moved along the script as it
   plays, jumping from node to node / line to line.
============================================================ */

const DEFAULT_MIN_DELAY = 15;
const DEFAULT_MAX_DELAY = 40;

export function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function randomDelay(min, max) {
    return min + Math.random() * (max - min);
}

function wait(ms, signal) {

    return new Promise((resolve, reject) => {

        if (signal?.aborted) {
            reject(new DOMException("Aborted", "AbortError"));
            return;
        }

        const id = setTimeout(resolve, ms);

        signal?.addEventListener("abort", () => {
            clearTimeout(id);
            reject(new DOMException("Aborted", "AbortError"));
        }, { once: true });

    });

}

function throwIfAborted(signal) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
}

/**
 * A standalone blinking block cursor, for callers that need to
 * hold it in place manually (e.g. while a progress bar fills in
 * outside of typeScript's own loop).
 */
export function createCursor() {

    const cursor = document.createElement("span");
    cursor.className = "terminal-cursor blink-cursor";
    cursor.textContent = "█";
    cursor.setAttribute("aria-hidden", "true");

    return cursor;

}

/**
 * Reserves an element's final rendered width up front, in `ch`
 * (exact in a monospace font), so the row/line it belongs to
 * doesn't grow or reflow as text is typed into it. Apply this to
 * the row/line container that WRAPS the growing text — not to the
 * growing text node itself, or the cursor would sit at the edge of
 * the reserved box instead of right after the last typed character.
 */
export function reserveWidth(el, chars) {
    el.style.minWidth = `${chars}ch`;
}

/* ============================================================
   PLAY / SKIP
============================================================ */

/**
 * Types the given script character by character, moving a shared
 * blinking cursor along as it goes. Returns a Promise that resolves
 * once every entry has been typed, or rejects with an AbortError if
 * `signal` is aborted mid-way (the caller decides what to do then).
 */
export async function typeScript(script, { minDelay = DEFAULT_MIN_DELAY, maxDelay = DEFAULT_MAX_DELAY, signal } = {}) {

    const cursor = createCursor();

    try {

        for (const { node, text } of script) {

            node.style.whiteSpace = "pre";
            node.textContent = "";
            node.parentNode.insertBefore(cursor, node.nextSibling);

            for (let i = 1; i <= text.length; i++) {

                throwIfAborted(signal);
                node.textContent = text.slice(0, i);

                await wait(randomDelay(minDelay, maxDelay), signal);

            }

        }

    } finally {
        cursor.remove();
    }

}

/**
 * Fills every entry with its final text instantly, no animation.
 * Used for prefers-reduced-motion.
 */
export function setScriptInstant(script) {
    for (const { node, text } of script) {
        node.style.whiteSpace = "pre";
        node.textContent = text;
    }
}
