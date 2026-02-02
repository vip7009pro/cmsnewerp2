import 'package:flutter/material.dart';

import '../../../app/app_drawer.dart';
import '../../../core/config/app_config.dart';
import 'dtc_tabs/add_spec_dtc_tab.dart';
import 'dtc_tabs/dk_dtc_tab.dart';
import 'dtc_tabs/dtc_result_tab.dart';
import 'dtc_tabs/kq_dtc_tab.dart';
import 'dtc_tabs/spec_dtc_tab.dart';
import 'dtc_tabs/test_table_tab.dart';

class DtcPage extends StatelessWidget {
  const DtcPage({super.key});

  @override
  Widget build(BuildContext context) {
    final tabs = <Tab>[
      const Tab(text: 'TRA KQ ĐTC'),
      const Tab(text: 'TRA SPEC ĐTC'),
      const Tab(text: 'ADD SPEC ĐTC'),
      const Tab(text: 'ĐKÝ TEST ĐTC'),
      const Tab(text: 'NHẬP KQ ĐTC'),
      if (AppConfig.company == 'CMS') const Tab(text: 'Quản lý hạng mục ĐTC'),
    ];

    final views = <Widget>[
      const KqDtcTab(),
      const SpecDtcTab(),
      const AddSpecDtcTab(),
      const DkDtcTab(),
      const DtcResultTab(),
      if (AppConfig.company == 'CMS') const TestTableDtcTab(),
    ];

    return DefaultTabController(
      length: tabs.length,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('QC / DTC'),
          bottom: TabBar(
            isScrollable: true,
            tabs: tabs,
          ),
        ),
        drawer: const AppDrawer(title: 'ERP'),
        body: TabBarView(children: views),
      ),
    );
  }
}
