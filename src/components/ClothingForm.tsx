import React, { useState, useEffect } from 'react';
import { ClothingItem } from '@/services/clothingService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type ClothingFormProps = {
  initialData?: Partial<ClothingItem>;
  onSubmit: (data: Omit<ClothingItem, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
};

const ClothingForm: React.FC<ClothingFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [type, setType] = useState<ClothingItem['type']>(initialData?.type || 'top');
  const [season, setSeason] = useState<ClothingItem['season']>(initialData?.season || 'all');
  const [minTemp, setMinTemp] = useState<number | undefined>(initialData?.minTemp);
  const [maxTemp, setMaxTemp] = useState<number | undefined>(initialData?.maxTemp);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');

  // Détermine les options de type en fonction de la saison sélectionnée
  const getAvailableTypes = () => {
    if (season === 'summer') {
      return ['top', 'bottom', 'footwear', 'accessory']; // Pas d'option extérieur pour l'été
    }
    if (season === 'all') {
      return ['top', 'bottom', 'outerwear', 'footwear', 'accessory']; // Toutes les options disponibles pour toutes saisons
    }
    return ['top', 'bottom', 'outerwear', 'footwear', 'accessory']; // Par défaut, toutes les options sauf extérieur pour été
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Veuillez donner un nom à ce vêtement');
      return;
    }

    onSubmit({
      name,
      type,
      season,
      minTemp,
      maxTemp,
      imageUrl: imageUrl || undefined
    });
  };

  useEffect(() => {
    // Reset type to 'top' if it's not in the available types after season change
    if (!getAvailableTypes().includes(type)) {
      setType(getAvailableTypes()[0]);
    }
  }, [season]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="name">Nom du vêtement</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: T-shirt blanc"
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select value={type} onValueChange={(value) => setType(value as ClothingItem['type'])}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableTypes().map((availableType) => (
                <SelectItem key={availableType} value={availableType}>
                  {availableType === 'top'
                    ? 'Haut'
                    : availableType === 'bottom'
                    ? 'Bas'
                    : availableType === 'outerwear'
                    ? 'Extérieur'
                    : availableType === 'footwear'
                    ? 'Chaussures'
                    : 'Accessoire'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="season">Saison</Label>
          <Select value={season} onValueChange={(value) => setSeason(value as ClothingItem['season'])}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une saison" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="winter">Hiver</SelectItem>
              <SelectItem value="spring">Printemps</SelectItem>
              <SelectItem value="summer">Été</SelectItem>
              <SelectItem value="fall">Automne</SelectItem>
              <SelectItem value="all">Toutes saisons</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minTemp">Température minimale (°C)</Label>
          <Input
            id="minTemp"
            type="number"
            value={minTemp !== undefined ? minTemp : ''}
            onChange={(e) => setMinTemp(e.target.value ? Number(e.target.value) : undefined)}
            placeholder="Ex: 10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxTemp">Température maximale (°C)</Label>
          <Input
            id="maxTemp"
            type="number"
            value={maxTemp !== undefined ? maxTemp : ''}
            onChange={(e) => setMaxTemp(e.target.value ? Number(e.target.value) : undefined)}
            placeholder="Ex: 25"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL de l'image (optionnel)</Label>
        <Input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="btn-transition">
          Annuler
        </Button>
        <Button type="submit" className="btn-transition">
          {initialData?.id ? 'Mettre à jour' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
};

export default ClothingForm;
