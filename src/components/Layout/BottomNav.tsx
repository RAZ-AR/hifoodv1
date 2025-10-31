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
      label: 'Saved',
      icon: (isActive: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={isActive ? 'stroke-gray-900' : 'stroke-white'} strokeWidth="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/>
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
        className="bg-gray-900 rounded-full shadow-2xl px-2 py-2"
        style={{
          width: 'min(380px, calc(100vw - 32px))',
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
                  ${isActive ? 'bg-white shadow-lg' : 'bg-transparent'}
                `}
              >
                <div className="relative">
                  {tab.icon(isActive)}

                  {/* Бейдж для корзины */}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <div className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
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
