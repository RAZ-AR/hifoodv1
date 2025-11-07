-- ============================================
-- Migration: Add Delivery Zones Support
-- ============================================
-- Этот скрипт добавляет поддержку зон доставки с геолокацией
-- Запустите в Supabase SQL Editor после основного setup скрипта

-- ============================================
-- 1. Включаем расширение PostGIS для работы с геоданными
-- ============================================
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================
-- 2. Таблица зон доставки
-- ============================================
CREATE TABLE IF NOT EXISTS delivery_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Название и описание зоны
  name TEXT NOT NULL, -- например "Центр", "Нови Београд"
  description TEXT,

  -- Геометрия зоны (полигон на карте)
  -- SRID 4326 - это стандартная система координат (WGS84, используемая в GPS/Google Maps)
  boundary GEOGRAPHY(POLYGON, 4326) NOT NULL,

  -- Настройки доставки
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0, -- стоимость доставки в этой зоне
  free_delivery_threshold DECIMAL(10,2), -- сумма для бесплатной доставки (NULL = не доступна)
  min_order_amount DECIMAL(10,2), -- минимальная сумма заказа (NULL = нет минимума)
  estimated_delivery_time INTEGER, -- примерное время доставки в минутах

  -- Статус и приоритет
  is_active BOOLEAN DEFAULT true, -- активна ли зона
  priority INTEGER DEFAULT 0, -- приоритет (при пересечении зон выбирается зона с бОльшим приоритетом)

  -- Цвет для отображения на карте (hex)
  color TEXT DEFAULT '#4CAF50',

  -- Временные метки
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_delivery_zones_active ON delivery_zones(is_active);
CREATE INDEX IF NOT EXISTS idx_delivery_zones_priority ON delivery_zones(priority DESC);
-- Пространственный индекс для быстрого поиска по координатам
CREATE INDEX IF NOT EXISTS idx_delivery_zones_boundary ON delivery_zones USING GIST(boundary);

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_delivery_zones_updated_at BEFORE UPDATE ON delivery_zones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. Добавляем поля геолокации в таблицу orders
-- ============================================
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_coordinates GEOGRAPHY(POINT, 4326);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_zone_id UUID REFERENCES delivery_zones(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_zone_name TEXT;

-- Индексы для orders
CREATE INDEX IF NOT EXISTS idx_orders_delivery_zone ON orders(delivery_zone_id);
CREATE INDEX IF NOT EXISTS idx_orders_coordinates ON orders USING GIST(delivery_coordinates);

-- ============================================
-- 4. Функция проверки адреса в зоне доставки
-- ============================================
CREATE OR REPLACE FUNCTION check_address_in_delivery_zone(
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION
)
RETURNS TABLE(
  zone_id UUID,
  zone_name TEXT,
  delivery_fee DECIMAL(10,2),
  free_delivery_threshold DECIMAL(10,2),
  min_order_amount DECIMAL(10,2),
  estimated_delivery_time INTEGER,
  color TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    dz.id,
    dz.name,
    dz.delivery_fee,
    dz.free_delivery_threshold,
    dz.min_order_amount,
    dz.estimated_delivery_time,
    dz.color
  FROM delivery_zones dz
  WHERE
    dz.is_active = true
    AND ST_Contains(dz.boundary::geometry, ST_SetSRID(ST_MakePoint(lon, lat), 4326))
  ORDER BY dz.priority DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. Row Level Security для delivery_zones
-- ============================================
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;

-- Политики доступа (чтение для всех, запись только через service_role)
CREATE POLICY "Public read access for delivery zones"
  ON delivery_zones FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role full access to delivery zones"
  ON delivery_zones
  USING (true);

-- ============================================
-- 6. Вставляем примерные зоны доставки для Белграда
-- ============================================
-- ВАЖНО: Эти координаты примерные! Нужно настроить под реальные зоны доставки

-- Зона 1: Центр Белграда (самая дорогая зона)
INSERT INTO delivery_zones (name, description, boundary, delivery_fee, free_delivery_threshold, min_order_amount, estimated_delivery_time, priority, color)
VALUES (
  'Центр города',
  'Центральная часть Белграда',
  ST_GeogFromText('POLYGON((
    20.4470 44.8120,
    20.4750 44.8120,
    20.4750 44.7950,
    20.4470 44.7950,
    20.4470 44.8120
  ))'),
  200, -- 200 RSD за доставку
  2000, -- бесплатная доставка от 2000 RSD
  800, -- минимальный заказ 800 RSD
  25, -- 25 минут
  3, -- высокий приоритет
  '#4CAF50'
);

-- Зона 2: Нови Београд
INSERT INTO delivery_zones (name, description, boundary, delivery_fee, free_delivery_threshold, min_order_amount, estimated_delivery_time, priority, color)
VALUES (
  'Нови Београд',
  'Район Нови Београд',
  ST_GeogFromText('POLYGON((
    20.4000 44.8200,
    20.4400 44.8200,
    20.4400 44.7900,
    20.4000 44.7900,
    20.4000 44.8200
  ))'),
  300, -- 300 RSD за доставку
  2500, -- бесплатная доставка от 2500 RSD
  1000, -- минимальный заказ 1000 RSD
  35, -- 35 минут
  2, -- средний приоритет
  '#2196F3'
);

-- Зона 3: Земун
INSERT INTO delivery_zones (name, description, boundary, delivery_fee, free_delivery_threshold, min_order_amount, estimated_delivery_time, priority, color)
VALUES (
  'Земун',
  'Район Земун',
  ST_GeogFromText('POLYGON((
    20.3800 44.8600,
    20.4200 44.8600,
    20.4200 44.8300,
    20.3800 44.8300,
    20.3800 44.8600
  ))'),
  350, -- 350 RSD за доставку
  3000, -- бесплатная доставка от 3000 RSD
  1200, -- минимальный заказ 1200 RSD
  45, -- 45 минут
  1, -- низкий приоритет
  '#FF9800'
);

-- ============================================
-- Готово! Зоны доставки настроены
-- ============================================
-- Следующие шаги:
-- 1. Настройте реальные границы зон в Google Maps
-- 2. Скопируйте координаты полигонов и обновите данные
-- 3. Настройте цены и параметры доставки под ваш бизнес
