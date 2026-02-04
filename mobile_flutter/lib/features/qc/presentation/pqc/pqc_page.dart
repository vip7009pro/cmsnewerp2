import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../app/app_drawer.dart';
import '../../../auth/application/auth_notifier.dart';
import '../../../auth/application/auth_state.dart';
import 'pqc_tabs/pqc1_setting_tab.dart';
import 'pqc_tabs/pqc3_defect_tab.dart';
import 'pqc_tabs/pqc_data_tab.dart';
import 'pqc_tabs/pqc_dao_film_handover_tab.dart';
import 'pqc_tabs/pqc_lineqc_tab.dart';
import 'pqc_tabs/pqc_patrol_tab.dart';
import 'pqc_tabs/pqc_report_tab.dart';

class PqcPage extends ConsumerWidget {
  const PqcPage({super.key});

  bool _isWorker(AuthState auth) {
    if (auth is! AuthAuthenticated) return false;
    return auth.session.user.jobName.trim().toUpperCase() == 'WORKER';
  }

  bool _isPqcSubDept(AuthState auth) {
    if (auth is! AuthAuthenticated) return false;
    final sub = (auth.session.user.subDeptName ?? '').toUpperCase();
    return sub.contains('PQC');
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authNotifierProvider);
    final isWorker = _isWorker(auth);
    final isPqcSubDept = _isPqcSubDept(auth);

    final tabs = <Tab>[
      if (isPqcSubDept) const Tab(text: 'LINEQC'),
      if (!isWorker) const Tab(text: 'DATA PQC'),
      if (!isWorker) const Tab(text: 'PQC1-SETTING'),
      if (!isWorker) const Tab(text: 'PQC3-DEFECT'),
      if (!isWorker) const Tab(text: 'PATROL'),
      if (!isWorker) const Tab(text: 'Giao Nhận Dao Film'),
      if (!isWorker) const Tab(text: 'Báo Cáo'),
    ];

    final views = <Widget>[
      if (isPqcSubDept) const PqcLineQcTab(),
      if (!isWorker) const PqcDataTab(),
      if (!isWorker) const Pqc1SettingTab(),
      if (!isWorker) const Pqc3DefectTab(),
      if (!isWorker) const PqcPatrolTab(),
      if (!isWorker) const PqcDaoFilmHandoverTab(),
      if (!isWorker) const PqcReportTab(),
    ];

    if (tabs.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: const Text('QC / PQC')),
        drawer: const AppDrawer(title: 'ERP'),
        body: const Center(child: Text('Bạn không có quyền truy cập PQC')),
      );
    }

    return DefaultTabController(
      length: tabs.length,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('QC / PQC'),
          bottom: TabBar(isScrollable: true, tabs: tabs),
        ),
        drawer: const AppDrawer(title: 'ERP'),
        body: TabBarView(children: views),
      ),
    );
  }
}
