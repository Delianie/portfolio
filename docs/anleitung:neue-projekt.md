node data/sync.js

# Neue Projekte hinzufügen

Für ein neues Projekt müssen nur vier Schritte ausgeführt werden.

## 1. Excel bearbeiten

`data/projects.xlsx` öffnen und eine neue Zeile mit den Projektdaten ergänzen.

Folgende Informationen werden dort gepflegt:

- Slug
- Image Folder
- Titel (DE / EN)
- Jahr
- Client
- Project Type
- Text (DE / EN)
- Credits
- Copyright
- Image Count

---

## 2. Bilder hinzufügen

Alle Bilder und Videos in den entsprechenden Projektordner legen.

Beispiel:

images/
└── rolling-bagels/
    ├── 01.webp
    ├── 02.webp
    ├── 03.mp4
    └── ...

---

## 3. JSON aktualisieren

Im Terminal ausführen:

```bash
node data/sync.js
```

Dadurch wird `projects.json` automatisch anhand der Excel-Datei neu erstellt.

---

## 4. Website testen

Projekt im Browser öffnen und kontrollieren:

- Texte
- Bilder
- Credits
- Layout
- Deutsch / Englisch

Falls Änderungen nötig sind:

→ Excel anpassen

→ erneut ausführen:

```bash
node data/sync.js
```

Die Website verwendet immer die aktuell generierte `projects.json`.

---

## Grundregel

**Projektdaten niemals direkt in `projects.json` bearbeiten.**

Alle Änderungen werden ausschließlich in `projects.xlsx` vorgenommen.
`projects.json` wird immer automatisch durch `sync.js` erstellt.