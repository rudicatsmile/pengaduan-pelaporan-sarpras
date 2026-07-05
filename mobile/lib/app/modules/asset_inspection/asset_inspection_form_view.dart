import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'asset_inspection_form_controller.dart';

class AssetInspectionFormView extends GetView<AssetInspectionFormController> {
  const AssetInspectionFormView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Inspeksi Aset'),
        backgroundColor: const Color(0xFF047857),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Buat Inspeksi Aset Baru',
                style: context.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 20),

              // Gedung Dropdown
              Obx(() => DropdownButtonFormField<int>(
                isExpanded: true,
                decoration: const InputDecoration(
                  labelText: 'Pilih Gedung',
                  border: OutlineInputBorder(),
                ),
                value: controller.selectedBuildingId.value,
                items: controller.buildings.map((b) {
                  return DropdownMenuItem<int>(
                    value: b['id'],
                    child: Text(b['name']),
                  );
                }).toList(),
                onChanged: (val) {
                  if (val != null) controller.fetchFloors(val);
                },
              )),
              const SizedBox(height: 16),

              // Lantai Dropdown
              Obx(() => DropdownButtonFormField<int>(
                isExpanded: true,
                decoration: const InputDecoration(
                  labelText: 'Pilih Lantai',
                  border: OutlineInputBorder(),
                ),
                value: controller.selectedFloorId.value,
                items: controller.floors.map((f) {
                  return DropdownMenuItem<int>(
                    value: f['id'],
                    child: Text(f['name']),
                  );
                }).toList(),
                onChanged: controller.selectedBuildingId.value == null 
                  ? null 
                  : (val) {
                    if (val != null) controller.fetchRooms(val);
                  },
              )),
              const SizedBox(height: 16),

              // Ruangan Dropdown
              Obx(() => DropdownButtonFormField<int>(
                isExpanded: true,
                decoration: const InputDecoration(
                  labelText: 'Pilih Ruangan',
                  border: OutlineInputBorder(),
                ),
                value: controller.selectedRoomId.value,
                items: controller.rooms.map((r) {
                  return DropdownMenuItem<int>(
                    value: r['id'],
                    child: Text(r['name']),
                  );
                }).toList(),
                onChanged: controller.selectedFloorId.value == null 
                  ? null 
                  : (val) {
                    if (val != null) controller.fetchAssets(val);
                  },
              )),
              const SizedBox(height: 24),

              // Aset List
              Obx(() {
                if (controller.isLoadingAssets.value) {
                  return const Center(child: CircularProgressIndicator());
                }

                if (controller.selectedRoomId.value != null && controller.assetsList.isEmpty) {
                  return const Center(
                    child: Text('Tidak ada data aset untuk ruangan ini.'),
                  );
                }

                if (controller.assetsList.isEmpty) {
                  return const SizedBox.shrink();
                }

                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Daftar Aset (${controller.assetsList.length})',
                      style: context.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 16),
                    ListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: controller.assetsList.length,
                      itemBuilder: (context, index) {
                        final asset = controller.assetsList[index];
                        return Card(
                          margin: const EdgeInsets.only(bottom: 16),
                          child: Padding(
                            padding: const EdgeInsets.all(12.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  '${asset['asset_name']} (ID: ${asset['asset_id']})',
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    Expanded(
                                      child: RadioListTile<bool>(
                                        title: const Text('Ada', style: TextStyle(fontSize: 14)),
                                        value: true,
                                        groupValue: asset['is_present'],
                                        onChanged: (val) => controller.updateAssetField(index, 'is_present', val),
                                        contentPadding: EdgeInsets.zero,
                                        dense: true,
                                      ),
                                    ),
                                    Expanded(
                                      child: RadioListTile<bool>(
                                        title: const Text('Tidak Ada', style: TextStyle(fontSize: 14)),
                                        value: false,
                                        groupValue: asset['is_present'],
                                        onChanged: (val) => controller.updateAssetField(index, 'is_present', val),
                                        contentPadding: EdgeInsets.zero,
                                        dense: true,
                                      ),
                                    ),
                                  ],
                                ),
                                if (asset['is_present'] == true) ...[
                                  const SizedBox(height: 8),
                                  DropdownButtonFormField<String>(
                                    decoration: const InputDecoration(
                                      labelText: 'Kondisi',
                                      border: OutlineInputBorder(),
                                      isDense: true,
                                    ),
                                    value: asset['condition'],
                                    items: const [
                                      DropdownMenuItem(value: 'baik', child: Text('Baik')),
                                      DropdownMenuItem(value: 'rusak', child: Text('Rusak')),
                                    ],
                                    onChanged: (val) => controller.updateAssetField(index, 'condition', val),
                                  ),
                                ],
                                const SizedBox(height: 12),
                                TextField(
                                  decoration: const InputDecoration(
                                    labelText: 'Catatan (Opsional)',
                                    border: OutlineInputBorder(),
                                    isDense: true,
                                  ),
                                  onChanged: (val) => controller.updateAssetField(index, 'notes', val),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Catatan Umum',
                      style: context.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: controller.notesController,
                      maxLines: 3,
                      decoration: InputDecoration(
                        hintText: 'Tambahkan catatan umum terkait ruangan/aset di sini...',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                        filled: true,
                        fillColor: Colors.grey[100],
                      ),
                    ),
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF047857),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        onPressed: controller.isSubmitting.value ? null : controller.submitInspection,
                        child: controller.isSubmitting.value 
                          ? const CircularProgressIndicator(color: Colors.white)
                          : const Text('Simpan Inspeksi', style: TextStyle(fontSize: 16, color: Colors.white)),
                      ),
                    ),
                  ],
                );
              }),
            ],
          ),
        ),
      ),
    );
  }
}
