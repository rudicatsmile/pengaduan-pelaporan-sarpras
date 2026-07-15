import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ floors, buildings, filters }) {
    const { auth } = usePage().props;
    const isAdmin = auth.user.roles?.some(role => ['admin', 'super_admin'].includes(role));

    const [selectedBuilding, setSelectedBuilding] = useState(filters?.building_id || '');

    const handleFilterChange = (e) => {
        const buildingId = e.target.value;
        setSelectedBuilding(buildingId);
        
        router.get(route('floors.index'), { building_id: buildingId }, {
            preserveState: true,
            replace: true
        });
    };

    const [editing, setEditing] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const { data, setData, post, put, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        name: '',
        building_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            put(route('floors.update', editing.id), {
                onSuccess: () => {
                    setEditing(null);
                    setShowFormModal(false);
                    reset();
                },
            });
        } else {
            post(route('floors.store'), {
                onSuccess: () => {
                    setShowFormModal(false);
                    reset();
                },
            });
        }
    };

    const handleAdd = () => {
        setEditing(null);
        reset();
        clearErrors();
        setShowFormModal(true);
    };

    const handleEdit = (floor) => {
        setEditing(floor);
        setData({
            name: floor.name,
            building_id: floor.building_id,
        });
        clearErrors();
        setShowFormModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus lantai ini?')) {
            destroy(route('floors.destroy', id));
        }
    };

    const closeFormModal = () => {
        setShowFormModal(false);
        setEditing(null);
        reset();
        clearErrors();
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Lantai</h2>}
        >
            <Head title="Lantai" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Table Section */}
                    <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                                <div className="flex items-center space-x-4">
                                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter Gedung:</label>
                                    <select
                                        value={selectedBuilding}
                                        onChange={handleFilterChange}
                                        className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="">-- Semua Gedung --</option>
                                        {buildings.map(building => (
                                            <option key={building.id} value={building.id}>
                                                {building.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {isAdmin && (
                                    <button
                                        onClick={handleAdd}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                    >
                                        + Tambah Lantai
                                    </button>
                                )}
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="border-b p-4">ID</th>
                                            <th className="border-b p-4">Gedung</th>
                                            <th className="border-b p-4">Nama Lantai</th>
                                            {isAdmin && <th className="border-b p-4">Aksi</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {floors.map((floor) => (
                                            <tr key={floor.id} className="hover:bg-gray-50">
                                                <td className="border-b p-4">#{floor.id}</td>
                                                <td className="border-b p-4">{floor.building?.name}</td>
                                                <td className="border-b p-4">{floor.name}</td>
                                                {isAdmin && (
                                                    <td className="border-b p-4 space-x-2">
                                                        <button onClick={() => handleEdit(floor)} className="text-blue-600 hover:underline">Edit</button>
                                                        <button onClick={() => handleDelete(floor.id)} className="text-red-600 hover:underline">Hapus</button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                        {floors.length === 0 && (
                                            <tr>
                                                <td colSpan={isAdmin ? "4" : "3"} className="text-center p-4">Belum ada lantai</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Modal */}
            <Modal show={showFormModal} onClose={closeFormModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {editing ? 'Edit Lantai' : 'Tambah Lantai'}
                    </h2>
                    <form onSubmit={submit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Gedung</label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.building_id}
                                onChange={e => setData('building_id', e.target.value)}
                                required
                            >
                                <option value="">-- Pilih Gedung --</option>
                                {buildings.map(building => (
                                    <option key={building.id} value={building.id}>
                                        {building.name}
                                    </option>
                                ))}
                            </select>
                            {errors.building_id && <div className="text-red-500 text-sm mt-1">{errors.building_id}</div>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Nama Lantai</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                        </div>
                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                type="button"
                                onClick={closeFormModal}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {editing ? 'Simpan Perubahan' : 'Tambah Lantai'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
