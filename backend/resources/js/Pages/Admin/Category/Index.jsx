import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ categories }) {
    const [editing, setEditing] = useState(null);
    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        name: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            put(route('categories.update', editing.id), {
                onSuccess: () => {
                    setEditing(null);
                    reset();
                },
            });
        } else {
            post(route('categories.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (category) => {
        setEditing(category);
        setData('name', category.name);
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus kategori ini?')) {
            destroy(route('categories.destroy', id));
        }
    };

    const cancelEdit = () => {
        setEditing(null);
        reset();
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Master Kategori</h2>}
        >
            <Head title="Master Kategori" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Form Section */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                            <h3 className="font-bold text-lg mb-4">{editing ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
                            <form onSubmit={submit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Nama Kategori</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
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
                                            <th className="border-b p-4">Nama Kategori</th>
                                            <th className="border-b p-4">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((category) => (
                                            <tr key={category.id} className="hover:bg-gray-50">
                                                <td className="border-b p-4">#{category.id}</td>
                                                <td className="border-b p-4">{category.name}</td>
                                                <td className="border-b p-4 space-x-2">
                                                    <button onClick={() => handleEdit(category)} className="text-blue-600 hover:underline">Edit</button>
                                                    <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:underline">Hapus</button>
                                                </td>
                                            </tr>
                                        ))}
                                        {categories.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="text-center p-4">Belum ada kategori</td>
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
