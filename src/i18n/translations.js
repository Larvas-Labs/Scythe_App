export const LANGUAGES = {
  en: 'English',
  sv: 'Svenska',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
}

export const translations = {
  en: {
    // Sidebar
    'sidebar.newScan':    'New scan',
    'sidebar.scanAreas':  'Scan areas',
    'sidebar.settings':   'Settings',
    'sidebar.canBeFreed': 'can be freed',

    // Categories
    'cat.user':      'Caches',
    'cat.browsers':  'Browsers',
    'cat.developer': 'Developer',
    'cat.apps':      'Apps',
    'cat.advanced':  'Advanced',

    // Settings popup
    'settings.appearance':        'Appearance',
    'settings.theme':             'Theme',
    'settings.toLightMode':       'Switch to light mode',
    'settings.toDarkMode':        'Switch to dark mode',
    'settings.updates':           'Updates',
    'settings.version':           'Version',
    'settings.latestVersion':     'Latest version',
    'settings.checkConnection':   'Check connection',
    'settings.searching':         'Searching...',
    'settings.newVersionAvailable': 'New version available: v{version}',
    'settings.update':            'Update',
    'settings.downloading':       'Downloading update...',
    'settings.updateInstalled':   'Update installed',
    'settings.restartApp':        'Restart app',
    'settings.quitApp':           'Quit app',
    'settings.language':          'Language',
    'settings.activeLanguage':    'Active language',

    // Update banner
    'banner.newVersion':       'New version available',
    'banner.download':         'Download update',
    'banner.hide':             'Hide',
    'banner.downloading':      'Downloading update...',
    'banner.updateInstalled':  'Update installed',
    'banner.restartApp':       'Restart app',
    'banner.quitApp':          'Quit app',

    // Idle view
    'idle.title':    'Ready to harvest',
    'idle.subtitle': 'Select areas in the sidebar and start scanning',
    'idle.button':   'Start scan',

    // Scan progress
    'scan.title':    'Scanning your Mac...',
    'scan.scanning': 'Scanning {name}...',
    'scan.progress': '{done} of {total} areas done',
    'scan.abort':    'Cancel',

    // Deleting state
    'deleting.title':    'Deleting...',
    'deleting.subtitle': 'Please wait while files are permanently deleted',

    // Bottom bar
    'bottombar.selected':    '{n} selected',
    'bottombar.freed':       'will be freed',
    'bottombar.selectFiles': 'Select files to clean',
    'bottombar.emptyTrash':  'Empty trash ({size})',

    // Done view
    'done.freed':   'freed',
    'done.newScan': 'Run new scan',

    // Delete modal
    'modal.title':     'Permanent deletion',
    'modal.warning':   'These files cannot be recovered. They will be permanently deleted, not moved to trash.',
    'modal.adminNote': 'macOS will ask for your password to delete system files.',
    'modal.cancel':    'Cancel',
    'modal.confirm':   'Delete permanently ({size})',

    // Category section
    'section.advanced.title': '⚠️ Advanced — System files',
    'section.advanced.desc':  'These actions affect system files and require an administrator password.',

    // Scan item
    'item.notFound':     'Not found',
    'item.showInFinder': 'Show in Finder',
  },

  sv: {
    'sidebar.newScan':    'Ny scan',
    'sidebar.scanAreas':  'Skanna områden',
    'sidebar.settings':   'Inställningar',
    'sidebar.canBeFreed': 'kan frigöras',

    'cat.user':      'Cacher',
    'cat.browsers':  'Webbläsare',
    'cat.developer': 'Utvecklare',
    'cat.apps':      'Appar',
    'cat.advanced':  'Avancerat',

    'settings.appearance':          'Utseende',
    'settings.theme':               'Tema',
    'settings.toLightMode':         'Byt till ljust läge',
    'settings.toDarkMode':          'Byt till mörkt läge',
    'settings.updates':             'Uppdateringar',
    'settings.version':             'Version',
    'settings.latestVersion':       'Senaste versionen',
    'settings.checkConnection':     'Kontrollera anslutning',
    'settings.searching':           'Söker...',
    'settings.newVersionAvailable': 'Ny version tillgänglig: v{version}',
    'settings.update':              'Uppdatera',
    'settings.downloading':         'Hämtar uppdatering...',
    'settings.updateInstalled':     'Uppdatering installerad',
    'settings.restartApp':          'Starta om app',
    'settings.quitApp':             'Avsluta app',
    'settings.language':            'Språk',
    'settings.activeLanguage':      'Aktivt språk',

    'banner.newVersion':      'Ny version tillgänglig',
    'banner.download':        'Hämta version',
    'banner.hide':            'Dölj',
    'banner.downloading':     'Hämtar uppdatering...',
    'banner.updateInstalled': 'Uppdatering installerad',
    'banner.restartApp':      'Starta om app',
    'banner.quitApp':         'Avsluta app',

    'idle.title':    'Ready to harvest',
    'idle.subtitle': 'Välj områden i sidebaren och kör scanning',
    'idle.button':   'Kör scanning',

    'scan.title':    'Skannar din Mac...',
    'scan.scanning': 'Skannar {name}...',
    'scan.progress': '{done} av {total} områden klara',
    'scan.abort':    'Avbryt',

    'deleting.title':    'Raderar...',
    'deleting.subtitle': 'Vänta medan filerna raderas permanent',

    'bottombar.selected':    '{n} valda',
    'bottombar.freed':       'frigörs',
    'bottombar.selectFiles': 'Välj filer att rensa',
    'bottombar.emptyTrash':  'Töm papperskorg ({size})',

    'done.freed':   'frigjort',
    'done.newScan': 'Kör ny scanning',

    'modal.title':     'Permanent radering',
    'modal.warning':   'Dessa filer kan inte återställas. De raderas permanent, inte till papperskorgen.',
    'modal.adminNote': 'macOS kommer be om ditt lösenord för att radera systemfilerna.',
    'modal.cancel':    'Avbryt',
    'modal.confirm':   'Radera permanent ({size})',

    'section.advanced.title': '⚠️ Avancerat — Systemfiler',
    'section.advanced.desc':  'Dessa åtgärder påverkar systemfiler och kräver administratörslösenord.',

    'item.notFound':     'Hittades inte',
    'item.showInFinder': 'Visa i Finder',
  },

  de: {
    'sidebar.newScan':    'Neuer Scan',
    'sidebar.scanAreas':  'Bereiche scannen',
    'sidebar.settings':   'Einstellungen',
    'sidebar.canBeFreed': 'freizugeben',

    'cat.user':      'Caches',
    'cat.browsers':  'Browser',
    'cat.developer': 'Entwickler',
    'cat.apps':      'Apps',
    'cat.advanced':  'Erweitert',

    'settings.appearance':          'Darstellung',
    'settings.theme':               'Design',
    'settings.toLightMode':         'Helles Design',
    'settings.toDarkMode':          'Dunkles Design',
    'settings.updates':             'Updates',
    'settings.version':             'Version',
    'settings.latestVersion':       'Neueste Version',
    'settings.checkConnection':     'Verbindung prüfen',
    'settings.searching':           'Suche...',
    'settings.newVersionAvailable': 'Neue Version verfügbar: v{version}',
    'settings.update':              'Aktualisieren',
    'settings.downloading':         'Wird heruntergeladen...',
    'settings.updateInstalled':     'Update installiert',
    'settings.restartApp':          'App neu starten',
    'settings.quitApp':             'App beenden',
    'settings.language':            'Sprache',
    'settings.activeLanguage':      'Aktive Sprache',

    'banner.newVersion':      'Neue Version verfügbar',
    'banner.download':        'Herunterladen',
    'banner.hide':            'Ausblenden',
    'banner.downloading':     'Wird heruntergeladen...',
    'banner.updateInstalled': 'Update installiert',
    'banner.restartApp':      'App neu starten',
    'banner.quitApp':         'App beenden',

    'idle.title':    'Ready to harvest',
    'idle.subtitle': 'Bereiche in der Seitenleiste wählen und Scan starten',
    'idle.button':   'Scan starten',

    'scan.title':    'Mac wird gescannt...',
    'scan.scanning': '{name} wird gescannt...',
    'scan.progress': '{done} von {total} Bereichen abgeschlossen',
    'scan.abort':    'Abbrechen',

    'deleting.title':    'Wird gelöscht...',
    'deleting.subtitle': 'Bitte warten, Dateien werden permanent gelöscht',

    'bottombar.selected':    '{n} ausgewählt',
    'bottombar.freed':       'werden freigegeben',
    'bottombar.selectFiles': 'Dateien zum Bereinigen auswählen',
    'bottombar.emptyTrash':  'Papierkorb leeren ({size})',

    'done.freed':   'freigegeben',
    'done.newScan': 'Neuen Scan starten',

    'modal.title':     'Permanentes Löschen',
    'modal.warning':   'Diese Dateien können nicht wiederhergestellt werden. Sie werden permanent gelöscht, nicht in den Papierkorb.',
    'modal.adminNote': 'macOS fordert Ihr Passwort an, um Systemdateien zu löschen.',
    'modal.cancel':    'Abbrechen',
    'modal.confirm':   'Permanent löschen ({size})',

    'section.advanced.title': '⚠️ Erweitert — Systemdateien',
    'section.advanced.desc':  'Diese Aktionen betreffen Systemdateien und erfordern ein Administratorpasswort.',

    'item.notFound':     'Nicht gefunden',
    'item.showInFinder': 'Im Finder anzeigen',
  },

  fr: {
    'sidebar.newScan':    'Nouveau scan',
    'sidebar.scanAreas':  'Scanner les zones',
    'sidebar.settings':   'Paramètres',
    'sidebar.canBeFreed': 'libérables',

    'cat.user':      'Caches',
    'cat.browsers':  'Navigateurs',
    'cat.developer': 'Développeur',
    'cat.apps':      'Applications',
    'cat.advanced':  'Avancé',

    'settings.appearance':          'Apparence',
    'settings.theme':               'Thème',
    'settings.toLightMode':         'Mode clair',
    'settings.toDarkMode':          'Mode sombre',
    'settings.updates':             'Mises à jour',
    'settings.version':             'Version',
    'settings.latestVersion':       'Dernière version',
    'settings.checkConnection':     'Vérifier la connexion',
    'settings.searching':           'Recherche...',
    'settings.newVersionAvailable': 'Nouvelle version : v{version}',
    'settings.update':              'Mettre à jour',
    'settings.downloading':         'Téléchargement...',
    'settings.updateInstalled':     'Mise à jour installée',
    'settings.restartApp':          'Redémarrer l\'app',
    'settings.quitApp':             'Quitter l\'app',
    'settings.language':            'Langue',
    'settings.activeLanguage':      'Langue active',

    'banner.newVersion':      'Nouvelle version disponible',
    'banner.download':        'Télécharger',
    'banner.hide':            'Masquer',
    'banner.downloading':     'Téléchargement...',
    'banner.updateInstalled': 'Mise à jour installée',
    'banner.restartApp':      'Redémarrer l\'app',
    'banner.quitApp':         'Quitter l\'app',

    'idle.title':    'Ready to harvest',
    'idle.subtitle': 'Choisissez les zones dans la barre latérale et lancez le scan',
    'idle.button':   'Lancer le scan',

    'scan.title':    'Analyse de votre Mac...',
    'scan.scanning': 'Analyse de {name}...',
    'scan.progress': '{done} sur {total} zones terminées',
    'scan.abort':    'Annuler',

    'deleting.title':    'Suppression...',
    'deleting.subtitle': 'Veuillez patienter pendant la suppression permanente',

    'bottombar.selected':    '{n} sélectionnés',
    'bottombar.freed':       'seront libérés',
    'bottombar.selectFiles': 'Sélectionner des fichiers à nettoyer',
    'bottombar.emptyTrash':  'Vider la corbeille ({size})',

    'done.freed':   'libérés',
    'done.newScan': 'Nouveau scan',

    'modal.title':     'Suppression permanente',
    'modal.warning':   'Ces fichiers ne peuvent pas être récupérés. Ils seront supprimés définitivement, pas mis à la corbeille.',
    'modal.adminNote': 'macOS demandera votre mot de passe pour supprimer les fichiers système.',
    'modal.cancel':    'Annuler',
    'modal.confirm':   'Supprimer définitivement ({size})',

    'section.advanced.title': '⚠️ Avancé — Fichiers système',
    'section.advanced.desc':  'Ces actions affectent les fichiers système et nécessitent un mot de passe administrateur.',

    'item.notFound':     'Introuvable',
    'item.showInFinder': 'Afficher dans le Finder',
  },

  es: {
    'sidebar.newScan':    'Nuevo escaneo',
    'sidebar.scanAreas':  'Escanear áreas',
    'sidebar.settings':   'Configuración',
    'sidebar.canBeFreed': 'se pueden liberar',

    'cat.user':      'Cachés',
    'cat.browsers':  'Navegadores',
    'cat.developer': 'Desarrollador',
    'cat.apps':      'Aplicaciones',
    'cat.advanced':  'Avanzado',

    'settings.appearance':          'Apariencia',
    'settings.theme':               'Tema',
    'settings.toLightMode':         'Modo claro',
    'settings.toDarkMode':          'Modo oscuro',
    'settings.updates':             'Actualizaciones',
    'settings.version':             'Versión',
    'settings.latestVersion':       'Última versión',
    'settings.checkConnection':     'Verificar conexión',
    'settings.searching':           'Buscando...',
    'settings.newVersionAvailable': 'Nueva versión disponible: v{version}',
    'settings.update':              'Actualizar',
    'settings.downloading':         'Descargando actualización...',
    'settings.updateInstalled':     'Actualización instalada',
    'settings.restartApp':          'Reiniciar app',
    'settings.quitApp':             'Salir de la app',
    'settings.language':            'Idioma',
    'settings.activeLanguage':      'Idioma activo',

    'banner.newVersion':      'Nueva versión disponible',
    'banner.download':        'Descargar actualización',
    'banner.hide':            'Ocultar',
    'banner.downloading':     'Descargando actualización...',
    'banner.updateInstalled': 'Actualización instalada',
    'banner.restartApp':      'Reiniciar app',
    'banner.quitApp':         'Salir de la app',

    'idle.title':    'Ready to harvest',
    'idle.subtitle': 'Elige áreas en la barra lateral y comienza el escaneo',
    'idle.button':   'Iniciar escaneo',

    'scan.title':    'Escaneando tu Mac...',
    'scan.scanning': 'Escaneando {name}...',
    'scan.progress': '{done} de {total} áreas completadas',
    'scan.abort':    'Cancelar',

    'deleting.title':    'Eliminando...',
    'deleting.subtitle': 'Espera mientras los archivos se eliminan permanentemente',

    'bottombar.selected':    '{n} seleccionados',
    'bottombar.freed':       'se liberarán',
    'bottombar.selectFiles': 'Selecciona archivos para limpiar',
    'bottombar.emptyTrash':  'Vaciar papelera ({size})',

    'done.freed':   'liberados',
    'done.newScan': 'Nuevo escaneo',

    'modal.title':     'Eliminación permanente',
    'modal.warning':   'Estos archivos no se pueden recuperar. Se eliminarán permanentemente, no a la papelera.',
    'modal.adminNote': 'macOS solicitará tu contraseña para eliminar archivos del sistema.',
    'modal.cancel':    'Cancelar',
    'modal.confirm':   'Eliminar permanentemente ({size})',

    'section.advanced.title': '⚠️ Avanzado — Archivos del sistema',
    'section.advanced.desc':  'Estas acciones afectan archivos del sistema y requieren contraseña de administrador.',

    'item.notFound':     'No encontrado',
    'item.showInFinder': 'Mostrar en Finder',
  },
}
