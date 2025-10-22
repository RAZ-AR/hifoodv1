import { useEffect, useState } from 'react';
import Header from './components/Layout/Header';
import { User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Инициализация Telegram Web App
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;

      // Сообщаем Telegram что приложение готово
      tg.ready();

      // Разворачиваем на весь экран
      tg.expand();

      // Получаем данные пользователя из Telegram
      const telegramUser = tg.initDataUnsafe.user;

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

  return (
    <div className="min-h-screen tg-theme-bg">
      <Header user={user} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center py-12">
          <div className="mb-8">
            <div className="text-6xl mb-4">🍕</div>
            <h1 className="text-3xl font-bold tg-theme-text mb-2">
              Добро пожаловать в Hi Food!
            </h1>
            <p className="tg-theme-hint text-lg">
              Доставка вкусной еды прямо к вам
            </p>
          </div>

          {user && (
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-slide-in-up">
              <h2 className="text-xl font-bold mb-4 tg-theme-text">
                Ваша карта лояльности
              </h2>

              <div className="relative overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-6 text-white loyalty-card-shimmer">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-sm opacity-90">Hi Food Card</p>
                      <p className="text-2xl font-bold mt-1">
                        #{user.loyalty_card_number}
                      </p>
                    </div>
                    <div className="text-3xl">🎴</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm opacity-90">Владелец</span>
                      <span className="font-medium">{user.first_name} {user.last_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm opacity-90">Бонусов</span>
                      <span className="font-bold text-lg">{user.bonus_balance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm opacity-90">Заказов</span>
                      <span className="font-medium">{user.total_orders}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/20">
                    <p className="text-xs opacity-75">
                      Выдана: {new Date(user.loyalty_card_issued_date).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-left space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-2xl">💰</span>
                  <div>
                    <p className="text-sm font-medium tg-theme-text">Накоплено бонусов</p>
                    <p className="text-xs tg-theme-hint">Всего заработано: {user.total_bonus_earned}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-2xl">📦</span>
                  <div>
                    <p className="text-sm font-medium tg-theme-text">Заказов выполнено</p>
                    <p className="text-xs tg-theme-hint">Общая сумма: {user.total_spent} DIN</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 text-center tg-theme-hint">
            <p className="text-sm">Frontend готов! 🎉</p>
            <p className="text-xs mt-1">
              Смотрите README.md для продолжения разработки
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
