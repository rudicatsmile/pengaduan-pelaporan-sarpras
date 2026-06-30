import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';
import 'package:dio/dio.dart' as dio;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:io';

class GeneralReportController extends GetxController {
  final locationController = TextEditingController();
  final descriptionController = TextEditingController();
  final selectedCategoryId = 1.obs; // Default: Infrastruktur
  final categories = <Map<String, dynamic>>[
    {'id': 1, 'name': 'Infrastruktur'},
    {'id': 2, 'name': 'Kebersihan'},
    {'id': 3, 'name': 'Keamanan'},
    {'id': 4, 'name': 'Lainnya'},
  ].obs;
  
  final selectedImage = Rxn<File>();
  final isLoading = false.obs;

  final dio.Dio _dio = dio.Dio(dio.BaseOptions(
    baseUrl: 'http://10.0.2.2:8000/api',
    headers: {'Accept': 'application/json'},
  ));

  Future<void> pickImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.camera);
    
    if (pickedFile != null) {
      selectedImage.value = File(pickedFile.path);
    }
  }

  Future<void> submitReport() async {
    if (locationController.text.isEmpty) {
      Get.snackbar('Error', 'Lokasi kejadian wajib diisi');
      return;
    }
    if (descriptionController.text.isEmpty) {
      Get.snackbar('Error', 'Deskripsi tidak boleh kosong');
      return;
    }
    if (selectedImage.value == null) {
      Get.snackbar('Error', 'Foto bukti wajib dilampirkan');
      return;
    }

    isLoading.value = true;
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      final formData = dio.FormData.fromMap({
        'type': 'pelaporan_umum',
        'location_text': locationController.text,
        'category_id': selectedCategoryId.value,
        'description': descriptionController.text,
        'attachments[0]': await dio.MultipartFile.fromFile(
          selectedImage.value!.path,
          filename: 'issue_umum.jpg',
        ),
      });

      final response = await _dio.post(
        '/reports',
        data: formData,
        options: dio.Options(headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'multipart/form-data',
        }),
      );

      if (response.statusCode == 201) {
        Get.snackbar(
          'Sukses', 
          'Laporan berhasil disubmit',
          backgroundColor: Colors.green,
          colorText: Colors.white,
        );
        Get.offAllNamed('/home');
      }
    } on dio.DioException catch (e) {
      Get.snackbar(
        'Gagal Submit',
        e.response?.data['message'] ?? 'Terjadi kesalahan',
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
    } finally {
      isLoading.value = false;
    }
  }

  @override
  void onClose() {
    locationController.dispose();
    descriptionController.dispose();
    super.onClose();
  }
}
