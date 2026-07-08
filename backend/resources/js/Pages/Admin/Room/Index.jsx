import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Dropdown from '@/Components/Dropdown';

export default function Index({ rooms, buildings, officers, filters }) {
    const { delete: destroy } = useForm();

    const [selectedBuilding, setSelectedBuilding] = useState(filters?.building_id || '');
    const [selectedFloor, setSelectedFloor] = useState(filters?.floor_id || '');

    const selectedBuildingObj = buildings.find(b => b.id.toString() === selectedBuilding.toString());
    const floors = selectedBuildingObj ? selectedBuildingObj.floors : [];

    const handleBuildingChange = (e) => {
        const buildingId = e.target.value;
        setSelectedBuilding(buildingId);
        setSelectedFloor('');

        router.get(route('rooms.index'), { building_id: buildingId, floor_id: '' }, {
            preserveState: true,
            replace: true
        });
    };

    const handleFloorChange = (e) => {
        const floorId = e.target.value;
        setSelectedFloor(floorId);

        router.get(route('rooms.index'), { building_id: selectedBuilding, floor_id: floorId }, {
            preserveState: true,
            replace: true
        });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus ruangan ini?')) {
            destroy(route('rooms.destroy', id));
        }
    };

    // Modal Edit State & Logic
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editBuildingId, setEditBuildingId] = useState('');
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        id: '',
        name: '',
        floor_id: '',
        room_type: 'general',
        inspection_interval: 3,
        assigned_users: [],
    });

    const handleEditClick = (room) => {
        setEditBuildingId(room.floor?.building_id || '');
        setData({
            id: room.id,
            name: room.name,
            floor_id: room.floor_id || '',
            room_type: room.room_type || 'general',
            inspection_interval: room.inspection_interval || 3,
            assigned_users: room.assigned_users ? room.assigned_users.map(u => u.id) : [],
        });
        clearErrors();
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        reset();
        clearErrors();
    };

    const submitEdit = (e) => {
        e.preventDefault();
        put(route('rooms.update', data.id), {
            onSuccess: () => handleCloseEditModal(),
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Ruangan & QR Code</h2>}
        >
            <Head title="Ruangan" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    {/* Filter Section */}
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Filter Gedung</label>
                                <select
                                    value={selectedBuilding}
                                    onChange={handleBuildingChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">-- Semua Gedung --</option>
                                    {buildings.map(building => (
                                        <option key={building.id} value={building.id}>
                                            {building.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Filter Lantai</label>
                                <select
                                    value={selectedFloor}
                                    onChange={handleFloorChange}
                                    disabled={!selectedBuilding}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 disabled:bg-gray-100"
                                >
                                    <option value="">-- Semua Lantai --</option>
                                    {floors.map(floor => (
                                        <option key={floor.id} value={floor.id}>
                                            {floor.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
                        <div className="p-6">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border-b p-4">ID</th>
                                        <th className="border-b p-4">Gedung / Lantai</th>
                                        <th className="border-b p-4">Nama Ruangan</th>
                                        <th className="border-b p-4">Tipe Ruangan</th>
                                        <th className="border-b p-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rooms.map((room) => (
                                        <tr key={room.id} className="hover:bg-gray-50">
                                            <td className="border-b p-4">#{room.id}</td>
                                            <td className="border-b p-4">
                                                {room.floor?.building?.name} - {room.floor?.name}
                                            </td>
                                            <td className="border-b p-4">
                                                <div className="font-medium text-gray-900">{room.name}</div>
                                                {room.room_type === 'toilet' && (
                                                    <div className="mt-1 flex flex-wrap gap-1">
                                                        {room.assigned_users && room.assigned_users.length > 0 ? (
                                                            room.assigned_users.map(user => (
                                                                <span key={user.id} className="inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                                                    {user.name}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-[10px] text-red-500 font-medium">Belum ada petugas</span>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="border-b p-4">
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                                    room.room_type === 'toilet' 
                                                        ? 'bg-pink-50 text-pink-700 ring-pink-600/10' 
                                                        : 'bg-blue-50 text-blue-700 ring-blue-600/10'
                                                }`}>
                                                    {room.room_type === 'toilet' ? `Khusus (Tiap ${room.inspection_interval || 3} Jam)` : 'Umum'}
                                                </span>
                                            </td>
                                            <td className="border-b p-4 text-center">
                                                <Dropdown>
                                                    <Dropdown.Trigger>
                                                        <button className="text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 focus:outline-none transition inline-flex items-center justify-center">
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                            </svg>
                                                        </button>
                                                    </Dropdown.Trigger>
                                                    <Dropdown.Content align="right" width="48">
                                                        <button
                                                            onClick={() => handleEditClick(room)}
                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 transition"
                                                        >
                                                            Edit
                                                        </button>
                                                        <a
                                                            href={route('rooms.qr', room.id)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 transition"
                                                        >
                                                            Cetak QR (PDF)
                                                        </a>
                                                        <button
                                                            onClick={() => handleDelete(room.id)}
                                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 focus:bg-red-50 transition"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </Dropdown.Content>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ))}
                                    {rooms.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center p-4">Belum ada ruangan</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Room Modal */}
            <Modal show={isEditModalOpen} onClose={handleCloseEditModal} maxWidth="md">
                <form onSubmit={submitEdit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Edit Ruangan</h2>
                    
                    <div className="mb-4">
                        <InputLabel value="Gedung" />
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={editBuildingId}
                            onChange={(e) => {
                                setEditBuildingId(e.target.value);
                                setData('floor_id', ''); // Reset floor when building changes
                            }}
                            required
                        >
                            <option value="">-- Pilih Gedung --</option>
                            {buildings.map(building => (
                                <option key={building.id} value={building.id}>{building.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <InputLabel value="Lantai" />
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50"
                            value={data.floor_id}
                            onChange={(e) => setData('floor_id', e.target.value)}
                            disabled={!editBuildingId}
                            required
                        >
                            <option value="">-- Pilih Lantai --</option>
                            {buildings.find(b => b.id.toString() === editBuildingId.toString())?.floors.map(floor => (
                                <option key={floor.id} value={floor.id}>{floor.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.floor_id} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <InputLabel value="Nama Ruangan" />
                        <TextInput
                            type="text"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <InputLabel value="Tipe Ruangan" />
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.room_type}
                            onChange={(e) => {
                                const val = e.target.value;
                                setData(data => ({
                                    ...data,
                                    room_type: val,
                                    assigned_users: val === 'general' ? [] : data.assigned_users,
                                    inspection_interval: val === 'general' ? 3 : data.inspection_interval
                                }));
                            }}
                            required
                        >
                            <option value="general">Umum (General)</option>
                            <option value="toilet">Khusus</option>
                        </select>
                        <InputError message={errors.room_type} className="mt-2" />
                    </div>

                    {data.room_type === 'toilet' && (
                        <>
                            <div className="mb-4">
                                <InputLabel value="Jeda Waktu Inspeksi (Jam)" />
                                <TextInput
                                    type="number"
                                    className="mt-1 block w-full"
                                    value={data.inspection_interval}
                                    onChange={(e) => setData('inspection_interval', e.target.value)}
                                    min="1"
                                    required
                                />
                                <InputError message={errors.inspection_interval} className="mt-2" />
                            </div>

                            <div className="mb-6">
                                <InputLabel value="Petugas yang Ditugaskan" />
                                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
                                    {officers.map((officer) => (
                                        <label key={officer.id} className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                checked={data.assigned_users.includes(officer.id)}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setData('assigned_users', 
                                                        checked 
                                                            ? [...data.assigned_users, officer.id]
                                                            : data.assigned_users.filter(id => id !== officer.id)
                                                    );
                                                }}
                                            />
                                            <span className="text-sm text-gray-700">{officer.name} ({officer.email})</span>
                                        </label>
                                    ))}
                                    {officers.length === 0 && (
                                        <p className="text-sm text-gray-500 italic">Tidak ada petugas terdaftar</p>
                                    )}
                                </div>
                                <InputError message={errors.assigned_users} className="mt-2" />
                            </div>
                        </>
                    )}

                    <div className="flex justify-end space-x-2">
                        <SecondaryButton onClick={handleCloseEditModal}>Batal</SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>Simpan</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
