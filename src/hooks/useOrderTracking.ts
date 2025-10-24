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

  useEffect(() => {
    // Загружаем активный заказ из localStorage
    const savedOrderId = localStorage.getItem(ORDER_ID_KEY);
    const savedOrderStatus = localStorage.getItem(ORDER_STATUS_KEY) as OrderStatus | null;

    if (savedOrderId && savedOrderStatus) {
      setOrderId(savedOrderId);
      setOrderStatus(savedOrderStatus);

      // Периодически обновляем статус заказа
      const interval = setInterval(async () => {
        try {
          const status = await api.getOrderStatus(savedOrderId);
          if (status?.status) {
            const newStatus = status.status as OrderStatus;
            setOrderStatus(newStatus);
            localStorage.setItem(ORDER_STATUS_KEY, newStatus);

            // Если заказ доставлен, очищаем через некоторое время
            if (newStatus === 'delivered') {
              setTimeout(() => {
                clearOrder();
              }, AUTO_CLEAR_DELAY);
            }
          }
        } catch (error) {
          console.error('Error polling order status:', error);
        }
      }, POLL_INTERVAL);

      return () => clearInterval(interval);
    }
  }, []);

  const clearOrder = () => {
    setOrderId(null);
    setOrderStatus(null);
    localStorage.removeItem(ORDER_ID_KEY);
    localStorage.removeItem(ORDER_STATUS_KEY);
  };

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
