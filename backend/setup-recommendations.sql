-- Настройка рекомендаций для блюд
-- Выполните ПОСЛЕ добавления напитков, соусов и салатов

-- ============================================
-- ШАБЛОН: Автоматическое создание рекомендаций
-- ============================================

-- Получаем UUID для использования в рекомендациях
DO $$
DECLARE
    -- Напитки
    cola_id UUID;
    sprite_id UUID;
    fanta_id UUID;
    water_still_id UUID;
    water_sparkling_id UUID;
    orange_juice_id UUID;
    apple_juice_id UUID;
    cherry_juice_id UUID;

    -- Соусы
    ketchup_id UUID;
    mayo_id UUID;
    garlic_id UUID;
    bbq_id UUID;
    cheese_sauce_id UUID;
    hot_sauce_id UUID;

    -- Салаты
    caesar_id UUID;
    greek_id UUID;
    vegetable_id UUID;
    caprese_id UUID;

    -- Переменные для цикла
    dish RECORD;
BEGIN
    -- Получаем UUID напитков
    SELECT id INTO cola_id FROM menu WHERE name = 'Coca-Cola 0.5л' LIMIT 1;
    SELECT id INTO sprite_id FROM menu WHERE name = 'Sprite 0.5л' LIMIT 1;
    SELECT id INTO fanta_id FROM menu WHERE name = 'Fanta Orange 0.5л' LIMIT 1;
    SELECT id INTO water_still_id FROM menu WHERE name = 'Вода негазированная 0.5л' LIMIT 1;
    SELECT id INTO water_sparkling_id FROM menu WHERE name = 'Вода газированная 0.5л' LIMIT 1;
    SELECT id INTO orange_juice_id FROM menu WHERE name = 'Апельсиновый сок 0.5л' LIMIT 1;
    SELECT id INTO apple_juice_id FROM menu WHERE name = 'Яблочный сок 0.5л' LIMIT 1;
    SELECT id INTO cherry_juice_id FROM menu WHERE name = 'Вишнёвый сок 0.5л' LIMIT 1;

    -- Получаем UUID соусов
    SELECT id INTO ketchup_id FROM menu WHERE name = 'Кетчуп' LIMIT 1;
    SELECT id INTO mayo_id FROM menu WHERE name = 'Майонез' LIMIT 1;
    SELECT id INTO garlic_id FROM menu WHERE name = 'Чесночный соус' LIMIT 1;
    SELECT id INTO bbq_id FROM menu WHERE name = 'Соус Барбекю' LIMIT 1;
    SELECT id INTO cheese_sauce_id FROM menu WHERE name = 'Сырный соус' LIMIT 1;
    SELECT id INTO hot_sauce_id FROM menu WHERE name = 'Острый соус' LIMIT 1;

    -- Получаем UUID салатов
    SELECT id INTO caesar_id FROM menu WHERE name = 'Салат Цезарь' LIMIT 1;
    SELECT id INTO greek_id FROM menu WHERE name = 'Греческий салат' LIMIT 1;
    SELECT id INTO vegetable_id FROM menu WHERE name = 'Овощной салат' LIMIT 1;
    SELECT id INTO caprese_id FROM menu WHERE name = 'Салат Капрезе' LIMIT 1;

    RAISE NOTICE '=== UUID получены ===';
    RAISE NOTICE 'Cola: %, Sprite: %, Fanta: %', cola_id, sprite_id, fanta_id;
    RAISE NOTICE 'Ketchup: %, Mayo: %, Garlic: %', ketchup_id, mayo_id, garlic_id;
    RAISE NOTICE 'Caesar: %, Greek: %, Vegetable: %', caesar_id, greek_id, vegetable_id;

    -- ============================================
    -- РЕКОМЕНДАЦИИ ДЛЯ ОСНОВНЫХ БЛЮД
    -- ============================================

    -- Для всех блюд категории "Бургеры" или с "Бургер" в названии
    FOR dish IN
        SELECT id, name FROM menu
        WHERE (category ILIKE '%бургер%' OR name ILIKE '%бургер%')
          AND available = true
    LOOP
        UPDATE menu
        SET related_dishes = jsonb_build_array(
            ketchup_id,
            cola_id,
            caesar_id
        )
        WHERE id = dish.id;

        RAISE NOTICE 'Рекомендации для %: Кетчуп, Кола, Цезарь', dish.name;
    END LOOP;

    -- Для всех блюд категории "Пицца" или с "Пицца" в названии
    FOR dish IN
        SELECT id, name FROM menu
        WHERE (category ILIKE '%пицц%' OR name ILIKE '%пицц%')
          AND available = true
    LOOP
        UPDATE menu
        SET related_dishes = jsonb_build_array(
            garlic_id,
            sprite_id,
            caprese_id
        )
        WHERE id = dish.id;

        RAISE NOTICE 'Рекомендации для %: Чесночный соус, Спрайт, Капрезе', dish.name;
    END LOOP;

    -- Для всех блюд категории "Паста" или с "Паста" в названии
    FOR dish IN
        SELECT id, name FROM menu
        WHERE (category ILIKE '%паст%' OR name ILIKE '%паст%')
          AND available = true
    LOOP
        UPDATE menu
        SET related_dishes = jsonb_build_array(
            cheese_sauce_id,
            orange_juice_id,
            caesar_id
        )
        WHERE id = dish.id;

        RAISE NOTICE 'Рекомендации для %: Сырный соус, Апельсиновый сок, Цезарь', dish.name;
    END LOOP;

    -- Для блюд с "Картофель" в названии
    FOR dish IN
        SELECT id, name FROM menu
        WHERE name ILIKE '%картофель%'
          AND available = true
    LOOP
        UPDATE menu
        SET related_dishes = jsonb_build_array(
            ketchup_id,
            bbq_id,
            mayo_id
        )
        WHERE id = dish.id;

        RAISE NOTICE 'Рекомендации для %: Кетчуп, Барбекю, Майонез', dish.name;
    END LOOP;

    -- Для салатов рекомендуем другие салаты и напитки
    IF caesar_id IS NOT NULL THEN
        UPDATE menu
        SET related_dishes = jsonb_build_array(
            greek_id,
            water_still_id,
            orange_juice_id
        )
        WHERE id = caesar_id;
        RAISE NOTICE 'Рекомендации для Цезарь: Греческий, Вода, Апельсиновый сок';
    END IF;

    IF greek_id IS NOT NULL THEN
        UPDATE menu
        SET related_dishes = jsonb_build_array(
            caesar_id,
            water_sparkling_id,
            cherry_juice_id
        )
        WHERE id = greek_id;
        RAISE NOTICE 'Рекомендации для Греческий: Цезарь, Газированная вода, Вишнёвый сок';
    END IF;

    IF vegetable_id IS NOT NULL THEN
        UPDATE menu
        SET related_dishes = jsonb_build_array(
            caprese_id,
            apple_juice_id,
            water_still_id
        )
        WHERE id = vegetable_id;
        RAISE NOTICE 'Рекомендации для Овощной: Капрезе, Яблочный сок, Вода';
    END IF;

    -- ============================================
    -- РЕКОМЕНДАЦИИ ДЛЯ НАПИТКОВ
    -- ============================================

    -- Для Колы
    IF cola_id IS NOT NULL THEN
        UPDATE menu
        SET related_dishes = jsonb_build_array(
            sprite_id,
            fanta_id,
            ketchup_id
        )
        WHERE id = cola_id;
    END IF;

    -- Для Спрайта
    IF sprite_id IS NOT NULL THEN
        UPDATE menu
        SET related_dishes = jsonb_build_array(
            cola_id,
            fanta_id,
            mayo_id
        )
        WHERE id = sprite_id;
    END IF;

    -- Для соков рекомендуем другие соки и воду
    IF orange_juice_id IS NOT NULL THEN
        UPDATE menu
        SET related_dishes = jsonb_build_array(
            apple_juice_id,
            cherry_juice_id,
            water_still_id
        )
        WHERE id = orange_juice_id;
    END IF;

    RAISE NOTICE '=== Рекомендации настроены! ===';
END $$;

-- ============================================
-- ПРОВЕРКА РЕЗУЛЬТАТОВ
-- ============================================

-- Посмотреть все блюда с рекомендациями
SELECT
    m.name AS "Блюдо",
    m.category AS "Категория",
    jsonb_array_length(m.related_dishes) AS "Количество рекомендаций",
    (
        SELECT string_agg(m2.name, ', ')
        FROM menu m2
        WHERE m2.id::text = ANY(SELECT jsonb_array_elements_text(m.related_dishes))
    ) AS "Рекомендованные блюда"
FROM menu m
WHERE related_dishes IS NOT NULL
  AND jsonb_array_length(related_dishes) > 0
ORDER BY m.category, m.name;
