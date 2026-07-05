import 'package:get/get.dart';
import 'asset_inspection_form_controller.dart';

class AssetInspectionFormBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<AssetInspectionFormController>(() => AssetInspectionFormController());
  }
}
