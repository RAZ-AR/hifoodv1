import React from 'react';
import { useCart } from '@/context/CartContext';

export type TabType = 'home' | 'favorites' | 'cart' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

/**
 * НИЖНЯЯ НАВИГАЦИЯ - СТИЛЬ КАК В РЕФЕРЕНСЕ
 *
 * Активная вкладка: белый фон с текстом
 * Неактивные: только иконки
 */
const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { getTotalItems } = useCart();
  const cartItemsCount = getTotalItems();

  const tabs = [
    {
      id: 'home' as TabType,
      label: 'Home',
      icon: (isActive: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={isActive ? 'stroke-gray-900' : 'stroke-white'} strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'cart' as TabType,
      label: 'Cart',
      badge: cartItemsCount,
      icon: (isActive: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={isActive ? 'stroke-gray-900' : 'stroke-white'} strokeWidth="2">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'favorites' as TabType,
      label: 'Favorites',
      icon: (isActive: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill={isActive ? 'currentColor' : 'none'} className={isActive ? 'stroke-gray-900' : 'stroke-white'} strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'profile' as TabType,
      label: 'Profile',
      icon: (isActive: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={isActive ? 'stroke-gray-900' : 'stroke-white'} strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-4">
      <div
        className="rounded-full px-2 py-2 transition-all duration-300"
        style={{
          width: 'min(380px, calc(100vw - 32px))',
          backdropFilter: 'blur(24px) saturate(180%)',
          backgroundColor: 'rgba(17, 24, 39, 0.85)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div className="flex justify-around items-center gap-1">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative flex items-center justify-center gap-2 px-4 py-3 rounded-full
                  transition-all duration-300
                  ${isActive ? '' : ''}
                `}
                style={isActive ? {
                  backdropFilter: 'blur(24px) saturate(200%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                } : {}}
              >
                <div className="relative">
                  {tab.icon(isActive)}

                  {/* Бейдж для корзины */}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <div className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-primary-500 text-gray-900 text-xs font-bold rounded-full flex items-center justify-center px-1">
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </div>
                  )}
                </div>

                {/* Текст только для активной вкладки */}
                {isActive && (
                  <span className="text-sm font-semibold text-gray-900">
                    {tab.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
