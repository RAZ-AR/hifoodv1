/**
 * Тестовый скрипт для проверки Google Maps API ключа
 *
 * Проверяет:
 * - Автокомплит адресов (Places API)
 * - Геокодирование (Geocoding API)
 */

import dotenv from 'dotenv';
import path from 'path';
import { Client } from '@googlemaps/google-maps-services-js';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function testGoogleMapsAPI() {
  console.log('🧪 Тестирование Google Maps API...\n');

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
    console.error('❌ GOOGLE_MAPS_API_KEY не установлен в .env файле');
    process.exit(1);
  }

  console.log('✅ API ключ найден');
  console.log(`   Ключ: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}\n`);

  const client = new Client({});

  // Тест 1: Places API Autocomplete
  console.log('📍 Тест 1: Places API (Автокомплит)');
  console.log('   Запрос: "Knez Mihailova, Belgrade"');
  try {
    const autocompleteResponse = await client.placeAutocomplete({
      params: {
        input: 'Knez Mihailova, Belgrade',
        key: apiKey,
        language: 'sr',
        components: ['country:rs'],
      },
    });

    if (autocompleteResponse.data.status === 'OK') {
      console.log('   ✅ Places API работает!');
      console.log(`   Найдено предложений: ${autocompleteResponse.data.predictions.length}`);

      if (autocompleteResponse.data.predictions.length > 0) {
        console.log('   Первое предложение:');
        const first = autocompleteResponse.data.predictions[0];
        if (first) {
          console.log(`      "${first.description}"`);
        }
      }
    } else {
      console.error(`   ❌ Ошибка: ${autocompleteResponse.data.status}`);
      if (autocompleteResponse.data.error_message) {
        console.error(`      ${autocompleteResponse.data.error_message}`);
      }
    }
  } catch (error: any) {
    console.error('   ❌ Ошибка:', error.message);
    if (error.response?.data) {
      console.error('      Детали:', JSON.stringify(error.response.data, null, 2));
    }
  }

  console.log();

  // Тест 2: Geocoding API
  console.log('📍 Тест 2: Geocoding API (Геокодирование)');
  console.log('   Запрос: "Trg Republike, Belgrade, Serbia"');
  try {
    const geocodeResponse = await client.geocode({
      params: {
        address: 'Trg Republike, Belgrade, Serbia',
        key: apiKey,
        language: 'sr',
      },
    });

    if (geocodeResponse.data.status === 'OK' && geocodeResponse.data.results.length > 0) {
      console.log('   ✅ Geocoding API работает!');
      const result = geocodeResponse.data.results[0];
      if (result) {
        console.log(`   Адрес: ${result.formatted_address}`);
        console.log(`   Координаты: ${result.geometry.location.lat}, ${result.geometry.location.lng}`);
      }
    } else {
      console.error(`   ❌ Ошибка: ${geocodeResponse.data.status}`);
      if (geocodeResponse.data.error_message) {
        console.error(`      ${geocodeResponse.data.error_message}`);
      }
    }
  } catch (error: any) {
    console.error('   ❌ Ошибка:', error.message);
    if (error.response?.data) {
      console.error('      Детали:', JSON.stringify(error.response.data, null, 2));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✨ Тестирование завершено!');
  console.log('='.repeat(60));
  console.log('\nЕсли оба теста прошли успешно (✅), можно запускать импорт зон!');
  console.log('Если есть ошибки (❌), проверьте:');
  console.log('  1. Включены ли Places API и Geocoding API в Google Cloud Console');
  console.log('  2. Нет ли ограничений на API ключ (IP, referrer, API restrictions)');
  console.log('  3. Не превышена ли квота (проверьте в Google Cloud Console → APIs)');
}

testGoogleMapsAPI()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Критическая ошибка:', error);
    process.exit(1);
  });
