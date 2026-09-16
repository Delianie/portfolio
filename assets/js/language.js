export function getCurrentLang() {
    return localStorage.getItem("siteLang") || "de";
}

export function toggleLanguage() {

    const lang =
        getCurrentLang() === "de"
            ? "en"
            : "de";

    localStorage.setItem("siteLang", lang);

    document.dispatchEvent(
        new CustomEvent("languageChanged")
    );
}