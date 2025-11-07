/**
 * Утилита для импорта зон доставки из JSON файла с адресами
 *
 * Использование:
 * 1. Создайте JSON файл с адресами зон (см. config/delivery-zones.json)
 * 2. Запустите: npm run import-zones-json -- path/to/zones.json
 *
 * Скрипт:
 * - Геокодирует каждый адрес через Google Maps API
 * - Создает полигон вокруг точек (buffer zone)
 * - Сохраняет в базу данных
 */

import fs from 'fs';
import path from 'path';
import { Client } from '@googlemaps/google-maps-services-js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface ZoneDefinition {
  name: string;
  description?: string;
  delivery_fee: number;
  free_delivery_threshold?: number;
  min_order_amount?: number;
  estimated_delivery_time?: number;
  priority?: number;
  color?: string;
  addresses: string[];
  buffer_radius_km?: number; // Радиус буфера вокруг точек (в км)
}

interface ZonesConfig {
  zones: ZoneDefinition[];
  default_buffer_radius_km?: number; // Радиус по умолчанию
}

async function geocodeAddresses(addresses: string[], apiKey: string) {
  const client = new Client({});
  const coordinates: Array<{ lat: number; lng: number }> = [];

  console.log(`   📍 Геокодирование ${addresses.length} адресов...`);

  for (const address of addresses) {
    try {
      const response = await client.geocode({
        params: {
          address,
          key: apiKey,
          language: 'sr',
          components: { country: 'RS' },
        },
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        coordinates.push({ lat: location.lat, lng: location.lng });
        console.log(`      ✅ ${address.substring(0, 40)}...`);
      } else {
        console.warn(`      ⚠️  Не найден: ${address}`);
      }

      // Задержка для соблюдения rate limits
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error: any) {
      console.error(`      ❌ Ошибка: ${address} - ${error.message}`);
    }
  }

  return coordinates;
}

function createPolygonFromPoints(
  points: Array<{ lat: number; lng: number }>,
  bufferRadiusKm: number = 1.0
): string {
  if (points.length === 0) {
    throw new Error('Нет точек для создания полигона');
  }

  // Если только одна точка - создаем круг вокруг нее
  if (points.length === 1) {
    const point = points[0];
    return createCircle(point.lat, point.lng, bufferRadiusKm);
  }

  // Если 2 точки - создаем прямоугольник между ними с буфером
  if (points.length === 2) {
    const [p1, p2] = points;
    const minLat = Math.min(p1.lat, p2.lat) - (bufferRadiusKm / 111);
    const maxLat = Math.max(p1.lat, p2.lat) + (bufferRadiusKm / 111);
    const minLng = Math.min(p1.lng, p2.lng) - (bufferRadiusKm / 111);
    const maxLng = Math.max(p1.lng, p2.lng) + (bufferRadiusKm / 111);

    return `POLYGON((${minLng} ${minLat}, ${maxLng} ${minLat}, ${maxLng} ${maxLat}, ${minLng} ${maxLat}, ${minLng} ${minLat}))`;
  }

  // Для 3+ точек - создаем Convex Hull (выпуклую оболочку)
  // Находим центр
  const centerLat = points.reduce((sum, p) => sum + p.lat, 0) / points.length;
  const centerLng = points.reduce((sum, p) => sum + p.lng, 0) / points.length;

  // Сортируем точки по углу относительно центра
  const sortedPoints = points.sort((a, b) => {
    const angleA = Math.atan2(a.lat - centerLat, a.lng - centerLng);
    const angleB = Math.atan2(b.lat - centerLat, b.lng - centerLng);
    return angleA - angleB;
  });

  // Добавляем буфер к каждой точке (расширяем от центра)
  const bufferFactor = 1 + (bufferRadiusKm / 10); // Примерный коэффициент
  const bufferedPoints = sortedPoints.map((p) => {
    const dLat = (p.lat - centerLat) * bufferFactor;
    const dLng = (p.lng - centerLng) * bufferFactor;
    return {
      lat: centerLat + dLat,
      lng: centerLng + dLng,
    };
  });

  // Замыкаем полигон (первая точка = последняя)
  bufferedPoints.push(bufferedPoints[0]);

  // Формируем WKT
  const wktCoordinates = bufferedPoints
    .map((p) => `${p.lng} ${p.lat}`)
    .join(', ');

  return `POLYGON((${wktCoordinates}))`;
}

function createCircle(lat: number, lng: number, radiusKm: number): string {
  const points = 32; // Количество точек в круге
  const coordinates: string[] = [];

  for (let i = 0; i <= points; i++) {
    const angle = (i * 360) / points;
    const radian = (angle * Math.PI) / 180;

    // Примерное преобразование км в градусы (1° ≈ 111 км)
    const dLat = (radiusKm / 111) * Math.cos(radian);
    const dLng = (radiusKm / (111 * Math.cos((lat * Math.PI) / 180))) * Math.sin(radian);

    const pointLat = lat + dLat;
    const pointLng = lng + dLng;

    coordinates.push(`${pointLng} ${pointLat}`);
  }

  return `POLYGON((${coordinates.join(', ')}))`;
}

async function importZonesFromJSON(jsonFilePath: string) {
  console.log('📝 Импорт зон доставки из JSON файла...\n');

  // Проверяем Google Maps API ключ
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    throw new Error('Не установлен GOOGLE_MAPS_API_KEY в .env');
  }

  // Проверяем Supabase
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error('Не установлены SUPABASE_URL или SUPABASE_KEY в .env');
  }

  // Читаем JSON файл
  console.log(`📄 Чтение файла: ${jsonFilePath}`);
  const jsonContent = fs.readFileSync(jsonFilePath, 'utf-8');
  const config: ZonesConfig = JSON.parse(jsonContent);

  if (!config.zones || config.zones.length === 0) {
    throw new Error('В файле нет зон для импорта');
  }

  console.log(`✅ Найдено зон: ${config.zones.length}\n`);

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

  let imported = 0;
  let failed = 0;

  for (const zone of config.zones) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`📍 Обработка зоны: ${zone.name}`);
    console.log(`${'='.repeat(50)}`);

    try {
      // Геокодируем адреса
      const coordinates = await geocodeAddresses(
        zone.addresses,
        process.env.GOOGLE_MAPS_API_KEY!
      );

      if (coordinates.length === 0) {
        console.error(`   ❌ Не удалось геокодировать ни один адрес`);
        failed++;
        continue;
      }

      console.log(`   ✅ Геокодировано: ${coordinates.length}/${zone.addresses.length}`);

      // Создаем полигон
      const bufferRadius = zone.buffer_radius_km || config.default_buffer_radius_km || 1.5;
      console.log(`   🔄 Создание полигона (радиус буфера: ${bufferRadius} км)...`);
      const wkt = createPolygonFromPoints(coordinates, bufferRadius);

      // Проверяем, существует ли зона
      const { data: existing } = await supabase
        .from('delivery_zones')
        .select('id')
        .eq('name', zone.name)
        .single();

      if (existing) {
        // Обновляем
        const { error } = await supabase.rpc('update_delivery_zone', {
          zone_id: existing.id,
          zone_name: zone.name,
          zone_description: zone.description || null,
          zone_boundary: wkt,
          zone_delivery_fee: zone.delivery_fee,
          zone_free_threshold: zone.free_delivery_threshold || null,
          zone_min_order: zone.min_order_amount || null,
          zone_delivery_time: zone.estimated_delivery_time || null,
          zone_priority: zone.priority || 1,
          zone_color: zone.color || '#4CAF50',
        });

        if (error) {
          console.error(`   ❌ Ошибка обновления: ${error.message}`);
          failed++;
          continue;
        }

        console.log(`   ✅ Зона обновлена`);
      } else {
        // Создаем
        // Используем raw SQL для вставки с ST_GeogFromText
        const { error } = await supabase.rpc('create_delivery_zone', {
          zone_name: zone.name,
          zone_description: zone.description || null,
          zone_boundary: wkt,
          zone_delivery_fee: zone.delivery_fee,
          zone_free_threshold: zone.free_delivery_threshold || null,
          zone_min_order: zone.min_order_amount || null,
          zone_delivery_time: zone.estimated_delivery_time || null,
          zone_priority: zone.priority || 1,
          zone_color: zone.color || '#4CAF50',
        });

        if (error) {
          console.error(`   ❌ Ошибка создания: ${error.message}`);
          failed++;
          continue;
        }

        console.log(`   ✅ Зона создана`);
      }

      imported++;
    } catch (error: any) {
      console.error(`   ❌ Ошибка: ${error.message}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Импорт завершен!`);
  console.log(`   Успешно: ${imported}`);
  console.log(`   Ошибок: ${failed}`);
  console.log('='.repeat(50));
}

// Запуск
const jsonFile = process.argv[2] || path.join(__dirname, '../config/delivery-zones.json');

importZonesFromJSON(jsonFile)
  .then(() => {
    console.log('\n✨ Готово!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Ошибка:', error.message);
    process.exit(1);
  });
