import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'app/router.dart';
import 'core/config/app_config.dart';
import 'core/theme/app_theme.dart';
import 'core/theme/theme_controller.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await AppConfig.init();
  runApp(const ProviderScope(child: MyApp()));
}

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    final themeSettings = ref.watch(themeControllerProvider);
    final themes = AppThemes.of(themeSettings.themeId);
    return MaterialApp.router(
      title: 'ERP Mobile',
      theme: themes.light,
      darkTheme: themes.dark,
      themeMode: themeSettings.mode,
      routerConfig: router,
    );
  }
}
