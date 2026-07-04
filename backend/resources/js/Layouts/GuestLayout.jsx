import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    const { app_settings } = usePage().props;

    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/" className="flex flex-col items-center">
                    {app_settings?.app_logo ? (
                        <img src={app_settings.app_logo} alt="Logo" className="h-20 w-auto object-contain mb-4" />
                    ) : (
                        <ApplicationLogo className="h-20 w-20 fill-current text-gray-500 mb-4" />
                    )}
                    <h1 className="text-2xl font-bold text-gray-800">{app_settings?.app_name}</h1>
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
