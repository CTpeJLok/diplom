FROM node:22

# Установка рабочей директории внутри контейнера
WORKDIR /app

# Копирование package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование исходного кода приложения
COPY public .
COPY src .
COPY *.js* .
COPY *.html .
COPY .env* .

# RUN npm run build

CMD [ "npm", "run", "dev" ]
