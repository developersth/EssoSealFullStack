# stage 1
FROM node:13 as build
# Use an official Node.js runtime as a parent image

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Serve the app with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/esso-seal /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
