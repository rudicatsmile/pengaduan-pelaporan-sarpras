import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useState } from 'react';

export default function Index({ auth, settings }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        app_name: settings.app_name || '',
        owner_name: settings.owner_name || '',
        owner_address: settings.owner_address || '',
        owner_phone: settings.owner_phone || '',
        owner_email: settings.owner_email || '',
        app_logo: null,
    });

    const [logoPreview, setLogoPreview] = useState(settings.app_logo || null);

    const submit = (e) => {
        e.preventDefault();
        post(route('settings.update'), {
            preserveScroll: true,
        });
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setData('app_logo', file);
        if (file) {
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Pengaturan Aplikasi</h2>}
        >
            <Head title="Pengaturan Aplikasi" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <section className="max-w-xl">
                            <header>
                                <h2 className="text-lg font-medium text-gray-900">Informasi Pemilik & Aplikasi</h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Perbarui nama aplikasi, logo, dan informasi kontak pemilik aplikasi.
                                </p>
                            </header>

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div>
                                    <InputLabel htmlFor="app_logo" value="Logo Aplikasi" />
                                    
                                    {logoPreview && (
                                        <div className="mt-2 mb-4 bg-gray-50 p-2 border rounded max-w-[200px]">
                                            <img src={logoPreview} alt="Logo" className="h-24 w-auto object-contain" />
                                        </div>
                                    )}

                                    <input
                                        id="app_logo"
                                        type="file"
                                        className="mt-1 block w-full text-sm text-gray-500
                                          file:mr-4 file:py-2 file:px-4
                                          file:rounded-md file:border-0
                                          file:text-sm file:font-semibold
                                          file:bg-indigo-50 file:text-indigo-700
                                          hover:file:bg-indigo-100 cursor-pointer"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                    />
                                    <InputError className="mt-2" message={errors.app_logo} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="app_name" value="Nama Aplikasi" />
                                    <TextInput
                                        id="app_name"
                                        className="mt-1 block w-full"
                                        value={data.app_name}
                                        onChange={(e) => setData('app_name', e.target.value)}
                                        required
                                    />
                                    <InputError className="mt-2" message={errors.app_name} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="owner_name" value="Nama Pemilik (Institusi/Perusahaan)" />
                                    <TextInput
                                        id="owner_name"
                                        className="mt-1 block w-full"
                                        value={data.owner_name}
                                        onChange={(e) => setData('owner_name', e.target.value)}
                                        required
                                    />
                                    <InputError className="mt-2" message={errors.owner_name} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="owner_email" value="Email Kontak" />
                                    <TextInput
                                        id="owner_email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        value={data.owner_email}
                                        onChange={(e) => setData('owner_email', e.target.value)}
                                    />
                                    <InputError className="mt-2" message={errors.owner_email} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="owner_phone" value="Telepon / WhatsApp" />
                                    <TextInput
                                        id="owner_phone"
                                        className="mt-1 block w-full"
                                        value={data.owner_phone}
                                        onChange={(e) => setData('owner_phone', e.target.value)}
                                    />
                                    <InputError className="mt-2" message={errors.owner_phone} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="owner_address" value="Alamat" />
                                    <TextInput
                                        id="owner_address"
                                        className="mt-1 block w-full"
                                        value={data.owner_address}
                                        onChange={(e) => setData('owner_address', e.target.value)}
                                    />
                                    <InputError className="mt-2" message={errors.owner_address} />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>Simpan Pengaturan</PrimaryButton>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-gray-600 font-semibold text-green-600">Berhasil disimpan.</p>
                                    </Transition>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
