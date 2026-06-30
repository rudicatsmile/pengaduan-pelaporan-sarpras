import 'package:get/get.dart';
import '../modules/splash/splash_binding.dart';
import '../modules/splash/splash_view.dart';
import '../modules/login/login_binding.dart';
import '../modules/login/login_view.dart';
import '../modules/register/register_binding.dart';
import '../modules/register/register_view.dart';
import '../modules/home/home_binding.dart';
import '../modules/home/home_view.dart';
import '../modules/report/qr_scanner_binding.dart';
import '../modules/report/qr_scanner_view.dart';
import '../modules/report/report_form_binding.dart';
import '../modules/report/report_form_view.dart';
import '../modules/report/general_report_binding.dart';
import '../modules/report/general_report_view.dart';
import '../modules/report/report_detail_binding.dart';
import '../modules/report/report_detail_view.dart';

part 'app_routes.dart';

class AppPages {
  static const INITIAL = Routes.SPLASH;

  static final routes = [
    GetPage(
      name: Routes.SPLASH,
      page: () => const SplashView(),
      binding: SplashBinding(),
    ),
    GetPage(
      name: Routes.LOGIN,
      page: () => const LoginView(),
      binding: LoginBinding(),
    ),
    GetPage(
      name: Routes.REGISTER,
      page: () => const RegisterView(),
      binding: RegisterBinding(),
    ),
    GetPage(
      name: Routes.HOME,
      page: () => const HomeView(),
      binding: HomeBinding(),
    ),
    GetPage(
      name: '/report/qr',
      page: () => const QRScannerView(),
      binding: QRScannerBinding(),
    ),
    GetPage(
      name: '/report/form',
      page: () => const ReportFormView(),
      binding: ReportFormBinding(),
    ),
    GetPage(
      name: '/report/general',
      page: () => const GeneralReportView(),
      binding: GeneralReportBinding(),
    ),
    GetPage(
      name: '/report/detail',
      page: () => const ReportDetailView(),
      binding: ReportDetailBinding(),
    ),
  ];
}
