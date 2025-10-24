import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import path from 'path';

// Загружаем переменные окружения
dotenv.config({ path: path.join(__dirname, '../.env') });

const token = process.env.TELEGRAM_BOT_TOKEN || '';
const chatId = process.env.KITCHEN_GROUP_ID || '-3233318512';

console.log('🧪 Тестирование Telegram бота...');
console.log('Token:', token ? `${token.substring(0, 10)}...` : 'НЕ НАЙДЕН');
console.log('Chat ID:', chatId);
console.log('');

const bot = new TelegramBot(token, { polling: false });

async function testBot() {
  try {
    console.log('📤 Отправка тестового сообщения...');

    const result = await bot.sendMessage(
      chatId,
      '🧪 *Тестовое сообщение от Hi Food бота*\n\n' +
      'Если вы видите это сообщение - бот работает правильно!\n\n' +
      '✅ Бот может отправлять заказы в эту группу.',
      { parse_mode: 'Markdown' }
    );

    console.log('');
    console.log('✅ УСПЕХ! Сообщение отправлено!');
    console.log('ID сообщения:', result.message_id);
    console.log('Чат:', result.chat.title || result.chat.type);
    console.log('');
    console.log('👉 Теперь можно оформлять заказы через приложение!');
    process.exit(0);

  } catch (error: any) {
    console.error('');
    console.error('❌ ОШИБКА:', error.message);
    console.error('');

    if (error.message.includes('chat not found')) {
      console.error('🔍 Причина: Чат не найден');
      console.error('');
      console.error('Решение:');
      console.error('1. Откройте группу https://web.telegram.org/k/#-3233318512');
      console.error('2. Найдите бота @Hi_food_order_bot в списке участников');
      console.error('3. Если бота НЕТ - добавьте его:');
      console.error('   - Нажмите на имя группы');
      console.error('   - "Добавить участников"');
      console.error('   - Найдите @Hi_food_order_bot');
      console.error('   - Добавьте бота');
      console.error('4. Сделайте бота администратором группы');

    } else if (error.message.includes('bot was blocked')) {
      console.error('🚫 Причина: Бот заблокирован');
      console.error('Решение: Разблокируйте бота в Telegram');

    } else if (error.message.includes('not enough rights')) {
      console.error('⚠️  Причина: Недостаточно прав');
      console.error('Решение: Дайте боту права администратора в группе');

    } else {
      console.error('Полная ошибка:', error);
    }

    process.exit(1);
  }
}

testBot();
