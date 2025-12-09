/* ============================================================
   SPRACHE SPEICHERN + STARTSEITE AUTOMATISCH UMSCHALTEN
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    const langSwitch = document.querySelector(".text-lang a");

    // Wenn im Menü DE oder EN geklickt wird → Sprache speichern
    if (langSwitch) {
        langSwitch.addEventListener("click", () => {
            if (langSwitch.href.includes("-en")) {
                localStorage.setItem("siteLang", "en");
            } else {
                localStorage.setItem("siteLang", "de");
            }
        });
    }

    // Sprache aus localStorage holen
    const lang = localStorage.getItem("siteLang") || "de";

    const path = location.pathname;

    // Automatische Startseitenkorrektur
    if (lang === "en" && path.endsWith("index.html")) {
        location.href = "index-en.html";
    }

    if (lang === "de" && path.endsWith("index-en.html")) {
        location.href = "index.html";
    }
});


/* ============================================================
   STARTSEILE: SLIDER / MEDIA-CAROUSEL
============================================================ */

const images = [


    { src: "images-startseite/neu/7.webp", title: "Out of sight, out of mind?", title_de: "Aus dem Auge, aus dem Sinn?", link: "html-project/01_blickwechselplakat" },

    { src: "images-startseite/neu/8.webp", title: "61 Years Uldry x 61 Posters", title_de: "61 Years Uldry x 61 Posters", link: "html-project/07_prepress" },

    { src: "images-startseite/neu/2.webp", title: "Portfolio by Delia Niederberger", title_de: "Portfolio von Delia Niederberger", link: "html-project/08_ich" },

    { src: "images-startseite/neu/5.webp", title: "Typography from technology", title_de: "Typografie aus Technik", link: "html-project/03_ilustrarionfont" },




    { src: "images-startseite/neu/6.webp", title: "Master project", title_de: "Masterprojekt", link: "html-project/02_master" },

    { src: "images-startseite/neu/3.webp", title: "Hidden sounds of London", title_de: "Versteckte Geräusche von London", link: "html-project/04_london" },

    { src: "images-startseite/neu/4.webp", title: "Swiss typography reinterpreted", title_de: "Neuinterpretation der Schweizer Typografie", link: "html-project/05_motiontype" },
    { src: "images-startseite/neu/1.webp", title: "Intensity in depth", title_de: "Intensität in der Tiefe", link: "html-project/06_bildwort" }
];

const track = document.getElementById("track");
const titleEl = document.getElementById("title");

// Hole Sprache – sehr wichtig
const currentLang = localStorage.getItem("siteLang") || "de";

if (track && titleEl) {
    const original = images.length;
    const totalLoops = 100;
    const fullList = [...Array(totalLoops)].flatMap(() => images);

    fullList.forEach(item => {
        const link = document.createElement("a");

        // Sprache korrekt anhängen
        const target = currentLang === "en" ? `${item.link}-en.html` : `${item.link}.html`;

        link.href = target;
        link.className = "media-wrapper";

        if (item.src.endsWith(".mp4")) {
            const v = document.createElement("video");
            v.src = item.src;
            v.autoplay = true;
            v.loop = true;
            v.muted = true;
            link.appendChild(v);
        } else {
            const img = document.createElement("img");
            img.src = item.src;
            link.appendChild(img);
        }

        track.appendChild(link);
    });

    let pos = 100;
    let velocity = 0;
    let imgWidth = window.innerWidth < 600 ? window.innerWidth : window.innerWidth / 3;

    window.addEventListener("resize", () => {
        imgWidth = window.innerWidth < 600 ? window.innerWidth : window.innerWidth / 3;
    });

    function animate() {
        pos += velocity;
        velocity *= 0.92;

        const max = original * totalLoops;
        pos = ((pos % max) + max) % max;

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

        // Titel je nach Sprache
        titleEl.textContent =
            currentLang === "en"
                ? images[logical].title
                : images[logical].title_de;

        // Link im Titel auch nach Sprache
        titleEl.href =
            currentLang === "en"
                ? `${images[logical].link}-en.html`
                : `${images[logical].link}.html`;
    }

    function scaleItems() {
        const media = track.children;
        const center = window.innerWidth / 2;

        for (let m of media) {
            const r = m.getBoundingClientRect();
            const mid = r.left + r.width / 2;
            const dist = Math.abs(center - mid);

            const t = Math.min(dist / center, 1);
            const scale = 1 + 0.25 * (t * t);
            m.style.transform = `scale(${scale})`;
        }
    }

    animate();

    animate();

    // DESKTOP: Wheel / Trackpad
    document.addEventListener("wheel", e => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            velocity += e.deltaX * 0.002;
        } else {
            velocity += e.deltaY * 0.002;
        }
    });

    // MOBILE: Touch / Swipe
    let touchStartX = 0;
    let touchStartY = 0;
    let isDragging = false;

    track.addEventListener("touchstart", e => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isDragging = true;
    }, { passive: true });

    track.addEventListener("touchmove", e => {
        if (!isDragging) return;

        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;

        const diffX = touchStartX - currentX;
        const diffY = touchStartY - currentY;

        // Horizontale Bewegung stärker → Slider ziehen
        if (Math.abs(diffX) > Math.abs(diffY)) {
            e.preventDefault();              // Blockiert Seiten-Scrollen
            velocity += diffX * 0.02;        // Geschwindigkeit
        }

        touchStartX = currentX;
        touchStartY = currentY;
    }, { passive: false });

    track.addEventListener("touchend", () => {
        isDragging = false;
    });

}


/* ============================================================
   MODE SWITCH (Normal, Dark, Vector)
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("toggle-dark");
    const body = document.body;

    const modes = ["normal-mode", "dark-mode", "vector-mode"];
    let saved = localStorage.getItem("siteMode") || "normal-mode";
    let index = modes.indexOf(saved);

    function apply() {
        modes.forEach(m => body.classList.remove(m));
        const now = modes[index];
        body.classList.add(now);
        toggle.textContent =
            now === "normal-mode" ? "mode" :
                now === "dark-mode" ? "dark" :
                    "f(x)=x";

        localStorage.setItem("siteMode", now);
    }

    apply();

    toggle.addEventListener("click", () => {
        index = (index + 1) % modes.length;
        apply();
    });
});


/* ============================================================
   VECTOR MODE SCANLINES
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

    lx.style.top = `${e.clientY}px`;
    ly.style.left = `${e.clientX}px`;
});


/* ============================================================
   VECTOR MODE COORDINATES
============================================================ */

document.addEventListener("mousemove", (e) => {
    const box = document.getElementById("mouse-coords");

    if (!box) return;

    if (!document.body.classList.contains("vector-mode")) {
        box.style.display = "none";
        return;
    }

    box.style.display = "block";
    box.style.left = `${e.clientX + 15}px`;
    box.style.top = `${e.clientY + 15}px`;

    box.textContent = `x: ${e.clientX}px | y: ${e.clientY}px`;
});