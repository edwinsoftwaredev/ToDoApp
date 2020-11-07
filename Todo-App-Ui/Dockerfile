# Build enviroment
FROM node:12-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
COPY . ./
RUN npm run build

# Production enviroment
FROM nginx:stable-alpine
COPY --from=build /app/build /var/www/html/
COPY --from=build /app/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
