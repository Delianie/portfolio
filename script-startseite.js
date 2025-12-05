/* ============================================================
   STARTSEITE: SLIDER / MEDIA-CAROUSEL
   (Unverändert, nur sauber formatiert)
============================================================ */

const images = [
    { src: "images-startseite/neu/1.webp", title: "Intensität in der Tiefe", link: "html-project/06_bildwort.html" },
    { src: "images-startseite/neu/7.webp", title: "Aus dem Auge, aus dem Sinn?", link: "html-project/01_blickwechselplakat.html" },
    { src: "images-startseite/neu/5.webp", title: "Typografie aus Technik", link: "html-project/03_ilustrarionfont.html" },
    { src: "images-startseite/neu/2.webp", title: "Portfolio von Delia Niederberger", link: "html-project/08_ich.html" },
    { src: "images-startseite/neu/6.webp", title: "Plakat hören", link: "html-project/02_zeitung.html" },
    { src: "images-startseite/neu/3.webp", title: "Versteckte Geräusche von London", link: "html-project/04_london.html" },
    { src: "images-startseite/neu/4.webp", title: "Neuinterpretation der Schweizer Typografie", link: "html-project/05_motiontype.html" }
];

const track = document.getElementById("track");
const titleEl = document.getElementById("title");

if (track && titleEl) {
    const original = images.length;
    const totalLoops = 80;
    const fullList = [...Array(totalLoops)].flatMap(() => images);

    fullList.forEach(item => {
        const link = document.createElement("a");
        link.href = item.link;
        link.className = "media-wrapper";
        link.target = "_self";

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

    let imgWidth = window.innerWidth < 600 ? window.innerWidth : window.innerWidth / 3;

    window.addEventListener("resize", () => {
        imgWidth = window.innerWidth < 600 ? window.innerWidth : window.innerWidth / 3;
    });

    let pos = original * 10;
    let velocity = 0;

    function wrapAround() {
        const max = original * totalLoops;
        pos = ((pos % max) + max) % max;
    }

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
        titleEl.textContent = images[logical].title;
        titleEl.href = images[logical].link;
    }

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

    document.addEventListener("wheel", e => velocity += e.deltaY * 0.002);

    document.addEventListener("touchstart", e => { this.startX = e.touches[0].clientX; });
    document.addEventListener("touchmove", e => {
        const deltaX = e.touches[0].clientX - this.startX;
        velocity += deltaX * 0.003;
        this.startX = e.touches[0].clientX;
    });

    document.addEventListener("keydown", e => {
        if (e.key === "ArrowRight") velocity += 0.5;
        if (e.key === "ArrowLeft") velocity -= 0.5;
    });
}

/* ============================================================
   GLOBAL MODE SWITCH (Normal → Dark → Vector)
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("toggle-dark");
    const body = document.body;

    if (!toggle) return;

    const modes = ["normal-mode", "dark-mode", "vector-mode"];
    let index = 0;

    function applyMode() {
        modes.forEach(m => body.classList.remove(m));
        body.classList.add(modes[index]);

        if (modes[index] === "normal-mode") toggle.textContent = "MODE";
        if (modes[index] === "dark-mode") toggle.textContent = "DARK";
        if (modes[index] === "vector-mode") toggle.textContent = "VECTOR";
    }

    applyMode();

    toggle.addEventListener("click", () => {
        index = (index + 1) % modes.length;
        applyMode();
    });
});

/* ============================================================
   SCAN-LINIEN (X/Y) FOLGEN DER MAUS — GLOBAL
============================================================ */

document.addEventListener("mousemove", e => {
    const lx = document.getElementById("line-x");
    const ly = document.getElementById("line-y");

    if (!lx || !ly) return;

    if (!document.body.classList.contains("vector-mode")) {
        lx.style.display = "none";
        ly.style.display = "none";
        return;
    }

    lx.style.display = "block";
    ly.style.display = "block";

    lx.style.top = e.clientY + "px";
    ly.style.left = e.clientX + "px";
});

/* ============================================
   KOORDINATEN ANZEIGEN NEBEN DER MAUS
============================================ */
document.addEventListener("mousemove", (e) => {
    const box = document.getElementById("mouse-coords");

    if (!box) return;

    if (!document.body.classList.contains("vector-mode")) {
        box.style.display = "none";
        return;
    }

    box.style.display = "block";
    box.style.left = (e.clientX + 15) + "px";
    box.style.top = (e.clientY + 15) + "px";

    box.textContent = `x: ${e.clientX}px  |  y: ${e.clientY}px`;
});