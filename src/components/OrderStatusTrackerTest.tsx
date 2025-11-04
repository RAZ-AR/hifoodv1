import React, { useState } from 'react';
import OrderStatusTracker, { OrderStatus } from './OrderStatusTracker';

/**
 * Тестовый компонент для проверки виджета OrderStatusTracker
 *
 * Использование:
 * 1. Добавьте в App.tsx временно для тестирования
 * 2. Используйте кнопки для смены статусов
 * 3. Проверьте внешний вид и анимации
 */
const OrderStatusTrackerTest: React.FC = () => {
  const [showWidget, setShowWidget] = useState(true);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('accepted');

  const statuses: OrderStatus[] = ['accepted', 'preparing', 'delivering', 'delivered'];

  const nextStatus = () => {
    const currentIndex = statuses.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    setCurrentStatus(statuses[nextIndex]);
  };

  return (
    <div className="fixed bottom-20 right-4 z-[100] bg-white rounded-lg shadow-lg p-4 border border-gray-300">
      <div className="mb-4">
        <h3 className="text-sm font-bold mb-2">🧪 Тестовый виджет трекинга</h3>
        <div className="space-y-2">
          <button
            onClick={() => setShowWidget(!showWidget)}
            className="w-full px-3 py-2 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            {showWidget ? 'Скрыть виджет' : 'Показать виджет'}
          </button>
          <button
            onClick={nextStatus}
            className="w-full px-3 py-2 bg-green-500 text-white text-xs rounded hover:bg-green-600"
          >
            Следующий статус
          </button>
          <div className="text-xs text-gray-600">
            Текущий: <span className="font-bold">{currentStatus}</span>
          </div>
        </div>
      </div>

      {showWidget && (
        <OrderStatusTracker
          orderId="#89592699"
          status={currentStatus}
          onClose={() => setShowWidget(false)}
        />
      )}
    </div>
  );
};

export default OrderStatusTrackerTest;
