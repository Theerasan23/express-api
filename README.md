## สำหรับ config และ start
```bash
npm i
npm start
```
### Dockerfile

```dockerfile
FROM node:alpine

WORKDIR /app

COPY package*.json .

COPY . .

RUN npm install


EXPOSE 4333

CMD [ "npm" , "start" ]
```
### .env
```bash
DB_HOST="localhost"
DB_USER="root"
DB_PASSWORD="your password"
DB_DATABASE="your db"
EXPRESS_PORT=4333
```
