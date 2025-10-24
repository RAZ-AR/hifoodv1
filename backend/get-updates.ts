import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import path from 'path';

// Загружаем переменные окружения
dotenv.config({ path: path.join(__dirname, '../.env') });

const token = process.env.TELEGRAM_BOT_TOKEN || '';

console.log('🔍 Получение последних сообщений от бота...');
console.log('Token:', token ? `${token.substring(0, 10)}...` : 'НЕ НАЙДЕН');
console.log('');

const bot = new TelegramBot(token, { polling: false });

async function getUpdates() {
  try {
    console.log('📥 Запрашиваю последние обновления...');

    const updates = await bot.getUpdates();

    if (updates.length === 0) {
      console.log('');
      console.log('ℹ️  Нет новых сообщений.');
      console.log('');
      console.log('👉 Действия:');
      console.log('1. Откройте группу HI-Food order');
      console.log('2. Отправьте ЛЮБОЕ сообщение или команду (например: /chatid или просто "привет")');
      console.log('3. Запустите этот скрипт снова');
      console.log('');
      console.log('Команда: cd /Users/bari/Documents/GitHub/hifoodv1/backend && npx ts-node get-updates.ts');
    } else {
      console.log('');
      console.log(`✅ Найдено обновлений: ${updates.length}`);
      console.log('');

      updates.slice(-5).forEach((update, index) => {
        if (update.message) {
          const chat = update.message.chat;
          console.log(`--- Сообщение ${index + 1} ---`);
          console.log(`Chat ID: ${chat.id}`);
          console.log(`Chat Type: ${chat.type}`);
          console.log(`Chat Title: ${chat.title || 'N/A'}`);
          console.log(`From: ${update.message.from?.first_name || 'Unknown'}`);
          console.log(`Text: ${update.message.text || 'N/A'}`);
          console.log('');
        }
      });

      console.log('👉 Используйте один из Chat ID выше для KITCHEN_GROUP_ID');
    }

    process.exit(0);

  } catch (error: any) {
    console.error('');
    console.error('❌ ОШИБКА:', error.message);
    process.exit(1);
  }
}

getUpdates();
