import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureKvStore {
  static final _storage = FlutterSecureStorage();

  static const _kToken = 'token';

  Future<void> setToken(String token) async {
    await _storage.write(key: _kToken, value: token);
  }

  Future<String?> getToken() async {
    return _storage.read(key: _kToken);
  }

  Future<void> clearToken() async {
    await _storage.delete(key: _kToken);
  }
}
