import { IDataProvider } from './IDataProvider';
import { GoogleSheetsProvider } from './GoogleSheetsProvider';
import { SupabaseProvider } from './SupabaseProvider';

/**
 * ФАБРИКА ДЛЯ СОЗДАНИЯ DATA PROVIDER
 *
 * Позволяет легко переключаться между разными источниками данных
 * через переменные окружения
 *
 * Использование:
 * ```typescript
 * import { getDataProvider } from './services/dataProvider';
 *
 * const db = getDataProvider();
 * const users = await db.getMenu();
 * ```
 */

export type DataProviderType = 'google_sheets' | 'supabase';

/**
 * Конфигурация для Google Sheets
 */
interface GoogleSheetsConfig {
  type: 'google_sheets';
  spreadsheetId: string;
  credentials?: any;
}

/**
 * Конфигурация для Supabase
 */
interface SupabaseConfig {
  type: 'supabase';
  supabaseUrl: string;
  supabaseKey: string;
}

export type DataProviderConfig = GoogleSheetsConfig | SupabaseConfig;

/**
 * Создает провайдер данных на основе конфигурации
 */
export function createDataProvider(config: DataProviderConfig): IDataProvider {
  switch (config.type) {
    case 'google_sheets':
      return new GoogleSheetsProvider(config.spreadsheetId, config.credentials);

    case 'supabase':
      return new SupabaseProvider(config.supabaseUrl, config.supabaseKey);

    default:
      throw new Error(`Неизвестный тип провайдера: ${(config as any).type}`);
  }
}

/**
 * Создает провайдер данных из переменных окружения
 *
 * Переменные окружения:
 * - DATA_PROVIDER: 'google_sheets' | 'supabase'
 *
 * Для Google Sheets:
 * - GOOGLE_SPREADSHEET_ID: ID таблицы
 * - GOOGLE_APPLICATION_CREDENTIALS: путь к JSON файлу с credentials
 *
 * Для Supabase:
 * - SUPABASE_URL: URL проекта Supabase
 * - SUPABASE_KEY: Anon/Service key
 */
export function getDataProvider(): IDataProvider {
  const providerType = (process.env.DATA_PROVIDER || 'google_sheets') as DataProviderType;

  console.log(`📦 Инициализация Data Provider: ${providerType}`);

  switch (providerType) {
    case 'google_sheets': {
      const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

      if (!spreadsheetId) {
        throw new Error(
          'GOOGLE_SPREADSHEET_ID не указан в переменных окружения.\n' +
            'Укажите ID вашей Google Sheets таблицы.'
        );
      }

      console.log(`✅ Google Sheets Provider подключен (ID: ${spreadsheetId})`);

      return new GoogleSheetsProvider(spreadsheetId);
    }

    case 'supabase': {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error(
          'SUPABASE_URL и SUPABASE_KEY должны быть указаны в переменных окружения.\n' +
            'Получите их в настройках проекта Supabase: https://app.supabase.com'
        );
      }

      console.log(`✅ Supabase Provider подключен (URL: ${supabaseUrl})`);

      return new SupabaseProvider(supabaseUrl, supabaseKey);
    }

    default:
      throw new Error(
        `Неизвестный тип провайдера: ${providerType}\n` +
          'Поддерживаемые типы: google_sheets, supabase'
      );
  }
}

/**
 * Singleton инстанс провайдера
 * Создается один раз при первом вызове
 */
let dataProviderInstance: IDataProvider | null = null;

/**
 * Получить singleton инстанс провайдера
 * Рекомендуется использовать этот метод в приложении
 */
export function getDataProviderInstance(): IDataProvider {
  if (!dataProviderInstance) {
    dataProviderInstance = getDataProvider();
  }
  return dataProviderInstance;
}

/**
 * Сбросить singleton инстанс (для тестов)
 */
export function resetDataProviderInstance(): void {
  dataProviderInstance = null;
}

// Экспортируем типы и классы
export { IDataProvider } from './IDataProvider';
export { GoogleSheetsProvider } from './GoogleSheetsProvider';
export { SupabaseProvider } from './SupabaseProvider';
