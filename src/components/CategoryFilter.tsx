import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

/**
 * ФИЛЬТР ПО КАТЕГОРИЯМ - СТИЛЬ РЕФЕРЕНСА
 *
 * Горизонтальный скролл с закругленными кнопками
 * Только текст, без иконок
 */
const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="bg-cream-300 px-4 pb-4">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-900">Category</h2>
          <button className="text-sm text-gray-600">See All</button>
        </div>

        {/* Горизонтальный скролл категорий */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
          {categories.map((category) => {
            const isSelected = category === selectedCategory;

            return (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`
                  flex-shrink-0 px-6 py-3 rounded-full whitespace-nowrap transition-all text-sm font-medium snap-start
                  ${isSelected
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        /* Скрыть скроллбар */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryFilter;
