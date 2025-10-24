/**
 * Константы приложения
 */

// Валюта
export const CURRENCY = 'RSD';

// Время обновления заказа (мс)
export const ORDER_POLL_INTERVAL = 10000; // 10 секунд
export const ORDER_AUTO_CLEAR_DELAY = 30000; // 30 секунд после доставки

// LocalStorage ключи
export const STORAGE_KEYS = {
  ORDER_ID: 'currentOrderId',
  ORDER_STATUS: 'currentOrderStatus',
  CART: 'cart',
  FAVORITES: 'favorites',
} as const;

// Статусы заказа
export const ORDER_STATUSES = {
  ACCEPTED: 'accepted',
  PREPARING: 'preparing',
  DELIVERING: 'delivering',
  DELIVERED: 'delivered',
} as const;

// Конфигурация заказа
export const ORDER_CONFIG = {
  DEFAULT_CUTLERY_COUNT: 0,
  MIN_ORDER_AMOUNT: 0,
  DELIVERY_FEE: 0,
} as const;

// Способы связи
export const CONTACT_METHODS = {
  TELEGRAM: 'telegram',
  PHONE: 'phone',
} as const;

// Способы оплаты
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
} as const;

// Анимации
export const ANIMATION_DURATION = {
  BOUNCE: 600,
  FADE: 300,
  SLIDE: 400,
} as const;
