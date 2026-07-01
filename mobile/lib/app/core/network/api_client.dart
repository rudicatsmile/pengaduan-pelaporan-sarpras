import 'package:mobile/app/core/network/api_client.dart';
import 'package:dio/dio.dart';
import 'package:logger/logger.dart';

class ApiClient {
  static final Logger _logger = Logger(
    printer: PrettyPrinter(
      methodCount: 0,
      errorMethodCount: 5,
      lineLength: 80,
      colors: true,
      printEmojis: true,
    ),
  );

  static Dio get instance {
    final dio = Dio(BaseOptions(
      baseUrl: 'http://192.168.27.177:8000/api',
      headers: {'Accept': 'application/json'},
    ));

    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          _logger.i('🌐 REQUEST [${options.method}] => PATH: ${options.path}\n'
              'HEADERS: ${options.headers}\n'
              'BODY: ${options.data}');
          return handler.next(options);
        },
        onResponse: (response, handler) {
          _logger.i('✅ RESPONSE [${response.statusCode}] => PATH: ${response.requestOptions.path}\n'
              'DATA: ${response.data}');
          return handler.next(response);
        },
        onError: (DioException e, handler) {
          _logger.e('❌ ERROR [${e.response?.statusCode}] => PATH: ${e.requestOptions.path}\n'
              'MESSAGE: ${e.message}\n'
              'DATA: ${e.response?.data}');
          return handler.next(e);
        },
      ),
    );

    return dio;
  }
}
