import 'package:mobile/app/core/network/api_client.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class HistoryController extends GetxController {
  final reports = [].obs;
  final isLoading = true.obs;
  final dateRange = Rxn<DateTimeRange>();
  
  // Pagination
  final currentPage = 1.obs;
  final hasMore = true.obs;
  final isLoadingMore = false.obs;

  List get filteredReports {
    if (dateRange.value == null) return reports.toList();
    return reports.where((r) {
      if (r['created_at'] == null) return false;
      final createdAt = DateTime.parse(r['created_at']);
      final date = DateTime(createdAt.year, createdAt.month, createdAt.day);
      final start = DateTime(dateRange.value!.start.year, dateRange.value!.start.month, dateRange.value!.start.day);
      final end = DateTime(dateRange.value!.end.year, dateRange.value!.end.month, dateRange.value!.end.day);
      
      return (date.isAtSameMomentAs(start) || date.isAfter(start)) && 
             (date.isAtSameMomentAs(end) || date.isBefore(end));
    }).toList();
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
  }

  Future<void> fetchReports() async {
    isLoading.value = true;
    currentPage.value = 1;
    hasMore.value = true;
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      
      final response = await _dio.get(
        '/reports?page=${currentPage.value}',
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
      
      final response = await _dio.get(
        '/reports?page=${currentPage.value}',
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
