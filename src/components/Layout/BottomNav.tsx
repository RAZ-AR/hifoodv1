import React from 'react';
import { useCart } from '@/context/CartContext';

export type TabType = 'home' | 'favorites' | 'cart' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

/**
 * НИЖНЯЯ НАВИГАЦИЯ
 *
 * Отображает 4 вкладки:
 * - Меню (home)
 * - Корзина (cart) с бейджем количества товаров
 * - Заказы (orders)
 * - Профиль (profile)
 */
const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { getTotalItems } = useCart();
  const cartItemsCount = getTotalItems();

  const tabs = [
    { id: 'home' as TabType, label: 'Меню' },
    { id: 'favorites' as TabType, label: 'Избранное' },
    { id: 'cart' as TabType, label: 'Корзина', badge: cartItemsCount },
    { id: 'profile' as TabType, label: 'Профиль' },
  ];

  // SVG иконки в стиле HyperMart (filled)
  const getIcon = (tabId: TabType, isActive: boolean) => {
    const fillClass = isActive ? 'fill-primary-500' : 'fill-gray-400';

    switch (tabId) {
      case 'home':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" className={fillClass}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        );
      case 'favorites':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" className={fillClass}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        );
      case 'cart':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" className={fillClass}>
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        );
      case 'profile':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" className={fillClass}>
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        );
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 tg-theme-bg border-t border-gray-200 dark:border-gray-800 safe-area-bottom">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all
                  ${isActive ? 'text-primary-500' : 'text-gray-400 hover:text-gray-600'}
                `}
              >
                <div className="relative">
                  <div className={`${isActive ? 'scale-110' : 'scale-100'} transition-transform`}>
                    {getIcon(tab.id, isActive)}
                  </div>

                  {/* Бейдж для корзины */}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-accent-coral text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </div>
                  )}
                </div>

                <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
