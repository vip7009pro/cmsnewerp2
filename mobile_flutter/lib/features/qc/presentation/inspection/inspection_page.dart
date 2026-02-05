import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../app/app_drawer.dart';
import '../../../../core/config/app_config.dart';
import 'inspection_tabs/inspection_data_tab.dart';
import 'inspection_tabs/inspection_kpi_nv_new_tab.dart';
import 'inspection_tabs/inspection_material_status_tab.dart';
import 'inspection_tabs/inspection_patrol_tab.dart';
import 'inspection_tabs/inspection_report_tab.dart';
import 'inspection_tabs/inspection_status_tab.dart';

class InspectionPage extends ConsumerWidget {
  const InspectionPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tabs = <Tab>[
      const Tab(text: 'Data Kiểm Tra'),
      if (AppConfig.company == 'PVN') const Tab(text: 'NV KPI NEW2'),
      const Tab(text: 'Báo cáo'),
      const Tab(text: 'ISP STATUS'),
      const Tab(text: 'Material Status'),
      const Tab(text: 'PATROL'),
    ];

    final views = <Widget>[
      const InspectionDataTab(),
      if (AppConfig.company == 'PVN') const InspectionKpiNvNewTab(),
      const InspectionReportTab(),
      const InspectionStatusTab(),
      const InspectionMaterialStatusTab(),
      const InspectionPatrolTab(),
    ];

    return DefaultTabController(
      length: tabs.length,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('QC / INSPECTION'),
          bottom: TabBar(isScrollable: true, tabs: tabs),
        ),
        drawer: const AppDrawer(title: 'ERP'),
        body: TabBarView(children: views),
      ),
    );
  }
}
