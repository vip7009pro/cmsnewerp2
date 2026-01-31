import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pluto_grid/pluto_grid.dart';

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

  PlutoGridStateManager? _stateManager;

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _fromDate = DateTime(now.year, now.month, now.day);
    _toDate = DateTime(now.year, now.month, now.day);
  }

  List<Map<String, dynamic>> _selectedItems(List<Map<String, dynamic>> allItems) {
    final sm = _stateManager;
    if (sm == null) return const [];
    final checkedRows = sm.checkedRows;
    if (checkedRows.isEmpty) return const [];

    final out = <Map<String, dynamic>>[];
    for (final r in checkedRows) {
      final it = r.cells['__raw__']?.value;
      if (it is Map<String, dynamic>) out.add(it);
    }
    return out;
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
          messenger.showSnackBar(SnackBar(content: Text('Lỗi setdiemdanhnhom2 ($emplNo/$applyDate): $errSet')));
        }
      }

      final errFix = await repo.fixTime(
        applyDate: applyDate,
        emplNo: emplNo,
        inTime: (row['FIXED_IN_TIME'] ?? '').toString(),
        outTime: (row['FIXED_OUT_TIME'] ?? '').toString(),
        workHour: row['WORK_HOUR'],
      );
      if (errFix != null) {
        messenger.showSnackBar(SnackBar(content: Text('Lỗi fixTime ($emplNo/$applyDate): $errFix')));
      }
    }

    messenger.showSnackBar(const SnackBar(content: Text('UPDATE FIX TIME xong')));
  }

  Future<void> _fixAutoTimeHangLoat(List<Map<String, dynamic>> selected) async {
    if (selected.isEmpty) return;

    final messenger = ScaffoldMessenger.of(context);
    final ok = await _confirm(context, 'FIX AUTO TIME');
    if (!ok) return;

    if (!mounted) return;
    final repo = ref.read(hrRepositoryProvider);
    final err = await repo.fixTimeHangLoat(timeData: selected);
    if (err != null) {
      messenger.showSnackBar(SnackBar(content: Text('Lỗi fixTimehangloat: $err')));
      return;
    }
    messenger.showSnackBar(const SnackBar(content: Text('FIX AUTO TIME xong')));
  }

  Future<void> _setCa(List<Map<String, dynamic>> selected, int caLv) async {
    if (selected.isEmpty) return;

    final messenger = ScaffoldMessenger.of(context);
    final ok = await _confirm(context, 'SET CA');
    if (!ok) return;

    if (!mounted) return;
    final repo = ref.read(hrRepositoryProvider);

    for (final row in selected) {
      final emplNo = (row['EMPL_NO'] ?? '').toString();
      final applyDate = AppDateUtils.ymdFromValue(row['DATE_COLUMN']);
      if (emplNo.isEmpty || applyDate.isEmpty) continue;

      final err = await repo.setCaDiemDanh(emplNo: emplNo, applyDate: applyDate, caLv: caLv);
      if (err != null) {
        messenger.showSnackBar(SnackBar(content: Text('Lỗi setcadiemdanh ($emplNo/$applyDate): $err')));
      }
    }

    messenger.showSnackBar(const SnackBar(content: Text('SET CA xong')));
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
      appBar: AppBar(title: const Text('List chấm công')),
      drawer: const AppDrawer(title: 'Menu'),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8),
            child: Column(
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
          const Divider(height: 1),
          Expanded(
            child: dataAsync.when(
              data: (items) {
                if (items.isEmpty) return const Center(child: Text('Không có dữ liệu'));

                final columns = _buildColumns();
                final rows = _buildRows(items, columns);

                return RefreshIndicator(
                  onRefresh: () async => ref.invalidate(listChamCongProvider(key)),
                  child: PlutoGrid(
                    key: ValueKey(key),
                    columns: columns,
                    rows: rows,
                    onLoaded: (event) {
                      _stateManager = event.stateManager;
                      event.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                      event.stateManager.setShowColumnFilter(true);
                    },
                    onRowChecked: (event) {
                      if (!mounted) return;
                      setState(() {});
                    },
                    configuration: const PlutoGridConfiguration(
                      columnSize: PlutoGridColumnSizeConfig(autoSizeMode: PlutoAutoSizeMode.scale),
                    ),
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

  List<PlutoColumn> _buildColumns() {
    PlutoColumn col(String field, String title, {double width = 120, PlutoColumnType? type}) {
      return PlutoColumn(
        title: title,
        field: field,
        width: width,
        type: type ?? PlutoColumnType.text(),
        enableSorting: true,
        enableFilterMenuItem: true,
      );
    }

    PlutoColumn styledCol(
      String field,
      String title, {
      required double width,
      TextStyle Function(PlutoColumnRendererContext ctx)? style,
    }) {
      return PlutoColumn(
        title: title,
        field: field,
        width: width,
        type: PlutoColumnType.text(),
        enableSorting: true,
        enableFilterMenuItem: true,
        renderer: style == null
            ? null
            : (ctx) => Text(
                  (ctx.cell.value ?? '').toString(),
                  overflow: TextOverflow.ellipsis,
                  style: style(ctx),
                ),
      );
    }

    return [
      PlutoColumn(
        title: '',
        field: '__raw__',
        type: PlutoColumnType.text(),
        width: 0,
        hide: true,
      ),
      PlutoColumn(
        title: '✓',
        field: '__check__',
        type: PlutoColumnType.text(),
        width: 44,
        enableSorting: false,
        enableFilterMenuItem: false,
        enableRowChecked: true,
      ),
      col('DATE_COLUMN', 'DATE', width: 110),
      col('WEEKDAY', 'WEEKDAY', width: 90),
      col('NV_CCID', 'NV_CCID', width: 90),
      col('EMPL_NO', 'EMPL_NO', width: 110),
      col('CMS_ID', 'CMS_ID', width: 90),
      styledCol(
        'FULL_NAME',
        'FULL_NAME',
        width: 180,
        style: (_) => const TextStyle(color: Color(0xFF013B92), fontWeight: FontWeight.bold),
      ),
      col('FACTORY_NAME', 'FACTORY_NAME', width: 110),
      col('WORK_SHIF_NAME', 'SHIFT', width: 120),
      col('CALV', 'CALV', width: 90),
      col('MAINDEPTNAME', 'MAINDEPTNAME', width: 120),
      col('SUBDEPTNAME', 'SUBDEPTNAME', width: 120),
      styledCol(
        'FIXED_IN_TIME',
        'FIXED_IN',
        width: 120,
        style: (ctx) {
          final v = (ctx.cell.value ?? '').toString();
          if (v == 'OFF') return const TextStyle(color: Colors.red, fontWeight: FontWeight.bold);
          return const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold);
        },
      ),
      styledCol(
        'FIXED_OUT_TIME',
        'FIXED_OUT',
        width: 120,
        style: (ctx) {
          final v = (ctx.cell.value ?? '').toString();
          if (v == 'OFF') return const TextStyle(color: Colors.red, fontWeight: FontWeight.bold);
          return const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold);
        },
      ),
      styledCol(
        'IN_TIME',
        'AUTO_IN',
        width: 120,
        style: (ctx) {
          final v = (ctx.cell.value ?? '').toString();
          if (v.contains('Thiếu')) return const TextStyle(color: Colors.red, fontWeight: FontWeight.bold);
          return const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold);
        },
      ),
      styledCol(
        'OUT_TIME',
        'AUTO_OUT',
        width: 120,
        style: (ctx) {
          final v = (ctx.cell.value ?? '').toString();
          if (v.contains('Thiếu')) return const TextStyle(color: Colors.red, fontWeight: FontWeight.bold);
          return const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold);
        },
      ),
      styledCol(
        'STATUS',
        'STATUS',
        width: 130,
        style: (ctx) {
          final v = (ctx.cell.value ?? '').toString();
          if (v == 'Thiếu công') return const TextStyle(color: Colors.red);
          return const TextStyle(color: Colors.blue);
        },
      ),
      col('WORK_HOUR', 'WORK_HOUR', width: 100),
      col('REASON_NAME', 'REASON', width: 140),
      col('CHECK1', 'CHECK1', width: 120),
      col('CHECK2', 'CHECK2', width: 120),
      col('CHECK3', 'CHECK3', width: 120),
      col('PREV_CHECK1', 'PREV_CHECK1', width: 120),
      col('PREV_CHECK2', 'PREV_CHECK2', width: 120),
      col('PREV_CHECK3', 'PREV_CHECK3', width: 120),
      col('NEXT_CHECK1', 'NEXT_CHECK1', width: 120),
      col('NEXT_CHECK2', 'NEXT_CHECK2', width: 120),
      col('NEXT_CHECK3', 'NEXT_CHECK3', width: 120),
      col('L100', 'L100', width: 80),
      col('L130', 'L130', width: 80),
      col('L150', 'L150', width: 80),
      col('L200', 'L200', width: 80),
      col('L210', 'L210', width: 80),
      col('L270', 'L270', width: 80),
      col('L300', 'L300', width: 80),
      col('L390', 'L390', width: 80),
    ];
  }

  List<PlutoRow> _buildRows(List<Map<String, dynamic>> items, List<PlutoColumn> columns) {
    Object? getByAliases(Map<String, dynamic> it, String field) {
      if (it.containsKey(field)) {
        final v = it[field];
        if (v != null) {
          final s = v.toString().trim();
          if (s.isNotEmpty && s.toLowerCase() != 'null') return v;
        }
      }

      const aliases = <String, List<String>>{
        'FULL_NAME': ['FULLNAME', 'FULL_NAME'],
        'WEEKDAY': ['WEEK_DAY', 'WEEKDAY'],
        'WORK_SHIF_NAME': ['WORK_SHIFT_NAME', 'WORK_SHIF_NAME'],
        'FIXED_IN_TIME': ['FIXED_IN', 'FIXEDINTIME', 'FIXED_IN_TIME'],
        'FIXED_OUT_TIME': ['FIXED_OUT', 'FIXEDOUTTIME', 'FIXED_OUT_TIME'],
        'IN_TIME': ['AUTO_IN_TIME', 'AUTO_INTIME', 'IN_TIME'],
        'OUT_TIME': ['AUTO_OUT_TIME', 'AUTO_OUTTIME', 'OUT_TIME'],
        'CMS_ID': ['NS_ID', 'CMS_ID'],
      };

      final list = aliases[field];
      if (list == null) return null;
      for (final k in list) {
        if (!it.containsKey(k)) continue;
        final v = it[k];
        if (v == null) continue;
        final s = v.toString().trim();
        if (s.isEmpty || s.toLowerCase() == 'null') continue;
        return v;
      }

      if (field == 'FULL_NAME') {
        final mid = (it['MIDLAST_NAME'] ?? '').toString().trim();
        final first = (it['FIRST_NAME'] ?? '').toString().trim();
        final full = '$mid $first'.trim();
        if (full.isNotEmpty) return full;
      }

      if (field == 'FIXED_IN_TIME' || field == 'FIXED_OUT_TIME') {
        // Web shows X when null.
        return 'X';
      }

      return null;
    }

    String weekdayFromDateValue(Object? dateVal) {
      try {
        final s = AppDateUtils.ymdFromValue(dateVal);
        if (s.isEmpty) return '';
        final dt = DateTime.parse(s);
        // VN short: T2..T7, CN
        switch (dt.weekday) {
          case DateTime.monday:
            return 'T2';
          case DateTime.tuesday:
            return 'T3';
          case DateTime.wednesday:
            return 'T4';
          case DateTime.thursday:
            return 'T5';
          case DateTime.friday:
            return 'T6';
          case DateTime.saturday:
            return 'T7';
          case DateTime.sunday:
            return 'CN';
        }
      } catch (_) {
        return '';
      }
      return '';
    }

    Object? val(Map<String, dynamic> it, String field) {
      if (field == 'DATE_COLUMN') return AppDateUtils.ymdFromValue(it['DATE_COLUMN']);
      if (field == 'WEEKDAY') {
        final raw = getByAliases(it, field);
        final s = (raw ?? '').toString().trim();
        if (s.isNotEmpty) return s;
        return weekdayFromDateValue(it['DATE_COLUMN']);
      }
      if (field == '__raw__') return it;
      if (field == '__check__') return '';

      if (field.startsWith('L')) {
        final raw = it[field];
        if (raw == null) return '0';
        if (raw is num) return raw.toString();
        final s = raw.toString().trim();
        if (s.isEmpty) return '0';
        final n = num.tryParse(s);
        return (n ?? 0).toString();
      }

      final v = getByAliases(it, field);
      if (v == null) return '';
      return v;
    }

    return [
      for (final it in items)
        PlutoRow(
          checked: false,
          cells: {
            for (final c in columns)
              c.field: PlutoCell(
                value: val(it, c.field),
              ),
          },
        ),
    ];
  }
}
