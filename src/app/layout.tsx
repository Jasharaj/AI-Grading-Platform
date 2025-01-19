import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import { AuthContextProvider } from './context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GradePro',
  description: 'Empowering education through intelligent grading solutions',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className={`${inter.className} h-full`}>
        <div className="min-h-screen">
          <AuthContextProvider>
            <Navbar />
            <main>
              {children}
            </main>
            <Toaster position="bottom-right" />
          </AuthContextProvider>
        </div>
      </body>
    </html>
  );
}
