import React, { useRef, useEffect } from 'react';

interface SubCategoryFilterProps {
  subCategories: string[];
  selectedSubCategory: string | null;
  onSubCategoryChange: (subCategory: string | null) => void;
}

/**
 * ФИЛЬТР ПО ПОДКАТЕГОРИЯМ
 *
 * Горизонтальный скролл с подкатегориями.
 * Отображается только когда выбрана основная категория.
 */
const SubCategoryFilter: React.FC<SubCategoryFilterProps> = ({
  subCategories,
  selectedSubCategory,
  onSubCategoryChange,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Автоматический скролл к выбранной подкатегории
  useEffect(() => {
    if (selectedSubCategory && scrollContainerRef.current) {
      const selectedButton = scrollContainerRef.current.querySelector(
        `[data-subcategory="${selectedSubCategory}"]`
      ) as HTMLElement;

      if (selectedButton) {
        selectedButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [selectedSubCategory]);

  // Если нет подкатегорий, не отображаем компонент
  if (subCategories.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-[126px] z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-2.5">
      <div className="max-w-7xl mx-auto">
        <div
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto px-4 scrollbar-hide scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* Кнопка "Все" для сброса фильтра по подкатегории */}
          <button
            onClick={() => onSubCategoryChange(null)}
            data-subcategory="all"
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
              selectedSubCategory === null
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 tg-theme-text hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Все
          </button>

          {/* Кнопки подкатегорий */}
          {subCategories.map((subCategory) => (
            <button
              key={subCategory}
              onClick={() => onSubCategoryChange(subCategory)}
              data-subcategory={subCategory}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                selectedSubCategory === subCategory
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 tg-theme-text hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {subCategory}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubCategoryFilter;
