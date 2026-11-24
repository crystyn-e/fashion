import PublicLayout from "@/Layouts/PublicLayout";
import { Link } from "@inertiajs/react";
import { ArrowLeftIcon, PhoneIcon } from "@heroicons/react/24/outline";

export default function KoleksiShow({ barang, barangTerkait }) {
    // Buka WhatsApp
    const openWhatsApp = () => {
        const message = `Halo Boesa Fashion, saya tertarik dengan ${barang.nama_barang}. Apakah masih tersedia?`;
        window.open(
            `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`,
            "_blank",
        );
    };

    // Fungsi untuk badge status
    const getStatusBadge = (status) => {
        switch (status) {
            case "tersedia":
                return (
                    <span className="ml-2 px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800 border border-green-200">
                        Tersedia
                    </span>
                );
            case "disewa":
                return (
                    <span className="ml-2 px-3 py-1 text-xs font-bold rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                        Disewa
                    </span>
                );
            case "maintenance":
                return (
                    <span className="ml-2 px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 border border-red-200">
                        Maintenance
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <PublicLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Back Button */}
                <Link
                    href="/koleksi"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-[#C5A059] mb-6"
                >
                    <ArrowLeftIcon className="w-4 h-4 mr-1" />
                    Kembali ke Koleksi
                </Link>

                {/* Detail Barang */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                        {/* Gambar */}
                        <div className="bg-gray-100 rounded-xl overflow-hidden">
                            <img
                                src={
                                    barang.gambar ||
                                    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop"
                                }
                                alt={barang.nama_barang}
                                className="w-full h-96 object-cover"
                                style={{
                                    objectPosition: `${barang.gambar_position_x ?? 50}% ${barang.gambar_position_y ?? 50}%`,
                                }}
                                onError={(e) => {
                                    e.target.src =
                                        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop";
                                }}
                            />
                        </div>

                        {/* Info */}
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A192F] mb-2">
                                {barang.nama_barang}
                            </h1>
                            <p className="text-[#C5A059] font-medium mb-4">
                                {barang.kategori}
                            </p>

                            {/* Status */}
                            <div className="mb-4">
                                <span className="font-semibold text-gray-700">
                                    Status:
                                </span>
                                {getStatusBadge(barang.status)}
                            </div>

                            <div className="border-t border-b border-gray-200 py-4 my-4">
                                <p className="text-gray-700">
                                    {barang.deskripsi || "Tidak ada deskripsi"}
                                </p>
                            </div>

                            <div className="space-y-3 mb-6">
                                <p>
                                    <span className="font-semibold text-gray-700">
                                        Ukuran:
                                    </span>{" "}
                                    {barang.ukuran || "-"}
                                </p>
                                <p>
                                    <span className="font-semibold text-gray-700">
                                        Warna:
                                    </span>{" "}
                                    {barang.warna || "-"}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <p className="text-sm text-gray-600">
                                    Harga Sewa
                                </p>
                                <p className="text-3xl font-bold text-[#C5A059]">
                                    Rp{" "}
                                    {parseInt(
                                        barang.harga_sewa,
                                    ).toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500">
                                    / 3 hari
                                </p>
                            </div>

                            {/* TOMBOL HUBUNGI SAJA, TANPA SEWA SEKARANG */}
                            <button
                                onClick={openWhatsApp}
                                className="w-full px-6 py-3 bg-[#C5A059] text-[#0A192F] rounded-lg font-medium hover:bg-[#D4AF37] transition-colors flex items-center justify-center gap-2"
                            >
                                <PhoneIcon className="w-5 h-5" />
                                Hubungi via WhatsApp
                            </button>
                        </div>
                    </div>
                </div>

                {/* Barang Terkait */}
                {barangTerkait.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-[#0A192F] mb-6">
                            Barang Terkait
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {barangTerkait.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/koleksi/${item.slug}`}
                                    className="group"
                                >
                                    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden">
                                        <div className="relative">
                                            <img
                                                src={
                                                    item.gambar ||
                                                    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop"
                                                }
                                                alt={item.nama_barang}
                                                className="w-full h-48 object-cover"
                                                style={{
                                                    objectPosition: `${item.gambar_position_x ?? 50}% ${item.gambar_position_y ?? 50}%`,
                                                }}
                                            />
                                            {item.status === "disewa" && (
                                                <span className="absolute top-2 right-2 px-2 py-1 text-xs bg-orange-500 text-white rounded-full">
                                                    Disewa
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <h3 className="font-semibold text-gray-800 group-hover:text-[#C5A059]">
                                                {item.nama_barang}
                                            </h3>
                                            <p className="text-[#C5A059] font-bold mt-1">
                                                Rp{" "}
                                                {parseInt(
                                                    item.harga_sewa,
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
