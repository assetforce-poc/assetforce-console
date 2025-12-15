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
COPY packages/graphql-config/package.json ./packages/graphql-config/
COPY packages/auth/package.json ./packages/auth/
COPY packages/form/package.json ./packages/form/
COPY packages/feature/authentication/package.json ./packages/feature/authentication/
COPY packages/feature/common/package.json ./packages/feature/common/
COPY packages/feature/user/package.json ./packages/feature/user/
COPY packages/feature/account/package.json ./packages/feature/account/

# Install dependencies
# GITHUB_PACKAGES_TOKEN is required for @assetforce/* packages
ARG GITHUB_PACKAGES_TOKEN
RUN node -e "require('fs').appendFileSync('.npmrc','//npm.pkg.github.com/:_authToken='+process.env.GITHUB_PACKAGES_TOKEN+'\\n')" && \
    yarn install --frozen-lockfile && \
    sed -i '$ d' .npmrc

# =============================================================================
# Stage 3a: Builder - Build customer-portal
# =============================================================================
FROM base AS builder-customer-portal
WORKDIR /app

ARG GITHUB_PACKAGES_TOKEN

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN node -e "require('fs').appendFileSync('.npmrc','//npm.pkg.github.com/:_authToken='+process.env.GITHUB_PACKAGES_TOKEN+'\\n')" && \
    yarn turbo build --filter=@assetforce/customer-portal && \
    sed -i '$ d' .npmrc

# =============================================================================
# Stage 3b: Builder - Build admin-console
# =============================================================================
FROM base AS builder-admin-console
WORKDIR /app

ARG GITHUB_PACKAGES_TOKEN

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN node -e "require('fs').appendFileSync('.npmrc','//npm.pkg.github.com/:_authToken='+process.env.GITHUB_PACKAGES_TOKEN+'\\n')" && \
    yarn turbo build --filter=@assetforce/admin-console && \
    sed -i '$ d' .npmrc

# =============================================================================
# Stage 3 (legacy): Builder - Build all packages and apps
# =============================================================================
FROM base AS builder
WORKDIR /app

ARG GITHUB_PACKAGES_TOKEN

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN node -e "require('fs').appendFileSync('.npmrc','//npm.pkg.github.com/:_authToken='+process.env.GITHUB_PACKAGES_TOKEN+'\\n')" && \
    yarn build && \
    sed -i '$ d' .npmrc

# =============================================================================
# Stage 4a: Runner - Customer Portal (production)
# =============================================================================
FROM base AS customer-portal
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder-customer-portal /app/apps/customer-portal/public ./apps/customer-portal/public
COPY --from=builder-customer-portal --chown=nextjs:nodejs /app/apps/customer-portal/.next/standalone ./
COPY --from=builder-customer-portal --chown=nextjs:nodejs /app/apps/customer-portal/.next/static ./apps/customer-portal/.next/static

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

COPY --from=builder-admin-console /app/apps/admin-console/public ./apps/admin-console/public
COPY --from=builder-admin-console --chown=nextjs:nodejs /app/apps/admin-console/.next/standalone ./
COPY --from=builder-admin-console --chown=nextjs:nodejs /app/apps/admin-console/.next/static ./apps/admin-console/.next/static

USER nextjs

EXPOSE 3001
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/admin-console/server.js"]

# =============================================================================
# Stage 5: Development - For local development with hot-reload (combined)
# =============================================================================
FROM base AS dev
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock .npmrc ./
COPY apps/customer-portal/package.json ./apps/customer-portal/
COPY apps/admin-console/package.json ./apps/admin-console/
COPY packages/material/package.json ./packages/material/
COPY packages/graphql/package.json ./packages/graphql/
COPY packages/graphql-config/package.json ./packages/graphql-config/
COPY packages/auth/package.json ./packages/auth/
COPY packages/form/package.json ./packages/form/
COPY packages/feature/authentication/package.json ./packages/feature/authentication/
COPY packages/feature/common/package.json ./packages/feature/common/
COPY packages/feature/user/package.json ./packages/feature/user/
COPY packages/feature/account/package.json ./packages/feature/account/

ARG GITHUB_PACKAGES_TOKEN
RUN node -e "require('fs').appendFileSync('.npmrc','//npm.pkg.github.com/:_authToken='+process.env.GITHUB_PACKAGES_TOKEN+'\\n')" && \
    yarn install && \
    sed -i '$ d' .npmrc

# Copy source (will be overwritten by volume mount in dev)
COPY . .

EXPOSE 3000 3001

CMD ["yarn", "dev"]

# =============================================================================
# Stage 5a: Development - Customer Portal (separate container)
# =============================================================================
FROM base AS customer-portal-dev
WORKDIR /app

COPY package.json yarn.lock .npmrc ./
COPY apps/customer-portal/package.json ./apps/customer-portal/
COPY apps/admin-console/package.json ./apps/admin-console/
COPY packages/material/package.json ./packages/material/
COPY packages/graphql/package.json ./packages/graphql/
COPY packages/graphql-config/package.json ./packages/graphql-config/
COPY packages/auth/package.json ./packages/auth/
COPY packages/form/package.json ./packages/form/
COPY packages/feature/authentication/package.json ./packages/feature/authentication/
COPY packages/feature/common/package.json ./packages/feature/common/
COPY packages/feature/user/package.json ./packages/feature/user/
COPY packages/feature/account/package.json ./packages/feature/account/

ARG GITHUB_PACKAGES_TOKEN
RUN node -e "require('fs').appendFileSync('.npmrc','//npm.pkg.github.com/:_authToken='+process.env.GITHUB_PACKAGES_TOKEN+'\\n')" && \
    yarn install && \
    sed -i '$ d' .npmrc

COPY . .

EXPOSE 3000

CMD ["yarn", "workspace", "@assetforce/customer-portal", "dev"]

# =============================================================================
# Stage 5b: Development - Admin Console (separate container)
# =============================================================================
FROM base AS admin-console-dev
WORKDIR /app

COPY package.json yarn.lock .npmrc ./
COPY apps/customer-portal/package.json ./apps/customer-portal/
COPY apps/admin-console/package.json ./apps/admin-console/
COPY packages/material/package.json ./packages/material/
COPY packages/graphql/package.json ./packages/graphql/
COPY packages/graphql-config/package.json ./packages/graphql-config/
COPY packages/auth/package.json ./packages/auth/
COPY packages/form/package.json ./packages/form/
COPY packages/feature/authentication/package.json ./packages/feature/authentication/
COPY packages/feature/common/package.json ./packages/feature/common/
COPY packages/feature/user/package.json ./packages/feature/user/
COPY packages/feature/account/package.json ./packages/feature/account/

ARG GITHUB_PACKAGES_TOKEN
RUN node -e "require('fs').appendFileSync('.npmrc','//npm.pkg.github.com/:_authToken='+process.env.GITHUB_PACKAGES_TOKEN+'\\n')" && \
    yarn install && \
    sed -i '$ d' .npmrc

COPY . .

EXPOSE 3001

CMD ["yarn", "workspace", "@assetforce/admin-console", "dev"]
