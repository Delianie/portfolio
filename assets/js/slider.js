import { loadProjects } from "./data.js";
import { getCurrentLang } from "./language.js";

const PROJECT_LINKS_ENABLED = false;

export async function initSlider() {
    const projects = await loadProjects();
    const track = document.getElementById("track");
    if (!track) return;

    renderSlides(projects, track);
    slider.init(track);

    document.addEventListener("languageChanged", () => {
        renderSlides(projects, track);
        slider.updateLayout();
    });
}

function renderSlides(projects, track) {
    track.innerHTML = "";

    const lang = getCurrentLang();
    const copies = 3;

    for (let c = 0; c < copies; c++) {

        projects.forEach(project => {

            const slide = document.createElement("a");
            slide.className = "media-wrapper";
            if (PROJECT_LINKS_ENABLED) {
                slide.href = `project.html?slug=${project.slug}`;
            } else {
                slide.href = "#";
                slide.addEventListener("click", e => e.preventDefault());
            }

            const image = document.createElement("img");
            image.src = `media/${project.slug}/${project.slider}`;
            image.alt = project.title[lang];

            slide.appendChild(image);

            track.appendChild(slide);

        });

    }
}

/* ============================================================
   SLIDER
============================================================ */

const slider = {

    track: null,

    position: 0,
    velocity: 0,

    direction: "horizontal",

    setSize: 0,
    initialized: false,

    init(track) {

        this.track = track;

        this.updateLayout();

        window.addEventListener("resize", () => {
            this.updateLayout();
        });

        this.addWheel();
        this.addDrag();
        this.addKeys();

        this.animate();

    },

    updateLayout() {

        const width = window.innerWidth;
        const height = window.innerHeight;
        const isPortraitMobile = width <= 600 && height > width;

        this.direction = isPortraitMobile ? "vertical" : "horizontal";

        this.track.classList.remove("horizontal", "vertical");
        this.track.classList.add(this.direction);

        this.track.style.flexDirection =
            this.direction === "vertical" ? "column" : "row";

        if (this.direction === "vertical") {

            const slotHeight = height / 4;

            document.documentElement.style.setProperty(
                "--slot-height",
                `${slotHeight}px`
            );

        } else {

            let divisor;

            if (width > 1100) {
                divisor = 4;
            } else if (width > 600) {
                divisor = 3;
            } else {
                divisor = 1;
            }

            const slotWidth = width / divisor;

            document.documentElement.style.setProperty(
                "--slot-width",
                `${slotWidth}px`
            );

        }

        requestAnimationFrame(() => this.recalcSetSize());

    },

    recalcSetSize() {

        const children = Array.from(this.track.children);
        const perSet = children.length / 3;

        let size = 0;

        for (let i = 0; i < perSet; i++) {
            size +=
                this.direction === "horizontal"
                    ? children[i].offsetWidth
                    : children[i].offsetHeight;
        }

        this.setSize = size;

        if (!this.initialized && size > 0) {
            this.position = size;
            this.initialized = true;
        }

    },

    animate() {

        this.position += this.velocity;
        this.velocity *= 0.9;

        if (this.setSize > 0) {

            if (this.position < this.setSize) {
                this.position += this.setSize;
            }

            if (this.position >= this.setSize * 2) {
                this.position -= this.setSize;
            }

        }

        if (this.direction === "horizontal") {
            this.track.style.transform =
                `translate3d(${-this.position}px,0,0)`;
        } else {
            this.track.style.transform =
                `translate3d(0,${-this.position}px,0)`;
        }

        requestAnimationFrame(() => this.animate());

    },

    addWheel() {

        document.addEventListener("wheel", e => {

            const delta =
                this.direction === "horizontal"
                    ? (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY)
                    : e.deltaY;

            this.velocity += delta * 0.6;

        }, { passive: true });

    },

    addDrag() {

        let dragging = false;
        let last = 0;

        const getCoord = e => {
            if (this.direction === "horizontal") {
                return e.touches ? e.touches[0].clientX : e.clientX;
            } else {
                return e.touches ? e.touches[0].clientY : e.clientY;
            }
        };

        const down = coord => {
            dragging = true;
            last = coord;
            this.velocity = 0;
        };

        const move = coord => {
            if (!dragging) return;
            const delta = last - coord;
            this.position += delta;
            last = coord;
        };

        this.track.addEventListener("touchstart", e => {
            down(getCoord(e));
        }, { passive: true });

        this.track.addEventListener("touchmove", e => {
            move(getCoord(e));
        }, { passive: true });

        this.track.addEventListener("touchend", () => {
            dragging = false;
        });

        this.track.addEventListener("mousedown", e => {
            down(getCoord(e));
            e.preventDefault();
        });

        window.addEventListener("mousemove", e => {
            if (dragging) move(getCoord(e));
        });

        window.addEventListener("mouseup", () => {
            dragging = false;
        });

    },

    addKeys() {

        document.addEventListener("keydown", e => {

            const forward = this.direction === "horizontal" ? "ArrowRight" : "ArrowDown";
            const backward = this.direction === "horizontal" ? "ArrowLeft" : "ArrowUp";

            if (e.key === forward) {
                this.velocity += 40;
            }

            if (e.key === backward) {
                this.velocity -= 40;
            }

        });

    }

};
