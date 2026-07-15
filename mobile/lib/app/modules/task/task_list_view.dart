import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'task_list_controller.dart';

class TaskListView extends GetView<TaskListController> {
  const TaskListView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Daftar Tugas'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: controller.fetchTasks,
          )
        ],
      ),
      body: Obx(() {
        if (controller.isLoading.value) {
          return const Center(child: CircularProgressIndicator());
        }
        if (controller.tasks.isEmpty) {
          return const Center(child: Text('Belum ada tugas yang didelegasikan ke Anda.'));
        }
        return ListView.builder(
          padding: const EdgeInsets.all(16.0),
          itemCount: controller.tasks.length,
          itemBuilder: (context, index) {
            final task = controller.tasks[index];
            return Card(
              child: ListTile(
                title: Text(task['category']['name'] ?? 'Laporan'),
                subtitle: Text(
                  task['room'] != null ? task['room']['name'] : (task['location_text'] ?? '-'),
                  maxLines: 1, overflow: TextOverflow.ellipsis,
                ),
                trailing: _buildStatusBadge(task['status']),
                onTap: () => Get.toNamed('/task/detail', parameters: {'id': task['id'].toString()}),
              ),
            );
          },
        );
      }),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color color;
    switch (status) {
      case 'didelegasikan': color = Colors.teal[700]!; break;
      case 'dalam_proses': color = Colors.lightGreen; break;
      case 'selesai': color = Colors.green; break;
      default: color = Colors.grey; break;
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color),
      ),
      child: Text(
        status.toUpperCase(),
        style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold),
      ),
    );
  }
}
