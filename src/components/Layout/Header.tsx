import React from 'react';
import { User } from '@/types';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  user: User | null;
  onCartClick?: () => void;
}

/**
 * HEADER - ОБНОВЛЕННЫЙ ДИЗАЙН
 *
 * Отображает:
 * - Логотип HiFood слева
 * - Приветствие "Hi + имя" по центру
 * - Иконка корзины справа
 * - Белый фон с тенью
 */
const Header: React.FC<HeaderProps> = ({ user, onCartClick }) => {
  const { cartItems } = useCart();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const getUserName = () => {
    if (!user) return 'Guest';
    return user.first_name || 'Guest';
  };

  return (
    <header className="bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Левая часть: Логотип */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">HF</span>
          </div>
          <span className="text-xl font-bold text-gray-900">HiFood</span>
        </div>

        {/* Центр: Приветствие */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <span className="text-lg font-semibold text-gray-700">
            Hi, {getUserName()}
          </span>
        </div>

        {/* Правая часть: Корзина */}
        <button
          onClick={onCartClick}
          className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {totalItems > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {totalItems}
            </div>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
