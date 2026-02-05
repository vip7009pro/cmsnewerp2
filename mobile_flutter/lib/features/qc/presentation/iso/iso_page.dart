import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../app/app_drawer.dart';
import '../../../../core/config/app_config.dart';
import 'iso_tabs/audit_history_tab.dart';
import 'iso_tabs/audit_tab.dart';
import 'iso_tabs/document_tab.dart';
import 'iso_tabs/rnr_tab.dart';

class IsoPage extends ConsumerWidget {
  const IsoPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isCms = AppConfig.company == 'CMS';

    final tabs = <Tab>[
      if (isCms) const Tab(text: 'TEST'),
      if (isCms) const Tab(text: 'SELF AUDIT'),
      const Tab(text: 'AUDIT HISTORY'),
      if (isCms) const Tab(text: 'DOCUMENT'),
    ];

    final views = <Widget>[
      if (isCms) const RnrTab(),
      if (isCms) const AuditTab(),
      const AuditHistoryTab(),
      if (isCms) const DocumentTab(),
    ];

    return DefaultTabController(
      length: tabs.length,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('QC / ISO'),
          bottom: TabBar(isScrollable: true, tabs: tabs),
        ),
        drawer: const AppDrawer(title: 'ERP'),
        body: TabBarView(children: views),
      ),
    );
  }
}
