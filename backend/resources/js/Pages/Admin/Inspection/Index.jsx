import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import dayjs from 'dayjs';

export default function Index({ auth, inspections, buildings = [], filters = {} }) {
    const isSuperAdmin = auth.user.roles?.includes('super_admin');

    const handleFilterChange = (e) => {
        router.get(
            route('inspections.index'),
            { building_id: e.target.value },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus baris ini?')) {
            router.delete(route('inspections.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Laporan Kinerja
                </h2>
            }
        >
            <Head title="Laporan Kinerja" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-4 flex justify-between items-end">
                                <div className="w-64">
                                    <label htmlFor="building_filter" className="block text-sm font-medium text-gray-700 mb-1">
                                        Filter Gedung
                                    </label>
                                    <select
                                        id="building_filter"
                                        className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        value={filters.building_id || ''}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">Semua Gedung</option>
                                        {buildings.map((building) => (
                                            <option key={building.id} value={building.id}>
                                                {building.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-500">
                                    <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                                        <tr>
                                            <th className="px-6 py-3">ID</th>
                                            <th className="px-6 py-3">Waktu</th>
                                            <th className="px-6 py-3">Pelapor</th>
                                            <th className="px-6 py-3">Ruangan</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Deskripsi Singkat</th>
                                            <th className="px-6 py-3">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inspections.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-4 text-center">Belum ada inspeksi</td>
                                            </tr>
                                        ) : (
                                            inspections.map((inspection) => (
                                                <tr key={inspection.id} className="border-b bg-white">
                                                    <td className="px-6 py-4">#{inspection.id}</td>
                                                    <td className="px-6 py-4">{dayjs(inspection.created_at).format('DD MMM YYYY HH:mm')}</td>
                                                    <td className="px-6 py-4">{inspection.user?.name}</td>
                                                    <td className="px-6 py-4">{inspection.room?.name}</td>
                                                    <td className="px-6 py-4">
                                                        {Number(inspection.is_read) === 1 ? (
                                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                                Sudah Dibaca
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                                                Belum Dibaca
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 truncate max-w-xs">{inspection.description}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-3">
                                                            <Link
                                                                href={route('inspections.show', inspection.id)}
                                                                className="text-teal-600 hover:underline"
                                                            >
                                                                Lihat Detail
                                                            </Link>
                                                            {isSuperAdmin && (
                                                                <button
                                                                    onClick={() => handleDelete(inspection.id)}
                                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                                    title="Hapus"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
