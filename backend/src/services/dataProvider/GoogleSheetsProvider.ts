import { google, sheets_v4 } from 'googleapis';
import { IDataProvider } from './IDataProvider';
import {
  User,
  MenuItem,
  Order,
  AdBanner,
  BonusTransaction,
  Address,
  PaymentMethod,
} from '../../types';
import { LoyaltyCardGenerator } from '../../utils/loyaltyCard';

/**
 * РЕАЛИЗАЦИЯ РАБОТЫ С GOOGLE SHEETS
 *
 * Подключается к вашей таблице и выполняет все операции с данными
 * https://docs.google.com/spreadsheets/d/18MgwzpNpnNt9H0LeIjxnXZYbEmkefrHLwHIHnMCgeho/edit
 */
export class GoogleSheetsProvider implements IDataProvider {
  private sheets: sheets_v4.Sheets;
  private spreadsheetId: string;
  private cardGenerator: LoyaltyCardGenerator;

  constructor(spreadsheetId: string, credentials?: any) {
    // Инициализация Google Sheets API
    const auth = credentials
      ? new google.auth.GoogleAuth({
          credentials,
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        })
      : new google.auth.GoogleAuth({
          keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

    this.sheets = google.sheets({ version: 'v4', auth });
    this.spreadsheetId = spreadsheetId;
    this.cardGenerator = new LoyaltyCardGenerator(this);
  }

  // ==========================================
  // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
  // ==========================================

  /**
   * Чтение данных из таблицы
   */
  private async readSheet(range: string): Promise<any[][]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range,
      });
      return response.data.values || [];
    } catch (error) {
      console.error(`Ошибка чтения таблицы ${range}:`, error);
      throw error;
    }
  }

  /**
   * Запись данных в таблицу
   */
  private async writeSheet(range: string, values: any[][]): Promise<void> {
    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values },
      });
    } catch (error) {
      console.error(`Ошибка записи в таблицу ${range}:`, error);
      throw error;
    }
  }

  /**
   * Обновление данных в таблице
   */
  private async updateSheet(range: string, values: any[][]): Promise<void> {
    try {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values },
      });
    } catch (error) {
      console.error(`Ошибка обновления таблицы ${range}:`, error);
      throw error;
    }
  }

  /**
   * Преобразование строки таблицы в объект User
   */
  private rowToUser(row: any[]): User {
    return {
      user_id: row[0] || '',
      telegram_id: parseInt(row[1] || '0'),
      telegram_username: row[2] || undefined,
      first_name: row[3] || '',
      last_name: row[4] || undefined,
      phone: row[5] || undefined,
      email: row[6] || undefined,
      loyalty_card_number: row[7] || '',
      loyalty_card_issued_date: row[8] || new Date().toISOString(),
      bonus_balance: parseFloat(row[9] || '0'),
      total_bonus_earned: parseFloat(row[10] || '0'),
      total_orders: parseInt(row[11] || '0'),
      total_spent: parseFloat(row[12] || '0'),
      addresses: JSON.parse(row[13] || '[]'),
      payment_methods: JSON.parse(row[14] || '[]'),
      preferred_language: (row[15] || 'en') as User['preferred_language'],
      favorite_dishes: JSON.parse(row[16] || '[]'),
      registered_at: row[17] || new Date().toISOString(),
      last_order_date: row[18] || undefined,
      notifications_enabled: row[19] === 'true' || row[19] === true,
    };
  }

  /**
   * Преобразование объекта User в строку таблицы
   */
  private userToRow(user: User): any[] {
    return [
      user.user_id,
      user.telegram_id,
      user.telegram_username || '',
      user.first_name,
      user.last_name || '',
      user.phone || '',
      user.email || '',
      user.loyalty_card_number,
      user.loyalty_card_issued_date,
      user.bonus_balance,
      user.total_bonus_earned,
      user.total_orders,
      user.total_spent,
      JSON.stringify(user.addresses),
      JSON.stringify(user.payment_methods),
      user.preferred_language,
      JSON.stringify(user.favorite_dishes),
      user.registered_at,
      user.last_order_date || '',
      user.notifications_enabled,
    ];
  }

  /**
   * Преобразование строки таблицы в объект MenuItem
   */
  private rowToMenuItem(row: any[]): MenuItem {
    return {
      id: row[0] || '',
      category: row[1] || '',
      name: row[2] || '',
      description: row[3] || '',
      price: parseFloat(row[4] || '0'),
      image_url: row[5] || '',
      ingredients: (row[6] || '').split(',').map((s: string) => s.trim()),
      rating: parseFloat(row[7] || '0'),
      available: row[8] === 'true' || row[8] === true,
      preparation_time: parseInt(row[9] || '0'),
      allergens: row[10] ? row[10].split(',').map((s: string) => s.trim()) : undefined,
    };
  }

  /**
   * Преобразование строки таблицы в объект Order
   */
  private rowToOrder(row: any[]): Order {
    return {
      order_id: row[0] || '',
      user_id: row[1] || '',
      user_name: row[2] || '',
      user_phone: row[3] || '',
      loyalty_card_number: row[4] || '',
      items: JSON.parse(row[5] || '[]'),
      total_amount: parseFloat(row[6] || '0'),
      subtotal: parseFloat(row[7] || '0'),
      delivery_fee: parseFloat(row[8] || '0'),
      delivery_address: JSON.parse(row[9] || '{}'),
      delivery_time: row[10] || 'now',
      payment_method: JSON.parse(row[11] || '{}'),
      bonus_applied: parseFloat(row[12] || '0'),
      status: (row[13] || 'pending') as Order['status'],
      created_at: row[14] || new Date().toISOString(),
      updated_at: row[15] || new Date().toISOString(),
      notes: row[16] || undefined,
    };
  }

  /**
   * Преобразование объекта Order в строку таблицы
   */
  private orderToRow(order: Order): any[] {
    return [
      order.order_id,
      order.user_id,
      order.user_name,
      order.user_phone,
      order.loyalty_card_number,
      JSON.stringify(order.items),
      order.total_amount,
      order.subtotal,
      order.delivery_fee,
      JSON.stringify(order.delivery_address),
      order.delivery_time,
      JSON.stringify(order.payment_method),
      order.bonus_applied,
      order.status,
      order.created_at,
      order.updated_at,
      order.notes || '',
    ];
  }

  /**
   * Преобразование строки таблицы в объект AdBanner
   */
  private rowToAdBanner(row: any[]): AdBanner {
    return {
      ad_id: row[0] || '',
      title: row[1] || '',
      description: row[2] || '',
      image_url: row[3] || '',
      link: row[4] || undefined,
      start_date: row[5] || new Date().toISOString(),
      end_date: row[6] || new Date().toISOString(),
      active: row[7] === 'true' || row[7] === true,
      order: parseInt(row[8] || '0'),
      discount_percent: row[9] ? parseFloat(row[9]) : undefined,
    };
  }

  // ==========================================
  // ПОЛЬЗОВАТЕЛИ
  // ==========================================

  async getUserByTelegramId(telegramId: number): Promise<User | null> {
    const rows = await this.readSheet('user!A2:T');
    const userRow = rows.find((row) => parseInt(row[1]) === telegramId);
    return userRow ? this.rowToUser(userRow) : null;
  }

  async getUserByLoyaltyCard(loyaltyCardNumber: string): Promise<User | null> {
    const rows = await this.readSheet('user!A2:T');
    const userRow = rows.find((row) => row[7] === loyaltyCardNumber);
    return userRow ? this.rowToUser(userRow) : null;
  }

  async createUser(
    userData: Omit<
      User,
      | 'user_id'
      | 'loyalty_card_number'
      | 'loyalty_card_issued_date'
      | 'bonus_balance'
      | 'total_bonus_earned'
      | 'total_orders'
      | 'total_spent'
      | 'registered_at'
    >
  ): Promise<User> {
    // Генерируем уникальный номер карты лояльности
    const loyaltyCardNumber = await this.cardGenerator.generateUniqueCard();

    const newUser: User = {
      user_id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      loyalty_card_number: loyaltyCardNumber,
      loyalty_card_issued_date: new Date().toISOString(),
      bonus_balance: 0,
      total_bonus_earned: 0,
      total_orders: 0,
      total_spent: 0,
      registered_at: new Date().toISOString(),
      ...userData,
    };

    await this.writeSheet('user!A:T', [this.userToRow(newUser)]);
    return newUser;
  }

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    const rows = await this.readSheet('user!A2:T');
    const rowIndex = rows.findIndex((row) => row[0] === userId);

    if (rowIndex === -1) {
      throw new Error(`Пользователь с ID ${userId} не найден`);
    }

    const row = rows[rowIndex];
    if (!row) {
      throw new Error(`Строка данных для пользователя ${userId} пуста`);
    }

    const user = this.rowToUser(row);
    const updatedUser = { ...user, ...data };

    await this.updateSheet(`user!A${rowIndex + 2}:T${rowIndex + 2}`, [
      this.userToRow(updatedUser),
    ]);

    return updatedUser;
  }

  async deleteUser(_userId: string): Promise<boolean> {
    // Для Google Sheets удаление - это сложная операция
    // Можно пометить пользователя как удаленного или использовать Sheets API для удаления строки
    console.warn('Удаление пользователей в Google Sheets не реализовано');
    return false;
  }

  // ==========================================
  // МЕНЮ
  // ==========================================

  async getMenu(): Promise<MenuItem[]> {
    const rows = await this.readSheet('menu!A2:K');
    return rows.map((row) => this.rowToMenuItem(row));
  }

  async getMenuItemById(id: string): Promise<MenuItem | null> {
    const rows = await this.readSheet('menu!A2:K');
    const itemRow = rows.find((row) => row[0] === id);
    return itemRow ? this.rowToMenuItem(itemRow) : null;
  }

  async getMenuByCategory(category: string): Promise<MenuItem[]> {
    const rows = await this.readSheet('menu!A2:K');
    return rows
      .filter((row) => row[1] === category)
      .map((row) => this.rowToMenuItem(row));
  }

  async updateMenuItem(_id: string, _data: Partial<MenuItem>): Promise<MenuItem> {
    throw new Error('Обновление блюд в Google Sheets требует реализации');
  }

  async createMenuItem(_item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    throw new Error('Создание блюд в Google Sheets требует реализации');
  }

  async deleteMenuItem(_id: string): Promise<boolean> {
    throw new Error('Удаление блюд в Google Sheets требует реализации');
  }

  // ==========================================
  // ЗАКАЗЫ
  // ==========================================

  async createOrder(
    order: Omit<Order, 'order_id' | 'created_at' | 'updated_at'>
  ): Promise<Order> {
    const newOrder: Order = {
      order_id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...order,
    };

    await this.writeSheet('order!A:Q', [this.orderToRow(newOrder)]);
    return newOrder;
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    const rows = await this.readSheet('order!A2:Q');
    const orderRow = rows.find((row) => row[0] === orderId);
    return orderRow ? this.rowToOrder(orderRow) : null;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    const rows = await this.readSheet('order!A2:Q');
    return rows
      .filter((row) => row[1] === userId)
      .map((row) => this.rowToOrder(row));
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    return this.updateOrder(orderId, { status, updated_at: new Date().toISOString() });
  }

  async updateOrder(orderId: string, data: Partial<Order>): Promise<Order> {
    const rows = await this.readSheet('order!A2:Q');
    const rowIndex = rows.findIndex((row) => row[0] === orderId);

    if (rowIndex === -1) {
      throw new Error(`Заказ с ID ${orderId} не найден`);
    }

    const row = rows[rowIndex];
    if (!row) {
      throw new Error(`Строка данных для заказа ${orderId} пуста`);
    }

    const order = this.rowToOrder(row);
    const updatedOrder = { ...order, ...data, updated_at: new Date().toISOString() };

    await this.updateSheet(`order!A${rowIndex + 2}:Q${rowIndex + 2}`, [
      this.orderToRow(updatedOrder),
    ]);

    return updatedOrder;
  }

  async getAllOrders(): Promise<Order[]> {
    const rows = await this.readSheet('order!A2:Q');
    return rows.map((row) => this.rowToOrder(row));
  }

  // ==========================================
  // РЕКЛАМА / БАННЕРЫ
  // ==========================================

  async getActiveAds(): Promise<AdBanner[]> {
    const rows = await this.readSheet('ADS!A2:J');
    const now = new Date();

    return rows
      .filter((row) => {
        const active = row[7] === 'true' || row[7] === true;
        const startDate = new Date(row[5]);
        const endDate = new Date(row[6]);
        return active && startDate <= now && endDate >= now;
      })
      .map((row) => this.rowToAdBanner(row))
      .sort((a, b) => a.order - b.order);
  }

  async getAllAds(): Promise<AdBanner[]> {
    const rows = await this.readSheet('ADS!A2:J');
    return rows.map((row) => this.rowToAdBanner(row));
  }

  async createAd(_ad: Omit<AdBanner, 'ad_id'>): Promise<AdBanner> {
    throw new Error('Создание рекламы в Google Sheets требует реализации');
  }

  async updateAd(_adId: string, _data: Partial<AdBanner>): Promise<AdBanner> {
    throw new Error('Обновление рекламы в Google Sheets требует реализации');
  }

  async deleteAd(_adId: string): Promise<boolean> {
    throw new Error('Удаление рекламы в Google Sheets требует реализации');
  }

  // ==========================================
  // БОНУСЫ И КАРТА ЛОЯЛЬНОСТИ
  // ==========================================

  async addBonus(
    userId: string,
    amount: number,
    reason?: string,
    orderId?: string
  ): Promise<BonusTransaction> {
    const user = await this.getUserByTelegramId(parseInt(userId));
    if (!user) throw new Error('Пользователь не найден');

    const transaction: BonusTransaction = {
      transaction_id: `bonus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      loyalty_card_number: user.loyalty_card_number,
      type: reason ? 'admin_add' : 'earned',
      amount,
      balance_before: user.bonus_balance,
      balance_after: user.bonus_balance + amount,
      order_id: orderId,
      reason,
      created_at: new Date().toISOString(),
    };

    await this.updateUser(user.user_id, {
      bonus_balance: transaction.balance_after,
      total_bonus_earned: user.total_bonus_earned + amount,
    });

    // Записываем транзакцию (если есть таблица bonus_transactions)
    // await this.writeSheet('bonus_transactions!A:J', [transactionToRow(transaction)]);

    return transaction;
  }

  async spendBonus(userId: string, amount: number, orderId?: string): Promise<BonusTransaction> {
    const user = await this.getUserByTelegramId(parseInt(userId));
    if (!user) throw new Error('Пользователь не найден');
    if (user.bonus_balance < amount) throw new Error('Недостаточно бонусов');

    const transaction: BonusTransaction = {
      transaction_id: `bonus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      loyalty_card_number: user.loyalty_card_number,
      type: 'spent',
      amount: -amount,
      balance_before: user.bonus_balance,
      balance_after: user.bonus_balance - amount,
      order_id: orderId,
      created_at: new Date().toISOString(),
    };

    await this.updateUser(user.user_id, {
      bonus_balance: transaction.balance_after,
    });

    return transaction;
  }

  async getBonusHistory(_userId: string): Promise<BonusTransaction[]> {
    // Требует отдельной таблицы bonus_transactions
    throw new Error('История бонусов требует реализации таблицы bonus_transactions');
  }

  async isLoyaltyCardUnique(cardNumber: string): Promise<boolean> {
    const user = await this.getUserByLoyaltyCard(cardNumber);
    return user === null;
  }

  // ==========================================
  // ИЗБРАННОЕ
  // ==========================================

  async addToFavorites(userId: string, dishId: string): Promise<void> {
    const rows = await this.readSheet('user!A2:T');
    const rowIndex = rows.findIndex((row) => row[0] === userId);

    if (rowIndex === -1) throw new Error('Пользователь не найден');

    const row = rows[rowIndex];
    if (!row) throw new Error('Строка данных пользователя пуста');

    const user = this.rowToUser(row);
    if (!user.favorite_dishes.includes(dishId)) {
      user.favorite_dishes.push(dishId);
      await this.updateUser(userId, { favorite_dishes: user.favorite_dishes });
    }
  }

  async removeFromFavorites(userId: string, dishId: string): Promise<void> {
    const rows = await this.readSheet('user!A2:T');
    const rowIndex = rows.findIndex((row) => row[0] === userId);

    if (rowIndex === -1) throw new Error('Пользователь не найден');

    const row = rows[rowIndex];
    if (!row) throw new Error('Строка данных пользователя пуста');

    const user = this.rowToUser(row);
    user.favorite_dishes = user.favorite_dishes.filter((id) => id !== dishId);
    await this.updateUser(userId, { favorite_dishes: user.favorite_dishes });
  }

  async getFavorites(userId: string): Promise<MenuItem[]> {
    const rows = await this.readSheet('user!A2:T');
    const userRow = rows.find((row) => row[0] === userId);

    if (!userRow) throw new Error('Пользователь не найден');

    const user = this.rowToUser(userRow);
    const menu = await this.getMenu();

    return menu.filter((item) => user.favorite_dishes.includes(item.id));
  }

  // ==========================================
  // АДРЕСА
  // ==========================================

  async addAddress(
    userId: string,
    address: Omit<Address, 'id'>
  ): Promise<User> {
    const rows = await this.readSheet('user!A2:T');
    const userRow = rows.find((row) => row[0] === userId);

    if (!userRow) throw new Error('Пользователь не найден');

    const user = this.rowToUser(userRow);
    const newAddress: Address = {
      id: `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...address,
    };

    user.addresses.push(newAddress);
    return this.updateUser(userId, { addresses: user.addresses });
  }

  async updateAddress(
    userId: string,
    addressId: string,
    data: Partial<Address>
  ): Promise<User> {
    const rows = await this.readSheet('user!A2:T');
    const userRow = rows.find((row) => row[0] === userId);

    if (!userRow) throw new Error('Пользователь не найден');

    const user = this.rowToUser(userRow);
    const addressIndex = user.addresses.findIndex((addr) => addr.id === addressId);

    if (addressIndex === -1) throw new Error('Адрес не найден');

    user.addresses[addressIndex] = { ...user.addresses[addressIndex], ...data } as Address;
    return this.updateUser(userId, { addresses: user.addresses });
  }

  async deleteAddress(userId: string, addressId: string): Promise<User> {
    const rows = await this.readSheet('user!A2:T');
    const userRow = rows.find((row) => row[0] === userId);

    if (!userRow) throw new Error('Пользователь не найден');

    const user = this.rowToUser(userRow);
    user.addresses = user.addresses.filter((addr) => addr.id !== addressId);
    return this.updateUser(userId, { addresses: user.addresses });
  }

  // ==========================================
  // СПОСОБЫ ОПЛАТЫ
  // ==========================================

  async addPaymentMethod(
    userId: string,
    paymentMethod: Omit<PaymentMethod, 'id'>
  ): Promise<User> {
    const rows = await this.readSheet('user!A2:T');
    const userRow = rows.find((row) => row[0] === userId);

    if (!userRow) throw new Error('Пользователь не найден');

    const user = this.rowToUser(userRow);
    const newPaymentMethod: PaymentMethod = {
      id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...paymentMethod,
    };

    user.payment_methods.push(newPaymentMethod);
    return this.updateUser(userId, { payment_methods: user.payment_methods });
  }

  async deletePaymentMethod(userId: string, paymentMethodId: string): Promise<User> {
    const rows = await this.readSheet('user!A2:T');
    const userRow = rows.find((row) => row[0] === userId);

    if (!userRow) throw new Error('Пользователь не найден');

    const user = this.rowToUser(userRow);
    user.payment_methods = user.payment_methods.filter((pm) => pm.id !== paymentMethodId);
    return this.updateUser(userId, { payment_methods: user.payment_methods });
  }

  // ==========================================
  // УТИЛИТЫ
  // ==========================================

  async healthCheck(): Promise<boolean> {
    try {
      await this.readSheet('user!A1:A1');
      return true;
    } catch {
      return false;
    }
  }

  async getStats(): Promise<{
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    activeUsers: number;
  }> {
    const users = await this.readSheet('user!A2:T');
    const orders = await this.readSheet('order!A2:Q');

    const totalRevenue = orders.reduce((sum, row) => {
      return sum + parseFloat(row[6] || '0');
    }, 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeUsers = users.filter((row) => {
      const lastOrderDate = row[18];
      return lastOrderDate && new Date(lastOrderDate) >= thirtyDaysAgo;
    }).length;

    return {
      totalUsers: users.length,
      totalOrders: orders.length,
      totalRevenue,
      activeUsers,
    };
  }
}
