/* ========= DATEN ========= */

const images = [
    { src: "images-startseite/1.webp", title: "Typografie aus Technik", subtitle: "FONTDESIGN | ILLUSTRATION | TYPOGRAFIE", link: "html-project/03_ilustrarionfont.html" },

    { src: "images-startseite/2.webp", title: "Intensität in der Tiefe", subtitle: "CORPORATE DESIGN | ILLUSTRATION", link: "html-project/06_bildwort.html" },

    { src: "images-startseite/2.mp4", title: "Aus dem Auge, aus dem Sinn?", subtitle: "POSTERDESIGN", link: "html-project/01_blickwechselplakat.html" },

    { src: "images-startseite/bild4.webp", title: "Kreislauf von Gegenständen", subtitle: "ZEITUNG | FOTOGRAFIE", link: "html-project/02_zeitung.html" },

    { src: "images-startseite/5.webp", title: "Delia Niederberger", subtitle: "SPORT | DESIGN | FAMILIE", link: "html-project/08_ich.html" },

    { src: "images-startseite/bild6.webp", title: "Versteckte Geräusche von London", subtitle: "EDITORIAL DESIGN", link: "html-project/04_london.html" },

    { src: "images-startseite/5.mp4", title: "Neuinterpretation der Schweizer Typografie", subtitle: "MOTION DESIGN | TYPOGRAFIE", link: "html-project/05_motiontype.html" },

    { src: "images-startseite/7.webp", title: "Siebdruck – Farben übereinander", subtitle: "PREPRESS | COLOR MANAGEMENT | POSTERDESIGN", link: "html-project/07_preepress.html" }
];

/* ========= ELEMENTE ========= */

const track = document.getElementById("track");
const titleEl = document.getElementById("title");
const subtitleEl = document.getElementById("subtitle");

const original = images.length;
const totalLoops = 40;
const fullList = [...Array(totalLoops)].flatMap(() => images);

/* ========= MEDIEN ERZEUGEN ========= */

fullList.forEach(item => {
    const wrap = document.createElement("div");
    wrap.className = "media-wrapper";

    if (item.src.endsWith(".mp4")) {
        const v = document.createElement("video");
        v.src = item.src;
        v.autoplay = true;
        v.loop = true;
        v.muted = true;
        v.playsInline = true;
        wrap.appendChild(v);
    } else {
        const img = document.createElement("img");
        img.src = item.src;
        wrap.appendChild(img);
    }

    track.appendChild(wrap);
});

/* ========= SLIDER LOGIK ========= */

let imgWidth = window.innerWidth < 600 ? window.innerWidth : window.innerWidth / 3;

window.addEventListener("resize", () => {
    imgWidth = window.innerWidth < 600 ? window.innerWidth : window.innerWidth / 3;
});

let pos = original * 10;
let velocity = 0;

/* ========= LOOP NACHLADEN ========= */

function wrapAround() {
    const max = original * totalLoops;
    if (pos > max - original * 4) pos -= max / 2;
    if (pos < original * 4) pos += max / 2;
}

/* ========= TEXT SYNCHRONISIEREN ========= */

function updateText() {
    const media = track.children;
    const center = window.innerWidth / 2;

    let closest = 0;
    let distMin = Infinity;

    for (let i = 0; i < media.length; i++) {
        const r = media[i].getBoundingClientRect();
        const m = r.left + r.width / 2;
        const d = Math.abs(center - m);

        if (d < distMin) {
            distMin = d;
            closest = i;
        }
    }

    const logical = ((closest % original) + original) % original;

    const d = images[logical];
    titleEl.textContent = d.title;
    subtitleEl.textContent = d.subtitle;
    titleEl.href = d.link;
}

/* ========= ZOOM ========= */

function updateScale() {
    const media = track.children;
    const center = window.innerWidth / 2;

    for (let m of media) {
        const r = m.getBoundingClientRect();
        const mid = r.left + r.width / 2;
        const dist = Math.abs(center - mid);
        const maxDist = center;

        const t = Math.min(dist / maxDist, 1);
        const scale = 1 + (0.18 * (t * t));

        m.style.transform = `scale(${scale})`;
    }
}

/* ========= ANIMATION ========= */

function animate() {
    pos += velocity;
    velocity *= 0.9;

    wrapAround();

    track.style.transform = `translateX(${-pos * imgWidth}px)`;

    updateText();
    updateScale();

    requestAnimationFrame(animate);
}
animate();

/* ========= INPUTS ========= */

document.addEventListener("wheel", e => {
    e.preventDefault();
    const factor = window.innerWidth < 600 ? 1400 : 350;
    const delta = e.deltaY / factor;
    pos += delta;
    velocity = delta * 0.3;
}, { passive: false });

document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") velocity -= 1.5;
    if (e.key === "ArrowRight") velocity += 1.5;
});

/* ========= TOUCH (MOBILE) ========= */

let touchStartY = null;
let touchCurrentY = null;
let lastDelta = 0;

document.addEventListener("touchstart", e => {
    touchStartY = e.touches[0].clientY;
    touchCurrentY = touchStartY;
    velocity = 0;
}, { passive: false });

document.addEventListener("touchmove", e => {
    const y = e.touches[0].clientY;

    if (window.innerWidth < 600) {
        touchCurrentY = y;
        e.preventDefault();
        return;
    }

    const dy = touchStartY - y;
    touchStartY = y;

    const factor = window.innerWidth < 600 ? 1400 : 350;
    const delta = dy / factor;
    pos += delta;
    lastDelta = delta;

    e.preventDefault();
}, { passive: false });

document.addEventListener("touchend", () => {
    if (window.innerWidth < 600) {
        const dy = touchStartY - touchCurrentY;
        const direction = dy > 0 ? 1 : -1;
        const target = Math.round(pos + direction);
        velocity = (target - pos) * 0.35;
    } else {
        velocity = lastDelta * 0.4;
    }

    lastDelta = 0;
    touchStartY = null;
    touchCurrentY = null;
}, { passive: false });