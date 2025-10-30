# 🤖 Настройка Menu Button в Telegram Bot

## Проблема
При открытии бота показывается пустое окно вместо Mini App.

## Решение

### Вариант 1: Через BotFather (РЕКОМЕНДУЕТСЯ)

1. **Откройте чат с [@BotFather](https://t.me/BotFather)**

2. **Отправьте команду:**
   ```
   /mybots
   ```

3. **Выберите вашего бота:** `@Hi_food_order_bot`

4. **Нажмите:** `Bot Settings`

5. **Нажмите:** `Menu Button`

6. **Выберите:** `Edit menu button URL`

7. **Введите URL вашего Mini App:**
   ```
   https://raz-ar.github.io/hifoodv1/
   ```

8. **Готово!** Теперь при открытии бота будет показываться кнопка Menu с вашим приложением.

### Вариант 2: Через API

Можно настроить через Telegram Bot API:

```bash
curl -X POST "https://api.telegram.org/bot8270751448:AAH6f6u2hCT0TAKSjVaCbWkwdqJWOmmYvqE/setChatMenuButton" \
  -H "Content-Type: application/json" \
  -d '{
    "menu_button": {
      "type": "web_app",
      "text": "🍔 Меню",
      "web_app": {
        "url": "https://raz-ar.github.io/hifoodv1/"
      }
    }
  }'
```

## Проверка

После настройки:

1. Откройте бота в Telegram
2. Нажмите кнопку Menu (☰) рядом с полем ввода
3. Должно открыться ваше Mini App с меню!

## Альтернатива: Команда /start

Также добавлена кнопка "🍔 Открыть меню" при вводе команды `/start`.

После деплоя на Render (через ~2 минуты):
1. Отправьте боту `/start`
2. Появится кнопка "🍔 Открыть меню"
3. Нажмите на неё - откроется Mini App!

## Что уже сделано

✅ Backend обновлён с кнопкой WebApp в /start
✅ Изменения загружены на GitHub
✅ Render автоматически деплоит обновления

## Ожидание деплоя

Проверьте статус деплоя:
👉 https://dashboard.render.com/

После деплоя протестируйте:
1. Отправьте боту `/start`
2. Нажмите "🍔 Открыть меню"
3. Проверьте что приложение открывается корректно
