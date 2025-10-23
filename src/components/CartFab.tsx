import React from 'react';
import { useCart } from '@/context/CartContext';

interface CartFabProps {
  onClick: () => void;
}

/**
 * FLOATING ACTION BUTTON ДЛЯ КОРЗИНЫ
 *
 * Плавающая кнопка с количеством товаров и общей суммой
 * Показывается только когда в корзине есть товары
 */
const CartFab: React.FC<CartFabProps> = ({ onClick }) => {
  const { getTotalItems, getTotalPrice } = useCart();
  const itemsCount = getTotalItems();
  const totalPrice = getTotalPrice();

  // Не показываем если корзина пуста
  if (itemsCount === 0) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 z-40 bg-primary-500 text-white rounded-full shadow-2xl hover:bg-primary-600 active:scale-95 transition-all animate-scale-in"
    >
      <div className="flex items-center gap-3 px-5 py-3">
        {/* Иконка корзины */}
        <div className="relative">
          <span className="text-2xl">🛒</span>

          {/* Бейдж с количеством */}
          <div className="absolute -top-2 -right-2 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1 animate-pulse-badge">
            {itemsCount > 99 ? '99+' : itemsCount}
          </div>
        </div>

        {/* Сумма */}
        <div className="flex flex-col items-start">
          <span className="text-xs opacity-90">Корзина</span>
          <span className="text-lg font-bold">
            {totalPrice.toFixed(0)} ₽
          </span>
        </div>
      </div>
    </button>
  );
};

export default CartFab;
