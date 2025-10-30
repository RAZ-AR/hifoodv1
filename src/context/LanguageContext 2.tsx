import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'sr' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.menu': 'Menu',
    'nav.favorites': 'Favorites',
    'nav.cart': 'Cart',
    'nav.profile': 'Profile',

    // Header
    'header.location': 'Bengaluru',
    'header.address': 'BTM Layout, 500628',

    // Search
    'search.placeholder': 'Search Anything...',

    // Product Card
    'product.addToCart': 'Add to cart',
    'product.unavailable': 'Unavailable',
    'product.added': '✓ Added',

    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.total': 'Total:',
    'cart.checkout': 'Checkout',

    // Checkout
    'checkout.title': 'Checkout',
    'checkout.name': 'Your name',
    'checkout.namePlaceholder': 'e.g. Ivan',
    'checkout.address': 'Delivery address',
    'checkout.addressPlaceholder': 'Street, building, apartment',
    'checkout.phone': 'Phone',
    'checkout.phonePlaceholder': '+381...',
    'checkout.payment': 'Payment method',
    'checkout.cash': 'Cash',
    'checkout.card': 'Card',
    'checkout.comment': 'Comment',
    'checkout.commentPlaceholder': 'Additional notes',
    'checkout.submit': 'Place order',
    'checkout.cancel': 'Cancel',

    // Favorites
    'favorites.title': 'Favorites',
    'favorites.empty': 'No favorites yet',
    'favorites.emptyDesc': 'Add your favorite dishes from the menu',
  },
  sr: {
    // Navigation
    'nav.menu': 'Meni',
    'nav.favorites': 'Omiljeno',
    'nav.cart': 'Korpa',
    'nav.profile': 'Profil',

    // Header
    'header.location': 'Beograd',
    'header.address': 'Centar, 11000',

    // Search
    'search.placeholder': 'Pretraži...',

    // Product Card
    'product.addToCart': 'Dodaj',
    'product.unavailable': 'Nedostupno',
    'product.added': '✓ Dodato',

    // Cart
    'cart.title': 'Korpa',
    'cart.empty': 'Korpa je prazna',
    'cart.total': 'Ukupno:',
    'cart.checkout': 'Poruči',

    // Checkout
    'checkout.title': 'Poručivanje',
    'checkout.name': 'Vaše ime',
    'checkout.namePlaceholder': 'npr. Marko',
    'checkout.address': 'Adresa dostave',
    'checkout.addressPlaceholder': 'Ulica, broj, stan',
    'checkout.phone': 'Telefon',
    'checkout.phonePlaceholder': '+381...',
    'checkout.payment': 'Način plaćanja',
    'checkout.cash': 'Gotovina',
    'checkout.card': 'Kartica',
    'checkout.comment': 'Komentar',
    'checkout.commentPlaceholder': 'Dodatne napomene',
    'checkout.submit': 'Poruči',
    'checkout.cancel': 'Otkaži',

    // Favorites
    'favorites.title': 'Omiljeno',
    'favorites.empty': 'Nema omiljenih',
    'favorites.emptyDesc': 'Dodajte omiljena jela iz menija',
  },
  ru: {
    // Navigation
    'nav.menu': 'Меню',
    'nav.favorites': 'Избранное',
    'nav.cart': 'Корзина',
    'nav.profile': 'Профиль',

    // Header
    'header.location': 'Белград',
    'header.address': 'Центр, 11000',

    // Search
    'search.placeholder': 'Поиск блюд...',

    // Product Card
    'product.addToCart': 'Добавить',
    'product.unavailable': 'Недоступно',
    'product.added': '✓ Добавлено',

    // Cart
    'cart.title': 'Корзина',
    'cart.empty': 'Корзина пуста',
    'cart.total': 'Итого:',
    'cart.checkout': 'Оформить',

    // Checkout
    'checkout.title': 'Оформление заказа',
    'checkout.name': 'Ваше имя',
    'checkout.namePlaceholder': 'Например: Иван',
    'checkout.address': 'Адрес доставки',
    'checkout.addressPlaceholder': 'Улица, дом, квартира',
    'checkout.phone': 'Телефон',
    'checkout.phonePlaceholder': '+381...',
    'checkout.payment': 'Способ оплаты',
    'checkout.cash': 'Наличные',
    'checkout.card': 'Карта',
    'checkout.comment': 'Комментарий',
    'checkout.commentPlaceholder': 'Дополнительные заметки',
    'checkout.submit': 'Оформить заказ',
    'checkout.cancel': 'Отмена',

    // Favorites
    'favorites.title': 'Избранное',
    'favorites.empty': 'Избранное пусто',
    'favorites.emptyDesc': 'Добавьте любимые блюда из меню',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('sr'); // По умолчанию сербский

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
