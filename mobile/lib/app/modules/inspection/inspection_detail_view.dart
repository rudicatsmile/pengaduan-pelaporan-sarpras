import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:mobile/app/core/network/api_client.dart';
import 'package:photo_view/photo_view.dart';
import 'package:photo_view/photo_view_gallery.dart';
import 'package:mobile/app/modules/home/home_controller.dart';
import 'package:mobile/app/modules/inspection/inspection_controller.dart';

class InspectionDetailView extends StatelessWidget {
  const InspectionDetailView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final inspection = Get.arguments;
    final apiBaseUrl = ApiClient.instance.options.baseUrl.replaceAll('/api', '');

    return Scaffold(
      appBar: AppBar(
        title: Text('Kinerja Laporan #${inspection['id']}'),
        backgroundColor: Colors.teal,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildInfoRow('Pelapor', inspection['user']?['name'] ?? '-'),
            const SizedBox(height: 12),
            _buildInfoRow('Tanggal', DateFormat('dd MMM yyyy HH:mm').format(DateTime.parse(inspection['created_at']))),
            const SizedBox(height: 12),
            _buildInfoRow('Ruangan', '${inspection['room']?['name']} (${inspection['room']?['building']})'),
            const SizedBox(height: 12),
            _buildInfoRow(
              'Status Baca', 
              inspection['is_read'].toString() == '1' || inspection['is_read'] == true 
                  ? (inspection['read_by'] != null ? 'Dibaca oleh: ${inspection['read_by']['name']}' : 'Sudah Dibaca') 
                  : 'Belum Dibaca'
            ),
            const SizedBox(height: 24),
            
            Text('Deskripsi', style: context.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.grey[300]!),
              ),
              child: Text(inspection['description'] ?? '-'),
            ),
            const SizedBox(height: 24),

            Text('Galeri Foto (${inspection['images']?.length ?? 0})', style: context.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            
            if (inspection['images'] == null || inspection['images'].isEmpty)
              const Text('Tidak ada foto terlampir.')
            else
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  crossAxisSpacing: 8,
                  mainAxisSpacing: 8,
                ),
                itemCount: inspection['images'].length,
                itemBuilder: (context, index) {
                  final imgPath = inspection['images'][index]['image_path'];
                  final fullUrl = apiBaseUrl + imgPath;
                  return InkWell(
                    onTap: () => _openGallery(context, inspection['images'], index, apiBaseUrl),
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.grey[300]!),
                        image: DecorationImage(
                          image: NetworkImage(fullUrl),
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                  );
                },
              ),
            
            const SizedBox(height: 24),
            Text('Catatan Laporan Kinerja', style: context.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            GetBuilder<HomeController>(
              init: Get.find<HomeController>(),
              builder: (homeCtrl) {
                final isAdmin = homeCtrl.userRole.value == 'admin' || homeCtrl.userRole.value == 'super_admin';
                final inspectionCtrl = Get.put(InspectionController());
                final notesController = TextEditingController(text: inspection['notes'] ?? '');

                if (isAdmin) {
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      TextField(
                        controller: notesController,
                        maxLines: 4,
                        decoration: InputDecoration(
                          hintText: 'Tambahkan catatan untuk inspeksi ini...',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                          filled: true,
                          fillColor: Colors.grey[50],
                        ),
                      ),
                      const SizedBox(height: 12),
                      Obx(() => ElevatedButton.icon(
                            onPressed: inspectionCtrl.isUpdatingNotes.value 
                                ? null 
                                : () => inspectionCtrl.updateNotes(inspection['id'], notesController.text),
                            icon: inspectionCtrl.isUpdatingNotes.value 
                                ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2)) 
                                : const Icon(Icons.save),
                            label: const Text('Simpan Catatan'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.teal,
                              foregroundColor: Colors.white,
                            ),
                          )),
                    ],
                  );
                } else {
                  return Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.grey[50],
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.grey[200]!),
                    ),
                    child: Text(
                      (inspection['notes'] == null || inspection['notes'].toString().isEmpty) 
                          ? 'Tidak ada catatan.' 
                          : inspection['notes'].toString(),
                      style: TextStyle(
                        fontStyle: (inspection['notes'] == null || inspection['notes'].toString().isEmpty) ? FontStyle.italic : FontStyle.normal,
                        color: (inspection['notes'] == null || inspection['notes'].toString().isEmpty) ? Colors.grey : Colors.black87,
                      ),
                    ),
                  );
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
        const SizedBox(height: 4),
        Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500)),
      ],
    );
  }

  void _openGallery(BuildContext context, List images, int initialIndex, String apiBaseUrl) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => Scaffold(
          backgroundColor: Colors.black,
          appBar: AppBar(backgroundColor: Colors.black, foregroundColor: Colors.white),
          body: PhotoViewGallery.builder(
            itemCount: images.length,
            builder: (context, index) {
              return PhotoViewGalleryPageOptions(
                imageProvider: NetworkImage(apiBaseUrl + images[index]['image_path']),
                initialScale: PhotoViewComputedScale.contained,
                minScale: PhotoViewComputedScale.contained,
                maxScale: PhotoViewComputedScale.covered * 2,
              );
            },
            scrollPhysics: const BouncingScrollPhysics(),
            pageController: PageController(initialPage: initialIndex),
          ),
        ),
      ),
    );
  }
}
