import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'qr_scanner_controller.dart';

class QRScannerView extends GetView<QRScannerController> {
  const QRScannerView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Scan QR Code Ruangan'),
      ),
      body: MobileScanner(
        controller: controller.scannerController,
        onDetect: controller.onDetect,
      ),
    );
  }
}
