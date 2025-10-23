-- ============================================
-- SUPABASE DATABASE SCHEMA
-- Food Delivery Telegram Mini App
-- ============================================

-- Включаем расширения
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ТАБЛИЦА: users (Пользователи)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  telegram_id BIGINT UNIQUE NOT NULL,
  telegram_username TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT,
  phone TEXT,
  email TEXT,

  -- КАРТА ЛОЯЛЬНОСТИ
  loyalty_card_number VARCHAR(4) UNIQUE NOT NULL,
  loyalty_card_issued_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- БОНУСНАЯ СИСТЕМА
  bonus_balance NUMERIC(10, 2) DEFAULT 0 CHECK (bonus_balance >= 0),
  total_bonus_earned NUMERIC(10, 2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  total_spent NUMERIC(10, 2) DEFAULT 0,

  -- СОХРАНЕННЫЕ ДАННЫЕ (JSON)
  addresses JSONB DEFAULT '[]'::jsonb,
  payment_methods JSONB DEFAULT '[]'::jsonb,
  favorite_dishes TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- НАСТРОЙКИ
  preferred_language VARCHAR(10) DEFAULT 'en' CHECK (preferred_language IN ('en', 'sr-lat', 'ru')),
  notifications_enabled BOOLEAN DEFAULT true,

  -- МЕТАДАННЫЕ
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_order_date TIMESTAMP WITH TIME ZONE,

  -- ИНДЕКСЫ
  CONSTRAINT chk_loyalty_card_format CHECK (loyalty_card_number ~ '^\d{4}$')
);

-- Индексы для users
CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_users_loyalty_card ON users(loyalty_card_number);
CREATE INDEX idx_users_last_order_date ON users(last_order_date);

-- ============================================
-- ТАБЛИЦА: menu (Меню ресторана)
-- ============================================
CREATE TABLE IF NOT EXISTS menu (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  ingredients TEXT[],
  rating NUMERIC(2, 1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  available BOOLEAN DEFAULT true,
  preparation_time INTEGER DEFAULT 0, -- в минутах
  allergens TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для menu
CREATE INDEX idx_menu_category ON menu(category);
CREATE INDEX idx_menu_available ON menu(available);
CREATE INDEX idx_menu_rating ON menu(rating DESC);

-- ============================================
-- ТАБЛИЦА: orders (Заказы)
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_phone TEXT NOT NULL,

  -- КАРТА ЛОЯЛЬНОСТИ (автоматически из профиля)
  loyalty_card_number VARCHAR(4) NOT NULL,

  -- СОСТАВ ЗАКАЗА (JSON)
  items JSONB NOT NULL,

  -- СУММЫ
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee NUMERIC(10, 2) DEFAULT 0 CHECK (delivery_fee >= 0),
  bonus_applied NUMERIC(10, 2) DEFAULT 0 CHECK (bonus_applied >= 0),

  -- ДОСТАВКА
  delivery_address JSONB NOT NULL,
  delivery_time TEXT NOT NULL, -- 'now' или ISO timestamp

  -- ОПЛАТА
  payment_method JSONB NOT NULL,

  -- СТАТУС
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'preparing', 'on_way', 'delivered', 'cancelled')
  ),

  -- МЕТАДАННЫЕ
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Индексы для orders
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_loyalty_card ON orders(loyalty_card_number);

-- ============================================
-- ТАБЛИЦА: ads (Рекламные баннеры)
-- ============================================
CREATE TABLE IF NOT EXISTS ads (
  ad_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  link TEXT,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0, -- порядок показа в карусели
  discount_percent NUMERIC(5, 2) CHECK (discount_percent >= 0 AND discount_percent <= 100),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для ads
CREATE INDEX idx_ads_active ON ads(active);
CREATE INDEX idx_ads_dates ON ads(start_date, end_date);
CREATE INDEX idx_ads_order ON ads("order");

-- ============================================
-- ТАБЛИЦА: bonus_transactions (История бонусов)
-- ============================================
CREATE TABLE IF NOT EXISTS bonus_transactions (
  transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  loyalty_card_number VARCHAR(4) NOT NULL,

  type TEXT NOT NULL CHECK (
    type IN ('earned', 'spent', 'admin_add', 'admin_remove')
  ),

  amount NUMERIC(10, 2) NOT NULL, -- положительное или отрицательное
  balance_before NUMERIC(10, 2) NOT NULL,
  balance_after NUMERIC(10, 2) NOT NULL,

  order_id UUID REFERENCES orders(order_id) ON DELETE SET NULL,
  reason TEXT, -- для админ-операций
  created_by TEXT, -- для админ-операций (telegram_id админа)

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для bonus_transactions
CREATE INDEX idx_bonus_user_id ON bonus_transactions(user_id);
CREATE INDEX idx_bonus_loyalty_card ON bonus_transactions(loyalty_card_number);
CREATE INDEX idx_bonus_created_at ON bonus_transactions(created_at DESC);
CREATE INDEX idx_bonus_type ON bonus_transactions(type);

-- ============================================
-- ФУНКЦИИ И ТРИГГЕРЫ
-- ============================================

-- Функция для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_menu_updated_at
    BEFORE UPDATE ON menu
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ads_updated_at
    BEFORE UPDATE ON ads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS (Row Level Security) - БЕЗОПАСНОСТЬ
-- ============================================

-- Включаем RLS для всех таблиц
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE bonus_transactions ENABLE ROW LEVEL SECURITY;

-- Политики для users
CREATE POLICY "Пользователи могут видеть только свои данные"
  ON users FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Пользователи могут обновлять только свои данные"
  ON users FOR UPDATE
  USING (auth.uid()::text = user_id::text);

-- Политики для menu (все могут читать)
CREATE POLICY "Все могут читать меню"
  ON menu FOR SELECT
  TO authenticated, anon
  USING (available = true);

-- Политики для orders
CREATE POLICY "Пользователи могут видеть только свои заказы"
  ON orders FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Пользователи могут создавать заказы"
  ON orders FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

-- Политики для ads (все могут читать активные)
CREATE POLICY "Все могут читать активную рекламу"
  ON ads FOR SELECT
  TO authenticated, anon
  USING (active = true AND NOW() BETWEEN start_date AND end_date);

-- Политики для bonus_transactions
CREATE POLICY "Пользователи могут видеть свои бонусные транзакции"
  ON bonus_transactions FOR SELECT
  USING (auth.uid()::text = user_id::text);

-- ============================================
-- ВЬЮШКИ ДЛЯ АНАЛИТИКИ
-- ============================================

-- Вьюшка: Статистика по пользователям
CREATE OR REPLACE VIEW user_stats AS
SELECT
  COUNT(*) as total_users,
  COUNT(CASE WHEN last_order_date >= NOW() - INTERVAL '30 days' THEN 1 END) as active_users,
  SUM(total_spent) as total_revenue,
  AVG(bonus_balance) as avg_bonus_balance
FROM users;

-- Вьюшка: Популярные блюда
CREATE OR REPLACE VIEW popular_dishes AS
SELECT
  m.id,
  m.name,
  m.category,
  m.price,
  m.rating,
  COUNT(o.order_id) as order_count
FROM menu m
LEFT JOIN orders o ON m.id::text = ANY(
  SELECT jsonb_array_elements(o.items)::jsonb->>'dish_id'
)
WHERE m.available = true
GROUP BY m.id, m.name, m.category, m.price, m.rating
ORDER BY order_count DESC;

-- Вьюшка: Статистика заказов
CREATE OR REPLACE VIEW order_stats AS
SELECT
  COUNT(*) as total_orders,
  COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
  COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders,
  SUM(total_amount) as total_revenue,
  AVG(total_amount) as avg_order_amount,
  SUM(delivery_fee) as total_delivery_fees
FROM orders;

-- ============================================
-- НАЧАЛЬНЫЕ ДАННЫЕ (SEED DATA)
-- ============================================

-- Добавить примеры данных можно здесь
-- Например:
/*
INSERT INTO menu (category, name, description, price, image_url, rating, available) VALUES
  ('Pizza', 'Margherita', 'Classic pizza with tomato sauce and mozzarella', 850, 'https://example.com/margherita.jpg', 4.5, true),
  ('Pizza', 'Pepperoni', 'Spicy pepperoni with cheese', 950, 'https://example.com/pepperoni.jpg', 4.7, true);
*/

-- ============================================
-- КОММЕНТАРИИ К ТАБЛИЦАМ
-- ============================================

COMMENT ON TABLE users IS 'Таблица пользователей приложения с картой лояльности';
COMMENT ON TABLE menu IS 'Меню ресторана с блюдами и ценами';
COMMENT ON TABLE orders IS 'Заказы пользователей с деталями доставки';
COMMENT ON TABLE ads IS 'Рекламные баннеры для карусели на главной странице';
COMMENT ON TABLE bonus_transactions IS 'История операций с бонусами';

COMMENT ON COLUMN users.loyalty_card_number IS 'Уникальный 4-значный номер карты лояльности (1000-9999)';
COMMENT ON COLUMN orders.loyalty_card_number IS 'Номер карты лояльности, использованной при заказе';
COMMENT ON COLUMN bonus_transactions.type IS 'Тип операции: earned (заработано), spent (потрачено), admin_add/remove (админ)';

-- ============================================
-- ЗАВЕРШЕНО
-- ============================================

-- Для проверки созданных таблиц:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
