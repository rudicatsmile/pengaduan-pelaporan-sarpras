import 'package:get/get.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class HistoryController extends GetxController {
  final reports = [].obs;
  final isLoading = true.obs;

  final Dio _dio = Dio(BaseOptions(
    baseUrl: 'http://10.0.2.2:8000/api',
    headers: {'Accept': 'application/json'},
  ));

  @override
  void onInit() {
    super.onInit();
    fetchReports();
  }

  Future<void> fetchReports() async {
    isLoading.value = true;
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      final response = await _dio.get(
        '/reports',
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      
      if (response.statusCode == 200) {
        reports.value = response.data['data'];
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal memuat riwayat laporan');
    } finally {
      isLoading.value = false;
    }
  }
}
