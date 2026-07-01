import 'package:mobile/app/core/network/api_client.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:dio/dio.dart' as dio;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

class TaskDetailController extends GetxController {
  final task = {}.obs;
  final isLoading = true.obs;
  final isProcessing = false.obs;

  final resolutionNotesController = TextEditingController();
  final selectedImage = Rxn<File>();

  final  _dio = ApiClient.instance;

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
      
      // We can reuse the reports/{id} endpoint to get full detail
      final response = await _dio.get(
        '/reports/$id',
        options: dio.Options(headers: {'Authorization': 'Bearer $token'}),
      );
      
      if (response.statusCode == 200) {
        task.value = response.data['data'];
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal memuat detail tugas');
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> processTask() async {
    isProcessing.value = true;
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      final response = await _dio.post(
        '/tasks/${task['id']}/process',
        options: dio.Options(headers: {'Authorization': 'Bearer $token'}),
      );
      
      if (response.statusCode == 200) {
        Get.snackbar('Sukses', 'Status tugas berhasil diubah ke Proses', backgroundColor: Colors.green, colorText: Colors.white);
        fetchDetail(task['id'].toString());
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal memproses tugas');
    } finally {
      isProcessing.value = false;
    }
  }

  Future<void> pickImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.camera);
    
    if (pickedFile != null) {
      selectedImage.value = File(pickedFile.path);
    }
  }

  Future<void> resolveTask() async {
    if (selectedImage.value == null) {
      Get.snackbar('Error', 'Foto bukti penyelesaian wajib dilampirkan');
      return;
    }

    isProcessing.value = true;
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      final formData = dio.FormData.fromMap({
        'resolution_notes': resolutionNotesController.text,
        'attachment': await dio.MultipartFile.fromFile(
          selectedImage.value!.path,
          filename: 'resolution.jpg',
        ),
      });

      final response = await _dio.post(
        '/tasks/${task['id']}/resolve',
        data: formData,
        options: dio.Options(headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'multipart/form-data',
        }),
      );

      if (response.statusCode == 200) {
        Get.snackbar(
          'Sukses', 
          'Tugas berhasil diselesaikan',
          backgroundColor: Colors.green,
          colorText: Colors.white,
        );
        fetchDetail(task['id'].toString());
      }
    } on dio.DioException catch (e) {
      Get.snackbar(
        'Gagal Submit',
        e.response?.data['message'] ?? 'Terjadi kesalahan',
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
    } finally {
      isProcessing.value = false;
    }
  }

  @override
  void onClose() {
    resolutionNotesController.dispose();
    super.onClose();
  }
}
