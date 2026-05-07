# Build from repository root: docker build -f server/Dockerfile .
# Configure MONGODB_URI, JWT_SECRET, CLIENT_ORIGIN on Cloud Run; do not bake secrets into the image.
FROM node:22-bookworm-slim AS client-build
WORKDIR /repo/client/client
COPY client/client/package.json client/client/package-lock.json ./
RUN npm ci
COPY client/client/ ./
RUN npm run build

FROM node:22-bookworm-slim
WORKDIR /repo/server
ENV NODE_ENV=production
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev
COPY server/ ./
COPY --from=client-build /repo/client/client/dist /repo/client/client/dist
ENV PORT=8080
EXPOSE 8080
WORKDIR /repo/server
CMD ["node", "index.js"]
