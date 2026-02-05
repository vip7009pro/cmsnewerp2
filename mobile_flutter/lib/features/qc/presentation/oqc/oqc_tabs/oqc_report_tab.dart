import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:syncfusion_flutter_charts/charts.dart';

import '../../../../../core/config/app_config.dart';
import '../../../../../core/providers.dart';
import '../../../../../core/utils/excel_exporter.dart';

class OqcReportTab extends ConsumerStatefulWidget {
  const OqcReportTab({super.key});

  @override
  ConsumerState<OqcReportTab> createState() => _OqcReportTabState();
}

class _OqcReportTabState extends ConsumerState<OqcReportTab> {
  bool _loading = false;
  bool _showFilter = true;

  ScaffoldMessengerState? _messenger;

  static const _axisLabelStyle = TextStyle(fontSize: 10, fontWeight: FontWeight.w700);
  static const _axisTitleStyle = TextStyle(fontSize: 11, fontWeight: FontWeight.w900);

  bool _df = true;
  DateTime _fromDate = DateTime.now().subtract(const Duration(days: 14));
  DateTime _toDate = DateTime.now();
  final TextEditingController _custCtrl = TextEditingController();

  String _ngType = 'ALL';

  List<Map<String, dynamic>> _codeList = const [];
  List<Map<String, dynamic>> _selectedCodes = const [];

  // OQC trending
  List<Map<String, dynamic>> _daily = const [];
  List<Map<String, dynamic>> _weekly = const [];
  List<Map<String, dynamic>> _monthly = const [];
  List<Map<String, dynamic>> _yearly = const [];

  // NG breakdown
  List<Map<String, dynamic>> _ngByCustomer = const [];
  List<Map<String, dynamic>> _ngByProdType = const [];

  // Inspection (CMS only)
  List<Map<String, dynamic>> _inspDaily = const [];
  List<Map<String, dynamic>> _inspWeekly = const [];
  List<Map<String, dynamic>> _inspMonthly = const [];
  List<Map<String, dynamic>> _inspYearly = const [];

  String _s(dynamic v) => (v ?? '').toString();

  double _d(dynamic v) {
    final raw = (v ?? '').toString().trim();
    if (raw.isEmpty) return 0.0;
    final normalized = raw.replaceAll(',', '').replaceAll(RegExp(r'[^0-9\.-]'), '');
    if (normalized.isEmpty) return 0.0;
    return double.tryParse(normalized) ?? 0.0;
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

  TooltipBehavior _tooltip() => TooltipBehavior(enable: true, animationDuration: 0);

  String _pickKey(List<Map<String, dynamic>> data, List<String> candidates, String fallback) {
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

    // Prefer candidate keys that are present AND have at least one non-empty value.
    final keys = data.first.keys.toSet();
    for (final c in candidates) {
      if (keys.contains(c) && hasAnyValue(c)) return c;
    }

    // If row[0] doesn't include the right key, still try candidates by value scan.
    for (final c in candidates) {
      if (hasAnyValue(c)) return c;
    }

    // Last resort: pick the first key that has values.
    for (final k in keys) {
      if (hasAnyValue(k)) return k;
    }

    return fallback;
  }

  Future<Map<String, dynamic>> _post(String command, Map<String, dynamic> data) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(command, data: data);
    final body = res.data;
    if (body is Map<String, dynamic>) return body;
    return <String, dynamic>{'tk_status': 'NG', 'message': 'Bad response'};
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
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () => Navigator.of(ctx2).pop(current),
                            child: const Text('Hủy'),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: FilledButton(
                            onPressed: () => Navigator.of(ctx2).pop(selected),
                            child: Text('Chọn (${selected.length})'),
                          ),
                        ),
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

  Future<List<Map<String, dynamic>>> _callList(String cmd, Map<String, dynamic> payload) async {
    final body = await _post(cmd, payload);
    if (_isNg(body)) return const [];
    final raw = body['data'];
    final data = raw is List ? raw : const [];
    return data.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();
  }

  Future<void> _loadAll() async {
    if (!mounted) return;
    setState(() {
      _loading = true;
      _showFilter = false;
      _daily = const [];
      _weekly = const [];
      _monthly = const [];
      _yearly = const [];
      _ngByCustomer = const [];
      _ngByProdType = const [];
      _inspDaily = const [];
      _inspWeekly = const [];
      _inspMonthly = const [];
      _inspYearly = const [];
    });

    final td = DateTime.now();
    final dfDaily = DateTime.now().subtract(const Duration(days: 12));
    final dfWeekly = DateTime.now().subtract(const Duration(days: 70));
    final dfMonthly = DateTime.now().subtract(const Duration(days: 365));
    final dfYearly = DateTime.now().subtract(const Duration(days: 3650));

    final from = _ymd(_fromDate);
    final to = _ymd(_toDate);
    final cust = _custCtrl.text.trim();
    final listCode = _df ? <String>[] : _selectedCodeNames();

    final fromDaily = _df ? _ymd(dfDaily) : from;
    final fromWeekly = _df ? _ymd(dfWeekly) : from;
    final fromMonthly = _df ? _ymd(dfMonthly) : from;
    final fromYearly = _df ? _ymd(dfYearly) : from;
    final toEff = _df ? _ymd(td) : to;
    final codeArrayEff = _df ? <String>[] : listCode;

    try {
      final futures = <Future<void>>[
        () async {
          final rows = await _callList('dailyOQCTrendingData', {
            'FACTORY': 'ALL',
            'FROM_DATE': fromDaily,
            'TO_DATE': toEff,
            'codeArray': codeArrayEff,
            'CUST_NAME_KD': cust,
          });
          for (final r in rows) {
            final total = _d(r['TOTAL_LOT']);
            final ng = _d(r['NG_LOT']);
            r['OK_LOT'] = r['OK_LOT'] ?? (total - ng);
            // Web converts to NG_RATE percent
            if (total > 0) r['NG_RATE'] = (ng * 100) / total;
            if (r['DELIVERY_DATE'] != null) {
              r['DELIVERY_DATE'] = _s(r['DELIVERY_DATE']).split('T').first;
            }
          }
          if (!mounted) return;
          setState(() => _daily = rows);
        }(),
        () async {
          final rows = await _callList('weeklyOQCTrendingData', {
            'FACTORY': 'ALL',
            'FROM_DATE': fromWeekly,
            'TO_DATE': toEff,
            'codeArray': codeArrayEff,
            'CUST_NAME_KD': cust,
          });
          for (final r in rows) {
            final total = _d(r['TOTAL_LOT']);
            final ng = _d(r['NG_LOT']);
            r['OK_LOT'] = r['OK_LOT'] ?? (total - ng);
            if (total > 0) r['NG_RATE'] = (ng * 100) / total;
          }
          if (!mounted) return;
          setState(() => _weekly = rows);
        }(),
        () async {
          final rows = await _callList('monthlyOQCTrendingData', {
            'FACTORY': 'ALL',
            'FROM_DATE': fromMonthly,
            'TO_DATE': toEff,
            'codeArray': codeArrayEff,
            'CUST_NAME_KD': cust,
          });
          for (final r in rows) {
            final total = _d(r['TOTAL_LOT']);
            final ng = _d(r['NG_LOT']);
            r['OK_LOT'] = r['OK_LOT'] ?? (total - ng);
            if (total > 0) r['NG_RATE'] = (ng * 100) / total;
          }
          if (!mounted) return;
          setState(() => _monthly = rows);
        }(),
        () async {
          final rows = await _callList('yearlyOQCTrendingData', {
            'FACTORY': 'ALL',
            'FROM_DATE': fromYearly,
            'TO_DATE': toEff,
            'codeArray': codeArrayEff,
            'CUST_NAME_KD': cust,
          });
          for (final r in rows) {
            final total = _d(r['TOTAL_LOT']);
            final ng = _d(r['NG_LOT']);
            r['OK_LOT'] = r['OK_LOT'] ?? (total - ng);
            if (total > 0) r['NG_RATE'] = (ng * 100) / total;
          }
          if (!mounted) return;
          setState(() => _yearly = rows);
        }(),
        () async {
          final rows = await _callList('ngbyCustomerOQC', {
            'FACTORY': 'ALL',
            'FROM_DATE': fromDaily,
            'TO_DATE': toEff,
            'codeArray': codeArrayEff,
            'CUST_NAME_KD': cust,
          });
          if (!mounted) return;
          setState(() => _ngByCustomer = rows);
        }(),
        () async {
          final rows = await _callList('ngbyProTypeOQC', {
            'FACTORY': 'ALL',
            'FROM_DATE': fromDaily,
            'TO_DATE': toEff,
            'codeArray': codeArrayEff,
            'CUST_NAME_KD': cust,
          });
          if (!mounted) return;
          setState(() => _ngByProdType = rows);
        }(),
      ];

      if (AppConfig.company == 'CMS') {
        futures.addAll([
          () async {
            final rows = await _callList('inspect_daily_ppm_oqc', {
              'FACTORY': 'ALL',
              'FROM_DATE': fromDaily,
              'TO_DATE': toEff,
              'codeArray': codeArrayEff,
              'CUST_NAME_KD': cust,
              'NG_TYPE': _ngType,
            });
            for (final r in rows) {
              // normalize date
              if (r['INSPECT_DATE'] != null) r['INSPECT_DATE'] = _s(r['INSPECT_DATE']).split('T').first;
              // match web: TOTAL_PPM depends on NG_TYPE
              if (_ngType == 'P') {
                r['TOTAL_PPM'] = r['PROCESS_PPM'];
                r['MATERIAL_PPM'] = 0;
              } else if (_ngType == 'M') {
                r['TOTAL_PPM'] = r['MATERIAL_PPM'];
                r['PROCESS_PPM'] = 0;
              }
            }
            if (!mounted) return;
            setState(() => _inspDaily = rows);
          }(),
          () async {
            final rows = await _callList('inspect_weekly_ppm_oqc', {
              'FACTORY': 'ALL',
              'FROM_DATE': fromWeekly,
              'TO_DATE': toEff,
              'codeArray': codeArrayEff,
              'CUST_NAME_KD': cust,
              'NG_TYPE': _ngType,
            });
            for (final r in rows) {
              if (_ngType == 'P') {
                r['TOTAL_PPM'] = r['PROCESS_PPM'];
                r['MATERIAL_PPM'] = 0;
              } else if (_ngType == 'M') {
                r['TOTAL_PPM'] = r['MATERIAL_PPM'];
                r['PROCESS_PPM'] = 0;
              }
            }
            if (!mounted) return;
            setState(() => _inspWeekly = rows);
          }(),
          () async {
            final rows = await _callList('inspect_monthly_ppm_oqc', {
              'FACTORY': 'ALL',
              'FROM_DATE': fromMonthly,
              'TO_DATE': toEff,
              'codeArray': codeArrayEff,
              'CUST_NAME_KD': cust,
              'NG_TYPE': _ngType,
            });
            for (final r in rows) {
              if (_ngType == 'P') {
                r['TOTAL_PPM'] = r['PROCESS_PPM'];
                r['MATERIAL_PPM'] = 0;
              } else if (_ngType == 'M') {
                r['TOTAL_PPM'] = r['MATERIAL_PPM'];
                r['PROCESS_PPM'] = 0;
              }
            }
            if (!mounted) return;
            setState(() => _inspMonthly = rows);
          }(),
          () async {
            final rows = await _callList('inspect_yearly_ppm_oqc', {
              'FACTORY': 'ALL',
              'FROM_DATE': fromYearly,
              'TO_DATE': toEff,
              'codeArray': codeArrayEff,
              'CUST_NAME_KD': cust,
              'NG_TYPE': _ngType,
            });
            for (final r in rows) {
              if (_ngType == 'P') {
                r['TOTAL_PPM'] = r['PROCESS_PPM'];
                r['MATERIAL_PPM'] = 0;
              } else if (_ngType == 'M') {
                r['TOTAL_PPM'] = r['MATERIAL_PPM'];
                r['PROCESS_PPM'] = 0;
              }
            }
            if (!mounted) return;
            setState(() => _inspYearly = rows);
          }(),
        ]);
      }

      await Future.wait(futures);
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Đã load OQC REPORT');
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Widget _overviewCard({required String title, required IconData icon, required Color accent, required Map<String, dynamic> row}) {
    final rate = _d(row['NG_RATE']);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Row(
          children: [
            Container(
              width: 34,
              height: 34,
              decoration: BoxDecoration(color: accent.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(10)),
              child: Icon(icon, color: accent, size: 18),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.w900)),
                  const SizedBox(height: 2),
                  Text('${rate.toStringAsFixed(2)}%', style: TextStyle(fontWeight: FontWeight.w900, color: accent)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _ppmChart({
    required String title,
    required List<Map<String, dynamic>> data,
    required String xKey,
    required String xLabel,
    bool reverse = true,
  }) {
    if (data.isEmpty) return const SizedBox.shrink();

    final pts = reverse ? [...data].reversed.toList() : data;

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
                IconButton(
                  onPressed: () => _exportAll(data, title.replaceAll(' ', '_')),
                  icon: const Icon(Icons.table_view),
                  tooltip: 'Export Excel',
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

  Widget _responsivePair({required Widget a, required Widget b}) {
    return LayoutBuilder(
      builder: (ctx, cst) {
        final w = cst.maxWidth;
        if (w >= 900) {
          return Row(
            crossAxisAlignment: CrossAxisAlignment.start,
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

  Widget _sectionTitle(String t) {
    final scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.fromLTRB(4, 10, 4, 6),
      child: Text(t, style: TextStyle(fontWeight: FontWeight.w900, color: scheme.primary)),
    );
  }

  Widget _trendChart({
    required String title,
    required List<Map<String, dynamic>> data,
    required String xKey,
    required String xLabel,
    bool reverse = true,
  }) {
    if (data.isEmpty) return const SizedBox.shrink();

    final pts = reverse ? [...data].reversed.toList() : data;
    String x(Map<String, dynamic> r) {
      final raw = _s(r[xKey]);
      if (xKey == 'DELIVERY_DATE') return _ddMm(raw);
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
                IconButton(
                  onPressed: () => _exportAll(data, title.replaceAll(' ', '_')),
                  icon: const Icon(Icons.table_view),
                  tooltip: 'Export Excel',
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
                  title: const AxisTitle(text: 'LOT', textStyle: _axisTitleStyle),
                ),
                axes: <ChartAxis>[
                  NumericAxis(
                    name: 'rate',
                    opposedPosition: true,
                    labelStyle: _axisLabelStyle,
                    title: const AxisTitle(text: 'NG Rate (%)', textStyle: _axisTitleStyle),
                    axisLabelFormatter: (v) => ChartAxisLabel('${v.value.toStringAsFixed(0)}%', v.textStyle),
                  ),
                ],
                series: <CartesianSeries<Map<String, dynamic>, String>>[
                  StackedColumnSeries<Map<String, dynamic>, String>(
                    name: 'OK_LOT',
                    animationDuration: 0,
                    dataSource: pts,
                    xValueMapper: (p, _) => x(p),
                    yValueMapper: (p, _) => _d(p['OK_LOT']),
                    color: const Color(0xFF53EB34),
                  ),
                  StackedColumnSeries<Map<String, dynamic>, String>(
                    name: 'NG_LOT',
                    animationDuration: 0,
                    dataSource: pts,
                    xValueMapper: (p, _) => x(p),
                    yValueMapper: (p, _) => _d(p['NG_LOT']),
                    color: const Color(0xFFFF0000),
                  ),
                  LineSeries<Map<String, dynamic>, String>(
                    name: 'NG_RATE(%)',
                    animationDuration: 0,
                    dataSource: pts,
                    xValueMapper: (p, _) => x(p),
                    yValueMapper: (p, _) => _d(p['NG_RATE']),
                    yAxisName: 'rate',
                    color: Colors.green,
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

  Widget _simpleNgBreakdownChart({required String title, required List<Map<String, dynamic>> data, required String xKey}) {
    if (data.isEmpty) return const SizedBox.shrink();

    // Try common keys
    String pickYKey() {
      const candidates = <String>['NG_RATE', 'NG_PPM', 'NG_QTY', 'NG_LOT', 'TOTAL_PPM'];
      for (final c in candidates) {
        if (data.first.keys.contains(c)) return c;
      }
      // fallback: first numeric-like key
      for (final k in data.first.keys) {
        if (k == xKey) continue;
        if (_d(data.first[k]) != 0) return k;
      }
      return 'NG_RATE';
    }

    final yKey = pickYKey();
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
                IconButton(
                  onPressed: () => _exportAll(data, title.replaceAll(' ', '_')),
                  icon: const Icon(Icons.table_view),
                  tooltip: 'Export Excel',
                ),
              ],
            ),
            SizedBox(
              height: 320,
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
    Future.microtask(_loadCodeList);
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

    Widget header() {
      return Card(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
          child: Row(
            children: [
              IconButton(
                tooltip: _showFilter ? 'Ẩn filter' : 'Hiện filter',
                onPressed: _loading ? null : () => setState(() => _showFilter = !_showFilter),
                icon: Icon(_showFilter ? Icons.filter_alt_off : Icons.filter_alt),
              ),
              const Expanded(child: Text('OQC REPORT', style: TextStyle(fontWeight: FontWeight.w900))),
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
                onPressed: _loading || _df ? null : (_codeList.isEmpty ? null : _pickCodes),
                icon: const Icon(Icons.list_alt),
                label: Text(selectedCodeLabel),
              ),
              if (AppConfig.company == 'CMS')
                DropdownButton<String>(
                  value: _ngType,
                  style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w700),
                  dropdownColor: Theme.of(context).colorScheme.surface,
                  iconEnabledColor: Theme.of(context).colorScheme.onSurface,
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

    Map<String, dynamic> firstOf(List<Map<String, dynamic>> data) => data.isNotEmpty ? data.first : <String, dynamic>{};

    final today = firstOf(_daily);
    final week = firstOf(_weekly);
    final month = firstOf(_monthly);
    final year = firstOf(_yearly);

    Widget overviewSection = Card(
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text('1. OverView', style: TextStyle(fontWeight: FontWeight.w900)),
            const SizedBox(height: 8),
            _responsiveQuad(
              a: _overviewCard(title: 'TODAY NG', icon: Icons.today, accent: const Color(0xFF3B82F6), row: today),
              b: _overviewCard(title: 'THIS WEEK NG', icon: Icons.calendar_view_week, accent: const Color(0xFF10B981), row: week),
              c: _overviewCard(title: 'THIS MONTH NG', icon: Icons.calendar_view_month, accent: const Color(0xFFF59E0B), row: month),
              d: _overviewCard(title: 'THIS YEAR NG', icon: Icons.event, accent: const Color(0xFFEF4444), row: year),
            ),
          ],
        ),
      ),
    );

    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            header(),
            filter(),
            if (_loading) const LinearProgressIndicator(),
            overviewSection,
            _sectionTitle('2. OQC NG Trending'),
            _responsivePair(
              a: _trendChart(title: 'Daily NG Rate', data: _daily, xKey: 'DELIVERY_DATE', xLabel: 'Ngày', reverse: true),
              b: _trendChart(title: 'Weekly NG Rate', data: _weekly, xKey: 'DELIVERY_WEEK', xLabel: 'Tuần', reverse: true),
            ),
            const SizedBox(height: 8),
            _responsivePair(
              a: _trendChart(title: 'Monthly NG Rate', data: _monthly, xKey: 'DELIVERY_MONTH', xLabel: 'Tháng', reverse: true),
              b: _trendChart(title: 'Yearly NG Rate', data: _yearly, xKey: 'DELIVERY_YEAR', xLabel: 'Năm', reverse: true),
            ),
            _sectionTitle('2.5 NG by Customer and Prod Type'),
            _responsivePair(
              a: _simpleNgBreakdownChart(title: 'NG By Customer', data: _ngByCustomer, xKey: _ngByCustomer.isNotEmpty ? _ngByCustomer.first.keys.first : 'CUST_NAME_KD'),
              b: _simpleNgBreakdownChart(title: 'NG By Prod Type', data: _ngByProdType, xKey: _ngByProdType.isNotEmpty ? _ngByProdType.first.keys.first : 'PROD_TYPE'),
            ),
            if (AppConfig.company == 'CMS') ...[
              _sectionTitle('3. Inspection PPM (CMS)'),
              // Note: Inspection charts are PPM unit (not %) and use different dataset keys.
              // We pick the best matching X key based on returned data.
              Builder(
                builder: (_) {
                  final wkKey = _pickKey(_inspWeekly, ['INSPECT_YW', 'INSPECT_WEEK', 'INSPECT_W', 'YW'], 'INSPECT_YW');
                  final monKey = _pickKey(_inspMonthly, ['INSPECT_YM', 'INSPECT_MONTH', 'INSPECT_M', 'YM'], 'INSPECT_YM');
                  final yrKey = _pickKey(_inspYearly, ['INSPECT_YEAR', 'INSPECT_Y', 'YEAR'], 'INSPECT_YEAR');
                  return Column(
                    children: [
                      _responsivePair(
                        a: _ppmChart(title: 'Inspection Daily (PPM)', data: _inspDaily, xKey: 'INSPECT_DATE', xLabel: 'Ngày', reverse: true),
                        b: _ppmChart(title: 'Inspection Weekly (PPM)', data: _inspWeekly, xKey: wkKey, xLabel: 'Tuần', reverse: true),
                      ),
                      const SizedBox(height: 8),
                      _responsivePair(
                        a: _ppmChart(title: 'Inspection Monthly (PPM)', data: _inspMonthly, xKey: monKey, xLabel: 'Tháng', reverse: true),
                        b: _ppmChart(title: 'Inspection Yearly (PPM)', data: _inspYearly, xKey: yrKey, xLabel: 'Năm', reverse: true),
                      ),
                    ],
                  );
                },
              ),
            ],
          ],
        ),
      ),
    );
  }
}
