import AdminLayout from "@/Layouts/AdminLayout";
import { Link } from "@inertiajs/react";
import { useState } from "react";

export default function LaporanBarang({ barangs = [] }) {
    const [search, setSearch] = useState("");
    const [kategori, setKategori] = useState("");
    const [status, setStatus] = useState("");

    // Ambil kategori unik
    const kategoris = [];
    for (let i = 0; i < barangs.length; i++) {
        const kat = barangs[i].kategori;
        if (kat && !kategoris.includes(kat)) {
            kategoris.push(kat);
        }
    }

    // Filter barang
    let filtered = [];
    for (let i = 0; i < barangs.length; i++) {
        const b = barangs[i];
        let match = true;

        if (
            search &&
            !b.nama_barang.toLowerCase().includes(search.toLowerCase())
        ) {
            match = false;
        }
        if (match && kategori && b.kategori !== kategori) {
            match = false;
        }
        if (match && status && b.status !== status) {
            match = false;
        }

        if (match) {
            filtered.push(b);
        }
    }

    // Hitung statistik
    let totalPendapatan = 0;
    let totalTersedia = 0;
    let totalDisewa = 0;

    for (let i = 0; i < filtered.length; i++) {
        totalPendapatan = totalPendapatan + (filtered[i].total_pendapatan || 0);
        if (filtered[i].status === "tersedia") totalTersedia++;
        if (filtered[i].status === "disewa") totalDisewa++;
    }

    const exportPdf = () => {
        const params = new URLSearchParams({ search, kategori, status });
        window.open(
            `/admin/laporan/barang/export-pdf?${params.toString()}`,
            "_blank",
        );
    };

    const resetFilters = () => {
        setSearch("");
        setKategori("");
        setStatus("");
    };

    const formatRupiah = (nilai) => {
        let angka = typeof nilai === "number" ? nilai : parseFloat(nilai);
        if (isNaN(angka)) angka = 0;
        return angka.toLocaleString("id-ID");
    };

    const getStatusBadge = (status) => {
        if (status === "tersedia") {
            return (
                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                    Tersedia
                </span>
            );
        }
        if (status === "disewa") {
            return (
                <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                    Disewa
                </span>
            );
        }
        return (
            <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                Maintenance
            </span>
        );
    };

    return (
        <AdminLayout title="Laporan Barang">
            <div className="p-6">
                <Link
                    href="/admin/laporan"
                    className="text-[#C5A059] hover:underline mb-4 inline-block"
                >
                    ← Kembali
                </Link>

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Laporan Barang
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Statistik koleksi barang
                        </p>
                    </div>
                    <button
                        onClick={exportPdf}
                        className="rounded-lg bg-[#C5A059] px-4 py-2 text-[#0A192F] shadow-sm transition-all duration-300 hover:bg-[#D4AF37]"
                    >
                        Export PDF
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
                        <p className="text-gray-500 text-sm">Total Barang</p>
                        <p className="text-2xl font-bold text-gray-800">
                            {filtered.length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
                        <p className="text-gray-500 text-sm">Tersedia</p>
                        <p className="text-2xl font-bold text-green-600">
                            {totalTersedia}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
                        <p className="text-gray-500 text-sm">Disewa</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {totalDisewa}
                        </p>
                    </div>
                </div>

                {/* Revenue Card - Navy solid */}
                <div className="bg-[#0A192F] rounded-xl p-5 text-white mb-6 shadow-md">
                    <p className="text-sm opacity-80">
                        Total Pendapatan dari Sewa
                    </p>
                    <p className="text-3xl font-bold">
                        Rp {formatRupiah(totalPendapatan)}
                    </p>
                </div>

                {/* Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Cari barang..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all duration-300"
                        />
                        <select
                            value={kategori}
                            onChange={(e) => setKategori(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all duration-300"
                        >
                            <option value="">Semua Kategori</option>
                            {kategoris.map((k, i) => (
                                <option key={i} value={k}>
                                    {k}
                                </option>
                            ))}
                        </select>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all duration-300"
                        >
                            <option value="">Semua Status</option>
                            <option value="tersedia">Tersedia</option>
                            <option value="disewa">Disewa</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                        <button
                            onClick={resetFilters}
                            className="bg-gray-100 rounded-lg px-4 py-2 hover:bg-gray-200 transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#0A192F] text-white">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        No
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Kode
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Nama Barang
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Kategori
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Harga
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Stok
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Total Disewa
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Pendapatan
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filtered.map((b, i) => (
                                    <tr
                                        key={b.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {i + 1}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-mono text-gray-600">
                                            {b.kode_barang}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                            {b.nama_barang}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {b.kategori}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-[#C5A059] font-semibold">
                                            Rp {formatRupiah(b.harga_sewa)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {b.stok}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-blue-600 font-semibold">
                                            {b.total_disewa || 0}x
                                        </td>
                                        <td className="px-4 py-3 text-sm text-green-600">
                                            Rp{" "}
                                            {formatRupiah(
                                                b.total_pendapatan || 0,
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {getStatusBadge(b.status)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-10 text-gray-500">
                            Tidak ada data barang
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
