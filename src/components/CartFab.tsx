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
      className="fixed bottom-20 right-4 z-40 bg-accent-orange text-white rounded-full shadow-2xl hover:opacity-90 active:scale-95 transition-all animate-scale-in"
    >
      <div className="flex items-center gap-3 px-5 py-3">
        {/* Иконка корзины */}
        <div className="relative">
          <svg width="28" height="28" viewBox="0 0 24 24" className="fill-white">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>

          {/* Бейдж с количеством */}
          <div className="absolute -top-2 -right-2 min-w-[20px] h-5 bg-white text-accent-orange text-xs font-bold rounded-full flex items-center justify-center px-1 animate-pulse-badge">
            {itemsCount > 99 ? '99+' : itemsCount}
          </div>
        </div>

        {/* Сумма */}
        <div className="flex flex-col items-start">
          <span className="text-xs opacity-90">Корзина</span>
          <span className="text-lg font-bold">
            ₽ {totalPrice.toFixed(0)}
          </span>
        </div>
      </div>
    </button>
  );
};

export default CartFab;
