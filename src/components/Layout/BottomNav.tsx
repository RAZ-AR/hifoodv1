import React from 'react';
import { useCart } from '@/context/CartContext';
import { HomeIcon3D, HeartIcon3D, CartIcon3D, ProfileIcon3D } from '@/components/Icons3D';

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

  // 3D градиентные иконки
  const getIcon = (tabId: TabType, isActive: boolean) => {
    switch (tabId) {
      case 'home':
        return <HomeIcon3D size={28} active={isActive} />;
      case 'favorites':
        return <HeartIcon3D size={28} active={isActive} />;
      case 'cart':
        return <CartIcon3D size={28} active={isActive} />;
      case 'profile':
        return <ProfileIcon3D size={28} active={isActive} />;
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
                  <div className={`${isActive ? 'scale-110 animate-bounce-once' : 'scale-100'} transition-all duration-300`}>
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
