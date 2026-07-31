/* ============================================================
   STARTSEILE: SLIDER / MEDIA-CAROUSEL
============================================================ */

const images = [

    { src: "images-startseite/neu/1.2.webp", title: "Intensity in depth", title_de: "Intensität in der Tiefe", link: "html-project/06_bildwort" },

    { src: "images-startseite/neu/2.webp", title: "Portfolio by Delia Niederberger", title_de: "Portfolio von Delia Niederberger", link: "html-project/about" },

    { src: "images-startseite/neu/5.webp", title: "Typography from technology", title_de: "Typografie aus Technik", link: "html-project/03_ilustrarionfont" },

    { src: "images-startseite/neu/02.mp4", title: "Master project", title_de: "Masterprojekt", link: "html-project/02_master" },

    { src: "images-startseite/neu/9.webp", title: "Stop the Rent Explosion", title_de: "Mietexplosion stoppen!", link: "html-project/kampange" },

    { src: "images-startseite/neu/3.2.webp", title: "Hidden sounds of London", title_de: "Versteckte Geräusche von London", link: "html-project/04_london" },

    { src: "images-startseite/neu/01.mp4", title: "Swiss typography reinterpreted", title_de: "Neuinterpretation der Schweizer Typografie", link: "html-project/05_motiontype" },

    { src: "images-startseite/neu/8.2.webp", title: "61 Years Uldry x 61 Posters", title_de: "61 Years Uldry x 61 Posters", link: "html-project/07_prepress" },

    { src: "images-startseite/neu/7.2.webp", title: "Out of sight, out of mind?", title_de: "Aus dem Auge, aus dem Sinn?", link: "html-project/01_blickwechselplakat" },


];

const track = document.getElementById("track");
const titleEl = document.getElementById("title");

function isPortraitMobile() {
    return window.innerWidth <= 600 && window.innerHeight > window.innerWidth;
}

// Hole Sprache – sehr wichtig
const currentLang = localStorage.getItem("siteLang") || "de";

if (track && titleEl) {
    const original = images.length;
    const totalLoops = 100;
    const fullList = [...Array(totalLoops)].flatMap(() => images);

    fullList.forEach(item => {
        const link = document.createElement("a");

        // Sprache korrekt anhängen
        link.href = item.link + ".html";

        link.className = "media-wrapper";

        if (item.src.endsWith(".mp4")) {
            const v = document.createElement("video");

            v.src = item.src;
            v.autoplay = true;
            v.loop = true;
            v.muted = true;
            v.playsInline = true;
            v.preload = "auto";
            v.disablePictureInPicture = true;

            v.addEventListener("canplay", () => {
                v.play().catch(() => { });
            });

            v.load();

            link.appendChild(v);
        } else {
            const img = document.createElement("img");
            img.src = item.src;
            img.loading = "eager"; // Startseite → sofort laden
            link.appendChild(img);
        }

        track.appendChild(link);
    });

    let pos = 100;
    let velocity = 0;
    let itemSize = isPortraitMobile() ? 320 : (window.innerWidth < 600 ? window.innerWidth : window.innerWidth / 3);

    window.addEventListener("resize", () => {
        itemSize = isPortraitMobile() ? 320 : (window.innerWidth < 600 ? window.innerWidth : window.innerWidth / 3);
    });

    function animate() {
        pos += velocity;
        velocity *= 0.92;

        const max = original * totalLoops;
        pos = ((pos % max) + max) % max;

        if (isPortraitMobile()) {
            track.style.transform = `translateY(${-pos * itemSize}px)`;
        } else {
            track.style.transform = `translateX(${-pos * itemSize}px)`;
        }

        updateText();
        scaleItems();

        requestAnimationFrame(animate);
    }

    function updateText() {
        const media = track.children;
        const portrait = isPortraitMobile();
        const center = portrait ? window.innerHeight / 2 : window.innerWidth / 2;

        let closest = 0;
        let smallest = Infinity;

        for (let i = 0; i < media.length; i++) {
            const r = media[i].getBoundingClientRect();
            const mid = portrait
                ? r.top + r.height / 2
                : r.left + r.width / 2;
            const diff = Math.abs(center - mid);
            if (diff < smallest) {
                smallest = diff;
                closest = i;
            }
        }

        const logical = closest % original;

        if (portrait) {
            titleEl.innerHTML = "SCROLL<br>+ CLICK";
            titleEl.removeAttribute("href");
            return;
        }

        // Titel je nach Sprache
        titleEl.textContent =
            currentLang === "en"
                ? images[logical].title
                : images[logical].title_de;

        // Link im Titel auch nach Sprache
        titleEl.href = images[logical].link + ".html";
    }

    function scaleItems() {
        const media = track.children;
        const portrait = isPortraitMobile();
        const center = portrait ? window.innerHeight / 2 : window.innerWidth / 2;

        for (let m of media) {
            const r = m.getBoundingClientRect();
            const mid = portrait
                ? r.top + r.height / 2
                : r.left + r.width / 2;
            const dist = Math.abs(center - mid);

            const t = Math.min(dist / center, 1);
            const scale = 1 + 0.30 * (t * t);
            m.style.transform = `scale(${scale})`;
        }
    }

    animate();

    animate();

    // DESKTOP: Wheel / Trackpad
    document.addEventListener("wheel", e => {
        if (isPortraitMobile()) {
            velocity += e.deltaY * 0.002;
        } else {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                velocity += e.deltaX * 0.002;
            } else {
                velocity += e.deltaY * 0.002;
            }
        }
    });

    // MOBILE: Touch / Swipe
    let touchStart = 0;
    let lastTouch = 0;

    // Mobile: direktes Dragging + sanfte Trägheit
    track.addEventListener("touchstart", e => {
        const portrait = isPortraitMobile();
        touchStart = portrait ? e.touches[0].clientY : e.touches[0].clientX;
        lastTouch = touchStart;
        velocity = 0; // alte Trägheit stoppen
    }, { passive: true });

    track.addEventListener("touchmove", e => {
        const portrait = isPortraitMobile();
        const current = portrait ? e.touches[0].clientY : e.touches[0].clientX;
        const d = lastTouch - current;
        pos += d / itemSize;   // 1:1 Dragging
        lastTouch = current;
        e.preventDefault();
    }, { passive: false });

    track.addEventListener("touchend", () => {
        velocity = (touchStart - lastTouch) * 0.01; // sanfter Nachlauf
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

window.addEventListener("scroll", () => {
    const teaser = document.querySelector(".bild-breit");
    if (!teaser) return;

    teaser.style.animation = "none";
}, { once: true });
