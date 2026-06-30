import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ users, roles }) {
    const [editing, setEditing] = useState(null);
    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        name: '',
        email: '',
        password: '',
        role: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            put(route('users.update', editing.id), {
                onSuccess: () => {
                    setEditing(null);
                    reset();
                },
            });
        } else {
            post(route('users.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (user) => {
        setEditing(user);
        setData({
            name: user.name,
            email: user.email,
            password: '', // blank password when editing
            role: user.roles?.length > 0 ? user.roles[0].name : '',
        });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus user ini?')) {
            destroy(route('users.destroy', id));
        }
    };

    const cancelEdit = () => {
        setEditing(null);
        reset();
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Master User & Role</h2>}
        >
            <Head title="Master User" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Form Section */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                            <h3 className="font-bold text-lg mb-4">{editing ? 'Edit User' : 'Tambah User'}</h3>
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
                                    <label className="block text-sm font-medium text-gray-700">Role</label>
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.role}
                                        onChange={e => setData('role', e.target.value)}
                                        required
                                    >
                                        <option value="">Pilih Role</option>
                                        {roles.map(r => (
                                            <option key={r.id} value={r.name}>{r.name}</option>
                                        ))}
                                    </select>
                                    {errors.role && <div className="text-red-500 text-sm mt-1">{errors.role}</div>}
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {editing ? 'Simpan' : 'Tambah'}
                                    </button>
                                    {editing && (
                                        <button
                                            type="button"
                                            onClick={cancelEdit}
                                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                                        >
                                            Batal
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="md:col-span-2">
                        <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
                            <div className="p-6">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="border-b p-4">ID</th>
                                            <th className="border-b p-4">Nama</th>
                                            <th className="border-b p-4">Email</th>
                                            <th className="border-b p-4">Role</th>
                                            <th className="border-b p-4">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="border-b p-4">#{user.id}</td>
                                                <td className="border-b p-4">{user.name}</td>
                                                <td className="border-b p-4">{user.email}</td>
                                                <td className="border-b p-4">
                                                    {user.roles.map(r => (
                                                        <span key={r.id} className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs mr-1 uppercase">
                                                            {r.name}
                                                        </span>
                                                    ))}
                                                </td>
                                                <td className="border-b p-4 space-x-2">
                                                    <button onClick={() => handleEdit(user)} className="text-blue-600 hover:underline">Edit</button>
                                                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:underline">Hapus</button>
                                                </td>
                                            </tr>
                                        ))}
                                        {users.length === 0 && (
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
        </AuthenticatedLayout>
    );
}
