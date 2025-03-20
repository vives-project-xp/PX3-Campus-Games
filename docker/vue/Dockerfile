# Development Stage
FROM node:23-alpine AS develop-stage
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .

# Build Stage
FROM develop-stage AS build-stage
ARG VUE_APP_API_HOST
ENV VITE_API_HOST ${VUE_APP_API_HOST}
RUN npm run build

# Production Stage
FROM nginx:1.27-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]