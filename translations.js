/* ============================================================
   TRANSLATIONS.JS - KOMPLETT-FIX
============================================================ */

const projectTranslations = {
    de: {
        p1_titel: "Aus dem Auge, aus dem Sinn?",
        p1_text: `Wir kommen mit nichts auf die Welt und hinterlassen am Ende unzählige Dinge. Viele Gegenstände verlieren mit
            der Zeit ihren materiellen Wert, werden verstaut und oft vergessen – wie Kuscheltiere in einem überfüllten
            Plastiksack. Trotz des Vergessens bleibt eine emotionale Bindung, und das Loslassen fällt schwer. <br> Ist das
            Überkonsum oder schlicht die Notwendigkeit, Platz zu schaffen, weil Stauraum fehlt? <br>Mein Plakat
            visualisiert genau dieses Spannungsfeld zwischen Besitz, Erinnerungen und Ordnung.`,
        p1_infos: `Blickwechsel – Verschiebung<br>
            2025<br>
            in Zusammenarbeit mit Goldbach Neo<br><br>
            POSTERDESIGN / FOTOGRAFIE / ANIMATION<br><br>
            Dozent*innen:<br>
            / Martin Woodtli<br>
            / Martin Infanger<br>
            / Felix Pfäffli<br>
            / Zvonimir Pisonic<br><br>
            @ Fachklasse Grafik Luzern`
    },
    en: {
        p1_titel: "Out of Sight, Out of Mind?",
        p1_text: `We come into the world with nothing and leave behind countless things. Many objects lose their material
            value over time, get stored away, and are often forgotten — like stuffed animals in an overflowing plastic
            bag. Despite forgetting them, an emotional attachment remains, making it difficult to let go.<br>
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
            @ Graphic Design School Lucerne`
    }
};

function applyTranslations() {
    const lang = localStorage.getItem("siteLang") || "de";
    
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (projectTranslations[lang] && projectTranslations[lang][key]) {
            element.innerHTML = projectTranslations[lang][key];
        }
    });
}

// Initialer Aufruf und Klick-Logik
document.addEventListener("DOMContentLoaded", () => {
    applyTranslations();

    const langBtn = document.getElementById("lang-switch");
    if (langBtn) {
        // Wir entfernen eventuelle alte Listener, indem wir eine neue Funktion zuweisen
        langBtn.onclick = (e) => {
            e.preventDefault();
            e.stopImmediatePropagation(); // Verhindert, dass script-startseite.js dazwischenfunkt

            const currentLang = localStorage.getItem("siteLang") || "de";
            const newLang = (currentLang === "de") ? "en" : "de";
            
            localStorage.setItem("siteLang", newLang);
            applyTranslations();
            
            console.log("Switch to:", newLang);
        };
    }
});