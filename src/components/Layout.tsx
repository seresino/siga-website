import { Outlet } from "react-router-dom";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { MobileSidebar } from "@/components/MobileSidebar";

export default function Layout() {
  return (
    <div className="min-h-screen">
      {/* NAVIGATION HIDDEN FOR TEMPORARY LANDING PAGE
          Uncomment these when ready to show projects/navigation */}
      {/* <MobileSidebar /> */}
      {/* <DesktopSidebar /> */}

      <main className="">
        <Outlet />
      </main>
    </div>
  );
}
