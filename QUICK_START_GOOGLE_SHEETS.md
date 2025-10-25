# ⚡ Быстрый старт: Автоматическое заполнение Google Sheets

## 📋 Что нужно сделать

1. Настроить Google Cloud Console (5 минут)
2. Добавить credentials в `.env`
3. Запустить команду `npm run populate-sheets`

---

## 1️⃣ Настройка Google Cloud Console

### A. Создайте Service Account

1. Откройте: https://console.cloud.google.com/iam-admin/serviceaccounts
2. **Create Service Account**:
   - Name: `hi-food-sheets`
   - Role: Editor (или пропустите)
3. Нажмите на созданный аккаунт → **Keys** → **Add Key** → **Create new key** → **JSON**
4. Скачается файл `credentials.json`

### B. Включите Google Sheets API

1. Откройте: https://console.cloud.google.com/apis/library/sheets.googleapis.com
2. Нажмите **Enable**

---

## 2️⃣ Настройте .env

Откройте скачанный `credentials.json` и добавьте в `.env`:

```bash
# GOOGLE SHEETS
GOOGLE_SHEET_ID=18MgwzpNpnNt9H0LeIjxnXZYbEmkefrHLwHIHnMCgeho
GOOGLE_SERVICE_ACCOUNT_EMAIL=hi-food-sheets@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

**Где взять значения**:
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` = `client_email` из credentials.json
- `GOOGLE_PRIVATE_KEY` = `private_key` из credentials.json (в кавычках!)

---

## 3️⃣ Дайте доступ к таблице

1. Откройте: https://docs.google.com/spreadsheets/d/18MgwzpNpnNt9H0LeIjxnXZYbEmkefrHLwHIHnMCgeho/edit
2. **Share** → введите email из `GOOGLE_SERVICE_ACCOUNT_EMAIL`
3. Роль: **Editor**
4. Нажмите **Send** (без уведомления)

---

## 4️⃣ Запустите скрипт

```bash
cd backend
npm run populate-sheets
```

### Ожидаемый результат:

```
🚀 Начало заполнения Google Sheets...
✅ Доступ к таблице "Hi food Delivery Database" получен

📝 Заполнение листа "user"...
✅ Лист "user" заполнен (3 записей)

📝 Заполнение листа "menu"...
✅ Лист "menu" заполнен (15 записей)

... и т.д. ...

🎉 Все листы успешно заполнены!
```

---

## 5️⃣ Используйте Google Sheets в приложении

В `.env` измените:

```bash
DATA_PROVIDER=google_sheets
```

Перезапустите backend:

```bash
npm run dev
```

---

## ✅ Готово!

Ваша таблица заполнена:
- 3 пользователя
- 15 блюд в меню
- 5 заказов
- 4 рекламных баннера
- 7 бонусных транзакций

**Откройте таблицу**: https://docs.google.com/spreadsheets/d/18MgwzpNpnNt9H0LeIjxnXZYbEmkefrHLwHIHnMCgeho/edit

---

## 🚨 Проблемы?

### Ошибка 403
➡️ Service Account не добавлен в таблицу. Повторите шаг 3.

### "credentials не найдены"
➡️ Проверьте `.env` файл. Убедитесь что переменные добавлены.

### "Invalid grant"
➡️ GOOGLE_PRIVATE_KEY должен быть в кавычках с `\n` для переносов.

---

**Подробная инструкция**: см. `scripts/README.md`
