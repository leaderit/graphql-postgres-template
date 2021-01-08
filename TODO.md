# GraphQL backend based on PostgreSQL database with Auth, Access rights and custom Business Logic

## TODO FOR MWP

### Функционал

- Авторизация операций по коду (2 уровневое подтверждение) 
- Загрузка файлов ( через graphql и nginx проработать 2 варианта )
- Доступ к файлам в соответствии с ролью
- Доступ к статическим файлам через NGINX с проверкой доступа по Auth token (backend проверка сессии и прав)

### Безопасность

- Хеш паролей
- Авториазция логин+пароль через стандартный Auth заголовок в дополнение к GraphQL
- Salt для паролей
- Смена пароля пользователем
- Авторизация с фиксированным временем ответа

## Copyrights

(c) Valerii Grazhdankin, Moscow, Russia