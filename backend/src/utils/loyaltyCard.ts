import { IDataProvider } from '../services/dataProvider/IDataProvider';

/**
 * ГЕНЕРАТОР НОМЕРА КАРТЫ ЛОЯЛЬНОСТИ
 *
 * Генерирует уникальный 4-значный номер для карты лояльности
 * Формат: "1234" (от 1000 до 9999)
 */
export class LoyaltyCardGenerator {
  private dataProvider: IDataProvider;

  constructor(dataProvider: IDataProvider) {
    this.dataProvider = dataProvider;
  }

  /**
   * Генерирует случайный 4-значный номер
   */
  private generateRandomNumber(): string {
    // Генерируем число от 1000 до 9999
    const number = Math.floor(Math.random() * 9000) + 1000;
    return number.toString();
  }

  /**
   * Генерирует уникальный номер карты лояльности
   * Проверяет уникальность в базе данных
   *
   * @param maxAttempts - максимальное количество попыток (по умолчанию 10)
   * @returns уникальный 4-значный номер
   * @throws Error если не удалось сгенерировать уникальный номер
   */
  async generateUniqueCard(maxAttempts: number = 10): Promise<string> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const cardNumber = this.generateRandomNumber();

      // Проверяем уникальность
      const isUnique = await this.dataProvider.isLoyaltyCardUnique(cardNumber);

      if (isUnique) {
        return cardNumber;
      }

      // Если не уникален, пробуем снова
      console.log(`Номер карты ${cardNumber} уже существует, генерируем новый...`);
    }

    // Если за maxAttempts попыток не удалось сгенерировать уникальный номер
    throw new Error(
      `Не удалось сгенерировать уникальный номер карты лояльности за ${maxAttempts} попыток`
    );
  }

  /**
   * Форматирует номер карты для отображения
   * Например: "1234" -> "Card #1234"
   */
  static formatCardNumber(cardNumber: string): string {
    return `#${cardNumber}`;
  }

  /**
   * Валидирует номер карты лояльности
   */
  static validateCardNumber(cardNumber: string): boolean {
    // Проверяем, что это 4 цифры
    const regex = /^\d{4}$/;
    return regex.test(cardNumber);
  }

  /**
   * Проверяет, находится ли номер в допустимом диапазоне
   */
  static isInValidRange(cardNumber: string): boolean {
    if (!this.validateCardNumber(cardNumber)) {
      return false;
    }

    const num = parseInt(cardNumber, 10);
    return num >= 1000 && num <= 9999;
  }
}

/**
 * Утилита для работы с картами лояльности (без зависимости от DataProvider)
 */
export const LoyaltyCardUtils = {
  /**
   * Форматирует номер карты для отображения в UI
   */
  format: (cardNumber: string): string => {
    return LoyaltyCardGenerator.formatCardNumber(cardNumber);
  },

  /**
   * Валидирует номер карты
   */
  validate: (cardNumber: string): boolean => {
    return LoyaltyCardGenerator.validateCardNumber(cardNumber);
  },

  /**
   * Проверяет диапазон номера
   */
  isValidRange: (cardNumber: string): boolean => {
    return LoyaltyCardGenerator.isInValidRange(cardNumber);
  },

  /**
   * Скрывает часть номера карты (для безопасности, если нужно)
   * Например: "1234" -> "**34"
   */
  mask: (cardNumber: string): string => {
    if (cardNumber.length !== 4) {
      return cardNumber;
    }
    return `**${cardNumber.slice(2)}`;
  },
};
