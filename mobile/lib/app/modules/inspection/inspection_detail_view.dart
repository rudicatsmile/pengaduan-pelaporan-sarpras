import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:mobile/app/core/network/api_client.dart';
import 'package:photo_view/photo_view.dart';
import 'package:photo_view/photo_view_gallery.dart';

class InspectionDetailView extends StatelessWidget {
  const InspectionDetailView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final inspection = Get.arguments;
    final apiBaseUrl = ApiClient.instance.options.baseUrl.replaceAll('/api', '');

    return Scaffold(
      appBar: AppBar(
        title: Text('Detail Inspeksi #${inspection['id']}'),
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
