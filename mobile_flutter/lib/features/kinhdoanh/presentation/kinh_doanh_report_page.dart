import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:pluto_grid/pluto_grid.dart';
import 'package:syncfusion_flutter_charts/charts.dart';

import '../../../app/app_drawer.dart';
import '../../../core/config/app_config.dart';
import '../../../core/providers.dart';
import '../../../core/utils/excel_exporter.dart';

class KinhDoanhReportPage extends ConsumerStatefulWidget {
  const KinhDoanhReportPage({super.key});

  @override
  ConsumerState<KinhDoanhReportPage> createState() => _KinhDoanhReportPageState();
}

class _KinhDoanhReportPageState extends ConsumerState<KinhDoanhReportPage> {
  bool _loading = false;
  bool _showFilters = true;

  bool _df = true;
  bool _inNhanh = false;

  DateTime _fromDate = DateTime.now().subtract(const Duration(days: 12));
  DateTime _toDate = DateTime.now();

  // Data
  List<Map<String, dynamic>> _dailyClosingWidget = const [];
  List<Map<String, dynamic>> _weeklyClosingWidget = const [];
  List<Map<String, dynamic>> _monthlyClosingWidget = const [];
  List<Map<String, dynamic>> _yearlyClosingWidget = const [];

  List<Map<String, dynamic>> _customerRevenue = const [];
  List<Map<String, dynamic>> _picRevenue = const [];

  List<Map<String, dynamic>> _poOverWeek = const [];
  List<Map<String, dynamic>> _runningPoBalance = const [];

  List<Map<String, dynamic>> _dailyOverdue = const [];
  List<Map<String, dynamic>> _weeklyOverdue = const [];
  List<Map<String, dynamic>> _monthlyOverdue = const [];
  List<Map<String, dynamic>> _yearlyOverdue = const [];

  List<Map<String, dynamic>> _poBalanceSummaryByYear = const [];
  List<Map<String, dynamic>> _poBalanceDetail = const [];
  List<Map<String, dynamic>> _poBalanceCustomerByYear = const [];
  List<Map<String, dynamic>> _customerWeeklyPoQty = const [];

  List<Map<String, dynamic>> _poBalanceCustomer = const [];
  List<Map<String, dynamic>> _customerPoBalanceByType = const [];
  String _selectedYW = '';

  Map<String, dynamic> _poBalanceSummaryTotal = const {};
  Map<String, dynamic> _fcstAmount = const {};
  List<Map<String, dynamic>> _samsungFcst = const [];

  // A light cache of global settings used for currency/dplus.
  List<Map<String, dynamic>> _globalSetting = const [];

  String _s(dynamic v) => (v ?? '').toString();
  double _d(dynamic v) {
    final raw = (v ?? '').toString().trim();
    if (raw.isEmpty) return 0.0;
    final normalized = raw.replaceAll(',', '').replaceAll(RegExp(r'[^0-9\.-]'), '');
    if (normalized.isEmpty) return 0.0;
    return double.tryParse(normalized) ?? 0.0;
  }

  dynamic _mapAny(Map<String, dynamic> m, List<String> keys) {
    for (final k in keys) {
      if (m.containsKey(k)) return m[k];
    }
    if (m.isEmpty) return null;
    final lower = <String, dynamic>{};
    for (final e in m.entries) {
      lower[e.key.toLowerCase()] = e.value;
    }
    for (final k in keys) {
      final v = lower[k.toLowerCase()];
      if (v != null) return v;
    }
    return null;
  }

  double _dMap(Map<String, dynamic> m, List<String> keys) => _d(_mapAny(m, keys));
  String _sMap(Map<String, dynamic> m, List<String> keys) => _s(_mapAny(m, keys));

  String _ymd(DateTime d) => '${d.year.toString().padLeft(4, '0')}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

  TooltipBehavior _tooltip() => TooltipBehavior(enable: true, animationDuration: 300);

  Future<void> _exportExcel(List<Map<String, dynamic>> rows, String name) async {
    await ExcelExporter.shareAsXlsx(fileName: '$name.xlsx', rows: rows);
  }

  int _isoWeekNumber(DateTime date) {
    // ISO week date algorithm (week starts Monday).
    final d = DateTime(date.year, date.month, date.day);
    final thursday = d.add(Duration(days: 4 - (d.weekday == DateTime.sunday ? 7 : d.weekday)));
    final firstThursday = DateTime(thursday.year, 1, 4);
    final firstThursdayAdjusted =
        firstThursday.add(Duration(days: 4 - (firstThursday.weekday == DateTime.sunday ? 7 : firstThursday.weekday)));
    final diffDays = thursday.difference(firstThursdayAdjusted).inDays;
    return 1 + (diffDays ~/ 7);
  }

  Widget _summaryCard({
    required String label,
    required num qty,
    required num amount,
    required Color topColor,
    required Color botColor,
    required num percent,
  }) {
    final scheme = Theme.of(context).colorScheme;
    final pctColor = percent >= 0 ? Colors.green : scheme.error;
    return Card(
      elevation: 2,
      shadowColor: Colors.black.withValues(alpha: 0.10),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(14),
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [topColor, botColor],
          ),
          border: Border.all(color: scheme.outlineVariant.withValues(alpha: 0.6)),
        ),
        padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    label,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(color: scheme.onSurface, fontSize: 13, fontWeight: FontWeight.w900),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.55),
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Text(
                    '${percent.toStringAsFixed(1)} %',
                    style: TextStyle(color: pctColor, fontSize: 12, fontWeight: FontWeight.w900),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              'QTY: ${NumberFormat.decimalPattern().format(qty)} EA',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(color: scheme.onSurface, fontSize: 13, fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 6),
            Text(
              'AMT: ${_fmtMoney(amount)}',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(color: scheme.onSurface, fontSize: 14, fontWeight: FontWeight.w900),
            ),
          ],
        ),
      ),
    );
  }

  Widget _poBalanceInfoCard() {
    final scheme = Theme.of(context).colorScheme;
    final qty = _dMap(_poBalanceSummaryTotal, ['po_balance_qty', 'PO_BALANCE_QTY', 'POBALANCEQTY', 'PO_QTY', 'QTY']);
    final amt = _dMap(_poBalanceSummaryTotal, ['po_balance_amount', 'PO_BALANCE_AMOUNT', 'POBALANCEAMOUNT', 'PO_AMOUNT', 'AMOUNT', 'AMT']);
    return Card(
      elevation: 2,
      shadowColor: Colors.black.withValues(alpha: 0.08),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: scheme.outlineVariant.withValues(alpha: 0.6)),
        ),
        padding: const EdgeInsets.fromLTRB(12, 12, 12, 12),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 6,
              height: 44,
              decoration: BoxDecoration(
                color: const Color(0xFF99CCFF),
                borderRadius: BorderRadius.circular(6),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'PO BALANCE INFOMATION',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(color: scheme.onSurfaceVariant, fontSize: 12, fontWeight: FontWeight.w800),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'QTY: ${NumberFormat.decimalPattern().format(qty)}',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(color: scheme.onSurface, fontSize: 15, fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'AMT: ${_fmtMoney(amt)}',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(color: scheme.onSurface, fontSize: 15, fontWeight: FontWeight.w900),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<Map<String, dynamic>> _post(String command, Map<String, dynamic> data) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(command, data: data);
    final body = res.data;
    if (body is Map<String, dynamic>) return body;
    return <String, dynamic>{'tk_status': 'NG', 'message': 'Bad response'};
  }

  Future<List<Map<String, dynamic>>> _fetchSamsungFcst() async {
    // Web logic in ChartFCSTSamSung.tsx.
    final base = DateTime.now().add(const Duration(days: 1));
    var fcstweek2 = _isoWeekNumber(base);
    var fcstyear2 = base.year;
    var fcstweek1 = fcstweek2 - 1;
    var fcstyear1 = fcstyear2;

    try {
      final body = await _post('checklastfcstweekno', {'FCSTWEEKNO': fcstyear2});
      if (!_isNg(body)) {
        final data = body['data'];
        if (data is List && data.isNotEmpty && data.first is Map) {
          final wk = int.tryParse(_s((data.first as Map)['FCSTWEEKNO']));
          if (wk != null) fcstweek2 = wk;
        }
      }
    } catch (_) {
      // ignore
    }

    if (fcstweek2 == 1) {
      fcstweek1 = 52;
      fcstyear1 = fcstyear2 - 1;
    } else if (fcstweek2 == 0) {
      fcstweek2 = 1;
      fcstweek1 = 52;
      fcstyear1 = fcstyear2 - 1;
    } else {
      fcstweek1 = fcstweek2 - 1;
    }

    final rows = await _loadList('baocaofcstss', {
      'FCSTYEAR1': fcstyear1,
      'FCSTYEAR2': fcstyear2,
      'FCSTWEEKNUM1': fcstweek1,
      'FCSTWEEKNUM2': fcstweek2,
    });

    final mapped = <Map<String, dynamic>>[];
    for (var i = 0; i < rows.length; i++) {
      final it = Map<String, dynamic>.from(rows[i]);
      final w = fcstweek2 + i;
      final label = w > 52
          ? 'W${(w - 52 - 1 == 0 ? 52 : 1)}_W${(w - 52)}'
          : 'W${(w - 1)}_W$w';
      it['WEEKNO'] = label;
      mapped.add(it);
    }

    return mapped.take(15).toList();
  }

  bool _isNg(Map<String, dynamic> body) => (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _loadAll());
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

  int _dPlus() {
    // Web reads KD_DPLUS from getGlobalSetting(); fallback 6.
    for (final it in _globalSetting) {
      if (_s(it['ITEM_NAME']) == 'KD_DPLUS') {
        final v = int.tryParse(_s(it['CURRENT_VALUE']));
        if (v != null) return v;
      }
    }
    return 6;
  }

  String _currency() {
    for (final it in _globalSetting) {
      if (_s(it['ITEM_NAME']) == 'CURRENCY') {
        final v = _s(it['CURRENT_VALUE']).trim();
        if (v.isNotEmpty) return v;
      }
    }
    return 'USD';
  }

  int _currencyDigits() {
    // web: CMS uses digit=0 for many charts.
    return AppConfig.company == 'CMS' ? 0 : 2;
  }

  NumberFormat _nfMoney() {
    final cur = _currency().toUpperCase();
    if (cur == 'USD') {
      return NumberFormat.currency(locale: 'en_US', symbol: r'$', decimalDigits: _currencyDigits());
    }
    return NumberFormat.currency(locale: 'vi_VN', symbol: 'đ', decimalDigits: 0);
  }

  String _fmtMoney(num v) => _nfMoney().format(v);
  String _fmtCompact(num v) {
    final abs = v.abs();
    if (abs >= 1000000000) return '${(v / 1000000000).toStringAsFixed(2)}B';
    if (abs >= 1000000) return '${(v / 1000000).toStringAsFixed(2)}M';
    if (abs >= 1000) return '${(v / 1000).toStringAsFixed(2)}K';
    return v.toStringAsFixed(0);
  }

  String _fmtDDMMFromIso(String s) {
    // expects YYYY-MM-DD or ISO-ish; fallback to original.
    final dt = DateTime.tryParse(s);
    if (dt == null) return s;
    return DateFormat('dd/MM').format(dt);
  }

  List<Map<String, dynamic>> _withFormattedDate(List<Map<String, dynamic>> rows, String srcKey, String dstKey) {
    if (rows.isEmpty) return const [];
    return rows
        .map((e) {
          final m = Map<String, dynamic>.from(e);
          m[dstKey] = _fmtDDMMFromIso(_s(m[srcKey]));
          return m;
        })
        .toList();
  }

  Future<List<Map<String, dynamic>>> _loadList(String cmd, Map<String, dynamic> payload) async {
    final body = await _post(cmd, payload);
    if (_isNg(body)) return const [];
    final data = body['data'];
    final list = (data is List ? data : const [])
        .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
        .toList();
    return list;
  }

  Future<Map<String, dynamic>> _loadMap(String cmd, Map<String, dynamic> payload) async {
    final body = await _post(cmd, payload);
    if (_isNg(body)) return const {};
    final data = body['data'];
    if (data is List && data.isNotEmpty && data.first is Map) {
      return Map<String, dynamic>.from(data.first as Map);
    }
    if (data is Map) return Map<String, dynamic>.from(data);
    return const {};
  }

  Future<Map<String, dynamic>> _loadFcstAmount() async {
    final now = DateTime.now();
    var fcstWeek = _isoWeekNumber(now.add(const Duration(days: 1)));
    final fcstYear = now.year;

    try {
      final chk = await _loadList('checklastfcstweekno', {
        'FCSTWEEKNO': fcstYear,
      });
      if (chk.isNotEmpty) {
        final w = int.tryParse(_s(chk.first['FCSTWEEKNO']));
        if (w != null && w > 0) fcstWeek = w;
      }
    } catch (_) {}

    Future<Map<String, dynamic>> load(int year, int week) async {
      return _loadMap('fcstamount', {
        'FCSTYEAR': year,
        'FCSTWEEKNO': week,
      });
    }

    var res = await load(fcstYear, fcstWeek);
    if (res.isNotEmpty) return res;

    final prevWeek = fcstWeek - 1;
    final prevYear = prevWeek <= 0 ? fcstYear - 1 : fcstYear;
    final prevWeekFixed = prevWeek <= 0 ? 52 : prevWeek;
    res = await load(prevYear, prevWeekFixed);
    return res;
  }

  Future<void> _loadPoBalanceDrillYear(int poYear) async {
    final detail = await _loadList('pobalanceYearByWeekDetail', {'PO_YEAR': poYear});
    final cust = await _loadList('poBalanceByYearWeekCustomerByYear', {'PO_YEAR': poYear});
    if (!mounted) return;
    setState(() {
      _selectedYW = 'Y$poYear';
      _poBalanceDetail = detail;
      _poBalanceCustomerByYear = cust;
      _poBalanceCustomer = const [];
    });
  }

  Future<void> _loadPoBalanceDrillWeek(int poYear, int poWeek) async {
    final cust = await _loadList('poBalanceByYearWeekCustomer', {'PO_YEAR': poYear, 'PO_WEEK': poWeek});
    if (!mounted) return;
    setState(() {
      _selectedYW = 'Y$poYear-W$poWeek';
      _poBalanceCustomer = cust;
    });
  }

  Future<void> _loadAll() async {
    setState(() => _loading = true);

    try {
      // Load global setting (if endpoint exists in mobile backend). If it fails, keep default values.
      try {
        final gs = await _loadList('getGlobalSetting', {});
        _globalSetting = gs;
      } catch (_) {}

      final now = DateTime.now();
      final start = _df ? _ymd(now.subtract(const Duration(days: 12))) : _ymd(_fromDate);
      final end = _df ? _ymd(now) : _ymd(_toDate);

      final startWeek = _df ? _ymd(now.subtract(const Duration(days: 56))) : _ymd(_fromDate);
      final endWeek = _df ? _ymd(now.add(const Duration(days: 1))) : _ymd(_toDate);

      final startMonth = _df ? _ymd(DateTime(now.year, now.month, 1).subtract(const Duration(days: 365))) : _ymd(_fromDate);
      final endMonth = _df ? _ymd(DateTime(now.year, now.month + 1, 0)) : _ymd(_toDate);

      final startYear = _df ? '2020-01-01' : _ymd(_fromDate);
      final endYear = _df ? _ymd(DateTime(now.year, 12, 31)) : _ymd(_toDate);

      final futures = <Future<void>>[];

      Future<void> setList(Future<List<Map<String, dynamic>>> fut, void Function(List<Map<String, dynamic>>) assign) async {
        final v = await fut;
        assign(v);
      }

      futures.add(setList(_loadList('kd_dailyclosing', {
        'START_DATE': start,
        'END_DATE': end,
        'IN_NHANH': _inNhanh,
      }), (v) => _dailyClosingWidget = v));

      futures.add(setList(_loadList('kd_weeklyclosing', {
        'START_DATE': startWeek,
        'END_DATE': endWeek,
        'IN_NHANH': _inNhanh,
      }), (v) => _weeklyClosingWidget = v.reversed.toList()));

      futures.add(setList(_loadList('kd_monthlyclosing', {
        'START_DATE': startMonth,
        'END_DATE': endMonth,
        'IN_NHANH': _inNhanh,
      }), (v) => _monthlyClosingWidget = v.reversed.toList()));

      futures.add(setList(_loadList('kd_annuallyclosing', {
        'START_DATE': startYear,
        'END_DATE': endYear,
        'IN_NHANH': _inNhanh,
      }), (v) => _yearlyClosingWidget = v));

      futures.add(setList(_loadList('customerRevenue', {
        'START_DATE': start,
        'END_DATE': end,
        'IN_NHANH': _inNhanh,
      }), (v) => _customerRevenue = v));

      futures.add(setList(_loadList('PICRevenue', {
        'START_DATE': start,
        'END_DATE': end,
        'IN_NHANH': _inNhanh,
      }), (v) => _picRevenue = v));

      futures.add(setList(_loadList('kd_pooverweek', {
        'FROM_DATE': _df ? _ymd(now.subtract(const Duration(days: 70))) : _ymd(_fromDate),
        'TO_DATE': end,
        'IN_NHANH': _inNhanh,
      }), (v) => _poOverWeek = v.reversed.toList()));

      futures.add(setList(_loadList('kd_runningpobalance', {
        'TO_DATE': end,
      }), (v) => _runningPoBalance = (_df ? (v.take(10).toList().reversed.toList()) : v.reversed.toList())));

      futures.add(Future<void>(() async {
        _poBalanceSummaryTotal = await _loadMap('traPOSummaryTotal', {
          'TO_DATE': end,
          'IN_NHANH': _inNhanh,
        });
      }));

      futures.add(Future<void>(() async {
        _fcstAmount = await _loadFcstAmount();
      }));

      futures.add(setList(_fetchSamsungFcst(), (v) => _samsungFcst = v));

      futures.add(setList(_loadList('dailyoverduedata', {
        'START_DATE': start,
        'END_DATE': end,
        'D_PLUS': _dPlus(),
      }), (v) => _dailyOverdue = v));

      futures.add(setList(_loadList('weeklyoverduedata', {
        'START_DATE': _df ? _ymd(now.subtract(const Duration(days: 70))) : _ymd(_fromDate),
        'END_DATE': end,
        'D_PLUS': _dPlus(),
      }), (v) => _weeklyOverdue = v));

      futures.add(setList(_loadList('monthlyoverduedata', {
        'START_DATE': _df ? _ymd(now.subtract(const Duration(days: 365))) : _ymd(_fromDate),
        'END_DATE': end,
        'D_PLUS': _dPlus(),
      }), (v) => _monthlyOverdue = v));

      futures.add(setList(_loadList('yearlyoverduedata', {
        'START_DATE': _df ? _ymd(now.subtract(const Duration(days: 3650))) : _ymd(_fromDate),
        'END_DATE': end,
        'D_PLUS': _dPlus(),
      }), (v) => _yearlyOverdue = v));

      futures.add(setList(_loadList('pobalanceByYear', {
        'FROM_DATE': _df ? _ymd(now.subtract(const Duration(days: 70))) : _ymd(_fromDate),
        'TO_DATE': end,
        'IN_NHANH': _inNhanh,
      }), (v) => _poBalanceSummaryByYear = v));

      futures.add(setList(_loadList('pobalanceYearByWeekDetail', {
        'FROM_DATE': _df ? _ymd(now.subtract(const Duration(days: 70))) : _ymd(_fromDate),
        'TO_DATE': end,
        'IN_NHANH': _inNhanh,
      }), (v) => _poBalanceDetail = v));

      futures.add(setList(_loadList('poBalanceByYearWeekCustomerByYear', {
        'FROM_DATE': _df ? _ymd(now.subtract(const Duration(days: 70))) : _ymd(_fromDate),
        'TO_DATE': end,
        'IN_NHANH': _inNhanh,
      }), (v) => _poBalanceCustomerByYear = v));

      futures.add(setList(_loadList('loadCustomerWeeklyPOQty', {
        'FROM_DATE': _df ? _ymd(now.subtract(const Duration(days: 70))) : _ymd(_fromDate),
        'TO_DATE': end,
        'IN_NHANH': _inNhanh,
      }), (v) => _customerWeeklyPoQty = v.reversed.toList()));

      futures.add(setList(_loadList('customerpobalancebyprodtype_new', const {}), (v) => _customerPoBalanceByType = v));

      await Future.wait(futures);

      if (!mounted) return;
      setState(() => _loading = false);
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi load report: $e');
    }
  }

  Widget _sectionTitle(String title, {String? subtitle}) {
    final scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.fromLTRB(2, 10, 2, 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900)),
          if (subtitle != null)
            Text(subtitle, style: TextStyle(color: scheme.onSurfaceVariant, fontSize: 12)),
        ],
      ),
    );
  }

  Widget _kpiCard({required String label, required String value, required Color color}) {
    final scheme = Theme.of(context).colorScheme;
    return Card(
      elevation: 2,
      shadowColor: Colors.black.withValues(alpha: 0.08),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: scheme.outlineVariant.withValues(alpha: 0.6)),
        ),
        padding: const EdgeInsets.fromLTRB(12, 12, 12, 12),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 6,
              height: 44,
              decoration: BoxDecoration(
                color: color,
                borderRadius: BorderRadius.circular(6),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(color: scheme.onSurfaceVariant, fontSize: 12, fontWeight: FontWeight.w800),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    value,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(color: scheme.onSurface, fontSize: 18, fontWeight: FontWeight.w900),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _widgetRow() {
    return LayoutBuilder(
      builder: (ctx, c) {
        final w = c.maxWidth;
        final cross = w >= 1100
            ? 4
            : w >= 900
                ? 3
                : w >= 650
                    ? 2
                    : 1;

        Map<String, dynamic> safeAt(List<Map<String, dynamic>> rows, int idxFromEnd) {
          final i = rows.length - idxFromEnd;
          if (i < 0 || i >= rows.length) return const {};
          return rows[i];
        }

        final yd = safeAt(_dailyClosingWidget, 2);
        final ydPrev = safeAt(_dailyClosingWidget, 3);
        final wk = safeAt(_weeklyClosingWidget, 1);
        final wkPrev = safeAt(_weeklyClosingWidget, 2);
        final mo = safeAt(_monthlyClosingWidget, 1);
        final moPrev = safeAt(_monthlyClosingWidget, 2);
        final yr = safeAt(_yearlyClosingWidget, 1);
        final yrPrev = safeAt(_yearlyClosingWidget, 2);

        num pct(num cur, num prev) {
          if (prev == 0) return 0;
          return (cur / prev - 1) * 100;
        }

        final ydAmt = _d(yd['DELIVERED_AMOUNT']);
        final ydQty = _d(yd['DELIVERY_QTY']);
        final ydPct = pct(ydAmt, _d(ydPrev['DELIVERED_AMOUNT']));

        final wkAmt = _d(wk['DELIVERED_AMOUNT']);
        final wkQty = _d(wk['DELIVERY_QTY']);
        final wkPct = pct(wkAmt, _d(wkPrev['DELIVERED_AMOUNT']));

        final moAmt = _d(mo['DELIVERED_AMOUNT']);
        final moQty = _d(mo['DELIVERY_QTY']);
        final moPct = pct(moAmt, _d(moPrev['DELIVERED_AMOUNT']));

        final yrAmt = _d(yr['DELIVERED_AMOUNT']);
        final yrQty = _d(yr['DELIVERY_QTY']);
        final yrPct = pct(yrAmt, _d(yrPrev['DELIVERED_AMOUNT']));

        return GridView.count(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: cross,
          crossAxisSpacing: 10,
          mainAxisSpacing: 10,
          childAspectRatio: 2.6,
          children: [
            _summaryCard(
              label: 'Yesterday',
              qty: ydQty,
              amount: ydAmt,
              percent: ydPct,
              topColor: const Color(0xFFB3C6FF),
              botColor: const Color(0xFFB3ECFF),
            ),
            _summaryCard(
              label: 'This week',
              qty: wkQty,
              amount: wkAmt,
              percent: wkPct,
              topColor: const Color(0xFFCCFFCC),
              botColor: const Color(0xFF80FF80),
            ),
            _summaryCard(
              label: 'This month',
              qty: moQty,
              amount: moAmt,
              percent: moPct,
              topColor: const Color(0xFFFFF2E6),
              botColor: const Color(0xFFFFBF80),
            ),
            _summaryCard(
              label: 'This year',
              qty: yrQty,
              amount: yrAmt,
              percent: yrPct,
              topColor: const Color(0xFFFFE6E6),
              botColor: const Color(0xFFFFB3B3),
            ),
          ],
        );
      },
    );
  }

  Widget _comboChart(
    String title,
    List<Map<String, dynamic>> data, {
    required String xKey,
    String? qtyKey,
    String? amountKey,
    String? kpiKey,
    Color amountColor = const Color(0xFF52AAF1),
    Color qtyColor = Colors.green,
    Color kpiColor = Colors.red,
    String xLabel = '',
    String leftLabel = '',
    String rightLabel = '',
    bool rightAxisMoney = true,
  }) {
    if (data.isEmpty) return const SizedBox.shrink();
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(child: Text(title, style: const TextStyle(fontWeight: FontWeight.w900))),
                IconButton(
                  onPressed: () => _exportExcel(data, title.replaceAll(' ', '_')),
                  icon: const Icon(Icons.table_view),
                  tooltip: 'Export Excel',
                ),
              ],
            ),
            const SizedBox(height: 10),
            SizedBox(
              height: 300,
              child: SfCartesianChart(
                key: ValueKey<String>('combo_$title'),
                enableAxisAnimation: true,
                legend: const Legend(isVisible: true, position: LegendPosition.top, toggleSeriesVisibility: false),
                tooltipBehavior: _tooltip(),
                primaryXAxis: CategoryAxis(
                  title: AxisTitle(text: xLabel),
                ),
                primaryYAxis: NumericAxis(
                  title: AxisTitle(text: leftLabel),
                  numberFormat: NumberFormat.compact(),
                ),
                axes: <ChartAxis>[
                  NumericAxis(
                    name: 'right',
                    opposedPosition: true,
                    title: AxisTitle(text: rightLabel),
                    numberFormat: rightAxisMoney ? _nfMoney() : NumberFormat.compact(),
                  ),
                ],
                series: <CartesianSeries<Map<String, dynamic>, String>>[
                  if (amountKey != null)
                    ColumnSeries<Map<String, dynamic>, String>(
                      name: amountKey,
                      color: amountColor,
                      yAxisName: 'right',
                      animationDuration: 800,
                      dataSource: data,
                      xValueMapper: (d, _) => _s(d[xKey]),
                      yValueMapper: (d, _) => _d(d[amountKey]),
                      dataLabelSettings: DataLabelSettings(
                        isVisible: true,
                        labelAlignment: ChartDataLabelAlignment.top,
                        textStyle: const TextStyle(fontSize: 10, fontWeight: FontWeight.w800),
                        builder: (dynamic data, dynamic point, dynamic series, int pointIndex, int seriesIndex) {
                          final v = _d((data as Map<String, dynamic>)[amountKey]);
                          return Text(_fmtCompact(v), style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w800));
                        },
                      ),
                    ),
                  if (qtyKey != null)
                    LineSeries<Map<String, dynamic>, String>(
                      name: qtyKey,
                      color: qtyColor,
                      animationDuration: 800,
                      dataSource: data,
                      xValueMapper: (d, _) => _s(d[xKey]),
                      yValueMapper: (d, _) => _d(d[qtyKey]),
                      markerSettings: const MarkerSettings(isVisible: true, width: 5, height: 5),
                      dataLabelSettings: const DataLabelSettings(isVisible: false),
                    ),
                  if (kpiKey != null)
                    LineSeries<Map<String, dynamic>, String>(
                      name: kpiKey,
                      color: kpiColor,
                      yAxisName: 'right',
                      animationDuration: 800,
                      dataSource: data,
                      xValueMapper: (d, _) => _s(d[xKey]),
                      yValueMapper: (d, _) => _d(d[kpiKey]),
                      markerSettings: const MarkerSettings(isVisible: false),
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

  Widget _pieChart(String title, List<Map<String, dynamic>> data, {required String labelKey, required String valueKey}) {
    if (data.isEmpty) return const SizedBox.shrink();
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(child: Text(title, style: const TextStyle(fontWeight: FontWeight.w900))),
                IconButton(
                  onPressed: () => _exportExcel(data, title.replaceAll(' ', '_')),
                  icon: const Icon(Icons.table_view),
                  tooltip: 'Export Excel',
                ),
              ],
            ),
            const SizedBox(height: 10),
            SizedBox(
              height: 340,
              child: SfCircularChart(
                key: ValueKey<String>('pie_$title'),
                legend: const Legend(
                  isVisible: true,
                  position: LegendPosition.top,
                  overflowMode: LegendItemOverflowMode.wrap,
                  toggleSeriesVisibility: false,
                ),
                tooltipBehavior: _tooltip(),
                series: <CircularSeries<Map<String, dynamic>, String>>[
                  PieSeries<Map<String, dynamic>, String>(
                    animationDuration: 800,
                    dataSource: data,
                    xValueMapper: (d, _) => _s(d[labelKey]),
                    yValueMapper: (d, _) => _d(d[valueKey]),
                    dataLabelMapper: (d, _) => '${_s(d[labelKey])}: ${_fmtMoney(_d(d[valueKey]))}',
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

  Widget _overdueChart(String title, List<Map<String, dynamic>> data, {required String xKey}) {
    if (data.isEmpty) return const SizedBox.shrink();
    // web uses stacked OK_IV + OVER_IV and line OK_RATE.
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(child: Text(title, style: const TextStyle(fontWeight: FontWeight.w900))),
                IconButton(
                  onPressed: () => _exportExcel(data, title.replaceAll(' ', '_')),
                  icon: const Icon(Icons.table_view),
                  tooltip: 'Export Excel',
                ),
              ],
            ),
            const SizedBox(height: 10),
            SizedBox(
              height: 300,
              child: SfCartesianChart(
                key: ValueKey<String>('overdue_$title'),
                enableAxisAnimation: true,
                legend: const Legend(isVisible: true, position: LegendPosition.top, toggleSeriesVisibility: false),
                tooltipBehavior: _tooltip(),
                primaryXAxis: CategoryAxis(labelRotation: 45),
                primaryYAxis: NumericAxis(numberFormat: NumberFormat.compact(), title: AxisTitle(text: 'LOT QTY')),
                axes: <ChartAxis>[
                  NumericAxis(
                    name: 'rate',
                    opposedPosition: true,
                    title: AxisTitle(text: 'OK RATE'),
                    numberFormat: NumberFormat.percentPattern(),
                    minimum: 0,
                    maximum: 1,
                  ),
                ],
                series: <CartesianSeries<Map<String, dynamic>, String>>[
                  StackedColumnSeries<Map<String, dynamic>, String>(
                    name: 'OK_IV',
                    animationDuration: 800,
                    dataSource: data,
                    xValueMapper: (d, _) => _s(d[xKey]),
                    yValueMapper: (d, _) => _d(d['OK_IV']),
                    color: const Color(0xFF53EB34),
                  ),
                  StackedColumnSeries<Map<String, dynamic>, String>(
                    name: 'OVER_IV',
                    animationDuration: 800,
                    dataSource: data,
                    xValueMapper: (d, _) => _s(d[xKey]),
                    yValueMapper: (d, _) => _d(d['OVER_IV']),
                    color: const Color(0xFFFF0000),
                  ),
                  LineSeries<Map<String, dynamic>, String>(
                    name: 'OK_RATE',
                    yAxisName: 'rate',
                    animationDuration: 800,
                    dataSource: data,
                    xValueMapper: (d, _) => _s(d[xKey]),
                    yValueMapper: (d, _) => _d(d['OK_RATE']),
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

  Widget _poBalanceSummaryByYearChart() {
    if (_poBalanceSummaryByYear.isEmpty) return const SizedBox.shrink();
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Expanded(child: Text('Current PO Balance Summary By Year', style: TextStyle(fontWeight: FontWeight.w900))),
                IconButton(
                  onPressed: () => _exportExcel(_poBalanceSummaryByYear, 'Current_PO_Balance_Summary_By_Year'),
                  icon: const Icon(Icons.table_view),
                  tooltip: 'Export Excel',
                ),
              ],
            ),
            const SizedBox(height: 10),
            SizedBox(
              height: 300,
              child: SfCartesianChart(
                key: const ValueKey<String>('pobal_year'),
                enableAxisAnimation: true,
                tooltipBehavior: _tooltip(),
                primaryXAxis: CategoryAxis(),
                primaryYAxis: NumericAxis(numberFormat: NumberFormat.compact()),
                selectionGesture: ActivationMode.singleTap,
                selectionType: SelectionType.point,
                onSelectionChanged: (args) {
                  final idx = args.pointIndex;
                  if (idx < 0 || idx >= _poBalanceSummaryByYear.length) return;
                  final poYear = int.tryParse(_s(_poBalanceSummaryByYear[idx]['PO_YEAR'])) ?? 0;
                  if (poYear <= 0) return;
                  unawaited(_loadPoBalanceDrillYear(poYear));
                },
                series: <CartesianSeries<Map<String, dynamic>, String>>[
                  ColumnSeries<Map<String, dynamic>, String>(
                    dataSource: _poBalanceSummaryByYear,
                    xValueMapper: (d, _) => _s(d['PO_YEAR']),
                    yValueMapper: (d, _) => _d(d['PO_BALANCE']),
                    color: const Color(0xFF37B46B),
                    animationDuration: 800,
                    dataLabelSettings: DataLabelSettings(
                      isVisible: true,
                      builder: (dynamic data, dynamic point, dynamic series, int pointIndex, int seriesIndex) {
                        final v = _d((data as Map<String, dynamic>)['PO_BALANCE']);
                        return Text(_fmtCompact(v), style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w800));
                      },
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),
            Text('Tip: tap a bar to load detail/customer', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12)),
          ],
        ),
      ),
    );
  }

  Widget _poBalanceSummaryByWeekChart() {
    if (_poBalanceDetail.isEmpty) return const SizedBox.shrink();
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Expanded(child: Text('Current PO Balance Summary By Week', style: TextStyle(fontWeight: FontWeight.w900))),
                IconButton(
                  onPressed: () => _exportExcel(_poBalanceDetail, 'Current_PO_Balance_Summary_By_Week'),
                  icon: const Icon(Icons.table_view),
                  tooltip: 'Export Excel',
                ),
              ],
            ),
            const SizedBox(height: 10),
            SizedBox(
              height: 300,
              child: SfCartesianChart(
                key: const ValueKey<String>('pobal_week'),
                enableAxisAnimation: true,
                tooltipBehavior: _tooltip(),
                primaryXAxis: CategoryAxis(labelRotation: 45),
                primaryYAxis: NumericAxis(numberFormat: NumberFormat.compact()),
                selectionGesture: ActivationMode.singleTap,
                selectionType: SelectionType.point,
                onSelectionChanged: (args) {
                  final idx = args.pointIndex;
                  if (idx < 0 || idx >= _poBalanceDetail.length) return;
                  final poYear = int.tryParse(_s(_poBalanceDetail[idx]['PO_YEAR'])) ?? 0;
                  final poWeek = int.tryParse(_s(_poBalanceDetail[idx]['PO_WEEK'])) ?? 0;
                  if (poYear <= 0 || poWeek <= 0) return;
                  unawaited(_loadPoBalanceDrillWeek(poYear, poWeek));
                },
                series: <CartesianSeries<Map<String, dynamic>, String>>[
                  ColumnSeries<Map<String, dynamic>, String>(
                    dataSource: _poBalanceDetail,
                    xValueMapper: (d, _) => _s(d['PO_YW']),
                    yValueMapper: (d, _) => _d(d['PO_BALANCE']),
                    color: const Color(0xFF37B46B),
                    animationDuration: 800,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _poBalanceCustomerPie() {
    final data = _poBalanceCustomer.isNotEmpty ? _poBalanceCustomer : _poBalanceCustomerByYear;
    if (data.isEmpty) return const SizedBox.shrink();
    final key = data.first.keys.contains('PO_BALANCE') ? 'PO_BALANCE' : 'DELIVERY_AMOUNT';
    return _pieChart('Current PO Balance Summary Customer - $_selectedYW', data, labelKey: 'CUST_NAME_KD', valueKey: key);
  }

  Widget _fcstSection() {
    if (_fcstAmount.isEmpty && _samsungFcst.isEmpty) return const SizedBox.shrink();
    final fcstWeekNo = _sMap(_fcstAmount, ['FCSTWEEKNO', 'FCST_WEEK_NO', 'FCST_WEEKNO', 'WEEKNO']);
    final w4qty = _dMap(_fcstAmount, ['FCST4W_QTY', 'FCST4WQTY', 'FCST_4W_QTY', 'FCST4W']);
    final w4amt = _dMap(_fcstAmount, ['FCST4W_AMOUNT', 'FCST4WAMOUNT', 'FCST_4W_AMOUNT', 'FCST4W_AMT', 'FCST4WAMT']);
    final w8qty = _dMap(_fcstAmount, ['FCST8W_QTY', 'FCST8WQTY', 'FCST_8W_QTY', 'FCST8W']);
    final w8amt = _dMap(_fcstAmount, ['FCST8W_AMOUNT', 'FCST8WAMOUNT', 'FCST_8W_AMOUNT', 'FCST8W_AMT', 'FCST8WAMT']);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _sectionTitle('Forecast'),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('FCST Amount (FCST W$fcstWeekNo)', style: const TextStyle(fontWeight: FontWeight.w900)),
                const SizedBox(height: 10),
                LayoutBuilder(
                  builder: (ctx, c) {
                    final cross = c.maxWidth >= 900 ? 2 : 1;
                    return GridView.count(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisCount: cross,
                      crossAxisSpacing: 10,
                      mainAxisSpacing: 10,
                      childAspectRatio: 3.0,
                      children: [
                        _kpiCard(label: 'FCST AMOUNT (4 WEEK)', value: '${NumberFormat.decimalPattern().format(w4qty)} EA | ${_fmtMoney(w4amt)}', color: const Color(0xFF8E24AA)),
                        _kpiCard(label: 'FCST AMOUNT (8 WEEK)', value: '${NumberFormat.decimalPattern().format(w8qty)} EA | ${_fmtMoney(w8amt)}', color: const Color(0xFFF57C00)),
                      ],
                    );
                  },
                ),
              ],
            ),
          ),
        ),
        if (_samsungFcst.isNotEmpty) ...[
          const SizedBox(height: 10),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Expanded(child: Text('SamSung ForeCast (So sánh FCST 2 tuần liền kề)', style: TextStyle(fontWeight: FontWeight.w900))),
                      IconButton(
                        onPressed: () => _exportExcel(_samsungFcst, 'SamSung_FCST'),
                        icon: const Icon(Icons.table_view),
                        tooltip: 'Export Excel',
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  SizedBox(
                    height: 320,
                    child: SfCartesianChart(
                      key: const ValueKey<String>('fcst_ss'),
                      enableAxisAnimation: true,
                      legend: const Legend(isVisible: true, position: LegendPosition.top, toggleSeriesVisibility: false),
                      tooltipBehavior: _tooltip(),
                      primaryXAxis: CategoryAxis(title: AxisTitle(text: 'Tuần'), labelRotation: 45),
                      primaryYAxis: NumericAxis(numberFormat: NumberFormat.compact(), title: AxisTitle(text: 'Số lượng')),
                      series: <CartesianSeries<Map<String, dynamic>, String>>[
                        StackedColumnSeries<Map<String, dynamic>, String>(
                          groupName: 'ss1',
                          name: 'SEVT1',
                          animationDuration: 800,
                          dataSource: _samsungFcst,
                          xValueMapper: (d, _) => _s(d['WEEKNO']),
                          yValueMapper: (d, _) => _d(d['SEVT1']),
                          color: const Color(0xFF44CC00),
                        ),
                        StackedColumnSeries<Map<String, dynamic>, String>(
                          groupName: 'ss1',
                          name: 'SEV1',
                          animationDuration: 800,
                          dataSource: _samsungFcst,
                          xValueMapper: (d, _) => _s(d['WEEKNO']),
                          yValueMapper: (d, _) => _d(d['SEV1']),
                          color: const Color(0xFFFF80FF),
                        ),
                        StackedColumnSeries<Map<String, dynamic>, String>(
                          groupName: 'ss1',
                          name: 'SAMSUNG_ASIA1',
                          animationDuration: 800,
                          dataSource: _samsungFcst,
                          xValueMapper: (d, _) => _s(d['WEEKNO']),
                          yValueMapper: (d, _) => _d(d['SAMSUNG_ASIA1']),
                          color: const Color(0xFF4D94FF),
                        ),
                        StackedColumnSeries<Map<String, dynamic>, String>(
                          groupName: 'ss2',
                          name: 'SEVT2',
                          animationDuration: 800,
                          dataSource: _samsungFcst,
                          xValueMapper: (d, _) => _s(d['WEEKNO']),
                          yValueMapper: (d, _) => _d(d['SEVT2']),
                          color: const Color(0xFF44CC00),
                        ),
                        StackedColumnSeries<Map<String, dynamic>, String>(
                          groupName: 'ss2',
                          name: 'SEV2',
                          animationDuration: 800,
                          dataSource: _samsungFcst,
                          xValueMapper: (d, _) => _s(d['WEEKNO']),
                          yValueMapper: (d, _) => _d(d['SEV2']),
                          color: const Color(0xFFFF80FF),
                        ),
                        StackedColumnSeries<Map<String, dynamic>, String>(
                          groupName: 'ss2',
                          name: 'SAMSUNG_ASIA2',
                          animationDuration: 800,
                          dataSource: _samsungFcst,
                          xValueMapper: (d, _) => _s(d['WEEKNO']),
                          yValueMapper: (d, _) => _d(d['SAMSUNG_ASIA2']),
                          color: const Color(0xFF4D94FF),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ],
    );
  }

  List<PlutoColumn> _buildTableColumns(List<Map<String, dynamic>> rows) {
    // keep stable order: first-row keys first, then add missing keys from subsequent rows.
    final fields = <String>[];
    final seen = <String>{};
    for (final r in rows) {
      for (final k in r.keys) {
        if (k == 'id') continue;
        if (seen.add(k)) fields.add(k);
      }
    }

    PlutoColumn col(String field) {
      final isMoney = field.contains('AMOUNT') || field.contains('PRICE') || field.contains('VALUE');
      final isQty = field.contains('QTY') || field.contains('BALANCE') || field.contains('IV');
      return PlutoColumn(
        title: field,
        field: field,
        type: PlutoColumnType.text(),
        enableContextMenu: false,
        enableSorting: true,
        enableFilterMenuItem: true,
        width: 140,
        minWidth: 90,
        renderer: (ctx) {
          final raw = ctx.cell.value;
          final asNum = raw is num ? raw.toDouble() : double.tryParse((raw ?? '').toString());
          final v = asNum == null
              ? (raw ?? '').toString()
              : isMoney
                  ? _fmtMoney(asNum)
                  : isQty
                      ? NumberFormat.decimalPattern().format(asNum)
                      : asNum.toString();
          final align = isMoney || isQty ? TextAlign.right : TextAlign.left;
          return Text(v, textAlign: align, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 11));
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
      for (final f in fields) col(f),
    ];
  }

  List<PlutoRow> _buildTableRows(List<Map<String, dynamic>> rows, List<PlutoColumn> cols) {
    Object? val(Map<String, dynamic> it, String field) {
      if (field == '__raw__') return it;
      return it[field];
    }

    return [
      for (final it in rows)
        PlutoRow(
          cells: {for (final c in cols) c.field: PlutoCell(value: val(it, c.field))},
        ),
    ];
  }

  Widget _tableCard(String title, List<Map<String, dynamic>> rows) {
    if (rows.isEmpty) return const SizedBox.shrink();

    final cols = _buildTableColumns(rows);
    final rws = _buildTableRows(rows, cols);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: SizedBox(
          height: 420,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.w900)),
              const SizedBox(height: 10),
              Expanded(
                child: PlutoGrid(
                  columns: cols,
                  rows: rws,
                  onLoaded: (e) {
                    e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                    e.stateManager.setShowColumnFilter(true);
                  },
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

    return Scaffold(
      appBar: AppBar(
        title: const Text('Báo cáo Kinh doanh'),
        actions: [
          IconButton(
            onPressed: () => setState(() => _showFilters = !_showFilters),
            icon: Icon(_showFilters ? Icons.filter_alt_off : Icons.filter_alt),
            tooltip: _showFilters ? 'Hide filter' : 'Show filter',
          ),
          IconButton(
            onPressed: _loading ? null : _loadAll,
            icon: const Icon(Icons.refresh),
            tooltip: 'Reload',
          ),
        ],
      ),
      drawer: const AppDrawer(title: 'ERP'),
      body: RefreshIndicator(
        onRefresh: () async => _loadAll(),
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              children: [
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('CMS KinhDoanh Report', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18)),
                                  const SizedBox(height: 4),
                                  Text('Company: ${AppConfig.company}', style: TextStyle(color: scheme.onSurfaceVariant)),
                                ],
                              ),
                            ),
                            if (_loading) const SizedBox(width: 22, height: 22, child: CircularProgressIndicator(strokeWidth: 2)),
                          ],
                        ),
                        if (_showFilters) ...[
                          const SizedBox(height: 12),
                          SwitchListTile(
                            value: _df,
                            title: const Text('DF (default range)'),
                            dense: true,
                            contentPadding: EdgeInsets.zero,
                            onChanged: (v) => setState(() => _df = v),
                          ),
                          SwitchListTile(
                            value: _inNhanh,
                            title: const Text('In nhanh'),
                            dense: true,
                            contentPadding: EdgeInsets.zero,
                            onChanged: (v) => setState(() => _inNhanh = v),
                          ),
                          if (!_df) ...[
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Expanded(
                                  child: OutlinedButton.icon(
                                    onPressed: _pickFrom,
                                    icon: const Icon(Icons.date_range),
                                    label: Text('From: ${_ymd(_fromDate)}'),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: OutlinedButton.icon(
                                    onPressed: _pickTo,
                                    icon: const Icon(Icons.date_range),
                                    label: Text('To: ${_ymd(_toDate)}'),
                                  ),
                                ),
                              ],
                            ),
                          ],
                          const SizedBox(height: 8),
                          FilledButton.icon(
                            onPressed: _loading ? null : _loadAll,
                            icon: const Icon(Icons.play_arrow),
                            label: const Text('Load report'),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),

                _sectionTitle('Widgets'),
                _widgetRow(),

                _sectionTitle('Closing charts'),
                _comboChart(
                  'Daily Closing',
                  _withFormattedDate(_dailyClosingWidget, 'DELIVERY_DATE', 'DELIVERY_DATE_FMT'),
                  xKey: 'DELIVERY_DATE_FMT',
                  qtyKey: 'DELIVERY_QTY',
                  amountKey: 'DELIVERED_AMOUNT',
                  kpiKey: 'KPI_VALUE',
                  xLabel: 'Ngày tháng',
                  leftLabel: 'Số lượng',
                  rightLabel: 'Số tiền',
                  amountColor: const Color(0xFF52AAF1),
                  qtyColor: Colors.green,
                  kpiColor: Colors.red,
                ),
                _comboChart(
                  'Weekly Closing',
                  _weeklyClosingWidget,
                  xKey: 'DEL_YW',
                  qtyKey: 'DELIVERY_QTY',
                  amountKey: 'DELIVERED_AMOUNT',
                  kpiKey: 'KPI_VALUE',
                  xLabel: 'Tuần',
                  leftLabel: 'Số lượng',
                  rightLabel: 'Số tiền',
                  amountColor: const Color(0xFFFF9900),
                  qtyColor: Colors.green,
                  kpiColor: Colors.red,
                ),
                _comboChart(
                  'Monthly Closing',
                  _monthlyClosingWidget,
                  xKey: 'MONTH_YW',
                  qtyKey: 'DELIVERY_QTY',
                  amountKey: 'DELIVERED_AMOUNT',
                  kpiKey: 'KPI_VALUE',
                  xLabel: 'Tháng',
                  leftLabel: 'Số lượng',
                  rightLabel: 'Số tiền',
                  amountColor: const Color(0xFFF1EDA7),
                  qtyColor: Colors.blue,
                  kpiColor: Colors.red,
                ),
                _comboChart(
                  'Yearly Closing',
                  _yearlyClosingWidget,
                  xKey: 'YEAR_NUM',
                  qtyKey: 'DELIVERY_QTY',
                  amountKey: 'DELIVERED_AMOUNT',
                  kpiKey: 'KPI_VALUE',
                  xLabel: 'Năm',
                  leftLabel: 'Số lượng',
                  rightLabel: 'Số tiền',
                  amountColor: const Color(0xFF00C421),
                  qtyColor: Colors.blue,
                  kpiColor: Colors.red,
                ),

                _sectionTitle('Revenue'),
                _pieChart('TOP 5 Customer Weekly Revenue', _customerRevenue.take(5).toList(), labelKey: 'CUST_NAME_KD', valueKey: 'DELIVERY_AMOUNT'),
                _pieChart('PIC Weekly Revenue', _picRevenue, labelKey: 'EMPL_NAME', valueKey: 'DELIVERY_AMOUNT'),

                _sectionTitle('PO'),
                _comboChart(
                  'PO By Week',
                  _poOverWeek,
                  xKey: 'YEAR_WEEK',
                  qtyKey: 'WEEKLY_PO_QTY',
                  amountKey: 'WEEKLY_PO_AMOUNT',
                  xLabel: 'Tuần',
                  leftLabel: 'Số lượng',
                  rightLabel: 'Số tiền',
                  amountColor: const Color(0xFF7CB7E7),
                  qtyColor: Colors.green,
                  rightAxisMoney: true,
                ),
                _comboChart(
                  'PO Balance Trending (By Week)',
                  _runningPoBalance,
                  xKey: 'YEAR_WEEK',
                  qtyKey: 'RUNNING_PO_BALANCE',
                  amountKey: 'RUNNING_BALANCE_AMOUNT',
                  xLabel: 'Tuần',
                  leftLabel: 'Số lượng',
                  rightLabel: 'Số tiền',
                  amountColor: const Color(0xFFC69FF3),
                  qtyColor: Colors.green,
                  rightAxisMoney: true,
                ),
                if (_poBalanceSummaryTotal.isNotEmpty)
                  _poBalanceInfoCard(),

                _sectionTitle('Overdue'),
                _overdueChart('Daily Overdue', _dailyOverdue.reversed.toList(), xKey: 'DELIVERY_DATE'),
                _overdueChart('Weekly Overdue', _weeklyOverdue.reversed.toList(), xKey: 'DEL_YW'),
                _overdueChart('Monthly Overdue', _monthlyOverdue.reversed.toList(), xKey: 'DEL_YM'),
                _overdueChart('Yearly Overdue', _yearlyOverdue.reversed.toList(), xKey: 'YEARNUM'),

                if (AppConfig.company == 'CMS') ...[
                  _sectionTitle('PO Balance Summary (CMS)'),
                  _poBalanceSummaryByYearChart(),
                  _poBalanceCustomerPie(),
                  _poBalanceSummaryByWeekChart(),
                  _poBalanceCustomerPie(),
                  _tableCard('Customer Weekly PO Qty', _customerWeeklyPoQty),
                  _tableCard('Customer PO Balance By Product Type', _customerPoBalanceByType),
                ],

                _fcstSection(),

                const SizedBox(height: 40),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
