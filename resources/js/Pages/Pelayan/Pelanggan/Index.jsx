import PelayanLayout from "@/Layouts/PelayanLayout";
import { Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import Modal from "@/Components/Modal";
import {
    MagnifyingGlassIcon,
    UserPlusIcon,
    EyeIcon,
    PhoneIcon,
    IdentificationIcon,
} from "@heroicons/react/24/outline";

export default function PelangganIndex({ pelanggans }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        nama: "",
        no_telepon: "",
        nik: "",
        alamat: "",
    });

    const search = (e) => {
        e.preventDefault();
        router.get(
            "/pelayan/pelanggan",
            { search: searchTerm },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const closeCreateModal = () => {
        if (processing) return;
        setShowCreateModal(false);
        reset();
        clearErrors();
    };

    const submitCreateForm = (e) => {
        e.preventDefault();
        post("/pelayan/pelanggan", {
            onSuccess: () => {
                setShowCreateModal(false);
                reset();
                clearErrors();
            },
        });
    };

    return (
        <PelayanLayout title="Data Pelanggan">
            <div className="py-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Data Pelanggan
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Daftar pelanggan yang pernah melakukan transaksi
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowCreateModal(true)}
                        className="px-4 py-2 bg-[#C5A059] text-[#0A192F] rounded-lg font-medium hover:bg-[#D4AF37] transition-colors flex items-center"
                    >
                        <UserPlusIcon className="w-5 h-5 mr-2" />
                        Tambah Pelanggan
                    </button>
                </div>

                {/* Search */}
                <form onSubmit={search} className="mb-6">
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan nama, no telepon, atau NIK..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cari
                        </button>
                    </div>
                </form>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        No
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Nama
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        No. Telepon
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        NIK
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Alamat
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Total Transaksi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {pelanggans.data.map((pelanggan, index) => (
                                    <tr
                                        key={pelanggan.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {pelanggans.from + index}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {pelanggan.nama}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600 flex items-center">
                                                <PhoneIcon className="w-4 h-4 mr-1 text-gray-400" />
                                                {pelanggan.no_telepon || "-"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600 flex items-center">
                                                <IdentificationIcon className="w-4 h-4 mr-1 text-gray-400" />
                                                {pelanggan.nik || "-"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {pelanggan.alamat || "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {pelanggan.total_transaksi}x
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <Link
                                                href={`/pelayan/pelanggan/${pelanggan.id}`}
                                                className="text-[#C5A059] hover:text-[#D4AF37] font-medium flex items-center"
                                            >
                                                <EyeIcon className="w-4 h-4 mr-1" />
                                                Detail
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pelanggans.links && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Menampilkan {pelanggans.from} -{" "}
                                    {pelanggans.to} dari {pelanggans.total} data
                                </div>
                                <div className="flex space-x-2">
                                    {pelanggans.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || "#"}
                                            className={`px-3 py-1 rounded-md text-sm ${
                                                link.active
                                                    ? "bg-[#C5A059] text-[#0A192F] font-semibold"
                                                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-300"
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Modal
                show={showCreateModal}
                onClose={closeCreateModal}
                closeable={!processing}
                maxWidth="lg"
            >
                <form onSubmit={submitCreateForm} className="p-6">
                    <h3 className="mb-5 text-lg font-semibold text-gray-900">
                        Tambah Pelanggan
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="nama"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Nama <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="nama"
                                type="text"
                                value={data.nama}
                                onChange={(e) =>
                                    setData("nama", e.target.value)
                                }
                                maxLength={100}
                                required
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#C5A059] focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                            />
                            {errors.nama && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.nama}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="no_telepon"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                No. Telepon
                            </label>
                            <input
                                id="no_telepon"
                                type="tel"
                                value={data.no_telepon}
                                onChange={(e) =>
                                    setData("no_telepon", e.target.value)
                                }
                                maxLength={15}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#C5A059] focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                            />
                            {errors.no_telepon && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.no_telepon}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="nik"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                NIK
                            </label>
                            <input
                                id="nik"
                                type="text"
                                value={data.nik}
                                onChange={(e) =>
                                    setData("nik", e.target.value)
                                }
                                maxLength={20}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#C5A059] focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                            />
                            {errors.nik && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.nik}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="alamat"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Alamat
                            </label>
                            <textarea
                                id="alamat"
                                value={data.alamat}
                                onChange={(e) =>
                                    setData("alamat", e.target.value)
                                }
                                rows={3}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#C5A059] focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                            />
                            {errors.alamat && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.alamat}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeCreateModal}
                            disabled={processing}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-[#0A192F] px-4 py-2 text-white transition-colors hover:bg-[#1E2F4A] disabled:opacity-50"
                        >
                            {processing ? "Menyimpan..." : "Simpan Pelanggan"}
                        </button>
                    </div>
                </form>
            </Modal>
        </PelayanLayout>
    );
}
