import 'package:get/get.dart';
import '../../routes/app_pages.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/services/settings_service.dart';

class SplashController extends GetxController {
  @override
  void onInit() {
    super.onInit();
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    SettingsService.to.fetchSettings();
    
    await Future.delayed(const Duration(seconds: 2));
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');

    if (token != null && token.isNotEmpty) {
      Get.offAllNamed(Routes.HOME);
    } else {
      Get.offAllNamed(Routes.LANDING);
    }
  }
}
