import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:pluto_grid/pluto_grid.dart';
import 'package:syncfusion_flutter_charts/charts.dart';

import '../../../../../core/config/app_config.dart';
import '../../../../../core/providers.dart';
import '../../../../../core/utils/excel_exporter.dart';

class InspectionMaterialStatusTab extends ConsumerStatefulWidget {
  const InspectionMaterialStatusTab({super.key});

  @override
  ConsumerState<InspectionMaterialStatusTab> createState() => _InspectionMaterialStatusTabState();
}

class _InspectionMaterialStatusTabState extends ConsumerState<InspectionMaterialStatusTab> {
  bool _loading = false;
  bool _showFilter = true;

  DateTime _fromDate = DateTime.now();
  DateTime _toDate = DateTime.now();
  bool _allTime = false;

  String _factory = 'ALL';
  String _machine = 'ALL';
  bool _dailyGraph = false;

  final TextEditingController _codeKdCtrl = TextEditingController();
  final TextEditingController _codeErpCtrl = TextEditingController();
  final TextEditingController _mNameCtrl = TextEditingController();
  final TextEditingController _mCodeCtrl = TextEditingController();
  final TextEditingController _prodReqCtrl = TextEditingController();
  final TextEditingController _planIdCtrl = TextEditingController();
  final TextEditingController _custCtrl = TextEditingController();

  List<Map<String, dynamic>> _machineList = const [];
  List<Map<String, dynamic>> _lossRoll = const [];
  List<Map<String, dynamic>> _backdata = const [];

  List<PlutoColumn> _cols = const [];
  List<PlutoRow> _rows = const [];

  // summary
  double _xuatKhoMet = 0;
  double _ktInputMet = 0;
  double _ktOkMet = 0;
  double _ktOutputMet = 0;
  double _totalLossKt = 0;
  double _totalLoss = 0;

  ScaffoldMessengerState? _messenger;

  final TooltipBehavior _chartTooltip = TooltipBehavior(enable: true, animationDuration: 0);

  String _s(dynamic v) => (v ?? '').toString();

  double _d(dynamic v) {
    final raw = (v ?? '').toString().trim();
    if (raw.isEmpty) return 0.0;
    final normalized = raw.replaceAll(',', '').replaceAll(RegExp(r'[^0-9\.-]'), '');
    if (normalized.isEmpty) return 0.0;
    return double.tryParse(normalized) ?? 0.0;
  }

  bool _isNg(Map<String, dynamic> body) => _s(body['tk_status']).toUpperCase() == 'NG';

  void _snack(String msg) {
    if (!mounted) return;
    _messenger?.showSnackBar(SnackBar(content: Text(msg)));
  }

  String _ymd(DateTime dt) => DateFormat('yyyy-MM-dd').format(dt);

  String _ymdHms(String raw) {
    final s = raw.trim();
    if (s.isEmpty) return '';
    try {
      final dt = DateTime.parse(s);
      return DateFormat('yyyy-MM-dd HH:mm:ss').format(dt);
    } catch (_) {
      return raw;
    }
  }

  String _ddMm(String ymd) {
    final s = ymd.trim();
    if (s.isEmpty) return '';
    try {
      final dt = DateTime.parse(s);
      return DateFormat('dd/MM').format(dt);
    } catch (_) {
      return ymd;
    }
  }

  Future<Map<String, dynamic>> _post(String command, Map<String, dynamic> data) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(command, data: data);
    final body = res.data;
    if (body is Map<String, dynamic>) return body;
    return <String, dynamic>{'tk_status': 'NG', 'message': 'Bad response'};
  }

  Future<List<Map<String, dynamic>>> _callList(String cmd, Map<String, dynamic> payload) async {
    final body = await _post(cmd, payload);
    if (_isNg(body)) {
      _snack('NG: ${_s(body['message'])}');
      return const [];
    }
    final raw = body['data'];
    final arr = raw is List ? raw : const [];
    return arr.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();
  }

  Future<void> _exportAll(List<Map<String, dynamic>> rows, String name) async {
    await ExcelExporter.shareAsXlsx(fileName: '$name.xlsx', rows: rows);
  }

  PlutoGridConfiguration _gridConfig() {
    return PlutoGridConfiguration(
      style: const PlutoGridStyleConfig(
        rowHeight: 34,
        columnHeight: 34,
        cellTextStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w600),
        columnTextStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w800),
      ),
    );
  }

  List<PlutoColumn> _autoColumns(List<Map<String, dynamic>> rows) {
    if (rows.isEmpty) return const [];
    final keys = rows.first.keys.toList();
    const statusKeys = <String>{
      'VAO_FR',
      'VAO_SR',
      'VAO_DC',
      'VAO_ED',
      'XUAT_KHO',
      'CONFIRM_GIAONHAN',
      'VAO_KIEM',
      'NHATKY_KT',
      'RETURN_IQC',
      'RETURN_KHO',
      'VAO_SX',
      'RA_KIEM',
    };

    bool isNumField(String f) {
      if (f == 'WIDTH_CD' || f == 'PD' || f == 'CAVITY') return true;
      return f.endsWith('_QTY') || f.endsWith('_EA') || f.endsWith('_RESULT') || f.contains('RESULT') || f.endsWith('_LOSS');
    }

    PlutoColumnType typeOf(String field) {
      if (isNumField(field)) return PlutoColumnType.number(format: '#,###.##');
      return PlutoColumnType.text();
    }

    Widget statusBadge(String v) {
      final s = v.trim().toUpperCase();
      Color bg;
      Color fg;
      if (s == 'Y') {
        bg = const Color(0xFF54E00D);
        fg = Colors.white;
      } else if (s == 'R') {
        bg = Colors.yellow;
        fg = Colors.black;
      } else {
        bg = Colors.red;
        fg = Colors.white;
      }
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
        decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(6)),
        child: Text(s.isEmpty ? 'N' : s, style: TextStyle(fontWeight: FontWeight.w900, color: fg, fontSize: 11)),
      );
    }

    Widget numberCell(String field, dynamic value) {
      final v = _d(value);
      final isLoss = field.endsWith('_LOSS');
      if (isLoss) {
        return Text('${(v * 100).toStringAsFixed(2)} %', style: const TextStyle(fontWeight: FontWeight.w900, color: Colors.green));
      }
      final text = NumberFormat.decimalPattern().format(v);
      final isMetOrResult = <String>{
            'TOTAL_OUT_QTY',
            'INSPECT_TOTAL_QTY',
            'INSPECT_OK_QTY',
            'INS_OUT',
          }.contains(field) ||
          field.contains('RESULT');
      final isEa = field.endsWith('_EA');
      final color = isEa
          ? Colors.green
          : isMetOrResult
              ? Colors.blue
              : Colors.black87;
      return Text(text, style: TextStyle(fontWeight: FontWeight.w900, color: color));
    }

    PlutoColumn col(String field) {
      return PlutoColumn(
        title: field,
        field: field,
        type: typeOf(field),
        enableColumnDrag: true,
        enableSorting: true,
        enableFilterMenuItem: true,
        enableContextMenu: true,
        width: 140,
        minWidth: 90,
        renderer: (ctx) {
          final f = ctx.column.field;
          final raw = _s(ctx.cell.value);
          if (statusKeys.contains(f)) {
            return Center(child: statusBadge(raw));
          }
          if (f == 'INS_DATE' || f == 'FIRST_INPUT_DATE') {
            return Text(_ymdHms(raw), style: const TextStyle(fontWeight: FontWeight.w800));
          }
          if (isNumField(f)) {
            return Align(alignment: Alignment.centerRight, child: numberCell(f, raw));
          }
          return Text(raw, overflow: TextOverflow.ellipsis);
        },
      );
    }
    return [for (final k in keys) col(k)];
  }

  List<PlutoRow> _toPlutoRows(List<Map<String, dynamic>> rows, List<PlutoColumn> cols) {
    return List.generate(rows.length, (i) {
      final r = rows[i];
      final cells = <String, PlutoCell>{};
      for (final c in cols) {
        cells[c.field] = PlutoCell(value: _s(r[c.field]));
      }
      return PlutoRow(cells: cells);
    });
  }

  Future<void> _pickDate({required bool isFrom}) async {
    final init = isFrom ? _fromDate : _toDate;
    final picked = await showDatePicker(
      context: context,
      initialDate: init,
      firstDate: DateTime(2018),
      lastDate: DateTime(2100),
    );
    if (picked == null || !mounted) return;
    setState(() {
      if (isFrom) {
        _fromDate = picked;
      } else {
        _toDate = picked;
      }
    });
  }

  Future<void> _loadMachineList() async {
    final rows = await _callList('getmachinelist', {});
    if (!mounted) return;
    setState(() {
      _machineList = rows;
      if (_machineList.isNotEmpty && _machine == 'ALL') {
        // keep ALL default; dropdown will include ALL + list
      }
    });
  }

  void _computeSummaryFromBackdata(List<Map<String, dynamic>> rows) {
    double xuat = 0;
    double input = 0;
    double ok = 0;
    double out = 0;
    for (final r in rows) {
      xuat += _d(r['TOTAL_OUT_QTY']);
      input += _d(r['INSPECT_TOTAL_QTY']);
      ok += _d(r['INSPECT_OK_QTY']);
      out += _d(r['INS_OUT']);
    }
    final lossKt = xuat == 0 ? 0.0 : (1.0 - (ok / xuat));
    final loss = xuat == 0 ? 0.0 : (1.0 - (out / xuat));

    _xuatKhoMet = xuat;
    _ktInputMet = input;
    _ktOkMet = ok;
    _ktOutputMet = out;
    _totalLossKt = lossKt;
    _totalLoss = loss;
  }

  Future<void> _loadAll() async {
    if (!mounted) return;
    setState(() {
      _loading = true;
      _showFilter = false;
      _lossRoll = const [];
      _backdata = const [];
      _cols = const [];
      _rows = const [];
      _xuatKhoMet = 0;
      _ktInputMet = 0;
      _ktOkMet = 0;
      _ktOutputMet = 0;
      _totalLossKt = 0;
      _totalLoss = 0;
    });

    try {
      final from = _ymd(_fromDate);
      final to = _ymd(_toDate);

      final payload = <String, dynamic>{
        'ALLTIME': _allTime,
        'FROM_DATE': from,
        'TO_DATE': to,
        'PROD_REQUEST_NO': _prodReqCtrl.text.trim(),
        'PLAN_ID': _planIdCtrl.text.trim(),
        'M_NAME': _mNameCtrl.text.trim(),
        'M_CODE': _mCodeCtrl.text.trim(),
        'G_NAME': _codeKdCtrl.text.trim(),
        'G_CODE': _codeErpCtrl.text.trim(),
        'FACTORY': _factory,
        'PLAN_EQ': _machine,
        'CUST_NAME_KD': _custCtrl.text.trim(),
      };

      final futures = <Future<void>>[
        () async {
          final rows = await _callList(_dailyGraph ? 'checkRollLieuBienMatDaily' : 'checkRollLieuBienMat', {
            'FROM_DATE': from,
            'TO_DATE': to,
          });
          if (!mounted) return;
          setState(() => _lossRoll = rows);
        }(),
        () async {
          final rows = await _callList('materialLotStatus', payload);
          if (!mounted) return;

          for (final r in rows) {
            final ins = _s(r['INS_DATE']);
            if (ins.isNotEmpty) r['INS_DATE'] = _ymdHms(ins);
            final first = _s(r['FIRST_INPUT_DATE']);
            if (first.isNotEmpty) r['FIRST_INPUT_DATE'] = _ymdHms(first);
          }

          final cols = _autoColumns(rows);
          final pr = _toPlutoRows(rows, cols);
          setState(() {
            _backdata = rows;
            _cols = cols;
            _rows = pr;
          });
          _computeSummaryFromBackdata(rows);
          if (!mounted) return;
          setState(() {});
        }(),
      ];

      await Future.wait(futures);
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Đã load Material Status');
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Widget _lossRollChart() {
    if (_lossRoll.isEmpty) return const SizedBox.shrink();
    final pts = [..._lossRoll];
    final xKey = _dailyGraph ? 'OUT_DATE' : 'YEAR_WEEK';
    final xLabel = _dailyGraph ? 'Ngày' : 'Tuần';

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                Expanded(child: Text(_dailyGraph ? 'Daily Roll Loss' : 'Weekly Roll Loss', style: const TextStyle(fontWeight: FontWeight.w900))),
                IconButton(onPressed: () => _exportAll(_lossRoll, _dailyGraph ? 'roll_loss_daily' : 'roll_loss_weekly'), icon: const Icon(Icons.table_view)),
              ],
            ),
            SizedBox(
              height: 280,
              child: SfCartesianChart(
                enableAxisAnimation: false,
                tooltipBehavior: _chartTooltip,
                legend: const Legend(isVisible: true, position: LegendPosition.top),
                primaryXAxis: CategoryAxis(
                  labelRotation: -45,
                  title: AxisTitle(text: xLabel),
                ),
                primaryYAxis: NumericAxis(numberFormat: NumberFormat.compact(), title: const AxisTitle(text: 'Roll QTY')),
                series: <CartesianSeries<Map<String, dynamic>, String>>[
                  StackedColumnSeries<Map<String, dynamic>, String>(
                    name: 'MASS_ROLL',
                    animationDuration: 0,
                    dataSource: pts,
                    xValueMapper: (p, _) => _dailyGraph ? _ddMm(_s(p[xKey])) : _s(p[xKey]),
                    yValueMapper: (p, _) => _d(p['MASS_ROLL']),
                    color: const Color(0xFF7DF7FC),
                    width: 0.6,
                  ),
                  StackedColumnSeries<Map<String, dynamic>, String>(
                    name: 'SAMPLE_ROLL',
                    animationDuration: 0,
                    dataSource: pts,
                    xValueMapper: (p, _) => _dailyGraph ? _ddMm(_s(p[xKey])) : _s(p[xKey]),
                    yValueMapper: (p, _) => _d(p['SAMPLE_ROLL']),
                    color: const Color(0xFFFFFF64),
                    width: 0.6,
                  ),
                  LineSeries<Map<String, dynamic>, String>(
                    name: 'TOTAL_ROLL',
                    animationDuration: 0,
                    dataSource: pts,
                    xValueMapper: (p, _) => _dailyGraph ? _ddMm(_s(p[xKey])) : _s(p[xKey]),
                    yValueMapper: (p, _) => _d(p['TOTAL_ROLL']),
                    color: const Color(0xFF16A34A),
                    markerSettings: const MarkerSettings(isVisible: true, width: 4, height: 4),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _summaryTable() {
    final scheme = Theme.of(context).colorScheme;
    DataRow row(String label, String value, {Color? color}) {
      return DataRow(
        cells: [
          DataCell(Text(label, style: const TextStyle(fontWeight: FontWeight.w800))),
          DataCell(Text(value, style: TextStyle(fontWeight: FontWeight.w900, color: color ?? scheme.onSurface))),
        ],
      );
    }

    final fmt = NumberFormat.decimalPattern();
    final pct = NumberFormat.percentPattern()..minimumFractionDigits = 2;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                const Expanded(child: Text('Summary', style: TextStyle(fontWeight: FontWeight.w900))),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text('Daily', style: TextStyle(fontWeight: FontWeight.w800)),
                    Switch(
                      value: _dailyGraph,
                      onChanged: _loading
                          ? null
                          : (v) {
                              setState(() => _dailyGraph = v);
                              _loadAll();
                            },
                    ),
                  ],
                ),
              ],
            ),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: DataTable(
                headingRowHeight: 32,
                dataRowMinHeight: 28,
                dataRowMaxHeight: 32,
                columns: const [
                  DataColumn(label: Text('Metric', style: TextStyle(fontWeight: FontWeight.w900))),
                  DataColumn(label: Text('Value', style: TextStyle(fontWeight: FontWeight.w900))),
                ],
                rows: [
                  row('1.XUAT KHO MET', fmt.format(_xuatKhoMet), color: Colors.blue),
                  row('7.KT INPUT MET', fmt.format(_ktInputMet), color: const Color(0xFFFC2DF6)),
                  row('7.KT OK MET', fmt.format(_ktOkMet), color: const Color(0xFFFC2DF6)),
                  row('8.KT OUTPUT MET', fmt.format(_ktOutputMet), color: const Color(0xFFFC2DF6)),
                  row('9.TOTAL_LOSS_KT', pct.format(_totalLossKt), color: Colors.green),
                  row('9.TOTAL_LOSS', pct.format(_totalLoss), color: Colors.green),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _backdataTable() {
    if (_cols.isEmpty) return const SizedBox.shrink();
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                const Expanded(child: Text('Backdata', style: TextStyle(fontWeight: FontWeight.w900))),
                IconButton(onPressed: () => _exportAll(_backdata, 'material_lot_status'), icon: const Icon(Icons.table_view)),
              ],
            ),
            SizedBox(
              height: 420,
              child: PlutoGrid(
                columns: _cols,
                rows: _rows,
                onLoaded: (e) => e.stateManager.setShowColumnFilter(true),
                configuration: _gridConfig(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _messenger = ScaffoldMessenger.maybeOf(context);
  }

  @override
  void initState() {
    super.initState();
    Future.microtask(_loadMachineList);
    Future.microtask(_loadAll);
  }

  @override
  void dispose() {
    _codeKdCtrl.dispose();
    _codeErpCtrl.dispose();
    _mNameCtrl.dispose();
    _mCodeCtrl.dispose();
    _prodReqCtrl.dispose();
    _planIdCtrl.dispose();
    _custCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    Widget header() {
      return Card(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
          child: Row(
            children: [
              IconButton(
                onPressed: _loading ? null : () => setState(() => _showFilter = !_showFilter),
                icon: Icon(_showFilter ? Icons.filter_alt_off : Icons.filter_alt),
              ),
              const Expanded(child: Text('Material Status', style: TextStyle(fontWeight: FontWeight.w900))),
              FilledButton.tonal(onPressed: _loading ? null : _loadAll, child: const Text('Search')),
            ],
          ),
        ),
      );
    }

    Widget filter() {
      if (!_showFilter) return const SizedBox.shrink();

      return Card(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Wrap(
            spacing: 10,
            runSpacing: 10,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Checkbox(
                    value: _allTime,
                    onChanged: _loading ? null : (v) => setState(() => _allTime = v ?? false),
                  ),
                  const Text('All Time', style: TextStyle(fontWeight: FontWeight.w800)),
                ],
              ),
              OutlinedButton(onPressed: _loading ? null : () => _pickDate(isFrom: true), child: Text('FROM: ${_ymd(_fromDate)}')),
              OutlinedButton(onPressed: _loading ? null : () => _pickDate(isFrom: false), child: Text('TO: ${_ymd(_toDate)}')),
              SizedBox(
                width: 160,
                child: TextField(
                  controller: _codeKdCtrl,
                  decoration: const InputDecoration(labelText: 'Code KD', isDense: true, border: OutlineInputBorder()),
                ),
              ),
              SizedBox(
                width: 160,
                child: TextField(
                  controller: _codeErpCtrl,
                  decoration: const InputDecoration(labelText: 'Code ERP', isDense: true, border: OutlineInputBorder()),
                ),
              ),
              SizedBox(
                width: 180,
                child: TextField(
                  controller: _mNameCtrl,
                  decoration: const InputDecoration(labelText: 'Tên Liệu', isDense: true, border: OutlineInputBorder()),
                ),
              ),
              SizedBox(
                width: 160,
                child: TextField(
                  controller: _mCodeCtrl,
                  decoration: const InputDecoration(labelText: 'Mã Liệu', isDense: true, border: OutlineInputBorder()),
                ),
              ),
              SizedBox(
                width: 160,
                child: TextField(
                  controller: _prodReqCtrl,
                  decoration: const InputDecoration(labelText: 'Số YCSX', isDense: true, border: OutlineInputBorder()),
                ),
              ),
              SizedBox(
                width: 160,
                child: TextField(
                  controller: _planIdCtrl,
                  decoration: const InputDecoration(labelText: 'Số chỉ thị', isDense: true, border: OutlineInputBorder()),
                ),
              ),
              SizedBox(
                width: 160,
                child: TextField(
                  controller: _custCtrl,
                  decoration: const InputDecoration(labelText: 'Khách hàng', isDense: true, border: OutlineInputBorder()),
                ),
              ),
              DropdownButton<String>(
                value: _factory,
                dropdownColor: scheme.surface,
                style: TextStyle(color: scheme.onSurface, fontWeight: FontWeight.w800),
                iconEnabledColor: scheme.onSurface,
                items: const [
                  DropdownMenuItem(value: 'ALL', child: Text('FACTORY: ALL')),
                  DropdownMenuItem(value: 'NM1', child: Text('FACTORY: NM1')),
                  DropdownMenuItem(value: 'NM2', child: Text('FACTORY: NM2')),
                ],
                onChanged: _loading ? null : (v) => setState(() => _factory = v ?? 'ALL'),
              ),
              DropdownButton<String>(
                value: _machine,
                dropdownColor: scheme.surface,
                style: TextStyle(color: scheme.onSurface, fontWeight: FontWeight.w800),
                iconEnabledColor: scheme.onSurface,
                items: [
                  const DropdownMenuItem(value: 'ALL', child: Text('MACHINE: ALL')),
                  for (final m in _machineList)
                    DropdownMenuItem(
                      value: _s(m['EQ_NAME']).isEmpty ? _s(m['MACHINE']) : _s(m['EQ_NAME']),
                      child: Text('MACHINE: ${_s(m['EQ_NAME']).isEmpty ? _s(m['MACHINE']) : _s(m['EQ_NAME'])}'),
                    ),
                ],
                onChanged: _loading ? null : (v) => setState(() => _machine = v ?? 'ALL'),
              ),
              Text('Company: ${AppConfig.company}', style: TextStyle(color: scheme.onSurfaceVariant, fontWeight: FontWeight.w800)),
            ],
          ),
        ),
      );
    }

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            header(),
            filter(),
            if (_loading) const LinearProgressIndicator(),
            Expanded(
              child: ListView(
                children: [
                  _lossRollChart(),
                  _summaryTable(),
                  _backdataTable(),
                  const SizedBox(height: 8),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
