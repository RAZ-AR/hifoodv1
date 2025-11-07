-- ============================================
-- Функции для управления зонами доставки
-- ============================================

-- Функция для создания зоны доставки
CREATE OR REPLACE FUNCTION create_delivery_zone(
  zone_name TEXT,
  zone_description TEXT,
  zone_boundary TEXT, -- WKT формат
  zone_delivery_fee DECIMAL(10,2),
  zone_free_threshold DECIMAL(10,2),
  zone_min_order DECIMAL(10,2),
  zone_delivery_time INTEGER,
  zone_priority INTEGER,
  zone_color TEXT
)
RETURNS UUID AS $$
DECLARE
  new_zone_id UUID;
BEGIN
  INSERT INTO delivery_zones (
    name,
    description,
    boundary,
    delivery_fee,
    free_delivery_threshold,
    min_order_amount,
    estimated_delivery_time,
    priority,
    color,
    is_active
  ) VALUES (
    zone_name,
    zone_description,
    ST_GeogFromText(zone_boundary),
    zone_delivery_fee,
    zone_free_threshold,
    zone_min_order,
    zone_delivery_time,
    zone_priority,
    zone_color,
    true
  )
  RETURNING id INTO new_zone_id;

  RETURN new_zone_id;
END;
$$ LANGUAGE plpgsql;

-- Функция для обновления зоны доставки
CREATE OR REPLACE FUNCTION update_delivery_zone(
  zone_id UUID,
  zone_name TEXT,
  zone_description TEXT,
  zone_boundary TEXT, -- WKT формат
  zone_delivery_fee DECIMAL(10,2),
  zone_free_threshold DECIMAL(10,2),
  zone_min_order DECIMAL(10,2),
  zone_delivery_time INTEGER,
  zone_priority INTEGER,
  zone_color TEXT
)
RETURNS VOID AS $$
BEGIN
  UPDATE delivery_zones
  SET
    name = zone_name,
    description = zone_description,
    boundary = ST_GeogFromText(zone_boundary),
    delivery_fee = zone_delivery_fee,
    free_delivery_threshold = zone_free_threshold,
    min_order_amount = zone_min_order,
    estimated_delivery_time = zone_delivery_time,
    priority = zone_priority,
    color = zone_color,
    updated_at = NOW()
  WHERE id = zone_id;
END;
$$ LANGUAGE plpgsql;

-- Функция для деактивации зоны
CREATE OR REPLACE FUNCTION deactivate_delivery_zone(zone_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE delivery_zones
  SET is_active = false, updated_at = NOW()
  WHERE id = zone_id;
END;
$$ LANGUAGE plpgsql;

-- Функция для активации зоны
CREATE OR REPLACE FUNCTION activate_delivery_zone(zone_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE delivery_zones
  SET is_active = true, updated_at = NOW()
  WHERE id = zone_id;
END;
$$ LANGUAGE plpgsql;
