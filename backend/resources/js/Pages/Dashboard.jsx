import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';

export default function Dashboard({ stats }) {
    const { auth, app_settings } = usePage().props;
    const isSuperAdmin = auth.user.roles?.includes('super_admin');

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
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
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

                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Identitas Aplikasi</h3>
                            {isSuperAdmin && (
                                <Link
                                    href={route('settings.index')}
                                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Kelola Pengaturan
                                </Link>
                            )}
                        </div>
                        <div className="flex items-start gap-6">
                            {app_settings?.app_logo ? (
                                <img src={app_settings.app_logo} alt="Logo" className="w-24 h-24 object-contain border p-2 rounded-lg" />
                            ) : (
                                <div className="w-24 h-24 bg-gray-100 flex items-center justify-center border rounded-lg text-gray-400">
                                    No Logo
                                </div>
                            )}
                            <div className="space-y-2">
                                <div>
                                    <span className="block text-sm text-gray-500">Nama Aplikasi</span>
                                    <span className="font-semibold text-lg">{app_settings?.app_name}</span>
                                </div>
                                <div>
                                    <span className="block text-sm text-gray-500">Nama Pemilik</span>
                                    <span className="font-semibold">{app_settings?.owner_name || '-'}</span>
                                </div>
                                <div className="flex gap-4">
                                    <div>
                                        <span className="block text-sm text-gray-500">Telepon</span>
                                        <span className="font-semibold">{app_settings?.owner_phone || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="block text-sm text-gray-500">Email</span>
                                        <span className="font-semibold">{app_settings?.owner_email || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
