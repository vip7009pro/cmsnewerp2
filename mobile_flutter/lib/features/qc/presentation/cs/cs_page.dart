import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../app/app_drawer.dart';
import 'cs_tabs/cs_data_tab.dart';
import 'cs_tabs/cs_report_tab.dart';

class CsPage extends ConsumerWidget {
  const CsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tabs = <Tab>[
      const Tab(text: 'DATA CS'),
      const Tab(text: 'BÁO CÁO CS'),
    ];

    final views = <Widget>[
      const CsDataTab(),
      const CsReportTab(),
    ];

    return DefaultTabController(
      length: tabs.length,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('QC / CS'),
          bottom: TabBar(isScrollable: true, tabs: tabs),
        ),
        drawer: const AppDrawer(title: 'ERP'),
        body: TabBarView(children: views),
      ),
    );
  }
}
