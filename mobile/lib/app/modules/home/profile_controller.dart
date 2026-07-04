import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mobile/app/core/network/api_client.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:dio/dio.dart' as dio;

class ProfileController extends GetxController {
  final nameCtrl = TextEditingController();
  final emailCtrl = TextEditingController();
  final phoneCtrl = TextEditingController();
  
  final currentPasswordCtrl = TextEditingController();
  final newPasswordCtrl = TextEditingController();

  final isLoading = false.obs;
  final isSaving = false.obs;
  final avatarUrl = ''.obs;
  
  final selectedImageBytes = Rxn<List<int>>();
  final selectedImageName = ''.obs;

  final _dio = ApiClient.instance;

  @override
  void onInit() {
    super.onInit();
    fetchProfile();
  }

  Future<void> fetchProfile() async {
    isLoading.value = true;
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      if (token == 'guest') {
        isLoading.value = false;
        return;
      }
      
      final response = await _dio.get('/user', options: dio.Options(headers: {'Authorization': 'Bearer $token'}));
      
      if (response.statusCode == 200) {
        final user = response.data['user'];
        nameCtrl.text = user['name'] ?? '';
        emailCtrl.text = user['email'] ?? '';
        phoneCtrl.text = user['phone'] ?? '';
        if (user['avatar'] != null) {
          // Ganti localhost dengan base URL jika perlu, tapi karena baseUrl dari ApiClient
          avatarUrl.value = _dio.options.baseUrl + (user['avatar'] as String).replaceFirst('/storage', '/storage');
          // wait, baseUrl is 'http://127.0.0.1:8000/api'
          String base = _dio.options.baseUrl.replaceAll('/api', '');
          avatarUrl.value = base + user['avatar'];
        }
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal memuat profil');
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> pickImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      selectedImageBytes.value = await pickedFile.readAsBytes();
      selectedImageName.value = pickedFile.name;
    }
  }

  Future<void> saveProfile() async {
    isSaving.value = true;
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      dio.FormData formData = dio.FormData.fromMap({
        'name': nameCtrl.text,
        'email': emailCtrl.text,
        'phone': phoneCtrl.text,
      });

      if (selectedImageBytes.value != null) {
        formData.files.add(MapEntry(
          'avatar',
          dio.MultipartFile.fromBytes(selectedImageBytes.value!, filename: selectedImageName.value),
        ));
      }

      final response = await _dio.post(
        '/user/update',
        data: formData,
        options: dio.Options(headers: {'Authorization': 'Bearer $token'}),
      );

      if (response.statusCode == 200) {
        Get.snackbar('Sukses', 'Profil berhasil diperbarui', backgroundColor: Colors.green, colorText: Colors.white);
        fetchProfile();
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal memperbarui profil', backgroundColor: Colors.red, colorText: Colors.white);
    } finally {
      isSaving.value = false;
    }
  }

  Future<void> changePassword() async {
    if (currentPasswordCtrl.text.isEmpty || newPasswordCtrl.text.isEmpty) {
      Get.snackbar('Error', 'Semua field password harus diisi');
      return;
    }

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      final response = await _dio.post(
        '/user/password',
        data: {
          'current_password': currentPasswordCtrl.text,
          'new_password': newPasswordCtrl.text,
        },
        options: dio.Options(headers: {'Authorization': 'Bearer $token'}),
      );

      if (response.statusCode == 200) {
        Get.back(); // close dialog
        currentPasswordCtrl.clear();
        newPasswordCtrl.clear();
        Get.snackbar('Sukses', 'Password berhasil diubah', backgroundColor: Colors.green, colorText: Colors.white);
      }
    } on dio.DioException catch (e) {
      Get.snackbar('Error', e.response?.data['message'] ?? 'Gagal mengubah password', backgroundColor: Colors.red, colorText: Colors.white);
    }
  }
}
