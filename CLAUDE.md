# SCYTHE – Claude Code Project Brief

Du är en senior macOS-utvecklare och UX-designer. Bygg appen **Scythe** – ett Electron-baserat Mac-verktyg för att skanna, visualisera och permanent radera cache-filer och skräpdata. Följ denna brief exakt.

> **Språkregler:** Denna brief är på svenska, men all extern kommunikation ska vara på **engelska** — GitHub release-beskrivningar, commit-meddelanden, PR-texter och all annan text som publiceras utanför detta repo.

---

## 0. Design Skill – Impeccable

**Använd Impeccable-skillen för all UI-kod.** Impeccable är installerad globalt i denna Claude Code-miljö. Aktivera den innan du skriver någon komponent:

```
/impeccable
```

Impeccable styr typografi, spacing, komponentkvalitet och visuell polish. All frontend-kod ska följa Impeccable-standarderna för att uppnå production-grade kvalitet.

---

## 1. Projektöversikt

**Namn:** Scythe  
**Tagline:** *"Harvest your disk space"*  
**Platform:** macOS (Electron + React + Tailwind)  
**Syfte:** Låt användaren manuellt köra en scanning av datorn, se exakt hur mycket utrymme olika kategorier tar, välja vad som ska rensas och permanent radera det direkt i appen.

---

## 2. Tech Stack

| Del | Teknik |
|---|---|
| Desktop runtime | Electron 27+ |
| UI-framework | React 18 |
| Styling | Tailwind CSS 3 |
| Bundler | Vite 4 |
| Dev-runner | concurrently + wait-on |
| Paketering | electron-builder |
| Node-version | 18+ |

**Inga externa UI-bibliotek.** Bygg alla komponenter från scratch.  
**Inga databaser.** Använd `electron-store` för att persistera användarinställningar (inkl/exkl-toggles).

---

## 3. Projektstruktur

```
scythe/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── main.js                    ← Electron huvudprocess
├── preload.js                 ← Context bridge
└── src/
    ├── main.jsx               ← React entry point
    ├── index.css              ← Tailwind + CSS-variabler
    ├── utils.js               ← formatSize(), cn() etc.
    └── components/
        ├── Layout.jsx         ← Root-layout: Sidebar + MainContent sida vid sida
        ├── Sidebar.jsx        ← Vänster sidebar: logo, kategorier, inställningar
        ├── CategoryList.jsx   ← Checkboxlista med kategorier + uppskattad storlek
        ├── SettingsPopup.jsx  ← Popup-modal från inställningar-knappen
        ├── MainContent.jsx    ← Byter innehåll beroende på appState
        ├── IdleView.jsx       ← Startvy: scan-knapp + StorageRing tom
        ├── ScanProgress.jsx   ← Progressvy under scanning
        ├── ResultsView.jsx    ← Resultatvy: StorageRing + ResultList
        ├── StorageRing.jsx    ← Animerad ring som visar frigjort utrymme
        ├── ResultList.jsx     ← Scrollbar lista med scan-resultat
        ├── CategorySection.jsx← Grupperad sektion i resultatlistan
        ├── ScanItem.jsx       ← Enskild rad med checkbox + storlek
        ├── BottomBar.jsx      ← Löpande räknare + Harvest-knapp (i MainContent)
        ├── DeleteModal.jsx    ← Bekräftelse-modal vid radering
        ├── UpdateBanner.jsx   ← Diskret banner vid tillgänglig uppdatering
        └── DoneView.jsx       ← Success-vy efter radering
```

---

## 4. Design System

> ⛔ FÖRBJUDNA FÄRGER – används ALDRIG i denna app:
> `#00E57A` `#0096FF` `#1C1F3A` `#111328` `#0C0E1A` `#07080F` och alla blå/gröna toner.
> Appen har **en** accentfärg: Amber `#FF9500`. Allt annat är neutralt mörkt grå.

### 4.0 UX-inspiration – Codex & Cursor som referens

Scythes UX ska följa mönstret från **Codex (OpenAI) och Cursor** – moderna, avskalade Mac-verktyg med sidebar-navigation. Inte ett traditionellt system-utility.

**Visuell referens:**
- **Codex:** Smal vänster sidebar med ikon + text-navigation, `Inställningar` isolerat längst ned, generöst whitespace i huvudytan, subtila kort med lätt border
- **Cursor:** Tydlig panel-uppdelning med borders emellan, monospace för teknisk data, djup mörkgrå ton (inte rent svart)

**Layout-principer:**
- **Sidebar alltid synlig** – inte en drawer eller collapsible, utan en permanent vänster panel (~240px bred)
- Sidebar och huvudyta separeras av en enkel `1px border` – ingen shadow, ingen gradient
- Huvudytan är öppen och ren – innehåll centreras vertikalt vid IDLE
- Inga "floating panels" eller overlays förutom modaler

**Sidebar-känsla (exakt som Codex):**
- Applogo + namn högst upp med `padding-top: 20px` för traffic lights
- Nav-items: ikon (16px) + label, ingen border/bakgrund per item, bara en tunn accent-left-border på aktivt item
- Kategorier under en `text-xs uppercase tracking-wider` sektionsrubrik
- Varje kategori: anpassad checkbox (inte systemdefault) + namn + uppskattad storlek högerställd
- `Inställningar`-knapp längst ned, separerad med en `border-top`

**Komponentkänsla:**
- Knappar: `rounded-lg` (inte `rounded-xl`), tydlig primär/sekundär/ghost-hierarki
- Checkboxar: Custom-byggda, inte `<input type="checkbox">` – fyrkantiga med `border-radius: 4px`, checkmark i `--accent` vid checked
- Listor i main: Varje rad är ett väldefinierat kort med `border`, `border-radius: 8px`, `padding: 12px 16px`, och hover-state
- Siffror (GB/MB): Alltid `font-mono`, alltid högerställda, alltid i accentfärg

**Typografisk hierarki (Codex-stil):**
```
App-namn:        Syne 700, 15px, --text
Sektionsrubriker: DM Sans 500, 11px, --text-muted, UPPERCASE, letter-spacing: 0.08em
Nav-labels:      DM Sans 400, 13px, --text-secondary
Kategori-namn:   DM Sans 500, 13px, --text
Storlekar:       JetBrains Mono 400, 12px, --text-muted (sidebar) / stor + accent (main)
Kort-rubriker:   DM Sans 600, 14px, --text
```

**ASCII-layout – exakt struktur:**
```
┌──────────────┬─────────────────────────────────────────┐
│ ⠿ Scythe     │  [UpdateBanner – visas vid uppdatering] │
│              ├─────────────────────────────────────────┤
│ KATEGORIER   │                                         │
│ ☑ App-cacher │                                         │
│   ~12.4 GB   │          MainContent                    │
│ ☑ Webbläsare │    (IdleView / ScanProgress /           │
│    ~3.2 GB   │     ResultsView / DoneView)             │
│ ☑ npm cache  │                                         │
│    ~1.8 GB   │                                         │
│ ☑ Xcode      │                                         │
│   ~38.0 GB   ├─────────────────────────────────────────┤
│              │  BottomBar: 5 valda • 14.3 GB [Harvest] │
├──────────────┤                                         │
│ ⚙ Inställn.  │                                         │
└──────────────┴─────────────────────────────────────────┘
```

### 4.1 Färgpalett

Appen följer macOS **dark/light mode** automatiskt via `prefers-color-scheme`. Definiera alla färger som CSS-variabler i `:root` och `[data-theme="light"]`.

**Signaturfärg: Amber `#FF9500` – en enda accentfärg, använd sparsamt**

Scythe har exakt **en** accentfärg. Inget gradient, ingen sekundärfärg.

- `--accent` → **endast** på: checked-checkboxar, storlekssiffror i results, primärknapp, BottomBar-siffra, StorageRing-fill, ✓ checkmarks, success-state
- `--accent-dim` → `rgba(255, 149, 0, 0.12)` – subtil bakgrund vid hover på accent-element
- **Allt annat** använder `--text`, `--surface`, `--border` – neutrala mörka toner
- **Fel:** amber på headers, sidebar-bakgrund, generella knappar, borders
- **Rätt:** 95% av UI är mörkt/neutralt – amber dyker upp på exakt rätt ställen och inget annat

```css
/* DARK (default) */
:root {
  --bg:           #0D0D0D;   /* Cursor-svart – inte rent svart */
  --bg-secondary: #131313;   /* Sidebar, sekundära ytor */
  --surface:      #151515;   /* Kort, panels, widgets */
  --surface-hover:#1a1a1a;   /* Hover-state på ytor */
  --border:       #1e1e1e;   /* Subtila borders – Cursor-stil */
  --border-strong:#2a2a2a;   /* Tydligare borders, modaler */

  --accent:       #FF9500;   /* Amber – Scythes enda signaturfärg */
  --accent-dim:   rgba(255, 149, 0, 0.12); /* Subtil amber-bakgrund */

  --danger:       #FF453A;   /* Radera-knappar, destruktiva actions */
  --danger-dim:   rgba(255, 69, 58, 0.12);
  --warning:      #FF9F0A;   /* Varningar, safe:false items – nära amber men distinkt */

  --text:         #E0E0E0;   /* Primär text */
  --text-secondary: #888;   /* Sekundär text, beskrivningar */
  --text-muted:   #444;      /* Muted, placeholders, section-labels */
}

/* LIGHT */
[data-theme="light"] {
  --bg:           #F5F5F5;
  --bg-secondary: #EBEBEB;
  --surface:      #FFFFFF;
  --surface-hover:#F0F0F0;
  --border:       #E0E0E0;
  --border-strong:#CCCCCC;
  --text:         #111111;
  --text-secondary: #555555;
  --text-muted:   #999999;
}
```

### 4.2 Typografi

Ladda via Google Fonts i `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

| Användning | Font | Vikt |
|---|---|---|
| Rubriker, appnamn | Syne | 700–800 |
| UI-text, labels, knappar | DM Sans | 400–600 |
| Storlekar (GB, MB), paths | JetBrains Mono | 400–500 |

**Storlekssiffror (GB/MB) ska alltid vara stora och prominenta** – det är appens hjälte-element.

### 4.3 Ikonen (SVG)

Rita appikonen som en **stiliserad "S"-form gjord av en lie**. Konstruktion:

- Bakgrund: Mörk cirkel `#131313` med `border: 1px solid #2a2a2a`
- S-kurvan: En sammanhängande kurva i `--accent` (#FF9500), 4px stroke, rundade ändar
- Eggspetsen: Liten vass triangel i `--accent` längst ned på S-kurvan
- Skaftet: Rakt element i `#555` som genomskär S-kurvan diagonalt
- Exportera som `icon.svg` i projektets rot

---

## 5. App-flöde & UX

### 5.1 States

```
IDLE → SCANNING → RESULTS → (DELETING →) DONE → IDLE
```

Sidebaren är **alltid synlig och alltid interaktiv** i alla states.

---

### 5.2 Widget-filosofi – Cursor som referens

Varje del av appen är en **distinkt widget** – en avgränsad ruta med egen bakgrundsfärg, border och border-radius. Ingen del flyter in i en annan. Det ger tydlig visuell separation och gör det enkelt att förstå vad som är vad.

```
Bakgrund (--bg): #0D0D0D  ← appens "bord" som allt ligger på
  │
  ├── Sidebar-widget       background: --surface, border-right: --border
  │     ├── Logo-sektion   border-bottom: --border, padding: 16px
  │     ├── Kategori-widget  background: --bg-secondary, border: --border,
  │     │                    border-radius: 10px, margin: 8px, padding: 12px
  │     └── Settings-widget  border-top: --border, padding: 12px
  │
  └── Main-area            background: --bg
        ├── UpdateBanner   background: --accent-dim, border-bottom: --border
        ├── Content-widget background: --surface, border: --border,
        │                  border-radius: 12px, margin: 16px, padding: 20px
        └── BottomBar      background: --surface, border-top: --border
```

**Regel:** Varje widget har alltid `border`, `border-radius`, och `background` som skiljer den från sin omgivning. Inga "nakna" sektioner utan avgränsning.

---

### 5.3 Sidebar – `Sidebar.jsx` (alltid synlig, 240px)

Sidebaren är uppdelad i tre tydliga delar med borders emellan:

**Del 1 – Logo-sektion (toppen)**
```
padding-top: 20px  ← utrymme för macOS traffic lights
┌──────────────────────────┐
│  ⠿  Scythe               │  ← app-ikon (20px SVG) + Syne 700 15px
└──────────────────────────┘
border-bottom: 1px solid --border
```

**Del 2 – Kategori-widget (mitten, scrollbar)**
En distinct widget med egen background inuti sidebaren:

```
background: --bg-secondary
border: 1px solid --border
border-radius: 10px
margin: 12px 8px
padding: 8px
```

Innehåll:
- Sektionsrubrik: `"KATEGORIER"` – DM Sans 500, 10px, --text-muted, uppercase, letter-spacing: 0.1em
- Varje kategori-rad:
  ```
  [☑] Kategorinamn          ~12.4 GB
  ```
  - Custom checkbox: 14px, border-radius: 3px, border: --border, checked = `--accent` bakgrund + vit checkmark SVG
  - Namn: DM Sans 500, 13px, --text
  - Storlek: JetBrains Mono 400, 11px, --text-muted, högerställd
  - Hover: rad får `background: --surface-hover`, border-radius: 6px
  - Kategorigrupper separeras med en `8px` margin och subtil grupprubrik

- Kategorigrupper i sidebaren:
  - **Cacher** (App-cacher, Logs, Papperskorg)
  - **Webbläsare** (Chrome, Safari, Firefox, Arc, Brave)
  - **Utvecklare** (npm, Yarn, Homebrew, Xcode, Simulatorer)
  - **Appar** (Slack, Spotify, Zoom, VS Code, Figma, Docker)
  - **⚠ Avancerat** (Systemcacher, Systemloggar, Temp-filer) – röd gruppfärg

**Del 3 – Settings-widget (botten)**
```
border-top: 1px solid --border
padding: 12px
```
En enda knapp:
```
[⚙]  Inställningar
```
- DM Sans 400, 13px, --text-secondary
- Ikon: 14px, --text-muted
- Hover: background --surface-hover, border-radius: 6px
- Klick → öppnar `SettingsPopup`

---

### 5.4 SettingsPopup – `SettingsPopup.jsx`

Popup som visas **ovanför** inställningsknappen (inte en modal, utan en contextmenu-liknande widget):

```
position: absolute
bottom: 60px
left: 12px
width: 216px
background: --surface
border: 1px solid --border-strong
border-radius: 10px
box-shadow: 0 8px 32px rgba(0,0,0,0.4)
padding: 8px
```

Innehåll:

**Utseende**
```
┌────────────────────────────────┐
│  UTSEENDE                      │
│  Tema         [Mörkt ▾]        │  ← dropdown: Mörkt / Ljust / System
└────────────────────────────────┘
```
- Separator: `border-bottom: --border`

**Uppdateringar**
```
┌────────────────────────────────┐
│  UPPDATERINGAR                 │
│  Version 1.0.0                 │
│  [Sök efter uppdateringar]     │  ← ghost-knapp, full bredd
└────────────────────────────────┘
```
- Ghost-knapp: border: --border, border-radius: 6px, padding: 6px 10px, text: DM Sans 13px
- Vid klick: knappen visar spinner → `"Kontrollerar..."` → `"Uppdaterad ✓"` eller `"Ny version tillgänglig"`

Stäng popup: klick utanför eller Escape.

---

### 5.5 MainContent – states

**IDLE – `IdleView.jsx`**

Centrerat i main-ytan, single content-widget:

```
background: --surface
border: 1px solid --border
border-radius: 12px
margin: 32px
padding: 40px
text-align: center
```

Innehåll:
- Scythe SVG-ikon, 80px
- Rubrik: `"Ready to harvest"` – Syne 700, 22px
- Undertext: `"Välj kategorier i sidebaren och kör scanning"` – DM Sans 400, 14px, --text-secondary
- Primärknapp: `"Kör scanning"` – --accent bakgrund, DM Sans 600, border-radius: 8px, padding: 12px 32px

---

**SCANNING – `ScanProgress.jsx`**

Ersätter IdleView i main-ytan. En progress-widget:

```
background: --surface
border: 1px solid --border
border-radius: 12px
margin: 16px
padding: 24px
```

Innehåll:
- Rubrik: `"Skannar..."` – Syne 700, 18px
- Aktuell kategori: `"Skannar Xcode DerivedData..."` – DM Sans 400, 13px, --text-secondary, italic
- Progressbar:
  ```
  background: --bg-secondary, border-radius: 4px, height: 4px
  fill: ----accent, transition: width 0.3s ease
  ```
- Kompletteringslista: varje avklarad kategori visas med `✓` i --accent + storlek
  - Varje rad: eget litet kort, background: --bg-secondary, border-radius: 6px
- Avbryt-knapp: ghost-stil, längst ned

---

**RESULTS – `ResultsView.jsx`**

Delad layout i main-ytan: StorageRing-widget till vänster + ResultList till höger.

```
┌──────────────────────────────────────────────┐
│  [StorageRing-widget]  [ResultList-widget]   │
│  200px bred, sticky    flex: 1, scrollbar    │
└──────────────────────────────────────────────┘
```

**StorageRing-widget:**
```
background: --surface
border: 1px solid --border
border-radius: 12px
margin: 16px 8px 16px 16px
padding: 20px
position: sticky, top: 16px
width: 200px
```
- Donut-ring SVG, 160px, --accent fill
- Centrum: total storlek hittad, JetBrains Mono 700, 24px, --text
- Under: `"kan rensas"` DM Sans 400, 12px, --text-muted
- Separator
- `"Valt: 14.3 GB"` – uppdateras live, --accent, mono 600 18px
- Färglegend per kategorigrupp: prick + namn + storlek

**ResultList-widget:**
```
background: --surface
border: 1px solid --border
border-radius: 12px
margin: 16px 16px 16px 8px
padding: 0
overflow: hidden  ← border-radius funkar med sticky headers
```

Per kategori-sektion:
```
Sticky header:
  background: --bg-secondary
  border-bottom: 1px solid --border
  padding: 10px 16px
  → [☑ Välj alla] Kategorinamn          Totalt: 12.4 GB

Varje item-rad:
  padding: 10px 16px
  border-bottom: 1px solid --border (ej sista)
  hover: background --surface-hover
  → [☑] Ikon  Namn             Beskrivning       12.4 GB  [↗]
```

- Storlek högerställd: JetBrains Mono, 13px, --text-secondary
- `[↗]` = "Visa i Finder"-ikon, visas vid hover
- `safe: false`-items: ⚠️ ikon + warning-färg på storlekssiffran
- Saknade paths: rad gråad + `"Hittades inte"` kursiv
- **Avancerat**-sektion: röd section-header + varningstext ovanför första raden

---

### 5.6 BottomBar – `BottomBar.jsx`

Alltid synlig under main-ytan i RESULTS/DELETING:

```
background: --surface
border-top: 1px solid --border
padding: 12px 20px
display: flex, align-items: center, justify-content: space-between
```

Vänster:
```
5 valda  •  14.3 GB frigörs
↑ DM Sans 400 13px    ↑ JetBrains Mono 600 16px --accent
```

Höger (knappar, gap: 8px):
```
[Töm papperskorg  2.1 GB]   [🌾 Harvest]
 ↑ ghost-knapp, visas bara   ↑ background: --danger
   om papperskorg > 0           border-radius: 8px
                                padding: 8px 20px
                                DM Sans 600 14px
```

---

### 5.7 DeleteModal – `DeleteModal.jsx`

Centrerad modal med backdrop:

```
backdrop: rgba(0,0,0,0.6), blur: 4px
modal-widget:
  background: --surface
  border: 1px solid --border-strong
  border-radius: 14px
  width: 480px
  padding: 28px
  box-shadow: 0 24px 64px rgba(0,0,0,0.5)
```

Innehåll:
- Rubrik: `"⚠ Permanent radering"` – Syne 700, 18px
- Lista: varje item som ska raderas i eget litet kort (background: --bg-secondary)
- Varningstext (röd bakgrund, border-radius: 8px): `"Dessa filer kan inte återställas"`
- För admin-items: infóruta om lösenordsdialog
- Knappar: `[Avbryt]` ghost + `[Radera permanent · X GB]` --danger

---

### 5.8 DoneView – `DoneView.jsx`

Success-state efter radering. Ersätter ResultsView i main-ytan:

```
background: --surface
border: 1px solid --border
border-radius: 12px
margin: 32px
padding: 40px
text-align: center
```

- Stor checkmark-animation i --accent
- `"14.3 GB frigjort"` – JetBrains Mono 700, 36px, --accent
- Lista på rensade kategorier med ✓ och storlek (kompakt kort per item)
- Knapp: `"Kör ny scanning"` – primär, --accent

---

## 6. Kategorier

Definiera alla scan-targets som en array i `main.js`. Varje target har:

```js
{
  id: String,           // unik nyckel
  name: String,         // visningsnamn
  category: String,     // 'user' | 'browsers' | 'developer' | 'apps' | 'advanced'
  path: String,         // absolut sökväg
  description: String,  // kort beskrivning på svenska
  showChildren: Boolean,// visa sub-items i resultatlistan
  safe: Boolean,        // true = säker att radera
  requiresAdmin: Boolean,// true = kräver sudo/osascript
  icon: String,         // emoji eller icon-id
}
```

### Kategorilista

**Användarcacher (`user`)**
- `~/Library/Caches` – App-cacher (showChildren: true, max 25 sub-items)
- `~/Library/Logs` – Användarlogs
- `~/.Trash` – Papperskorg

**Webbläsare (`browsers`)**
- `~/Library/Caches/Google/Chrome` – Chrome
- `~/Library/Caches/com.apple.Safari` – Safari
- `~/Library/Caches/Firefox` – Firefox
- `~/Library/Caches/company.thebrowser.Browser` – Arc
- `~/Library/Application Support/BraveSoftware/Brave-Browser/Default/Cache` – Brave

**Utvecklarverktyg (`developer`)**
- `~/.npm/_cacache` – npm cache
- `~/Library/Caches/Yarn` – Yarn cache
- `~/Library/pnpm/store` – pnpm store (safe: false)
- `~/Library/Caches/Homebrew` – Homebrew cache
- `~/Library/Developer/Xcode/DerivedData` – Xcode DerivedData (showChildren: true)
- `~/Library/Developer/Xcode/Archives` – Xcode Archives (safe: false)
- `~/Library/Developer/CoreSimulator/Devices` – iOS Simulatorer (safe: false)

**Appdata (`apps`)**
- `~/Library/Application Support/Slack/Cache` – Slack
- `~/Library/Application Support/Spotify/PersistentCache` – Spotify
- `~/Library/Application Support/zoom.us/data` – Zoom
- `~/Library/Application Support/Code/Cache` – VS Code
- `~/Library/Application Support/Figma` – Figma cache
- `~/Library/Containers/com.docker.docker/Data` – Docker data (safe: false)

**Avancerat – kräver admin (`advanced`)**
- `/Library/Caches` – Systemcacher (requiresAdmin: true, safe: false)
- `/var/log` – Systemloggar (requiresAdmin: true, safe: false)
- `/private/var/folders` – Temporära systemfiler (requiresAdmin: true, safe: false)

---

## 7. Electron – Main Process (`main.js`)

### Window-konfiguration

```js
new BrowserWindow({
  width: 1080,
  height: 700,
  minWidth: 860,
  minHeight: 580,
  titleBarStyle: 'hiddenInset',
  trafficLightPosition: { x: 16, y: 20 },
  backgroundColor: '#0D0D0D',
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    contextIsolation: true,
    nodeIntegration: false,
  }
})
```

### Hjälpfunktioner

```js
// Storlek i bytes via macOS du
function getDirSize(targetPath) {
  // execSync('du -sk "path" 2>/dev/null')
  // Returnera KB * 1024, eller 0 vid fel
}

// Kontrollera om sökväg existerar och är åtkomlig
function pathExists(path) { ... }

// Hämta N största sub-items i en mapp
function getChildren(dirPath, max = 25) { ... }

// Snabb storleksuppskattning för alla toggles (körs passivt)
function quickEstimate(targets) { ... }
```

### IPC-kanaler

| Kanal | Riktning | Beskrivning |
|---|---|---|
| `scan:start` | renderer → main | Starta scanning med array av valda target-ids |
| `scan:progress` | main → renderer | `{ id, name, status, size }` per target |
| `scan:complete` | main → renderer | Array med alla scan-results |
| `scan:abort` | renderer → main | Avbryt pågående scan |
| `estimate:all` | renderer → main | Snabb du-estimate av alla targets |
| `estimate:result` | main → renderer | `{ id, estimatedSize }` per target |
| `delete:items` | renderer → main | Array av `{ path, requiresAdmin }` |
| `delete:progress` | main → renderer | `{ path, success, error? }` |
| `delete:complete` | main → renderer | Summering |
| `trash:empty` | renderer → main | Töm papperskorg |
| `finder:reveal` | renderer → main | Öppna sökväg i Finder |

### Raderingslogik

```js
// User-nivå: permanent radering
fs.rmSync(path, { recursive: true, force: true })

// Admin-nivå: osascript med lösenordsdialog
execSync(`osascript -e 'do shell script "rm -rf \\"${path}\\"" with administrator privileges'`)

// Papperskorg: shell.trashItem() (om man vill flytta dit istället)
// OBS: standard-radering i Scythe är PERMANENT, inte till papperskorg
// Undantag: "Töm papperskorg"-funktionen använder shell.trashItem reverse – den rensar ~/.Trash
```

---

## 8. Preload (`preload.js`)

Exponera via `contextBridge.exposeInMainWorld('scythe', { ... })`:

```js
window.scythe = {
  startScan: (targetIds) => ipcRenderer.invoke('scan:start', targetIds),
  abortScan: () => ipcRenderer.send('scan:abort'),
  estimateAll: () => ipcRenderer.invoke('estimate:all'),
  deleteItems: (items) => ipcRenderer.invoke('delete:items', items),
  emptyTrash: () => ipcRenderer.invoke('trash:empty'),
  revealInFinder: (path) => ipcRenderer.invoke('finder:reveal', path),
  onScanProgress: (cb) => ipcRenderer.on('scan:progress', (_, data) => cb(data)),
  onEstimateResult: (cb) => ipcRenderer.on('estimate:result', (_, data) => cb(data)),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
}
```

---

## 9. State Management (React)

Använd enbart `useState` och `useReducer`. Ingen extern state-hantering.

### App-state (i `App.jsx`)

```js
const [appState, setAppState] = useState('idle') // 'idle' | 'scanning' | 'results' | 'deleting' | 'done'
const [scanResults, setScanResults] = useState([])
const [scanProgress, setScanProgress] = useState({}) // { [id]: { status, size } }
const [selectedIds, setSelectedIds] = useState(new Set())
const [enabledCategories, setEnabledCategories] = useState({}) // sparas i electron-store
const [estimates, setEstimates] = useState({}) // { [id]: estimatedSize }
const [showDeleteModal, setShowDeleteModal] = useState(false)
const [deleteResult, setDeleteResult] = useState(null)
```

---

## 10. Nyckel-UX-regler

1. **Storlekssiffror är alltid stora.** Använd `font-mono text-2xl` eller större för GB/MB-värden. Aldrig liten text för storlekar.

2. **BottomBar uppdateras i realtid** varje gång användaren bockar i/ur ett item. Ingen fördröjning.

3. **StorageRing animeras.** Använd CSS-transition på ring-fill. Varje ny selektion triggar smooth animation.

4. **Tomma kategorier visas gråade**, inte dolda. Användaren ska se att Scythe kollade.

5. **Safe: false-items** har alltid ⚠️ och warning-text. Aldrig förbockade för radering utan explicit val.

6. **Advanced-sektionen** har en tydlig visuell separator och informationsruta: *"Dessa åtgärder påverkar systemfiler och kräver administratörslösenord."*

7. **Deletions-modal är obligatorisk** – kan aldrig kringgås. Visa alltid exakt vad som raderas.

8. **Post-delete success-animationen** ska vara belönande och tydlig. Stor siffra, amber färg, känsla av prestation.

9. **Scanning kan avbrytas** när som helst. Resultat som hann skannas visas ändå.

10. **Appen ska inte krascha** vid saknade paths eller permission-errors. Hantera alltid med try/catch och visa *"Hittades inte"* eller *"Åtkomst nekad"*.

---

## 11. `utils.js`

```js
// Formatera bytes till läsbar sträng
export function formatSize(bytes) {
  if (bytes === 0) return '—'
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} KB`
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`
}

// Clsx-liknande className-helper
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Summera storlek för valda items
export function selectedSize(results, selectedIds) {
  return results
    .filter(r => selectedIds.has(r.id))
    .reduce((sum, r) => sum + r.size, 0)
}
```

---

## 12. Auto-update via GitHub Releases

Appen ska ha inbyggd auto-update som kollar GitHub Releases vid varje start.

### Installation

```bash
npm install electron-updater
```

### `main.js` – auto-update-logik

```js
const { autoUpdater } = require('electron-updater')

// Konfigurera logger (valfritt men hjälpsamt)
autoUpdater.logger = require('electron-log')
autoUpdater.logger.transports.file.level = 'info'

// Kolla efter uppdatering vid start (efter fönstret öppnats)
app.whenReady().then(() => {
  createWindow()
  if (!isDev) {
    autoUpdater.checkForUpdatesAndNotify()
  }
})

// Skicka update-events till renderer
autoUpdater.on('update-available', (info) => {
  win.webContents.send('update:available', info)
})

autoUpdater.on('update-downloaded', (info) => {
  win.webContents.send('update:downloaded', info)
})

// IPC: installera och starta om
ipcMain.on('update:install', () => {
  autoUpdater.quitAndInstall()
})
```

### `package.json` – publish-konfiguration

Lägg till i `build`-sektionen:

```json
"publish": {
  "provider": "github",
  "owner": "GITHUB_USERNAME",
  "repo": "scythe"
}
```

### React – UpdateBanner-komponent

Skapa `src/components/UpdateBanner.jsx`:

```jsx
// Visas som en diskret banner högst upp i appen när uppdatering finns
// States: 'available' | 'downloaded' | null
// 'available': "Ny version laddas ned..."
// 'downloaded': "Uppdatering klar – [Installera och starta om]"
// Styling: tunn banner under TopBar, --accent-dim bakgrund, DM Sans text
```

### Preload – exponera update-events

Lägg till i `preload.js`:

```js
onUpdateAvailable: (cb) => ipcRenderer.on('update:available', (_, info) => cb(info)),
onUpdateDownloaded: (cb) => ipcRenderer.on('update:downloaded', (_, info) => cb(info)),
installUpdate: () => ipcRenderer.send('update:install'),
```

### Publicera en release

```bash
# Bygg och ladda upp till GitHub Releases automatiskt
GH_TOKEN=your_github_token npm run publish
```

Lägg till i `package.json` scripts:

```json
"publish": "vite build && electron-builder --publish always"
```

---

## 13. `package.json` scripts

```json
{
  "scripts": {
    "dev": "concurrently -k \"vite\" \"npm run electron:dev\"",
    "electron:dev": "wait-on http://localhost:5173 && NODE_ENV=development electron .",
    "build": "vite build && electron-builder",
    "publish": "vite build && electron-builder --publish always",
    "preview": "vite preview"
  }
}
```

---

## 14. Viktiga detaljer

- **`vite.config.js`:** Sätt `base: './'` för korrekt asset-laddning i Electron production build
- **`index.html`:** Lägg Google Fonts-länken i `<head>`, sätt `<title>Scythe</title>`
- **Electron `isDev`:** Detektera via `!app.isPackaged`, ladda från `http://localhost:5173` i dev och `dist/index.html` i prod
- **`electron-store`:** Spara `enabledCategories` så toggles minns sig mellan sessioner
- **Scrollbar:** Styla custom scrollbar i `index.css` – tunn, mörk, matchar designsystemet
- **macOS-specifikt:** Lägg till `16px` padding-top i TopBar för att ge plats åt traffic light-knappar (p.g.a. `titleBarStyle: hiddenInset`)

---

*Brief version 1.1 – Scythe Mac App*
