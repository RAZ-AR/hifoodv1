# Руководство по обновлению системы меню

## Что было сделано

### 1. Обновлена структура MenuItem
- ✅ Добавлена поддержка **подкатегорий** (sub_category, sub_category_en, sub_category_sr)
- ✅ Добавлена **многоязычность** (title/description на RU, EN, SR)
- ✅ Добавлены поля **вес** и **калории** (weight, calories)
- ✅ Обновлены типы в frontend (`src/types/index.ts`) и backend (`backend/src/types/index.ts`)

### 2. Создан компонент SubCategoryFilter
- ✅ Горизонтальный скролл с подкатегориями
- ✅ Автоматическое отображение при выборе основной категории
- ✅ Плавная анимация и адаптивный дизайн
- Файл: `src/components/SubCategoryFilter.tsx`

### 3. Создан компонент ProductModal
- ✅ Детальная карточка товара с полным описанием
- ✅ Отображение веса, калорий, времени приготовления
- ✅ Список ингредиентов и аллергенов
- ✅ Рекомендации других блюд внизу
- ✅ Возможность добавить в корзину прямо из модального окна
- Файл: `src/components/ProductModal.tsx`

### 4. Обновлен скрипт миграции меню
- ✅ Поддержка всех новых колонок из Google Sheets
- ✅ Правильный маппинг: category, sub_category, title, description, price, image, weight, calories
- ✅ Многоязычная поддержка для всех текстовых полей
- Файл: `backend/migrate-menu-from-sheets.ts`

### 5. Создана SQL миграция
- ✅ Добавление всех новых колонок в таблицу `menu`
- ✅ Создание индексов для оптимизации запросов
- ✅ Скрипт rollback для отката изменений
- Файл: `backend/update-menu-schema.sql`

### 6. Обновлена главная страница (Home.tsx)
- ✅ Трехуровневая навигация: Категории → Подкатегории → Блюда
- ✅ Интеграция SubCategoryFilter компонента
- ✅ Интеграция ProductModal при клике на блюдо
- ✅ Автоматический сброс подкатегории при смене категории
- ✅ Рекомендации похожих блюд

### 7. Добавлено детальное логирование
- ✅ Логирование номера карты лояльности на всех этапах
- ✅ Отладочная информация для выявления проблем с сохранением в БД
- Файл: `backend/src/index.ts` (строки 202-251)

---

## Инструкции по развертыванию

### Шаг 1: Обновление схемы БД в Supabase

1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Перейдите в **SQL Editor**
3. Скопируйте содержимое файла `backend/update-menu-schema.sql`
4. Вставьте в SQL Editor и выполните (RUN)
5. Проверьте успешное выполнение:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'menu'
ORDER BY ordinal_position;
```

### Шаг 2: Заполнение Google Sheets

Откройте вашу таблицу Google Sheets и заполните по следующей структуре:

**Колонки (A-N):**
| A | B | C | D | E | F | G | H | I | J | K | L | M | N |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| category | sub_category | sub_category_en | sub_category_sr | title | title_en | title_sr | description | description_en | description_sr | price | image | weight | calories |

**Пример заполнения:**
```
Основные блюда | Паста | Pasta | Паста | Карбонара | Carbonara | Карбонара | Паста с беконом и сливочным соусом | Pasta with bacon and cream sauce | Паста са сланином и павлаком | 890 | https://example.com/carbonara.jpg | 350г | 650
Основные блюда | Паста | Pasta | Паста | Болоньезе | Bolognese | Болоњезе | Паста с мясным соусом | Pasta with meat sauce | Паста са месним сосом | 950 | https://example.com/bolognese.jpg | 400г | 720
Супы | Горячие | Hot Soups | Топле супе | Борщ | Borscht | Борш | Традиционный украинский суп | Traditional Ukrainian soup | Традиционална украјинска супа | 450 | https://example.com/borscht.jpg | 300мл | 180
```

### Шаг 3: Настройка Google Sheets API

Убедитесь, что у вас есть Service Account с доступом к таблице:

1. Проверьте `.env` файл:
```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=18MgwzpNpnNt9H0LeIjxnXZYbEmkefrHLwHIHnMCgeho
```

2. Откройте Google Sheets → Share → добавьте `GOOGLE_SERVICE_ACCOUNT_EMAIL` как Reader

### Шаг 4: Запуск миграции меню

```bash
cd backend
npm run dev  # Убедитесь, что сервер работает

# В другом терминале
npx ts-node migrate-menu-from-sheets.ts
```

Вы должны увидеть:
```
🚀 Начинаем миграцию меню из Google Sheets в Supabase...
📖 Читаем данные из Google Sheets (лист "menu")...
✅ Прочитано X позиций из Google Sheets
🍕 Первые 3 позиции для проверки:
   - Карбонара (Основные блюда) - 890 RSD
   - Болоньезе (Основные блюда) - 950 RSD
   - Борщ (Супы) - 450 RSD
...
✅ Успешно загружено X блюд в Supabase!
🎉 Миграция завершена успешно!
```

### Шаг 5: Проверка в Mini App

1. Запустите frontend:
```bash
npm run dev
```

2. Откройте в браузере или через Telegram Bot

3. Проверьте:
   - ✅ Горизонтальное меню с категориями
   - ✅ Подкатегории появляются при выборе категории
   - ✅ Клик на блюдо открывает модальное окно
   - ✅ В модальном окне отображается вес, калории, описание
   - ✅ Внизу модального окна есть рекомендации других блюд

### Шаг 6: Тестирование номера карты лояльности

1. Создайте тестовый заказ через Mini App
2. Проверьте логи backend:
```bash
cd backend
npm run dev
```

3. Найдите в логах:
```
🎫 Loyalty Card Number от клиента: 1234
💾 Loyalty Card в объекте для БД: 1234
```

4. Проверьте БД:
```sql
SELECT order_number, loyalty_card_number, customer_name, created_at
FROM orders
ORDER BY created_at DESC
LIMIT 5;
```

5. Если `loyalty_card_number` все еще NULL, см. файл `LOYALTY_CARD_DEBUG.md`

---

## Структура трехуровневого меню

### UI/UX Flow:

```
┌─────────────────────────────────────────────┐
│ [Все] [Основные] [Супы] [Салаты] [Напитки] │ ← Категории (всегда видны)
└─────────────────────────────────────────────┘
         ↓ (при выборе "Основные блюда")
┌─────────────────────────────────────────────┐
│   [Все] [Паста] [Ризотто] [Стейки]         │ ← Подкатегории (появляются)
└─────────────────────────────────────────────┘
         ↓ (при выборе "Паста")
┌──────────────────┬──────────────────┐
│  🍝 Карбонара    │  🍝 Болоньезе    │ ← Блюда (сетка карточек)
│  350г | 890 RSD  │  400г | 950 RSD  │
│  [+] Добавить    │  [+] Добавить    │
└──────────────────┴──────────────────┘
         ↓ (клик на блюдо)
┌─────────────────────────────────────────────┐
│         [Модальное окно]                    │
│  🍝 Карбонара                               │
│  ⚖️ 350г  🔥 650 ккал  ⏱️ 20 мин           │
│  Описание: Паста с беконом...               │
│  Ингредиенты: [Паста] [Бекон] [Сливки]     │
│  Рекомендуем: [Болоньезе] [Арабьята]        │
│  [Добавить в корзину - 890 RSD]             │
└─────────────────────────────────────────────┘
```

---

## Бесплатные сервисы для изображений

Если у вас нет изображений в Google Sheets, можете использовать:

### 1. Unsplash (бесплатно, 50 запросов/час)
```javascript
// API: https://api.unsplash.com/photos/random?query=pasta
const imageUrl = `https://images.unsplash.com/photo-XXXXX?w=500&h=300&fit=crop`;
```

### 2. Pexels (бесплатно, без лимитов)
```javascript
// API: https://api.pexels.com/v1/search?query=pasta
const imageUrl = result.photos[0].src.medium;
```

### 3. Cloudinary (бесплатный план 25GB)
```bash
# Upload изображений
curl -X POST "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload" \
  -F "file=@pasta.jpg" \
  -F "upload_preset=YOUR_PRESET"
```

---

## Troubleshooting

### Проблема: Подкатегории не отображаются
**Решение:** Убедитесь, что в Google Sheets заполнена колонка `sub_category`

### Проблема: Модальное окно не открывается
**Решение:** Проверьте консоль браузера на ошибки. Возможно, не хватает данных в MenuItem.

### Проблема: Номер карты не сохраняется в БД
**Решение:** См. файл `LOYALTY_CARD_DEBUG.md` с детальной диагностикой

### Проблема: Изображения не загружаются
**Решение:** Проверьте URL в колонке `image`. Используйте placeholder:
```
https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500
```

---

## Следующие шаги

1. **Многоязычность интерфейса** - добавить переключатель языков в UI
2. **Фильтры по калориям/цене** - дополнительные фильтры в меню
3. **Избранные блюда** - сохранение любимых блюд пользователя
4. **История заказов** - отображение предыдущих заказов с номером карты
5. **Бонусная система** - начисление и списание бонусов с карты лояльности

---

## Файлы изменений

```
Новые файлы:
- src/components/SubCategoryFilter.tsx
- src/components/ProductModal.tsx
- backend/update-menu-schema.sql
- MENU_UPDATE_GUIDE.md (этот файл)
- LOYALTY_CARD_DEBUG.md

Измененные файлы:
- src/types/index.ts
- backend/src/types/index.ts
- backend/migrate-menu-from-sheets.ts
- src/pages/Home.tsx
- backend/src/index.ts
```

---

## Поддержка

Если возникли проблемы:
1. Проверьте логи backend: `cd backend && npm run dev`
2. Проверьте консоль браузера: F12 → Console
3. Проверьте данные в Supabase: SQL Editor → `SELECT * FROM menu LIMIT 10;`
4. См. файл `LOYALTY_CARD_DEBUG.md` для проблем с картой лояльности

Удачи! 🚀
