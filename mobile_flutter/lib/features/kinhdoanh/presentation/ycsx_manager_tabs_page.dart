import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../app/app_drawer.dart';
import 'tra_amz_page.dart';
import 'ycsx_manager_page.dart';

class YcsxManagerTabsPage extends ConsumerWidget {
  const YcsxManagerTabsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('YCSX / Tra AMZ'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'YCSX'),
              Tab(text: 'Tra AMZ'),
            ],
          ),
        ),
        drawer: const AppDrawer(title: 'ERP'),
        body: TabBarView(
          children: const [
            YcsxManagerPage(embedded: true),
            TraAmzPage(),
          ],
        ),
      ),
    );
  }
}
