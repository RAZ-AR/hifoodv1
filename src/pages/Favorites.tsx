import React, { useState, useEffect } from 'react';
import { MenuItem } from '@/types';
import { api } from '@/services/api';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';

interface FavoritesProps {
  userId?: string;
}

/**
 * СТРАНИЦА ИЗБРАННОГО
 *
 * Отображает:
 * - Список избранных блюд пользователя
 * - Возможность добавить в корзину
 * - Возможность удалить из избранного
 */
const Favorites: React.FC<FavoritesProps> = () => {
  const { addToCart, getItemQuantity } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      setLoading(true);
      setError(null);

      const items = await api.getMenu();
      setMenuItems(items);
    } catch (err) {
      console.error('Ошибка загрузки меню:', err);
      setError('Не удалось загрузить меню');
    } finally {
      setLoading(false);
    }
  };

  // Фильтруем только избранные блюда
  const favoriteItems = menuItems.filter(item => isFavorite(item.id));

  const handleAddToCart = (item: MenuItem, quantityChange: number) => {
    addToCart(item, quantityChange);
  };

  const handleFavoriteToggle = (item: MenuItem) => {
    toggleFavorite(item.id);
  };

  // Состояние загрузки
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="tg-theme-hint">Загружаем избранное...</p>
        </div>
      </div>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pb-20">
        <div className="text-center">
          <span className="text-5xl mb-4 block">😞</span>
          <h2 className="text-xl font-bold tg-theme-text mb-2">Ошибка загрузки</h2>
          <p className="tg-theme-hint mb-4">{error}</p>
          <button
            onClick={loadMenu}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  // Пустое избранное
  if (favoriteItems.length === 0) {
    return (
      <div className="min-h-screen bg-cream-300 flex items-center justify-center px-4 pb-20">
        <div className="text-center">
          <span className="text-6xl mb-4 block">❤️</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Favorites Yet</h2>
          <p className="text-gray-600">Add your favorite dishes from the menu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 bg-cream-300 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Заголовок */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Favorites</h1>
          <p className="text-sm text-gray-600 mt-2">
            {favoriteItems.length} {favoriteItems.length === 1 ? 'dish' : 'dishes'}
          </p>
        </div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-2 gap-4">
          {favoriteItems.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              onAddToCart={handleAddToCart}
              onFavoriteToggle={handleFavoriteToggle}
              isFavorite={true}
              currentQuantity={getItemQuantity(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
