# Multi-stage Dockerfile for assetforce-console monorepo
# Supports both customer-portal and admin-console apps

# =============================================================================
# Stage 1: Base - Install dependencies
# =============================================================================
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# =============================================================================
# Stage 2: Dependencies - Install and cache node_modules
# =============================================================================
FROM base AS deps

# Copy package files
COPY package.json yarn.lock .npmrc ./
COPY apps/customer-portal/package.json ./apps/customer-portal/
COPY apps/admin-console/package.json ./apps/admin-console/
COPY packages/material/package.json ./packages/material/
COPY packages/graphql/package.json ./packages/graphql/
COPY packages/auth/package.json ./packages/auth/
COPY packages/feature/authentication/package.json ./packages/feature/authentication/

# Install dependencies
# GITHUB_PACKAGES_TOKEN is required for @assetforce/* packages
ARG GITHUB_PACKAGES_TOKEN
RUN echo "//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}" >> .npmrc && \
    yarn install --frozen-lockfile && \
    sed -i '$ d' .npmrc

# =============================================================================
# Stage 3: Builder - Build all packages and apps
# =============================================================================
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build all packages first, then apps
RUN yarn build

# =============================================================================
# Stage 4a: Runner - Customer Portal (production)
# =============================================================================
FROM base AS customer-portal
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/customer-portal/public ./apps/customer-portal/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/customer-portal/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/customer-portal/.next/static ./apps/customer-portal/.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/customer-portal/server.js"]

# =============================================================================
# Stage 4b: Runner - Admin Console (production)
# =============================================================================
FROM base AS admin-console
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/admin-console/public ./apps/admin-console/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin-console/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin-console/.next/static ./apps/admin-console/.next/static

USER nextjs

EXPOSE 3001
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/admin-console/server.js"]

# =============================================================================
# Stage 5: Development - For local development with hot-reload
# =============================================================================
FROM base AS dev
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock .npmrc ./
COPY apps/customer-portal/package.json ./apps/customer-portal/
COPY apps/admin-console/package.json ./apps/admin-console/
COPY packages/material/package.json ./packages/material/
COPY packages/graphql/package.json ./packages/graphql/
COPY packages/auth/package.json ./packages/auth/
COPY packages/feature/authentication/package.json ./packages/feature/authentication/

ARG GITHUB_PACKAGES_TOKEN
RUN echo "//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}" >> .npmrc && \
    yarn install && \
    sed -i '$ d' .npmrc

# Copy source (will be overwritten by volume mount in dev)
COPY . .

EXPOSE 3000 3001

CMD ["yarn", "dev"]
