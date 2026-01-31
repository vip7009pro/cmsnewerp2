import 'package:flutter/material.dart';

import '../../../app/app_drawer.dart';
import 'diemdanh_nhom_page.dart';
import 'dieu_chuyen_team_page.dart';
import 'phe_duyet_nghi_page.dart';

class QuanLyCapCaoNsPage extends StatelessWidget {
  const QuanLyCapCaoNsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Quản lý cấp cao (NS)'),
          bottom: const TabBar(
            isScrollable: true,
            tabs: [
              Tab(icon: Icon(Icons.check_circle_outline), text: 'Điểm danh'),
              Tab(icon: Icon(Icons.approval_outlined), text: 'Phê duyệt nghỉ'),
              Tab(icon: Icon(Icons.swap_horiz), text: 'Điều chuyển team'),
            ],
          ),
        ),
        drawer: const AppDrawer(title: 'Menu'),
        body: const TabBarView(
          children: [
            DiemDanhNhomPage(option: 'diemdanhnhomNS', embedded: true),
            PheDuyetNghiPage(option: 'pheduyetnhomNS', embedded: true),
            DieuChuyenTeamPage(option1: 'diemdanhnhomNS', option2: 'workpositionlist_NS', embedded: true),
          ],
        ),
      ),
    );
  }
}
