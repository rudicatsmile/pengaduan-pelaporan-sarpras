<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::pluck('value', 'key')->toArray();

        return response()->json([
            'success' => true,
            'data' => [
                'app_name' => $settings['app_name'] ?? 'Pengaduan Sarpras',
                'app_logo' => isset($settings['app_logo']) ? url('/api/settings/logo') : null,
                'owner_name' => $settings['owner_name'] ?? null,
                'owner_phone' => $settings['owner_phone'] ?? null,
                'owner_email' => $settings['owner_email'] ?? null,
                'owner_address' => $settings['owner_address'] ?? null,
            ]
        ]);
    }
    public function getLogo()
    {
        $logoUrl = Setting::where('key', 'app_logo')->value('value');
        if ($logoUrl) {
            $path = str_replace('/storage/', 'app/public/', $logoUrl);
            $fullPath = storage_path($path);
            if (file_exists($fullPath)) {
                return response()->file($fullPath);
            }
        }
        return abort(404);
    }
}
