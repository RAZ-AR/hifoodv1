-- ============================================
-- Hi Food - Supabase Database Setup
-- ============================================
-- Этот скрипт создаёт все необходимые таблицы для приложения
-- Запустите его в Supabase SQL Editor

-- ============================================
-- 1. Таблица пользователей
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id BIGINT UNIQUE NOT NULL,
  telegram_username TEXT,
  first_name TEXT,
  last_name TEXT,
  phone_number TEXT,
  bonus_points INTEGER DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  loyalty_card_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_users_loyalty_card ON users(loyalty_card_number);

-- ============================================
-- 2. Таблица меню (с фото и весом!)
-- ============================================
CREATE TABLE IF NOT EXISTS menu (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  weight TEXT, -- например "350г" или "500мл"
  image_url TEXT, -- URL фотографии с ImgBB/Cloudinary
  is_available BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  discount_percentage INTEGER DEFAULT 0,
  allergens TEXT[], -- массив аллергенов ["молоко", "глютен"]
  ingredients TEXT[], -- массив ингредиентов
  calories INTEGER, -- калорийность
  protein DECIMAL(5,2), -- белки (г)
  fats DECIMAL(5,2), -- жиры (г)
  carbs DECIMAL(5,2), -- углеводы (г)
  sort_order INTEGER DEFAULT 0, -- порядок сортировки
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_menu_category ON menu(category);
CREATE INDEX IF NOT EXISTS idx_menu_available ON menu(is_available);
CREATE INDEX IF NOT EXISTS idx_menu_popular ON menu(is_popular);

-- ============================================
-- 3. Таблица заказов
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  telegram_id BIGINT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,

  -- Адрес доставки
  delivery_address JSONB NOT NULL, -- {street, building, apartment, entrance, floor, intercom}

  -- Товары
  items JSONB NOT NULL, -- массив [{id, name, price, quantity, weight, image_url}]

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
  status TEXT DEFAULT 'pending', -- pending, confirmed, preparing, delivering, completed, cancelled
  payment_method TEXT DEFAULT 'cash', -- cash, card
  payment_status TEXT DEFAULT 'pending', -- pending, paid, failed

  -- Комментарии
  customer_comment TEXT,
  kitchen_comment TEXT,

  -- Временные метки
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_orders_telegram_id ON orders(telegram_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- ============================================
-- 4. Таблица транзакций бонусов
-- ============================================
CREATE TABLE IF NOT EXISTS bonus_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  telegram_id BIGINT NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- earn, spend, admin_add, admin_remove
  amount INTEGER NOT NULL, -- положительное для начисления, отрицательное для списания
  balance_after INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_bonus_transactions_user_id ON bonus_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_bonus_transactions_telegram_id ON bonus_transactions(telegram_id);
CREATE INDEX IF NOT EXISTS idx_bonus_transactions_created_at ON bonus_transactions(created_at DESC);

-- ============================================
-- 5. Таблица рекламных баннеров
-- ============================================
CREATE TABLE IF NOT EXISTS ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  sort_order INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_ads_active ON ads(is_active);
CREATE INDEX IF NOT EXISTS idx_ads_dates ON ads(start_date, end_date);

-- ============================================
-- 6. Функция автоматического обновления updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Применяем триггеры
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_updated_at BEFORE UPDATE ON menu
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ads_updated_at BEFORE UPDATE ON ads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. Row Level Security (RLS) - базовая настройка
-- ============================================
-- Включаем RLS для безопасности
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE bonus_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

-- Политики доступа (все могут читать, только сервис может писать)
CREATE POLICY "Public read access for menu" ON menu FOR SELECT USING (true);
CREATE POLICY "Public read access for ads" ON ads FOR SELECT USING (is_active = true);

-- Для остальных таблиц нужна авторизация через service_role key
CREATE POLICY "Service role full access to users" ON users USING (true);
CREATE POLICY "Service role full access to orders" ON orders USING (true);
CREATE POLICY "Service role full access to bonus_transactions" ON bonus_transactions USING (true);

-- ============================================
-- Готово! Таблицы созданы.
-- ============================================
-- Следующий шаг: запустите скрипт populate-supabase.ts
-- для заполнения таблиц тестовыми данными
