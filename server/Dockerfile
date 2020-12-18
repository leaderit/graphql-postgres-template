FROM node:12

# создание директории приложения
WORKDIR /server

# установка зависимостей
# символ астериск ("*") используется для того чтобы по возможности 
# скопировать оба файла: package.json и package-lock.json
COPY package*.json ./

RUN npm install
RUN npm install fastify-cli -g
RUN npm install pm2 -g
# Если вы создаете сборку для продакшн
# RUN npm ci --only=production

# копируем исходный код
COPY . .

EXPOSE 80
# Чистый fastify сервер
# CMD [ "node", "server.js" ]

# Сервер с менеджером в разработке
# CMD ["pm2-runtime", "--watch", "server.js"]
# Сервер с менеджером в работе
CMD ["pm2-runtime", "server.js"]
