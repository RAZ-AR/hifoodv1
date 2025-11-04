import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export type OrderStatus = 'accepted' | 'preparing' | 'delivering' | 'delivered';

interface OrderStatusTrackerProps {
  orderId: string;
  status: OrderStatus;
  onClose: () => void;
}

/**
 * OrderStatusTracker - Компактный виджет трекинга заказа
 *
 * Стиль: Референс - одна строка с иконкой и текстом
 * Синхронизирован с кнопками Telegram бота
 */
const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ orderId, status, onClose }) => {
  const { t } = useLanguage();

  // Синхронизировано с кнопками Telegram бота
  const statusConfig: Record<OrderStatus, { icon: string; label: string; bgColor: string; textColor: string }> = {
    'accepted': {
      icon: '✅',
      label: t('orderStatus.confirmed') || 'Принят',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    'preparing': {
      icon: '👨‍🍳',
      label: t('orderStatus.preparing') || 'Готовится',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
    'delivering': {
      icon: '🛵',
      label: t('orderStatus.delivering') || 'В пути',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    'delivered': {
      icon: '🎉',
      label: t('orderStatus.delivered') || 'Доставлен',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <div
      className={`
        fixed top-0 left-0 right-0 z-50
        ${currentStatus.bgColor} border-b border-gray-200
        px-4 py-3
        animate-slide-down
        shadow-sm
      `}
      style={{
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Левая часть: Иконка + Статус + Номер заказа */}
        <div className="flex items-center gap-3">
          <span className="text-2xl animate-bounce-gentle">{currentStatus.icon}</span>
          <div className="flex flex-col">
            <span className={`text-sm font-bold ${currentStatus.textColor}`}>
              {currentStatus.label}
            </span>
            <span className="text-xs text-gray-500">
              #{orderId}
            </span>
          </div>
        </div>

        {/* Правая часть: Кнопка закрытия */}
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Закрыть"
        >
          <span className="text-lg text-gray-600">×</span>
        </button>
      </div>
    </div>
  );
};

export default OrderStatusTracker;
