FROM node:alpine AS base


FROM base as builder

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL $NEXT_PUBLIC_API_URL

ARG METADATA_TITLE
ENV METADATA_TITLE $METADATA_TITLE

ARG METADATA_DESCRIPTION
ENV METADATA_DESCRIPTION $METADATA_DESCRIPTION

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY . .
RUN npm ci

ENV NEXT_PRIVATE_STANDALONE=true
ENV NEXT_TELEMETRY_DISABLED=1

RUN npx next build


FROM base as runner

WORKDIR /app
RUN rm -rf /usr/local/lib/node_modules

ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

CMD [ "node", "server.js" ]