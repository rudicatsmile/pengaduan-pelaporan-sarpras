import 'package:mobile/app/core/network/api_client.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';
import 'package:dio/dio.dart' as dio;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:io';
import 'package:flutter_image_compress/flutter_image_compress.dart';

class ReportFormController extends GetxController {
  final roomCode = ''.obs;
  final roomName = ''.obs;
  final roomId = 0.obs;
  final descriptionController = TextEditingController();
  final selectedCategoryId = 1.obs; // Default: Infrastruktur
  final categories = <Map<String, dynamic>>[].obs;
  
  final selectedImages = <File>[].obs;
  final isLoading = false.obs;

  final  _dio = ApiClient.instance;

  @override
  void onInit() {
    super.onInit();
    _fetchCategories();
    final code = Get.parameters['room_code'];
    if (code != null) {
      roomCode.value = code;
      _fetchRoomData(code);
    }
  }

  Future<void> _fetchCategories() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      final response = await _dio.get(
        '/categories',
        options: dio.Options(headers: {'Authorization': 'Bearer $token'}),
      );
      
      if (response.statusCode == 200) {
        final List<dynamic> data = response.data['data'];
        categories.value = data.map((e) => e as Map<String, dynamic>).toList();
        if (categories.isNotEmpty) {
          selectedCategoryId.value = categories.first['id'];
        }
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal memuat daftar kategori');
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
        roomName.value = response.data['data']['name'];
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal memuat data ruangan');
    }
  }

  void showImagePickerOptions(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: const Icon(Icons.camera_alt),
                title: const Text('Ambil dari Kamera'),
                onTap: () {
                  Get.back();
                  _pickImage(ImageSource.camera);
                },
              ),
              ListTile(
                leading: const Icon(Icons.photo_library),
                title: const Text('Pilih dari Galeri'),
                onTap: () {
                  Get.back();
                  _pickMultiImage();
                },
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _pickImage(ImageSource source) async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: source);
    if (pickedFile != null) {
      final compressedFile = await _compressImage(File(pickedFile.path));
      if (compressedFile != null) {
        selectedImages.add(compressedFile);
      }
    }
  }

  Future<void> _pickMultiImage() async {
    final picker = ImagePicker();
    final pickedFiles = await picker.pickMultiImage();
    if (pickedFiles.isNotEmpty) {
      for (var picked in pickedFiles) {
        final compressedFile = await _compressImage(File(picked.path));
        if (compressedFile != null) {
          selectedImages.add(compressedFile);
        }
      }
    }
  }

  Future<File?> _compressImage(File file) async {
    final lastIndex = file.absolute.path.lastIndexOf(RegExp(r'.jp'));
    final splitted = file.absolute.path.substring(0, (lastIndex));
    final outPath = "${splitted}_out${DateTime.now().millisecondsSinceEpoch}.jpg";
    
    final result = await FlutterImageCompress.compressAndGetFile(
      file.absolute.path, 
      outPath,
      quality: 70,
      minWidth: 1024,
      minHeight: 1024,
    );
    
    return result != null ? File(result.path) : null;
  }

  void removeImage(int index) {
    selectedImages.removeAt(index);
  }

  Future<void> submitReport() async {
    if (descriptionController.text.isEmpty) {
      Get.snackbar('Error', 'Deskripsi tidak boleh kosong');
      return;
    }
    if (selectedImages.isEmpty) {
      Get.snackbar('Error', 'Foto bukti wajib dilampirkan minimal 1');
      return;
    }

    isLoading.value = true;
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      final Map<String, dynamic> formMap = {
        'type': 'pengaduan_qr',
        'room_id': roomId.value,
        'category_id': selectedCategoryId.value,
        'description': descriptionController.text,
      };

      for (int i = 0; i < selectedImages.length; i++) {
        formMap['attachments[$i]'] = await dio.MultipartFile.fromFile(
          selectedImages[i].path,
          filename: 'issue_$i.jpg',
        );
      }

      final formData = dio.FormData.fromMap(formMap);

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
