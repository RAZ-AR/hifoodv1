import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Загружаем переменные окружения
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================
// Функция парсинга CSV
// ============================================

function parseCSV(csvContent: string): any[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length === 0) return [];

  const headers = lines[0]!.split(',');

  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj: any = {};

    headers.forEach((header, index) => {
      const value = values[index];
      obj[header.trim()] = value ? value.trim() : '';
    });

    return obj;
  });
}

// ============================================
// Функция заполнения базы данных
// ============================================

async function populateMenuFromCSV() {
  console.log('🚀 Начинаем загрузку меню из CSV...\n');

  try {
    // Читаем CSV файл
    const csvPath = path.join(__dirname, '../google-sheets-data/2_menu_sheet.csv');
    console.log(`📂 Читаем файл: ${csvPath}`);

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const rawData = parseCSV(csvContent);

    console.log(`📊 Найдено ${rawData.length} позиций в CSV\n`);

    // Преобразуем данные в формат Supabase
    // Используем только те поля, которые точно существуют в таблице menu
    const menuData = rawData.map(item => ({
      category: item.category,
      name: item.name,
      description: item.description,
      price: parseFloat(item.price),
      image_url: item.image_url,
      ingredients: item.ingredients ? item.ingredients.split(',').map((i: string) => i.trim()) : [],
      available: item.available === 'true',  // используем available, не is_available
      rating: parseFloat(item.rating) || 4.5,  // добавляем rating
      preparation_time: parseInt(item.preparation_time) || 20,  // добавляем preparation_time
      allergens: item.allergens ? item.allergens.split(',').map((a: string) => a.trim()).filter((a: string) => a) : [],
    }));

    console.log('🍕 Заполняем таблицу menu...');
    console.log('📝 Первые 3 позиции для проверки:');
    menuData.slice(0, 3).forEach(item => {
      console.log(`   - ${item.name} (${item.category}) - ${item.price} RSD`);
    });
    console.log('');

    // Очищаем таблицу перед загрузкой (опционально)
    console.log('🗑️  Очищаем текущие данные меню...');
    const { error: deleteError } = await supabase
      .from('menu')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // удаляем все записи

    if (deleteError) {
      console.warn('⚠️  Предупреждение при очистке:', deleteError.message);
    } else {
      console.log('✅ Старые данные удалены\n');
    }

    // Загружаем новые данные
    const { data: menu, error: menuError } = await supabase
      .from('menu')
      .insert(menuData)
      .select();

    if (menuError) {
      console.error('❌ Ошибка при заполнении menu:', menuError.message);
      console.error('Детали ошибки:', menuError);
      process.exit(1);
    } else {
      console.log(`✅ Добавлено ${menu?.length || 0} блюд в меню!\n`);

      // Показываем добавленные блюда
      console.log('📋 Все добавленные блюда:');
      menu?.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} (${item.category}) - ${item.price} RSD`);
      });
    }

    console.log('\n🎉 Готово! Меню успешно загружено в Supabase!');
    console.log('\n📊 Следующие шаги:');
    console.log('1. Откройте Supabase Table Editor: https://supabase.com/dashboard/project/ydhyiqnzlzvswqucmboq/editor');
    console.log('2. Посмотрите таблицу menu - там все ваши блюда');
    console.log('3. Откройте Mini App и проверьте, что меню отображается\n');

  } catch (error: any) {
    console.error('❌ Критическая ошибка:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Запускаем
populateMenuFromCSV();
