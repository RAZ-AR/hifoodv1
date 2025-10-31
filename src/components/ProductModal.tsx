import React, { useState } from 'react';
import { MenuItem } from '@/types';

interface ProductModalProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number) => void;
  currentQuantity: number;
  isFavorite: boolean;
  onFavoriteToggle: (item: MenuItem) => void;
}

/**
 * PRODUCT MODAL - СТИЛЬ РЕФЕРЕНСА
 *
 * Полноэкранное изображение сверху
 * Информация о блюде снизу
 * Большая черная кнопка "Add to Cart"
 */
const ProductModal: React.FC<ProductModalProps> = ({
  item,
  onClose,
  onAddToCart,
  currentQuantity,
  isFavorite,
  onFavoriteToggle,
}) => {
  const [quantity, setQuantity] = useState(currentQuantity || 1);

  const handleAddToCart = () => {
    const quantityToAdd = quantity - currentQuantity;
    if (quantityToAdd > 0) {
      onAddToCart(item, quantityToAdd);
    }
    onClose();
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col animate-fade-in">
      {/* Верхняя часть: Изображение на весь экран */}
      <div className="relative h-[45%] bg-gradient-to-b from-accent-green to-transparent">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-full object-contain"
        />

        {/* Кнопки закрытия и избранного */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all duration-300"
          style={{
            backdropFilter: 'blur(24px) saturate(200%)',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button
          onClick={() => onFavoriteToggle(item)}
          className="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all duration-300"
          style={{
            backdropFilter: 'blur(24px) saturate(200%)',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          <span className="text-2xl">{isFavorite ? '❤️' : '🤍'}</span>
        </button>
      </div>

      {/* Нижняя часть: Информация */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-6 px-6 pt-6 pb-32 overflow-y-auto">
        {/* Название */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{item.name}</h2>

        {/* Описание */}
        <p className="text-gray-600 text-base leading-relaxed mb-4">
          {item.description}
        </p>

        {/* Характеристики */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {item.rating && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-yellow-500">⭐</span>
                <span className="text-lg font-bold text-gray-900">{item.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-gray-500">Rating</span>
            </div>
          )}
          {item.calories && (
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 mb-1">{item.calories}</div>
              <span className="text-xs text-gray-500">Kcal</span>
            </div>
          )}
          {item.preparation_time && (
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 mb-1">{item.preparation_time}</div>
              <span className="text-xs text-gray-500">min</span>
            </div>
          )}
          {item.weight && (
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 mb-1">{item.weight}</div>
              <span className="text-xs text-gray-500">grams</span>
            </div>
          )}
        </div>

        {/* Ингредиенты */}
        {item.ingredients && item.ingredients.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Ingredients</h3>
            <div className="text-sm text-gray-600">
              {item.ingredients.join(', ')}
            </div>
          </div>
        )}

        {/* Счетчик количества и цена */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-3xl font-bold text-gray-900">
            ${item.price} RSD
          </div>

          {/* Счетчик */}
          <div className="flex items-center gap-4 bg-gray-100 rounded-full px-4 py-3">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="w-8 h-8 flex items-center justify-center disabled:opacity-50"
            >
              <span className="text-2xl font-bold text-gray-700">−</span>
            </button>
            <span className="text-xl font-bold text-gray-900 min-w-[2rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="w-8 h-8 flex items-center justify-center"
            >
              <span className="text-2xl font-bold text-gray-700">+</span>
            </button>
          </div>
        </div>

        {/* Кнопка Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={!item.available}
          className="w-full py-5 bg-accent-black text-white rounded-2xl font-bold text-lg hover:bg-opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          {!item.available
            ? 'Not Available'
            : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductModal;
