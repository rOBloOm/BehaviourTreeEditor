#stage 1
FROM node:latest as node
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build --prod

#stage 2
FROM nginx:alpine
COPY --from=node /app/dist/apps/tree-editor /usr/share/nginx/html