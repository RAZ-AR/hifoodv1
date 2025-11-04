import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/services/api';
import { getTelegramUser } from '@/utils/telegram';

export type OrderStatus = 'accepted' | 'preparing' | 'delivering' | 'delivered';

interface OrderTrackingContextType {
  orderId: string | null;
  orderStatus: OrderStatus | null;
  clearOrder: () => void;
}

const OrderTrackingContext = createContext<OrderTrackingContextType | undefined>(undefined);

const POLL_INTERVAL = 10000; // 10 seconds
const AUTO_CLEAR_DELAY = 30000; // 30 seconds after delivered

interface OrderTrackingProviderProps {
  children: ReactNode;
}

/**
 * OrderTrackingProvider - Глобальный провайдер для отслеживания статуса заказа
 *
 * Функционал:
 * - Загружает активный заказ из БД по telegram_id
 * - Автоматически обновляет статус каждые 10 секунд
 * - Автоматически скрывает виджет через 30 секунд после доставки
 * - Показывает только активные заказы (не delivered)
 */
export const OrderTrackingProvider: React.FC<OrderTrackingProviderProps> = ({ children }) => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);

  const clearOrder = () => {
    console.log('🧹 Clearing order state');
    setOrderId(null);
    setOrderStatus(null);
  };

  useEffect(() => {
    // Очищаем старые данные из localStorage
    localStorage.removeItem('currentOrderId');
    localStorage.removeItem('currentOrderStatus');

    const telegramUser = getTelegramUser();
    const telegramId = telegramUser?.id;

    console.log('📦 OrderTrackingProvider initialized');
    console.log('   Telegram User:', JSON.stringify(telegramUser, null, 2));
    console.log('   Telegram ID:', telegramId);
    console.log('   Window.Telegram.WebApp:', (window as any).Telegram?.WebApp);

    if (!telegramId) {
      console.log('⏸️  No telegram ID, skipping order tracking');
      console.log('   Available globals:', {
        hasTelegram: !!(window as any).Telegram,
        hasWebApp: !!(window as any).Telegram?.WebApp,
        hasInitData: !!(window as any).Telegram?.WebApp?.initDataUnsafe,
      });
      return;
    }

    let autoHideTimeout: NodeJS.Timeout | null = null;

    const fetchActiveOrder = async () => {
      try {
        console.log('🔄 Fetching active orders for telegram ID:', telegramId);

        let orders: any[] = [];
        try {
          orders = await api.getUserOrdersByTelegramId(telegramId);
          console.log('📊 Orders from API:', orders.length);
        } catch (apiError) {
          console.warn('⚠️ API error, will retry:', apiError);
          // Продолжаем работу, даже если API вернул ошибку
          // На следующем цикле попробуем снова
          return;
        }

        // Фильтруем только активные заказы (не delivered)
        const activeOrders = orders.filter((order: any) => order.status !== 'delivered');
        console.log('✅ Active orders:', activeOrders.length);

        if (activeOrders.length > 0) {
          // Берем самый последний активный заказ
          const latestOrder = activeOrders[0] as any;
          const newOrderId = latestOrder.order_number;
          const newStatus = latestOrder.status as OrderStatus;

          console.log('📋 Latest active order:', newOrderId, 'Status:', newStatus);

          // Обновляем состояние только если изменилось
          if (newOrderId !== orderId || newStatus !== orderStatus) {
            console.log('🔔 ORDER UPDATE! Setting:', newOrderId, newStatus);
            setOrderId(newOrderId);
            setOrderStatus(newStatus);

            // Если заказ доставлен, очищаем через некоторое время
            if (newStatus === 'delivered') {
              console.log('🎉 Order delivered! Will auto-clear in', AUTO_CLEAR_DELAY / 1000, 'seconds');

              // Очищаем предыдущий таймер если есть
              if (autoHideTimeout) {
                clearTimeout(autoHideTimeout);
              }

              autoHideTimeout = setTimeout(() => {
                console.log('🧹 Auto-clearing delivered order');
                clearOrder();
              }, AUTO_CLEAR_DELAY);
            }
          } else {
            console.log('➡️  Order unchanged:', newOrderId, newStatus);
          }
        } else {
          console.log('ℹ️  No active orders found');
          // Очищаем если нет активных заказов
          if (orderId) {
            console.log('🧹 Clearing order state');
            clearOrder();
          }
        }
      } catch (error) {
        console.error('❌ Error fetching active order:', error);
        if (error instanceof Error) {
          console.error('   Error message:', error.message);
        }
      }
    };

    // Первый запрос сразу
    console.log('⏰ Running initial order check');
    fetchActiveOrder();

    // Затем каждые 10 секунд
    console.log('⏰ Setting up polling interval:', POLL_INTERVAL / 1000, 'seconds');
    const interval = setInterval(fetchActiveOrder, POLL_INTERVAL);

    return () => {
      console.log('🛑 Stopping order polling');
      clearInterval(interval);
      if (autoHideTimeout) {
        clearTimeout(autoHideTimeout);
      }
    };
  }, []); // Убираем orderId и orderStatus из зависимостей для устранения бесконечного цикла

  const value: OrderTrackingContextType = {
    orderId,
    orderStatus,
    clearOrder,
  };

  return (
    <OrderTrackingContext.Provider value={value}>
      {children}
    </OrderTrackingContext.Provider>
  );
};

/**
 * useOrderTracking - Хук для доступа к контексту трекинга заказа
 */
export const useOrderTracking = (): OrderTrackingContextType => {
  const context = useContext(OrderTrackingContext);
  if (context === undefined) {
    throw new Error('useOrderTracking must be used within OrderTrackingProvider');
  }
  return context;
};
