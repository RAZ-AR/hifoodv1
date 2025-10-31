import React from 'react';
import { User } from '@/types';

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
 * - Белый фон с тенью
 */
const Header: React.FC<HeaderProps> = ({ user }) => {

  const getUserName = () => {
    if (!user) return 'Guest';
    return user.first_name || 'Guest';
  };

  return (
    <header
      className="px-6 py-4 transition-all duration-300"
      style={{
        backdropFilter: 'blur(24px) saturate(180%)',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.1)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
      }}
    >
      <div className="flex items-center justify-between">
        {/* Левая часть: Логотип */}
        <div className="flex items-center gap-2">
          <img
            src="/hifoodv1/logo-hifood.svg"
            alt="HiFood"
            className="h-10 w-10"
          />
        </div>

        {/* Центр: Приветствие */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <span className="text-lg font-semibold text-gray-700">
            Hi, {getUserName()}
          </span>
        </div>

        {/* Правая часть: пусто */}
        <div className="w-10"></div>
      </div>
    </header>
  );
};

export default Header;
