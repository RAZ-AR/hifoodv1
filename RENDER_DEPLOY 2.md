# 🚀 Деплой Backend на Render.com

## Быстрый старт

Ваш проект уже настроен для автоматического деплоя на Render с помощью `render.yaml`.

---

## Шаг 1: Подготовка

✅ Все изменения уже закоммичены и запушены на GitHub
✅ Файл `render.yaml` создан в корне проекта
✅ Backend готов к деплою

---

## Шаг 2: Создание Web Service на Render

### Вариант A: Автоматический деплой через Blueprint (Рекомендуется)

1. Зайдите на https://dashboard.render.com
2. Нажмите **"New +"** → **"Blueprint"**
3. Подключите ваш GitHub репозиторий `hifoodv1`
4. Render автоматически найдет `render.yaml` и настроит сервис
5. Нажмите **"Apply"**

### Вариант B: Ручное создание

1. Зайдите на https://dashboard.render.com
2. Нажмите **"New +"** → **"Web Service"**
3. Подключите GitHub репозиторий `hifoodv1`
4. Заполните настройки:

**Основные настройки:**
```
Name: hifood-backend
Region: Frankfurt (или ближайший к Сербии)
Branch: main
Root Directory: backend
```

**Build & Deploy:**
```
Build Command: npm install && npm run build
Start Command: npm start
```

**Environment:**
- Node 18+

---

## Шаг 3: Настройка переменных окружения

В разделе **Environment Variables** добавьте:

### Обязательные переменные:

```env
NODE_ENV=production
PORT=3000
DATA_PROVIDER=mock
```

### Telegram Bot (Обязательно):

```env
TELEGRAM_BOT_TOKEN=8270751448:AAH6f6u2hCT0TAKSjVaCbWkwdqJWOmmYvqE
```

### CORS:

```env
ALLOWED_ORIGINS=https://raz-ar.github.io,https://hifoodv1.onrender.com
```

### Опционально - Supabase (если хотите использовать БД):

```env
SUPABASE_URL=ваш_url
SUPABASE_KEY=ваш_ключ
```

---

## Шаг 4: Деплой

1. Нажмите **"Create Web Service"** или **"Apply"** (для Blueprint)
2. Render начнет сборку и деплой (займет 3-5 минут)
3. Дождитесь статуса **"Live"** (зеленый)

---

## Шаг 5: Проверка

После деплоя ваш backend будет доступен по адресу:
```
https://hifood-backend.onrender.com
```

Проверьте health endpoint:
```bash
curl https://hifood-backend.onrender.com/health
```

Должен вернуть:
```json
{
  "status": "ok",
  "timestamp": "2025-10-24T...",
  "provider": "mock"
}
```

---

## Шаг 6: Обновление Frontend

После успешного деплоя backend нужно обновить URL в frontend:

### Файл: `/src/config/api.ts`

**До:**
```typescript
const API_BASE_URL = import.meta.env.PROD
  ? 'https://hifoodv1.onrender.com/api'  // ← старый URL
  : 'http://localhost:3000/api';
```

**После:**
```typescript
const API_BASE_URL = import.meta.env.PROD
  ? 'https://hifood-backend.onrender.com/api'  // ← новый URL
  : 'http://localhost:3000/api';
```

После изменения:
```bash
git add src/config/api.ts
git commit -m "Update backend URL to Render"
git push origin main
```

Frontend автоматически передеплоится на GitHub Pages в течение 1-2 минут.

---

## Шаг 7: Тестирование

1. Откройте https://raz-ar.github.io/hifoodv1/
2. Проверьте загрузку меню (должно показать 5 блюд из Mock Provider)
3. Добавьте товар в корзину
4. Оформите тестовый заказ:
   - Имя: Test User
   - Адрес: Кнеза Милоша 10
   - Квартира: 25
   - Telegram: выбрать
   - Оплата: Наличные
5. Проверьте:
   - ✅ Заказ должен прийти в группу Telegram `-3233318512`
   - ✅ Дубликат заказа должен прийти вам в личку бота

---

## 🔧 Возможные проблемы

### Проблема 1: Build Failed

**Ошибка:** `npm ERR! code ELIFECYCLE`

**Решение:**
1. Проверьте, что в `backend/package.json` есть скрипты:
   ```json
   "scripts": {
     "build": "tsc",
     "start": "node dist/index.js"
   }
   ```
2. Проверьте, что `tsconfig.json` корректен

### Проблема 2: Application Failed to Respond

**Ошибка:** Service не отвечает на health check

**Решение:**
1. Проверьте, что `PORT` установлен в `3000`
2. Проверьте логи в Render Dashboard → Logs
3. Убедитесь, что сервер слушает правильный порт:
   ```typescript
   const PORT = process.env.PORT || 3000;
   app.listen(PORT, '0.0.0.0', () => {...});
   ```

### Проблема 3: CORS Error

**Ошибка:** `Access to fetch ... has been blocked by CORS policy`

**Решение:**
1. Проверьте `ALLOWED_ORIGINS` в Render Environment Variables
2. Убедитесь, что включает `https://raz-ar.github.io`
3. Проверьте CORS конфигурацию в `backend/src/index.ts`:
   ```typescript
   app.use(cors({
     origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
     credentials: true
   }));
   ```

### Проблема 4: Telegram Bot не отправляет сообщения

**Ошибка:** Заказы не приходят в группу

**Решение:**
1. Проверьте `TELEGRAM_BOT_TOKEN` в Environment Variables
2. Убедитесь, что бот добавлен в группу `-3233318512`
3. Убедитесь, что бот является **администратором** группы
4. Дайте боту права:
   - Post Messages
   - Edit Messages
   - Delete Messages

---

## 📊 Мониторинг

### Render Dashboard
- **Logs:** Смотрите логи в реальном времени
- **Metrics:** CPU, Memory, Request Rate
- **Deploy History:** История деплоев

### Health Check
```bash
# Проверка работы сервера
curl https://hifood-backend.onrender.com/health

# Проверка меню
curl https://hifood-backend.onrender.com/api/menu

# Проверка статистики
curl https://hifood-backend.onrender.com/api/stats
```

---

## 🎯 Следующие шаги

После успешного деплоя:

1. ✅ Backend работает на Render
2. ✅ Frontend работает на GitHub Pages
3. ✅ Telegram бот отправляет уведомления

### Опционально:

1. **Подключить Supabase (база данных):**
   - Измените `DATA_PROVIDER=supabase` в Render
   - Добавьте `SUPABASE_URL` и `SUPABASE_KEY`
   - Restart service

2. **Настроить Custom Domain:**
   - Render Settings → Custom Domain
   - Добавьте ваш домен (например, api.hifood.rs)

3. **Включить автоматический деплой:**
   - Уже настроен через GitHub integration
   - Каждый push в `main` → автоматический деплой

---

## 💰 Стоимость

**Render Free Tier:**
- ✅ 750 часов в месяц (достаточно для 1 сервиса 24/7)
- ✅ Автоматический SSL сертификат
- ✅ Автоматические деплои из GitHub
- ⚠️ Засыпает после 15 минут бездействия (первый запрос будет медленным ~30 сек)
- ⚠️ 512 MB RAM, 0.1 CPU

**Если нужно больше:**
- Starter Plan: $7/месяц (без засыпания, больше ресурсов)

---

## 🆘 Помощь

Если что-то не работает:

1. **Проверьте логи:** Render Dashboard → Logs
2. **Проверьте переменные:** Render Dashboard → Environment
3. **Проверьте статус:** Render Dashboard → Events

**Полезные команды:**
```bash
# Локально протестировать билд
cd backend
npm install
npm run build
npm start

# Проверить переменные окружения
cat .env
```

---

## ✅ Checklist перед деплоем

- [ ] Все изменения закоммичены и запушены
- [ ] `render.yaml` создан в корне проекта
- [ ] Backend собирается локально (`npm run build`)
- [ ] Telegram Bot Token есть в `.env`
- [ ] Бот добавлен в группу кухни
- [ ] Бот является админом группы

---

**Готово!** Ваш backend готов к деплою на Render! 🎉
