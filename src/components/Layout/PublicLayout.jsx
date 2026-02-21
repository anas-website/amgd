import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Droplets, Phone, Mail, MapPin, Instagram } from 'lucide-react';

const PublicLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-shadow">
                                <Droplets className="text-white" size={22} />
                            </div>
                            <span className="text-xl font-display font-semibold text-gray-900 tracking-tight">Crystal Clear</span>
                        </Link>
                        <nav className="flex items-center gap-6">
                            <Link
                                to="/"
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Catalog
                            </Link>
                            <a
                                href="/admin"
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Admin
                            </a>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
                        <div className="lg:col-span-2">
                            <Link to="/" className="inline-flex items-center gap-2 mb-4">
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                    <Droplets className="text-white" size={18} />
                                </div>
                                <span className="text-lg font-display font-semibold text-white">Crystal Clear</span>
                            </Link>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                                Premium custom shower glass enclosures. Design your perfect bathroom with our collection of modern, tempered glass solutions.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-display font-semibold text-white uppercase tracking-wider mb-4">Contact</h4>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center gap-3">
                                    <Phone size={16} className="text-blue-400 shrink-0" />
                                    <span>+972 50 123 4567</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail size={16} className="text-blue-400 shrink-0" />
                                    <span>info@crystalclear.com</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <MapPin size={16} className="text-blue-400 shrink-0" />
                                    <span>Tel Aviv, Israel</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-display font-semibold text-white uppercase tracking-wider mb-4">Follow</h4>
                            <a
                                href="#"
                                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                <Instagram size={18} />
                                @crystalclear
                            </a>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-gray-500">© {new Date().getFullYear()} Crystal Clear. All rights reserved.</p>
                        <div className="flex gap-6 text-xs text-gray-500">
                            <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
