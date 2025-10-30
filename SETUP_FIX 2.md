# 🔧 Исправление таблицы Orders - Инструкция

## ❌ Текущая проблема

При оформлении заказов возникает ошибка:
```
Could not find the 'customer_comment' column of 'orders' in the schema cache
```

Это означает, что таблица `orders` в Supabase не содержит все необходимые поля.

---

## ✅ Решение (2 минуты)

### Шаг 1: Откройте Supabase SQL Editor

Перейдите по ссылке:
👉 **https://supabase.com/dashboard/project/ydhyiqnzlzvswqucmboq/sql/new**

### Шаг 2: Скопируйте SQL скрипт

Откройте файл `FIX_ORDERS_TABLE.sql` в этом проекте и скопируйте весь его содержимый.

Или скопируйте код ниже:

```sql
-- ============================================
-- ИСПРАВЛЕНИЕ ТАБЛИЦЫ ORDERS
-- ============================================

-- ШАГ 1: Удаляем старую таблицу (если есть)
-- ВНИМАНИЕ: Это удалит все существующие заказы!
DROP TABLE IF EXISTS orders CASCADE;

-- ШАГ 2: Создаём таблицу заново с правильной схемой
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  telegram_id BIGINT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,

  -- Адрес доставки
  delivery_address JSONB NOT NULL,

  -- Товары
  items JSONB NOT NULL,

  -- Суммы
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,

  -- Бонусы
  bonus_points_used INTEGER DEFAULT 0,
  bonus_points_earned INTEGER DEFAULT 0,
  loyalty_card_number TEXT,

  -- Статус
  status TEXT DEFAULT 'pending',
  payment_method TEXT DEFAULT 'cash',
  payment_status TEXT DEFAULT 'pending',

  -- Комментарии
  customer_comment TEXT,
  kitchen_comment TEXT,

  -- Временные метки
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE
);

-- ШАГ 3: Создаём индексы для быстрого поиска
CREATE INDEX idx_orders_telegram_id ON orders(telegram_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- ШАГ 4: Настройка Row Level Security (RLS)
-- Отключаем RLS для простоты (можно включить позже)
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
```

### Шаг 3: Выполните скрипт

1. Вставьте скопированный код в SQL Editor
2. Нажмите кнопку **"Run"** (или Ctrl+Enter)
3. Дождитесь сообщения об успешном выполнении

### Шаг 4: Проверка

После выполнения скрипта проверьте работу:

1. Откройте Telegram Mini App
2. Добавьте товары в корзину
3. Оформите заказ
4. Убедитесь что:
   - ✅ Сообщение пришло в Telegram (бот + группа кухни)
   - ✅ Показалось "Спасибо за заказ!"
   - ✅ Нет ошибки "Failed to send order"
   - ✅ Приложение вернулось на главный экран
   - ✅ Заказ сохранился в базе данных

---

## 📋 Что было исправлено

### До исправления:
- ❌ Отсутствовали поля: `customer_comment`, `kitchen_comment`, `payment_status`
- ❌ Отсутствовали поля для бонусов: `bonus_points_used`, `bonus_points_earned`
- ❌ Отсутствовало поле `loyalty_card_number`
- ❌ Заказы не сохранялись из-за несоответствия схемы

### После исправления:
- ✅ Все необходимые поля добавлены
- ✅ Индексы для быстрого поиска созданы
- ✅ Заказы сохраняются корректно
- ✅ Номер карты лояльности записывается
- ✅ Комментарии клиента сохраняются

---

## 🔍 Проверить текущую схему таблицы

Если хотите посмотреть текущие поля таблицы, выполните в SQL Editor:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;
```

---

## 🆘 Если что-то пошло не так

1. **Ошибка при выполнении SQL:**
   - Убедитесь, что скопировали весь код
   - Проверьте, что нет лишних символов

2. **Заказы всё равно не создаются:**
   - Проверьте логи backend на Render.com
   - Откройте консоль браузера (F12) и проверьте ошибки
   - Напишите мне ошибку, которую видите

3. **Нужна помощь:**
   - Пришлите скриншот ошибки
   - Пришлите логи из Render.com
   - Я помогу разобраться!

---

## 📚 Дополнительно

### Бэкап заказов (если они были)

Если у вас уже есть заказы и вы хотите их сохранить перед пересозданием таблицы:

```sql
-- Создайте бэкап
CREATE TABLE orders_backup AS SELECT * FROM orders;

-- После пересоздания можно восстановить данные:
-- INSERT INTO orders SELECT * FROM orders_backup;
```

### Альтернатива: добавить только недостающие поля

Если не хотите удалять существующие заказы, можно добавить только недостающие поля:

```sql
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS bonus_points_used INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS bonus_points_earned INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS loyalty_card_number TEXT,
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS customer_comment TEXT,
  ADD COLUMN IF NOT EXISTS kitchen_comment TEXT,
  ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE;
```

Но рекомендуется всё же пересоздать таблицу для чистоты схемы.
