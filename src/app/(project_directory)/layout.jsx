import ProjectHeader from "@/components/project-header/ProjectHeader";
import Sidebar from "@/components/sidebar/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <>
      <div className="flex w-full">
        <Sidebar />
        <div className="grow">
          <ProjectHeader />
          <main>{children}</main>
        </div>
      </div>
    </>
  );
}
