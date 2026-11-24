import PelayanLayout from "@/Layouts/PelayanLayout";
import { Link, router } from "@inertiajs/react";
import {
    ArrowLeftIcon,
    PrinterIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowPathIcon,
} from "@heroicons/react/24/outline";

export default function TransaksiShow({ transaksi, auth }) {
    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const formatDateTime = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat("id-ID").format(angka || 0);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "proses":
                return (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        Proses (Menunggu Ambil)
                    </span>
                );
            case "sewa":
                return (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Sedang Disewa
                    </span>
                );
            case "selesai":
                return (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Selesai
                    </span>
                );
            case "batal":
                return (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                        Batal
                    </span>
                );
            default:
                return null;
        }
    };

    const handleBatalkan = () => {
        if (confirm("Yakin ingin membatalkan transaksi ini? DP akan hangus.")) {
            router.delete(`/pelayan/transaksi/${transaksi.id}/batal`);
        }
    };

    const handleAmbilBarang = () => {
        if (confirm("Konfirmasi bahwa barang sudah diambil pelanggan?")) {
            router.put(`/pelayan/transaksi/${transaksi.id}/ambil`);
        }
    };

    const handlePrint = () => {
        const receipt = document.querySelector(".receipt-print");
        const receiptStyles = document.getElementById("receipt-print-styles");

        if (!receipt || !receiptStyles) {
            window.alert("Konten bon tidak ditemukan.");
            return;
        }

        const printFrame = document.createElement("iframe");
        printFrame.title = "Tampilan cetak bon";
        printFrame.style.position = "fixed";
        printFrame.style.width = "0";
        printFrame.style.height = "0";
        printFrame.style.border = "0";
        printFrame.setAttribute("aria-hidden", "true");
        document.body.appendChild(printFrame);

        const printDocument = printFrame.contentDocument;
        const printWindow = printFrame.contentWindow;

        if (!printDocument || !printWindow) {
            printFrame.remove();
            window.alert("Tampilan cetak bon tidak dapat dibuka.");
            return;
        }

        printWindow.onafterprint = () => printFrame.remove();
        printDocument.open();
        printDocument.write(
            '<!DOCTYPE html><html><head><meta charset="utf-8"><title></title></head><body></body></html>',
        );
        printDocument.close();

        const style = printDocument.createElement("style");
        style.textContent = `${receiptStyles.textContent}
            @page {
                size: A4 landscape;
                margin: 0;
            }

            html,
            body {
                width: 297mm;
                margin: 0;
                padding: 0;
                background: #fff;
            }
        `;
        printDocument.head.appendChild(style);

        const receiptClone = receipt.cloneNode(true);
        receiptClone.classList.remove("hidden");
        printDocument.body.appendChild(receiptClone);

        const startPrint = () => {
            printWindow.focus();
            printWindow.print();
        };
        const logo = printDocument.querySelector("img");

        if (logo && !logo.complete) {
            logo.onload = startPrint;
            logo.onerror = startPrint;
        } else {
            printWindow.requestAnimationFrame(() =>
                printWindow.requestAnimationFrame(startPrint),
            );
        }
    };

    return (
        <PelayanLayout title={`Detail Transaksi - ${transaksi.kode_transaksi}`}>
            <div className="py-6">
                {/* Back Button */}
                <Link
                    href="/pelayan/transaksi"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-[#C5A059] mb-6"
                >
                    <ArrowLeftIcon className="w-4 h-4 mr-1" />
                    Kembali ke Daftar Sewa
                </Link>

                {/* Header Card */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {transaksi.kode_transaksi}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Dibuat pada{" "}
                                {formatDateTime(transaksi.created_at)}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {getStatusBadge(transaksi.status)}
                            <button
                                onClick={handlePrint}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                            >
                                <PrinterIcon className="w-4 h-4 mr-2" />
                                Cetak Bon
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Info Pelanggan */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Informasi Pelanggan
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Nama</p>
                                <p className="font-medium">
                                    {transaksi.pelanggan.nama}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    No. Telepon
                                </p>
                                <p className="font-medium">
                                    {transaksi.pelanggan.no_telepon || "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Alamat</p>
                                <p className="font-medium">
                                    {transaksi.pelanggan.alamat || "-"}
                                </p>
                            </div>
                            {transaksi.deposit_tipe === "ktp" && (
                                <div>
                                    <p className="text-sm text-gray-500">
                                        No. KTP (Deposit)
                                    </p>
                                    <p className="font-medium">
                                        {transaksi.deposit_ktp}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info Sewa */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Informasi Sewa
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Tanggal Sewa
                                </p>
                                <p className="font-medium">
                                    {formatDate(transaksi.tgl_sewa)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Tanggal Harus Kembali
                                </p>
                                <p className="font-medium">
                                    {formatDate(transaksi.tgl_harus_kembali)}
                                </p>
                            </div>
                            {transaksi.tgl_kembali && (
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Tanggal Kembali
                                    </p>
                                    <p className="font-medium">
                                        {formatDate(transaksi.tgl_kembali)}
                                    </p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-gray-500">Deposit</p>
                                <p className="font-medium capitalize">
                                    {transaksi.deposit_tipe === "uang"
                                        ? "Uang"
                                        : "KTP"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Info Pembayaran */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Informasi Pembayaran
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <p className="text-sm text-gray-500">
                                    Total Harga
                                </p>
                                <p className="font-bold">
                                    Rp {formatRupiah(transaksi.total_harga)}
                                </p>
                            </div>
                            <div className="flex justify-between text-[#C5A059]">
                                <p className="text-sm">DP</p>
                                <p className="font-bold">
                                    Rp {formatRupiah(transaksi.dp)}
                                </p>
                            </div>
                            <div className="flex justify-between border-t border-gray-200 pt-2">
                                <p className="text-sm text-gray-500">Sisa</p>
                                <p className="font-bold">
                                    Rp {formatRupiah(transaksi.sisa_pembayaran)}
                                </p>
                            </div>
                            {transaksi.denda > 0 && (
                                <div className="flex justify-between text-red-600">
                                    <p className="text-sm">Denda</p>
                                    <p className="font-bold">
                                        Rp {formatRupiah(transaksi.denda)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Daftar Barang */}
                <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Daftar Barang
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                        No
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                        Barang
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                        Kategori
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                        Ukuran
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                        Harga
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                        Status Kembali
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {transaksi.detail_transaksis.map(
                                    (detail, index) => (
                                        <tr key={detail.id}>
                                            <td className="px-4 py-2 text-sm text-gray-500">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-2 text-sm font-medium text-gray-900">
                                                {detail.barang.nama_barang}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-gray-500">
                                                {detail.barang.kategori
                                                    ?.nama_kategori || "-"}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-gray-500">
                                                {detail.barang.ukuran || "-"}
                                            </td>
                                            <td className="px-4 py-2 text-sm font-semibold text-[#C5A059]">
                                                Rp{" "}
                                                {formatRupiah(
                                                    detail.harga_sewa,
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-sm">
                                                {detail.status_kembali ===
                                                "sudah" ? (
                                                    <span className="flex items-center text-green-600">
                                                        <CheckCircleIcon className="w-4 h-4 mr-1" />
                                                        Sudah Kembali
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center text-yellow-600">
                                                        <XCircleIcon className="w-4 h-4 mr-1" />
                                                        Belum Kembali
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tombol Aksi */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                    {transaksi.status === "proses" && (
                        <>
                            <button
                                onClick={handleAmbilBarang}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                            >
                                <CheckCircleIcon className="w-5 h-5 mr-2" />
                                Barang Sudah Diambil
                            </button>

                            <button
                                onClick={handleBatalkan}
                                className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                            >
                                <XCircleIcon className="w-5 h-5 mr-2" />
                                Batalkan Transaksi
                            </button>
                        </>
                    )}

                    {transaksi.status === "sewa" && (
                        <Link
                            href={`/pelayan/pengembalian/${transaksi.id}`}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                        >
                            <ArrowPathIcon className="w-5 h-5 mr-2" />
                            Proses Pengembalian
                        </Link>
                    )}

                    {transaksi.status === "selesai" && (
                        <div className="px-6 py-3 bg-green-100 text-green-800 rounded-lg font-medium flex items-center justify-center">
                            <CheckCircleIcon className="w-5 h-5 mr-2" />
                            Transaksi Selesai
                        </div>
                    )}

                    {transaksi.status === "batal" && (
                        <div className="px-6 py-3 bg-red-100 text-red-800 rounded-lg font-medium flex items-center justify-center">
                            <XCircleIcon className="w-5 h-5 mr-2" />
                            Transaksi Dibatalkan
                        </div>
                    )}
                </div>

                <style id="receipt-print-styles">{`
                    .receipt-print {
                        display: block;
                        position: relative;
                        width: 100%;
                        background: #fff;
                    }

                    .receipt-print.hidden {
                        display: none !important;
                    }

                    .bon-container {
                        box-sizing: border-box;
                        display: grid;
                        grid-template-columns: 1.2fr 1fr 1fr;
                        grid-template-areas:
                            "header header header"
                            "transaction customer rental"
                            "items items items"
                            "footer footer payment"
                            "staff staff payment";
                        gap: 4mm 6mm;
                        width: 100%;
                        max-width: 277mm;
                        min-height: 190mm;
                        margin: 10mm auto !important;
                        padding: 0 !important;
                        color: #252525;
                        background: #fff;
                        font-family: Arial, sans-serif;
                        font-size: 9pt;
                        line-height: 1.35;
                    }

                    .bon-container > div {
                        min-width: 0;
                        margin: 0 !important;
                        padding: 3mm !important;
                        border: 1px solid #d5c5c0 !important;
                        text-align: left !important;
                    }

                    .receipt-header {
                        grid-area: header;
                        display: flex !important;
                        justify-content: space-between;
                        align-items: flex-start;
                        gap: 8mm;
                        border: 0 !important;
                        border-bottom: 2px solid #8b3d32 !important;
                        padding: 0 0 4mm !important;
                    }

                    .receipt-brand {
                        display: flex;
                        align-items: center;
                        gap: 4mm;
                    }

                    .receipt-brand img {
                        width: 22mm;
                        height: 18mm;
                        object-fit: contain;
                    }

                    .receipt-document {
                        text-align: right !important;
                    }

                    .receipt-transaction {
                        grid-area: transaction;
                    }

                    .receipt-customer {
                        grid-area: customer;
                    }

                    .receipt-rental {
                        grid-area: rental;
                    }

                    .receipt-items {
                        grid-area: items;
                        padding: 0 !important;
                        border: 0 !important;
                    }

                    .receipt-items table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    .receipt-items th,
                    .receipt-items td {
                        border: 1px solid #8b3d32 !important;
                        padding: 2mm 3mm !important;
                    }

                    .receipt-items th {
                        color: #6f3028;
                        background: #f8f2f0 !important;
                        text-align: left !important;
                    }

                    .receipt-items .receipt-number,
                    .receipt-items .receipt-price,
                    .receipt-items .receipt-amount {
                        text-align: right !important;
                    }

                    .receipt-payment {
                        grid-area: payment;
                        align-self: stretch;
                    }

                    .receipt-footer {
                        grid-area: footer;
                        border: 0 !important;
                        border-top: 1px solid #8b3d32 !important;
                        padding: 3mm 0 0 !important;
                    }

                    .receipt-staff {
                        grid-area: staff;
                        align-self: end;
                        border: 0 !important;
                        padding: 0 !important;
                        text-align: center !important;
                    }
                `}</style>

                {/* ========== BON SEWA BOESA FASHION (Untuk Print) ========== */}
                <div className="hidden receipt-print">
                    <div
                        className="bon-container"
                        style={{
                            width: "100%",
                            margin: "0 auto",
                            padding: "0",
                            fontFamily: "Arial, sans-serif",
                            fontSize: "12px",
                            lineHeight: "1.35",
                            color: "#000",
                            backgroundColor: "#fff",
                        }}
                    >
                        {/* Header Bon */}
                        <div
                            className="receipt-header"
                            style={{
                                borderBottom: "2px solid #8b3d32",
                                paddingBottom: "12px",
                            }}
                        >
                            <div className="receipt-brand">
                                <img
                                    src="/images/logo-boesafashion.jpg"
                                    alt="Logo Boesa Fashion"
                                    style={{
                                        width: "22mm",
                                        height: "18mm",
                                        objectFit: "contain",
                                    }}
                                />
                                <div>
                                    <h2
                                        style={{
                                            fontSize: "22px",
                                            fontWeight: "bold",
                                            margin: "0 0 4px",
                                            color: "#8b3d32",
                                        }}
                                    >
                                        BOESA FASHION
                                    </h2>
                                    <p style={{ margin: "2px 0" }}>
                                        Foto Studio / Penyewaan Busana
                                    </p>
                                    <p style={{ margin: "2px 0" }}>
                                        Jalan DI. Panjaitan No. 39 Medan
                                    </p>
                                    <p style={{ margin: "2px 0" }}>
                                        Telp: +62 822-7650-4245
                                    </p>
                                </div>
                            </div>
                            <div className="receipt-document">
                                <p
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "bold",
                                        margin: "0 0 6px",
                                        color: "#8b3d32",
                                    }}
                                >
                                    BUKTI SEWA
                                </p>
                                <p style={{ margin: "3px 0" }}>
                                    Medan, {formatDate(new Date())}
                                </p>
                                <p style={{ margin: "3px 0" }}>
                                    Kepada Yth. {transaksi.pelanggan.nama}
                                </p>
                            </div>
                        </div>

                        {/* Info Transaksi */}
                        <div
                            className="receipt-transaction"
                            style={{
                                marginBottom: "8px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <span>No. Transaksi:</span>
                                <span style={{ fontWeight: "bold" }}>
                                    {transaksi.kode_transaksi}
                                </span>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <span>Tanggal:</span>
                                <span>
                                    {formatDateTime(transaksi.created_at)}
                                </span>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <span>Status:</span>
                                <span
                                    style={{
                                        fontWeight: "bold",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {transaksi.status}
                                </span>
                            </div>
                        </div>

                        {/* Data Pelanggan */}
                        <div
                            className="receipt-customer"
                            style={{
                                marginBottom: "8px",
                            }}
                        >
                            <p
                                style={{
                                    fontWeight: "bold",
                                    margin: "0 0 4px 0",
                                }}
                            >
                                DATA PELANGGAN
                            </p>
                            <div>Nama: {transaksi.pelanggan.nama}</div>
                            <div>
                                Telepon: {transaksi.pelanggan.no_telepon || "-"}
                            </div>
                            <div>
                                Alamat: {transaksi.pelanggan.alamat || "-"}
                            </div>
                            {transaksi.deposit_tipe === "ktp" && (
                                <div>No. KTP: {transaksi.deposit_ktp}</div>
                            )}
                        </div>

                        {/* Info Sewa */}
                        <div
                            className="receipt-rental"
                            style={{
                                marginBottom: "8px",
                            }}
                        >
                            <p
                                style={{
                                    fontWeight: "bold",
                                    margin: "0 0 4px 0",
                                }}
                            >
                                INFO SEWA
                            </p>
                            <div>
                                Tgl Ambil: {formatDate(transaksi.tgl_sewa)}
                            </div>
                            <div>
                                Tgl Kembali:{" "}
                                {formatDate(transaksi.tgl_harus_kembali)}
                            </div>
                            <div>
                                Deposit:{" "}
                                {transaksi.deposit_tipe === "uang"
                                    ? "UANG"
                                    : "KTP"}
                            </div>
                        </div>

                        {/* Detail Barang */}
                        <div
                            className="receipt-items"
                            style={{
                                marginBottom: "8px",
                            }}
                        >
                            <p
                                style={{
                                    fontWeight: "bold",
                                    margin: "0 0 4px 0",
                                }}
                            >
                                DETAIL BARANG
                            </p>
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                }}
                            >
                                <thead>
                                    <tr
                                        style={{
                                            borderBottom: "1px dotted #000",
                                        }}
                                    >
                                        <th>Banyaknya</th>
                                        <th>Nama Barang</th>
                                        <th
                                            style={{
                                                textAlign: "right",
                                            }}
                                        >
                                            Harga
                                        </th>
                                        <th
                                            style={{
                                                textAlign: "right",
                                            }}
                                        >
                                            Jumlah
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transaksi.detail_transaksis.map(
                                        (detail, idx) => (
                                            <tr key={idx}>
                                                <td className="receipt-number">
                                                    1
                                                </td>
                                                <td>
                                                    {detail.barang.nama_barang}
                                                </td>
                                                <td className="receipt-price">
                                                    Rp{" "}
                                                    {formatRupiah(
                                                        detail.harga_sewa,
                                                    )}
                                                </td>
                                                <td className="receipt-amount">
                                                    Rp{" "}
                                                    {formatRupiah(
                                                        detail.harga_sewa,
                                                    )}
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pembayaran */}
                        <div
                            className="receipt-payment"
                            style={{
                                marginBottom: "8px",
                            }}
                        >
                            <p
                                style={{
                                    fontWeight: "bold",
                                    margin: "0 0 4px 0",
                                }}
                            >
                                PEMBAYARAN
                            </p>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <span>Total Sewa:</span>
                                <span>
                                    Rp {formatRupiah(transaksi.total_harga)}
                                </span>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <span>DP (Uang Muka):</span>
                                <span>Rp {formatRupiah(transaksi.dp)}</span>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    borderTop: "1px dotted #000",
                                    marginTop: "4px",
                                    paddingTop: "4px",
                                }}
                            >
                                <span style={{ fontWeight: "bold" }}>
                                    Sisa Pembayaran:
                                </span>
                                <span style={{ fontWeight: "bold" }}>
                                    Rp {formatRupiah(transaksi.sisa_pembayaran)}
                                </span>
                            </div>
                            {transaksi.denda > 0 && (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        color: "red",
                                    }}
                                >
                                    <span>Denda:</span>
                                    <span>
                                        Rp {formatRupiah(transaksi.denda)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* DILAYANI OLEH */}
                        <div
                            className="receipt-staff"
                            style={{
                                marginBottom: "8px",
                            }}
                        >
                            <p
                                style={{
                                    fontWeight: "bold",
                                    margin: "0 0 4px 0",
                                }}
                            >
                                DILAYANI OLEH
                            </p>
                            <div>Nama: {auth?.user?.nama_lengkap || "-"}</div>
                            <div>ID Staff: {auth?.user?.username || "-"}</div>
                        </div>

                        {/* Footer */}
                        <div
                            className="receipt-footer"
                            style={{ marginTop: "8px", paddingTop: "6px" }}
                        >
                            <p style={{ fontSize: "9px", margin: "2px 0" }}>
                                Terima kasih atas kepercayaan Anda
                            </p>
                            <p style={{ fontSize: "9px", margin: "2px 0" }}>
                                Barang yang sudah disewa tidak dapat
                                dikembalikan
                            </p>
                            <p style={{ fontSize: "9px", margin: "2px 0" }}>
                                dan DP tidak dapat ditarik kembali.
                            </p>
                            <div
                                style={{
                                    borderTop: "2px dashed #000",
                                    marginTop: "8px",
                                    paddingTop: "6px",
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: "10px",
                                        fontWeight: "bold",
                                        margin: "0",
                                    }}
                                >
                                    STUDIO BOESA FASHION
                                </p>
                                <p
                                    style={{
                                        fontSize: "9px",
                                        margin: "2px 0 0 0",
                                    }}
                                >
                                    Fashion Sewa Premium
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PelayanLayout>
    );
}
