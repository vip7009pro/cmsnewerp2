import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../app/app_drawer.dart';
import '../../../../core/config/app_config.dart';
import '../../../kho/presentation/nhap_xuat_ton_tp_page.dart';
import 'oqc_tabs/oqc_data_tab.dart';
import 'oqc_tabs/oqc_report_tab.dart';
import 'oqc_tabs/qtr_data_tab.dart';

class OqcPage extends ConsumerWidget {
  const OqcPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tabs = <Tab>[
      const Tab(text: 'Data Kho Thành Phẩm'),
      const Tab(text: 'Data OQC'),
      if (AppConfig.company == 'CMS') const Tab(text: 'Data QTR'),
      const Tab(text: 'Báo Cáo'),
    ];

    final views = <Widget>[
      const NhapXuatTonTpPage(),
      const OqcDataTab(),
      if (AppConfig.company == 'CMS') const QtrDataTab(),
      const OqcReportTab(),
    ];

    return DefaultTabController(
      length: tabs.length,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('QC / OQC'),
          bottom: TabBar(isScrollable: true, tabs: tabs),
        ),
        drawer: const AppDrawer(title: 'ERP'),
        body: TabBarView(children: views),
      ),
    );
  }
}
