/**
 * Утилиты для работы с Telegram Web App
 */

/**
 * Проверяет, запущено ли приложение в Telegram
 */
export const isTelegramWebApp = (): boolean => {
  return typeof window !== 'undefined' && !!window.Telegram?.WebApp;
};

/**
 * Получает экземпляр Telegram Web App
 */
export const getTelegramWebApp = () => {
  if (!isTelegramWebApp()) {
    return null;
  }
  return window.Telegram.WebApp;
};

/**
 * Показывает уведомление в Telegram
 */
export const showTelegramAlert = (message: string): void => {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.showAlert(message);
  } else {
    alert(message);
  }
};

/**
 * Показывает подтверждение в Telegram
 */
export const showTelegramConfirm = async (message: string): Promise<boolean> => {
  const tg = getTelegramWebApp();
  if (tg) {
    return await tg.showConfirm(message);
  } else {
    return confirm(message);
  }
};

/**
 * Отправляет haptic feedback
 */
export const triggerHaptic = (
  type: 'success' | 'error' | 'warning' | 'light' | 'medium' | 'heavy'
): void => {
  const tg = getTelegramWebApp();
  if (!tg) return;

  if (type === 'success' || type === 'error' || type === 'warning') {
    tg.HapticFeedback.notificationOccurred(type);
  } else {
    tg.HapticFeedback.impactOccurred(type);
  }
};

/**
 * Отправляет данные в Telegram бота
 */
export const sendDataToBot = (data: unknown): void => {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.sendData(JSON.stringify(data));
  } else {
    console.log('Telegram Web App not available. Data:', data);
  }
};

/**
 * Закрывает Telegram Web App
 */
export const closeTelegramApp = (): void => {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.close();
  }
};

/**
 * Получает данные пользователя из Telegram
 */
export const getTelegramUser = () => {
  const tg = getTelegramWebApp();

  if (!tg) {
    console.warn('[getTelegramUser] Telegram WebApp not available');
    return null;
  }

  // Пробуем получить пользователя из initDataUnsafe
  const user = tg.initDataUnsafe?.user;

  if (user) {
    console.log('[getTelegramUser] User found in initDataUnsafe:', user);

    // Сохраняем в localStorage для последующих использований
    try {
      localStorage.setItem('telegram_user_id', String(user.id));
      localStorage.setItem('telegram_user', JSON.stringify(user));
    } catch (e) {
      console.warn('[getTelegramUser] Failed to save to localStorage:', e);
    }

    return user;
  }

  // Fallback: пытаемся получить из localStorage
  console.warn('[getTelegramUser] User not found in initDataUnsafe');
  console.log('[getTelegramUser] initDataUnsafe:', tg.initDataUnsafe);

  try {
    const savedUser = localStorage.getItem('telegram_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      console.log('[getTelegramUser] User restored from localStorage:', parsedUser);
      return parsedUser;
    }
  } catch (e) {
    console.warn('[getTelegramUser] Failed to restore from localStorage:', e);
  }

  // В некоторых версиях Telegram данные могут быть в другом месте
  if (tg.initDataUnsafe && Object.keys(tg.initDataUnsafe).length === 0) {
    console.warn('[getTelegramUser] initDataUnsafe is empty - может быть открыто не через бота');
  }

  return null;
};
