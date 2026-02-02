import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:pluto_grid/pluto_grid.dart';

import '../../../../core/providers.dart';
import 'dtc_charts_page.dart';

enum KqDtcViewMode { grid, list }

class KqDtcTab extends ConsumerStatefulWidget {
  const KqDtcTab({super.key});

  @override
  ConsumerState<KqDtcTab> createState() => _KqDtcTabState();
}

class _KqDtcTabState extends ConsumerState<KqDtcTab> {
  bool _loading = false;
  bool _showFilter = true;
  KqDtcViewMode _viewMode = KqDtcViewMode.grid;

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
        _testList = list;
      });
    } catch (_) {}
  }

  Map<String, dynamic> _payloadCommon({Map<String, dynamic>? extra}) {
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
      ...?extra,
    };
  }

  List<PlutoColumn> _buildColumns() {
    PlutoColumn col(String f, {double width = 120}) {
      return PlutoColumn(
        title: f,
        field: f,
        type: PlutoColumnType.text(),
        width: width,
        enableContextMenu: false,
        enableDropToResize: true,
        renderer: (ctx) {
          final v = ctx.cell.value;
          if (f == 'DANHGIA') {
            final s = _s(v).toUpperCase();
            return Text(s, style: TextStyle(color: s == 'OK' ? Colors.green : Colors.red, fontWeight: FontWeight.w900));
          }
          if (f == 'M_CODE' || f == 'M_NAME' || f == 'G_NAME') {
            return Text(_s(v), style: const TextStyle(fontWeight: FontWeight.w800));
          }
          if (f == 'RESULT') {
            final val = _d(v);
            final raw = ctx.row.cells['__raw__']?.value;
            final map = raw is Map<String, dynamic> ? raw : <String, dynamic>{};
            final center = _d(map['CENTER_VALUE']);
            final upper = _d(map['UPPER_TOR']);
            final lower = _d(map['LOWER_TOR']);
            final ok = val >= (center - lower) && val <= (center + upper);
            return Text(NumberFormat.decimalPattern().format(val), style: TextStyle(color: ok ? Colors.black : Colors.red, fontWeight: FontWeight.w900));
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
      col('DTC_ID', width: 90),
      col('PROD_REQUEST_NO', width: 110),
      col('G_CODE', width: 110),
      col('G_NAME', width: 220),
      col('M_CODE', width: 110),
      col('M_NAME', width: 160),
      col('TEST_NAME', width: 120),
      col('POINT_CODE', width: 110),
      col('CENTER_VALUE', width: 120),
      col('UPPER_TOR', width: 110),
      col('LOWER_TOR', width: 110),
      col('RESULT', width: 110),
      col('DANHGIA', width: 90),
      col('REMARK', width: 140),
      col('BARCODE_CONTENT', width: 160),
      col('FACTORY', width: 100),
      col('TEST_FINISH_TIME', width: 160),
      col('TEST_EMPL_NO', width: 120),
      col('TEST_TYPE_NAME', width: 140),
      col('WORK_POSITION_NAME', width: 140),
      col('SAMPLE_NO', width: 110),
      col('REQUEST_DATETIME', width: 160),
      col('REQUEST_EMPL_NO', width: 120),
      col('SIZE', width: 100),
      col('LOTCMS', width: 120),
      col('TEST_CODE', width: 110),
      col('TDS', width: 100),
      col('TDS_EMPL', width: 110),
      col('TDS_UPD_DATE', width: 140),
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
      final body = await _post('dtcdata', _payloadCommon());
      if (_isNg(body)) {
        setState(() => _loading = false);
        _snack('Lỗi: ${(body['message'] ?? 'NG').toString()}');
        return;
      }

      final data = body['data'];
      final list = (data is List ? data : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList();

      final mapped = <Map<String, dynamic>>[];
      for (final e in list) {
        final center = _d(e['CENTER_VALUE']);
        final upper = _d(e['UPPER_TOR']);
        final lower = _d(e['LOWER_TOR']);
        final rs = _d(e['RESULT']);
        final ok = rs >= (center - lower) && rs <= (center + upper);
        mapped.add({...e, 'DANHGIA': ok ? 'OK' : 'NG'});
      }

      final cols = _buildColumns();
      final rws = _buildRows(mapped, cols);

      if (!mounted) return;
      setState(() {
        _rows = mapped;
        _gridColumns = cols;
        _gridRows = rws;
        _loading = false;
      });

      _snack('Đã load ${mapped.length} dòng');
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Future<void> _openCharts(Map<String, dynamic> row) async {
    final payload = _payloadCommon(extra: {
      'POINT_CODE': row['POINT_CODE'],
      'TEST_CODE': row['TEST_CODE'],
      'G_CODE': row['G_CODE'],
      'M_NAME': row['M_NAME'],
      'M_CODE': row['M_CODE'],
    });

    setState(() => _loading = true);
    try {
      final xbar = await _post('loadXbarData', payload);
      final cpk = await _post('loadCPKTrend', payload);
      final hist = await _post('loadHistogram', payload);
      setState(() => _loading = false);

      if (_isNg(xbar) || _isNg(cpk) || _isNg(hist)) {
        _snack('Không load được chart data');
        return;
      }

      final xbarRaw = xbar['data'];
      final cpkRaw = cpk['data'];
      final histRaw = hist['data'];

      final xbarList = (xbarRaw is List ? xbarRaw : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList();
      final cpkList = (cpkRaw is List ? cpkRaw : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList();
      final histList = (histRaw is List ? histRaw : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList();

      // Calculate control lines like web
      if (xbarList.isNotEmpty) {
        var totalX = 0.0;
        var totalR = 0.0;
        for (final e in xbarList) {
          totalX += _d(e['AVG_VALUE']);
          totalR += _d(e['R_VALUE']);
        }
        final cnt = xbarList.length;
        final avgX = cnt > 0 ? (totalX / cnt) : 0.0;
        final avgR = cnt > 0 ? (totalR / cnt) : 0.0;
        for (final e in xbarList) {
          e['X_UCL'] = avgX + avgR * 0.577;
          e['X_CL'] = avgX;
          e['X_LCL'] = avgX - avgR * 0.577;
          e['R_UCL'] = avgR * 0;
          e['R_CL'] = avgR;
          e['R_LCL'] = avgR * 2.114;
        }
      }

      for (final e in cpkList) {
        e['CPK1'] = 1.33;
        e['CPK2'] = 1.67;
      }

      if (!mounted) return;
      await Navigator.of(context).push(
        MaterialPageRoute(
          builder: (_) => DtcChartsPage(
            title: 'DTC Charts',
            selectedRow: row,
            xbar: xbarList,
            cpk: cpkList,
            histogram: histList,
          ),
        ),
      );
    } catch (e) {
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
                SegmentedButton<KqDtcViewMode>(
                  segments: const [
                    ButtonSegment(value: KqDtcViewMode.grid, label: Text('Grid'), icon: Icon(Icons.grid_on)),
                    ButtonSegment(value: KqDtcViewMode.list, label: Text('List'), icon: Icon(Icons.view_agenda)),
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
                        key: ValueKey<String>('test_code_$_testCode'),
                        initialValue: _testCode,
                        isExpanded: true,
                        dropdownColor: scheme.surface,
                        style: TextStyle(color: scheme.onSurface),
                        iconEnabledColor: scheme.onSurface,
                        decoration: const InputDecoration(labelText: 'Hạng mục test'),
                        items: [
                          const DropdownMenuItem(value: '0', child: Text('ALL')),
                          ..._testList.map((e) {
                            final code = _s(e['TEST_CODE']);
                            final name = _s(e['TEST_NAME']);
                            return DropdownMenuItem(value: code, child: Text('$name ($code)', overflow: TextOverflow.ellipsis));
                          }),
                        ],
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
                      : (_viewMode == KqDtcViewMode.grid
                          ? PlutoGrid(
                              columns: _gridColumns,
                              rows: _gridRows,
                              onLoaded: (e) {
                                e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                                e.stateManager.setShowColumnFilter(true);
                              },
                              onRowDoubleTap: (e) {
                                final raw = e.row.cells['__raw__']?.value;
                                if (raw is Map<String, dynamic>) {
                                  _openCharts(raw);
                                }
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
                                final title = '${_s(r['TEST_NAME'])} | ${_s(r['POINT_CODE'])}';
                                final sub1 = 'G: ${_s(r['G_CODE'])} | ${_s(r['G_NAME'])}';
                                final sub2 = 'M: ${_s(r['M_CODE'])} | ${_s(r['M_NAME'])}';
                                final rs = _d(r['RESULT']);
                                final judge = _s(r['DANHGIA']);
                                return Card(
                                  child: ListTile(
                                    title: Text(title, style: const TextStyle(fontWeight: FontWeight.w900)),
                                    subtitle: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(sub1),
                                        Text(sub2),
                                        const SizedBox(height: 4),
                                        Text('RESULT: ${NumberFormat.decimalPattern().format(rs)} | $judge', style: TextStyle(color: judge == 'OK' ? Colors.green : scheme.error, fontWeight: FontWeight.w900)),
                                      ],
                                    ),
                                    onLongPress: () => _openCharts(r),
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
