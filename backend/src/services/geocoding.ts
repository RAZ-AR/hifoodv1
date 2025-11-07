// ============================================
// Сервис геокодирования и работы с зонами доставки
// ============================================

import { Client, PlaceAutocompleteResult } from '@googlemaps/google-maps-services-js';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';
import type {
  AddressAutocompleteResult,
  ZoneCheckResult,
  DeliveryZone
} from '../types';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Сервис для работы с геокодированием и зонами доставки
 */
export class GeocodingService {
  private googleMapsClient: Client;
  private apiKey: string;
  private supabase: SupabaseClient;

  constructor(apiKey: string, supabase: SupabaseClient) {
    this.apiKey = apiKey;
    this.googleMapsClient = new Client({});
    this.supabase = supabase;
  }

  /**
   * Автокомплит адресов через Google Places API
   * @param input Введенный пользователем текст
   * @param sessionToken Токен сессии для оптимизации биллинга
   * @returns Список предложений адресов
   */
  async autocompleteAddress(
    input: string,
    sessionToken?: string
  ): Promise<AddressAutocompleteResult[]> {
    try {
      const response = await this.googleMapsClient.placeAutocomplete({
        params: {
          input,
          key: this.apiKey,
          language: 'sr', // Сербский язык
          components: ['country:rs'], // Только Сербия
          sessiontoken: sessionToken,
        },
      });

      if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
        console.error('Google Places API error:', response.data.status);
        return [];
      }

      return response.data.predictions.map((prediction: PlaceAutocompleteResult) => ({
        place_id: prediction.place_id,
        formatted_address: prediction.description,
        description: prediction.description,
        main_text: prediction.structured_formatting.main_text,
        secondary_text: prediction.structured_formatting.secondary_text || '',
      }));
    } catch (error) {
      console.error('Autocomplete error:', error);
      throw new Error('Не удалось получить предложения адресов');
    }
  }

  /**
   * Получить координаты по Place ID
   * @param placeId Google Place ID
   * @returns Координаты и форматированный адрес
   */
  async getPlaceDetails(placeId: string): Promise<{
    latitude: number;
    longitude: number;
    formatted_address: string;
    address_components: any[];
  }> {
    try {
      const response = await this.googleMapsClient.placeDetails({
        params: {
          place_id: placeId,
          key: this.apiKey,
          language: 'sr',
          fields: ['geometry', 'formatted_address', 'address_components'],
        },
      });

      if (response.data.status !== 'OK') {
        console.error('Place details error:', response.data.status);
        throw new Error('Не удалось получить детали адреса');
      }

      const result = response.data.result;
      const location = result.geometry?.location;

      if (!location) {
        throw new Error('Координаты не найдены');
      }

      return {
        latitude: location.lat,
        longitude: location.lng,
        formatted_address: result.formatted_address || '',
        address_components: result.address_components || [],
      };
    } catch (error) {
      console.error('Place details error:', error);
      throw new Error('Не удалось получить детали адреса');
    }
  }

  /**
   * Геокодирование адреса (получение координат по строке адреса)
   * @param address Строка адреса
   * @returns Координаты
   */
  async geocodeAddress(address: string): Promise<{
    latitude: number;
    longitude: number;
    formatted_address: string;
  }> {
    try {
      const response = await this.googleMapsClient.geocode({
        params: {
          address,
          key: this.apiKey,
          language: 'sr',
          components: { country: 'RS' }, // Только Сербия
        },
      });

      if (response.data.status !== 'OK' || response.data.results.length === 0) {
        throw new Error('Адрес не найден');
      }

      const result = response.data.results[0];
      const location = result.geometry.location;

      return {
        latitude: location.lat,
        longitude: location.lng,
        formatted_address: result.formatted_address,
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error('Не удалось найти адрес');
    }
  }

  /**
   * Проверить, находится ли адрес в зоне доставки
   * @param latitude Широта
   * @param longitude Долгота
   * @returns Результат проверки зоны
   */
  async checkDeliveryZone(
    latitude: number,
    longitude: number
  ): Promise<ZoneCheckResult> {
    try {
      // Используем функцию PostgreSQL для проверки (более эффективно)
      const { data, error } = await this.supabase
        .rpc('check_address_in_delivery_zone', {
          lat: latitude,
          lon: longitude,
        });

      if (error) {
        console.error('Zone check error:', error);
        throw new Error('Ошибка проверки зоны доставки');
      }

      // Если зона найдена
      if (data && data.length > 0) {
        const zone = data[0];
        return {
          in_zone: true,
          delivery_fee: parseFloat(zone.delivery_fee),
          free_delivery_threshold: zone.free_delivery_threshold
            ? parseFloat(zone.free_delivery_threshold)
            : undefined,
          min_order_amount: zone.min_order_amount
            ? parseFloat(zone.min_order_amount)
            : undefined,
          estimated_delivery_time: zone.estimated_delivery_time,
          message: `Доставка в зону "${zone.zone_name}" - ${zone.delivery_fee} RSD`,
        };
      }

      // Адрес вне зон доставки
      return {
        in_zone: false,
        delivery_fee: 0,
        message: 'К сожалению, этот адрес находится вне зоны доставки',
      };
    } catch (error) {
      console.error('Zone check error:', error);
      throw new Error('Не удалось проверить зону доставки');
    }
  }

  /**
   * Альтернативный метод проверки зоны (через Turf.js)
   * Используется если PostgreSQL функция недоступна
   */
  async checkDeliveryZoneLocal(
    latitude: number,
    longitude: number
  ): Promise<ZoneCheckResult> {
    try {
      // Получаем все активные зоны
      const { data: zones, error } = await this.supabase
        .from('delivery_zones')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false });

      if (error) {
        console.error('Error fetching zones:', error);
        throw new Error('Ошибка получения зон доставки');
      }

      if (!zones || zones.length === 0) {
        return {
          in_zone: false,
          delivery_fee: 0,
          message: 'Зоны доставки не настроены',
        };
      }

      // Создаем точку для проверки
      const addressPoint = point([longitude, latitude]);

      // Проверяем каждую зону (по убыванию приоритета)
      for (const zone of zones) {
        try {
          // boundary хранится как Geography в PostGIS, нужно преобразовать
          const isInZone = booleanPointInPolygon(addressPoint, zone.boundary);

          if (isInZone) {
            return {
              in_zone: true,
              delivery_fee: parseFloat(zone.delivery_fee),
              free_delivery_threshold: zone.free_delivery_threshold
                ? parseFloat(zone.free_delivery_threshold)
                : undefined,
              min_order_amount: zone.min_order_amount
                ? parseFloat(zone.min_order_amount)
                : undefined,
              estimated_delivery_time: zone.estimated_delivery_time,
              message: `Доставка в зону "${zone.name}" - ${zone.delivery_fee} RSD`,
            };
          }
        } catch (zoneError) {
          console.error(`Error checking zone ${zone.id}:`, zoneError);
          continue;
        }
      }

      // Адрес вне всех зон
      return {
        in_zone: false,
        delivery_fee: 0,
        message: 'К сожалению, этот адрес находится вне зоны доставки',
      };
    } catch (error) {
      console.error('Zone check local error:', error);
      throw new Error('Не удалось проверить зону доставки');
    }
  }

  /**
   * Получить все активные зоны доставки
   * @returns Список зон
   */
  async getDeliveryZones(): Promise<DeliveryZone[]> {
    try {
      const { data, error } = await this.supabase
        .from('delivery_zones')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false });

      if (error) {
        console.error('Error fetching zones:', error);
        throw new Error('Ошибка получения зон доставки');
      }

      return data || [];
    } catch (error) {
      console.error('Get zones error:', error);
      throw new Error('Не удалось получить зоны доставки');
    }
  }
}
