/* ========= DATEN ========= */

const images = [



    { src: "images-startseite/neu/1.webp", title: "Intensität in der Tiefe", link: "html-project/06_bildwort.html" },

    { src: "images-startseite/neu/7.webp", title: "Aus dem Auge, aus dem Sinn?", link: "html-project/01_blickwechselplakat.html" },

    { src: "images-startseite/neu/5.webp", title: "Typografie aus Technik", link: "html-project/03_ilustrarionfont.html" },


    { src: "images-startseite/neu/6.webp", title: "Musik in Plakat", link: "html-project/02_zeitung.html" },

    { src: "images-startseite/neu/2.webp", title: "Portfolio von Delia Niederberger", link: "html-project/08_ich.html" },

    { src: "images-startseite/neu/3.webp", title: "Versteckte Geräusche von London", link: "html-project/04_london.html" },

    { src: "images-startseite/neu/4.webp", title: "Neuinterpretation der Schweizer Typografie", link: "html-project/05_motiontype.html" },


];

/* ========= ELEMENTE ========= */

const track = document.getElementById("track");
const titleEl = document.getElementById("title");
const subtitleEl = document.getElementById("subtitle");

const original = images.length;
const totalLoops = 80;
const fullList = [...Array(totalLoops)].flatMap(() => images);

/* ========= MEDIEN ERZEUGEN ========= */

fullList.forEach(item => {
    const link = document.createElement("a");
    link.href = item.link;       // Projektseite
    link.className = "media-wrapper";
    link.target = "_self";       // Falls du im selben Tab öffnen willst

    if (item.src.endsWith(".mp4")) {
        const v = document.createElement("video");
        v.src = item.src;
        v.autoplay = true;
        v.loop = true;
        v.muted = true;
        v.playsInline = true;
        link.appendChild(v);
    } else {
        const img = document.createElement("img");
        img.src = item.src;
        link.appendChild(img);
    }

    track.appendChild(link);
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

    // pos immer im Loop halten (Mathe-Lösung)
    pos = ((pos % max) + max) % max;
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


/* ========= PFEILTASTEN (EINFACH) ========= */

document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") {
        moveBy(-1);   // ein Projekt nach links
    }

    if (e.key === "ArrowRight") {
        moveBy(1);    // ein Projekt nach rechts
    }
});

function moveBy(direction) {
    // Ziel: nächste "Position" (nächstes Projekt)
    const target = Math.round(pos + direction);

    // sanft dahin rutschen
    velocity += (target - pos) * 0.35;
    // wenn es zu schnell/langsam ist: 0.35 kleiner/grösser machen
}


/* ========= DARK MODE TOGGLE ========= */

document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("toggle-dark");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });
});