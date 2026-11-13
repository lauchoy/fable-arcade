FROM node:22-alpine
WORKDIR /app
COPY index.html package.json ./
COPY assets ./assets
COPY games ./games
COPY server ./server
RUN mkdir -p /app/data
ENV PORT=8080 HOST=0.0.0.0 DATA_DIR=/app/data
EXPOSE 8080
VOLUME ["/app/data"]
CMD ["node", "server/server.mjs"]
