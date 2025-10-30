import React, { useState, useEffect } from 'react';
import { MenuItem } from '@/types';

interface ProductCardProps {
  item: MenuItem;
  onAddToCart?: (item: MenuItem, quantity: number) => void;
  onFavoriteToggle?: (item: MenuItem) => void;
  onImageClick?: (item: MenuItem) => void;
  isFavorite?: boolean;
  currentQuantity?: number;
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
  isFavorite = false,
  currentQuantity = 0
}) => {
  const [quantity, setQuantity] = useState(currentQuantity);
  const [isAdding, setIsAdding] = useState(false);

  // Обновлять quantity при изменении currentQuantity
  useEffect(() => {
    setQuantity(currentQuantity);
  }, [currentQuantity]);

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);

    if (onAddToCart && item.available) {
      onAddToCart(item, 1);

      // Haptic feedback
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
      }
    }
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);

      if (onAddToCart && item.available) {
        onAddToCart(item, -1);

        // Haptic feedback
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
      }
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart && item.available) {
      setIsAdding(true);
      setQuantity(quantity + 1);
      onAddToCart(item, 1);

      // Убираем анимацию через 300ms
      setTimeout(() => {
        setIsAdding(false);
      }, 300);

      // Haptic feedback
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
      }
    }
  };

  const handleFavoriteToggle = () => {
    if (onFavoriteToggle) {
      onFavoriteToggle(item);
    }
  };

  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick(item);
      // Haptic feedback
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden hover-lift">
      {/* Изображение */}
      <div
        className="relative h-40 overflow-hidden bg-gray-100 cursor-pointer"
        onClick={handleImageClick}
      >
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Бейдж скидки (если есть) */}
        {item.discount && item.discount > 0 && (
          <div className="absolute top-2 left-2 bg-accent-coral text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
            {item.discount}% OFF
          </div>
        )}

        {/* Кнопка избранного */}
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-2 right-2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          aria-label="Добавить в избранное"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            className={isFavorite ? 'fill-accent-coral' : 'fill-gray-300'}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>

        {/* Индикатор недоступности */}
        {!item.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-xs font-semibold px-3 py-1 bg-accent-red rounded-full">
              Нет в наличии
            </span>
          </div>
        )}
      </div>

      {/* Информация о блюде */}
      <div className="p-3">
        {/* Название */}
        <h3 className="text-sm font-semibold tg-theme-text mb-1 line-clamp-1">
          {item.name}
        </h3>

        {/* Цена и рейтинг */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-baseline gap-1">
            <span className="text-base font-bold tg-theme-text">
              {item.price} RSD
            </span>
          </div>

          {/* Рейтинг */}
          {item.rating && (
            <div className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" className="fill-yellow-400">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
              <span className="text-xs font-medium text-gray-600">{item.rating}</span>
            </div>
          )}
        </div>

        {/* Кнопки добавления */}
        {quantity === 0 ? (
          /* Кнопка "Добавить в корзину" */
          <button
            onClick={handleAddToCart}
            disabled={!item.available}
            className={`w-full py-2 rounded-lg text-xs font-semibold transition-all border ${
              isAdding ? 'animate-add-to-cart' : ''
            } ${
              item.available
                ? 'border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100'
                : 'border-gray-300 text-gray-400 cursor-not-allowed'
            }`}
          >
            {item.available ? (isAdding ? '✓ Добавлено' : 'Add to cart') : 'Недоступно'}
          </button>
        ) : (
          /* Счетчик количества */
          <div className="flex items-center justify-between">
            <button
              onClick={handleDecrease}
              className="w-9 h-9 bg-accent-coral rounded-lg flex items-center justify-center hover:bg-opacity-90 active:scale-95 transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" className="fill-white">
                <path d="M19 13H5v-2h14v2z"/>
              </svg>
            </button>

            <span className="text-base font-bold tg-theme-text">
              {quantity}
            </span>

            <button
              onClick={handleIncrease}
              className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center hover:bg-primary-600 active:scale-95 transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" className="fill-white">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
