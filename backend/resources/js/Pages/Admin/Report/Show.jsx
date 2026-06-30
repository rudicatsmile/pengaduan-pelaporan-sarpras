import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ report, petugas }) {
    const [selectedPetugas, setSelectedPetugas] = useState('');

    const handleVerify = () => {
        if (confirm('Verifikasi laporan ini?')) {
            router.post(route('reports.verify', report.id));
        }
    };

    const handleDelegate = (e) => {
        e.preventDefault();
        if (!selectedPetugas) return alert('Pilih petugas!');
        router.post(route('reports.delegate', report.id), {
            petugas_id: selectedPetugas
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Detail Laporan #{report.id}</h2>}
        >
            <Head title={`Laporan #${report.id}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white shadow-sm sm:rounded-lg p-6">
                            <h3 className="font-bold text-lg mb-4">Informasi Laporan</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Pelapor</p>
                                    <p className="font-medium">{report.user?.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <p className="font-medium uppercase text-blue-600">{report.status}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Kategori</p>
                                    <p className="font-medium">{report.category?.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Ruangan/Lokasi</p>
                                    <p className="font-medium">{report.room ? report.room.name : report.location_text}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-500">Deskripsi</p>
                                    <p className="font-medium">{report.description}</p>
                                </div>
                            </div>
                        </div>

                        {report.attachments && report.attachments.length > 0 && (
                            <div className="bg-white shadow-sm sm:rounded-lg p-6">
                                <h3 className="font-bold text-lg mb-4">Lampiran Foto</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {report.attachments.map(att => (
                                        <img key={att.id} src={att.file_path} alt="Lampiran" className="rounded-lg w-full h-auto" />
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <div className="bg-white shadow-sm sm:rounded-lg p-6">
                            <h3 className="font-bold text-lg mb-4">Riwayat Aktivitas</h3>
                            <div className="space-y-4">
                                {report.activities?.map(act => (
                                    <div key={act.id} className="border-l-4 border-blue-500 pl-4 py-1">
                                        <p className="font-medium">{act.action}</p>
                                        <p className="text-sm text-gray-500">{act.user?.name} - {new Date(act.created_at).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white shadow-sm sm:rounded-lg p-6">
                            <h3 className="font-bold text-lg mb-4">Aksi Admin</h3>
                            
                            {report.status === 'menunggu' && (
                                <button
                                    onClick={handleVerify}
                                    className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700"
                                >
                                    Verifikasi Laporan
                                </button>
                            )}

                            {report.status === 'diverifikasi' && (
                                <form onSubmit={handleDelegate} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Pilih Petugas</label>
                                        <select
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            value={selectedPetugas}
                                            onChange={e => setSelectedPetugas(e.target.value)}
                                        >
                                            <option value="">-- Pilih --</option>
                                            {petugas.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-purple-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-purple-700"
                                    >
                                        Delegasikan
                                    </button>
                                </form>
                            )}

                            {['didelegasikan', 'proses', 'selesai'].includes(report.status) && (
                                <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-600">
                                    Tidak ada aksi tersedia untuk status saat ini.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
