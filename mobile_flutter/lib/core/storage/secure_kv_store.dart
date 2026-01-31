import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureKvStore {
  static final _storage = FlutterSecureStorage();

  static const _kToken = 'token';
  static const _kUsername = 'username';
  static const _kPassword = 'password';

  Future<void> setToken(String token) async {
    await _storage.write(key: _kToken, value: token);
  }

  Future<String?> getToken() async {
    return _storage.read(key: _kToken);
  }

  Future<void> clearToken() async {
    await _storage.delete(key: _kToken);
  }

  Future<void> setCredentials(String username, String password) async {
    await _storage.write(key: _kUsername, value: username);
    await _storage.write(key: _kPassword, value: password);
  }

  Future<String?> getUsername() async {
    return _storage.read(key: _kUsername);
  }

  Future<String?> getPassword() async {
    return _storage.read(key: _kPassword);
  }

  Future<void> clearCredentials() async {
    await _storage.delete(key: _kUsername);
    await _storage.delete(key: _kPassword);
  }

  Future<void> clearAll() async {
    await clearToken();
    await clearCredentials();
  }
}
