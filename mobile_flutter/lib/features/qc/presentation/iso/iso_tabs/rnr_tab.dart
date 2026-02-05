import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:pluto_grid/pluto_grid.dart';

import '../../../../../core/providers.dart';
import '../../../../../core/utils/excel_exporter.dart';

class RnrTab extends ConsumerStatefulWidget {
  const RnrTab({super.key});

  @override
  ConsumerState<RnrTab> createState() => _RnrTabState();
}

class _RnrTabState extends ConsumerState<RnrTab> {
  bool _loading = false;
  bool _showFilter = true;

  DateTime _fromDate = DateTime.now();
  DateTime _toDate = DateTime.now();

  final TextEditingController _testIdCtrl = TextEditingController();
  final TextEditingController _emplNameCtrl = TextEditingController();

  bool _allTime = false;
  String _factory = 'ALL';
  String _testType = 'ALL';
  String _selectedData = 'detail';

  List<Map<String, dynamic>> _rows = const [];
  List<PlutoColumn> _cols = const [];
  List<PlutoRow> _plutoRows = const [];

  String _s(dynamic v) => (v ?? '').toString();
  num _n(dynamic v) => (v is num) ? v : (num.tryParse(_s(v).replaceAll(',', '')) ?? 0);

  bool _isNg(Map<String, dynamic> body) => (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  String _ymd(DateTime dt) => DateFormat('yyyy-MM-dd').format(dt);

  @override
  void dispose() {
    _testIdCtrl.dispose();
    _emplNameCtrl.dispose();
    super.dispose();
  }

  Future<Map<String, dynamic>> _post(String cmd, Map<String, dynamic> data) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(cmd, data: data);
    final body = res.data;
    if (body is Map<String, dynamic>) return body;
    return <String, dynamic>{'tk_status': 'NG', 'message': 'Bad response'};
  }

  Future<void> _pickDate({required bool from}) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: from ? _fromDate : _toDate,
      firstDate: DateTime(2020, 1, 1),
      lastDate: DateTime(2100, 12, 31),
    );
    if (picked == null) return;
    setState(() {
      if (from) {
        _fromDate = picked;
        if (_toDate.isBefore(_fromDate)) _toDate = _fromDate;
      } else {
        _toDate = picked;
      }
    });
  }

  Map<String, dynamic> _payload() {
    return {
      'ALLTIME': _allTime,
      'FROM_DATE': _ymd(_fromDate),
      'TO_DATE': _ymd(_toDate),
      'EMPL_NAME': _emplNameCtrl.text.trim(),
      'FACTORY': _factory,
      'TEST_TYPE': _testType,
      'TEST_ID': _testIdCtrl.text.trim(),
    };
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _rows = const [];
      _cols = const [];
      _plutoRows = const [];
    });

    try {
      final selection = _selectedData;
      String cmd;
      if (selection == 'detail') {
        cmd = 'loadRNRchitiet';
      } else if (selection == 'summaryByEmpl') {
        cmd = 'RnRtheonhanvien';
      } else {
        // web currently doesn't implement these cases; keep parity
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Chức năng này web chưa implement')));
        return;
      }

      final body = await _post(cmd, _payload());
      if (_isNg(body)) {
        _snack('NG: ${_s(body['message'])}');
        return;
      }

      final raw = body['data'];
      final data = raw is List ? raw : const [];
      final rows = data.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();

      for (final r in rows) {
        if (r.containsKey('TEST_DATE')) {
          r['TEST_DATE'] = _fmtYmd(r['TEST_DATE']);
        }
        if (r.containsKey('UPD_DATE')) {
          r['UPD_DATE'] = _fmtYmdHms(r['UPD_DATE']);
        }

        // mimic web derived columns for summary
        if (selection == 'summaryByEmpl') {
          final testType = _s(r['TEST_TYPE']);
          if (testType != 'G_RNR') {
            r['SCORE2'] = -1;
            r['MIX2'] = -1;
            r['JUDGE2'] = 'N/A';
          }
        }
      }

      final cols = _buildCols(selection);
      final plutoRows = _buildRows(rows, cols);

      if (!mounted) return;
      setState(() {
        _rows = rows;
        _cols = cols;
        _plutoRows = plutoRows;
      });
      _snack('Đã load ${rows.length} dòng');
    } catch (e) {
      _snack('Lỗi: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  String _fmtYmd(dynamic v) {
    final s = _s(v).trim();
    if (s.isEmpty) return '';
    final dt = DateTime.tryParse(s.replaceFirst(' ', 'T')) ?? DateTime.tryParse(s);
    if (dt == null) return s;
    return DateFormat('yyyy-MM-dd').format(dt.toUtc());
  }

  String _fmtYmdHms(dynamic v) {
    final s = _s(v).trim();
    if (s.isEmpty) return '';
    final dt = DateTime.tryParse(s.replaceFirst(' ', 'T')) ?? DateTime.tryParse(s);
    if (dt == null) return s;
    final local = dt.isUtc ? dt.toLocal() : dt;
    return DateFormat('yyyy-MM-dd HH:mm:ss').format(local);
  }

  List<PlutoColumn> _buildCols(String selection) {
    PlutoColumn text(String field, {double w = 140, PlutoColumnRenderer? renderer}) {
      return PlutoColumn(
        title: field,
        field: field,
        width: w,
        type: PlutoColumnType.text(),
        enableColumnDrag: false,
        renderer: renderer,
      );
    }

    if (selection == 'detail') {
      return [
        text('FACTORY', w: 80),
        text('FULL_NAME', w: 160),
        text('SUBDEPTNAME', w: 120),
        text('TEST_EMPL_NO', w: 120),
        text('TEST_DATE', w: 110),
        text('TEST_ID', w: 90),
        text('TEST_NO', w: 90),
        text('TEST_TYPE', w: 90),
        text('TEST_NUMBER', w: 110),
        text(
          'TEST_RESULT1',
          w: 110,
          renderer: (ctx) {
            final ok = _s(ctx.row.cells['RESULT_OK_NG']?.value);
            final v = _s(ctx.cell.value);
            final isTrue = v == ok;
            return Text(isTrue ? 'TRUE' : 'FALSE', style: TextStyle(color: isTrue ? Colors.green : Colors.red, fontWeight: FontWeight.w900));
          },
        ),
        text('TEST_NUMBER2', w: 110),
        text(
          'TEST_REUST2',
          w: 110,
          renderer: (ctx) {
            final ok = _s(ctx.row.cells['RESULT_OK_NG']?.value);
            final v = ctx.cell.value;
            if (v == null) return const Text('NA', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.w900));
            final s = _s(v);
            final isTrue = s == ok;
            return Text(isTrue ? 'TRUE' : 'FALSE', style: TextStyle(color: isTrue ? Colors.green : Colors.red, fontWeight: FontWeight.w900));
          },
        ),
        text('RESULT_OK_NG', w: 140),
        text('RESULT_DETAIL', w: 180),
        text('UPD_DATE', w: 160),
        text('UPD_EMPL', w: 100),
      ];
    }

    return [
      text('id', w: 80),
      text('FULL_NAME', w: 150),
      text('SUBDEPTNAME', w: 120),
      text('TEST_ID', w: 90),
      text('TEST_TYPE', w: 90),
      text('TEST_NO', w: 90),
      text('COUNT1', w: 90),
      text('COUNT2', w: 90),
      text('SO_CAU', w: 90),
      text('SCORE1', w: 90),
      text(
        'SCORE2',
        w: 90,
        renderer: (ctx) {
          final v = _n(ctx.cell.value).toInt();
          if (v == -1) return const Text('N/A', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.w800));
          return Text('$v', style: const TextStyle(color: Colors.green, fontWeight: FontWeight.w800));
        },
      ),
      text(
        'JUDGE1',
        w: 90,
        renderer: (ctx) {
          final v = _s(ctx.cell.value);
          final isPass = v == 'PASS';
          return Text(v, style: TextStyle(color: isPass ? Colors.green : Colors.red, fontWeight: FontWeight.w900));
        },
      ),
      text(
        'JUDGE2',
        w: 90,
        renderer: (ctx) {
          final v = _s(ctx.cell.value);
          if (v == 'N/A') return const Text('N/A', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.w800));
          final isPass = v == 'PASS';
          return Text(v, style: TextStyle(color: isPass ? Colors.green : Colors.red, fontWeight: FontWeight.w900));
        },
      ),
    ];
  }

  List<PlutoRow> _buildRows(List<Map<String, dynamic>> rows, List<PlutoColumn> cols) {
    return rows
        .map(
          (r) => PlutoRow(
            cells: {
              for (final c in cols) c.field: PlutoCell(value: r[c.field]),
            },
          ),
        )
        .toList(growable: false);
  }

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  Future<void> _exportExcel() async {
    if (_rows.isEmpty) return;
    await ExcelExporter.shareAsXlsx(
      fileName: 'rnr_${_selectedData}_${_ymd(DateTime.now())}.xlsx',
      rows: _rows,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Card(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
            child: Row(
              children: [
                IconButton(
                  tooltip: _showFilter ? 'Ẩn filter' : 'Hiện filter',
                  onPressed: _loading ? null : () => setState(() => _showFilter = !_showFilter),
                  icon: Icon(_showFilter ? Icons.filter_alt_off : Icons.filter_alt),
                ),
                const Expanded(child: Text('RNR TEST', style: TextStyle(fontWeight: FontWeight.w900))),
                IconButton(
                  onPressed: _rows.isEmpty ? null : _exportExcel,
                  tooltip: 'Export Excel',
                  icon: const Icon(Icons.table_view),
                ),
                const SizedBox(width: 6),
                FilledButton.icon(
                  onPressed: _loading ? null : _load,
                  icon: const Icon(Icons.search),
                  label: const Text('Tra Data'),
                ),
              ],
            ),
          ),
        ),
        if (_showFilter)
          Card(
            child: Padding(
              padding: const EdgeInsets.all(10),
              child: Wrap(
                spacing: 10,
                runSpacing: 10,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: [
                  OutlinedButton(onPressed: _loading ? null : () => _pickDate(from: true), child: Text('Từ: ${_ymd(_fromDate)}')),
                  OutlinedButton(onPressed: _loading ? null : () => _pickDate(from: false), child: Text('Đến: ${_ymd(_toDate)}')),
                  SizedBox(width: 220, child: TextField(controller: _emplNameCtrl, decoration: const InputDecoration(labelText: 'Tên nhân viên'))),
                  ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 160, minWidth: 110),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        isExpanded: true,
                        value: _factory,
                        dropdownColor: Theme.of(context).colorScheme.surface,
                        iconEnabledColor: Theme.of(context).colorScheme.onSurface,
                        style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w700),
                        onChanged: _loading ? null : (v) => setState(() => _factory = v ?? 'ALL'),
                        items: const [
                          DropdownMenuItem(value: 'ALL', child: Text('ALL')),
                          DropdownMenuItem(value: 'NM1', child: Text('NM1')),
                          DropdownMenuItem(value: 'NM2', child: Text('NM2')),
                        ],
                      ),
                    ),
                  ),
                  SizedBox(width: 180, child: TextField(controller: _testIdCtrl, decoration: const InputDecoration(labelText: 'Test ID'))),
                  ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 180, minWidth: 130),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        isExpanded: true,
                        value: _testType,
                        dropdownColor: Theme.of(context).colorScheme.surface,
                        iconEnabledColor: Theme.of(context).colorScheme.onSurface,
                        style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w700),
                        onChanged: _loading ? null : (v) => setState(() => _testType = v ?? 'ALL'),
                        items: const [
                          DropdownMenuItem(value: 'ALL', child: Text('ALL')),
                          DropdownMenuItem(value: 'Test_LT', child: Text('Test_LT')),
                          DropdownMenuItem(value: 'Test_CC', child: Text('Test_CC')),
                        ],
                      ),
                    ),
                  ),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Checkbox(value: _allTime, onChanged: _loading ? null : (v) => setState(() => _allTime = v ?? false)),
                      const Text('All Time'),
                    ],
                  ),
                  ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 360, minWidth: 240),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        isExpanded: true,
                        value: _selectedData,
                        dropdownColor: Theme.of(context).colorScheme.surface,
                        iconEnabledColor: Theme.of(context).colorScheme.onSurface,
                        style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w700),
                        onChanged: _loading ? null : (v) => setState(() => _selectedData = v ?? 'detail'),
                        items: const [
                          DropdownMenuItem(value: 'detail', child: Text('Chi tiết theo từng câu đề thi')),
                          DropdownMenuItem(value: 'summaryByEmpl', child: Text('Tổng hợp kết quả theo đầu nhân viên')),
                          DropdownMenuItem(value: 'trendByEmpl', child: Text('Trend kết quả test từng nhân viên')),
                          DropdownMenuItem(value: 'summaryByDept', child: Text('Tổng hợp kết quả theo bộ phận')),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        if (_loading) const LinearProgressIndicator(),
        Expanded(
          child: Card(
            child: _cols.isEmpty
                ? const Center(child: Text('Chưa có dữ liệu'))
                : PlutoGrid(
                    columns: _cols,
                    rows: _plutoRows,
                    onLoaded: (e) => e.stateManager.setShowColumnFilter(true),
                    configuration: const PlutoGridConfiguration(
                      style: PlutoGridStyleConfig(
                        rowHeight: 34,
                        columnHeight: 34,
                        cellTextStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
                        columnTextStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w900),
                        defaultCellPadding: EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                      ),
                    ),
                  ),
          ),
        ),
      ],
    );
  }
}
