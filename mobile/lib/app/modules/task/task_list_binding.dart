import 'package:get/get.dart';
import 'task_list_controller.dart';

class TaskListBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<TaskListController>(() => TaskListController());
  }
}
