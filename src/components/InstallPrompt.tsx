
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { pwaService } from '@/services/pwaService';
import { Download } from 'lucide-react';

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
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Afficher le toast d'installation
      toast.info('Installer l\'application', {
        description: 'Installez notre application pour une meilleure expérience',
        action: {
          label: 'Installer',
          onClick: () => handleInstallClick()
        },
        duration: 10000,
        icon: <Download className="h-4 w-4" />
      });
    };

    // Configurer l'écouteur d'événement d'installation
    pwaService.setupInstallListener(handleInstallPrompt);

    // Nettoyer l'écouteur lors du démontage
    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt as EventListener);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    try {
      // Afficher le prompt d'installation natif
      await deferredPrompt.prompt();
      
      // Attendre la décision de l'utilisateur
      const choiceResult = await deferredPrompt.userChoice;
      
      // Informer l'utilisateur en fonction de sa décision
      if (choiceResult.outcome === 'accepted') {
        toast.success('Merci d\'avoir installé notre application!');
      } else {
        toast.info('Vous pouvez installer l\'application plus tard depuis le menu de votre navigateur');
      }
      
      // Réinitialiser l'état
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Erreur lors de l\'installation:', error);
      toast.error('Une erreur est survenue lors de l\'installation');
    }
  };

  return null; // Ce composant ne rend rien visuellement
};

export default InstallPrompt;
