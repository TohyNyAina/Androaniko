
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WeatherData } from '@/services/weatherService';
import { cn } from '@/lib/utils';

type WeatherCardProps = {
  weather: WeatherData;
  className?: string;
};

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, className }) => {
  const getWeatherBackground = (temp: number) => {
    if (temp < 0) return 'from-blue-500 to-blue-700';
    if (temp < 10) return 'from-blue-400 to-blue-600';
    if (temp < 20) return 'from-green-400 to-blue-400';
    if (temp < 30) return 'from-yellow-400 to-orange-400';
    return 'from-orange-400 to-red-500';
  };

  return (
    <Card className={cn('overflow-hidden animate-scale-in', className)}>
      <div className={cn(
        'p-6 text-white bg-gradient-to-br',
        getWeatherBackground(weather.current.temp_c)
      )}>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold">{weather.location.name}</h2>
            <p className="text-sm opacity-90">{weather.location.region}, {weather.location.country}</p>
          </div>
          
          <div className="flex items-center">
            <img 
              src={`https:${weather.current.condition.icon}`} 
              alt={weather.current.condition.text}
              className="w-16 h-16"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-end">
            <span className="text-5xl font-light">{Math.round(weather.current.temp_c)}</span>
            <span className="text-2xl">°C</span>
          </div>
          <p className="mt-1">{weather.current.condition.text}</p>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Ressenti</p>
            <p className="font-medium">{weather.current.feelslike_c}°C</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Humidité</p>
            <p className="font-medium">{weather.current.humidity}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Vent</p>
            <p className="font-medium">{weather.current.wind_kph} km/h</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
