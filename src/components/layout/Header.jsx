import { Filter, Menu, Search, Plus, Sun, Moon, Bell, Settings, ChevronDown, ShoppingCart, Truck, Clock, LogOut, X, User, Lock, Palette, Database } from 'lucide-react'
import React, { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { createPortal } from 'react-dom'

const MockUpNotifications = [
  { activity: "New Sale Recorded", message: "A new sale has been recorded for Order #12345.", date: "Apr 17, 2026", time: "10:30 AM", user: "System" },
  { activity: "Order Received", message: "Purchase Order #54321 has been received.", date: "Apr 17, 2026", time: "10:30 AM", user: "System" },
];

const Header = ({ onToggleSidebar }) => {
  const location = useLocation();

  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const [notifPosition, setNotifPosition] = useState({ top: 0, right: 0 });

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [profilePosition, setProfilePosition] = useState({ top: 0, right: 0 });

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const notifRef = useRef(null);
  const notifButtonRef = useRef(null);

  const profileRef = useRef(null);
  const profileButtonRef = useRef(null);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const getPageTitle = (pathname) => {
    const routes = {
      '/': 'Dashboard',
      '/dashboard': 'Dashboard',
      '/transactions/Sales': 'Sales',
      '/transactions/Expenses': 'Expenses',
      '/transactions/Balances': 'Balances',
      '/transactions/Ledger': 'Ledger',
      '/inventory': 'Inventory',
      '/customers': 'Customers',
      '/suppliers': 'Suppliers',
      '/activityLog': 'Activity Logs',
      '/accounts': 'Accounts',
      '/purchasing': 'Purchasing',
      '/purchasing/createPurchase': 'Create Purchase',
      '/purchasing/supplierList': 'Supplier List',
      '/purchasing/receivedItems': 'Received Items',
      '/sales': 'Sales',
      '/sales/createSalesInvoice': 'Sales Invoice',
      '/sales/customerList': 'Customer List',
      '/inventory/brandList': 'Brand List',
      '/inventory/stockManagement': 'Item List',
      '/inventory/inventoryCounting': 'Inventory Counting',
      '/reports': 'Reports',
      '/warehouse': 'Warehouse',
      '/settings': 'Settings',
    };
    return routes[pathname] || 'Dashboard';
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    if (isNotifMenuOpen && notifButtonRef.current) {
      const rect = notifButtonRef.current.getBoundingClientRect();
      setNotifPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      });
    }
  }, [isNotifMenuOpen]);

  useEffect(() => {
    if (isProfileMenuOpen && profileButtonRef.current) {
      const rect = profileButtonRef.current.getBoundingClientRect();
      setProfilePosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      });
    }
  }, [isProfileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target) &&
        notifButtonRef.current && !notifButtonRef.current.contains(event.target)) {
        setIsNotifMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target) &&
        profileButtonRef.current && !profileButtonRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pageTitle = getPageTitle(location.pathname);

  const getActivityColor = (activity) => {
    switch (activity) {
      case "New Sale Recorded":
        return "text-emerald-700 dark:text-emerald-500";
      case "Order Arrived":
        return "text-blue-600 dark:text-blue-500";
      default:
        return "text-blue-600 dark:text-blue-500";
    }
  };

  const getIcon = (iconNotif) => {
    switch (iconNotif) {
      case "New Sale Recorded":
        return <ShoppingCart className="inline mr-2 mt-[-2px]" size={18} />;
      case "Order Received":
        return <Truck className="inline mr-2 mt-[-2px]" size={18} />;
      default:
        return null;
    }
  };

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    // your logout logic here
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-6 py-4">
      <div className="flex items-center justify-between">

        {/* Left Side - Title */}
        <div className="flex items-center space-x-4">
          <button
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={onToggleSidebar}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:block">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              {pageTitle}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Welcome back, Earl! Here's what's happening today
            </p>
          </div>
        </div>

        {/* Center */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <Filter />
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center space-x-3">

          <button className="hidden lg:flex items-center space-x-2 py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">New</span>
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-blue-500" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              ref={notifButtonRef}
              onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
              className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
            </button>

            {isNotifMenuOpen && createPortal(
              <div
                ref={notifRef}
                className="pb-4 fixed w-72 md:w-80 bg-white dark:bg-slate-800 border border-black/10 dark:border-slate-700/50 rounded-xl z-[9999] overflow-hidden shadow-xl"
                style={{
                  top: `${notifPosition.top}px`,
                  right: `${notifPosition.right}px`,
                }}
              >
                <div className="p-4 border-b border-black/10 dark:border-slate-700/50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 dark:text-white"><Bell className="w-5 h-6 mt-[-2px] mr-2 inline" />Notifications</h3>
                </div>

                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                  {MockUpNotifications.length > 0 ? (
                    MockUpNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-4 border-b border-black/10 dark:border-white/15 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-semibold ${getActivityColor(notif.activity)}`}>
                            {getIcon(notif.activity)}
                            <span>{notif.activity}</span>
                          </p>
                          <p className="text-xs text-gray-700/80 dark:text-white/75 mt-0.5 font-medium">
                            <Clock className="w-3.5 h-3.5 inline mr-1 mt-[-3px]" />{notif.time}
                          </p>
                        </div>
                        <p className="text-[10px] text-gray-700/80 dark:text-white/60 mt-0.5 font-medium">
                          {notif.user} • {notif.date}
                        </p>
                        <p className="mt-3 p-2 bg-slate-300/10 rounded-lg text-[10pt] font-medium dark:font-normal text-slate-700 dark:text-white/80 mt-1 whitespace-pre-line">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Bell className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">No notifications yet</p>
                    </div>
                  )}
                </div>
              </div>,
              document.body
            )}
          </div>

          {/* Settings Button → opens modal */}
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Profile → opens floating dropdown */}
          <div className="pl-3 border-l border-slate-200 dark:border-slate-700">
            <div
              ref={profileButtonRef}
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center space-x-3 py-2.5 px-4 text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/4042/4042171.png"
                alt="User"
                className="w-8 h-8 rounded-full ring-2 ring-blue-500"
              />
              <div className="hidden md:block">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Earl Betez</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Administrator</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Profile Floating Dropdown */}
          {isProfileMenuOpen && createPortal(
            <div
              ref={profileRef}
              className="fixed w-42 bg-white dark:bg-slate-800 border border-black/10 dark:border-slate-700/50 rounded-xl z-[9999] overflow-hidden shadow-xl"
              style={{
                top: `${profilePosition.top}px`,
                right: `${profilePosition.right}px`,
              }}
            >

              <div className="p-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors font-normal"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>,
            document.body
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsSettingsModalOpen(false)}
          />

          <div className="relative w-full max-w-md mx-2 pb-3 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-black/10 dark:border-slate-700/50 overflow-hidden">

            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700/50">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-500" />
                Settings
              </h2>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-2">
              {[
                { icon: <User className="w-4 h-4" />, label: "Account", desc: "Manage your profile and credentials", color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10" },
                { icon: <Palette className="w-4 h-4" />, label: "Appearance", desc: "Theme, font size, and display", color: "text-purple-500 bg-purple-50 dark:bg-purple-500/10" },
                { icon: <Lock className="w-4 h-4" />, label: "Security", desc: "Password, 2FA, and permissions", color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" },
                { icon: <Database className="w-4 h-4" />, label: "Data & Storage", desc: "Backups, exports, and cache", color: "text-orange-500 bg-orange-50 dark:bg-orange-500/10" },
              ].map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left group"
                >
                  <div className={`p-2 rounded-lg ${item.color}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-500 transition-colors">{item.label}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{item.desc}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-300 dark:text-slate-600 -rotate-90" />
                </button>
              ))}
            </div>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Header;