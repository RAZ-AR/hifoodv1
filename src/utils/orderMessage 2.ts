/**
 * Генерация сообщения о заказе для Telegram
 */

import { MenuItem } from '@/types';
import { CheckoutData } from '@/components/CheckoutForm';

interface OrderMessageParams {
  orderId: string;
  checkoutData: CheckoutData;
  cartItems: Array<{ item: MenuItem; quantity: number }>;
  cutleryCount: number;
  totalPrice: number;
}

/**
 * Форматирует сообщение о заказе для отправки в Telegram
 */
export const formatOrderMessage = ({
  orderId,
  checkoutData,
  cartItems,
  cutleryCount,
  totalPrice,
}: OrderMessageParams): string => {
  const itemsList = cartItems
    .map((item) => {
      const itemTotal = item.item.price * item.quantity;
      return `• ${item.item.name} × ${item.quantity} = ${itemTotal} RSD`;
    })
    .join('\n');

  const deliveryAddress = [
    `Улица: ${checkoutData.street}`,
    `Дом: ${checkoutData.building}, Квартира: ${checkoutData.apartment}`,
    checkoutData.code ? `Код: ${checkoutData.code}` : '',
    checkoutData.deliveryNote ? `Отметка для курьера: ${checkoutData.deliveryNote}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const contactInfo =
    checkoutData.contactMethod === 'telegram'
      ? 'Telegram'
      : `Телефон: ${checkoutData.phone}`;

  let paymentInfo = '';
  if (checkoutData.paymentMethod === 'cash') {
    paymentInfo = 'Наличные';
    if (checkoutData.changeFrom) {
      const change = checkoutData.changeFrom - totalPrice;
      paymentInfo += `\nСдача с ${checkoutData.changeFrom} RSD (сдача: ${change} RSD)`;
    } else {
      paymentInfo += '\nСдача не требуется (курьер подготовит с ближайшей крупной купюры)';
    }
  } else {
    paymentInfo = 'Банковская карта';
  }

  const message = `
🛒 *НОВЫЙ ЗАКАЗ ${orderId}*

👤 *Имя:* ${checkoutData.name}

📦 *Товары:*
${itemsList}

🍴 *Приборы:* ${cutleryCount} шт.

💰 *Итого:* ${totalPrice} RSD

📍 *Адрес доставки:*
${deliveryAddress}

📞 *Контакт:*
${contactInfo}

💳 *Способ оплаты:*
${paymentInfo}

${checkoutData.comment ? `💬 *Комментарий:*\n${checkoutData.comment}` : ''}
  `.trim();

  return message;
};

/**
 * Форматирует данные заказа для отправки в бота
 */
export const formatOrderData = ({
  orderId,
  checkoutData,
  cartItems,
  cutleryCount,
  totalPrice,
}: OrderMessageParams) => {
  return {
    type: 'order',
    data: {
      orderId,
      items: cartItems.map((item) => ({
        id: item.item.id,
        name: item.item.name,
        price: item.item.price,
        quantity: item.quantity,
      })),
      total: totalPrice,
      cutleryCount,
      ...checkoutData,
    },
  };
};
