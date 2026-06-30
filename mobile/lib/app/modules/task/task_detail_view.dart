import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'task_detail_controller.dart';

class TaskDetailView extends GetView<TaskDetailController> {
  const TaskDetailView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Detail Tugas')),
      body: Obx(() {
        if (controller.isLoading.value) {
          return const Center(child: CircularProgressIndicator());
        }
        
        final data = controller.task;
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
                      Text('Status: ${data['status'].toString().toUpperCase()}', style: TextStyle(fontWeight: FontWeight.bold, color: _getStatusColor(data['status']))),
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
              
              if (data['attachments'] != null && (data['attachments'] as List).isNotEmpty) ...[
                const SizedBox(height: 16),
                const Text('Lampiran Bukti Masalah', style: TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                SizedBox(
                  height: 200,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: (data['attachments'] as List).length,
                    itemBuilder: (context, index) {
                      final att = data['attachments'][index];
                      final url = att['file_path'].replaceAll('localhost', '10.0.2.2');
                      return Padding(
                        padding: const EdgeInsets.only(right: 8.0),
                        child: Image.network(url, width: 200, fit: BoxFit.cover),
                      );
                    },
                  ),
                )
              ],

              const SizedBox(height: 24),
              const Text('Aksi Petugas', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
              const Divider(),
              
              if (data['status'] == 'didelegasikan')
                ElevatedButton(
                  onPressed: controller.isProcessing.value ? null : controller.processTask,
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.indigo, foregroundColor: Colors.white),
                  child: controller.isProcessing.value ? const CircularProgressIndicator(color: Colors.white) : const Text('Mulai Proses Tugas'),
                )
              else if (data['status'] == 'proses')
                _buildResolveForm(context)
              else if (data['status'] == 'selesai')
                const Card(
                  color: Colors.green,
                  child: Padding(
                    padding: EdgeInsets.all(16.0),
                    child: Text('Tugas telah diselesaikan.', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  ),
                )
            ],
          ),
        );
      }),
    );
  }

  Widget _buildResolveForm(BuildContext context) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text('Form Penyelesaian', style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            TextField(
              controller: controller.resolutionNotesController,
              maxLines: 3,
              decoration: const InputDecoration(
                labelText: 'Catatan Penyelesaian (Opsional)',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            const Text('Foto Bukti Selesai (Wajib)', style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Obx(() => GestureDetector(
              onTap: controller.pickImage,
              child: Container(
                height: 150,
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  border: Border.all(color: Colors.grey),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: controller.selectedImage.value != null
                    ? Image.file(
                        controller.selectedImage.value!,
                        fit: BoxFit.cover,
                      )
                    : const Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.camera_alt, size: 50, color: Colors.grey),
                          Text('Ambil Foto Bukti Selesai'),
                        ],
                      ),
              ),
            )),
            const SizedBox(height: 24),
            Obx(() => ElevatedButton(
              onPressed: controller.isProcessing.value ? null : controller.resolveTask,
              style: ElevatedButton.styleFrom(backgroundColor: Colors.green, foregroundColor: Colors.white),
              child: controller.isProcessing.value ? const CircularProgressIndicator(color: Colors.white) : const Text('Selesaikan Tugas'),
            )),
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'didelegasikan': return Colors.purple;
      case 'proses': return Colors.indigo;
      case 'selesai': return Colors.green;
      default: return Colors.black;
    }
  }
}
