
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClothingItem } from '@/services/clothingService';
import { cn } from '@/lib/utils';

type RecommendationCardProps = {
  title: string;
  items: ClothingItem[];
  fallbackText?: string;
  fallbackImage?: string;
  className?: string;
};

const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  title, 
  items, 
  fallbackText,
  fallbackImage,
  className 
}) => {
  const hasItems = items.length > 0;
  const randomItem = hasItems ? items[0] : null;
  
  return (
    <Card className={cn('overflow-hidden animate-scale-in', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        {hasItems ? (
          <div className="flex flex-col items-center">
            <div className="h-32 w-32 bg-muted rounded-md flex items-center justify-center overflow-hidden mb-3">
              <img 
                src={randomItem?.imageUrl || `/images/${randomItem?.type}.svg`} 
                alt={randomItem?.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = `/images/${randomItem?.type}.svg`;
                }}
              />
            </div>
            <p className="font-medium text-center">{randomItem?.name}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {items.length > 1 ? `+${items.length - 1} autres options` : ''}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {fallbackImage && (
              <div className="h-32 w-32 bg-muted rounded-md flex items-center justify-center overflow-hidden mb-3">
                <img 
                  src={fallbackImage} 
                  alt="Aucune suggestion"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <p className="text-sm text-muted-foreground text-center">
              {fallbackText || "Ajoutez des vêtements pour obtenir des recommandations"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
