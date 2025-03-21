
import axios from 'axios';

export type WeatherData = {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_kph: number;
    humidity: number;
    feelslike_c: number;
  };
};

export type LocationSuggestion = {
  name: string;
  region: string;
  country: string;
  id: number;
};

// Use the provided API key
const apiKey = "ee5e0f4ea27e4f45b00160822242208";

export const weatherService = {
  getByCity: async (city: string): Promise<WeatherData> => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=fr`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Impossible de récupérer la météo. Vérifiez votre entrée.');
    }
  },

  getByCoordinates: async (latitude: number, longitude: number): Promise<WeatherData> => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&lang=fr`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data by coordinates:', error);
      throw new Error('Impossible de récupérer la météo pour votre position.');
    }
  },

  getCityAutocomplete: async (query: string): Promise<string[]> => {
    if (query.length < 2) return [];
    
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`
      );
      
      // Format les résultats pour afficher ville, région, pays
      return response.data.map((item: LocationSuggestion) => 
        `${item.name}, ${item.region}, ${item.country}`
      );
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      return [];
    }
  }
};
