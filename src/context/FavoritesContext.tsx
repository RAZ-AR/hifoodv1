import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FavoritesContextType {
  favorites: Set<string>;
  toggleFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);

        // Haptic feedback при удалении
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }
      } else {
        newFavorites.add(itemId);

        // Haptic feedback при добавлении
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
      }
      return newFavorites;
    });
  };

  const isFavorite = (itemId: string): boolean => {
    return favorites.has(itemId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
