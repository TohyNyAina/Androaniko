
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Weather from './pages/Weather';
import Wardrobe from './pages/Wardrobe';
import NotFound from './pages/NotFound';
import InstallPrompt from './components/InstallPrompt';

function App() {
  return (
    <Router>
      <InstallPrompt />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/wardrobe" element={<Wardrobe />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
