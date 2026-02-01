import 'dart:io';

import 'package:excel/excel.dart' as xls;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:path_provider/path_provider.dart';
import 'package:pluto_grid/pluto_grid.dart';
import 'package:share_plus/share_plus.dart';

import '../../../app/app_drawer.dart';
import '../../../core/providers.dart';
import '../../auth/application/auth_notifier.dart';
import '../../auth/application/auth_state.dart';

class ShortageManagerPage extends ConsumerStatefulWidget {
  const ShortageManagerPage({super.key});

  @override
  ConsumerState<ShortageManagerPage> createState() => _ShortageManagerPageState();
}

class _ShortageManagerPageState extends ConsumerState<ShortageManagerPage> {
  DateTime _fromDate = DateTime.now();
  DateTime _toDate = DateTime.now();

  bool _allTime = true;
  bool _showFilter = true;

  final _codeKdCtrl = TextEditingController();
  final _codeCmsCtrl = TextEditingController();
  final _custNameCtrl = TextEditingController();
  final _emplNameCtrl = TextEditingController();
  final _prodTypeCtrl = TextEditingController();
  final _idCtrl = TextEditingController();

  bool _loading = false;
  List<Map<String, dynamic>> _rows = const [];

  bool _gridView = false;
  List<PlutoColumn> _gridColumns = const [];
  List<PlutoRow> _gridRows = const [];
  PlutoGridStateManager? _gridSm;

  final Set<int> _selectedIds = <int>{};

  @override
  void dispose() {
    _codeKdCtrl.dispose();
    _codeCmsCtrl.dispose();
    _custNameCtrl.dispose();
    _emplNameCtrl.dispose();
    _prodTypeCtrl.dispose();
    _idCtrl.dispose();
    super.dispose();
  }

  String _ymd(DateTime d) {
    return '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';
  }

  String _fmtDateShort(String raw) {
    final s = raw.trim();
    if (s.length >= 10 && s[4] == '-' && s[7] == '-') {
      final y = s.substring(0, 4);
      final m = s.substring(5, 7);
      final d = s.substring(8, 10);
      return '$d/$m/$y';
    }
    return s;
  }

  int _toInt(dynamic v) {
    if (v == null) return 0;
    if (v is int) return v;
    return int.tryParse(v.toString()) ?? 0;
  }

  String _fmtInt(num v) {
    final s = v.round().toString();
    final b = StringBuffer();
    for (var i = 0; i < s.length; i++) {
      final idxFromEnd = s.length - i;
      b.write(s[i]);
      if (idxFromEnd > 1 && idxFromEnd % 3 == 1) b.write(',');
    }
    return b.toString();
  }

  bool get _isAllSelected => _rows.isNotEmpty && _selectedIds.length == _rows.length;

  void _toggleSelectAll(bool? v) {
    setState(() {
      if (v == true) {
        _selectedIds
          ..clear()
          ..addAll(_rows.map((e) => _toInt(e['ST_ID'])));
      } else {
        _selectedIds.clear();
      }

      if (_gridColumns.isNotEmpty) {
        _gridRows = _buildPlutoRows(_rows, _gridColumns);
      }
    });
  }

  List<String> _prioritizedFields(List<Map<String, dynamic>> rows) {
    final keys = <String>{};
    for (final r in rows) {
      keys.addAll(r.keys);
    }

    final preferred = <String>[
      'ST_ID',
      'PLAN_DATE',
      'PRIORITY',
      'CUST_NAME_KD',
      'G_CODE',
      'G_NAME',
      'PO_BALANCE',
      'TON_TP',
      'BTP',
      'TONG_TON_KIEM',
      'TODAY_TOTAL',
      'TODAY_THIEU',
      'D1_9H',
      'D1_13H',
      'D1_19H',
      'D1_21H',
      'D1_23H',
      'D1_OTHER',
      'D2_9H',
      'D2_13H',
      'D2_21H',
      'D3_SANG',
      'D3_CHIEU',
      'D4_SANG',
      'D4_CHIEU',
    ];

    final out = <String>[];
    for (final f in preferred) {
      if (keys.contains(f)) out.add(f);
    }
    final remain = keys.difference(out.toSet()).toList()..sort();
    out.addAll(remain);
    return out;
  }

  List<PlutoColumn> _buildPlutoColumns(List<Map<String, dynamic>> rows) {
    final fields = _prioritizedFields(rows);

    PlutoColumn col(String field) {
      final compactNum = RegExp(r'^(D\d|TODAY_|PO_|TON_|BTP|TONG_|PRIORITY)').hasMatch(field);
      return PlutoColumn(
        title: field,
        field: field,
        type: PlutoColumnType.text(),
        enableContextMenu: false,
        enableSorting: true,
        enableFilterMenuItem: true,
        width: compactNum ? 90 : 120,
        minWidth: compactNum ? 70 : 90,
        renderer: (ctx) {
          final v = (ctx.cell.value ?? '').toString();
          return Text(
            v,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(fontSize: 11),
          );
        },
      );
    }

    return [
      PlutoColumn(
        title: '',
        field: '__raw__',
        type: PlutoColumnType.text(),
        width: 0,
        hide: true,
        enableContextMenu: false,
        enableSorting: false,
        enableFilterMenuItem: false,
      ),
      PlutoColumn(
        title: '✓',
        field: '__check__',
        type: PlutoColumnType.text(),
        width: 44,
        enableContextMenu: false,
        enableSorting: false,
        enableFilterMenuItem: false,
        enableRowChecked: true,
      ),
      for (final f in fields) col(f),
    ];
  }

  List<PlutoRow> _buildPlutoRows(
    List<Map<String, dynamic>> rows,
    List<PlutoColumn> columns,
  ) {
    Object? val(Map<String, dynamic> it, String field) {
      if (field == '__raw__') return it;
      if (field == '__check__') return '';
      return (it[field] ?? '').toString();
    }

    return [
      for (final it in rows)
        PlutoRow(
          checked: _selectedIds.contains(_toInt(it['ST_ID'])),
          cells: {
            for (final c in columns) c.field: PlutoCell(value: val(it, c.field)),
          },
        ),
    ];
  }

  void _syncSelectedFromGrid(PlutoGridStateManager sm) {
    final checked = sm.checkedRows;
    setState(() {
      _selectedIds
        ..clear()
        ..addAll(
          checked
              .map((r) => r.cells['__raw__']?.value)
              .whereType<Map<String, dynamic>>()
              .map((raw) => _toInt(raw['ST_ID'])),
        );
    });
  }

  Widget _buildGrid(ColorScheme scheme) {
    if (_gridColumns.isEmpty) return const SizedBox.shrink();
    return PlutoGrid(
      columns: _gridColumns,
      rows: _gridRows,
      onLoaded: (e) {
        _gridSm = e.stateManager;
        e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
        e.stateManager.setShowColumnFilter(true);
      },
      onRowChecked: (_) {
        final sm = _gridSm;
        if (sm == null) return;
        _syncSelectedFromGrid(sm);
      },
      configuration: const PlutoGridConfiguration(
        columnSize: PlutoGridColumnSizeConfig(autoSizeMode: PlutoAutoSizeMode.scale),
        style: PlutoGridStyleConfig(
          enableCellBorderVertical: true,
          enableCellBorderHorizontal: true,
          rowHeight: 28,
          columnHeight: 28,
          cellTextStyle: TextStyle(fontSize: 11),
          columnTextStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w800),
        ),
      ),
    );
  }

  Future<void> _pickDate({required bool from}) async {
    final initial = from ? _fromDate : _toDate;
    final picked = await showDatePicker(
      context: context,
      initialDate: initial,
      firstDate: DateTime(2020, 1, 1),
      lastDate: DateTime(2100, 12, 31),
    );
    if (picked == null) return;
    if (!mounted) return;
    setState(() {
      if (from) {
        _fromDate = picked;
        if (_fromDate.isAfter(_toDate)) _toDate = _fromDate;
      } else {
        _toDate = picked;
        if (_toDate.isBefore(_fromDate)) _fromDate = _toDate;
      }
    });
  }

  Future<void> _search() async {
    if (mounted) {
      setState(() {
        _loading = true;
        _showFilter = false;
        _selectedIds.clear();
      });
    }

    try {
      final api = ref.read(apiClientProvider);
      final res = await api.postCommand(
        'traShortageKD',
        data: {
          'ALLTIME': _allTime,
          'FROM_DATE': _ymd(_fromDate),
          'TO_DATE': _ymd(_toDate),
          'CUST_NAME': _custNameCtrl.text.trim(),
          'G_CODE': _codeCmsCtrl.text.trim(),
          'G_NAME': _codeKdCtrl.text.trim(),
          'PROD_TYPE': _prodTypeCtrl.text.trim(),
          'EMPL_NAME': _emplNameCtrl.text.trim(),
          'ST_ID': _idCtrl.text.trim(),
        },
      );

      final body = res.data;
      if (body is Map<String, dynamic> && (body['tk_status'] ?? '').toString().toUpperCase() == 'NG') {
        if (!mounted) return;
        setState(() => _loading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text((body['message'] ?? 'NG').toString())),
        );
        return;
      }

      final data = (body is Map<String, dynamic> ? body['data'] : null);
      final list = (data is List ? data : const [])
          .map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{}))
          .toList();

      if (!mounted) return;
      setState(() {
        _rows = list;
        _gridColumns = _buildPlutoColumns(list);
        _gridRows = _buildPlutoRows(list, _gridColumns);
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  List<Map<String, dynamic>> _selectedRows() {
    if (_selectedIds.isEmpty) return const [];
    return _rows.where((r) => _selectedIds.contains(_toInt(r['ST_ID']))).toList();
  }

  Future<void> _deleteSelected() async {
    final selected = _selectedRows();
    if (selected.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Chọn ít nhất 1 dòng để xóa')));
      return;
    }

    final messenger = ScaffoldMessenger.of(context);
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Xóa Shortage'),
        content: Text('Chắc chắn muốn xóa ${selected.length} dòng đã chọn? (chỉ xóa của user đăng nhập)'),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Hủy')),
          FilledButton(onPressed: () => Navigator.of(ctx).pop(true), child: const Text('Xóa')),
        ],
      ),
    );
    if (ok != true) return;

    if (!mounted) return;

    final authState = ref.read(authNotifierProvider);
    final emplNo = authState is AuthAuthenticated ? authState.session.user.emplNo : '';
    if (emplNo.isEmpty) return;

    try {
      final api = ref.read(apiClientProvider);
      var deleted = 0;
      var skipped = 0;
      var failed = 0;

      for (final r in selected) {
        final owner = (r['EMPL_NO'] ?? r['INS_EMPL'] ?? '').toString();
        if (owner.isNotEmpty && owner != emplNo) {
          skipped++;
          continue;
        }
        final stId = _toInt(r['ST_ID']);
        final res = await api.postCommand('delete_shortage', data: {'ST_ID': stId});
        final body = res.data;
        if (body is Map<String, dynamic> && (body['tk_status'] ?? '').toString().toUpperCase() == 'NG') {
          failed++;
        } else {
          deleted++;
        }
      }

      if (!mounted) return;
      messenger.showSnackBar(SnackBar(content: Text('Đã xóa: $deleted, bỏ qua: $skipped, lỗi: $failed')));
      await _search();
    } catch (e) {
      if (!mounted) return;
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  Future<void> _exportExcel() async {
    if (_rows.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Chưa có dữ liệu để xuất')));
      return;
    }

    final excel = xls.Excel.createExcel();
    final sheet = excel['Shortage'];

    final headers = <String>[
      'ST_ID',
      'PLAN_DATE',
      'CUST_NAME_KD',
      'G_CODE',
      'G_NAME',
      'PO_BALANCE',
      'TON_TP',
      'BTP',
      'TONG_TON_KIEM',
      'D1_9H',
      'D1_13H',
      'D1_19H',
      'D1_21H',
      'D1_23H',
      'D1_OTHER',
      'D2_9H',
      'D2_13H',
      'D2_21H',
      'D3_SANG',
      'D3_CHIEU',
      'D4_SANG',
      'D4_CHIEU',
      'TODAY_TOTAL',
      'TODAY_THIEU',
      'PRIORITY',
    ];

    sheet.appendRow(headers.map((h) => xls.TextCellValue(h)).toList());
    for (final r in _rows) {
      sheet.appendRow(headers.map((h) => xls.TextCellValue((r[h] ?? '').toString())).toList());
    }

    final bytes = excel.encode();
    if (bytes == null) return;

    final dir = await getTemporaryDirectory();
    final filename = 'Shortage_${DateTime.now().millisecondsSinceEpoch}.xlsx';
    final file = File('${dir.path}/$filename');
    await file.writeAsBytes(bytes, flush: true);

    await Share.shareXFiles([
      XFile(file.path, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    ]);
  }

  Widget _dBox(ColorScheme scheme, {required String label, required int value, Color? valueColor}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
      decoration: BoxDecoration(
        color: scheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: scheme.outlineVariant),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(label, style: TextStyle(fontSize: 11, color: scheme.onSurfaceVariant, fontWeight: FontWeight.w700)),
          const SizedBox(height: 2),
          Text(
            _fmtInt(value),
            style: TextStyle(fontSize: 12, color: valueColor ?? scheme.onSurface, fontWeight: FontWeight.w900),
          ),
        ],
      ),
    );
  }

  Widget _shortageCard(BuildContext context, ColorScheme scheme, Map<String, dynamic> r) {
    final stId = _toInt(r['ST_ID']);
    final selected = _selectedIds.contains(stId);

    final planDate = _fmtDateShort((r['PLAN_DATE'] ?? '').toString());
    final cust = (r['CUST_NAME_KD'] ?? '').toString();
    final gCode = (r['G_CODE'] ?? '').toString();
    final gName = (r['G_NAME'] ?? '').toString();

    final poBalance = _toInt(r['PO_BALANCE']);
    final tonTp = _toInt(r['TON_TP']);
    final btp = _toInt(r['BTP']);
    final tonKiem = _toInt(r['TONG_TON_KIEM']);
    final todayTotal = _toInt(r['TODAY_TOTAL']);
    final todayThieu = _toInt(r['TODAY_THIEU']);
    final priority = _toInt(r['PRIORITY']);

    final dKeys = <String>[
      'D1_9H',
      'D1_13H',
      'D1_19H',
      'D1_21H',
      'D1_23H',
      'D1_OTHER',
      'D2_9H',
      'D2_13H',
      'D2_21H',
      'D3_SANG',
      'D3_CHIEU',
      'D4_SANG',
      'D4_CHIEU',
    ];

    return Card(
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () {
          setState(() {
            if (selected) {
              _selectedIds.remove(stId);
            } else {
              _selectedIds.add(stId);
            }
          });
        },
        child: Padding(
          padding: const EdgeInsets.fromLTRB(10, 10, 10, 10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 22,
                    height: 22,
                    decoration: BoxDecoration(
                      color: selected ? scheme.primary : scheme.surface,
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: selected ? scheme.primary : scheme.outlineVariant),
                    ),
                    child: selected ? Icon(Icons.check, size: 16, color: scheme.onPrimary) : null,
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'ST $stId  •  $planDate',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800, color: scheme.onSurface),
                    ),
                  ),
                  if (priority != 0)
                    Text(
                      'P$priority',
                      style: TextStyle(color: scheme.primary, fontWeight: FontWeight.w900),
                    ),
                ],
              ),
              const SizedBox(height: 6),
              Text(cust, style: TextStyle(color: scheme.onSurfaceVariant, fontSize: 12, fontWeight: FontWeight.w700)),
              const SizedBox(height: 2),
              Text(gCode, style: TextStyle(color: scheme.onSurface, fontSize: 12, fontWeight: FontWeight.w900)),
              if (gName.isNotEmpty) ...[
                const SizedBox(height: 2),
                Text(gName, style: TextStyle(color: scheme.onSurfaceVariant, fontSize: 12)),
              ],
              const SizedBox(height: 8),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    _dBox(scheme, label: 'TON PO', value: poBalance, valueColor: Colors.red.shade700),
                    const SizedBox(width: 6),
                    _dBox(scheme, label: 'TON_TP', value: tonTp, valueColor: Colors.blue.shade700),
                    const SizedBox(width: 6),
                    _dBox(scheme, label: 'BTP', value: btp, valueColor: Colors.blue.shade700),
                    const SizedBox(width: 6),
                    _dBox(scheme, label: 'T_KIEM', value: tonKiem, valueColor: Colors.blue.shade700),
                    const SizedBox(width: 6),
                    _dBox(scheme, label: 'TODAY_T', value: todayTotal, valueColor: const Color(0xFFB63DFC)),
                    const SizedBox(width: 6),
                    _dBox(scheme, label: 'TODAY_TH', value: todayThieu, valueColor: const Color(0xFFF21400)),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: dKeys.map((k) {
                    final v = _toInt(r[k]);
                    return Padding(
                      padding: const EdgeInsets.only(right: 6),
                      child: _dBox(scheme, label: k, value: v),
                    );
                  }).toList(),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final selectedCount = _selectedIds.length;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Shortage KD'),
        actions: [
          IconButton(
            onPressed: () {
              setState(() => _showFilter = !_showFilter);
            },
            icon: Icon(_showFilter ? Icons.filter_alt_off : Icons.filter_alt),
            tooltip: _showFilter ? 'Ẩn bộ lọc' : 'Hiện bộ lọc',
          ),
          IconButton(
            onPressed: () {
              setState(() => _gridView = !_gridView);
            },
            icon: Icon(_gridView ? Icons.view_agenda : Icons.grid_on),
            tooltip: _gridView ? 'List view' : 'Grid view',
          ),
          PopupMenuButton<String>(
            onSelected: (v) async {
              if (v == 'search') {
                await _search();
              } else if (v == 'delete') {
                await _deleteSelected();
              } else if (v == 'export') {
                await _exportExcel();
              }
            },
            itemBuilder: (ctx) => [
              const PopupMenuItem(value: 'search', child: Text('Tra cứu')),
              PopupMenuItem(value: 'delete', enabled: selectedCount >= 1, child: const Text('Xóa Shortage')),
              const PopupMenuDivider(),
              const PopupMenuItem(value: 'export', child: Text('Xuất Excel')),
            ],
          ),
        ],
      ),
      drawer: const AppDrawer(title: 'ERP'),
      body: RefreshIndicator(
        onRefresh: _search,
        child: ListView(
          padding: const EdgeInsets.all(12),
          children: [
            if (_showFilter)
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              'Bộ lọc',
                              style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
                            ),
                          ),
                          TextButton(
                            onPressed: () {
                              setState(() {
                                _codeKdCtrl.clear();
                                _codeCmsCtrl.clear();
                                _custNameCtrl.clear();
                                _emplNameCtrl.clear();
                                _prodTypeCtrl.clear();
                                _idCtrl.clear();
                              });
                            },
                            child: const Text('Clear'),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () => _pickDate(from: true),
                              child: Text('Từ: ${_fmtDateShort(_ymd(_fromDate))}'),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () => _pickDate(from: false),
                              child: Text('Đến: ${_fmtDateShort(_ymd(_toDate))}'),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      SwitchListTile(
                        contentPadding: EdgeInsets.zero,
                        title: const Text('All time'),
                        value: _allTime,
                        onChanged: (v) => setState(() => _allTime = v),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(child: TextField(controller: _codeKdCtrl, decoration: const InputDecoration(labelText: 'Code KD (G_NAME)'), textInputAction: TextInputAction.next)),
                          const SizedBox(width: 12),
                          Expanded(child: TextField(controller: _codeCmsCtrl, decoration: const InputDecoration(labelText: 'Code ERP (G_CODE)'), textInputAction: TextInputAction.next)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(child: TextField(controller: _custNameCtrl, decoration: const InputDecoration(labelText: 'Customer'), textInputAction: TextInputAction.next)),
                          const SizedBox(width: 12),
                          Expanded(child: TextField(controller: _emplNameCtrl, decoration: const InputDecoration(labelText: 'Empl name'), textInputAction: TextInputAction.next)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(child: TextField(controller: _prodTypeCtrl, decoration: const InputDecoration(labelText: 'Prod type'), textInputAction: TextInputAction.next)),
                          const SizedBox(width: 12),
                          Expanded(child: TextField(controller: _idCtrl, decoration: const InputDecoration(labelText: 'ST_ID'), keyboardType: TextInputType.number, textInputAction: TextInputAction.search, onSubmitted: (_) => _search())),
                        ],
                      ),
                      const SizedBox(height: 12),
                      SizedBox(
                        width: double.infinity,
                        child: FilledButton.icon(
                          onPressed: _loading ? null : _search,
                          icon: const Icon(Icons.search),
                          label: const Text('Tra cứu'),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            const SizedBox(height: 12),
            if (_loading)
              const Center(child: Padding(padding: EdgeInsets.all(16), child: CircularProgressIndicator()))
            else ...[
              Row(
                children: [
                  Expanded(
                    child: Text(
                      'Kết quả: ${_rows.length} dòng',
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
                    ),
                  ),
                  if (_rows.isNotEmpty)
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Checkbox(value: _isAllSelected, onChanged: _toggleSelectAll),
                        const Text('All'),
                      ],
                    ),
                ],
              ),
              const SizedBox(height: 8),
            if (_gridView)
              SizedBox(
                height: 520,
                child: _buildGrid(scheme),
              )
            else
              for (final r in _rows) _shortageCard(context, scheme, r),
            if (_rows.isEmpty)
              const Padding(
                padding: EdgeInsets.all(24),
                child: Center(child: Text('Chưa có dữ liệu')),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
