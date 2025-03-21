
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { pwaService } from './services/pwaService.ts'
import { toast } from 'sonner'
import { Toaster } from 'sonner'

// Configurer la détection des mises à jour de l'application
pwaService.listenForUpdates(() => {
  toast.info(
    'Une mise à jour est disponible',
    {
      description: 'Rafraîchissez la page pour voir les dernières fonctionnalités.',
      action: {
        label: 'Rafraîchir',
        onClick: () => window.location.reload()
      },
      duration: 10000
    }
  );
});

// Rendu de l'application
createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster position="top-right" />
  </>
);
