# Настройка API ключа для Storefront

## Проблема
Storefront требует Publishable API Key для доступа к Store API.

## Решение

### Вариант 1: Через админку (Рекомендуется)

1. Откройте админку: `http://localhost:9000/app`
2. Войдите с учетными данными:
   - Email: `admin@medusa.com`
   - Пароль: `supersecret`
3. Перейдите в Settings → API Key Management
4. Создайте новый Publishable API Key:
   - Нажмите "Create API Key"
   - Выберите тип "Publishable"
   - Введите название: "Storefront Key"
   - Сохраните

### Вариант 2: Временное решение

В файле `storefront/src/lib/medusa.ts` уже настроен временный ключ `pk_test_default`.

### Настройка переменных окружения

Создайте файл `storefront/.env.local` с содержимым:

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=your_actual_api_key_here
```

Замените `your_actual_api_key_here` на реальный ключ из админки.

## Проверка

После настройки API ключа:
1. Перезапустите storefront: `npm run dev`
2. Откройте `http://localhost:3000/products`
3. Продукты должны загружаться без ошибок CORS
