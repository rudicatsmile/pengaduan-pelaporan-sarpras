import 'package:get/get.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ReportDetailController extends GetxController {
  final report = {}.obs;
  final isLoading = true.obs;

  final Dio _dio = Dio(BaseOptions(
    baseUrl: 'http://10.0.2.2:8000/api',
    headers: {'Accept': 'application/json'},
  ));

  @override
  void onInit() {
    super.onInit();
    final id = Get.parameters['id'];
    if (id != null) {
      fetchDetail(id);
    }
  }

  Future<void> fetchDetail(String id) async {
    isLoading.value = true;
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      final response = await _dio.get(
        '/reports/$id',
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      
      if (response.statusCode == 200) {
        report.value = response.data['data'];
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal memuat detail laporan');
    } finally {
      isLoading.value = false;
    }
  }
}
