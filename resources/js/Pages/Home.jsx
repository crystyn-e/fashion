import PublicLayout from "../Layouts/PublicLayout";
import { Link, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    ShoppingBagIcon,
    PhoneIcon,
    ArrowRightIcon,
    ShieldCheckIcon,
    HeartIcon,
    ClockIcon,
    EnvelopeIcon,
    XMarkIcon,
    UserGroupIcon,
    GlobeAltIcon,
    CameraIcon,
    EyeIcon,
    SparklesIcon,
    BriefcaseIcon,
    GiftIcon,
    TagIcon,
    TicketIcon,
} from "@heroicons/react/24/outline";
import { ClockIcon as ClockIconSolid } from "@heroicons/react/24/solid";

// Logo gambar dari public/images/
const logoSrc = "/images/logo-boesafashion.png";

export default function Home({
    featuredProducts: initialProducts = [],
    categories: initialCategories = [],
}) {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Form kontak - FIELD NAMES SUDAH DIPERBAIKI
    const { data, setData, post, processing, reset, recentlySuccessful } =
        useForm({
            nama_lengkap: "",
            email: "",
            no_telepon: "",
            pesan: "",
        });

    const handleContactSubmit = (e) => {
        e.preventDefault();
        post("/contact/send", {
            preserveScroll: true,
            onSuccess: () => {
                reset("nama_lengkap", "email", "no_telepon", "pesan");
                setTimeout(() => closeContactModal(), 2000);
            },
        });
    };

    useEffect(() => {
        console.log("=== DEBUG HOME PAGE ===");
        console.log("initialProducts:", initialProducts);
        console.log("initialProducts length:", initialProducts?.length);
        setIsLoading(false);
    }, [initialProducts, initialCategories]);

    // Fungsi untuk mendapatkan URL gambar yang benar
    const getImageUrl = (product) => {
        const imagePath =
            product.gambar_utama || product.gambar || product.image;

        if (!imagePath) {
            return "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop";
        }

        if (imagePath.startsWith("http")) {
            return imagePath;
        }

        if (imagePath.startsWith("/storage/")) {
            return imagePath;
        }

        if (imagePath.startsWith("barang/")) {
            return `/storage/${imagePath}`;
        }

        return `/storage/${imagePath}`;
    };

    const hasProducts = initialProducts && initialProducts.length > 0;
    const heroProducts = hasProducts ? initialProducts.slice(0, 3) : [];
    const featuredList = hasProducts ? initialProducts.slice(0, 6) : [];

    const categoryList =
        initialCategories?.length > 0
            ? initialCategories.map((cat) => ({
                  id: cat.id,
                  name: cat.nama_kategori,
                  count: cat.barang_count || 0,
              }))
            : [];

    const getCategoryIcon = (name) => {
        const icons = {
            Jas: BriefcaseIcon,
            Gaun: SparklesIcon,
            Sepatu: ShoppingBagIcon,
            Aksesoris: GiftIcon,
            Kostum: TicketIcon,
            Dasi: TagIcon,
        };
        return icons[name] || BriefcaseIcon;
    };

    const features = [
        {
            icon: ShieldCheckIcon,
            title: "Kualitas Premium",
            desc: "Laundry profesional",
        },
        {
            icon: HeartIcon,
            title: "DP 50%",
            desc: "Sisa bayar saat Pengambilan",
        },
        { icon: ClockIcon, title: "Sewa 3 Hari", desc: "Bisa perpanjang" },
    ];

    const stats = [
        { number: "1000+", label: "Pelanggan Puas", icon: UserGroupIcon },
        {
            number: `${initialProducts.length}+`,
            label: "Koleksi Item",
            icon: CameraIcon,
        },
        {
            number: `${categoryList.length}+`,
            label: "Kategori",
            icon: GlobeAltIcon,
        },
        { number: "24/7", label: "Customer Service", icon: ClockIconSolid },
    ];

    const openContactModal = () => {
        setIsContactModalOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeContactModal = () => {
        setIsContactModalOpen(false);
        document.body.style.overflow = "unset";
    };

    if (isLoading) {
        return (
            <PublicLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Memuat koleksi...</p>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <div className="space-y-16 md:space-y-24">
                {/* HERO SECTION */}
                <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-[#0A192F] via-[#1E2F4A] to-[#0A192F]">
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1200')] bg-cover bg-center opacity-5"></div>
                        <div className="absolute top-20 left-20 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C5A059]/5 rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8 text-white">
                                {/* LOGO DENGAN GAMBAR - TELAH DIPERBAIKI */}
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-2xl">
                                            <img
                                                src={logoSrc}
                                                alt="BOESA FASHION"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src =
                                                        "/images/logo-boesafashion.jpg";
                                                }}
                                            />
                                        </div>
                                        <div className="absolute -inset-1 bg-[#C5A059] rounded-2xl blur opacity-20"></div>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-light tracking-wider">
                                            BOESA
                                        </h2>
                                        <h3 className="text-xl font-light tracking-wider text-[#C5A059]">
                                            FASHION
                                        </h3>
                                    </div>
                                </div>

                                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                                    <span className="w-2 h-2 bg-[#C5A059] rounded-full animate-pulse"></span>
                                    <span className="text-sm font-medium text-white/90">
                                        ✨ Premium Quality - Laundry
                                        Professional
                                    </span>
                                </div>

                                <div>
                                    <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                                        Tampil
                                        <span className="relative ml-3">
                                            <span className="relative z-10 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-transparent bg-clip-text">
                                                Mewah
                                            </span>
                                            <span className="absolute bottom-2 left-0 w-full h-3 bg-[#C5A059]/30 -z-10 blur-sm"></span>
                                        </span>
                                        <br />
                                        Tanpa Beban
                                    </h1>
                                    <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                                        Sewa jas, gaun, dan aksesoris
                                        berkualitas premium. Koleksi lengkap
                                        untuk pernikahan, wisuda, pesta, dan
                                        acara spesial Anda.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-4 pt-4">
                                    <Link
                                        href="/koleksi"
                                        className="group relative px-8 py-4 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#0A192F] rounded-xl font-medium overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                    >
                                        <span className="relative z-10 flex items-center space-x-3">
                                            <ShoppingBagIcon className="w-5 h-5" />
                                            <span>Lihat Koleksi</span>
                                            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                        </span>
                                    </Link>
                                    <button
                                        onClick={openContactModal}
                                        className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border-2 border-white/20 hover:border-[#C5A059] transition-all duration-300 flex items-center space-x-2"
                                    >
                                        <PhoneIcon className="w-5 h-5" />
                                        <span>Hubungi Kami</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-8">
                                    {features.map((feature, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start space-x-3"
                                        >
                                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                                <feature.icon className="w-5 h-5 text-[#C5A059]" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">
                                                    {feature.title}
                                                </p>
                                                <p className="text-sm text-gray-400">
                                                    {feature.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="grid h-[440px] grid-cols-2 grid-rows-2 gap-4 sm:h-[520px] lg:h-[560px]">
                                    {heroProducts.map((product, index) => (
                                        <div
                                            key={product.id}
                                            className={`group relative bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden transform hover:-translate-y-2 transition-all duration-500 ${index === 0 ? (heroProducts.length === 1 ? "col-span-2 row-span-2" : "row-span-2") : heroProducts.length === 2 ? "row-span-2" : ""}`}
                                        >
                                            <div className="relative h-full overflow-hidden">
                                                <img
                                                    src={getImageUrl(product)}
                                                    alt={product.nama_barang}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    style={{
                                                        objectPosition: `${product.gambar_position_x ?? 50}% ${product.gambar_position_y ?? 50}%`,
                                                    }}
                                                />
                                                {product.status ===
                                                    "disewa" && (
                                                    <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg">
                                                        Disewa
                                                    </span>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-transparent opacity-60"></div>
                                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                                    <p className="font-semibold text-sm">
                                                        {product.nama_barang}
                                                    </p>
                                                    <p className="text-xs text-gray-300">
                                                        {product.kategori
                                                            ?.nama_kategori ||
                                                            "Koleksi"}
                                                    </p>
                                                    <p className="text-sm font-bold mt-1 text-[#C5A059]">
                                                        Rp{" "}
                                                        {parseInt(
                                                            product.harga_sewa ||
                                                                0,
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CATEGORIES SECTION */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-[#C5A059] font-bold tracking-[0.3em] uppercase text-xs mb-3">
                            Browse by Style
                        </p>
                        <h2 className="text-4xl font-bold text-[#0A192F]">
                            Kategori Pilihan
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {categoryList.map((cat, idx) => {
                            const IconComponent = getCategoryIcon(cat.name);
                            return (
                                <Link
                                    key={idx}
                                    href={`/koleksi?kategori=${cat.id}`}
                                    className="group bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#C5A059] transition-all duration-500 text-center"
                                >
                                    <div className="inline-flex p-4 rounded-2xl bg-gray-50 group-hover:bg-[#C5A059]/10 text-gray-400 group-hover:text-[#C5A059] mb-4 transition-all duration-500">
                                        <IconComponent className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-bold text-[#0A192F] group-hover:text-[#C5A059] transition-colors">
                                        {cat.name}
                                    </h3>
                                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">
                                        {cat.count} Items
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* FEATURED PRODUCTS */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="max-w-xl">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-12 h-[2px] bg-[#C5A059]"></div>
                                <p className="text-xs font-bold text-[#C5A059] uppercase tracking-[0.3em]">
                                    Signature Collection
                                </p>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-[#0A192F]">
                                Koleksi Unggulan
                            </h2>
                        </div>
                        <Link
                            href="/koleksi"
                            className="group flex items-center space-x-3 text-[#C5A059] font-bold"
                        >
                            <span>Lihat Semua Produk</span>
                            <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-[#C5A059] group-hover:border-[#C5A059] transition-all">
                                <ArrowRightIcon className="w-4 h-4 group-hover:text-white transition-colors" />
                            </div>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {featuredList.map((product) => (
                            <div key={product.id} className="group">
                                <div className="relative bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50 flex flex-col h-full">
                                    <div className="relative aspect-[4/5] overflow-hidden">
                                        <img
                                            src={getImageUrl(product)}
                                            alt={product.nama_barang}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                                            style={{
                                                objectPosition: `${product.gambar_position_x ?? 50}% ${product.gambar_position_y ?? 50}%`,
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <Link
                                                href={`/koleksi/${product.slug || product.id}`}
                                                className="bg-white text-[#0A192F] px-8 py-3 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-all shadow-xl flex items-center space-x-2"
                                            >
                                                <EyeIcon className="w-5 h-5" />
                                                <span>Detail</span>
                                            </Link>
                                        </div>
                                        {product.badge && (
                                            <div className="absolute top-6 right-6">
                                                <span className="px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest shadow-lg bg-[#C5A059] text-[#0A192F]">
                                                    {product.badge}
                                                </span>
                                            </div>
                                        )}
                                        {product.status === "disewa" && (
                                            <div className="absolute top-6 left-6">
                                                <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full shadow-lg">
                                                    Disewa
                                                </span>
                                            </div>
                                        )}
                                        {product.status === "tersedia" &&
                                            !product.badge && (
                                                <div className="absolute top-6 left-6">
                                                    <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full shadow-lg">
                                                        Tersedia
                                                    </span>
                                                </div>
                                            )}
                                    </div>
                                    <div className="p-8 text-center flex-grow flex flex-col justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold text-[#C5A059] uppercase tracking-[0.2em] mb-2">
                                                {product.kategori
                                                    ?.nama_kategori ||
                                                    "Koleksi"}
                                            </p>
                                            <h3 className="text-xl font-bold text-[#0A192F] mb-4 group-hover:text-[#C5A059] transition-colors">
                                                {product.nama_barang}
                                            </h3>
                                        </div>
                                        <div className="border-t border-gray-50 pt-6">
                                            <div className="flex items-center justify-center space-x-2 mb-6">
                                                <span className="text-sm font-medium text-gray-400 mt-1">
                                                    Rp
                                                </span>
                                                <span className="text-3xl font-black text-[#0A192F] tracking-tighter">
                                                    {parseInt(
                                                        product.harga_sewa || 0,
                                                    ).toLocaleString()}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    / 3 Hari
                                                </span>
                                            </div>
                                            <Link
                                                href={`/koleksi/${product.slug || product.id}`}
                                                className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold group-hover:bg-[#0A192F] group-hover:text-[#C5A059] transition-all duration-300 inline-block text-center"
                                            >
                                                Sewa Sekarang
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* STATS SECTION */}
                <section className="bg-[#0A192F] py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="text-center text-white"
                                >
                                    <div className="flex justify-center mb-3">
                                        <stat.icon className="w-8 h-8 text-[#C5A059]" />
                                    </div>
                                    <div className="text-3xl font-bold mb-2">
                                        {stat.number}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA SECTION */}
                <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    <div className="bg-gradient-to-r from-[#0A192F] to-[#1E2F4A] rounded-3xl p-12 text-center text-white shadow-2xl border border-[#C5A059]/20">
                        <h2 className="text-3xl font-bold mb-4">
                            Siap Tampil Memukau?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Kunjungi showroom kami dan konsultasikan kebutuhan
                            fashion Anda
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/kontak"
                                className="px-8 py-4 bg-[#C5A059] text-[#0A192F] rounded-full font-semibold hover:bg-[#D4AF37] transition transform hover:scale-105 shadow-lg"
                            >
                                Hubungi Kami
                            </Link>
                            <Link
                                href="/koleksi"
                                className="px-8 py-4 bg-transparent border-2 border-[#C5A059] text-[#C5A059] rounded-full font-semibold hover:bg-[#C5A059] hover:text-[#0A192F] transition transform hover:scale-105"
                            >
                                Lihat Koleksi
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CONTACT MODAL */}
                {isContactModalOpen && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                            onClick={closeContactModal}
                        ></div>
                        <div className="relative min-h-screen flex items-center justify-center p-4">
                            <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden">
                                <button
                                    onClick={closeContactModal}
                                    className="absolute top-4 right-4 z-10 p-2 bg-white/90 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                                <div className="bg-gradient-to-r from-[#0A192F] to-[#1E2F4A] p-8 text-white">
                                    <h2 className="text-3xl font-bold mb-2">
                                        Hubungi Kami
                                    </h2>
                                    <p className="text-gray-300">
                                        Tim customer service kami siap membantu
                                        Anda 24/7
                                    </p>
                                </div>
                                <div className="p-8">
                                    {recentlySuccessful && (
                                        <div className="mb-4 p-4 bg-green-100 border border-green-200 rounded-xl text-green-700 text-sm">
                                            ✅ Pesan Anda telah terkirim! Tim
                                            kami akan segera merespon.
                                        </div>
                                    )}

                                    <form
                                        onSubmit={handleContactSubmit}
                                        className="space-y-5"
                                    >
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Nama Lengkap{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Masukkan nama lengkap"
                                                    value={data.nama_lengkap}
                                                    onChange={(e) =>
                                                        setData(
                                                            "nama_lengkap",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Email{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="email"
                                                    placeholder="email@anda.com"
                                                    value={data.email}
                                                    onChange={(e) =>
                                                        setData(
                                                            "email",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                No. Telepon{" "}
                                                <span className="text-gray-400 text-xs">
                                                    (Opsional)
                                                </span>
                                            </label>
                                            <input
                                                type="tel"
                                                placeholder="Contoh: 08123456789"
                                                value={data.no_telepon}
                                                onChange={(e) =>
                                                    setData(
                                                        "no_telepon",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Pesan{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <textarea
                                                placeholder="Tulis pesan Anda di sini..."
                                                rows="5"
                                                value={data.pesan}
                                                onChange={(e) =>
                                                    setData(
                                                        "pesan",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none transition-all resize-none"
                                                required
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full py-4 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#0A192F] rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg
                                                        className="animate-spin h-5 w-5 text-[#0A192F]"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                    Mengirim...
                                                </span>
                                            ) : (
                                                "Kirim Pesan"
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
