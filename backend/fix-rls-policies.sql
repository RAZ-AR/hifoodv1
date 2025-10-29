-- ============================================
-- Hi Food - FIX Row Level Security Policies
-- ============================================
-- Этот скрипт исправляет политики RLS для работы backend'а
-- Запустите его в Supabase SQL Editor
-- ============================================

-- 1. УДАЛЯЕМ СТАРЫЕ НЕПРАВИЛЬНЫЕ ПОЛИТИКИ
-- ============================================
DROP POLICY IF EXISTS "Service role full access to users" ON users;
DROP POLICY IF EXISTS "Service role full access to orders" ON orders;
DROP POLICY IF EXISTS "Service role full access to bonus_transactions" ON bonus_transactions;

-- 2. СОЗДАЁМ ПРАВИЛЬНЫЕ ПОЛИТИКИ ДЛЯ ТАБЛИЦЫ USERS
-- ============================================

-- Разрешить всем читать пользователей (для бэкенда)
CREATE POLICY "Allow backend to select users"
ON users FOR SELECT
TO anon, authenticated
USING (true);

-- Разрешить всем создавать пользователей (для регистрации)
CREATE POLICY "Allow backend to insert users"
ON users FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Разрешить всем обновлять пользователей (для изменения данных)
CREATE POLICY "Allow backend to update users"
ON users FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Разрешить всем удалять пользователей (для админки)
CREATE POLICY "Allow backend to delete users"
ON users FOR DELETE
TO anon, authenticated
USING (true);

-- 3. СОЗДАЁМ ПОЛИТИКИ ДЛЯ ТАБЛИЦЫ ORDERS
-- ============================================

-- Разрешить всем читать заказы
CREATE POLICY "Allow backend to select orders"
ON orders FOR SELECT
TO anon, authenticated
USING (true);

-- Разрешить всем создавать заказы
CREATE POLICY "Allow backend to insert orders"
ON orders FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Разрешить всем обновлять заказы
CREATE POLICY "Allow backend to update orders"
ON orders FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Разрешить всем удалять заказы
CREATE POLICY "Allow backend to delete orders"
ON orders FOR DELETE
TO anon, authenticated
USING (true);

-- 4. СОЗДАЁМ ПОЛИТИКИ ДЛЯ ТАБЛИЦЫ BONUS_TRANSACTIONS
-- ============================================

-- Разрешить всем читать транзакции
CREATE POLICY "Allow backend to select bonus_transactions"
ON bonus_transactions FOR SELECT
TO anon, authenticated
USING (true);

-- Разрешить всем создавать транзакции
CREATE POLICY "Allow backend to insert bonus_transactions"
ON bonus_transactions FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Разрешить всем обновлять транзакции
CREATE POLICY "Allow backend to update bonus_transactions"
ON bonus_transactions FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Разрешить всем удалять транзакции
CREATE POLICY "Allow backend to delete bonus_transactions"
ON bonus_transactions FOR DELETE
TO anon, authenticated
USING (true);

-- ============================================
-- ПРОВЕРКА: Показать все политики
-- ============================================
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('users', 'orders', 'bonus_transactions')
ORDER BY tablename, policyname;

-- ============================================
-- ✅ Готово! Теперь backend может работать с таблицами
-- ============================================
