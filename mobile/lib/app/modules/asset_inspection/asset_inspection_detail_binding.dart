import 'package:get/get.dart';
import 'asset_inspection_detail_controller.dart';

class AssetInspectionDetailBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<AssetInspectionDetailController>(
      () => AssetInspectionDetailController(),
    );
  }
}
