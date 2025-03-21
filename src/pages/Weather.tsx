import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { weatherService, WeatherData } from '@/services/weatherService';
import { clothingService } from '@/services/clothingService';
import WeatherCard from '@/components/WeatherCard';
import RecommendationCard from '@/components/RecommendationCard';
import { ArrowLeft, RefreshCw, ShoppingBag, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Weather = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locationParam = searchParams.get('location');

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Fonction pour récupérer la météo
  const fetchWeather = async () => {
    if (!locationParam) {
      navigate('/');
      return;
    }

    setLoading(true);
    try {
      const weatherData = await weatherService.getByCity(locationParam);
      setWeather(weatherData);
    } catch (error) {
      toast.error('Impossible de récupérer la météo. Veuillez réessayer.');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  // Rafraîchir les données météo
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchWeather();
      toast.success('Météo mise à jour');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [locationParam]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const recommendations = clothingService.getRecommendations(weather.current.temp_c);
  const defaultRec = clothingService.getDefaultRecommendations(weather.current.temp_c);
  const hasItems = recommendations.tops.length || recommendations.bottoms.length || recommendations.outerwear.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="border-b bg-white">
        <div className="container py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')} className="btn-transition">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>

          {/* Menu Burger sur Mobile */}
          <div className="md:hidden">
            <Button variant="ghost" onClick={() => setMenuOpen(!menuOpen)} className="btn-transition">
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Boutons pour Grand Écran */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn-transition"
            >
              <RefreshCw className={cn('h-4 w-4 mr-2', refreshing && 'animate-spin')} />
              Actualiser
            </Button>

            <Button variant="ghost" onClick={() => navigate('/wardrobe')} className="btn-transition">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Garde-robe
            </Button>
          </div>
        </div>

        {/* Menu Mobile */}
        {menuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="container py-2 flex flex-col gap-2">
              <Button
                variant="ghost"
                onClick={handleRefresh}
                disabled={refreshing}
                className="btn-transition"
              >
                <RefreshCw className={cn('h-4 w-4 mr-2', refreshing && 'animate-spin')} />
                Actualiser
              </Button>

              <Button variant="ghost" onClick={() => navigate('/wardrobe')} className="btn-transition">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Garde-robe
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Contenu principal */}
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Carte météo */}
          <WeatherCard weather={weather} className="mb-8" />

          <h2 className="text-2xl font-light mb-4">Suggestions pour aujourd'hui</h2>

          {!hasItems ? (
            <div className="bg-muted/50 rounded-lg p-6 text-center">
              <p className="text-muted-foreground mb-4">{defaultRec.text}</p>
              <Button onClick={() => navigate('/wardrobe')} className="btn-transition">
                Ajouter des vêtements
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <RecommendationCard
                title="Haut"
                items={recommendations.tops}
                fallbackText="Ajoutez des hauts à votre garde-robe"
                fallbackImage="/images/top.svg"
              />
              <RecommendationCard
                title="Bas"
                items={recommendations.bottoms}
                fallbackText="Ajoutez des bas à votre garde-robe"
                fallbackImage="/images/bottom.svg"
              />
              <RecommendationCard
                title="Vêtement d'extérieur"
                items={recommendations.outerwear}
                fallbackText="Ajoutez des vêtements d'extérieur"
                fallbackImage="/images/outerwear.svg"
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Weather;
