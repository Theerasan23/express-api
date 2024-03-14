## สำหรับ config และ start
```bash
npm i
npm start
```
### Dockerfile
```dockerfile
FROM node:alpine

COPY . /app
WORKDIR /app

RUN npm i express mysql2 dotenv @types/express typescript ts-node

EXPOSE 3000

CMD [ "npm" , "start" ]
