/**
 * ГЛАВНЫЙ ФАЙЛ BACKEND ПРИЛОЖЕНИЯ
 *
 * Entry point для сервера
 */

import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import cors from 'cors';

// Загружаем переменные окружения
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { getDataProviderInstance } from './services/dataProvider';
import { telegramBot } from './services/telegramBot';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    'https://raz-ar.github.io',
    'http://localhost:5173',
    'http://localhost:3000',
  ],
  credentials: true,
}));
app.use(express.json());

async function main() {
  console.log('🚀 Hi Food Backend запускается...\n');

  // Проверяем конфигурацию
  console.log('⚙️  Конфигурация:');
  console.log(`   DATA_PROVIDER: ${process.env.DATA_PROVIDER || 'google_sheets'}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   PORT: ${PORT}\n`);

  try {
    // Получаем инстанс провайдера данных
    const db = getDataProviderInstance();

    // Проверяем подключение
    console.log('🔍 Проверка подключения к источнику данных...');
    const isHealthy = await db.healthCheck();

    if (!isHealthy) {
      throw new Error('Не удалось подключиться к источнику данных');
    }

    console.log('✅ Подключение успешно!\n');

    // Получаем статистику
    console.log('📊 Статистика:');
    const stats = await db.getStats();
    console.log(`   Пользователей: ${stats.totalUsers}`);
    console.log(`   Заказов: ${stats.totalOrders}`);
    console.log(`   Выручка: ${stats.totalRevenue} DIN`);
    console.log(`   Активных пользователей: ${stats.activeUsers}\n`);

    // ==========================================
    // API ENDPOINTS
    // ==========================================

    // Health check
    app.get('/health', (_req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        provider: process.env.DATA_PROVIDER || 'google_sheets',
      });
    });

    // ==========================================
    // USERS
    // ==========================================

    // Get user by Telegram ID
    app.get('/api/users/telegram/:telegramId', async (req, res) => {
      try {
        const telegramId = parseInt(req.params.telegramId);
        const user = await db.getUserByTelegramId(telegramId);

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        return res.json(user);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    });

    // Get user by loyalty card
    app.get('/api/users/card/:cardNumber', async (req, res) => {
      try {
        const user = await db.getUserByLoyaltyCard(req.params.cardNumber);

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        return res.json(user);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    });

    // Create user
    app.post('/api/users', async (req, res) => {
      try {
        const user = await db.createUser(req.body);
        res.status(201).json(user);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Update user
    app.put('/api/users/:userId', async (req, res) => {
      try {
        const user = await db.updateUser(req.params.userId, req.body);
        res.json(user);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // ==========================================
    // MENU
    // ==========================================

    // Get menu
    app.get('/api/menu', async (_req, res) => {
      try {
        const menu = await db.getMenu();
        res.json(menu);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get menu item by ID
    app.get('/api/menu/:itemId', async (req, res) => {
      try {
        const item = await db.getMenuItemById(req.params.itemId);

        if (!item) {
          return res.status(404).json({ error: 'Menu item not found' });
        }

        return res.json(item);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    });

    // Get menu by category
    app.get('/api/menu/category/:category', async (req, res) => {
      try {
        const items = await db.getMenuByCategory(req.params.category);
        res.json(items);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // ==========================================
    // ORDERS
    // ==========================================

    // Create order
    app.post('/api/orders', async (req, res) => {
      try {
        const order = await db.createOrder(req.body);
        res.status(201).json(order);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Webhook для получения заказов из Telegram Web App
    app.post('/api/orders/telegram-webhook', async (req, res) => {
      try {
        const { orderData, customerTelegramId } = req.body;

        // Отправляем заказ в Telegram группу и клиенту
        await telegramBot.sendOrder(orderData, customerTelegramId);

        // Сохраняем заказ в БД (MockProvider принимает order_id)
        const orderToCreate = {
          user_id: customerTelegramId ? String(customerTelegramId) : 'unknown',
          user_name: orderData.name,
          user_phone: orderData.phone || '',
          loyalty_card_number: '',
          items: orderData.items.map((item: any) => ({
            dish_id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity,
          })),
          total_amount: orderData.total,
          subtotal: orderData.total,
          delivery_fee: 0,
          bonus_applied: 0,
          delivery_address: {
            id: '',
            label: 'Адрес доставки',
            street: orderData.street,
            building: orderData.building,
            apartment: orderData.apartment,
            entrance: orderData.code,
            comment: orderData.deliveryNote,
            is_default: false,
          },
          delivery_time: 'now',
          payment_method: {
            id: '',
            type: orderData.paymentMethod,
            is_default: true,
          },
          status: 'confirmed' as any,
          notes: orderData.comment,
        } as any;

        // Добавляем order_id для MockProvider
        orderToCreate.order_id = orderData.orderId;

        await db.createOrder(orderToCreate);

        res.status(201).json({
          success: true,
          orderId: orderData.orderId,
        });
      } catch (error: any) {
        console.error('Ошибка webhook:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Get order by ID
    app.get('/api/orders/:orderId', async (req, res) => {
      try {
        const order = await db.getOrderById(req.params.orderId);

        if (!order) {
          return res.status(404).json({ error: 'Order not found' });
        }

        return res.json(order);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    });

    // Get user orders
    app.get('/api/orders/user/:userId', async (req, res) => {
      try {
        const orders = await db.getUserOrders(req.params.userId);
        res.json(orders);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Update order status
    app.patch('/api/orders/:orderId/status', async (req, res) => {
      try {
        const order = await db.updateOrderStatus(req.params.orderId, req.body.status);
        res.json(order);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // ==========================================
    // ADS
    // ==========================================

    // Get active ads
    app.get('/api/ads', async (_req, res) => {
      try {
        const ads = await db.getActiveAds();
        res.json(ads);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // ==========================================
    // FAVORITES
    // ==========================================

    // Get favorites
    app.get('/api/favorites/:userId', async (req, res) => {
      try {
        const favorites = await db.getFavorites(req.params.userId);
        res.json(favorites);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Add to favorites
    app.post('/api/favorites', async (req, res) => {
      try {
        const { userId, dishId } = req.body;
        await db.addToFavorites(userId, dishId);
        res.status(201).json({ success: true });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Remove from favorites
    app.delete('/api/favorites/:userId/:dishId', async (req, res) => {
      try {
        await db.removeFromFavorites(req.params.userId, req.params.dishId);
        res.json({ success: true });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // ==========================================
    // BONUSES
    // ==========================================

    // Get bonus history
    app.get('/api/bonuses/:userId', async (req, res) => {
      try {
        const history = await db.getBonusHistory(req.params.userId);
        res.json(history);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Add bonus
    app.post('/api/bonuses/add', async (req, res) => {
      try {
        const { userId, amount, reason, orderId } = req.body;
        const transaction = await db.addBonus(userId, amount, reason, orderId);
        res.status(201).json(transaction);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Spend bonus
    app.post('/api/bonuses/spend', async (req, res) => {
      try {
        const { userId, amount, orderId } = req.body;
        const transaction = await db.spendBonus(userId, amount, orderId);
        res.status(201).json(transaction);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // ==========================================
    // STATS
    // ==========================================

    // Get stats
    app.get('/api/stats', async (_req, res) => {
      try {
        const stats = await db.getStats();
        res.json(stats);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // ==========================================
    // START SERVER
    // ==========================================

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✨ Backend готов к работе!`);
      console.log(`🌐 Server running on port ${PORT}\n`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📍 API: http://localhost:${PORT}/api\n`);
    });

  } catch (error: any) {
    console.error('❌ Ошибка при запуске:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Запуск
main().catch((error) => {
  console.error('Необработанная ошибка:', error);
  process.exit(1);
});
