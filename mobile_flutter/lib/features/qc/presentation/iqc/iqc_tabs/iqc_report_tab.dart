import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:syncfusion_flutter_charts/charts.dart';

import '../../../../../core/providers.dart';
import '../../../../../core/utils/excel_exporter.dart';

class IqcReportTab extends ConsumerStatefulWidget {
  const IqcReportTab({super.key});

  @override
  ConsumerState<IqcReportTab> createState() => _IqcReportTabState();
}

class _IqcReportTabState extends ConsumerState<IqcReportTab> {
  bool _loading = false;
  bool _showFilter = true;

  bool _df = true;
  DateTime _fromDate = DateTime.now().subtract(const Duration(days: 14));
  DateTime _toDate = DateTime.now();

  final TextEditingController _custCtrl = TextEditingController();

  List<Map<String, dynamic>> _codeList = const [];
  List<Map<String, dynamic>> _selectedCodes = const [];

  // Data
  List<Map<String, dynamic>> _daily = const [];
  List<Map<String, dynamic>> _weekly = const [];
  List<Map<String, dynamic>> _monthly = const [];
  List<Map<String, dynamic>> _yearly = const [];
  List<Map<String, dynamic>> _weeklyVendor = const [];
  List<Map<String, dynamic>> _monthlyVendor = const [];
  List<Map<String, dynamic>> _weeklyFailingTrending = const [];
  List<Map<String, dynamic>> _weeklyHoldingTrending = const [];
  List<Map<String, dynamic>> _failPending = const [];
  List<Map<String, dynamic>> _holdingPending = const [];

  String _worstBy = 'AMOUNT';
  String _ngType = 'ALL';

  String _s(dynamic v) => (v ?? '').toString();
  double _d(dynamic v) {
    final raw = (v ?? '').toString().trim();
    if (raw.isEmpty) return 0.0;
    final normalized = raw.replaceAll(',', '').replaceAll(RegExp(r'[^0-9\.-]'), '');
    if (normalized.isEmpty) return 0.0;
    return double.tryParse(normalized) ?? 0.0;
  }

  bool _isNg(Map<String, dynamic> body) => (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  Future<Map<String, dynamic>> _post(String command, Map<String, dynamic> data) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(command, data: data);
    final body = res.data;
    if (body is Map<String, dynamic>) return body;
    return <String, dynamic>{'tk_status': 'NG', 'message': 'Bad response'};
  }

  String _ymd(DateTime d) => '${d.year.toString().padLeft(4, '0')}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

  Future<void> _pickDate({required bool isFrom}) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: isFrom ? _fromDate : _toDate,
      firstDate: DateTime(2020, 1, 1),
      lastDate: DateTime(2100, 12, 31),
    );
    if (picked == null) return;
    setState(() {
      if (isFrom) {
        _fromDate = picked;
      } else {
        _toDate = picked;
      }
    });
  }

  Future<void> _loadCodeList() async {
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

  List<String> _selectedCodeNames() {
    return _selectedCodes.map((e) => _s(e['G_CODE']).trim()).where((e) => e.isNotEmpty).toList();
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
              if (idx >= 0) {
                selected.removeAt(idx);
              } else {
                selected.add(r);
              }
              setState2(() {});
            }

            final items = filtered();
            return SafeArea(
              child: Padding(
                padding: EdgeInsets.only(
                  left: 12,
                  right: 12,
                  top: 12,
                  bottom: 12 + MediaQuery.of(ctx).viewInsets.bottom,
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      children: [
                        const Expanded(child: Text('Chọn code', style: TextStyle(fontWeight: FontWeight.w900))),
                        TextButton(
                          onPressed: () {
                            selected.clear();
                            setState2(() {});
                          },
                          child: const Text('Clear'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: searchCtrl,
                      decoration: const InputDecoration(labelText: 'Tìm code', prefixIcon: Icon(Icons.search)),
                      onChanged: (_) => setState2(() {}),
                    ),
                    const SizedBox(height: 8),
                    Flexible(
                      child: ListView.builder(
                        shrinkWrap: true,
                        itemCount: items.length,
                        itemBuilder: (_, i) {
                          final r = items[i];
                          final sel = isSel(r);
                          return CheckboxListTile(
                            value: sel,
                            onChanged: (_) => toggle(r),
                            title: Text(_s(r['G_NAME_KD']).isEmpty ? _s(r['G_NAME']) : _s(r['G_NAME_KD'])),
                            subtitle: Text('${_s(r['G_CODE'])}  ${_s(r['G_NAME'])}'),
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(
                          child: FilledButton(
                            onPressed: () => Navigator.of(ctx).pop(selected),
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

  Future<void> _loadAll() async {
    final messenger = ScaffoldMessenger.of(context);

    setState(() {
      _loading = true;
      _showFilter = false;
      _daily = const [];
      _weekly = const [];
      _monthly = const [];
      _yearly = const [];
      _weeklyVendor = const [];
      _monthlyVendor = const [];
      _weeklyFailingTrending = const [];
      _weeklyHoldingTrending = const [];
      _failPending = const [];
      _holdingPending = const [];
    });

    try {
      final td = _ymd(DateTime.now());
      final frDaily = _ymd(DateTime.now().subtract(const Duration(days: 12)));
      final frWeekly = _ymd(DateTime.now().subtract(const Duration(days: 70)));
      final frMonthly = _ymd(DateTime.now().subtract(const Duration(days: 365)));
      final frYearly = _ymd(DateTime.now().subtract(const Duration(days: 3650)));

      final from = _ymd(_fromDate);
      final to = _ymd(_toDate);

      final codeArray = _df ? <String>[] : _selectedCodeNames();
      final cust = _custCtrl.text.trim();

      Future<List<Map<String, dynamic>>> fetchList(String cmd, Map<String, dynamic> data) async {
        final body = await _post(cmd, data);
        if (_isNg(body)) return const [];
        final raw = body['data'];
        final arr = raw is List ? raw : const [];
        return arr.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();
      }

      final futures = <Future<void>>[];

      futures.add(fetchList('dailyIncomingData', {
        'FACTORY': 'ALL',
        'FROM_DATE': _df ? frDaily : from,
        'TO_DATE': _df ? td : to,
        'codeArray': _df ? [] : codeArray,
        'CUST_NAME_KD': cust,
      }).then((rows) {
        for (final r in rows) {
          final ng = _d(r['NG_CNT']);
          final test = _d(r['TEST_CNT']);
          r['NG_RATE'] = test == 0 ? 0 : (ng / test);
          if (r['INSPECT_DATE'] != null) {
            r['INSPECT_DATE'] = _s(r['INSPECT_DATE']).substring(0, 10);
          }
        }
        _daily = rows;
      }));

      futures.add(fetchList('weeklyIncomingData', {
        'FACTORY': 'ALL',
        'FROM_DATE': _df ? frWeekly : from,
        'TO_DATE': _df ? td : to,
        'codeArray': _df ? [] : codeArray,
        'CUST_NAME_KD': cust,
      }).then((rows) {
        for (final r in rows) {
          final ng = _d(r['NG_CNT']);
          final test = _d(r['TEST_CNT']);
          r['NG_RATE'] = test == 0 ? 0 : (ng / test);
        }
        _weekly = rows;
      }));

      futures.add(fetchList('monthlyIncomingData', {
        'FACTORY': 'ALL',
        'FROM_DATE': _df ? frMonthly : from,
        'TO_DATE': _df ? td : to,
        'codeArray': _df ? [] : codeArray,
        'CUST_NAME_KD': cust,
      }).then((rows) {
        for (final r in rows) {
          final ng = _d(r['NG_CNT']);
          final test = _d(r['TEST_CNT']);
          r['NG_RATE'] = test == 0 ? 0 : (ng / test);
        }
        _monthly = rows;
      }));

      futures.add(fetchList('yearlyIncomingData', {
        'FACTORY': 'ALL',
        'FROM_DATE': _df ? frYearly : from,
        'TO_DATE': _df ? td : to,
        'codeArray': _df ? [] : codeArray,
        'CUST_NAME_KD': cust,
      }).then((rows) {
        for (final r in rows) {
          final ng = _d(r['NG_CNT']);
          final test = _d(r['TEST_CNT']);
          r['NG_RATE'] = test == 0 ? 0 : (ng / test);
        }
        _yearly = rows;
      }));

      futures.add(fetchList('vendorIncommingNGRatebyWeek', {
        'FROM_DATE': _df ? _ymd(DateTime.now().subtract(const Duration(days: 180))) : from,
        'TO_DATE': _df ? td : to,
        'codeArray': _df ? [] : codeArray,
        'CUST_NAME_KD': cust,
      }).then((rows) => _weeklyVendor = rows));

      futures.add(fetchList('vendorIncommingNGRatebyMonth', {
        'FROM_DATE': _df ? frMonthly : from,
        'TO_DATE': _df ? td : to,
        'codeArray': _df ? [] : codeArray,
        'CUST_NAME_KD': cust,
      }).then((rows) => _monthlyVendor = rows));

      futures.add(fetchList('iqcfailtrending', {
        'FROM_DATE': _df ? _ymd(DateTime.now().subtract(const Duration(days: 140))) : from,
        'TO_DATE': _df ? td : to,
        'codeArray': _df ? [] : codeArray,
        'CUST_NAME_KD': cust,
      }).then((rows) {
        for (final r in rows) {
          final closed = _d(r['CLOSED_QTY']);
          final total = _d(r['TOTAL_QTY']);
          r['COMPLETE_RATE'] = total == 0 ? 0 : (closed / total);
        }
        _weeklyFailingTrending = rows;
      }));

      futures.add(fetchList('iqcholdingtrending', {
        'FROM_DATE': _df ? frMonthly : from,
        'TO_DATE': _df ? td : to,
        'codeArray': _df ? [] : codeArray,
        'CUST_NAME_KD': cust,
      }).then((rows) {
        for (final r in rows) {
          final closed = _d(r['CLOSED_QTY']);
          final total = _d(r['TOTAL_QTY']);
          r['COMPLETE_RATE'] = total == 0 ? 0 : (closed / total);
        }
        _weeklyHoldingTrending = rows;
      }));

      futures.add(fetchList('iqcfailpending', {
        'FROM_DATE': _df ? frMonthly : from,
        'TO_DATE': _df ? td : to,
        'codeArray': _df ? [] : codeArray,
        'CUST_NAME_KD': cust,
      }).then((rows) => _failPending = rows));

      futures.add(fetchList('iqcholdingpending', {
        'FROM_DATE': _df ? frMonthly : from,
        'TO_DATE': _df ? td : to,
        'codeArray': _df ? [] : codeArray,
        'CUST_NAME_KD': cust,
      }).then((rows) => _holdingPending = rows));

      await Future.wait(futures);

      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(const SnackBar(content: Text('Đã load xong IQC REPORT')));
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  @override
  void initState() {
    super.initState();
    scheduleMicrotask(_loadCodeList);
    scheduleMicrotask(_loadAll);
  }

  @override
  void dispose() {
    _custCtrl.dispose();
    super.dispose();
  }

  TooltipBehavior _tooltip() => TooltipBehavior(enable: true);

  Widget _sectionTitle(String t) {
    final scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.fromLTRB(4, 10, 4, 6),
      child: Text(t, style: TextStyle(fontWeight: FontWeight.w900, color: scheme.primary)),
    );
  }

  Future<void> _exportAll(List<Map<String, dynamic>> rows, String name) async {
    await ExcelExporter.shareAsXlsx(fileName: '$name.xlsx', rows: rows);
  }

  Widget _overviewToday(Map<String, dynamic> row) => _overviewCard(
        title: 'TODAY',
        icon: Icons.today,
        accent: const Color(0xFF3B82F6),
        row: row,
      );
  Widget _overviewWeek(Map<String, dynamic> row) => _overviewCard(
        title: 'THIS WEEK',
        icon: Icons.calendar_view_week,
        accent: const Color(0xFF10B981),
        row: row,
      );
  Widget _overviewMonth(Map<String, dynamic> row) => _overviewCard(
        title: 'THIS MONTH',
        icon: Icons.calendar_view_month,
        accent: const Color(0xFFF59E0B),
        row: row,
      );
  Widget _overviewYear(Map<String, dynamic> row) => _overviewCard(
        title: 'THIS YEAR',
        icon: Icons.event,
        accent: const Color(0xFFEF4444),
        row: row,
      );

  Widget _overviewCard({
    required String title,
    required IconData icon,
    required Color accent,
    required Map<String, dynamic> row,
  }) {
    final scheme = Theme.of(context).colorScheme;
    final ok = _d(row['OK_CNT']);
    final pd = _d(row['PD_CNT']);
    final ng = _d(row['NG_CNT']);
    final rate = _d(row['NG_RATE']);
    final ratePct = rate * 100;

    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(14),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            accent.withValues(alpha: 0.18),
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
                Expanded(
                  child: Text(
                    title,
                    style: TextStyle(
                      fontWeight: FontWeight.w900,
                      color: scheme.onSurface,
                      letterSpacing: 0.2,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: accent.withValues(alpha: 0.14),
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Text(
                    '${ratePct.toStringAsFixed(1)}%',
                    style: TextStyle(fontWeight: FontWeight.w900, color: accent),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              'NG',
              style: TextStyle(color: scheme.onSurfaceVariant, fontWeight: FontWeight.w800),
            ),
            Text(
              NumberFormat.compact().format(ng),
              style: TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: scheme.onSurface),
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 12,
              runSpacing: 6,
              children: [
                _miniStat(label: 'OK', value: NumberFormat.compact().format(ok), color: const Color(0xFF16A34A)),
                _miniStat(label: 'PENDING', value: NumberFormat.compact().format(pd), color: const Color(0xFFF59E0B)),
                _miniStat(label: 'NG RATE', value: rate.toStringAsFixed(4), color: accent),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _miniStat({required String label, required String value, required Color color}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.85),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.22)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(label, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Colors.black.withValues(alpha: 0.65))),
          const SizedBox(height: 2),
          Text(value, style: TextStyle(fontWeight: FontWeight.w900, color: color)),
        ],
      ),
    );
  }

  Widget _responsivePair({required Widget a, required Widget b}) {
    return LayoutBuilder(
      builder: (ctx, c) {
        final narrow = c.maxWidth < 700;
        if (narrow) {
          return Column(
            children: [
              a,
              const SizedBox(height: 8),
              b,
            ],
          );
        }
        return Row(
          children: [
            Expanded(child: a),
            const SizedBox(width: 8),
            Expanded(child: b),
          ],
        );
      },
    );
  }

  Widget _responsiveQuad({required Widget a, required Widget b, required Widget c, required Widget d}) {
    return LayoutBuilder(
      builder: (ctx, cons) {
        final narrow = cons.maxWidth < 900;
        if (narrow) {
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
        }

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
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final selectedCodeLabel = _selectedCodes.isEmpty ? 'Chọn code' : 'Đã chọn ${_selectedCodes.length} code';

    Widget filterHeader = Card(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        child: Row(
          children: [
            IconButton(
              tooltip: _showFilter ? 'Ẩn filter' : 'Hiện filter',
              onPressed: _loading ? null : () => setState(() => _showFilter = !_showFilter),
              icon: Icon(_showFilter ? Icons.filter_alt_off : Icons.filter_alt),
            ),
            const Expanded(child: Text('IQC REPORT', style: TextStyle(fontWeight: FontWeight.w900))),
          ],
        ),
      ),
    );

    Widget filterCard = !_showFilter
        ? const SizedBox.shrink()
        : Card(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Wrap(
                spacing: 12,
                runSpacing: 8,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: [
                  OutlinedButton(onPressed: _loading ? null : () => _pickDate(isFrom: true), child: Text('Từ: ${_ymd(_fromDate)}')),
                  OutlinedButton(onPressed: _loading ? null : () => _pickDate(isFrom: false), child: Text('Đến: ${_ymd(_toDate)}')),
                  DropdownButton<String>(
                    value: _worstBy,
                    items: const [
                      DropdownMenuItem(value: 'QTY', child: Text('Worst by: QTY')),
                      DropdownMenuItem(value: 'AMOUNT', child: Text('Worst by: AMOUNT')),
                    ],
                    onChanged: _loading ? null : (v) => setState(() => _worstBy = v ?? 'AMOUNT'),
                  ),
                  DropdownButton<String>(
                    value: _ngType,
                    items: const [
                      DropdownMenuItem(value: 'ALL', child: Text('NG TYPE: ALL')),
                      DropdownMenuItem(value: 'P', child: Text('NG TYPE: PROCESS')),
                      DropdownMenuItem(value: 'M', child: Text('NG TYPE: MATERIAL')),
                    ],
                    onChanged: _loading ? null : (v) => setState(() => _ngType = v ?? 'ALL'),
                  ),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Checkbox(value: _df, onChanged: _loading ? null : (v) => setState(() => _df = v ?? true)),
                      const Text('DF'),
                    ],
                  ),
                  SizedBox(width: 180, child: TextField(controller: _custCtrl, decoration: const InputDecoration(labelText: 'Khách (CUST_NAME_KD)'))),
                  OutlinedButton.icon(
                    onPressed: _loading ? null : (_codeList.isEmpty ? null : _pickCodes),
                    icon: const Icon(Icons.list_alt),
                    label: Text(selectedCodeLabel),
                  ),
                  FilledButton.icon(onPressed: _loading ? null : _loadAll, icon: const Icon(Icons.refresh), label: const Text('Load')),
                ],
              ),
            ),
          );

    Widget overviewSection() {
      Map<String, dynamic> lastOf(List<Map<String, dynamic>> data) => data.isNotEmpty ? data.last : <String, dynamic>{};
      final d = lastOf(_daily);
      final w = lastOf(_weekly);
      final m = lastOf(_monthly);
      final y = lastOf(_yearly);
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text('1. OverView', style: TextStyle(fontWeight: FontWeight.w900)),
              const SizedBox(height: 8),
              _responsiveQuad(
                a: _overviewToday(d),
                b: _overviewWeek(w),
                c: _overviewMonth(m),
                d: _overviewYear(y),
              ),
            ],
          ),
        ),
      );
    }

    Widget ngTrendingChart({
      required String title,
      required List<Map<String, dynamic>> data,
      required String xKey,
      required String xLabel,
      bool reverse = false,
    }) {
      if (data.isEmpty) return const SizedBox.shrink();

      String x(Map<String, dynamic> r) {
        final v = _s(r[xKey]);
        if (v.isNotEmpty) return v;
        // fallback
        return _s(r.values.isNotEmpty ? r.values.first : '');
      }

      final pts = reverse ? [...data].reversed.toList() : data;
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(12),
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
                  tooltipBehavior: _tooltip(),
                  legend: const Legend(isVisible: true, position: LegendPosition.top),
                  primaryXAxis: CategoryAxis(labelRotation: -45, title: AxisTitle(text: xLabel)),
                  primaryYAxis: NumericAxis(numberFormat: NumberFormat.compact(), title: AxisTitle(text: 'LOT QTY')),
                  axes: <ChartAxis>[
                    NumericAxis(
                      name: 'rate',
                      opposedPosition: true,
                      numberFormat: NumberFormat.compact(),
                      title: AxisTitle(text: 'NG Rate (%)'),
                      axisLabelFormatter: (v) => ChartAxisLabel('${v.value.toStringAsFixed(0)}%', v.textStyle),
                    ),
                  ],
                  series: <CartesianSeries<Map<String, dynamic>, String>>[
                    StackedColumnSeries<Map<String, dynamic>, String>(
                      name: 'OK_CNT',
                      dataSource: pts,
                      xValueMapper: (p, _) => x(p),
                      yValueMapper: (p, _) => _d(p['OK_CNT']),
                      color: const Color(0xFF53EB34),
                    ),
                    StackedColumnSeries<Map<String, dynamic>, String>(
                      name: 'NG_CNT',
                      dataSource: pts,
                      xValueMapper: (p, _) => x(p),
                      yValueMapper: (p, _) => _d(p['NG_CNT']),
                      color: const Color(0xFFFF0000),
                    ),
                    StackedColumnSeries<Map<String, dynamic>, String>(
                      name: 'PD_CNT',
                      dataSource: pts,
                      xValueMapper: (p, _) => x(p),
                      yValueMapper: (p, _) => _d(p['PD_CNT']),
                      color: const Color(0xFFFFD700),
                    ),
                    LineSeries<Map<String, dynamic>, String>(
                      name: 'NG_RATE',
                      dataSource: pts,
                      xValueMapper: (p, _) => x(p),
                      yValueMapper: (p, _) => _d(p['NG_RATE']) * 100,
                      yAxisName: 'rate',
                      color: Colors.green,
                      markerSettings: const MarkerSettings(isVisible: true),
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

    List<Map<String, dynamic>> pivotVendor(List<Map<String, dynamic>> data, String timeKey) {
      final keys = data.map((e) => _s(e[timeKey])).where((e) => e.isNotEmpty).toSet().toList()..sort();
      final vendors = data.map((e) => _s(e['CUST_NAME_KD']).trim()).where((e) => e.isNotEmpty).toSet().toList();
      return keys.map((k) {
        final m = <String, dynamic>{timeKey: k};
        for (final v in vendors) {
          final found = data.where((e) => _s(e[timeKey]) == k && _s(e['CUST_NAME_KD']).trim() == v).toList();
          if (found.isNotEmpty) {
            m[v] = _d(found.first['NG_RATE']) * 100;
          }
        }
        return m;
      }).toList();
    }

    Widget vendorChart({required String title, required List<Map<String, dynamic>> data, required String timeKey, required String timeLabel}) {
      if (data.isEmpty) return const SizedBox.shrink();

      final pivot = pivotVendor([...data].reversed.toList(), timeKey);
      if (pivot.isEmpty) return const SizedBox.shrink();
      final vendors = <String>{};
      for (final r in pivot) {
        for (final k in r.keys) {
          if (k != timeKey) vendors.add(k);
        }
      }
      final vendorList = vendors.toList();
      final colors = <Color>[
        Colors.blue,
        Colors.red,
        Colors.green,
        Colors.orange,
        Colors.purple,
        Colors.teal,
        Colors.brown,
        Colors.indigo,
      ];

      return Card(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                children: [
                  Expanded(child: Text(title, style: const TextStyle(fontWeight: FontWeight.w900))),
                  IconButton(onPressed: () => _exportAll(data, title.replaceAll(' ', '_')), icon: const Icon(Icons.table_view)),
                ],
              ),
              SizedBox(
                height: 260,
                child: SfCartesianChart(
                  tooltipBehavior: _tooltip(),
                  legend: const Legend(isVisible: true, position: LegendPosition.top),
                  primaryXAxis: CategoryAxis(labelRotation: -45, title: AxisTitle(text: timeLabel)),
                  primaryYAxis: NumericAxis(
                    numberFormat: NumberFormat.compact(),
                    title: const AxisTitle(text: 'NG Rate (%)'),
                    axisLabelFormatter: (v) => ChartAxisLabel('${v.value.toStringAsFixed(0)}%', v.textStyle),
                  ),
                  series: <CartesianSeries<Map<String, dynamic>, String>>[
                    for (var i = 0; i < vendorList.length; i++)
                      LineSeries<Map<String, dynamic>, String>(
                        name: vendorList[i],
                        dataSource: pivot,
                        xValueMapper: (p, _) => _s(p[timeKey]),
                        yValueMapper: (p, _) => _d(p[vendorList[i]]),
                        color: colors[i % colors.length],
                        markerSettings: const MarkerSettings(isVisible: true),
                      ),
                  ],
                ),
              ),
            ],
          ),
        ),
      );
    }

    Widget failHoldTrending({required String title, required List<Map<String, dynamic>> data, required String xKey}) {
      if (data.isEmpty) return const SizedBox.shrink();

      String x(Map<String, dynamic> r) => _s(r[xKey]);

      return Card(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                children: [
                  Expanded(child: Text(title, style: const TextStyle(fontWeight: FontWeight.w900))),
                  IconButton(onPressed: () => _exportAll(data, title.replaceAll(' ', '_')), icon: const Icon(Icons.table_view)),
                ],
              ),
              SizedBox(
                height: 260,
                child: SfCartesianChart(
                  tooltipBehavior: _tooltip(),
                  legend: const Legend(isVisible: true, position: LegendPosition.top),
                  primaryXAxis: CategoryAxis(labelRotation: -45),
                  primaryYAxis: NumericAxis(numberFormat: NumberFormat.compact(), title: const AxisTitle(text: 'MET QTY')),
                  axes: <ChartAxis>[
                    NumericAxis(
                      name: 'rate',
                      opposedPosition: true,
                      numberFormat: NumberFormat.compact(),
                      title: const AxisTitle(text: 'COMPLETE RATE (%)'),
                      axisLabelFormatter: (v) => ChartAxisLabel('${v.value.toStringAsFixed(0)}%', v.textStyle),
                    ),
                  ],
                  series: <CartesianSeries<Map<String, dynamic>, String>>[
                    StackedColumnSeries<Map<String, dynamic>, String>(
                      name: 'CLOSED_QTY',
                      dataSource: data,
                      xValueMapper: (p, _) => x(p),
                      yValueMapper: (p, _) => _d(p['CLOSED_QTY']),
                      color: const Color(0xFF8B89FC),
                    ),
                    StackedColumnSeries<Map<String, dynamic>, String>(
                      name: 'PENDING_QTY',
                      dataSource: data,
                      xValueMapper: (p, _) => x(p),
                      yValueMapper: (p, _) => _d(p['PENDING_QTY']),
                      color: const Color(0xFFFFD700),
                    ),
                    LineSeries<Map<String, dynamic>, String>(
                      name: 'COMPLETE_RATE(%)',
                      dataSource: data,
                      xValueMapper: (p, _) => x(p),
                      yValueMapper: (p, _) => _d(p['COMPLETE_RATE']) * 100,
                      yAxisName: 'rate',
                      color: Colors.green,
                      markerSettings: const MarkerSettings(isVisible: true),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      );
    }

    Widget pendingPie({required String title, required List<Map<String, dynamic>> data}) {
      if (data.isEmpty) return const SizedBox.shrink();
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                children: [
                  Expanded(child: Text(title, style: const TextStyle(fontWeight: FontWeight.w900))),
                  IconButton(onPressed: () => _exportAll(data, title.replaceAll(' ', '_')), icon: const Icon(Icons.table_view)),
                ],
              ),
              SizedBox(
                height: 320,
                child: SfCircularChart(
                  tooltipBehavior: TooltipBehavior(enable: true),
                  legend: const Legend(isVisible: true, position: LegendPosition.top, overflowMode: LegendItemOverflowMode.wrap),
                  series: <CircularSeries<Map<String, dynamic>, String>>[
                    PieSeries<Map<String, dynamic>, String>(
                      dataSource: data,
                      xValueMapper: (p, _) => _s(p['CUST_NAME_KD']),
                      yValueMapper: (p, _) => _d(p['FAIL_QTY']),
                      dataLabelMapper: (p, _) => '${_s(p['CUST_NAME_KD'])}: (${_s(p['FAIL_QTY'])} m)',
                      dataLabelSettings: const DataLabelSettings(isVisible: true, labelPosition: ChartDataLabelPosition.outside),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      );
    }

    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            filterHeader,
            filterCard,
            if (_loading) const LinearProgressIndicator(),

            overviewSection(),

            _sectionTitle('2. IQC NG Trending'),
            _responsivePair(
              a: ngTrendingChart(title: 'Daily NG Rate', data: _daily, xKey: 'INSPECT_DATE', xLabel: 'Ngày'),
              b: ngTrendingChart(title: 'Weekly NG Rate', data: _weekly, xKey: 'INSPECT_YW', xLabel: 'Tuần'),
            ),
            const SizedBox(height: 8),
            _responsivePair(
              a: ngTrendingChart(title: 'Monthly NG Rate', data: _monthly, xKey: 'INSPECT_YM', xLabel: 'Tháng'),
              b: ngTrendingChart(title: 'Yearly NG Rate', data: _yearly, xKey: 'INSPECT_YEAR', xLabel: 'Năm', reverse: true),
            ),

            _sectionTitle('2.5 Vendor Weekly Incoming Defects Trending'),
            vendorChart(title: 'Vendor Weekly Incoming Defects Trending', data: _weeklyVendor, timeKey: 'INSPECT_YW', timeLabel: 'Tuần'),
            _sectionTitle('2.6 Vendor Monthly Incoming Defects Trending'),
            vendorChart(title: 'Vendor Monthly Incoming Defects Trending', data: _monthlyVendor, timeKey: 'INSPECT_YM', timeLabel: 'Tháng'),

            _sectionTitle('3. IQC Fail Holding Trending'),
            _responsivePair(
              a: failHoldTrending(title: 'Weekly Failing (PROCESS)', data: _weeklyFailingTrending, xKey: 'FAIL_YW'),
              b: failHoldTrending(title: 'Weekly Holding (INCOMING)', data: _weeklyHoldingTrending, xKey: 'FAIL_YW'),
            ),

            _sectionTitle('IQC Failing Pending'),
            _responsivePair(
              a: pendingPie(title: 'Weekly Failing (PROCESS)', data: _failPending),
              b: pendingPie(title: 'Weekly Holding (INCOMING)', data: _holdingPending),
            ),
          ],
        ),
      ),
    );
  }
}
