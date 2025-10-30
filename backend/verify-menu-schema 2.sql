-- ===============================================
-- ПРОВЕРКА СХЕМЫ ТАБЛИЦЫ MENU ПОСЛЕ МИГРАЦИИ
-- ===============================================

-- 1. Показать все колонки таблицы menu
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'menu'
ORDER BY ordinal_position;

-- 2. Проверить индексы
SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'menu';

-- 3. Показать несколько записей для проверки данных
SELECT
    id,
    category,
    sub_category,
    name,
    title,
    title_en,
    weight,
    calories,
    price
FROM menu
LIMIT 5;
