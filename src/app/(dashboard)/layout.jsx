import AppHeader from "@/components/header/Header";

export default function DashboardLayout({ children }) {
  return (
    <>
      <AppHeader />
      <main className="p-2.5 overflow-y-auto h-[calc(100vh-65px)]">
        {children}
      </main>
    </>
  );
}
