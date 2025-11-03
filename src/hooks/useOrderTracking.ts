import { useState, useEffect } from 'react';
import { api } from '@/services/api';

export type OrderStatus = 'accepted' | 'preparing' | 'delivering' | 'delivered';

interface UseOrderTrackingReturn {
  orderId: string | null;
  orderStatus: OrderStatus | null;
  clearOrder: () => void;
}

const ORDER_ID_KEY = 'currentOrderId';
const ORDER_STATUS_KEY = 'currentOrderStatus';
const POLL_INTERVAL = 10000; // 10 seconds
const AUTO_CLEAR_DELAY = 30000; // 30 seconds

/**
 * Кастомный хук для отслеживания статуса заказа
 *
 * Функционал:
 * - Загрузка активного заказа из localStorage
 * - Автоматическое обновление статуса каждые 10 секунд
 * - Автоматическое удаление через 30 секунд после доставки
 */
export const useOrderTracking = (): UseOrderTrackingReturn => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);

  const clearOrder = () => {
    setOrderId(null);
    setOrderStatus(null);
    localStorage.removeItem(ORDER_ID_KEY);
    localStorage.removeItem(ORDER_STATUS_KEY);
  };

  // Загружаем заказ из localStorage при монтировании
  useEffect(() => {
    const savedOrderId = localStorage.getItem(ORDER_ID_KEY);
    const savedOrderStatus = localStorage.getItem(ORDER_STATUS_KEY) as OrderStatus | null;

    console.log('📦 useOrderTracking initialized');
    console.log('   savedOrderId:', savedOrderId);
    console.log('   savedOrderStatus:', savedOrderStatus);

    if (savedOrderId && savedOrderStatus) {
      setOrderId(savedOrderId);
      setOrderStatus(savedOrderStatus);
      console.log('✅ Order tracking enabled for:', savedOrderId);
    } else {
      console.log('ℹ️  No active order in localStorage');
    }
  }, []);

  // Периодически обновляем статус заказа
  useEffect(() => {
    if (!orderId) {
      console.log('⏸️  Skipping polling - no orderId');
      return;
    }

    console.log('🚀 Starting status polling for order:', orderId);

    const pollStatus = async () => {
      try {
        console.log('🔄 Polling order status for:', orderId);
        const response = await api.getOrderStatus(orderId);
        console.log('📊 Raw API response:', JSON.stringify(response, null, 2));

        if (response?.status) {
          const newStatus = response.status as OrderStatus;
          const currentStatus = localStorage.getItem(ORDER_STATUS_KEY);

          console.log('📋 Status comparison:');
          console.log('   Current:', currentStatus);
          console.log('   New:', newStatus);

          if (newStatus !== currentStatus) {
            console.log('🔔 STATUS CHANGED! Updating from', currentStatus, 'to', newStatus);
            setOrderStatus(newStatus);
            localStorage.setItem(ORDER_STATUS_KEY, newStatus);
          } else {
            console.log('➡️  Status unchanged:', newStatus);
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
          console.warn('⚠️  API returned empty or invalid status');
        }
      } catch (error) {
        console.error('❌ Error polling order status:', error);
        if (error instanceof Error) {
          console.error('   Error message:', error.message);
          console.error('   Error stack:', error.stack);
        }
      }
    };

    // Первый запрос сразу
    console.log('⏰ Running initial status check');
    pollStatus();

    // Затем каждые 10 секунд
    console.log('⏰ Setting up polling interval:', POLL_INTERVAL / 1000, 'seconds');
    const interval = setInterval(pollStatus, POLL_INTERVAL);

    return () => {
      console.log('🛑 Stopping status polling for:', orderId);
      clearInterval(interval);
    };
  }, [orderId]);

  return {
    orderId,
    orderStatus,
    clearOrder,
  };
};

/**
 * Сохраняет новый заказ в localStorage
 */
export const saveOrder = (orderId: string, status: OrderStatus = 'accepted') => {
  localStorage.setItem(ORDER_ID_KEY, orderId);
  localStorage.setItem(ORDER_STATUS_KEY, status);
};

/**
 * Генерирует уникальный ID заказа
 */
export const generateOrderId = (): string => {
  return `#${Date.now().toString().slice(-8)}`;
};
