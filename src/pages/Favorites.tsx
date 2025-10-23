import React, { useState, useEffect } from 'react';
import { MenuItem } from '@/types';
import { api } from '@/services/api';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';

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
const Favorites: React.FC<FavoritesProps> = ({ userId = 'user_test_123' }) => {
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFavorites();
  }, [userId]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError(null);

      const items = await api.getFavorites(userId);
      setFavorites(items);
    } catch (err) {
      console.error('Ошибка загрузки избранного:', err);
      setError('Не удалось загрузить избранное');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);

    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
  };

  const handleFavoriteToggle = async (item: MenuItem) => {
    try {
      // Удаляем из избранного
      await api.removeFavorite(userId, item.id);

      // Обновляем локальный список
      setFavorites(favorites.filter(fav => fav.id !== item.id));

      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
      }
    } catch (err) {
      console.error('Ошибка удаления из избранного:', err);
    }
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
            onClick={loadFavorites}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  // Пустое избранное
  if (favorites.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pb-20">
        <div className="text-center">
          <span className="text-6xl mb-4 block">❤️</span>
          <h2 className="text-2xl font-bold tg-theme-text mb-2">Избранное пусто</h2>
          <p className="tg-theme-hint">Добавьте любимые блюда из меню</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Заголовок */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tg-theme-text">Избранное</h1>
          <p className="text-sm tg-theme-hint mt-1">
            {favorites.length} {favorites.length === 1 ? 'блюдо' : 'блюд'}
          </p>
        </div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favorites.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              onAddToCart={handleAddToCart}
              onFavoriteToggle={handleFavoriteToggle}
              isFavorite={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
