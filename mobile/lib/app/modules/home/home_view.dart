import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'home_controller.dart';
import 'history_controller.dart';
import 'profile_controller.dart';
import 'package:mobile/app/modules/inspection/inspection_controller.dart' as import_inspection;
import 'package:mobile/app/modules/asset_inspection/asset_inspection_history_controller.dart';
import 'dart:typed_data';

class HomeView extends GetView<HomeController> {
  const HomeView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Get.put(ProfileController()); // Inisialisasi awal agar bisa dipakai di dashboard

    return Scaffold(
      body: Obx(() => IndexedStack(
        index: controller.currentIndex.value,
        children: [
          _buildDashboard(context),
          controller.userRole.value == 'tamu' ? _buildGuestLoginPrompt(context, 'Riwayat') : _buildHistory(context),
          controller.userRole.value == 'tamu' ? _buildGuestLoginPrompt(context, 'Profil') : _buildProfile(context),
        ],
      )),
      bottomNavigationBar: Obx(() {
        int barIndex = controller.currentIndex.value;
        if (barIndex >= 1) barIndex += 1;
        return BottomNavigationBar(
          currentIndex: barIndex,
          type: BottomNavigationBarType.fixed,
          selectedItemColor: const Color(0xFF047857),
          unselectedItemColor: Colors.grey,
          onTap: (index) {
            if (index == 1) {
              _showReportOptions(context);
            } else {
              int pageIndex = index > 1 ? index - 1 : index;
              controller.changePage(pageIndex);
            }
          },
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.add_circle_outline),
              label: 'Reports',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.history),
              label: 'History',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person),
              label: 'Profile',
            ),
          ],
        );
      }),
    );
  }

  void _showReportOptions(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (context) => SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('Buat Laporan Baru', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 20),
            ListTile(
              leading: const CircleAvatar(backgroundColor: Colors.teal, child: Icon(Icons.qr_code_scanner, color: Colors.white)),
              title: const Text('Pengaduan Sarpras (Via QR)'),
              subtitle: const Text('Scan QR Code pada fasilitas'),
              onTap: () {
                Navigator.pop(context);
                Get.toNamed('/report/qr');
              },
            ),
            const Divider(),
            ListTile(
              leading: const CircleAvatar(backgroundColor: Colors.orange, child: Icon(Icons.report, color: Colors.white)),
              title: const Text('Pengaduan Umum'),
              subtitle: const Text('Lapor masalah tanpa QR'),
              onTap: () {
                Navigator.pop(context);
                Get.toNamed('/report/general');
              },
            ),
            const Divider(),
            ListTile(
              leading: const CircleAvatar(backgroundColor: Colors.blue, child: Icon(Icons.assignment_turned_in, color: Colors.white)),
              title: const Text('Laporan Kinerja'),
              subtitle: const Text('Laporan kondisi sarana prasarana'),
              onTap: () {
                Navigator.pop(context);
                Get.toNamed('/inspection/form');
              },
            ),
            const Divider(),
            ListTile(
              leading: const CircleAvatar(backgroundColor: Colors.purple, child: Icon(Icons.inventory, color: Colors.white)),
              title: const Text('Inspeksi Aset'),
              subtitle: const Text('Inspeksi keberadaan dan kondisi aset'),
              onTap: () {
                Navigator.pop(context);
                _showAssetInspectionMethodSheet(context);
              },
            ),
          ],
        ),
      ),
      ),
    );
  }

  void _showAssetInspectionMethodSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (context) => Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Metode Inspeksi Aset', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 20),
            ListTile(
              leading: const CircleAvatar(backgroundColor: Colors.blue, child: Icon(Icons.qr_code_scanner, color: Colors.white)),
              title: const Text('Scan QR Ruangan'),
              subtitle: const Text('Inspeksi cepat dengan scan barcode ruangan'),
              onTap: () {
                Navigator.pop(context);
                Get.toNamed('/report/qr', arguments: {'destination': '/asset-inspection/form'});
              },
            ),
            const Divider(),
            ListTile(
              leading: const CircleAvatar(backgroundColor: Colors.orange, child: Icon(Icons.list_alt, color: Colors.white)),
              title: const Text('Pilih Manual'),
              subtitle: const Text('Pilih gedung dan lantai secara manual'),
              onTap: () {
                Navigator.pop(context);
                Get.toNamed('/asset-inspection/form');
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDashboard(BuildContext context) {
    if (controller.isLoading.value) {
      return const Center(child: CircularProgressIndicator());
    }



    final historyCtrl = Get.put(HistoryController());

    return SafeArea(
      child: RefreshIndicator(
        onRefresh: () async {
          await historyCtrl.fetchReports();
        },
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                width: double.infinity,
                decoration: const BoxDecoration(
                  color: Color(0xFF047857),
                  borderRadius: BorderRadius.only(
                    bottomLeft: Radius.circular(30),
                    bottomRight: Radius.circular(30),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Obx(() => Text(
                          controller.appName.value,
                          style: context.textTheme.titleMedium?.copyWith(
                            color: Colors.white.withOpacity(0.9),
                            fontWeight: FontWeight.bold,
                          ),
                        )),
                        const Icon(Icons.notifications_none, color: Colors.white),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Obx(() {
                          final profileCtrl = Get.find<ProfileController>();
                          if (profileCtrl.avatarUrl.value.isNotEmpty) {
                            return ClipRRect(
                              borderRadius: BorderRadius.circular(12),
                              child: Image.network(
                                profileCtrl.avatarUrl.value,
                                width: 48,
                                height: 48,
                                fit: BoxFit.cover,
                              ),
                            );
                          }
                          return Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: Colors.white24,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.person, color: Colors.white),
                          );
                        }),
                        const SizedBox(width: 12),
                        Obx(() => Text(
                          '${controller.userName.value}! 🌱',
                          style: context.textTheme.titleLarge?.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        )),
                      ],
                    ),
                  ],
                ),
              ),
              
              Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Text('Facility Overview', style: context.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
                    // const SizedBox(height: 16),
                    
                    InkWell(
                      onTap: () => Get.toNamed('/report/qr'),
                      child: Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: const Color(0xFF047857),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Icon(Icons.qr_code_scanner, color: Colors.white, size: 32),
                            ),
                            const SizedBox(width: 16),
                            const Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('Laporan Sarpras', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
                                  Text('Tap untuk membuat laporan', style: TextStyle(color: Colors.white70, fontSize: 12)),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    
                    Obx(() {
                      if (controller.userRoles.contains('petugas')) {
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 12.0),
                          child: InkWell(
                            onTap: () => Get.toNamed('/task/list'),
                            child: Container(
                              padding: const EdgeInsets.all(20),
                              decoration: BoxDecoration(
                                color: const Color(0xFF1D4ED8),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: Colors.white.withOpacity(0.2),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: const Icon(Icons.assignment, color: Colors.white, size: 32),
                                  ),
                                  const SizedBox(width: 16),
                                  const Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text('Daftar Tugas', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
                                        Text('Lihat tugas yang didelegasikan', style: TextStyle(color: Colors.white70, fontSize: 12)),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      }
                      return const SizedBox.shrink();
                    }),
                    const SizedBox(height: 12),
                    
                    Obx(() {
                      return GridView.count(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        crossAxisCount: 2,
                        crossAxisSpacing: 16,
                        mainAxisSpacing: 16,
                        childAspectRatio: 1.5,
                        children: [
                          _buildStatusCard(
                            title: 'Laporan aktif',
                            count: historyCtrl.activeCount.toString(),
                            icon: Icons.assignment,
                            iconColor: Colors.teal,
                          ),
                          _buildStatusCard(
                            title: 'Sedang diproses',
                            count: historyCtrl.inProgressCount.toString(),
                            icon: Icons.build,
                            iconColor: Colors.orange,
                          ),
                          _buildStatusCard(
                            title: 'Selesai',
                            count: historyCtrl.resolvedCount.toString(),
                            icon: Icons.check_circle,
                            iconColor: Colors.green,
                          ),
                          InkWell(
                            onTap: () => Get.toNamed('/report/general'),
                            child: _buildStatusCard(
                              title: 'Pelaporan Umum',
                              count: historyCtrl.mySubmissionCount.toString(),
                              icon: Icons.person,
                              iconColor: Colors.blueGrey,
                            ),
                          ),
                        ],
                      );
                    }),
                    
                    const SizedBox(height: 12),
                    
                    Text('Aktivitas Terkini', style: context.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 6),
                    Obx(() {
                      final recentReports = historyCtrl.reports.take(5).toList();
                      if (recentReports.isEmpty) {
                        return const Center(child: Text('Belum ada aktivitas'));
                      }
                      return Column(
                        children: recentReports.map((report) => _buildRecentActivityCard(report)).toList(),
                      );
                    }),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatusCard({required String title, required String count, required IconData icon, required Color iconColor}) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: Colors.black87)),
          const Spacer(),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: iconColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(icon, color: iconColor, size: 20),
              ),
              const SizedBox(width: 12),
              Text(count, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 24)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRecentActivityCard(Map<String, dynamic> report) {
    IconData icon;
    Color iconColor;
    String status = report['status'];
    
    if (status == 'selesai') {
      icon = Icons.check_circle;
      iconColor = Colors.green;
    } else if (status == 'baru') {
      icon = Icons.info;
      iconColor = Colors.teal;
    } else {
      icon = Icons.warning;
      iconColor = Colors.orange;
    }

    String roomName = report['room'] != null ? report['room']['name'] : report['location_text'] ?? 'Umum';

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 0,
      color: Colors.white,
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: iconColor.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: iconColor),
        ),
        title: Text(
          '${report['category']['name']} - $roomName',
          style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF047857)),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        subtitle: Text('Status: $status'),
        trailing: const Icon(Icons.chevron_right, color: Colors.grey),
        onTap: () => Get.toNamed('/report/detail', arguments: report['id']),
      ),
    );
  }


  Widget _buildHistory(BuildContext context) {
    return SafeArea(
      child: DefaultTabController(
        length: 3,
        initialIndex: controller.historyTabIndex.value,
        child: Column(
          children: [
            TabBar(
              labelColor: Colors.teal,
              unselectedLabelColor: Colors.grey,
              indicatorColor: Colors.teal,
              isScrollable: true,
            tabs: const [
              Tab(text: 'Pengaduan'),
              Tab(text: 'Laporan Kinerja'),
              Tab(text: 'Inspeksi Aset'),
            ],
          ),
          Expanded(
            child: TabBarView(
              children: [
                  _buildPengaduanHistory(context),
                  _buildInspectionHistory(context),
                  _buildAssetInspectionHistory(context),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPengaduanHistory(BuildContext context) {
    final historyCtrl = Get.put(HistoryController());
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Riwayat Laporan', style: context.textTheme.headlineMedium),
                    Obx(() {
                      final range = historyCtrl.dateRange.value;
                      if (range == null) return const SizedBox.shrink();
                      final start = range.start;
                      final end = range.end;
                      final startStr = "${start.day.toString().padLeft(2, '0')}/${start.month.toString().padLeft(2, '0')}/${start.year}";
                      final endStr = "${end.day.toString().padLeft(2, '0')}/${end.month.toString().padLeft(2, '0')}/${end.year}";
                      return Padding(
                        padding: const EdgeInsets.only(top: 4.0),
                        child: Text(
                          "$startStr - $endStr",
                          style: context.textTheme.bodySmall?.copyWith(color: Colors.grey[600]),
                        ),
                      );
                    }),
                  ],
                ),
                Obx(() {
                  final hasFilter = historyCtrl.dateRange.value != null;
                  return IconButton(
                    icon: Icon(
                      hasFilter ? Icons.filter_alt_off : Icons.filter_alt,
                      color: hasFilter ? Colors.red : Colors.teal,
                    ),
                    onPressed: () async {
                      if (hasFilter) {
                        historyCtrl.dateRange.value = null;
                        return;
                      }
                      final range = await showDateRangePicker(
                        context: context,
                        firstDate: DateTime(2020),
                        lastDate: DateTime.now(),
                        builder: (context, child) {
                          return Theme(
                            data: Theme.of(context).copyWith(
                              colorScheme: const ColorScheme.light(
                                primary: Colors.teal,
                                onPrimary: Colors.white,
                                onSurface: Colors.black,
                              ),
                            ),
                            child: child!,
                          );
                        },
                      );
                      if (range != null) {
                        historyCtrl.dateRange.value = range;
                      }
                    },
                  );
                }),
              ],
            ),
          ),
          Expanded(
            child: Obx(() {
              return RefreshIndicator(
                color: Colors.teal,
                onRefresh: historyCtrl.fetchReports,
                child: historyCtrl.isLoading.value && historyCtrl.reports.isEmpty
                    ? const Center(child: CircularProgressIndicator())
                    : historyCtrl.filteredReports.isEmpty
                        ? CustomScrollView(
                            physics: const AlwaysScrollableScrollPhysics(),
                            slivers: [
                              SliverFillRemaining(
                                hasScrollBody: false,
                                child: Center(child: Text(historyCtrl.dateRange.value != null ? 'Tidak ada laporan di rentang tanggal ini' : 'Belum ada laporan')),
                              ),
                            ],
                          )
                        : NotificationListener<ScrollNotification>(
                            onNotification: (ScrollNotification scrollInfo) {
                              if (!historyCtrl.isLoadingMore.value && 
                                  scrollInfo.metrics.pixels >= scrollInfo.metrics.maxScrollExtent - 50) {
                                historyCtrl.loadMoreReports();
                              }
                              return false;
                            },
                            child: ListView.builder(
                              physics: const AlwaysScrollableScrollPhysics(),
                              itemCount: historyCtrl.filteredReports.length + (historyCtrl.isLoadingMore.value ? 1 : 0),
                              itemBuilder: (context, index) {
                                if (index == historyCtrl.filteredReports.length) {
                                  return const Padding(
                                    padding: EdgeInsets.symmetric(vertical: 16),
                                    child: Center(child: CircularProgressIndicator()),
                                  );
                                }
                                final report = historyCtrl.filteredReports[index];
                                return Card(
                                  margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                  child: ListTile(
                                    title: Text(report['category']['name']),
                                    subtitle: Text(report['description'] ?? ''),
                                    trailing: _buildStatusBadge(report['status']),
                                    onTap: () => Get.toNamed('/report/detail', arguments: report['id']),
                                  ),
                                );
                              },
                            ),
                          ),
              );
            }),
          ),
        ],
      );
  }

  Widget _buildInspectionHistory(BuildContext context) {
    final inspectionCtrl = Get.put(import_inspection.InspectionController());
    return Obx(() {
      return RefreshIndicator(
        color: Colors.teal,
        onRefresh: inspectionCtrl.fetchInspections,
        child: inspectionCtrl.isLoading.value && inspectionCtrl.inspections.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : inspectionCtrl.inspections.isEmpty
                ? CustomScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    slivers: [
                      SliverFillRemaining(
                        hasScrollBody: false,
                        child: Center(child: Text('Belum ada inspeksi sarpras')),
                      ),
                    ],
                  )
                : NotificationListener<ScrollNotification>(
                    onNotification: (ScrollNotification scrollInfo) {
                      if (!inspectionCtrl.isLoadingMore.value && 
                          scrollInfo.metrics.pixels >= scrollInfo.metrics.maxScrollExtent - 50) {
                        inspectionCtrl.loadMoreInspections();
                      }
                      return false;
                    },
                    child: ListView.builder(
                      physics: const AlwaysScrollableScrollPhysics(),
                      itemCount: inspectionCtrl.inspections.length + (inspectionCtrl.isLoadingMore.value ? 1 : 0),
                      itemBuilder: (context, index) {
                        if (index == inspectionCtrl.inspections.length) {
                          return const Padding(
                            padding: EdgeInsets.symmetric(vertical: 16),
                            child: Center(child: CircularProgressIndicator()),
                          );
                        }
                        final inspection = inspectionCtrl.inspections[index];
                        return Card(
                          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          child: ListTile(
                            title: Row(
                              children: [
                                Expanded(child: Text(inspection['room']?['name'] ?? 'Tanpa Ruangan')),
                                if (inspection['is_read'] != null)
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: inspection['is_read'].toString() == '1' || inspection['is_read'] == true ? Colors.green[100] : Colors.red[100],
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                      inspection['is_read'].toString() == '1' || inspection['is_read'] == true ? 'Sudah Dibaca' : 'Belum Dibaca',
                                      style: TextStyle(
                                        fontSize: 10,
                                        color: inspection['is_read'].toString() == '1' || inspection['is_read'] == true ? Colors.green[800] : Colors.red[800],
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                            subtitle: Text(inspection['description'] ?? '', maxLines: 2, overflow: TextOverflow.ellipsis),
                            trailing: const Icon(Icons.chevron_right),
                            onTap: () {
                              final homeCtrl = Get.find<HomeController>();
                              if (homeCtrl.userRole.value == 'admin' && (inspection['is_read'] == null || inspection['is_read'].toString() == '0' || inspection['is_read'] == false)) {
                                inspectionCtrl.markAsRead(inspection['id']);
                                final idx = inspectionCtrl.inspections.indexWhere((i) => i['id'] == inspection['id']);
                                if (idx != -1) {
                                  inspectionCtrl.inspections[idx]['is_read'] = 1;
                                  inspectionCtrl.inspections.refresh();
                                }
                              }
                              Get.toNamed('/inspection/detail', arguments: inspection);
                            },
                          ),
                        );
                      },
                    ),
                  ),
      );
    });
  }

  Widget _buildAssetInspectionHistory(BuildContext context) {
    final historyCtrl = Get.put(AssetInspectionHistoryController());
    return Obx(() {
      return RefreshIndicator(
        color: Colors.teal,
        onRefresh: () => historyCtrl.fetchInspections(refresh: true),
        child: historyCtrl.isLoading.value && historyCtrl.inspections.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : historyCtrl.inspections.isEmpty
                ? CustomScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    slivers: [
                      SliverFillRemaining(
                        hasScrollBody: false,
                        child: Center(child: Text('Belum ada inspeksi aset')),
                      ),
                    ],
                  )
                : NotificationListener<ScrollNotification>(
                    onNotification: (ScrollNotification scrollInfo) {
                      if (!historyCtrl.isLoadingMore.value && 
                          scrollInfo.metrics.pixels >= scrollInfo.metrics.maxScrollExtent - 50) {
                        historyCtrl.loadMoreInspections();
                      }
                      return false;
                    },
                    child: ListView.builder(
                      physics: const AlwaysScrollableScrollPhysics(),
                      itemCount: historyCtrl.inspections.length + (historyCtrl.isLoadingMore.value ? 1 : 0),
                      itemBuilder: (context, index) {
                        if (index == historyCtrl.inspections.length) {
                          return const Padding(
                            padding: EdgeInsets.symmetric(vertical: 16),
                            child: Center(child: CircularProgressIndicator()),
                          );
                        }
                        final inspection = historyCtrl.inspections[index];
                        final roomName = inspection['room']?['name'] ?? 'Tanpa Ruangan';
                        
                        String dateStr = '';
                        if (inspection['created_at'] != null) {
                          try {
                            final date = DateTime.parse(inspection['created_at']).toLocal();
                            dateStr = "${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year} ${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}";
                          } catch (e) {
                            dateStr = inspection['created_at'];
                          }
                        }
                        
                        return Card(
                          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          child: ListTile(
                            title: Text(roomName),
                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('$dateStr - Petugas: ${inspection['user']?['name'] ?? ''}'),
                                if (inspection['notes'] != null && inspection['notes'].toString().isNotEmpty)
                                  Padding(
                                    padding: const EdgeInsets.only(top: 4.0),
                                    child: Text(
                                      '"${inspection['notes']}"',
                                      style: const TextStyle(fontSize: 12, fontStyle: FontStyle.italic, color: Colors.grey),
                                    ),
                                  ),
                              ],
                            ),
                            leading: const CircleAvatar(
                              backgroundColor: Colors.purple,
                              child: Icon(Icons.inventory, color: Colors.white, size: 20),
                            ),
                            trailing: const Icon(Icons.chevron_right),
                            onTap: () => Get.toNamed('/asset-inspection/detail', arguments: inspection['id']),
                          ),
                        );
                      },
                    ),
                  ),
      );
    });
  }

  Widget _buildStatusBadge(String status) {
    Color color;
    switch (status) {
      case 'baru':
        color = Colors.blue;
        break;
      case 'diverifikasi':
      case 'dalam_proses':
      case 'didelegasikan':
        color = Colors.orange;
        break;
      case 'selesai':
        color = Colors.green;
        break;
      case 'ditolak':
        color = Colors.red;
        break;
      default:
        color = Colors.grey;
    }
    
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color),
      ),
      child: Text(
        status.toUpperCase(),
        style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildProfile(BuildContext context) {
    final profileCtrl = Get.find<ProfileController>();

    return SafeArea(
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text('Profil Akun', style: context.textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 32),
              
              Obx(() => Stack(
                alignment: Alignment.bottomRight,
                children: [
                  CircleAvatar(
                    radius: 60,
                    backgroundColor: Colors.grey.shade200,
                    backgroundImage: profileCtrl.selectedImageBytes.value != null 
                        ? MemoryImage(Uint8List.fromList(profileCtrl.selectedImageBytes.value!)) as ImageProvider
                        : (profileCtrl.avatarUrl.value.isNotEmpty ? NetworkImage(profileCtrl.avatarUrl.value) : null),
                    child: profileCtrl.selectedImageBytes.value == null && profileCtrl.avatarUrl.value.isEmpty
                        ? const Icon(Icons.person, size: 60, color: Colors.grey)
                        : null,
                  ),
                  InkWell(
                    onTap: profileCtrl.pickImage,
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: const BoxDecoration(
                        color: Color(0xFF047857),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.camera_alt, color: Colors.white, size: 20),
                    ),
                  ),
                ],
              )),
              
              const SizedBox(height: 32),
              
              Card(
                elevation: 2,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      TextField(
                        controller: profileCtrl.nameCtrl,
                        decoration: const InputDecoration(labelText: 'Nama Lengkap', border: OutlineInputBorder(), focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Color(0xFF047857)))),
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: profileCtrl.emailCtrl,
                        decoration: const InputDecoration(labelText: 'Email', border: OutlineInputBorder(), focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Color(0xFF047857)))),
                        keyboardType: TextInputType.emailAddress,
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: profileCtrl.phoneCtrl,
                        decoration: const InputDecoration(labelText: 'Nomor Telepon', border: OutlineInputBorder(), focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Color(0xFF047857)))),
                        keyboardType: TextInputType.phone,
                      ),
                    ],
                  ),
                ),
              ),
              
              const SizedBox(height: 24),
              
              Obx(() => SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF047857),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: profileCtrl.isSaving.value ? null : profileCtrl.saveProfile,
                  child: profileCtrl.isSaving.value 
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text('Simpan Perubahan', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                ),
              )),
              
              const SizedBox(height: 16),
              
              SizedBox(
                width: double.infinity,
                child: TextButton.icon(
                  onPressed: () {
                    Get.defaultDialog(
                      title: "Ganti Password",
                      content: Column(
                        children: [
                          TextField(
                            controller: profileCtrl.currentPasswordCtrl,
                            obscureText: true,
                            decoration: const InputDecoration(labelText: 'Password Saat Ini'),
                          ),
                          const SizedBox(height: 16),
                          TextField(
                            controller: profileCtrl.newPasswordCtrl,
                            obscureText: true,
                            decoration: const InputDecoration(labelText: 'Password Baru'),
                          ),
                        ],
                      ),
                      textConfirm: "Simpan",
                      textCancel: "Batal",
                      confirmTextColor: Colors.white,
                      onConfirm: profileCtrl.changePassword,
                    );
                  },
                  icon: const Icon(Icons.lock_outline),
                  label: const Text('Ganti Password'),
                  style: TextButton.styleFrom(foregroundColor: Colors.blueGrey),
                ),
              ),
              
              const SizedBox(height: 32),
              
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton.icon(
                  onPressed: controller.logout,
                  icon: const Icon(Icons.logout),
                  label: const Text('Logout', style: TextStyle(fontSize: 16)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red.shade50,
                    foregroundColor: Colors.red,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 0,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildGuestLoginPrompt(BuildContext context, String feature) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.lock_outline, size: 80, color: Colors.grey),
            const SizedBox(height: 24),
            Text(
              'Fitur Terkunci',
              style: context.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Text(
              'Fitur $feature hanya tersedia untuk pengguna terdaftar. Silakan login atau daftar untuk mengaksesnya.',
              textAlign: TextAlign.center,
              style: const TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: () => Get.offAllNamed('/login'),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                backgroundColor: const Color(0xFF047857),
                foregroundColor: Colors.white,
              ),
              child: const Text('Login / Daftar'),
            ),
          ],
        ),
      ),
    );
  }
}
