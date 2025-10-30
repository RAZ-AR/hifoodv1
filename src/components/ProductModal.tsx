import React, { useState } from 'react';
import { MenuItem } from '@/types';

interface ProductModalProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number) => void;
  currentQuantity: number;
  isFavorite: boolean;
  onFavoriteToggle: (item: MenuItem) => void;
  relatedItems?: MenuItem[];
  onItemClick?: (item: MenuItem) => void;
}

/**
 * МОДАЛЬНОЕ ОКНО С ДЕТАЛЯМИ БЛЮДА
 *
 * Отображает:
 * - Полное описание
 * - Вес и калории
 * - Аллергены
 * - Возможность добавить в корзину
 * - Рекомендации других блюд
 */
const ProductModal: React.FC<ProductModalProps> = ({
  item,
  onClose,
  onAddToCart,
  currentQuantity,
  isFavorite,
  onFavoriteToggle,
  relatedItems = [],
  onItemClick,
}) => {
  const [quantity, setQuantity] = useState(currentQuantity || 1);

  const handleAddToCart = () => {
    const quantityToAdd = quantity - currentQuantity;
    if (quantityToAdd > 0) {
      onAddToCart(item, quantityToAdd);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  const handleRelatedItemClick = (relatedItem: MenuItem) => {
    if (onItemClick) {
      onItemClick(relatedItem);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-in-up">
        {/* Изображение */}
        <div className="relative h-64 w-full">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />

          {/* Кнопки закрытия и избранного */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span className="text-2xl">×</span>
          </button>

          <button
            onClick={() => onFavoriteToggle(item)}
            className="absolute top-4 left-4 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span className="text-2xl">{isFavorite ? '❤️' : '🤍'}</span>
          </button>

          {/* Скидка */}
          {item.discount && item.discount > 0 && (
            <div className="absolute top-4 right-16 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              -{item.discount}%
            </div>
          )}
        </div>

        {/* Информация о блюде */}
        <div className="p-6">
          {/* Категория */}
          {item.sub_category && (
            <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full text-xs font-medium mb-3">
              {item.sub_category}
            </span>
          )}

          {/* Название */}
          <h2 className="text-2xl font-bold tg-theme-text mb-2">{item.name}</h2>

          {/* Вес и калории */}
          <div className="flex items-center gap-4 mb-4">
            {item.weight && (
              <div className="flex items-center gap-1 text-sm tg-theme-hint">
                <span>⚖️</span>
                <span>{item.weight}</span>
              </div>
            )}
            {item.calories && (
              <div className="flex items-center gap-1 text-sm tg-theme-hint">
                <span>🔥</span>
                <span>{item.calories} ккал</span>
              </div>
            )}
            {item.preparation_time && (
              <div className="flex items-center gap-1 text-sm tg-theme-hint">
                <span>⏱️</span>
                <span>{item.preparation_time} мин</span>
              </div>
            )}
          </div>

          {/* Рейтинг */}
          {item.rating && (
            <div className="flex items-center gap-1 mb-4">
              <span className="text-yellow-500">⭐</span>
              <span className="text-sm font-medium tg-theme-text">{item.rating.toFixed(1)}</span>
            </div>
          )}

          {/* Описание */}
          <p className="tg-theme-text text-base leading-relaxed mb-6">{item.description}</p>

          {/* Ингредиенты */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold tg-theme-text mb-2">Ингредиенты:</h3>
              <div className="flex flex-wrap gap-2">
                {item.ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm tg-theme-text"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Аллергены */}
          {item.allergens && item.allergens.length > 0 && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
                ⚠️ Аллергены:
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {item.allergens.join(', ')}
              </p>
            </div>
          )}

          {/* Цена и количество */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-2xl font-bold text-primary-600">
                {item.discount && item.discount > 0 ? (
                  <>
                    <span className="line-through text-gray-400 text-lg mr-2">{item.price} RSD</span>
                    <span>{Math.round(item.price * (1 - item.discount / 100))} RSD</span>
                  </>
                ) : (
                  <span>{item.price} RSD</span>
                )}
              </div>
            </div>

            {/* Счетчик количества */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-xl font-bold">−</span>
              </button>
              <span className="text-xl font-bold tg-theme-text min-w-[2rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <span className="text-xl font-bold">+</span>
              </button>
            </div>
          </div>

          {/* Кнопка добавления в корзину */}
          <button
            onClick={handleAddToCart}
            disabled={!item.available || quantity === currentQuantity}
            className="w-full py-4 bg-primary-500 text-white rounded-xl font-semibold text-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {!item.available
              ? 'Недоступно'
              : currentQuantity > 0 && quantity === currentQuantity
              ? 'Уже в корзине'
              : currentQuantity > 0
              ? `Обновить (${quantity} шт)`
              : `Добавить в корзину — ${item.discount ? Math.round(item.price * (1 - item.discount / 100) * quantity) : item.price * quantity} RSD`}
          </button>

          {/* Рекомендованные блюда */}
          {relatedItems.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold tg-theme-text mb-4">Вам может понравиться:</h3>
              <div className="grid grid-cols-2 gap-4">
                {relatedItems.slice(0, 4).map((relatedItem) => (
                  <div
                    key={relatedItem.id}
                    onClick={() => handleRelatedItemClick(relatedItem)}
                    className="cursor-pointer bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={relatedItem.image_url}
                      alt={relatedItem.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-3">
                      <h4 className="text-sm font-semibold tg-theme-text mb-1 line-clamp-2">
                        {relatedItem.name}
                      </h4>
                      <p className="text-sm font-bold text-primary-600">{relatedItem.price} RSD</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
