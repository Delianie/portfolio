/* ========= script.js ========= */

// Bilderliste MIT korrekten Projekt-Links
const images = [
    { src: "images-startseite/bild1.jpg", title: "Typografie aus Technik", subtitle: "FONTDESIGN | ILLUSTRATION | TYPOGRAFIE", link: "html-project/03_ilustrarionfont.html" },
    { src: "images-startseite/bild2.jpg", title: "Intensität in der Tiefe", subtitle: "CORPORATE DESIGN | ILLUSTRATION", link: "html-project/06_bildwort.html" },
    { src: "images-startseite/2.mp4", title: "Aus dem Auge, aus dem Sinn?", subtitle: "POSTERDESIGN", link: "html-project/01_blickwechselplakat.html" },
    { src: "images-startseite/bild4.webp", title: "Kreislauf von Gegenständen", subtitle: "ZEITUNG | FOTOGRAFIE", link: "html-project/02_zeitung.html" },
    { src: "images-startseite/bild5.jpg", title: "Delia Niederberger", subtitle: "SPORT | DESIGN | FAMILIE", link: "html-project/08_ich.html" },
    { src: "images-startseite/bild6.jpg", title: "Versteckte Geräusche von London", subtitle: "EDITORIAL DESIGN", link: "html-project/04_london.html" },
    { src: "images-startseite/bild7.webp", title: "Neuinterpretation der Schweizer Typografie", subtitle: "MOTION DESIGN | TYPOGRAFIE", link: "html-project/05_motiontype.html" },
    { src: "images-startseite/bild8.jpg", title: "Siebdruck – Farben übereinander", subtitle: "PREPRESS | COLOR MANAGEMENT | POSTERDESIGN", link: "html-project/07_preepress.html" }
];

const track = document.getElementById("track");
const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");

const original = images.length;
const totalLoops = 40;
const fullList = [];

// Liste vervielfachen für Endlosslider
for (let i = 0; i < totalLoops; i++) fullList.push(...images);

/* ========= MEDIEN (BILDER + VIDEOS) ERZEUGEN ========= */

// Schritt 1: Alles als <img> erzeugen (Slider braucht das)
fullList.forEach(d => {
    const el = document.createElement("img");
    el.src = d.src;
    el.dataset.src = d.src; // merken für Videocheck
    track.appendChild(el);
});

// Schritt 2: Nachträglich <img> mit MP4 durch <video> ersetzen
Array.from(track.children).forEach(child => {
    const src = child.dataset.src;

    if (src && src.endsWith(".mp4")) {
        const video = document.createElement("video");

        video.src = src;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;

        // gleiche Dimensionen wie Bilder (damit Animation funktioniert)
        video.className = child.className;
        video.style.width = "100%";
        video.style.height = "100%";
        video.style.objectFit = "cover";

        child.replaceWith(video);
    }
});


/* ========= SLIDER LOGIK ========= */

let imgWidth = window.innerWidth < 600 ? window.innerWidth : window.innerWidth / 3;

window.addEventListener("resize", () => {
    imgWidth = window.innerWidth < 600 ? window.innerWidth : window.innerWidth / 3;
});

let pos = original * 10;
let velocity = 0;

function wrap() {
    const max = original * totalLoops;
    if (pos > max - original * 4) pos -= max / 2;
    if (pos < original * 4) pos += max / 2;
}

// Hover-Underline
title.addEventListener("mouseenter", () => {
    title.style.textDecoration = "underline";
    title.style.textDecorationThickness = "1px";
});

title.addEventListener("mouseleave", () => {
    title.style.textDecoration = "none";
});


/* ========= TEXT UPDATE ========= */
function updateText() {
    const index = Math.floor(pos) % original;
    const d = images[(index + original) % original];
    title.textContent = d.title;
    subtitle.textContent = d.subtitle;
    title.href = d.link;
}


/* ========= ZOOM-EFFEKT ========= */
function updateScale() {
    const mediaElements = track.children;
    const screenCenter = window.innerWidth / 2;

    for (let media of mediaElements) {
        const r = media.getBoundingClientRect();
        const center = r.left + r.width / 2;
        const dist = Math.abs(screenCenter - center);
        const maxDist = screenCenter;

        const minScale = 1.0;
        const maxScale = 1.18;
        const t = Math.min(dist / maxDist, 1);
        const scale = minScale + (maxScale - minScale) * (t * t);

        media.style.transform = `scale(${scale})`;
    }
}


/* ========= ANIMATION LOOP ========= */
function animate() {
    pos += velocity;
    velocity *= 0.9;
    if (Math.abs(velocity) < 0.0001) velocity = 0;

    wrap();

    track.style.transform = `translateX(${-pos * imgWidth}px)`;

    updateText();
    updateScale();

    requestAnimationFrame(animate);
}
animate();


/* ========= MAUSWHEEL ========= */
document.addEventListener("wheel", e => {
    e.preventDefault();
    const factor = window.innerWidth < 600 ? 1400 : 350;
    const delta = e.deltaY / factor;
    pos += delta;
    velocity = delta * 0.3;
}, { passive: false });


/* ========= TOUCH ========= */
let touchY = null;
let lastDelta = 0;

document.addEventListener("touchstart", e => {
    touchY = e.touches[0].clientY;
    velocity = 0;
}, { passive: false });

document.addEventListener("touchmove", e => {
    const y = e.touches[0].clientY;
    const dy = touchY - y;
    touchY = y;

    const factor = window.innerWidth < 600 ? 1400 : 350;
    const delta = dy / factor;

    pos += delta;
    lastDelta = delta;

    e.preventDefault();
}, { passive: false });

document.addEventListener("touchend", () => {
    velocity = lastDelta * 0.4;
    lastDelta = 0;
    touchY = null;
}, { passive: false });


/* ========= KEYBOARD ========= */

const KEY_LEFT = 37;
const KEY_RIGHT = 39;
let keyPower = 1.5;

document.addEventListener("keydown", (e) => {
    if (e.keyCode === KEY_LEFT) velocity -= keyPower;
    if (e.keyCode === KEY_RIGHT) velocity += keyPower;
});