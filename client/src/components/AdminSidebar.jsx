import { Link } from "react-router-dom";
import { Shield, LogOut } from "lucide-react";

export default function AdminSidebar({ navItems, isActive, closeMobileMenu, user, handleLogout }) {
    return (
        <>
            {/* Logo */}
            <div className="p-6 border-b border-gray-700/50 flex items-center space-x-3">
                <div className="bg-gradient-to-br from-cyan-600 to-blue-600 p-2.5 rounded-xl text-white">
                    <Shield size={24} />
                </div>
                <div className="flex-1">
                    <span className="text-xl font-black tracking-tight">
                        CYBER<span className="text-cyan-400">SEC</span>
                    </span>
                    <p className="text-xs text-gray-500 font-medium">Admin Panel</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                        <div key={item.path}>
                            <Link
                                to={item.path}
                                onClick={closeMobileMenu}
                                className={`flex items-center space-x-3 p-3.5 rounded-xl transition-all duration-300 group ${active
                                    ? "bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 text-cyan-300"
                                    : "text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent"
                                    }`}
                            >
                                <Icon
                                    className={`${active ? "text-cyan-400" : "group-hover:text-cyan-400"} transition-colors`}
                                    size={20}
                                />
                                <span className="font-semibold flex-1">{item.label}</span>
                                {active && (
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                                )}
                            </Link>
                        </div>
                    );
                })}
            </nav>

            {/* User Info */}
            <div className="p-4 border-t border-gray-700/50 space-y-4">
                <div className="px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                        Logged in as
                    </p>
                    <Link
                        to="/admin/profile"
                        onClick={closeMobileMenu}
                        className="font-bold text-cyan-300 hover:text-cyan-200 transition-colors truncate block text-sm"
                    >
                        {user?.name || "Admin"}
                    </Link>
                </div>
                <button
                    onClick={() => {
                        handleLogout();
                        closeMobileMenu();
                    }}
                    className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-300 border border-transparent hover:border-red-500/30 font-semibold"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </>
    );
}
