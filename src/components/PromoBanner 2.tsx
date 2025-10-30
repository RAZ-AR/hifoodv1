import React from 'react';

/**
 * ПРОМО-БАННЕР
 *
 * Отображает промо-акцию со скидкой
 * Желтый фон с черным текстом (как в референсе)
 */
const PromoBanner: React.FC = () => {
  return (
    <div className="bg-accent-yellow rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Get 40% Discount
          </h2>
          <p className="text-sm text-gray-700">
            On your first order from app
          </p>
        </div>
        <div className="flex-shrink-0">
          <span className="text-5xl">🎉</span>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
