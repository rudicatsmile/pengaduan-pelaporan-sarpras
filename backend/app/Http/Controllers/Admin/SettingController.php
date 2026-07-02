<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        if (!auth()->user()->hasRole('super_admin')) {
            abort(403, 'Anda tidak memiliki akses ke pengaturan aplikasi.');
        }

        $settings = Setting::all()->pluck('value', 'key');
        return Inertia::render('Admin/Setting/Index', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        if (!auth()->user()->hasRole('super_admin')) {
            abort(403, 'Anda tidak memiliki akses ke pengaturan aplikasi.');
        }

        $request->validate([
            'app_name' => 'nullable|string',
            'owner_name' => 'nullable|string',
            'owner_address' => 'nullable|string',
            'owner_phone' => 'nullable|string',
            'owner_email' => 'nullable|email',
            'app_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        $keys = ['app_name', 'owner_name', 'owner_address', 'owner_phone', 'owner_email'];
        foreach ($keys as $key) {
            if ($request->has($key)) {
                Setting::where('key', $key)->update(['value' => $request->$key]);
            }
        }

        if ($request->hasFile('app_logo')) {
            $path = $request->file('app_logo')->store('settings', 'public');
            Setting::where('key', 'app_logo')->update(['value' => '/storage/' . $path]);
        }

        return redirect()->back()->with('success', 'Pengaturan berhasil disimpan.');
    }
}
