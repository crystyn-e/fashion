import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import {
    HomeIcon,
    ShoppingCartIcon,
    ArrowPathIcon,
    UserGroupIcon,
    CubeIcon,
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
} from "@heroicons/react/24/outline";


const logoSrc = "/images/logo-boesafashion.jpg";

export default function PelayanLayout({ children, title }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const currentPath = usePage().url.split("?")[0].replace(/\/+$/, "");

    const navigation = [
        { name: "Dashboard", href: "/pelayan/dashboard", icon: HomeIcon },
        {
            name: "Transaksi Baru",
            href: "/pelayan/transaksi/create",
            icon: ShoppingCartIcon,
        },
        { name: "Daftar Sewa", href: "/pelayan/transaksi", icon: CubeIcon },
        {
            name: "Pengembalian",
            href: "/pelayan/pengembalian",
            icon: ArrowPathIcon,
        },
        {
            name: "Data Pelanggan",
            href: "/pelayan/pelanggan",
            icon: UserGroupIcon,
        },
    ];

    const isActive = (item) => {
        if (currentPath === item.href) {
            return true;
        }

        if (item.href === "/pelayan/transaksi") {
            return (
                currentPath.startsWith(`${item.href}/`) &&
                currentPath !== "/pelayan/transaksi/create"
            );
        }

        return currentPath.startsWith(`${item.href}/`);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Sidebar Desktop */}
            <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                <div className="flex flex-col flex-1 min-h-0 bg-[#0A192F] shadow-xl">
                    {/* Logo Area dengan Gambar */}
                    <div className="flex items-center h-16 px-4 border-b border-[#C5A059]/20">
                        <div className="flex items-center space-x-2">
                            <img
                                src={logoSrc}
                                alt="BOESA FASHION"
                                className="w-8 h-8 rounded-lg object-cover"
                            />
                            <span className="text-white font-bold text-lg tracking-wide">
                                BOESA{" "}
                                <span className="text-[#C5A059]">STAF</span>
                            </span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                        <nav className="flex-1 px-2 space-y-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item);
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        aria-current={active ? "page" : undefined}
                                        className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                                            active
                                                ? "bg-[#C5A059] text-[#0A192F] shadow-md"
                                                : "text-white/70 hover:text-white hover:bg-white/10"
                                        }`}
                                    >
                                        <Icon
                                            className="mr-3 h-5 w-5"
                                            style={{
                                                color: active
                                                    ? "#0A192F"
                                                    : "#C5A059",
                                            }}
                                        />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Logout */}
                        <div className="px-2 mt-auto pt-4 border-t border-[#C5A059]/20">
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="group flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
                            >
                                <ArrowLeftOnRectangleIcon
                                    className="mr-3 h-5 w-5"
                                    style={{ color: "#C5A059" }}
                                />
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 shadow-md bg-[#0A192F]">
                <div className="flex items-center justify-between h-16 px-4">
                    <div className="flex items-center space-x-2">
                        <img
                            src={logoSrc}
                            alt="BOESA FASHION"
                            className="w-8 h-8 rounded-lg object-cover"
                        />
                        <span className="font-bold text-white tracking-wide">
                            BOESA <span className="text-[#C5A059]">STAF</span>
                        </span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 text-white/70 rounded-lg hover:bg-white/10 transition-all"
                    >
                        {isSidebarOpen ? (
                            <XMarkIcon className="w-6 h-6" />
                        ) : (
                            <Bars3Icon className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar */}
            {isSidebarOpen && (
                <div className="md:hidden fixed inset-0 z-40 pt-16 overflow-y-auto bg-[#0A192F]">
                    <nav className="px-4 py-4 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    aria-current={active ? "page" : undefined}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                                        active
                                            ? "bg-[#C5A059] text-[#0A192F] shadow-md"
                                            : "text-white/70 hover:text-white hover:bg-white/10"
                                    }`}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <Icon
                                        className="mr-3 h-5 w-5"
                                        style={{
                                            color: active
                                                ? "#0A192F"
                                                : "#C5A059",
                                        }}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                        <div className="pt-4 mt-4 border-t border-[#C5A059]/20">
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <ArrowLeftOnRectangleIcon
                                    className="mr-3 h-5 w-5"
                                    style={{ color: "#C5A059" }}
                                />
                                Logout
                            </Link>
                        </div>
                    </nav>
                </div>
            )}

            {/* Main Content Container */}
            <div className="md:pl-64">
                {/* Content Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="py-6 px-4 sm:px-6 md:px-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-semibold text-gray-800">
                                    {title}
                                </h1>
                                <div className="w-16 h-0.5 bg-[#C5A059] rounded-full mt-2"></div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="py-6 px-4 sm:px-6 md:px-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
