import { loadProjects, SLIDER_IMAGES } from "./data.js";
import { PROJECT_LINKS_ENABLED } from "./config.js";

export async function initSlider() {
    await loadProjects();
    const track = document.getElementById("track");
    if (!track) return;

    renderSlides(SLIDER_IMAGES, track);
    slider.init(track);

    document.addEventListener("languageChanged", () => {
        slider.updateLayout();
    });
}

function renderSlides(images, track) {
    track.innerHTML = "";

    const copies = 3;

    for (let c = 0; c < copies; c++) {

        images.forEach(sliderImage => {

            const slide = document.createElement("a");
            slide.className = "media-wrapper";
            slide.dataset.format = sliderImage.format;
            if (PROJECT_LINKS_ENABLED && sliderImage.projectSlug) {
                slide.href = `project.html?slug=${sliderImage.projectSlug}`;
            } else {
                slide.href = "#";
                slide.addEventListener("click", e => e.preventDefault());
            }

            const image = document.createElement("img");
            image.src = sliderImage.src;
            image.alt = sliderImage.src
                .split("/")
                .pop()
                .replace(/^\d+_[A-D]_/, "")
                .replace(/\.jpg$/i, "")
                .replaceAll("-", " ");

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
    lastFrameTime: 0,

    init(track) {

        this.track = track;

        this.updateLayout();

        window.addEventListener("resize", () => {
            this.updateLayout();
        });
        window.addEventListener("orientationchange", () => {
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

        this.track.classList.remove("horizontal", "vertical", "mobile-portrait");
        this.track.classList.add(this.direction);
        this.track.classList.toggle("mobile-portrait", isPortraitMobile);
        document.body.classList.toggle("mobile-portrait", isPortraitMobile);

        this.track.style.flexDirection =
            this.direction === "vertical" ? "column" : "row";

        if (this.direction === "vertical") {
            document.documentElement.style.setProperty(
                "--col",
                `${width / 12}px`
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
        const previousSetSize = this.setSize;

        let size = 0;

        for (let i = 0; i < perSet; i++) {
            size +=
                this.direction === "horizontal"
                    ? children[i].offsetWidth
                    : children[i].getBoundingClientRect().height;
        }

        this.setSize = size;

        if (size > 0) {
            if (!this.initialized) {
                this.position = size;
                this.initialized = true;
            } else if (previousSetSize > 0) {
                const offset = this.position - previousSetSize;
                this.position = size + ((offset % size) + size) % size;
            }
        }

    },

    animate() {

        const now = performance.now();
        const frames = this.lastFrameTime
            ? Math.min((now - this.lastFrameTime) / 16.67, 4)
            : 1;
        this.lastFrameTime = now;

        this.position += this.velocity * frames;
        this.velocity *= Math.pow(0.985, frames);

        if (this.setSize > 0) {

            if (this.position < this.setSize) {
                this.position += this.setSize;
            }

            if (this.position >= this.setSize * 2) {
                this.position -= this.setSize;
            }

        }

        const roundedPosition = Math.round(this.position);

        if (this.direction === "horizontal") {
            this.track.style.transform =
                `translate3d(${-roundedPosition}px,0,0)`;
        } else {
            this.track.style.transform =
                `translate3d(0,${-roundedPosition}px,0)`;
        }

        requestAnimationFrame(() => this.animate());

    },

    addWheel() {

        document.addEventListener("wheel", e => {

            let deltaX = e.deltaX;
            let deltaY = e.deltaY;

            if (e.deltaMode === 1) {
                deltaX *= 16;
                deltaY *= 16;
            } else if (e.deltaMode === 2) {
                deltaX *= window.innerWidth;
                deltaY *= window.innerHeight;
            }

            const delta =
                this.direction === "horizontal"
                    ? (Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY)
                    : deltaY;

            this.velocity += delta * 0.6;

        }, { passive: true });

    },

    addDrag() {

        let dragging = false;
        let lastCoord = 0;
        let lastTime = 0;
        let flingVelocity = 0;

        const getCoord = e => {
            const point = e.touches ? e.touches[0] : e;
            return this.direction === "horizontal" ? point.clientX : point.clientY;
        };

        const down = coord => {
            dragging = true;
            lastCoord = coord;
            lastTime = performance.now();
            flingVelocity = 0;
            this.velocity = 0;
        };

        const move = coord => {
            if (!dragging) return;

            const now = performance.now();
            const dt = now - lastTime;
            const delta = (lastCoord - coord) * 2.2;

            this.position += delta;

            if (dt > 0) {
                flingVelocity = (delta / dt) * 16.67;
            }

            lastCoord = coord;
            lastTime = now;
        };

        const up = () => {
            if (!dragging) return;
            dragging = false;
            this.velocity = flingVelocity * 4;
        };

        document.addEventListener("touchstart", e => {
            down(getCoord(e));
        }, { passive: true });

        document.addEventListener("touchmove", e => {
            move(getCoord(e));
            e.preventDefault();
        }, { passive: false });

        document.addEventListener("touchend", () => {
            up();
        });

        document.addEventListener("mousedown", e => {
            down(getCoord(e));
            e.preventDefault();
        });

        window.addEventListener("mousemove", e => {
            move(getCoord(e));
        });

        window.addEventListener("mouseup", () => {
            up();
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
