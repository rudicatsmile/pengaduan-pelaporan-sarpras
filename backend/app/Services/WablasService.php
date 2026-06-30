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

        try {
            $response = Http::withHeaders([
                'Authorization' => $token,
            ])->post($domain . '/api/send-message', [
                'phone' => $phone,
                'message' => $message,
            ]);

            if ($response->successful()) {
                Log::info("Wablas success to $phone");
                return true;
            }

            Log::error("Wablas failed to $phone. Response: " . $response->body());
            return false;
        } catch (\Exception $e) {
            Log::error("Wablas exception to $phone: " . $e->getMessage());
            return false;
        }
    }
}
