import 'package:mobile/app/core/network/api_client.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../routes/app_pages.dart';

class LoginController extends GetxController {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final isLoading = false.obs;

  final  _dio = ApiClient.instance;

  Future<void> login() async {
    if (emailController.text.isEmpty || passwordController.text.isEmpty) {
      Get.snackbar('Error', 'Email dan password tidak boleh kosong');
      return;
    }

    isLoading.value = true;
    try {
      final response = await _dio.post('/login', data: {
        'email': emailController.text,
        'password': passwordController.text,
      });

      if (response.statusCode == 200) {
        final token = response.data['token'];
        final userId = response.data['user']['id'];
        final roles = response.data['roles'] as List<dynamic>;
        
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', token);
        await prefs.setInt('user_id', userId);
        if (roles.isNotEmpty) {
          await prefs.setString('user_role', roles[0].toString());
        } else {
          await prefs.setString('user_role', 'pengguna');
        }

        Get.offAllNamed(Routes.HOME);
      }
    } on DioException catch (e) {
      Get.snackbar(
        'Login Gagal',
        e.response?.data['message'] ?? 'Terjadi kesalahan pada server',
        backgroundColor: Colors.redAccent,
        colorText: Colors.white,
      );
    } finally {
      isLoading.value = false;
    }
  }

  void goToRegister() {
    Get.toNamed(Routes.REGISTER);
  }

  @override
  void onClose() {
    emailController.dispose();
    passwordController.dispose();
    super.onClose();
  }
}
