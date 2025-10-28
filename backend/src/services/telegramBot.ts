/**
 * TELEGRAM BOT SERVICE
 *
 * Обработка заказов через Telegram:
 * - Отправка заказов в группу для кухни
 * - Дублирование заказов клиенту
 * - Управление статусами заказов
 */

import TelegramBot, { Message, CallbackQuery } from 'node-telegram-bot-api';
import { getDataProviderInstance } from './dataProvider';

interface OrderData {
  orderId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  cutleryCount: number;
  name: string;
  street: string;
  building: string;
  apartment: string;
  code?: string;
  deliveryNote?: string;
  contactMethod: 'telegram' | 'phone';
  phone?: string;
  paymentMethod: 'cash' | 'card';
  changeFrom?: number;
  comment?: string;
  loyaltyCardNumber?: string;
}

class TelegramBotService {
  private bot: TelegramBot | null = null;
  private botToken: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';

    console.log('🤖 TelegramBotService constructor вызван');
    console.log(`   Bot token: ${this.botToken ? 'SET (' + this.botToken.substring(0, 10) + '...)' : 'NOT SET'}`);
    console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);

    if (!this.botToken) {
      console.error('⚠️  TELEGRAM_BOT_TOKEN не установлен в .env');
      return;
    }

    this.initializeBot();
  }

  private initializeBot() {
    try {
      const isProduction = process.env.NODE_ENV === 'production';

      if (isProduction) {
        // На production используем webhook (без polling)
        this.bot = new TelegramBot(this.botToken, { polling: false });

        const webhookUrl = `${process.env.RENDER_EXTERNAL_URL || 'https://hifoodv1.onrender.com'}/api/telegram/webhook`;

        // Устанавливаем webhook
        this.bot.setWebHook(webhookUrl).then(() => {
          console.log(`✅ Telegram Bot webhook установлен: ${webhookUrl}`);
        }).catch((err) => {
          console.error('❌ Ошибка установки webhook:', err);
        });
      } else {
        // На development используем polling
        this.bot = new TelegramBot(this.botToken, { polling: true });
        console.log(`✅ Telegram Bot инициализирован с polling (development)`);
      }

      // Настраиваем команды и обработчики
      this.setupCommands();
      this.setupCallbackHandlers();

    } catch (error) {
      console.error('❌ Ошибка инициализации Telegram Bot:', error);
    }
  }

  /**
   * Настройка команд бота
   */
  private setupCommands() {
    if (!this.bot) return;

    // Команда /start
    this.bot.onText(/\/start/, (msg: Message) => {
      const chatId = msg.chat.id;
      const firstName = msg.from?.first_name || 'друг';

      this.bot?.sendMessage(
        chatId,
        `👋 Привет, ${firstName}!\n\n` +
        '🍕 Добро пожаловать в **Hi Food** — доставка вкусной еды!\n\n' +
        '📱 Нажмите кнопку ниже чтобы открыть меню:',
        {
          parse_mode: 'Markdown',
          reply_markup: {
            keyboard: [
              [
                {
                  text: '🍔 Открыть меню',
                  web_app: { url: 'https://raz-ar.github.io/hifoodv1/' }
                }
              ]
            ],
            resize_keyboard: true,
            one_time_keyboard: false
          }
        }
      );
    });

    // Команда /help
    this.bot.onText(/\/help/, (msg: Message) => {
      const chatId = msg.chat.id;
      this.bot?.sendMessage(
        chatId,
        '📖 **Помощь**\n\n' +
        '🍕 **Hi Food** — сервис доставки вкусной еды\n\n' +
        '**Как сделать заказ:**\n' +
        '1️⃣ Нажмите кнопку "🍔 Открыть меню" ниже\n' +
        '2️⃣ Выберите блюда и добавьте в корзину\n' +
        '3️⃣ Перейдите в корзину и оформите заказ\n' +
        '4️⃣ Получите уведомление о статусе заказа\n\n' +
        '💳 **Карта лояльности:** Накапливайте бонусы с каждым заказом!\n\n' +
        '📞 **Поддержка:** Напишите нам если возникли вопросы',
        {
          parse_mode: 'Markdown',
          reply_markup: {
            keyboard: [
              [
                {
                  text: '🍔 Открыть меню',
                  web_app: { url: 'https://raz-ar.github.io/hifoodv1/' }
                }
              ]
            ],
            resize_keyboard: true
          }
        }
      );
    });

    // Команда /status
    this.bot.onText(/\/status (.+)/, (msg: Message, match: RegExpExecArray | null) => {
      const chatId = msg.chat.id;
      const orderId = match?.[1];

      if (orderId) {
        // Здесь можно добавить запрос к БД для получения статуса
        this.bot?.sendMessage(
          chatId,
          `Проверяю статус заказа ${orderId}...`
        );
      }
    });

    // Команда /chatid - получить ID чата
    this.bot.onText(/\/chatid/, (msg: Message) => {
      const chatId = msg.chat.id;
      const chatType = msg.chat.type;
      const chatTitle = msg.chat.title || 'Личный чат';

      this.bot?.sendMessage(
        chatId,
        `📊 *Информация о чате:*\n\n` +
        `ID: \`${chatId}\`\n` +
        `Тип: ${chatType}\n` +
        `Название: ${chatTitle}\n\n` +
        `Используйте этот ID для настройки KITCHEN_GROUP_ID`,
        { parse_mode: 'Markdown' }
      );
    });

    // Команда /webhookinfo - проверить статус webhook
    this.bot.onText(/\/webhookinfo/, async (msg: Message) => {
      const chatId = msg.chat.id;

      try {
        const info = await this.bot?.getWebHookInfo();
        this.bot?.sendMessage(
          chatId,
          `🔗 *Webhook Info:*\n\n` +
          `URL: \`${info?.url || 'не установлен'}\`\n` +
          `Pending updates: ${info?.pending_update_count || 0}\n` +
          `Last error: ${info?.last_error_message || 'нет'}\n` +
          `Max connections: ${info?.max_connections || 'N/A'}`,
          { parse_mode: 'Markdown' }
        );
      } catch (error: any) {
        this.bot?.sendMessage(chatId, `❌ Ошибка: ${error.message}`);
      }
    });

    // Команда /setwebhook - установить webhook вручную (только для владельца)
    this.bot.onText(/\/setwebhook/, async (msg: Message) => {
      const chatId = msg.chat.id;

      // Проверяем, что это владелец (ваш Telegram ID)
      if (chatId !== 128136200) {
        this.bot?.sendMessage(chatId, '❌ У вас нет прав для этой команды');
        return;
      }

      try {
        const webhookUrl = `${process.env.RENDER_EXTERNAL_URL || 'https://hifoodv1.onrender.com'}/api/telegram/webhook`;
        await this.bot?.setWebHook(webhookUrl);
        this.bot?.sendMessage(
          chatId,
          `✅ Webhook установлен:\n\`${webhookUrl}\``,
          { parse_mode: 'Markdown' }
        );
      } catch (error: any) {
        this.bot?.sendMessage(chatId, `❌ Ошибка установки webhook: ${error.message}`);
      }
    });

  }

  /**
   * Настройка обработчиков callback-кнопок
   */
  private setupCallbackHandlers() {
    if (!this.bot) return;

    this.bot.on('callback_query', async (callbackQuery: CallbackQuery) => {
      const message = callbackQuery.message;
      const data = callbackQuery.data;

      if (!message || !data) return;

      // Парсим данные: status:orderId:newStatus
      const [action, orderId, newStatus] = data.split(':');

      if (action === 'status' && orderId && newStatus) {
        console.log(`🔵 Callback query received: orderId=${orderId}, newStatus=${newStatus}`);

        try {
          // Обновляем статус заказа в БД
          console.log(`📝 Updating order status in DB...`);
          await this.updateOrderStatus(orderId, newStatus);
          console.log(`✅ Order status updated successfully`);

          // Уведомляем оператора
          await this.bot?.answerCallbackQuery(callbackQuery.id, {
            text: `✅ Статус заказа ${orderId} изменён на: ${this.getStatusLabel(newStatus)}`,
          });

          // Обновляем сообщение
          this.getStatusEmoji(newStatus);
          await this.bot?.editMessageReplyMarkup(
            { inline_keyboard: this.getStatusButtons(orderId, newStatus) },
            {
              chat_id: message.chat.id,
              message_id: message.message_id,
            }
          );
          console.log(`✅ Message buttons updated`);

          // Отправляем уведомление клиенту
          console.log(`📨 Sending customer notification...`);
          await this.notifyCustomerAboutStatusChange(orderId, newStatus);
          console.log(`✅ Customer notification sent`);

        } catch (error) {
          console.error('❌ Ошибка обновления статуса:', error);
          console.error('Error stack:', (error as Error).stack);
          await this.bot?.answerCallbackQuery(callbackQuery.id, {
            text: '❌ Ошибка обновления статуса',
          });
        }
      }
    });
  }

  /**
   * Форматирует сообщение о заказе
   */
  private formatOrderMessage(orderData: OrderData): string {
    const itemsList = orderData.items
      .map((item) => {
        const itemTotal = item.price * item.quantity;
        return `• ${item.name} × ${item.quantity} = ${itemTotal} RSD`;
      })
      .join('\n');

    const deliveryAddress = [
      `Улица: ${orderData.street}`,
      `Дом: ${orderData.building}, Квартира: ${orderData.apartment}`,
      orderData.code ? `Код: ${orderData.code}` : '',
      orderData.deliveryNote ? `Отметка для курьера: ${orderData.deliveryNote}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const contactInfo =
      orderData.contactMethod === 'telegram'
        ? 'Telegram'
        : `Телефон: ${orderData.phone}`;

    let paymentInfo = '';
    if (orderData.paymentMethod === 'cash') {
      paymentInfo = 'Наличные';
      if (orderData.changeFrom) {
        const change = orderData.changeFrom - orderData.total;
        paymentInfo += `\nСдача с ${orderData.changeFrom} RSD (сдача: ${change} RSD)`;
      } else {
        paymentInfo += '\nСдача не требуется';
      }
    } else {
      paymentInfo = 'Банковская карта';
    }

    return `
🛒 *НОВЫЙ ЗАКАЗ ${orderData.orderId}*

👤 *Имя:* ${orderData.name}
${orderData.loyaltyCardNumber ? `🎫 *Карта лояльности:* ${orderData.loyaltyCardNumber}` : ''}

📦 *Товары:*
${itemsList}

🍴 *Приборы:* ${orderData.cutleryCount} шт.

💰 *Итого:* ${orderData.total} RSD

📍 *Адрес доставки:*
${deliveryAddress}

📞 *Контакт:*
${contactInfo}

💳 *Способ оплаты:*
${paymentInfo}

${orderData.comment ? `💬 *Комментарий:*\n${orderData.comment}` : ''}
    `.trim();
  }

  /**
   * Получает кнопки для управления статусом заказа
   */
  private getStatusButtons(orderId: string, currentStatus: string): TelegramBot.InlineKeyboardButton[][] {
    const statuses = [
      { status: 'accepted', label: '✅ Принят', emoji: '✅' },
      { status: 'preparing', label: '👨‍🍳 Готовится', emoji: '👨‍🍳' },
      { status: 'delivering', label: '🛵 В пути', emoji: '🛵' },
      { status: 'delivered', label: '🎉 Доставлен', emoji: '🎉' },
    ];

    return [
      statuses.map((s) => ({
        text: currentStatus === s.status ? `${s.emoji} ${s.label}` : s.label,
        callback_data: `status:${orderId}:${s.status}`,
      })),
    ];
  }

  /**
   * Получает эмодзи для статуса
   */
  private getStatusEmoji(status: string): string {
    const emojis: Record<string, string> = {
      accepted: '✅',
      preparing: '👨‍🍳',
      delivering: '🛵',
      delivered: '🎉',
    };
    return emojis[status] || '❓';
  }

  /**
   * Получает текстовое описание статуса
   */
  private getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      accepted: 'Принят',
      preparing: 'Готовится',
      delivering: 'В пути',
      delivered: 'Доставлен',
    };
    return labels[status] || status;
  }

  /**
   * Обрабатывает Telegram webhook update
   */
  processUpdate(update: any): void {
    if (!this.bot) return;
    this.bot.processUpdate(update);
  }

  /**
   * Отправляет заказ в группу кухни и клиенту
   */
  async sendOrder(orderData: OrderData, customerTelegramId?: number): Promise<void> {
    console.log(`🔵 sendOrder вызван: OrderID=${orderData.orderId}, Timestamp=${new Date().toISOString()}`);

    if (!this.bot) {
      console.error('❌ КРИТИЧЕСКАЯ ОШИБКА: this.bot is null!');
      console.error('   Bot token:', this.botToken ? 'SET' : 'NOT SET');
      throw new Error('Telegram Bot не инициализирован');
    }

    // ID группы для кухни (получите через команду /chatid в вашей группе)
    const kitchenGroupId = process.env.KITCHEN_GROUP_ID || '-3233318512';
    console.log(`📍 Kitchen Group ID: ${kitchenGroupId}`);
    console.log(`📍 Customer Telegram ID: ${customerTelegramId || 'not provided'}`);

    const message = this.formatOrderMessage(orderData);
    console.log(`📝 Сформировано сообщение (длина: ${message.length} символов)`);

    try {
      // 1. Отправляем в группу кухни с кнопками управления
      console.log(`📨 Отправка в группу кухни: OrderID=${orderData.orderId}`);
      await this.bot.sendMessage(kitchenGroupId, message, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: this.getStatusButtons(orderData.orderId, 'accepted'),
        },
      });

      console.log(`✅ Заказ ${orderData.orderId} отправлен в группу кухни (${kitchenGroupId})`);

      // 2. Дублируем клиенту (если есть его Telegram ID)
      if (customerTelegramId) {
        try {
          console.log(`📨 Отправка клиенту: OrderID=${orderData.orderId}, CustomerID=${customerTelegramId}`);
          await this.bot.sendMessage(customerTelegramId, message, {
            parse_mode: 'Markdown',
          });
          console.log(`✅ Заказ ${orderData.orderId} отправлен клиенту`);
        } catch (customerError: any) {
          console.warn(`⚠️  Не удалось отправить заказ клиенту ${customerTelegramId}:`, customerError.message);
          console.warn('   (Клиент, возможно, не запустил бота или заблокировал его)');
        }
      }

      console.log(`🟢 sendOrder завершён: OrderID=${orderData.orderId}`);
    } catch (error) {
      console.error('❌ Ошибка отправки заказа в группу кухни:', error);
      throw error;
    }
  }

  /**
   * Обновляет статус заказа в БД
   */
  private async updateOrderStatus(orderId: string, status: string): Promise<void> {
    console.log(`📝 Обновление статуса заказа ${orderId} -> ${status}`);

    try {
      const db = getDataProviderInstance();

      // Маппинг статусов из кнопок в статусы БД
      const statusMap: Record<string, string> = {
        'accepted': 'confirmed',
        'preparing': 'preparing',
        'delivering': 'delivering',
        'delivered': 'completed',
      };

      const dbStatus = statusMap[status] || status;
      console.log(`📝 Статус БД: ${dbStatus}`);

      await db.updateOrderStatus(orderId, dbStatus as any);
      console.log(`✅ Статус заказа ${orderId} обновлён в БД: ${dbStatus}`);
    } catch (error) {
      console.error(`❌ Ошибка обновления статуса заказа ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Отправляет уведомление клиенту об изменении статуса
   */
  private async notifyCustomerAboutStatusChange(
    orderId: string,
    newStatus: string
  ): Promise<void> {
    console.log(`📨 Отправка уведомления клиенту о статусе ${orderId}: ${newStatus}`);

    try {
      const db = getDataProviderInstance();

      // Получаем заказ из БД
      const order = await db.getOrderById(orderId);

      if (!order) {
        console.warn(`⚠️  Заказ ${orderId} не найден в БД`);
        return;
      }

      // Получаем Telegram ID клиента
      const customerTelegramId = order.telegram_id;

      if (!customerTelegramId) {
        console.warn(`⚠️  У заказа ${orderId} нет telegram_id клиента`);
        return;
      }

      // Отправляем уведомление
      await this.sendStatusUpdate(customerTelegramId, orderId, newStatus);
      console.log(`✅ Уведомление о статусе отправлено клиенту ${customerTelegramId}`);
    } catch (error) {
      console.error(`❌ Ошибка отправки уведомления клиенту:`, error);
      // Не прокидываем ошибку дальше, чтобы не сломать основной процесс
    }
  }

  /**
   * Отправляет обновление статуса клиенту
   */
  async sendStatusUpdate(
    customerTelegramId: number,
    orderId: string,
    status: string
  ): Promise<void> {
    if (!this.bot) return;

    const statusMessages: Record<string, string> = {
      accepted: '✅ Ваш заказ принят и передан на кухню',
      preparing: '👨‍🍳 Наши повара готовят ваш заказ',
      delivering: '🛵 Курьер уже в пути к вам!',
      delivered: '🎉 Заказ доставлен! Приятного аппетита!',
      completed: '🎉 Заказ доставлен! Приятного аппетита!',
    };

    const message = `
🔔 *Обновление заказа*
📦 *Номер заказа:* ${orderId}

${statusMessages[status] || 'Статус заказа обновлён'}
    `.trim();

    try {
      await this.bot.sendMessage(customerTelegramId, message, {
        parse_mode: 'Markdown',
      });
    } catch (error) {
      console.error('Ошибка отправки уведомления клиенту:', error);
    }
  }
}

// Создаем singleton instance
export const telegramBot = new TelegramBotService();
