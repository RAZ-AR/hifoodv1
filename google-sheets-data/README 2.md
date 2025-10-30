# 📊 Данные для Google Sheets

Эта папка содержит тестовые данные для заполнения вашей Google таблицы Hi Food.

## 📁 Файлы

- `1_user_sheet.csv` - Данные пользователей (3 пользователя)
- `2_menu_sheet.csv` - Меню (15 блюд и напитков)
- `3_orders_sheet.csv` - Заказы (5 заказов)
- `4_ads_sheet.csv` - Рекламные баннеры (4 баннера)
- `5_bonus_transactions_sheet.csv` - Бонусные транзакции (7 транзакций)

## 🚀 Быстрый старт

### 1. Откройте вашу Google таблицу
https://docs.google.com/spreadsheets/d/18MgwzpNpnNt9H0LeIjxnXZYbEmkefrHLwHIHnMCgeho/edit

### 2. Создайте 5 листов (sheets) с названиями:
- `user`
- `menu`
- `orders`
- `ads`
- `bonus_transactions`

### 3. Импортируйте CSV файлы

Для каждого листа:
1. Выберите лист
2. **Файл → Импортировать**
3. Загрузите соответствующий CSV файл
4. Выберите **"Заменить текущий лист"**
5. Нажмите **"Импортировать данные"**

## 📖 Подробная инструкция

См. файл `ИНСТРУКЦИЯ_ПО_ЗАПОЛНЕНИЮ.md` для детальных инструкций по:
- Импорту данных
- Настройке Google Sheets API
- Подключению к backend
- Устранению проблем

## ✅ Что дальше?

После импорта данных:
1. Настройте подключение в `.env`:
   ```bash
   DATA_PROVIDER=google_sheets
   GOOGLE_SHEET_ID=18MgwzpNpnNt9H0LeIjxnXZYbEmkefrHLwHIHnMCgeho
   ```
2. Создайте Service Account в Google Cloud Console
3. Дайте доступ Service Account к таблице
4. Перезапустите backend: `npm run dev`

**Готово! 🎉**
