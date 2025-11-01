import React, { useState, useEffect } from 'react';
import { getTelegramUser } from '@/utils/telegram';
import { api } from '@/services/api';

interface CheckoutFormProps {
  onSubmit: (data: CheckoutData) => void;
  onCancel: () => void;
  totalPrice: number;
}

export interface CheckoutData {
  name: string;
  street: string;
  building: string;
  apartment: string;
  code?: string;
  deliveryNote?: string;
  contactMethod: 'telegram' | 'phone';
  phone?: string;
  paymentMethod: 'cash' | 'card';
  changeFrom?: number; // Сумма, с которой нужна сдача (только для наличных)
  comment?: string;
  loyaltyCardNumber?: string; // Номер карты лояльности (необязательно)
}

/**
 * ФОРМА ОФОРМЛЕНИЯ ЗАКАЗА
 *
 * Собирает информацию для доставки:
 * - Адрес доставки
 * - Телефон
 * - Способ оплаты
 * - Комментарий к заказу
 */
const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit, onCancel, totalPrice }) => {
  const [formData, setFormData] = useState<CheckoutData>({
    name: '',
    street: '',
    building: '',
    apartment: '',
    code: '',
    deliveryNote: '',
    contactMethod: 'telegram',
    phone: '',
    paymentMethod: 'cash',
    changeFrom: undefined,
    comment: '',
    loyaltyCardNumber: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutData, string>>>({});

  // Загружаем данные пользователя при монтировании компонента
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const telegramUser = getTelegramUser();
        if (!telegramUser?.id) return;

        // Получаем данные пользователя из БД
        const user = await api.getUser(telegramUser.id);

        if (user) {
          // Автоматически заполняем поля формы
          const fullName = user.last_name
            ? `${user.first_name} ${user.last_name}`
            : user.first_name;

          setFormData(prev => ({
            ...prev,
            name: fullName || telegramUser.first_name || '',
            phone: user.phone || '',
            loyaltyCardNumber: user.loyalty_card_number || '',
          }));
        } else {
          // Если пользователя нет в БД, используем данные из Telegram
          setFormData(prev => ({
            ...prev,
            name: telegramUser.first_name || '',
          }));
        }
      } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
      }
    };

    loadUserData();
  }, []);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CheckoutData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Укажите ваше имя';
    }

    if (!formData.street.trim()) {
      newErrors.street = 'Укажите улицу';
    }

    if (!formData.building.trim()) {
      newErrors.building = 'Укажите дом';
    }

    if (!formData.apartment.trim()) {
      newErrors.apartment = 'Укажите квартиру';
    }

    if (formData.contactMethod === 'phone') {
      if (!formData.phone?.trim()) {
        newErrors.phone = 'Укажите номер телефона';
      } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/[\s-()]/g, ''))) {
        newErrors.phone = 'Неверный формат телефона';
      }
    }

    if (formData.paymentMethod === 'cash' && formData.changeFrom) {
      if (formData.changeFrom < totalPrice) {
        newErrors.changeFrom = `Сумма должна быть не меньше ${totalPrice} RSD`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = <K extends keyof CheckoutData>(field: K, value: CheckoutData[K]) => {
    setFormData({ ...formData, [field]: value });
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-in-up pb-24">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold tg-theme-text">Оформление заказа</h2>
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Имя */}
          <div>
            <label className="block text-sm font-medium tg-theme-text mb-2">
              Ваше имя <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Например: Иван"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.name
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 tg-theme-text focus:outline-none focus:ring-2 focus:ring-primary-500`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Улица */}
          <div>
            <label className="block text-sm font-medium tg-theme-text mb-2">
              Улица <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) => handleChange('street', e.target.value)}
              placeholder="Название улицы"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.street
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 tg-theme-text focus:outline-none focus:ring-2 focus:ring-primary-500`}
            />
            {errors.street && (
              <p className="text-red-500 text-sm mt-1">{errors.street}</p>
            )}
          </div>

          {/* Дом и Квартира */}
          <div className="grid grid-cols-2 gap-4">
            {/* Дом */}
            <div>
              <label className="block text-sm font-medium tg-theme-text mb-2">
                Дом <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.building}
                onChange={(e) => handleChange('building', e.target.value)}
                placeholder="№"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.building
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 tg-theme-text focus:outline-none focus:ring-2 focus:ring-primary-500`}
              />
              {errors.building && (
                <p className="text-red-500 text-sm mt-1">{errors.building}</p>
              )}
            </div>

            {/* Квартира */}
            <div>
              <label className="block text-sm font-medium tg-theme-text mb-2">
                Квартира <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.apartment}
                onChange={(e) => handleChange('apartment', e.target.value)}
                placeholder="№"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.apartment
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 tg-theme-text focus:outline-none focus:ring-2 focus:ring-primary-500`}
              />
              {errors.apartment && (
                <p className="text-red-500 text-sm mt-1">{errors.apartment}</p>
              )}
            </div>
          </div>

          {/* Код */}
          <div>
            <label className="block text-sm font-medium tg-theme-text mb-2">
              Код домофона
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value)}
              placeholder="Код (необязательно)"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 tg-theme-text focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Отметка для курьера */}
          <div>
            <label className="block text-sm font-medium tg-theme-text mb-2">
              Отметка для курьера
            </label>
            <textarea
              value={formData.deliveryNote}
              onChange={(e) => handleChange('deliveryNote', e.target.value)}
              placeholder="Например: позвоните за 5 минут"
              rows={2}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 tg-theme-text focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Способ связи */}
          <div>
            <label className="block text-sm font-medium tg-theme-text mb-2">
              Как с вами связаться? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleChange('contactMethod', 'telegram')}
                className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                  formData.contactMethod === 'telegram'
                    ? 'border-primary-500 bg-primary-500 text-gray-900'
                    : 'border-gray-300 dark:border-gray-600 tg-theme-text hover:border-primary-300'
                }`}
              >
                📱 Telegram
              </button>
              <button
                type="button"
                onClick={() => handleChange('contactMethod', 'phone')}
                className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                  formData.contactMethod === 'phone'
                    ? 'border-primary-500 bg-primary-500 text-gray-900'
                    : 'border-gray-300 dark:border-gray-600 tg-theme-text hover:border-primary-300'
                }`}
              >
                📞 Телефон
              </button>
            </div>
            <p className="text-xs tg-theme-hint mt-2">
              {formData.contactMethod === 'telegram'
                ? 'Курьер свяжется с вами через Telegram'
                : 'Курьер позвонит вам по телефону'}
            </p>
          </div>

          {/* Телефон (только если выбран способ связи "телефон") */}
          {formData.contactMethod === 'phone' && (
            <div>
              <label className="block text-sm font-medium tg-theme-text mb-2">
                Номер телефона <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+381 XX XXX XXXX"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.phone
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 tg-theme-text focus:outline-none focus:ring-2 focus:ring-primary-500`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          )}

          {/* Способ оплаты */}
          <div>
            <label className="block text-sm font-medium tg-theme-text mb-2">
              Способ оплаты <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleChange('paymentMethod', 'cash')}
                className={`px-4 py-3 rounded-lg border-2 transition-all ${
                  formData.paymentMethod === 'cash'
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <div className="text-2xl mb-1">💵</div>
                <div className={`text-sm font-medium ${formData.paymentMethod === 'cash' ? 'text-gray-900' : 'tg-theme-text'}`}>Наличные</div>
              </button>

              <button
                type="button"
                onClick={() => handleChange('paymentMethod', 'card')}
                className={`px-4 py-3 rounded-lg border-2 transition-all ${
                  formData.paymentMethod === 'card'
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <div className="text-2xl mb-1">💳</div>
                <div className={`text-sm font-medium ${formData.paymentMethod === 'card' ? 'text-gray-900' : 'tg-theme-text'}`}>Картой</div>
              </button>
            </div>
          </div>

          {/* Сдача (только для наличных) */}
          {formData.paymentMethod === 'cash' && (
            <div>
              <label className="block text-sm font-medium tg-theme-text mb-2">
                С какой суммы нужна сдача?
              </label>
              <input
                type="number"
                value={formData.changeFrom || ''}
                onChange={(e) => handleChange('changeFrom', e.target.value ? Number(e.target.value) : undefined)}
                placeholder={`Например: ${Math.ceil(totalPrice / 100) * 100}`}
                min={totalPrice}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.changeFrom
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 tg-theme-text focus:outline-none focus:ring-2 focus:ring-primary-500`}
              />
              {errors.changeFrom && (
                <p className="text-red-500 text-sm mt-1">{errors.changeFrom}</p>
              )}
              <p className="text-xs tg-theme-hint mt-2">
                Если оставить пустым, курьер подготовит сдачу с ближайшей крупной купюры
              </p>
            </div>
          )}

          {/* Номер карты лояльности (автоматически из профиля) */}
          {formData.loyaltyCardNumber && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🎫</span>
                <span className="text-sm font-medium tg-theme-text">Карта лояльности</span>
              </div>
              <p className="text-lg font-mono font-bold text-green-600 dark:text-green-400">
                {formData.loyaltyCardNumber}
              </p>
              <p className="text-xs tg-theme-hint mt-1">
                Автоматически определена из вашего профиля
              </p>
            </div>
          )}

          {/* Комментарий */}
          <div>
            <label className="block text-sm font-medium tg-theme-text mb-2">
              Комментарий к заказу
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => handleChange('comment', e.target.value)}
              placeholder="Особые пожелания, время доставки и т.д."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 tg-theme-text focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          {/* Итого */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="tg-theme-hint">Сумма заказа:</span>
              <span className="font-semibold tg-theme-text">{totalPrice} RSD</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="tg-theme-hint">Доставка:</span>
              <span className="font-semibold text-gray-900">Бесплатно</span>
            </div>
            <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold tg-theme-text">Итого:</span>
                <span className="text-2xl font-bold text-gray-900">{totalPrice} RSD</span>
              </div>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-4 pb-8">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-600 tg-theme-text hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-lg bg-primary-500 text-gray-900 hover:bg-primary-600 font-semibold transition-all active:scale-95"
            >
              Оформить заказ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
