import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../app/app_drawer.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/theme/theme_controller.dart';

class ThemeSettingsPage extends ConsumerWidget {
  const ThemeSettingsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settings = ref.watch(themeControllerProvider);
    final ctrl = ref.read(themeControllerProvider.notifier);
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(title: const Text('Theme settings')),
      drawer: const AppDrawer(title: 'ERP'),
      body: ListView(
        padding: const EdgeInsets.all(12),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Theme mode', style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  DropdownButtonFormField<ThemeMode>(
                    key: ValueKey(settings.mode),
                    initialValue: settings.mode,
                    isDense: true,
                    decoration: const InputDecoration(
                      isDense: true,
                      labelText: 'Mode',
                      border: OutlineInputBorder(),
                    ),
                    dropdownColor: scheme.surface,
                    style: TextStyle(color: scheme.onSurface, fontWeight: FontWeight.w600),
                    iconEnabledColor: scheme.onSurfaceVariant,
                    items: const [
                      DropdownMenuItem(value: ThemeMode.light, child: Text('Light')),
                      DropdownMenuItem(value: ThemeMode.dark, child: Text('Dark')),
                      DropdownMenuItem(value: ThemeMode.system, child: Text('System')),
                    ],
                    onChanged: (v) {
                      if (v == null) return;
                      ctrl.setMode(v);
                    },
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Theme style', style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  DropdownButtonFormField<AppThemeId>(
                    key: ValueKey(settings.themeId),
                    initialValue: settings.themeId,
                    isDense: true,
                    decoration: const InputDecoration(
                      isDense: true,
                      labelText: 'Theme',
                      border: OutlineInputBorder(),
                    ),
                    dropdownColor: scheme.surface,
                    style: TextStyle(color: scheme.onSurface, fontWeight: FontWeight.w600),
                    iconEnabledColor: scheme.onSurfaceVariant,
                    items: const [
                      DropdownMenuItem(value: AppThemeId.compactBlue, child: Text('Compact Blue (recommended)')),
                      DropdownMenuItem(value: AppThemeId.defaultBlue, child: Text('Default Blue')),
                      DropdownMenuItem(value: AppThemeId.green, child: Text('Green')),
                      DropdownMenuItem(value: AppThemeId.purple, child: Text('Purple')),
                      DropdownMenuItem(value: AppThemeId.orange, child: Text('Orange')),
                      DropdownMenuItem(value: AppThemeId.teal, child: Text('Teal')),
                      DropdownMenuItem(value: AppThemeId.indigo, child: Text('Indigo')),
                      DropdownMenuItem(value: AppThemeId.amber, child: Text('Amber')),
                      DropdownMenuItem(value: AppThemeId.lime, child: Text('Lime')),
                    ],
                    onChanged: (v) {
                      if (v == null) return;
                      ctrl.setThemeId(v);
                    },
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Theme is saved automatically and will be restored on next app launch.',
                    style: TextStyle(color: scheme.onSurfaceVariant),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
