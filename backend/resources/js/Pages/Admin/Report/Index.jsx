import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ reports }) {
    const renderLocation = (report) => {
        if (report.room) {
            const buildingName = report.room.floor?.building?.name;
            return (
                <div>
                    <div className="font-medium text-gray-900">{buildingName || 'Gedung tidak diketahui'}</div>
                    <div className="text-sm italic text-gray-500">{report.room.name}</div>
                </div>
            );
        }
        return <div className="text-gray-900">{report.location_text || '-'}</div>;
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Daftar Pengaduan</h2>}
        >
            <Head title="Daftar Pengaduan" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-full">
                                    <thead>
                                        <tr>
                                            <th className="border-b p-4">ID</th>
                                            <th className="border-b p-4">Pelapor</th>
                                            <th className="border-b p-4">Lokasi</th>
                                            <th className="border-b p-4">Kategori/Deskripsi</th>
                                            <th className="border-b p-4">Status</th>
                                            <th className="border-b p-4">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reports.map((report) => (
                                            <tr key={report.id} className="hover:bg-gray-50">
                                                <td className="border-b p-4">#{report.id}</td>
                                                <td className="border-b p-4">
                                                    <div className="font-medium text-gray-900">
                                                        {report.user ? report.user.name : (report.guest_name ? `${report.guest_name} (Anonim)` : 'Anonim')}
                                                    </div>
                                                    <div className="mt-1">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                            report.type === 'pengaduan_qr' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {report.type === 'pengaduan_qr' ? 'QR Code' : 'Umum'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="border-b p-4">
                                                    {renderLocation(report)}
                                                </td>
                                                <td className="border-b p-4">
                                                    <div className="font-medium text-gray-900">{report.category?.name || '-'}</div>
                                                    <div className="text-sm text-gray-500 truncate max-w-[200px]" title={report.description}>
                                                        {report.description}
                                                    </div>
                                                </td>
                                                <td className="border-b p-4">
                                                    <span className={`px-2 py-1 rounded text-sm ${
                                                        report.status === 'menunggu' ? 'bg-yellow-100 text-yellow-800' :
                                                        report.status === 'diverifikasi' ? 'bg-blue-100 text-blue-800' :
                                                        report.status === 'didelegasikan' ? 'bg-purple-100 text-purple-800' :
                                                        report.status === 'proses' ? 'bg-indigo-100 text-indigo-800' :
                                                        report.status === 'selesai' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {report.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="border-b p-4">
                                                    <Link
                                                        href={route('reports.show', report.id)}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                        {reports.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="text-center p-4">Tidak ada laporan</td>
                                            </tr>
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
