FROM node:22-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
COPY apps/landing/package.json apps/landing/package.json
COPY apps/admin/package.json apps/admin/package.json
COPY apps/client/package.json apps/client/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/utils/package.json packages/utils/package.json
COPY packages/api/package.json packages/api/package.json
COPY packages/auth/package.json packages/auth/package.json
COPY packages/assets/package.json packages/assets/package.json
COPY packages/types/package.json packages/types/package.json
RUN yarn install --frozen-lockfile
COPY . .
# App-local .env files are excluded by .dockerignore.
# Supply the selected app's public configuration through build arguments.
ARG APP=landing
ARG VITE_SITE_INDEXABLE=false
ARG VITE_LANDING_URL
ARG VITE_ADMIN_URL
ARG VITE_CLIENT_URL
ENV VITE_SITE_INDEXABLE=$VITE_SITE_INDEXABLE VITE_LANDING_URL=$VITE_LANDING_URL VITE_ADMIN_URL=$VITE_ADMIN_URL VITE_CLIENT_URL=$VITE_CLIENT_URL
RUN yarn build:$APP && cp -r apps/$APP/dist /site \
  && if [ "$APP" = "landing" ]; then cp deploy/nginx.landing.conf /nginx.conf; else cp deploy/nginx.conf /nginx.conf; fi

FROM nginx:stable-alpine
COPY --from=build /nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /site /usr/share/nginx/html
HEALTHCHECK --interval=5s --timeout=3s --start-period=5s --retries=12 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
EXPOSE 80
