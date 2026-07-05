import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'asset_inspection_detail_controller.dart';

class AssetInspectionDetailView extends GetView<AssetInspectionDetailController> {
  const AssetInspectionDetailView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text('Rincian Inspeksi Aset', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
        backgroundColor: const Color(0xFF047857),
        iconTheme: const IconThemeData(color: Colors.white),
        elevation: 0,
      ),
      body: Obx(() {
        if (controller.isLoading.value) {
          return const Center(child: CircularProgressIndicator(color: Color(0xFF047857)));
        }

        final inspection = controller.inspection.value;
        if (inspection.isEmpty) {
          return const Center(child: Text('Data tidak ditemukan'));
        }

        final room = inspection['room'] ?? {};
        final user = inspection['user'] ?? {};
        final details = inspection['details'] as List? ?? [];
        
        String dateStr = inspection['created_at'] ?? '';
        try {
          if (dateStr.isNotEmpty) {
            final date = DateTime.parse(dateStr).toLocal();
            dateStr = "${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year} ${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}";
          }
        } catch (_) {}

        return Column(
          children: [
            // Header Info
            Container(
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                color: Colors.white,
                border: Border(bottom: BorderSide(color: Colors.black12)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.meeting_room, color: Color(0xFF047857), size: 20),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          room['name'] ?? 'Tanpa Ruangan',
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.access_time, color: Colors.grey, size: 16),
                      const SizedBox(width: 8),
                      Text(dateStr, style: const TextStyle(color: Colors.grey, fontSize: 13)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.person, color: Colors.grey, size: 16),
                      const SizedBox(width: 8),
                      Text(user['name'] ?? 'Unknown', style: const TextStyle(color: Colors.grey, fontSize: 13)),
                    ],
                  ),
                  if (inspection['notes'] != null && inspection['notes'].toString().isNotEmpty) ...[
                    const SizedBox(height: 12),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.yellow.shade50,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.yellow.shade200),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Catatan Umum:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                          const SizedBox(height: 4),
                          Text(inspection['notes'], style: const TextStyle(fontSize: 13, fontStyle: FontStyle.italic)),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ),

            // Details List
            Expanded(
              child: details.isEmpty
                  ? const Center(child: Text('Tidak ada rincian aset.'))
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: details.length,
                      itemBuilder: (context, index) {
                        final item = details[index];
                        final isPresentStr = item['is_present'].toString();
                        final isPresent = isPresentStr == '1' || isPresentStr == 'true';
                        
                        return Card(
                          margin: const EdgeInsets.only(bottom: 12),
                          elevation: 1,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          child: Padding(
                            padding: const EdgeInsets.all(12.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Expanded(
                                      child: Text(
                                        item['asset_name'] ?? 'Unknown Asset',
                                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                                      ),
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: isPresent ? Colors.green.shade50 : Colors.red.shade50,
                                        borderRadius: BorderRadius.circular(8),
                                        border: Border.all(color: isPresent ? Colors.green : Colors.red),
                                      ),
                                      child: Text(
                                        isPresent ? 'Ada' : 'Tidak Ada',
                                        style: TextStyle(
                                          color: isPresent ? Colors.green.shade700 : Colors.red.shade700,
                                          fontWeight: FontWeight.bold,
                                          fontSize: 10,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                if (isPresent && item['condition'] != null && item['condition'].toString().isNotEmpty) ...[
                                  const SizedBox(height: 8),
                                  Row(
                                    children: [
                                      const Text('Kondisi: ', style: TextStyle(fontSize: 12, color: Colors.grey)),
                                      Text(
                                        item['condition'],
                                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
                                      ),
                                    ],
                                  ),
                                ],
                                  const SizedBox(height: 4),
                                  Text(
                                    'Catatan: ${item['notes'] != null && item['notes'].toString().isNotEmpty ? item['notes'] : '-'}',
                                    style: const TextStyle(fontSize: 12, color: Colors.blueGrey, fontStyle: FontStyle.italic),
                                  ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            ),
          ],
        );
      }),
    );
  }
}
