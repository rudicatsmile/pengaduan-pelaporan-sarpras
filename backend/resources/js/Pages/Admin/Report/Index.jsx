import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ reports }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Daftar Laporan</h2>}
        >
            <Head title="Daftar Laporan" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border-b p-4">ID</th>
                                        <th className="border-b p-4">Pelapor</th>
                                        <th className="border-b p-4">Tipe</th>
                                        <th className="border-b p-4">Ruangan/Lokasi</th>
                                        <th className="border-b p-4">Kategori</th>
                                        <th className="border-b p-4">Status</th>
                                        <th className="border-b p-4">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map((report) => (
                                        <tr key={report.id} className="hover:bg-gray-50">
                                            <td className="border-b p-4">#{report.id}</td>
                                            <td className="border-b p-4">{report.user?.name}</td>
                                            <td className="border-b p-4">
                                                {report.type === 'pengaduan_qr' ? 'QR Code' : 'Umum'}
                                            </td>
                                            <td className="border-b p-4">
                                                {report.room ? report.room.name : (report.location_text || '-')}
                                            </td>
                                            <td className="border-b p-4">{report.category?.name}</td>
                                            <td className="border-b p-4">
                                                <span className={`px-2 py-1 rounded text-sm ${
                                                    report.status === 'menunggu' ? 'bg-yellow-100 text-yellow-800' :
                                                    report.status === 'diverifikasi' ? 'bg-blue-100 text-blue-800' :
                                                    report.status === 'didelegasikan' ? 'bg-purple-100 text-purple-800' :
                                                    report.status === 'proses' ? 'bg-indigo-100 text-indigo-800' :
                                                    report.status === 'selesai' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {report.status}
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
                                            <td colSpan="7" className="text-center p-4">Tidak ada laporan</td>
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
