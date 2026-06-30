import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'splash_controller.dart';

class SplashView extends GetView<SplashController> {
  const SplashView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: context.theme.colorScheme.primary,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.report_problem,
              size: 100,
              color: context.theme.colorScheme.onPrimary,
            ),
            const SizedBox(height: 20),
            Text(
              'Sarpras Report',
              style: context.textTheme.headlineMedium?.copyWith(
                color: context.theme.colorScheme.onPrimary,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              'Sistem Pelaporan Sarana & Prasarana',
              style: context.textTheme.titleMedium?.copyWith(
                color: context.theme.colorScheme.onPrimary.withOpacity(0.8),
              ),
            ),
            const SizedBox(height: 40),
            CircularProgressIndicator(
              color: context.theme.colorScheme.onPrimary,
            ),
          ],
        ),
      ),
    );
  }
}
