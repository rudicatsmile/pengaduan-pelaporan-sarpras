import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ rooms }) {
    const [editing, setEditing] = useState(null);
    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        name: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            put(route('rooms.update', editing.id), {
                onSuccess: () => {
                    setEditing(null);
                    reset();
                },
            });
        } else {
            post(route('rooms.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (room) => {
        setEditing(room);
        setData('name', room.name);
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus ruangan ini?')) {
            destroy(route('rooms.destroy', id));
        }
    };

    const cancelEdit = () => {
        setEditing(null);
        reset();
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Ruangan & QR Code</h2>}
        >
            <Head title="Ruangan" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Form Section */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                            <h3 className="font-bold text-lg mb-4">{editing ? 'Edit Ruangan' : 'Tambah Ruangan'}</h3>
                            <form onSubmit={submit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Nama Ruangan/Lokasi</label>
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
                                            <th className="border-b p-4">Nama Ruangan</th>
                                            <th className="border-b p-4">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rooms.map((room) => (
                                            <tr key={room.id} className="hover:bg-gray-50">
                                                <td className="border-b p-4">#{room.id}</td>
                                                <td className="border-b p-4">{room.name}</td>
                                                <td className="border-b p-4 space-x-3">
                                                    <a
                                                        href={route('rooms.qr', room.id)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-green-600 hover:underline"
                                                    >
                                                        Cetak QR (PDF)
                                                    </a>
                                                    <button onClick={() => handleEdit(room)} className="text-blue-600 hover:underline">Edit</button>
                                                    <button onClick={() => handleDelete(room.id)} className="text-red-600 hover:underline">Hapus</button>
                                                </td>
                                            </tr>
                                        ))}
                                        {rooms.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="text-center p-4">Belum ada ruangan</td>
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
