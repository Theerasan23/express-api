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
