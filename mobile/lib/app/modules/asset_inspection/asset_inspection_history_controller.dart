import 'package:get/get.dart';
import 'package:mobile/app/core/network/api_client.dart';
import 'package:dio/dio.dart' as dio;
import 'package:shared_preferences/shared_preferences.dart';

class AssetInspectionHistoryController extends GetxController {
  final inspections = [].obs;
  final isLoading = true.obs;

  final currentPage = 1.obs;
  final hasMore = true.obs;
  final isLoadingMore = false.obs;

  final _dio = ApiClient.instance;

  @override
  void onInit() {
    super.onInit();
    fetchInspections();
  }

  Future<void> fetchInspections({bool refresh = false}) async {
    if (refresh) {
      currentPage.value = 1;
      hasMore.value = true;
      inspections.clear();
    }
    
    isLoading.value = true;
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final response = await _dio.get(
        '/asset-inspections?page=${currentPage.value}',
        options: dio.Options(headers: {'Authorization': 'Bearer $token'}),
      );
      
      if (response.statusCode == 200) {
        final List<dynamic> data = response.data['data']['data'];
        
        if (refresh) {
          inspections.value = data;
        } else {
          inspections.addAll(data);
        }
        
        hasMore.value = data.isNotEmpty && response.data['data']['next_page_url'] != null;
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal memuat riwayat inspeksi aset');
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> loadMoreInspections() async {
    if (!hasMore.value || isLoadingMore.value) return;
    
    isLoadingMore.value = true;
    currentPage.value++;
    
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final response = await _dio.get(
        '/asset-inspections?page=${currentPage.value}',
        options: dio.Options(headers: {'Authorization': 'Bearer $token'}),
      );
      
      if (response.statusCode == 200) {
        final List<dynamic> data = response.data['data']['data'];
        inspections.addAll(data);
        hasMore.value = data.isNotEmpty && response.data['data']['next_page_url'] != null;
      }
    } catch (e) {
      currentPage.value--;
    } finally {
      isLoadingMore.value = false;
    }
  }
}
