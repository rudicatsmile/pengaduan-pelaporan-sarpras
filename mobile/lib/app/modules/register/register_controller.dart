import 'package:mobile/app/core/network/api_client.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../routes/app_pages.dart';

class RegisterController extends GetxController {
  final nameController = TextEditingController();
  final emailController = TextEditingController();
  final phoneController = TextEditingController();
  final passwordController = TextEditingController();
  final isLoading = false.obs;

  final  _dio = ApiClient.instance;

  Future<void> register() async {
    if (nameController.text.isEmpty || emailController.text.isEmpty || passwordController.text.isEmpty || phoneController.text.isEmpty) {
      Get.snackbar('Error', 'Nama, Email, No WhatsApp, dan Password wajib diisi');
      return;
    }

    isLoading.value = true;
    try {
      final response = await _dio.post('/register', data: {
        'name': nameController.text,
        'email': emailController.text,
        'phone': phoneController.text,
        'password': passwordController.text,
      });

      if (response.statusCode == 201) {
        final token = response.data['token'];
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', token);

        Get.offAllNamed(Routes.HOME);
      }
    } on DioException catch (e) {
      Get.snackbar(
        'Registrasi Gagal',
        e.response?.data['message'] ?? 'Terjadi kesalahan pada server',
        backgroundColor: Colors.redAccent,
        colorText: Colors.white,
      );
    } finally {
      isLoading.value = false;
    }
  }

  void goToLogin() {
    Get.back();
  }

  @override
  void onClose() {
    nameController.dispose();
    emailController.dispose();
    phoneController.dispose();
    passwordController.dispose();
    super.onClose();
  }
}
