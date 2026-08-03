# Multi-stage build — imagem final enxuta, sem devDependencies nem código-fonte TS.
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev
RUN npx prisma generate
COPY --from=build /app/dist ./dist

EXPOSE 3000
# Sincroniza o schema com o banco antes de subir (sem histórico de migrations
# ainda — ver server/README.md). Idempotente: seguro em todo restart.
CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/main.js"]
