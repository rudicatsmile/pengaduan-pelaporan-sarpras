<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WablasService
{
    /**
     * Send WhatsApp message using Wablas API
     *
     * @param string $phone
     * @param string $message
     * @return bool
     */
    public static function send(string $phone, string $message): bool
    {
        $domain = env('WABLAS_API_DOMAIN');
        $token = env('WABLAS_API_TOKEN');

        if (!$domain || !$token || $token === 'your_wablas_api_token' || empty($phone)) {
            Log::info("Wablas skipped (Not configured or empty phone). Phone: $phone, Message: $message");
            return false;
        }

        $baseUrl = rtrim($domain, '/');
        // Bersihkan url dari path spesifik jika user memasukkan full URL ke dalam .env
        $baseUrl = preg_replace('#/api(/v2)?/send-message$#i', '', $baseUrl);
        $baseUrl = preg_replace('#/api$#i', '', $baseUrl);

        try {
            // Gunakan API v2 format terlebih dahulu
            $response = Http::withHeaders([
                'Authorization' => $token,
                'Content-Type' => 'application/json',
            ])->post($baseUrl . '/api/v2/send-message', [
                'data' => [
                    [
                        'phone' => $phone,
                        'message' => $message,
                    ]
                ]
            ]);

            if ($response->successful() && $response->json('status') !== false) {
                Log::info("Wablas success to $phone");
                return true;
            }

            // Fallback ke API v1 jika gagal (beberapa server wablas lama menggunakan v1 form-urlencoded)
            $v1Response = Http::asForm()->withHeaders([
                'Authorization' => $token,
            ])->post($baseUrl . '/api/send-message', [
                'phone' => $phone,
                'message' => $message,
            ]);

            if ($v1Response->successful() && $v1Response->json('status') !== false) {
                Log::info("Wablas success to $phone (v1 fallback)");
                return true;
            }

            Log::error("Wablas failed to $phone. V2: " . $response->body() . " | V1: " . $v1Response->body());
            return false;
        } catch (\Exception $e) {
            Log::error("Wablas exception to $phone: " . $e->getMessage());
            return false;
        }
    }
}
