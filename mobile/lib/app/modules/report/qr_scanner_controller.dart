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
        
        String? roomCode = barcode.rawValue;
        // Parse if it's a URL (e.g. http://127.0.0.1:8000/p/1)
        if (roomCode != null && roomCode.contains('/p/')) {
          final id = roomCode.split('/p/').last;
          roomCode = 'ROOM:$id';
        }

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
