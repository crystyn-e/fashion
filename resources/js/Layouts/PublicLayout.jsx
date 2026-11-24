import { Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon, UserIcon } from "@heroicons/react/24/outline";

// Gunakan placeholder online
const logoSrc = "/images/logo-boesafashion.jpg";

export default function PublicLayout({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navigation = [
        { name: "BERANDA", href: "/" },
        { name: "KOLEKSI", href: "/koleksi" },
        { name: "KONTAK", href: "/kontak" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-white to-amber-50">
            {/* Navbar */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${
                    isScrolled
                        ? "bg-white/80 backdrop-blur-md shadow-lg py-3"
                        : "bg-white shadow-md py-5"
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        {/* Logo dengan Gambar */}
                        <Link
                            href="/"
                            className="flex items-center space-x-3 group"
                        >
                            <div className="relative">
                                <img
                                    src={logoSrc}
                                    alt="BOESA FASHION"
                                    className="w-12 h-12 rounded-xl object-cover shadow-lg transform group-hover:scale-105 transition-all duration-500"
                                />
                                <div className="absolute -inset-1 bg-[#C5A059] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg tracking-wider text-gray-800">
                                    BOESA
                                </span>
                                <span className="text-[10px] tracking-widest text-[#C5A059]">
                                    FASHION
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#C5A059] rounded-lg hover:bg-gray-50 transition-all duration-300"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Tombol Masuk */}
                        {/* <div className="hidden md:flex items-center space-x-3">
                            <Link
                                href="/login"
                                className="px-6 py-2.5 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#0A192F] rounded-lg font-medium text-sm shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                            >
                                <span className="flex items-center space-x-2">
                                    <UserIcon className="w-4 h-4" />
                                    <span>MASUK</span>
                                </span>
                            </Link>
                        </div> */}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-gray-600 hover:text-[#C5A059] rounded-lg hover:bg-gray-50 transition-all duration-300"
                        >
                            {isMenuOpen ? (
                                <XMarkIcon className="w-6 h-6" />
                            ) : (
                                <Bars3Icon className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200 mt-3">
                        <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="block px-4 py-3 text-gray-700 hover:text-[#C5A059] hover:bg-gray-50 rounded-lg transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="pt-2 mt-2 border-t border-gray-200">
                                <Link
                                    href="/login"
                                    className="block px-4 py-3 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#0A192F] rounded-lg font-medium text-center"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Masuk
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Spacer */}
            <div className="h-20"></div>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-[#0A192F] text-white mt-16 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center text-center">
                        {/* Logo Footer dengan Gambar */}
                        <div className="flex items-center space-x-3 mb-4">
                            <img
                                src={logoSrc}
                                alt="BOESA FASHION"
                                className="w-10 h-10 rounded-xl object-cover shadow-md"
                            />
                            <div>
                                <span className="font-bold text-lg tracking-wider">
                                    BOESA
                                </span>
                                <span className="text-xs tracking-widest text-[#C5A059] ml-1">
                                    FASHION
                                </span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex space-x-6 mb-6">
                            <a
                                href="https://www.instagram.com/boesafashion/"
                                className="text-gray-400 hover:text-[#C5A059] transition-colors"
                            >
                                Instagram
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-[#C5A059] transition-colors"
                            >
                                WhatsApp
                            </a>
                        </div>

                        {/* Copyright */}
                        <p className="text-gray-500 text-sm">
                            © {new Date().getFullYear()} Boesa Fashion. All
                            rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
