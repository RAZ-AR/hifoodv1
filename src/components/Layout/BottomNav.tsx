import React from 'react';
import { useCart } from '@/context/CartContext';

export type TabType = 'home' | 'favorites' | 'cart' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

/**
 * НИЖНЯЯ НАВИГАЦИЯ - LIQUID GLASS ДИЗАЙН (Apple)
 *
 * Реализация настоящего Liquid Glass эффекта:
 * - Динамическое размытие фона (backdrop-blur)
 * - Полупрозрачность с адаптацией к контенту
 * - Мягкие тени и световые границы
 * - Плавные органичные переходы
 * - Vibrancy эффект для иконок
 */
const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { getTotalItems } = useCart();
  const cartItemsCount = getTotalItems();

  const tabs = [
    {
      id: 'home' as TabType,
      label: 'Меню',
      icon: (isActive: boolean) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={isActive ? 'stroke-primary-500' : 'stroke-white/90'} strokeWidth="2.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'favorites' as TabType,
      label: 'Избранное',
      icon: (isActive: boolean) => (
        <svg width="22" height="22" viewBox="0 0 24 24" className={isActive ? 'fill-primary-500 stroke-primary-500' : 'fill-none stroke-white/90'} strokeWidth="2.5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'cart' as TabType,
      label: 'Корзина',
      badge: cartItemsCount,
      icon: (isActive: boolean) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={isActive ? 'stroke-primary-500' : 'stroke-white/90'} strokeWidth="2.5">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'profile' as TabType,
      label: 'Профиль',
      icon: (isActive: boolean) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={isActive ? 'stroke-primary-500' : 'stroke-white/90'} strokeWidth="2.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      {/* Liquid Glass контейнер */}
      <div
        className="relative overflow-hidden rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        style={{
          width: 'min(340px, calc(100vw - 48px))',
        }}
      >
        {/* Основной стеклянный слой с размытием */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/20"
          style={{
            backdropFilter: 'blur(24px) saturate(200%)',
            WebkitBackdropFilter: 'blur(24px) saturate(200%)',
          }}
        />

        {/* Анимированное свечение */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
            animation: 'shimmer 3s linear infinite',
          }}
        />

        {/* Световая граница сверху (highlight) */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />

        {/* Темная граница снизу (shadow) */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-black/20 to-transparent"
        />

        {/* Контент навигации */}
        <div className="relative px-3 py-2.5">
          <div className="flex justify-around items-center gap-1">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl
                    transition-all duration-700
                    ${isActive ? 'scale-105' : 'scale-100 hover:scale-105'}
                  `}
                  style={{
                    transition: 'all 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  {/* Активный индикатор с glow эффектом */}
                  {isActive && (
                    <>
                      {/* Фоновое свечение */}
                      <div
                        className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 to-white/5"
                        style={{
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                        }}
                      />

                      {/* Световая рамка */}
                      <div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                        }}
                      />
                    </>
                  )}

                  {/* Иконка с vibrancy */}
                  <div className="relative z-10">
                    <div
                      className={`transition-all duration-700 ${isActive ? 'drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]' : ''}`}
                      style={{
                        filter: isActive ? 'brightness(1.2)' : 'brightness(1)',
                      }}
                    >
                      {tab.icon(isActive)}
                    </div>

                    {/* Бейдж для корзины */}
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <div
                        className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1"
                        style={{
                          boxShadow: '0 2px 8px rgba(34, 197, 94, 0.4), 0 0 0 2px rgba(0, 0, 0, 0.2)',
                        }}
                      >
                        {tab.badge > 99 ? '99+' : tab.badge}
                      </div>
                    )}
                  </div>

                  {/* Текст с vibrancy */}
                  <span
                    className={`
                      relative z-10 text-[9px] font-semibold tracking-wide
                      transition-all duration-700
                      ${isActive ? 'text-primary-500' : 'text-white/85'}
                    `}
                    style={{
                      textShadow: isActive ? '0 0 8px rgba(34, 197, 94, 0.3)' : 'none',
                      transition: 'all 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
