# SCYTHE – Claude Code Project Brief

Du är en senior macOS-utvecklare och UX-designer. Bygg appen **Scythe** – ett Electron-baserat Mac-verktyg för att skanna, visualisera och permanent radera cache-filer och skräpdata. Följ denna brief exakt.

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
├── main.js                  ← Electron huvudprocess
├── preload.js               ← Context bridge
└── src/
    ├── main.jsx             ← React entry point
    ├── index.css            ← Tailwind + CSS-variabler
    ├── utils.js             ← formatSize(), cn() etc.
    └── components/
        ├── TopBar.jsx       ← Fönsterram + app-titel + scan-knapp
        ├── StorageRing.jsx  ← Animerad cirkel som visar frigjort utrymme
        ├── CategoryToggle.jsx ← Inkl/exkl-toggle per kategori före scan
        ├── ScanProgress.jsx ← Progress-visning under scanning
        ├── ResultList.jsx   ← Lista med scan-resultat
        ├── CategorySection.jsx ← Grupperad sektion i resultatlistan
        ├── ScanItem.jsx     ← Enskild rad i resultatlistan
        ├── BottomBar.jsx    ← Löpande räknare + radera-knapp
        ├── DeleteModal.jsx  ← Bekräftelse-modal vid radering
        └── EmptyState.jsx   ← Visas innan första scan
```

---

## 4. Design System

### 4.0 UX-inspiration – Claude-appen som referens

Scythes UX ska påminna om **Claude.app och liknande moderna AI/utility-appar** – inte om traditionella system-utilities. Det innebär:

**Layout-principer:**
- Tydliga, separerade **boxar/kort** med borders och subtil bakgrundsfärg för varje sektion
- Generöst **whitespace** – aldrig trångt, aldrig rörigt
- **Sidebar + main content**-struktur (inte fullscreen-chaos)
- Varje funktionsblock är tydligt avgränsat med `border`, `border-radius: 12px`, och lätt `background` mot huvudbakgrunden

**Komponentkänsla:**
- Knappar: Rundade (`rounded-xl`), tydlig hierarki – primär, sekundär, ghost
- Inputs/toggles: Mjuka, väldefinierade, inte systemdefault
- Listor: Varje rad är ett eget kort med hover-state, inte bare text på bakgrund
- Ikoner: Konsekvent storlek, subtil färg, aldrig dekorativa utan syfte

**Typografisk hierarki:**
- En tydlig rubriknivå per sektion
- Storlekar (GB/MB) bryter alltid ut som **hero-element** – stor, mono, accentfärg
- Beskrivningstexter är alltid muted/sekundär färg

**Rörelsespråk:**
- Subtila fade-in vid state-ändringar
- Smooth progress-animationer
- Ingen "flashig" animation – allt ska kännas purposeful och lugnt

**Exempel på Claude-app-känslan:**
```
┌─────────────────────────────────┐
│  Sektionsrubrik          Action │  ← tydlig header i boxen
├─────────────────────────────────┤
│  Item 1              12.4 GB →  │  ← varje rad är väldefinierad
│  Item 2               3.2 GB →  │
│  Item 3               0.8 GB →  │
└─────────────────────────────────┘
```

### 4.1 Färgpalett

Appen följer macOS **dark/light mode** automatiskt via `prefers-color-scheme`. Definiera alla färger som CSS-variabler i `:root` och `[data-theme="light"]`.

```css
/* DARK (default) */
:root {
  --bg:           #07080F;   /* Djup space-svart med blå ton */
  --bg-secondary: #0C0E1A;   /* Sekundär bakgrund */
  --surface:      #111328;   /* Kortytor, panels */
  --surface-hover:#161932;   /* Hover-state på ytor */
  --border:       #1C1F3A;   /* Subtila borders */
  --border-strong:#252850;   /* Tydligare borders */

  --accent-green: #00E57A;   /* Kall grön – frigjort utrymme, success */
  --accent-blue:  #0096FF;   /* Space blå – primär action, info */
  --accent-glow-green: rgba(0, 229, 122, 0.15);
  --accent-glow-blue:  rgba(0, 150, 255, 0.15);

  --warning:      #FFB800;   /* Varningar, "unsafe to delete" */
  --danger:       #FF453A;   /* Radera-knappar, destruktiva actions */
  --danger-glow:  rgba(255, 69, 58, 0.15);

  --text:         #E8EAFF;   /* Primär text */
  --text-secondary: #8890C0; /* Sekundär text, beskrivningar */
  --text-muted:   #454870;   /* Muted, placeholders */
}

/* LIGHT */
[data-theme="light"] {
  --bg:           #F0F2FF;
  --bg-secondary: #E8EAF6;
  --surface:      #FFFFFF;
  --surface-hover:#F4F5FF;
  --border:       #D8DAEF;
  --border-strong:#C0C3E0;
  --text:         #0A0C1F;
  --text-secondary: #4A4E80;
  --text-muted:   #9096C0;
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

### 4.3 Gradient

Scythes signaturgradient används på accent-element, ikonen och StorageRing:

```css
--gradient-scythe: linear-gradient(135deg, #00E57A 0%, #0096FF 100%);
```

### 4.4 Ikonen (SVG)

Rita appikonen som en **stiliserad "S"-form gjord av en lie**. Konstruktion:

- Bakgrund: Mörk cirkel `#0C0E1A` med subtil inner glow
- S-kurvan: En sammanhängande kurva i `--gradient-scythe` (grön→blå), 4–5px stroke, rundade ändar
- Eggspetsen: Liten vass triangel i `--accent-green` längst ned på S-kurvan
- Skaftet: Rakt element i blå ton som genomskär S-kurvan diagonalt
- Exportera som `icon.svg` i projektets rot

---

## 5. App-flöde & UX

### 5.1 States

Appen har fyra tydliga states:

```
IDLE → SCANNING → RESULTS → (DELETING →) IDLE
```

### 5.2 IDLE – Startvy

Visas när appen öppnas och efter avslutad radering.

**Layout:**
- Centrerat i content-ytan
- Scythe-ikonen (stor, ~120px)
- Rubrik: *"Ready to harvest"* i Syne 700
- Undertext: *"Kör en scanning för att hitta filer som kan rensas"*
- Kategorilista med **inkl/exkl-toggles** (se avsnitt 6)
  - Alla kategorier är **förbokade (ON)** som standard
  - Inställningen sparas via `electron-store`
  - Varje toggle visar en **uppskattad storlek** (snabb `du`-check, körs passivt i bakgrunden vid IDLE)
- Stor primärknapp: **"Kör scanning"** med `--gradient-scythe` bakgrund

### 5.3 SCANNING – Progressvy

- Ersätter kategorilistan med en **progress-sektion**
- Visar aktuell kategori som skannas: *"Skannar Xcode DerivedData..."*
- Progressbar (gradient grön→blå) som fylls vartefter kategorier slutförs
- Varje kategori bockas av med checkmark + storlek när den är klar
- StorageRing börjar animeras och räknas upp i realtid
- Knapp: **"Avbryt"** (avbryter pågående scan)

### 5.4 RESULTS – Resultatvy

**Huvud-layout (3 delar):**

```
┌─────────────────────────────────────────────┐
│  TopBar: [●●●] Scythe          [Ny scanning]│
├──────────────┬──────────────────────────────┤
│              │                              │
│ StorageRing  │  Kategorisektioner med items │
│   (vänster)  │  (scrollbar höger)           │
│              │                              │
├──────────────┴──────────────────────────────┤
│  BottomBar: X valda • Y GB  [🌾 Harvest]    │
└─────────────────────────────────────────────┘
```

**StorageRing (vänster panel, sticky):**
- Animerad ring/donut chart ~200px diameter
- Visar totalt hittad storlek i centrum: stor siffra, JetBrains Mono
- Under siffran: *"kan rensas"* i DM Sans muted
- Under ringen: *"Valt: X GB"* som uppdateras i realtid
- Grön→blå gradient på ring-fill
- Liten legend: färgkodade prickar per kategori

**Resultatlistan (höger, scrollbar):**
- Grupperad per kategori med sticky section-header
- Section-header: kategorinamn + total storlek + "Välj alla i kategori"-checkbox
- Varje item-rad: checkbox | ikon | namn | beskrivning | **storlek (stor, mono)** | "Visa i Finder"-ikon
- Items sorteras: störst storlek överst
- Items med `safe: false` markeras med ⚠️-ikon och warning-färg
- Items som inte existerar på datorn visas gråade med *"Hittades inte"*
- Kategorin **Avancerat** har en tydlig separator och varningstext

### 5.5 BottomBar (alltid synlig i RESULTS)

- Vänster: `"5 valda • 12.4 GB frigörs"` – uppdateras live
- Höger: Knapp **"🌾 Harvest"** i danger-röd (destruktiv action)
- Extra: **"Töm papperskorg (2.1 GB)"** som sekundär knapp om papperskorgen har innehåll

### 5.6 DeleteModal – Bekräftelse

Visas alltid innan radering sker.

- Rubrik: *"Permanent radering"* med ⚠️
- Lista på vad som ska raderas med storlekar
- **Stor tydlig varning:** *"Dessa filer kan inte återställas. De raderas permanent, inte till papperskorgen."*
- För admin-items: *"macOS kommer be om ditt lösenord"*
- Knapp: **"Avbryt"** | **"Radera permanent (X GB)"** (danger-röd)

### 5.7 Post-delete

- Animerad **"success"-state** med StorageRing som fylls i grönt
- Stor siffra: *"14.3 GB frigjort"*
- Lista på vad som rensades med ✓ checkmarks
- Knapp: *"Kör ny scanning"*

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
  backgroundColor: '#07080F',
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

8. **Post-delete success-animationen** ska vara belönande och tydlig. Stor siffra, grön färg, känsla av prestation.

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
// Styling: tunn banner under TopBar, accent-blå bakgrund, DM Sans text
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
