declare global {
  interface WindowEventMap {
    beforeinstallprompt: Event;
  }
}

export const pwaService = {
  
  isAppInstalled: (): boolean => {
    return window.matchMedia('(display-mode: standalone)').matches;
  },

  
  canBeInstalled: (): boolean => {
    return 'BeforeInstallPromptEvent' in window;
  },

  
  setupInstallListener: (callback: (event: Event) => void): void => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      callback(e);
    });
  },

  
  listenForUpdates: (onUpdateFound: () => void): void => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        onUpdateFound();
      });
    }
  }
};
