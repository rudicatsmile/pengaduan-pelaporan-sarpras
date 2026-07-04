import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile/app/core/network/api_client.dart';

class SettingsService extends GetxService {
  static SettingsService get to => Get.find();

  final appName = 'Sistem Pelaporan'.obs;
  final appLogo = RxnString();

  Future<SettingsService> init() async {
    final prefs = await SharedPreferences.getInstance();
    appName.value = prefs.getString('app_name') ?? 'Sistem Pelaporan';
    appLogo.value = prefs.getString('app_logo');
    return this;
  }

  Future<void> fetchSettings() async {
    try {
      final dio = ApiClient.instance;
      final response = await dio.get('/settings');
      if (response.statusCode == 200) {
        final data = response.data['data'];
        if (data != null) {
          final newName = data['app_name'];
          final newLogo = data['app_logo'];

          final prefs = await SharedPreferences.getInstance();
          if (newName != null) {
            appName.value = newName;
            await prefs.setString('app_name', newName);
          }
          if (newLogo != null) {
            appLogo.value = newLogo;
            await prefs.setString('app_logo', newLogo);
          }
        }
      }
    } catch (e) {
      // Failed to fetch settings, keep cached version
    }
  }
}
