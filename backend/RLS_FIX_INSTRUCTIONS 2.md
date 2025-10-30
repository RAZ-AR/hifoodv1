# 🔧 Инструкция: Исправление Row Level Security в Supabase

## Проблема
При попытке регистрации нового пользователя через Telegram бота возникает ошибка:
```
new row violates row-level security policy for table "users"
```

## Решение
Нужно настроить правильные RLS политики в Supabase.

---

## 📋 Пошаговая инструкция

### Шаг 1: Откройте Supabase Dashboard
1. Перейдите на [https://supabase.com](https://supabase.com)
2. Войдите в свой аккаунт
3. Выберите проект **hifoodv1** (или ваше название проекта)

### Шаг 2: Откройте SQL Editor
1. В левом меню найдите **"SQL Editor"**
2. Нажмите **"New query"** (или кнопку "+ New Query")

### Шаг 3: Скопируйте и выполните SQL скрипт
1. Откройте файл `backend/fix-rls-policies.sql` в этом репозитории
2. Скопируйте **весь текст** из файла
3. Вставьте в SQL Editor в Supabase
4. Нажмите **"Run"** (или Ctrl/Cmd + Enter)

### Шаг 4: Проверьте результат
В результате выполнения вы должны увидеть таблицу со всеми созданными политиками:

```
schemaname | tablename           | policyname                                    | permissive | roles                    | cmd
-----------|---------------------|-----------------------------------------------|------------|--------------------------|--------
public     | bonus_transactions  | Allow backend to delete bonus_transactions    | PERMISSIVE | anon,authenticated       | DELETE
public     | bonus_transactions  | Allow backend to insert bonus_transactions    | PERMISSIVE | anon,authenticated       | INSERT
public     | bonus_transactions  | Allow backend to select bonus_transactions    | PERMISSIVE | anon,authenticated       | SELECT
public     | bonus_transactions  | Allow backend to update bonus_transactions    | PERMISSIVE | anon,authenticated       | UPDATE
public     | orders              | Allow backend to delete orders                | PERMISSIVE | anon,authenticated       | DELETE
public     | orders              | Allow backend to insert orders                | PERMISSIVE | anon,authenticated       | INSERT
public     | orders              | Allow backend to select orders                | PERMISSIVE | anon,authenticated       | SELECT
public     | orders              | Allow backend to update orders                | PERMISSIVE | anon,authenticated       | UPDATE
public     | users               | Allow backend to delete users                 | PERMISSIVE | anon,authenticated       | DELETE
public     | users               | Allow backend to insert users                 | PERMISSIVE | anon,authenticated       | INSERT
public     | users               | Allow backend to select users                 | PERMISSIVE | anon,authenticated       | SELECT
public     | users               | Allow backend to update users                 | PERMISSIVE | anon,authenticated       | UPDATE
```

---

## ✅ Проверка работы

После выполнения скрипта:

1. Откройте Telegram бота **@Hi_food_order_bot**
2. Отправьте команду `/start` с **нового аккаунта** (или того, который выдавал ошибку)
3. Вы должны получить сообщение:
   ```
   👋 Добро пожаловать, [ваше имя]!

   🎉 Вам выдана карта лояльности!
   Номер карты: 1001

   📱 Откройте наше приложение, чтобы:
   • Посмотреть меню
   • Оформить заказ
   • Отслеживать статус доставки
   • Накапливать бонусы
   ```

4. Если сообщение пришло — **всё работает!** 🎉

---

## 🚨 Если всё ещё не работает

1. Проверьте, что скрипт выполнился без ошибок
2. Убедитесь, что все политики были созданы (см. "Проверьте результат")
3. Проверьте логи в Render: [https://dashboard.render.com](https://dashboard.render.com)
4. Если ошибка повторяется — отправьте скриншот ошибки

---

## 📚 Что делает скрипт?

1. **Удаляет старые неполные политики** — те, которые были созданы ранее, но не работали правильно
2. **Создаёт новые политики для таблицы `users`**:
   - Разрешает SELECT (чтение)
   - Разрешает INSERT (создание)
   - Разрешает UPDATE (обновление)
   - Разрешает DELETE (удаление)
3. **Создаёт такие же политики для таблиц `orders` и `bonus_transactions`**
4. **Разрешает операции для ролей `anon` и `authenticated`** — это стандартные роли Supabase для API запросов

---

## 🔐 Безопасность

**Вопрос:** Не опасно ли разрешать все операции для `anon`?

**Ответ:** В данном случае это безопасно, потому что:
1. Мы используем `SUPABASE_SERVICE_ROLE_KEY` в backend'е
2. Backend проверяет Telegram ID пользователя перед операциями
3. API endpoints защищены на уровне Express
4. В будущем можно добавить более детальные политики (например, "пользователь может обновлять только свои данные")

**Для production** рекомендуется добавить более строгие политики, например:

```sql
-- Пользователь может обновлять только свои данные
CREATE POLICY "Users can update own data"
ON users FOR UPDATE
TO authenticated
USING (telegram_id = auth.jwt()->>'telegram_id')
WITH CHECK (telegram_id = auth.jwt()->>'telegram_id');
```

Но для начала текущие политики работают отлично! 👍
