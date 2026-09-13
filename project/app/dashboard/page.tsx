'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Category = 'restaurant' | 'cafe' | 'tourist_spot';

type Profile = {
  id: string;
  username: string;
  category: Category;
  age: number | null;
  created_at: string;
};

type CategoryStat = {
  category: Category;
  label: string;
  count: number;
  color: string;
  bgColor: string;
  ringColor: string;
};

const CATEGORY_LABELS: Record<Category, string> = {
  restaurant: 'ร้านอาหาร',
  cafe: 'คาเฟ่',
  tourist_spot: 'สถานที่ท่องเที่ยว',
};

export default function DashboardPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, category, age, created_at')
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

  const totalCount = profiles.length;

  const categoryStats: CategoryStat[] = [
    {
      category: 'restaurant',
      label: CATEGORY_LABELS.restaurant,
      count: profiles.filter((p) => p.category === 'restaurant').length,
      color: 'text-rose-700',
      bgColor: 'bg-rose-50',
      ringColor: 'ring-rose-200',
    },
    {
      category: 'cafe',
      label: CATEGORY_LABELS.cafe,
      count: profiles.filter((p) => p.category === 'cafe').length,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      ringColor: 'ring-amber-200',
    },
    {
      category: 'tourist_spot',
      label: CATEGORY_LABELS.tourist_spot,
      count: profiles.filter((p) => p.category === 'tourist_spot').length,
      color: 'text-teal-700',
      bgColor: 'bg-teal-50',
      ringColor: 'ring-teal-200',
    },
  ];

  const avgAge =
    totalCount > 0
      ? (profiles.reduce((sum, p) => sum + (p.age ?? 0), 0) / totalCount).toFixed(1)
      : '0';

  const recentPlaces = profiles.slice(0, 5);

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
          <h1 className="text-lg font-bold text-stone-900">แดชบอร์ด</h1>
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="h-4 w-24 rounded bg-stone-200" />
                <div className="mt-4 h-10 w-16 rounded bg-stone-100" />
              </div>
            ))}
          </div>
        )}

        {/* Dashboard content */}
        {!loading && !error && (
          <>
            {/* Summary cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100 text-stone-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-stone-500">สถานที่ทั้งหมด</span>
                </div>
                <p className="mt-4 text-3xl font-bold text-stone-900">{totalCount}</p>
                <p className="mt-1 text-xs text-stone-400">รายการ</p>
              </div>

              {categoryStats.map((stat) => (
                <div key={stat.category} className={`rounded-2xl border border-stone-200 bg-white p-6 shadow-sm`}>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor} ${stat.color}`}>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        {stat.category === 'restaurant' && (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        )}
                        {stat.category === 'cafe' && (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
                        )}
                        {stat.category === 'tourist_spot' && (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        )}
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-stone-500">{stat.label}</span>
                  </div>
                  <p className={`mt-4 text-3xl font-bold ${stat.color}`}>{stat.count}</p>
                  <p className="mt-1 text-xs text-stone-400">รายการ</p>
                </div>
              ))}
            </div>

            {/* Category distribution bar */}
            <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-stone-900">สัดส่วนตามประเภท</h2>
              {totalCount > 0 ? (
                <div className="mt-6 space-y-4">
                  {categoryStats.map((stat) => {
                    const percentage = totalCount > 0 ? (stat.count / totalCount) * 100 : 0;
                    const barColor =
                      stat.category === 'restaurant'
                        ? 'bg-rose-400'
                        : stat.category === 'cafe'
                        ? 'bg-amber-400'
                        : 'bg-teal-400';
                    return (
                      <div key={stat.category}>
                        <div className="mb-1.5 flex items-center justify-between text-sm">
                          <span className="font-medium text-stone-700">{stat.label}</span>
                          <span className="text-stone-500">
                            {stat.count} รายการ ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-stone-100">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-4 text-sm text-stone-500">ยังไม่มีข้อมูลในระบบ</p>
              )}
            </div>

            {/* Additional stats */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-stone-500">อายุเฉลี่ยของสถานที่</span>
                </div>
                <p className="mt-4 text-3xl font-bold text-stone-900">{avgAge}</p>
                <p className="mt-1 text-xs text-stone-400">ปี</p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-stone-500">ประเภทที่มีมากที่สุด</span>
                </div>
                <p className="mt-4 text-3xl font-bold text-stone-900">
                  {categoryStats.reduce((max, s) => (s.count > max.count ? s : max), categoryStats[0]).label}
                </p>
                <p className="mt-1 text-xs text-stone-400">
                  {Math.max(...categoryStats.map((s) => s.count))} รายการ
                </p>
              </div>
            </div>

            {/* Recent places */}
            <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-stone-900">สถานที่ล่าสุด</h2>
                <Link
                  href="/explore"
                  className="text-sm font-medium text-teal-600 transition-colors hover:text-teal-700"
                >
                  ดูทั้งหมด
                </Link>
              </div>
              {recentPlaces.length > 0 ? (
                <div className="divide-y divide-stone-100">
                  {recentPlaces.map((place) => (
                    <div key={place.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-stone-900">{place.username}</p>
                        <p className="text-xs text-stone-500">
                          {CATEGORY_LABELS[place.category]} · อายุ {place.age ?? '-'} ปี
                        </p>
                      </div>
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                          place.category === 'restaurant'
                            ? 'bg-rose-100 text-rose-700'
                            : place.category === 'cafe'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-teal-100 text-teal-700'
                        }`}
                      >
                        {CATEGORY_LABELS[place.category]}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-sm text-stone-500">ยังไม่มีข้อมูลในระบบ</p>
              )}
            </div>

            {/* Navigation links */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-500"
              >
                จัดการข้อมูล
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/map"
                className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-700 transition-all hover:bg-stone-50"
              >
                ดูแผนที่สถานที่
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
