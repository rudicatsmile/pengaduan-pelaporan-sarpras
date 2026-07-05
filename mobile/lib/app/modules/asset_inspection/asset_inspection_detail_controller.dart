import 'package:get/get.dart';
import 'package:dio/dio.dart';
import 'package:mobile/app/core/network/api_client.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AssetInspectionDetailController extends GetxController {
  final _dio = ApiClient.instance;
  
  final isLoading = true.obs;
  final inspection = {}.obs;
  
  @override
  void onInit() {
    super.onInit();
    final id = Get.arguments;
    if (id == null) {
      Get.back();
      return;
    }
    fetchDetail(id is String ? int.parse(id) : id as int);
  }
  
  Future<void> fetchDetail(int id) async {
    isLoading.value = true;
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      if (token == 'guest' || token == null) {
        Get.snackbar('Error', 'Sesi telah berakhir, silakan login kembali');
        Get.offAllNamed('/login');
        return;
      }
      
      final response = await _dio.get(
        '/asset-inspections/$id',
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      
      if (response.statusCode == 200) {
        inspection.value = response.data['data'];
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal memuat rincian inspeksi');
      Get.back();
    } finally {
      isLoading.value = false;
    }
  }
}
