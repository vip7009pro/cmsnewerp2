import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../auth/application/auth_notifier.dart';
import 'dtc_tabs/dk_dtc_tab.dart';

class IqcWorkerDtcPage extends ConsumerWidget {
  const IqcWorkerDtcPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ĐĂNG KÝ TEST ĐTC (IQC)'),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            tooltip: 'Đăng xuất',
            onPressed: () => ref.read(authNotifierProvider.notifier).logout(),
            icon: const Icon(Icons.logout),
          ),
        ],
      ),
      body: const DkDtcTab(),
    );
  }
}
