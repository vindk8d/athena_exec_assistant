import Sidebar from "@/components/Sidebar";

export default function PreferencesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-100">
        {children}
      </main>
    </div>
  );
} 