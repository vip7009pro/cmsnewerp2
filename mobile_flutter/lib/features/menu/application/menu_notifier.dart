import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/providers.dart';
import '../data/menu_models.dart';
import '../data/menu_repository.dart';

final menuRepositoryProvider = Provider<MenuRepository>((ref) {
  return MenuRepository(apiClient: ref.read(apiClientProvider));
});

final menuProvider = FutureProvider<List<MenuGroup>>((ref) async {
  return ref.read(menuRepositoryProvider).loadMenu();
});
