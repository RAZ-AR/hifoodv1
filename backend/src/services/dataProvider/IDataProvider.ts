import {
  User,
  MenuItem,
  Order,
  AdBanner,
  BonusTransaction,
} from '../../types';

/**
 * АБСТРАКТНЫЙ ИНТЕРФЕЙС ДЛЯ РАБОТЫ С ДАННЫМИ
 *
 * Этот интерфейс позволяет легко переключаться между разными источниками данных:
 * - Google Sheets (для начала разработки)
 * - Supabase (для production)
 * - Mock данные (для тестирования)
 *
 * Просто меняете переменную окружения DATA_PROVIDER и всё работает!
 */
export interface IDataProvider {
  // ==========================================
  // ПОЛЬЗОВАТЕЛИ
  // ==========================================

  /**
   * Получить пользователя по Telegram ID
   */
  getUserByTelegramId(telegramId: number): Promise<User | null>;

  /**
   * Получить пользователя по номеру карты лояльности
   */
  getUserByLoyaltyCard(loyaltyCardNumber: string): Promise<User | null>;

  /**
   * Создать нового пользователя (loyalty_card_number, bonus_balance, etc. опциональны)
   */
  createUser(userData: Partial<User>): Promise<User>;

  /**
   * Обновить данные пользователя
   */
  updateUser(userId: string, data: Partial<User>): Promise<User>;

  /**
   * Удалить пользователя (опционально, для админки)
   */
  deleteUser(userId: string): Promise<boolean>;

  // ==========================================
  // МЕНЮ
  // ==========================================

  /**
   * Получить все блюда из меню
   */
  getMenu(): Promise<MenuItem[]>;

  /**
   * Получить блюдо по ID
   */
  getMenuItemById(id: string): Promise<MenuItem | null>;

  /**
   * Получить блюда по категории
   */
  getMenuByCategory(category: string): Promise<MenuItem[]>;

  /**
   * Обновить блюдо (для админки)
   */
  updateMenuItem(id: string, data: Partial<MenuItem>): Promise<MenuItem>;

  /**
   * Создать новое блюдо (для админки)
   */
  createMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem>;

  /**
   * Удалить блюдо (для админки)
   */
  deleteMenuItem(id: string): Promise<boolean>;

  // ==========================================
  // ЗАКАЗЫ
  // ==========================================

  /**
   * Создать новый заказ
   */
  createOrder(order: Omit<Order, 'order_id' | 'created_at' | 'updated_at'>): Promise<Order>;

  /**
   * Получить заказ по ID
   */
  getOrderById(orderId: string): Promise<Order | null>;

  /**
   * Получить все заказы пользователя
   */
  getUserOrders(userId: string): Promise<Order[]>;

  /**
   * Получить заказы пользователя по Telegram ID
   */
  getUserOrdersByTelegramId(telegramId: number): Promise<Order[]>;

  /**
   * Обновить статус заказа
   */
  updateOrderStatus(orderId: string, status: Order['status']): Promise<Order>;

  /**
   * Обновить данные заказа
   */
  updateOrder(orderId: string, data: Partial<Order>): Promise<Order>;

  /**
   * Получить все заказы (для админки)
   */
  getAllOrders(): Promise<Order[]>;

  // ==========================================
  // РЕКЛАМА / БАННЕРЫ
  // ==========================================

  /**
   * Получить активные рекламные баннеры
   */
  getActiveAds(): Promise<AdBanner[]>;

  /**
   * Получить все баннеры (для админки)
   */
  getAllAds(): Promise<AdBanner[]>;

  /**
   * Создать баннер (для админки)
   */
  createAd(ad: Omit<AdBanner, 'ad_id'>): Promise<AdBanner>;

  /**
   * Обновить баннер (для админки)
   */
  updateAd(adId: string, data: Partial<AdBanner>): Promise<AdBanner>;

  /**
   * Удалить баннер (для админки)
   */
  deleteAd(adId: string): Promise<boolean>;

  // ==========================================
  // БОНУСЫ И КАРТА ЛОЯЛЬНОСТИ
  // ==========================================

  /**
   * Начислить бонусы пользователю
   */
  addBonus(userId: string, amount: number, reason?: string, orderId?: string): Promise<BonusTransaction>;

  /**
   * Списать бонусы пользователя
   */
  spendBonus(userId: string, amount: number, orderId?: string): Promise<BonusTransaction>;

  /**
   * Получить историю бонусных операций пользователя
   */
  getBonusHistory(userId: string): Promise<BonusTransaction[]>;

  /**
   * Проверить уникальность номера карты лояльности
   */
  isLoyaltyCardUnique(cardNumber: string): Promise<boolean>;

  // ==========================================
  // ИЗБРАННОЕ
  // ==========================================

  /**
   * Добавить блюдо в избранное
   */
  addToFavorites(userId: string, dishId: string): Promise<void>;

  /**
   * Удалить блюдо из избранного
   */
  removeFromFavorites(userId: string, dishId: string): Promise<void>;

  /**
   * Получить избранные блюда пользователя
   */
  getFavorites(userId: string): Promise<MenuItem[]>;

  // ==========================================
  // АДРЕСА
  // ==========================================

  /**
   * Добавить адрес доставки
   */
  addAddress(userId: string, address: Omit<User['addresses'][0], 'id'>): Promise<User>;

  /**
   * Обновить адрес доставки
   */
  updateAddress(userId: string, addressId: string, data: Partial<User['addresses'][0]>): Promise<User>;

  /**
   * Удалить адрес доставки
   */
  deleteAddress(userId: string, addressId: string): Promise<User>;

  // ==========================================
  // СПОСОБЫ ОПЛАТЫ
  // ==========================================

  /**
   * Добавить способ оплаты
   */
  addPaymentMethod(userId: string, paymentMethod: Omit<User['payment_methods'][0], 'id'>): Promise<User>;

  /**
   * Удалить способ оплаты
   */
  deletePaymentMethod(userId: string, paymentMethodId: string): Promise<User>;

  // ==========================================
  // УТИЛИТЫ
  // ==========================================

  /**
   * Проверить подключение к источнику данных
   */
  healthCheck(): Promise<boolean>;

  /**
   * Получить статистику (для админки)
   */
  getStats(): Promise<{
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    activeUsers: number;
  }>;
}
