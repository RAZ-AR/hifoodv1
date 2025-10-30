-- Добавление поля related_dishes для ручной связи блюд
-- Это позволит создавать кастомные рекомендации для каждого блюда

DO $$
BEGIN
  -- Проверяем, существует ли колонка related_dishes
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'menu' AND column_name = 'related_dishes'
  ) THEN
    ALTER TABLE menu ADD COLUMN related_dishes JSONB DEFAULT '[]'::jsonb;
    RAISE NOTICE 'Добавлена колонка related_dishes';
  ELSE
    RAISE NOTICE 'Колонка related_dishes уже существует';
  END IF;
END $$;

-- Комментарий к колонке
COMMENT ON COLUMN menu.related_dishes IS 'Массив ID связанных блюд для рекомендаций. Пример: ["uuid1", "uuid2", "uuid3"]';

-- Индекс для ускорения запросов
CREATE INDEX IF NOT EXISTS idx_menu_related_dishes ON menu USING GIN (related_dishes);

-- Пример использования:
-- UPDATE menu SET related_dishes = '["1234-5678-90ab-cdef", "abcd-efgh-1234-5678"]'::jsonb WHERE id = 'your-dish-id';
