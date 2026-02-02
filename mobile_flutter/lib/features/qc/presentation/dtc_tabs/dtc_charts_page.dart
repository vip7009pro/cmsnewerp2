import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:syncfusion_flutter_charts/charts.dart';

class DtcChartsPage extends StatelessWidget {
  const DtcChartsPage({
    super.key,
    required this.selectedRow,
    required this.xbar,
    required this.cpk,
    required this.histogram,
    required this.title,
  });

  final String title;
  final Map<String, dynamic> selectedRow;
  final List<Map<String, dynamic>> xbar;
  final List<Map<String, dynamic>> cpk;
  final List<Map<String, dynamic>> histogram;

  double _d(dynamic v) {
    final raw = (v ?? '').toString().trim();
    if (raw.isEmpty) return 0.0;
    final normalized = raw.replaceAll(',', '').replaceAll(RegExp(r'[^0-9\.-]'), '');
    if (normalized.isEmpty) return 0.0;
    return double.tryParse(normalized) ?? 0.0;
  }

  String _s(dynamic v) => (v ?? '').toString();

  @override
  Widget build(BuildContext context) {
    final tooltip = TooltipBehavior(enable: true);

    Widget kv(String k, String v) {
      if (v.trim().isEmpty) return const SizedBox.shrink();
      return Padding(
        padding: const EdgeInsets.only(bottom: 4),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              width: 110,
              child: Text(
                k,
                style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontWeight: FontWeight.w800, fontSize: 12),
              ),
            ),
            Expanded(
              child: Text(
                v,
                style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 12),
              ),
            ),
          ],
        ),
      );
    }

    final header = Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            kv('DTC_ID', _s(selectedRow['DTC_ID'])),
            kv('TEST_NAME', _s(selectedRow['TEST_NAME'])),
            kv('POINT_CODE', _s(selectedRow['POINT_CODE'])),
            kv('G_CODE', _s(selectedRow['G_CODE'])),
            kv('G_NAME', _s(selectedRow['G_NAME'])),
            kv('M_CODE', _s(selectedRow['M_CODE'])),
            kv('M_NAME', _s(selectedRow['M_NAME'])),
            kv('CENTER_VALUE', NumberFormat.decimalPattern().format(_d(selectedRow['CENTER_VALUE']))),
            kv('UPPER_TOR', NumberFormat.decimalPattern().format(_d(selectedRow['UPPER_TOR']))),
            kv('LOWER_TOR', NumberFormat.decimalPattern().format(_d(selectedRow['LOWER_TOR']))),
          ],
        ),
      ),
    );

    return DefaultTabController(
      length: 4,
      child: Scaffold(
        appBar: AppBar(
          title: Text(title),
          bottom: const TabBar(
            isScrollable: true,
            tabs: [
              Tab(text: 'XBAR'),
              Tab(text: 'R'),
              Tab(text: 'CPK'),
              Tab(text: 'HIST'),
            ],
          ),
        ),
        body: Column(
          children: [
            header,
            Expanded(
              child: TabBarView(
                children: [
                  _XbarChart(data: xbar, tooltip: tooltip, d: _d, s: _s),
                  _RChart(data: xbar, tooltip: tooltip, d: _d, s: _s),
                  _CpkChart(data: cpk, tooltip: tooltip, d: _d, s: _s),
                  _HistogramChart(data: histogram, tooltip: tooltip, d: _d, s: _s),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _XbarPoint {
  _XbarPoint({required this.grp, required this.avg, required this.ucl, required this.lcl, required this.cl});

  final String grp;
  final double avg;
  final double ucl;
  final double lcl;
  final double cl;
}

class _XbarChart extends StatelessWidget {
  const _XbarChart({required this.data, required this.tooltip, required this.d, required this.s});

  final List<Map<String, dynamic>> data;
  final TooltipBehavior tooltip;
  final double Function(dynamic) d;
  final String Function(dynamic) s;

  @override
  Widget build(BuildContext context) {
    if (data.isEmpty) return const Center(child: Text('No data'));

    final pts = data
        .map((e) => _XbarPoint(
              grp: s(e['GRP_ID']),
              avg: d(e['AVG_VALUE']),
              ucl: d(e['X_UCL']),
              lcl: d(e['X_LCL']),
              cl: d(e['X_CL']),
            ))
        .toList();

    final minY = pts.map((e) => e.lcl).fold<double>(pts.first.lcl, (p, v) => v < p ? v : p);
    final maxY = pts.map((e) => e.ucl).fold<double>(pts.first.ucl, (p, v) => v > p ? v : p);

    return Padding(
      padding: const EdgeInsets.all(12),
      child: SfCartesianChart(
        primaryXAxis: CategoryAxis(labelRotation: -45),
        primaryYAxis: NumericAxis(minimum: minY, maximum: maxY, numberFormat: NumberFormat.compact()),
        tooltipBehavior: tooltip,
        legend: const Legend(isVisible: true, position: LegendPosition.top),
        series: <CartesianSeries<_XbarPoint, String>>[
          LineSeries<_XbarPoint, String>(
            name: 'XBAR',
            dataSource: pts,
            xValueMapper: (p, _) => p.grp,
            yValueMapper: (p, _) => p.avg,
            color: Colors.green,
          ),
          LineSeries<_XbarPoint, String>(
            name: 'X_UCL',
            dataSource: pts,
            xValueMapper: (p, _) => p.grp,
            yValueMapper: (p, _) => p.ucl,
            color: Colors.red,
            dashArray: const [6, 4],
          ),
          LineSeries<_XbarPoint, String>(
            name: 'X_LCL',
            dataSource: pts,
            xValueMapper: (p, _) => p.grp,
            yValueMapper: (p, _) => p.lcl,
            color: Colors.red,
            dashArray: const [6, 4],
          ),
          LineSeries<_XbarPoint, String>(
            name: 'X_CL',
            dataSource: pts,
            xValueMapper: (p, _) => p.grp,
            yValueMapper: (p, _) => p.cl,
            color: Colors.blue,
            dashArray: const [6, 4],
          ),
        ],
      ),
    );
  }
}

class _RPoint {
  _RPoint({required this.grp, required this.r, required this.ucl, required this.lcl, required this.cl});

  final String grp;
  final double r;
  final double ucl;
  final double lcl;
  final double cl;
}

class _RChart extends StatelessWidget {
  const _RChart({required this.data, required this.tooltip, required this.d, required this.s});

  final List<Map<String, dynamic>> data;
  final TooltipBehavior tooltip;
  final double Function(dynamic) d;
  final String Function(dynamic) s;

  @override
  Widget build(BuildContext context) {
    if (data.isEmpty) return const Center(child: Text('No data'));

    final pts = data
        .map((e) => _RPoint(
              grp: s(e['GRP_ID']),
              r: d(e['R_VALUE']),
              ucl: d(e['R_UCL']),
              lcl: d(e['R_LCL']),
              cl: d(e['R_CL']),
            ))
        .toList();

    final minY = pts.map((e) => e.lcl).fold<double>(pts.first.lcl, (p, v) => v < p ? v : p);
    final maxY = pts.map((e) => e.ucl).fold<double>(pts.first.ucl, (p, v) => v > p ? v : p);

    return Padding(
      padding: const EdgeInsets.all(12),
      child: SfCartesianChart(
        primaryXAxis: CategoryAxis(labelRotation: -45),
        primaryYAxis: NumericAxis(minimum: minY, maximum: maxY, numberFormat: NumberFormat.compact()),
        tooltipBehavior: tooltip,
        legend: const Legend(isVisible: true, position: LegendPosition.top),
        series: <CartesianSeries<_RPoint, String>>[
          LineSeries<_RPoint, String>(
            name: 'R',
            dataSource: pts,
            xValueMapper: (p, _) => p.grp,
            yValueMapper: (p, _) => p.r,
            color: Colors.green,
          ),
          LineSeries<_RPoint, String>(
            name: 'R_UCL',
            dataSource: pts,
            xValueMapper: (p, _) => p.grp,
            yValueMapper: (p, _) => p.ucl,
            color: Colors.red,
            dashArray: const [6, 4],
          ),
          LineSeries<_RPoint, String>(
            name: 'R_LCL',
            dataSource: pts,
            xValueMapper: (p, _) => p.grp,
            yValueMapper: (p, _) => p.lcl,
            color: Colors.red,
            dashArray: const [6, 4],
          ),
          LineSeries<_RPoint, String>(
            name: 'R_CL',
            dataSource: pts,
            xValueMapper: (p, _) => p.grp,
            yValueMapper: (p, _) => p.cl,
            color: Colors.blue,
            dashArray: const [6, 4],
          ),
        ],
      ),
    );
  }
}

class _CpkPoint {
  _CpkPoint({required this.grp, required this.cpk, required this.cpk1, required this.cpk2});

  final String grp;
  final double cpk;
  final double cpk1;
  final double cpk2;
}

class _CpkChart extends StatelessWidget {
  const _CpkChart({required this.data, required this.tooltip, required this.d, required this.s});

  final List<Map<String, dynamic>> data;
  final TooltipBehavior tooltip;
  final double Function(dynamic) d;
  final String Function(dynamic) s;

  @override
  Widget build(BuildContext context) {
    if (data.isEmpty) return const Center(child: Text('No data'));

    final pts = data
        .map((e) => _CpkPoint(
              grp: s(e['GRP_ID']),
              cpk: d(e['CPK']),
              cpk1: d(e['CPK1']),
              cpk2: d(e['CPK2']),
            ))
        .toList();

    final maxY = pts.map((e) => e.cpk).fold<double>(pts.first.cpk, (p, v) => v > p ? v : p);
    final maxLine = [maxY, pts.first.cpk1, pts.first.cpk2].reduce((a, b) => a > b ? a : b);

    return Padding(
      padding: const EdgeInsets.all(12),
      child: SfCartesianChart(
        primaryXAxis: CategoryAxis(labelRotation: -45),
        primaryYAxis: NumericAxis(minimum: 0, maximum: maxLine == 0 ? 1 : maxLine, numberFormat: NumberFormat.compact()),
        tooltipBehavior: tooltip,
        legend: const Legend(isVisible: true, position: LegendPosition.top),
        series: <CartesianSeries<_CpkPoint, String>>[
          LineSeries<_CpkPoint, String>(
            name: 'CPK',
            dataSource: pts,
            xValueMapper: (p, _) => p.grp,
            yValueMapper: (p, _) => p.cpk,
            color: Colors.green,
          ),
          LineSeries<_CpkPoint, String>(
            name: 'CPK1',
            dataSource: pts,
            xValueMapper: (p, _) => p.grp,
            yValueMapper: (p, _) => p.cpk1,
            color: Colors.red,
            dashArray: const [6, 4],
          ),
          LineSeries<_CpkPoint, String>(
            name: 'CPK2',
            dataSource: pts,
            xValueMapper: (p, _) => p.grp,
            yValueMapper: (p, _) => p.cpk2,
            color: Colors.red,
            dashArray: const [6, 4],
          ),
        ],
      ),
    );
  }
}

class _HistPoint {
  _HistPoint({required this.result, required this.cnt});

  final String result;
  final double cnt;
}

class _HistogramChart extends StatelessWidget {
  const _HistogramChart({required this.data, required this.tooltip, required this.d, required this.s});

  final List<Map<String, dynamic>> data;
  final TooltipBehavior tooltip;
  final double Function(dynamic) d;
  final String Function(dynamic) s;

  @override
  Widget build(BuildContext context) {
    if (data.isEmpty) return const Center(child: Text('No data'));

    final pts = data
        .map((e) => _HistPoint(
              result: s(e['RESULT']),
              cnt: d(e['CNT']),
            ))
        .toList();

    final maxY = pts.map((e) => e.cnt).fold<double>(pts.first.cnt, (p, v) => v > p ? v : p);

    return Padding(
      padding: const EdgeInsets.all(12),
      child: SfCartesianChart(
        primaryXAxis: CategoryAxis(labelRotation: -45),
        primaryYAxis: NumericAxis(minimum: 0, maximum: maxY == 0 ? 1 : maxY, numberFormat: NumberFormat.compact()),
        tooltipBehavior: tooltip,
        legend: const Legend(isVisible: true, position: LegendPosition.top),
        series: <CartesianSeries<_HistPoint, String>>[
          ColumnSeries<_HistPoint, String>(
            name: 'CNT',
            dataSource: pts,
            xValueMapper: (p, _) => p.result,
            yValueMapper: (p, _) => p.cnt,
            color: const Color(0xFF3B58DB),
          ),
          LineSeries<_HistPoint, String>(
            name: 'CNT_LINE',
            dataSource: pts,
            xValueMapper: (p, _) => p.result,
            yValueMapper: (p, _) => p.cnt,
            color: Colors.green,
          ),
        ],
      ),
    );
  }
}
