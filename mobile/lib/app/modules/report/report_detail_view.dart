import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'report_detail_controller.dart';

class ReportDetailView extends GetView<ReportDetailController> {
  const ReportDetailView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Detail Laporan')),
      body: Obx(() {
        if (controller.isLoading.value) {
          return const Center(child: CircularProgressIndicator());
        }
        
        final data = controller.report;
        if (data.isEmpty) {
          return const Center(child: Text('Data tidak ditemukan'));
        }

        return SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Status: ${data['status'].toString().toUpperCase()}', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.blue)),
                      const SizedBox(height: 8),
                      Text('Kategori: ${data['category']?['name'] ?? '-'}'),
                      Text('Lokasi: ${data['room'] != null ? data['room']['name'] : (data['location_text'] ?? '-')}'),
                      const SizedBox(height: 16),
                      const Text('Deskripsi:', style: TextStyle(fontWeight: FontWeight.bold)),
                      Text(data['description'] ?? '-'),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Text('Lampiran', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              if (data['attachments'] != null && (data['attachments'] as List).isNotEmpty)
                SizedBox(
                  height: 200,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: (data['attachments'] as List).length,
                    itemBuilder: (context, index) {
                      final att = data['attachments'][index];
                      // Replace localhost to 10.0.2.2 for android emulator
                      final url = att['file_path'].replaceAll('localhost', '10.0.2.2');
                      return Padding(
                        padding: const EdgeInsets.only(right: 8.0),
                        child: Image.network(url, width: 200, fit: BoxFit.cover),
                      );
                    },
                  ),
                )
              else
                const Text('Tidak ada lampiran'),
                
              const SizedBox(height: 16),
              const Text('Riwayat Aktivitas', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              if (data['activities'] != null && (data['activities'] as List).isNotEmpty)
                ...((data['activities'] as List).map((act) => ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.history, color: Colors.blue),
                  title: Text(act['action']),
                  subtitle: Text(act['created_at']),
                )).toList())
              else
                const Text('Belum ada aktivitas'),
            ],
          ),
        );
      }),
    );
  }
}
