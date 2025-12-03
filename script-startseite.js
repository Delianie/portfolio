/* ========= script.js ========= */

// Bilderliste MIT korrekten Projekt-Links
const images = [
    { src: "images-startseite/bild1.jpg", title: "Typografie aus Technik", subtitle: "FONTDESIGN | ILLUSTRATION | TYPOGRAFIE", link: "html-project/03_ilustrarionfont.html" },
    { src: "images-startseite/bild2.jpg", title: "Intensität in der Tiefe", subtitle: "CORPORATE DESIGN | ILLUSTRATION", link: "html-project/06_bildwort.html" },
    { src: "images-startseite/bild3.jpg", title: "Aus dem Auge, aus dem Sinn?", subtitle: "POSTERDESIGN", link: "html-project/01_blickwechselplakat.html" },
    { src: "images-startseite/bild4.jpg", title: "Kreislauf von Gegenständen", subtitle: "ZEITUNG | FOTOGRAFIE", link: "html-project/02_zeitung.html" },
    { src: "images-startseite/bild5.jpg", title: "Delia Niederberger", subtitle: "SPORT | DESIGN | FAMILIE", link: "html-project/08_ich.html" },
    { src: "images-startseite/bild6.jpg", title: "Versteckte Geräusche von London", subtitle: "EDITORIAL DESIGN", link: "html-project/04_london.html" },
    { src: "images-startseite/bild7.jpg", title: "Neuinterpretation der Schweizer Typografie", subtitle: "MOTION DESIGN | TYPOGRAFIE", link: "html-project/05_motiontype.html" },
    { src: "images-startseite/bild8.jpg", title: "Siebdruck – Farben übereinander", subtitle: "PREPRESS | COLOR MANAGEMENT | POSTERDESIGN", link: "html-project/07_preepress.html" }
];

const track = document.getElementById("track");
const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");

const original = images.length;
const totalLoops = 40;
const fullList = [];

for (let i = 0; i < totalLoops; i++) fullList.push(...images);

// Bilder erzeugen
fullList.forEach(d => {
    const img = document.createElement("img");
    img.src = d.src;
    track.appendChild(img);
});

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

function updateText() {
    const index = Math.floor(pos) % original;
    const d = images[(index + original) % original];
    title.textContent = d.subtitle ? `${d.title}` : d.title;
    subtitle.textContent = d.subtitle;
    title.href = d.link;
}

// Rundungszoom
function updateScale() {
    const imgs = track.children;
    const screenCenter = window.innerWidth / 2;

    for (let img of imgs) {
        const r = img.getBoundingClientRect();
        const center = r.left + r.width / 2;
        const dist = Math.abs(screenCenter - center);
        const maxDist = screenCenter;

        const minScale = 1.0;
        const maxScale = 1.18;
        const t = Math.min(dist / maxDist, 1);
        const scale = minScale + (maxScale - minScale) * (t * t);

        img.style.transform = `scale(${scale})`;
    }
}

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

// Scroll
document.addEventListener("wheel", e => {
    e.preventDefault();
    const factor = window.innerWidth < 600 ? 1400 : 350;
    const delta = e.deltaY / factor;
    pos += delta;
    velocity = delta * 0.3;
}, { passive: false });

// Touch Navigation
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