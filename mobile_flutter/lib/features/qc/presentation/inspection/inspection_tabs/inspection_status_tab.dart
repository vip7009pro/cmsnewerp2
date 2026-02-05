import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../kinhdoanh/presentation/ins_status_page.dart';

class InspectionStatusTab extends ConsumerWidget {
  const InspectionStatusTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Reuse existing page implementation for now.
    return const InsStatusPage();
  }
}
