import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'dart:io';
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
              'User-Agent': 'Flutter-ERP-App',
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

  Future<Response<dynamic>> uploadFile({
    required File file,
    required String filename,
    required String uploadFolderName,
    ProgressCallback? onSendProgress,
  }) async {
    final token = await _secureStore.getToken();
    final form = FormData.fromMap({
      'uploadedfile': await MultipartFile.fromFile(file.path, filename: filename),
      'filename': filename,
      'uploadfoldername': uploadFolderName,
      'token_string': token ?? '',
      'CTR_CD': AppConfig.ctrCd,
    });
    return _dio.post(
      '${AppConfig.baseUrl}/uploadfile',
      data: form,
      onSendProgress: onSendProgress,
    );
  }
}
