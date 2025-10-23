# 🗄️ Настройка Supabase для Hi Food

Пошаговая инструкция по созданию и настройке базы данных Supabase.

## ✅ Что уже готово

- ✅ Backend задеплоен на Render.com: https://hifoodv1.onrender.com
- ✅ Frontend на GitHub Pages (готов к деплою)
- ✅ SQL схемы подготовлены
- ✅ Тестовые данные готовы

---

## 📋 Шаг 1: Создание проекта Supabase

### 1.1 Регистрация

1. Откройте https://supabase.com
2. Click **Start your project** или **Sign In**
3. Войдите через GitHub (рекомендуется)

### 1.2 Создание проекта

1. Click **New Project**
2. Выберите Organization (или создайте новую)
3. Заполните данные:

```
Project Name: hi-food-db
Database Password: [придумайте надёжный пароль и СОХРАНИТЕ его!]
Region: Central EU (Frankfurt) - ближайший к Сербии
Pricing Plan: Free (включает 500 MB database)
```

4. Click **Create new project**
5. ⏳ Подождите 2-3 минуты, пока проект создаётся

---

## 📋 Шаг 2: Создание таблиц (SQL Schema)

### 2.1 Открыть SQL Editor

1. В левом меню выберите **SQL Editor**
2. Click **New Query**

### 2.2 Выполнить схему базы данных

1. Откройте файл `database/supabase_schema.sql` в вашем проекте
2. Скопируйте ВЕСЬ текст из файла
3. Вставьте в SQL Editor в Supabase
4. Click **Run** (или Ctrl+Enter)

✅ Вы должны увидеть сообщение: **Success. No rows returned**

### 2.3 Проверка таблиц

1. В левом меню выберите **Table Editor**
2. Вы должны увидеть созданные таблицы:
   - ✅ `users` - пользователи
   - ✅ `menu` - меню блюд
   - ✅ `orders` - заказы
   - ✅ `ads` - рекламные баннеры
   - ✅ `bonus_transactions` - бонусные транзакции

---

## 📋 Шаг 3: Добавление тестовых данных

### 3.1 Загрузка данных

1. Вернитесь в **SQL Editor**
2. Click **New Query**
3. Откройте файл `database/sample_data.sql`
4. Скопируйте ВЕСЬ текст
5. Вставьте в SQL Editor
6. Click **Run**

✅ Вы должны увидеть результат:

```
info                      | count
--------------------------+-------
Добавлено блюд:          | 25
Добавлено баннеров:      | 3
```

### 3.2 Проверка данных

**Проверить меню:**
1. Перейдите в **Table Editor** → `menu`
2. Вы должны увидеть 25 блюд (пицца, бургеры, суши, паста и т.д.)

**Проверить баннеры:**
1. **Table Editor** → `ads`
2. Вы должны увидеть 3 рекламных баннера

---

## 📋 Шаг 4: Получение API ключей

### 4.1 Открыть настройки API

1. В левом меню выберите **Settings** (⚙️)
2. Выберите **API**

### 4.2 Скопировать credentials

Вам нужны два значения:

**1. Project URL:**
```
https://xxxxxxxxxxxxx.supabase.co
```

**2. anon/public key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZi...
(очень длинная строка)
```

⚠️ **НЕ КОПИРУЙТЕ service_role key** - это секретный ключ для админки!

### 4.3 Сохраните credentials

Скопируйте и сохраните эти значения в безопасное место. Они понадобятся в следующем шаге.

---

## 📋 Шаг 5: Настройка Render.com (обновление переменных)

### 5.1 Открыть Render Dashboard

1. Откройте https://dashboard.render.com
2. Найдите ваш сервис: **hifoodv1**
3. Перейдите в **Environment**

### 5.2 Проверить переменные окружения

Убедитесь что у вас есть эти переменные:

```
NODE_ENV=production
PORT=3000
DATA_PROVIDER=supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ Если переменные уже там - всё ОК!
❌ Если нет - добавьте их и сохраните

### 5.3 Перезапуск (если нужно)

Если вы изменили переменные окружения:
1. Click **Manual Deploy** → **Deploy latest commit**
2. Подождите 3-5 минут

---

## 🧪 Шаг 6: Тестирование API

### 6.1 Проверка подключения

Откройте в браузере или выполните в терминале:

```bash
curl https://hifoodv1.onrender.com/health
```

✅ Должен вернуть:
```json
{
  "status": "ok",
  "timestamp": "2025-10-23T...",
  "provider": "supabase"
}
```

### 6.2 Проверка статистики

```bash
curl https://hifoodv1.onrender.com/api/stats
```

✅ Должен вернуть:
```json
{
  "totalUsers": 0,
  "totalOrders": 0,
  "totalRevenue": 0,
  "activeUsers": 0
}
```

### 6.3 Проверка меню

```bash
curl https://hifoodv1.onrender.com/api/menu
```

✅ Должен вернуть массив из 25 блюд:
```json
[
  {
    "id": "...",
    "name": "Маргарита",
    "category": "Пицца",
    "price": 850,
    ...
  },
  ...
]
```

---

## ✅ Checklist

После выполнения всех шагов:

- [ ] Проект Supabase создан
- [ ] SQL схема выполнена (5 таблиц созданы)
- [ ] Тестовые данные загружены (25 блюд, 3 баннера)
- [ ] API credentials скопированы
- [ ] Render переменные окружения настроены
- [ ] Health check работает
- [ ] API /menu возвращает блюда

---

## 🎯 Что дальше?

После успешной настройки Supabase:

**1. GitHub Pages** - активировать frontend (уже готов)
**2. Telegram Bot** - создать и настроить бота
**3. Тестирование** - открыть приложение в Telegram

---

## 💡 Полезные команды SQL

### Посмотреть все таблицы:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

### Посмотреть количество записей:
```sql
SELECT
  'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'menu', COUNT(*) FROM menu
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'ads', COUNT(*) FROM ads;
```

### Удалить все данные (если нужно начать заново):
```sql
TRUNCATE users, menu, orders, ads, bonus_transactions RESTART IDENTITY CASCADE;
```

---

## 🔧 Troubleshooting

### Ошибка: "relation does not exist"

Значит таблицы не созданы. Выполните `supabase_schema.sql` заново.

### Ошибка: "duplicate key value"

Вы пытаетесь загрузить данные дважды. Сначала очистите таблицы:
```sql
TRUNCATE menu, ads RESTART IDENTITY CASCADE;
```

### Backend возвращает пустой массив []

1. Проверьте что данные есть в Supabase (Table Editor → menu)
2. Проверьте что SUPABASE_URL и SUPABASE_KEY правильные в Render
3. Проверьте логи в Render Dashboard

---

## 📚 Документация

- **Supabase Docs**: https://supabase.com/docs
- **SQL Tutorial**: https://supabase.com/docs/guides/database
- **Render Docs**: https://render.com/docs

---

**База данных готова! 🎉**

Supabase настроен и готов к работе с приложением Hi Food.
