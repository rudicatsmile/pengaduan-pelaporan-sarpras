import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
// using native HTML/CSS for simple charts to avoid external dependencies right now.

export default function AnalyticsIndex({ monthlyTrend, statusBreakdown, categoryBreakdown }) {
    // For a simple visualization, we can use flex bars
    const maxStatus = Math.max(...statusBreakdown.map(s => s.total), 1);
    const maxCategory = Math.max(...categoryBreakdown.map(c => c.total), 1);

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Analitik & Laporan</h2>}
        >
            <Head title="Analitik & Laporan" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">Ekspor Data Laporan</h3>
                            <p className="text-sm text-gray-600">Unduh seluruh data laporan beserta riwayat penanganan ke dalam format CSV/Excel.</p>
                        </div>
                        <a 
                            href={route('analytics.export')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Download CSV
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Status Breakdown */}
                        <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                            <h3 className="font-bold text-lg mb-4">Laporan Berdasarkan Status</h3>
                            <div className="space-y-4">
                                {statusBreakdown.map((item, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium uppercase">{item.status}</span>
                                            <span className="text-sm text-gray-600">{item.total} laporan</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(item.total / maxStatus) * 100}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Category Breakdown */}
                        <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                            <h3 className="font-bold text-lg mb-4">Laporan Berdasarkan Kategori</h3>
                            <div className="space-y-4">
                                {categoryBreakdown.map((item, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium">{item.category}</span>
                                            <span className="text-sm text-gray-600">{item.total} laporan</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${(item.total / maxCategory) * 100}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Monthly Trend */}
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <h3 className="font-bold text-lg mb-4">Tren Laporan Bulanan (6 Bulan Terakhir)</h3>
                        <div className="flex items-end space-x-2 h-48 border-b border-l border-gray-200 p-2">
                            {monthlyTrend.length === 0 ? (
                                <div className="text-center w-full text-gray-500">Belum ada data bulanan.</div>
                            ) : (
                                monthlyTrend.map((item, idx) => {
                                    const maxMonth = Math.max(...monthlyTrend.map(m => m.total), 1);
                                    const height = `${(item.total / maxMonth) * 100}%`;
                                    return (
                                        <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end group">
                                            <div className="bg-indigo-500 w-full max-w-[40px] rounded-t-sm relative group-hover:bg-indigo-600 transition-colors" style={{ height }}>
                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700 opacity-0 group-hover:opacity-100">{item.total}</div>
                                            </div>
                                            <span className="text-xs text-gray-600 mt-2 rotate-45 md:rotate-0 origin-left">{item.month}</span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
