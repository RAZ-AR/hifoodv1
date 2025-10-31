import React, { useState, useEffect } from 'react';
import { Order } from '@/types';
import { api } from '@/services/api';

interface OrderHistoryProps {
  userId?: string;
}

/**
 * СТРАНИЦА ИСТОРИИ ЗАКАЗОВ
 *
 * Отображает:
 * - Список всех заказов пользователя
 * - Статус каждого заказа
 * - Детали заказа
 */
const OrderHistory: React.FC<OrderHistoryProps> = ({ userId = 'user_test_123' }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, [userId]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const userOrders = await api.getUserOrders(userId);
      // Сортируем по дате (новые первыми)
      const sortedOrders = userOrders.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setOrders(sortedOrders);
    } catch (err) {
      console.error('Ошибка загрузки заказов:', err);
      setError('Не удалось загрузить заказы');
    } finally {
      setLoading(false);
    }
  };

  const getStatusEmoji = (status: Order['status']) => {
    const statusMap: Record<Order['status'], string> = {
      pending: '⏳',
      confirmed: '✅',
      preparing: '👨‍🍳',
      on_way: '🚗',
      delivered: '🎉',
      cancelled: '❌',
    };
    return statusMap[status] || '📋';
  };

  const getStatusText = (status: Order['status']) => {
    const statusMap: Record<Order['status'], string> = {
      pending: 'Ожидает подтверждения',
      confirmed: 'Подтвержден',
      preparing: 'Готовится',
      on_way: 'В пути',
      delivered: 'Доставлен',
      cancelled: 'Отменен',
    };
    return statusMap[status] || status;
  };

  // Состояние загрузки
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="tg-theme-hint">Загружаем заказы...</p>
        </div>
      </div>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pb-20">
        <div className="text-center">
          <span className="text-5xl mb-4 block">😞</span>
          <h2 className="text-xl font-bold tg-theme-text mb-2">Ошибка загрузки</h2>
          <p className="tg-theme-hint mb-4">{error}</p>
          <button
            onClick={loadOrders}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  // Пустой список
  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pb-20">
        <div className="text-center">
          <span className="text-6xl mb-4 block">📦</span>
          <h2 className="text-2xl font-bold tg-theme-text mb-2">Нет заказов</h2>
          <p className="tg-theme-hint">Ваши заказы появятся здесь</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Заголовок */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tg-theme-text">История заказов</h1>
          <p className="text-sm tg-theme-hint mt-1">
            Всего {orders.length} {orders.length === 1 ? 'заказ' : 'заказов'}
          </p>
        </div>

        {/* Список заказов */}
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
            >
              {/* Заголовок заказа */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold tg-theme-text">
                    Заказ #{order.order_id.slice(0, 8)}
                  </h3>
                  <p className="text-xs tg-theme-hint mt-1">
                    {new Date(order.created_at).toLocaleString('ru-RU')}
                  </p>
                </div>

                {/* Статус */}
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <span className="text-base">{getStatusEmoji(order.status)}</span>
                  <span className="text-xs font-medium tg-theme-text">
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>

              {/* Товары */}
              <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="tg-theme-text">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium tg-theme-text">
                      {item.price * item.quantity} ₽
                    </span>
                  </div>
                ))}
              </div>

              {/* Детали */}
              <div className="space-y-2">
                {/* Адрес доставки */}
                {order.delivery_address && (
                  <div className="flex items-start gap-2">
                    <span className="text-base">📍</span>
                    <div className="flex-grow">
                      <p className="text-xs tg-theme-hint">Адрес доставки</p>
                      <p className="text-sm tg-theme-text">{order.delivery_address.street}, {order.delivery_address.building}</p>
                    </div>
                  </div>
                )}

                {/* Способ оплаты */}
                <div className="flex items-start gap-2">
                  <span className="text-base">💳</span>
                  <div className="flex-grow">
                    <p className="text-xs tg-theme-hint">Способ оплаты</p>
                    <p className="text-sm tg-theme-text">
                      {order.payment_method.type === 'cash' ? 'Наличные' : 'Банковская карта'}
                    </p>
                  </div>
                </div>

                {/* Итого */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="font-semibold tg-theme-text">Итого:</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-primary-600">
                      {order.total_amount}
                    </span>
                    <span className="text-sm tg-theme-hint">₽</span>
                  </div>
                </div>

                {/* Использованные бонусы */}
                {order.bonus_applied > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="tg-theme-hint">Использовано бонусов:</span>
                    <span className="text-primary-600 font-medium">
                      -{order.bonus_applied} ₽
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
