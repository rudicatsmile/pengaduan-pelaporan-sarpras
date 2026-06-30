import 'package:get/get.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

class QRScannerController extends GetxController {
  final scannerController = MobileScannerController();
  bool _isScanned = false;

  void onDetect(BarcodeCapture capture) {
    if (_isScanned) return;

    final List<Barcode> barcodes = capture.barcodes;
    for (final barcode in barcodes) {
      if (barcode.rawValue != null) {
        _isScanned = true;
        scannerController.stop();
        // Assuming QR code contains raw text of room code (e.g. R-001)
        final roomCode = barcode.rawValue;
        Get.offNamed('/report/form', parameters: {'room_code': roomCode ?? ''});
        break;
      }
    }
  }

  @override
  void onClose() {
    scannerController.dispose();
    super.onClose();
  }
}
