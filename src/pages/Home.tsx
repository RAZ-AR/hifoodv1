import React, { useState, useEffect } from 'react';
import { MenuItem } from '@/types';
import { api } from '@/services/api';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import SubCategoryFilter from '@/components/SubCategoryFilter';
import ProductModal from '@/components/ProductModal';
import AdBannerSlider from '@/components/AdBannerSlider';
import SkeletonCard from '@/components/SkeletonCard';
import SearchBar from '@/components/SearchBar';
import PromoBanner from '@/components/PromoBanner';
import FilterModal, { FilterOptions } from '@/components/FilterModal';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';

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

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'popular',
    priceRange: null,
    showAvailableOnly: true
  });

  // Получить список категорий из меню
  const categories = ['Все', ...Array.from(new Set(menuItems.map(item => item.category)))];

  // Получить список подкатегорий для выбранной категории
  const subCategories = selectedCategory === 'Все'
    ? []
    : Array.from(new Set(
        menuItems
          .filter(item => item.category === selectedCategory && item.sub_category)
          .map(item => item.sub_category!)
      ));

  // Загрузить меню при монтировании компонента
  useEffect(() => {
    loadMenu();
  }, []);

  // Фильтровать меню при изменении категории, подкатегории, поиска или фильтров
  useEffect(() => {
    let items = menuItems;

    // Фильтр по категории
    if (selectedCategory !== 'Все') {
      items = items.filter(item => item.category === selectedCategory);
    }

    // Фильтр по подкатегории
    if (selectedSubCategory) {
      items = items.filter(item => item.sub_category === selectedSubCategory);
    }

    // Фильтр по поиску
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }

    // Фильтр по доступности
    if (filters.showAvailableOnly) {
      items = items.filter(item => item.available);
    }

    // Сортировка
    switch (filters.sortBy) {
      case 'name':
        items = [...items].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        items = [...items].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        items = [...items].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        items = [...items].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'popular':
      default:
        // Default order from API
        break;
    }

    setFilteredItems(items);
  }, [selectedCategory, selectedSubCategory, searchQuery, menuItems, filters]);

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
    setSelectedSubCategory(null); // Сбросить подкатегорию при смене категории
  };

  const handleSubCategoryChange = (subCategory: string | null) => {
    setSelectedSubCategory(subCategory);
  };

  const handleAddToCart = (item: MenuItem, quantityChange: number) => {
    addToCart(item, quantityChange);
  };

  const handleFavoriteToggle = (item: MenuItem) => {
    toggleFavorite(item.id);
  };

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
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

      {/* Фильтр по подкатегориям */}
      <SubCategoryFilter
        subCategories={subCategories}
        selectedSubCategory={selectedSubCategory}
        onSubCategoryChange={handleSubCategoryChange}
      />

      {/* Список блюд */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Поисковая строка */}
        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search"
            onFilterClick={() => setShowFilterModal(true)}
          />
        </div>

        {/* Промо-баннер */}
        <PromoBanner />

        {/* Слайдер с баннерами */}
        <div className="mb-6">
          <AdBannerSlider />
        </div>

        {/* Заголовок Popular Food */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Popular Food</h2>
          <button className="text-sm text-gray-600">See All</button>
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
                onImageClick={handleItemClick}
                isFavorite={isFavorite(item.id)}
                currentQuantity={getItemQuantity(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="text-4xl mb-4 block">🔍</span>
            <p className="tg-theme-hint">
              {selectedSubCategory
                ? `Нет блюд в подкатегории "${selectedSubCategory}"`
                : `Нет блюд в категории "${selectedCategory}"`}
            </p>
          </div>
        )}
      </div>

      {/* Модальное окно с деталями блюда */}
      {selectedItem && (
        <ProductModal
          item={selectedItem}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
          currentQuantity={getItemQuantity(selectedItem.id)}
          isFavorite={isFavorite(selectedItem.id)}
          onFavoriteToggle={handleFavoriteToggle}
        />
      )}

      {/* Модальное окно фильтров */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={setFilters}
        currentFilters={filters}
      />
    </div>
  );
};

export default Home;
