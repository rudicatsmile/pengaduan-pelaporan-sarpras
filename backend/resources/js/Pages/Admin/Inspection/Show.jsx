import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import dayjs from 'dayjs';

export default function Show({ auth, inspection }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Detail Inspeksi #{inspection.id}
                    </h2>
                    <Link href={route('inspections.index')} className="text-sm text-gray-500 hover:text-gray-700">
                        &larr; Kembali
                    </Link>
                </div>
            }
        >
            <Head title={`Detail Inspeksi #${inspection.id}`} />

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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
