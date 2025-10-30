-- Проверка: была ли создана колонка related_dishes

-- 1. Проверить существование колонки
SELECT
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'menu'
  AND column_name = 'related_dishes';

-- 2. Посмотреть структуру таблицы menu
SELECT
    column_name,
    data_type,
    column_default
FROM information_schema.columns
WHERE table_name = 'menu'
ORDER BY ordinal_position;

-- 3. Проверить индекс
SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'menu'
  AND indexname = 'idx_menu_related_dishes';
