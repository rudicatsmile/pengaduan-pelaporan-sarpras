import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mobile/app/core/network/api_client.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:dio/dio.dart' as dio;
import 'package:mobile/app/modules/home/home_controller.dart';

class InspectionController extends GetxController {
  final inspections = [].obs;
  final isLoading = true.obs;

  // Pagination
  final currentPage = 1.obs;
  final hasMore = true.obs;
  final isLoadingMore = false.obs;

  final descriptionCtrl = TextEditingController();
  final selectedBuilding = Rxn<int>();
  final selectedFloor = Rxn<int>();
  final selectedRoomId = Rxn<int>();
  
  final buildings = [].obs;
  final floors = [].obs;
  final filteredRooms = [].obs;

  final isBuildingsLoading = false.obs;
  final isFloorsLoading = false.obs;
  final isRoomsLoading = false.obs;
  
  // Multi-image
  final selectedImages = <XFile>[].obs;
  final isSubmitting = false.obs;


  final _dio = ApiClient.instance;

  @override
  void onInit() {
    super.onInit();
    fetchInspections();
    fetchBuildings();
  }

  Future<void> fetchBuildings() async {
    isBuildingsLoading.value = true;
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final response = await _dio.get('/buildings', options: dio.Options(headers: {'Authorization': 'Bearer $token'}));
      if (response.statusCode == 200) {
        buildings.value = response.data['data'];
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal memuat daftar gedung');
    } finally {
      isBuildingsLoading.value = false;
    }
  }

  Future<void> fetchFloors(int buildingId) async {
    isFloorsLoading.value = true;
    floors.clear();
    selectedFloor.value = null;
    filteredRooms.clear();
    selectedRoomId.value = null;
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final response = await _dio.get('/buildings/$buildingId/floors', options: dio.Options(headers: {'Authorization': 'Bearer $token'}));
      if (response.statusCode == 200) {
        floors.value = response.data['data'];
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal memuat daftar lantai');
    } finally {
      isFloorsLoading.value = false;
    }
  }

  Future<void> fetchRoomsByFloor(int floorId) async {
    isRoomsLoading.value = true;
    filteredRooms.clear();
    selectedRoomId.value = null;
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final response = await _dio.get('/floors/$floorId/rooms', options: dio.Options(headers: {'Authorization': 'Bearer $token'}));
      if (response.statusCode == 200) {
        filteredRooms.value = response.data['data'];
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal memuat daftar ruangan');
    } finally {
      isRoomsLoading.value = false;
    }
  }

  Future<void> fetchInspections() async {
    isLoading.value = true;
    currentPage.value = 1;
    hasMore.value = true;
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      if (token == 'guest') {
        inspections.value = [];
        hasMore.value = false;
        return;
      }
      
      final response = await _dio.get(
        '/inspections?page=${currentPage.value}',
        options: dio.Options(headers: {'Authorization': 'Bearer $token'}),
      );
      
      if (response.statusCode == 200) {
        inspections.value = response.data['data']['data'];
        hasMore.value = response.data['data']['next_page_url'] != null;
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal memuat daftar inspeksi');
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> loadMoreInspections() async {
    if (isLoadingMore.value || !hasMore.value) return;

    isLoadingMore.value = true;
    currentPage.value++;
    
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      final response = await _dio.get(
        '/inspections?page=${currentPage.value}',
        options: dio.Options(headers: {'Authorization': 'Bearer $token'}),
      );
      
      if (response.statusCode == 200) {
        final newInspections = response.data['data']['data'];
        inspections.addAll(newInspections);
        hasMore.value = response.data['data']['next_page_url'] != null;
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal memuat inspeksi tambahan');
      currentPage.value--;
    } finally {
      isLoadingMore.value = false;
    }
  }

  Future<void> pickImagesFromGallery() async {
    final picker = ImagePicker();
    final pickedFiles = await picker.pickMultiImage();
    if (pickedFiles.isNotEmpty) {
      selectedImages.addAll(pickedFiles);
    }
  }

  Future<void> pickImageFromCamera() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.camera);
    if (pickedFile != null) {
      selectedImages.add(pickedFile);
    }
  }

  void removeImage(int index) {
    selectedImages.removeAt(index);
  }

  Future<void> submitInspection() async {
    if (selectedRoomId.value == null) {
      Get.snackbar('Peringatan', 'Silakan pilih ruangan terlebih dahulu');
      return;
    }
    if (descriptionCtrl.text.isEmpty) {
      Get.snackbar('Peringatan', 'Deskripsi tidak boleh kosong');
      return;
    }
    if (selectedImages.isEmpty) {
      Get.snackbar('Peringatan', 'Harap lampirkan setidaknya 1 foto');
      return;
    }

    isSubmitting.value = true;
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      dio.FormData formData = dio.FormData.fromMap({
        'room_id': selectedRoomId.value,
        'description': descriptionCtrl.text,
      });

      for (var i = 0; i < selectedImages.length; i++) {
        formData.files.add(MapEntry(
          'images[]',
          await dio.MultipartFile.fromFile(selectedImages[i].path, filename: selectedImages[i].name),
        ));
      }

      final response = await _dio.post(
        '/inspections',
        data: formData,
        options: dio.Options(headers: {'Authorization': 'Bearer $token'}),
      );

      if (response.statusCode == 201) {
        Get.back();
        Get.snackbar('Sukses', 'Laporan inspeksi berhasil dikirim!', backgroundColor: Colors.green, colorText: Colors.white);
        fetchInspections(); // Refresh list
        descriptionCtrl.clear();
        selectedImages.clear();
        selectedBuilding.value = null;
        selectedFloor.value = null;
        selectedRoomId.value = null;
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal mengirim inspeksi', backgroundColor: Colors.red, colorText: Colors.white);
    } finally {
      isSubmitting.value = false;
    }
  }
}
