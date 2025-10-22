# 🎨 Hi Food - Frontend

React приложение для Telegram Mini App с картами лояльности.

## ✨ Что уже готово

✅ Структура проекта (React 18 + TypeScript + Vite)
✅ Конфигурация (Tailwind CSS)
✅ TypeScript типы (синхронизированы с backend)
✅ **Header с отображением карты лояльности** 🎴
✅ Интеграция Telegram Web App SDK
✅ Базовое приложение с тестовым пользователем

---

## 🚀 Быстрый старт

### 1. Установите зависимости

```bash
cd frontend
npm install
```

### 2. Запустите dev сервер

```bash
npm run dev
```

Откройте http://localhost:5173

---

## 🎴 Карта лояльности - как это выглядит

### Header (всегда виден):

```
🍕 Hi Food                    Иван @testuser
                              Card: #1234 🎴
                              150 бонусов
```

### Детальная карточка:

```
┌─────────────────────────────┐
│ Hi Food Card          🎴    │
│ #1234                       │
│                             │
│ Владелец: Иван Иванов       │
│ Бонусов: 150                │
│ Заказов: 12                 │
│                             │
│ Выдана: 22.10.2025          │
└─────────────────────────────┘
```

---

## 📂 Структура

```
frontend/
├── src/
│   ├── components/
│   │   └── Layout/
│   │       └── Header.tsx        # ✅ Header с картой
│   ├── types/
│   │   └── index.ts              # ✅ Все типы
│   ├── App.tsx                   # ✅ Главное приложение
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Стили
├── index.html                    # ✅ С Telegram SDK
├── vite.config.ts                # ✅ Настроен
├── tsconfig.json                 # ✅ Настроен
├── tailwind.config.js            # ✅ Настроен
└── package.json                  # ✅ Все зависимости
```

---

## 🔧 Что нужно доделать

### 1. Страницы (создать в `src/pages/`):

- [ ] **Home.tsx** - главная страница с меню
- [ ] **Profile.tsx** - профиль пользователя
- [ ] **Cart.tsx** - корзина
- [ ] **History.tsx** - история заказов
- [ ] **Favorites.tsx** - избранное

### 2. Компоненты (создать в `src/components/`):

- [ ] **BottomNavbar.tsx** - нижняя навигация (5 вкладок)
- [ ] **AdCarousel.tsx** - карусель рекламы
- [ ] **CategoryFilter.tsx** - фильтр категорий
- [ ] **DishGrid.tsx** - сетка блюд
- [ ] **ProductCard.tsx** - карточка блюда
- [ ] **CartSummary.tsx** - итоги корзины

### 3. State Management:

```bash
# Создать store/
├── store.ts                 # Redux store
├── slices/
│   ├── userSlice.ts         # Пользователь
│   ├── cartSlice.ts         # Корзина
│   ├── menuSlice.ts         # Меню
│   └── ordersSlice.ts       # Заказы
```

### 4. Routing:

```typescript
// App.tsx с роутингом
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/history" element={<History />} />
    <Route path="/favorites" element={<Favorites />} />
  </Routes>
</BrowserRouter>
```

### 5. API Services:

```typescript
// src/services/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
  // Пользователи
  getUser: (telegramId: number) =>
    axios.get(`${API_URL}/users/${telegramId}`),

  createUser: (userData) =>
    axios.post(`${API_URL}/users`, userData),

  // Меню
  getMenu: () =>
    axios.get(`${API_URL}/menu`),

  // Заказы
  createOrder: (orderData) =>
    axios.post(`${API_URL}/orders`, orderData),

  getUserOrders: (userId: string) =>
    axios.get(`${API_URL}/orders/user/${userId}`),

  // Бонусы
  addBonus: (userId: string, amount: number) =>
    axios.post(`${API_URL}/bonuses/add`, { userId, amount }),
};
```

### 6. Многоязычность (i18next):

```typescript
// src/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ru from './locales/ru.json';
import srLat from './locales/sr-lat.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      'sr-lat': { translation: srLat },
    },
    lng: 'ru',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
```

---

## 🎯 Пример компонента BottomNavbar

```typescript
// src/components/Layout/BottomNavbar.tsx
import { NavLink } from 'react-router-dom';

const BottomNavbar = () => {
  const navItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/favorites', icon: '❤️', label: 'Favorites' },
    { path: '/history', icon: '📋', label: 'History' },
    { path: '/cart', icon: '🛒', label: 'Cart' },
    { path: '/profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 ${
                isActive ? 'text-primary-500' : 'text-gray-500'
              }`
            }
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
```

---

## 📦 Доступные скрипты

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Предпросмотр production
npm run preview

# Линтинг
npm run lint

# Форматирование
npm run format
```

---

## 🔌 Интеграция с Backend

### 1. Создайте `.env`:

```env
VITE_API_URL=http://localhost:3000
```

### 2. Используйте API:

```typescript
import { api } from '@/services/api';

// В компоненте
useEffect(() => {
  const fetchUser = async () => {
    const response = await api.getUser(telegramId);
    setUser(response.data);
  };

  fetchUser();
}, [telegramId]);
```

---

## 🎨 Дизайн-система

### Цвета:

- **Primary**: `bg-primary-500` (красный)
- **Telegram bg**: `tg-theme-bg`
- **Telegram text**: `tg-theme-text`

### Компоненты Tailwind:

```jsx
// Кнопка
<button className="bg-primary-500 text-white px-4 py-2 rounded-lg">
  Click me
</button>

// Карточка
<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
  Content
</div>

// Badge карты лояльности
<div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-full px-3 py-1">
  <span className="text-white font-bold">#1234</span>
</div>
```

---

## 📱 Тестирование в Telegram

### 1. Соберите проект:

```bash
npm run build
```

### 2. Разверните на хостинге:

- Vercel
- Netlify
- GitHub Pages

### 3. Настройте Telegram Bot:

```
/newbot
/setmenubutton
# Укажите URL вашего приложения
```

---

## 🔗 Полезные ссылки

- [Figma Design](https://www.figma.com/design/E09w100tYLeRLoZYfuz3Ow/HyperMart-App--Community-)
- [Telegram Web App Docs](https://core.telegram.org/bots/webapps)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router Docs](https://reactrouter.com/)
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)

---

## ✅ Чеклист

- [x] Структура проекта
- [x] TypeScript типы
- [x] Header с картой лояльности
- [x] Telegram SDK интеграция
- [x] Базовое приложение
- [ ] Все страницы
- [ ] Bottom Navigation
- [ ] Redux store
- [ ] API интеграция
- [ ] i18next многоязычность
- [ ] Полная функциональность

---

**Frontend готов к разработке!** 🚀

Начните с создания страниц и компонентов из чеклиста выше.
