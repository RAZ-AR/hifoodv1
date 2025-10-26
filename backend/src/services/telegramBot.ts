/**
 * TELEGRAM BOT SERVICE
 *
 * Обработка заказов через Telegram:
 * - Отправка заказов в группу для кухни
 * - Дублирование заказов клиенту
 * - Управление статусами заказов
 */

import TelegramBot, { Message, CallbackQuery } from 'node-telegram-bot-api';

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

    if (!this.botToken) {
      console.error('⚠️  TELEGRAM_BOT_TOKEN не установлен в .env');
      return;
    }

    this.initializeBot();
  }

  private initializeBot() {
    try {
      // В production не используем polling, только отправка сообщений
      // В development включаем polling для локального тестирования команд
      const usePolling = process.env.NODE_ENV !== 'production';

      this.bot = new TelegramBot(this.botToken, { polling: usePolling });

      console.log(`✅ Telegram Bot инициализирован (polling: ${usePolling})`);

      // Обработка команд (только если включен polling)
      if (usePolling) {
        this.setupCommands();
        this.setupCallbackHandlers();
      }

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
        `👋 Привет, ${firstName}! Добро пожаловать в Hi Food!\n\n` +
        '🍔 Мы доставляем вкусную еду быстро и с любовью!\n\n' +
        '📱 Нажмите кнопку ниже, чтобы открыть меню и сделать заказ.\n\n' +
        '🎁 Вы также будете получать уведомления о статусе ваших заказов!',
        {
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

    // Команда /help
    this.bot.onText(/\/help/, (msg: Message) => {
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

    // Команда /menu - открыть меню
    this.bot.onText(/\/menu/, (msg: Message) => {
      const chatId = msg.chat.id;
      this.bot?.sendMessage(
        chatId,
        '🍔 Нажмите кнопку ниже чтобы открыть меню:',
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '📱 Открыть меню',
                  web_app: { url: 'https://raz-ar.github.io/hifoodv1/' }
                }
              ]
            ]
          }
        }
      );
    });

    // Команда /orders - мои заказы
    this.bot.onText(/\/orders/, (msg: Message) => {
      const chatId = msg.chat.id;
      this.bot?.sendMessage(
        chatId,
        '📦 Нажмите кнопку ниже чтобы посмотреть заказы:',
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '📱 Мои заказы',
                  web_app: { url: 'https://raz-ar.github.io/hifoodv1/' }
                }
              ]
            ]
          }
        }
      );
    });

    // Команда /profile - мой профиль
    this.bot.onText(/\/profile/, (msg: Message) => {
      const chatId = msg.chat.id;
      this.bot?.sendMessage(
        chatId,
        '👤 Нажмите кнопку ниже чтобы открыть профиль:',
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '📱 Мой профиль',
                  web_app: { url: 'https://raz-ar.github.io/hifoodv1/' }
                }
              ]
            ]
          }
        }
      );
    });

    // Команда /card - карта лояльности
    this.bot.onText(/\/card/, (msg: Message) => {
      const chatId = msg.chat.id;
      this.bot?.sendMessage(
        chatId,
        '🎁 Нажмите кнопку ниже чтобы посмотреть карту лояльности:',
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '📱 Моя карта',
                  web_app: { url: 'https://raz-ar.github.io/hifoodv1/' }
                }
              ]
            ]
          }
        }
      );
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
        try {
          // Обновляем статус заказа в БД
          await this.updateOrderStatus(orderId, newStatus);

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
   * Отправляет заказ в группу кухни и клиенту
   */
  async sendOrder(orderData: OrderData, customerTelegramId?: number): Promise<void> {
    console.log(`🔵 sendOrder вызван: OrderID=${orderData.orderId}, Timestamp=${new Date().toISOString()}`);

    if (!this.bot) {
      throw new Error('Telegram Bot не инициализирован');
    }

    // ID группы для кухни (получите через команду /chatid в вашей группе)
    const kitchenGroupId = process.env.KITCHEN_GROUP_ID || '-3233318512';

    const message = this.formatOrderMessage(orderData);

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
