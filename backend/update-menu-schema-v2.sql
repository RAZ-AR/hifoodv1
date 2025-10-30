-- ===============================================
-- SQL МИГРАЦИЯ ДЛЯ ОБНОВЛЕНИЯ СХЕМЫ ТАБЛИЦЫ MENU (v2)
-- ===============================================
-- Упрощенная версия с проверками

-- Проверяем существование таблицы
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'menu') THEN
        RAISE EXCEPTION 'Таблица menu не существует!';
    END IF;
END $$;

-- 1. Добавляем колонки для подкатегорий
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu' AND column_name = 'sub_category') THEN
        ALTER TABLE menu ADD COLUMN sub_category TEXT;
        RAISE NOTICE 'Добавлена колонка sub_category';
    ELSE
        RAISE NOTICE 'Колонка sub_category уже существует';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu' AND column_name = 'sub_category_en') THEN
        ALTER TABLE menu ADD COLUMN sub_category_en TEXT;
        RAISE NOTICE 'Добавлена колонка sub_category_en';
    ELSE
        RAISE NOTICE 'Колонка sub_category_en уже существует';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu' AND column_name = 'sub_category_sr') THEN
        ALTER TABLE menu ADD COLUMN sub_category_sr TEXT;
        RAISE NOTICE 'Добавлена колонка sub_category_sr';
    ELSE
        RAISE NOTICE 'Колонка sub_category_sr уже существует';
    END IF;
END $$;

-- 2. Добавляем колонки для названий (многоязычные)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu' AND column_name = 'title') THEN
        ALTER TABLE menu ADD COLUMN title TEXT;
        RAISE NOTICE 'Добавлена колонка title';
    ELSE
        RAISE NOTICE 'Колонка title уже существует';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu' AND column_name = 'title_en') THEN
        ALTER TABLE menu ADD COLUMN title_en TEXT;
        RAISE NOTICE 'Добавлена колонка title_en';
    ELSE
        RAISE NOTICE 'Колонка title_en уже существует';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu' AND column_name = 'title_sr') THEN
        ALTER TABLE menu ADD COLUMN title_sr TEXT;
        RAISE NOTICE 'Добавлена колонка title_sr';
    ELSE
        RAISE NOTICE 'Колонка title_sr уже существует';
    END IF;
END $$;

-- 3. Добавляем колонки для описаний (многоязычные)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu' AND column_name = 'description_en') THEN
        ALTER TABLE menu ADD COLUMN description_en TEXT;
        RAISE NOTICE 'Добавлена колонка description_en';
    ELSE
        RAISE NOTICE 'Колонка description_en уже существует';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu' AND column_name = 'description_sr') THEN
        ALTER TABLE menu ADD COLUMN description_sr TEXT;
        RAISE NOTICE 'Добавлена колонка description_sr';
    ELSE
        RAISE NOTICE 'Колонка description_sr уже существует';
    END IF;
END $$;

-- 4. Добавляем колонки для веса и калорий
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu' AND column_name = 'weight') THEN
        ALTER TABLE menu ADD COLUMN weight TEXT;
        RAISE NOTICE 'Добавлена колонка weight';
    ELSE
        RAISE NOTICE 'Колонка weight уже существует';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu' AND column_name = 'calories') THEN
        ALTER TABLE menu ADD COLUMN calories INTEGER;
        RAISE NOTICE 'Добавлена колонка calories';
    ELSE
        RAISE NOTICE 'Колонка calories уже существует';
    END IF;
END $$;

-- 5. Создаем индексы (если не существуют)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_menu_category') THEN
        CREATE INDEX idx_menu_category ON menu(category);
        RAISE NOTICE 'Создан индекс idx_menu_category';
    ELSE
        RAISE NOTICE 'Индекс idx_menu_category уже существует';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_menu_sub_category') THEN
        CREATE INDEX idx_menu_sub_category ON menu(sub_category);
        RAISE NOTICE 'Создан индекс idx_menu_sub_category';
    ELSE
        RAISE NOTICE 'Индекс idx_menu_sub_category уже существует';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_menu_available') THEN
        CREATE INDEX idx_menu_available ON menu(available);
        RAISE NOTICE 'Создан индекс idx_menu_available';
    ELSE
        RAISE NOTICE 'Индекс idx_menu_available уже существует';
    END IF;
END $$;

-- 6. Обновляем существующие записи (заполняем title из name, если title пустой)
UPDATE menu
SET title = name
WHERE title IS NULL AND name IS NOT NULL;

-- Показываем финальную структуру таблицы
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'menu'
ORDER BY ordinal_position;
