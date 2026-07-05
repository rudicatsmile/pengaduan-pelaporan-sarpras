import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import dayjs from 'dayjs';

export default function Show({ auth, inspection }) {
    const isAdmin = auth.user?.roles?.includes('admin') || auth.user?.roles?.includes('super_admin');
    
    const { data, setData, post, processing, errors } = useForm({
        notes: inspection.notes || '',
    });

    const submitNotes = (e) => {
        e.preventDefault();
        post(route('inspections.notes', inspection.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Detail Laporan Kinerja #{inspection.id}
                    </h2>
                    <Link href={route('inspections.index')} className="text-sm text-gray-500 hover:text-gray-700">
                        &larr; Kembali
                    </Link>
                </div>
            }
        >
            <Head title={`Detail Laporan Kinerja #${inspection.id}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Pelapor</h3>
                                <p className="mt-1 text-sm text-gray-900">{inspection.user?.name}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Tanggal</h3>
                                <p className="mt-1 text-sm text-gray-900">{dayjs(inspection.created_at).format('DD MMMM YYYY HH:mm')}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Ruangan</h3>
                                <p className="mt-1 text-sm text-gray-900">{inspection.room?.name} ({inspection.room?.building})</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Deskripsi</h3>
                            <div className="mt-2 text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-md border border-gray-100">
                                {inspection.description}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Galeri Foto ({inspection.images?.length || 0})</h3>
                        {(!inspection.images || inspection.images.length === 0) ? (
                            <p className="text-sm text-gray-500">Tidak ada foto terlampir.</p>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {inspection.images.map((img) => (
                                    <div key={img.id} className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                        <img 
                                            src={img.image_path} 
                                            alt="Lampiran" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/150?text=Error';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Catatan Laporan Kinerja</h3>
                        {isAdmin ? (
                            <form onSubmit={submitNotes}>
                                <textarea
                                    className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm min-h-[100px]"
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    placeholder="Tambahkan catatan untuk inspeksi ini..."
                                />
                                {errors.notes && <div className="text-red-600 mt-1 text-sm">{errors.notes}</div>}
                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                                    >
                                        Simpan Catatan
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="mt-2 text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-md border border-gray-100 min-h-[50px]">
                                {inspection.notes ? inspection.notes : <span className="text-gray-500 italic">Tidak ada catatan.</span>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
