CREATE TABLE IF NOT EXISTS daily_counters(
  day date,
  key text,
  value bigint,
  PRIMARY KEY(day, key)
);

CREATE TABLE IF NOT EXISTS translation_cache(
  hash text PRIMARY KEY,
  text_hi text,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

CREATE TABLE IF NOT EXISTS cost_logs(
  id bigserial PRIMARY KEY,
  day date,
  metric text,
  value_inr numeric(12,2),
  created_at timestamptz DEFAULT now()
);