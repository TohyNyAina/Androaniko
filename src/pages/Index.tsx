import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { weatherService } from '@/services/weatherService';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const handleSearch = async () => {
    if (!location.trim()) {
      toast.error('Veuillez entrer un lieu');
      return;
    }

    setLoading(true);
    try {
      const cityName = location.split(',')[0].trim();
      await weatherService.getByCity(cityName);
      navigate(`/weather?location=${encodeURIComponent(cityName)}`);
    } catch (error) {
      toast.error('Impossible de récupérer la météo. Vérifiez votre entrée.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);

    if (value.length > 2) {
      setLoadingSuggestions(true);
      try {
        const suggestions = await weatherService.getCityAutocomplete(value);
        setSuggestions(suggestions);
      } catch (error) {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      toast.error('La géolocalisation n\'est pas supportée par votre navigateur.');
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const weatherData = await weatherService.getByCoordinates(latitude, longitude);
          setLocation(weatherData.location.name);
          navigate(`/weather?location=${encodeURIComponent(weatherData.location.name)}`);
        } catch (error) {
          toast.error('Impossible de récupérer la météo pour votre position.');
        } finally {
          setLoadingLocation(false);
        }
      },
      () => {
        toast.error('Impossible de récupérer votre position.');
        setLoadingLocation(false);
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-10 animate-fade-in">
            <img src="/images/Androany.png" alt="Logo Androany" className="mx-auto mb-4 h-16" />
            <h1 className="text-4xl font-light tracking-tight mb-2">Androany</h1>
            <p className="text-muted-foreground">
              Trouvez quoi porter en fonction de la météo
            </p>
          </div>

          <div className="space-y-6 animate-slide-up">
            <div className="space-y-2">
              <Label htmlFor="location">Votre emplacement</Label>
              <div className="relative">
                <Input
                  id="location"
                  placeholder="Entrez une ville ou un code postal"
                  value={location}
                  onChange={handleLocationInput}
                  className="pr-10"
                />
                {loadingSuggestions && (
                  <div className="absolute right-10 top-0 h-full flex items-center">
                    <Loader2 className="animate-spin h-4 w-4" />
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={handleGeolocation}
                  disabled={loadingLocation}
                  className="absolute right-0 top-0 h-full aspect-square btn-transition"
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>

              {suggestions.length > 0 && (
                <ul className="mt-1 border rounded-md overflow-hidden bg-background shadow-sm divide-y animate-fade-in">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="p-2 cursor-pointer hover:bg-secondary transition-colors"
                      onClick={() => {
                        setLocation(suggestion);
                        setSuggestions([]);
                      }}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Button 
              onClick={handleSearch} 
              disabled={loading || !location.trim()}
              className="w-full btn-transition"
            >
              {loading ? 'Chargement...' : 'Afficher la météo'}
              {!loading && <Search className="ml-2 h-4 w-4" />}
            </Button>

            <div className="text-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/wardrobe')}
                className="text-muted-foreground hover:text-foreground btn-transition"
              >
                Gérer ma garde-robe
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Androany by Tohy Ny Aina.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
