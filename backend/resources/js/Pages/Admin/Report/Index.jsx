import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ reports }) {
    const { auth } = usePage().props;
    const isSuperAdmin = auth.user?.roles?.includes('super_admin');

    const [confirmingReportDeletion, setConfirmingReportDeletion] = useState(false);
    const [reportToDelete, setReportToDelete] = useState(null);

    const confirmReportDeletion = (id) => {
        setReportToDelete(id);
        setConfirmingReportDeletion(true);
    };

    const closeModal = () => {
        setConfirmingReportDeletion(false);
        setTimeout(() => setReportToDelete(null), 200);
    };

    const deleteReport = () => {
        router.delete(route('reports.destroy', reportToDelete), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };
    const formatWaktu = (dateString) => {
        if (!dateString) return <span className="text-gray-500">-</span>;
        const date = new Date(dateString);
        
        const hari = date.toLocaleDateString('id-ID', { weekday: 'long' });
        const tanggal = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        const jam = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

        return (
            <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-1">
                    <div className="bg-indigo-100 p-1.5 rounded-md shadow-sm">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <span className="font-semibold text-gray-800 text-sm tracking-wide">{hari}</span>
                </div>
                <span className="text-gray-600 text-sm ml-[32px]">{tanggal}</span>
                <div className="flex items-center gap-1 mt-1 ml-[32px]">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs text-gray-500 font-medium bg-gray-100 px-1.5 py-0.5 rounded-full">{jam} WIB</span>
                </div>
            </div>
        );
    };

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
                                            <th className="border-b p-4">Waktu</th>
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
                                                <td className="border-b p-4 min-w-[150px]">
                                                    {formatWaktu(report.created_at)}
                                                </td>
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
                                                    <div className="flex items-center space-x-3">
                                                        <Link
                                                            href={route('reports.show', report.id)}
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            Detail
                                                        </Link>
                                                        {isSuperAdmin && (
                                                            <button
                                                                onClick={() => confirmReportDeletion(report.id)}
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
            </div>

            <Modal show={confirmingReportDeletion} onClose={closeModal}>
                <div className="p-6">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="ml-4 mt-0 text-left">
                            <h2 className="text-lg font-medium text-gray-900">
                                Hapus Laporan?
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Apakah Anda yakin ingin menghapus laporan ini beserta semua lampiran dan riwayatnya? Tindakan ini tidak dapat dibatalkan.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>

                        <DangerButton className="ml-3" onClick={deleteReport}>
                            Hapus Laporan
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
