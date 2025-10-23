/**
 * ТИПЫ ДЛЯ FRONTEND
 * Синхронизированы с backend типами
 */

export type Language = 'en' | 'sr-lat' | 'ru';

export interface User {
  user_id: string;
  telegram_id: number;
  telegram_username?: string;
  first_name: string;
  last_name?: string;
  phone?: string;
  email?: string;

  // КАРТА ЛОЯЛЬНОСТИ
  loyalty_card_number: string;  // 4-значный номер
  loyalty_card_issued_date: string;

  // БОНУСЫ
  bonus_balance: number;
  total_bonus_earned: number;
  total_orders: number;
  total_spent: number;

  // ДАННЫЕ
  addresses: Address[];
  payment_methods: PaymentMethod[];
  favorite_dishes: string[];

  // НАСТРОЙКИ
  preferred_language: Language;
  notifications_enabled: boolean;

  // МЕТАДАННЫЕ
  registered_at: string;
  last_order_date?: string;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  building: string;
  apartment?: string;
  entrance?: string;
  floor?: string;
  comment?: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'cash' | 'card';
  last4?: string;
  brand?: string;
  is_default: boolean;
}

export interface MenuItem {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  ingredients: string[];
  rating: number;
  available: boolean;
  preparation_time: number;
  allergens?: string[];
}

export interface OrderItem {
  dish_id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'on_way'
  | 'delivered'
  | 'cancelled';

export interface Order {
  order_id: string;
  user_id: string;
  user_name: string;
  user_phone: string;

  // КАРТА ЛОЯЛЬНОСТИ
  loyalty_card_number: string;

  // СОСТАВ
  items: OrderItem[];

  // СУММЫ
  total_amount: number;
  subtotal: number;
  delivery_fee: number;
  bonus_applied: number;

  // ДОСТАВКА
  delivery_address: Address;
  delivery_time: 'now' | string;

  // ОПЛАТА
  payment_method: PaymentMethod;

  // СТАТУС
  status: OrderStatus;

  // МЕТАДАННЫЕ
  created_at: string;
  updated_at: string;
  notes?: string;
}

export interface AdBanner {
  ad_id: string;
  title: string;
  description: string;
  image_url: string;
  link?: string;
  start_date: string;
  end_date: string;
  active: boolean;
  order: number;
  discount_percent?: number;
}

export interface CartItem {
  dish: MenuItem;
  quantity: number;
}

// Telegram Web App types
export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      photo_url?: string;
    };
    auth_date: number;
    hash: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color: string;
    text_color: string;
    hint_color: string;
    link_color: string;
    button_color: string;
    button_text_color: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText(text: string): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
    show(): void;
    hide(): void;
    enable(): void;
    disable(): void;
    showProgress(leaveActive: boolean): void;
    hideProgress(): void;
    setParams(params: {
      text?: string;
      color?: string;
      text_color?: string;
      is_active?: boolean;
      is_visible?: boolean;
    }): void;
  };
  BackButton: {
    isVisible: boolean;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
    show(): void;
    hide(): void;
  };
  HapticFeedback: {
    impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
    notificationOccurred(type: 'error' | 'success' | 'warning'): void;
    selectionChanged(): void;
  };
  ready(): void;
  expand(): void;
  close(): void;
  sendData(data: string): void;
  showAlert(message: string): void;
  showConfirm(message: string): Promise<boolean>;
  showPopup(params: { title?: string; message: string; buttons?: Array<{ id?: string; type?: string; text: string }> }): Promise<string>;
  openLink(url: string): void;
  openTelegramLink(url: string): void;
}

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }
}
