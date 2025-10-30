# Система рекомендаций блюд

## Обзор

Система рекомендаций позволяет показывать пользователям связанные блюда в двух местах:
1. **В модальном окне блюда** - 3 рекомендованных блюда со свайпом
2. **В форме оформления заказа** - 3 дополнительных блюда для заказа

## Как работают рекомендации

Система использует **гибридный подход**:

### 1. Ручные связи (приоритет)
Если для блюда заданы ручные связи через поле `related_dishes`, они будут показаны первыми.

### 2. Автоматические связи (fallback)
Если ручных связей нет или их недостаточно, система автоматически находит блюда:
- Из той же подкатегории
- Из той же категории

## Настройка ручных связей

### Шаг 1: Добавить колонку в БД

Выполните SQL миграцию в Supabase:

```bash
cat backend/add-related-dishes-column.sql | pbcopy
```

Затем вставьте и выполните в Supabase SQL Editor.

### Шаг 2: Найти ID блюд

Чтобы связать блюда, нужны их UUID. Получите их через Supabase:

```sql
SELECT id, name, category, sub_category
FROM menu
WHERE available = true
ORDER BY category, sub_category, name;
```

### Шаг 3: Установить связи

Обновите блюдо с ручными связями:

```sql
UPDATE menu
SET related_dishes = '["uuid-блюда-1", "uuid-блюда-2", "uuid-блюда-3"]'::jsonb
WHERE id = 'uuid-вашего-блюда';
```

**Примеры связей:**

```sql
-- Пример: Для пиццы Маргарита рекомендуем другие пиццы
UPDATE menu
SET related_dishes = '[
  "550e8400-e29b-41d4-a716-446655440001",
  "550e8400-e29b-41d4-a716-446655440002",
  "550e8400-e29b-41d4-a716-446655440003"
]'::jsonb
WHERE name = 'Пицца Маргарита';

-- Пример: Для бургера рекомендуем картофель фри, напиток и десерт
UPDATE menu
SET related_dishes = '[
  "uuid-картофель-фри",
  "uuid-кола",
  "uuid-чизкейк"
]'::jsonb
WHERE name = 'Чизбургер';

-- Пример: Для салата рекомендуем другие салаты
UPDATE menu
SET related_dishes = '[
  "uuid-салат-цезарь",
  "uuid-салат-греческий",
  "uuid-салат-оливье"
]'::jsonb
WHERE name = 'Салат овощной';
```

### Шаг 4: Проверить связи

```sql
-- Посмотреть все блюда с ручными связями
SELECT name, related_dishes
FROM menu
WHERE related_dishes IS NOT NULL
  AND jsonb_array_length(related_dishes) > 0;
```

## Логика работы

### В ProductModal (модальное окно блюда):

```typescript
getRelatedItems(item: MenuItem): MenuItem[] {
  // 1. Есть ручные связи? Используем их
  if (item.related_dishes && item.related_dishes.length > 0) {
    const relatedByIds = menuItems.filter(m =>
      item.related_dishes?.includes(m.id) && m.available
    );

    if (relatedByIds.length >= 3) {
      return relatedByIds.slice(0, 3); // Показываем 3 связанных
    }

    // Если ручных связей < 3, дополняем автоматическими
    const remaining = 3 - relatedByIds.length;
    const autoRelated = menuItems
      .filter(m =>
        m.id !== item.id &&
        m.available &&
        !item.related_dishes?.includes(m.id) &&
        (m.sub_category === item.sub_category || m.category === item.category)
      )
      .slice(0, remaining);

    return [...relatedByIds, ...autoRelated];
  }

  // 2. Нет ручных связей? Автоматический подбор
  return menuItems
    .filter(m =>
      m.id !== item.id &&
      m.available &&
      (m.sub_category === item.sub_category || m.category === item.category)
    )
    .slice(0, 3);
}
```

### В CheckoutForm (форма заказа):

```typescript
// Показываем случайные 3 блюда, которых нет в корзине
const cartItemIds = cartItems.map(ci => ci.item.id);
const available = allItems.filter(
  item => item.available && !cartItemIds.includes(item.id)
);

const shuffled = available.sort(() => 0.5 - Math.random());
setRecommendedItems(shuffled.slice(0, 3));
```

## UI Компоненты

### ProductModal - Рекомендации с кнопками

- **Свайп** - горизонтальная прокрутка
- **3 блюда** - ровно 3 рекомендации
- **2 кнопки на каждой карточке:**
  - **"Купить"** - добавляет в корзину
  - **"Посмотреть"** - открывает модальное окно блюда

```tsx
<button onClick={() => onAddToCart(item, 1)}>
  Купить
</button>
<button onClick={() => handleRelatedItemClick(item)}>
  Посмотреть
</button>
```

### CheckoutForm - Рекомендации для добавления

- **Свайп** - горизонтальная прокрутка
- **3 блюда** - случайные доступные блюда
- **1 кнопка на каждой карточке:**
  - **"+ Добавить"** - добавляет в корзину

```tsx
<button onClick={() => onAddToCart(item, 1)}>
  + Добавить
</button>
```

## Рекомендации по использованию

### Что связывать:

1. **Комплементарные блюда:**
   - Бургер → Картофель фри, Напиток, Соус
   - Паста → Салат, Хлеб, Десерт
   - Пицца → Другие пиццы, Напитки, Закуски

2. **Похожие блюда:**
   - Салат Цезарь → Другие салаты
   - Пицца Маргарита → Другие пиццы
   - Капучино → Другие кофейные напитки

3. **Upsell:**
   - Обычный бургер → Премиум бургер
   - Маленькая пицца → Большая пицца
   - Обычный кофе → Кофе с добавками

### Лучшие практики:

- ✅ Связывайте 3-5 блюд для каждого популярного блюда
- ✅ Обновляйте связи при добавлении новых блюд
- ✅ Тестируйте рекомендации на реальных пользователях
- ✅ Используйте связи для увеличения среднего чека
- ❌ Не связывайте недоступные блюда
- ❌ Не дублируйте одинаковые блюда в рекомендациях

## Мониторинг эффективности

Отслеживайте в аналитике:
- Конверсию кликов по рекомендациям
- Средний чек с рекомендациями vs без
- Популярные связки блюд
- Отказы от рекомендаций

## Структура данных

### В БД (Supabase):

```sql
CREATE TABLE menu (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_category TEXT,
  price NUMERIC NOT NULL,
  available BOOLEAN DEFAULT true,
  related_dishes JSONB DEFAULT '[]'::jsonb,
  -- ... другие поля
);

CREATE INDEX idx_menu_related_dishes ON menu USING GIN (related_dishes);
```

### В TypeScript:

```typescript
interface MenuItem {
  id: string;
  name: string;
  category: string;
  sub_category?: string;
  price: number;
  available: boolean;
  related_dishes?: string[]; // UUID связанных блюд
  // ... другие поля
}
```

## Примеры запросов

### Получить блюдо со всеми связями:

```sql
WITH dish AS (
  SELECT id, name, related_dishes
  FROM menu
  WHERE name = 'Пицца Маргарита'
)
SELECT
  dish.name AS main_dish,
  m.name AS related_dish,
  m.price,
  m.category
FROM dish
CROSS JOIN LATERAL jsonb_array_elements_text(dish.related_dishes) AS rel(id)
JOIN menu m ON m.id = rel.id::uuid;
```

### Найти блюда без связей:

```sql
SELECT name, category
FROM menu
WHERE (related_dishes IS NULL OR jsonb_array_length(related_dishes) = 0)
  AND available = true
ORDER BY category, name;
```

### Статистика по связям:

```sql
SELECT
  category,
  COUNT(*) AS total_dishes,
  COUNT(CASE WHEN jsonb_array_length(related_dishes) > 0 THEN 1 END) AS dishes_with_relations,
  ROUND(
    COUNT(CASE WHEN jsonb_array_length(related_dishes) > 0 THEN 1 END)::numeric / COUNT(*)::numeric * 100,
    2
  ) AS percentage_with_relations
FROM menu
GROUP BY category
ORDER BY percentage_with_relations DESC;
```

## Разработка и тестирование

### Локальное тестирование:

```bash
# Запустить фронтенд
npm run dev

# Открыть в браузере
# Кликнуть на блюдо → Проверить рекомендации
# Перейти в корзину → Оформить заказ → Проверить рекомендации
```

### Деплой изменений:

```bash
# Билд и деплой на GitHub Pages
npm run build
npm run deploy
```

## Поддержка

Если у вас есть вопросы или проблемы с системой рекомендаций:
1. Проверьте, что колонка `related_dishes` создана в БД
2. Проверьте, что UUID блюд корректны
3. Проверьте, что связанные блюда доступны (`available = true`)
4. Проверьте консоль браузера на наличие ошибок
