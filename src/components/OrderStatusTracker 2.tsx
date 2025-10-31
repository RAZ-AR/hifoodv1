import React from 'react';

export type OrderStatus = 'accepted' | 'preparing' | 'delivering' | 'delivered';

interface OrderStatusTrackerProps {
  orderId: string;
  status: OrderStatus;
  onClose: () => void;
}

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ orderId, status, onClose }) => {
  const statuses = [
    {
      id: 'accepted' as OrderStatus,
      label: 'Заказ принят',
      icon: '✅',
      color: 'text-green-500',
    },
    {
      id: 'preparing' as OrderStatus,
      label: 'Готовим ваш заказ',
      icon: '👨‍🍳',
      color: 'text-orange-500',
    },
    {
      id: 'delivering' as OrderStatus,
      label: 'Курьер едет к вам',
      icon: '🛵',
      color: 'text-blue-500',
    },
    {
      id: 'delivered' as OrderStatus,
      label: 'Заказ доставлен',
      icon: '🎉',
      color: 'text-purple-500',
    },
  ];

  const currentIndex = statuses.findIndex(s => s.id === status);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-4 relative overflow-hidden">
      {/* Фоновый градиент */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/10 dark:to-primary-800/10 opacity-50"></div>

      {/* Контент */}
      <div className="relative z-10">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold tg-theme-text">Ваш заказ</h3>
            <p className="text-xs tg-theme-hint">№{orderId}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        {/* Прогресс бар */}
        <div className="mb-6">
          <div className="relative">
            {/* Линия прогресса */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2"></div>
            <div
              className="absolute top-1/2 left-0 h-1 bg-primary-500 -translate-y-1/2 transition-all duration-500"
              style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
            ></div>

            {/* Иконки статусов */}
            <div className="relative flex justify-between">
              {statuses.map((s, index) => {
                const isActive = index === currentIndex;
                const isCompleted = index < currentIndex;
                const isUpcoming = index > currentIndex;

                return (
                  <div key={s.id} className="flex flex-col items-center">
                    {/* Иконка */}
                    <div
                      className={`
                        w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-300
                        ${isActive ? 'bg-primary-500 scale-110 animate-pulse' : ''}
                        ${isCompleted ? 'bg-primary-400' : ''}
                        ${isUpcoming ? 'bg-gray-200 dark:bg-gray-700' : ''}
                        ${isActive || isCompleted ? 'shadow-lg' : ''}
                      `}
                    >
                      <span className={isUpcoming ? 'opacity-40' : ''}>{s.icon}</span>
                    </div>

                    {/* Лейбл */}
                    <p
                      className={`
                        mt-2 text-xs text-center max-w-[70px] font-medium transition-all
                        ${isActive ? `${s.color} font-bold` : ''}
                        ${isCompleted ? 'tg-theme-text' : ''}
                        ${isUpcoming ? 'tg-theme-hint opacity-50' : ''}
                      `}
                    >
                      {s.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Текущий статус */}
        <div className="text-center">
          <p className="text-sm tg-theme-text">
            {status === 'accepted' && 'Ваш заказ принят и передан на кухню'}
            {status === 'preparing' && 'Наши повара готовят ваш заказ'}
            {status === 'delivering' && 'Курьер уже в пути к вам!'}
            {status === 'delivered' && 'Приятного аппетита! 🍽️'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusTracker;
