import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'auth/auth_repository.dart';
import 'network/api_client.dart';
import 'storage/secure_kv_store.dart';

final secureKvStoreProvider = Provider<SecureKvStore>((ref) {
  return SecureKvStore();
});

final apiClientProvider = Provider<ApiClient>((ref) {
  return ApiClient(secureStore: ref.read(secureKvStoreProvider));
});

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(
    apiClient: ref.read(apiClientProvider),
    secureStore: ref.read(secureKvStoreProvider),
  );
});
