/*
# Create products table (single-tenant, no auth)

1. New Tables
- `products`
- `id` (uuid, primary key, auto-generated)
- `name` (text, not null) — product name
- `description` (text) — short product description
- `price` (numeric, not null) — product price in THB
- `created_at` (timestamptz, defaults to now)

2. Security
- Enable RLS on `products`.
- Allow anon + authenticated CRUD because this is a public demo with no sign-in.
- USING (true) is acceptable here because the data is intentionally shared/public.

3. Seed Data
- Inserts a few sample product rows so the list page has something to display.
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10, 2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE
  TO anon, authenticated USING (true);

INSERT INTO products (name, description, price) VALUES
  ('กาแฟเย็น', 'กาแฟเย็นหวานหอมสดชื่น', 45.00),
  ('ชานมไข่มุก', 'ชานมไขมันนมสดพร้อมไข่มุกเหนียวนุ่ม', 55.00),
  ('โกโก้เย็น', 'โกโก้เย็นเข้มข้นมีฟองนมสด', 50.00),
  ('ชาเขียวเย็น', 'ชาเขียวเย็นหวานน้อยรสชาติกลมกล่อม', 50.00),
  ('ลิ้นจี่โยเกิรต์สมูทตี้', 'สมูทตี้ลิ้นจี่เย็นปั่นครีมสด', 65.00)
ON CONFLICT DO NOTHING;
