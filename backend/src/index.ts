/**
 * ГЛАВНЫЙ ФАЙЛ BACKEND ПРИЛОЖЕНИЯ
 *
 * Entry point для сервера
 */

import dotenv from 'dotenv';
import path from 'path';

// Загружаем переменные окружения
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { getDataProviderInstance } from './services/dataProvider';

async function main() {
  console.log('🚀 Hi Food Backend запускается...\n');

  // Проверяем конфигурацию
  console.log('⚙️  Конфигурация:');
  console.log(`   DATA_PROVIDER: ${process.env.DATA_PROVIDER || 'google_sheets'}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}\n`);

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

    console.log('✨ Backend готов к работе!\n');

    // TODO: Здесь будет запуск Express сервера
    // TODO: Здесь будет запуск Telegram Bot

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
