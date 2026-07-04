import { Head, useForm, usePage } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useState } from 'react';

export default function ReportForm({ room, categories }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        guest_name: '',
        guest_phone: '',
        category_id: '',
        description: '',
        images: [],
    });

    const [imagePreviews, setImagePreviews] = useState([]);

    const submit = (e) => {
        e.preventDefault();
        post(route('public.report.store', room.id), {
            onSuccess: () => {
                reset();
                setImagePreviews([]);
            },
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [...data.images, ...files];
        setData('images', newImages);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...newPreviews]);
        
        e.target.value = null;
    };

    const removeImage = (index) => {
        const newImages = [...data.images];
        newImages.splice(index, 1);
        setData('images', newImages);

        const newPreviews = [...imagePreviews];
        newPreviews.splice(index, 1);
        setImagePreviews(newPreviews);
    };

    if (flash?.success) {
        return (
            <GuestLayout>
                <Head title="Pengaduan Terkirim" />
                <div className="text-center py-8 px-4">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6 animate-bounce">
                        <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Terima Kasih!</h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        {flash.success}
                    </p>
                    {/* flash.report_id && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-8 border border-gray-200">
                            <p className="text-sm text-gray-500 mb-1">Nomor Tiket Laporan Anda:</p>
                            <p className="text-2xl font-mono font-bold text-indigo-600">#{flash.report_id}</p>
                            <p className="text-xs text-gray-400 mt-2">Simpan nomor tiket ini untuk referensi Anda.</p>
                        </div>
                    ) */}

                    <div className="space-y-3">
                        <button 
                            onClick={() => window.location.reload()}
                            className="w-full inline-flex justify-center items-center px-4 py-3 bg-indigo-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            Buat Laporan Baru
                        </button>
                    </div>
                </div>
            </GuestLayout>
        );
    }

    return (
        <GuestLayout>
            <Head title="Form Pengaduan Publik" />

            <div className="mb-6 text-center">
                <h2 className="text-xl font-bold text-gray-800">Lapor Kerusakan</h2>
                <p className="text-sm text-gray-500 mt-1">Lokasi: <span className="font-semibold text-indigo-600">{room.name}</span></p>
            </div>

            <form onSubmit={submit} className="space-y-4" encType="multipart/form-data">
                <div>
                    <InputLabel htmlFor="guest_name" value="Nama Lengkap *" />
                    <TextInput
                        id="guest_name"
                        className="mt-1 block w-full"
                        value={data.guest_name}
                        onChange={(e) => setData('guest_name', e.target.value)}
                        required
                        placeholder="Contoh: Budi Santoso"
                    />
                    <InputError className="mt-2" message={errors.guest_name} />
                </div>

                <div>
                    <InputLabel htmlFor="guest_phone" value="No. WhatsApp / HP *" />
                    <TextInput
                        id="guest_phone"
                        type="tel"
                        className="mt-1 block w-full"
                        value={data.guest_phone}
                        onChange={(e) => setData('guest_phone', e.target.value)}
                        required
                        placeholder="Contoh: 081234567890"
                    />
                    <InputError className="mt-2" message={errors.guest_phone} />
                </div>

                <div>
                    <InputLabel htmlFor="category_id" value="Kategori Masalah *" />
                    <select
                        id="category_id"
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        value={data.category_id}
                        onChange={(e) => setData('category_id', e.target.value)}
                        required
                    >
                        <option value="">-- Pilih Kategori --</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <InputError className="mt-2" message={errors.category_id} />
                </div>

                <div>
                    <InputLabel htmlFor="description" value="Deskripsi Kerusakan *" />
                    <textarea
                        id="description"
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        rows="3"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        required
                        placeholder="Jelaskan detail kerusakannya..."
                    ></textarea>
                    <InputError className="mt-2" message={errors.description} />
                </div>

                <div>
                    <InputLabel htmlFor="images" value="Foto Bukti (Opsional)" />
                    <input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                        onChange={handleImageChange}
                    />
                    <InputError className="mt-2" message={errors.images} />
                    
                    {imagePreviews.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-2">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative group">
                                    <img src={preview} alt="Preview" className="h-20 w-full object-cover rounded" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow opacity-80 hover:opacity-100"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="pt-4">
                    <PrimaryButton className="w-full justify-center py-3" disabled={processing}>
                        Kirim Laporan
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
