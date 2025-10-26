# 🚀 Настройка Supabase для Hi Food

## Шаг 1: Создание таблиц

1. Откройте SQL Editor в Supabase:
   https://supabase.com/dashboard/project/ydhyiqnzlzvswqucmboq/sql/new

2. Скопируйте весь код из файла `supabase-setup.sql`

3. Вставьте в SQL Editor и нажмите **RUN** (или F5)

4. Вы увидите сообщение "Success. No rows returned"

5. Проверьте что таблицы созданы:
   - Откройте Table Editor: https://supabase.com/dashboard/project/ydhyiqnzlzvswqucmboq/editor
   - Вы должны увидеть 5 таблиц: `users`, `menu`, `orders`, `bonus_transactions`, `ads`

## Шаг 2: Заполнение тестовыми данными

Запустите скрипт заполнения:

```bash
cd backend
npm run populate-supabase
```

Это создаст:
- ✅ 3 тестовых пользователя
- ✅ 15 блюд с фотографиями и весом
- ✅ 4 рекламных баннера
- ✅ 1 тестовый заказ

## Шаг 3: Проверка данных

1. Откройте Table Editor
2. Выберите таблицу `menu`
3. Вы увидите все блюда с:
   - Названием
   - Ценой
   - Весом (350г, 500мл и т.д.)
   - URL фотографии
   - Категорией
   - Калорийностью, БЖУ
   - Ингредиентами и аллергенами

## Шаг 4: Запуск backend с Supabase

1. Убедитесь что в `.env` установлено:
   ```
   DATA_PROVIDER=supabase
   ```

2. Запустите backend:
   ```bash
   npm run dev
   ```

3. Вы должны увидеть:
   ```
   📦 Инициализация Data Provider: supabase
   ✅ Supabase Provider подключен
   ```

## 📝 Как добавлять новые блюда

### Вариант 1: Через Table Editor (рекомендуется)

1. Откройте https://supabase.com/dashboard/project/ydhyiqnzlzvswqucmboq/editor
2. Выберите таблицу `menu`
3. Нажмите **Insert** → **Insert row**
4. Заполните поля:
   - **category**: Пицца, Суши, Бургеры, Напитки
   - **name**: Название блюда
   - **description**: Описание
   - **price**: Цена в динарах
   - **weight**: Например "350г" или "500мл"
   - **image_url**: URL фотографии (см. ниже)
   - **is_available**: true (галочка)
   - **is_popular**: true если хотите показать в топе
   - Остальное опционально
5. Нажмите **Save**

### Как получить URL фотографии:

**Способ 1: ImgBB (бесплатно, без регистрации)**
1. Откройте https://imgbb.com/
2. Нажмите "Start uploading"
3. Выберите фото блюда
4. Скопируйте "Direct link"
5. Вставьте в поле `image_url`

**Способ 2: Unsplash (бесплатные стоковые фото)**
1. Найдите фото на https://unsplash.com/
2. Нажмите на фото → Download → Правой кнопкой → Copy image address
3. Вставьте в поле `image_url`

**Способ 3: Cloudinary (для профессионального использования)**
1. Зарегистрируйтесь на https://cloudinary.com/
2. Загрузите фото
3. Скопируйте URL

### Вариант 2: Через SQL

```sql
INSERT INTO menu (category, name, description, price, weight, image_url, is_available, is_popular)
VALUES (
  'Пицца',
  'Карбонара',
  'Сливочный соус, бекон, пармезан',
  950,
  '370г',
  'https://i.ibb.co/xxx/carbonara.jpg',
  true,
  false
);
```

## 🎨 Структура таблицы menu

```
id              - UUID (автоматически)
category        - TEXT (Пицца, Суши, Бургеры, Напитки...)
name            - TEXT (название блюда)
description     - TEXT (описание)
price           - DECIMAL (цена в динарах)
weight          - TEXT (вес/объём: "350г", "500мл")
image_url       - TEXT (URL фотографии)
is_available    - BOOLEAN (в наличии или нет)
is_popular      - BOOLEAN (популярное блюдо)
discount_%      - INTEGER (процент скидки, 0-100)
allergens       - TEXT[] (массив: ["молоко", "глютен"])
ingredients     - TEXT[] (массив: ["томаты", "сыр"])
calories        - INTEGER (калорийность)
protein         - DECIMAL (белки в граммах)
fats            - DECIMAL (жиры в граммах)
carbs           - DECIMAL (углеводы в граммах)
sort_order      - INTEGER (порядок сортировки)
created_at      - TIMESTAMP (автоматически)
updated_at      - TIMESTAMP (автоматически)
```

## ✏️ Редактирование блюд

1. Откройте Table Editor
2. Найдите нужное блюдо
3. Дважды кликните на ячейку
4. Измените значение
5. Нажмите Enter или кликните вне ячейки
6. Изменения сохранятся автоматически!

## 🔄 Обновление данных в приложении

После изменений в Supabase:
- Frontend автоматически получит новые данные при следующем запросе
- Не нужно перезапускать backend
- Изменения видны сразу!

## 📊 Полезные ссылки

- **Table Editor**: https://supabase.com/dashboard/project/ydhyiqnzlzvswqucmboq/editor
- **SQL Editor**: https://supabase.com/dashboard/project/ydhyiqnzlzvswqucmboq/sql
- **API Docs**: https://supabase.com/dashboard/project/ydhyiqnzlzvswqucmboq/api
- **ImgBB Upload**: https://imgbb.com/
- **Unsplash Photos**: https://unsplash.com/s/photos/food

## 🆘 Troubleshooting

### Backend не подключается к Supabase

Проверьте `.env`:
```
SUPABASE_URL=https://ydhyiqnzlzvswqucmboq.supabase.co
SUPABASE_KEY=eyJhbGc...
```

### Не видно изменений в приложении

1. Перезапустите backend: `npm run dev`
2. Обновите Telegram Mini App
3. Проверьте что `DATA_PROVIDER=supabase` в `.env`

### Ошибка "Row Level Security"

Убедитесь что запустили все SQL команды из `supabase-setup.sql`
