// Layout.tsx
import Sidebar from "../component/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-6">
        {children}
      </main>
    </div>
  );
}
