import PelayanLayout from "@/Layouts/PelayanLayout";
import { useForm, Link } from "@inertiajs/react";
import { useState } from "react";
import Modal from "@/Components/Modal";
import {
    ArrowLeftIcon,
    ShoppingCartIcon,
    TrashIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    CalendarIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

export default function TransaksiCreate({ barangs }) {
    const [selectedBarang, setSelectedBarang] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [dpManual, setDpManual] = useState("");
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

    // Hitung tanggal kembali otomatis (tanggal_pengambilan + 3 hari)
    const hitungTanggalKembali = (tanggal) => {
        if (!tanggal) return "";
        const date = new Date(tanggal);
        date.setDate(date.getDate() + 3);
        return date.toISOString().split("T")[0];
    };

    const { data, setData, post, processing, errors } = useForm({
        nama_pelanggan: "",
        no_telepon: "",
        alamat: "",
        tanggal_pengambilan: new Date().toISOString().split("T")[0], // Tambah field ini
        barang_ids: [],
        deposit_tipe: "uang",
        deposit_ktp: "",
        dp: 0,
    });

    // Tanggal kembali otomatis
    const tanggalKembali = hitungTanggalKembali(data.tanggal_pengambilan);

    // Filter barang yang tersedia
    const filteredBarangs = barangs.filter(
        (barang) =>
            barang.nama_barang
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            barang.kode_barang.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Hitung total harga
    const totalHarga = selectedBarang.reduce(
        (sum, item) => sum + Number(item.harga_sewa),
        0,
    );

    // Format Rupiah
    const formatRupiah = (angka) => {
        return new Intl.NumberFormat("id-ID").format(angka);
    };

    // Parse input DP
    const handleDpChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        setDpManual(value);
        setData("dp", parseInt(value) || 0);
    };

    // Hitung sisa
    const sisaPembayaran = totalHarga - (parseInt(data.dp) || 0);

    // Tambah barang
    const tambahBarang = (barang) => {
        if (!selectedBarang.find((b) => b.id === barang.id)) {
            setSelectedBarang([...selectedBarang, barang]);
            setData("barang_ids", [...data.barang_ids, barang.id]);
        }
    };

    // Hapus barang
    const hapusBarang = (id) => {
        setSelectedBarang(selectedBarang.filter((b) => b.id !== id));
        setData(
            "barang_ids",
            data.barang_ids.filter((bId) => bId !== id),
        );
    };

    // Submit
    const submit = (e) => {
        e.preventDefault();
        post("/pelayan/transaksi");
    };

    return (
        <PelayanLayout title="Transaksi Baru">
            <div className="py-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <Link
                        href="/pelayan/dashboard"
                        className="inline-flex items-center text-sm text-gray-600 hover:text-[#C5A059]"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-1" />
                        Kembali ke Dashboard
                    </Link>
                    <button
                        type="button"
                        onClick={() => setIsTransactionModalOpen(true)}
                        className="rounded-lg bg-[#0A192F] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1E2F4A]"
                    >
                        Data Transaksi ({selectedBarang.length})
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Pilih Barang */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Pilih Barang
                            </h2>

                            {/* Search Barang */}
                            <div className="relative mb-4">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari barang..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent"
                                />
                            </div>

                            {/* Grid Barang */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                                {filteredBarangs.map((barang) => (
                                    <div
                                        key={barang.id}
                                        className="flex items-center p-3 border border-gray-200 rounded-lg"
                                    >
                                        <img
                                            src={
                                                barang.gambar ||
                                                "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100&h=100&fit=crop"
                                            }
                                            alt={barang.nama_barang}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="ml-3 flex-1">
                                            <h3 className="font-semibold text-gray-800">
                                                {barang.nama_barang}
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                {barang.kategori}
                                            </p>
                                            <p className="text-sm font-bold text-[#C5A059] mt-1">
                                                Rp{" "}
                                                {formatRupiah(
                                                    barang.harga_sewa,
                                                )}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => tambahBarang(barang)}
                                            aria-label={`Tambah ${barang.nama_barang} ke data transaksi`}
                                            className="shrink-0 rounded-full p-2 text-gray-400 transition-colors hover:bg-[#C5A059]/10 hover:text-[#C5A059] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                                        >
                                            <PlusIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                <Modal
                    show={isTransactionModalOpen}
                    onClose={() => setIsTransactionModalOpen(false)}
                    maxWidth="2xl"
                >
                    <div className="max-h-[85vh] overflow-y-auto p-6">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Data Transaksi
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Lengkapi barang dan data pelanggan
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    setIsTransactionModalOpen(false)
                                }
                                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                                aria-label="Tutup data transaksi"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>

                            {/* Selected Barang Summary */}
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                    Barang Dipilih:
                                </p>
                                {selectedBarang.length > 0 ? (
                                    selectedBarang.map((barang) => (
                                        <div
                                            key={barang.id}
                                            className="flex items-center justify-between text-sm mb-1"
                                        >
                                            <span>{barang.nama_barang}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[#C5A059] font-medium">
                                                    Rp{" "}
                                                    {formatRupiah(
                                                        barang.harga_sewa,
                                                    )}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        hapusBarang(barang.id)
                                                    }
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 italic">
                                        Belum ada barang
                                    </p>
                                )}
                            </div>

                            {/* Total Harga */}
                            <div className="bg-[#0A192F] text-white p-4 rounded-lg mb-4">
                                <p className="text-sm opacity-80">
                                    Total Harga
                                </p>
                                <p className="text-2xl font-bold">
                                    Rp {formatRupiah(totalHarga)}
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={submit} className="space-y-4">
                                {/* Data Pelanggan */}
                                <div className="border-b border-gray-200 pb-4">
                                    <h3 className="font-medium text-gray-700 mb-3">
                                        Data Pelanggan
                                    </h3>

                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nama Pelanggan{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.nama_pelanggan}
                                            onChange={(e) =>
                                                setData(
                                                    "nama_pelanggan",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                                            placeholder="Masukkan nama pelanggan"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            No. Telepon{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.no_telepon}
                                            onChange={(e) =>
                                                setData(
                                                    "no_telepon",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                                            placeholder="Contoh: 08123456789"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Alamat (Opsional)
                                        </label>
                                        <textarea
                                            value={data.alamat}
                                            onChange={(e) =>
                                                setData(
                                                    "alamat",
                                                    e.target.value,
                                                )
                                            }
                                            rows="2"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                                            placeholder="Masukkan alamat"
                                        />
                                    </div>
                                </div>

                                {/* Tanggal Pengambilan - FIELD BARU */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tanggal Pengambilan{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="date"
                                            value={data.tanggal_pengambilan}
                                            onChange={(e) =>
                                                setData(
                                                    "tanggal_pengambilan",
                                                    e.target.value,
                                                )
                                            }
                                            min={
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                                            required
                                        />
                                    </div>
                                    <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                                        <p className="text-xs text-blue-700">
                                            <span className="font-semibold">
                                                Tanggal Kembali:
                                            </span>{" "}
                                            {tanggalKembali
                                                ? new Date(
                                                      tanggalKembali,
                                                  ).toLocaleDateString(
                                                      "id-ID",
                                                      {
                                                          day: "numeric",
                                                          month: "long",
                                                          year: "numeric",
                                                      },
                                                  )
                                                : "-"}{" "}
                                            (+3 hari)
                                        </p>
                                    </div>
                                </div>

                                {/* Deposit */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Deposit
                                    </label>
                                    <select
                                        value={data.deposit_tipe}
                                        onChange={(e) =>
                                            setData(
                                                "deposit_tipe",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                                    >
                                        <option value="uang">
                                            Deposit Uang
                                        </option>
                                        <option value="ktp">Deposit KTP</option>
                                    </select>
                                </div>

                                {/* No KTP */}
                                {data.deposit_tipe === "ktp" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            No. KTP{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.deposit_ktp}
                                            onChange={(e) =>
                                                setData(
                                                    "deposit_ktp",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                                            placeholder="Masukkan No. KTP"
                                            required={
                                                data.deposit_tipe === "ktp"
                                            }
                                        />
                                    </div>
                                )}

                                {/* DP Manual */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        DP (Uang Muka)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            Rp
                                        </span>
                                        <input
                                            type="text"
                                            value={
                                                dpManual
                                                    ? formatRupiah(dpManual)
                                                    : ""
                                            }
                                            onChange={handleDpChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                                            placeholder="Masukkan DP"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Minimal 50%: Rp{" "}
                                        {formatRupiah(
                                            Math.floor(totalHarga / 2),
                                        )}
                                    </p>
                                </div>

                                {/* Ringkasan */}
                                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Total:</span>
                                        <span className="font-semibold">
                                            Rp {formatRupiah(totalHarga)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm text-[#C5A059]">
                                        <span>DP:</span>
                                        <span className="font-semibold">
                                            Rp {formatRupiah(data.dp || 0)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-2">
                                        <span>Sisa:</span>
                                        <span
                                            className={
                                                sisaPembayaran < 0
                                                    ? "text-red-600"
                                                    : ""
                                            }
                                        >
                                            Rp{" "}
                                            {formatRupiah(
                                                Math.max(0, sisaPembayaran),
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        selectedBarang.length === 0 ||
                                        !data.nama_pelanggan ||
                                        !data.no_telepon ||
                                        !data.tanggal_pengambilan ||
                                        parseInt(data.dp) > totalHarga
                                    }
                                    className="w-full px-4 py-3 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#0A192F] rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing
                                        ? "Memproses..."
                                        : "Proses Transaksi"}
                                </button>
                            </form>
                    </div>
                </Modal>
            </div>
        </PelayanLayout>
    );
}
