# Projektstruktur
portfolio/
│
├── index.html
├── .gitignore
├── CNAME
├── google5e75d6a7d92920f2.html
│
├── assets/
│   ├── css/
│   │   ├── home.css
│   │   ├── project.css
│   │   ├── typography.css
│   │   └── modes.css
│   │
│   ├── js/
│   │   ├── app.js
│   │   ├── data.js
│   │   ├── render.js
│   │   ├── slider.js
│   │   ├── language.js
│   │   └── preloader.js
│   │
│   ├── fonts/
│   ├── icons/
│   └── favicons/
│
├── media/
│   ├── slider/
│   └── projects/
│
└── projects/
    ├── about.html
    ├── blickwechsel.html
    ├── master.html
    ├── london.html
    ├── motiontype.html
    ├── bildwort.html
    ├── typography.html
    ├── prepress.html
    └── kampagne.html


# Ordnerstruktur
media/
│
├── slider/
│   ├── bildwort.webp
│   ├── master.mp4
│   ├── london.webp
│   └── ...
│
└── projects/
    ├── bildwort/
    │   ├── 01.webp
    │   ├── 02.webp
    │   └── 03.webp
    │
    ├── master/
    │   ├── cover.webp
    │   ├── motion.mp4
    │   └── ...
    │
    └── london/

# Aufbau project-page
project-page
│
├── project-header
│
├── project-content
│   ├── project-sidebar
│   └── project-gallery
│
├── project-contact
│
└── project-footer


assets/js/

app.js          ← startet alles

data.js         ← alle Projekte

slider.js       ← Homepage-Slider

render.js       ← erstellt den Slider

project.js      ← erstellt die Projektseite

language.js     ← DE / EN

preloader.js    ← Preloader

modes.js        ← Dark / Vector / Normal
