import { createClient, SupabaseClient } from '@supabase/supabase-js';
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
 * РЕАЛИЗАЦИЯ РАБОТЫ С SUPABASE
 *
 * Production-ready решение с PostgreSQL базой данных
 * Быстрее и надежнее чем Google Sheets
 */
export class SupabaseProvider implements IDataProvider {
  private supabase: SupabaseClient;
  private cardGenerator: LoyaltyCardGenerator;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.cardGenerator = new LoyaltyCardGenerator(this);
  }

  // ==========================================
  // ПОЛЬЗОВАТЕЛИ
  // ==========================================

  async getUserByTelegramId(telegramId: number): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramId)
      .single();

    if (error) {
      console.error('Ошибка получения пользователя:', error);
      return null;
    }

    return data as User;
  }

  async getUserByLoyaltyCard(loyaltyCardNumber: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('loyalty_card_number', loyaltyCardNumber)
      .single();

    if (error) {
      return null;
    }

    return data as User;
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

    const newUser: Omit<User, 'user_id'> = {
      loyalty_card_number: loyaltyCardNumber,
      loyalty_card_issued_date: new Date().toISOString(),
      bonus_balance: 0,
      total_bonus_earned: 0,
      total_orders: 0,
      total_spent: 0,
      registered_at: new Date().toISOString(),
      ...userData,
    };

    const { data, error } = await this.supabase
      .from('users')
      .insert([newUser])
      .select()
      .single();

    if (error) {
      throw new Error(`Ошибка создания пользователя: ${error.message}`);
    }

    return data as User;
  }

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    const { data: updatedData, error } = await this.supabase
      .from('users')
      .update(data)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Ошибка обновления пользователя: ${error.message}`);
    }

    return updatedData as User;
  }

  async deleteUser(userId: string): Promise<boolean> {
    const { error } = await this.supabase.from('users').delete().eq('user_id', userId);

    if (error) {
      console.error('Ошибка удаления пользователя:', error);
      return false;
    }

    return true;
  }

  // ==========================================
  // МЕНЮ
  // ==========================================

  async getMenu(): Promise<MenuItem[]> {
    const { data, error } = await this.supabase
      .from('menu')
      .select('*')
      .eq('available', true);

    if (error) {
      throw new Error(`Ошибка получения меню: ${error.message}`);
    }

    return data as MenuItem[];
  }

  async getMenuItemById(id: string): Promise<MenuItem | null> {
    const { data, error } = await this.supabase
      .from('menu')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return null;
    }

    return data as MenuItem;
  }

  async getMenuByCategory(category: string): Promise<MenuItem[]> {
    const { data, error } = await this.supabase
      .from('menu')
      .select('*')
      .eq('category', category)
      .eq('available', true);

    if (error) {
      throw new Error(`Ошибка получения категории: ${error.message}`);
    }

    return data as MenuItem[];
  }

  async updateMenuItem(id: string, data: Partial<MenuItem>): Promise<MenuItem> {
    const { data: updatedData, error } = await this.supabase
      .from('menu')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Ошибка обновления блюда: ${error.message}`);
    }

    return updatedData as MenuItem;
  }

  async createMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    const { data, error } = await this.supabase
      .from('menu')
      .insert([item])
      .select()
      .single();

    if (error) {
      throw new Error(`Ошибка создания блюда: ${error.message}`);
    }

    return data as MenuItem;
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    const { error } = await this.supabase.from('menu').delete().eq('id', id);

    if (error) {
      console.error('Ошибка удаления блюда:', error);
      return false;
    }

    return true;
  }

  // ==========================================
  // ЗАКАЗЫ
  // ==========================================

  async createOrder(
    order: Omit<Order, 'order_id' | 'created_at' | 'updated_at'>
  ): Promise<Order> {
    const newOrder = {
      ...order,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await this.supabase
      .from('orders')
      .insert([newOrder])
      .select()
      .single();

    if (error) {
      throw new Error(`Ошибка создания заказа: ${error.message}`);
    }

    return data as Order;
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error) {
      return null;
    }

    return data as Order;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Ошибка получения заказов: ${error.message}`);
    }

    return data as Order[];
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    return this.updateOrder(orderId, {
      status,
      updated_at: new Date().toISOString(),
    });
  }

  async updateOrder(orderId: string, data: Partial<Order>): Promise<Order> {
    const updateData = {
      ...data,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedData, error } = await this.supabase
      .from('orders')
      .update(updateData)
      .eq('order_id', orderId)
      .select()
      .single();

    if (error) {
      throw new Error(`Ошибка обновления заказа: ${error.message}`);
    }

    return updatedData as Order;
  }

  async getAllOrders(): Promise<Order[]> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Ошибка получения всех заказов: ${error.message}`);
    }

    return data as Order[];
  }

  // ==========================================
  // РЕКЛАМА / БАННЕРЫ
  // ==========================================

  async getActiveAds(): Promise<AdBanner[]> {
    const now = new Date().toISOString();

    const { data, error } = await this.supabase
      .from('ads')
      .select('*')
      .eq('active', true)
      .lte('start_date', now)
      .gte('end_date', now)
      .order('order', { ascending: true });

    if (error) {
      throw new Error(`Ошибка получения рекламы: ${error.message}`);
    }

    return data as AdBanner[];
  }

  async getAllAds(): Promise<AdBanner[]> {
    const { data, error } = await this.supabase
      .from('ads')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      throw new Error(`Ошибка получения всех баннеров: ${error.message}`);
    }

    return data as AdBanner[];
  }

  async createAd(ad: Omit<AdBanner, 'ad_id'>): Promise<AdBanner> {
    const { data, error } = await this.supabase
      .from('ads')
      .insert([ad])
      .select()
      .single();

    if (error) {
      throw new Error(`Ошибка создания рекламы: ${error.message}`);
    }

    return data as AdBanner;
  }

  async updateAd(adId: string, data: Partial<AdBanner>): Promise<AdBanner> {
    const { data: updatedData, error } = await this.supabase
      .from('ads')
      .update(data)
      .eq('ad_id', adId)
      .select()
      .single();

    if (error) {
      throw new Error(`Ошибка обновления рекламы: ${error.message}`);
    }

    return updatedData as AdBanner;
  }

  async deleteAd(adId: string): Promise<boolean> {
    const { error } = await this.supabase.from('ads').delete().eq('ad_id', adId);

    if (error) {
      console.error('Ошибка удаления рекламы:', error);
      return false;
    }

    return true;
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
    // Получаем текущего пользователя
    const { data: user, error: userError } = await this.supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (userError || !user) {
      throw new Error('Пользователь не найден');
    }

    const transaction: Omit<BonusTransaction, 'transaction_id'> = {
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

    // Создаем транзакцию
    const { data: newTransaction, error: transactionError } = await this.supabase
      .from('bonus_transactions')
      .insert([transaction])
      .select()
      .single();

    if (transactionError) {
      throw new Error(`Ошибка создания транзакции: ${transactionError.message}`);
    }

    // Обновляем баланс пользователя
    await this.updateUser(userId, {
      bonus_balance: transaction.balance_after,
      total_bonus_earned: user.total_bonus_earned + amount,
    });

    return newTransaction as BonusTransaction;
  }

  async spendBonus(
    userId: string,
    amount: number,
    orderId?: string
  ): Promise<BonusTransaction> {
    // Получаем текущего пользователя
    const { data: user, error: userError } = await this.supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (userError || !user) {
      throw new Error('Пользователь не найден');
    }

    if (user.bonus_balance < amount) {
      throw new Error('Недостаточно бонусов');
    }

    const transaction: Omit<BonusTransaction, 'transaction_id'> = {
      user_id: userId,
      loyalty_card_number: user.loyalty_card_number,
      type: 'spent',
      amount: -amount,
      balance_before: user.bonus_balance,
      balance_after: user.bonus_balance - amount,
      order_id: orderId,
      created_at: new Date().toISOString(),
    };

    // Создаем транзакцию
    const { data: newTransaction, error: transactionError } = await this.supabase
      .from('bonus_transactions')
      .insert([transaction])
      .select()
      .single();

    if (transactionError) {
      throw new Error(`Ошибка создания транзакции: ${transactionError.message}`);
    }

    // Обновляем баланс пользователя
    await this.updateUser(userId, {
      bonus_balance: transaction.balance_after,
    });

    return newTransaction as BonusTransaction;
  }

  async getBonusHistory(userId: string): Promise<BonusTransaction[]> {
    const { data, error } = await this.supabase
      .from('bonus_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Ошибка получения истории бонусов: ${error.message}`);
    }

    return data as BonusTransaction[];
  }

  async isLoyaltyCardUnique(cardNumber: string): Promise<boolean> {
    const { data } = await this.supabase
      .from('users')
      .select('loyalty_card_number')
      .eq('loyalty_card_number', cardNumber)
      .single();

    return data === null;
  }

  // ==========================================
  // ИЗБРАННОЕ
  // ==========================================

  async addToFavorites(userId: string, dishId: string): Promise<void> {
    const { data: user } = await this.supabase
      .from('users')
      .select('favorite_dishes')
      .eq('user_id', userId)
      .single();

    if (!user) throw new Error('Пользователь не найден');

    const favoriteDishes = user.favorite_dishes || [];
    if (!favoriteDishes.includes(dishId)) {
      favoriteDishes.push(dishId);
      await this.updateUser(userId, { favorite_dishes: favoriteDishes });
    }
  }

  async removeFromFavorites(userId: string, dishId: string): Promise<void> {
    const { data: user } = await this.supabase
      .from('users')
      .select('favorite_dishes')
      .eq('user_id', userId)
      .single();

    if (!user) throw new Error('Пользователь не найден');

    const favoriteDishes = (user.favorite_dishes || []).filter((id: string) => id !== dishId);
    await this.updateUser(userId, { favorite_dishes: favoriteDishes });
  }

  async getFavorites(userId: string): Promise<MenuItem[]> {
    const { data: user } = await this.supabase
      .from('users')
      .select('favorite_dishes')
      .eq('user_id', userId)
      .single();

    if (!user) throw new Error('Пользователь не найден');

    const favoriteDishes = user.favorite_dishes || [];

    if (favoriteDishes.length === 0) return [];

    const { data: menu, error } = await this.supabase
      .from('menu')
      .select('*')
      .in('id', favoriteDishes);

    if (error) {
      throw new Error(`Ошибка получения избранного: ${error.message}`);
    }

    return menu as MenuItem[];
  }

  // ==========================================
  // АДРЕСА
  // ==========================================

  async addAddress(userId: string, address: Omit<Address, 'id'>): Promise<User> {
    const { data: user } = await this.supabase
      .from('users')
      .select('addresses')
      .eq('user_id', userId)
      .single();

    if (!user) throw new Error('Пользователь не найден');

    const addresses = user.addresses || [];
    const newAddress: Address = {
      id: `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...address,
    };

    addresses.push(newAddress);
    return this.updateUser(userId, { addresses });
  }

  async updateAddress(
    userId: string,
    addressId: string,
    data: Partial<Address>
  ): Promise<User> {
    const { data: user } = await this.supabase
      .from('users')
      .select('addresses')
      .eq('user_id', userId)
      .single();

    if (!user) throw new Error('Пользователь не найден');

    const addresses = user.addresses || [];
    const addressIndex = addresses.findIndex((addr: Address) => addr.id === addressId);

    if (addressIndex === -1) throw new Error('Адрес не найден');

    addresses[addressIndex] = { ...addresses[addressIndex], ...data };
    return this.updateUser(userId, { addresses });
  }

  async deleteAddress(userId: string, addressId: string): Promise<User> {
    const { data: user } = await this.supabase
      .from('users')
      .select('addresses')
      .eq('user_id', userId)
      .single();

    if (!user) throw new Error('Пользователь не найден');

    const addresses = (user.addresses || []).filter((addr: Address) => addr.id !== addressId);
    return this.updateUser(userId, { addresses });
  }

  // ==========================================
  // СПОСОБЫ ОПЛАТЫ
  // ==========================================

  async addPaymentMethod(
    userId: string,
    paymentMethod: Omit<PaymentMethod, 'id'>
  ): Promise<User> {
    const { data: user } = await this.supabase
      .from('users')
      .select('payment_methods')
      .eq('user_id', userId)
      .single();

    if (!user) throw new Error('Пользователь не найден');

    const paymentMethods = user.payment_methods || [];
    const newPaymentMethod: PaymentMethod = {
      id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...paymentMethod,
    };

    paymentMethods.push(newPaymentMethod);
    return this.updateUser(userId, { payment_methods: paymentMethods });
  }

  async deletePaymentMethod(userId: string, paymentMethodId: string): Promise<User> {
    const { data: user } = await this.supabase
      .from('users')
      .select('payment_methods')
      .eq('user_id', userId)
      .single();

    if (!user) throw new Error('Пользователь не найден');

    const paymentMethods = (user.payment_methods || []).filter(
      (pm: PaymentMethod) => pm.id !== paymentMethodId
    );
    return this.updateUser(userId, { payment_methods: paymentMethods });
  }

  // ==========================================
  // УТИЛИТЫ
  // ==========================================

  async healthCheck(): Promise<boolean> {
    try {
      // Просто проверяем доступность таблицы menu (которая точно есть)
      const { error } = await this.supabase.from('menu').select('*', { count: 'exact', head: true });
      if (error) {
        console.error('Supabase healthCheck error:', error);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Supabase healthCheck exception:', e);
      return false;
    }
  }

  async getStats(): Promise<{
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    activeUsers: number;
  }> {
    // Общее количество пользователей
    const { count: totalUsers } = await this.supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Общее количество заказов
    const { count: totalOrders } = await this.supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    // Общая выручка
    const { data: orders } = await this.supabase.from('orders').select('total');

    const totalRevenue = (orders || []).reduce(
      (sum: number, order: any) => sum + (parseFloat(order.total) || 0),
      0
    );

    // Активные пользователи (за последние 30 дней)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: activeUsers } = await this.supabase
      .from('orders')
      .select('telegram_id', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString());

    return {
      totalUsers: totalUsers || 0,
      totalOrders: totalOrders || 0,
      totalRevenue,
      activeUsers: activeUsers || 0,
    };
  }
}
