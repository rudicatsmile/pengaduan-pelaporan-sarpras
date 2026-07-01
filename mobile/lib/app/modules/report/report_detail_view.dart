import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'report_detail_controller.dart';

class ReportDetailView extends GetView<ReportDetailController> {
  const ReportDetailView({Key? key}) : super(key: key);

  void _showFullScreenImage(BuildContext context, String url) {
    Get.dialog(
      Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: EdgeInsets.zero,
        child: Stack(
          fit: StackFit.expand,
          children: [
            InteractiveViewer(
              panEnabled: true,
              minScale: 0.5,
              maxScale: 4,
              child: Image.network(url, fit: BoxFit.contain),
            ),
            Positioned(
              top: 40,
              right: 20,
              child: IconButton(
                icon: const Icon(Icons.close, color: Colors.white, size: 30),
                onPressed: () => Get.back(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showDelegateSheet(BuildContext context) {
    controller.fetchPetugasList();
    Get.bottomSheet(
      Container(
        color: Colors.white,
        padding: const EdgeInsets.all(16),
        height: 400,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Pilih Petugas', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            const SizedBox(height: 16),
            Expanded(
              child: Obx(() {
                if (controller.petugasList.isEmpty) {
                  return const Center(child: CircularProgressIndicator());
                }
                return ListView.builder(
                  itemCount: controller.petugasList.length,
                  itemBuilder: (context, index) {
                    final p = controller.petugasList[index];
                    return ListTile(
                      leading: const CircleAvatar(child: Icon(Icons.person)),
                      title: Text(p['name']),
                      subtitle: Text(p['email']),
                      onTap: () {
                        Get.back();
                        controller.delegateReport(p['id']);
                      },
                    );
                  },
                );
              }),
            ),
          ],
        ),
      ),
    );
  }

  void _showResolveDialog(BuildContext context) {
    final notesController = TextEditingController();
    Get.defaultDialog(
      title: 'Selesaikan Laporan',
      content: Padding(
        padding: const EdgeInsets.all(8.0),
        child: TextField(
          controller: notesController,
          maxLines: 3,
          decoration: const InputDecoration(
            hintText: 'Masukkan catatan penyelesaian',
            border: OutlineInputBorder(),
          ),
        ),
      ),
      confirm: ElevatedButton(
        onPressed: () {
          if (notesController.text.isEmpty) {
            Get.snackbar('Error', 'Catatan tidak boleh kosong');
            return;
          }
          Get.back();
          controller.resolveReport(notesController.text);
        },
        child: const Text('Simpan'),
      ),
      cancel: TextButton(onPressed: () => Get.back(), child: const Text('Batal')),
    );
  }

  Widget _buildActionSection(BuildContext context, String status, dynamic data) {
    if (controller.isActionLoading.value) {
      return const Center(child: CircularProgressIndicator());
    }

    final role = controller.userRole.value;
    final userId = controller.userId.value;
    final assignedTo = data['assigned_to'];

    Widget? actionWidget;

    if (status == 'baru' && role == 'admin') {
      actionWidget = ElevatedButton(
        onPressed: () => controller.verifyReport(),
        style: ElevatedButton.styleFrom(backgroundColor: Colors.blue),
        child: const Text('Verifikasi Laporan', style: TextStyle(color: Colors.white)),
      );
    } else if (status == 'diverifikasi' && role == 'admin') {
      actionWidget = ElevatedButton(
        onPressed: () => _showDelegateSheet(context),
        style: ElevatedButton.styleFrom(backgroundColor: Colors.purple),
        child: const Text('Delegasikan', style: TextStyle(color: Colors.white)),
      );
    } else if (status == 'didelegasikan') {
      if (userId == assignedTo || role == 'admin') {
        actionWidget = ElevatedButton(
          onPressed: () => controller.processReport(),
          style: ElevatedButton.styleFrom(backgroundColor: Colors.orange),
          child: const Text('Mulai Kerjakan', style: TextStyle(color: Colors.white)),
        );
      }
    } else if (status == 'dalam_proses') {
      if (userId == assignedTo || role == 'admin') {
        actionWidget = ElevatedButton(
          onPressed: () => _showResolveDialog(context),
          style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
          child: const Text('Selesaikan Laporan', style: TextStyle(color: Colors.white)),
        );
      }
    }

    if (actionWidget == null) return const SizedBox.shrink();

    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      padding: const EdgeInsets.all(16),
      margin: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Aksi Anda', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 12),
          SizedBox(width: double.infinity, height: 48, child: actionWidget),
        ],
      ),
    );
  }

  Widget _buildTimeline(String currentStatus) {
    final steps = ['baru', 'diverifikasi', 'didelegasikan', 'dalam_proses', 'selesai'];
    final labels = ['Laporan Dibuat', 'Diverifikasi Admin', 'Didelegasikan ke Petugas', 'Sedang Dikerjakan', 'Selesai'];
    final currentIndex = steps.indexOf(currentStatus);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: List.generate(steps.length, (index) {
        final isCompleted = index <= currentIndex;
        final isLast = index == steps.length - 1;

        return Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Column(
              children: [
                Container(
                  width: 24,
                  height: 24,
                  decoration: BoxDecoration(
                    color: isCompleted ? Colors.green : Colors.grey[300],
                    shape: BoxShape.circle,
                  ),
                  child: isCompleted
                      ? const Icon(Icons.check, size: 16, color: Colors.white)
                      : null,
                ),
                if (!isLast)
                  Container(
                    width: 2,
                    height: 40,
                    color: isCompleted ? Colors.green : Colors.grey[300],
                  ),
              ],
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.only(top: 2),
                child: Text(
                  labels[index],
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: isCompleted ? FontWeight.bold : FontWeight.normal,
                    color: isCompleted ? Colors.black87 : Colors.grey,
                  ),
                ),
              ),
            ),
          ],
        );
      }),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: const Text('Detail Laporan'),
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
      ),
      body: Obx(() {
        if (controller.isLoading.value) {
          return const Center(child: CircularProgressIndicator());
        }
        
        final data = controller.report;
        if (data.isEmpty) {
          return const Center(child: Text('Data tidak ditemukan'));
        }

        final status = data['status']?.toString() ?? 'baru';

        return SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Aksi Section for Admin/Petugas
              if (controller.userRole.value != 'pengguna')
                _buildActionSection(context, status, data),

              // Info Card
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4))
                  ],
                ),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Informasi Masalah', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.blue[50],
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            status.toUpperCase(),
                            style: TextStyle(fontWeight: FontWeight.bold, color: Colors.blue[700], fontSize: 12),
                          ),
                        ),
                      ],
                    ),
                    const Divider(height: 24),
                    Text('Kategori: ${data['category']?['name'] ?? '-'}', style: const TextStyle(color: Colors.black87)),
                    const SizedBox(height: 4),
                    Text('Lokasi: ${data['room'] != null ? data['room']['name'] : (data['location_text'] ?? '-')}', style: const TextStyle(color: Colors.black87)),
                    const SizedBox(height: 12),
                    const Text('Deskripsi:', style: TextStyle(fontWeight: FontWeight.w600, color: Colors.black54, fontSize: 12)),
                    const SizedBox(height: 4),
                    Text(data['description'] ?? '-', style: const TextStyle(fontSize: 14)),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Lampiran
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4))
                  ],
                ),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Lampiran Foto', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    const SizedBox(height: 12),
                    if (data['attachments'] != null && (data['attachments'] as List).isNotEmpty)
                      SizedBox(
                        height: 120,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          itemCount: (data['attachments'] as List).length,
                          itemBuilder: (context, index) {
                            final att = data['attachments'][index];
                            // Replace localhost to 192.168.27.177 for android emulator
                            final url = att['file_path'].replaceAll('localhost', '192.168.27.177');
                            return GestureDetector(
                              onTap: () => _showFullScreenImage(context, url),
                              child: Container(
                                width: 120,
                                margin: const EdgeInsets.only(right: 12),
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(8),
                                  image: DecorationImage(
                                    image: NetworkImage(url),
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                      )
                    else
                      const Text('Tidak ada lampiran', style: TextStyle(color: Colors.grey)),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Timeline
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4))
                  ],
                ),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Pelacakan Status', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    const SizedBox(height: 16),
                    _buildTimeline(status),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Riwayat Aktivitas Log
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4))
                  ],
                ),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Log Aktivitas Detail', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    const SizedBox(height: 12),
                    if (data['activities'] != null && (data['activities'] as List).isNotEmpty)
                      ...((data['activities'] as List).map((act) => Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Icon(Icons.info_outline, size: 16, color: Colors.blue),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(act['action'], style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
                                  Text(act['created_at'], style: const TextStyle(fontSize: 11, color: Colors.grey)),
                                ],
                              ),
                            ),
                          ],
                        ),
                      )).toList())
                    else
                      const Text('Belum ada log aktivitas', style: TextStyle(color: Colors.grey)),
                  ],
                ),
              ),
            ],
          ),
        );
      }),
    );
  }
}
