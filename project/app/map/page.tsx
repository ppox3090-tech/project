'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Category = 'restaurant' | 'cafe' | 'tourist_spot';

type Profile = {
  id: string;
  username: string;
  email: string | null;
  latitude: number | null;
  longitude: number | null;
  category: Category;
  description: string | null;
};

const CATEGORY_LABELS: Record<Category, string> = {
  restaurant: 'ร้านอาหาร',
  cafe: 'คาเฟ่',
  tourist_spot: 'สถานที่ท่องเที่ยว',
};

const CATEGORY_COLORS: Record<Category, string> = {
  restaurant: '#f43f5e',
  cafe: '#f59e0b',
  tourist_spot: '#0d9488',
};

// Phayao Lake center
const MAP_CENTER = { lat: 19.1702, lng: 99.8821 };
const MAP_ZOOM = 14;

export default function MapPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Profile | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, email, latitude, longitude, category, description')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
        setProfiles([]);
      } else {
        setProfiles(data ?? []);
      }

      setLoading(false);
    })();
  }, []);

  const placesWithCoords = profiles.filter(
    (p) => p.latitude != null && p.longitude != null
  );

  // Convert lat/lng to SVG coordinates
  const latRange = 0.05;
  const lngRange = 0.05;
  const minLat = MAP_CENTER.lat - latRange;
  const maxLat = MAP_CENTER.lat + latRange;
  const minLng = MAP_CENTER.lng - lngRange;
  const maxLng = MAP_CENTER.lng + lngRange;

  const toX = (lng: number) => ((lng - minLng) / (maxLng - minLng)) * 1000;
  const toY = (lat: number) => ((maxLat - lat) / (maxLat - minLat)) * 700;

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-stone-600 transition-colors hover:text-teal-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">กลับหน้าแรก</span>
          </Link>
          <h1 className="text-lg font-bold text-stone-900">แผนที่สถานที่</h1>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Error state */}
        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
            <p className="text-lg font-semibold text-rose-800">ไม่สามารถโหลดข้อมูลได้</p>
            <p className="mt-2 break-words text-sm text-rose-600">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="animate-pulse rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
            <div className="h-96 rounded-xl bg-stone-100" />
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Stats bar */}
            <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-stone-200 bg-white px-6 py-4 shadow-sm">
              <span className="text-sm font-medium text-stone-700">
                สถานที่ที่มีพิกัด: {placesWithCoords.length} จาก {profiles.length} รายการ
              </span>
              <div className="flex flex-wrap gap-3">
                {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => {
                  const count = placesWithCoords.filter((p) => p.category === cat).length;
                  return (
                    <span key={cat} className="inline-flex items-center gap-1.5 text-xs text-stone-600">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[cat] }}
                      />
                      {CATEGORY_LABELS[cat]} ({count})
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Map + Sidebar */}
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              {/* Map */}
              <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                <div className="relative w-full" style={{ aspectRatio: '10 / 7' }}>
                  <svg
                    viewBox="0 0 1000 700"
                    className="h-full w-full"
                    style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #f0fdfa 100%)' }}
                  >
                    {/* Lake shape (simplified) */}
                    <ellipse
                      cx={toX(MAP_CENTER.lng)}
                      cy={toY(MAP_CENTER.lat)}
                      rx={180}
                      ry={120}
                      fill="#7dd3fc"
                      fillOpacity={0.5}
                      stroke="#0284c7"
                      strokeWidth={1.5}
                      strokeDasharray="6 4"
                    />
                    <text
                      x={toX(MAP_CENTER.lng)}
                      y={toY(MAP_CENTER.lat) + 5}
                      textAnchor="middle"
                      className="fill-sky-600 text-sm font-medium"
                      style={{ fontSize: 16 }}
                    >
                      กว๊านพะเยา
                    </text>

                    {/* Grid lines */}
                    {[0.25, 0.5, 0.75].map((p) => (
                      <line key={`h-${p}`} x1={0} y1={700 * p} x2={1000} y2={700 * p} stroke="#e7e5e4" strokeWidth={0.5} />
                    ))}
                    {[0.25, 0.5, 0.75].map((p) => (
                      <line key={`v-${p}`} x1={1000 * p} y1={0} x2={1000 * p} y2={700} stroke="#e7e5e4" strokeWidth={0.5} />
                    ))}

                    {/* Place markers */}
                    {placesWithCoords.map((place) => {
                      const cx = toX(place.longitude!);
                      const cy = toY(place.latitude!);
                      const isSelected = selected?.id === place.id;
                      return (
                        <g
                          key={place.id}
                          onClick={() => setSelected(place)}
                          style={{ cursor: 'pointer' }}
                        >
                          {isSelected && (
                            <circle cx={cx} cy={cy} r={18} fill={CATEGORY_COLORS[place.category]} fillOpacity={0.2} />
                          )}
                          <circle
                            cx={cx}
                            cy={cy}
                            r={isSelected ? 9 : 7}
                            fill={CATEGORY_COLORS[place.category]}
                            stroke="white"
                            strokeWidth={2}
                            className="transition-all"
                          />
                          {(isSelected || placesWithCoords.length <= 8) && (
                            <text
                              x={cx}
                              y={cy - 12}
                              textAnchor="middle"
                              className="fill-stone-700"
                              style={{ fontSize: 11, fontWeight: 600 }}
                            >
                              {place.username.length > 15
                                ? place.username.substring(0, 13) + '...'
                                : place.username}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Sidebar - place list + selected detail */}
              <div className="space-y-4">
                {/* Selected place detail */}
                {selected && (
                  <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-stone-900">{selected.username}</h3>
                      <button
                        onClick={() => setSelected(null)}
                        className="text-stone-400 transition-colors hover:text-stone-600"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <span
                      className="mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium text-white"
                      style={{ backgroundColor: CATEGORY_COLORS[selected.category] }}
                    >
                      {CATEGORY_LABELS[selected.category]}
                    </span>
                    {selected.description && (
                      <p className="mt-3 text-sm leading-relaxed text-stone-600">{selected.description}</p>
                    )}
                    <dl className="mt-4 space-y-2 text-sm">
                      {selected.email && (
                        <div>
                          <dt className="inline font-medium text-stone-500">อีเมล: </dt>
                          <dd className="inline text-stone-700">{selected.email}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="inline font-medium text-stone-500">ละติจูด: </dt>
                        <dd className="inline text-stone-700">{selected.latitude?.toFixed(4)}</dd>
                      </div>
                      <div>
                        <dt className="inline font-medium text-stone-500">ลองจิจูด: </dt>
                        <dd className="inline text-stone-700">{selected.longitude?.toFixed(4)}</dd>
                      </div>
                    </dl>
                  </div>
                )}

                {/* Place list */}
                <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-sm font-semibold text-stone-900">รายการสถานที่</h3>
                  {placesWithCoords.length > 0 ? (
                    <div className="max-h-96 space-y-2 overflow-y-auto">
                      {placesWithCoords.map((place) => (
                        <button
                          key={place.id}
                          onClick={() => setSelected(place)}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                            selected?.id === place.id ? 'bg-stone-100' : 'hover:bg-stone-50'
                          }`}
                        >
                          <span
                            className="h-3 w-3 flex-shrink-0 rounded-full"
                            style={{ backgroundColor: CATEGORY_COLORS[place.category] }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-stone-800">{place.username}</p>
                            <p className="text-xs text-stone-500">{CATEGORY_LABELS[place.category]}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-stone-500">ยังไม่มีสถานที่ที่มีพิกัดในระบบ</p>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex gap-3">
                  <Link
                    href="/explore"
                    className="flex-1 rounded-xl bg-teal-600 px-4 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-teal-500"
                  >
                    จัดการข้อมูล
                  </Link>
                  <Link
                    href="/dashboard"
                    className="flex-1 rounded-xl border border-stone-300 bg-white px-4 py-3 text-center text-sm font-medium text-stone-700 transition-all hover:bg-stone-50"
                  >
                    แดชบอร์ด
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
