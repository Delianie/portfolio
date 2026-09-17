export async function loadProjects() {
    const response = await fetch("data/projects.json");

    if (!response.ok) {
        throw new Error("Could not load projects.json");
    }

    const projects = await response.json();

    if (window.Preloader) {
        await window.Preloader.run(projects);
    }

    return projects;
}