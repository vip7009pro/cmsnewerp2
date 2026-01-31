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
      final monthStart = DateTime(now.year, now.month, 1);
      final monthEnd = DateTime(now.year, now.month + 1, 1).subtract(const Duration(days: 1));

      final rows = await repo.getLichSuDiLam(fromDate: AppDateUtils.ymd(monthStart), toDate: AppDateUtils.ymd(monthEnd));
      if (!mounted) return;

      final daysInMonth = monthEnd.day;
      final todayDay = now.day;
      final byDay = <int, double>{};

      for (final row in rows) {
        final dateStr = AppDateUtils.ymdFromValue(row['DATE_COLUMN']);
        if (dateStr.length != 10) continue;

        final day = int.tryParse(dateStr.substring(8, 10));
        if (day == null || day < 1 || day > daysInMonth) continue;

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
        byDay[day] = hours;
      }

      final past = <FlSpot>[];
      final future = <FlSpot>[];
      for (var d = 1; d <= daysInMonth; d++) {
        final h = byDay[d] ?? 0.0;
        if (d < todayDay) {
          past.add(FlSpot(d.toDouble(), h));
          future.add(FlSpot(d.toDouble(), double.nan));
        } else {
          past.add(FlSpot(d.toDouble(), double.nan));
          future.add(FlSpot(d.toDouble(), h));
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

  @override
  Widget build(BuildContext context) {
    final key = (AppDateUtils.ymd(_fromDate), AppDateUtils.ymd(_toDate));
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
                            'Time line đi làm (Tháng ${DateTime.now().month.toString().padLeft(2, '0')})',
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
                        maxX: DateTime(DateTime.now().year, DateTime.now().month + 1, 1)
                            .subtract(const Duration(days: 1))
                            .day
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
                                return Padding(
                                  padding: const EdgeInsets.only(top: 4),
                                  child: Text(v.toString(), style: const TextStyle(fontSize: 10)),
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
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _pickFrom,
                    icon: const Icon(Icons.date_range),
                    label: Text('From: ${key.$1}'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _pickTo,
                    icon: const Icon(Icons.date_range),
                    label: Text('To: ${key.$2}'),
                  ),
                ),
                const SizedBox(width: 8),
                FilledButton.icon(
                  onPressed: () => ref.invalidate(lichSuDiLamProvider(key)),
                  icon: const Icon(Icons.search),
                  label: const Text('Search'),
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
    final weekday = _s('WEEKDAY');
    final onOff = int.tryParse(_s('ON_OFF'));
    final check1 = _hm(_s('CHECK1'));
    final check2 = _hm(_s('CHECK2'));
    final check3 = _hm(_s('CHECK3'));
    final lateIn = _s('LATE_IN_MINUTES');
    final earlyOut = _s('EARLY_OUT_MINUTES');
    final overtime = _s('OVERTIME_MINUTES');
    final work = _s('WORKING_MINUTES');
    final approval = int.tryParse(_s('APPROVAL_STATUS'));
    final reason = _s('REASON_NAME');
    final remark = _s('REMARK');

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

    String approvalText = '';
    if (approval == 1) approvalText = 'Phê duyệt';
    if (approval == 0) approvalText = 'Từ chối';
    if (approval == 2) approvalText = 'Chờ duyệt';

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  '$date  $weekday',
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
                ),
              ),
              Text(statusText, style: TextStyle(color: statusColor, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 4),
          Row(
            children: [
              Expanded(
                child: Text(
                  check1,
                  style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 4),
              Expanded(
                child: Text(
                  check2,
                  style: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
                  overflow: TextOverflow.ellipsis,
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(width: 4),
              Expanded(
                child: Text(
                  check3,
                  style: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
                  overflow: TextOverflow.ellipsis,
                  textAlign: TextAlign.right,
                ),
              ),
            ],
          ),
          const SizedBox(height: 2),
          Text('Late: $lateIn | Early: $earlyOut'),
          Text('Work: $work | OT: $overtime${approvalText.isEmpty ? '' : ' | $approvalText'}'),
          if (reason.isNotEmpty || remark.isNotEmpty) Text('Lý do: $reason | Remark: $remark'),
        ],
      ),
    );
  }
}
