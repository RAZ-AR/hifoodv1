import React, { useState } from 'react';
import { MenuItem } from '@/types';

interface ProductCardProps {
  item: MenuItem;
  onAddToCart?: (item: MenuItem) => void;
  onFavoriteToggle?: (item: MenuItem) => void;
  isFavorite?: boolean;
}

/**
 * КАРТОЧКА ТОВАРА
 *
 * Отображает:
 * - Фото блюда
 * - Название и описание
 * - Цену
 * - Время приготовления
 * - Кнопку "Добавить в корзину"
 * - Кнопку "Избранное"
 * - Индикатор доступности
 */
const ProductCard: React.FC<ProductCardProps> = ({
  item,
  onAddToCart,
  onFavoriteToggle,
  isFavorite = false
}) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    if (onAddToCart && item.available) {
      setIsAdding(true);
      onAddToCart(item);

      // Убираем анимацию через 300ms
      setTimeout(() => {
        setIsAdding(false);
      }, 300);
    }
  };

  const handleFavoriteToggle = () => {
    if (onFavoriteToggle) {
      onFavoriteToggle(item);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover-lift">
      {/* Изображение */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Кнопка избранного */}
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-2 right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          aria-label="Добавить в избранное"
        >
          <span className="text-lg">
            {isFavorite ? '❤️' : '🤍'}
          </span>
        </button>

        {/* Индикатор недоступности */}
        {!item.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-sm font-semibold px-3 py-1 bg-red-500 rounded-full">
              Нет в наличии
            </span>
          </div>
        )}
      </div>

      {/* Информация о блюде */}
      <div className="p-4">
        {/* Название */}
        <h3 className="text-lg font-bold tg-theme-text mb-1">
          {item.name}
        </h3>

        {/* Описание */}
        <p className="text-sm tg-theme-hint mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* Время приготовления */}
        {item.preparation_time && (
          <div className="flex items-center gap-1 mb-3">
            <span className="text-xs">⏱️</span>
            <span className="text-xs tg-theme-hint">
              {item.preparation_time} мин
            </span>
          </div>
        )}

        {/* Цена и кнопка */}
        <div className="flex items-center justify-between">
          {/* Цена */}
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-primary-600">
              {item.price}
            </span>
            <span className="text-sm tg-theme-hint">₽</span>
          </div>

          {/* Кнопка "Добавить в корзину" */}
          <button
            onClick={handleAddToCart}
            disabled={!item.available}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              isAdding ? 'animate-add-to-cart' : ''
            } ${
              item.available
                ? 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {item.available ? (isAdding ? '✓ Добавлено' : '+ Добавить') : 'Недоступно'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
