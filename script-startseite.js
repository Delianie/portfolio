/* ============================================================
   1. SPRACHE SPEICHERN + STARTSEITE AUTOMATISCH UMSCHALTEN
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    const langSwitch = document.querySelector(".text-lang a");

    if (langSwitch) {
        langSwitch.addEventListener("click", () => {
            if (langSwitch.href.includes("-en")) {
                localStorage.setItem("siteLang", "en");
            } else {
                localStorage.setItem("siteLang", "de");
            }
        });
    }

    const lang = localStorage.getItem("siteLang") || "de";
    const path = location.pathname;

    if (lang === "en" && path.endsWith("index.html")) {
        location.href = "index-en.html";
    }
    if (lang === "de" && path.endsWith("index-en.html")) {
        location.href = "index.html";
    }
});

/* ============================================================
   2. STARTSEITE: SLIDER / MEDIA-CAROUSEL
============================================================ */
const images = [
    { src: "images-startseite/neu/7.webp", title: "Out of sight, out of mind?", title_de: "Aus dem Auge, aus dem Sinn?", link: "projects/blickwechsel" },
    { src: "images-startseite/neu/8.webp", title: "61 Years Uldry x 61 Posters", title_de: "61 Years Uldry x 61 Posters", link: "projects/prepress" },
    { src: "images-startseite/neu/2.webp", title: "Portfolio by Delia Niederberger", title_de: "Portfolio von Delia Niederberger", link: "projects/about" },
    { src: "images-startseite/neu/5.webp", title: "Typography from technology", title_de: "Typografie aus Technik", link: "projects/typography" },
    { src: "images-startseite/neu/6.webp", title: "Master project", title_de: "Masterprojekt", link: "projects/master" },
    { src: "images-startseite/neu/3.webp", title: "Hidden sounds of London", title_de: "Versteckte Geräusche von London", link: "projects/london" },
    { src: "images-startseite/neu/4.webp", title: "Swiss typography reinterpreted", title_de: "Neuinterpretation der Schweizer Typografie", link: "projects/motion" },
    { src: "images-startseite/neu/1.webp", title: "Intensity in depth", title_de: "Intensität in der Tiefe", link: "projects/bildwort" }
];

const track = document.getElementById("track");
const titleEl = document.getElementById("title");
const currentLang = localStorage.getItem("siteLang") || "de";

if (track && titleEl) {
    const original = images.length;
    const totalLoops = 50; 
    const fullList = [...Array(totalLoops)].flatMap(() => images);

    fullList.forEach(item => {
        const link = document.createElement("a");
        const target = currentLang === "en" ? `${item.link}-en.html` : `${item.link}.html`;
        link.href = target;
        link.className = "media-wrapper";

        if (item.src.endsWith(".mp4")) {
            const v = document.createElement("video");
            v.src = item.src; v.autoplay = true; v.loop = true; v.muted = true; v.playsinline = true;
            link.appendChild(v);
        } else {
            const img = document.createElement("img");
            img.src = item.src;
            link.appendChild(img);
        }
        track.appendChild(link);
    });

    // Start-Position in der Mitte der Klone für unendliches Gefühl
    let pos = (totalLoops / 2) * original; 
    let velocity = 0;
    let imgWidth = window.innerWidth < 600 ? window.innerWidth : window.innerWidth / 3;

    window.addEventListener("resize", () => {
        imgWidth = window.innerWidth < 600 ? window.innerWidth : window.innerWidth / 3;
    });

    function animate() {
        pos += velocity;
        velocity *= 0.94; // Reibung für das Karussell-Gefühl

        const maxElements = original * totalLoops;
        // Unendlicher Loop Reset
        if (pos < 0) pos += maxElements;
        if (pos >= maxElements) pos -= maxElements;

        track.style.transform = `translateX(${-pos * imgWidth}px)`;

        updateText();
        scaleItems();
        requestAnimationFrame(animate);
    }

    function updateText() {
        const media = track.children;
        const center = window.innerWidth / 2;
        let closest = 0;
        let smallest = Infinity;

        for (let i = 0; i < media.length; i++) {
            const r = media[i].getBoundingClientRect();
            const mid = r.left + r.width / 2;
            const diff = Math.abs(center - mid);
            if (diff < smallest) {
                smallest = diff;
                closest = i;
            }
        }

        const logical = closest % original;
        titleEl.textContent = currentLang === "en" ? images[logical].title : images[logical].title_de;
        titleEl.href = currentLang === "en" ? `${images[logical].link}-en.html` : `${images[logical].link}.html`;
    }

    function scaleItems() {
        const media = track.children;
        const center = window.innerWidth / 2;

        for (let m of media) {
            const r = m.getBoundingClientRect();
            const mid = r.left + r.width / 2;
            const dist = Math.abs(center - mid);

            // DEIN WUNSCH: Mitte 100%, Rand GRÖSSER
            const t = Math.min(dist / center, 1.2); 
            const scale = 1 + 0.35 * (t * t); // Mitte ist 1, Rand wächst auf 1.35
            m.style.transform = `scale(${scale})`;
        }
    }

// TOUCH (Mobile Optimiert)
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    track.addEventListener("touchstart", e => {
        isDragging = true;
        // Speichere Startposition für X und Y
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
        velocity = 0; // Stoppt den Slider sofort bei Berührung
    }, { passive: true });

    track.addEventListener("touchmove", e => {
        if (!isDragging) return;

        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;

        // Berechne die Differenz für beide Achsen
        const diffX = lastX - currentX;
        const diffY = lastY - currentY;

        // Kombiniere X und Y Bewegung (so kann man diagonal/vertikal den Slider schieben)
        // Wir teilen durch imgWidth, damit die Bewegung 1:1 mit dem Finger geht
        const moveDelta = (diffX + diffY) / imgWidth;
        
        pos += moveDelta;
        velocity = moveDelta; // Gibt dem Slider den "Schwung" beim Loslassen

        lastX = currentX;
        lastY = currentY;
    }, { passive: true });

    track.addEventListener("touchend", () => {
        isDragging = false;
        // Optional: Den Schwung beim Loslassen leicht verstärken für mehr "Gleiten"
        velocity *= 1.5; 
    });

/* ============================================================
   3. MODE SWITCH & VECTOR MODE (SCANLINES, CIRCLE, COORDS)
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("toggle-dark");
    const modes = ["normal-mode", "dark-mode", "vector-mode"];
    let saved = localStorage.getItem("siteMode") || "normal-mode";
    let index = modes.indexOf(saved);

    function apply() {
        document.body.classList.remove(...modes);
        const now = modes[index];
        document.body.classList.add(now);
        if (toggle) toggle.textContent = now === "normal-mode" ? "mode" : now === "dark-mode" ? "dark" : "f(x)=x";
        localStorage.setItem("siteMode", now);
    }
    apply();
    if (toggle) toggle.addEventListener("click", () => { index = (index + 1) % modes.length; apply(); });
});

document.addEventListener("mousemove", e => {
    const lx = document.getElementById("line-x");
    const ly = document.getElementById("line-y");
    const circle = document.getElementById("mouse-circle");
    const box = document.getElementById("mouse-coords");

    if (!document.body.classList.contains("vector-mode")) {
        [lx, ly, circle, box].forEach(el => { if(el) el.style.display = "none"; });
        return;
    }

    if (lx && ly) {
        lx.style.display = "block"; ly.style.display = "block";
        lx.style.top = `${e.clientY}px`; ly.style.left = `${e.clientX}px`;
    }
    if (circle) {
        circle.style.display = "block";
        circle.style.top = `${e.clientY}px`; circle.style.left = `${e.clientX}px`;
    }
    if (box) {
        box.style.display = "block";
        box.style.left = `${e.clientX + 30}px`; box.style.top = `${e.clientY + 30}px`;
        box.textContent = `x: ${e.clientX}px | y: ${e.clientY}px`;
    }
});