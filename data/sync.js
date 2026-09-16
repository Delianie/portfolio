const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const imageRoot = path.join(__dirname, "..", "media");
const supportedExtensions = [".webp", ".jpg", ".jpeg", ".png", ".avif", ".mp4", ".mov"];

console.log("🚀 sync.js gestartet");

// Pfade
const excelPath = path.join(__dirname, "projects.xlsx");
const jsonPath = path.join(__dirname, "projects.json");

// Excel öffnen
const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Excel → Array
const rows = XLSX.utils.sheet_to_json(worksheet);

// Daten umwandeln
const projects = rows.map(row => {
    const projectFolder = path.join(imageRoot, row["Slug"]);

    console.log(`\n📁 ${projectFolder}`);
    console.log(`Exists: ${fs.existsSync(projectFolder)}`);

    let slider = null;
    let gallery = [];

    if (fs.existsSync(projectFolder)) {
        const files = fs.readdirSync(projectFolder)
            .filter(file => supportedExtensions.includes(path.extname(file).toLowerCase()))
            .sort();

        console.log("Files:", files);

        slider = files.find(file => path.parse(file).name.toLowerCase() === "slider") || null;

        gallery = files.filter(file => path.parse(file).name.toLowerCase() !== "slider");
    }

    return {
        slug: row["Slug"],

        title: {
            de: row["Title (DE)"] || "",
            en: row["Title (EN)"] || ""
        },

        year: Number(row["Year"]) || null,

        client: row["Client"] || "",

        projectType: row["Project Type"] || "",

        text: {
            de: row["Text (DE)"] || "",
            en: row["Text (EN)"] || ""
        },

        credits: row["Credits"]
            ? row["Credits"]
                .split(/\r?\n/)
                .map(line => line.trim())
                .filter(Boolean)
            : [],

        copyright: row["Copyright"] || "",

        slider,
        gallery
    };
});

// JSON speichern
fs.writeFileSync(
    jsonPath,
    JSON.stringify(projects, null, 2),
    "utf8"
);

projects.forEach(project => {
    console.log(`• ${project.slug}: ${project.gallery.length} Medien gefunden${project.slider ? " (+ Slider)" : ""}`);
});

console.log(`✅ ${projects.length} Projekte exportiert.`);
console.log("📄 projects.json wurde aktualisiert.");