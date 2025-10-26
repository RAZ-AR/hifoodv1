-- ============================================
-- ИСПРАВЛЕНИЕ ТАБЛИЦЫ ORDERS
-- ============================================
-- Скопируйте весь этот код и вставьте в Supabase SQL Editor
-- https://supabase.com/dashboard/project/ydhyiqnzlzvswqucmboq/sql/new

-- ШАГ 1: Удаляем старую таблицу (если есть)
-- ВНИМАНИЕ: Это удалит все существующие заказы!
-- Если хотите сохранить заказы, сначала сделайте backup:
-- SELECT * FROM orders; -- скопируйте результат

DROP TABLE IF EXISTS orders CASCADE;

-- ШАГ 2: Создаём таблицу заново с правильной схемой
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID,
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

-- ГОТОВО! Теперь таблица создана с правильной схемой
-- Проверьте, что всё работает, оформив тестовый заказ в приложении
