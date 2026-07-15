import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'landing_controller.dart';
import '../../core/services/settings_service.dart';

class LandingView extends GetView<LandingController> {
  const LandingView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Spacer(flex: 2),
              // App Icon / Logo Placeholder
              Obx(() {
                final logoUrl = SettingsService.to.appLogo.value;
                if (logoUrl != null && logoUrl.isNotEmpty) {
                  return Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.3),
                          offset: const Offset(4, 4),
                          blurRadius: 10,
                          spreadRadius: 1,
                        ),
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.05),
                          offset: const Offset(-4, -4),
                          blurRadius: 10,
                          spreadRadius: 1,
                        ),
                      ],
                    ),
                    child: ClipOval(
                      child: Image.network(
                        logoUrl,
                        height: 80,
                        width: 80,
                        fit: BoxFit.contain,
                        errorBuilder: (context, error, stackTrace) => Image.asset(
                          'assets/logo-default.png',
                          width: 80,
                          height: 80,
                          fit: BoxFit.contain,
                        ),
                      ),
                    ),
                  );
                }
                return Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.grey.withOpacity(0.3),
                        offset: const Offset(4, 4),
                        blurRadius: 10,
                        spreadRadius: 1,
                      ),
                      BoxShadow(
                        color: Colors.grey.withOpacity(0.05),
                        offset: const Offset(-4, -4),
                        blurRadius: 10,
                        spreadRadius: 1,
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.info,
                    size: 80,
                    color: Color(0xFF047857),
                  ),
                );
              }),
              const SizedBox(height: 40),
              
              // App Title & Tagline
              Obx(() => Text(
                SettingsService.to.appName.value,
                textAlign: TextAlign.center,
                style: context.textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF1F2937),
                ),
              )),
              const SizedBox(height: 16),
              Text(
                'Sistem Informasi Pelaporan Gedung dan Prasarana',
                textAlign: TextAlign.center,
                style: context.textTheme.bodyLarge?.copyWith(
                  color: const Color(0xFF6B7280),
                  height: 1.5,
                ),
              ),
              
              const Spacer(flex: 2),
              
              // Action Buttons
              ElevatedButton(
                onPressed: controller.goToLogin,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF047857),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 2,
                ),
                child: const Text(
                  'Masuk ke Akun Anda',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(height: 16),
              
              OutlinedButton.icon(
                onPressed: controller.continueAsGuest,
                icon: const Icon(Icons.qr_code_scanner),
                label: const Text(
                  'Lanjutkan sebagai Tamu',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xFF047857),
                  side: const BorderSide(color: Color(0xFF047857), width: 1.5),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
              
              const SizedBox(height: 24),
              
              // Footer text for guests
              const Text(
                '*Tamu hanya dapat membuat laporan melalui pemindaian QR Code pada ruangan terkait.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.grey,
                  fontSize: 12,
                  fontStyle: FontStyle.italic,
                ),
              ),
              const Spacer(flex: 1),
            ],
          ),
        ),
      ),
    );
  }
}
