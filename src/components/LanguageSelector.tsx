import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface LanguageSelectorProps {
  variant?: 'header' | 'profile';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'header' }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'ru' as const, label: t('lang.ru'), flag: '🇷🇺' },
    { code: 'en' as const, label: t('lang.en'), flag: '🇬🇧' },
    { code: 'sr' as const, label: t('lang.sr'), flag: '🇷🇸' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  // Закрыть dropdown при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (code: 'en' | 'sr' | 'ru') => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (variant === 'header') {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span className="text-base">{currentLanguage?.flag}</span>
          <span className="text-xs font-medium text-gray-700">{currentLanguage?.label}</span>
          <svg
            className={`w-3 h-3 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${
                  language === lang.code ? 'bg-gray-50 font-medium' : ''
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span className="text-gray-900">{lang.label}</span>
                {language === lang.code && (
                  <span className="ml-auto text-primary-500">✓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Profile variant
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-3"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🌍</span>
          <span className="text-sm font-medium text-gray-900">{t('profile.language')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{currentLanguage?.label}</span>
          <svg
            className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="mt-2 bg-gray-50 rounded-lg p-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-white transition-colors ${
                language === lang.code ? 'bg-white font-medium' : ''
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span className="text-gray-900">{lang.label}</span>
              {language === lang.code && (
                <span className="ml-auto text-primary-500">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
