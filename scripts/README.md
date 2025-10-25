# 🤖 Автоматическое заполнение Google Sheets

Этот скрипт автоматически заполняет вашу Google таблицу тестовыми данными для Hi Food.

## 🚀 Быстрый старт

### 1. Настройте Google Sheets API

#### Шаг 1: Создайте проект в Google Cloud Console

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com)
2. Создайте новый проект или выберите существующий
3. Название проекта: `Hi Food App`

#### Шаг 2: Включите Google Sheets API

1. В меню слева: **APIs & Services** → **Library**
2. Найдите: **Google Sheets API**
3. Нажмите **Enable**

#### Шаг 3: Создайте Service Account

1. В меню слева: **APIs & Services** → **Credentials**
2. Нажмите **Create Credentials** → **Service Account**
3. Заполните:
   - **Service account name**: `hi-food-sheets`
   - **Service account ID**: автоматически заполнится
   - **Description**: `Service account for Hi Food Google Sheets access`
4. Нажмите **Create and Continue**
5. **Role**: выберите **Editor** (или можно пропустить)
6. Нажмите **Done**

#### Шаг 4: Создайте ключ (credentials)

1. Найдите созданный Service Account в списке
2. Кликните на него
3. Перейдите на вкладку **Keys**
4. Нажмите **Add Key** → **Create new key**
5. Выберите тип: **JSON**
6. Нажмите **Create**
7. Файл `.json` автоматически скачается

#### Шаг 5: Настройте .env файл

Откройте скачанный JSON файл и найдите:
- `client_email` - это будет ваш GOOGLE_SERVICE_ACCOUNT_EMAIL
- `private_key` - это будет ваш GOOGLE_PRIVATE_KEY

Добавьте в `.env` файл (в корне проекта):

```bash
# GOOGLE SHEETS
GOOGLE_SHEET_ID=18MgwzpNpnNt9H0LeIjxnXZYbEmkefrHLwHIHnMCgeho
GOOGLE_SERVICE_ACCOUNT_EMAIL=hi-food-sheets@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

**ВАЖНО**: Private key должен быть в кавычках и с `\n` для переносов строк!

#### Шаг 6: Дайте доступ Service Account к таблице

1. Откройте вашу Google таблицу: https://docs.google.com/spreadsheets/d/18MgwzpNpnNt9H0LeIjxnXZYbEmkefrHLwHIHnMCgeho/edit
2. Нажмите **Share** (Настройки доступа)
3. В поле "Add people and groups" вставьте email из `GOOGLE_SERVICE_ACCOUNT_EMAIL`
4. Выберите роль: **Editor** (Редактор)
5. Нажмите **Send** (отправьте без уведомления)

### 2. Запустите скрипт

```bash
cd backend
npm run populate-sheets
```

## 📊 Что делает скрипт?

Скрипт автоматически:

1. ✅ Подключается к вашей Google таблице через API
2. ✅ Создаёт 5 листов (sheets):
   - `user` - пользователи
   - `menu` - меню
   - `orders` - заказы
   - `ads` - рекламные баннеры
   - `bonus_transactions` - бонусные транзакции

3. ✅ Заполняет каждый лист тестовыми данными:
   - **user**: 3 пользователя с картами лояльности
   - **menu**: 15 блюд (пиццы, бургеры, салаты, напитки, десерты)
   - **orders**: 5 заказов с разными статусами
   - **ads**: 4 активных рекламных баннера
   - **bonus_transactions**: 7 бонусных транзакций

4. ✅ Очищает старые данные перед заполнением

## ✅ Проверка результата

После запуска скрипта:

1. Откройте таблицу: https://docs.google.com/spreadsheets/d/18MgwzpNpnNt9H0LeIjxnXZYbEmkefrHLwHIHnMCgeho/edit
2. Убедитесь что есть 5 листов
3. В каждом листе должны быть данные:
   - Первая строка - заголовки
   - Остальные строки - данные

## 🔧 Использование Google Sheets в приложении

После заполнения таблицы, настройте backend для использования Google Sheets:

```bash
# В .env измените:
DATA_PROVIDER=google_sheets
```

Перезапустите backend:
```bash
npm run dev
```

Проверьте что данные загружаются:
```bash
curl http://localhost:3000/api/menu
```

## 🚨 Устранение проблем

### Ошибка: "GOOGLE_SERVICE_ACCOUNT_EMAIL не найден"
**Решение**: Добавьте переменные в `.env` файл (см. Шаг 5)

### Ошибка: "403 Forbidden"
**Решение**: Service Account не имеет доступа к таблице
1. Откройте таблицу
2. Share → добавьте email Service Account
3. Дайте права "Editor"

### Ошибка: "Unable to parse range: user"
**Решение**: Лист не существует, скрипт автоматически создаст его

### Ошибка: "Invalid grant"
**Решение**: Проверьте правильность GOOGLE_PRIVATE_KEY:
- Должен быть в кавычках
- Должен содержать `\n` для переносов строк
- Должен начинаться с `-----BEGIN PRIVATE KEY-----`

## 📝 Пример успешного вывода

```
🚀 Начало заполнения Google Sheets...

🔍 Проверка доступа к таблице...
✅ Доступ к таблице "Hi food Delivery Database" получен

📝 Заполнение листа "user"...
✅ Лист "user" заполнен (3 записей)

📝 Заполнение листа "menu"...
✅ Лист "menu" заполнен (15 записей)

📝 Заполнение листа "orders"...
✅ Лист "orders" заполнен (5 записей)

📝 Заполнение листа "ads"...
✅ Лист "ads" заполнен (4 записей)

📝 Заполнение листа "bonus_transactions"...
✅ Лист "bonus_transactions" заполнен (7 записей)

🎉 Все листы успешно заполнены!

📊 Откройте таблицу: https://docs.google.com/spreadsheets/d/18MgwzpNpnNt9H0LeIjxnXZYbEmkefrHLwHIHnMCgeho/edit

✅ Готово! Теперь можете использовать DATA_PROVIDER=google_sheets
```

## 🎯 Дополнительные команды

### Запуск с debug логами
```bash
DEBUG=* npm run populate-sheets
```

### Очистка всех листов без заполнения
Отредактируйте скрипт и закомментируйте блок записи данных

### Заполнение только определённого листа
Отредактируйте скрипт и удалите ненужные листы из `SHEETS_DATA`

## 🔐 Безопасность

**ВАЖНО**:
- ❌ НЕ коммитьте `.env` файл в Git
- ❌ НЕ публикуйте JSON credentials
- ✅ Добавьте `.env` в `.gitignore`
- ✅ Используйте переменные окружения на production

## 📚 Дополнительная информация

- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Service Accounts Overview](https://cloud.google.com/iam/docs/service-accounts)
- [Google Cloud Console](https://console.cloud.google.com)

---

**Готово! 🎉 Ваша Google таблица заполнена тестовыми данными!**
