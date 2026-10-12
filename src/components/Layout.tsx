import { Outlet } from "react-router-dom";
import { SiteNav } from "@/components/SiteNav";

export default function Layout() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="">
        <Outlet />
      </main>
    </div>
  );
}
