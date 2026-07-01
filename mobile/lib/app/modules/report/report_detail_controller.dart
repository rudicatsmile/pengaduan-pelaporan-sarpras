import 'package:mobile/app/core/network/api_client.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ReportDetailController extends GetxController {
  final report = {}.obs;
  final petugasList = [].obs;
  final isLoading = true.obs;
  final isActionLoading = false.obs;
  final userRole = ''.obs;
  final userId = 0.obs;

  final  _dio = ApiClient.instance;

  @override
  void onInit() {
    super.onInit();
    _loadUserRole();
    final id = Get.parameters['id'];
    if (id != null) {
      fetchDetail(id);
    }
  }

  Future<void> _loadUserRole() async {
    final prefs = await SharedPreferences.getInstance();
    userRole.value = prefs.getString('user_role') ?? 'pengguna';
    userId.value = prefs.getInt('user_id') ?? 0;
  }

  Future<void> fetchDetail(String id) async {
    isLoading.value = true;
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      final response = await _dio.get(
        '/reports/$id',
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      
      if (response.statusCode == 200) {
        report.value = response.data['data'];
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal memuat detail laporan');
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> fetchPetugasList() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final response = await _dio.get(
        '/petugas',
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      if (response.statusCode == 200) {
        petugasList.value = response.data['data'];
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal memuat daftar petugas');
    }
  }

  Future<void> verifyReport() async {
    await _performAction('/reports/${report['id']}/verify', 'Laporan berhasil diverifikasi');
  }

  Future<void> delegateReport(int petugasId) async {
    await _performAction('/reports/${report['id']}/delegate', 'Laporan berhasil didelegasikan', data: {'petugas_id': petugasId});
  }

  Future<void> processReport() async {
    await _performAction('/reports/${report['id']}/process', 'Laporan mulai diproses');
  }

  Future<void> resolveReport(String notes) async {
    await _performAction('/reports/${report['id']}/resolve', 'Laporan telah diselesaikan', data: {'resolution_notes': notes});
  }

  Future<void> _performAction(String endpoint, String successMessage, {Map<String, dynamic>? data}) async {
    isActionLoading.value = true;
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      final response = await _dio.post(
        endpoint,
        data: data,
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      
      if (response.statusCode == 200) {
        Get.snackbar('Sukses', successMessage, backgroundColor: Colors.green, colorText: Colors.white);
        fetchDetail(report['id'].toString());
      }
    } catch (e) {
      Get.snackbar('Gagal', 'Terjadi kesalahan saat memproses aksi', backgroundColor: Colors.red, colorText: Colors.white);
    } finally {
      isActionLoading.value = false;
    }
  }
}
