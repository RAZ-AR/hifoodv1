# Запуск миграции меню из Google Sheets

## Предварительные требования

1. ✅ SQL миграция выполнена (таблица menu имеет новые колонки)
2. ⏳ Google Sheets заполнена данными
3. ⏳ Service Account имеет доступ к таблице

---

## Шаг 1: Проверка доступа к Google Sheets

### Проверьте .env файл

```bash
cd /Users/bari/Documents/GitHub/hifoodv1
cat .env | grep GOOGLE
```

Вы должны увидеть:
```
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=18MgwzpNpnNt9H0LeIjxnXZYbEmkefrHLwHIHnMCgeho
```

### Дайте доступ Service Account

1. Откройте вашу Google таблицу:
   https://docs.google.com/spreadsheets/d/18MgwzpNpnNt9H0LeIjxnXZYbEmkefrHLwHIHnMCgeho/edit

2. Нажмите кнопку **Share** (Поделиться)

3. Добавьте email из `GOOGLE_SERVICE_ACCOUNT_EMAIL` с правами **Viewer** (Читатель)

---

## Шаг 2: Структура Google Sheets

Убедитесь, что ваша таблица имеет лист **"menu"** со следующими колонками (A-N):

| A | B | C | D | E | F | G | H | I | J | K | L | M | N |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| category | sub_category | sub_category_en | sub_category_sr | title | title_en | title_sr | description | description_en | description_sr | price | image | weight | calories |

**Важно:**
- Первая строка должна быть заголовками (названия колонок)
- Данные начинаются со второй строки

### Пример данных:

```
Основные блюда,Паста,Pasta,Паста,Карбонара,Carbonara,Карбонара,Паста с беконом и сливочным соусом,Pasta with bacon and cream sauce,Паста са сланином и павлаком,890,https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500,350г,650
Основные блюда,Паста,Pasta,Паста,Болоньезе,Bolognese,Болоњезе,Паста с мясным соусом,Pasta with meat sauce,Паста са месним сосом,950,https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=500,400г,720
Супы,Горячие супы,Hot Soups,Топле супе,Борщ,Borscht,Борш,Традиционный украинский суп,Traditional Ukrainian soup,Традиционална украјинска супа,450,https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500,300мл,180
```

---

## Шаг 3: Запуск миграции

### Вариант 1: Через npm script (рекомендуется)

```bash
cd /Users/bari/Documents/GitHub/hifoodv1/backend
npm run migrate:menu
```

Если команда не настроена, добавьте в `backend/package.json`:

```json
{
  "scripts": {
    "migrate:menu": "ts-node migrate-menu-from-sheets.ts"
  }
}
```

### Вариант 2: Напрямую через ts-node

```bash
cd /Users/bari/Documents/GitHub/hifoodv1/backend
npx ts-node migrate-menu-from-sheets.ts
```

### Вариант 3: Компиляция и запуск

```bash
cd /Users/bari/Documents/GitHub/hifoodv1/backend
npm run build
node dist/migrate-menu-from-sheets.js
```

---

## Ожидаемый вывод

Если всё работает правильно, вы увидите:

```
🚀 Начинаем миграцию меню из Google Sheets в Supabase...

📖 Читаем данные из Google Sheets (лист "menu")...
📋 Заголовки: category, sub_category, sub_category_en, sub_category_sr, title, title_en, title_sr, description, description_en, description_sr, price, image, weight, calories
✅ Прочитано 25 позиций из Google Sheets

🍕 Первые 3 позиции для проверки:
   - Карбонара (Основные блюда) - 890 RSD
   - Болоньезе (Основные блюда) - 950 RSD
   - Борщ (Супы) - 450 RSD

🗑️  Очищаем текущие данные меню в Supabase...
✅ Старые данные удалены

📤 Загружаем меню в Supabase...
✅ Успешно загружено 25 блюд в Supabase!

📋 Все добавленные блюда:
1. Карбонара (Основные блюда) - 890 RSD - рейтинг: 4.5
2. Болоньезе (Основные блюда) - 950 RSD - рейтинг: 4.5
3. Борщ (Супы) - 450 RSD - рейтинг: 4.5
...

🎉 Миграция завершена успешно!

📊 Следующие шаги:
1. Откройте Supabase Table Editor: https://supabase.com/dashboard/project/ydhyiqnzlzvswqucmboq/editor
2. Проверьте таблицу menu - там все ваши блюда
3. Откройте Mini App и проверьте, что меню отображается
```

---

## Возможные ошибки и решения

### Ошибка: "403 Forbidden"

**Причина:** Service Account не имеет доступа к таблице

**Решение:**
1. Откройте Google Sheets
2. Share → добавьте email из `GOOGLE_SERVICE_ACCOUNT_EMAIL`
3. Права: **Viewer**

### Ошибка: "Нет данных в листе menu"

**Причина:** Лист называется по-другому или пустой

**Решение:**
1. Проверьте название листа (должно быть точно "menu")
2. Убедитесь, что данные начинаются с первой строки (заголовки)

### Ошибка: "Cannot read property 'title' of undefined"

**Причина:** Не все колонки заполнены

**Решение:**
- Минимум должны быть заполнены: `category`, `title` (или `title_en`/`title_sr`), `price`
- Пустые ячейки заполните как минимум пробелом

### Ошибка: "GOOGLE_SERVICE_ACCOUNT_EMAIL не найден"

**Причина:** Переменные окружения не загружены

**Решение:**
```bash
cd /Users/bari/Documents/GitHub/hifoodv1
cat .env  # Проверьте, что файл существует

cd backend
cat ../.env  # Проверьте путь к .env
```

---

## Проверка результата в Supabase

После успешной миграции, выполните в SQL Editor:

```sql
-- Проверка количества записей
SELECT COUNT(*) as total_items FROM menu;

-- Проверка данных
SELECT
    category,
    sub_category,
    title,
    price,
    weight,
    calories
FROM menu
ORDER BY category, sub_category
LIMIT 10;

-- Проверка уникальных категорий
SELECT DISTINCT category FROM menu ORDER BY category;

-- Проверка уникальных подкатегорий
SELECT DISTINCT sub_category FROM menu WHERE sub_category IS NOT NULL ORDER BY sub_category;
```

---

## Что дальше?

После успешной миграции:

1. ✅ Запустите frontend: `npm run dev`
2. ✅ Откройте Mini App в браузере или через Telegram
3. ✅ Проверьте трехуровневое меню:
   - Категории отображаются
   - Подкатегории появляются при выборе категории
   - Клик на блюдо открывает модальное окно
   - В модальном окне видны вес, калории, описание

---

## Нужна помощь?

Если что-то не работает:
1. Покажите вывод команды миграции
2. Покажите первые 3 строки вашей Google Sheets
3. Проверьте логи: `cd backend && npm run dev`
