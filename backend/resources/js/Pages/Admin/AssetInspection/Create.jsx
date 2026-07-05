import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Create({ auth, buildings }) {
    const { flash } = usePage().props;
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [selectedFloor, setSelectedFloor] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');
    
    const [floors, setFloors] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [assetsList, setAssetsList] = useState([]);
    const [loadingAssets, setLoadingAssets] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        room_id: '',
        assets: []
    });

    useEffect(() => {
        if (selectedBuilding) {
            const building = buildings.find(b => b.id === parseInt(selectedBuilding));
            setFloors(building ? building.floors : []);
            setSelectedFloor('');
            setSelectedRoom('');
            setRooms([]);
            setAssetsList([]);
        } else {
            setFloors([]);
            setSelectedFloor('');
            setSelectedRoom('');
            setRooms([]);
            setAssetsList([]);
        }
    }, [selectedBuilding, buildings]);

    useEffect(() => {
        if (selectedFloor) {
            const floor = floors.find(f => f.id === parseInt(selectedFloor));
            setRooms(floor ? floor.rooms : []);
            setSelectedRoom('');
            setAssetsList([]);
        } else {
            setRooms([]);
            setSelectedRoom('');
            setAssetsList([]);
        }
    }, [selectedFloor, floors]);

    useEffect(() => {
        if (selectedRoom) {
            setData('room_id', selectedRoom);
            fetchAssets(selectedRoom);
        } else {
            setData('room_id', '');
            setAssetsList([]);
        }
    }, [selectedRoom]);

    const fetchAssets = async (roomId) => {
        setLoadingAssets(true);
        setErrorMsg('');
        try {
            const response = await axios.get(route('asset-inspections.get-assets'), {
                params: { room_id: roomId }
            });
            const fetchedAssets = response.data.map(asset => ({
                asset_id: asset.IDT.toString(),
                asset_name: asset.Nm_Aset,
                is_present: true,
                condition: 'baik',
                notes: ''
            }));
            setAssetsList(fetchedAssets);
            setData('assets', fetchedAssets);
        } catch (error) {
            console.error(error);
            setErrorMsg('Gagal mengambil data aset dari server.');
            setAssetsList([]);
            setData('assets', []);
        } finally {
            setLoadingAssets(false);
        }
    };

    const handleAssetChange = (index, field, value) => {
        const newAssets = [...data.assets];
        if (field === 'is_present') {
            newAssets[index][field] = value === 'true';
        } else {
            newAssets[index][field] = value;
        }
        setData('assets', newAssets);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('asset-inspections.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Buat Inspeksi Aset Baru
                </h2>
            }
        >
            <Head title="Buat Inspeksi Aset" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 rounded-md bg-green-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-green-800">{flash.success}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800">{flash.error}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit}>
                                {/* Dropdowns */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Gedung</label>
                                        <select
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            value={selectedBuilding}
                                            onChange={(e) => setSelectedBuilding(e.target.value)}
                                        >
                                            <option value="">-- Pilih Gedung --</option>
                                            {buildings.map(b => (
                                                <option key={b.id} value={b.id}>{b.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Lantai</label>
                                        <select
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            value={selectedFloor}
                                            onChange={(e) => setSelectedFloor(e.target.value)}
                                            disabled={!selectedBuilding}
                                        >
                                            <option value="">-- Pilih Lantai --</option>
                                            {floors.map(f => (
                                                <option key={f.id} value={f.id}>{f.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Ruangan</label>
                                        <select
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            value={selectedRoom}
                                            onChange={(e) => setSelectedRoom(e.target.value)}
                                            disabled={!selectedFloor}
                                        >
                                            <option value="">-- Pilih Ruangan --</option>
                                            {rooms.map(r => (
                                                <option key={r.id} value={r.id}>{r.name}</option>
                                            ))}
                                        </select>
                                        {errors.room_id && <div className="text-red-500 text-sm mt-1">{errors.room_id}</div>}
                                    </div>
                                </div>

                                {loadingAssets && <div className="text-center py-4">Memuat data aset...</div>}
                                {errorMsg && <div className="text-red-500 py-2">{errorMsg}</div>}

                                {selectedRoom && !loadingAssets && assetsList.length === 0 && !errorMsg && (
                                    <div className="text-center py-4 text-gray-500">Tidak ada aset di ruangan ini.</div>
                                )}

                                {assetsList.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Daftar Aset</h3>
                                        {errors.assets && <div className="text-red-500 text-sm mb-4">{errors.assets}</div>}
                                        
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IDT</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Aset</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keberadaan</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kondisi</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catatan</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {data.assets.map((asset, index) => (
                                                        <tr key={asset.asset_id}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.asset_id}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">{asset.asset_name}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center space-x-4">
                                                                    <label className="inline-flex items-center">
                                                                        <input
                                                                            type="radio"
                                                                            className="form-radio text-indigo-600"
                                                                            name={`present_${asset.asset_id}`}
                                                                            value="true"
                                                                            checked={asset.is_present === true}
                                                                            onChange={(e) => handleAssetChange(index, 'is_present', e.target.value)}
                                                                        />
                                                                        <span className="ml-2 text-sm text-gray-700">Ada</span>
                                                                    </label>
                                                                    <label className="inline-flex items-center">
                                                                        <input
                                                                            type="radio"
                                                                            className="form-radio text-indigo-600"
                                                                            name={`present_${asset.asset_id}`}
                                                                            value="false"
                                                                            checked={asset.is_present === false}
                                                                            onChange={(e) => handleAssetChange(index, 'is_present', e.target.value)}
                                                                        />
                                                                        <span className="ml-2 text-sm text-gray-700">Tidak Ada</span>
                                                                    </label>
                                                                </div>
                                                                {errors[`assets.${index}.is_present`] && <div className="text-red-500 text-xs mt-1">{errors[`assets.${index}.is_present`]}</div>}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <select
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                                    value={asset.condition}
                                                                    onChange={(e) => handleAssetChange(index, 'condition', e.target.value)}
                                                                    disabled={!asset.is_present}
                                                                >
                                                                    <option value="baik">Baik</option>
                                                                    <option value="rusak">Rusak</option>
                                                                </select>
                                                                {errors[`assets.${index}.condition`] && <div className="text-red-500 text-xs mt-1">{errors[`assets.${index}.condition`]}</div>}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <input
                                                                    type="text"
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                                    placeholder="Catatan..."
                                                                    value={asset.notes}
                                                                    onChange={(e) => handleAssetChange(index, 'notes', e.target.value)}
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="mt-6">
                                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Catatan Umum (Opsional)</label>
                                            <textarea
                                                id="notes"
                                                rows="3"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                placeholder="Tambahkan catatan umum terkait ruangan/aset di sini..."
                                                value={data.notes || ''}
                                                onChange={(e) => setData('notes', e.target.value)}
                                            ></textarea>
                                            {errors.notes && <div className="text-red-500 text-xs mt-1">{errors.notes}</div>}
                                        </div>

                                        <div className="mt-6 flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                            >
                                                {processing ? 'Menyimpan...' : 'Simpan Inspeksi'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
