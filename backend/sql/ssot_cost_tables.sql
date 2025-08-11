
CREATE TABLE IF NOT EXISTS daily_counters (
  day DATE NOT NULL,
  key TEXT NOT NULL,
  value BIGINT NOT NULL,
  PRIMARY KEY (day, key)
);

CREATE TABLE IF NOT EXISTS translation_cache (
  hash TEXT PRIMARY KEY,
  text_hi TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS cost_logs (
  id BIGSERIAL PRIMARY KEY,
  day DATE NOT NULL,
  metric TEXT NOT NULL,
  value_inr NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
