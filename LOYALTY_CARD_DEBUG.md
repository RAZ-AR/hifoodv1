# Проблема с номером карты лояльности

## Анализ проблемы

Согласно вашему сообщению:
- ✅ Номер карты отображается в интерфейсе (CheckoutForm.tsx:393-406)
- ✅ Номер карты есть в заказе (передается через checkoutData)
- ❌ Номер карты НЕ записывается в таблицу БД

## Диагностика

### 1. Проверка потока данных

**Frontend → Backend:**
```typescript
// CheckoutForm.tsx (строка 48)
loyaltyCardNumber: user.loyalty_card_number || ''

// Cart.tsx → formatOrderData() → spread checkoutData
...checkoutData  // включает loyaltyCardNumber

// API отправка
orderData.loyaltyCardNumber  // camelCase
```

**Backend → БД:**
```typescript
// backend/src/index.ts (строка 214)
loyalty_card_number: orderData.loyaltyCardNumber || null  // snake_case
```

### 2. Возможные причины

1. **NULL значение** - если `loyaltyCardNumber` undefined/empty, то `|| null` даст `null`
2. **БД constraint** - возможно есть NOT NULL constraint или FK constraint
3. **RLS политики** - Row Level Security может блокировать вставку

## Решение

### Шаг 1: Добавить детальное логирование

В `backend/src/index.ts` (после строки 214):

```typescript
loyalty_card_number: orderData.loyaltyCardNumber || null,

// ДОБАВИТЬ ЭТУ СТРОКУ:
console.log('🎫 Loyalty Card Number:', orderData.loyaltyCardNumber, '→', orderData.loyaltyCardNumber || null);
```

### Шаг 2: Проверить схему таблицы orders

Выполните в Supabase SQL Editor:

```sql
-- Проверка структуры таблицы
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'orders' AND column_name = 'loyalty_card_number';

-- Проверка constraints
SELECT conname, contype, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'orders'::regclass
AND conname LIKE '%loyalty%';
```

### Шаг 3: Проверить RLS политики

```sql
-- Показать все политики для таблицы orders
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'orders';
```

### Шаг 4: Тестовая вставка

```sql
-- Попробовать вставить тестовую запись с loyalty_card_number
INSERT INTO orders (
  order_number,
  telegram_id,
  customer_name,
  customer_phone,
  loyalty_card_number,
  items,
  subtotal,
  total,
  status
) VALUES (
  'TEST-001',
  123456789,
  'Test User',
  '+381123456',
  '1234',  -- Тестовый номер карты
  '[]'::jsonb,
  1000,
  1000,
  'confirmed'
);
```

### Шаг 5: Исправление (если найдена проблема)

**Если колонка имеет NOT NULL constraint, но может быть пустой:**

```sql
ALTER TABLE orders ALTER COLUMN loyalty_card_number DROP NOT NULL;
```

**Если проблема в RLS:**

```sql
-- Временно отключить RLS для проверки
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- После проверки включить обратно
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
```

## Быстрый фикс

Добавьте логирование в `backend/src/index.ts` для отладки:

```typescript
console.log('📋 Order Data полностью:', JSON.stringify(orderData, null, 2));
console.log('🎫 Loyalty Card от клиента:', orderData.loyaltyCardNumber);

const orderToCreate = {
  // ... existing fields
  loyalty_card_number: orderData.loyaltyCardNumber || null,
  // ... rest
};

console.log('💾 Объект для сохранения в БД:', JSON.stringify(orderToCreate, null, 2));
```

## Проверка результата

После применения исправлений:

1. Создайте новый заказ через Mini App
2. Проверьте логи backend:
   ```bash
   cd backend
   npm run dev
   ```
3. Проверьте данные в БД:
   ```sql
   SELECT order_number, loyalty_card_number, created_at
   FROM orders
   ORDER BY created_at DESC
   LIMIT 5;
   ```
