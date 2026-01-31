import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../app/app_drawer.dart';
import '../../../core/utils/date_utils.dart';
import '../../../core/utils/excel_exporter.dart';
import '../application/hr_providers.dart';

class ListChamCongPage extends ConsumerStatefulWidget {
  const ListChamCongPage({super.key});

  @override
  ConsumerState<ListChamCongPage> createState() => _ListChamCongPageState();
}

class _ListChamCongPageState extends ConsumerState<ListChamCongPage> {
  late DateTime _fromDate;
  late DateTime _toDate;
  bool _trungHiViec = true;
  bool _trungHiSinh = true;

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _fromDate = DateTime(now.year, now.month, now.day);
    _toDate = DateTime(now.year, now.month, now.day);
  }

  final Set<String> _selectedIds = <String>{};

  void _toggleSelection(String id) {
    setState(() {
      if (_selectedIds.contains(id)) {
        _selectedIds.remove(id);
      } else {
        _selectedIds.add(id);
      }
    });
  }

  List<Map<String, dynamic>> _selectedItems(List<Map<String, dynamic>> allItems) {
    return allItems.where((item) => _selectedIds.contains(_getRowId(item))).toList();
  }

  String _getRowId(Map<String, dynamic> item) {
    final emplNo = (item['EMPL_NO'] ?? '').toString();
    final date = AppDateUtils.ymdFromValue(item['DATE_COLUMN']);
    return '${emplNo}_$date';
  }

  int _currentTeamFromShiftName(Object? name) {
    final s = (name ?? '').toString().toLowerCase();
    if (s.contains('hành') || s.contains('hanh')) return 0;
    if (s.contains('team 1')) return 1;
    if (s.contains('team 2')) return 2;
    return 0;
  }

  Future<bool> _confirm(BuildContext context, String title) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(title),
        content: const Text('Xác nhận thao tác?'),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Hủy')),
          FilledButton(onPressed: () => Navigator.of(ctx).pop(true), child: const Text('OK')),
        ],
      ),
    );
    return ok == true;
  }

  Future<void> _updateFixTime(List<Map<String, dynamic>> selected) async {
    if (selected.isEmpty) return;

    final messenger = ScaffoldMessenger.of(context);
    final ok = await _confirm(context, 'UPDATE FIX TIME');
    if (!ok) return;

    if (!mounted) return;
    final repo = ref.read(hrRepositoryProvider);

    for (final row in selected) {
      final onOff = row['ON_OFF'];
      final emplNo = (row['EMPL_NO'] ?? '').toString();
      final applyDate = AppDateUtils.ymdFromValue(row['DATE_COLUMN']);
      if (emplNo.isEmpty || applyDate.isEmpty) continue;

      if (onOff == null) {
        final inTime = (row['IN_TIME'] ?? '').toString();
        final outTime = (row['OUT_TIME'] ?? '').toString();
        final value = (inTime.contains('Thiếu') && outTime.contains('Thiếu')) ? 0 : 1;
        final currentTeam = _currentTeamFromShiftName(row['WORK_SHIF_NAME']);
        final currentCa = _currentTeamFromShiftName(row['WORK_SHIF_NAME']) == 0 ? 0 : (int.tryParse((row['CALV'] ?? 0).toString()) ?? 0);

        final errSet = await repo.setDiemDanhNhom2(
          applyDate: applyDate,
          diemDanhValue: value,
          emplNo: emplNo,
          currentTeam: currentTeam,
          currentCa: currentCa,
        );
        if (errSet != null) {
          messenger.showSnackBar(SnackBar(content: Text('Lỗi update fix time: $errSet')));
          return;
        }
      }
    }

    messenger.showSnackBar(const SnackBar(content: Text('Đã update fix time')));
    final key = (AppDateUtils.ymd(_fromDate), AppDateUtils.ymd(_toDate), _trungHiViec, _trungHiSinh);
    ref.invalidate(listChamCongProvider(key));
  }

  Future<void> _fixAutoTimeHangLoat(List<Map<String, dynamic>> selected) async {
    if (selected.isEmpty) return;

    final messenger = ScaffoldMessenger.of(context);
    final ok = await _confirm(context, 'FIX AUTO TIME');
    if (!ok) return;

    // TODO: implement fixAutoTime in HrRepository if needed
    messenger.showSnackBar(const SnackBar(content: Text('FIX AUTO TIME chưa hỗ trợ')));
  }

  Future<void> _setCa(List<Map<String, dynamic>> selected, int ca) async {
    if (selected.isEmpty) return;

    final messenger = ScaffoldMessenger.of(context);
    final ok = await _confirm(context, 'SET CA ${ca == 0 ? 'HC' : ca == 1 ? 'NGÀY' : 'ĐÊM'}');
    if (!ok) return;

    if (!mounted) return;
    final repo = ref.read(hrRepositoryProvider);

    for (final row in selected) {
      final emplNo = (row['EMPL_NO'] ?? '').toString();
      if (emplNo.isEmpty) continue;

      final err = await repo.setCa(emplNo: emplNo, caLv: ca);
      if (err != null) {
        messenger.showSnackBar(SnackBar(content: Text('Lỗi set ca: $err')));
        return;
      }
    }

    messenger.showSnackBar(const SnackBar(content: Text('Đã set ca')));
    final key = (AppDateUtils.ymd(_fromDate), AppDateUtils.ymd(_toDate), _trungHiViec, _trungHiSinh);
    ref.invalidate(listChamCongProvider(key));
  }

  Future<void> _pickFrom() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _fromDate,
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
    );
    if (picked == null) return;
    setState(() {
      _fromDate = picked;
      if (_toDate.isBefore(_fromDate)) _toDate = _fromDate;
    });
  }

  Future<void> _pickTo() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _toDate,
      firstDate: _fromDate,
      lastDate: DateTime(2100),
    );
    if (picked == null) return;
    setState(() => _toDate = picked);
  }

  @override
  Widget build(BuildContext context) {
    final key = (AppDateUtils.ymd(_fromDate), AppDateUtils.ymd(_toDate), _trungHiViec, _trungHiSinh);
    final dataAsync = ref.watch(listChamCongProvider(key));

    return Scaffold(
      appBar: AppBar(title: const Text('Bảng chấm công')),
      drawer: const AppDrawer(title: 'Menu'),
      body: Column(
        children: [
          Card(
            margin: const EdgeInsets.all(8),
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: _pickFrom,
                          icon: const Icon(Icons.date_range),
                          label: Text('From: ${key.$1}'),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: _pickTo,
                          icon: const Icon(Icons.date_range),
                          label: Text('To: ${key.$2}'),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      Expanded(
                        child: SwitchListTile.adaptive(
                          contentPadding: EdgeInsets.zero,
                          title: const Text('Trừ nghỉ việc'),
                          value: _trungHiViec,
                          onChanged: (v) => setState(() => _trungHiViec = v),
                        ),
                      ),
                      Expanded(
                        child: SwitchListTile.adaptive(
                          contentPadding: EdgeInsets.zero,
                          title: const Text('Trừ nghỉ sinh'),
                          value: _trungHiSinh,
                          onChanged: (v) => setState(() => _trungHiSinh = v),
                        ),
                      ),
                      FilledButton.icon(
                        onPressed: () => ref.invalidate(listChamCongProvider(key)),
                        icon: const Icon(Icons.search),
                        label: const Text('Tra chấm công'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  dataAsync.maybeWhen(
                    data: (items) {
                      final selected = _selectedItems(items);
                      return SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: [
                            FilledButton.tonal(
                              onPressed: selected.isEmpty ? null : () => _updateFixTime(selected),
                              child: const Text('UPDATE FIX TIME'),
                            ),
                            const SizedBox(width: 8),
                            FilledButton.tonal(
                              onPressed: selected.isEmpty ? null : () => _fixAutoTimeHangLoat(selected),
                              child: const Text('FIX AUTO TIME'),
                            ),
                            const SizedBox(width: 8),
                            FilledButton.tonal(
                              onPressed: selected.isEmpty ? null : () => _setCa(selected, 0),
                              child: const Text('SET CA HC'),
                            ),
                            const SizedBox(width: 8),
                            FilledButton.tonal(
                              onPressed: selected.isEmpty ? null : () => _setCa(selected, 1),
                              child: const Text('SET CA NGÀY'),
                            ),
                            const SizedBox(width: 8),
                            FilledButton.tonal(
                              onPressed: selected.isEmpty ? null : () => _setCa(selected, 2),
                              child: const Text('SET CA ĐÊM'),
                            ),
                            const SizedBox(width: 8),
                            OutlinedButton.icon(
                              onPressed: items.isEmpty
                                  ? null
                                  : () => ExcelExporter.shareAsXlsx(
                                        fileName: 'bang_cham_cong_${key.$1}_${key.$2}.xlsx',
                                        rows: selected.isEmpty ? items : selected,
                                        columns: _cmsColumnFields,
                                      ),
                              icon: const Icon(Icons.download),
                              label: const Text('Export Excel'),
                            ),
                          ],
                        ),
                      );
                    },
                    orElse: () => const SizedBox.shrink(),
                  ),
                ],
              ),
            ),
          ),
          const Divider(height: 1),
          Expanded(
            child: dataAsync.when(
              data: (items) {
                if (items.isEmpty) return const Center(child: Text('Không có dữ liệu'));

                return RefreshIndicator(
                  onRefresh: () async => ref.invalidate(listChamCongProvider(key)),
                  child: ListView.separated(
                    itemCount: items.length,
                    separatorBuilder: (_, __) => const Divider(height: 1),
                    itemBuilder: (context, index) {
                      final item = items[index];
                      final id = _getRowId(item);
                      final isSelected = _selectedIds.contains(id);
                      final date = AppDateUtils.ymdFromValue(item['DATE_COLUMN']);
                      final weekday = DateTime.tryParse(date)?.weekday ?? 1;
                      final weekdayLabels = ['', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
                      final fullName = '${item['MIDLAST_NAME'] ?? ''} ${item['FIRST_NAME'] ?? ''}'.trim();
                      final fixedIn = item['FIXED_IN_TIME']?.toString() ?? '-';
                      final fixedOut = item['FIXED_OUT_TIME']?.toString() ?? '-';
                      
                      return CheckboxListTile(
                        value: isSelected,
                        onChanged: (_) => _toggleSelection(id),
                        title: Text(
                          '$date (${weekdayLabels[weekday]})',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(fullName.isEmpty ? (item['EMPL_NO'] ?? '-').toString() : fullName),
                            Text('CMS ID: ${item['CMS_ID'] ?? '-'}'),
                            Text('Main Dept: ${item['MAINDEPTNAME'] ?? '-'}'),
                            Row(
                              children: [
                                Text(
                                  'IN: $fixedIn',
                                  style: TextStyle(color: fixedIn != '-' ? Colors.green : null),
                                ),
                                const SizedBox(width: 16),
                                Text(
                                  'OUT: $fixedOut',
                                  style: TextStyle(color: fixedOut != '-' ? Colors.red : null),
                                ),
                              ],
                            ),
                          ],
                        ),
                        secondary: const Icon(Icons.person),
                        controlAffinity: ListTileControlAffinity.leading,
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
      ),
    );
  }

  static const List<String> _cmsColumnFields = [
    'DATE_COLUMN',
    'WEEKDAY',
    'NV_CCID',
    'EMPL_NO',
    'CMS_ID',
    'FULL_NAME',
    'FACTORY_NAME',
    'WORK_SHIF_NAME',
    'CALV',
    'MAINDEPTNAME',
    'SUBDEPTNAME',
    'FIXED_IN_TIME',
    'FIXED_OUT_TIME',
    'IN_TIME',
    'OUT_TIME',
    'STATUS',
    'WORK_HOUR',
    'REASON_NAME',
    'CHECK1',
    'CHECK2',
    'CHECK3',
    'PREV_CHECK1',
    'PREV_CHECK2',
    'PREV_CHECK3',
    'NEXT_CHECK1',
    'NEXT_CHECK2',
    'NEXT_CHECK3',
    'L100',
    'L130',
    'L150',
    'L200',
    'L210',
    'L270',
    'L300',
    'L390',
  ];
}
