export type ClothingItem = {
  id: string;
  name: string;
  type: 'top' | 'bottom' | 'outerwear' | 'footwear' | 'accessory';
  season: 'winter' | 'spring' | 'summer' | 'fall' | 'all';
  minTemp?: number;
  maxTemp?: number;
  imageUrl?: string;
  createdAt: number;
};

const STORAGE_KEY = 'wardrobe-items';

export const clothingService = {
  // Maka ny akanjo rehetra
  getAll: (): ClothingItem[] => {
    const items = localStorage.getItem(STORAGE_KEY);
    return items ? JSON.parse(items) : [];
  },

  // Manampy akanjo vaovao
  add: (item: Omit<ClothingItem, 'id' | 'createdAt'>): ClothingItem => {
    const newItem: ClothingItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };

    const items = clothingService.getAll();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...items, newItem]));
    
    return newItem;
  },

  // Modification akanjo
  update: (id: string, updates: Partial<Omit<ClothingItem, 'id' | 'createdAt'>>): ClothingItem | null => {
    const items = clothingService.getAll();
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) return null;
    
    const updatedItem = { ...items[itemIndex], ...updates };
    items[itemIndex] = updatedItem;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return updatedItem;
  },

  // Mamafa akanjo
  delete: (id: string): boolean => {
    const items = clothingService.getAll();
    const filteredItems = items.filter(item => item.id !== id);
    
    if (filteredItems.length === items.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredItems));
    return true;
  },

  // Manome suggestion arakaraka ny temperature
  getRecommendations: (tempC: number): {tops: ClothingItem[], bottoms: ClothingItem[], outerwear: ClothingItem[], footwear: ClothingItem[], accessory: ClothingItem[]} => {
    const items = clothingService.getAll();
    
    // Mamaritra ny saisson arakaraka ny temperature
    let season: 'winter' | 'spring' | 'summer' | 'fall' = 'spring';
    
    if (tempC < 10) {
      season = 'winter';
    } else if (tempC < 20) {
      season = 'spring';
    } else if (tempC < 30) {
      season = 'summer';
    } else {
      season = 'summer';
    }
    
    // Mifiltré ny akanjo en fonction ny saison sy temperature
    const suitableItems = items.filter(item => 
      item.season === season || 
      item.season === 'all' || 
      (item.minTemp !== undefined && item.maxTemp !== undefined && 
       tempC >= item.minTemp && tempC <= item.maxTemp)
    );
    
    // Regroupement par type
    const tops = suitableItems.filter(item => item.type === 'top');
    const bottoms = suitableItems.filter(item => item.type === 'bottom');
    const outerwear = suitableItems.filter(item => item.type === 'outerwear');
    const footwear = suitableItems.filter(item => item.type === 'footwear');
    const accessory = suitableItems.filter(item => item.type === 'accessory');
    
    // Selection au hazard
    const randomize = <T>(arr: T[]): T[] => {
      return arr.sort(() => Math.random() - 0.5);
    };
    
    return {
      tops: randomize(tops),
      bottoms: randomize(bottoms),
      outerwear: randomize(outerwear),
      footwear: randomize(footwear),
      accessory: randomize(accessory)
    };
  },

  // Recommandation par defeaut ra ohatra ka tsisy akanjo ajouté anaty garde-robe
  getDefaultRecommendations: (tempC: number): {text: string, imageUrl: string} => {
    if (tempC < 10) {
      return {
        text: "Un manteau chaud, une écharpe et des gants seraient appropriés.",
        imageUrl: "/images/cold-weather.svg" 
      };
    } else if (tempC < 20) {
      return {
        text: "Une veste légère ou un pull devrait suffire.",
        imageUrl: "/images/mild-weather.svg"
      };
    } else {
      return {
        text: "Des vêtements légers comme un t-shirt et un short sont recommandés.",
        imageUrl: "/images/hot-weather.svg"
      };
    }
  }
};
