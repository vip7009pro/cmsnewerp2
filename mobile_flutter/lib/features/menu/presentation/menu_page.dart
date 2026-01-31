import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../app/app_drawer.dart';
import '../../auth/application/auth_notifier.dart';
import '../application/menu_notifier.dart';

class MenuPage extends ConsumerWidget {
  const MenuPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final menuAsync = ref.watch(menuProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('ERP'),
        actions: [
          IconButton(
            onPressed: () => ref.read(authNotifierProvider.notifier).logout(),
            icon: const Icon(Icons.logout),
          ),
        ],
      ),
      drawer: const AppDrawer(title: 'ERP'),
      body: menuAsync.when(
        data: (groups) {
          if (groups.isEmpty) {
            return const Center(child: Text('Menu rỗng hoặc không có quyền'));
          }
          return ListView.builder(
            itemCount: groups.length,
            itemBuilder: (context, index) {
              final group = groups[index];
              return ExpansionTile(
                title: Text(group.title),
                children: [
                  for (final item in group.items)
                    ListTile(
                      title: Text(item.subText.isNotEmpty ? item.subText : item.subLink),
                      subtitle: Text(item.subLink),
                      onTap: () {
                        final route = item.subLink;
                        if (route.isEmpty) return;
                        context.push(route);
                      },
                    ),
                ],
              );
            },
          );
        },
        error: (e, _) => Center(child: Text('Lỗi load menu: $e')),
        loading: () => const Center(child: CircularProgressIndicator()),
      ),
    );
  }
}
