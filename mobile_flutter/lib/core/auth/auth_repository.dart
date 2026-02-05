import 'package:flutter/foundation.dart';
import 'package:mobile_flutter/core/config/app_config.dart';

import '../network/api_client.dart';
import '../storage/secure_kv_store.dart';
import 'auth_models.dart';

class AuthRepository {
  AuthRepository({required ApiClient apiClient, required SecureKvStore secureStore})
      : _apiClient = apiClient,
        _secureStore = secureStore;

  final ApiClient _apiClient;
  final SecureKvStore _secureStore;

  Future<AuthSession?> checkLogin() async {
    final res = await _apiClient.postCommand('checklogin');
    final body = res.data;

    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return null;

      final data = body['data'];
      if (data is Map<String, dynamic>) {
        return AuthSession(user: UserData.fromJson(data));
      }
      if (data is List && data.isNotEmpty && data.first is Map<String, dynamic>) {
        return AuthSession(user: UserData.fromJson(data.first as Map<String, dynamic>));
      }
    }

    return null;
  }

  Future<bool> login({required String username, required String password}) async {
    final res = await _apiClient.postRaw(
      '${AppConfig.baseUrl}/api',
      body: {
        'secureContext': false,
        'command': 'login',
        'user': username,
        'pass': password,
        'ctr_cd': AppConfig.ctrCd,
        'DATA': {
          'CTR_CD': AppConfig.ctrCd,
          'COMPANY': AppConfig.company,
          'USER': username,
          'PASS': password,
        },
      },
    );

    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'OK') {
        final token = (body['token_content'] ?? '').toString();
        if (token.isNotEmpty) {
          await _secureStore.setToken(token);
          await _secureStore.setCredentials(username, password);
          return true;
        }
      } else {
        if (kDebugMode) {
          // ignore: avoid_print
          print('Login failed: ${body['message']}');
        }
      }
    }
    return false;
  }

  Future<void> logout() async {
    try {
      await _apiClient.postCommand('logout');
    } catch (_) {
      // ignore
    }
    await _secureStore.clearAll();
  }
}
