<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $settings = \App\Models\Setting::pluck('value', 'key')->toArray();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? array_merge($request->user()->toArray(), ['roles' => $request->user()->getRoleNames()]) : null,
            ],
            'app_settings' => [
                'app_name' => $settings['app_name'] ?? 'Pengaduan Sarpras',
                'app_logo' => $settings['app_logo'] ?? null,
                'owner_name' => $settings['owner_name'] ?? null,
                'owner_phone' => $settings['owner_phone'] ?? null,
                'owner_email' => $settings['owner_email'] ?? null,
                'owner_address' => $settings['owner_address'] ?? null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'message' => $request->session()->get('message'),
                'report_id' => $request->session()->get('report_id'),
            ]
        ];
    }
}
