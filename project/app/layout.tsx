import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'กว๊านพะเยา | แนะนำร้านอาหารและสถานที่ท่องเที่ยว',
  description: 'ระบบแนะนำร้านอาหาร คาเฟ่ และสถานที่ท่องเที่ยวรอบกว๊านพะเยา พะเยา',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
