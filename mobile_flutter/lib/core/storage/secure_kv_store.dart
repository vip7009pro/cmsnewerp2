import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureKvStore {
  static final _storage = FlutterSecureStorage();

  static const _kToken = 'token';
  static const _kUsername = 'username';
  static const _kPassword = 'password';
  static const _kSubActiveUntil = 'subscription_active_until';
  static const _kSubLifetime = 'subscription_lifetime';

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

  Future<void> setSubscriptionActiveUntil(DateTime? dt) async {
    await _storage.write(key: _kSubActiveUntil, value: dt?.toIso8601String());
  }

  Future<DateTime?> getSubscriptionActiveUntil() async {
    final v = await _storage.read(key: _kSubActiveUntil);
    if (v == null || v.isEmpty) return null;
    return DateTime.tryParse(v);
  }

  Future<void> clearSubscriptionActiveUntil() async {
    await _storage.delete(key: _kSubActiveUntil);
  }

  Future<void> setSubscriptionLifetime(bool lifetime) async {
    await _storage.write(key: _kSubLifetime, value: lifetime ? 'true' : 'false');
  }

  Future<bool> getSubscriptionLifetime() async {
    final v = await _storage.read(key: _kSubLifetime);
    return v == 'true';
  }

  Future<void> clearSubscriptionLifetime() async {
    await _storage.delete(key: _kSubLifetime);
  }
}
