import React, { useState, useEffect } from 'react';
import { MenuItem } from '@/types';
import { api } from '@/services/api';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import { useCart } from '@/context/CartContext';

/**
 * ГЛАВНАЯ СТРАНИЦА (МЕНЮ)
 *
 * Отображает:
 * - Фильтр по категориям
 * - Список всех блюд из API
 * - Загрузку и ошибки
 */
const Home: React.FC = () => {
  const { addToCart } = useCart();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Получить список категорий из меню
  const categories = ['Все', ...Array.from(new Set(menuItems.map(item => item.category)))];

  // Загрузить меню при монтировании компонента
  useEffect(() => {
    loadMenu();
  }, []);

  // Фильтровать меню при изменении категории
  useEffect(() => {
    if (selectedCategory === 'Все') {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory, menuItems]);

  const loadMenu = async () => {
    try {
      setLoading(true);
      setError(null);

      // Загружаем меню из API
      const items = await api.getMenu({ available: true });
      setMenuItems(items);
      setFilteredItems(items);
    } catch (err) {
      console.error('Ошибка загрузки меню:', err);
      setError('Не удалось загрузить меню. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);

    // Используем Telegram Web App API для haptic feedback
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
  };

  const handleFavoriteToggle = (item: MenuItem) => {
    // TODO: Реализовать добавление/удаление из избранного
    console.log('Переключить избранное:', item);

    // Используем Telegram Web App API для haptic feedback
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
  };

  // Состояние загрузки
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="tg-theme-hint">Загружаем меню...</p>
        </div>
      </div>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
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

  // Пустое меню
  if (menuItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <span className="text-5xl mb-4 block">🍽️</span>
          <h2 className="text-xl font-bold tg-theme-text mb-2">Меню пусто</h2>
          <p className="tg-theme-hint">В данный момент нет доступных блюд</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Фильтр по категориям */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Список блюд */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Заголовок категории */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold tg-theme-text">
            {selectedCategory}
          </h2>
          <p className="text-sm tg-theme-hint mt-1">
            {filteredItems.length} {filteredItems.length === 1 ? 'блюдо' : 'блюд'}
          </p>
        </div>

        {/* Сетка карточек */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onAddToCart={handleAddToCart}
                onFavoriteToggle={handleFavoriteToggle}
                isFavorite={false} // TODO: Получить из стейта избранного
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="text-4xl mb-4 block">🔍</span>
            <p className="tg-theme-hint">
              Нет блюд в категории "{selectedCategory}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
