import UserTable from "./components/UserTable";
import TableToolbar from "./components/TableToolbar";

export default function Peoples() {
  return (
    <div className="max-w-260 mx-auto bg-(--background) rounded-2xl border border-slate-300 shadow-sm overflow-hidden font-sans">
      {/* Table Toolbar */}
      <TableToolbar />

      {/* Table Section */}
      <UserTable />
    </div>
  );
}
