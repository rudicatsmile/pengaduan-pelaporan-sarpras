import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../routes/app_pages.dart';

class LandingController extends GetxController {
  
  void goToLogin() {
    Get.toNamed(Routes.LOGIN);
  }

  Future<void> continueAsGuest() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', 'guest');
    await prefs.setString('user_role', 'tamu');
    Get.toNamed('/report/qr');
  }
}
