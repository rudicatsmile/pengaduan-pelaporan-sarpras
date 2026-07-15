import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import Dropdown from '@/Components/Dropdown';

export default function Index({ jobCategories }) {
    const [editing, setEditing] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const { data, setData, post, put, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        name: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            put(route('job-categories.update', editing.id), {
                onSuccess: () => {
                    setEditing(null);
                    setShowFormModal(false);
                    reset();
                },
            });
        } else {
            post(route('job-categories.store'), {
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

    const handleEdit = (category) => {
        setEditing(category);
        setData({
            name: category.name,
        });
        clearErrors();
        setShowFormModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus kategori jabatan ini?')) {
            destroy(route('job-categories.destroy', id));
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
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Kategori Jabatan</h2>}
        >
            <Head title="Kategori Jabatan" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg text-gray-800">Daftar Kategori Jabatan</h3>
                                <button
                                    onClick={handleAdd}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    + Tambah Kategori
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="border-b p-4 w-16">ID</th>
                                            <th className="border-b p-4">Nama Jabatan</th>
                                            <th className="border-b p-4 w-24">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {jobCategories.map((category) => (
                                            <tr key={category.id} className="hover:bg-gray-50">
                                                <td className="border-b p-4">#{category.id}</td>
                                                <td className="border-b p-4 font-medium text-gray-900">{category.name}</td>
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
                                                                onClick={() => handleEdit(category)} 
                                                                className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 transition duration-150 ease-in-out"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDelete(category.id)} 
                                                                className="block w-full px-4 py-2 text-left text-sm leading-5 text-red-600 hover:bg-gray-100 focus:bg-gray-100 transition duration-150 ease-in-out"
                                                            >
                                                                Hapus
                                                            </button>
                                                        </Dropdown.Content>
                                                    </Dropdown>
                                                </td>
                                            </tr>
                                        ))}
                                        {jobCategories.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="text-center p-4">Belum ada Kategori Jabatan</td>
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
                        {editing ? 'Edit Kategori Jabatan' : 'Tambah Kategori Jabatan'}
                    </h2>
                    <form onSubmit={submit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Nama Jabatan (Misal: Teknisi)</label>
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
                                {editing ? 'Simpan Perubahan' : 'Tambah Kategori'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
