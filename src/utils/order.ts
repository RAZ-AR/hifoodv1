/**
 * Генерирует уникальный ID заказа
 */
export const generateOrderId = (): string => {
  return `#${Date.now().toString().slice(-8)}`;
};
