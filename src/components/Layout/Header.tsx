import React from 'react';
import { User } from '@/types';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  user: User | null;
  onCartClick?: () => void;
}

/**
 * HEADER - Новый дизайн
 *
 * Отображает:
 * - Аватар пользователя
 * - Выбор локации
 * - Иконка корзины с количеством товаров
 */
const Header: React.FC<HeaderProps> = ({ user, onCartClick }) => {
  const { cartItems } = useCart();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'U';
  };

  return (
    <header className="bg-cream-300 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Левая часть: Аватар + Локация */}
        <div className="flex items-center gap-3">
          {/* Аватар */}
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {user ? (
              <span className="text-lg font-semibold text-gray-700">
                {getUserInitials()}
              </span>
            ) : (
              <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            )}
          </div>

          {/* Локация */}
          <div className="flex items-center gap-1">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-base font-medium text-gray-900">Belgrade</span>
            <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </div>
        </div>

        {/* Правая часть: Корзина */}
        <button
          onClick={onCartClick}
          className="relative p-2 hover:bg-gray-200 rounded-full transition-colors"
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
