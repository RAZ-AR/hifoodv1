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
 * КАРТОЧКА ТОВАРА - НОВЫЙ ДИЗАЙН
 *
 * Цветные фоны как в референсе
 * Большое изображение, минималистичный дизайн
 */

// Цвета фонов для карточек (чередуются)
const cardColors = ['bg-accent-green', 'bg-accent-blue'];

const ProductCard: React.FC<ProductCardProps> = ({
  item,
  onAddToCart,
  onFavoriteToggle,
  onImageClick,
  isFavorite = false,
  currentQuantity = 0
}) => {
  const [quantity, setQuantity] = useState(currentQuantity);

  // Чередование цвета фона на основе хеша ID
  const cardColor = cardColors[parseInt(item.id, 36) % cardColors.length];

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
      setQuantity(quantity + 1);
      onAddToCart(item, 1);

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
    <div className={`${cardColor} rounded-3xl overflow-hidden hover-lift`}>
      {/* Изображение */}
      <div
        className="relative h-32 overflow-hidden cursor-pointer"
        onClick={handleImageClick}
      >
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Кнопка избранного */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFavoriteToggle();
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          aria-label="Добавить в избранное"
        >
          <span className="text-lg">{isFavorite ? '❤️' : '🤍'}</span>
        </button>

        {/* Скидка */}
        {item.discount && item.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            -{item.discount}%
          </div>
        )}

        {/* Индикатор недоступности */}
        {!item.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-xs font-semibold px-3 py-1 bg-red-500 rounded-full">
              Нет в наличии
            </span>
          </div>
        )}
      </div>

      {/* Информация о блюде */}
      <div className="p-3">
        {/* Название */}
        <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2 h-10">
          {item.name}
        </h3>

        {/* Цена и кнопка */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">
              {item.price} RSD
            </span>
            {item.rating && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">⭐</span>
                <span className="text-xs font-medium text-gray-700">{item.rating}</span>
              </div>
            )}
          </div>

          {/* Кнопка добавления */}
          {quantity === 0 ? (
            <button
              onClick={handleAddToCart}
              disabled={!item.available}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                item.available
                  ? 'bg-accent-black hover:bg-opacity-90 active:scale-95'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <span className="text-white text-xl font-bold">+</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDecrease}
                className="w-8 h-8 bg-accent-black rounded-full flex items-center justify-center hover:bg-opacity-90 active:scale-95 transition-all"
              >
                <span className="text-white text-lg font-bold">−</span>
              </button>
              <span className="text-base font-bold text-gray-900 min-w-[1.5rem] text-center">
                {quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="w-8 h-8 bg-accent-black rounded-full flex items-center justify-center hover:bg-opacity-90 active:scale-95 transition-all"
              >
                <span className="text-white text-lg font-bold">+</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
