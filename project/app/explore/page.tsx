'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

// ---------- Types ----------
type Category = 'restaurant' | 'cafe' | 'tourist_spot';

type Profile = {
  id: string;
  username: string;
  email: string | null;
  age: number | null;
  latitude: number | null;
  longitude: number | null;
  category: Category;
  description: string | null;
  created_at: string;
};

type FormState = {
  username: string;
  email: string;
  age: string;
  latitude: string;
  category: Category;
  description: string;
};

// ---------- Constants ----------
const CATEGORY_LABELS: Record<Category, string> = {
  restaurant: 'ร้านอาหาร',
  cafe: 'คาเฟ่',
  tourist_spot: 'สถานที่ท่องเที่ยว',
};

const CATEGORY_STYLES: Record<Category, string> = {
  restaurant: 'bg-rose-100 text-rose-700 ring-1 ring-rose-200',
  cafe: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
  tourist_spot: 'bg-teal-100 text-teal-700 ring-1 ring-teal-200',
};

const EMPTY_FORM: FormState = {
  username: '',
  email: '',
  age: '',
  latitude: '',
  category: 'restaurant',
  description: '',
};

// ---------- Page Component ----------
export default function ExplorePage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Profile | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ---------- Fetch profiles ----------
  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, email, age, latitude, longitude, category, description, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
      setProfiles([]);
    } else {
      setProfiles(data ?? []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  // ---------- Form handlers ----------
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError(null);
  };

  const handleEdit = (profile: Profile) => {
    setEditingId(profile.id);
    setForm({
      username: profile.username,
      email: profile.email ?? '',
      age: profile.age?.toString() ?? '',
      latitude: profile.latitude?.toString() ?? '',
      category: profile.category,
      description: profile.description ?? '',
    });
    setFormError(null);
    // Scroll to form
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    // Basic validation
    if (!form.username.trim()) {
      setFormError('กรุณากรอกชื่อสถานที่');
      setSaving(false);
      return;
    }

    const payload = {
      username: form.username.trim(),
      email: form.email.trim() || null,
      age: form.age ? parseInt(form.age, 10) : null,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      category: form.category,
      description: form.description.trim() || null,
    };

    let result;
    if (editingId) {
      result = await supabase.from('profiles').update(payload).eq('id', editingId).select().single();
    } else {
      result = await supabase.from('profiles').insert(payload).select().single();
    }

    if (result.error) {
      setFormError(result.error.message);
      setSaving(false);
      return;
    }

    resetForm();
    setSaving(false);
    fetchProfiles();
  };

  // ---------- Delete handlers ----------
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    const { error } = await supabase.from('profiles').delete().eq('id', deleteTarget.id);

    if (error) {
      setFormError(error.message);
      setDeleting(false);
      setDeleteTarget(null);
      return;
    }

    setDeleting(false);
    setDeleteTarget(null);
    fetchProfiles();
  };

  // ---------- Render ----------
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
          <h1 className="text-lg font-bold text-stone-900">จัดการข้อมูลสถานที่</h1>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Form Section */}
        <section className="mb-10">
          <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                {editingId ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-stone-900">
                  {editingId ? 'แก้ไขข้อมูล' : 'เพิ่มสถานที่ใหม่'}
                </h2>
                <p className="text-sm text-stone-500">
                  {editingId ? 'แก้ไขข้อมูลแล้วกดบันทึก' : 'กรอกข้อมูลสถานที่ที่ต้องการแนะนำ'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
              {/* Username */}
              <div className="sm:col-span-2">
                <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-stone-700">
                  ชื่อสถานที่ <span className="text-rose-500">*</span>
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleInputChange}
                  placeholder="เช่น ร้านข้าวซอยกว๊าน"
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm text-stone-900 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-stone-700">
                  อีเมล
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="example@email.com"
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm text-stone-900 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                />
              </div>

              {/* Age */}
              <div>
                <label htmlFor="age" className="mb-1.5 block text-sm font-medium text-stone-700">
                  อายุ (ปี)
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="0"
                  value={form.age}
                  onChange={handleInputChange}
                  placeholder="เช่น 5"
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm text-stone-900 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                />
              </div>

              {/* Latitude */}
              <div>
                <label htmlFor="latitude" className="mb-1.5 block text-sm font-medium text-stone-700">
                  ละติจูด (Latitude)
                </label>
                <input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={handleInputChange}
                  placeholder="เช่น 19.1678"
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm text-stone-900 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                />
              </div>

              {/* Category Select */}
              <div>
                <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-stone-700">
                  ประเภท <span className="text-rose-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm text-stone-900 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                >
                  <option value="restaurant">ร้านอาหาร</option>
                  <option value="cafe">คาเฟ่</option>
                  <option value="tourist_spot">สถานที่ท่องเที่ยว</option>
                </select>
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-stone-700">
                  รายละเอียด
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleInputChange}
                  placeholder="คำอธิบายสั้นๆ เกี่ยวกับสถานที่"
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm text-stone-900 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                />
              </div>

              {/* Form error */}
              {formError && (
                <div className="sm:col-span-2">
                  <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{formError}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="sm:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      กำลังบันทึก...
                    </>
                  ) : editingId ? (
                    'บันทึกการแก้ไข'
                  ) : (
                    'เพิ่มข้อมูล'
                  )}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-stone-300 px-6 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50"
                  >
                    ยกเลิก
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* Table Section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-stone-900">รายการสถานที่</h2>
            {!loading && !error && (
              <span className="text-sm text-stone-500">ทั้งหมด {profiles.length} รายการ</span>
            )}
          </div>

          {/* Error state */}
          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
              <p className="text-lg font-semibold text-rose-800">ไม่สามารถโหลดข้อมูลได้</p>
              <p className="mt-2 break-words text-sm text-rose-600">{error}</p>
              <button
                onClick={fetchProfiles}
                className="mt-6 rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-700"
              >
                ลองโหลดใหม่
              </button>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
              <div className="animate-pulse">
                <div className="border-b border-stone-200 bg-stone-50 px-6 py-4">
                  <div className="flex gap-8">
                    {[40, 30, 20, 30].map((w, i) => (
                      <div key={i} className="h-4 rounded bg-stone-200" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                </div>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="border-b border-stone-100 px-6 py-5">
                    <div className="flex gap-8">
                      <div className="h-4 w-40 rounded bg-stone-200" />
                      <div className="h-4 w-28 rounded bg-stone-100" />
                      <div className="h-4 w-16 rounded bg-stone-100" />
                      <div className="h-4 w-24 rounded bg-stone-100" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && profiles.length === 0 && (
            <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center">
              <p className="text-stone-500">ยังไม่มีข้อมูลในระบบ</p>
            </div>
          )}

          {/* Data table */}
          {!loading && !error && profiles.length > 0 && (
            <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50">
                    <th className="px-6 py-4 font-semibold text-stone-700">ชื่อสถานที่</th>
                    <th className="px-6 py-4 font-semibold text-stone-700">อีเมล</th>
                    <th className="px-6 py-4 font-semibold text-stone-700">อายุ</th>
                    <th className="px-6 py-4 font-semibold text-stone-700">ละติจูด</th>
                    <th className="px-6 py-4 font-semibold text-stone-700">ประเภท</th>
                    <th className="px-6 py-4 text-right font-semibold text-stone-700">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((profile) => (
                    <tr
                      key={profile.id}
                      className="border-b border-stone-100 transition-colors last:border-0 hover:bg-stone-50/60"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-stone-900">{profile.username}</div>
                        {profile.description && (
                          <div className="mt-0.5 text-xs text-stone-500 line-clamp-1">{profile.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-stone-600">{profile.email || '-'}</td>
                      <td className="px-6 py-4 text-stone-600">{profile.age ?? '-'}</td>
                      <td className="px-6 py-4 text-stone-600">
                        {profile.latitude != null ? profile.latitude.toFixed(4) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${CATEGORY_STYLES[profile.category]}`}
                        >
                          {CATEGORY_LABELS[profile.category]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(profile)}
                            className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700"
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() => setDeleteTarget(profile)}
                            className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-rose-400 hover:bg-rose-50 hover:text-rose-700"
                          >
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-sm"
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-stone-900">ยืนยันการลบ</h3>
                <p className="mt-1 text-sm text-stone-500">การกระทำนี้ไม่สามารถย้อนกลับได้</p>
              </div>
            </div>

            <div className="mt-5 rounded-lg bg-stone-50 px-4 py-3">
              <p className="text-sm text-stone-600">
                คุณต้องการลบ <span className="font-semibold text-stone-900">{deleteTarget.username}</span> ใช่หรือไม่?
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? 'กำลังลบ...' : 'ยืนยันลบ'}
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
