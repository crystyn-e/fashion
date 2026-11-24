import PublicLayout from "@/Layouts/PublicLayout";
import { Link, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    MagnifyingGlassIcon,
    EyeIcon,
    HeartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

export default function KoleksiIndex({
    barangs = [],
    kategoris = [],
    filters = {},
}) {
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [selectedCategory, setSelectedCategory] = useState(
        filters.kategori || "",
    );
    const [selectedStatus, setSelectedStatus] = useState(filters.status || "");
    const [likedItems, setLikedItems] = useState({});

    const applyFilters = () => {
        router.get(
            "/koleksi",
            {
                search: searchTerm,
                kategori: selectedCategory,
                status: selectedStatus,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    useEffect(() => {
        const timer = setTimeout(() => applyFilters(), 500);
        return () => clearTimeout(timer);
    }, [searchTerm, selectedCategory, selectedStatus]);

    const toggleLike = (id, e) => {
        e.preventDefault();
        setLikedItems((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const formatPrice = (price) => new Intl.NumberFormat("id-ID").format(price);

    /**
     * LOGIKA GRID EDITORIAL (Loop 6 Item)
     * Menghasilkan layout yang dinamis dan tidak kaku.
     */
    const getGridSpan = (index) => {
        const patterns = [
            "md:col-span-1 md:row-span-2", // 1. Portrait (Tinggi)
            "md:col-span-1 md:row-span-1", // 2. Standard
            "md:col-span-1 md:row-span-1", // 3. Standard
            "md:col-span-2 md:row-span-2", // 4. Featured (Besar & Lebar)
            "md:col-span-1 md:row-span-1", // 5. Standard
            "md:col-span-1 md:row-span-1", // 6. Standard
        ];
        return patterns[index % patterns.length];
    };

    return (
        <PublicLayout>
            {/* Header Section */}
            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center">
                    <span className="text-[#C5A059] text-[10px] uppercase tracking-[0.5em] mb-4 block font-bold">
                        Archive Collection
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extralight text-gray-900 tracking-tight mb-6">
                        Elegance in Every{" "}
                        <span className="italic font-serif">Detail</span>
                    </h1>
                    <div className="w-12 h-px bg-gray-300 mx-auto"></div>
                </div>
            </div>

            <div className="bg-[#F8F9FA] min-h-screen pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Minimalist Filter Bar */}
                    <div className="flex flex-col md:flex-row gap-4 mb-10 -translate-y-6">
                        <div className="relative flex-1 group">
                            <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#C5A059] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search collection..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 border-none rounded-2xl bg-white shadow-sm focus:ring-2 focus:ring-[#C5A059]/20 transition-all text-sm uppercase tracking-widest"
                            />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            className="md:w-64 px-6 py-4 border-none rounded-2xl bg-white shadow-sm cursor-pointer focus:ring-2 focus:ring-[#C5A059]/20 text-[11px] uppercase tracking-widest font-semibold"
                        >
                            <option value="">All Categories</option>
                            {kategoris.map((k) => (
                                <option key={k.id} value={k.id}>
                                    {k.nama_kategori}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* MAIN GRID */}
                    {barangs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]">
                            {barangs.map((barang, index) => (
                                <div
                                    key={barang.id}
                                    className={`group relative overflow-hidden rounded-[2.5rem] bg-gray-200 transition-all duration-700 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] ${getGridSpan(index)} animate-fadeInUp`}
                                    style={{
                                        animationDelay: `${(index % 6) * 0.1}s`,
                                    }}
                                >
                                    {/* Background Image */}
                                    <div className="absolute inset-0 w-full h-full">
                                        <img
                                            src={
                                                barang.gambar ||
                                                "https://images.unsplash.com/photo-1594932224010-75f2a778b4d8?q=80&w=800"
                                            }
                                            alt={barang.nama_barang}
                                            className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
                                            style={{
                                                objectPosition: `${barang.gambar_position_x ?? 50}% ${barang.gambar_position_y ?? 50}%`,
                                            }}
                                        />
                                        {/* Subtle Vignette */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 opacity-60"></div>
                                    </div>

                                    {/* Top Controls */}
                                    <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
                                        {barang.badge ? (
                                            <span
                                                className={`px-4 py-1.5 text-[9px] font-black tracking-[0.2em] uppercase rounded-full backdrop-blur-md shadow-lg
                                                ${
                                                    barang.badge === "HOT"
                                                        ? "bg-red-600/90 text-white"
                                                        : barang.badge === "NEW"
                                                          ? "bg-black/80 text-white"
                                                          : "bg-[#C5A059]/90 text-white"
                                                }`}
                                            >
                                                {barang.badge}
                                            </span>
                                        ) : (
                                            <span></span>
                                        )}

                                        <button
                                            onClick={(e) =>
                                                toggleLike(barang.id, e)
                                            }
                                            className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white hover:text-red-500 transition-all active:scale-90"
                                        >
                                            {likedItems[barang.id] ? (
                                                <HeartSolidIcon className="h-4 w-4 text-red-500" />
                                            ) : (
                                                <HeartIcon className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Bottom Info Card (Static) */}
                                    <div className="absolute bottom-6 left-6 right-6 z-10 group-hover:opacity-0 transition-opacity duration-500">
                                        <div className="bg-black/20 backdrop-blur-xl border border-white/10 p-4 rounded-2xl inline-block max-w-[80%]">
                                            <p className="text-white text-[10px] font-light tracking-[0.2em] uppercase truncate">
                                                {barang.nama_barang}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Hover Details Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 z-30">
                                        <div className="transform translate-y-10 group-hover:translate-y-0 transition-all duration-700">
                                            <span className="text-[#C5A059] text-[10px] font-bold uppercase tracking-[0.4em] mb-2 block">
                                                {barang.kategori
                                                    ?.nama_kategori ||
                                                    "Exclusive"}
                                            </span>
                                            <h3 className="text-white text-2xl font-extralight mb-6 leading-tight">
                                                {barang.nama_barang}
                                            </h3>

                                            <div className="flex items-center justify-between border-t border-white/10 pt-6">
                                                <div>
                                                    <p className="text-white text-xl font-medium tracking-tighter">
                                                        Rp{" "}
                                                        {formatPrice(
                                                            barang.harga_sewa,
                                                        )}
                                                    </p>
                                                    <p className="text-gray-400 text-[9px] uppercase tracking-widest mt-1">
                                                        Per 3 Days Rental
                                                    </p>
                                                </div>

                                                <Link
                                                    href={`/koleksi/${barang.slug}`}
                                                    className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-black hover:bg-[#C5A059] hover:text-white transition-all transform hover:rotate-[15deg] shadow-xl"
                                                >
                                                    <EyeIcon className="h-6 w-6" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-40">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <MagnifyingGlassIcon className="h-8 w-8 text-gray-300" />
                            </div>
                            <h3 className="text-gray-400 uppercase tracking-[0.3em] font-light">
                                No Items Found
                            </h3>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeInUp {
                    animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1)
                        forwards;
                }
            `}</style>
        </PublicLayout>
    );
}
