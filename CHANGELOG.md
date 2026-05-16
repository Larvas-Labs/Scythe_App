# Changelog

## [1.1.3] - 2026-05-16

### Förbättringar
- Avancerat-sektionen är nu en sammanhängande röd widget — varning, rubrik och items i ett kort
- BottomBar-knappen heter nu "Frigör" och är översatt till alla 5 språk (EN: Free up, DE: Freigeben, FR: Libérer, ES: Liberar)
- Storlekstexten i BottomBar matchar nu widgetens gröna ton
- Onödig bottenmarginal i resultatlistan borttagen

---

## [1.1.2] - 2026-05-16

### Förbättringar
- BottomBar omdesignad som flytande widget med röd ton – sticker ut tydligast av alla ytor
- Sidebars toppsektion ger nu korrekt plats åt macOS traffic lights (52 px padding)
- "Ny scan"-knappen i sidebaren har nu amber-färgad border och text
- Scythe-logosymbolen i sidebaren borttagen (förbereds för ny ikon)
- Onödig bottenmarginal i resultatlistan borttagen

---

## [1.1.1] - 2026-05-15

### Förbättringar
- Komplett internationalisering – alla UI-strängar och kategoribeskrivningar översatta till EN/SV/DE/FR/ES
- Resultatvyns sammanfattningsring animerar korrekt vid bocka ur objekt
- Ringen har konsekvent 4% gap (samma stil som startskärmen)
- Kategorinamn och beskrivningar visas på aktivt språk

### Buggfixar
- Hårdkodade svenska strängar borttagna från resultatvy, startsida och lagringscirkeln
- `idle.title` saknades i sv/de/fr/es – nu korrekt översatt

---

## [1.1.0] - 2026-05-15

### Nyheter
- Ny resultatvy med heltäckande sammanfattningswidget (ring + statistik + framstegsbar)
- Sammanfattningsringen visar valt utrymme i centrum och animerar vid val/aval
- Ny scanvy med orbitala animationer kring play-knappen under scanning
- Förbättrad idle-vy med estimatring och polerad play-knapp (shimmer, glow, press-animation)

---

## [1.0.0] - 2026-05-15

### Initialt släpp
- Skanna, visualisera och radera cache-filer på macOS
- Stöd för kategorier: Cacher, Webbläsare, Utvecklarverktyg, Appar, Avancerat
- Auto-uppdatering via GitHub Releases
- Mörkt/ljust tema, språkväljare (EN/SV/DE/FR/ES)
