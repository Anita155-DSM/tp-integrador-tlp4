FROM node:22-alpine
WORKDIR /app
# primero solo los package*.json, así Docker reutiliza la caché de dependencias
COPY package*.json ./
RUN npm ci
# después el código, y se compila TypeScript a JavaScript
COPY . .
RUN npm run build
# ya compilado, se sacan las dependencias de desarrollo
RUN npm prune --omit=dev

CMD ["npm", "start"]
