import { Outlet } from "react-router-dom";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { MobileSidebar } from "@/components/MobileSidebar";

export default function Layout() {
  return (
    <div className="min-h-screen">
      {/* Render the two different sidebars */}
      <MobileSidebar />
      <DesktopSidebar />

      <main className="">
        <Outlet />
      </main>
    </div>
  );
}
