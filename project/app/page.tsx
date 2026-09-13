import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/12905761/pexels-photo-12905761.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            alt="กว๊านพะเยายามอาทิตย์อัสดง"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-900/50 to-stone-900/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 text-center">
          <span className="inline-block rounded-full bg-teal-500/20 px-5 py-1.5 text-sm font-medium text-teal-200 backdrop-blur-sm ring-1 ring-teal-300/30">
            พะเยา · ภาคเหนือตอนบน
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
            ระบบแนะนำร้านอาหาร
            <br />
            และสถานที่ท่องเที่ยว
            <br />
            <span className="bg-gradient-to-r from-teal-300 to-amber-300 bg-clip-text text-transparent">
              รอบกว๊านพะเยา
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-stone-200">
            ค้นพบร้านอาหารอร่อย คาเฟ่ริมน้ำ และสถานที่ท่องเที่ยวสวยงาม
            รอบทะเลสาบธรรมชาติที่ใหญ่ที่สุดในภาคเหนือตอนบนของไทย
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/explore"
              className="group inline-flex items-center gap-2 rounded-xl bg-teal-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-teal-500/30 transition-all hover:bg-teal-400 hover:shadow-xl hover:shadow-teal-500/40 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-stone-900"
            >
              เข้าสู่หน้าจัดการข้อมูล
              <svg
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              ดูฟีเจอร์ทั้งหมด
            </Link>
          </div>

          {/* Quick links */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-teal-100 backdrop-blur-sm ring-1 ring-white/20 transition-all hover:bg-white/20"
            >
              แดชบอร์ด
            </Link>
            <Link
              href="/map"
              className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-teal-100 backdrop-blur-sm ring-1 ring-white/20 transition-all hover:bg-white/20"
            >
              แผนที่สถานที่
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
