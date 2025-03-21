
// Service pour gérer les fonctionnalités PWA

// Type pour l'événement BeforeInstallPrompt
declare global {
  interface WindowEventMap {
    beforeinstallprompt: Event;
  }
}

export const pwaService = {
  // Vérifie si l'application est installée
  isAppInstalled: (): boolean => {
    return window.matchMedia('(display-mode: standalone)').matches;
  },

  // Détermine si l'application peut être installée
  canBeInstalled: (): boolean => {
    return 'BeforeInstallPromptEvent' in window;
  },

  // Configure un écouteur pour l'événement d'installation
  setupInstallListener: (callback: (event: Event) => void): void => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      callback(e);
    });
  },

  // Écoute les mises à jour du service worker
  listenForUpdates: (onUpdateFound: () => void): void => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        onUpdateFound();
      });
    }
  }
};
