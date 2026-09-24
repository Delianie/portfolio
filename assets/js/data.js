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
        await window.Preloader.run(projects);
    }

    return projects;
}