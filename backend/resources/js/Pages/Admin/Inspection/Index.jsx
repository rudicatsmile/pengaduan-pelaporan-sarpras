import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import dayjs from 'dayjs';

export default function Index({ auth, inspections }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Inspeksi Sarpras
                </h2>
            }
        >
            <Head title="Inspeksi Sarpras" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-500">
                                    <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                                        <tr>
                                            <th className="px-6 py-3">ID</th>
                                            <th className="px-6 py-3">Waktu</th>
                                            <th className="px-6 py-3">Pelapor</th>
                                            <th className="px-6 py-3">Ruangan</th>
                                            <th className="px-6 py-3">Deskripsi Singkat</th>
                                            <th className="px-6 py-3">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inspections.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-4 text-center">Belum ada inspeksi</td>
                                            </tr>
                                        ) : (
                                            inspections.map((inspection) => (
                                                <tr key={inspection.id} className="border-b bg-white">
                                                    <td className="px-6 py-4">#{inspection.id}</td>
                                                    <td className="px-6 py-4">{dayjs(inspection.created_at).format('DD MMM YYYY HH:mm')}</td>
                                                    <td className="px-6 py-4">{inspection.user?.name}</td>
                                                    <td className="px-6 py-4">{inspection.room?.name}</td>
                                                    <td className="px-6 py-4 truncate max-w-xs">{inspection.description}</td>
                                                    <td className="px-6 py-4">
                                                        <Link
                                                            href={route('inspections.show', inspection.id)}
                                                            className="text-teal-600 hover:underline"
                                                        >
                                                            Lihat Detail
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
