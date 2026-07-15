# ============================================
# Falcão Saúde Ocupacional — Dockerfile
# Multi-stage: Node 20 (build) → Nginx 1.27 (serve estáticos)
# ============================================

# ---------- 1. Build ----------
FROM node:20-alpine AS build
WORKDIR /app

# Dependências do sistema para compilar pacotes nativos (caso algum precise)
RUN apk add --no-cache libc6-compat

# Copia apenas manifests primeiro para aproveitar o cache de camadas
COPY package.json package-lock.json* ./
RUN npm ci

# Copia o restante e gera o bundle de produção
COPY . .
RUN npm run build

# ---------- 2. Runtime ----------
FROM nginx:1.27-alpine AS runtime

# Configuração do Nginx com fallback SPA + headers de segurança
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copia o bundle gerado
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
