# Установка переменных окружения для бэкенда
$env:DATABASE_URL = 'postgres://postgres:postgres@localhost:5432/medusa'
$env:JWT_SECRET = 'supersecret'
$env:COOKIE_SECRET = 'supersecret'

# Создание пользователя админки
Write-Host "Создание пользователя админки..."
npx medusa user -e admin@medusa.com -p supersecret

Write-Host "Пользователь админки создан."
Write-Host "Email: admin@medusa.com"
Write-Host "Пароль: supersecret"
