/**
 * ПРИМЕР ИСПОЛЬЗОВАНИЯ DATA PROVIDER API
 *
 * Этот файл показывает, как использовать Data Provider
 * для работы с пользователями, меню, заказами и бонусами
 */

import { getDataProviderInstance } from '../services/dataProvider';
import { User, Order, MenuItem } from '../types';

async function main() {
  // Получаем инстанс провайдера (автоматически из .env)
  const db = getDataProviderInstance();

  console.log('🚀 Начинаем тестирование Data Provider API\n');

  // ==========================================
  // 1. РАБОТА С ПОЛЬЗОВАТЕЛЯМИ
  // ==========================================

  console.log('📝 1. Создание нового пользователя...');

  const newUser = await db.createUser({
    telegram_id: 123456789,
    telegram_username: '@testuser',
    first_name: 'Иван',
    last_name: 'Иванов',
    phone: '+381641234567',
    email: 'ivan@example.com',
    addresses: [],
    payment_methods: [{
      id: 'cash',
      type: 'cash',
      is_default: true,
    }],
    favorite_dishes: [],
    preferred_language: 'ru',
    notifications_enabled: true,
  });

  console.log(`✅ Пользователь создан!`);
  console.log(`   ID: ${newUser.user_id}`);
  console.log(`   Карта лояльности: #${newUser.loyalty_card_number} 🎴`);
  console.log(`   Дата выдачи карты: ${newUser.loyalty_card_issued_date}`);
  console.log(`   Бонусов: ${newUser.bonus_balance}\n`);

  // ==========================================
  // 2. ПОИСК ПОЛЬЗОВАТЕЛЯ
  // ==========================================

  console.log('🔍 2. Поиск пользователя по Telegram ID...');

  const foundUser = await db.getUserByTelegramId(123456789);

  if (foundUser) {
    console.log(`✅ Пользователь найден: ${foundUser.first_name}`);
    console.log(`   Карта лояльности: #${foundUser.loyalty_card_number}\n`);
  }

  console.log('🔍 3. Поиск пользователя по номеру карты...');

  const userByCard = await db.getUserByLoyaltyCard(newUser.loyalty_card_number);

  if (userByCard) {
    console.log(`✅ Пользователь найден по карте #${userByCard.loyalty_card_number}`);
    console.log(`   Имя: ${userByCard.first_name} ${userByCard.last_name}\n`);
  }

  // ==========================================
  // 3. РАБОТА С МЕНЮ
  // ==========================================

  console.log('🍕 4. Получение меню...');

  const menu = await db.getMenu();

  console.log(`✅ Загружено блюд: ${menu.length}`);

  if (menu.length > 0) {
    const firstDish = menu[0];
    console.log(`   Первое блюдо: ${firstDish.name}`);
    console.log(`   Цена: ${firstDish.price} DIN`);
    console.log(`   Рейтинг: ${firstDish.rating} ⭐\n`);
  }

  // Получение по категории
  console.log('🍕 5. Получение блюд категории "Pizza"...');

  const pizzas = await db.getMenuByCategory('Pizza');

  console.log(`✅ Найдено пицц: ${pizzas.length}\n`);

  // ==========================================
  // 4. РАБОТА С АДРЕСАМИ
  // ==========================================

  console.log('🏠 6. Добавление адреса доставки...');

  const updatedUser = await db.addAddress(newUser.user_id, {
    label: 'Дом',
    street: 'Kneza Miloša',
    building: '10',
    apartment: '25',
    entrance: '2',
    floor: '5',
    comment: 'Домофон не работает, звоните заранее',
    is_default: true,
  });

  console.log(`✅ Адрес добавлен!`);
  console.log(`   Адресов у пользователя: ${updatedUser.addresses.length}\n`);

  // ==========================================
  // 5. СОЗДАНИЕ ЗАКАЗА
  // ==========================================

  console.log('🛒 7. Создание заказа...');

  if (menu.length > 0 && updatedUser.addresses.length > 0) {
    const dish = menu[0];

    const order = await db.createOrder({
      user_id: updatedUser.user_id,
      user_name: updatedUser.first_name,
      user_phone: updatedUser.phone || '',
      loyalty_card_number: updatedUser.loyalty_card_number, // Карта из профиля!
      items: [
        {
          dish_id: dish.id,
          name: dish.name,
          price: dish.price,
          quantity: 2,
          subtotal: dish.price * 2,
        },
      ],
      subtotal: dish.price * 2,
      delivery_fee: dish.price * 2 >= 2000 ? 0 : 300, // Бесплатная доставка от 2000 DIN
      total_amount: dish.price * 2 + (dish.price * 2 >= 2000 ? 0 : 300),
      delivery_address: updatedUser.addresses[0],
      delivery_time: 'now',
      payment_method: updatedUser.payment_methods[0],
      bonus_applied: 0,
      status: 'pending',
    });

    console.log(`✅ Заказ создан!`);
    console.log(`   ID заказа: ${order.order_id}`);
    console.log(`   Карта лояльности в заказе: #${order.loyalty_card_number} 🎴`);
    console.log(`   Сумма: ${order.total_amount} DIN`);
    console.log(`   Доставка: ${order.delivery_fee} DIN`);
    console.log(`   Статус: ${order.status}\n`);

    // ==========================================
    // 6. НАЧИСЛЕНИЕ БОНУСОВ
    // ==========================================

    console.log('💰 8. Начисление бонусов за заказ...');

    // Начисляем 10% от суммы заказа в бонусах
    const bonusAmount = Math.floor(order.total_amount * 0.1);

    const bonusTransaction = await db.addBonus(
      updatedUser.user_id,
      bonusAmount,
      undefined,
      order.order_id
    );

    console.log(`✅ Бонусы начислены!`);
    console.log(`   Сумма: +${bonusAmount} бонусов`);
    console.log(`   Баланс до: ${bonusTransaction.balance_before}`);
    console.log(`   Баланс после: ${bonusTransaction.balance_after}\n`);

    // ==========================================
    // 7. ИЗМЕНЕНИЕ СТАТУСА ЗАКАЗА
    // ==========================================

    console.log('📦 9. Обновление статуса заказа...');

    const updatedOrder = await db.updateOrderStatus(order.order_id, 'confirmed');

    console.log(`✅ Статус обновлен: ${updatedOrder.status}\n`);

    // ==========================================
    // 8. ИСТОРИЯ ЗАКАЗОВ
    // ==========================================

    console.log('📋 10. Получение истории заказов пользователя...');

    const userOrders = await db.getUserOrders(updatedUser.user_id);

    console.log(`✅ Всего заказов: ${userOrders.length}`);

    userOrders.forEach((o, index) => {
      console.log(`   ${index + 1}. Заказ ${o.order_id}`);
      console.log(`      Карта: #${o.loyalty_card_number}`);
      console.log(`      Сумма: ${o.total_amount} DIN`);
      console.log(`      Статус: ${o.status}`);
    });
    console.log('');
  }

  // ==========================================
  // 9. ИЗБРАННОЕ
  // ==========================================

  if (menu.length > 0) {
    console.log('❤️ 11. Добавление блюда в избранное...');

    await db.addToFavorites(newUser.user_id, menu[0].id);

    console.log(`✅ Блюдо "${menu[0].name}" добавлено в избранное\n`);

    console.log('❤️ 12. Получение избранных блюд...');

    const favorites = await db.getFavorites(newUser.user_id);

    console.log(`✅ Избранных блюд: ${favorites.length}`);

    favorites.forEach((dish) => {
      console.log(`   - ${dish.name} (${dish.price} DIN)`);
    });
    console.log('');
  }

  // ==========================================
  // 10. СТАТИСТИКА
  // ==========================================

  console.log('📊 13. Получение общей статистики...');

  const stats = await db.getStats();

  console.log(`✅ Статистика:`);
  console.log(`   Всего пользователей: ${stats.totalUsers}`);
  console.log(`   Всего заказов: ${stats.totalOrders}`);
  console.log(`   Общая выручка: ${stats.totalRevenue} DIN`);
  console.log(`   Активных пользователей: ${stats.activeUsers}\n`);

  // ==========================================
  // 11. HEALTH CHECK
  // ==========================================

  console.log('🏥 14. Проверка подключения...');

  const isHealthy = await db.healthCheck();

  console.log(`${isHealthy ? '✅' : '❌'} Подключение: ${isHealthy ? 'OK' : 'Ошибка'}\n`);

  console.log('🎉 Тестирование завершено успешно!\n');
}

// Запуск примера
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Ошибка:', error.message);
    console.error(error.stack);
    process.exit(1);
  });
}

export { main };
