import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../app/app_drawer.dart';
import '../../../auth/application/auth_notifier.dart';
import '../../../auth/application/auth_state.dart';
import '../../../kho/presentation/nhap_xuat_ton_lieu_page.dart';
import '../dtc_page.dart';
import 'iqc_tabs/iqc_blocking_tab.dart';
import 'iqc_tabs/iqc_failing_tab.dart';
import 'iqc_tabs/iqc_holding_tab.dart';
import 'iqc_tabs/iqc_incoming_tab.dart';
import 'iqc_tabs/iqc_report_tab.dart';
import 'iqc_tabs/iqc_ncr_management_tab.dart';
import 'iqc_tabs/iqc_lay_mau_icm_tab.dart';

class IqcPage extends ConsumerWidget {
  const IqcPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authNotifierProvider);
    final jobName = auth is AuthAuthenticated ? auth.session.user.jobName.trim() : '';
    final isWorker = jobName.toUpperCase() == 'WORKER';

    final tabs = <Tab>[
      if (!isWorker) const Tab(text: 'Kho Liệu'),
      if (!isWorker) const Tab(text: 'ĐỘ TIN CẬY'),
      if (isWorker) const Tab(text: 'LẤY MẪU ICM'),
      const Tab(text: 'INCOMING'),
      const Tab(text: 'BLOCKING'),
      const Tab(text: 'HOLDING'),
      const Tab(text: 'FAILING'),
      if (!isWorker) const Tab(text: 'NCR MANAGEMENT'),
      const Tab(text: 'IQC REPORT'),
    ];

    final views = <Widget>[
      if (!isWorker) const NhapXuatTonLieuPage(),
      if (!isWorker) const DtcPage(),
      if (isWorker) const IqcLayMauIcmTab(),
      const IqcIncomingTab(),
      const IqcBlockingTab(),
      const IqcHoldingTab(),
      const IqcFailingTab(),
      if (!isWorker) const IqcNcrManagementTab(),
      const IqcReportTab(),
    ];

    return DefaultTabController(
      length: tabs.length,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('QC / IQC'),
          bottom: TabBar(isScrollable: true, tabs: tabs),
        ),
        drawer: const AppDrawer(title: 'ERP'),
        body: TabBarView(children: views),
      ),
    );
  }
}
