import 'package:get/get.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class TaskListController extends GetxController {
  final tasks = [].obs;
  final isLoading = true.obs;

  final Dio _dio = Dio(BaseOptions(
    baseUrl: 'http://10.0.2.2:8000/api',
    headers: {'Accept': 'application/json'},
  ));

  @override
  void onInit() {
    super.onInit();
    fetchTasks();
  }

  Future<void> fetchTasks() async {
    isLoading.value = true;
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      final response = await _dio.get(
        '/tasks',
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      
      if (response.statusCode == 200) {
        tasks.value = response.data['data'];
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal memuat tugas');
    } finally {
      isLoading.value = false;
    }
  }
}
