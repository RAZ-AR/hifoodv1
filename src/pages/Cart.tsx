import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import CheckoutForm, { CheckoutData } from '@/components/CheckoutForm';
import { generateOrderId, saveOrder } from '@/hooks/useOrderTracking';
import { formatOrderData } from '@/utils/orderMessage';
import { showTelegramAlert, triggerHaptic, getTelegramUser } from '@/utils/telegram';
import { formatItemCount } from '@/utils/formatters';
import { ORDER_CONFIG } from '@/constants';
import { api } from '@/services/api';

/**
 * СТРАНИЦА КОРЗИНЫ
 *
 * Отображает:
 * - Список товаров в корзине
 * - Кнопки изменения количества
 * - Итоговую сумму
 * - Кнопку оформления заказа
 */

interface CartProps {
  onNavigateHome?: () => void;
}

const Cart: React.FC<CartProps> = ({ onNavigateHome }) => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [cutleryCount, setCutleryCount] = useState<number>(ORDER_CONFIG.DEFAULT_CUTLERY_COUNT);

  const handleCheckoutClick = () => {
    setShowCheckoutForm(true);
  };

  const handleCheckoutSubmit = async (checkoutData: CheckoutData) => {
    setIsOrdering(true);

    try {
      // Генерируем ID заказа
      const orderId = generateOrderId();
      const totalPrice = getTotalPrice();

      // Получаем Telegram ID пользователя
      const telegramUser = getTelegramUser();
      const customerTelegramId = telegramUser?.id;

      console.log('📱 Telegram User:', telegramUser);
      console.log('📱 Customer Telegram ID:', customerTelegramId);

      // Формируем данные для отправки в бота
      const orderData = formatOrderData({
        orderId,
        checkoutData,
        cartItems,
        cutleryCount,
        totalPrice,
      });

      // Отправляем заказ через бэкенд (в группу кухни + клиенту)
      const result = await api.sendOrderToTelegram(orderData.data, customerTelegramId);

      console.log('✅ Заказ успешно отправлен:', result);

      // Сохраняем orderId в localStorage
      saveOrder(orderId, 'accepted');

      // Показываем красивое сообщение об успехе
      showTelegramAlert(
        '🎉 Заказ успешно оформлен!\n\n' +
        `Номер заказа: ${orderId}\n\n` +
        'Спасибо за заказ! 🍔\n' +
        'Скоро привезем вкусности! 🚀\n\n' +
        'Вы получите уведомление в боте с деталями заказа.'
      );
      triggerHaptic('success');

      // Очищаем корзину
      clearCart();
      setShowCheckoutForm(false);

      // Возвращаемся на главную страницу
      setTimeout(() => {
        if (onNavigateHome) {
          onNavigateHome();
        }
      }, 1500); // Небольшая задержка, чтобы пользователь увидел сообщение
    } catch (error: any) {
      console.error('❌ Ошибка оформления заказа:', error);

      // Более детальное сообщение об ошибке
      const errorMessage = error?.message || 'Неизвестная ошибка';
      showTelegramAlert(
        '❌ Ошибка оформления заказа\n\n' +
        `Детали: ${errorMessage}\n\n` +
        'Пожалуйста, попробуйте снова или свяжитесь с нами.'
      );
      triggerHaptic('error');
    } finally {
      setIsOrdering(false);
    }
  };

  // Пустая корзина
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pb-20">
        <div className="text-center">
          <span className="text-6xl mb-4 block">🛒</span>
          <h2 className="text-2xl font-bold tg-theme-text mb-2">Корзина пуста</h2>
          <p className="tg-theme-hint">Добавьте блюда из меню</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Заголовок */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tg-theme-text">Корзина</h1>
          <p className="text-sm tg-theme-hint mt-1">
            {formatItemCount(cartItems.length)}
          </p>
        </div>

        {/* Список товаров */}
        <div className="space-y-4 mb-6">
          {cartItems.map(({ item, quantity }) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
            >
              <div className="flex gap-4">
                {/* Изображение */}
                <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Информация */}
                <div className="flex-grow">
                  <h3 className="font-semibold tg-theme-text mb-1">{item.name}</h3>
                  <p className="text-sm tg-theme-hint mb-2">{item.category}</p>

                  <div className="flex items-center justify-between">
                    {/* Цена */}
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-primary-600">
                        {item.price * quantity}
                      </span>
                      <span className="text-xs tg-theme-hint">RSD</span>
                    </div>

                    {/* Количество */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, quantity - 1)}
                        className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        <span className="text-lg font-bold">−</span>
                      </button>

                      <span className="w-8 text-center font-semibold tg-theme-text">
                        {quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.id, quantity + 1)}
                        className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600"
                      >
                        <span className="text-lg font-bold">+</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Кнопка удаления */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="flex-shrink-0 w-8 h-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full flex items-center justify-center"
                  aria-label="Удалить"
                >
                  <span className="text-xl">🗑️</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Очистить корзину */}
        <button
          onClick={clearCart}
          className="w-full mb-4 py-2 text-red-500 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          Очистить корзину
        </button>
      </div>

      {/* Фиксированный футер с итогом */}
      <div className="fixed bottom-16 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 safe-area-bottom">
        <div className="max-w-7xl mx-auto">
          {/* Количество приборов */}
          <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍴</span>
              <span className="text-sm font-medium tg-theme-text">Приборы</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCutleryCount(Math.max(0, cutleryCount - 1))}
                className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95 transition-all"
              >
                <span className="text-lg font-bold text-gray-600 dark:text-gray-300">−</span>
              </button>
              <span className="w-8 text-center font-bold tg-theme-text">{cutleryCount}</span>
              <button
                onClick={() => setCutleryCount(cutleryCount + 1)}
                className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 active:scale-95 transition-all"
              >
                <span className="text-lg font-bold">+</span>
              </button>
            </div>
          </div>

          {/* Итоговая сумма */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold tg-theme-text">Итого:</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary-600">
                {getTotalPrice().toFixed(0)}
              </span>
              <span className="text-sm tg-theme-hint">RSD</span>
            </div>
          </div>

          {/* Кнопка оформления */}
          <button
            onClick={handleCheckoutClick}
            disabled={isOrdering}
            className={`
              w-full py-3 rounded-lg font-semibold text-white transition-all
              ${isOrdering
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700'
              }
            `}
          >
            {isOrdering ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Оформление...
              </span>
            ) : (
              'Оформить заказ'
            )}
          </button>
        </div>
      </div>

      {/* Форма оформления заказа */}
      {showCheckoutForm && (
        <CheckoutForm
          onSubmit={handleCheckoutSubmit}
          onCancel={() => setShowCheckoutForm(false)}
          totalPrice={getTotalPrice()}
        />
      )}
    </div>
  );
};

export default Cart;
