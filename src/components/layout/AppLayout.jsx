import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UsersIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  CalculatorIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  UserGroupIcon,
  MapIcon,
  ShoppingBagIcon,
  Square3Stack3DIcon,
  TagIcon,
  BellIcon,
  Cog6ToothIcon,
  FolderIcon,
  ArchiveBoxIcon,
  ShoppingCartIcon,
  CubeIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: HomeIcon,
    current: true,
  },
  {
    name: 'Adminlar',
    href: '/admins',
    icon: UserGroupIcon,
    current: false,
  },
  {
    name: 'Bugalteriya',
    href: '/accounting',
    icon: CalculatorIcon
  },
  {
    name: 'Ombor',
    href: '/warehouse',
    icon: ArchiveBoxIcon,
    children: [
      { name: 'Kategoriyalar', href: '/warehouse/categories', icon: Square3Stack3DIcon },
      { name: 'Mahsulotlar', href: '/warehouse/products', icon: ShoppingBagIcon },
    ],
  },
  {
    name: 'Do\'konlar',
    href: '/stores',
    icon: BuildingStorefrontIcon
  },
  {
    name: 'Agentlar',
    href: '/agents',
    icon: UsersIcon
  },
  {
    name: 'Viloyatlar',
    href: '/regions',
    icon: MapIcon
  },
  {
    name: 'Mijozlar',
    href: '/clients',
    icon: UserGroupIcon
  },
  {
    name: 'Optom buyurtma',
    href: '/orders/wholesale',
    icon: CubeIcon
  },
  {
    name: 'Dona buyurtma',
    href: '/orders/retail',
    icon: ShoppingCartIcon
  },
  {
    name: 'Buyurtmalar',
    href: '/orders',
    icon: ClipboardDocumentListIcon
  },
  {
    name: 'Statistika',
    href: '/statistics',
    icon: ChartBarIcon
  },
];

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/login');
  };

  const toggleSubmenu = (name) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  const hasActiveChild = (item) => {
    return item.children?.some(child => child.href === location.pathname)
  }

  const renderNavItem = (item) => {
    const isActive = location.pathname === item.href ||
      (item.children && item.children.some(child => location.pathname === child.href));

    if (item.children) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleSubmenu(item.name)}
            className={`w-full group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-50'
              }`}
          >
            <item.icon className={`${sidebarCollapsed ? 'mx-auto' : 'mr-3'} h-5 w-5 transition-colors duration-200 ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
              }`} />
            {!sidebarCollapsed && (
              <div className="flex items-center justify-between flex-1">
                <span>{item.name}</span>
                <ChevronDownIcon
                  className={`ml-2 h-4 w-4 transition-transform duration-200 ${openSubmenu === item.name ? 'transform rotate-180' : ''
                    }`}
                />
              </div>
            )}
          </button>
          {(openSubmenu === item.name || hasActiveChild(item)) && !sidebarCollapsed && (
            <div className="mt-1 ml-4 space-y-1">
              {item.children.map((child) => (
                <Link
                  key={child.name}
                  to={child.href}
                  className={`group flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${location.pathname === child.href
                      ? 'text-indigo-600'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <child.icon className={`mr-3 h-4 w-4 transition-colors duration-200 ${location.pathname === child.href ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        to={item.href}
        className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
            ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600'
            : 'text-gray-700 hover:bg-gray-50'
          }`}
      >
        <item.icon className={`${sidebarCollapsed ? 'mx-auto' : 'mr-3'} h-5 w-5 transition-colors duration-200 ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
          }`} />
        {!sidebarCollapsed && item.name}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      <div
        className={`fixed inset-0 z-20 bg-gray-900/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-white transform transition-transform duration-300 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            
          </span>
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 hover:text-gray-900 transition-colors duration-200"
            onClick={() => setSidebarOpen(false)}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <nav className="flex-1 space-y-2">
            {navigation.map((item) => (
              renderNavItem(item)
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:flex ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'} transition-all duration-300 z-40`}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white">
          <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-gray-200">
            {!sidebarCollapsed && (
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              </span>
            )}
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {sidebarCollapsed ? (
                <ChevronRightIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
          <nav className="flex flex-1 flex-col px-4">
            <ul role="list" className="flex flex-1 flex-col gap-y-2">
              {navigation.map((item) => (
                renderNavItem(item)
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className={`${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'} transition-all duration-300`}>
        {/* Top navbar */}
        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center border-b border-gray-200 bg-white shadow-sm">
          <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
            {/* Left side */}
            <div className="flex items-center gap-x-4 lg:hidden">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>

            {/* Title */}
            <div className="flex flex-1 items-center gap-x-4">
              <span className="ml-5 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ORZU CRM
              </span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-x-4">
              {/* Notifications */}
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" />
              </button>

              {/* Separator */}
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  className="flex items-center gap-x-3 rounded-full bg-white p-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all duration-200"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <img
                    className="h-8 w-8 rounded-full bg-gray-50"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                  <span className="hidden lg:flex lg:items-center">
                    <span className="ml-2 mr-1 text-sm font-medium text-gray-900">Admin</span>
                  </span>
                </button>

                {/* Profile dropdown menu */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-900 font-medium">Admin</p>
                      <p className="text-sm text-gray-500 truncate">admin@example.com</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Cog6ToothIcon className="mr-2 h-4 w-4 text-gray-400" />
                      Profil
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Cog6ToothIcon className="mr-2 h-4 w-4 text-gray-400" />
                      Sozlamalar
                    </Link>
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      onClick={handleLogout}
                    >
                      <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4 text-red-500" />
                      Chiqish
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
