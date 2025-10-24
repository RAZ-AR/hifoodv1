/**
 * TELEGRAM BOT SERVICE
 *
 * Обработка заказов через Telegram:
 * - Отправка заказов в группу для кухни
 * - Дублирование заказов клиенту
 * - Управление статусами заказов
 */

import TelegramBot from 'node-telegram-bot-api';

// ID группы для кухни (замените на ваш ID)
const KITCHEN_GROUP_ID = '-3233318512';

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
}

class TelegramBotService {
  private bot: TelegramBot | null = null;
  private botToken: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';

    if (!this.botToken) {
      console.error('⚠️  TELEGRAM_BOT_TOKEN не установлен в .env');
      return;
    }

    this.initializeBot();
  }

  private initializeBot() {
    try {
      // Создаем экземпляр бота
      this.bot = new TelegramBot(this.botToken, { polling: true });

      console.log('✅ Telegram Bot инициализирован');

      // Обработка команд
      this.setupCommands();

      // Обработка callback-кнопок для смены статуса
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
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      this.bot?.sendMessage(
        chatId,
        '👋 Привет! Я бот Hi Food.\n\n' +
        'Я буду присылать вам уведомления о новых заказах и их статусе.'
      );
    });

    // Команда /help
    this.bot.onText(/\/help/, (msg) => {
      const chatId = msg.chat.id;
      this.bot?.sendMessage(
        chatId,
        '📖 *Помощь*\n\n' +
        'Доступные команды:\n' +
        '/start - Начало работы\n' +
        '/help - Помощь\n' +
        '/status <номер> - Проверить статус заказа\n\n' +
        'После получения заказа используйте кнопки для изменения статуса.',
        { parse_mode: 'Markdown' }
      );
    });

    // Команда /status
    this.bot.onText(/\/status (.+)/, (msg, match) => {
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
  }

  /**
   * Настройка обработчиков callback-кнопок
   */
  private setupCallbackHandlers() {
    if (!this.bot) return;

    this.bot.on('callback_query', async (callbackQuery) => {
      const message = callbackQuery.message;
      const data = callbackQuery.data;

      if (!message || !data) return;

      // Парсим данные: status:orderId:newStatus
      const [action, orderId, newStatus] = data.split(':');

      if (action === 'status') {
        try {
          // Обновляем статус заказа в БД
          await this.updateOrderStatus(orderId, newStatus);

          // Уведомляем оператора
          await this.bot?.answerCallbackQuery(callbackQuery.id, {
            text: `✅ Статус заказа ${orderId} изменён на: ${this.getStatusLabel(newStatus)}`,
          });

          // Обновляем сообщение
          const statusEmoji = this.getStatusEmoji(newStatus);
          await this.bot?.editMessageReplyMarkup(
            { inline_keyboard: this.getStatusButtons(orderId, newStatus) },
            {
              chat_id: message.chat.id,
              message_id: message.message_id,
            }
          );

          // Отправляем уведомление клиенту
          await this.notifyCustomerAboutStatusChange(orderId, newStatus);

        } catch (error) {
          console.error('Ошибка обновления статуса:', error);
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
   * Отправляет заказ в группу кухни и клиенту
   */
  async sendOrder(orderData: OrderData, customerTelegramId?: number): Promise<void> {
    if (!this.bot) {
      throw new Error('Telegram Bot не инициализирован');
    }

    const message = this.formatOrderMessage(orderData);

    try {
      // 1. Отправляем в группу кухни с кнопками управления
      await this.bot.sendMessage(KITCHEN_GROUP_ID, message, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: this.getStatusButtons(orderData.orderId, 'accepted'),
        },
      });

      console.log(`✅ Заказ ${orderData.orderId} отправлен в группу кухни`);

      // 2. Дублируем клиенту (если есть его Telegram ID)
      if (customerTelegramId) {
        await this.bot.sendMessage(customerTelegramId, message, {
          parse_mode: 'Markdown',
        });
        console.log(`✅ Заказ ${orderData.orderId} отправлен клиенту`);
      }

    } catch (error) {
      console.error('❌ Ошибка отправки заказа в Telegram:', error);
      throw error;
    }
  }

  /**
   * Обновляет статус заказа в БД
   */
  private async updateOrderStatus(orderId: string, status: string): Promise<void> {
    // Здесь должен быть запрос к вашей БД для обновления статуса
    // Например, через API или напрямую к dataProvider
    console.log(`Обновление статуса заказа ${orderId} -> ${status}`);

    // TODO: Реализовать обновление в БД
    // await db.updateOrderStatus(orderId, status);
  }

  /**
   * Отправляет уведомление клиенту об изменении статуса
   */
  private async notifyCustomerAboutStatusChange(
    orderId: string,
    newStatus: string
  ): Promise<void> {
    // TODO: Получить Telegram ID клиента из БД по orderId
    // const order = await db.getOrderById(orderId);
    // if (order.customerTelegramId) {
    //   await this.sendStatusUpdate(order.customerTelegramId, orderId, newStatus);
    // }

    console.log(`Уведомление клиенту о статусе ${orderId}: ${newStatus}`);
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
    };

    const message = `
🔔 *Обновление заказа ${orderId}*

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
