# GraphQL backend based on PostgreSQL database with Auth, Access rights and custom Business Logic

## Quick start

**Pre-requisites** : docker, git, docker-compose must be installed.

    mkdir my-project
    cd my-project
    curl https://raw.githubusercontent.com/leaderit/graphql-postgres-template/main/configure.sh | bash -s --

## Warning

Always use HTTPS connection for keep your backend in secure.

## Introduction

The GraphQL application interface based on Hasura, PostgreSQL server and NodeJS framework Fastify 
for custom busines logic. Al services composed into docker containers. 

The Template goals:

* Speed up a development of complex backedns for Web and Mobile applications. 
* Make the development easy, secure and fail-safe.

**Russian** 

Сервис интерфейса прикладнох программ на базе GraphQL интерфейса Hasura, сервера
SQL PostgreSQL и обработчика бизнес логики на базе NodeJS сервера Fastify собран 
для облегчения разработки серверной части для Web и мобильных приложений.

Выбранная комбинация серверных решений обладает следующими преимуществами.

- Высокая производительность
- Легкая расширяемость
- Поддержка внешних REST API
- Интеграция внешних GraphQL сервисов
- Подписка на обновления через Web Sockets
- Удобная GraphQL консоль для настройки и отладки запросов и данных
- Многое другое

## Функциональные возможности сервиса
## Registrations and Authorisations

The template provides a GraphQL API for this, described in

[Registration and Authorisation](doc/AUTH.md)

...
### Users

### Roles


### Organisations (Companies, Business units, etc.)


### Organisations Users



### Local Files Storage
- Загрузка файлов через POST form/data средствами сервера Nginx
- Доступ к данным о файлах в соответствии с ролью
- Доступ к статическому содержимому файлов через NGINX с проверкой прав доступа через Backend
- Ограничение размера загрузки
- Ограничение скорости загрузки
- Настраиваемые Файловые хранилища для данных пользователя, организации, общедоступные
- Кеширование запросов доступа к файлам, сокращение времени проверки доступа до 3-х раза при повторных запросах
- Ограничение загрузки содержимого файлов с проверкой прав доступа через Backend перед приемом содержимого файла.

### Distributed Object Storage Min.IO

- Integration Min.IO Storage API into backend server as standatd Fastify plugin
- GraphQL: get direct object's url for upload
- Upload an object via the direct url
- Access to an object via the direct url
- GraphQL: get direct object's url for access and download
- GraphQL: copy an object
- GraphQL: delete an object
- GraphQL: move an object
- Functional tests

### Applications

It the template you can not access to docker services directly by securitu reason.
You can access to the template subsystems via Nginx proxy only.

Default endpoints for access services are:

- Files Upload API: http://localhost:8088/api/
- Hasura GraphQL API: http://localhost:8088/graphql/
- Hasura Console: http://localhost:8088/hasura/


Details are in `img/nginx/default.conf`

### Security

...

## Настройка

### Docker resources required

Данная система в минимальной конфигурации расчитана на комфортную работу
около 10 000 пользователей c одновременной активностью по количеству 
запросов до 50 в секунду для обеспечения времени реакции менее 1 сек.

Минимальные требования по количеству ресурсов, выделенных для работы docker, 
чтобы все подсистемы работали корректно.

2 CPU
4Gb RAM

Я тестировал на MacBook Pro 2.4 GHz 8‑ядерный процессор Intel Core i9
Под `Docker` выделено 4Gb RAM, 2CPU, 4Gb swap file.

При этом за 18 минут тестирования было выполнено 30000 регистраций 
и разрегистраций новых пользователей. Таким образом в этой конфигурации
выполнялось в среднем 56 запросов к API в 1 секунду.

На конфигурации 2 CPU и 8Gb RAM создание и удаление 100 000 пользователей
заняло 1 час, что составляет примерно 56 запросов в секунду. 

Увеличение CPU с 2-х до 4-х при 4Gb RAM не увеличило скорость выполнения запросов.
Многопроцессорную оптимизацию сервиса необходимо выполнять дополнительно.

Увеличение RAM с 4-х до 8 Gb не увеличило скорость выполнения запросов.

Максимальная память ребуется для работы PostgreSQL и тут возможна оптимизации на
уровне конфигурирования сервера БД.

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

При этом вы будете видеть все сообoщения служб на консоли. При обновлении
исходных текстовых файлов серверной части сервиса программа PM2
автоматически перестартует серверную часть и вы можете тестировать новый функционал.

### Запуск сервиса в режиме демона

В режиме демона сервис может быть запущен командой

    docker-compose up -d

### Database setup

После запуска сервисов будеет создана пустая база данных `PostgreSQL` в папке db/postgres
и `Redis` в папке db/redis.

Выполните создание таблиц, загрузку метаданных и данных по умолчанию для тестирования, 
введя команды:

    ./hasura-cli migrate apply
    ./hasura-cli metadata apply
    ./hasura-cli seeds apply

Повторный запуск команд на существующей базе данных может вызвать ошибку.

### How to delete all migrations records

    1. Run `./psql-cli`
    2. Enter command: `DELETE FROM hdb_catalog.schema_migrations;`
    3. Quit by `\q`

### Запуск тестов

Для того, чтобы убедиться, что ваши настройки выполнены правильно и сервисы работают корректно
запустите на настроенной базе занных тесты сервисов GraphQL API командой:

    ./run-tests 

Все тесты должны завершиться без ошибок.

### Роли и права доступа

В сервисе используется ролевая модель доступа. Это означает, что все роли прописываются
при настройке сервиса и доступ к данным осуществляется на основе прав конкретной роли
пользователя, под которой он подключился к сервису.

Стандартные роли при создании сервиса следующие.

- admin
- anonymous
- user
- manager
- orgadmin
- owner

Список ролей для назначения пользователям записан в таблице БД `roles`.
Этот список должен совпадать со списком ролей, прописанных в Hasura.

Вы можете добавить любые необходимые вам роли и настроить доступ к данным
в зависимости от того, какую роль доступа имеет пользователь.

Номера ролей с 1 по 999 зарезервированы для системных целей. Используйте
роли приложения начиная с номера 1000, который зарезервирован для 
простого пользователя без дополнительных полномочий.

##  Производственный режим

Загрузка на производственный сервер и настройка запуска.

## Перенос сервса на другой сервер

Так как сервис выполняется в контейнерах docker для переноса сервиса на новый сервер
вам достаточно 

- установить на нем docker и docker-compose
- скопировать папку вашего сервиса со всем содержимым на новый сервер
- корректно настроить файл .env на новый домен или сервер
- выполнить docker-compose up -d

## Обновление сервиса на новую версию

Чтобы обновить сервис на новую версию вам необходимо выполнить следующие шаги.

- Сохранить ваши метаданные и базу данных старого сервера

    ./db-backup
    ./hasura-cli metadata export
- При необходимости сохранить миграцию командой

    ./hasura-cli migrate create --from-server init

где `init` - имя миграциию если вы перед этим выгрузили другие миграцииб вам 
необходимо удалить дублирующиеся команды из новой миграции вручную. В противном случае
мат как миграции выполняются последовательно и накладываются одна на другую,
возможны конфликты.

- Скачать и установить чистый шаблон сервиса на вашем новом сервере.

    git clone https://github.com/leaderit/graphql-postgres-template
    
- Переименовать папку шаблона в папку с именем сервиса вашего проекта

    mv graphql-postgres-template graphql-my-project

- Сохранить метаданные по умолчанию в другой папке

    mv ./db/metadata ./db/metadata.default

- Скопировать файлы `.env`, последний файл `*-backup.sql` и папку ./db/metadata на новый сервер

- настроить файл `.env` под новые сервер

- Исправить метаданные вручную, добавив в ваши метаданные необходимые дополнения из данных по умолчанию

- Исправить вручную ваши данные в файле `*-backup.sql`, добавив туда изменения структур из обновленной версии или создать специальную миграцию для обновления структуры

- Восстановить ваши метаданные

    ./hasura-cli metadata apply

- Восстановить данные

    ./db-restore [file name]-backup.sql

## Plans and TODOs

I have plans to extend functionality of the template. I wrote it in the

[TODO file](TODO.md)


## Copyrights

(c) Valerii Grazhdankin, Moscow, Russia, 2020-2021