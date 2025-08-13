# Amogh Article Fetch and Processing Logic

This document outlines the logic for fetching, processing, and delivering articles for the Amogh Financial Intelligence Dashboard.

## 1. Data Ingestion

### Primary Source: RSS Feeds
- The system will primarily fetch articles from a predefined list of RSS feeds.
- The RSS feeds will be fetched every hour.

### Fallback Source: GNews
- If the RSS feeds fail or do not provide enough articles, the system will fall back to the GNews API.

## 2. Article Processing Pipeline

### Step 1: Fact-Checking (Article and Source)
- **Article Fact-Checking:** Each article will be fact-checked using the Google Fact Check API.
- **Source Whitelist:** The source URL of each article will be checked against a whitelist of trusted sources.

### Step 2: Categorization
- Articles will be segregated into the following categories:
    - Finance
    - Industry
    - FinancePolicy
- Articles will also be segregated for the "Bharat Card" or "State Cards".

### Step 3: Summarization
- **Primary Service:** Grok (X.ai) API
- **Fallback Service 1:** OpenAI API
- **Fallback Service 2:** Gemini API
- The English summary will be generated first.

### Step 4: Translation
- The English summary will be translated to Hindi.

### Step 5: Final Checks
- The translated summary will be checked for:
    - Context
    - Bias mitigation
    - Anti-hallucination

### Step 6: Delivery
- The processed article will be pushed to the frontend pipeline.

## 3. AI Chat
- The AI chat feature will use the best model for finance-related queries. The model will be selected after research and evaluation.

## 4. Refresh Cycle
- The entire pipeline will be executed every hour to ensure the data is fresh.
