import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { pwaService } from '@/services/pwaService';

// Interface pour l'événement beforeinstallprompt
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Vérifier si l'application est déjà installée
    if (pwaService.isAppInstalled()) {
      return;
    }

    // Capturer l'événement beforeinstallprompt
    const handleInstallPrompt = (e: Event) => {
      e.preventDefault(); // Prévenir l'affichage du prompt par défaut
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Afficher le prompt d'installation natif via l'événement du navigateur
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice
          .then((choiceResult) => {
            // Mampahafantatra ny user arakarakan'ny fanapahankeviny
            if (choiceResult.outcome === 'accepted') {
              toast.success('Merci d\'avoir installé notre application!');
            } else {
              toast.info('Vous pouvez installer l\'application plus tard depuis le menu de votre navigateur');
            }
            // Réinitialisena ny état rehefa avy misafidy ny user
            setDeferredPrompt(null);
          })
          .catch((error) => {
            console.error('Erreur lors de l\'installation:', error);
            toast.error('Une erreur est survenue lors de l\'installation');
          });
      }
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, [deferredPrompt]);

  return null; 
};

export default InstallPrompt;
