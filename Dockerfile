# Estágio 1: Build da aplicação Angular
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# ATENÇÃO: Verifique se o seu build de produção está correto
RUN npm run build -- --configuration production

# Estágio 2: Servir a aplicação com Nginx
FROM nginx:stable-alpine
# Copia os arquivos de build do estágio anterior (verifique o caminho!)
COPY --from=builder /app/dist/ceramic-frontend/browser /usr/share/nginx/html
# Copia a configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80