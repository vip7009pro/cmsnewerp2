import 'package:flutter/material.dart';

import '../../../app/app_drawer.dart';
import 'diemdanh_nhom_page.dart';
import 'dieu_chuyen_team_page.dart';
import 'phe_duyet_nghi_page.dart';

class QuanLyCapCaoPage extends StatelessWidget {
  const QuanLyCapCaoPage({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Quản lý cấp cao'),
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
            DiemDanhNhomPage(option: 'diemdanhnhomBP', embedded: true),
            PheDuyetNghiPage(option: 'pheduyetnhomBP', embedded: true),
            DieuChuyenTeamPage(option1: 'diemdanhnhomBP', option2: 'workpositionlist_BP', embedded: true),
          ],
        ),
      ),
    );
  }
}
