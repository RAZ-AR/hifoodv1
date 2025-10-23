import React, { useState } from 'react';

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
  phone: string;
  paymentMethod: 'cash' | 'card';
  comment?: string;
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
    phone: '',
    paymentMethod: 'cash',
    comment: '',
  });

  const [errors, setErrors] = useState<Partial<CheckoutData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<CheckoutData> = {};

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

    if (!formData.phone.trim()) {
      newErrors.phone = 'Укажите номер телефона';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/[\s-()]/g, ''))) {
      newErrors.phone = 'Неверный формат телефона';
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

  const handleChange = (field: keyof CheckoutData, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-in-up">
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

          {/* Телефон */}
          <div>
            <label className="block text-sm font-medium tg-theme-text mb-2">
              Телефон <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
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
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <div className="text-2xl mb-1">💵</div>
                <div className="text-sm font-medium tg-theme-text">Наличные</div>
              </button>

              <button
                type="button"
                onClick={() => handleChange('paymentMethod', 'card')}
                className={`px-4 py-3 rounded-lg border-2 transition-all ${
                  formData.paymentMethod === 'card'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <div className="text-2xl mb-1">💳</div>
                <div className="text-sm font-medium tg-theme-text">Картой</div>
              </button>
            </div>
          </div>

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
              <span className="font-semibold tg-theme-text">{totalPrice} ₽</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="tg-theme-hint">Доставка:</span>
              <span className="font-semibold text-green-600">Бесплатно</span>
            </div>
            <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold tg-theme-text">Итого:</span>
                <span className="text-2xl font-bold text-primary-600">{totalPrice} ₽</span>
              </div>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-600 tg-theme-text hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-lg bg-primary-500 text-white hover:bg-primary-600 font-semibold"
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
