// ============================================
// ТИПЫ ДЛЯ ВСЕХ СУЩНОСТЕЙ СИСТЕМЫ
// ============================================

/**
 * Пользователь системы
 */
export interface User {
  user_id: string;                    // Уникальный ID в системе
  telegram_id: number;                // Telegram ID
  telegram_username?: string;         // @username
  first_name: string;                 // Имя
  last_name?: string;                 // Фамилия
  phone?: string;                     // Номер телефона
  email?: string;                     // Email (опционально)

  // КАРТА ЛОЯЛЬНОСТИ (4-значный номер)
  loyalty_card_number: string;        // Например: "1234"
  loyalty_card_issued_date: string;   // Дата выдачи (ISO string)

  // БОНУСНАЯ СИСТЕМА
  bonus_balance: number;              // Текущий баланс бонусов
  total_bonus_earned: number;         // Всего заработано бонусов
  total_orders: number;               // Количество заказов
  total_spent: number;                // Общая сумма потрачена

  // СОХРАНЕННЫЕ ДАННЫЕ
  addresses: Address[];               // Сохраненные адреса
  payment_methods: PaymentMethod[];   // Сохраненные способы оплаты
  favorite_dishes: string[];          // ID избранных блюд

  // НАСТРОЙКИ
  preferred_language: Language;       // Предпочитаемый язык
  notifications_enabled: boolean;     // Уведомления включены

  // МЕТАДАННЫЕ
  registered_at: string;              // Дата регистрации (ISO string)
  last_order_date?: string;           // Дата последнего заказа (ISO string)
}

/**
 * Адрес доставки
 */
export interface Address {
  id: string;                         // Уникальный ID адреса
  label: string;                      // Название (Дом, Работа, etc.)
  street: string;                     // Улица
  building: string;                   // Дом
  apartment?: string;                 // Квартира/офис
  entrance?: string;                  // Подъезд
  floor?: string;                     // Этаж
  comment?: string;                   // Комментарий для курьера
  latitude?: number;                  // Широта (для геолокации)
  longitude?: number;                 // Долгота (для геолокации)
  is_default: boolean;                // Адрес по умолчанию
}

/**
 * Способ оплаты
 */
export interface PaymentMethod {
  id: string;                         // Уникальный ID
  type: 'cash' | 'card';              // Тип оплаты
  last4?: string;                     // Последние 4 цифры карты
  brand?: string;                     // Visa, Mastercard, Dina Card
  is_default: boolean;                // По умолчанию
}

/**
 * Блюдо из меню
 */
export interface MenuItem {
  id: string;                         // Уникальный ID блюда
  category: string;                   // Категория
  name: string;                       // Название
  description: string;                // Описание
  price: number;                      // Цена в динарах
  image_url: string;                  // URL изображения
  ingredients: string[];              // Ингредиенты
  rating: number;                     // Рейтинг (1-5)
  available: boolean;                 // Доступность
  preparation_time: number;           // Время приготовления (минуты)
  allergens?: string[];               // Аллергены
}

/**
 * Заказ
 */
export interface Order {
  order_id: string;                   // Уникальный ID заказа
  user_id: string;                    // ID пользователя
  user_name: string;                  // Имя пользователя
  user_phone: string;                 // Номер телефона

  // КАРТА ЛОЯЛЬНОСТИ (автоматически из профиля)
  loyalty_card_number: string;        // Номер карты лояльности

  // СОСТАВ ЗАКАЗА
  items: OrderItem[];                 // Список товаров

  // СУММЫ
  total_amount: number;               // Итоговая сумма
  subtotal: number;                   // Сумма товаров без доставки
  delivery_fee: number;               // Стоимость доставки
  bonus_applied: number;              // Примененные бонусы

  // ДОСТАВКА
  delivery_address: Address;          // Адрес доставки
  delivery_time: 'now' | string;      // Время доставки (ISO string или "now")

  // ОПЛАТА
  payment_method: PaymentMethod;      // Способ оплаты

  // СТАТУС
  status: OrderStatus;                // Статус заказа

  // МЕТАДАННЫЕ
  created_at: string;                 // Дата создания (ISO string)
  updated_at: string;                 // Дата обновления (ISO string)
  notes?: string;                     // Примечания
}

/**
 * Элемент заказа
 */
export interface OrderItem {
  dish_id: string;                    // ID блюда
  name: string;                       // Название
  price: number;                      // Цена за единицу
  quantity: number;                   // Количество
  subtotal: number;                   // Подитог (price × quantity)
}

/**
 * Статус заказа
 */
export type OrderStatus =
  | 'pending'       // Ожидает подтверждения
  | 'confirmed'     // Подтвержден
  | 'preparing'     // Готовится
  | 'on_way'        // В пути
  | 'delivered'     // Доставлен
  | 'cancelled';    // Отменен

/**
 * Рекламный баннер
 */
export interface AdBanner {
  ad_id: string;                      // Уникальный ID рекламы
  title: string;                      // Название акции
  description: string;                // Описание
  image_url: string;                  // URL изображения
  link?: string;                      // Ссылка (категория, блюдо)
  start_date: string;                 // Начало показа (ISO string)
  end_date: string;                   // Конец показа (ISO string)
  active: boolean;                    // Активна ли реклама
  order: number;                      // Порядок показа в карусели
  discount_percent?: number;          // Процент скидки
}

/**
 * Поддерживаемые языки
 */
export type Language = 'en' | 'sr-lat' | 'ru';

/**
 * История операций с бонусами
 */
export interface BonusTransaction {
  transaction_id: string;             // Уникальный ID транзакции
  user_id: string;                    // ID пользователя
  loyalty_card_number: string;        // Номер карты лояльности
  type: 'earned' | 'spent' | 'admin_add' | 'admin_remove';
  amount: number;                     // Сумма (положительная или отрицательная)
  balance_before: number;             // Баланс до операции
  balance_after: number;              // Баланс после операции
  order_id?: string;                  // ID заказа (если связано с заказом)
  reason?: string;                    // Причина (для админ-операций)
  created_at: string;                 // Дата операции (ISO string)
  created_by?: string;                // Кто создал (для админ-операций)
}

/**
 * Конфигурация доставки
 */
export interface DeliveryConfig {
  free_delivery_threshold: number;    // Порог бесплатной доставки (DIN)
  delivery_fee: number;               // Стоимость доставки (DIN)
}

// Экспорт констант
export const DELIVERY_CONFIG: DeliveryConfig = {
  free_delivery_threshold: 2000,      // 2000 DIN
  delivery_fee: 300,                  // 300 DIN
};
