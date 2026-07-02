<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'app_name', 'value' => 'EcoFix', 'type' => 'text'],
            ['key' => 'app_logo', 'value' => null, 'type' => 'image'],
            ['key' => 'owner_name', 'value' => 'Universitas X', 'type' => 'text'],
            ['key' => 'owner_address', 'value' => 'Jl. Pendidikan No. 1', 'type' => 'text'],
            ['key' => 'owner_phone', 'value' => '081234567890', 'type' => 'text'],
            ['key' => 'owner_email', 'value' => 'admin@univx.ac.id', 'type' => 'text'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
