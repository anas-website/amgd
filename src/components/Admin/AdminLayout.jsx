import React, { useState } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    LayoutDashboard,
    LogOut,
    ChevronRight,
    Calculator,
    MapPin,
    Layers,
    Menu,
    X
} from 'lucide-react';

const AdminLayout = () => {
    const { user, isAdmin, loading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    React.useEffect(() => {
        if (!loading && (!user || !isAdmin)) {
            navigate('/admin/login');
        }
    }, [user, isAdmin, loading, navigate]);

    React.useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    if (loading) return null;
    if (!user || !isAdmin) return null;

    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Shower Types', path: '/admin/shower-types', icon: Layers },
        { name: 'Pricing Rules', path: '/admin/pricing', icon: Calculator },
        { name: 'Locations', path: '/admin/locations', icon: MapPin },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100 text-gray-900">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-white shadow-lg lg:shadow-none flex flex-col transform transition-transform duration-300 ease-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 lg:p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-display font-semibold text-gray-900">
                        Manager Panel
                    </h2>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 lg:hidden text-gray-600"
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all touch-target ${isActive
                                        ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.name}</span>
                                {isActive && <ChevronRight size={16} className="ml-auto" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all touch-target"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-auto">
                <header className="h-14 sm:h-16 border-b border-gray-200 bg-white px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 -ml-2 rounded-lg hover:bg-gray-100 lg:hidden text-gray-600"
                        aria-label="Open menu"
                    >
                        <Menu size={24} />
                    </button>
                    <h1 className="text-base sm:text-lg font-display font-semibold text-gray-900 capitalize flex-1 text-center lg:text-left lg:pl-0">
                        {location.pathname.split('/').pop() || 'Dashboard'}
                    </h1>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <span className="text-xs sm:text-sm text-gray-500 truncate max-w-[120px] sm:max-w-none">{user.email}</span>
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                            {user.email[0].toUpperCase()}
                        </div>
                    </div>
                </header>

                <div className="p-4 sm:p-6 lg:p-8 flex-1 bg-gray-100">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
