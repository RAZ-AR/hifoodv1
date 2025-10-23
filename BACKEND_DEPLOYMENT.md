# 🚀 Backend Deployment Guide

## Backend репозиторий: Два варианта

### Вариант 1: Отдельный репозиторий (рекомендуется)

```bash
# Создайте новый репозиторий на GitHub: hifoodv1-backend
# Затем:

cd /Users/bari/Documents/GitHub/Hi_food/backend
git init
git add .
git commit -m "Initial commit: Hi Food Backend API"
git branch -M main
git remote add origin https://github.com/RAZ-AR/hifoodv1-backend.git
git push -u origin main
```

### Вариант 2: В том же репозитории (проще для разработки)

```bash
# Скопируем backend в текущий репозиторий
cp -r /Users/bari/Documents/GitHub/Hi_food/backend /Users/bari/Documents/GitHub/hifoodv1/
git add backend/
git commit -m "Add backend API"
git push
```

---

## 📋 Шаг 1: Supabase Database Setup

### 1.1 Создайте проект в Supabase

1. Откройте https://supabase.com
2. Sign in / Sign up
3. Click **New Project**
4. Заполните:
   - **Name**: `hi-food-db`
   - **Database Password**: (сохраните!)
   - **Region**: `Central EU` (ближайший регион)
5. Wait 2-3 minutes для создания

### 1.2 Создайте таблицы

1. Откройте **SQL Editor** в Supabase Dashboard
2. Скопируйте SQL из `/Users/bari/Documents/GitHub/Hi_food/database/supabase_schema.sql`
3. Выполните SQL
4. Проверьте в **Table Editor** - должны появиться таблицы: `users`, `menu`, `orders`, `ads`, `bonus_transactions`

### 1.3 Получите credentials

1. Откройте **Settings** → **API**
2. Скопируйте:
   - **Project URL**: `https://xxxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 📋 Шаг 2: Render.com Backend Deployment

### 2.1 Подготовка Backend

Создайте файл `backend/package.json` (если ещё нет):

```json
{
  "name": "hi-food-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "migrate": "tsx scripts/migrate-sheets-to-supabase.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "@supabase/supabase-js": "^2.38.4",
    "googleapis": "^126.0.1",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.20",
    "@types/cors": "^2.8.16",
    "@types/node": "^20.8.10",
    "typescript": "^5.2.2",
    "tsx": "^4.0.0"
  }
}
```

### 2.2 Deploy на Render

1. Откройте https://render.com
2. Sign in / Sign up (можно через GitHub)
3. Click **New** → **Web Service**
4. Connect к вашему GitHub репозиторию (`hifoodv1` или `hifoodv1-backend`)
5. Заполните:

```
Name: hi-food-backend
Region: Frankfurt (EU Central)
Branch: main
Root Directory: backend          (если backend в том же репо)
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
Instance Type: Free
```

6. Click **Advanced** → **Add Environment Variables**:

```
NODE_ENV=production
PORT=3000
DATA_PROVIDER=supabase
SUPABASE_URL=https://xxxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

7. Click **Create Web Service**
8. Дождитесь деплоя (5-10 минут)

### 2.3 Проверка Backend

После деплоя Render даст вам URL: `https://hi-food-backend.onrender.com`

Проверьте:

```bash
# Health check
curl https://hi-food-backend.onrender.com/health

# Должен вернуть:
# {"status":"ok","timestamp":"2024-10-23T..."}
```

⚠️ **Free tier холодный старт**: Первый запрос может занять 30-50 секунд, так как сервер "просыпается".

---

## 📋 Шаг 3: Обновить Frontend для API

Создайте файл `src/config/api.ts` в **frontend**:

```typescript
const API_BASE_URL = import.meta.env.PROD
  ? 'https://hi-food-backend.onrender.com/api'
  : 'http://localhost:3000/api';

export { API_BASE_URL };
```

Обновите `src/services/api.ts`:

```typescript
import { API_BASE_URL } from '@/config/api';

export const api = {
  async getUser(telegramId: number) {
    const response = await fetch(`${API_BASE_URL}/users/${telegramId}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  async createUser(userData: any) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },

  // ... другие методы
};
```

После изменений:

```bash
cd /Users/bari/Documents/GitHub/hifoodv1
git add .
git commit -m "Add backend API integration"
git push
```

GitHub Actions автоматически задеплоит обновлённый frontend.

---

## 📋 Шаг 4: Настройка Telegram Bot

### 4.1 Создание бота

1. Откройте Telegram → [@BotFather](https://t.me/BotFather)
2. Отправьте `/newbot`
3. **Name**: `Hi Food`
4. **Username**: `@HiFoodDeliveryBot` (или другой доступный)
5. Скопируйте **Bot Token**: `7123456789:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw`

### 4.2 Настройка Web App

Отправьте команды BotFather:

```
/setmenubutton
@HiFoodDeliveryBot
Открыть меню 🍕
https://raz-ar.github.io/hifoodv1/
```

### 4.3 Установка команд

```
/setcommands
@HiFoodDeliveryBot

start - Открыть приложение
menu - Показать меню
orders - Мои заказы
profile - Мой профиль
help - Помощь
```

### 4.4 Описание

```
/setdescription
@HiFoodDeliveryBot

Доставка вкусной еды прямо к вам! 🍕
Используйте карту лояльности для накопления бонусов.
```

### 4.5 Тестирование

1. Откройте вашего бота в Telegram
2. Нажмите **START**
3. Нажмите кнопку **"Открыть меню 🍕"** в меню
4. Должно открыться Web App с header и картой лояльности

---

## ✅ Checklist финального деплоя

- [ ] **Supabase**: Проект создан, таблицы созданы
- [ ] **Render**: Backend задеплоен, URL получен
- [ ] **Frontend**: API_BASE_URL обновлён, push сделан
- [ ] **GitHub Pages**: https://raz-ar.github.io/hifoodv1/ работает
- [ ] **Telegram Bot**: Создан, Web App URL установлен
- [ ] **Тестирование**: Открыли бота, Web App работает
- [ ] **Карта лояльности**: Отображается в header

---

## 🔧 Troubleshooting

### Backend не отвечает (Render)

```bash
# Это нормально для Free tier - первый запрос "будит" сервер
# Подождите 30-50 секунд, повторите запрос
curl https://hi-food-backend.onrender.com/health
```

### CORS ошибка в Console (F12)

Проверьте `backend/src/index.ts`:

```typescript
import cors from 'cors';

app.use(cors({
  origin: [
    'https://raz-ar.github.io',
    'http://localhost:5173'
  ]
}));
```

### Blank page на GitHub Pages

Откройте Console (F12), проверьте ошибки.
Убедитесь что `vite.config.ts` имеет `base: '/hifoodv1/'`

### Telegram Web App не открывается

1. Проверьте что URL правильный в BotFather
2. URL должен быть **HTTPS** (GitHub Pages автоматически использует HTTPS)
3. Откройте URL в браузере - должна открыться страница

---

## 📊 Архитектура системы

```
┌─────────────────┐
│  Telegram Bot   │  @HiFoodDeliveryBot
│   (BotFather)   │
└────────┬────────┘
         │ opens Web App URL
         ▼
┌─────────────────────────────┐
│   Frontend (GitHub Pages)   │  https://raz-ar.github.io/hifoodv1/
│   React + TypeScript        │
│   + Telegram Web App SDK    │
└────────┬────────────────────┘
         │ API calls
         ▼
┌─────────────────────────────┐
│   Backend (Render.com)      │  https://hi-food-backend.onrender.com
│   Express + TypeScript      │
│   + Data Provider Layer     │
└────────┬────────────────────┘
         │ queries
         ▼
┌─────────────────────────────┐
│   Database (Supabase)       │  PostgreSQL
│   users, menu, orders, etc  │
└─────────────────────────────┘
```

---

## 💰 Стоимость

```
Supabase Free:   $0/месяц (500 MB, 2 GB bandwidth)
Render Free:     $0/месяц (750 часов, холодные старты)
GitHub Pages:    $0/месяц (безлимит для публичных репо)
Telegram Bot:    $0/месяц (бесплатно)
───────────────────────────────────────────────────
ИТОГО:           $0/месяц ✅
```

---

## 🎯 Следующие шаги после деплоя

1. **Добавьте страницы**: Home, Profile, Cart, OrderHistory
2. **Интегрируйте API**: Подключите все компоненты к backend
3. **Тестируйте**: Создавайте заказы, проверяйте бонусы
4. **Мониторинг**: Проверяйте логи в Render Dashboard
5. **Оптимизация**: Добавьте кэширование, оптимизируйте запросы

---

**Backend готов к деплою! 🚀**
