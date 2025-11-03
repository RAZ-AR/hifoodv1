import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'sr' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LANGUAGE_STORAGE_KEY = 'hifood_language';

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.menu': 'Menu',
    'nav.favorites': 'Favorites',
    'nav.cart': 'Cart',
    'nav.profile': 'Profile',

    // Header
    'header.hi': 'Hi',
    'header.guest': 'Guest',

    // Search
    'search.placeholder': 'Search',

    // Home
    'home.popularFood': 'Popular Food',
    'home.seeAll': 'See All',
    'home.loading': 'Loading...',
    'home.error': 'Loading error',
    'home.tryAgain': 'Try again',
    'home.emptyMenu': 'Menu is empty',
    'home.emptyMenuDesc': 'No available dishes at the moment',
    'home.noResults': 'No results found',
    'home.noDishesCategory': 'No dishes in category',
    'home.noDishesSubCategory': 'No dishes in subcategory',

    // Product Card
    'product.addToCart': 'Add',
    'product.unavailable': 'Unavailable',
    'product.available': 'Available',

    // Cart
    'cart.title': 'Cart',
    'cart.empty': 'Your cart is empty',
    'cart.emptyDesc': 'Add dishes from the menu',
    'cart.subtotal': 'Subtotal',
    'cart.delivery': 'Delivery',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.recommendations': 'You might also like',
    'cart.remove': 'Remove',

    // Checkout
    'checkout.title': 'Checkout',
    'checkout.orderDetails': 'Order Details',
    'checkout.deliveryInfo': 'Delivery Information',
    'checkout.name': 'Your name',
    'checkout.namePlaceholder': 'e.g. Ivan',
    'checkout.address': 'Delivery address',
    'checkout.addressPlaceholder': 'Street, building, apartment',
    'checkout.phone': 'Phone',
    'checkout.phonePlaceholder': '+381...',
    'checkout.loyaltyCard': 'Loyalty card number (optional)',
    'checkout.loyaltyCardPlaceholder': 'Enter card number',
    'checkout.payment': 'Payment method',
    'checkout.cash': 'Cash',
    'checkout.card': 'Card',
    'checkout.comment': 'Comment',
    'checkout.commentPlaceholder': 'Additional notes',
    'checkout.placeOrder': 'Place order',
    'checkout.cancel': 'Cancel',
    'checkout.total': 'Total',

    // Favorites
    'favorites.title': 'Favorites',
    'favorites.empty': 'No favorites yet',
    'favorites.emptyDesc': 'Add your favorite dishes from the menu',

    // Profile
    'profile.title': 'Profile',
    'profile.notAuthorized': 'Not Authorized',
    'profile.openFromTelegram': 'Open the app from Telegram',
    'profile.phone': 'Phone',
    'profile.email': 'Email',
    'profile.memberSince': 'Member Since',
    'profile.loyaltyCard': 'Loyalty Card',
    'profile.bonusBalance': 'Bonus Balance',
    'profile.totalOrders': 'Total Orders',
    'profile.totalSpent': 'Total Spent',
    'profile.orderHistory': 'Order History',
    'profile.noOrders': 'No orders yet',
    'profile.settings': 'Settings',
    'profile.notifications': 'Notifications',
    'profile.language': 'Language',

    // Order History
    'orders.title': 'Order History',
    'orders.empty': 'No orders yet',
    'orders.emptyDesc': 'Place your first order from the menu',
    'orders.status': 'Status',
    'orders.date': 'Date',
    'orders.items': 'items',

    // Order Status
    'orderStatus.pending': 'Pending',
    'orderStatus.confirmed': 'Confirmed',
    'orderStatus.preparing': 'Preparing',
    'orderStatus.ready': 'Ready',
    'orderStatus.delivering': 'Delivering',
    'orderStatus.delivered': 'Delivered',
    'orderStatus.cancelled': 'Cancelled',

    // Language selector
    'lang.en': 'EN',
    'lang.sr': 'SR',
    'lang.ru': 'RU',
  },
  sr: {
    // Navigation
    'nav.menu': 'Meni',
    'nav.favorites': 'Omiljeno',
    'nav.cart': 'Korpa',
    'nav.profile': 'Profil',

    // Header
    'header.hi': 'Zdravo',
    'header.guest': 'Gost',

    // Search
    'search.placeholder': 'Pretraga',

    // Home
    'home.popularFood': 'Popularna Jela',
    'home.seeAll': 'Vidi sve',
    'home.loading': 'Učitavanje...',
    'home.error': 'Greška pri učitavanju',
    'home.tryAgain': 'Pokušaj ponovo',
    'home.emptyMenu': 'Meni je prazan',
    'home.emptyMenuDesc': 'Trenutno nema dostupnih jela',
    'home.noResults': 'Nema rezultata',
    'home.noDishesCategory': 'Nema jela u kategoriji',
    'home.noDishesSubCategory': 'Nema jela u podkategoriji',

    // Product Card
    'product.addToCart': 'Dodaj',
    'product.unavailable': 'Nedostupno',
    'product.available': 'Dostupno',

    // Cart
    'cart.title': 'Korpa',
    'cart.empty': 'Korpa je prazna',
    'cart.emptyDesc': 'Dodajte jela iz menija',
    'cart.subtotal': 'Međuzbroj',
    'cart.delivery': 'Dostava',
    'cart.total': 'Ukupno',
    'cart.checkout': 'Poruči',
    'cart.recommendations': 'Možda vam se svidi',
    'cart.remove': 'Ukloni',

    // Checkout
    'checkout.title': 'Poručivanje',
    'checkout.orderDetails': 'Detalji porudžbine',
    'checkout.deliveryInfo': 'Informacije o dostavi',
    'checkout.name': 'Vaše ime',
    'checkout.namePlaceholder': 'npr. Marko',
    'checkout.address': 'Adresa dostave',
    'checkout.addressPlaceholder': 'Ulica, broj, stan',
    'checkout.phone': 'Telefon',
    'checkout.phonePlaceholder': '+381...',
    'checkout.loyaltyCard': 'Broj kartice lojalnosti (opciono)',
    'checkout.loyaltyCardPlaceholder': 'Unesite broj kartice',
    'checkout.payment': 'Način plaćanja',
    'checkout.cash': 'Gotovina',
    'checkout.card': 'Kartica',
    'checkout.comment': 'Komentar',
    'checkout.commentPlaceholder': 'Dodatne napomene',
    'checkout.placeOrder': 'Poruči',
    'checkout.cancel': 'Otkaži',
    'checkout.total': 'Ukupno',

    // Favorites
    'favorites.title': 'Omiljeno',
    'favorites.empty': 'Nema omiljenih',
    'favorites.emptyDesc': 'Dodajte omiljena jela iz menija',

    // Profile
    'profile.title': 'Profil',
    'profile.notAuthorized': 'Niste autorizovani',
    'profile.openFromTelegram': 'Otvorite aplikaciju iz Telegrama',
    'profile.phone': 'Telefon',
    'profile.email': 'Email',
    'profile.memberSince': 'Član od',
    'profile.loyaltyCard': 'Kartica lojalnosti',
    'profile.bonusBalance': 'Bonus stanje',
    'profile.totalOrders': 'Ukupno porudžbina',
    'profile.totalSpent': 'Ukupno potrošeno',
    'profile.orderHistory': 'Istorija porudžbina',
    'profile.noOrders': 'Još nema porudžbina',
    'profile.settings': 'Podešavanja',
    'profile.notifications': 'Obaveštenja',
    'profile.language': 'Jezik',

    // Order History
    'orders.title': 'Istorija porudžbina',
    'orders.empty': 'Nema porudžbina',
    'orders.emptyDesc': 'Naručite prvo jelo iz menija',
    'orders.status': 'Status',
    'orders.date': 'Datum',
    'orders.items': 'stavki',

    // Order Status
    'orderStatus.pending': 'Na čekanju',
    'orderStatus.confirmed': 'Potvrđeno',
    'orderStatus.preparing': 'Priprema se',
    'orderStatus.ready': 'Spremno',
    'orderStatus.delivering': 'U dostavi',
    'orderStatus.delivered': 'Dostavljeno',
    'orderStatus.cancelled': 'Otkazano',

    // Language selector
    'lang.en': 'EN',
    'lang.sr': 'SR',
    'lang.ru': 'RU',
  },
  ru: {
    // Navigation
    'nav.menu': 'Меню',
    'nav.favorites': 'Избранное',
    'nav.cart': 'Корзина',
    'nav.profile': 'Профиль',

    // Header
    'header.hi': 'Привет',
    'header.guest': 'Гость',

    // Search
    'search.placeholder': 'Поиск',

    // Home
    'home.popularFood': 'Популярные блюда',
    'home.seeAll': 'Смотреть всё',
    'home.loading': 'Загрузка...',
    'home.error': 'Ошибка загрузки',
    'home.tryAgain': 'Попробовать снова',
    'home.emptyMenu': 'Меню пусто',
    'home.emptyMenuDesc': 'В данный момент нет доступных блюд',
    'home.noResults': 'Ничего не найдено',
    'home.noDishesCategory': 'Нет блюд в категории',
    'home.noDishesSubCategory': 'Нет блюд в подкатегории',

    // Product Card
    'product.addToCart': 'Добавить',
    'product.unavailable': 'Недоступно',
    'product.available': 'Доступно',

    // Cart
    'cart.title': 'Корзина',
    'cart.empty': 'Корзина пуста',
    'cart.emptyDesc': 'Добавьте блюда из меню',
    'cart.subtotal': 'Промежуточный итог',
    'cart.delivery': 'Доставка',
    'cart.total': 'Итого',
    'cart.checkout': 'Оформить',
    'cart.recommendations': 'Вам также может понравиться',
    'cart.remove': 'Удалить',

    // Checkout
    'checkout.title': 'Оформление заказа',
    'checkout.orderDetails': 'Детали заказа',
    'checkout.deliveryInfo': 'Информация о доставке',
    'checkout.name': 'Ваше имя',
    'checkout.namePlaceholder': 'Например: Иван',
    'checkout.address': 'Адрес доставки',
    'checkout.addressPlaceholder': 'Улица, дом, квартира',
    'checkout.phone': 'Телефон',
    'checkout.phonePlaceholder': '+381...',
    'checkout.loyaltyCard': 'Номер карты лояльности (необязательно)',
    'checkout.loyaltyCardPlaceholder': 'Введите номер карты',
    'checkout.payment': 'Способ оплаты',
    'checkout.cash': 'Наличные',
    'checkout.card': 'Карта',
    'checkout.comment': 'Комментарий',
    'checkout.commentPlaceholder': 'Дополнительные заметки',
    'checkout.placeOrder': 'Оформить заказ',
    'checkout.cancel': 'Отмена',
    'checkout.total': 'Итого',

    // Favorites
    'favorites.title': 'Избранное',
    'favorites.empty': 'Избранное пусто',
    'favorites.emptyDesc': 'Добавьте любимые блюда из меню',

    // Profile
    'profile.title': 'Профиль',
    'profile.notAuthorized': 'Не авторизован',
    'profile.openFromTelegram': 'Откройте приложение из Telegram',
    'profile.phone': 'Телефон',
    'profile.email': 'Email',
    'profile.memberSince': 'Участник с',
    'profile.loyaltyCard': 'Карта лояльности',
    'profile.bonusBalance': 'Бонусный баланс',
    'profile.totalOrders': 'Всего заказов',
    'profile.totalSpent': 'Всего потрачено',
    'profile.orderHistory': 'История заказов',
    'profile.noOrders': 'Заказов пока нет',
    'profile.settings': 'Настройки',
    'profile.notifications': 'Уведомления',
    'profile.language': 'Язык',

    // Order History
    'orders.title': 'История заказов',
    'orders.empty': 'Заказов пока нет',
    'orders.emptyDesc': 'Сделайте первый заказ из меню',
    'orders.status': 'Статус',
    'orders.date': 'Дата',
    'orders.items': 'товаров',

    // Order Status
    'orderStatus.pending': 'Ожидает',
    'orderStatus.confirmed': 'Подтверждён',
    'orderStatus.preparing': 'Готовится',
    'orderStatus.ready': 'Готов',
    'orderStatus.delivering': 'Доставляется',
    'orderStatus.delivered': 'Доставлен',
    'orderStatus.cancelled': 'Отменён',

    // Language selector
    'lang.en': 'EN',
    'lang.sr': 'SR',
    'lang.ru': 'RU',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Инициализация из localStorage
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      return (savedLanguage as Language) || 'ru'; // По умолчанию русский
    } catch (error) {
      console.error('Error loading language from localStorage:', error);
      return 'ru';
    }
  });

  // Сохранение в localStorage при изменении
  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      console.error('Error saving language to localStorage:', error);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

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
