# Portfolio Redesign

## Ziel

Die Website wird komplett neu aufgebaut und modular programmiert.

Anstatt für jedes Projekt eine eigene HTML-Seite zu erstellen, gibt es nur noch:

- index.html (Homepage)
- project.html (eine einzige Projektseite)

Alle Inhalte werden automatisch aus einer Datei (`data.js`) geladen.

Dadurch muss später für ein neues Projekt nur noch ein neuer Eintrag in `data.js` ergänzt werden. Der Slider und die Projektseite funktionieren dann automatisch.

---

# Aufbau der Website

Die Website besteht aus drei Ebenen:

## 1. HTML

Das HTML enthält ausschliesslich die Struktur.

Beispielsweise:

- Header
- Sidebar
- Galerie
- Contact
- Footer

Es enthält keine projektspezifischen Inhalte.

---

## 2. Data

`data.js` ist die Datenbank der gesamten Website.

Dort werden sämtliche Projekte gespeichert.

Jedes Projekt besitzt beispielsweise:

- id
- title
- year
- category
- description
- info
- gallery
- slider image

Die Bilder werden ebenfalls dort definiert.

---

## 3. JavaScript

JavaScript verbindet die Daten mit dem HTML.

Es entscheidet:

- welches Projekt angezeigt wird
- welche Bilder geladen werden
- welche Sprache angezeigt wird
- welche Galerie erzeugt wird

---

# Aufgabe jeder Datei

## project.html

Enthält nur das Grundlayout der Projektseite.

Es besitzt Platzhalter für:

- Titel
- Beschreibung
- Informationen
- Galerie

Diese Felder werden später automatisch von `project.js` gefüllt.

---

## data.js

Speichert sämtliche Projekte.

Diese Datei ist die eigentliche Datenbank der Website.

Jedes neue Projekt wird ausschliesslich hier ergänzt.

---

## project.js

Ist das Bindeglied zwischen `project.html` und `data.js`.

Der Ablauf:

URL

↓

project.html?id=blickwechsel

↓

liest die ID

↓

findet das passende Projekt in `data.js`

↓

füllt automatisch:

- Titel
- Beschreibung
- Infos
- Galerie

Dadurch benötigt die Website nur noch eine einzige Projektseite.

---

## slider.js

Steuert den Slider der Homepage.

Der Slider liest ebenfalls aus `data.js`.

Neue Projekte erscheinen dadurch automatisch auf der Startseite.

---

## render.js

Erstellt die HTML-Elemente des Sliders.

Die Bilder werden also nicht mehr im HTML definiert.

---

## language.js

Verwaltet Deutsch und Englisch.

Alle Texte werden automatisch in der richtigen Sprache angezeigt.

---

## typography.css

Enthält ausschliesslich Typografie.

- Schrift
- Schriftgrössen
- Line Height
- Links
- Buttons

---

## project.css

Enthält ausschliesslich das Layout.

Zum Beispiel:

- Grid
- Header
- Sidebar
- Galerie
- Footer
- Responsive

Keine Typografie.

---

## modes.css

Enthält später:

- Normal Mode
- Dark Mode
- Vector Mode

---

## preloader.js

Steuert ausschliesslich den Ladebildschirm.

---

# Aktueller Stand

Bereits erledigt:

✓ Neue Ordnerstruktur erstellt

✓ project.html erstellt

✓ project.css begonnen

✓ typography.css erstellt

✓ project.js begonnen

✓ data.js begonnen

✓ Erstes Projekt "Blickwechsel" eingetragen

---

# Nächster Schritt

Als erstes muss das Grundsystem funktionieren.

Ziel:

project.html?id=blickwechsel

muss automatisch anzeigen:

- Titel
- Beschreibung
- Infos
- Galerie

Sobald dies funktioniert, ist das komplette System aufgebaut.

---

# Danach

1.

Galerie fertig programmieren.

Sie soll Bilder und Videos automatisch laden.

Zusätzlich sollen Bilder entweder:

- eine Spalte
- oder zwei Spalten

einnehmen können.

---

2.

Responsive Layout fertigstellen.

Desktop

↓

Tablet

↓

Mobile

---

3.

Sprache verbinden.

Deutsch

↓

Englisch

---

4.

Homepage neu programmieren.

Desktop:

horizontaler Slider

Mobile Portrait:

vertikaler Slider

Mobile Landscape:

horizontaler Slider

Alle drei Varianten sollen dieselben Daten aus `data.js` verwenden.

---

5.

Slider vollständig mit `data.js` verbinden.

Dadurch muss für neue Projekte nichts mehr programmiert werden.

---

6.

Dark Mode

---

7.

Vector Mode

---

8.

Preloader anschliessen

---

9.

Alle restlichen Projekte in `data.js` ergänzen.

---

# Grundregel

HTML beschreibt nur die Struktur.

CSS beschreibt nur das Layout.

JavaScript steuert die Logik.

data.js enthält ausschliesslich Inhalte.

Dadurch bleibt die Website übersichtlich, leicht erweiterbar und zukünftige Projekte können ohne zusätzliche HTML-Dateien ergänzt werden.