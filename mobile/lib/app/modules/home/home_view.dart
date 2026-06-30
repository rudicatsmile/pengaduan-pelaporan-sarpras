import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'home_controller.dart';

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
                leading: const Icon(Icons.report, size: 40, color: Colors.blue),
                title: const Text('Lapor Kerusakan'),
                subtitle: const Text('Scan QR Code pada ruangan/barang'),
                onTap: () => Get.toNamed('/report/qr'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHistory(BuildContext context) {
    return SafeArea(
      child: Center(
        child: Text('Riwayat Laporan (Fase 2)', style: context.textTheme.headlineSmall),
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
