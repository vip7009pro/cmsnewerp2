import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:syncfusion_flutter_charts/charts.dart';

import '../../../../../core/providers.dart';

class CsReportTab extends ConsumerStatefulWidget {
  const CsReportTab({super.key});

  @override
  ConsumerState<CsReportTab> createState() => _CsReportTabState();
}

class _CsReportTabState extends ConsumerState<CsReportTab> {
  bool _loading = false;
  bool _showFilter = true;

  DateTime _fromDate = DateTime.now().subtract(const Duration(days: 14));
  DateTime _toDate = DateTime.now();

  String _worstBy = 'AMOUNT';
  String _ngType = 'ALL';
  bool _df = true;

  final TextEditingController _custCtrl = TextEditingController();

  List<Map<String, dynamic>> _codeList = const [];
  List<Map<String, dynamic>> _selectedCodes = const [];

  List<Map<String, dynamic>> _daily = const [];
  List<Map<String, dynamic>> _weekly = const [];
  List<Map<String, dynamic>> _monthly = const [];
  List<Map<String, dynamic>> _yearly = const [];

  List<Map<String, dynamic>> _byCustomer = const [];
  List<Map<String, dynamic>> _byPic = const [];

  List<Map<String, dynamic>> _dailySaving = const [];
  List<Map<String, dynamic>> _weeklySaving = const [];
  List<Map<String, dynamic>> _monthlySaving = const [];
  List<Map<String, dynamic>> _yearlySaving = const [];

  List<Map<String, dynamic>> _dailyRma = const [];
  List<Map<String, dynamic>> _weeklyRma = const [];
  List<Map<String, dynamic>> _monthlyRma = const [];
  List<Map<String, dynamic>> _yearlyRma = const [];

  List<Map<String, dynamic>> _dailyTaxi = const [];
  List<Map<String, dynamic>> _weeklyTaxi = const [];
  List<Map<String, dynamic>> _monthlyTaxi = const [];
  List<Map<String, dynamic>> _yearlyTaxi = const [];

  String _s(dynamic v) => (v ?? '').toString();
  double _d(dynamic v) => (v is num) ? v.toDouble() : (double.tryParse(_s(v).replaceAll(',', '')) ?? 0);

  bool _isNg(Map<String, dynamic> body) => (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  String _ymd(DateTime dt) => DateFormat('yyyy-MM-dd').format(dt);

  String _ddMm(String ymd) {
    final s = ymd.trim();
    if (s.length < 10) return s;
    final dd = s.substring(8, 10);
    final mm = s.substring(5, 7);
    return '$dd/$mm';
  }

  List<String> _selectedCodeArray() {
    return _selectedCodes.map((e) => _s(e['G_CODE']).trim()).where((e) => e.isNotEmpty).toList(growable: false);
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

  Future<List<Map<String, dynamic>>> _loadList(String cmd, Map<String, dynamic> payload) async {
    final body = await _post(cmd, payload);
    if (_isNg(body)) return const [];
    final raw = body['data'];
    final arr = raw is List ? raw : const [];
    return arr.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();
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
    if (_codeList.isEmpty) return;

    final current = _selectedCodes;
    final selected = current.map((e) => _s(e['G_CODE'])).toSet();
    final searchCtrl = TextEditingController();

    await showDialog<void>(
      context: context,
      builder: (ctx) {
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

            final data = filtered();

            return AlertDialog(
              title: const Text('Chọn Code (multi-select)'),
              content: SizedBox(
                width: 520,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(
                      controller: searchCtrl,
                      decoration: const InputDecoration(prefixIcon: Icon(Icons.search), labelText: 'Search code'),
                      onChanged: (_) => setState2(() {}),
                    ),
                    const SizedBox(height: 10),
                    Expanded(
                      child: ListView.builder(
                        itemCount: data.length,
                        itemBuilder: (context, index) {
                          final r = data[index];
                          final code = _s(r['G_CODE']);
                          final label = '$code: ${_s(r['G_NAME_KD'])}';
                          final checked = selected.contains(code);
                          return CheckboxListTile(
                            dense: true,
                            value: checked,
                            onChanged: (v) {
                              setState2(() {
                                if (v == true) {
                                  selected.add(code);
                                } else {
                                  selected.remove(code);
                                }
                              });
                            },
                            title: Text(label, maxLines: 1, overflow: TextOverflow.ellipsis),
                            subtitle: Text(_s(r['G_NAME']), maxLines: 1, overflow: TextOverflow.ellipsis),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(onPressed: () => Navigator.of(ctx2).pop(), child: const Text('Cancel')),
                TextButton(
                  onPressed: () {
                    final out = <Map<String, dynamic>>[];
                    for (final r in _codeList) {
                      final code = _s(r['G_CODE']);
                      if (selected.contains(code)) out.add(r);
                    }
                    setState(() => _selectedCodes = out);
                    Navigator.of(ctx2).pop();
                  },
                  child: const Text('OK'),
                ),
              ],
            );
          },
        );
      },
    );

    searchCtrl.dispose();
  }

  Future<void> _loadAll() async {
    setState(() {
      _loading = true;
    });

    try {
      final from = _ymd(_fromDate);
      final to = _ymd(_toDate);
      final cust = _custCtrl.text.trim();

      final codeArray = _selectedCodeArray();

      Map<String, dynamic> basePayload({required String frd, required String td}) => {
            'FROM_DATE': frd,
            'TO_DATE': td,
            'codeArray': codeArray,
            'CUST_NAME_KD': cust,
            'WORSTBY': _worstBy,
            'NG_TYPE': _ngType,
          };

      // DF behavior same as web
      final td = DateTime.now();
      final today = _ymd(td);
      final fr14 = _ymd(td.subtract(const Duration(days: 14)));
      final fr70 = _ymd(td.subtract(const Duration(days: 70)));
      final fr365 = _ymd(td.subtract(const Duration(days: 365)));
      final fr3650 = _ymd(td.subtract(const Duration(days: 3650)));

      final daily = await _loadList('csdailyconfirmdata', {
        ...basePayload(frd: _df ? fr14 : from, td: _df ? today : to),
      });
      for (final r in daily) {
        if (r['CONFIRM_DATE'] != null) {
          final s = _s(r['CONFIRM_DATE']);
          if (s.isNotEmpty) {
            final dt = DateTime.tryParse(s.replaceFirst(' ', 'T')) ?? DateTime.tryParse(s);
            if (dt != null) r['CONFIRM_DATE'] = DateFormat('yyyy-MM-dd').format(dt.toUtc());
          }
        }
        r['TOTAL'] = _d(r['C']) + _d(r['K']);
      }

      final weekly = await _loadList('csweeklyconfirmdata', {
        ...basePayload(frd: _df ? fr70 : from, td: _df ? today : to),
      });
      for (final r in weekly) {
        r['TOTAL'] = _d(r['C']) + _d(r['K']);
      }

      final monthly = await _loadList('csmonthlyconfirmdata', {
        ...basePayload(frd: _df ? fr365 : from, td: _df ? today : to),
      });
      for (final r in monthly) {
        r['TOTAL'] = _d(r['C']) + _d(r['K']);
      }

      final yearly = await _loadList('csyearlyconfirmdata', {
        ...basePayload(frd: _df ? fr3650 : from, td: _df ? today : to),
      });
      for (final r in yearly) {
        r['TOTAL'] = _d(r['C']) + _d(r['K']);
      }

      final byCust = await _loadList('csConfirmDataByCustomer', {
        ...basePayload(frd: _df ? fr14 : from, td: _df ? today : to),
      });
      final byPic = await _loadList('csConfirmDataByPIC', {
        ...basePayload(frd: _df ? fr14 : from, td: _df ? today : to),
      });

      final dailySaving = await _loadList('csdailyreduceamount', {
        ...basePayload(frd: _df ? fr14 : from, td: _df ? today : to),
      });
      final weeklySaving = await _loadList('csweeklyreduceamount', {
        ...basePayload(frd: _df ? fr70 : from, td: _df ? today : to),
      });
      final monthlySaving = await _loadList('csmonthlyreduceamount', {
        ...basePayload(frd: _df ? fr365 : from, td: _df ? today : to),
      });
      final yearlySaving = await _loadList('csyearlyreduceamount', {
        ...basePayload(frd: _df ? fr3650 : from, td: _df ? today : to),
      });

      for (final r in dailySaving) {
        if (r['CONFIRM_DATE'] != null) {
          final s = _s(r['CONFIRM_DATE']);
          if (s.isNotEmpty) {
            final dt = DateTime.tryParse(s.replaceFirst(' ', 'T')) ?? DateTime.tryParse(s);
            if (dt != null) r['CONFIRM_DATE'] = DateFormat('yyyy-MM-dd').format(dt);
          }
        }
      }

      final dailyRma = await _loadList('csdailyRMAAmount', {
        ...basePayload(frd: _df ? fr14 : from, td: _df ? today : to),
      });
      for (final r in dailyRma) {
        r['TT'] = _d(r['CD']) + _d(r['HT']) + _d(r['MD']);
      }

      final weeklyRma = await _loadList('csweeklyRMAAmount', {
        ...basePayload(frd: _df ? fr70 : from, td: _df ? today : to),
      });
      for (final r in weeklyRma) {
        r['TT'] = _d(r['CD']) + _d(r['HT']) + _d(r['MD']);
      }

      final monthlyRma = await _loadList('csmonthlyRMAAmount', {
        ...basePayload(frd: _df ? fr365 : from, td: _df ? today : to),
      });
      for (final r in monthlyRma) {
        r['TT'] = _d(r['CD']) + _d(r['HT']) + _d(r['MD']);
      }

      final yearlyRma = await _loadList('csyearlyRMAAmount', {
        ...basePayload(frd: _df ? fr3650 : from, td: _df ? today : to),
      });
      for (final r in yearlyRma) {
        r['TT'] = _d(r['CD']) + _d(r['HT']) + _d(r['MD']);
      }

      final dailyTaxi = await _loadList('csdailyTaxiAmount', {
        ...basePayload(frd: _df ? fr14 : from, td: _df ? today : to),
      });

      final weeklyTaxi = await _loadList('csweeklyTaxiAmount', {
        ...basePayload(frd: _df ? fr70 : from, td: _df ? today : to),
      });

      final monthlyTaxi = await _loadList('csmonthlyTaxiAmount', {
        ...basePayload(frd: _df ? fr365 : from, td: _df ? today : to),
      });

      final yearlyTaxi = await _loadList('csyearlyTaxiAmount', {
        ...basePayload(frd: _df ? fr3650 : from, td: _df ? today : to),
      });

      if (!mounted) return;
      setState(() {
        _daily = daily;
        _weekly = weekly;
        _monthly = monthly;
        _yearly = yearly;
        _byCustomer = byCust;
        _byPic = byPic;
        _dailySaving = dailySaving;
        _weeklySaving = weeklySaving;
        _monthlySaving = monthlySaving;
        _yearlySaving = yearlySaving;
        _dailyRma = dailyRma;
        _weeklyRma = weeklyRma;
        _monthlyRma = monthlyRma;
        _yearlyRma = yearlyRma;
        _dailyTaxi = dailyTaxi;
        _weeklyTaxi = weeklyTaxi;
        _monthlyTaxi = monthlyTaxi;
        _yearlyTaxi = yearlyTaxi;
      });

      _snack('Đã load xong báo cáo');
    } catch (e) {
      _snack('Lỗi: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  TooltipBehavior _tooltip() => TooltipBehavior(enable: true, animationDuration: 0);

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    final selectedCodeLabel = _selectedCodes.isEmpty ? 'Chọn code' : 'Đã chọn ${_selectedCodes.length} code';

    final firstDaily = _daily.isNotEmpty ? _daily.first : const <String, dynamic>{};
    final firstWeekly = _weekly.isNotEmpty ? _weekly.first : const <String, dynamic>{};
    final firstMonthly = _monthly.isNotEmpty ? _monthly.first : const <String, dynamic>{};
    final firstYearly = _yearly.isNotEmpty ? _yearly.first : const <String, dynamic>{};

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
            const Expanded(child: Text('CS REPORT', style: TextStyle(fontWeight: FontWeight.w900))),
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
                  OutlinedButton(onPressed: _loading ? null : () => _pickDate(from: true), child: Text('Từ: ${_ymd(_fromDate)}')),
                  OutlinedButton(onPressed: _loading ? null : () => _pickDate(from: false), child: Text('Đến: ${_ymd(_toDate)}')),
                  SizedBox(
                    width: 220,
                    child: TextField(
                      controller: _custCtrl,
                      decoration: const InputDecoration(labelText: 'Customer (CUST_NAME_KD)'),
                    ),
                  ),
                  OutlinedButton.icon(
                    onPressed: _loading ? null : (_codeList.isEmpty ? null : _pickCodes),
                    icon: const Icon(Icons.list_alt),
                    label: Text(selectedCodeLabel),
                  ),
                  DropdownButton<String>(
                    value: _worstBy,
                    style: TextStyle(color: scheme.onSurface, fontWeight: FontWeight.w700),
                    dropdownColor: scheme.surface,
                    iconEnabledColor: scheme.onSurface,
                    onChanged: _loading ? null : (v) => setState(() => _worstBy = v ?? 'AMOUNT'),
                    items: const [
                      DropdownMenuItem(value: 'QTY', child: Text('Worst by QTY')),
                      DropdownMenuItem(value: 'AMOUNT', child: Text('Worst by AMOUNT')),
                    ],
                  ),
                  DropdownButton<String>(
                    value: _ngType,
                    style: TextStyle(color: scheme.onSurface, fontWeight: FontWeight.w700),
                    dropdownColor: scheme.surface,
                    iconEnabledColor: scheme.onSurface,
                    onChanged: _loading ? null : (v) => setState(() => _ngType = v ?? 'ALL'),
                    items: const [
                      DropdownMenuItem(value: 'ALL', child: Text('NG TYPE: ALL')),
                      DropdownMenuItem(value: 'P', child: Text('NG TYPE: PROCESS')),
                      DropdownMenuItem(value: 'M', child: Text('NG TYPE: MATERIAL')),
                    ],
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
                  FilledButton.icon(
                    onPressed: _loading ? null : _loadAll,
                    icon: const Icon(Icons.search),
                    label: const Text('Search'),
                  ),
                ],
              ),
            ),
          );

    Widget overview = Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text('1. CS Issue OverView', style: TextStyle(fontWeight: FontWeight.w900)),
            const SizedBox(height: 8),
            _responsiveQuad(
              a: _overviewCard(title: 'Today issue', icon: Icons.today, accent: const Color(0xFF3B82F6), row: firstDaily),
              b: _overviewCard(title: 'This Week issue', icon: Icons.calendar_view_week, accent: const Color(0xFF10B981), row: firstWeekly),
              c: _overviewCard(title: 'This month issue', icon: Icons.calendar_view_month, accent: const Color(0xFFF59E0B), row: firstMonthly),
              d: _overviewCard(title: 'This year issue', icon: Icons.event, accent: const Color(0xFFEF4444), row: firstYearly),
            ),
          ],
        ),
      ),
    );

    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            filterHeader,
            filterCard,
            if (_loading) const LinearProgressIndicator(),
            overview,
            _sectionTitle('2. Customer Issue Feedback Trending'),
            _responsivePair(
              a: _issueChart(title: 'Daily Issue', data: _daily, xKey: 'CONFIRM_DATE', xLabel: 'Ngày', isDate: true),
              b: _issueChart(title: 'Weekly Issue', data: _weekly, xKey: 'CONFIRM_YW', xLabel: 'Tuần'),
            ),
            const SizedBox(height: 8),
            _responsivePair(
              a: _issueChart(title: 'Monthly Issue', data: _monthly, xKey: 'CONFIRM_YM', xLabel: 'Tháng'),
              b: _issueChart(title: 'Yearly Issue', data: _yearly, xKey: 'CONFIRM_YEAR', xLabel: 'Năm'),
            ),
            const SizedBox(height: 8),
            _sectionTitle('2.5 Issue by Customer and PICs'),
            _responsivePair(
              a: _hBarChart(title: 'Issue by Customer', data: _byCustomer, nameKey: 'CUST_NAME_KD', valueKey: 'TOTAL'),
              b: _hBarChart(title: 'Issue by PIC', data: _byPic, nameKey: 'EMPL_NAME', valueKey: 'TOTAL'),
            ),
            _sectionTitle('3. Cost Saving'),
            _responsivePair(
              a: _amountChart(title: 'Daily Saving', data: _dailySaving, xKey: 'CONFIRM_DATE', xLabel: 'Ngày', valueKey: 'REDUCE_AMOUNT', isDate: true),
              b: _amountChart(title: 'Weekly Saving', data: _weeklySaving, xKey: 'CONFIRM_YW', xLabel: 'Tuần', valueKey: 'REDUCE_AMOUNT'),
            ),
            const SizedBox(height: 8),
            _responsivePair(
              a: _amountChart(title: 'Monthly Saving', data: _monthlySaving, xKey: 'CONFIRM_YM', xLabel: 'Tháng', valueKey: 'REDUCE_AMOUNT'),
              b: _amountChart(title: 'Yearly Saving', data: _yearlySaving, xKey: 'CONFIRM_YEAR', xLabel: 'Năm', valueKey: 'REDUCE_AMOUNT'),
            ),
            _sectionTitle('4. F-COST Status'),
            _fcostSummary(),
            _sectionTitle('4.1 RMA Amount Trending'),
            _responsivePair(
              a: _rmaStackChart(title: 'Daily RMA', data: _dailyRma, xKey: 'RT_DATE', xLabel: 'Ngày', isDate: true),
              b: _rmaStackChart(title: 'Weekly RMA', data: _weeklyRma, xKey: 'RT_YW', xLabel: 'Tuần'),
            ),
            const SizedBox(height: 8),
            _responsivePair(
              a: _rmaStackChart(title: 'Monthly RMA', data: _monthlyRma, xKey: 'RT_YM', xLabel: 'Tháng'),
              b: _rmaStackChart(title: 'Yearly RMA', data: _yearlyRma, xKey: 'RT_YEAR', xLabel: 'Năm'),
            ),
            _sectionTitle('4.2 Taxi Amount Trending'),
            _responsivePair(
              a: _amountChart(title: 'Daily Taxi', data: _dailyTaxi, xKey: 'TAXI_DATE', xLabel: 'Ngày', valueKey: 'TAXI_AMOUNT', isDate: true),
              b: _amountChart(title: 'Weekly Taxi', data: _weeklyTaxi, xKey: 'TAXI_YW', xLabel: 'Tuần', valueKey: 'TAXI_AMOUNT'),
            ),
            const SizedBox(height: 8),
            _responsivePair(
              a: _amountChart(title: 'Monthly Taxi', data: _monthlyTaxi, xKey: 'TAXI_YM', xLabel: 'Tháng', valueKey: 'TAXI_AMOUNT'),
              b: _amountChart(title: 'Yearly Taxi', data: _yearlyTaxi, xKey: 'TAXI_YEAR', xLabel: 'Năm', valueKey: 'TAXI_AMOUNT'),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _sectionTitle(String t) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(4, 14, 4, 8),
      child: Text(t, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14)),
    );
  }

  Widget _responsivePair({required Widget a, required Widget b}) {
    final w = MediaQuery.of(context).size.width;
    if (w >= 900) {
      return Row(
        children: [
          Expanded(child: a),
          const SizedBox(width: 12),
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
  }

  Widget _responsiveQuad({required Widget a, required Widget b, required Widget c, required Widget d}) {
    final w = MediaQuery.of(context).size.width;
    if (w >= 900) {
      return Column(
        children: [
          Row(children: [Expanded(child: a), const SizedBox(width: 12), Expanded(child: b)]),
          const SizedBox(height: 12),
          Row(children: [Expanded(child: c), const SizedBox(width: 12), Expanded(child: d)]),
        ],
      );
    }
    return Column(
      children: [
        a,
        const SizedBox(height: 10),
        b,
        const SizedBox(height: 10),
        c,
        const SizedBox(height: 10),
        d,
      ],
    );
  }

  Widget _overviewCard({required String title, required IconData icon, required Color accent, required Map<String, dynamic> row}) {
    final c = _d(row['C']);
    final k = _d(row['K']);
    final t = c + k;

    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(colors: [accent.withValues(alpha: 0.22), accent.withValues(alpha: 0.05)]),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: accent.withValues(alpha: 0.25)),
      ),
      padding: const EdgeInsets.all(12),
      child: Row(
        children: [
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(color: accent.withValues(alpha: 0.18), borderRadius: BorderRadius.circular(12)),
            child: Icon(icon, color: accent),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.w900)),
                const SizedBox(height: 4),
                Text('C: ${c.toStringAsFixed(0)} | K: ${k.toStringAsFixed(0)} | Total: ${t.toStringAsFixed(0)}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _issueChart({required String title, required List<Map<String, dynamic>> data, required String xKey, required String xLabel, bool isDate = false}) {
    if (data.isEmpty) return const SizedBox.shrink();
    final pts = [...data].reversed.toList();

    String x(Map<String, dynamic> r) {
      final raw = _s(r[xKey]);
      if (isDate) return _ddMm(raw);
      return raw;
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(title, style: const TextStyle(fontWeight: FontWeight.w900)),
            const SizedBox(height: 8),
            SizedBox(
              height: 260,
              child: SfCartesianChart(
                enableAxisAnimation: false,
                tooltipBehavior: _tooltip(),
                legend: const Legend(isVisible: true, position: LegendPosition.top),
                primaryXAxis: CategoryAxis(labelRotation: -45, labelStyle: const TextStyle(fontSize: 10), title: AxisTitle(text: xLabel)),
                primaryYAxis: NumericAxis(labelStyle: const TextStyle(fontSize: 10), title: const AxisTitle(text: 'Issue')),
                series: <CartesianSeries<Map<String, dynamic>, String>>[
                  StackedColumnSeries<Map<String, dynamic>, String>(
                    name: 'PROCESS (K)',
                    animationDuration: 0,
                    dataSource: pts,
                    xValueMapper: (p, _) => x(p),
                    yValueMapper: (p, _) => _d(p['K']),
                    color: const Color(0xFFEEEB30),
                    width: 0.6,
                  ),
                  StackedColumnSeries<Map<String, dynamic>, String>(
                    name: 'MATERIAL (C)',
                    animationDuration: 0,
                    dataSource: pts,
                    xValueMapper: (p, _) => x(p),
                    yValueMapper: (p, _) => _d(p['C']),
                    color: const Color(0xFF53EB34),
                    width: 0.6,
                  ),
                  LineSeries<Map<String, dynamic>, String>(
                    name: 'TOTAL',
                    animationDuration: 0,
                    dataSource: pts,
                    xValueMapper: (p, _) => x(p),
                    yValueMapper: (p, _) => _d(p['TOTAL']),
                    color: const Color(0xFF2563EB),
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

  Widget _amountChart({
    required String title,
    required List<Map<String, dynamic>> data,
    required String xKey,
    required String xLabel,
    required String valueKey,
    bool isDate = false,
  }) {
    if (data.isEmpty) return const SizedBox.shrink();
    final pts = [...data].reversed.toList();

    String x(Map<String, dynamic> r) {
      final raw = _s(r[xKey]);
      if (isDate) return _ddMm(raw);
      return raw;
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(title, style: const TextStyle(fontWeight: FontWeight.w900)),
            const SizedBox(height: 8),
            SizedBox(
              height: 260,
              child: SfCartesianChart(
                enableAxisAnimation: false,
                tooltipBehavior: _tooltip(),
                primaryXAxis: CategoryAxis(labelRotation: -45, labelStyle: const TextStyle(fontSize: 10), title: AxisTitle(text: xLabel)),
                primaryYAxis: NumericAxis(numberFormat: NumberFormat.compact(), labelStyle: const TextStyle(fontSize: 10)),
                series: <CartesianSeries<Map<String, dynamic>, String>>[
                  ColumnSeries<Map<String, dynamic>, String>(
                    animationDuration: 0,
                    dataSource: pts,
                    xValueMapper: (p, _) => x(p),
                    yValueMapper: (p, _) => _d(p[valueKey]),
                    color: const Color(0xFF00DA5B),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _hBarChart({required String title, required List<Map<String, dynamic>> data, required String nameKey, required String valueKey}) {
    if (data.isEmpty) return const SizedBox.shrink();

    final pts = [...data];
    pts.sort((a, b) => _d(b[valueKey]).compareTo(_d(a[valueKey])));
    final top = pts.take(15).toList(growable: false);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(title, style: const TextStyle(fontWeight: FontWeight.w900)),
            const SizedBox(height: 8),
            SizedBox(
              height: 340,
              child: SfCartesianChart(
                enableAxisAnimation: false,
                isTransposed: true,
                tooltipBehavior: _tooltip(),
                primaryXAxis: CategoryAxis(labelStyle: const TextStyle(fontSize: 10), isInversed: true),
                primaryYAxis: NumericAxis(labelStyle: const TextStyle(fontSize: 10), numberFormat: NumberFormat.compact()),
                series: <CartesianSeries<Map<String, dynamic>, String>>[
                  ColumnSeries<Map<String, dynamic>, String>(
                    animationDuration: 0,
                    dataSource: top,
                    xValueMapper: (p, _) => _s(p[nameKey]),
                    yValueMapper: (p, _) => _d(p[valueKey]),
                    color: const Color(0xFF64748B),
                    dataLabelSettings: const DataLabelSettings(isVisible: true),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _rmaStackChart({required String title, required List<Map<String, dynamic>> data, required String xKey, required String xLabel, bool isDate = false}) {
    if (data.isEmpty) return const SizedBox.shrink();
    final pts = [...data].reversed.toList();

    String x(Map<String, dynamic> r) {
      final raw = _s(r[xKey]);
      if (isDate) return _ddMm(raw);
      return raw;
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(title, style: const TextStyle(fontWeight: FontWeight.w900)),
            const SizedBox(height: 8),
            SizedBox(
              height: 260,
              child: SfCartesianChart(
                enableAxisAnimation: false,
                tooltipBehavior: _tooltip(),
                legend: const Legend(isVisible: true, position: LegendPosition.top),
                primaryXAxis: CategoryAxis(labelRotation: -45, labelStyle: const TextStyle(fontSize: 10), title: AxisTitle(text: xLabel)),
                primaryYAxis: NumericAxis(numberFormat: NumberFormat.compact(), labelStyle: const TextStyle(fontSize: 10)),
                series: <CartesianSeries<Map<String, dynamic>, String>>[
                  StackedColumnSeries<Map<String, dynamic>, String>(
                    name: 'HT',
                    animationDuration: 0,
                    dataSource: pts,
                    xValueMapper: (p, _) => x(p),
                    yValueMapper: (p, _) => _d(p['HT']),
                    color: const Color(0xFF00DA5B),
                    width: 0.6,
                  ),
                  StackedColumnSeries<Map<String, dynamic>, String>(
                    name: 'CD',
                    animationDuration: 0,
                    dataSource: pts,
                    xValueMapper: (p, _) => x(p),
                    yValueMapper: (p, _) => _d(p['CD']),
                    color: const Color(0xFF41D5FA),
                    width: 0.6,
                  ),
                  StackedColumnSeries<Map<String, dynamic>, String>(
                    name: 'MD',
                    animationDuration: 0,
                    dataSource: pts,
                    xValueMapper: (p, _) => x(p),
                    yValueMapper: (p, _) => _d(p['MD']),
                    color: const Color(0xFFC0EC21),
                    width: 0.6,
                  ),
                  LineSeries<Map<String, dynamic>, String>(
                    name: 'TT',
                    animationDuration: 0,
                    dataSource: pts,
                    xValueMapper: (p, _) => x(p),
                    yValueMapper: (p, _) => _d(p['TT']),
                    color: const Color(0xFF2563EB),
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

  Widget _fcostSummary() {
    double sum(List<Map<String, dynamic>> rows, String key) {
      var t = 0.0;
      for (final r in rows) {
        t += _d(r[key]);
      }
      return t;
    }

    final rma = _dailyRma;
    final taxi = _dailyTaxi;

    final rmaHt = sum(rma, 'HT');
    final rmaCd = sum(rma, 'CD');
    final rmaMd = sum(rma, 'MD');
    final rmaTt = sum(rma, 'TT');

    final taxiAmt = sum(taxi, 'TAXI_AMOUNT');

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text('CS F-Cost Summary', style: TextStyle(fontWeight: FontWeight.w900)),
            const SizedBox(height: 10),
            DataTable(
              headingRowHeight: 30,
              dataRowMinHeight: 28,
              dataRowMaxHeight: 32,
              columns: const [
                DataColumn(label: Text('ITEM', style: TextStyle(fontWeight: FontWeight.w900))),
                DataColumn(label: Text('VALUE', style: TextStyle(fontWeight: FontWeight.w900))),
              ],
              rows: [
                DataRow(cells: [DataCell(Text('RMA HT')), DataCell(Text(NumberFormat.compact().format(rmaHt)))]),
                DataRow(cells: [DataCell(Text('RMA CD')), DataCell(Text(NumberFormat.compact().format(rmaCd)))]),
                DataRow(cells: [DataCell(Text('RMA MD')), DataCell(Text(NumberFormat.compact().format(rmaMd)))]),
                DataRow(cells: [DataCell(Text('RMA TT')), DataCell(Text(NumberFormat.compact().format(rmaTt)))]),
                DataRow(cells: [DataCell(Text('TAXI AMOUNT')), DataCell(Text(NumberFormat.compact().format(taxiAmt)))]),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
