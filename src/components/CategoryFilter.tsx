import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

/**
 * ФИЛЬТР ПО КАТЕГОРИЯМ
 *
 * Отображает горизонтальный список категорий меню
 * Позволяет выбрать одну категорию для фильтрации
 */
const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="sticky top-[73px] z-40 tg-theme-bg border-b border-gray-200 dark:border-gray-800 py-3">
      <div className="max-w-7xl mx-auto px-4">
        {/* Горизонтальный скролл категорий */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((category) => {
            const isSelected = category === selectedCategory;
            return (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`
                  px-5 py-2.5 rounded-full whitespace-nowrap transition-all text-sm font-medium
                  ${isSelected
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 tg-theme-text hover:bg-gray-200 dark:hover:bg-gray-600'
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
        /* Скрыть скроллбар для Chrome, Safari и Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Скрыть скроллбар для IE, Edge и Firefox */
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE и Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default CategoryFilter;
