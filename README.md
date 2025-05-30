# Приложение на React Native с картой – Практическое задание

## Инструкциями по установке

1. Установка зависимостей

   ```bash
   npm install
   ```

2. Запуск приложения

   ```bash
    npx expo start
   ```

## Запуск

```1. Установка Android Studio для эмулятора и его запуск```

```2. Запуск expo```

``` 3.Нажать а для запуска проекта на эмуляторе```

## - Дополнительными информация
Вместо zustand из первой части использовался contxet

# Документация схемы базы данных

- Используется SQLite для хранения маркеров и картинок

## Таблицы:
- Markers
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  title text NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP

- Marker_Images
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  marker_id INTEGER NOT NULL,
  uri TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP

# Описание подхода к обработке ошибок

- Все запросы к БД вначале проверяют инициализацию базы данных и только потом выполняются
- Также обрабатываются ошибки навигации и работы с изображениями 
- Для реализации транзакции был создан отдельный запрос который удлаяет и маркер и вложенные в него картинки
