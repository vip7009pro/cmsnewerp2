import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../pqc/pqc_tabs/pqc_patrol_tab.dart';

class InspectionPatrolTab extends ConsumerWidget {
  const InspectionPatrolTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // PATROL tab exists in PQC module and already includes inspection patrol lane.
    return const PqcPatrolTab();
  }
}
