import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Загружаем .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || '18MgwzpNpnNt9H0LeIjxnXZYbEmkefrHLwHIHnMCgeho';

// Supabase
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateMenuFromGoogleSheets() {
  console.log('🚀 Начинаем миграцию меню из Google Sheets в Supabase...\n');

  // Проверяем credentials
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!serviceAccountEmail || !privateKey) {
    console.error('❌ Ошибка: GOOGLE_SERVICE_ACCOUNT_EMAIL или GOOGLE_PRIVATE_KEY не найдены в .env');
    process.exit(1);
  }

  // Инициализация Google Sheets API
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: serviceAccountEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    // Читаем данные из листа "menu"
    console.log('📖 Читаем данные из Google Sheets (лист "menu")...');
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'menu!A1:N1000', // Читаем колонки A-N (category, sub_category, sub_category_en, sub_category_sr, title, title_en, title_sr, description, description_en, description_sr, price, image, weight, calories)
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.error('❌ Нет данных в листе "menu"');
      process.exit(1);
    }

    // Первая строка - заголовки
    const headers = rows[0];
    if (!headers || headers.length === 0) {
      console.error('❌ Не найдены заголовки в листе "menu"');
      process.exit(1);
    }
    console.log('📋 Заголовки:', headers.join(', '));

    // Преобразуем строки в объекты
    const menuItems = rows.slice(1).map(row => {
      const item: any = {};
      headers.forEach((header, index) => {
        item[header] = row[index] || '';
      });
      return item;
    });

    console.log(`✅ Прочитано ${menuItems.length} позиций из Google Sheets\n`);

    // Преобразуем в формат Supabase
    // Структура Google Sheets: category, sub_category, sub_category_en, sub_category_sr, title, title_en, title_sr, description, description_en, description_sr, price, image, weight, calories
    const menuData = menuItems
      .filter(item => {
        // Фильтруем пустые строки - должно быть хотя бы одно название
        const hasTitle = item['title'] || item['title_en'] || item['title_sr'];
        return hasTitle;
      })
      .map(item => {
        // Основная категория
        const category = (item['category'] || 'Без категории').trim();

        // Подкатегории (многоязычные)
        const subCategory = (item['sub_category'] || '').trim();
        const subCategoryEn = (item['sub_category_en'] || '').trim();
        const subCategorySr = (item['sub_category_sr'] || '').trim();

        // Названия (многоязычные)
        const title = (item['title'] || '').trim();
        const titleEn = (item['title_en'] || '').trim();
        const titleSr = (item['title_sr'] || '').trim();

        // Описания (многоязычные)
        const description = (item['description'] || '').trim();
        const descriptionEn = (item['description_en'] || '').trim();
        const descriptionSr = (item['description_sr'] || '').trim();

        // Используем title как name для обратной совместимости
        const name = title || titleEn || titleSr || 'Без названия';

        // Цена
        const price = parseFloat(item['price']) || 0;

        // Изображение (используем placeholder если нет)
        const imageUrl = item['image']?.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500';

        // Вес
        const weight = (item['weight'] || '').trim();

        // Калории
        const calories = parseInt(item['calories']) || null;

        return {
          category,
          sub_category: subCategory || null,
          sub_category_en: subCategoryEn || null,
          sub_category_sr: subCategorySr || null,
          name,  // Для обратной совместимости
          title: title || null,
          title_en: titleEn || null,
          title_sr: titleSr || null,
          description: description || '',
          description_en: descriptionEn || null,
          description_sr: descriptionSr || null,
          price,
          image_url: imageUrl,
          weight: weight || null,
          calories,
          ingredients: [],  // Пока пустой массив, можно добавить отдельную колонку
          available: true,
          rating: 4.5,
          preparation_time: 20,
          allergens: [],
        };
      })
      .filter(item => item.name);  // Убираем записи без названия

    console.log('🍕 Первые 3 позиции для проверки:');
    menuData.slice(0, 3).forEach(item => {
      console.log(`   - ${item.name} (${item.category}) - ${item.price} RSD`);
    });
    console.log('');

    // Очищаем таблицу menu в Supabase
    console.log('🗑️  Очищаем текущие данные меню в Supabase...');
    const { error: deleteError } = await supabase
      .from('menu')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
      console.warn('⚠️  Предупреждение при очистке:', deleteError.message);
    } else {
      console.log('✅ Старые данные удалены\n');
    }

    // Загружаем новые данные в Supabase
    console.log('📤 Загружаем меню в Supabase...');
    const { data: insertedMenu, error: menuError } = await supabase
      .from('menu')
      .insert(menuData)
      .select();

    if (menuError) {
      console.error('❌ Ошибка при загрузке menu:', menuError.message);
      console.error('Детали ошибки:', menuError);
      process.exit(1);
    }

    console.log(`✅ Успешно загружено ${insertedMenu?.length || 0} блюд в Supabase!\n`);

    // Показываем добавленные блюда
    console.log('📋 Все добавленные блюда:');
    insertedMenu?.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} (${item.category}) - ${item.price} RSD - рейтинг: ${item.rating}`);
    });

    console.log('\n🎉 Миграция завершена успешно!');
    console.log('\n📊 Следующие шаги:');
    console.log('1. Откройте Supabase Table Editor: https://supabase.com/dashboard/project/ydhyiqnzlzvswqucmboq/editor');
    console.log('2. Проверьте таблицу menu - там все ваши блюда');
    console.log('3. Откройте Mini App и проверьте, что меню отображается\n');

  } catch (error: any) {
    console.error('❌ Критическая ошибка:', error.message);
    if (error.message?.includes('403')) {
      console.error('\n💡 Возможная проблема: Service Account не имеет доступа к таблице');
      console.error(`   1. Откройте таблицу: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`);
      console.error(`   2. Нажмите "Настройки доступа" (Share)`);
      console.error(`   3. Добавьте email: ${serviceAccountEmail}`);
      console.error(`   4. Дайте права "Читатель"`);
    }
    process.exit(1);
  }
}

// Запускаем
migrateMenuFromGoogleSheets();
