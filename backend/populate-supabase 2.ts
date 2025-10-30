import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config({ path: '../.env' });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================
// Тестовые данные с реальными фотографиями
// ============================================

const USERS_DATA = [
  {
    telegram_id: 123456789,
    telegram_username: 'john_doe',
    first_name: 'Иван',
    last_name: 'Иванов',
    phone_number: '+381641234567',
    bonus_points: 250,
    total_orders: 15,
    total_spent: 12500,
    loyalty_card_number: 'HIFOOD001'
  },
  {
    telegram_id: 987654321,
    telegram_username: 'maria_s',
    first_name: 'Мария',
    last_name: 'Петрова',
    phone_number: '+381642345678',
    bonus_points: 180,
    total_orders: 8,
    total_spent: 8200,
    loyalty_card_number: 'HIFOOD002'
  },
  {
    telegram_id: 555666777,
    telegram_username: 'alex_k',
    first_name: 'Александр',
    last_name: 'Ковач',
    phone_number: '+381643456789',
    bonus_points: 50,
    total_orders: 3,
    total_spent: 2100,
    loyalty_card_number: 'HIFOOD003'
  }
];

const MENU_DATA = [
  // Пиццы
  {
    category: 'Пицца',
    name: 'Маргарита',
    description: 'Классическая итальянская пицца с томатным соусом, моцареллой и свежим базиликом',
    price: 890,
    weight: '350г',
    image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500',
    is_available: true,
    is_popular: true,
    calories: 265,
    protein: 11,
    fats: 10,
    carbs: 33,
    ingredients: ['томатный соус', 'моцарелла', 'базилик', 'оливковое масло'],
    allergens: ['молоко', 'глютен']
  },
  {
    category: 'Пицца',
    name: 'Пепперони',
    description: 'Острая пицца с пикантной салями пепперони и сыром моцарелла',
    price: 1050,
    weight: '400г',
    image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500',
    is_available: true,
    is_popular: true,
    calories: 298,
    protein: 12,
    fats: 13,
    carbs: 34,
    ingredients: ['томатный соус', 'моцарелла', 'пепперони'],
    allergens: ['молоко', 'глютен']
  },
  {
    category: 'Пицца',
    name: 'Четыре сыра',
    description: 'Изысканное сочетание моцареллы, горгонзолы, пармезана и фонтины',
    price: 1150,
    weight: '380г',
    image_url: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96800?w=500',
    is_available: true,
    is_popular: false,
    calories: 320,
    protein: 15,
    fats: 16,
    carbs: 30,
    ingredients: ['моцарелла', 'горгонзола', 'пармезан', 'фонтина'],
    allergens: ['молоко', 'глютен']
  },
  {
    category: 'Пицца',
    name: 'Гавайская',
    description: 'Тропическое сочетание ветчины, ананасов и сыра',
    price: 980,
    weight: '390г',
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500',
    is_available: true,
    is_popular: false,
    calories: 275,
    protein: 13,
    fats: 11,
    carbs: 35,
    ingredients: ['томатный соус', 'моцарелла', 'ветчина', 'ананас'],
    allergens: ['молоко', 'глютен']
  },
  {
    category: 'Пицца',
    name: 'Вегетарианская',
    description: 'Свежие овощи, грибы и ароматные травы на нежном сырном соусе',
    price: 850,
    weight: '360г',
    image_url: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=500',
    is_available: true,
    is_popular: false,
    calories: 220,
    protein: 9,
    fats: 8,
    carbs: 32,
    ingredients: ['томатный соус', 'моцарелла', 'помидоры', 'перец', 'грибы', 'маслины'],
    allergens: ['молоко', 'глютен']
  },

  // Суши и роллы
  {
    category: 'Суши',
    name: 'Филадельфия',
    description: 'Классический ролл с лососем, сливочным сыром и огурцом',
    price: 1200,
    weight: '250г',
    image_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500',
    is_available: true,
    is_popular: true,
    calories: 255,
    protein: 12,
    fats: 14,
    carbs: 22,
    ingredients: ['лосось', 'сливочный сыр', 'огурец', 'рис', 'нори'],
    allergens: ['рыба', 'молоко']
  },
  {
    category: 'Суши',
    name: 'Калифорния',
    description: 'Ролл с крабом, авокадо и огурцом, обваленный в икре тобико',
    price: 1100,
    weight: '240г',
    image_url: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=500',
    is_available: true,
    is_popular: true,
    calories: 240,
    protein: 10,
    fats: 12,
    carbs: 24,
    ingredients: ['краб', 'авокадо', 'огурец', 'икра тобико', 'рис', 'нори'],
    allergens: ['морепродукты', 'рыба']
  },
  {
    category: 'Суши',
    name: 'Дракон',
    description: 'Запеченный ролл с угрем, авокадо и специальным соусом',
    price: 1350,
    weight: '280г',
    image_url: 'https://images.unsplash.com/photo-1563612116625-3012372fccce?w=500',
    is_available: true,
    is_popular: false,
    calories: 290,
    protein: 14,
    fats: 15,
    carbs: 26,
    ingredients: ['угорь', 'авокадо', 'соус унаги', 'рис', 'нори'],
    allergens: ['рыба']
  },
  {
    category: 'Суши',
    name: 'Сяке маки',
    description: 'Простой и изысканный ролл с лососем',
    price: 650,
    weight: '180г',
    image_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500',
    is_available: true,
    is_popular: false,
    calories: 180,
    protein: 9,
    fats: 7,
    carbs: 20,
    ingredients: ['лосось', 'рис', 'нори'],
    allergens: ['рыба']
  },

  // Бургеры
  {
    category: 'Бургеры',
    name: 'Классический бургер',
    description: 'Сочная говяжья котлета, салат, помидор, огурец и фирменный соус',
    price: 750,
    weight: '320г',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
    is_available: true,
    is_popular: true,
    calories: 540,
    protein: 28,
    fats: 28,
    carbs: 42,
    ingredients: ['говяжья котлета', 'булочка', 'салат', 'помидор', 'огурец', 'соус'],
    allergens: ['глютен', 'яйца']
  },
  {
    category: 'Бургеры',
    name: 'Чизбургер',
    description: 'Двойная котлета с сыром чеддер, луком и специальным соусом',
    price: 890,
    weight: '380г',
    image_url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500',
    is_available: true,
    is_popular: true,
    calories: 680,
    protein: 35,
    fats: 38,
    carbs: 45,
    ingredients: ['говяжья котлета', 'сыр чеддер', 'булочка', 'лук', 'соус'],
    allergens: ['глютен', 'молоко', 'яйца']
  },

  // Напитки
  {
    category: 'Напитки',
    name: 'Кола',
    description: 'Coca-Cola 0.33л',
    price: 150,
    weight: '330мл',
    image_url: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500',
    is_available: true,
    is_popular: true,
    calories: 139,
    protein: 0,
    fats: 0,
    carbs: 35,
    ingredients: ['вода', 'сахар', 'углекислый газ'],
    allergens: []
  },
  {
    category: 'Напитки',
    name: 'Апельсиновый сок',
    description: 'Свежевыжатый апельсиновый сок 0.3л',
    price: 250,
    weight: '300мл',
    image_url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500',
    is_available: true,
    is_popular: false,
    calories: 135,
    protein: 2,
    fats: 0,
    carbs: 30,
    ingredients: ['апельсины'],
    allergens: []
  },
  {
    category: 'Напитки',
    name: 'Вода минеральная',
    description: 'Минеральная вода 0.5л',
    price: 100,
    weight: '500мл',
    image_url: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500',
    is_available: true,
    is_popular: false,
    calories: 0,
    protein: 0,
    fats: 0,
    carbs: 0,
    ingredients: ['минеральная вода'],
    allergens: []
  }
];

const ADS_DATA = [
  {
    title: 'Скидка 20% на первый заказ!',
    description: 'Специальное предложение для новых клиентов',
    image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    is_active: true,
    sort_order: 1
  },
  {
    title: 'Бесплатная доставка от 2000 DIN',
    description: 'Закажите на сумму от 2000 динаров и получите бесплатную доставку',
    image_url: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800',
    is_active: true,
    sort_order: 2
  },
  {
    title: 'Пицца + Напиток = 999 DIN',
    description: 'Комбо предложение на любую пиццу',
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
    is_active: true,
    sort_order: 3
  },
  {
    title: 'Новое меню: Японская кухня',
    description: 'Попробуйте наши новые суши и роллы',
    image_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
    is_active: true,
    sort_order: 4
  }
];

// ============================================
// Функция заполнения базы данных
// ============================================

async function populateSupabase() {
  console.log('🚀 Начинаем заполнение Supabase...\n');

  try {
    // 1. Заполняем пользователей
    console.log('👥 Заполняем таблицу users...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .upsert(USERS_DATA, { onConflict: 'telegram_id' })
      .select();

    if (usersError) {
      console.error('❌ Ошибка при заполнении users:', usersError.message);
    } else {
      console.log(`✅ Добавлено ${users?.length || 0} пользователей`);
    }

    // 2. Заполняем меню
    console.log('\n🍕 Заполняем таблицу menu...');
    const { data: menu, error: menuError } = await supabase
      .from('menu')
      .insert(MENU_DATA)
      .select();

    if (menuError) {
      console.error('❌ Ошибка при заполнении menu:', menuError.message);
    } else {
      console.log(`✅ Добавлено ${menu?.length || 0} блюд`);

      // Показываем примеры добавленных блюд
      console.log('\n📋 Примеры добавленных блюд:');
      menu?.slice(0, 3).forEach(item => {
        console.log(`   - ${item.name} (${item.category}) - ${item.price} DIN - ${item.weight}`);
      });
    }

    // 3. Заполняем рекламные баннеры
    console.log('\n📢 Заполняем таблицу ads...');
    const { data: ads, error: adsError } = await supabase
      .from('ads')
      .insert(ADS_DATA)
      .select();

    if (adsError) {
      console.error('❌ Ошибка при заполнении ads:', adsError.message);
    } else {
      console.log(`✅ Добавлено ${ads?.length || 0} баннеров`);
    }

    // 4. Создаём тестовый заказ
    console.log('\n📦 Создаём тестовый заказ...');

    if (users && users.length > 0 && menu && menu.length > 0) {
      const testOrder = {
        order_number: `HF${Date.now()}`,
        user_id: users[0].id,
        telegram_id: users[0].telegram_id,
        customer_name: users[0].first_name + ' ' + users[0].last_name,
        customer_phone: users[0].phone_number,
        delivery_address: {
          street: 'Улица Кнеза Милоша',
          building: '25',
          apartment: '12',
          entrance: '2',
          floor: '3'
        },
        items: [
          {
            id: menu[0].id,
            name: menu[0].name,
            price: menu[0].price,
            quantity: 2,
            weight: menu[0].weight,
            image_url: menu[0].image_url
          },
          {
            id: menu[11].id,
            name: menu[11].name,
            price: menu[11].price,
            quantity: 1,
            weight: menu[11].weight,
            image_url: menu[11].image_url
          }
        ],
        subtotal: menu[0].price * 2 + menu[11].price,
        delivery_fee: 200,
        discount: 0,
        total: menu[0].price * 2 + menu[11].price + 200,
        bonus_points_earned: Math.floor((menu[0].price * 2 + menu[11].price + 200) * 0.05),
        loyalty_card_number: users[0].loyalty_card_number,
        status: 'confirmed',
        payment_method: 'cash',
        payment_status: 'pending',
        customer_comment: 'Позвоните за 10 минут до доставки'
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([testOrder])
        .select();

      if (orderError) {
        console.error('❌ Ошибка при создании заказа:', orderError.message);
      } else {
        console.log(`✅ Создан тестовый заказ ${order?.[0]?.order_number}`);
      }
    }

    console.log('\n🎉 Готово! База данных успешно заполнена!');
    console.log('\n📊 Следующие шаги:');
    console.log('1. Откройте Supabase Table Editor: https://supabase.com/dashboard/project/ydhyiqnzlzvswqucmboq/editor');
    console.log('2. Посмотрите таблицу menu - там все ваши блюда с фото и весом');
    console.log('3. Попробуйте добавить новое блюдо через интерфейс');
    console.log('4. Запустите backend с DATA_PROVIDER=supabase\n');

  } catch (error) {
    console.error('❌ Критическая ошибка:', error);
  }
}

// Запускаем
populateSupabase();
