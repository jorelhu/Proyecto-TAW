import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
