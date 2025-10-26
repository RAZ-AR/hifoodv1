/**
 * ГЛАВНЫЙ ФАЙЛ BACKEND ПРИЛОЖЕНИЯ
 *
 * Entry point для сервера
 */

import dotenv from 'dotenv';
import path from 'path';
import express, { Request, Response } from 'express';
import cors from 'cors';

// Загружаем переменные окружения
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { getDataProviderInstance } from './services/dataProvider';
import { telegramBot } from './services/telegramBot';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

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
    app.get('/api/users/telegram/:telegramId', async (req: Request, res: Response) => {
      try {
        const telegramId = parseInt(req.params.telegramId!);
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
    app.get('/api/users/card/:cardNumber', async (req: Request, res: Response) => {
      try {
        const user = await db.getUserByLoyaltyCard(req.params.cardNumber!);

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        return res.json(user);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    });

    // Create user
    app.post('/api/users', async (req: Request, res: Response) => {
      try {
        const user = await db.createUser(req.body);
        res.status(201).json(user);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Update user
    app.put('/api/users/:userId', async (req: Request, res: Response) => {
      try {
        const user = await db.updateUser(req.params.userId!, req.body);
        res.json(user);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // ==========================================
    // MENU
    // ==========================================

    // Get menu
    app.get('/api/menu', async (_req: Request, res: Response) => {
      try {
        const menu = await db.getMenu();
        res.json(menu);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get menu item by ID
    app.get('/api/menu/:itemId', async (req: Request, res: Response) => {
      try {
        const item = await db.getMenuItemById(req.params.itemId!);

        if (!item) {
          return res.status(404).json({ error: 'Menu item not found' });
        }

        return res.json(item);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    });

    // Get menu by category
    app.get('/api/menu/category/:category', async (req: Request, res: Response) => {
      try {
        const items = await db.getMenuByCategory(req.params.category!);
        res.json(items);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // ==========================================
    // ORDERS
    // ==========================================

    // Create order
    app.post('/api/orders', async (req: Request, res: Response) => {
      try {
        const order = await db.createOrder(req.body);
        res.status(201).json(order);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Webhook для получения заказов из Telegram Web App
    app.post('/api/orders/telegram-webhook', async (req: Request, res: Response) => {
      try {
        const { orderData, customerTelegramId } = req.body;

        console.log(`🔍 Webhook вызван: OrderID=${orderData.orderId}, Timestamp=${new Date().toISOString()}`);

        // Отправляем заказ в Telegram группу и клиенту
        console.log(`📤 Отправка заказа ${orderData.orderId} в Telegram...`);
        await telegramBot.sendOrder(orderData, customerTelegramId);
        console.log(`✅ Заказ ${orderData.orderId} успешно отправлен в Telegram`);

        // Сохраняем заказ в БД (полная схема после исправления таблицы)
        const orderToCreate = {
          order_number: orderData.orderId,
          telegram_id: customerTelegramId || 0,
          customer_name: orderData.name,
          customer_phone: orderData.phone || '',
          loyalty_card_number: orderData.loyaltyCardNumber || null,
          items: orderData.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          subtotal: orderData.total,
          delivery_fee: 0,
          discount: 0,
          total: orderData.total,
          delivery_address: {
            street: orderData.street,
            building: orderData.building,
            apartment: orderData.apartment,
            entrance: orderData.code || '',
            comment: orderData.deliveryNote || '',
          },
          status: 'confirmed',
          payment_method: orderData.paymentMethod,
          payment_status: orderData.paymentMethod === 'cash' ? 'pending' : 'paid',
          customer_comment: orderData.comment || null,
          // user_id, bonus_points_used, bonus_points_earned используют DEFAULT значения
        } as any;

        console.log('💾 Сохранение заказа в БД:', orderToCreate.order_number);
        await db.createOrder(orderToCreate);
        console.log('✅ Заказ успешно сохранён в БД');

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
    app.get('/api/orders/:orderId', async (req: Request, res: Response) => {
      try {
        const order = await db.getOrderById(req.params.orderId!);

        if (!order) {
          return res.status(404).json({ error: 'Order not found' });
        }

        return res.json(order);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    });

    // Get user orders
    app.get('/api/orders/user/:userId', async (req: Request, res: Response) => {
      try {
        const orders = await db.getUserOrders(req.params.userId!);
        res.json(orders);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Update order status
    app.patch('/api/orders/:orderId/status', async (req: Request, res: Response) => {
      try {
        const order = await db.updateOrderStatus(req.params.orderId!, req.body.status);
        res.json(order);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // ==========================================
    // ADS
    // ==========================================

    // Get active ads
    app.get('/api/ads', async (_req: Request, res: Response) => {
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
    app.get('/api/favorites/:userId', async (req: Request, res: Response) => {
      try {
        const favorites = await db.getFavorites(req.params.userId!);
        res.json(favorites);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Add to favorites
    app.post('/api/favorites', async (req: Request, res: Response) => {
      try {
        const { userId, dishId } = req.body;
        await db.addToFavorites(userId, dishId);
        res.status(201).json({ success: true });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Remove from favorites
    app.delete('/api/favorites/:userId/:dishId', async (req: Request, res: Response) => {
      try {
        await db.removeFromFavorites(req.params.userId!, req.params.dishId!);
        res.json({ success: true });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // ==========================================
    // BONUSES
    // ==========================================

    // Get bonus history
    app.get('/api/bonuses/:userId', async (req: Request, res: Response) => {
      try {
        const history = await db.getBonusHistory(req.params.userId!);
        res.json(history);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Add bonus
    app.post('/api/bonuses/add', async (req: Request, res: Response) => {
      try {
        const { userId, amount, reason, orderId } = req.body;
        const transaction = await db.addBonus(userId, amount, reason, orderId);
        res.status(201).json(transaction);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Spend bonus
    app.post('/api/bonuses/spend', async (req: Request, res: Response) => {
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
    app.get('/api/stats', async (_req: Request, res: Response) => {
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
