/**
 * MOCK DATA PROVIDER
 *
 * Используется для тестирования без настройки базы данных
 */

import { IDataProvider } from './IDataProvider';
import type {
  User,
  MenuItem,
  Order,
  AdBanner,
  BonusTransaction,
  Stats,
} from '../../types';

export class MockProvider implements IDataProvider {
  private mockMenu: MenuItem[] = [
    {
      id: '1',
      category: 'Пицца',
      name: 'Маргарита',
      description: 'Классическая пицца с томатами, моцареллой и базиликом',
      price: 850,
      image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
      ingredients: ['Томатный соус', 'Моцарелла', 'Базилик', 'Оливковое масло'],
      rating: 4.8,
      available: true,
      preparation_time: 20,
      allergens: ['Глютен', 'Молочные продукты'],
      discount: 0,
    },
    {
      id: '2',
      category: 'Пицца',
      name: 'Пепперони',
      description: 'Острая пицца с пепперони и сыром',
      price: 950,
      image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
      ingredients: ['Томатный соус', 'Моцарелла', 'Пепперони'],
      rating: 4.9,
      available: true,
      preparation_time: 20,
      allergens: ['Глютен', 'Молочные продукты'],
      discount: 10,
    },
    {
      id: '3',
      category: 'Бургеры',
      name: 'Чизбургер',
      description: 'Сочный бургер с говяжьей котлетой и сыром',
      price: 650,
      image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      ingredients: ['Булочка', 'Говяжья котлета', 'Чеддер', 'Салат', 'Томат'],
      rating: 4.7,
      available: true,
      preparation_time: 15,
      allergens: ['Глютен', 'Молочные продукты'],
      discount: 0,
    },
    {
      id: '4',
      category: 'Напитки',
      name: 'Coca-Cola 0.5л',
      description: 'Классическая кола',
      price: 150,
      image_url: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
      ingredients: ['Вода', 'Сахар', 'Диоксид углерода'],
      rating: 4.5,
      available: true,
      preparation_time: 1,
      allergens: [],
      discount: 0,
    },
    {
      id: '5',
      category: 'Салаты',
      name: 'Цезарь',
      description: 'Классический салат Цезарь с курицей',
      price: 550,
      image_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
      ingredients: ['Салат Романо', 'Курица', 'Пармезан', 'Соус Цезарь', 'Гренки'],
      rating: 4.6,
      available: true,
      preparation_time: 10,
      allergens: ['Глютен', 'Молочные продукты', 'Яйца'],
      discount: 0,
    },
  ];

  private mockAds: AdBanner[] = [
    {
      ad_id: '1',
      title: 'Скидка 20%',
      description: 'На все пиццы по средам!',
      image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
      link: '',
      start_date: new Date(Date.now() - 86400000).toISOString(),
      end_date: new Date(Date.now() + 604800000).toISOString(),
      active: true,
      order: 1,
      discount_percent: 20,
    },
    {
      ad_id: '2',
      title: 'Новинка!',
      description: 'Попробуйте наш новый бургер',
      image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800',
      link: '',
      start_date: new Date(Date.now() - 86400000).toISOString(),
      end_date: new Date(Date.now() + 604800000).toISOString(),
      active: true,
      order: 2,
      discount_percent: 0,
    },
  ];

  async healthCheck(): Promise<boolean> {
    console.log('✅ Mock Provider: Health check OK');
    return true;
  }

  async getMenu(): Promise<MenuItem[]> {
    console.log('✅ Mock Provider: Returning mock menu');
    return this.mockMenu;
  }

  async getMenuItemById(itemId: string): Promise<MenuItem | null> {
    return this.mockMenu.find(item => item.id === itemId) || null;
  }

  async getMenuByCategory(category: string): Promise<MenuItem[]> {
    return this.mockMenu.filter(item => item.category === category);
  }

  async getUserByTelegramId(telegramId: number): Promise<User | null> {
    return null;
  }

  async getUserByLoyaltyCard(cardNumber: string): Promise<User | null> {
    return null;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const user: User = {
      user_id: Date.now().toString(),
      telegram_id: userData.telegram_id || 0,
      telegram_username: userData.telegram_username,
      first_name: userData.first_name || '',
      last_name: userData.last_name,
      phone: userData.phone,
      email: userData.email,
      loyalty_card_number: Math.floor(1000 + Math.random() * 9000).toString(),
      loyalty_card_issued_date: new Date().toISOString(),
      bonus_balance: 0,
      total_bonus_earned: 0,
      total_orders: 0,
      total_spent: 0,
      addresses: [],
      payment_methods: [],
      favorite_dishes: [],
      preferred_language: 'ru',
      notifications_enabled: true,
      registered_at: new Date().toISOString(),
    };
    console.log('✅ Mock Provider: Created user', user.user_id);
    return user;
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    console.log('✅ Mock Provider: Updated user', userId);
    return userData as User;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return [];
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const order: Order = {
      ...orderData,
      order_id: orderData.order_id || `#${Date.now().toString().slice(-8)}`,
      created_at: orderData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Order;
    console.log('✅ Mock Provider: Created order', order.order_id);
    return order;
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    return null;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    console.log('✅ Mock Provider: Updated order status', orderId, status);
    return {
      order_id: orderId,
      status: status as any,
      updated_at: new Date().toISOString(),
    } as Order;
  }

  async getActiveAds(): Promise<AdBanner[]> {
    return this.mockAds;
  }

  async getFavorites(userId: string): Promise<MenuItem[]> {
    return [];
  }

  async addToFavorites(userId: string, dishId: string): Promise<void> {
    console.log('✅ Mock Provider: Added to favorites', userId, dishId);
  }

  async removeFromFavorites(userId: string, dishId: string): Promise<void> {
    console.log('✅ Mock Provider: Removed from favorites', userId, dishId);
  }

  async getBonusHistory(userId: string): Promise<BonusTransaction[]> {
    return [];
  }

  async addBonus(
    userId: string,
    amount: number,
    reason: string,
    orderId?: string
  ): Promise<BonusTransaction> {
    const transaction: BonusTransaction = {
      transaction_id: Date.now().toString(),
      user_id: userId,
      amount,
      type: 'earn',
      reason,
      order_id: orderId,
      created_at: new Date().toISOString(),
    };
    console.log('✅ Mock Provider: Added bonus', transaction);
    return transaction;
  }

  async spendBonus(
    userId: string,
    amount: number,
    orderId: string
  ): Promise<BonusTransaction> {
    const transaction: BonusTransaction = {
      transaction_id: Date.now().toString(),
      user_id: userId,
      amount: -amount,
      type: 'spend',
      reason: 'Order payment',
      order_id: orderId,
      created_at: new Date().toISOString(),
    };
    console.log('✅ Mock Provider: Spent bonus', transaction);
    return transaction;
  }

  async getStats(): Promise<Stats> {
    return {
      totalUsers: 150,
      totalOrders: 1234,
      totalRevenue: 125000,
      activeUsers: 89,
    };
  }
}
