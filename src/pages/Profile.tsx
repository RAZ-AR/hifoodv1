import React, { useState, useEffect } from 'react';
import { User } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import { api } from '@/services/api';
import { getTelegramUser } from '@/utils/telegram';
import type { Order } from '@/types';

interface ProfileProps {
  user: User | null;
}

/**
 * СТРАНИЦА ПРОФИЛЯ - СТИЛЬ РЕФЕРЕНСА
 *
 * Отображает:
 * - Информацию о пользователе
 * - Карту лояльности
 * - Статистику заказов
 */
const Profile: React.FC<ProfileProps> = ({ user }) => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Загружаем историю заказов при монтировании
  useEffect(() => {
    const loadOrders = async () => {
      const telegramUser = getTelegramUser();
      const telegramId = telegramUser?.id;

      if (!telegramId) return;

      setLoadingOrders(true);
      try {
        const userOrders = await api.getUserOrdersByTelegramId(telegramId);
        setOrders(userOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
  }, []);

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      accepted: t('orderStatus.confirmed'),
      preparing: t('orderStatus.preparing'),
      delivering: t('orderStatus.delivering'),
      delivered: t('orderStatus.delivered'),
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      accepted: 'bg-pink-100 text-pink-700',
      preparing: 'bg-blue-100 text-blue-700',
      delivering: 'bg-cyan-100 text-cyan-700',
      delivered: 'bg-green-100 text-green-700',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-700';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-cream-300 flex items-center justify-center px-4 pb-20">
        <div className="text-center">
          <span className="text-6xl mb-4 block">👤</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('profile.notAuthorized')}</h2>
          <p className="text-gray-600">{t('profile.openFromTelegram')}</p>
        </div>
      </div>
    );
  }

  const getUserInitials = () => {
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'U';
  };

  return (
    <div className="pb-20 bg-cream-300 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Заголовок */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{t('profile.title')}</h1>
        </div>

        {/* Информация о пользователе */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-700">
                {getUserInitials()}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {user.first_name} {user.last_name}
              </h2>
              {user.telegram_username && (
                <p className="text-sm text-gray-600">@{user.telegram_username}</p>
              )}
            </div>
          </div>

          {/* Контактная информация */}
          <div className="space-y-4">
            {user.phone && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">📱</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('profile.phone')}</p>
                  <p className="text-sm font-medium text-gray-900">{user.phone}</p>
                </div>
              </div>
            )}

            {user.email && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">📧</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('profile.email')}</p>
                  <p className="text-sm font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-lg">📅</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">{t('profile.memberSince')}</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(user.registered_at).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Карта лояльности */}
        {user.loyalty_card_number && (
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg p-6 mb-4 text-gray-900">
            <h3 className="text-lg font-bold mb-4">{t('profile.loyaltyCard')}</h3>
            <div className="text-3xl font-mono font-bold tracking-wider mb-4">
              {user.loyalty_card_number}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="opacity-90">{t('profile.bonusBalance')}</span>
              <span className="font-bold text-xl">{user.bonus_balance} pts</span>
            </div>
          </div>
        )}

        {/* Статистика */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {orders.length}
            </div>
            <div className="text-sm text-gray-600">{t('profile.totalOrders')}</div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {orders.reduce((sum, order: any) => sum + (order.total || 0), 0).toFixed(0)} RSD
            </div>
            <div className="text-sm text-gray-600">{t('profile.totalSpent')}</div>
          </div>
        </div>

        {/* История заказов */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t('profile.orderHistory')}</h3>

          {loadingOrders ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl mb-2 block">📦</span>
              <p className="text-gray-500 text-sm">{t('profile.noOrders')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order: any) => (
                <div
                  key={order.id || order.order_id}
                  className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{order.order_number}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="font-medium text-gray-900">{(order.total || 0).toFixed(0)} RSD</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Настройки */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t('profile.settings')}</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">🔔</span>
                <span className="text-sm font-medium text-gray-900">{t('profile.notifications')}</span>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors ${user.notifications_enabled ? 'bg-primary-500' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${user.notifications_enabled ? 'ml-6' : 'ml-0.5'}`}></div>
              </div>
            </div>

            <LanguageSelector variant="profile" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
