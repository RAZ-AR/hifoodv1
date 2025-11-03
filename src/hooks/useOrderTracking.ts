import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { getTelegramUser } from '@/utils/telegram';

export type OrderStatus = 'accepted' | 'preparing' | 'delivering' | 'delivered';

interface UseOrderTrackingReturn {
  orderId: string | null;
  orderStatus: OrderStatus | null;
  clearOrder: () => void;
}

const POLL_INTERVAL = 10000; // 10 seconds
const AUTO_CLEAR_DELAY = 30000; // 30 seconds

/**
 * Кастомный хук для отслеживания статуса заказа
 *
 * Функционал:
 * - Загрузка активного заказа из БД по telegram_id
 * - Автоматическое обновление статуса каждые 10 секунд
 * - Автоматическое удаление через 30 секунд после доставки
 * - Показывает только активные заказы (не delivered)
 */
export const useOrderTracking = (): UseOrderTrackingReturn => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);

  const clearOrder = () => {
    setOrderId(null);
    setOrderStatus(null);
  };

  // Загружаем активный заказ из БД при монтировании и периодически обновляем
  useEffect(() => {
    const telegramUser = getTelegramUser();
    const telegramId = telegramUser?.id;

    if (!telegramId) {
      console.log('⏸️  No telegram ID, skipping order tracking');
      return;
    }

    console.log('📦 useOrderTracking initialized for telegram ID:', telegramId);

    const fetchActiveOrder = async () => {
      try {
        console.log('🔄 Fetching active orders for telegram ID:', telegramId);
        const orders = await api.getUserOrdersByTelegramId(telegramId);
        console.log('📊 Orders from API:', orders.length);

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
          } else {
            console.log('➡️  Order unchanged:', newOrderId, newStatus);
          }

          // Если заказ доставлен, очищаем через некоторое время
          if (newStatus === 'delivered') {
            console.log('🎉 Order delivered! Will auto-clear in', AUTO_CLEAR_DELAY / 1000, 'seconds');
            setTimeout(() => {
              console.log('🧹 Auto-clearing delivered order');
              clearOrder();
            }, AUTO_CLEAR_DELAY);
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
    };
  }, [orderId, orderStatus]); // Добавляем зависимости чтобы обновлялись корректно

  return {
    orderId,
    orderStatus,
    clearOrder,
  };
};

/**
 * Генерирует уникальный ID заказа
 */
export const generateOrderId = (): string => {
  return `#${Date.now().toString().slice(-8)}`;
};
