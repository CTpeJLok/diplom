# Базовый образ Node.js 18
FROM node:18

# Установка рабочей директории внутри контейнера
WORKDIR /app

# Копирование package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование исходного кода приложения
COPY public .
COPY src .
COPY *.js .
COPY *.html .
COPY .env* .

CMD [ "npm", "run", "dev" ]
