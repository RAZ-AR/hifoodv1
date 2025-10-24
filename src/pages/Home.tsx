import React, { useState, useEffect } from 'react';
import { MenuItem } from '@/types';
import { api } from '@/services/api';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import AdBannerSlider from '@/components/AdBannerSlider';
import SkeletonCard from '@/components/SkeletonCard';
import SearchBar from '@/components/SearchBar';
import OrderStatusTracker from '@/components/OrderStatusTracker';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useOrderTracking } from '@/hooks/useOrderTracking';
import { formatDishCount } from '@/utils/formatters';

/**
 * ГЛАВНАЯ СТРАНИЦА (МЕНЮ)
 *
 * Отображает:
 * - Фильтр по категориям
 * - Список всех блюд из API
 * - Загрузку и ошибки
 */
const Home: React.FC = () => {
  const { addToCart, getItemQuantity } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { orderId, orderStatus, clearOrder } = useOrderTracking();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Получить список категорий из меню
  const categories = ['Все', ...Array.from(new Set(menuItems.map(item => item.category)))];

  // Загрузить меню при монтировании компонента
  useEffect(() => {
    loadMenu();
  }, []);

  // Фильтровать меню при изменении категории или поиска
  useEffect(() => {
    let items = menuItems;

    // Фильтр по категории
    if (selectedCategory !== 'Все') {
      items = items.filter(item => item.category === selectedCategory);
    }

    // Фильтр по поиску
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }

    setFilteredItems(items);
  }, [selectedCategory, searchQuery, menuItems]);

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

  const handleAddToCart = (item: MenuItem, quantityChange: number) => {
    addToCart(item, quantityChange);
  };

  const handleFavoriteToggle = (item: MenuItem) => {
    toggleFavorite(item.id);
  };

  // Состояние загрузки с скелетонами
  if (loading) {
    return (
      <div className="pb-20">
        <CategoryFilter
          categories={['Все']}
          selectedCategory="Все"
          onCategoryChange={() => {}}
        />

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Скелетон слайдера */}
          <div className="mb-6">
            <div className="w-full h-48 skeleton rounded-lg"></div>
          </div>

          {/* Скелетон заголовка */}
          <div className="mb-4">
            <div className="h-8 skeleton rounded w-40 mb-2"></div>
            <div className="h-4 skeleton rounded w-24"></div>
          </div>

          {/* Скелетон карточек */}
          <div className="grid grid-cols-2 gap-4">
            {[...Array(8)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
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
        {/* Поисковая строка */}
        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Поиск блюд..."
          />
        </div>

        {/* Трекер статуса заказа */}
        {orderId && orderStatus && (
          <OrderStatusTracker
            orderId={orderId}
            status={orderStatus}
            onClose={clearOrder}
          />
        )}

        {/* Слайдер с баннерами */}
        <div className="mb-6">
          <AdBannerSlider />
        </div>
        {/* Заголовок категории */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold tg-theme-text">
            {selectedCategory}
          </h2>
          <p className="text-sm tg-theme-hint mt-1">
            {formatDishCount(filteredItems.length)}
          </p>
        </div>

        {/* Сетка карточек */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 animate-stagger">
            {filteredItems.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onAddToCart={handleAddToCart}
                onFavoriteToggle={handleFavoriteToggle}
                isFavorite={isFavorite(item.id)}
                currentQuantity={getItemQuantity(item.id)}
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
