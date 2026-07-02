import 'dart:io';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'inspection_controller.dart';
import 'package:mobile/app/modules/home/home_controller.dart';
import 'package:dropdown_search/dropdown_search.dart';

class InspectionFormView extends GetView<InspectionController> {
  const InspectionFormView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Pastikan controller di-inisialisasi
    if (!Get.isRegistered<InspectionController>()) {
      Get.put(InspectionController());
    }
    
    final homeCtrl = Get.find<HomeController>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Buat Inspeksi Sarpras', style: TextStyle(color: Colors.white)),
        backgroundColor: Colors.teal,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Obx(() {
        if (controller.isRoomsLoading.value) {
          return const Center(child: CircularProgressIndicator());
        }

        return SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Gedung', style: context.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Obx(() => controller.isBuildingsLoading.value 
                ? const CircularProgressIndicator()
                : DropdownButtonFormField<int>(
                    decoration: const InputDecoration(border: OutlineInputBorder(), prefixIcon: Icon(Icons.business)),
                    hint: const Text('Pilih Gedung'),
                    value: controller.selectedBuilding.value,
                    items: controller.buildings.map((b) => DropdownMenuItem<int>(value: b['id'], child: Text(b['name']))).toList(),
                    onChanged: (val) {
                      if (val != null) {
                        controller.selectedBuilding.value = val;
                        controller.fetchFloors(val);
                      }
                    },
                  )
              ),
              const SizedBox(height: 16),

              Text('Lantai', style: context.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Obx(() => controller.isFloorsLoading.value
                ? const CircularProgressIndicator()
                : DropdownButtonFormField<int>(
                    decoration: const InputDecoration(border: OutlineInputBorder(), prefixIcon: Icon(Icons.layers)),
                    hint: const Text('Pilih Lantai'),
                    value: controller.selectedFloor.value,
                    items: controller.floors.map((f) => DropdownMenuItem<int>(value: f['id'], child: Text(f['name']))).toList(),
                    onChanged: controller.selectedBuilding.value == null ? null : (val) {
                      if (val != null) {
                        controller.selectedFloor.value = val;
                        controller.fetchRoomsByFloor(val);
                      }
                    },
                  )
              ),
              const SizedBox(height: 16),

              Text('Ruangan', style: context.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Obx(() => controller.isRoomsLoading.value
                ? const CircularProgressIndicator()
                : DropdownButtonFormField<int>(
                    decoration: const InputDecoration(border: OutlineInputBorder(), prefixIcon: Icon(Icons.meeting_room)),
                    hint: const Text('Pilih Ruangan'),
                    isExpanded: true,
                    value: controller.selectedRoomId.value,
                    items: controller.filteredRooms.map((r) => DropdownMenuItem<int>(
                      value: r['id'],
                      child: Text(r['name'], overflow: TextOverflow.ellipsis),
                    )).toList(),
                    onChanged: controller.selectedFloor.value == null ? null : (val) {
                      controller.selectedRoomId.value = val;
                    },
                  )
              ),

              const SizedBox(height: 16),
              
              Text('Deskripsi Inspeksi', style: context.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              TextField(
                controller: controller.descriptionCtrl,
                maxLines: 4,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  hintText: 'Jelaskan kondisi sarana & prasarana yang ada...',
                ),
              ),

              const SizedBox(height: 16),

              Text('Lampiran Foto', style: context.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              
              Obx(() {
                return GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    crossAxisSpacing: 8,
                    mainAxisSpacing: 8,
                  ),
                  itemCount: controller.selectedImages.length + 1,
                  itemBuilder: (context, index) {
                    if (index == controller.selectedImages.length) {
                      return InkWell(
                        onTap: () => _showPhotoPickerOptions(context, controller),
                        child: Container(
                          decoration: BoxDecoration(
                            border: Border.all(color: Colors.teal),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Center(
                            child: Icon(Icons.add_a_photo, color: Colors.teal, size: 32),
                          ),
                        ),
                      );
                    }

                    return Stack(
                      children: [
                        Container(
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(8),
                            image: DecorationImage(
                              image: FileImage(File(controller.selectedImages[index].path)),
                              fit: BoxFit.cover,
                            ),
                          ),
                        ),
                        Positioned(
                          top: -8,
                          right: -8,
                          child: IconButton(
                            icon: const Icon(Icons.remove_circle, color: Colors.red),
                            onPressed: () => controller.removeImage(index),
                          ),
                        ),
                      ],
                    );
                  },
                );
              }),

              const SizedBox(height: 32),

              Obx(() {
                return SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    onPressed: controller.isSubmitting.value ? null : () => controller.submitInspection(),
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.teal),
                    child: controller.isSubmitting.value
                        ? const CircularProgressIndicator(color: Colors.white)
                        : const Text('Kirim Inspeksi', style: TextStyle(fontSize: 16, color: Colors.white)),
                  ),
                );
              }),
            ],
          ),
        );
      }),
    );
  }

  void _showPhotoPickerOptions(BuildContext context, InspectionController controller) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(16))),
      builder: (context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: const Icon(Icons.camera_alt),
                title: const Text('Ambil Foto (Kamera)'),
                onTap: () {
                  Navigator.pop(context);
                  controller.pickImageFromCamera();
                },
              ),
              ListTile(
                leading: const Icon(Icons.photo_library),
                title: const Text('Pilih dari Galeri'),
                onTap: () {
                  Navigator.pop(context);
                  controller.pickImagesFromGallery();
                },
              ),
            ],
          ),
        );
      },
    );
  }
}
