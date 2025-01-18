import TASidebar from '../components/TASidebar';

export default function TALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <TASidebar />
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
}
