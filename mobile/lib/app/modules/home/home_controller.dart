import 'package:mobile/app/core/network/api_client.dart';
import 'package:get/get.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../routes/app_pages.dart';
import '../../core/services/settings_service.dart';

class HomeController extends GetxController {
  final currentIndex = 0.obs;
  final userRole = ''.obs;
  final userName = ''.obs;
  final isLoading = true.obs;

  final  _dio = ApiClient.instance;

  final appName = 'Sistem Pelaporan'.obs;

  @override
  void onInit() {
    super.onInit();
    _fetchUser();
    _fetchSettings();
  }

  Future<void> _fetchSettings() async {
    appName.value = SettingsService.to.appName.value;
    SettingsService.to.appName.listen((value) {
      appName.value = value;
    });
  }

  Future<void> _fetchUser() async {
    isLoading.value = true;
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      if (token == 'guest') {
        userName.value = 'Tamu (Anonim)';
        userRole.value = 'tamu';
        isLoading.value = false;
        return;
      }
      
      final response = await _dio.get(
        '/user',
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      
      if (response.statusCode == 200) {
        userName.value = response.data['user']['name'] ?? 'Pengguna';
        final roles = response.data['roles'] as List;
        if (roles.isNotEmpty) {
          userRole.value = roles[0];
        } else {
          userRole.value = 'pengguna';
        }
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal memuat profil');
    } finally {
      isLoading.value = false;
    }
  }

  void changePage(int index) {
    currentIndex.value = index;
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    Get.offAllNamed(Routes.LOGIN);
  }
}
