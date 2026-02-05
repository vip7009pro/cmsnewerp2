import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../app/app_drawer.dart';
import '../../../../core/config/app_config.dart';
import '../cs/cs_tabs/cs_report_tab.dart';
import '../inspection/inspection_tabs/inspection_report_tab.dart';
import '../iqc/iqc_tabs/iqc_report_tab.dart';
import '../oqc/oqc_tabs/oqc_report_tab.dart';
import '../pqc/pqc_tabs/pqc_report_tab.dart';

class QcReportPage extends ConsumerWidget {
  const QcReportPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tabs = <Tab>[
      if (AppConfig.company == 'CMS') const Tab(text: 'IQC REPORT'),
      const Tab(text: 'PQC REPORT'),
      const Tab(text: 'INSPECTION REPORT'),
      const Tab(text: 'OQC REPORT'),
      const Tab(text: 'CS REPORT'),
    ];

    final views = <Widget>[
      if (AppConfig.company == 'CMS') const IqcReportTab(),
      const PqcReportTab(),
      const InspectionReportTab(),
      const OqcReportTab(),
      const CsReportTab(),
    ];

    return DefaultTabController(
      length: tabs.length,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('QC / REPORT'),
          bottom: TabBar(isScrollable: true, tabs: tabs),
        ),
        drawer: const AppDrawer(title: 'ERP'),
        body: TabBarView(children: views),
      ),
    );
  }
}
