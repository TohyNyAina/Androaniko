
import React from 'react';
import { ClothingItem } from '@/services/clothingService';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';

type ClothingCardProps = {
  item: ClothingItem;
  onEdit: (item: ClothingItem) => void;
  onDelete: (id: string) => void;
  className?: string;
};

const typeLabels: Record<ClothingItem['type'], string> = {
  top: 'Haut',
  bottom: 'Bas',
  outerwear: 'Extérieur',
  footwear: 'Chaussures',
  accessory: 'Accessoire'
};

const seasonLabels: Record<ClothingItem['season'], string> = {
  winter: 'Hiver',
  spring: 'Printemps',
  summer: 'Été',
  fall: 'Automne',
  all: 'Toutes saisons'
};

const getSeasonColor = (season: ClothingItem['season']): string => {
  switch (season) {
    case 'winter': return 'bg-blue-100 text-blue-800';
    case 'spring': return 'bg-green-100 text-green-800';
    case 'summer': return 'bg-yellow-100 text-yellow-800';
    case 'fall': return 'bg-orange-100 text-orange-800';
    case 'all': return 'bg-purple-100 text-purple-800';
  }
};

const getTypeColor = (type: ClothingItem['type']): string => {
  switch (type) {
    case 'top': return 'bg-indigo-100 text-indigo-800';
    case 'bottom': return 'bg-cyan-100 text-cyan-800';
    case 'outerwear': return 'bg-rose-100 text-rose-800';
    case 'footwear': return 'bg-amber-100 text-amber-800';
    case 'accessory': return 'bg-emerald-100 text-emerald-800';
  }
};

const ClothingCard: React.FC<ClothingCardProps> = ({ item, onEdit, onDelete, className }) => {
  const placeholderImage = `/images/${item.type}.svg`;
  
  return (
    <Card className={cn("overflow-hidden card-hover", className)}>
      <div className="h-40 bg-muted flex items-center justify-center overflow-hidden">
        <img 
          src={item.imageUrl || placeholderImage} 
          alt={item.name}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.currentTarget.src = placeholderImage;
          }}
        />
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-medium text-lg truncate">{item.name}</h3>
        
        <div className="flex gap-2 mt-2 flex-wrap">
          <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", getTypeColor(item.type))}>
            {typeLabels[item.type]}
          </span>
          <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", getSeasonColor(item.season))}>
            {seasonLabels[item.season]}
          </span>
        </div>
        
        {(item.minTemp !== undefined || item.maxTemp !== undefined) && (
          <p className="text-sm text-muted-foreground mt-2">
            {item.minTemp !== undefined && `${item.minTemp}°C`}
            {item.minTemp !== undefined && item.maxTemp !== undefined && " - "}
            {item.maxTemp !== undefined && `${item.maxTemp}°C`}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(item)}
          className="h-8 w-8 btn-transition"
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Modifier</span>
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(item.id)}
          className="h-8 w-8 text-destructive btn-transition"
        >
          <Trash className="h-4 w-4" />
          <span className="sr-only">Supprimer</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClothingCard;
