-- ============================================
-- Hi Food - FIX Row Level Security Policies для Menu
-- ============================================
-- Этот скрипт добавляет политики RLS для таблицы menu
-- Запустите его в Supabase SQL Editor
-- ============================================

-- 1. УДАЛЯЕМ СТАРЫЕ ПОЛИТИКИ (если есть)
-- ============================================
DROP POLICY IF EXISTS "Allow backend to select menu" ON menu;
DROP POLICY IF EXISTS "Allow backend to insert menu" ON menu;
DROP POLICY IF EXISTS "Allow backend to update menu" ON menu;
DROP POLICY IF EXISTS "Allow backend to delete menu" ON menu;

-- 2. СОЗДАЁМ ПРАВИЛЬНЫЕ ПОЛИТИКИ ДЛЯ ТАБЛИЦЫ MENU
-- ============================================

-- Разрешить всем читать меню
CREATE POLICY "Allow backend to select menu"
ON menu FOR SELECT
TO anon, authenticated
USING (true);

-- Разрешить всем создавать блюда в меню
CREATE POLICY "Allow backend to insert menu"
ON menu FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Разрешить всем обновлять блюда в меню
CREATE POLICY "Allow backend to update menu"
ON menu FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Разрешить всем удалять блюда из меню
CREATE POLICY "Allow backend to delete menu"
ON menu FOR DELETE
TO anon, authenticated
USING (true);

-- ============================================
-- ПРОВЕРКА: Показать все политики для menu
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
  AND tablename = 'menu'
ORDER BY policyname;

-- ============================================
-- ✅ Готово! Теперь можно загружать данные меню
-- ============================================
