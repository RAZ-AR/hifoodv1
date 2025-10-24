/**
 * Утилиты для форматирования данных
 */

/**
 * Форматирует цену с валютой
 */
export const formatPrice = (price: number, currency: string = 'RSD'): string => {
  return `${price.toFixed(0)} ${currency}`;
};

/**
 * Форматирует номер телефона
 */
export const formatPhoneNumber = (phone: string): string => {
  // Удаляем все символы кроме цифр и +
  return phone.replace(/[^\d+]/g, '');
};

/**
 * Валидирует номер телефона
 */
export const isValidPhone = (phone: string): boolean => {
  const cleaned = formatPhoneNumber(phone);
  return /^\+?[0-9]{10,15}$/.test(cleaned);
};

/**
 * Форматирует адрес для отображения
 */
export const formatAddress = (address: {
  street: string;
  building: string;
  apartment: string;
  code?: string;
}): string => {
  const parts = [
    `ул. ${address.street}`,
    `д. ${address.building}`,
    `кв. ${address.apartment}`,
  ];

  if (address.code) {
    parts.push(`код ${address.code}`);
  }

  return parts.join(', ');
};

/**
 * Форматирует количество товаров с правильным окончанием
 */
export const formatItemCount = (count: number): string => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return `${count} товаров`;
  }

  if (lastDigit === 1) {
    return `${count} товар`;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} товара`;
  }

  return `${count} товаров`;
};

/**
 * Форматирует количество блюд с правильным окончанием
 */
export const formatDishCount = (count: number): string => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (count === 1) {
    return `${count} блюдо`;
  }

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return `${count} блюд`;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} блюда`;
  }

  return `${count} блюд`;
};
