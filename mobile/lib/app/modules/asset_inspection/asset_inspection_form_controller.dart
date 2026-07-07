import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/app/core/network/api_client.dart';
import 'package:dio/dio.dart' as dio;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile/app/modules/home/home_controller.dart' as import_home;
import 'package:mobile/app/routes/app_pages.dart';

class AssetInspectionFormController extends GetxController {
  final _dio = ApiClient.instance;

  final isLoadingBuildings = false.obs;
  final isLoadingFloors = false.obs;
  final isLoadingRooms = false.obs;
  final isLoadingAssets = false.obs;
  final isSubmitting = false.obs;

  // Scan Mode state
  final isScanMode = false.obs;
  final scannedRoomName = ''.obs;

  final buildings = <Map<String, dynamic>>[].obs;
  final floors = <Map<String, dynamic>>[].obs;
  final rooms = <Map<String, dynamic>>[].obs;
  
  final selectedBuildingId = Rx<int?>(null);
  final selectedFloorId = Rx<int?>(null);
  final selectedRoomId = Rx<int?>(null);

  final notesController = TextEditingController();

  final assetsList = <Map<String, dynamic>>[].obs;

  @override
  void onInit() {
    super.onInit();
    final roomCode = Get.parameters['room_code'];
    if (roomCode != null && roomCode.isNotEmpty) {
      isScanMode.value = true;
      _fetchRoomByCode(roomCode);
    } else {
      _fetchBuildings();
    }
  }

  Future<void> _fetchRoomByCode(String code) async {
    isLoadingRooms.value = true;
    try {
      final response = await _dio.get('/rooms/$code');
      if (response.statusCode == 200) {
        final data = response.data['data'];
        selectedRoomId.value = data['id'];
        
        String buildingName = data['floor']?['building']?['name'] ?? '';
        String floorName = data['floor']?['name'] ?? '';
        String locationText = buildingName.isNotEmpty ? ' ($floorName - $buildingName)' : '';
        
        scannedRoomName.value = '${data['name']}$locationText';
        await fetchAssets(data['id']);
      }
    } catch (e) {
      Get.snackbar('Error', 'Ruangan tidak ditemukan atau kode QR tidak valid',
          backgroundColor: Colors.red, colorText: Colors.white);
      Get.back();
    } finally {
      isLoadingRooms.value = false;
    }
  }

  Future<void> _fetchBuildings() async {
    isLoadingBuildings.value = true;
    try {
      final response = await _dio.get('/buildings');
      if (response.statusCode == 200) {
        final List<dynamic> data = response.data['data'];
        buildings.value = data.map((e) => e as Map<String, dynamic>).toList();
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal mengambil data gedung',
          backgroundColor: Colors.red, colorText: Colors.white);
    } finally {
      isLoadingBuildings.value = false;
    }
  }

  Future<void> fetchFloors(int buildingId) async {
    selectedBuildingId.value = buildingId;
    selectedFloorId.value = null;
    selectedRoomId.value = null;
    floors.clear();
    rooms.clear();
    assetsList.clear();

    isLoadingFloors.value = true;
    try {
      final response = await _dio.get('/buildings/$buildingId/floors');
      if (response.statusCode == 200) {
        final List<dynamic> data = response.data['data'];
        floors.value = data.map((e) => e as Map<String, dynamic>).toList();
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal mengambil data lantai',
          backgroundColor: Colors.red, colorText: Colors.white);
    } finally {
      isLoadingFloors.value = false;
    }
  }

  Future<void> fetchRooms(int floorId) async {
    selectedFloorId.value = floorId;
    selectedRoomId.value = null;
    rooms.clear();
    assetsList.clear();

    isLoadingRooms.value = true;
    try {
      final response = await _dio.get('/floors/$floorId/rooms');
      if (response.statusCode == 200) {
        final List<dynamic> data = response.data['data'];
        rooms.value = data.map((e) => e as Map<String, dynamic>).toList();
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal mengambil data ruangan',
          backgroundColor: Colors.red, colorText: Colors.white);
    } finally {
      isLoadingRooms.value = false;
    }
  }

  Future<void> fetchAssets(int roomId) async {
    selectedRoomId.value = roomId;
    assetsList.clear();

    isLoadingAssets.value = true;
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      final response = await _dio.get(
        '/asset-inspections/get-assets',
        queryParameters: {'room_id': roomId},
        options: dio.Options(headers: {'Authorization': 'Bearer $token'}),
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data['data'];
        assetsList.value = data.map((e) => {
          'asset_id': e['IDT'].toString(),
          'asset_name': e['Nm_Aset'],
          'is_present': true,
          'condition': 'baik',
          'notes': '',
        }).toList();
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal mengambil data aset',
          backgroundColor: Colors.red, colorText: Colors.white);
    } finally {
      isLoadingAssets.value = false;
    }
  }

  void updateAssetField(int index, String field, dynamic value) {
    final asset = Map<String, dynamic>.from(assetsList[index]);
    asset[field] = value;
    assetsList[index] = asset;
  }

  Future<void> submitInspection() async {
    if (selectedRoomId.value == null) {
      Get.snackbar('Peringatan', 'Silakan pilih ruangan',
          backgroundColor: Colors.orange, colorText: Colors.white);
      return;
    }
    
    if (assetsList.isEmpty) {
      Get.snackbar('Peringatan', 'Tidak ada aset untuk diinspeksi',
          backgroundColor: Colors.orange, colorText: Colors.white);
      return;
    }

    isSubmitting.value = true;
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      final payload = {
        'room_id': selectedRoomId.value,
        'notes': notesController.text,
        'assets': assetsList,
      };

      final response = await _dio.post(
        '/asset-inspections',
        data: payload,
        options: dio.Options(headers: {'Authorization': 'Bearer $token'}),
      );

      if (response.statusCode == 201) {
        Get.snackbar('Sukses', 'Inspeksi aset berhasil disimpan',
            backgroundColor: Colors.green, colorText: Colors.white);
        
        // Ensure HomeController switches to history tab
        if (Get.isRegistered<import_home.HomeController>()) {
          final homeCtrl = Get.find<import_home.HomeController>();
          homeCtrl.changePage(1); // 1 is history
          homeCtrl.historyTabController.animateTo(2); // 2 is Asset Inspection tab
        }
        
        Get.until((route) => route.settings.name == Routes.HOME || route.isFirst);
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal menyimpan inspeksi',
          backgroundColor: Colors.red, colorText: Colors.white);
    } finally {
      isSubmitting.value = false;
    }
  }
}
