import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFilterClick?: () => void;
}

/**
 * ПОИСКОВАЯ СТРОКА - СТИЛЬ РЕФЕРЕНСА
 *
 * С иконкой фильтра справа
 */
const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search',
  onFilterClick
}) => {
  const handleFilterClick = () => {
    // Haptic feedback
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
    if (onFilterClick) {
      onFilterClick();
    }
  };

  return (
    <div className="relative flex items-center gap-3">
      {/* Поле поиска */}
      <div className="relative flex-1">
        {/* Иконка поиска */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400">
            <circle cx="11" cy="11" r="8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Поле ввода */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm tg-theme-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Кнопка фильтра */}
      <button
        onClick={handleFilterClick}
        className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Фильтры"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-600 dark:text-gray-400">
          <line x1="4" y1="6" x2="20" y2="6" strokeWidth="2" strokeLinecap="round"/>
          <line x1="4" y1="12" x2="20" y2="12" strokeWidth="2" strokeLinecap="round"/>
          <line x1="4" y1="18" x2="20" y2="18" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="7" cy="6" r="2" fill="currentColor"/>
          <circle cx="14" cy="12" r="2" fill="currentColor"/>
          <circle cx="17" cy="18" r="2" fill="currentColor"/>
        </svg>
      </button>
    </div>
  );
};

export default SearchBar;
