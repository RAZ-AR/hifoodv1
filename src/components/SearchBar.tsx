import React from 'react';
import { SearchIcon3D, MicIcon3D } from './Icons3D';

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
        <SearchIcon3D size={20} />
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
        <MicIcon3D size={20} />
      </button>
    </div>
  );
};

export default SearchBar;
