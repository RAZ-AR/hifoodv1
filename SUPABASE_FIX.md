# Исправление таблицы orders в Supabase

## Проблема
При оформлении заказов возникают ошибки типа:
- "Could not find the 'customer_comment' column"
- "Could not find the 'bonus_points_earned' column"

Это означает, что таблица `orders` в Supabase не соответствует ожидаемой схеме.

## Решение

### Вариант 1: Пересоздать таблицу (РЕКОМЕНДУЕТСЯ)

1. Откройте Supabase SQL Editor:
   https://supabase.com/dashboard/project/ydhyiqnzlzvswqucmboq/sql/new

2. **Удалите старую таблицу** (если есть заказы, сначала сделайте backup!):
   ```sql
   DROP TABLE IF EXISTS orders CASCADE;
   ```

3. **Создайте таблицу заново** из файла `backend/supabase-setup.sql`:
   - Откройте файл `backend/supabase-setup.sql`
   - Скопируйте весь SQL код (начиная с `-- 3. Таблица заказов`)
   - Вставьте в SQL Editor
   - Нажмите "Run"

### Вариант 2: Добавить недостающие колонки

Если у вас уже есть заказы в таблице, добавьте недостающие поля:

```sql
-- Добавляем недостающие колонки
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

### Вариант 3: Минимальная схема (текущее решение)

Backend сейчас настроен на работу с минимальным набором полей:
- order_number
- telegram_id
- customer_name
- customer_phone
- items (JSONB)
- subtotal
- total
- delivery_address (JSONB)
- status
- payment_method
- created_at

Убедитесь, что хотя бы эти поля есть в таблице.

## Проверка

После настройки проверьте, что заказы создаются без ошибок:

1. Откройте Telegram Mini App
2. Добавьте товары в корзину
3. Оформите заказ
4. Проверьте:
   - ✅ Сообщение пришло в Telegram (бот + группа кухни)
   - ✅ Показалось сообщение "Спасибо за заказ!"
   - ✅ Нет ошибки "Failed to send order"
   - ✅ Возврат на главный экран

## Текущая схема таблицы

Посмотреть текущую схему можно в Supabase:
https://supabase.com/dashboard/project/ydhyiqnzlzvswqucmboq/editor

Или через SQL:
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;
```
