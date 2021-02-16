# GraphQL backend based on PostgreSQL database with Auth, Access rights and custom Business Logic

## TODO FOR MWP

### Функционал

- Авторизация операций по коду (2 уровневое подтверждение) Authorisation-Code 
- Выбор организации из доступных пользователю
- Организация по умолчанию при регистрации/входе пользователя (устанавливать если null), добавление нового пользователя в список организации по умолчанию
- Добавить в files поле storage - для указания хранилища и location для указания места размещения распределенного хранилища этого файла. Это добавить  в будущем возможность перемещать файл между размещениями хранилища прозрачно для клиента и выдавать ему правильный url для скачивания
- Добавить обработку storage и location для backend

### File Storage

#### Distributed Storage Min.IO
- TESTS
- upload
- download
- access to a file
- check access rights
- get object url
- delete
- move

#### Persistent storage via nginx get
- TESTS
- Access via nginx url

### Обслуживание
- Добавить проверку мусора в хранилище
- Добавить очистку папки временного хранения данных загрузки

### Безопасность

- Смена пароля пользователем
- Добавить очистку кеша при обновлении полей files.storage/ files.location или удалении файла

## Copyrights

(c) Valerii Grazhdankin, Moscow, Russia