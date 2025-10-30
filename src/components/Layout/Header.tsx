import React, { useState, useEffect, useRef } from 'react';
import { User } from '@/types';
import logo from '@/assets/logo.svg';
import { useLanguage } from '@/context/LanguageContext';
import { NotificationIcon3D } from '@/components/Icons3D';

interface HeaderProps {
  user: User | null;
  onLogoClick?: () => void;
  onProfileClick?: () => void;
}

/**
 * HEADER
 *
 * Отображает:
 * - Логотип приложения
 * - Выбор языка (EN/SR/RU)
 * - Уведомления
 */
const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  const { language, setLanguage } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Закрываем dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
    };

    if (showLangMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showLangMenu]);

  const handleNotificationClick = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
      window.Telegram.WebApp.showAlert('Уведомления в разработке');
    }
  };

  const languages = [
    { code: 'en' as const, label: 'Eng' },
    { code: 'sr' as const, label: 'Srp' },
    { code: 'ru' as const, label: 'Рус' },
  ];

  const currentLang = languages.find(l => l.code === language);

  return (
    <header className="sticky top-0 z-50 tg-theme-bg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Лого + Язык + Уведомления */}
        <div className="flex items-center justify-between">
          {/* Лого */}
          <button
            onClick={onLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <img src={logo} alt="Hi Food" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-base font-bold text-primary-500">HiFood</span>
          </button>

          {/* Правая часть: Язык + Уведомления */}
          <div className="flex items-center gap-3">
            {/* Выбор языка */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="text-xs font-medium tg-theme-text hover:opacity-70 transition-opacity flex items-center gap-1"
              >
                {currentLang?.label}
                <svg width="12" height="12" viewBox="0 0 24 24" className="fill-current">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>

              {/* Dropdown меню языков */}
              {showLangMenu && (
                <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[80px] z-50 animate-fade-in">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLangMenu(false);
                        if (window.Telegram?.WebApp) {
                          window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
                        }
                      }}
                      className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        language === lang.code ? 'text-primary-500 font-bold' : 'tg-theme-text'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Уведомления */}
            <button
              onClick={handleNotificationClick}
              className="relative hover:scale-110 transition-transform"
            >
              <NotificationIcon3D size={24} />
              {/* Индикатор новых уведомлений */}
              <div className="absolute top-0 right-0 w-2 h-2 bg-accent-coral rounded-full animate-pulse"></div>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
