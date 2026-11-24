import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function LaporanTransaksi({ transaksis = [], filters = {} }) {
    const [startDate, setStartDate] = useState(filters.start_date || "");
    const [endDate, setEndDate] = useState(filters.end_date || "");
    const [status, setStatus] = useState(filters.status || "");

    const applyFilters = () => {
        router.get(
            "/admin/laporan/transaksi",
            {
                start_date: startDate,
                end_date: endDate,
                status: status,
            },
            { preserveState: true },
        );
    };

    const exportPdf = () => {
        const params = new URLSearchParams({
            start_date: startDate,
            end_date: endDate,
            status,
        });
        window.open(
            `/admin/laporan/transaksi/export-pdf?${params.toString()}`,
            "_blank",
        );
    };

    const resetFilters = () => {
        setStartDate("");
        setEndDate("");
        setStatus("");
        router.get("/admin/laporan/transaksi", {}, { preserveState: true });
    };

    const filtered = transaksis;

    // Fungsi format Rupiah
    const formatRupiah = (nilai) => {
        if (nilai === null || nilai === undefined) return "0";
        let angka = typeof nilai === "number" ? nilai : parseFloat(nilai);
        if (isNaN(angka)) angka = 0;
        return angka.toLocaleString("id-ID");
    };

    // Hitung total
    let total = 0;
    let totalDenda = 0;
    for (let i = 0; i < filtered.length; i++) {
        let harga = filtered[i].total_harga;
        let denda = filtered[i].denda;
        total =
            total +
            (typeof harga === "number" ? harga : parseFloat(harga) || 0);
        totalDenda =
            totalDenda +
            (typeof denda === "number" ? denda : parseFloat(denda) || 0);
    }

    return (
        <AdminLayout title="Laporan Transaksi">
            <div className="p-6">
                <Link
                    href="/admin/laporan"
                    className="text-[#C5A059] hover:underline mb-4 inline-block"
                >
                    ← Kembali
                </Link>

                <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Laporan Transaksi
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Filter dan export data transaksi
                        </p>
                    </div>
                    <div>
                        <button
                            onClick={exportPdf}
                            className="bg-[#C5A059] text-[#0A192F] px-4 py-2 rounded-lg hover:bg-[#D4AF37] transition-all duration-300 shadow-sm"
                        >
                            Export PDF
                        </button>
                    </div>
                </div>

                {/* Filter */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all duration-300"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all duration-300"
                        />
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all duration-300"
                        >
                            <option value="">Semua Status</option>
                            <option value="proses">Proses</option>
                            <option value="sewa">Disewa</option>
                            <option value="selesai">Selesai</option>
                            <option value="batal">Batal</option>
                        </select>
                        <div className="flex gap-2">
                            <button
                                onClick={applyFilters}
                                className="bg-[#C5A059] text-[#0A192F] px-4 py-2 rounded-lg hover:bg-[#D4AF37] transition-all duration-300"
                            >
                                Filter
                            </button>
                            <button
                                onClick={resetFilters}
                                className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-300"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 text-center">
                        <p className="text-gray-500 text-sm">Total Transaksi</p>
                        <p className="text-2xl font-bold text-gray-800">
                            {filtered.length}
                        </p>
                    </div>
                    <div className="bg-[#0A192F] rounded-lg shadow-sm p-5 text-center text-white">
                        <p className="text-sm opacity-80">Total Pendapatan</p>
                        <p className="text-2xl font-bold">
                            Rp {formatRupiah(total)}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 text-center">
                        <p className="text-gray-500 text-sm">Total Denda</p>
                        <p className="text-2xl font-bold text-red-600">
                            Rp {formatRupiah(totalDenda)}
                        </p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                                        Pelanggan
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Tgl Sewa
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Tgl Kembali
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Total
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        DP
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Denda
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filtered.map((t, i) => (
                                    <tr
                                        key={t.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {i + 1}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-[#C5A059] font-mono">
                                            {t.kode_transaksi}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {t.pelanggan}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {t.tgl_sewa}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {t.tgl_kembali || "-"}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            Rp {formatRupiah(t.total_harga)}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            Rp {formatRupiah(t.dp)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-red-600">
                                            Rp {formatRupiah(t.denda)}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    t.status === "selesai"
                                                        ? "bg-green-100 text-green-700"
                                                        : t.status === "sewa"
                                                          ? "bg-blue-100 text-blue-700"
                                                          : t.status ===
                                                              "proses"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {t.status === "selesai"
                                                    ? "Selesai"
                                                    : t.status === "sewa"
                                                      ? "Disewa"
                                                      : t.status === "proses"
                                                        ? "Proses"
                                                        : "Batal"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-10 text-gray-500">
                            Tidak ada data transaksi
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
