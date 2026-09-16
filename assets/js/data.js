export async function loadProjects() {
    const response = await fetch("data/projects.json");

    if (!response.ok) {
        throw new Error("Could not load projects.json");
    }

    return await response.json();
}