# Установка переменных окружения для бэкенда
$env:DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/medusa'

# Проверка, запущен ли Docker
$dockerStatus = docker ps 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker не запущен. Запустите Docker Desktop и повторите попытку."
    exit 1
}

# Проверка, существует ли контейнер medusa-pg
$containerExists = docker ps -a --filter "name=medusa-pg" --format "{{.Names}}"
if ($containerExists -eq "medusa-pg") {
    # Если контейнер существует, но не запущен, запускаем его
    $containerRunning = docker ps --filter "name=medusa-pg" --format "{{.Names}}"
    if ($containerRunning -ne "medusa-pg") {
        Write-Host "Запускаем существующий контейнер с Postgres..."
        docker start medusa-pg
    } else {
        Write-Host "Контейнер Postgres уже запущен."
    }
} else {
    # Создаем новый контейнер
    Write-Host "Создаем новый контейнер с Postgres..."
    docker run -d --name medusa-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=medusa -p 5432:5432 postgres:15
}

# Ждем, пока Postgres будет готов
Write-Host "Ждем, пока Postgres будет готов..."
Start-Sleep -Seconds 5

# Выполняем миграции и сидинг
Write-Host "Выполняем миграции базы данных..."
npx medusa db:migrate

Write-Host "Выполняем сидинг базы данных..."
npx medusa seed

Write-Host "База данных настроена и заполнена тестовыми данными."
