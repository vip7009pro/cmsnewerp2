import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../app/app_drawer.dart';
import '../../../core/config/app_config.dart';
import '../application/hr_providers.dart';

class DieuChuyenTeamPage extends ConsumerStatefulWidget {
  const DieuChuyenTeamPage({
    super.key,
    this.option1 = 'diemdanhnhom',
    this.option2 = 'workpositionlist_BP',
    this.embedded = false,
  });

  final String option1;
  final String option2;
  final bool embedded;

  @override
  ConsumerState<DieuChuyenTeamPage> createState() => _DieuChuyenTeamPageState();
}

class _DieuChuyenTeamPageState extends ConsumerState<DieuChuyenTeamPage> {
  int _teamNameList = 5;

  @override
  Widget build(BuildContext context) {
    final dataAsync = ref.watch(dieuChuyenTeamProvider((widget.option1, _teamNameList)));
    final workPosAsync = ref.watch(workPositionsByCommandProvider(widget.option2));

    final body = Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(8),
          child: Row(
            children: [
              Expanded(
                child: DropdownButtonFormField<int>(
                  initialValue: _teamNameList,
                  decoration: const InputDecoration(labelText: 'Ca làm việc', border: OutlineInputBorder()),
                  items: const [
                    DropdownMenuItem(value: 0, child: Text('TEAM 1 + Hành chính')),
                    DropdownMenuItem(value: 1, child: Text('TEAM 2 + Hành chính')),
                    DropdownMenuItem(value: 2, child: Text('TEAM 1')),
                    DropdownMenuItem(value: 3, child: Text('TEAM 2')),
                    DropdownMenuItem(value: 4, child: Text('Hành chính')),
                    DropdownMenuItem(value: 5, child: Text('Tất cả')),
                  ],
                  onChanged: (v) {
                    if (v == null) return;
                    setState(() => _teamNameList = v);
                  },
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                onPressed: () => ref.invalidate(dieuChuyenTeamProvider((widget.option1, _teamNameList))),
                icon: const Icon(Icons.refresh),
              ),
            ],
          ),
        ),
        Expanded(
          child: dataAsync.when(
            data: (items) {
              if (items.isEmpty) return const Center(child: Text('Không có dữ liệu'));

              final workPositions = workPosAsync.maybeWhen(data: (v) => v, orElse: () => const <Map<String, dynamic>>[]);

              return RefreshIndicator(
                onRefresh: () async => ref.invalidate(dieuChuyenTeamProvider((widget.option1, _teamNameList))),
                child: ListView.separated(
                  itemCount: items.length,
                  separatorBuilder: (_, __) => const Divider(height: 1),
                  itemBuilder: (context, index) {
                    return _DieuChuyenRow(
                      option1: widget.option1,
                      teamNameList: _teamNameList,
                      item: items[index],
                      workPositions: workPositions,
                    );
                  },
                ),
              );
            },
            error: (e, _) => Center(child: Text('Lỗi: $e')),
            loading: () => const Center(child: CircularProgressIndicator()),
          ),
        ),
      ],
    );

    if (widget.embedded) return body;

    return Scaffold(
      appBar: AppBar(title: const Text('Điều chuyển team')),
      drawer: const AppDrawer(title: 'Menu'),
      body: body,
    );
  }
}

class _DieuChuyenRow extends ConsumerStatefulWidget {
  const _DieuChuyenRow({
    required this.option1,
    required this.teamNameList,
    required this.item,
    required this.workPositions,
  });

  final String option1;
  final int teamNameList;
  final Map<String, dynamic> item;
  final List<Map<String, dynamic>> workPositions;

  @override
  ConsumerState<_DieuChuyenRow> createState() => _DieuChuyenRowState();
}

class _DieuChuyenRowState extends ConsumerState<_DieuChuyenRow> {
  bool _forceCaPresets = false;

  String _displayName() {
    final full = (widget.item['FULL_NAME'] ?? '').toString().trim();
    if (full.isNotEmpty) return full;
    return '${(widget.item['MIDLAST_NAME'] ?? '').toString()} ${(widget.item['FIRST_NAME'] ?? '').toString()}'.trim();
  }

  Future<void> _setTeam(int value) async {
    final repo = ref.read(hrRepositoryProvider);
    final emplNo = (widget.item['EMPL_NO'] ?? '').toString();
    if (emplNo.isEmpty) return;

    final err = await repo.setTeamNhom(emplNo: emplNo, teamValue: value);
    if (err != null) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $err')));
      return;
    }

    ref.invalidate(dieuChuyenTeamProvider((widget.option1, widget.teamNameList)));
  }

  Future<void> _setCa(int value) async {
    final repo = ref.read(hrRepositoryProvider);
    final emplNo = (widget.item['EMPL_NO'] ?? '').toString();
    if (emplNo.isEmpty) return;

    final err = await repo.setCa(emplNo: emplNo, caLv: value);
    if (err != null) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $err')));
      return;
    }

    if (!mounted) return;
    setState(() => _forceCaPresets = false);
    ref.invalidate(dieuChuyenTeamProvider((widget.option1, widget.teamNameList)));
  }

  void _resetCa() {
    setState(() => _forceCaPresets = true);
  }

  Future<void> _setFactory(int value) async {
    final repo = ref.read(hrRepositoryProvider);
    final emplNo = (widget.item['EMPL_NO'] ?? '').toString();
    if (emplNo.isEmpty) return;

    final err = await repo.setNhaMay(emplNo: emplNo, factory: value);
    if (err != null) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $err')));
      return;
    }

    ref.invalidate(dieuChuyenTeamProvider((widget.option1, widget.teamNameList)));
  }

  Future<void> _setViTri(int workPositionCode) async {
    final repo = ref.read(hrRepositoryProvider);
    final emplNo = (widget.item['EMPL_NO'] ?? '').toString();
    if (emplNo.isEmpty) return;

    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Chuyển vị trí'),
        content: Text('Chắc chắn muốn chuyển vị trí cho $emplNo?'),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Hủy')),
          FilledButton(onPressed: () => Navigator.of(ctx).pop(true), child: const Text('Chuyển')),
        ],
      ),
    );

    if (ok != true) return;

    final err = await repo.setEmplWorkPosition(emplNo: emplNo, workPositionCode: workPositionCode);
    if (err != null) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $err')));
      return;
    }

    ref.invalidate(dieuChuyenTeamProvider((widget.option1, widget.teamNameList)));
  }

  @override
  Widget build(BuildContext context) {
    final emplNo = (widget.item['EMPL_NO'] ?? '').toString();
    final cmsId = (widget.item['CMS_ID'] ?? '').toString();
    final name = _displayName();
    final workShiftName = (widget.item['WORK_SHIF_NAME'] ?? '').toString();
    final subDept = (widget.item['SUBDEPTNAME'] ?? '').toString();
    final mainDept = (widget.item['MAINDEPTNAME'] ?? '').toString();
    final factoryName = (widget.item['FACTORY_NAME'] ?? '').toString();

    final calv = widget.item['CALV'];
    final showCaPresets = calv == null || _forceCaPresets;

    final currentWorkPositionCode = int.tryParse((widget.item['WORK_POSITION_CODE'] ?? '').toString());

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.network(
                  AppConfig.employeeImageUrl(emplNo),
                  width: 64,
                  height: 64,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                    width: 64,
                    height: 64,
                    color: Colors.grey.shade300,
                    child: const Icon(Icons.person),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(name, style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                    Text('EMPL_NO: $emplNo | NS_ID: $cmsId'),
                    Text('$mainDept/$subDept | $workShiftName'),
                    Text('Nhà máy: $factoryName'),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          _TeamButtons(workShiftName: workShiftName, onSetTeam: _setTeam),
          const SizedBox(height: 6),
          if (showCaPresets)
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: [
                OutlinedButton(onPressed: () => _setCa(0), child: const Text('Ca HC')),
                OutlinedButton(onPressed: () => _setCa(1), child: const Text('Ca ngày')),
                OutlinedButton(onPressed: () => _setCa(2), child: const Text('Ca đêm')),
              ],
            )
          else
            Row(
              children: [
                Expanded(child: Text('Ca: ${calv == 0 ? 'Ca HC' : calv == 1 ? 'Ca ngày' : 'Ca đêm'}')),
                TextButton(onPressed: _resetCa, child: const Text('RESET')),
              ],
            ),
          const SizedBox(height: 6),
          _FactoryButtons(factoryName: factoryName, onSetFactory: _setFactory),
          const SizedBox(height: 6),
          if (widget.workPositions.isNotEmpty)
            DropdownButtonFormField<int>(
              initialValue: currentWorkPositionCode,
              decoration: const InputDecoration(labelText: 'Vị trí', border: OutlineInputBorder()),
              items: [
                for (final wp in widget.workPositions)
                  DropdownMenuItem(
                    value: int.tryParse((wp['WORK_POSITION_CODE'] ?? '').toString()) ?? 0,
                    child: Text((wp['WORK_POSITION_NAME'] ?? '').toString()),
                  ),
              ],
              onChanged: (v) {
                if (v == null) return;
                _setViTri(v);
              },
            ),
        ],
      ),
    );
  }
}

class _TeamButtons extends StatelessWidget {
  const _TeamButtons({required this.workShiftName, required this.onSetTeam});

  final String workShiftName;
  final void Function(int value) onSetTeam;

  @override
  Widget build(BuildContext context) {
    final ws = workShiftName;
    if (ws == 'Hành Chính') {
      return Wrap(
        spacing: 8,
        runSpacing: 8,
        children: [
          FilledButton.tonal(onPressed: () => onSetTeam(1), child: const Text('TEAM1')),
          FilledButton.tonal(onPressed: () => onSetTeam(2), child: const Text('TEAM2')),
        ],
      );
    }
    if (ws == 'TEAM 1') {
      return Wrap(
        spacing: 8,
        runSpacing: 8,
        children: [
          FilledButton.tonal(onPressed: () => onSetTeam(0), child: const Text('Hành chính')),
          FilledButton.tonal(onPressed: () => onSetTeam(2), child: const Text('TEAM2')),
        ],
      );
    }
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        FilledButton.tonal(onPressed: () => onSetTeam(1), child: const Text('TEAM1')),
        FilledButton.tonal(onPressed: () => onSetTeam(0), child: const Text('Hành chính')),
      ],
    );
  }
}

class _FactoryButtons extends StatelessWidget {
  const _FactoryButtons({required this.factoryName, required this.onSetFactory});

  final String factoryName;
  final void Function(int value) onSetFactory;

  @override
  Widget build(BuildContext context) {
    if (factoryName == 'Nhà máy 1') {
      return Wrap(
        spacing: 8,
        runSpacing: 8,
        children: [
          OutlinedButton(onPressed: () => onSetFactory(2), child: const Text('SET NM2')),
        ],
      );
    }
    if (factoryName == 'Nhà máy 2') {
      return Wrap(
        spacing: 8,
        runSpacing: 8,
        children: [
          OutlinedButton(onPressed: () => onSetFactory(1), child: const Text('SET NM1')),
        ],
      );
    }
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        OutlinedButton(onPressed: () => onSetFactory(1), child: const Text('SET NM1')),
        OutlinedButton(onPressed: () => onSetFactory(2), child: const Text('SET NM2')),
      ],
    );
  }
}
