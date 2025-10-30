-- ===============================================
-- SQL МИГРАЦИЯ ДЛЯ ОБНОВЛЕНИЯ СХЕМЫ ТАБЛИЦЫ MENU
-- ===============================================
-- Добавление полей для многоязычности, подкатегорий, веса и калорий
-- Дата: 2025-10-30

-- 1. Добавляем поля для подкатегорий (многоязычные)
ALTER TABLE menu ADD COLUMN IF NOT EXISTS sub_category TEXT;
ALTER TABLE menu ADD COLUMN IF NOT EXISTS sub_category_en TEXT;
ALTER TABLE menu ADD COLUMN IF NOT EXISTS sub_category_sr TEXT;

-- 2. Добавляем поля для названий (многоязычные)
ALTER TABLE menu ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE menu ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE menu ADD COLUMN IF NOT EXISTS title_sr TEXT;

-- 3. Добавляем поля для описаний (многоязычные)
ALTER TABLE menu ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE menu ADD COLUMN IF NOT EXISTS description_sr TEXT;

-- 4. Добавляем поля для веса и калорий
ALTER TABLE menu ADD COLUMN IF NOT EXISTS weight TEXT;
ALTER TABLE menu ADD COLUMN IF NOT EXISTS calories INTEGER;

-- 5. Создаем индексы для ускорения поиска
CREATE INDEX IF NOT EXISTS idx_menu_category ON menu(category);
CREATE INDEX IF NOT EXISTS idx_menu_sub_category ON menu(sub_category);
CREATE INDEX IF NOT EXISTS idx_menu_available ON menu(available);

-- 6. Обновляем существующие записи (если нужно заполнить title из name)
UPDATE menu
SET title = name
WHERE title IS NULL AND name IS NOT NULL;

-- ===============================================
-- ПРОВЕРКА РЕЗУЛЬТАТА
-- ===============================================
-- Запросите информацию о структуре таблицы:
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'menu';

-- ===============================================
-- ROLLBACK (если нужно откатить изменения)
-- ===============================================
-- ALTER TABLE menu DROP COLUMN IF EXISTS sub_category;
-- ALTER TABLE menu DROP COLUMN IF EXISTS sub_category_en;
-- ALTER TABLE menu DROP COLUMN IF EXISTS sub_category_sr;
-- ALTER TABLE menu DROP COLUMN IF EXISTS title;
-- ALTER TABLE menu DROP COLUMN IF EXISTS title_en;
-- ALTER TABLE menu DROP COLUMN IF EXISTS title_sr;
-- ALTER TABLE menu DROP COLUMN IF EXISTS description_en;
-- ALTER TABLE menu DROP COLUMN IF EXISTS description_sr;
-- ALTER TABLE menu DROP COLUMN IF EXISTS weight;
-- ALTER TABLE menu DROP COLUMN IF EXISTS calories;
-- DROP INDEX IF EXISTS idx_menu_category;
-- DROP INDEX IF EXISTS idx_menu_sub_category;
-- DROP INDEX IF EXISTS idx_menu_available;
