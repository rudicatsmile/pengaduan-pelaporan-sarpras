import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function Show({ report, petugas }) {
    const { auth } = usePage().props;
    const currentUser = auth.user;
    const [selectedPetugas, setSelectedPetugas] = useState('');
    const [expectedCompletionTime, setExpectedCompletionTime] = useState('');
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [resolutionNotes, setResolutionNotes] = useState('');

    const handleVerify = () => {
        if (confirm('Verifikasi laporan ini?')) {
            router.post(route('reports.verify', report.id));
        }
    };

    const handleDelegate = (e) => {
        e.preventDefault();
        if (!selectedPetugas) return alert('Pilih petugas!');
        router.post(route('reports.delegate', report.id), {
            petugas_id: selectedPetugas,
            expected_completion_time: expectedCompletionTime
        });
    };

    const handleProcess = () => {
        if (confirm('Mulai kerjakan perbaikan ini?')) {
            router.post(route('reports.process', report.id));
        }
    };

    const handleResolve = (e) => {
        e.preventDefault();
        if (!resolutionNotes) return alert('Catatan penyelesaian wajib diisi!');
        router.post(route('reports.resolve', report.id), {
            resolution_notes: resolutionNotes
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Detail Pengaduan #{report.id}</h2>}
        >
            <Head title={`Pengaduan #${report.id}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white shadow-sm sm:rounded-lg p-6">
                            <h3 className="font-bold text-lg mb-4">Informasi Laporan</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Pelapor</p>
                                    <p className="font-medium">
                                        {report.user ? report.user.name : (report.guest_name ? `${report.guest_name} (Anonim)` : 'Anonim')}
                                    </p>
                                    {!report.user && report.guest_phone && (
                                        <p className="text-sm text-gray-500 mt-1">WA: {report.guest_phone}</p>
                                    )}
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
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {report.attachments.map((att, index) => (
                                        <img 
                                            key={att.id} 
                                            src={att.file_path} 
                                            alt="Lampiran" 
                                            className="rounded-lg w-full h-32 object-cover cursor-pointer hover:opacity-80 transition-opacity" 
                                            onClick={() => {
                                                setLightboxIndex(index);
                                                setLightboxOpen(true);
                                            }}
                                        />
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
                                        <p className="text-sm text-gray-500">
                                            {act.user ? act.user.name : 'Pengunjung (Anonim)'} - {new Date(act.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white shadow-sm sm:rounded-lg p-6">
                            <h3 className="font-bold text-lg mb-4">Aksi Admin</h3>
                            
                            {report.status === 'baru' && (
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
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Estimasi Selesai (SLA)</label>
                                        <input
                                            type="datetime-local"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            value={expectedCompletionTime}
                                            onChange={e => setExpectedCompletionTime(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-purple-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-purple-700"
                                    >
                                        Delegasikan
                                    </button>
                                </form>
                            )}

                            {report.status === 'didelegasikan' && (
                                <>
                                    {(currentUser.id === report.assigned_to || currentUser.roles?.[0]?.name === 'admin') ? (
                                        <button
                                            onClick={handleProcess}
                                            className="w-full bg-orange-500 text-white rounded-lg px-4 py-2 font-medium hover:bg-orange-600"
                                        >
                                            Mulai Kerjakan
                                        </button>
                                    ) : (
                                        <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-600">
                                            Menunggu petugas mulai mengerjakan.
                                        </div>
                                    )}
                                </>
                            )}

                            {report.status === 'dalam_proses' && (
                                <>
                                    {(currentUser.id === report.assigned_to || currentUser.roles?.[0]?.name === 'admin') ? (
                                        <form onSubmit={handleResolve} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Catatan Penyelesaian</label>
                                                <textarea
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    rows="3"
                                                    value={resolutionNotes}
                                                    onChange={e => setResolutionNotes(e.target.value)}
                                                    placeholder="Contoh: Lampu sudah diganti baru."
                                                ></textarea>
                                            </div>
                                            <button
                                                type="submit"
                                                className="w-full bg-green-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-green-700"
                                            >
                                                Selesaikan Laporan
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-600">
                                            Laporan sedang dikerjakan oleh petugas.
                                        </div>
                                    )}
                                </>
                            )}

                            {report.status === 'selesai' && (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center text-green-700 font-medium">
                                    Laporan telah selesai ditangani.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {report.attachments && report.attachments.length > 0 && (
                <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    index={lightboxIndex}
                    slides={report.attachments.map(att => ({ src: att.file_path }))}
                />
            )}
        </AuthenticatedLayout>
    );
}
