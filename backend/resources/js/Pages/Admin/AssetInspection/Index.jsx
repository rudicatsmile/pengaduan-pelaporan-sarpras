import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';

export default function Index({ auth, inspections }) {
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Inspeksi Aset
                    </h2>
                    <Link
                        href={route('asset-inspections.create')}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        Buat Inspeksi Baru
                    </Link>
                </div>
            }
        >
            <Head title="Inspeksi Aset" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 rounded-md bg-green-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-green-800">{flash.success}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-500">
                                    <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                                        <tr>
                                            <th className="px-6 py-3">ID</th>
                                            <th className="px-6 py-3">Waktu Inspeksi</th>
                                            <th className="px-6 py-3">Petugas</th>
                                            <th className="px-6 py-3">Ruangan</th>
                                            <th className="px-6 py-3">Lokasi (Lantai / Gedung)</th>
                                            <th className="px-6 py-3 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inspections.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-4 text-center">Belum ada inspeksi aset</td>
                                            </tr>
                                        ) : (
                                            inspections.map((inspection) => (
                                                <tr key={inspection.id} className="border-b bg-white">
                                                    <td className="px-6 py-4">#{inspection.id}</td>
                                                    <td className="px-6 py-4">{dayjs(inspection.created_at).format('DD MMM YYYY HH:mm')}</td>
                                                    <td className="px-6 py-4">{inspection.user?.name}</td>
                                                    <td className="px-6 py-4">{inspection.room?.name}</td>
                                                    <td className="px-6 py-4">
                                                        {inspection.room?.floor?.name} / {inspection.room?.floor?.building?.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <Link
                                                            href={route('asset-inspections.show', inspection.id)}
                                                            className="text-indigo-600 hover:text-indigo-900 mx-2"
                                                            title="Lihat Detail"
                                                        >
                                                            <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                            </svg>
                                                        </Link>
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
