import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fl_chart/fl_chart.dart';

import '../../../app/app_drawer.dart';
import '../../../core/utils/date_utils.dart';
import '../application/hr_providers.dart';

class LichSuDiLamPage extends ConsumerStatefulWidget {
  const LichSuDiLamPage({super.key});

  @override
  ConsumerState<LichSuDiLamPage> createState() => _LichSuDiLamPageState();
}

class _LichSuDiLamPageState extends ConsumerState<LichSuDiLamPage> {
  late DateTime _fromDate;
  late DateTime _toDate;
  bool _defaultMonth = true;

  late DateTime _chartFrom;
  late DateTime _chartTo;

  List<FlSpot> _timelinePast = const [];
  List<FlSpot> _timelineFuture = const [];
  bool _timelineLoading = false;
  String? _timelineError;

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _fromDate = DateTime(now.year, now.month, 1);
    _toDate = DateTime(now.year, now.month + 1, 1).subtract(const Duration(days: 1));

    _chartFrom = DateTime(now.year, now.month, 1);
    _chartTo = DateTime(now.year, now.month + 1, 1).subtract(const Duration(days: 1));

    Future.microtask(_loadTimeline);
  }

  Future<void> _loadTimeline() async {
    setState(() {
      _timelineLoading = true;
      _timelineError = null;
    });

    try {
      final repo = ref.read(hrRepositoryProvider);
      final now = DateTime.now();
      final todayDate = DateTime(now.year, now.month, now.day);
      final monthStart = DateTime(now.year, now.month, 1);
      final monthEnd = DateTime(now.year, now.month + 1, 1).subtract(const Duration(days: 1));
      final rawFrom = _defaultMonth ? monthStart : _chartFrom;
      final rawTo = _defaultMonth ? monthEnd : _chartTo;
      final from = rawTo.isBefore(rawFrom) ? rawTo : rawFrom;
      final to = rawTo.isBefore(rawFrom) ? rawFrom : rawTo;

      final rows = await repo.getLichSuDiLam(fromDate: AppDateUtils.ymd(from), toDate: AppDateUtils.ymd(to));
      if (!mounted) return;

      final daysInRange = (to.difference(from).inDays + 1).clamp(1, 3660);
      final byDay = <int, double>{};

      for (final row in rows) {
        final dateStr = AppDateUtils.ymdFromValue(row['DATE_COLUMN']);
        if (dateStr.length != 10) continue;

        final dt = DateTime.tryParse(dateStr);
        if (dt == null) continue;
        final delta = dt.difference(DateTime(from.year, from.month, from.day)).inDays;
        final idx = delta + 1;
        if (idx < 1 || idx > daysInRange) continue;

        final inTime = (row['IN_TIME'] ?? '').toString().trim();
        final outTime = (row['OUT_TIME'] ?? '').toString().trim();
        final inDt = _parseDateTimeLocal(dateStr, inTime);
        final outDtRaw = _parseDateTimeLocal(dateStr, outTime);
        if (inDt == null || outDtRaw == null) continue;

        var outDt = outDtRaw;
        if (outDt.isBefore(inDt)) {
          outDt = outDt.add(const Duration(days: 1));
        }

        final diffMinutes = outDt.difference(inDt).inMinutes;
        if (diffMinutes <= 0) continue;

        final workingMinutes = (diffMinutes - 60).clamp(0, 24 * 60);
        final hours = (workingMinutes / 60.0);
        byDay[idx] = hours;
      }

      final past = <FlSpot>[];
      final future = <FlSpot>[];

      for (var i = 1; i <= daysInRange; i++) {
        final h = byDay[i] ?? 0.0;
        final d = DateTime(from.year, from.month, from.day).add(Duration(days: i - 1));
        if (d.isBefore(todayDate)) {
          past.add(FlSpot(i.toDouble(), h));
        } else {
          future.add(FlSpot(i.toDouble(), h));
        }
      }

      setState(() {
        _timelinePast = past;
        _timelineFuture = future;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _timelineError = e.toString());
    } finally {
      if (mounted) {
        setState(() => _timelineLoading = false);
      }
    }
  }

  DateTime? _parseDateTimeLocal(String ymd, String time) {
    final t = time.trim();
    if (t.isEmpty || t.toUpperCase() == 'OFF') return null;

    final parts = t.split(':');
    if (parts.length < 2) return null;
    final h = int.tryParse(parts[0]);
    final m = int.tryParse(parts[1]);
    if (h == null || m == null) return null;

    final y = int.tryParse(ymd.substring(0, 4));
    final mo = int.tryParse(ymd.substring(5, 7));
    final d = int.tryParse(ymd.substring(8, 10));
    if (y == null || mo == null || d == null) return null;

    return DateTime(y, mo, d, h, m);
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
      if (!_defaultMonth) {
        _chartFrom = _fromDate;
        _chartTo = _toDate;
      }
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
    setState(() {
      _toDate = picked;
      if (!_defaultMonth) {
        _chartFrom = _fromDate;
        _chartTo = _toDate;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    final todayDate = DateTime(now.year, now.month, now.day);
    final monthStart = DateTime(now.year, now.month, 1);
    final monthEnd = DateTime(now.year, now.month + 1, 1).subtract(const Duration(days: 1));

    final listFrom = _defaultMonth ? monthStart : _fromDate;
    final listTo = _defaultMonth ? todayDate : _toDate;
    final chartFrom = _defaultMonth ? monthStart : _chartFrom;
    final chartTo = _defaultMonth ? monthEnd : _chartTo;

    final key = (AppDateUtils.ymd(listFrom), AppDateUtils.ymd(listTo));
    final dataAsync = ref.watch(lichSuDiLamProvider(key));

    return Scaffold(
      appBar: AppBar(title: const Text('Lịch sử đi làm')),
      drawer: const AppDrawer(title: 'Menu'),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(8, 8, 8, 0),
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            _defaultMonth
                                ? 'Time line đi làm (Tháng ${DateTime.now().month.toString().padLeft(2, '0')})'
                                : 'Time line đi làm (${AppDateUtils.ymd(chartFrom)} - ${AppDateUtils.ymd(chartTo)})',
                            style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
                          ),
                        ),
                        TextButton.icon(
                          onPressed: _timelineLoading ? null : _loadTimeline,
                          icon: const Icon(Icons.refresh),
                          label: const Text('Refresh'),
                        ),
                      ],
                    ),
                  if (_timelineError != null) ...[
                    const SizedBox(height: 6),
                    Text(_timelineError!, style: const TextStyle(color: Colors.red)),
                  ],
                  if (_timelineLoading) ...[
                    const SizedBox(height: 8),
                    const LinearProgressIndicator(),
                  ],
                  const SizedBox(height: 6),
                  SizedBox(
                    height: 180,
                    child: LineChart(
                      LineChartData(
                        minX: 1,
                        maxX: (chartTo.isBefore(chartFrom)
                                ? (chartFrom.difference(chartTo).inDays + 1)
                                : (chartTo.difference(chartFrom).inDays + 1))
                            .clamp(1, 3660)
                            .toDouble(),
                        minY: 0,
                        maxY: 12,
                        gridData: const FlGridData(show: true),
                        borderData: FlBorderData(show: true),
                        titlesData: FlTitlesData(
                          topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                          rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                          leftTitles: AxisTitles(
                            sideTitles: SideTitles(
                              showTitles: true,
                              reservedSize: 30,
                              interval: 3,
                              getTitlesWidget: (value, meta) {
                                return Text(value.toInt().toString(), style: const TextStyle(fontSize: 10));
                              },
                            ),
                          ),
                          bottomTitles: AxisTitles(
                            sideTitles: SideTitles(
                              showTitles: true,
                              interval: 2,
                              getTitlesWidget: (value, meta) {
                                final v = value.toInt();
                                final d = chartFrom.add(Duration(days: v - 1));
                                final dd = d.day.toString().padLeft(2, '0');
                                final mm = d.month.toString().padLeft(2, '0');
                                final isSunday = d.weekday == DateTime.sunday;
                                return Padding(
                                  padding: const EdgeInsets.only(top: 4),
                                  child: Text(
                                    '$dd/$mm',
                                    style: TextStyle(
                                      fontSize: 10,
                                      fontWeight: isSunday ? FontWeight.w800 : FontWeight.w400,
                                      color: isSunday ? const Color(0xFFB71C1C) : const Color(0xFF666666),
                                    ),
                                  ),
                                );
                              },
                            ),
                          ),
                        ),
                        lineBarsData: [
                          LineChartBarData(
                            spots: _timelinePast,
                            isCurved: false,
                            barWidth: 2,
                            color: Colors.green,
                            dotData: const FlDotData(show: false),
                          ),
                          LineChartBarData(
                            spots: _timelineFuture,
                            isCurved: false,
                            barWidth: 2,
                            color: Colors.red,
                            dotData: const FlDotData(show: false),
                          ),
                        ],
                      ),
                    ),
                  ),
                  ],
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8),
            child: Row(
              children: [
                SizedBox(
                  width: 120,
                  child: CheckboxListTile(
                    dense: true,
                    contentPadding: EdgeInsets.zero,
                    title: const Text('Default', style: TextStyle(fontSize: 12)),
                    value: _defaultMonth,
                    onChanged: (v) {
                      if (v == null) return;
                      setState(() => _defaultMonth = v);
                      if (v) {
                        final n = DateTime.now();
                        _fromDate = DateTime(n.year, n.month, 1);
                        _toDate = DateTime(n.year, n.month, n.day);

                        _chartFrom = DateTime(n.year, n.month, 1);
                        _chartTo = _toDate;
                      } else {
                        _chartFrom = _fromDate;
                        _chartTo = _toDate;
                      }
                      Future.microtask(_loadTimeline);
                      ref.invalidate(lichSuDiLamProvider(key));
                    },
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _defaultMonth ? null : _pickFrom,
                    icon: const Icon(Icons.date_range),
                    label: Text(key.$1),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _defaultMonth ? null : _pickTo,
                    icon: const Icon(Icons.date_range),
                    label: Text(key.$2),
                  ),
                ),
                const SizedBox(width: 8),
                FilledButton.icon(
                  onPressed: () {
                    setState(() {
                      if (!_defaultMonth) {
                        _chartFrom = _fromDate;
                        _chartTo = _toDate;
                      }
                    });
                    ref.invalidate(lichSuDiLamProvider(key));
                    _loadTimeline();
                  },
                  icon: const Icon(Icons.search),
                  label: const Text(''),
                ),
              ],
            ),
          ),
          const Divider(height: 1),
          Expanded(
            child: dataAsync.when(
              data: (items) {
                if (items.isEmpty) return const Center(child: Text('Không có dữ liệu'));
                return RefreshIndicator(
                  onRefresh: () async => ref.invalidate(lichSuDiLamProvider(key)),
                  child: ListView.separated(
                    itemCount: items.length,
                    separatorBuilder: (_, __) => const Divider(height: 1),
                    itemBuilder: (context, index) => _LichSuRow(item: items[index]),
                  ),
                );
              },
              error: (e, _) => Center(child: Text('Lỗi: $e')),
              loading: () => const Center(child: CircularProgressIndicator()),
            ),
          ),
        ],
      ),
    );
  }
}

class _LichSuRow extends StatelessWidget {
  const _LichSuRow({required this.item});

  final Map<String, dynamic> item;

  String _s(String key) => (item[key] ?? '').toString();

  String _hm(String raw) {
    final s = raw.trim();
    if (s.isEmpty || s.toLowerCase() == 'null') return '';

    // Already formatted
    if (RegExp(r'^\d{2}:\d{2}$').hasMatch(s)) return s;
    if (RegExp(r'^\d{2}:\d{2}:\d{2}$').hasMatch(s)) return s.substring(0, 5);

    // ISO datetime (often ends with Z). Web uses moment.utc(...).format('HH:mm')
    final dt = DateTime.tryParse(s);
    if (dt != null) {
      final u = dt.toUtc();
      return '${u.hour.toString().padLeft(2, '0')}:${u.minute.toString().padLeft(2, '0')}';
    }

    // Fallback: try to extract HH:mm from any string containing time
    final m = RegExp(r'(\d{2}):(\d{2})').firstMatch(s);
    if (m != null) return '${m.group(1)}:${m.group(2)}';
    return '';
  }

  @override
  Widget build(BuildContext context) {
    final date = AppDateUtils.ymdFromValue(item['DATE_COLUMN']);
    final onOff = int.tryParse(_s('ON_OFF'));
    final inTime = _hm(_s('CHECK1'));
    final outTime = _hm(_s('CHECK2'));

    String statusText;
    Color statusColor;
    if (onOff == 1) {
      statusText = 'Đi làm';
      statusColor = Colors.green;
    } else if (onOff == 0) {
      statusText = 'Nghỉ làm';
      statusColor = Colors.red;
    } else {
      statusText = 'Chưa điểm danh';
      statusColor = Colors.deepPurple;
    }

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
      child: Row(
        children: [
          Expanded(
            flex: 4,
            child: Text(
              date,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w700),
              overflow: TextOverflow.ellipsis,
            ),
          ),
          Expanded(
            flex: 3,
            child: Text(
              inTime,
              textAlign: TextAlign.center,
              style: const TextStyle(fontWeight: FontWeight.w700),
              overflow: TextOverflow.ellipsis,
            ),
          ),
          Expanded(
            flex: 3,
            child: Text(
              outTime,
              textAlign: TextAlign.center,
              style: const TextStyle(fontWeight: FontWeight.w700),
              overflow: TextOverflow.ellipsis,
            ),
          ),
          Expanded(
            flex: 4,
            child: Text(
              statusText,
              textAlign: TextAlign.right,
              style: TextStyle(color: statusColor, fontWeight: FontWeight.w800),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}
