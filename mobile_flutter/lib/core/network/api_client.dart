import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

import '../config/app_config.dart';
import '../storage/secure_kv_store.dart';

class ApiClient {
  ApiClient({required SecureKvStore secureStore})
      : _secureStore = secureStore,
        _dio = Dio(
          BaseOptions(
            baseUrl: AppConfig.baseUrl,
            connectTimeout: const Duration(seconds: 20),
            receiveTimeout: const Duration(seconds: 30),
            headers: {
              'Content-Type': 'application/json',
            },
          ),
        );

  final Dio _dio;
  final SecureKvStore _secureStore;

  Future<Response<dynamic>> postRaw(
    String path, {
    required Map<String, dynamic> body,
  }) async {
    return _dio.post(path, data: body);
  }

  Future<Response<dynamic>> postCommand(
    String command, {
    Map<String, dynamic>? data,
    bool attachAuth = true,
  }) async {
    if (kDebugMode) {
      debugPrint('command: $command');
    }
    final payload = <String, dynamic>{
      'secureContext': false,
      'command': command,
      'DATA': <String, dynamic>{
        ...?data,
        'CTR_CD': AppConfig.ctrCd,
        'COMPANY': AppConfig.company,
      },
    };

    if (attachAuth) {
      final token = await _secureStore.getToken();
      if (token != null && token.isNotEmpty) {
        (payload['DATA'] as Map<String, dynamic>)['token_string'] = token;
      }
    }

    return _dio.post('/api', data: payload);
  }
}
