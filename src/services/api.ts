/**
 * API Service
 *
 * Handles all API calls to backend
 */

import { API_BASE_URL } from '@/config/api';
import type { User, MenuItem, Order, AdBanner } from '@/types';

class ApiService {
  /**
   * Users
   */
  async getUser(telegramId: number): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${telegramId}`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error('Failed to fetch user');
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async createUser(userData: Partial<User>): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Failed to create user');
      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Failed to update user');
      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Menu
   */
  async getMenu(filters?: { category?: string; available?: boolean }): Promise<MenuItem[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.available !== undefined) params.append('available', String(filters.available));

      const url = `${API_BASE_URL}/menu${params.toString() ? `?${params}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch menu');
      return await response.json();
    } catch (error) {
      console.error('Error fetching menu:', error);
      throw error;
    }
  }

  async getMenuItem(itemId: string): Promise<MenuItem> {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/${itemId}`);
      if (!response.ok) throw new Error('Failed to fetch menu item');
      return await response.json();
    } catch (error) {
      console.error('Error fetching menu item:', error);
      throw error;
    }
  }

  /**
   * Orders
   */
  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) throw new Error('Failed to create order');
      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * Send order to Telegram (kitchen group + customer)
   */
  async sendOrderToTelegram(orderData: any, customerTelegramId?: number): Promise<{ success: boolean; orderId: string }> {
    console.log(`🔵 Frontend sendOrderToTelegram вызван: OrderID=${orderData.orderId}, Timestamp=${new Date().toISOString()}`);

    try {
      console.log(`📤 Отправка POST запроса на ${API_BASE_URL}/orders/telegram-webhook`);
      const response = await fetch(`${API_BASE_URL}/orders/telegram-webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderData,
          customerTelegramId,
        }),
      });
      console.log(`📥 Получен ответ: status=${response.status}, OrderID=${orderData.orderId}`);
      if (!response.ok) throw new Error('Failed to send order to Telegram');
      const result = await response.json();
      console.log(`🟢 Frontend sendOrderToTelegram завершён успешно: OrderID=${orderData.orderId}`);
      return result;
    } catch (error) {
      console.error('Error sending order to Telegram:', error);
      throw error;
    }
  }

  async getOrder(orderId: string): Promise<Order> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
      if (!response.ok) throw new Error('Failed to fetch order');
      return await response.json();
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  /**
   * Ads
   */
  async getAds(): Promise<AdBanner[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/ads`);
      if (!response.ok) throw new Error('Failed to fetch ads');
      return await response.json();
    } catch (error) {
      console.error('Error fetching ads:', error);
      throw error;
    }
  }

  /**
   * Favorites
   */
  async getFavorites(userId: string): Promise<MenuItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch favorites');
      return await response.json();
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  }

  async addFavorite(userId: string, itemId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, item_id: itemId }),
      });
      if (!response.ok) throw new Error('Failed to add favorite');
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  }

  async removeFavorite(userId: string, itemId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites/${userId}/${itemId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove favorite');
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  }

  /**
   * Order Status
   */
  async getOrderStatus(orderId: string): Promise<{ status: string } | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error('Failed to fetch order status');
      return await response.json();
    } catch (error) {
      console.error('Error fetching order status:', error);
      return null;
    }
  }

  /**
   * Health Check
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
      if (!response.ok) throw new Error('Backend is not healthy');
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
}

export const api = new ApiService();
