# 🚀 Настройка GitHub Pages

## ✅ Frontend загружен в репозиторий!

Репозиторий: https://github.com/RAZ-AR/hifoodv1

---

## 📋 Шаги для активации GitHub Pages

### 1. Включите GitHub Pages

1. Откройте https://github.com/RAZ-AR/hifoodv1/settings/pages
2. В разделе **Source**:
   - Выберите **GitHub Actions**
3. Сохраните

### 2. Дождитесь автоматического деплоя

1. Перейдите на https://github.com/RAZ-AR/hifoodv1/actions
2. Вы увидите workflow **"Deploy to GitHub Pages"**
3. Дождитесь завершения (зеленая галочка ✅)

### 3. Проверьте результат

Ваше приложение будет доступно по адресу:

```
https://raz-ar.github.io/hifoodv1/
```

---

## 🎯 Что уже настроено

✅ **vite.config.ts** - base URL установлен на `/hifoodv1/`
✅ **GitHub Actions** - автоматический деплой при каждом push
✅ **.gitignore** - правильно настроен
✅ **package.json** - все зависимости на месте

---

## 🔄 Автоматический деплой

При каждом `git push` в ветку `main`:

1. GitHub Actions автоматически соберет проект
2. Задеплоит на GitHub Pages
3. Через 1-2 минуты изменения будут доступны

---

## 🧪 Локальная разработка

```bash
cd /Users/bari/Documents/GitHub/hifoodv1
npm install
npm run dev
```

Откройте http://localhost:5173

---

## 📦 Деплой вручную (если нужно)

```bash
npm run build
npx gh-pages -d dist
```

Но это не нужно - GitHub Actions делает это автоматически!

---

## 🎨 Что в приложении

✅ **Header** с картой лояльности (#1234) 🎴
✅ **Telegram Web App SDK** интегрирован
✅ **Tailwind CSS** с бирюзовым цветом (#01fff7)
✅ **TypeScript** типы
✅ **Тестовый пользователь** для разработки

---

## 🤖 Настройка Telegram Bot

После того как GitHub Pages задеплоится:

1. Откройте [@BotFather](https://t.me/BotFather)
2. Отправьте `/setmenubutton`
3. Выберите вашего бота
4. **Button text**: `Открыть меню 🍕`
5. **Web App URL**: `https://raz-ar.github.io/hifoodv1/`

---

## ✅ Проверочный список

- [x] Frontend загружен в GitHub
- [x] GitHub Actions настроен
- [x] vite.config.ts обновлен для GitHub Pages
- [ ] Включить GitHub Pages в Settings
- [ ] Дождаться первого деплоя
- [ ] Открыть https://raz-ar.github.io/hifoodv1/
- [ ] Настроить Telegram Bot
- [ ] Протестировать в Telegram

---

## 🔧 Troubleshooting

### GitHub Actions не запускается

Проверьте:
1. Settings → Actions → General
2. **Workflow permissions** должно быть "Read and write permissions"

### 404 ошибка на GitHub Pages

Подождите 2-3 минуты после первого деплоя.
Проверьте что base URL в vite.config.ts = `/hifoodv1/`

### Blank page

Откройте Console (F12) и проверьте ошибки.
Скорее всего проблема с base URL.

---

## 📚 Следующие шаги

1. **Дождитесь деплоя** на GitHub Pages
2. **Настройте Telegram Bot** с URL приложения
3. **Протестируйте** в Telegram
4. **Разрабатывайте** новые страницы (см. README.md)

---

**Frontend готов и загружен! 🎉**

URL приложения: https://raz-ar.github.io/hifoodv1/
