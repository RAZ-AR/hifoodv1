/**
 * Утилита для импорта зон доставки из KML файла (Google My Maps)
 *
 * Использование:
 * 1. Создайте карту в Google My Maps
 * 2. Нарисуйте зоны доставки
 * 3. Экспортируйте в KML
 * 4. Запустите: npm run import-zones -- path/to/file.kml
 */

import fs from 'fs';
import path from 'path';
import { DOMParser } from 'xmldom';
import toGeoJSON from '@tmcw/togeojson';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface ZoneConfig {
  name: string;
  description?: string;
  delivery_fee: number;
  free_delivery_threshold?: number;
  min_order_amount?: number;
  estimated_delivery_time?: number;
  priority?: number;
  color?: string;
}

// Конфигурация зон (параметры доставки)
// Название зоны должно совпадать с названием в Google My Maps
const ZONE_CONFIGS: Record<string, ZoneConfig> = {
  'Центр города': {
    name: 'Центр города',
    description: 'Центральная часть Белграда',
    delivery_fee: 200,
    free_delivery_threshold: 2000,
    min_order_amount: 800,
    estimated_delivery_time: 25,
    priority: 3,
    color: '#4CAF50',
  },
  'Нови Београд': {
    name: 'Нови Београд',
    description: 'Район Нови Београд',
    delivery_fee: 300,
    free_delivery_threshold: 2500,
    min_order_amount: 1000,
    estimated_delivery_time: 35,
    priority: 2,
    color: '#2196F3',
  },
  'Земун': {
    name: 'Земун',
    description: 'Район Земун',
    delivery_fee: 350,
    free_delivery_threshold: 3000,
    min_order_amount: 1200,
    estimated_delivery_time: 45,
    priority: 1,
    color: '#FF9800',
  },
};

async function importZonesFromKML(kmlFilePath: string) {
  console.log('🗺️  Импорт зон доставки из KML файла...\n');

  // Проверяем наличие файла
  if (!fs.existsSync(kmlFilePath)) {
    throw new Error(`Файл не найден: ${kmlFilePath}`);
  }

  // Читаем KML файл
  console.log(`📄 Чтение файла: ${kmlFilePath}`);
  const kmlContent = fs.readFileSync(kmlFilePath, 'utf-8');

  // Парсим KML в GeoJSON
  console.log('🔄 Конвертация KML → GeoJSON...');
  const dom = new DOMParser().parseFromString(kmlContent);
  const geoJSON = toGeoJSON.kml(dom);

  if (!geoJSON.features || geoJSON.features.length === 0) {
    throw new Error('В файле не найдено ни одного полигона');
  }

  console.log(`✅ Найдено объектов: ${geoJSON.features.length}\n`);

  // Подключаемся к Supabase
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error('Не установлены SUPABASE_URL или SUPABASE_KEY в .env');
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

  // Обрабатываем каждый полигон
  let imported = 0;
  let skipped = 0;

  for (const feature of geoJSON.features) {
    const zoneName = feature.properties?.name || 'Неизвестная зона';

    // Проверяем, что это полигон
    if (feature.geometry.type !== 'Polygon' && feature.geometry.type !== 'MultiPolygon') {
      console.log(`⚠️  Пропускаем "${zoneName}" - не полигон (тип: ${feature.geometry.type})`);
      skipped++;
      continue;
    }

    // Получаем конфигурацию зоны
    const config = ZONE_CONFIGS[zoneName];
    if (!config) {
      console.log(`⚠️  Пропускаем "${zoneName}" - нет конфигурации в ZONE_CONFIGS`);
      skipped++;
      continue;
    }

    console.log(`📍 Импорт зоны: ${zoneName}`);

    // Конвертируем GeoJSON в PostGIS формат
    let coordinates;
    if (feature.geometry.type === 'Polygon') {
      coordinates = feature.geometry.coordinates[0]; // Внешнее кольцо
    } else {
      // MultiPolygon - берем первый полигон
      coordinates = feature.geometry.coordinates[0][0];
    }

    // Формируем WKT (Well-Known Text) для PostGIS
    const wktCoordinates = coordinates
      .map((coord: number[]) => `${coord[0]} ${coord[1]}`)
      .join(', ');
    const wkt = `POLYGON((${wktCoordinates}))`;

    try {
      // Проверяем, существует ли зона
      const { data: existing } = await supabase
        .from('delivery_zones')
        .select('id')
        .eq('name', zoneName)
        .single();

      if (existing) {
        // Обновляем существующую зону
        const { error } = await supabase
          .from('delivery_zones')
          .update({
            boundary: supabase.rpc('st_geogfromtext', { geog: wkt }),
            description: config.description,
            delivery_fee: config.delivery_fee,
            free_delivery_threshold: config.free_delivery_threshold,
            min_order_amount: config.min_order_amount,
            estimated_delivery_time: config.estimated_delivery_time,
            priority: config.priority,
            color: config.color,
            is_active: true,
          })
          .eq('id', existing.id);

        if (error) {
          console.error(`   ❌ Ошибка обновления: ${error.message}`);
          skipped++;
          continue;
        }

        console.log(`   ✅ Обновлено`);
      } else {
        // Создаем новую зону
        const { error } = await supabase
          .from('delivery_zones')
          .insert({
            name: zoneName,
            description: config.description,
            boundary: supabase.rpc('st_geogfromtext', { geog: wkt }),
            delivery_fee: config.delivery_fee,
            free_delivery_threshold: config.free_delivery_threshold,
            min_order_amount: config.min_order_amount,
            estimated_delivery_time: config.estimated_delivery_time,
            priority: config.priority || 1,
            color: config.color || '#4CAF50',
            is_active: true,
          });

        if (error) {
          console.error(`   ❌ Ошибка создания: ${error.message}`);
          skipped++;
          continue;
        }

        console.log(`   ✅ Создано`);
      }

      imported++;
    } catch (error: any) {
      console.error(`   ❌ Ошибка: ${error.message}`);
      skipped++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Импорт завершен!`);
  console.log(`   Успешно импортировано: ${imported}`);
  console.log(`   Пропущено: ${skipped}`);
  console.log('='.repeat(50));
}

// Запуск
const kmlFile = process.argv[2];

if (!kmlFile) {
  console.error('❌ Укажите путь к KML файлу');
  console.log('\nИспользование:');
  console.log('  npm run import-zones -- path/to/zones.kml');
  console.log('\nПример:');
  console.log('  npm run import-zones -- ./zones/belgrade-delivery.kml');
  process.exit(1);
}

importZonesFromKML(kmlFile)
  .then(() => {
    console.log('\n✨ Готово!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Ошибка:', error.message);
    process.exit(1);
  });
