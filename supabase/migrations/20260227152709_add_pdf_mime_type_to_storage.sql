/*
  # Add PDF mime type to portfolio-media bucket

  1. Changes
    - Updates `allowed_mime_types` for the `portfolio-media` bucket to include `application/pdf`
    - This allows uploading resume PDF files through the admin panel
*/

UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
  'video/x-msvideo',
  'video/mpeg',
  'application/pdf'
]
WHERE id = 'portfolio-media';
