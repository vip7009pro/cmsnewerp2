import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../app/app_drawer.dart';
import '../../../core/config/app_config.dart';
import '../application/hr_providers.dart';

class DiemDanhNhomPage extends ConsumerStatefulWidget {
  const DiemDanhNhomPage({super.key, required this.option, this.embedded = false});

  final String option;
  final bool embedded;

  @override
  ConsumerState<DiemDanhNhomPage> createState() => _DiemDanhNhomPageState();
}

class _DiemDanhNhomPageState extends ConsumerState<DiemDanhNhomPage> {
  int _teamNameList = 5;

  Widget _buildBody(AsyncValue<List<Map<String, dynamic>>> dataAsync) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(8),
          child: Row(
            children: [
              Expanded(
                child: DropdownButtonFormField<int>(
                  initialValue: _teamNameList,
                  decoration: const InputDecoration(
                    labelText: 'Ca làm việc',
                    border: OutlineInputBorder(),
                  ),
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
                onPressed: () => ref.invalidate(diemDanhNhomProvider((widget.option, _teamNameList))),
                icon: const Icon(Icons.refresh),
              ),
            ],
          ),
        ),
        Expanded(
          child: dataAsync.when(
            data: (items) {
              if (items.isEmpty) {
                return const Center(child: Text('Không có dữ liệu'));
              }
              return RefreshIndicator(
                onRefresh: () async => ref.invalidate(diemDanhNhomProvider((widget.option, _teamNameList))),
                child: ListView.separated(
                  itemCount: items.length,
                  separatorBuilder: (_, __) => const Divider(height: 1),
                  itemBuilder: (context, index) {
                    return _DiemDanhRow(
                      option: widget.option,
                      teamNameList: _teamNameList,
                      item: items[index],
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
  }

  @override
  Widget build(BuildContext context) {
    final dataAsync = ref.watch(diemDanhNhomProvider((widget.option, _teamNameList)));

    if (widget.embedded) {
      return _buildBody(dataAsync);
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Điểm danh nhóm'),
      ),
      drawer: const AppDrawer(title: 'Menu'),
      body: _buildBody(dataAsync),
    );
  }
}

class _DiemDanhRow extends ConsumerStatefulWidget {
  const _DiemDanhRow({required this.option, required this.teamNameList, required this.item});

  final String option;
  final int teamNameList;
  final Map<String, dynamic> item;

  @override
  ConsumerState<_DiemDanhRow> createState() => _DiemDanhRowState();
}

class _DiemDanhRowState extends ConsumerState<_DiemDanhRow> {
  bool _forceAttendancePresets = false;
  bool _forceOvertimePresets = false;

  int _currentTeamFromShiftName(String? name) {
    final s = (name ?? '').toLowerCase();
    if (s.contains('hành') || s.contains('hanh')) return 0;
    if (s.contains('team 1')) return 1;
    if (s.contains('team 2')) return 2;
    return 0;
  }

  Future<void> _setDiemDanh({required int type, int? calv}) async {
    final repo = ref.read(hrRepositoryProvider);

    final emplNo = (widget.item['EMPL_NO'] ?? '').toString();
    if (emplNo.isEmpty) return;

    final offId = widget.item['OFF_ID'];
    final reasonName = (widget.item['REASON_NAME'] ?? '').toString();

    // Web: type=1 only when OFF_ID is null or REASON_NAME == 'Nửa phép'
    if (type == 1 && !(offId == null || reasonName == 'Nửa phép')) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Đã đăng ký nghỉ rồi, không điểm danh được')));
      return;
    }

    final currentTeam = _currentTeamFromShiftName(widget.item['WORK_SHIF_NAME']?.toString());
    final currentCa = (widget.item['WORK_SHIF_NAME']?.toString() ?? '').contains('Hành') ? 0 : (calv ?? 0);

    if (type == 2) {
      // 50%: setdiemdanhnhom with diemdanhvalue=0 then auto reason 5
      final err = await repo.setDiemDanhNhom(
        diemdanhValue: 0,
        emplNo: emplNo,
        currentTeam: currentTeam,
        currentCa: currentCa,
      );
      if (err != null) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $err')));
        return;
      }
      if (offId == null) {
        await repo.dangKyNghiAuto(
          emplNo: emplNo,
          reasonCode: 5,
          remarkContent: 'AUTO',
        );
      }
    } else {
      final err = await repo.setDiemDanhNhom(
        diemdanhValue: type,
        emplNo: emplNo,
        currentTeam: currentTeam,
        currentCa: currentCa,
      );
      if (err != null) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $err')));
        return;
      }

      if (type == 0 && offId == null) {
        // Web: nghỉ không đăng ký -> auto đăng ký reason 3
        await repo.dangKyNghiAuto(
          emplNo: emplNo,
          reasonCode: 3,
          remarkContent: 'AUTO',
        );
      }
    }

    if (!mounted) return;
    setState(() => _forceAttendancePresets = false);
    ref.invalidate(diemDanhNhomProvider((widget.option, widget.teamNameList)));
  }

  Future<void> _resetAttendance() async {
    final repo = ref.read(hrRepositoryProvider);
    final emplNo = (widget.item['EMPL_NO'] ?? '').toString();
    if (emplNo.isEmpty) return;

    final remark = (widget.item['REMARK'] ?? '').toString();
    if (remark == 'AUTO') {
      await repo.xoaDangKyNghiAuto(emplNo: emplNo);
    }

    if (!mounted) return;
    setState(() => _forceAttendancePresets = true);
    ref.invalidate(diemDanhNhomProvider((widget.option, widget.teamNameList)));
  }

  Future<void> _setTangCa(String overtimeInfo) async {
    final repo = ref.read(hrRepositoryProvider);
    final emplNo = (widget.item['EMPL_NO'] ?? '').toString();
    if (emplNo.isEmpty) return;

    final tangCaValue = overtimeInfo == 'KTC' ? 0 : 1;
    final err = await repo.dangKyTangCaNhom(
      emplNo: emplNo,
      tangCaValue: tangCaValue,
      overtimeInfo: overtimeInfo,
    );
    if (err != null) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $err')));
      return;
    }

    if (!mounted) return;
    setState(() => _forceOvertimePresets = false);
    ref.invalidate(diemDanhNhomProvider((widget.option, widget.teamNameList)));
  }

  void _resetOvertimePresets() {
    setState(() => _forceOvertimePresets = true);
  }

  Future<void> _updateWorkHour(BuildContext context) async {
    final repo = ref.read(hrRepositoryProvider);
    final emplNo = (widget.item['EMPL_NO'] ?? '').toString();
    if (emplNo.isEmpty) return;

    final onOff = widget.item['ON_OFF'];
    if (onOff != 1) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Nhân viên $emplNo không đi làm, hãy điểm danh đi làm trước')));
      return;
    }

    final initial = (widget.item['WORK_HOUR'] ?? '').toString();
    final ctrl = TextEditingController(text: initial);

    final value = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Cập nhật WORK_HOUR'),
        content: TextField(
          controller: ctrl,
          keyboardType: const TextInputType.numberWithOptions(decimal: true),
          decoration: const InputDecoration(labelText: 'WORK_HOUR'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(), child: const Text('Hủy')),
          FilledButton(onPressed: () => Navigator.of(ctx).pop(ctrl.text.trim()), child: const Text('Lưu')),
        ],
      ),
    );

    if (value == null || value.isEmpty) return;

    final err = await repo.updateWorkHour(
      emplNo: emplNo,
      applyDate: DateTime.now(),
      workHour: double.tryParse(value) ?? 0,
    );
    if (err != null) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $err')));
      return;
    }

    ref.invalidate(diemDanhNhomProvider((widget.option, widget.teamNameList)));
  }

  @override
  Widget build(BuildContext context) {
    final emplNo = (widget.item['EMPL_NO'] ?? '').toString();
    final name = (widget.item['FULL_NAME'] ?? '').toString().trim().isNotEmpty
        ? (widget.item['FULL_NAME'] ?? '').toString()
        : '${(widget.item['MIDLAST_NAME'] ?? '').toString()} ${(widget.item['FIRST_NAME'] ?? '').toString()}'.trim();
    final onOff = widget.item['ON_OFF'];
    final overtime = widget.item['OVERTIME'];
    final overtimeInfo = (widget.item['OVERTIME_INFO'] ?? '').toString();

    final showAttendancePresets = onOff == null || _forceAttendancePresets;
    final showOvertimePresets = overtime == null || _forceOvertimePresets;

    final color = onOff == 1
        ? Colors.green
        : onOff == 0
            ? Colors.red
            : null;

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
                    Text(
                      name,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(color: color, fontWeight: FontWeight.bold),
                    ),
                    Text('EMPL_NO: $emplNo | NS_ID: ${(widget.item['CMS_ID'] ?? '').toString()}'),
                    Text('${(widget.item['MAINDEPTNAME'] ?? '').toString()}/${(widget.item['SUBDEPTNAME'] ?? '').toString()} | ${(widget.item['WORK_SHIF_NAME'] ?? '').toString()}'),
                  ],
                ),
              ),
              if (onOff != null)
                TextButton(
                  onPressed: _resetAttendance,
                  child: const Text('RESET'),
                ),
            ],
          ),
          const SizedBox(height: 6),
          if (showAttendancePresets)
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: [
                FilledButton.tonal(
                  onPressed: () => _setDiemDanh(type: 1, calv: 1),
                  child: const Text('Làm Ngày'),
                ),
                FilledButton.tonal(
                  onPressed: () => _setDiemDanh(type: 1, calv: 2),
                  child: const Text('Làm Đêm'),
                ),
                FilledButton.tonal(
                  onPressed: () => _setDiemDanh(type: 0, calv: 1),
                  child: const Text('Nghỉ'),
                ),
                OutlinedButton(
                  onPressed: () => _setDiemDanh(type: 2),
                  child: const Text('50%'),
                ),
              ],
            )
          else
            Text(
              onOff == 1 ? 'Đi làm' : 'Nghỉ làm',
              style: Theme.of(context).textTheme.titleSmall?.copyWith(color: color, fontWeight: FontWeight.bold),
            ),
          const SizedBox(height: 6),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () => _updateWorkHour(context),
                  icon: const Icon(Icons.timer),
                  label: Text('WORK_HOUR: ${(widget.item['WORK_HOUR'] ?? '').toString()}'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          if (showOvertimePresets)
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: [
                OutlinedButton(onPressed: () => _setTangCa('KTC'), child: const Text('KTC')),
                OutlinedButton(onPressed: () => _setTangCa('0500-0800'), child: const Text('05-08')),
                OutlinedButton(onPressed: () => _setTangCa('1700-2000'), child: const Text('17-20')),
                OutlinedButton(onPressed: () => _setTangCa('1700-1800'), child: const Text('17-18')),
                OutlinedButton(onPressed: () => _setTangCa('1400-1800'), child: const Text('14-18')),
                OutlinedButton(onPressed: () => _setTangCa('1600-2000'), child: const Text('16-20')),
              ],
            )
          else
            Row(
              children: [
                Expanded(
                  child: Text(
                    'Tăng ca: $overtimeInfo',
                    style: Theme.of(context).textTheme.titleSmall?.copyWith(color: overtime == 1 ? Colors.green : Colors.red),
                  ),
                ),
                TextButton(
                  onPressed: _resetOvertimePresets,
                  child: const Text('RESET'),
                ),
              ],
            ),
        ],
      ),
    );
  }
}
