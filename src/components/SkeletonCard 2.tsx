import React from 'react';

/**
 * СКЕЛЕТОН КАРТОЧКИ
 *
 * Красивый placeholder для карточки товара во время загрузки
 */
const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Изображение */}
      <div className="h-48 skeleton"></div>

      {/* Контент */}
      <div className="p-4">
        {/* Название */}
        <div className="h-6 skeleton rounded mb-2"></div>

        {/* Описание */}
        <div className="space-y-2 mb-3">
          <div className="h-4 skeleton rounded w-full"></div>
          <div className="h-4 skeleton rounded w-3/4"></div>
        </div>

        {/* Время */}
        <div className="h-4 skeleton rounded w-20 mb-3"></div>

        {/* Цена и кнопка */}
        <div className="flex items-center justify-between">
          <div className="h-6 skeleton rounded w-16"></div>
          <div className="h-10 skeleton rounded w-28"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
