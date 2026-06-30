import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';
import 'package:dio/dio.dart' as dio;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:io';

class ReportFormController extends GetxController {
  final roomCode = ''.obs;
  final roomId = 0.obs;
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
    baseUrl: 'http://10.0.2.2:8000/api', // Android Emulator localhost
    headers: {'Accept': 'application/json'},
  ));

  @override
  void onInit() {
    super.onInit();
    final code = Get.parameters['room_code'];
    if (code != null) {
      roomCode.value = code;
      _fetchRoomData(code);
    }
  }

  Future<void> _fetchRoomData(String code) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      final response = await _dio.get(
        '/rooms/$code',
        options: dio.Options(headers: {'Authorization': 'Bearer $token'}),
      );
      
      if (response.statusCode == 200) {
        roomId.value = response.data['data']['id'];
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal memuat data ruangan');
    }
  }

  Future<void> pickImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.camera);
    
    if (pickedFile != null) {
      selectedImage.value = File(pickedFile.path);
    }
  }

  Future<void> submitReport() async {
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
        'type': 'pengaduan_qr',
        'room_id': roomId.value,
        'category_id': selectedCategoryId.value,
        'description': descriptionController.text,
        'attachments[0]': await dio.MultipartFile.fromFile(
          selectedImage.value!.path,
          filename: 'issue.jpg',
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
    descriptionController.dispose();
    super.onClose();
  }
}
