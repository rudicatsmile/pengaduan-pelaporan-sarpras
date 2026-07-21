import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PerformanceRekapDrawer({ isOpen, onClose, filters }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterJobCategory, setFilterJobCategory] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchRekap();
        }
    }, [isOpen, filters]);

    const fetchRekap = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {};
            if (filters.start_date) params.start_date = filters.start_date;
            if (filters.end_date) params.end_date = filters.end_date;

            const response = await axios.get(route('inspections.rekap'), { params });
            setData(response.data);
        } catch (err) {
            setError('Gagal memuat data rekap kinerja.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const jobCategories = [...new Set(data.map(u => u.job_category))].filter(Boolean).sort();

    const filteredData = data.filter(u => {
        let matchStatus = true;
        if (filterStatus === 'reported') matchStatus = u.has_reported;
        if (filterStatus === 'unreported') matchStatus = !u.has_reported;
        
        let matchCategory = true;
        if (filterJobCategory !== '') matchCategory = u.job_category === filterJobCategory;

        return matchStatus && matchCategory;
    });

    const reportedCount = filteredData.filter(u => u.has_reported).length;
    const totalCount = filteredData.length;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                onClick={onClose}
                aria-hidden="true"
            ></div>

            <div className="fixed inset-y-0 right-0 max-w-full flex">
                <div className="w-screen max-w-md transform transition ease-in-out duration-500 sm:duration-700">
                    <div className="h-full flex flex-col bg-white shadow-xl">
                        {/* Header */}
                        <div className="px-4 py-6 sm:px-6 bg-indigo-600">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium text-white" id="slide-over-title">
                                    Rekap Kinerja Petugas
                                </h2>
                                <div className="ml-3 h-7 flex items-center">
                                    <button 
                                        type="button" 
                                        className="bg-indigo-600 rounded-md text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white" 
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">Tutup panel</span>
                                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="mt-1">
                                <p className="text-sm text-indigo-200">
                                    {filters.start_date || 'Semua Waktu'} 
                                    {filters.end_date && filters.end_date !== filters.start_date ? ` s/d ${filters.end_date}` : ''}
                                </p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="relative flex-1 px-4 py-6 sm:px-6 overflow-y-auto">
                            {loading ? (
                                <div className="flex justify-center items-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                </div>
                            ) : error ? (
                                <div className="text-center text-red-500">{error}</div>
                            ) : (
                                <div>
                                    <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-100 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Telah Melapor</p>
                                            <p className="text-2xl font-bold text-gray-900">{reportedCount} <span className="text-sm font-normal text-gray-500">/ {totalCount} Petugas</span></p>
                                        </div>
                                        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                            <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Segmented Control Filter */}
                                    <div className="mb-6 flex p-1 space-x-1 bg-gray-100/80 rounded-xl">
                                        <button
                                            onClick={() => setFilterStatus('all')}
                                            className={`w-full rounded-lg py-2 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2 transition-colors ${filterStatus === 'all' ? 'bg-white text-indigo-700 shadow' : 'text-gray-500 hover:bg-white/[0.12] hover:text-gray-700'}`}
                                        >
                                            Semua
                                        </button>
                                        <button
                                            onClick={() => setFilterStatus('reported')}
                                            className={`w-full rounded-lg py-2 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-green-400 focus:outline-none focus:ring-2 transition-colors ${filterStatus === 'reported' ? 'bg-white text-green-700 shadow' : 'text-gray-500 hover:bg-white/[0.12] hover:text-gray-700'}`}
                                        >
                                            Sudah Lapor
                                        </button>
                                        <button
                                            onClick={() => setFilterStatus('unreported')}
                                            className={`w-full rounded-lg py-2 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-red-400 focus:outline-none focus:ring-2 transition-colors ${filterStatus === 'unreported' ? 'bg-white text-red-700 shadow' : 'text-gray-500 hover:bg-white/[0.12] hover:text-gray-700'}`}
                                        >
                                            Belum Lapor
                                        </button>
                                    </div>

                                    {/* Job Category Filter Dropdown */}
                                    <div className="mb-6">
                                        <select
                                            value={filterJobCategory}
                                            onChange={(e) => setFilterJobCategory(e.target.value)}
                                            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 bg-white shadow-sm"
                                        >
                                            <option value="">Semua Kategori Jabatan</option>
                                            {jobCategories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <ul className="divide-y divide-gray-200">
                                        {filteredData.map((user) => (
                                            <li key={user.id} className="py-4 flex items-center justify-between">
                                                <div className="flex items-center">
                                                    {user.avatar ? (
                                                        <img className="h-10 w-10 rounded-full object-cover" src={`/storage/${user.avatar}`} alt="" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                        <p className="text-xs text-gray-500">{user.job_category}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    {user.has_reported ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                            Sudah Lapor
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                            Belum Lapor
                                                        </span>
                                                    )}
                                                    {user.report_count > 0 && (
                                                        <span className="text-[10px] text-gray-400 mt-1">{user.report_count} Laporan</span>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                        {filteredData.length === 0 && (
                                            <li className="py-4 text-center text-gray-500 text-sm">Tidak ada data petugas.</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
