CREATE TABLE IF NOT EXISTS theme_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  action varchar(32) NOT NULL,
  previous_style varchar(32),
  new_style varchar(32),
  previous_font varchar(32),
  new_font varchar(32),
  theme_version varchar(32),
  created_at timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS theme_audit_user_created_idx
  ON theme_audit_log (user_id, created_at);
