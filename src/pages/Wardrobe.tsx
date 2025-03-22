import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { clothingService, ClothingItem } from '@/services/clothingService';
import ClothingCard from '@/components/ClothingCard';
import ClothingForm from '@/components/ClothingForm';
import { ArrowLeft, Home, Plus, Search, Shirt } from 'lucide-react';
import { cn } from '@/lib/utils';

const Wardrobe = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ClothingItem[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSeason, setFilterSeason] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<ClothingItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [items, filterType, filterSeason, searchQuery]);

  const loadItems = () => {
    const loadedItems = clothingService.getAll();
    setItems(loadedItems);
  };

  const applyFilters = () => {
    let filtered = [...items];

    // Filtrage type
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }

    // Filtrage saison
    if (filterSeason !== 'all') {
      filtered = filtered.filter(item => item.season === filterSeason || item.season === 'all');
    }

    // Recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) => b.createdAt - a.createdAt);

    setFilteredItems(filtered);
  };

  const delayedToast = (message: string) => {
    setTimeout(() => {
      toast.success(message);
    }, 500);
  };

  const handleAddItem = (item: Omit<ClothingItem, 'id' | 'createdAt'>) => {
    clothingService.add(item);
    loadItems();
    setIsFormOpen(false);
    delayedToast('Vêtement ajouté');
  };

  const handleUpdateItem = (item: Omit<ClothingItem, 'id' | 'createdAt'>) => {
    if (currentItem) {
      clothingService.update(currentItem.id, item);
      loadItems();
      setIsFormOpen(false);
      setCurrentItem(null);
      delayedToast('Vêtement mis à jour');
    }
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      clothingService.delete(itemToDelete);
      loadItems();
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
      delayedToast('Vêtement supprimé');
    }
  };

  const handleEditItem = (item: ClothingItem) => {
    setCurrentItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    setItemToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white fixed top-0 left-0 right-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')} className="btn-transition">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Accueil
          </Button>

          <Button onClick={() => {
            setCurrentItem(null);
            setIsFormOpen(true);
          }} className="btn-transition">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </header> <br /><br />

      <main className="container py-8 pt-16"> 
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un vêtement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="top">Hauts</SelectItem>
                  <SelectItem value="bottom">Bas</SelectItem>
                  <SelectItem value="outerwear">Extérieur</SelectItem>
                  <SelectItem value="footwear">Chaussures</SelectItem>
                  <SelectItem value="accessory">Accessoires</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterSeason} onValueChange={setFilterSeason}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Saison" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes saisons</SelectItem>
                  <SelectItem value="winter">Hiver</SelectItem>
                  <SelectItem value="spring">Printemps</SelectItem>
                  <SelectItem value="summer">Été</SelectItem>
                  <SelectItem value="fall">Automne</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <h1 className="text-xl font-medium">Ma Garde-Robe</h1> <br />

        {items.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <Shirt className="h-16 w-16 mx-auto text-muted-foreground/50" />
            <h2 className="text-xl font-medium">Votre garde-robe est vide</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Ajoutez des vêtements pour obtenir des recommandations en fonction de la météo.
            </p>
            <Button onClick={() => setIsFormOpen(true)} className="mt-2 btn-transition">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un vêtement
            </Button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun vêtement ne correspond à vos critères.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map(item => (
              <ClothingCard
                key={item.id}
                item={item}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                className="animate-scale-in"
              />
            ))}
          </div>
        )}
      </main>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentItem ? 'Modifier le vêtement' : 'Ajouter un vêtement'}
            </DialogTitle>
          </DialogHeader>
          <ClothingForm
            initialData={currentItem || undefined}
            onSubmit={currentItem ? handleUpdateItem : handleAddItem}
            onCancel={() => {
              setIsFormOpen(false);
              setCurrentItem(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p>Êtes-vous sûr de vouloir supprimer ce vêtement ?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Wardrobe;