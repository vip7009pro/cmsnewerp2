import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:pluto_grid/pluto_grid.dart';
import 'package:syncfusion_flutter_charts/charts.dart';

import '../../../../../core/providers.dart';
import '../../../../../core/utils/excel_exporter.dart';

class InspectionReportTab extends ConsumerStatefulWidget {
  const InspectionReportTab({super.key});

  @override
  ConsumerState<InspectionReportTab> createState() => _InspectionReportTabState();
}

class _InspectionReportTabState extends ConsumerState<InspectionReportTab> {
  bool _loading = false;
  bool _showFilter = true;

  ScaffoldMessengerState? _messenger;

  // Reuse a single TooltipBehavior instance to avoid creating/destroying internal
  // animation resources repeatedly during rebuilds.
  final TooltipBehavior _chartTooltip = TooltipBehavior(enable: true, animationDuration: 0);
  final TooltipBehavior _chartTooltipOff = TooltipBehavior(enable: false, animationDuration: 0);

  late final TrackballBehavior _defectTrackball;
  List<String> _defectSeriesNames = const [];

  static const _axisLabelStyle = TextStyle(fontSize: 10, fontWeight: FontWeight.w700);
  static const _axisTitleStyle = TextStyle(fontSize: 11, fontWeight: FontWeight.w900);

  bool _df = true;
  DateTime _fromDate = DateTime.now().subtract(const Duration(days: 14));
  DateTime _toDate = DateTime.now();

  final TextEditingController _custCtrl = TextEditingController();

  String _worstBy = 'AMOUNT';
  String _ngType = 'ALL';

  List<Map<String, dynamic>> _codeList = const [];
  List<Map<String, dynamic>> _selectedCodes = const [];

  List<Map<String, dynamic>> _summary = const [];
  List<Map<String, dynamic>> _worst = const [];

  List<Map<String, dynamic>> _dailyPpm = const [];
  List<Map<String, dynamic>> _weeklyPpm = const [];
  List<Map<String, dynamic>> _monthlyPpm = const [];
  List<Map<String, dynamic>> _yearlyPpm = const [];

  List<Map<String, dynamic>> _dailyFcost = const [];
  List<Map<String, dynamic>> _weeklyFcost = const [];
  List<Map<String, dynamic>> _monthlyFcost = const [];
  List<Map<String, dynamic>> _yearlyFcost = const [];

  List<Map<String, dynamic>> _dailyDefectTrending = const [];

  List<Map<String, dynamic>> _errTb = const [];

  List<Map<String, dynamic>> _patrolHeader = const [];

  List<PlutoColumn> _worstCols = const [];
  List<PlutoRow> _worstRows = const [];

  String _s(dynamic v) => (v ?? '').toString();

  Map<String, String> _errNameMap() {
    if (_errTb.isEmpty) return const {};
    final m = <String, String>{};
    for (final r in _errTb) {
      final code = _s(r['ERR_CODE']).trim();
      if (code.isEmpty) continue;
      final vn = _s(r['ERR_NAME_VN']).trim();
      final kr = _s(r['ERR_NAME_KR']).trim();
      if (vn.isEmpty && kr.isEmpty) {
        m[code] = code;
      } else if (vn.isEmpty) {
        m[code] = '($kr)';
      } else if (kr.isEmpty) {
        m[code] = vn;
      } else {
        m[code] = '$vn ($kr)';
      }
    }
    return m;
  }

  double _d(dynamic v) {
    final raw = (v ?? '').toString().trim();
    if (raw.isEmpty) return 0.0;
    final normalized = raw.replaceAll(',', '').replaceAll(RegExp(r'[^0-9\.-]'), '');
    if (normalized.isEmpty) return 0.0;
    return double.tryParse(normalized) ?? 0.0;
  }

  Widget _overviewPpmCard({required String label, required IconData icon, required Color accent, required Map<String, dynamic> row}) {
    final scheme = Theme.of(context).colorScheme;
    final total = _d(row['TOTAL_PPM']);
    final proc = _d(row['PROCESS_PPM']);
    final mat = _d(row['MATERIAL_PPM']);

    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(14),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            accent.withValues(alpha: 0.22),
            accent.withValues(alpha: 0.06),
          ],
        ),
        border: Border.all(color: accent.withValues(alpha: 0.35)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: accent.withValues(alpha: 0.18),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(icon, color: accent),
                ),
                const SizedBox(width: 10),
                Expanded(child: Text(label, style: TextStyle(fontWeight: FontWeight.w900, color: scheme.onSurface))),
              ],
            ),
            const SizedBox(height: 10),
            Text('TOTAL', style: TextStyle(color: scheme.onSurfaceVariant, fontWeight: FontWeight.w800)),
            Text(
              '${total.toStringAsFixed(0)} ppm',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: scheme.onSurface),
            ),
            const SizedBox(height: 6),
            Text('PROCESS: ${proc.toStringAsFixed(0)} ppm', style: TextStyle(fontWeight: FontWeight.w800, color: scheme.onSurfaceVariant)),
            Text('MATERIAL: ${mat.toStringAsFixed(0)} ppm', style: TextStyle(fontWeight: FontWeight.w800, color: scheme.onSurfaceVariant)),
          ],
        ),
      ),
    );
  }

  Widget _responsiveQuad({required Widget a, required Widget b, required Widget c, required Widget d}) {
    return LayoutBuilder(
      builder: (ctx, cst) {
        final w = cst.maxWidth;
        if (w >= 900) {
          return Row(
            children: [
              Expanded(child: a),
              const SizedBox(width: 8),
              Expanded(child: b),
              const SizedBox(width: 8),
              Expanded(child: c),
              const SizedBox(width: 8),
              Expanded(child: d),
            ],
          );
        }
        if (w >= 650) {
          return Column(
            children: [
              Row(
                children: [
                  Expanded(child: a),
                  const SizedBox(width: 8),
                  Expanded(child: b),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(child: c),
                  const SizedBox(width: 8),
                  Expanded(child: d),
                ],
              ),
            ],
          );
        }
        return Column(
          children: [
            a,
            const SizedBox(height: 8),
            b,
            const SizedBox(height: 8),
            c,
            const SizedBox(height: 8),
            d,
          ],
        );
      },
    );
  }

  Widget _patrolHeaderTable() {
    if (_patrolHeader.isEmpty) return const SizedBox.shrink();
    final cols = _autoColumns(_patrolHeader);
    final rows = _toPlutoRows(_patrolHeader, cols);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                const Expanded(child: Text('Top 3 F-Cost Products', style: TextStyle(fontWeight: FontWeight.w900))),
                TextButton(
                  onPressed: () => _exportAll(_patrolHeader, 'patrol_header'),
                  child: const Text('Export Excel'),
                ),
              ],
            ),
            SizedBox(
              height: 240,
              child: PlutoGrid(
                columns: cols,
                rows: rows,
                onLoaded: (e) => e.stateManager.setShowColumnFilter(true),
                configuration: _gridConfig(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _worstTop5Chart() {
    if (_worst.isEmpty) return const SizedBox.shrink();
    final yKey = _worstBy == 'QTY' ? 'NG_QTY' : 'NG_AMOUNT';
    final pts = [..._worst];
    pts.sort((a, b) => _d(b[yKey]).compareTo(_d(a[yKey])));
    final top = pts.take(5).toList();
    String xKey = 'ERR_NAME';
    if (top.isNotEmpty) {
      if (top.first.containsKey('ERR_NAME')) {
        xKey = 'ERR_NAME';
      } else if (top.first.containsKey('ERR_NAME_VN')) {
        xKey = 'ERR_NAME_VN';
      } else if (top.first.containsKey('ERR_NAME_KR')) {
        xKey = 'ERR_NAME_KR';
      } else if (top.first.containsKey('ERR_CODE')) {
        xKey = 'ERR_CODE';
      } else {
        xKey = top.first.keys.first;
      }
    }
    return _simpleBarChart(title: 'WORST 5 BY $_worstBy', data: top, xKey: xKey, yKey: yKey);
  }

  Widget _responsivePair({required Widget a, required Widget b}) {
    return LayoutBuilder(
      builder: (ctx, cst) {
        final w = cst.maxWidth;
        if (w >= 650) {
          return Row(
            children: [
              Expanded(child: a),
              const SizedBox(width: 8),
              Expanded(child: b),
            ],
          );
        }
        return Column(
          children: [
            a,
            const SizedBox(height: 8),
            b,
          ],
        );
      },
    );
  }

  bool _isNg(Map<String, dynamic> body) => (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  String _ymd(DateTime d) => '${d.year.toString().padLeft(4, '0')}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

  String _ddMm(String ymd) {
    try {
      final dt = DateTime.parse(ymd);
      return DateFormat('dd/MM').format(dt);
    } catch (_) {
      return ymd;
    }
  }

  TrackballBehavior _buildDefectTrackball() {
    return TrackballBehavior(
      enable: true,
      activationMode: ActivationMode.longPress,
      tooltipDisplayMode: TrackballDisplayMode.groupAllPoints,
      lineType: TrackballLineType.vertical,
      markerSettings: const TrackballMarkerSettings(markerVisibility: TrackballVisibilityMode.visible),
      builder: (BuildContext context, TrackballDetails details) {
        final points = details.groupingModeInfo?.points ?? const <dynamic>[];
        final label = details.point?.x?.toString() ?? '';

        final seriesNames = _defectSeriesNames;
        final entries = <({String seriesName, double y})>[];
        for (int i = 0; i < points.length; i++) {
          final p = points[i];
          final name = (i < seriesNames.length ? seriesNames[i] : '').toString();
          dynamic rawY;
          try {
            rawY = (p as dynamic).y;
          } catch (_) {
            rawY = null;
          }
          rawY ??= (p as dynamic).chartPoint?.y;
          final y = rawY is num ? rawY.toDouble() : _d(rawY);
          if (y == 0) continue;
          entries.add((seriesName: name.isEmpty ? 'Series ${i + 1}' : name, y: y));
        }
        entries.sort((a, b) => b.y.compareTo(a.y));

        return ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 320),
          child: Material(
            color: Colors.white,
            elevation: 4,
            borderRadius: BorderRadius.circular(10),
            child: Padding(
              padding: const EdgeInsets.all(10),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Date: $label', style: const TextStyle(fontWeight: FontWeight.w900)),
                  const SizedBox(height: 6),
                  if (entries.isEmpty)
                    const Text('No defect', style: TextStyle(color: Colors.black54))
                  else
                    for (final e in entries.take(12))
                      Padding(
                        padding: const EdgeInsets.only(bottom: 2),
                        child: Text(
                          '${e.seriesName}: ${e.y.toStringAsFixed(2)}%',
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
                        ),
                      ),
                  if (entries.length > 12) Text('+${entries.length - 12} more', style: const TextStyle(fontSize: 11, color: Colors.black54)),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _defectTrendingChart() {
    if (_dailyDefectTrending.isEmpty) return const SizedBox.shrink();

    final pts = [..._dailyDefectTrending].reversed.toList();
    String x(Map<String, dynamic> r) => _ddMm(_s(r['INSPECT_DATE']));

    final first = pts.first;
    final keys = first.keys
        .where(
          (k) =>
              !<String>{
                'INSPECT_DATE',
                'INSPECT_YW',
                'INSPECT_YM',
                'INSPECT_YEAR',
                'INSPECT_MONTH',
                'INSPECT_WEEK',
                'INSPECT_TOTAL_QTY',
                'INSPECT_OK_QTY',
                'INSPECT_NG_QTY',
                'id',
              }.contains(k),
        )
        .toList();

    final activeKeys = keys.where((k) => pts.any((r) => _d(r[k]) != 0)).toList();
    if (activeKeys.isEmpty) return const SizedBox.shrink();

    final nameMap = _errNameMap();
    final seriesNames = activeKeys.map((k) => nameMap[k] ?? k).toList();
    _defectSeriesNames = seriesNames;

    // Heuristic: API may return 0..1 ratio or 0..100 percent. If max <= 1.2 treat as ratio.
    double maxY = 0;
    for (final r in pts) {
      for (final k in activeKeys) {
        final v = _d(r[k]);
        if (v > maxY) maxY = v;
      }
    }
    final multiply100 = maxY <= 1.2;

    final colors = <Color>[
      const Color(0xFF2563EB),
      const Color(0xFFDC2626),
      const Color(0xFF16A34A),
      const Color(0xFFF59E0B),
      const Color(0xFF7C3AED),
      const Color(0xFF0891B2),
      const Color(0xFFDB2777),
      const Color(0xFF4B5563),
      const Color(0xFF0EA5E9),
      const Color(0xFF84CC16),
    ];

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                const Expanded(child: Text('Daily Defect Trending', style: TextStyle(fontWeight: FontWeight.w900))),
                IconButton(onPressed: () => _exportAll(_dailyDefectTrending, 'Inspection_DefectTrending'), icon: const Icon(Icons.table_view)),
              ],
            ),
            SizedBox(
              height: 320,
              child: SfCartesianChart(
                enableAxisAnimation: false,
                legend: const Legend(isVisible: true, position: LegendPosition.top, toggleSeriesVisibility: false),
                tooltipBehavior: _chartTooltipOff,
                trackballBehavior: _defectTrackball,
                primaryXAxis: CategoryAxis(labelRotation: -45, title: const AxisTitle(text: 'DATE')),
                primaryYAxis: NumericAxis(
                  labelStyle: _axisLabelStyle,
                  title: const AxisTitle(text: 'NG Rate (%)', textStyle: _axisTitleStyle),
                  axisLabelFormatter: (v) => ChartAxisLabel('${v.value.toStringAsFixed(0)}%', v.textStyle),
                ),
                series: <CartesianSeries<Map<String, dynamic>, String>>[
                  for (int i = 0; i < activeKeys.length; i++)
                    SplineSeries<Map<String, dynamic>, String>(
                      name: seriesNames[i],
                      dataSource: pts,
                      xValueMapper: (p, _) => x(p),
                      yValueMapper: (p, _) => _d(p[activeKeys[i]]) * (multiply100 ? 100 : 1),
                      color: colors[i % colors.length],
                      splineType: SplineType.natural,
                      markerSettings: const MarkerSettings(isVisible: false),
                      animationDuration: 0,
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _fcostSummaryWidgets() {
    if (_summary.isEmpty) return const SizedBox.shrink();
    final r = _summary.first;
    final pAmt = _d(r['P_NG_AMOUNT']);
    final mAmt = _d(r['M_NG_AMOUNT']);
    final tAmt = _d(r['T_NG_AMOUNT']) != 0 ? _d(r['T_NG_AMOUNT']) : (pAmt + mAmt);
    final ispQty = _d(r['ISP_TT_QTY']);
    final ispAmt = _d(r['ISP_TT_AMOUNT']);
    final pQty = _d(r['P_NG_QTY']);
    final mQty = _d(r['M_NG_QTY']);
    final tQty = _d(r['T_NG_QTY']) != 0 ? _d(r['T_NG_QTY']) : (pQty + mQty);
    final tRate = ispQty == 0 ? 0 : (tQty / ispQty) * 100;
    final tARate = ispAmt == 0 ? 0 : (tAmt / ispAmt) * 100;
    final scheme = Theme.of(context).colorScheme;

    Widget stat({required String label, required String value, required Color color}) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.85),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withValues(alpha: 0.22)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Colors.black.withValues(alpha: 0.65))),
            const SizedBox(height: 2),
            Text(value, style: TextStyle(fontWeight: FontWeight.w900, color: color)),
          ],
        ),
      );
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                const Expanded(child: Text('F-Cost Summary', style: TextStyle(fontWeight: FontWeight.w900))),
                IconButton(onPressed: () => _exportAll(_summary, 'inspection_summary'), icon: const Icon(Icons.table_view)),
              ],
            ),
            const SizedBox(height: 8),
            Text('ISP_QTY: ${NumberFormat.compact().format(ispQty)} | ISP_AMOUNT: ${NumberFormat.compact().format(ispAmt)}', style: TextStyle(color: scheme.onSurfaceVariant)),
            const SizedBox(height: 10),
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: [
                stat(label: 'P_NG_AMOUNT', value: NumberFormat.compact().format(pAmt), color: const Color(0xFF2563EB)),
                stat(label: 'M_NG_AMOUNT', value: NumberFormat.compact().format(mAmt), color: const Color(0xFFEF4444)),
                stat(label: 'T_NG_AMOUNT', value: NumberFormat.compact().format(tAmt), color: const Color(0xFF16A34A)),
                stat(label: 'T_RATE', value: '${tRate.toStringAsFixed(2)}%', color: const Color(0xFFF59E0B)),
                stat(label: 'T_A_RATE', value: '${tARate.toStringAsFixed(2)}%', color: const Color(0xFF7C3AED)),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _fcostChart({required String title, required List<Map<String, dynamic>> data, required String xKey, required String xLabel}) {
    if (data.isEmpty) return const SizedBox.shrink();
    final pts = [...data].reversed.toList();
    String x(Map<String, dynamic> r) {
      final raw = _s(r[xKey]);
      if (xKey == 'INSPECT_DATE') return _ddMm(raw);
      return raw;
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                Expanded(child: Text(title, style: const TextStyle(fontWeight: FontWeight.w900))),
                TextButton(
                  onPressed: () => _exportAll(data, title.replaceAll(' ', '_')),
                  child: const Text('Export Excel'),
                ),
              ],
            ),
            SizedBox(
              height: 260,
              child: SfCartesianChart(
                enableAxisAnimation: false,
                tooltipBehavior: _tooltip(),
                legend: const Legend(isVisible: true, position: LegendPosition.top),
                primaryXAxis: CategoryAxis(
                  labelRotation: -45,
                  labelStyle: _axisLabelStyle,
                  title: AxisTitle(text: xLabel, textStyle: _axisTitleStyle),
                ),
                primaryYAxis: NumericAxis(
                  numberFormat: NumberFormat.compact(),
                  labelStyle: _axisLabelStyle,
                  title: const AxisTitle(text: 'AMOUNT', textStyle: _axisTitleStyle),
                ),
                series: <CartesianSeries<Map<String, dynamic>, String>>[
                  StackedColumnSeries<Map<String, dynamic>, String>(
                    name: 'P_NG_AMOUNT',
                    animationDuration: 0,
                    dataSource: pts,
                    xValueMapper: (p, _) => x(p),
                    yValueMapper: (p, _) => _d(p['P_NG_AMOUNT']),
                    color: const Color(0xFF2563EB),
                    width: 0.6,
                  ),
                  StackedColumnSeries<Map<String, dynamic>, String>(
                    name: 'M_NG_AMOUNT',
                    animationDuration: 0,
                    dataSource: pts,
                    xValueMapper: (p, _) => x(p),
                    yValueMapper: (p, _) => _d(p['M_NG_AMOUNT']),
                    color: const Color(0xFFEF4444),
                    width: 0.6,
                  ),
                  LineSeries<Map<String, dynamic>, String>(
                    name: 'T_NG_AMOUNT',
                    animationDuration: 0,
                    dataSource: pts,
                    xValueMapper: (p, _) => x(p),
                    yValueMapper: (p, _) => _d(p['T_NG_AMOUNT']),
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

  TooltipBehavior _tooltip() => _chartTooltip;

  Future<void> _loadErrTable() async {
    try {
      final body = await _post('loadErrTable', {});
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() => _errTb = const []);
        return;
      }
      final raw = body['data'];
      final data = raw is List ? raw : const [];
      final rows = data.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();
      if (!mounted) return;
      setState(() => _errTb = rows);
    } catch (_) {
      if (!mounted) return;
      setState(() => _errTb = const []);
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
    if (_isNg(body)) return const [];
    final raw = body['data'];
    final data = raw is List ? raw : const [];
    return data.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();
  }

  void _snack(String msg) {
    if (!mounted) return;
    _messenger?.showSnackBar(SnackBar(content: Text(msg)));
  }

  Future<void> _pickDate({required bool isFrom}) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: isFrom ? _fromDate : _toDate,
      firstDate: DateTime(2020, 1, 1),
      lastDate: DateTime(2100, 12, 31),
    );
    if (picked == null) return;
    if (!mounted) return;
    setState(() {
      if (isFrom) {
        _fromDate = picked;
      } else {
        _toDate = picked;
      }
    });
  }

  List<String> _selectedCodeNames() {
    return _selectedCodes.map((e) => _s(e['G_CODE']).trim()).where((e) => e.isNotEmpty).toList();
  }

  Future<void> _loadCodeList() async {
    if (!mounted) return;
    try {
      final body = await _post('selectcodeList', {'G_NAME': ''});
      if (_isNg(body)) return;
      final raw = body['data'];
      final data = raw is List ? raw : const [];
      final rows = data.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();
      if (!mounted) return;
      setState(() => _codeList = rows);
    } catch (_) {
      // ignore
    }
  }

  Future<void> _pickCodes() async {
    if (!mounted) return;
    final current = _selectedCodes;
    final selected = <Map<String, dynamic>>[...current];

    final result = await showModalBottomSheet<List<Map<String, dynamic>>>(
      context: context,
      isScrollControlled: true,
      builder: (ctx) {
        final searchCtrl = TextEditingController();
        return StatefulBuilder(
          builder: (ctx2, setState2) {
            List<Map<String, dynamic>> filtered() {
              final q = searchCtrl.text.trim().toLowerCase();
              if (q.isEmpty) return _codeList;
              return _codeList.where((r) {
                final a = _s(r['G_NAME']).toLowerCase();
                final b = _s(r['G_NAME_KD']).toLowerCase();
                final c = _s(r['G_CODE']).toLowerCase();
                return a.contains(q) || b.contains(q) || c.contains(q);
              }).toList();
            }

            bool isSel(Map<String, dynamic> r) {
              final g = _s(r['G_CODE']);
              return selected.any((e) => _s(e['G_CODE']) == g);
            }

            void toggle(Map<String, dynamic> r) {
              final g = _s(r['G_CODE']);
              final idx = selected.indexWhere((e) => _s(e['G_CODE']) == g);
              setState2(() {
                if (idx >= 0) {
                  selected.removeAt(idx);
                } else {
                  selected.add(r);
                }
              });
            }

            return SafeArea(
              child: Padding(
                padding: EdgeInsets.only(
                  left: 12,
                  right: 12,
                  top: 12,
                  bottom: MediaQuery.of(ctx2).viewInsets.bottom + 12,
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(
                      controller: searchCtrl,
                      decoration: const InputDecoration(labelText: 'Tìm code (G_CODE/G_NAME/G_NAME_KD)'),
                      onChanged: (_) => setState2(() {}),
                    ),
                    const SizedBox(height: 8),
                    SizedBox(
                      height: MediaQuery.of(ctx2).size.height * 0.6,
                      child: ListView.builder(
                        itemCount: filtered().length,
                        itemBuilder: (_, i) {
                          final r = filtered()[i];
                          final sel = isSel(r);
                          return ListTile(
                            dense: true,
                            title: Text('${_s(r['G_CODE'])} - ${_s(r['G_NAME_KD'])}'),
                            subtitle: Text(_s(r['G_NAME'])),
                            trailing: Checkbox(value: sel, onChanged: (_) => toggle(r)),
                            onTap: () => toggle(r),
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(child: OutlinedButton(onPressed: () => Navigator.of(ctx2).pop(current), child: const Text('Hủy'))),
                        const SizedBox(width: 8),
                        Expanded(child: FilledButton(onPressed: () => Navigator.of(ctx2).pop(selected), child: Text('Chọn (${selected.length})'))),
                      ],
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );

    if (result == null) return;
    if (!mounted) return;
    setState(() => _selectedCodes = result);
  }

  Future<void> _exportAll(List<Map<String, dynamic>> rows, String name) async {
    await ExcelExporter.shareAsXlsx(fileName: '$name.xlsx', rows: rows);
  }

  List<PlutoColumn> _autoColumns(List<Map<String, dynamic>> rows) {
    if (rows.isEmpty) return const [];
    PlutoColumn col(String field) {
      return PlutoColumn(
        field: field,
        title: field,
        type: PlutoColumnType.text(),
        minWidth: 80,
        width: 140,
      );
    }

    final keys = rows.first.keys.toList();
    return [for (final k in keys) col(k)];
  }

  List<PlutoRow> _toPlutoRows(List<Map<String, dynamic>> rows, List<PlutoColumn> cols) {
    return List.generate(rows.length, (i) {
      final r = rows[i];
      final cells = <String, PlutoCell>{};
      for (final c in cols) {
        cells[c.field] = PlutoCell(value: r[c.field]);
      }
      return PlutoRow(cells: cells);
    });
  }

  PlutoGridConfiguration _gridConfig() {
    return PlutoGridConfiguration(
      style: PlutoGridStyleConfig(
        rowHeight: 34,
        columnHeight: 34,
        cellTextStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
        columnTextStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900),
        defaultCellPadding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
      ),
    );
  }

  Map<String, dynamic> _payloadCommon(String from, String to, List<String> listCode) {
    return {
      'FROM_DATE': from,
      'TO_DATE': to,
      'codeArray': listCode,
      'CUST_NAME_KD': _custCtrl.text.trim(),
      'NG_TYPE': _ngType,
    };
  }

  Future<List<Map<String, dynamic>>> _loadPpm(String cmd, String factory, String from, String to, List<String> listCode) async {
    final rows = await _callList(cmd, {
      'FACTORY': factory,
      ..._payloadCommon(from, to, listCode),
    });
    for (final r in rows) {
      if (r['INSPECT_DATE'] != null) {
        r['INSPECT_DATE'] = _s(r['INSPECT_DATE']).split('T').first;
      }
      if (_ngType == 'P') {
        r['TOTAL_PPM'] = r['PROCESS_PPM'];
        r['MATERIAL_PPM'] = 0;
      } else if (_ngType == 'M') {
        r['TOTAL_PPM'] = r['MATERIAL_PPM'];
        r['PROCESS_PPM'] = 0;
      }
    }
    return rows;
  }

  Future<void> _loadAll() async {
    if (!mounted) return;
    setState(() {
      _loading = true;
      _showFilter = false;
      _summary = const [];
      _worst = const [];
      _dailyPpm = const [];
      _weeklyPpm = const [];
      _monthlyPpm = const [];
      _yearlyPpm = const [];
      _dailyFcost = const [];
      _weeklyFcost = const [];
      _monthlyFcost = const [];
      _yearlyFcost = const [];
      _dailyDefectTrending = const [];
      _patrolHeader = const [];
      _worstCols = const [];
      _worstRows = const [];
    });

    final td = DateTime.now();
    final dfDaily = DateTime.now().subtract(const Duration(days: 12));
    final dfWeekly = DateTime.now().subtract(const Duration(days: 70));
    final dfMonthly = DateTime.now().subtract(const Duration(days: 365));
    final dfYearly = DateTime.now().subtract(const Duration(days: 3650));
    final dfWorst = DateTime.now().subtract(const Duration(days: 7));
    final dfDefect = DateTime.now().subtract(const Duration(days: 14));

    final from = _ymd(_fromDate);
    final to = _ymd(_toDate);
    final listCode = _df ? <String>[] : _selectedCodeNames();

    final fromDaily = _df ? _ymd(dfDaily) : from;
    final fromWeekly = _df ? _ymd(dfWeekly) : from;
    final fromMonthly = _df ? _ymd(dfMonthly) : from;
    final fromYearly = _df ? _ymd(dfYearly) : from;
    final fromWorst = _df ? _ymd(dfWorst) : from;
    final fromDefect = _df ? _ymd(dfDefect) : from;
    final toEff = _df ? _ymd(td) : to;
    final codeArrayEff = _df ? <String>[] : listCode;

    try {
      final futures = <Future<void>>[
        () async {
          final rows = await _callList('getpatrolheader', {
            'FROM_DATE': fromDaily,
            'TO_DATE': toEff,
            'NG_TYPE': _ngType,
          });
          if (!mounted) return;
          setState(() => _patrolHeader = rows);
        }(),
        () async {
          final rows = await _callList('getInspectionWorstTable', {
            'FROM_DATE': fromWorst,
            'TO_DATE': toEff,
            'WORSTBY': _worstBy,
            'NG_TYPE': _ngType,
            'codeArray': codeArrayEff,
            'CUST_NAME_KD': _custCtrl.text.trim(),
          });
          if (!mounted) return;
          setState(() {
            _worst = rows;
            _worstCols = _autoColumns(rows);
            _worstRows = _toPlutoRows(rows, _worstCols);
          });
        }(),
        () async {
          final rows = await _callList('getInspectionSummary', {
            'FROM_DATE': fromWorst,
            'TO_DATE': toEff,
            'codeArray': codeArrayEff,
            'CUST_NAME_KD': _custCtrl.text.trim(),
            'NG_TYPE': _ngType,
          });
          if (!mounted) return;
          setState(() => _summary = rows);
        }(),
        () async {
          final rows = await _loadPpm('inspect_daily_ppm', 'ALL', fromDaily, toEff, codeArrayEff);
          if (!mounted) return;
          setState(() => _dailyPpm = rows);
        }(),
        () async {
          final rows = await _loadPpm('inspect_weekly_ppm', 'ALL', fromWeekly, toEff, codeArrayEff);
          if (!mounted) return;
          setState(() => _weeklyPpm = rows);
        }(),
        () async {
          final rows = await _loadPpm('inspect_monthly_ppm', 'ALL', fromMonthly, toEff, codeArrayEff);
          if (!mounted) return;
          setState(() => _monthlyPpm = rows);
        }(),
        () async {
          final rows = await _loadPpm('inspect_yearly_ppm', 'ALL', fromYearly, toEff, codeArrayEff);
          if (!mounted) return;
          setState(() => _yearlyPpm = rows);
        }(),
        () async {
          final rows = await _callList('dailyFcost', {
            'FROM_DATE': fromDaily,
            'TO_DATE': toEff,
            'codeArray': codeArrayEff,
            'CUST_NAME_KD': _custCtrl.text.trim(),
          });
          for (final r in rows) {
            if (r['INSPECT_DATE'] != null) r['INSPECT_DATE'] = _s(r['INSPECT_DATE']).split('T').first;
            if (_ngType == 'P') {
              r['M_NG_AMOUNT'] = 0;
              r['M_NG_QTY'] = 0;
            } else if (_ngType == 'M') {
              r['P_NG_AMOUNT'] = 0;
              r['P_NG_QTY'] = 0;
            }
            final p = _d(r['P_NG_AMOUNT']);
            final m = _d(r['M_NG_AMOUNT']);
            r['T_NG_AMOUNT'] = r['T_NG_AMOUNT'] ?? (p + m);
          }
          if (!mounted) return;
          setState(() => _dailyFcost = rows);
        }(),
        () async {
          final rows = await _callList('weeklyFcost', {
            'FROM_DATE': fromWeekly,
            'TO_DATE': toEff,
            'codeArray': codeArrayEff,
            'CUST_NAME_KD': _custCtrl.text.trim(),
          });
          for (final r in rows) {
            if (_ngType == 'P') {
              r['M_NG_AMOUNT'] = 0;
              r['M_NG_QTY'] = 0;
            } else if (_ngType == 'M') {
              r['P_NG_AMOUNT'] = 0;
              r['P_NG_QTY'] = 0;
            }
            final p = _d(r['P_NG_AMOUNT']);
            final m = _d(r['M_NG_AMOUNT']);
            r['T_NG_AMOUNT'] = r['T_NG_AMOUNT'] ?? (p + m);
          }
          if (!mounted) return;
          setState(() => _weeklyFcost = rows);
        }(),
        () async {
          final rows = await _callList('monthlyFcost', {
            'FROM_DATE': fromMonthly,
            'TO_DATE': toEff,
            'codeArray': codeArrayEff,
            'CUST_NAME_KD': _custCtrl.text.trim(),
          });
          for (final r in rows) {
            if (_ngType == 'P') {
              r['M_NG_AMOUNT'] = 0;
              r['M_NG_QTY'] = 0;
            } else if (_ngType == 'M') {
              r['P_NG_AMOUNT'] = 0;
              r['P_NG_QTY'] = 0;
            }
            final p = _d(r['P_NG_AMOUNT']);
            final m = _d(r['M_NG_AMOUNT']);
            r['T_NG_AMOUNT'] = r['T_NG_AMOUNT'] ?? (p + m);
          }
          if (!mounted) return;
          setState(() => _monthlyFcost = rows);
        }(),
        () async {
          final rows = await _callList('annuallyFcost', {
            'FROM_DATE': fromYearly,
            'TO_DATE': toEff,
            'codeArray': codeArrayEff,
            'CUST_NAME_KD': _custCtrl.text.trim(),
          });
          for (final r in rows) {
            if (_ngType == 'P') {
              r['M_NG_AMOUNT'] = 0;
              r['M_NG_QTY'] = 0;
            } else if (_ngType == 'M') {
              r['P_NG_AMOUNT'] = 0;
              r['P_NG_QTY'] = 0;
            }
            final p = _d(r['P_NG_AMOUNT']);
            final m = _d(r['M_NG_AMOUNT']);
            r['T_NG_AMOUNT'] = r['T_NG_AMOUNT'] ?? (p + m);
          }
          if (!mounted) return;
          setState(() => _yearlyFcost = rows);
        }(),
        () async {
          final rows = await _callList('dailyDefectTrending', {
            'FROM_DATE': fromDefect,
            'TO_DATE': toEff,
            'codeArray': codeArrayEff,
            'CUST_NAME_KD': _custCtrl.text.trim(),
          });
          if (!mounted) return;
          setState(() => _dailyDefectTrending = rows);
        }(),
      ];

      await Future.wait(futures);
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Đã load INSPECT REPORT');
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Widget _ppmChart({required String title, required List<Map<String, dynamic>> data, required String xKey, required String xLabel}) {
    if (data.isEmpty) return const SizedBox.shrink();
    final pts = [...data].reversed.toList();
    String x(Map<String, dynamic> r) {
      final raw = _s(r[xKey]);
      if (xKey == 'INSPECT_DATE') return _ddMm(raw);
      return raw;
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                Expanded(child: Text(title, style: const TextStyle(fontWeight: FontWeight.w900))),
                TextButton(
                  onPressed: () => _exportAll(data, title.replaceAll(' ', '_')),
                  child: const Text('Export Excel'),
                ),
              ],
            ),
            SizedBox(
              height: 260,
              child: SfCartesianChart(
                enableAxisAnimation: false,
                tooltipBehavior: _tooltip(),
                legend: const Legend(isVisible: true, position: LegendPosition.top),
                primaryXAxis: CategoryAxis(
                  labelRotation: -45,
                  labelStyle: _axisLabelStyle,
                  title: AxisTitle(text: xLabel, textStyle: _axisTitleStyle),
                ),
                primaryYAxis: NumericAxis(
                  numberFormat: NumberFormat.compact(),
                  labelStyle: _axisLabelStyle,
                  title: const AxisTitle(text: 'PPM', textStyle: _axisTitleStyle),
                ),
                series: <CartesianSeries<Map<String, dynamic>, String>>[
                  StackedColumnSeries<Map<String, dynamic>, String>(
                    name: 'PROCESS_PPM',
                    animationDuration: 0,
                    dataSource: pts,
                    xValueMapper: (p, _) => x(p),
                    yValueMapper: (p, _) => _d(p['PROCESS_PPM']),
                    color: const Color(0xFF2563EB),
                    width: 0.6,
                  ),
                  StackedColumnSeries<Map<String, dynamic>, String>(
                    name: 'MATERIAL_PPM',
                    animationDuration: 0,
                    dataSource: pts,
                    xValueMapper: (p, _) => x(p),
                    yValueMapper: (p, _) => _d(p['MATERIAL_PPM']),
                    color: const Color(0xFFEF4444),
                    width: 0.6,
                  ),
                  LineSeries<Map<String, dynamic>, String>(
                    name: 'TOTAL_PPM',
                    animationDuration: 0,
                    dataSource: pts,
                    xValueMapper: (p, _) => x(p),
                    yValueMapper: (p, _) => _d(p['TOTAL_PPM']),
                    color: const Color(0xFF16A34A),
                    markerSettings: const MarkerSettings(isVisible: true, width: 4, height: 4),
                  ),
                  LineSeries<Map<String, dynamic>, String>(
                    name: 'KPI_VALUE',
                    animationDuration: 0,
                    dataSource: pts,
                    xValueMapper: (p, _) => x(p),
                    yValueMapper: (p, _) => _d(p['KPI_VALUE']),
                    color: const Color(0xFFF59E0B),
                    dashArray: const <double>[6, 4],
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

  Widget _simpleBarChart({required String title, required List<Map<String, dynamic>> data, required String xKey, required String yKey}) {
    if (data.isEmpty) return const SizedBox.shrink();
    final pts = [...data].reversed.toList();
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                Expanded(child: Text(title, style: const TextStyle(fontWeight: FontWeight.w900))),
                TextButton(
                  onPressed: () => _exportAll(data, title.replaceAll(' ', '_')),
                  child: const Text('Export Excel'),
                ),
              ],
            ),
            SizedBox(
              height: 300,
              child: SfCartesianChart(
                enableAxisAnimation: false,
                tooltipBehavior: _tooltip(),
                primaryXAxis: CategoryAxis(
                  labelRotation: 45,
                  labelStyle: _axisLabelStyle,
                  title: AxisTitle(text: xKey, textStyle: _axisTitleStyle),
                ),
                primaryYAxis: NumericAxis(
                  numberFormat: NumberFormat.compact(),
                  labelStyle: _axisLabelStyle,
                  title: AxisTitle(text: yKey, textStyle: _axisTitleStyle),
                ),
                series: <CartesianSeries<Map<String, dynamic>, String>>[
                  ColumnSeries<Map<String, dynamic>, String>(
                    animationDuration: 0,
                    dataSource: pts,
                    xValueMapper: (d, _) => _s(d[xKey]),
                    yValueMapper: (d, _) => _d(d[yKey]),
                    width: 0.6,
                    color: const Color(0xFF2563EB),
                    dataLabelSettings: const DataLabelSettings(isVisible: false),
                  ),
                ],
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
    _defectTrackball = _buildDefectTrackball();
    Future.microtask(_loadCodeList);
    Future.microtask(_loadErrTable);
    Future.microtask(_loadAll);
  }

  @override
  void dispose() {
    _custCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final selectedCodeLabel = _selectedCodes.isEmpty ? 'Chọn code' : 'Đã chọn ${_selectedCodes.length} code';
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
              const Expanded(child: Text('INSPECT REPORT', style: TextStyle(fontWeight: FontWeight.w900))),
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
          padding: const EdgeInsets.all(8),
          child: Wrap(
            spacing: 10,
            runSpacing: 8,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              OutlinedButton(onPressed: _loading ? null : () => _pickDate(isFrom: true), child: Text('Từ: ${_ymd(_fromDate)}')),
              OutlinedButton(onPressed: _loading ? null : () => _pickDate(isFrom: false), child: Text('Đến: ${_ymd(_toDate)}')),
              SizedBox(
                width: 220,
                child: TextField(
                  controller: _custCtrl,
                  decoration: const InputDecoration(labelText: 'Customer', border: OutlineInputBorder()),
                ),
              ),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Checkbox(
                    value: _df,
                    onChanged: _loading
                        ? null
                        : (v) {
                            setState(() {
                              _df = v ?? true;
                              if (_df) _selectedCodes = const [];
                            });
                          },
                  ),
                  const Text('Default (DF)'),
                ],
              ),
              OutlinedButton.icon(
                onPressed: _loading || _df
                    ? null
                    : () async {
                        if (_codeList.isEmpty) await _loadCodeList();
                        if (!mounted) return;
                        if (_codeList.isEmpty) {
                          _snack('Chưa có danh sách code');
                          return;
                        }
                        await _pickCodes();
                      },
                icon: const Icon(Icons.list_alt),
                label: Text(selectedCodeLabel),
              ),
              DropdownButton<String>(
                value: _ngType,
                style: TextStyle(color: scheme.onSurface, fontWeight: FontWeight.w700),
                dropdownColor: scheme.surface,
                iconEnabledColor: scheme.onSurface,
                items: const [
                  DropdownMenuItem(value: 'ALL', child: Text('NG_TYPE: ALL')),
                  DropdownMenuItem(value: 'P', child: Text('NG_TYPE: P')),
                  DropdownMenuItem(value: 'M', child: Text('NG_TYPE: M')),
                ],
                onChanged: _loading
                    ? null
                    : (v) {
                        if (v == null) return;
                        setState(() => _ngType = v);
                      },
              ),
              DropdownButton<String>(
                value: _worstBy,
                style: TextStyle(color: scheme.onSurface, fontWeight: FontWeight.w700),
                dropdownColor: scheme.surface,
                iconEnabledColor: scheme.onSurface,
                items: const [
                  DropdownMenuItem(value: 'AMOUNT', child: Text('Worst by: AMOUNT')),
                  DropdownMenuItem(value: 'QTY', child: Text('Worst by: QTY')),
                ],
                onChanged: _loading
                    ? null
                    : (v) {
                        if (v == null) return;
                        setState(() => _worstBy = v);
                      },
              ),
              FilledButton.icon(
                onPressed: _loading ? null : _loadAll,
                icon: const Icon(Icons.refresh),
                label: const Text('Load'),
              ),
            ],
          ),
        ),
      );
    }

    Widget worstTable() {
      if (_worstCols.isEmpty) return const SizedBox.shrink();
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                children: [
                  const Expanded(child: Text('Worst Table', style: TextStyle(fontWeight: FontWeight.w900))),
                  IconButton(
                    onPressed: () => _exportAll(_worst, 'inspection_worst'),
                    icon: const Icon(Icons.table_view),
                  ),
                ],
              ),
              SizedBox(
                height: 320,
                child: PlutoGrid(
                  columns: _worstCols,
                  rows: _worstRows,
                  onLoaded: (e) => e.stateManager.setShowColumnFilter(true),
                  configuration: _gridConfig(),
                ),
              ),
            ],
          ),
        ),
      );
    }

    Widget summaryTable() => _fcostSummaryWidgets();

    // Best-effort keys for charts that may vary depending on backend.
    String pickX(List<Map<String, dynamic>> data, List<String> cands, String fallback) {
      if (data.isEmpty) return fallback;

      bool hasAnyValue(String key) {
        for (final r in data) {
          final v = r[key];
          if (v == null) continue;
          final s = v.toString().trim();
          if (s.isNotEmpty && s.toLowerCase() != 'null') return true;
        }
        return false;
      }

      final keys = data.first.keys.toSet();
      for (final c in cands) {
        if (keys.contains(c) && hasAnyValue(c)) return c;
      }

      for (final c in cands) {
        if (hasAnyValue(c)) return c;
      }

      for (final k in keys) {
        if (hasAnyValue(k)) return k;
      }

      return fallback;
    }

    final wkKey = pickX(_weeklyPpm, ['INSPECT_YW', 'INSPECT_WEEK', 'YW'], 'INSPECT_YW');
    final monKey = pickX(_monthlyPpm, ['INSPECT_YM', 'INSPECT_MONTH', 'YM'], 'INSPECT_YM');
    final yrKey = pickX(_yearlyPpm, ['INSPECT_YEAR', 'YEAR'], 'INSPECT_YEAR');

    final dailyFcostX = pickX(_dailyFcost, ['INSPECT_DATE', 'DATE', 'DAY'], 'INSPECT_DATE');
    final weeklyFcostX = pickX(_weeklyFcost, ['INSPECT_YW', 'YW', 'WEEK', 'INSPECT_WEEK'], 'INSPECT_YW');
    final monthlyFcostX = pickX(_monthlyFcost, ['INSPECT_YM', 'YM', 'MONTH', 'INSPECT_MONTH'], 'INSPECT_YM');
    final yearlyFcostX = pickX(_yearlyFcost, ['INSPECT_YEAR', 'YEAR'], 'INSPECT_YEAR');

    Map<String, dynamic> firstOf(List<Map<String, dynamic>> data) => data.isNotEmpty ? data.first : <String, dynamic>{};
    final daily0 = firstOf(_dailyPpm);
    final weekly0 = firstOf(_weeklyPpm);
    final monthly0 = firstOf(_monthlyPpm);
    final yearlyLast = _yearlyPpm.isNotEmpty ? _yearlyPpm.last : <String, dynamic>{};

    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            header(),
            filter(),
            if (_loading) const LinearProgressIndicator(),
            const SizedBox(height: 4),
            const Text('1. OverView', style: TextStyle(fontWeight: FontWeight.w900)),
            const SizedBox(height: 8),
            _responsiveQuad(
              a: _overviewPpmCard(label: 'Yesterday NG', icon: Icons.today, accent: const Color(0xFF2563EB), row: daily0),
              b: _overviewPpmCard(label: 'This Week NG', icon: Icons.date_range, accent: const Color(0xFF16A34A), row: weekly0),
              c: _overviewPpmCard(label: 'This Month NG', icon: Icons.calendar_month, accent: const Color(0xFFF59E0B), row: monthly0),
              d: _overviewPpmCard(label: 'This Year NG', icon: Icons.event, accent: const Color(0xFFEF4444), row: yearlyLast),
            ),
            const SizedBox(height: 10),
            const Divider(height: 20),
            const Text('2. NG Trending', style: TextStyle(fontWeight: FontWeight.w900)),
            const SizedBox(height: 8),
            _responsivePair(
              a: _ppmChart(title: 'Daily NG Rate', data: _dailyPpm, xKey: 'INSPECT_DATE', xLabel: 'Ngày'),
              b: _ppmChart(title: 'Weekly NG Rate', data: _weeklyPpm, xKey: wkKey, xLabel: 'Tuần'),
            ),
            const SizedBox(height: 8),
            _responsivePair(
              a: _ppmChart(title: 'Monthly NG Rate', data: _monthlyPpm, xKey: monKey, xLabel: 'Tháng'),
              b: _ppmChart(title: 'Yearly NG Rate', data: _yearlyPpm, xKey: yrKey, xLabel: 'Năm'),
            ),
            const SizedBox(height: 10),
            const Text('2.5 Defects Trending', style: TextStyle(fontWeight: FontWeight.w900)),
            _defectTrendingChart(),
            const SizedBox(height: 10),
            const Text('3. F-COST Status', style: TextStyle(fontWeight: FontWeight.w900)),
            const SizedBox(height: 6),
            summaryTable(),
            const SizedBox(height: 6),
            const Text('F-Cost Trending', style: TextStyle(fontWeight: FontWeight.w900)),
            _fcostChart(title: 'Daily F-Cost', data: _dailyFcost, xKey: dailyFcostX, xLabel: 'Ngày'),
            _responsivePair(
              a: _fcostChart(title: 'Weekly F-Cost', data: _weeklyFcost, xKey: weeklyFcostX, xLabel: 'Tuần'),
              b: _fcostChart(title: 'Monthly F-Cost', data: _monthlyFcost, xKey: monthlyFcostX, xLabel: 'Tháng'),
            ),
            _fcostChart(title: 'Yearly F-Cost', data: _yearlyFcost, xKey: yearlyFcostX, xLabel: 'Năm'),
            _patrolHeaderTable(),
            const SizedBox(height: 10),
            const Text('F-Cost by Defect', style: TextStyle(fontWeight: FontWeight.w900)),
            _responsivePair(a: worstTable(), b: _worstTop5Chart()),
          ],
        ),
      ),
    );
  }
}
