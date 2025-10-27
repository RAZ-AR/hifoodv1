import { useEffect, useState } from 'react';
import Header from './components/Layout/Header';
import BottomNav, { TabType } from './components/Layout/BottomNav';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { LanguageProvider } from './context/LanguageContext';
import { User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('home');

  useEffect(() => {
    // Инициализация Telegram Web App
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;

      // Сообщаем Telegram что приложение готово
      tg.ready();

      // Разворачиваем на весь экран
      tg.expand();

      // Получаем данные пользователя из Telegram
      console.log('🔍 [App.tsx] Telegram WebApp:', tg);
      console.log('🔍 [App.tsx] initDataUnsafe:', tg.initDataUnsafe);
      let telegramUser = tg.initDataUnsafe.user;
      console.log('🔍 [App.tsx] Telegram User:', telegramUser);

      // Fallback: если user пустой, пробуем восстановить из localStorage
      if (!telegramUser) {
        try {
          const savedUser = localStorage.getItem('telegram_user');
          if (savedUser) {
            telegramUser = JSON.parse(savedUser);
            console.log('🔍 [App.tsx] Telegram User restored from localStorage:', telegramUser);
          }
        } catch (e) {
          console.warn('Failed to restore user from localStorage:', e);
        }
      }

      if (telegramUser) {
        // TODO: Здесь должен быть API запрос для получения/создания пользователя
        // Сейчас создаем тестового пользователя
        const testUser: User = {
          user_id: 'user_test_123',
          telegram_id: telegramUser.id,
          telegram_username: telegramUser.username,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name,
          phone: '+381641234567',
          email: undefined,

          // КАРТА ЛОЯЛЬНОСТИ (тестовая)
          loyalty_card_number: '1234',
          loyalty_card_issued_date: new Date().toISOString(),

          // БОНУСЫ
          bonus_balance: 150,
          total_bonus_earned: 500,
          total_orders: 12,
          total_spent: 15000,

          // ДАННЫЕ
          addresses: [],
          payment_methods: [
            {
              id: 'cash',
              type: 'cash',
              is_default: true,
            },
          ],
          favorite_dishes: [],

          // НАСТРОЙКИ
          preferred_language: (telegramUser.language_code === 'ru' ? 'ru' :
                              telegramUser.language_code === 'sr' ? 'sr-lat' : 'en') as User['preferred_language'],
          notifications_enabled: true,

          // МЕТАДАННЫЕ
          registered_at: new Date().toISOString(),
          last_order_date: undefined,
        };

        setUser(testUser);
      }

      setIsLoading(false);
    } else {
      // Для разработки вне Telegram
      console.warn('Telegram Web App SDK not available. Running in development mode.');

      // Создаем тестового пользователя для разработки
      const devUser: User = {
        user_id: 'user_dev_123',
        telegram_id: 123456789,
        telegram_username: 'testuser',
        first_name: 'Иван',
        last_name: 'Иванов',
        phone: '+381641234567',
        email: undefined,

        // КАРТА ЛОЯЛЬНОСТИ
        loyalty_card_number: '5678',
        loyalty_card_issued_date: new Date().toISOString(),

        // БОНУСЫ
        bonus_balance: 250,
        total_bonus_earned: 1000,
        total_orders: 25,
        total_spent: 30000,

        // ДАННЫЕ
        addresses: [],
        payment_methods: [
          {
            id: 'cash',
            type: 'cash',
            is_default: true,
          },
        ],
        favorite_dishes: [],

        // НАСТРОЙКИ
        preferred_language: 'ru',
        notifications_enabled: true,

        // МЕТАДАННЫЕ
        registered_at: new Date().toISOString(),
        last_order_date: undefined,
      };

      setUser(devUser);
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center tg-theme-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="tg-theme-text">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Обработчик клика на логотип
  const handleLogoClick = () => {
    setActiveTab('home');
  };

  // Обработчик клика на профиль
  const handleProfileClick = () => {
    setActiveTab('profile');
  };

  // Обработчик навигации на главную (для Cart)
  const handleNavigateHome = () => {
    setActiveTab('home');
  };

  // Рендер активной страницы с анимацией
  const renderPage = () => {
    const pageClassName = "animate-fade-in";

    switch (activeTab) {
      case 'home':
        return <div className={pageClassName}><Home /></div>;
      case 'favorites':
        return <div className={pageClassName}><Favorites userId={user?.user_id} /></div>;
      case 'cart':
        return <div className={pageClassName}><Cart onNavigateHome={handleNavigateHome} /></div>;
      case 'profile':
        return <div className={pageClassName}><Profile user={user} /></div>;
      default:
        return <div className={pageClassName}><Home /></div>;
    }
  };

  return (
    <LanguageProvider>
      <FavoritesProvider>
        <CartProvider>
          <div className="min-h-screen tg-theme-bg">
            <Header user={user} onLogoClick={handleLogoClick} onProfileClick={handleProfileClick} />

          <main>
            {renderPage()}
          </main>

          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </CartProvider>
    </FavoritesProvider>
    </LanguageProvider>
  );
}

export default App;
