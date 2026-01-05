/* ============================================================
   TRANSLATIONS.JS
============================================================ */

const projectTranslations = {
    de: {
        /* ================= PROJECT 1 ================= */
        p1_titel: "Aus dem Auge, aus dem Sinn?",
        p1_text: `Wir kommen mit nichts auf die Welt und hinterlassen am Ende unzählige Dinge. Viele Gegenstände verlieren mit
        der Zeit ihren materiellen Wert, werden verstaut und oft vergessen – wie Kuscheltiere in einem überfüllten
        Plastiksack. Trotz des Vergessens bleibt eine emotionale Bindung, und das Loslassen fällt schwer.<br>
        Ist das Überkonsum oder schlicht die Notwendigkeit, Platz zu schaffen, weil Stauraum fehlt?<br>
        Mein Plakat visualisiert genau dieses Spannungsfeld zwischen Besitz, Erinnerungen und Ordnung.`,
        p1_infos: `Blickwechsel – Verschiebung<br>
        2025<br>
        in Zusammenarbeit mit Goldbach Neo<br><br>
        POSTERDESIGN / FOTOGRAFIE / ANIMATION<br><br>
        Dozent*innen:<br>
        / Martin Woodtli<br>
        / Martin Infanger<br>
        / Felix Pfäffli<br>
        / Zvonimir Pisonic<br><br>
        @ Fachklasse Grafik Luzern`,

        /* ================= PROJECT 2 ================= */
        p2_titel: "Musik sehen",
        p2_text: `Wie kann man Musik sichtbar machen? Mein Projekt begann mit einfachen Experimenten: analog auf Papier,
        digital mit der Kamera, mit Flüssigkeiten und Stop-Motion. Schon bald wurde deutlich, wie eng Musik und
        Gestaltung miteinander verbunden sind – beide basieren auf Rhythmus, Tempo und Bewegung. Diese Verbindung
        bildet die Grundlage meines Plakats.<br><br>
        Es entstand aus analogen Scans von Transparentpapier, die ich übereinanderlege und digital weiterbearbeite.
        Eine kurze Animation ergänzt die Idee der Bewegung. Der Schwarz-Weiss-Look rückt Formen und Prozesse in den
        Fokus und zeigt, wie Musik als Bewegung innerhalb eines Bildes erfahrbar werden kann.`,
        p2_infos: `Masterabschlusskonzerte<br>
        2025<br>
        in Zusammenarbeit mit HSLU<br><br>
        POSTERDESIGN / FOTOGRAFIE / ANIMATION<br><br>
        Dozent*innen:<br>
        / Martin Woodtli<br>
        / Martin Infanger<br>
        / Felix Pfäffli<br>
        / Zvonimir Pisonic<br><br>
        @ Fachklasse Grafik Luzern`,

        /* ================= PROJECT 3 ================= */
        p3_titel: "Typografie aus Technik",
        p3_text: `Schrauben, Platinen, Drähte, Formen.
        Der Retro-Kassettenplayer zerfällt in eine Sammlung technischer Elemente.
        Seine Einzelteile werden zu Linien, Flächen und Strukturen – zu einer neuen visuellen Sprache.
        Aus dieser Dekonstruktion entsteht die Schrift Bass Boost: kantig, klar und pulsierend.
        Die technischen Komponenten des Geräts übersetzen sich in eine Typografie, die den Charakter des Objekts trägt.
        So wird aus einem Stück Technik eine eigenständige gestalterische Identität.`,
        p3_infos: `Bass Boost<br>
        2025<br><br>
        ILLUSTRATION / FONTDESIGN<br><br>
        Dozent*innen:<br>
        / Mauro Paolozzi<br><br>
        @ Fachklasse Grafik Luzern`
    },

    en: {
        /* ================= PROJECT 1 ================= */
        p1_titel: "Out of Sight, Out of Mind?",
        p1_text: `We come into the world with nothing and leave behind countless things. Many objects lose their material
        value over time, get stored away, and are often forgotten — like stuffed animals in an overflowing plastic bag.
        Despite forgetting them, an emotional attachment remains, making it difficult to let go.<br>
        Is this overconsumption, or simply the necessity of creating space because storage is limited?<br>
        My poster visualizes this very tension between possessions, memories, and order.`,
        p1_infos: `Shift in Perspective<br>
        2025<br>
        in collaboration with Goldbach Neo<br><br>
        POSTER DESIGN / PHOTOGRAPHY / ANIMATION<br><br>
        Lecturers:<br>
        / Martin Woodtli<br>
        / Martin Infanger<br>
        / Felix Pfäffli<br>
        / Zvonimir Pisonic<br><br>
        @ Graphic Design School Lucerne`,

        /* ================= PROJECT 2 ================= */
        p2_titel: "Seeing Music",
        p2_text: `How can one make music visible? My project began with simple experiments: analog on paper,
        digital with the camera, with liquids and stop-motion. Soon it became clear how closely music and
        design are connected – both are based on rhythm, tempo, and movement. This connection forms the basis
        of my poster.<br><br>
        It was created from analog scans of transparent paper, which I layer and digitally process further.
        A short animation complements the idea of movement. The black-and-white look focuses attention on forms
        and processes, showing how music can be experienced as movement within an image.`,
        p2_infos: `Master's Final Concerts<br>
        2025<br>
        in collaboration with HSLU<br><br>
        POSTER DESIGN / PHOTOGRAPHY / ANIMATION<br><br>
        Lecturers:<br>
        / Martin Woodtli<br>
        / Martin Infanger<br>
        / Felix Pfäffli<br>
        / Zvonimir Pisonic<br><br>
        @ Graphic Design School Lucerne`,

        /* ================= PROJECT 3 ================= */
        p3_titel: "Typography from Technology",
        p3_text: `Screws, circuit boards, wires, shapes.
        The retro cassette player disintegrates into a collection of technical elements.
        Its individual parts become lines, surfaces, and structures – a new visual language.
        From this deconstruction emerges the font Bass Boost: angular, clear, and pulsating.
        The technical components of the device translate into typography that carries the character of the object.
        Thus, from a piece of technology, an independent design identity is created.`,
        p3_infos: `Bass Boost<br>
        2025<br><br>
        ILLUSTRATION / FONT DESIGN<br><br>
        Lecturers:<br>
        / Mauro Paolozzi<br><br>
        @ Graphic Design School Lucerne`
    }
};



function getCurrentLang() {
    // Holt die Sprache aus dem Speicher, Standard ist 'de'
    return localStorage.getItem("siteLang") || "de";
}

function setCurrentLang(lang) {
    // Speichert die neue Sprache
    localStorage.setItem("siteLang", lang);
}

function applyTranslations() {
    const lang = getCurrentLang();

    // 1. Alle Texte auf der Seite übersetzen
    document.querySelectorAll("[data-key]").forEach(el => {
        const key = el.dataset.key;
        if (projectTranslations[lang] && projectTranslations[lang][key]) {
            el.innerHTML = projectTranslations[lang][key];
        }
    });

    // 2. Das lang-Attribut im HTML-Tag anpassen (gut für SEO)
    document.documentElement.lang = lang;

    // 3. DEN BUTTON-TEXT ANPASSEN
    // Wenn die Seite auf DE ist, soll der Button "EN" anzeigen (als Ziel).
    // Wenn die Seite auf EN ist, soll der Button "DE" anzeigen.
    const langSwitch = document.getElementById("lang-switch");
    if (langSwitch) {
        langSwitch.innerText = (lang === "de") ? "EN" : "DE";
    }
}

function toggleLanguage() {
    // Hier passiert der unendliche Wechsel:
    const currentLang = getCurrentLang();
    const nextLang = (currentLang === "de") ? "en" : "de";
    
    setCurrentLang(nextLang);
    applyTranslations();
}

/* ============================================================
   INIT
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    // Beim ersten Laden der Seite alles richtig einstellen
    applyTranslations();

    const langSwitch = document.getElementById("lang-switch");
    if (langSwitch) {
        langSwitch.addEventListener("click", (e) => {
            e.preventDefault(); // Verhindert, dass die Seite nach oben springt
            toggleLanguage();   // Führt den Wechsel aus
        });
    }
});