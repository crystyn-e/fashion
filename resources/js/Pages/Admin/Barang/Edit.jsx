import AdminLayout from "@/Layouts/AdminLayout";
import { useForm, Link } from "@inertiajs/react";
import { ArrowLeftIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import ImagePositionPicker from "./ImagePositionPicker";

export default function BarangEdit({ barang, kategoris }) {
    const { data, setData, put, processing, errors } = useForm({
        kode_barang: barang.kode_barang,
        nama_barang: barang.nama_barang,
        kategori_id: barang.kategori_id || "",
        ukuran: barang.ukuran || "",
        warna: barang.warna || "",
        harga_sewa: barang.harga_sewa,
        stok: barang.stok,
        deskripsi: barang.deskripsi || "",
        status: barang.status,
        gambar_utama: null,
        gambar_position_x: barang.gambar_position_x ?? 50,
        gambar_position_y: barang.gambar_position_y ?? 50,
    });

    const [previewImage, setPreviewImage] = useState(
        barang.gambar_utama ? `/storage/${barang.gambar_utama}` : null,
    );

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/barang/${barang.id}`);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("gambar_utama", file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    return (
        <AdminLayout title="Edit Barang">
            <div className="py-6">
                {/* Back Button - Warna emas */}
                <Link
                    href="/admin/barang"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-[#C5A059] transition-colors mb-6"
                >
                    <ArrowLeftIcon className="w-4 h-4 mr-1" />
                    Kembali ke Daftar Barang
                </Link>

                {/* Form Card - Putih solid */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 max-w-3xl">
                    {/* Header dengan garis emas */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Edit Barang: {barang.nama_barang}
                        </h2>
                        <div className="w-16 h-0.5 bg-[#C5A059] rounded-full"></div>
                    </div>

                    <form
                        onSubmit={submit}
                        className="space-y-6"
                        encType="multipart/form-data"
                    >
                        {/* Grid 2 Kolom */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Kode Barang */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kode Barang{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.kode_barang}
                                    onChange={(e) =>
                                        setData("kode_barang", e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all duration-300"
                                    placeholder="Contoh: JAS-001"
                                />
                                {errors.kode_barang && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.kode_barang}
                                    </p>
                                )}
                            </div>

                            {/* Nama Barang */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Barang{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.nama_barang}
                                    onChange={(e) =>
                                        setData("nama_barang", e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all duration-300"
                                    placeholder="Contoh: Jas Tuxedo Black Premium"
                                />
                                {errors.nama_barang && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.nama_barang}
                                    </p>
                                )}
                            </div>

                            {/* Kategori */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kategori{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.kategori_id}
                                    onChange={(e) =>
                                        setData("kategori_id", e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all duration-300"
                                >
                                    <option value="">Pilih Kategori</option>
                                    {kategoris.map((kategori) => (
                                        <option
                                            key={kategori.id}
                                            value={kategori.id}
                                        >
                                            {kategori.nama_kategori}
                                        </option>
                                    ))}
                                </select>
                                {errors.kategori_id && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.kategori_id}
                                    </p>
                                )}
                            </div>

                            {/* Ukuran */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ukuran
                                </label>
                                <input
                                    type="text"
                                    value={data.ukuran}
                                    onChange={(e) =>
                                        setData("ukuran", e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all duration-300"
                                    placeholder="Contoh: S, M, L, XL atau 39,40,41"
                                />
                                {errors.ukuran && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.ukuran}
                                    </p>
                                )}
                            </div>

                            {/* Warna */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Warna
                                </label>
                                <input
                                    type="text"
                                    value={data.warna}
                                    onChange={(e) =>
                                        setData("warna", e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all duration-300"
                                    placeholder="Contoh: Hitam, Navy, Maroon"
                                />
                                {errors.warna && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.warna}
                                    </p>
                                )}
                            </div>

                            {/* Harga Sewa */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Harga Sewa (Rp){" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.harga_sewa}
                                    onChange={(e) =>
                                        setData("harga_sewa", e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all duration-300"
                                    placeholder="250000"
                                />
                                {errors.harga_sewa && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.harga_sewa}
                                    </p>
                                )}
                            </div>

                            {/* Stok */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Stok
                                </label>
                                <input
                                    type="number"
                                    value={data.stok}
                                    onChange={(e) =>
                                        setData("stok", e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all duration-300"
                                    min="1"
                                />
                                {errors.stok && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.stok}
                                    </p>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all duration-300"
                                >
                                    <option value="tersedia">Tersedia</option>
                                    <option value="disewa">Disewa</option>
                                    <option value="maintenance">
                                        Maintenance
                                    </option>
                                </select>
                                {errors.status && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.status}
                                    </p>
                                )}
                            </div>

                            {/* Gambar */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Gambar Barang
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-colors border-gray-200 hover:border-[#C5A059]">
                                    <div className="space-y-1 text-center">
                                        {previewImage ? (
                                            <div className="mb-4">
                                                <ImagePositionPicker
                                                    src={previewImage}
                                                    positionX={data.gambar_position_x}
                                                    positionY={data.gambar_position_y}
                                                />
                                            </div>
                                        ) : (
                                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        )}
                                        <div className="flex text-sm text-gray-600">
                                            <label
                                                htmlFor="gambar-upload"
                                                className="relative cursor-pointer bg-white rounded-md font-medium text-[#C5A059] hover:text-[#D4AF37] focus-within:outline-none transition-colors"
                                            >
                                                <span>Upload file baru</span>
                                                <input
                                                    id="gambar-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                            <p className="pl-1">
                                                atau drag and drop
                                            </p>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, GIF up to 2MB
                                        </p>
                                    </div>
                                </div>
                                {errors.gambar_utama && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.gambar_utama}
                                    </p>
                                )}
                            </div>

                            {/* Deskripsi */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={data.deskripsi}
                                    onChange={(e) =>
                                        setData("deskripsi", e.target.value)
                                    }
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all duration-300"
                                    placeholder="Deskripsi lengkap tentang barang..."
                                />
                                {errors.deskripsi && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.deskripsi}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                            <Link
                                href="/admin/barang"
                                className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-[#0A192F] text-white rounded-xl font-medium hover:bg-[#1E2F4A] transition-all duration-300 disabled:opacity-50"
                            >
                                {processing ? "Menyimpan..." : "Update Barang"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
