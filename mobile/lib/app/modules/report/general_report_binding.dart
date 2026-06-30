import 'package:get/get.dart';
import 'general_report_controller.dart';

class GeneralReportBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<GeneralReportController>(() => GeneralReportController());
  }
}
