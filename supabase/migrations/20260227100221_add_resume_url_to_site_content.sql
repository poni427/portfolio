/*
  # Add resume_url key support

  No schema change needed — resume_url is stored as a regular site_content row.
  This migration adds a default empty row so the admin can see it immediately.
*/

INSERT INTO site_content (key, value, updated_at)
VALUES ('resume_url', '', now())
ON CONFLICT (key) DO NOTHING;
