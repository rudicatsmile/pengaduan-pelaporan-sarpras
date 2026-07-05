import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function Index({ rooms, buildings, filters }) {
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
    });

    const handleEditClick = (room) => {
        setEditBuildingId(room.floor?.building_id || '');
        setData({
            id: room.id,
            name: room.name,
            floor_id: room.floor_id || '',
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
                                        <th className="border-b p-4">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rooms.map((room) => (
                                        <tr key={room.id} className="hover:bg-gray-50">
                                            <td className="border-b p-4">#{room.id}</td>
                                            <td className="border-b p-4">
                                                {room.floor?.building?.name} - {room.floor?.name}
                                            </td>
                                            <td className="border-b p-4">{room.name}</td>
                                            <td className="border-b p-4 space-x-3">
                                                <button onClick={() => handleEditClick(room)} className="text-blue-600 hover:underline">Edit</button>
                                                <a
                                                    href={route('rooms.qr', room.id)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-green-600 hover:underline"
                                                >
                                                    Cetak QR (PDF)
                                                </a>
                                                <button onClick={() => handleDelete(room.id)} className="text-red-600 hover:underline">Hapus</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {rooms.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center p-4">Belum ada ruangan</td>
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

                    <div className="mb-6">
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

                    <div className="flex justify-end space-x-2">
                        <SecondaryButton onClick={handleCloseEditModal}>Batal</SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>Simpan</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
