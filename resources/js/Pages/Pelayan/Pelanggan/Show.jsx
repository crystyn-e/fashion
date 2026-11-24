import PelayanLayout from "@/Layouts/PelayanLayout";
import { Link } from "@inertiajs/react";
import {
    ArrowLeftIcon,
    EyeIcon,
    IdentificationIcon,
    MapPinIcon,
    PhoneIcon,
    UserIcon,
} from "@heroicons/react/24/outline";

export default function PelangganShow({ pelanggan }) {
    const formatRupiah = (angka) =>
        new Intl.NumberFormat("id-ID").format(Number(angka) || 0);

    const getStatusBadge = (status) => {
        const statusStyles = {
            proses: "bg-yellow-100 text-yellow-800",
            sewa: "bg-blue-100 text-blue-800",
            selesai: "bg-green-100 text-green-800",
            batal: "bg-red-100 text-red-800",
        };
        const statusLabels = {
            proses: "Proses",
            sewa: "Sedang Disewa",
            selesai: "Selesai",
            batal: "Batal",
        };

        return (
            <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                    statusStyles[status] || "bg-gray-100 text-gray-800"
                }`}
            >
                {statusLabels[status] || status}
            </span>
        );
    };

    return (
        <PelayanLayout title={`Detail Pelanggan - ${pelanggan.nama}`}>
            <div className="py-6">
                <Link
                    href="/pelayan/pelanggan"
                    className="mb-6 inline-flex items-center text-sm text-gray-600 hover:text-[#C5A059]"
                >
                    <ArrowLeftIcon className="mr-1 h-4 w-4" />
                    Kembali ke Data Pelanggan
                </Link>

                <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {pelanggan.nama}
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Pelanggan sejak {pelanggan.created_at}
                            </p>
                        </div>
                        <div className="rounded-lg bg-[#0A192F] px-4 py-3 text-white">
                            <p className="text-xs text-gray-300">
                                Total Transaksi
                            </p>
                            <p className="text-xl font-bold">
                                {pelanggan.total_transaksi}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-start gap-3">
                            <UserIcon className="mt-0.5 h-5 w-5 text-[#C5A059]" />
                            <div>
                                <p className="text-xs text-gray-500">Nama</p>
                                <p className="font-medium text-gray-900">
                                    {pelanggan.nama}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <PhoneIcon className="mt-0.5 h-5 w-5 text-[#C5A059]" />
                            <div>
                                <p className="text-xs text-gray-500">
                                    No. Telepon
                                </p>
                                <p className="font-medium text-gray-900">
                                    {pelanggan.no_telepon || "-"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <IdentificationIcon className="mt-0.5 h-5 w-5 text-[#C5A059]" />
                            <div>
                                <p className="text-xs text-gray-500">NIK</p>
                                <p className="font-medium text-gray-900">
                                    {pelanggan.nik || "-"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPinIcon className="mt-0.5 h-5 w-5 text-[#C5A059]" />
                            <div>
                                <p className="text-xs text-gray-500">Alamat</p>
                                <p className="font-medium text-gray-900">
                                    {pelanggan.alamat || "-"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                    <div className="border-b border-gray-200 px-6 py-5">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Riwayat Transaksi
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Daftar transaksi sewa milik {pelanggan.nama}
                        </p>
                    </div>

                    {pelanggan.transaksis.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                            No
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                            Kode Transaksi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                            Tanggal Sewa
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                            Tanggal Kembali
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                            Total Harga
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {pelanggan.transaksis.map(
                                        (transaksi, index) => (
                                            <tr
                                                key={transaksi.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {index + 1}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-[#C5A059]">
                                                    {transaksi.kode_transaksi}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                    {transaksi.tgl_sewa}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                    {transaksi.tgl_kembali ||
                                                        "-"}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                                                    Rp{" "}
                                                    {formatRupiah(
                                                        transaksi.total_harga,
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    {getStatusBadge(
                                                        transaksi.status,
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                    <Link
                                                        href={`/pelayan/transaksi/${transaksi.id}`}
                                                        className="inline-flex items-center font-medium text-[#C5A059] hover:text-[#D4AF37]"
                                                    >
                                                        <EyeIcon className="mr-1 h-4 w-4" />
                                                        Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="px-6 py-12 text-center text-sm text-gray-500">
                            Pelanggan ini belum memiliki transaksi.
                        </div>
                    )}
                </div>
            </div>
        </PelayanLayout>
    );
}
