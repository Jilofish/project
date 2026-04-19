import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 500);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen(prev => !prev);
    } else {
      setCollapsed(prev => !prev);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-900 transition-all overflow-auto">
        <Header onToggleSidebar={handleToggleSidebar} />

        <div className="p-6 overflow-y-auto flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;