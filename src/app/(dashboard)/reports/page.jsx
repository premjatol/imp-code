import ReportList from "./components/ReportList";

export default function ReportsPage() {
  return (
    <div className="flex w-full h-[calc(100vh-86px)]">
      {/* Sidebar */}
      <ReportList />
    </div>
  );
}
