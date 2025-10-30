-- Проверка загруженных данных меню

-- 1. Общее количество блюд
SELECT COUNT(*) as total_items FROM menu;

-- 2. Уникальные категории
SELECT DISTINCT category, COUNT(*) as items_count
FROM menu
GROUP BY category
ORDER BY items_count DESC;

-- 3. Уникальные подкатегории
SELECT DISTINCT sub_category, COUNT(*) as items_count
FROM menu
WHERE sub_category IS NOT NULL AND sub_category != ''
GROUP BY sub_category
ORDER BY items_count DESC;

-- 4. Проверка новых полей (вес, калории)
SELECT
    name,
    category,
    sub_category,
    price,
    weight,
    calories
FROM menu
WHERE weight IS NOT NULL OR calories IS NOT NULL
LIMIT 10;

-- 5. Все блюда с подкатегориями
SELECT
    category,
    sub_category,
    name,
    title,
    price
FROM menu
ORDER BY category, sub_category, name
LIMIT 20;
