export const SLIDER_IMAGES = [
    { src: "media/slider/01_A_muster.jpg", format: "A", projectSlug: null },
    { src: "media/slider/02_B_buch.jpg", format: "B", projectSlug: null },
    { src: "media/slider/03_C_plakat.jpg", format: "C", projectSlug: null },
    { src: "media/slider/04_D_muetze.jpg", format: "D", projectSlug: null },
    { src: "media/slider/05_A_fluss.jpg", format: "A", projectSlug: null },
    { src: "media/slider/06_D_wiese.jpg", format: "D", projectSlug: null },
    { src: "media/slider/07_C_wie-im-film.jpg", format: "C", projectSlug: null },
    { src: "media/slider/08_B_zeitung.jpg", format: "B", projectSlug: null },
    { src: "media/slider/09_C_plueschtiere.jpg", format: "C", projectSlug: null }
];

export async function fetchProjects() {
    const response = await fetch("data/projects.json");

    if (!response.ok) {
        throw new Error("Could not load projects.json");
    }

    return response.json();
}

export async function loadProjects() {
    const projects = await fetchProjects();

    if (window.Preloader) {
        await window.Preloader.run(SLIDER_IMAGES);
    }

    return projects;
}