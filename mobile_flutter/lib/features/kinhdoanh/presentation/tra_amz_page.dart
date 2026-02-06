import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:pluto_grid/pluto_grid.dart';

import '../../../core/providers.dart';

class TraAmzPage extends ConsumerStatefulWidget {
  const TraAmzPage({super.key});

  @override
  ConsumerState<TraAmzPage> createState() => _TraAmzPageState();
}

class _TraAmzPageState extends ConsumerState<TraAmzPage> {
  DateTime _fromDate = DateTime.now();
  DateTime _toDate = DateTime.now();
  bool _allTime = false;

  final _codeKdCtrl = TextEditingController();
  final _codeCmsCtrl = TextEditingController();
  final _prodRequestNoCtrl = TextEditingController();
  final _planIdCtrl = TextEditingController();
  final _dataAmzCtrl = TextEditingController();

  bool _loading = false;
  List<Map<String, dynamic>> _rows = const [];
  PlutoGridStateManager? _sm;

  @override
  void dispose() {
    _codeKdCtrl.dispose();
    _codeCmsCtrl.dispose();
    _prodRequestNoCtrl.dispose();
    _planIdCtrl.dispose();
    _dataAmzCtrl.dispose();
    super.dispose();
  }

  String _fmtYmd(DateTime d) => '${d.year.toString().padLeft(4, '0')}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';


  double _toDouble(dynamic v) => double.tryParse((v ?? '').toString()) ?? 0;

  bool _isNg(dynamic body) =>
      body is Map<String, dynamic> && (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  Future<void> _pickDate({required bool from}) async {
    final init = from ? _fromDate : _toDate;
    final picked = await showDatePicker(
      context: context,
      initialDate: init,
      firstDate: DateTime(2020),
      lastDate: DateTime(2100),
    );
    if (picked == null) return;
    setState(() {
      if (from) {
        _fromDate = picked;
      } else {
        _toDate = picked;
      }
    });
  }

  List<PlutoColumn> _buildColumns(ColorScheme scheme) {
    PlutoColumn col(String field, String title, {double width = 120}) {
      return PlutoColumn(
        title: title,
        field: field,
        type: PlutoColumnType.text(),
        width: width,
        enableSorting: true,
        enableColumnDrag: false,
        enableFilterMenuItem: false,
        enableContextMenu: false,
        backgroundColor: scheme.surface,
        titleTextAlign: PlutoColumnTextAlign.left,
        textAlign: PlutoColumnTextAlign.left,
      );
    }

    return <PlutoColumn>[
      PlutoColumn(
        title: '',
        field: '__check__',
        type: PlutoColumnType.text(),
        width: 70,
        enableRowChecked: true,
        enableSorting: false,
        enableFilterMenuItem: false,
        enableColumnDrag: false,
        enableContextMenu: false,
      ),
      PlutoColumn(
        title: '__raw__',
        field: '__raw__',
        type: PlutoColumnType.text(),
        width: 1,
        hide: true,
        enableRowChecked: false,
        enableSorting: false,
        enableFilterMenuItem: false,
        enableColumnDrag: false,
        enableContextMenu: false,
      ),
      PlutoColumn(
        title: 'ROW_NO',
        field: 'ROW_NO',
        type: PlutoColumnType.number(),
        width: 100,
        enableSorting: true,
        enableFilterMenuItem: false,
        enableContextMenu: false,
      ),
      col('G_NAME', 'G_NAME', width: 160),
      col('G_CODE', 'G_CODE', width: 120),
      col('PROD_REQUEST_NO', 'YCSX_NO', width: 120),
      col('NO_IN', 'NO_IN', width: 160),
      col('DATA_1', 'DATA_1', width: 220),
      col('DATA_2', 'DATA_2', width: 220),
      col('PRINT_STATUS', 'PRINT_STATUS', width: 110),
      PlutoColumn(
        title: 'INLAI',
        field: 'INLAI_COUNT',
        type: PlutoColumnType.number(),
        width: 90,
      ),
      col('REMARK', 'REMARK', width: 140),
      col('G_CODE_MAU', 'G_CODE_MAU', width: 120),
      col('INS_DATE', 'INS_DATE', width: 150),
      col('INS_EMPL', 'INS_EMPL', width: 110),
    ];
  }

  List<PlutoRow> _buildGridRows(List<PlutoColumn> columns, List<Map<String, dynamic>> rows) {
    dynamic cellValue(Map<String, dynamic> r, PlutoColumn c) {
      if (c.field == '__raw__') return r;
      if (c.field == '__check__') return '';
      final v = r[c.field];
      if (c.type is PlutoColumnTypeNumber) {
        // Pluto number column expects num.
        return _toDouble(v);
      }
      return (v ?? '').toString();
    }

    return [
      for (final r in rows)
        PlutoRow(
          checked: false,
          cells: {
            for (final c in columns) c.field: PlutoCell(value: cellValue(r, c)),
          },
        ),
    ];
  }

  List<Map<String, dynamic>> _selectedRows() {
    final sm = _sm;
    if (sm == null) return const [];

    final checked = sm.checkedRows;
    if (checked.isEmpty) return const [];

    return checked
        .map((r) => r.cells['__raw__']?.value)
        .whereType<Map<String, dynamic>>()
        .toList();
  }

  Future<void> _search() async {
    setState(() => _loading = true);
    try {
      final api = ref.read(apiClientProvider);
      final res = await api.postCommand(
        'traDataAMZ',
        data: {
          'ALLTIME': _allTime,
          'FROM_DATE': _fmtYmd(_fromDate),
          'TO_DATE': _fmtYmd(_toDate),
          'PROD_REQUEST_NO': _prodRequestNoCtrl.text.trim(),
          'NO_IN': _planIdCtrl.text.trim(),
          'G_NAME': _codeKdCtrl.text.trim(),
          'G_CODE': _codeCmsCtrl.text.trim(),
          'DATA_AMZ': _dataAmzCtrl.text.trim(),
        },
      );

      final body = res.data;
      if (_isNg(body)) {
        setState(() {
          _rows = const [];
          _loading = false;
        });
        _snack('Không có data');
        return;
      }

      final data = (body is Map<String, dynamic> ? body['data'] : null);
      final list = (data is List ? data : const [])
          .whereType<Map>()
          .map((e) => e.map((k, v) => MapEntry(k.toString().trim(), v)))
          .toList();

      if (!mounted) return;
      setState(() {
        _rows = list;
        _loading = false;
      });

      // PlutoGrid does not reliably refresh when you pass new `rows` via rebuild.
      // Update rows through the stateManager if grid is already loaded.
      final sm = _sm;
      if (sm != null) {
        final columns = _buildColumns(Theme.of(context).colorScheme);
        final plutoRows = _buildGridRows(columns, list);
        sm.removeAllRows();
        sm.appendRows(plutoRows);
      }
      _snack('Đã load ${list.length} dòng');
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Future<void> _openPreview() async {
    final selected = _selectedRows();
    if (selected.isEmpty) {
      _snack('Chưa chọn dòng nào');
      return;
    }

    if (!mounted) return;
    context.push('/kinhdoanh/traamz/preview', extra: selected);
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final columns = _buildColumns(scheme);

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(12),
          child: Card(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () => _pickDate(from: true),
                          child: Text('Từ: ${_fmtYmd(_fromDate)}'),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () => _pickDate(from: false),
                          child: Text('Tới: ${_fmtYmd(_toDate)}'),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      SizedBox(
                        width: 220,
                        child: TextField(
                          controller: _codeKdCtrl,
                          decoration: const InputDecoration(labelText: 'Code KD'),
                        ),
                      ),
                      SizedBox(
                        width: 220,
                        child: TextField(
                          controller: _codeCmsCtrl,
                          decoration: const InputDecoration(labelText: 'Code ERP'),
                        ),
                      ),
                      SizedBox(
                        width: 220,
                        child: TextField(
                          controller: _prodRequestNoCtrl,
                          decoration: const InputDecoration(labelText: 'Số YCSX'),
                        ),
                      ),
                      SizedBox(
                        width: 220,
                        child: TextField(
                          controller: _planIdCtrl,
                          decoration: const InputDecoration(labelText: 'ID công việc'),
                        ),
                      ),
                      SizedBox(
                        width: 260,
                        child: TextField(
                          controller: _dataAmzCtrl,
                          decoration: const InputDecoration(labelText: 'DATA'),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: CheckboxListTile(
                          contentPadding: EdgeInsets.zero,
                          value: _allTime,
                          onChanged: _loading ? null : (v) => setState(() => _allTime = v ?? false),
                          title: const Text('All time'),
                        ),
                      ),
                      FilledButton.icon(
                        onPressed: _loading ? null : _search,
                        icon: const Icon(Icons.search),
                        label: const Text('Tra AMZ'),
                      ),
                      const SizedBox(width: 8),
                      OutlinedButton.icon(
                        onPressed: _loading ? null : _openPreview,
                        icon: const Icon(Icons.print_outlined),
                        label: const Text('Preview AMZ'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Card(
              child: PlutoGrid(
                columns: columns,
                rows: _buildGridRows(columns, _rows),                
                onLoaded: (e) {
                  _sm = e.stateManager;
                  e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                },
                onRowChecked: (_) {
                  setState(() {});
                },
                configuration: PlutoGridConfiguration(
                  style: PlutoGridStyleConfig(
                    gridBackgroundColor: scheme.surface,
                    rowColor: scheme.surface,
                    checkedColor: scheme.primary.withOpacity(0.08),
                    activatedColor: scheme.primary.withOpacity(0.06),
                    borderColor: scheme.outlineVariant,
                    iconColor: scheme.onSurfaceVariant,
                    cellTextStyle: TextStyle(color: scheme.onSurface),
                    columnTextStyle: TextStyle(color: scheme.onSurface),
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
