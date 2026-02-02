import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:pluto_grid/pluto_grid.dart';

import '../../../../core/providers.dart';

enum SpecDtcViewMode { grid, list }

class SpecDtcTab extends ConsumerStatefulWidget {
  const SpecDtcTab({super.key});

  @override
  ConsumerState<SpecDtcTab> createState() => _SpecDtcTabState();
}

class _SpecDtcTabState extends ConsumerState<SpecDtcTab> {
  bool _loading = false;
  bool _showFilter = true;
  SpecDtcViewMode _viewMode = SpecDtcViewMode.grid;

  DateTime _fromDate = DateTime.now();
  DateTime _toDate = DateTime.now();
  bool _allTime = false;

  final _codeKdCtrl = TextEditingController();
  final _codeErpCtrl = TextEditingController();
  final _mNameCtrl = TextEditingController();
  final _mCodeCtrl = TextEditingController();
  final _ycsxCtrl = TextEditingController();
  final _idCtrl = TextEditingController();

  List<Map<String, dynamic>> _testList = const [];
  String _testCode = '0';
  final String _testType = '0';

  List<Map<String, dynamic>> _rows = const [];
  List<PlutoColumn> _gridColumns = const [];
  List<PlutoRow> _gridRows = const [];

  String _s(dynamic v) => (v ?? '').toString();
  double _d(dynamic v) {
    final raw = (v ?? '').toString().trim();
    if (raw.isEmpty) return 0.0;
    final normalized = raw.replaceAll(',', '').replaceAll(RegExp(r'[^0-9\.-]'), '');
    if (normalized.isEmpty) return 0.0;
    return double.tryParse(normalized) ?? 0.0;
  }

  Future<Map<String, dynamic>> _post(String command, Map<String, dynamic> data) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(command, data: data);
    final body = res.data;
    if (body is Map<String, dynamic>) return body;
    return <String, dynamic>{'tk_status': 'NG', 'message': 'Bad response'};
  }

  bool _isNg(Map<String, dynamic> body) => (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  String _fmtDate(DateTime d) => DateFormat('yyyy-MM-dd').format(d);

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadTestList();
    });
  }

  @override
  void dispose() {
    _codeKdCtrl.dispose();
    _codeErpCtrl.dispose();
    _mNameCtrl.dispose();
    _mCodeCtrl.dispose();
    _ycsxCtrl.dispose();
    _idCtrl.dispose();
    super.dispose();
  }

  Future<void> _pickDate({required bool from}) async {
    final init = from ? _fromDate : _toDate;
    final picked = await showDatePicker(
      context: context,
      initialDate: init,
      firstDate: DateTime(2019, 1, 1),
      lastDate: DateTime(2100, 12, 31),
    );
    if (picked == null || !mounted) return;
    setState(() {
      if (from) {
        _fromDate = picked;
      } else {
        _toDate = picked;
      }
    });
  }

  Future<void> _loadTestList() async {
    try {
      final body = await _post('loadDtcTestList', {});
      if (_isNg(body)) return;
      final data = body['data'];
      final list = (data is List ? data : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList();
      if (!mounted) return;
      setState(() {
        _testList = [
          {'TEST_CODE': 0, 'TEST_NAME': 'ALL'},
          ...list,
        ];
      });
    } catch (_) {}
  }

  Map<String, dynamic> _payloadCommon() {
    return {
      'ALLTIME': _allTime,
      'FROM_DATE': _fmtDate(_fromDate),
      'TO_DATE': _fmtDate(_toDate),
      'G_CODE': _codeErpCtrl.text.trim(),
      'G_NAME': _codeKdCtrl.text.trim(),
      'M_NAME': _mNameCtrl.text.trim(),
      'M_CODE': _mCodeCtrl.text.trim(),
      'TEST_NAME': _testCode,
      'PROD_REQUEST_NO': _ycsxCtrl.text.trim(),
      'TEST_TYPE': _testType,
      'ID': _idCtrl.text.trim(),
    };
  }

  List<PlutoColumn> _buildColumns() {
    PlutoColumn col(String f, {double width = 120, bool numeric = false}) {
      return PlutoColumn(
        title: f,
        field: f,
        type: PlutoColumnType.text(),
        width: width,
        enableContextMenu: false,
        enableDropToResize: true,
        renderer: (ctx) {
          final v = ctx.cell.value;
          if (numeric) {
            return Align(
              alignment: Alignment.centerRight,
              child: Text(NumberFormat.decimalPattern().format(_d(v)), style: const TextStyle(fontWeight: FontWeight.w800)),
            );
          }
          if (f == 'G_NAME' || f == 'M_NAME' || f == 'POINT_NAME') {
            return Text(_s(v), style: const TextStyle(fontWeight: FontWeight.w800));
          }
          return Text(_s(v));
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
      ),
      col('CUST_NAME_KD', width: 140),
      col('G_CODE', width: 110),
      col('G_NAME', width: 200),
      col('TEST_NAME', width: 130),
      col('POINT_NAME', width: 140),
      col('PRI', width: 90, numeric: true),
      col('CENTER_VALUE', width: 120, numeric: true),
      col('UPPER_TOR', width: 110, numeric: true),
      col('LOWER_TOR', width: 110, numeric: true),
      col('MIN_SPEC', width: 110, numeric: true),
      col('MAX_SPEC', width: 110, numeric: true),
      col('BARCODE_CONTENT', width: 150),
      col('REMARK', width: 140),
      col('M_NAME', width: 150),
      col('WIDTH_CD', width: 110, numeric: true),
      col('M_CODE', width: 120),
      col('TDS', width: 100),
      col('BANVE', width: 100),
    ];
  }

  List<PlutoRow> _buildRows(List<Map<String, dynamic>> list, List<PlutoColumn> cols) {
    Object? val(Map<String, dynamic> it, String field) {
      if (field == '__raw__') return it;
      return it[field];
    }

    return [
      for (final it in list)
        PlutoRow(
          cells: {
            for (final c in cols) c.field: PlutoCell(value: val(it, c.field)),
          },
        ),
    ];
  }

  Future<void> _loadData() async {
    if (!mounted) return;
    setState(() => _loading = true);

    try {
      final body = await _post('dtcspec', _payloadCommon());
      if (_isNg(body)) {
        setState(() => _loading = false);
        _snack('Lỗi: ${(body['message'] ?? 'NG').toString()}');
        return;
      }

      final data = body['data'];
      final list = (data is List ? data : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList();

      final cols = _buildColumns();
      final rws = _buildRows(list, cols);

      if (!mounted) return;
      setState(() {
        _rows = list;
        _gridColumns = cols;
        _gridRows = rws;
        _loading = false;
      });

      _snack('Đã load ${list.length} dòng');
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return RefreshIndicator(
      onRefresh: _loadData,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            Row(
              children: [
                IconButton(
                  onPressed: () => setState(() => _showFilter = !_showFilter),
                  icon: Icon(_showFilter ? Icons.filter_alt_off : Icons.filter_alt),
                ),
                const SizedBox(width: 8),
                SegmentedButton<SpecDtcViewMode>(
                  segments: const [
                    ButtonSegment(value: SpecDtcViewMode.grid, label: Text('Grid'), icon: Icon(Icons.grid_on)),
                    ButtonSegment(value: SpecDtcViewMode.list, label: Text('List'), icon: Icon(Icons.view_agenda)),
                  ],
                  selected: {_viewMode},
                  onSelectionChanged: (s) => setState(() => _viewMode = s.first),
                ),
                const Spacer(),
                FilledButton.icon(
                  onPressed: _loading ? null : _loadData,
                  icon: const Icon(Icons.search),
                  label: const Text('Tra'),
                ),
              ],
            ),
            const SizedBox(height: 8),
            if (_showFilter)
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: ListTile(
                              dense: true,
                              contentPadding: EdgeInsets.zero,
                              title: const Text('Từ ngày'),
                              subtitle: Text(_fmtDate(_fromDate)),
                              onTap: () => _pickDate(from: true),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: ListTile(
                              dense: true,
                              contentPadding: EdgeInsets.zero,
                              title: const Text('Tới ngày'),
                              subtitle: Text(_fmtDate(_toDate)),
                              onTap: () => _pickDate(from: false),
                            ),
                          ),
                        ],
                      ),
                      CheckboxListTile(
                        contentPadding: EdgeInsets.zero,
                        title: const Text('All Time'),
                        value: _allTime,
                        onChanged: (v) => setState(() => _allTime = v ?? false),
                      ),
                      const SizedBox(height: 6),
                      TextField(controller: _codeKdCtrl, decoration: const InputDecoration(labelText: 'Code KD')),
                      const SizedBox(height: 8),
                      TextField(controller: _codeErpCtrl, decoration: const InputDecoration(labelText: 'Code ERP')),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(child: TextField(controller: _mNameCtrl, decoration: const InputDecoration(labelText: 'Tên liệu'))),
                          const SizedBox(width: 8),
                          Expanded(child: TextField(controller: _mCodeCtrl, decoration: const InputDecoration(labelText: 'Mã liệu'))),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(child: TextField(controller: _ycsxCtrl, decoration: const InputDecoration(labelText: 'Số YCSX'))),
                          const SizedBox(width: 8),
                          Expanded(child: TextField(controller: _idCtrl, decoration: const InputDecoration(labelText: 'ID'))),
                        ],
                      ),
                      const SizedBox(height: 8),
                      DropdownButtonFormField<String>(
                        key: ValueKey<String>('spec_test_code_$_testCode'),
                        initialValue: _testCode,
                        isExpanded: true,
                        dropdownColor: scheme.surface,
                        style: TextStyle(color: scheme.onSurface),
                        iconEnabledColor: scheme.onSurface,
                        decoration: const InputDecoration(labelText: 'Hạng mục test'),
                        items: _testList.map((e) {
                          final code = _s(e['TEST_CODE']);
                          final name = _s(e['TEST_NAME']);
                          return DropdownMenuItem(value: code, child: Text('$name ($code)', overflow: TextOverflow.ellipsis));
                        }).toList(),
                        onChanged: (v) => setState(() => _testCode = v ?? '0'),
                      ),
                    ],
                  ),
                ),
              ),
            const SizedBox(height: 12),
            Expanded(
              child: _loading
                  ? const Center(child: CircularProgressIndicator())
                  : _rows.isEmpty
                      ? Center(child: Text('Chưa có dữ liệu', style: TextStyle(color: scheme.onSurfaceVariant)))
                      : (_viewMode == SpecDtcViewMode.grid
                          ? PlutoGrid(
                              columns: _gridColumns,
                              rows: _gridRows,
                              onLoaded: (e) {
                                e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                                e.stateManager.setShowColumnFilter(true);
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
                            )
                          : ListView.builder(
                              itemCount: _rows.length,
                              itemBuilder: (ctx, i) {
                                final r = _rows[i];
                                final testName = _s(r['TEST_NAME']);
                                final pointName = _s(r['POINT_NAME']);
                                final title = pointName.isEmpty ? testName : pointName;
                                final sub1 = 'G: ${_s(r['G_CODE'])} | ${_s(r['G_NAME'])}';
                                final sub2 = 'M: ${_s(r['M_CODE'])} | ${_s(r['M_NAME'])} | W: ${_s(r['WIDTH_CD'])}';
                                final center = _d(r['CENTER_VALUE']);
                                final upper = _d(r['UPPER_TOR']);
                                final lower = _d(r['LOWER_TOR']);
                                return Card(
                                  child: ListTile(
                                    title: Text(title, style: const TextStyle(fontWeight: FontWeight.w900)),
                                    subtitle: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        if (testName.isNotEmpty) Text('TEST_NAME: $testName', style: const TextStyle(fontWeight: FontWeight.w800)),
                                        if (pointName.isNotEmpty) Text('POINT_NAME: $pointName', style: const TextStyle(fontWeight: FontWeight.w800)),
                                        Text(sub1),
                                        Text(sub2),
                                        const SizedBox(height: 4),
                                        Text('CENTER: $center | +$upper / -$lower', style: TextStyle(color: scheme.onSurfaceVariant, fontWeight: FontWeight.w800)),
                                      ],
                                    ),
                                  ),
                                );
                              },
                            )),
            ),
          ],
        ),
      ),
    );
  }
}
