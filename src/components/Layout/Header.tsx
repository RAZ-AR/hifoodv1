import React from 'react';
import { User } from '@/types';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  user: User | null;
  onCartClick?: () => void;
}

/**
 * HEADER - СТИЛЬ РЕФЕРЕНСА
 *
 * Отображает:
 * - Аватар пользователя слева
 * - Иконка корзины справа
 * - Белый фон с тенью
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
    <header className="bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Левая часть: Аватар */}
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
