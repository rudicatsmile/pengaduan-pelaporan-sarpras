import 'package:mobile/app/core/network/api_client.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class HistoryController extends GetxController {
  final reports = [].obs;
  final isLoading = true.obs;
  final dateRange = Rxn<DateTimeRange>();
  
  final selectedFilterBuildingId = Rxn<dynamic>();
  final selectedFilterJobCategoryId = Rxn<int>();
  final buildings = [].obs;
  final jobCategories = [].obs;
  
  // Pagination
  final currentPage = 1.obs;
  final hasMore = true.obs;
  final isLoadingMore = false.obs;

  List get filteredReports {
    return reports.toList();
  }

  int get activeCount => reports.where((r) => r['status'] == 'baru').length;
  int get inProgressCount => reports.where((r) => r['status'] == 'dalam_proses' || r['status'] == 'didelegasikan' || r['status'] == 'diverifikasi').length;
  int get resolvedCount => reports.where((r) => r['status'] == 'selesai').length;
  int get mySubmissionCount => reports.where((r) => r['type'] == 'pelaporan_umum').length;

  final  _dio = ApiClient.instance;

  @override
  void onInit() {
    super.onInit();
    fetchReports();
    fetchBuildings();
    fetchJobCategories();
  }

  Future<void> fetchBuildings() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final response = await _dio.get('/buildings', options: Options(headers: {'Authorization': 'Bearer $token'}));
      if (response.statusCode == 200) {
        buildings.value = response.data['data'];
      }
    } catch (e) {
      print('Gagal memuat daftar gedung: $e');
    }
  }

  Future<void> fetchJobCategories() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final response = await _dio.get('/job-categories', options: Options(headers: {'Authorization': 'Bearer $token'}));
      if (response.statusCode == 200) {
        jobCategories.value = response.data['data'];
      }
    } catch (e) {
      print('Gagal memuat kategori jabatan: $e');
    }
  }

  void clearFilters() {
    selectedFilterBuildingId.value = null;
    selectedFilterJobCategoryId.value = null;
    dateRange.value = null;
    fetchReports();
  }

  Future<void> fetchReports() async {
    isLoading.value = true;
    currentPage.value = 1;
    hasMore.value = true;
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      if (token == 'guest') {
        reports.value = [];
        hasMore.value = false;
        return;
      }
      
      String url = '/reports?page=${currentPage.value}';
      if (selectedFilterBuildingId.value != null) {
        url += '&building_id=${selectedFilterBuildingId.value}';
      }
      if (selectedFilterJobCategoryId.value != null) {
        url += '&job_category_id=${selectedFilterJobCategoryId.value}';
      }
      if (dateRange.value != null) {
        final start = "${dateRange.value!.start.year}-${dateRange.value!.start.month.toString().padLeft(2, '0')}-${dateRange.value!.start.day.toString().padLeft(2, '0')}";
        final end = "${dateRange.value!.end.year}-${dateRange.value!.end.month.toString().padLeft(2, '0')}-${dateRange.value!.end.day.toString().padLeft(2, '0')}";
        url += '&start_date=$start&end_date=$end';
      }

      final response = await _dio.get(
        url,
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      
      if (response.statusCode == 200) {
        reports.value = response.data['data']['data'];
        hasMore.value = response.data['data']['next_page_url'] != null;
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal memuat riwayat laporan');
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> loadMoreReports() async {
    if (isLoadingMore.value || !hasMore.value) return;

    isLoadingMore.value = true;
    currentPage.value++;
    
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      String url = '/reports?page=${currentPage.value}';
      if (selectedFilterBuildingId.value != null) {
        url += '&building_id=${selectedFilterBuildingId.value}';
      }
      if (selectedFilterJobCategoryId.value != null) {
        url += '&job_category_id=${selectedFilterJobCategoryId.value}';
      }
      if (dateRange.value != null) {
        final start = "${dateRange.value!.start.year}-${dateRange.value!.start.month.toString().padLeft(2, '0')}-${dateRange.value!.start.day.toString().padLeft(2, '0')}";
        final end = "${dateRange.value!.end.year}-${dateRange.value!.end.month.toString().padLeft(2, '0')}-${dateRange.value!.end.day.toString().padLeft(2, '0')}";
        url += '&start_date=$start&end_date=$end';
      }

      final response = await _dio.get(
        url,
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      
      if (response.statusCode == 200) {
        final newReports = response.data['data']['data'];
        reports.addAll(newReports);
        hasMore.value = response.data['data']['next_page_url'] != null;
      }
    } catch (e) {
      Get.snackbar('Error', 'Gagal memuat riwayat tambahan');
      currentPage.value--;
    } finally {
      isLoadingMore.value = false;
    }
  }
}
