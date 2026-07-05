import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, inspection }) {
    const room = inspection.room || {};
    const floor = room.floor || {};
    const building = floor.building || {};
    const user = inspection.user || {};
    const details = inspection.details || [];

    const formattedDate = new Date(inspection.created_at).toLocaleString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Rincian Inspeksi Aset</h2>}
        >
            <Head title="Rincian Inspeksi Aset" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Header Info */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Inspeksi</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Ruangan</p>
                                        <p className="font-semibold">{room.name || 'Tanpa Ruangan'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Gedung / Lantai</p>
                                        <p className="font-semibold">
                                            {building.name || '-'} / {floor.name || '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Tanggal Inspeksi</p>
                                        <p className="font-semibold">{formattedDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Petugas</p>
                                        <p className="font-semibold">{user.name || '-'}</p>
                                    </div>
                                </div>
                            </div>
                            <Link
                                href={route('asset-inspections.index')}
                                className="inline-flex items-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-300 focus:outline-none focus:border-gray-400 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                            >
                                Kembali
                            </Link>
                        </div>
                        
                        {inspection.notes && (
                            <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700 font-bold">Catatan Umum:</p>
                                        <p className="text-sm text-yellow-700 mt-1 italic">{inspection.notes}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Details Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Daftar Aset</h3>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 border">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                            No
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                            Nama Aset
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                            Kondisi
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                            Catatan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {details.length > 0 ? (
                                        details.map((item, index) => {
                                            const isPresent = item.is_present == 1 || item.is_present == true;
                                            return (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 border-b">
                                                        {item.asset_name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm border-b">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            isPresent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {isPresent ? 'Ada' : 'Tidak Ada'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-b">
                                                        {isPresent && item.condition ? (
                                                            <span className="capitalize">{item.condition}</span>
                                                        ) : (
                                                            '-'
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 italic border-b">
                                                        {item.notes || '-'}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                Tidak ada rincian aset.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
