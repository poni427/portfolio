
/*
  # Create portfolio-media storage bucket

  1. Storage
    - Creates `portfolio-media` bucket if not exists
    - Sets file size limit to 200MB for large video files
    - Allows public access to files

  2. Security
    - Public read access for all files
    - Authenticated users can upload/update/delete files
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-media',
  'portfolio-media',
  true,
  209715200,
  ARRAY['image/jpeg','image/png','image/gif','image/webp','image/svg+xml','video/mp4','video/webm','video/ogg','video/quicktime','video/x-msvideo','video/mpeg']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 209715200,
  public = true;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Public read portfolio-media'
  ) THEN
    CREATE POLICY "Public read portfolio-media"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'portfolio-media');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Auth upload portfolio-media'
  ) THEN
    CREATE POLICY "Auth upload portfolio-media"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'portfolio-media');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Auth update portfolio-media'
  ) THEN
    CREATE POLICY "Auth update portfolio-media"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING (bucket_id = 'portfolio-media');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Auth delete portfolio-media'
  ) THEN
    CREATE POLICY "Auth delete portfolio-media"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = 'portfolio-media');
  END IF;
END $$;
