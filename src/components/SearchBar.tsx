import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * ПОИСКОВАЯ СТРОКА
 *
 * Стиль HyperMart с иконкой микрофона
 */
const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search Anything...'
}) => {
  const handleVoiceSearch = () => {
    // Haptic feedback
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
      window.Telegram.WebApp.showAlert('Голосовой поиск в разработке');
    }
  };

  return (
    <div className="relative">
      {/* Иконка поиска */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <svg width="20" height="20" viewBox="0 0 24 24" className="fill-gray-400">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      </div>

      {/* Поле ввода */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-12 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm tg-theme-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
      />

      {/* Иконка микрофона */}
      <button
        onClick={handleVoiceSearch}
        className="absolute right-4 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
        aria-label="Голосовой поиск"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" className="fill-primary-500">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
        </svg>
      </button>
    </div>
  );
};

export default SearchBar;
