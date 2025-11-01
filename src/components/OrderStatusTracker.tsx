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
    },
    {
      id: 'preparing' as OrderStatus,
      label: 'Готовим ваш заказ',
      icon: '👨‍🍳',
    },
    {
      id: 'delivering' as OrderStatus,
      label: 'Курьер едет к вам',
      icon: '🛵',
    },
    {
      id: 'delivered' as OrderStatus,
      label: 'Заказ доставлен',
      icon: '🎉',
    },
  ];

  const currentIndex = statuses.findIndex(s => s.id === status);
  const currentStatus = statuses[currentIndex];

  return (
    <div
      className="bg-white rounded-2xl p-5 mb-4 relative"
      style={{
        backdropFilter: 'blur(24px) saturate(180%)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.18)'
      }}
    >
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">Ваш заказ</h3>
          <p className="text-xs text-gray-500">№{orderId}</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Закрыть"
        >
          <span className="text-xl text-gray-500">×</span>
        </button>
      </div>

      {/* Иконки статусов в ряд */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {statuses.map((s, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;

          return (
            <React.Fragment key={s.id}>
              {/* Иконка */}
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300
                  ${isActive ? 'bg-primary-500 scale-110 shadow-lg' : ''}
                  ${isCompleted ? 'bg-gray-200' : ''}
                  ${!isActive && !isCompleted ? 'bg-gray-100' : ''}
                `}
              >
                <span className={!isActive && !isCompleted ? 'opacity-30' : ''}>{s.icon}</span>
              </div>

              {/* Линия между иконками (кроме последней) */}
              {index < statuses.length - 1 && (
                <div
                  className={`h-0.5 w-8 transition-all duration-300 ${
                    isCompleted ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Текущий статус - одной строкой */}
      <div className="text-center">
        <p className="text-sm font-medium text-gray-900">
          {currentStatus?.label}
        </p>
      </div>
    </div>
  );
};

export default OrderStatusTracker;
