import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/providers.dart';
import 'auth_state.dart';

final authNotifierProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref);
});

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier(this._ref) : super(const AuthUnknown());

  final Ref _ref;

  Future<void> bootstrap() async {
    state = const AuthLoading();
    try {
      final repo = _ref.read(authRepositoryProvider);
      // Try checkLogin first (may use existing token)
      final session = await repo.checkLogin();
      if (session != null && session.user.emplNo.isNotEmpty && session.user.emplNo != 'none') {
        state = AuthAuthenticated(session: session);
        return;
      }

      // If checkLogin failed, try using saved credentials to login
      final secureStore = _ref.read(secureKvStoreProvider);
      final username = await secureStore.getUsername();
      final password = await secureStore.getPassword();
      if (username != null && password != null) {
        final ok = await repo.login(username: username, password: password);
        if (ok) {
          final newSession = await repo.checkLogin();
          if (newSession != null && newSession.user.emplNo.isNotEmpty && newSession.user.emplNo != 'none') {
            state = AuthAuthenticated(session: newSession);
            return;
          }
        }
      }

      // No saved credentials or login failed
      state = const AuthUnauthenticated();
    } catch (e) {
      state = AuthError(e.toString());
    }
  }

  Future<bool> login(String username, String password) async {
    state = const AuthLoading();
    try {
      final repo = _ref.read(authRepositoryProvider);
      final ok = await repo.login(username: username, password: password);
      if (!ok) {
        state = const AuthUnauthenticated();
        return false;
      }
      final session = await repo.checkLogin();
      if (session == null) {
        state = const AuthUnauthenticated();
        return false;
      }
      state = AuthAuthenticated(session: session);
      return true;
    } catch (e) {
      state = AuthError(e.toString());
      return false;
    }
  }

  Future<void> logout() async {
    state = const AuthLoading();
    final repo = _ref.read(authRepositoryProvider);
    await repo.logout();
    // Ensure a small delay to allow UI to settle before redirect
    await Future.delayed(const Duration(milliseconds: 300));
    state = const AuthUnauthenticated();
  }

  Future<void> refreshSession() async {
    final current = state;
    if (current is! AuthAuthenticated) return;

    try {
      final repo = _ref.read(authRepositoryProvider);
      final session = await repo.checkLogin();
      if (session == null) return;
      state = AuthAuthenticated(session: session);
    } catch (_) {
      // ignore
    }
  }
}
