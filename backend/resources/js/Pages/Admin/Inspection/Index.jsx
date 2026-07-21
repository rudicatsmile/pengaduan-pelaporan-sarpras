import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import dayjs from 'dayjs';
import Pagination from '@/Components/Pagination';
import PerPageSelector from '@/Components/PerPageSelector';
import PerformanceRekapDrawer from '@/Components/PerformanceRekapDrawer';

export default function Index({ auth, inspections, buildings = [], jobCategories = [], filters = {} }) {
    const isSuperAdmin = auth.user.roles?.includes('super_admin');
    const [isRekapOpen, setIsRekapOpen] = useState(false);

    const handleFilterChange = (key, value) => {
        router.get(
            route('inspections.index'),
            { ...filters, [key]: value },
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
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Laporan Kinerja
                    </h2>
                    <button
                        onClick={() => setIsRekapOpen(true)}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 shadow-sm"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Rekap Kinerja
                    </button>
                </div>
            }
        >
            <Head title="Laporan Kinerja" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-4 flex flex-wrap gap-4 items-end">
                                <div className="w-64">
                                    <label htmlFor="building_filter" className="block text-sm font-medium text-gray-700 mb-1">
                                        Filter Gedung
                                    </label>
                                    <select
                                        id="building_filter"
                                        className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        value={filters.building_id || ''}
                                        onChange={(e) => handleFilterChange('building_id', e.target.value)}
                                    >
                                        <option value="">Semua Gedung</option>
                                        {buildings.map((building) => (
                                            <option key={building.id} value={building.id}>
                                                {building.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-64">
                                    <label htmlFor="job_category_filter" className="block text-sm font-medium text-gray-700 mb-1">
                                        Filter Kategori Jabatan
                                    </label>
                                    <select
                                        id="job_category_filter"
                                        className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        value={filters.job_category_id || ''}
                                        onChange={(e) => handleFilterChange('job_category_id', e.target.value)}
                                    >
                                        <option value="">Semua Jabatan</option>
                                        {jobCategories.map((jc) => (
                                            <option key={jc.id} value={jc.id}>
                                                {jc.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-end gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50/50 relative ml-auto">
                                    <span className="absolute -top-2.5 left-3 bg-white px-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider border border-gray-100 rounded">
                                        Filter Rentang Waktu
                                    </span>
                                    <div className="w-36">
                                        <label htmlFor="start_date_filter" className="block text-xs font-medium text-gray-500 mb-1">
                                            Dari Tanggal
                                        </label>
                                        <input
                                            type="date"
                                            id="start_date_filter"
                                            className="block w-full rounded-md border-gray-300 py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                            value={filters.start_date || ''}
                                            onChange={(e) => handleFilterChange('start_date', e.target.value)}
                                        />
                                    </div>
                                    <div className="w-36">
                                        <label htmlFor="end_date_filter" className="block text-xs font-medium text-gray-500 mb-1">
                                            Sampai Tanggal
                                        </label>
                                        <input
                                            type="date"
                                            id="end_date_filter"
                                            className="block w-full rounded-md border-gray-300 py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                            value={filters.end_date || ''}
                                            onChange={(e) => handleFilterChange('end_date', e.target.value)}
                                        />
                                    </div>
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
                                        {inspections.data.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-4 text-center">Belum ada inspeksi</td>
                                            </tr>
                                        ) : (
                                            inspections.data.map((inspection) => (
                                                <tr key={inspection.id} className="border-b bg-white">
                                                    <td className="px-6 py-4">#{inspection.id}</td>
                                                    <td className="px-6 py-4">{dayjs(inspection.created_at).format('DD MMM YYYY HH:mm')}</td>
                                                    <td className="px-6 py-4">{inspection.user?.name}</td>
                                                    <td className="px-6 py-4">{inspection.room?.name}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col items-start gap-1">
                                                            {Number(inspection.is_read) === 1 ? (
                                                                <>
                                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                                        Sudah Dibaca
                                                                    </span>
                                                                    {inspection.read_by && (
                                                                        <div className="flex items-center gap-1.5 mt-1 ml-1">
                                                                            <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                                                                                {inspection.read_by.name.charAt(0).toUpperCase()}
                                                                            </div>
                                                                            <span className="text-xs text-gray-500 font-medium">
                                                                                {inspection.read_by.name}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                                    Belum Dibaca
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 truncate max-w-xs">{inspection.description}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-3">
                                                            <Link
                                                                href={route('inspections.show', inspection.id)}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 hover:text-teal-800 hover:border-teal-300 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
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
                            <div className="flex items-center justify-between mt-6 mb-4">
                                <div className="flex-1">
                                    <PerPageSelector 
                                        value={filters.per_page || 10} 
                                        onChange={(val) => handleFilterChange('per_page', val)} 
                                    />
                                </div>
                                <div className="flex-1 flex justify-center">
                                    <Pagination links={inspections.links} />
                                </div>
                                <div className="flex-1"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PerformanceRekapDrawer 
                isOpen={isRekapOpen} 
                onClose={() => setIsRekapOpen(false)} 
                filters={filters} 
            />
        </AuthenticatedLayout>
    );
}
