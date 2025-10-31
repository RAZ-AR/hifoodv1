import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import CheckoutForm, { CheckoutData } from '@/components/CheckoutForm';
import ProductModal from '@/components/ProductModal';
import { generateOrderId, saveOrder } from '@/hooks/useOrderTracking';
import { formatOrderData } from '@/utils/orderMessage';
import { showTelegramAlert, triggerHaptic, getTelegramUser } from '@/utils/telegram';
import { ORDER_CONFIG } from '@/constants';
import { api } from '@/services/api';
import { MenuItem } from '@/types';

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
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart, addToCart, getItemQuantity } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [cutleryCount, setCutleryCount] = useState<number>(ORDER_CONFIG.DEFAULT_CUTLERY_COUNT);
  const [recommendedItems, setRecommendedItems] = useState<MenuItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Загружаем рекомендованные блюда при открытии формы оформления
  useEffect(() => {
    if (showCheckoutForm) {
      const fetchRecommendedItems = async () => {
        try {
          // Получаем все блюда
          const allItems = await api.getMenu({ available: true });

          // Фильтруем: только не в корзине
          const cartItemIds = cartItems.map((ci: { item: { id: string } }) => ci.item.id);
          const available = allItems.filter(
            (item: MenuItem) => !cartItemIds.includes(item.id)
          );

          // Берем случайные 3 блюда
          const shuffled = available.sort(() => 0.5 - Math.random());
          setRecommendedItems(shuffled.slice(0, 3));
        } catch (error) {
          console.error('Ошибка загрузки рекомендаций:', error);
        }
      };

      fetchRecommendedItems();
    }
  }, [showCheckoutForm, cartItems]);

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

      if (!customerTelegramId) {
        throw new Error(
          'Не удалось получить ваш Telegram ID.\n\n' +
          'Пожалуйста, откройте приложение через кнопку в боте @Hi_food_order_bot'
        );
      }

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
      <div className="min-h-screen bg-cream-300 flex items-center justify-center px-4 pb-20">
        <div className="text-center">
          <span className="text-6xl mb-4 block">🛒</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cart is Empty</h2>
          <p className="text-gray-600">Add dishes from the menu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-300 pb-24">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Заголовок */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Cart</h1>
          <p className="text-sm text-gray-600 mt-2">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {/* Список товаров */}
        <div className="space-y-3 mb-6">
          {cartItems.map(({ item, quantity }) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm p-4"
            >
              <div className="flex gap-4">
                {/* Изображение */}
                <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-accent-green">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Информация */}
                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-sm">{item.name}</h3>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Количество */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center"
                      >
                        <span className="text-base font-bold text-gray-700">−</span>
                      </button>

                      <span className="w-6 text-center font-semibold text-gray-900 text-sm">
                        {quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.id, quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center"
                      >
                        <span className="text-base font-bold text-gray-700">+</span>
                      </button>
                    </div>

                    {/* Цена */}
                    <div className="text-lg font-bold text-gray-900">
                      (item.price * quantity) + " RSD"
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Рекомендации */}
        {recommendedItems.length > 0 && (
          <div className="mb-6">
            <h3 className="text-base font-bold tg-theme-text mb-3">Добавить к заказу?</h3>
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
              {recommendedItems
                .filter(item => item.available)
                .slice(0, 5)
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="flex-shrink-0 w-[160px] bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden snap-center border border-gray-200 dark:border-gray-600 cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-24 object-cover"
                    />
                    <div className="p-3">
                      <h4 className="text-xs font-semibold tg-theme-text mb-1 line-clamp-2 h-8">
                        {item.name}
                      </h4>
                      <p className="text-sm font-bold text-primary-600 mb-2">{item.price} RSD</p>

                      {/* Кнопка добавить */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item, 1);
                          if (window.Telegram?.WebApp) {
                            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
                          }
                        }}
                        className="w-full py-1.5 bg-primary-500 text-white rounded-lg text-xs font-semibold hover:bg-primary-600 transition-colors"
                      >
                        + Добавить
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Футер с итогом */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          {/* Количество приборов */}
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-xl">🍴</span>
              <span className="text-sm font-medium text-gray-900">Cutlery</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-1">
              <button
                onClick={() => setCutleryCount(Math.max(0, cutleryCount - 1))}
                className="w-6 h-6 flex items-center justify-center"
              >
                <span className="text-base font-bold text-gray-700">−</span>
              </button>
              <span className="w-6 text-center font-bold text-gray-900 text-sm">{cutleryCount}</span>
              <button
                onClick={() => setCutleryCount(cutleryCount + 1)}
                className="w-6 h-6 flex items-center justify-center"
              >
                <span className="text-base font-bold text-gray-700">+</span>
              </button>
            </div>
          </div>

          {/* Итоговая сумма */}
          <div className="flex justify-between items-center mb-5">
            <span className="text-lg font-semibold text-gray-900">Total:</span>
            <div className="text-3xl font-bold text-gray-900">
              getTotalPrice() + " RSD"
            </div>
          </div>

          {/* Кнопка оформления */}
          <button
            onClick={handleCheckoutClick}
            disabled={isOrdering}
            className={`
              w-full py-4 rounded-2xl font-bold text-white text-lg transition-all
              ${isOrdering
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-accent-black hover:bg-opacity-90 active:scale-95'
              }
            `}
          >
            {isOrdering ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Processing...
              </span>
            ) : (
              'Checkout'
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

      {/* Модальное окно товара */}
      {selectedItem && (
        <ProductModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={(item, quantity) => addToCart(item, quantity)}
          currentQuantity={getItemQuantity(selectedItem.id)}
          isFavorite={isFavorite(selectedItem.id)}
          onFavoriteToggle={() => toggleFavorite(selectedItem.id)}
        />
      )}
    </div>
  );
};

export default Cart;
