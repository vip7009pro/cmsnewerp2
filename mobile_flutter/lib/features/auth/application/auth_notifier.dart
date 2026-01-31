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
      final session = await repo.checkLogin();
      if (session == null || session.user.emplNo.isEmpty || session.user.emplNo == 'none') {
        state = const AuthUnauthenticated();
      } else {
        state = AuthAuthenticated(session: session);
      }
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
    state = const AuthUnauthenticated();
  }
}
