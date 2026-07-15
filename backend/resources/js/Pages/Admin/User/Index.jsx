import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import Dropdown from '@/Components/Dropdown';
import axios from 'axios';

export default function Index({ users, roles, jobCategories }) {
    const [editing, setEditing] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [filterRole, setFilterRole] = useState('');
    const [managingBuildingsFor, setManagingBuildingsFor] = useState(null);
    const [availableBuildings, setAvailableBuildings] = useState([]);
    const [assignedBuildingIds, setAssignedBuildingIds] = useState([]);
    const [loadingBuildings, setLoadingBuildings] = useState(false);
    const { data, setData, post, put, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        roles: [],
        receive_inspection_alerts: false,
        job_category_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            put(route('users.update', editing.id), {
                onSuccess: () => {
                    setEditing(null);
                    setShowFormModal(false);
                    reset();
                },
            });
        } else {
            post(route('users.store'), {
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

    const handleEdit = (user) => {
        setEditing(user);
        setData({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            password: '', // blank password when editing
            roles: user.roles?.length > 0 ? user.roles.map(r => r.name) : [],
            receive_inspection_alerts: user.permissions?.some(p => p.name === 'receive-inspection-alerts') || false,
            job_category_id: user.job_category_id || '',
        });
        clearErrors();
        setShowFormModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus user ini?')) {
            destroy(route('users.destroy', id));
        }
    };

    const closeFormModal = () => {
        setShowFormModal(false);
        setEditing(null);
        reset();
        clearErrors();
    };

    const openBuildingModal = async (user) => {
        setManagingBuildingsFor(user);
        setLoadingBuildings(true);
        try {
            const bldgRes = await axios.get('/api/buildings');
            setAvailableBuildings(bldgRes.data.data || []);
            
            const userBldgRes = await axios.get(`/api/users/${user.id}/buildings`);
            const assignedIds = (userBldgRes.data.data || []).map(b => b.id);
            setAssignedBuildingIds(assignedIds);
        } catch (error) {
            console.error("Failed to load buildings", error);
            alert("Gagal memuat data gedung.");
        } finally {
            setLoadingBuildings(false);
        }
    };

    const handleAssignBuilding = async (buildingId) => {
        try {
            await axios.post(`/api/users/${managingBuildingsFor.id}/buildings`, { building_id: buildingId });
            setAssignedBuildingIds([...assignedBuildingIds, buildingId]);
        } catch (error) {
            console.error("Failed to assign building", error);
            alert("Gagal menugaskan gedung.");
        }
    };

    const handleRevokeBuilding = async (buildingId) => {
        try {
            await axios.delete(`/api/users/${managingBuildingsFor.id}/buildings`, { data: { building_id: buildingId } });
            setAssignedBuildingIds(assignedBuildingIds.filter(id => id !== buildingId));
        } catch (error) {
            console.error("Failed to revoke building", error);
            alert("Gagal mencabut gedung.");
        }
    };

    const closeBuildingModal = () => {
        setManagingBuildingsFor(null);
        setAvailableBuildings([]);
        setAssignedBuildingIds([]);
    };

    const filteredUsers = filterRole
        ? users.filter(user => user.roles.some(r => r.name === filterRole))
        : users;

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">User</h2>}
        >
            <Head title="User" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Table Section */}
                    <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg text-gray-800">Daftar User</h3>
                                <div className="flex items-center space-x-4">
                                    <select
                                        value={filterRole}
                                        onChange={(e) => setFilterRole(e.target.value)}
                                        className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="">Semua Role</option>
                                        {roles.map(r => (
                                            <option key={r.id} value={r.name}>{r.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleAdd}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                    >
                                        + Tambah User
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="border-b p-4">ID</th>
                                            <th className="border-b p-4">Nama</th>
                                            <th className="border-b p-4">Email / No. WA</th>
                                            <th className="border-b p-4">Kategori Jabatan</th>
                                            <th className="border-b p-4">Role</th>
                                            <th className="border-b p-4">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="border-b p-4">#{user.id}</td>
                                                <td className="border-b p-4">{user.name}</td>
                                                <td className="border-b p-4">
                                                    <div>{user.email}</div>
                                                    <div className="text-xs text-gray-500">{user.phone || '-'}</div>
                                                </td>
                                                <td className="border-b p-4">
                                                    {user.job_category ? user.job_category.name : '-'}
                                                </td>
                                                <td className="border-b p-4">
                                                    {user.roles.map(r => (
                                                        <span key={r.id} className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs mr-1 uppercase">
                                                            {r.name}
                                                        </span>
                                                    ))}
                                                </td>
                                                <td className="border-b p-4">
                                                    <Dropdown>
                                                        <Dropdown.Trigger>
                                                            <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                                </svg>
                                                            </button>
                                                        </Dropdown.Trigger>
                                                        <Dropdown.Content align="right" width="48">
                                                            <button 
                                                                onClick={() => handleEdit(user)} 
                                                                className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 transition duration-150 ease-in-out"
                                                            >
                                                                Edit
                                                            </button>
                                                            {user.roles?.some(r => r.name === 'admin') && (
                                                                <button 
                                                                    onClick={() => openBuildingModal(user)} 
                                                                    className="block w-full px-4 py-2 text-left text-sm leading-5 text-green-700 hover:bg-gray-100 focus:bg-gray-100 transition duration-150 ease-in-out"
                                                                >
                                                                    Kelola Gedung
                                                                </button>
                                                            )}
                                                            <button 
                                                                onClick={() => handleDelete(user.id)} 
                                                                className="block w-full px-4 py-2 text-left text-sm leading-5 text-red-600 hover:bg-gray-100 focus:bg-gray-100 transition duration-150 ease-in-out"
                                                            >
                                                                Hapus
                                                            </button>
                                                        </Dropdown.Content>
                                                    </Dropdown>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredUsers.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="text-center p-4">Belum ada user</td>
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
                        {editing ? 'Edit User' : 'Tambah User'}
                    </h2>
                    <form onSubmit={submit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Nama</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                required
                            />
                            {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">No. WhatsApp</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                placeholder="08123456789"
                            />
                            {errors.phone && <div className="text-red-500 text-sm mt-1">{errors.phone}</div>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Password {editing && <span className="text-gray-400 text-xs">(Kosongkan jika tidak diubah)</span>}
                            </label>
                            <input
                                type="password"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                required={!editing}
                            />
                            {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Kategori Jabatan</label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.job_category_id}
                                onChange={e => setData('job_category_id', e.target.value)}
                            >
                                <option value="">-- Tidak Ada / Kosong --</option>
                                {jobCategories.map(jc => (
                                    <option key={jc.id} value={jc.id}>{jc.name}</option>
                                ))}
                            </select>
                            {errors.job_category_id && <div className="text-red-500 text-sm mt-1">{errors.job_category_id}</div>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                            <div className="space-y-2 border rounded-md p-3 border-gray-300 bg-gray-50 max-h-48 overflow-y-auto">
                                {roles.map(r => (
                                    <div key={r.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`role-${r.id}`}
                                            value={r.name}
                                            checked={data.roles.includes(r.name)}
                                            onChange={e => {
                                                const newRoles = e.target.checked
                                                    ? [...data.roles, r.name]
                                                    : data.roles.filter(name => name !== r.name);
                                                setData('roles', newRoles);
                                            }}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor={`role-${r.id}`} className="ml-2 block text-sm text-gray-900">
                                            {r.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {errors.roles && <div className="text-red-500 text-sm mt-1">{errors.roles}</div>}
                        </div>
                        {data.roles.includes('admin') && (
                            <div className="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.receive_inspection_alerts}
                                        onChange={e => setData('receive_inspection_alerts', e.target.checked)}
                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <div>
                                        <span className="block text-sm font-medium text-gray-900">Terima Notifikasi Inspeksi (WA)</span>
                                        <span className="block text-xs text-gray-500">Centang agar admin ini menerima pesan masuk saat ada Laporan Kinerja atau Inspeksi Aset di gedungnya.</span>
                                    </div>
                                </label>
                            </div>
                        )}
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
                                {editing ? 'Simpan Perubahan' : 'Tambah User'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            <Modal show={managingBuildingsFor !== null} onClose={closeBuildingModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Kelola Gedung untuk Admin: {managingBuildingsFor?.name}
                    </h2>
                    {loadingBuildings ? (
                        <div className="text-center py-4">Memuat data...</div>
                    ) : (
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {availableBuildings.map(bldg => {
                                const isAssigned = assignedBuildingIds.includes(bldg.id);
                                return (
                                    <div key={bldg.id} className="flex justify-between items-center bg-gray-50 p-3 rounded border">
                                        <span className="font-medium text-gray-700">{bldg.name}</span>
                                        {isAssigned ? (
                                            <button 
                                                onClick={() => handleRevokeBuilding(bldg.id)}
                                                className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors"
                                            >
                                                Cabut
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleAssignBuilding(bldg.id)}
                                                className="bg-green-100 text-green-600 px-3 py-1 rounded text-sm hover:bg-green-200 transition-colors"
                                            >
                                                Tugaskan
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                            {availableBuildings.length === 0 && (
                                <div className="text-center text-gray-500 py-4">Tidak ada gedung tersedia.</div>
                            )}
                        </div>
                    )}
                    <div className="mt-6 flex justify-end">
                        <button onClick={closeBuildingModal} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                            Tutup
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
