# Установка переменных окружения для бэкенда
$env:DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/medusa'
$env:STORE_CORS = '*'
$env:ADMIN_CORS = 'http://localhost:5173,http://localhost:7000'
$env:AUTH_CORS = 'http://localhost:5173,http://localhost:3000'
$env:JWT_SECRET = 'supersecret'
$env:COOKIE_SECRET = 'supersecret'

# Запуск бэкенда Medusa
npx medusa develop
