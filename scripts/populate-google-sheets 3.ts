/**
 * АВТОМАТИЧЕСКОЕ ЗАПОЛНЕНИЕ GOOGLE SHEETS
 *
 * Этот скрипт автоматически заполняет Google таблицу тестовыми данными
 */

import { google } from 'googleapis';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Загружаем .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || '18MgwzpNpnNt9H0LeIjxnXZYbEmkefrHLwHIHnMCgeho';

// Тестовые данные
const SHEETS_DATA = {
  // 1. ПОЛЬЗОВАТЕЛИ
  user: [
    ['user_id', 'telegram_id', 'telegram_username', 'first_name', 'last_name', 'phone', 'email', 'loyalty_card_number', 'loyalty_card_issued_date', 'bonus_balance', 'total_bonus_earned', 'total_orders', 'total_spent', 'addresses', 'payment_methods', 'preferred_language', 'favorite_dishes', 'registered_at', 'last_order_date', 'notifications_enabled'],
    ['U001', '123456789', 'john_doe', 'John', 'Doe', '+381611234567', 'john@example.com', 'CARD-1001', '2024-01-15T10:00:00Z', '500', '1200', '15', '45000', JSON.stringify([{id:"A1",label:"Home",street:"Kneza Miloša",building:"10",apartment:"5",entrance:"1",comment:"",is_default:true}]), JSON.stringify([{id:"P1",type:"cash",is_default:true}]), 'ru', JSON.stringify(["1","3","5"]), '2024-01-15T10:00:00Z', '2024-10-20T15:30:00Z', 'true'],
    ['U002', '987654321', 'maria_smith', 'Maria', 'Smith', '+381629876543', 'maria@example.com', 'CARD-1002', '2024-02-20T12:00:00Z', '300', '800', '8', '28000', JSON.stringify([{id:"A2",label:"Work",street:"Bulevar Kralja Aleksandra",building:"25",apartment:"12",entrance:"2",comment:"Near park",is_default:true}]), JSON.stringify([{id:"P2",type:"card",is_default:true}]), 'en', JSON.stringify(["2","4"]), '2024-02-20T12:00:00Z', '2024-10-18T14:00:00Z', 'true'],
    ['U003', '555666777', 'alex_petrov', 'Aleksandar', 'Petrović', '+381631122334', 'alex@example.com', 'CARD-1003', '2024-03-10T09:00:00Z', '750', '2000', '22', '68000', JSON.stringify([{id:"A3",label:"Home",street:"Terazije",building:"5",apartment:"8",entrance:"",comment:"",is_default:true}]), JSON.stringify([{id:"P3",type:"cash",is_default:true}]), 'sr', JSON.stringify(["1","2","3"]), '2024-03-10T09:00:00Z', '2024-10-22T18:45:00Z', 'true'],
  ],

  // 2. МЕНЮ
  menu: [
    ['id', 'category', 'name', 'description', 'price', 'image_url', 'ingredients', 'rating', 'available', 'preparation_time', 'allergens'],
    ['1', 'Пицца', 'Маргарита', 'Классическая пицца с томатами моцареллой и базиликом', '850', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', 'Томатный соус,Моцарелла,Базилик,Оливковое масло', '4.8', 'true', '20', 'Глютен,Молочные продукты'],
    ['2', 'Пицца', 'Пепперони', 'Острая пицца с пепперони и сыром', '950', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', 'Томатный соус,Моцарелла,Пепперони', '4.9', 'true', '20', 'Глютен,Молочные продукты'],
    ['3', 'Пицца', '4 Сыра', 'Пицца с четырьмя видами сыра', '1100', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', 'Томатный соус,Моцарелла,Пармезан,Горгонзола,Чеддер', '4.7', 'true', '22', 'Глютен,Молочные продукты'],
    ['4', 'Бургеры', 'Чизбургер', 'Сочный бургер с говяжьей котлетой и сыром', '650', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', 'Булочка,Говяжья котлета,Чеддер,Салат,Томат,Соус', '4.7', 'true', '15', 'Глютен,Молочные продукты'],
    ['5', 'Бургеры', 'Двойной бургер', 'Бургер с двумя котлетами и двойным сыром', '890', 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400', 'Булочка,Две говяжьи котлеты,Двойной чеддер,Салат,Томат,Соус,Лук', '4.8', 'true', '18', 'Глютен,Молочные продукты'],
    ['6', 'Бургеры', 'Куриный бургер', 'Бургер с хрустящей куриной котлетой', '590', 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400', 'Булочка,Куриная котлета,Салат,Томат,Майонез', '4.6', 'true', '12', 'Глютен,Яйца'],
    ['7', 'Салаты', 'Цезарь', 'Классический салат Цезарь с курицей', '550', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400', 'Салат Романо,Курица,Пармезан,Соус Цезарь,Гренки', '4.6', 'true', '10', 'Глютен,Молочные продукты,Яйца'],
    ['8', 'Салаты', 'Греческий', 'Свежий греческий салат с фетой', '480', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400', 'Томаты,Огурцы,Перец,Оливки,Фета,Оливковое масло', '4.5', 'true', '8', 'Молочные продукты'],
    ['9', 'Напитки', 'Coca-Cola 0.5л', 'Классическая кола', '150', 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400', 'Вода,Сахар,Диоксид углерода', '4.5', 'true', '1', ''],
    ['10', 'Напитки', 'Fanta 0.5л', 'Апельсиновый напиток', '150', 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=400', 'Вода,Сахар,Апельсиновый сок,Диоксид углерода', '4.4', 'true', '1', ''],
    ['11', 'Напитки', 'Сок апельсиновый', 'Свежевыжатый апельсиновый сок', '250', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400', 'Апельсины', '4.7', 'true', '3', ''],
    ['12', 'Десерты', 'Чизкейк', 'Нежный чизкейк с ягодами', '420', 'https://images.unsplash.com/photo-1533134242478-165749e8bbf4?w=400', 'Сливочный сыр,Печенье,Ягоды', '4.9', 'true', '5', 'Глютен,Молочные продукты,Яйца'],
    ['13', 'Десерты', 'Тирамису', 'Классический итальянский десерт', '480', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', 'Маскарпоне,Савоярди,Кофе,Какао', '4.8', 'true', '5', 'Глютен,Молочные продукты,Яйца'],
    ['14', 'Закуски', 'Картофель фри', 'Хрустящий картофель фри', '200', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', 'Картофель,Масло,Соль', '4.3', 'true', '8', ''],
    ['15', 'Закуски', 'Куриные крылышки', 'Острые куриные крылышки 6 шт', '450', 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400', 'Куриные крылья,Специи,Соус', '4.6', 'true', '15', ''],
  ],

  // 3. ЗАКАЗЫ
  orders: [
    ['order_id', 'user_id', 'user_name', 'user_phone', 'loyalty_card_number', 'items', 'total_amount', 'subtotal', 'delivery_fee', 'delivery_address', 'delivery_time', 'payment_method', 'bonus_applied', 'status', 'created_at', 'updated_at', 'notes'],
    ['ORD-20241020-001', 'U001', 'John Doe', '+381611234567', 'CARD-1001', JSON.stringify([{dish_id:"1",name:"Маргарита",price:850,quantity:2,subtotal:1700}]), '1900', '1700', '200', JSON.stringify({id:"A1",label:"Home",street:"Kneza Miloša",building:"10",apartment:"5",entrance:"1",comment:"",is_default:true}), 'now', JSON.stringify({id:"P1",type:"cash",is_default:true}), '0', 'delivered', '2024-10-20T10:30:00Z', '2024-10-20T11:45:00Z', 'Без лука'],
    ['ORD-20241020-002', 'U002', 'Maria Smith', '+381629876543', 'CARD-1002', JSON.stringify([{dish_id:"3",name:"4 Сыра",price:1100,quantity:1,subtotal:1100},{dish_id:"9",name:"Coca-Cola 0.5л",price:150,quantity:2,subtotal:300}]), '1600', '1400', '200', JSON.stringify({id:"A2",label:"Work",street:"Bulevar Kralja Aleksandra",building:"25",apartment:"12",entrance:"2",comment:"Near park",is_default:true}), 'now', JSON.stringify({id:"P2",type:"card",is_default:true}), '0', 'delivering', '2024-10-20T12:00:00Z', '2024-10-20T12:30:00Z', ''],
    ['ORD-20241020-003', 'U003', 'Aleksandar Petrović', '+381631122334', 'CARD-1003', JSON.stringify([{dish_id:"4",name:"Чизбургер",price:650,quantity:2,subtotal:1300},{dish_id:"14",name:"Картофель фри",price:200,quantity:2,subtotal:400}]), '2100', '1900', '200', JSON.stringify({id:"A3",label:"Home",street:"Terazije",building:"5",apartment:"8",entrance:"",comment:"",is_default:true}), 'now', JSON.stringify({id:"P3",type:"cash",is_default:true}), '100', 'preparing', '2024-10-20T13:15:00Z', '2024-10-20T13:20:00Z', ''],
    ['ORD-20241019-001', 'U001', 'John Doe', '+381611234567', 'CARD-1001', JSON.stringify([{dish_id:"7",name:"Цезарь",price:550,quantity:1,subtotal:550},{dish_id:"12",name:"Чизкейк",price:420,quantity:1,subtotal:420}]), '1170', '970', '200', JSON.stringify({id:"A1",label:"Home",street:"Kneza Miloša",building:"10",apartment:"5",entrance:"1",comment:"",is_default:true}), 'now', JSON.stringify({id:"P1",type:"cash",is_default:true}), '0', 'delivered', '2024-10-19T18:00:00Z', '2024-10-19T19:10:00Z', ''],
    ['ORD-20241018-001', 'U002', 'Maria Smith', '+381629876543', 'CARD-1002', JSON.stringify([{dish_id:"2",name:"Пепперони",price:950,quantity:1,subtotal:950}]), '1150', '950', '200', JSON.stringify({id:"A2",label:"Work",street:"Bulevar Kralja Aleksandra",building:"25",apartment:"12",entrance:"2",comment:"Near park",is_default:true}), 'now', JSON.stringify({id:"P2",type:"card",is_default:true}), '0', 'delivered', '2024-10-18T14:30:00Z', '2024-10-18T15:45:00Z', 'Очень острую пожалуйста'],
  ],

  // 4. РЕКЛАМНЫЕ БАННЕРЫ
  ads: [
    ['ad_id', 'title', 'description', 'image_url', 'link', 'start_date', 'end_date', 'active', 'order', 'discount_percent'],
    ['AD001', 'Скидка 20% на пиццу', 'На все пиццы по средам!', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800', '', '2024-10-01T00:00:00Z', '2024-12-31T23:59:59Z', 'true', '1', '20'],
    ['AD002', 'Новинка! Куриный бургер', 'Попробуйте наш новый бургер с хрустящей курицей', 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800', '', '2024-10-15T00:00:00Z', '2024-11-15T23:59:59Z', 'true', '2', '0'],
    ['AD003', 'Комбо-предложение', 'Бургер + фри + напиток = скидка 15%', 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800', '', '2024-10-01T00:00:00Z', '2024-10-31T23:59:59Z', 'true', '3', '15'],
    ['AD004', 'Бесплатная доставка', 'При заказе от 2000 RSD доставка бесплатно', 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800', '', '2024-10-01T00:00:00Z', '2025-01-31T23:59:59Z', 'true', '4', '0'],
  ],

  // 5. БОНУСНЫЕ ТРАНЗАКЦИИ
  bonus_transactions: [
    ['transaction_id', 'user_id', 'amount', 'type', 'reason', 'related_order_id', 'created_at'],
    ['BT001', 'U001', '100', 'earn', 'Начисление за заказ', 'ORD-20241020-001', '2024-10-20T11:45:00Z'],
    ['BT002', 'U001', '50', 'earn', 'Бонус за первый заказ', '', '2024-01-15T10:30:00Z'],
    ['BT003', 'U002', '80', 'earn', 'Начисление за заказ', 'ORD-20241020-002', '2024-10-20T12:30:00Z'],
    ['BT004', 'U003', '100', 'spend', 'Списание при оплате', 'ORD-20241020-003', '2024-10-20T13:15:00Z'],
    ['BT005', 'U003', '120', 'earn', 'Начисление за заказ', 'ORD-20241020-003', '2024-10-20T13:20:00Z'],
    ['BT006', 'U001', '70', 'earn', 'Начисление за заказ', 'ORD-20241019-001', '2024-10-19T19:10:00Z'],
    ['BT007', 'U002', '60', 'earn', 'Начисление за заказ', 'ORD-20241018-001', '2024-10-18T15:45:00Z'],
  ],
};

async function populateGoogleSheets() {
  console.log('🚀 Начало заполнения Google Sheets...\n');

  // Проверяем credentials
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!serviceAccountEmail || !privateKey) {
    console.error('❌ Ошибка: GOOGLE_SERVICE_ACCOUNT_EMAIL или GOOGLE_PRIVATE_KEY не найдены в .env');
    console.error('\n💡 Убедитесь что в .env файле есть:');
    console.error('   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com');
    console.error('   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"');
    process.exit(1);
  }

  // Инициализация Google Sheets API
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: serviceAccountEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    // Проверяем доступ к таблице
    console.log('🔍 Проверка доступа к таблице...');
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    console.log(`✅ Доступ к таблице "${spreadsheet.data.properties?.title}" получен\n`);

    // Заполняем каждый лист
    for (const [sheetName, data] of Object.entries(SHEETS_DATA)) {
      console.log(`📝 Заполнение листа "${sheetName}"...`);

      try {
        // Очищаем лист
        await sheets.spreadsheets.values.clear({
          spreadsheetId: SPREADSHEET_ID,
          range: `${sheetName}!A1:Z1000`,
        });

        // Записываем данные
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${sheetName}!A1`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: data,
          },
        });

        console.log(`✅ Лист "${sheetName}" заполнен (${data.length - 1} записей)\n`);
      } catch (error: any) {
        if (error.message?.includes('Unable to parse range')) {
          console.log(`⚠️  Лист "${sheetName}" не существует. Создаю...`);

          // Создаем лист
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            requestBody: {
              requests: [{
                addSheet: {
                  properties: {
                    title: sheetName,
                  },
                },
              }],
            },
          });

          // Записываем данные
          await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `${sheetName}!A1`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: data,
            },
          });

          console.log(`✅ Лист "${sheetName}" создан и заполнен (${data.length - 1} записей)\n`);
        } else {
          throw error;
        }
      }
    }

    console.log('🎉 Все листы успешно заполнены!\n');
    console.log(`📊 Откройте таблицу: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit\n`);
    console.log('✅ Готово! Теперь можете использовать DATA_PROVIDER=google_sheets');

  } catch (error: any) {
    console.error('❌ Ошибка при заполнении таблицы:', error.message);

    if (error.message?.includes('403')) {
      console.error('\n💡 Возможная проблема: Service Account не имеет доступа к таблице');
      console.error(`   1. Откройте таблицу: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`);
      console.error(`   2. Нажмите "Настройки доступа" (Share)`);
      console.error(`   3. Добавьте email: ${serviceAccountEmail}`);
      console.error(`   4. Дайте права "Редактор"`);
    }

    process.exit(1);
  }
}

// Запуск
populateGoogleSheets();
