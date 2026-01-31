import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../features/auth/application/auth_notifier.dart';
import '../features/menu/application/menu_notifier.dart';

class AppDrawer extends ConsumerWidget {
  const AppDrawer({super.key, this.title});

  final String? title;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final menuAsync = ref.watch(menuProvider);

    return Drawer(
      child: SafeArea(
        child: Column(
          children: [
            ListTile(
              title: Text(title ?? 'ERP'),
              trailing: IconButton(
                onPressed: () => ref.read(authNotifierProvider.notifier).logout(),
                icon: const Icon(Icons.logout),
              ),
            ),
            ListTile(
              leading: const Icon(Icons.palette_outlined),
              title: const Text('Theme settings'),
              onTap: () {
                Navigator.of(context).pop();
                context.push('/settings/theme');
              },
            ),
            const Divider(height: 1),
            Expanded(
              child: menuAsync.when(
                data: (groups) {
                  if (groups.isEmpty) {
                    return const Center(child: Text('Menu rỗng hoặc không có quyền'));
                  }

                  return ListView(
                    children: [
                      for (final group in groups)
                        ExpansionTile(
                          title: Text(group.title),
                          children: [
                            for (final item in group.items)
                              ListTile(
                                title: Text(item.subText.isNotEmpty ? item.subText : item.subLink),
                                subtitle: Text(item.subLink),
                                onTap: () {
                                  final route = item.subLink;
                                  if (route.isEmpty) return;
                                  Navigator.of(context).pop();
                                  context.push(route);
                                },
                              ),
                          ],
                        ),
                    ],
                  );
                },
                error: (e, _) => Center(child: Text('Lỗi load menu: $e')),
                loading: () => const Center(child: CircularProgressIndicator()),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
