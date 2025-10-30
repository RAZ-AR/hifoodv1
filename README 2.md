# 🍕 Hi Food - Telegram Mini App

Полнофункциональное приложение для доставки еды с системой лояльности в Telegram.

## 🎯 Особенности

✅ **Карта лояльности** - уникальные 4-значные номера (1000-9999)
✅ **Система бонусов** - накопление и использование бонусов
✅ **Telegram Integration** - полная интеграция с Telegram Web App SDK
✅ **Многоязычность** - готовность к поддержке нескольких языков
✅ **Гибкая архитектура** - легкое переключение между Google Sheets и Supabase

## 🚀 Быстрый старт

### Локальная разработка

**Frontend:**
```bash
npm install
npm run dev
# Откройте http://localhost:5173
```

**Backend:**
```bash
cd backend
npm install
npm run dev
# API: http://localhost:3000
```

## 📁 Структура проекта

```
hifoodv1/
├── src/                      # Frontend (React + TypeScript)
│   ├── components/          # UI компоненты
│   │   └── Layout/         # Header, Footer
│   ├── pages/              # Страницы приложения
│   ├── services/           # API интеграция
│   ├── store/              # State management
│   ├── config/             # Конфигурация (API URL)
│   └── types/              # TypeScript типы
│
├── backend/                 # Backend API (Express + TypeScript)
│   ├── src/
│   │   ├── services/       # Бизнес-логика
│   │   │   └── dataProvider/  # Абстрактный слой данных
│   │   ├── utils/          # Утилиты (генератор карт)
│   │   └── types/          # Типы (синхронизированы с frontend)
│   └── scripts/            # Миграции и утилиты
│
└── database/               # SQL схемы для Supabase
    └── supabase_schema.sql
```

## 🛠️ Технологический стек

### Frontend
- **React 18** + TypeScript + Vite
- **Tailwind CSS** с кастомной темой (#01fff7)
- **Telegram Web App SDK**
- **React Router** для навигации

### Backend
- **Express** + TypeScript
- **Абстрактный Data Provider** (Google Sheets / Supabase)
- **Supabase** для PostgreSQL
- **RESTful API**

### Деплой (100% бесплатно)
- **Frontend**: GitHub Pages
- **Backend**: Render.com (Free tier)
- **Database**: Supabase (Free tier)
- **Telegram Bot**: Telegram Bot API

```
💰 Стоимость: $0/месяц
```

## 📋 Деплой - Пошаговая инструкция

### 1️⃣ GitHub Pages (Frontend)

Frontend уже настроен и готов к деплою!

**Активация GitHub Pages:**
1. Откройте https://github.com/RAZ-AR/hifoodv1/settings/pages
2. **Source** → выберите **GitHub Actions**
3. Сохраните

Готово! Frontend будет доступен по адресу:
```
https://raz-ar.github.io/hifoodv1/
```

GitHub Actions автоматически задеплоит при каждом push в `main`.

📖 Подробнее: [SETUP_GITHUB_PAGES.md](./SETUP_GITHUB_PAGES.md)

### 2️⃣ Supabase (Database)

**Создание проекта:**
1. https://supabase.com → Sign up/Login
2. **New Project**:
   - Name: `hi-food-db`
   - Database Password: (сохраните!)
   - Region: `Central EU`

**Создание таблиц:**
1. Откройте **SQL Editor**
2. Скопируйте содержимое `database/supabase_schema.sql`
3. Выполните SQL

**Получите credentials:**
- Settings → API
- Скопируйте: **Project URL** и **anon key**

### 3️⃣ Render.com (Backend)

**Деплой backend:**
1. https://render.com → Sign up/Login
2. **New** → **Web Service**
3. Connect GitHub repo: `RAZ-AR/hifoodv1`
4. Настройки:
```
Name: hi-food-backend
Region: Frankfurt (EU Central)
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm start
```

**Environment Variables:**
```
NODE_ENV=production
PORT=3000
DATA_PROVIDER=supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

5. **Create Web Service**

⏳ Деплой займёт 5-10 минут. Backend будет доступен:
```
https://hi-food-backend.onrender.com
```

⚠️ Free tier: Первый запрос может занять 30-50 секунд (cold start).

### 4️⃣ Telegram Bot

**Создание бота:**
1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте `/newbot`
3. Name: `Hi Food`
4. Username: `@HiFoodDeliveryBot`

**Настройка Web App:**
```
/setmenubutton
@HiFoodDeliveryBot
Открыть меню 🍕
https://raz-ar.github.io/hifoodv1/
```

**Команды:**
```
/setcommands
@HiFoodDeliveryBot

start - Открыть приложение
menu - Показать меню
orders - Мои заказы
profile - Мой профиль
```

🎉 Готово! Откройте бота в Telegram и нажмите кнопку меню!

📖 Полная инструкция: [BACKEND_DEPLOYMENT.md](./BACKEND_DEPLOYMENT.md)

## 🎨 Ключевые функции

### Карта лояльности

Каждый пользователь получает уникальную карту при первой регистрации:

- **Формат**: 4-значный номер (1000-9999)
- **Генерация**: Автоматическая при создании профиля
- **Уникальность**: Проверяется в базе данных
- **Отображение**: В header приложения с бирюзовым бейджем

```typescript
// Пример генерации карты
const loyaltyCard = await LoyaltyCardGenerator.generateUniqueCard();
// → "5678"
```

### Абстрактный Data Provider

Легко переключайтесь между Google Sheets (разработка) и Supabase (продакшн):

```typescript
// .env
DATA_PROVIDER=supabase  // или google_sheets

// Код остаётся одинаковым
const user = await dataProvider.getUser(telegramId);
```

### API интеграция

Frontend автоматически определяет окружение:

```typescript
// Development: http://localhost:3000/api
// Production: https://hi-food-backend.onrender.com/api

import { api } from '@/services/api';

const user = await api.getUser(telegramId);
const menu = await api.getMenu({ available: true });
```

## 🎨 Цветовая схема

- **Primary**: `#01fff7` (бирюзовый)
- **Background**: Белый / Черный
- **Text**: Адаптивный контраст

## ✅ Checklist деплоя

- [x] Frontend загружен в GitHub
- [x] GitHub Actions настроен для автодеплоя
- [x] Backend готов к деплою на Render
- [x] SQL схема для Supabase подготовлена
- [x] API сервис создан во frontend
- [x] Документация по деплою готова
- [ ] GitHub Pages активирован
- [ ] Supabase проект создан
- [ ] Backend задеплоен на Render
- [ ] Telegram Bot создан и настроен
- [ ] Приложение протестировано в Telegram

## 📚 Документация

- [SETUP_GITHUB_PAGES.md](./SETUP_GITHUB_PAGES.md) - Активация GitHub Pages
- [BACKEND_DEPLOYMENT.md](./BACKEND_DEPLOYMENT.md) - Полный гайд по деплою
- [database/supabase_schema.sql](./database/supabase_schema.sql) - SQL схема

## 🔧 Архитектура

```
┌─────────────────┐
│  Telegram Bot   │  @HiFoodDeliveryBot
└────────┬────────┘
         │ Web App URL
         ▼
┌─────────────────────────────┐
│   Frontend (GitHub Pages)   │  React + TypeScript
│   https://raz-ar.github.io  │  + Telegram Web App SDK
└────────┬────────────────────┘
         │ API Calls
         ▼
┌─────────────────────────────┐
│   Backend (Render.com)      │  Express + TypeScript
│   hi-food-backend.onrender  │  + Abstract Data Layer
└────────┬────────────────────┘
         │ SQL Queries
         ▼
┌─────────────────────────────┐
│   Database (Supabase)       │  PostgreSQL
│   users, menu, orders, etc  │
└─────────────────────────────┘
```

## 🚀 Следующие шаги разработки

1. **Страница меню** (Home) - каталог блюд с фильтрами
2. **Профиль** (Profile) - информация о пользователе и бонусах
3. **Корзина** (Cart) - добавление товаров и оформление заказа
4. **История заказов** (OrderHistory) - список прошлых заказов
5. **Избранное** (Favorites) - сохранённые блюда
6. **Многоязычность** - переключение языков

## 📱 URL проекта

- **Frontend**: https://raz-ar.github.io/hifoodv1/
- **Backend**: https://hi-food-backend.onrender.com (после деплоя)
- **GitHub**: https://github.com/RAZ-AR/hifoodv1

---

**Создано с помощью Claude Code** 🤖

Telegram Mini App для доставки еды готов к деплою! 🍕✨
