import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'general_report_controller.dart';
import 'dart:io';

class GeneralReportView extends GetView<GeneralReportController> {
  const GeneralReportView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pelaporan Umum'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text('Lokasi Kejadian (Teks/Deskripsi)', style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            TextField(
              controller: controller.locationController,
              decoration: const InputDecoration(
                hintText: 'Contoh: Halaman Depan Kampus, Dekat Pos Satpam',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            const Text('Kategori Masalah', style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Obx(() => DropdownButtonFormField<int>(
              value: controller.selectedCategoryId.value,
              decoration: const InputDecoration(border: OutlineInputBorder()),
              items: controller.categories.map((cat) {
                return DropdownMenuItem<int>(
                  value: cat['id'],
                  child: Text(cat['name']),
                );
              }).toList(),
              onChanged: (val) {
                if (val != null) controller.selectedCategoryId.value = val;
              },
            )),
            const SizedBox(height: 16),
            const Text('Deskripsi Masalah', style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            TextField(
              controller: controller.descriptionController,
              maxLines: 4,
              decoration: const InputDecoration(
                hintText: 'Jelaskan masalah secara detail...',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            const Text('Foto Bukti (Wajib)', style: TextStyle(fontWeight: FontWeight.bold)),
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
                          Text('Ambil Foto'),
                        ],
                      ),
              ),
            )),
            const SizedBox(height: 24),
            Obx(() => ElevatedButton(
              onPressed: controller.isLoading.value ? null : controller.submitReport,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                backgroundColor: context.theme.colorScheme.primary,
                foregroundColor: context.theme.colorScheme.onPrimary,
              ),
              child: controller.isLoading.value
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text('Kirim Laporan Umum', style: TextStyle(fontSize: 16)),
            )),
          ],
        ),
      ),
    );
  }
}
