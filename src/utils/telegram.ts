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
    // Пытаемся получить из URL параметров (fallback)
    return getUserFromURLParams();
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

  // Fallback 1: пытаемся получить из URL параметров
  console.warn('[getTelegramUser] User not found in initDataUnsafe, trying URL params');
  const userFromURL = getUserFromURLParams();
  if (userFromURL) {
    console.log('[getTelegramUser] User found in URL params:', userFromURL);

    // Сохраняем в localStorage
    try {
      localStorage.setItem('telegram_user_id', String(userFromURL.id));
      localStorage.setItem('telegram_user', JSON.stringify(userFromURL));
    } catch (e) {
      console.warn('[getTelegramUser] Failed to save URL params to localStorage:', e);
    }

    return userFromURL;
  }

  // Fallback 2: пытаемся получить из localStorage
  console.warn('[getTelegramUser] User not found in URL params, trying localStorage');
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
    console.error('[getTelegramUser] initDataUnsafe is empty - Mini App должен быть открыт через бота!');
    console.error('[getTelegramUser] Пожалуйста, откройте приложение через кнопку в боте @Hi_food_order_bot');
  }

  return null;
};

/**
 * Получает данные пользователя из URL параметров
 * Используется как fallback когда initDataUnsafe не доступен
 */
function getUserFromURLParams() {
  if (typeof window === 'undefined') return null;

  const urlParams = new URLSearchParams(window.location.search);
  const tgId = urlParams.get('tgId');
  const tgUsername = urlParams.get('tgUsername');
  const firstName = urlParams.get('firstName');
  const lastName = urlParams.get('lastName');

  if (!tgId || !firstName) {
    console.warn('[getUserFromURLParams] Missing required params (tgId or firstName)');
    return null;
  }

  return {
    id: parseInt(tgId, 10),
    username: tgUsername || undefined,
    first_name: firstName,
    last_name: lastName || undefined,
  };
}
