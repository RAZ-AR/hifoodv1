import React from 'react';
import { useCart } from '@/context/CartContext';

export type TabType = 'home' | 'favorites' | 'cart' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

/**
 * НИЖНЯЯ НАВИГАЦИЯ - НОВЫЙ ДИЗАЙН
 *
 * Черная округленная панель как в референсе
 * Белые иконки с зеленым акцентом для активной вкладки
 */
const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { getTotalItems } = useCart();
  const cartItemsCount = getTotalItems();

  const tabs = [
    {
      id: 'home' as TabType,
      label: 'Меню',
      icon: (isActive: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={isActive ? 'stroke-primary-500' : 'stroke-white'} strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'favorites' as TabType,
      label: 'Избранное',
      icon: (isActive: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" className={isActive ? 'fill-primary-500' : 'fill-none stroke-white'} strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'cart' as TabType,
      label: 'Корзина',
      badge: cartItemsCount,
      icon: (isActive: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={isActive ? 'stroke-primary-500' : 'stroke-white'} strokeWidth="2">
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={isActive ? 'stroke-primary-500' : 'stroke-white'} strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    },
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-accent-black rounded-full shadow-2xl px-6 py-3">
          <div className="flex justify-around items-center">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all
                    ${isActive ? 'scale-110' : 'scale-100'}
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

                  <span className={`text-xs font-medium ${isActive ? 'text-primary-500' : 'text-white'}`}>
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
