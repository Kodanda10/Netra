# Backend Skeleton for Amogh Dashboard

This directory contains a preliminary structure for the backend services powering the **Amogh** dashboard.  The implementation is intentionally minimal at this stage; it will evolve during Phases 2–4.

## Overview

The backend will be composed of several microservices written in Node.js (or Python, depending on team preference).  Key responsibilities include:

* **Ingestion Service** – Polls financial news sources, state‑level outlets, stock APIs, FDI datasets and social‑media endpoints.  Runs on a schedule (cron or event‑driven) and streams raw data into a processing queue (Kafka/RabbitMQ).
* **Processing & Verification Service** – Consumes messages from the ingestion queue, performs source validation, invokes fact‑check APIs, filters out non‑financial content, translates vernacular text to Hindi, and summarises articles using AI models.  The processed output is stored in the **Single Source of Truth (SSOT)** database.
* **API Gateway** – Exposes REST/GraphQL endpoints to the frontend for retrieving news, stock data, social‑media analytics, FDI metrics, historical archives and weather/intelligence snippets.  Implements authentication, rate limiting and caching (Redis).
* **Notification Service** – Sends alerts or push notifications for watchlist events, daily summaries or critical updates.

## Current Structure

```
backend/
├── README.md          — this file
├── package.json       — placeholder for backend dependencies
├── src/
│   ├── index.js       — entry point for the API gateway (Express)
│   ├── ingestion/
│   │   └── fetcher.js — skeleton of the ingestion service
│   └── ssot/
│       └── schema.js  — draft of the SSOT database schema (PostgreSQL)
└── .env.example       — sample environment variables
```

### `/src/index.js`

Sets up a basic Express server with a single health‑check endpoint.  During Phase 2 this file will be extended to include routes for fetching processed news, stock data, FDI metrics and analytics.

### `/src/ingestion/fetcher.js`

Provides a placeholder class `NewsFetcher` with a `poll()` method.  In subsequent phases, this class will call configured news APIs (e.g. Economic Times, Mint, Dainik Bhaskar, NSE/BSE) and push results into the processing queue.

### `/src/ssot/schema.js`

Defines a preliminary SSOT schema using [Sequelize](https://sequelize.org/) as the ORM.  The schema includes tables for news articles, states, stocks, fdi_metrics and social_media_metrics with basic fields.  Additional fields (e.g. `factCheckScore`, `sourceLinks`) will be added during schema evolution.

### `.env.example`

Lists environment variables that must be provided for the services to run (e.g. database connection strings, API keys for news sources, fact‑check services, translation APIs, social‑media APIs).

## Getting Started

The backend services are not yet functional.  To begin development in Phase 2:

1. Copy `.env.example` to `.env` and fill in the required credentials.
2. Install dependencies via `npm install`.
3. Run `npm run dev` to start the Express API gateway (additional scripts will be added for the ingestion service).

Unit tests and CI scripts will be introduced as the backend components are implemented.