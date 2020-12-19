# GraphQL backend on PostgreSQL with Auth, Access rights and custom Business Logic

## Введение

Сервис интерфейса прикладнох программ на базе GraphQL интерфейса Hasura, сервера
SQL PostgreSQL и обработчика бизнес логики на базе NodeJS сервера Fastify собран 
для облегчения разработки серверной части для Web и мобильных приложений.

Выбранная комбинация серверных решений обладает следующими преимуществами.

- Высокая производительность
- Легкая расширяемость
- Поддержка внешних POST API
- Интеграция внешних GraphQL сервисов
- Подписка на обновления через Web Sockets
- Удобная GraphQL консоль для настройки и отладки запросов и данных
- Многое другое

## Настройка
### Файл конфигурации .env
Скопируйте файл с примером конфигурации `env-example` в файл с именем `.env`
и настройте парметры.

Установите имя вашего сервиса в списке контейнеров docker. Это имя используется как префикс
для всех образов сервиса.

    NAME=graphql-postgres-template

Установите значения паролей и портов чтобы иметь доступ извне к отдельным контейнерам.

### Запуск сервиса в режиме отладки

Для отладки необходимо запустить сервис в консольном режиме. 

    docker-compose up

Пhи этом вы будете видеть все сообoщения служб на консоли. При обновлении
исходных текстовых файлов серверной части сервиса программа PM2
автоматически перестартует серверную часть и вы можете тестировать новый функционал.

### Запуск сервиса в режиме демона

В режиме демона сервис может быть запущен командой

    docker-compose up -d

### Настройка базы данных

После запуска сервисов будеет создана пстая база данных `PostgreSQL` в папке db/postgres
и `Redis` в папке db/redis.

Выполните загрузку метаданных и данных по умолчанию для тестирования, введя команды:

    ./hasura-cli ???

### Роли и прива доступа

В сервисе используется ролевая модель доступа. Это означает, что все роли прописываются
при настройке сервиса и доступ к данным осуществляется на основе прав конкретной роли
пользователя, под которой он подключился к сервису.

Стандартные роли при создании сервиса следующие.

- admin
- anonimous
- user

Список ролей для назначения пользователям записан в таблице БД `roles`.
Этот список должен совпадать со списком ролей, прописанных в Hasura.


In this folder you should define all the services that define the routes
of your web application.
Each service is a [Fastify
plugin](https://www.fastify.io/docs/latest/Plugins/), it is
encapsulated (it can have its own independent plugins) and it is
typically stored in a file; be careful to group your routes logically,
e.g. all `/users` routes in a `users.js` file. We have added
a `root.js` file for you with a '/' root added.

##  Продукт

If a single file become too large, create a folder and add a `index.js` file there:
this file must be a Fastify plugin, and it will be loaded automatically
by the application. You can now add as many files as you want inside that folder.
In this way you can create complex services within a single monolith,
and eventually extract them.

If you need to share functionality between services, place that
functionality into the `plugins` folder, and share it via
[decorators](https://www.fastify.io/docs/latest/Decorators/).
