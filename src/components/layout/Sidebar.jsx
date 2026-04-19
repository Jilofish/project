import { 
  Zap,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  ChevronDown,
  ShoppingCart,
  FolderOpen,
  BarChart3Icon,
  Warehouse,
  X
} from 'lucide-react'
import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom';

const menuItems = [
  { id: "", icon: LayoutDashboard, label: "Dashboard", active: true, badge: "New" },
  {
    id: "purchasing",
    icon: ShoppingCart,
    label: "Purchasing",
    submenu: [
      {id: "createPurchase", label: "Create Purchase"},
      {id: "supplierList", label: "Supplier List"},
      {id: "receivedItems", label: "Received Items"}
    ],
  },
  {
    id: "sales",
    icon: FolderOpen,
    label: "Sales",
    submenu: [
      {id: "createSalesInvoice", label: "Create Sales Invoice"},
      {id: "customerList", label: "Customer List"},
    ],
  },
  {
    id: "inventory",
    icon: Package,
    label: "Inventory",
    submenu: [
      {id: "brandList", label: "Brand List"},
      {id: "stockManagement", label: "Item List"},
      {id: "inventoryCounting", label: "Inventory Counting"}
    ]
  },
  { id: "reports", icon: BarChart3Icon, label: "Reports" },
  { id: "warehouse", icon: Warehouse, label: "Warehouse" },
  { id: "activityLog", icon: FileText, label: "Activity Log" },
  { id: "settings", icon: Settings, label: "Settings" }
]

function Sidebar({ collapsed }) {
  const [expandedItems, setExpandedItems] = useState(new Set(["analytics"]));
  const [openFloatingMenu, setOpenFloatingMenu] = useState(null);
  const location = useLocation();

  const toggleExpanded = (itemid) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemid)) {
      newExpanded.delete(itemid);
    } else {
      newExpanded.add(itemid);
    }
    setExpandedItems(newExpanded);
  };

  const toggleFloatingMenu = (itemid) => {
    setOpenFloatingMenu((prev) => (prev === itemid ? null : itemid));
  };

  const isChildActive = (item) => {
    if (!item.submenu) return false;
    return item.submenu.some((sub) =>
      location.pathname === `/${item.id}/${sub.id}`
    );
  };

  return (
    <div className={`${
      collapsed ? "w-20" : "w-72"
    } transition-all duration-100 bg-white/80 dark:bg-slate-900 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col relative z-10 h-screen`}>
      
      {/* Logo */}
      <div className="p-6 border-b border-slate-200/50 dark:border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white"/>
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">Meat ERP</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 p-4 space-y-2 ${collapsed ? 'overflow-visible' : 'overflow-y-auto'}`}>
        {menuItems.map((item) => {
          const isExpandable = item.submenu && item.submenu.length > 0;
          const isExpanded = expandedItems.has(item.id);
          const isFloatingOpen = openFloatingMenu === item.id;
          const childActive = isChildActive(item);

          const parentButtonClass = isExpandable
            ? childActive
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              : (isExpanded || isFloatingOpen)
              ? "bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
            : "";

          return (
            <div key={item.id} className="relative">
              {!isExpandable ? (
                <NavLink
                  to={`/${item.id}`}
                  className={({ isActive }) =>
                    `w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" 
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    {!collapsed && <span className="font-medium">{item.label}</span>}
                  </div>
                </NavLink>
              ) : (
                <button
                  onClick={() => collapsed ? toggleFloatingMenu(item.id) : toggleExpanded(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${parentButtonClass}`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    {!collapsed && <span className="font-medium">{item.label}</span>}
                  </div>
                  {!collapsed && <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />}
                </button>
              )}

              {/* ── FLOATING SUBMENU (collapsed) ── */}
              {collapsed && isFloatingOpen && isExpandable && (
                <>
                  <div className="fixed inset-0 z-[60]" onClick={() => setOpenFloatingMenu(null)} />
                  <div className="absolute left-[calc(100%+20px)] top-0 z-[70] animate-in fade-in slide-in-from-left-2 duration-200">
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-3 min-w-[220px]">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-bold text-slate-700 dark:text-white uppercase tracking-wide">{item.label}</p>
                        <button onClick={() => setOpenFloatingMenu(null)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                          <X className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                        </button>
                      </div>
                      <div className="space-y-1">
                        {item.submenu.map((sub) => (
                          <NavLink
                            key={sub.id}
                            to={`/${item.id}/${sub.id}`}
                            onClick={() => setOpenFloatingMenu(null)}
                            className={({ isActive }) =>
                              `block px-3 py-2 text-sm rounded-lg transition-all font-medium ${
                                isActive ? "bg-blue-500 text-white" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                              }`
                            }
                          >
                            {sub.label}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ── EXPANDED SUBMENU (not collapsed) ── */}
              {!collapsed && isExpandable && isExpanded && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.submenu.map((subitem) => (
                    <NavLink
                      key={subitem.id}
                      to={`/${item.id}/${subitem.id}`}
                      className={({ isActive }) =>
                        `block w-full text-left p-2 py-2.5 pl-4 text-sm rounded-lg transition-all 
                        ${isActive
                          ? "text-blue-500 font-semibold bg-black/7 dark:bg-slate-800/50"
                          : "text-slate-500 dark:text-slate-300/80 hover:text-slate-700 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                        }`
                      }
                    >
                      {subitem.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Profile */}
      {!collapsed && (
        <footer className="p-4">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <img src="https://cdn-icons-png.flaticon.com/512/4042/4042171.png" alt="user" className="w-10 h-10 rounded-full ring-2 ring-blue-500" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 dark:text-white truncate">Earl Betiz</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Administrator</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

export default Sidebar;