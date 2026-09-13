/*
# Create profiles table (single-tenant, no auth)

1. New Tables
- `profiles`
- `id` (uuid, primary key, auto-generated)
- `username` (text, not null) — display name of the recommended place
- `email` (text) — contact email for the place
- `age` (integer) — numeric value (used per spec; can represent years in operation or a generic age field)
- `latitude` (double precision) — geographic latitude near Phayao Lake
- `longitude` (double precision) — geographic longitude near Phayao Lake
- `category` (text, not null) — type of place: restaurant, cafe, tourist_spot
- `description` (text) — short description of the place
- `created_at` (timestamptz, defaults to now)

2. Security
- Enable RLS on `profiles`.
- Allow anon + authenticated CRUD because this is a public demo with no sign-in.
- USING (true) is acceptable here because the data is intentionally shared/public.

3. Seed Data
- Inserts sample places around Phayao Lake covering all three categories.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL,
  email text,
  age integer DEFAULT 0,
  latitude double precision,
  longitude double precision,
  category text NOT NULL DEFAULT 'restaurant',
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_profiles" ON profiles;
CREATE POLICY "anon_select_profiles" ON profiles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_profiles" ON profiles;
CREATE POLICY "anon_insert_profiles" ON profiles FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_profiles" ON profiles;
CREATE POLICY "anon_update_profiles" ON profiles FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_profiles" ON profiles;
CREATE POLICY "anon_delete_profiles" ON profiles FOR DELETE
  TO anon, authenticated USING (true);

INSERT INTO profiles (username, email, age, latitude, longitude, category, description) VALUES
  ('ร้านข้าวซอยกว๊าน', 'info@khaoisoi.com', 5, 19.1678, 99.8847, 'restaurant', 'ข้าวซอยเหนือรสเด็ดริมกว๊านพะเยา บรรยากาศสบาย'),
  ('คาเฟ่ริมน้ำภูคา', 'hello@phuka.cafe', 2, 19.1702, 99.8821, 'cafe', 'คาเฟ่มุมชมวิวกว๊าน กาแฟสด ขนมอร่อย'),
  ('วัดติ่อบนภูเขาทอง', 'info@phukhaotong.temple', 50, 19.1589, 99.8790, 'tourist_spot', 'วัดเก่าแก่บนยอดเขา ชมทิวทัศน์กว๊านพะเยา'),
  ('ร้านปากเกร็ดซีฟู้ด', 'contact@pakkrat.com', 8, 19.1745, 99.8912, 'restaurant', 'อาหารปลากว๊านสดๆ ริมน้ำ บรรยากาศดี'),
  ('บ้านจันทร์คาเฟ่', 'banjun@cafe.com', 1, 19.1610, 99.8865, 'cafe', 'คาเฟ่บ้านไม้กลางสวน ชาและขนมทำเอง'),
  ('อนุสาวรีย์พ่อขุนงำเมือง', 'info@phokhun.city', 30, 19.1928, 99.8789, 'tourist_spot', 'อนุสาวรีย์สำคัญใจกลางเมืองพะเยา')
ON CONFLICT DO NOTHING;
