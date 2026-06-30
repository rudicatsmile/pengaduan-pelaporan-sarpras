import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ stats }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard Admin
                </h2>
            }
        >
            <Head title="Dashboard Admin" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-6 bg-white shadow-sm sm:rounded-lg">
                            <h3 className="text-gray-500">Total Laporan</h3>
                            <p className="text-3xl font-bold">{stats.total}</p>
                        </div>
                        <div className="p-6 bg-white shadow-sm sm:rounded-lg">
                            <h3 className="text-gray-500">Menunggu Verifikasi</h3>
                            <p className="text-3xl font-bold text-yellow-600">{stats.menunggu}</p>
                        </div>
                        <div className="p-6 bg-white shadow-sm sm:rounded-lg">
                            <h3 className="text-gray-500">Sedang Diproses</h3>
                            <p className="text-3xl font-bold text-blue-600">{stats.proses}</p>
                        </div>
                        <div className="p-6 bg-white shadow-sm sm:rounded-lg">
                            <h3 className="text-gray-500">Selesai</h3>
                            <p className="text-3xl font-bold text-green-600">{stats.selesai}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
