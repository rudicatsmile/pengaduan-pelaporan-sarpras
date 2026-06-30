import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'home_controller.dart';
import 'history_controller.dart';

class HomeView extends GetView<HomeController> {
  const HomeView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Obx(() => IndexedStack(
        index: controller.currentIndex.value,
        children: [
          _buildDashboard(context),
          _buildHistory(context),
          _buildProfile(context),
        ],
      )),
      bottomNavigationBar: Obx(() => BottomNavigationBar(
        currentIndex: controller.currentIndex.value,
        onTap: controller.changePage,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.history),
            label: 'Riwayat',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profil',
          ),
        ],
      )),
      floatingActionButton: Obx(() {
        if (controller.currentIndex.value == 0) {
          return FloatingActionButton.extended(
            onPressed: () => Get.toNamed('/report/qr'), // We'll handle this route shortly
            icon: const Icon(Icons.qr_code_scanner),
            label: const Text('Scan QR'),
          );
        }
        return const SizedBox.shrink();
      }),
    );
  }

  Widget _buildDashboard(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Dashboard', style: context.textTheme.headlineMedium),
            const SizedBox(height: 20),
            Card(
              child: ListTile(
                leading: const Icon(Icons.qr_code_scanner, size: 40, color: Colors.blue),
                title: const Text('Lapor Kerusakan (QR)'),
                subtitle: const Text('Scan QR Code pada ruangan/barang'),
                onTap: () => Get.toNamed('/report/qr'),
              ),
            ),
            const SizedBox(height: 12),
            Card(
              child: ListTile(
                leading: const Icon(Icons.report, size: 40, color: Colors.orange),
                title: const Text('Pelaporan Umum'),
                subtitle: const Text('Lapor masalah tanpa QR Code'),
                onTap: () => Get.toNamed('/report/general'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHistory(BuildContext context) {
    final historyCtrl = Get.find<HistoryController>();
    return SafeArea(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Riwayat Laporan', style: context.textTheme.headlineSmall),
                IconButton(
                  icon: const Icon(Icons.refresh),
                  onPressed: historyCtrl.fetchReports,
                ),
              ],
            ),
          ),
          Expanded(
            child: Obx(() {
              if (historyCtrl.isLoading.value) {
                return const Center(child: CircularProgressIndicator());
              }
              if (historyCtrl.reports.isEmpty) {
                return const Center(child: Text('Belum ada laporan.'));
              }
              return ListView.builder(
                padding: const EdgeInsets.all(16.0),
                itemCount: historyCtrl.reports.length,
                itemBuilder: (context, index) {
                  final report = historyCtrl.reports[index];
                  return Card(
                    child: ListTile(
                      title: Text(report['category']['name'] ?? 'Laporan'),
                      subtitle: Text(
                        report['room'] != null ? report['room']['name'] : (report['location_text'] ?? '-'),
                        maxLines: 1, overflow: TextOverflow.ellipsis,
                      ),
                      trailing: _buildStatusBadge(report['status']),
                      onTap: () => Get.toNamed('/report/detail', parameters: {'id': report['id'].toString()}),
                    ),
                  );
                },
              );
            }),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color color;
    switch (status) {
      case 'diverifikasi': color = Colors.blue; break;
      case 'didelegasikan': color = Colors.purple; break;
      case 'proses': color = Colors.indigo; break;
      case 'selesai': color = Colors.green; break;
      case 'ditolak': color = Colors.red; break;
      default: color = Colors.orange; break; // menunggu
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
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            const CircleAvatar(
              radius: 50,
              child: Icon(Icons.person, size: 50),
            ),
            const SizedBox(height: 20),
            Text('User Profile', style: context.textTheme.headlineSmall),
            const SizedBox(height: 40),
            ElevatedButton.icon(
              onPressed: controller.logout,
              icon: const Icon(Icons.logout),
              label: const Text('Logout'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
              ),
            )
          ],
        ),
      ),
    );
  }
}
