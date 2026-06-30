import 'package:get/get.dart';
import 'task_detail_controller.dart';

class TaskDetailBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<TaskDetailController>(() => TaskDetailController());
  }
}
