import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

/**
 * ФИЛЬТР ПО КАТЕГОРИЯМ - НОВЫЙ ДИЗАЙН
 *
 * Круглые кнопки с эмодзи как в референсе
 * Вертикальная сетка 4 колонки
 */

// Маппинг категорий на эмодзи
const categoryEmoji: Record<string, string> = {
  'Все': '🍽️',
  'Бургеры': '🍔',
  'Пицца': '🍕',
  'Салаты': '🥗',
  'Десерты': '🍰',
  'Напитки': '🥤',
  'Супы': '🍲',
  'Паста': '🍝',
  'Суши': '🍣',
  'Роллы': '🍱',
  'Закуски': '🍟',
  'Соусы': '🧂',
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="bg-cream-300 px-4 pt-4 pb-2">
      <div className="max-w-7xl mx-auto">
        {/* Сетка категорий */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {categories.map((category) => {
            const isSelected = category === selectedCategory;
            const emoji = categoryEmoji[category] || '🍽️';

            return (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className="flex flex-col items-center gap-2 transition-all"
              >
                {/* Круглая иконка */}
                <div
                  className={`
                    w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all
                    ${isSelected
                      ? 'bg-primary-500 shadow-lg scale-110'
                      : 'bg-white shadow-md hover:scale-105'
                    }
                  `}
                >
                  {emoji}
                </div>

                {/* Название категории */}
                <span
                  className={`
                    text-xs font-medium text-center line-clamp-1
                    ${isSelected ? 'text-primary-600 font-semibold' : 'text-gray-700'}
                  `}
                >
                  {category}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
