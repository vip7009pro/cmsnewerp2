import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pluto_grid/pluto_grid.dart';

import '../../../app/app_drawer.dart';
import '../../../core/utils/date_utils.dart';
import '../../../core/utils/excel_exporter.dart';
import '../application/hr_providers.dart';

class BaoCaoNhanSuPage extends ConsumerStatefulWidget {
  const BaoCaoNhanSuPage({super.key});

  @override
  ConsumerState<BaoCaoNhanSuPage> createState() => _BaoCaoNhanSuPageState();
}

class _BaoCaoNhanSuPageState extends ConsumerState<BaoCaoNhanSuPage> {
  late DateTime _fromDate;
  late DateTime _toDate;

  int _mainDeptCode = 0;
  int _factoryCode = 0; // 0: all, 1/2
  int _shiftCode = 6; // web default: 6 all

  PlutoGridStateManager? _fullSm;

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _fromDate = now.subtract(const Duration(days: 8));
    _toDate = now;
  }

  Future<void> _pickMainDept() async {
    final fromYmd = AppDateUtils.ymd(_fromDate);
    final maindepts = await ref.read(mainDeptListProvider(fromYmd).future);
    if (!mounted) return;

    final picked = await showModalBottomSheet<int>(
      context: context,
      showDragHandle: true,
      builder: (ctx) {
        return SafeArea(
          child: ListView(
            children: [
              ListTile(
                title: const Text('Tất cả'),
                onTap: () => Navigator.of(ctx).pop(0),
                selected: _mainDeptCode == 0,
              ),
              for (final it in maindepts)
                ListTile(
                  title: Text((it['MAINDEPTNAME'] ?? '').toString()),
                  subtitle: Text('CODE: ${(it['MAINDEPTCODE'] ?? '').toString()}'),
                  selected: _mainDeptCode == (it['MAINDEPTCODE'] ?? 0),
                  onTap: () => Navigator.of(ctx).pop(int.tryParse((it['MAINDEPTCODE'] ?? 0).toString()) ?? 0),
                ),
            ],
          ),
        );
      },
    );

    if (picked == null) return;
    setState(() => _mainDeptCode = picked);
  }

  List<Map<String, dynamic>> _selectedFullRows(List<Map<String, dynamic>> allRows) {
    final sm = _fullSm;
    if (sm == null) return const [];
    final checked = sm.checkedRows;
    if (checked.isEmpty) return const [];

    final out = <Map<String, dynamic>>[];
    for (final r in checked) {
      final raw = r.cells['__raw__']?.value;
      if (raw is Map<String, dynamic>) out.add(raw);
    }
    return out;
  }

  List<PlutoColumn> _buildPlutoColumns(List<String> fields, {Map<String, double>? widths}) {
    PlutoColumn col(String field) {
      return PlutoColumn(
        title: field,
        field: field,
        width: (widths ?? const {})[field] ?? 120,
        type: PlutoColumnType.text(),
        enableSorting: true,
        enableFilterMenuItem: true,
      );
    }

    return [
      PlutoColumn(
        title: '',
        field: '__raw__',
        type: PlutoColumnType.text(),
        width: 0,
        hide: true,
      ),
      PlutoColumn(
        title: '✓',
        field: '__check__',
        type: PlutoColumnType.text(),
        width: 44,
        enableSorting: false,
        enableFilterMenuItem: false,
        enableRowChecked: true,
      ),
      for (final f in fields) col(f),
    ];
  }

  List<PlutoRow> _buildPlutoRows(List<Map<String, dynamic>> rows, List<PlutoColumn> columns) {
    Object? val(Map<String, dynamic> it, String field) {
      if (field == '__raw__') return it;
      if (field == '__check__') return '';
      if (field == 'DATE_COLUMN') return AppDateUtils.ymdFromValue(it['DATE_COLUMN']);
      if (field == 'APPLY_DATE') return AppDateUtils.ymdFromValue(it['APPLY_DATE']);
      return (it[field] ?? '').toString();
    }

    return [
      for (final it in rows)
        PlutoRow(
          checked: false,
          cells: {
            for (final c in columns) c.field: PlutoCell(value: val(it, c.field)),
          },
        ),
    ];
  }

  List<Map<String, dynamic>> _normalizeTrendRows(List<Map<String, dynamic>> rows) {
    // Expect rows have APPLY_DATE, TOTAL_ON, TOTAL_OFF, ON_RATE. If not, compute from ON_OFF.
    final byDate = <String, Map<String, num>>{};
    for (final r in rows) {
      final d = AppDateUtils.ymdFromValue(r['APPLY_DATE']);
      if (d.isEmpty) continue;
      final cur = byDate.putIfAbsent(d, () => {'TOTAL_ON': 0, 'TOTAL_OFF': 0});

      final on = num.tryParse((r['TOTAL_ON'] ?? '').toString());
      final off = num.tryParse((r['TOTAL_OFF'] ?? '').toString());
      if (on != null || off != null) {
        cur['TOTAL_ON'] = (cur['TOTAL_ON'] ?? 0) + (on ?? 0);
        cur['TOTAL_OFF'] = (cur['TOTAL_OFF'] ?? 0) + (off ?? 0);
        continue;
      }

      final onOff = int.tryParse((r['ON_OFF'] ?? '').toString());
      if (onOff == 1) {
        cur['TOTAL_ON'] = (cur['TOTAL_ON'] ?? 0) + 1;
      } else if (onOff == 0) {
        cur['TOTAL_OFF'] = (cur['TOTAL_OFF'] ?? 0) + 1;
      }
    }

    final keys = byDate.keys.toList()..sort();
    return [
      for (final d in keys)
        {
          'APPLY_DATE': d,
          'TOTAL_ON': (byDate[d]?['TOTAL_ON'] ?? 0).toInt(),
          'TOTAL_OFF': (byDate[d]?['TOTAL_OFF'] ?? 0).toInt(),
          'ON_RATE': (() {
            final on = (byDate[d]?['TOTAL_ON'] ?? 0).toDouble();
            final off = (byDate[d]?['TOTAL_OFF'] ?? 0).toDouble();
            final total = on + off;
            if (total <= 0) return 0.0;
            return (on / total) * 100.0;
          })(),
        },
    ];
  }

  String _ddMM(String ymd) {
    try {
      if (ymd.length < 10) return ymd;
      final dt = DateTime.parse(ymd.substring(0, 10));
      return '${dt.day.toString().padLeft(2, '0')}/${dt.month.toString().padLeft(2, '0')}';
    } catch (_) {
      return ymd;
    }
  }

  Widget _trendComboChart(List<Map<String, dynamic>> historyRows) {
    // Implement as a light-weight custom painter to avoid external chart dependencies.
    // Data follows the web NSDailyGraph: stacked bars (TOTAL_ON/TOTAL_OFF) + line (ON_RATE).
    final rows = _normalizeTrendRows(historyRows);
    if (rows.isEmpty) return const Center(child: Text('Không có dữ liệu chart'));

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        SizedBox(
          height: 240,
          child: CustomPaint(
            painter: _TrendComboPainter(rows: rows, labelForX: _ddMM),
            child: const SizedBox.expand(),
          ),
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 12,
          runSpacing: 6,
          children: const [
            _ChartLegendItem(color: Color(0xFFA9EC71), label: 'Đi làm (ON)'),
            _ChartLegendItem(color: Color(0xFFFF0000), label: 'Nghỉ (OFF)'),
            _ChartLegendItem(color: Colors.green, label: 'Tỉ lệ đi làm (ON_RATE)', isLine: true),
          ],
        ),
      ],
    );
  }

  Widget _mainDeptChart(List<Map<String, dynamic>> rows) {
    // Prefer the exact keys returned by getddmaindepttb (web): COUT_ON/COUT_OFF/COUNT_TOTAL.
    return SizedBox(
      height: 260,
      child: CustomPaint(
        painter: _CategoryOnOffPainter(
          rows: rows,
          labelKey: 'MAINDEPTNAME',
          onKeys: const ['COUT_ON', 'COUNT_ON', 'TOTAL_ON'],
          offKeys: const ['COUT_OFF', 'COUNT_OFF', 'TOTAL_OFF'],
          titleLeft: 'BP',
        ),
        child: const SizedBox.expand(),
      ),
    );
  }

  Widget _subDeptChart(List<Map<String, dynamic>> rows) {
    return SizedBox(
      height: 300,
      child: CustomPaint(
        painter: _CategoryOnOffPainter(
          rows: rows,
          labelKey: 'SUBDEPTNAME',
          onKeys: const ['TOTAL_ON', 'COUNT_ON', 'COUT_ON'],
          offKeys: const ['TOTAL_OFF', 'COUNT_OFF', 'COUT_OFF'],
          titleLeft: 'Nhóm',
        ),
        child: const SizedBox.expand(),
      ),
    );
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
    final fromYmd = AppDateUtils.ymd(_fromDate);
    final toYmd = AppDateUtils.ymd(_toDate);

    final fullKey = (fromYmd, toYmd);
    final historyKey = (fromYmd, toYmd, _mainDeptCode, _shiftCode, _factoryCode);

    final diemdanhFullAsync = ref.watch(baoCaoNhanSuProvider(fullKey));
    final mainDeptListAsync = ref.watch(mainDeptListProvider(fromYmd));
    final historyAsync = ref.watch(diemDanhHistoryNhomProvider(historyKey));
    final summaryNhomAsync = ref.watch(diemDanhSummaryNhomProvider(toYmd));
    final todayYmd = AppDateUtils.ymd(DateTime.now());
    final ddMainDeptTbAsync = ref.watch(ddMainDeptTbProvider((todayYmd, todayYmd)));
    final fullSummaryAsync = ref.watch(diemDanhFullSummaryProvider((todayYmd, todayYmd)));

    return Scaffold(
      appBar: AppBar(title: const Text('Báo cáo nhân sự')),
      drawer: const AppDrawer(title: 'Menu'),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(baoCaoNhanSuProvider(fullKey));
          ref.invalidate(mainDeptListProvider(fromYmd));
          ref.invalidate(diemDanhHistoryNhomProvider(historyKey));
          ref.invalidate(diemDanhSummaryNhomProvider(toYmd));
          ref.invalidate(ddMainDeptTbProvider((todayYmd, todayYmd)));
          ref.invalidate(diemDanhFullSummaryProvider((todayYmd, todayYmd)));
        },
        child: ListView(
          padding: const EdgeInsets.all(12),
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
                          child: SingleChildScrollView(
                            scrollDirection: Axis.horizontal,
                            child: Row(
                              children: [
                            ConstrainedBox(
                              constraints: const BoxConstraints.tightFor(width: 180),
                              child: OutlinedButton.icon(
                                onPressed: _pickMainDept,
                                icon: const Icon(Icons.apartment),
                                label: Text('BP: $_mainDeptCode'),
                              ),
                            ),
                            const SizedBox(width: 8),
                            ConstrainedBox(
                              constraints: const BoxConstraints.tightFor(width: 180),
                              child: InputDecorator(
                                decoration: const InputDecoration(
                                  isDense: true,
                                  labelText: 'Nhà máy',
                                  border: OutlineInputBorder(),
                                ),
                                child: DropdownButtonHideUnderline(
                                  child: DropdownButton<int>(
                                    isDense: true,
                                    value: _factoryCode,
                                    items: const [
                                      DropdownMenuItem(value: 0, child: Text('Tất cả')),
                                      DropdownMenuItem(value: 1, child: Text('Nhà máy 1')),
                                      DropdownMenuItem(value: 2, child: Text('Nhà máy 2')),
                                    ],
                                    onChanged: (v) => setState(() => _factoryCode = v ?? 0),
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            ConstrainedBox(
                              constraints: const BoxConstraints.tightFor(width: 180),
                              child: InputDecorator(
                                decoration: const InputDecoration(
                                  isDense: true,
                                  labelText: 'Ca',
                                  border: OutlineInputBorder(),
                                ),
                                child: DropdownButtonHideUnderline(
                                  child: DropdownButton<int>(
                                    isDense: true,
                                    value: _shiftCode,
                                    items: const [
                                      DropdownMenuItem(value: 6, child: Text('Tất cả')),
                                      DropdownMenuItem(value: 1, child: Text('Ca 1')),
                                      DropdownMenuItem(value: 2, child: Text('Ca 2')),
                                      DropdownMenuItem(value: 3, child: Text('Hành chính')),
                                      DropdownMenuItem(value: 4, child: Text('Ca 1 + HC')),
                                      DropdownMenuItem(value: 5, child: Text('Ca 2 + HC')),
                                    ],
                                    onChanged: (v) => setState(() => _shiftCode = v ?? 6),
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            ConstrainedBox(
                              constraints: const BoxConstraints.tightFor(width: 180),
                              child: OutlinedButton.icon(
                                onPressed: _pickFrom,
                                icon: const Icon(Icons.date_range),
                                label: Text('From: $fromYmd'),
                              ),
                            ),
                            const SizedBox(width: 8),
                            ConstrainedBox(
                              constraints: const BoxConstraints.tightFor(width: 180),
                              child: OutlinedButton.icon(
                                onPressed: _pickTo,
                                icon: const Icon(Icons.date_range),
                                label: Text('To: $toYmd'),
                              ),
                            ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        FilledButton.icon(
                          onPressed: () {
                            ref.invalidate(baoCaoNhanSuProvider(fullKey));
                            ref.invalidate(mainDeptListProvider(fromYmd));
                            ref.invalidate(diemDanhHistoryNhomProvider(historyKey));
                            ref.invalidate(diemDanhSummaryNhomProvider(toYmd));
                            ref.invalidate(ddMainDeptTbProvider((todayYmd, todayYmd)));
                            ref.invalidate(diemDanhFullSummaryProvider((todayYmd, todayYmd)));
                          },
                          icon: const Icon(Icons.search),
                          label: const Text('Search'),
                        ),
                      ],
                    ),
                    if (mainDeptListAsync.isLoading)
                      const Padding(
                        padding: EdgeInsets.only(top: 6),
                        child: Text('Đang tải danh sách BP...', style: TextStyle(fontSize: 12, color: Colors.black54)),
                      ),
                    if (mainDeptListAsync.hasError)
                      Padding(
                        padding: const EdgeInsets.only(top: 6),
                        child: Text('Lỗi load BP: ${mainDeptListAsync.error}', style: const TextStyle(fontSize: 12, color: Colors.red)),
                      ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 12),
            Text('Biểu đồ trending đi làm', style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: historyAsync.when(
                  data: (rows) => _trendComboChart(rows),
                  error: (e, _) => Center(child: Text('Lỗi chart: $e')),
                  loading: () => const SizedBox(height: 160, child: Center(child: CircularProgressIndicator())),
                ),
              ),
            ),

            const SizedBox(height: 12),
            Text('Nhân lực bộ phận chính', style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: ddMainDeptTbAsync.when(
                  data: (rows) {
                    if (rows.isEmpty) return const Text('Không có dữ liệu');

                    final fields = const ['MAINDEPTNAME', 'COUNT_TOTAL', 'COUT_ON', 'COUT_OFF', 'COUNT_CDD', 'ON_RATE'];
                    final cols = _buildPlutoColumns(fields, widths: const {'MAINDEPTNAME': 160});
                    final rws = _buildPlutoRows(rows, cols);

                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        _mainDeptChart(rows),
                        const SizedBox(height: 10),
                        SizedBox(
                          height: 240,
                          child: PlutoGrid(
                            columns: cols,
                            rows: rws,
                            onLoaded: (e) {
                              e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                              e.stateManager.setShowColumnFilter(true);
                            },
                            configuration: const PlutoGridConfiguration(
                              columnSize: PlutoGridColumnSizeConfig(autoSizeMode: PlutoAutoSizeMode.scale),
                            ),
                          ),
                        ),
                      ],
                    );
                  },
                  error: (e, _) => Text('Lỗi: $e', style: const TextStyle(color: Colors.red)),
                  loading: () => const SizedBox(height: 60, child: Center(child: CircularProgressIndicator())),
                ),
              ),
            ),

            const SizedBox(height: 12),
            Text('Nhân lực bộ phận chính (Summary)', style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: fullSummaryAsync.when(
                  data: (rows) {
                    final fields = const ['MAINDEPTNAME', 'COUNT_TOTAL', 'COUNT_ON', 'COUNT_OFF', 'COUNT_CDD', 'ON_RATE', 'TOTAL', 'PHEP_NAM', 'NUA_PHEP'];
                    final cols = _buildPlutoColumns(fields, widths: const {'MAINDEPTNAME': 180});
                    final rws = _buildPlutoRows(rows, cols);
                    return SizedBox(
                      height: 320,
                      child: PlutoGrid(
                        columns: cols,
                        rows: rws,
                        onLoaded: (e) {
                          e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                          e.stateManager.setShowColumnFilter(true);
                        },
                        configuration: const PlutoGridConfiguration(
                          columnSize: PlutoGridColumnSizeConfig(autoSizeMode: PlutoAutoSizeMode.scale),
                        ),
                      ),
                    );
                  },
                  error: (e, _) => Text('Lỗi: $e', style: const TextStyle(color: Colors.red)),
                  loading: () => const SizedBox(height: 60, child: Center(child: CircularProgressIndicator())),
                ),
              ),
            ),

            const SizedBox(height: 12),
            Text('Nhân lực bộ phận phụ', style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: summaryNhomAsync.when(
                  data: (rows) {
                    if (rows.isEmpty) return const Text('Không có dữ liệu');

                    final fields = const ['MAINDEPTNAME', 'SUBDEPTNAME', 'TOTAL_ALL', 'TOTAL_ON', 'TOTAL_OFF', 'TOTAL_CDD', 'ON_RATE'];
                    final cols = _buildPlutoColumns(fields, widths: const {'MAINDEPTNAME': 160, 'SUBDEPTNAME': 180});
                    final rws = _buildPlutoRows(rows, cols);

                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        _subDeptChart(rows),
                        const SizedBox(height: 10),
                        SizedBox(
                          height: 320,
                          child: PlutoGrid(
                            columns: cols,
                            rows: rws,
                            onLoaded: (e) {
                              e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                              e.stateManager.setShowColumnFilter(true);
                            },
                            configuration: const PlutoGridConfiguration(
                              columnSize: PlutoGridColumnSizeConfig(autoSizeMode: PlutoAutoSizeMode.scale),
                            ),
                          ),
                        ),
                      ],
                    );
                  },
                  error: (e, _) => Text('Lỗi: $e', style: const TextStyle(color: Colors.red)),
                  loading: () => const SizedBox(height: 60, child: Center(child: CircularProgressIndicator())),
                ),
              ),
            ),

            const SizedBox(height: 12),
            Text('Lịch sử đi làm full info', style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: diemdanhFullAsync.when(
                  data: (rows) {
                    if (rows.isEmpty) return const Text('Không có dữ liệu');

                    final selected = _selectedFullRows(rows);
                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Align(
                          alignment: Alignment.centerRight,
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              OutlinedButton.icon(
                                onPressed: () => ExcelExporter.shareAsXlsx(
                                  fileName: 'baocao_nhansu_${fromYmd}_$toYmd.xlsx',
                                  rows: selected.isEmpty ? rows : selected,
                                ),
                                icon: const Icon(Icons.download),
                                label: const Text('Export Excel'),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 8),
                        Builder(
                          builder: (_) {
                            final fields = const [
                              'DATE_COLUMN',
                              'WEEKDAY',
                              'ON_OFF',
                              'APPROVAL_STATUS',
                              'EMPL_NO',
                              'CMS_ID',
                              'MIDLAST_NAME',
                              'FIRST_NAME',
                              'CA_NGHI',
                              'OVERTIME_INFO',
                              'OVERTIME',
                              'REASON_NAME',
                              'REMARK',
                              'FACTORY_NAME',
                              'WORK_SHIF_NAME',
                              'WORK_POSITION_NAME',
                              'SUBDEPTNAME',
                              'MAINDEPTNAME',
                              'REQUEST_DATE',
                              'OFF_ID',
                            ];

                            final cols = _buildPlutoColumns(fields, widths: const {
                              'DATE_COLUMN': 110,
                              'WEEKDAY': 90,
                              'MIDLAST_NAME': 170,
                              'REMARK': 170,
                              'MAINDEPTNAME': 150,
                              'SUBDEPTNAME': 150,
                            });
                            final rws = _buildPlutoRows(rows, cols);

                            return SizedBox(
                              height: 520,
                              child: PlutoGrid(
                                key: ValueKey(fullKey),
                                columns: cols,
                                rows: rws,
                                onLoaded: (e) {
                                  _fullSm = e.stateManager;
                                  e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                                  e.stateManager.setShowColumnFilter(true);
                                },
                                onRowChecked: (_) {
                                  if (!mounted) return;
                                  setState(() {});
                                },
                                configuration: const PlutoGridConfiguration(
                                  columnSize: PlutoGridColumnSizeConfig(autoSizeMode: PlutoAutoSizeMode.scale),
                                ),
                              ),
                            );
                          },
                        ),
                      ],
                    );
                  },
                  error: (e, _) => Text('Lỗi: $e', style: const TextStyle(color: Colors.red)),
                  loading: () => const SizedBox(height: 60, child: Center(child: CircularProgressIndicator())),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _TrendComboPainter extends CustomPainter {
  _TrendComboPainter({required this.rows, required this.labelForX});

  final List<Map<String, dynamic>> rows;
  final String Function(String ymd) labelForX;

  @override
  void paint(Canvas canvas, Size size) {
    final paddingLeft = 44.0;
    final paddingRight = 44.0;
    final paddingTop = 12.0;
    final paddingBottom = 34.0;
    final w = size.width;
    final h = size.height;
    final chartW = (w - paddingLeft - paddingRight).clamp(1.0, double.infinity);
    final chartH = (h - paddingTop - paddingBottom).clamp(1.0, double.infinity);

    final totalOn = <double>[];
    final totalOff = <double>[];
    final onRate = <double>[];
    final labels = <String>[];
    for (final r in rows) {
      final on = num.tryParse((r['TOTAL_ON'] ?? 0).toString()) ?? 0;
      final off = num.tryParse((r['TOTAL_OFF'] ?? 0).toString()) ?? 0;
      final rate = num.tryParse((r['ON_RATE'] ?? 0).toString()) ?? 0;
      totalOn.add(on.toDouble());
      totalOff.add(off.toDouble());
      onRate.add(rate.toDouble());
      labels.add(labelForX((r['APPLY_DATE'] ?? '').toString()));
    }

    final maxCount = () {
      var m = 1.0;
      for (var i = 0; i < totalOn.length; i++) {
        m = m < totalOn[i] + totalOff[i] ? totalOn[i] + totalOff[i] : m;
      }
      return m;
    }();

    const maxRate = 100.0;

    // Grid
    final gridPaint = Paint()
      ..color = Colors.black.withValues(alpha: 0.08)
      ..strokeWidth = 1;
    for (var i = 0; i <= 4; i++) {
      final y = paddingTop + chartH * (i / 4);
      canvas.drawLine(Offset(paddingLeft, y), Offset(w - paddingRight, y), gridPaint);
    }

    // Axis labels
    final textPainter = TextPainter(textDirection: TextDirection.ltr);
    TextStyle axisStyle(Color c) => TextStyle(color: c, fontSize: 10);

    for (var i = 0; i <= 4; i++) {
      final y = paddingTop + chartH * (i / 4);
      final leftVal = (maxCount * (1 - i / 4));
      textPainter.text = TextSpan(text: leftVal.toStringAsFixed(0), style: axisStyle(Colors.black54));
      textPainter.layout(maxWidth: paddingLeft - 4);
      textPainter.paint(canvas, Offset(paddingLeft - textPainter.width - 4, y - textPainter.height / 2));

      final rightVal = (maxRate * (1 - i / 4));
      textPainter.text = TextSpan(text: '${rightVal.toStringAsFixed(0)}%', style: axisStyle(Colors.black54));
      textPainter.layout(maxWidth: paddingRight - 4);
      textPainter.paint(canvas, Offset(w - paddingRight + 4, y - textPainter.height / 2));
    }

    final n = rows.length;
    if (n == 0) return;
    final stepX = chartW / n;
    final barW = (stepX * 0.6).clamp(6.0, 18.0);

    // Bars (stacked)
    final onPaint = Paint()..color = const Color(0xFFA9EC71); // processColor
    final offPaint = Paint()..color = const Color(0xFFFF0000); // materialColor
    for (var i = 0; i < n; i++) {
      final xCenter = paddingLeft + stepX * (i + 0.5);
      final onH = (totalOn[i] / maxCount) * chartH;
      final offH = (totalOff[i] / maxCount) * chartH;
      final baseY = paddingTop + chartH;

      final rOff = Rect.fromLTWH(xCenter - barW / 2, baseY - offH, barW, offH);
      canvas.drawRect(rOff, offPaint);
      final rOn = Rect.fromLTWH(xCenter - barW / 2, baseY - offH - onH, barW, onH);
      canvas.drawRect(rOn, onPaint);

      // X label (dd/MM)
      if (n <= 16 || i % 2 == 0) {
        textPainter.text = TextSpan(text: labels[i], style: axisStyle(Colors.black54));
        textPainter.layout(maxWidth: stepX);
        textPainter.paint(canvas, Offset(xCenter - textPainter.width / 2, paddingTop + chartH + 6));
      }
    }

    // Line (ON_RATE)
    final linePaint = Paint()
      ..color = Colors.green
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;
    final path = Path();
    for (var i = 0; i < n; i++) {
      final xCenter = paddingLeft + stepX * (i + 0.5);
      final y = paddingTop + chartH * (1 - (onRate[i] / maxRate).clamp(0, 1));
      if (i == 0) {
        path.moveTo(xCenter, y);
      } else {
        path.lineTo(xCenter, y);
      }
    }
    canvas.drawPath(path, linePaint);
  }

  @override
  bool shouldRepaint(covariant _TrendComboPainter oldDelegate) {
    return oldDelegate.rows != rows;
  }
}

class _ChartLegendItem extends StatelessWidget {
  const _ChartLegendItem({required this.color, required this.label, this.isLine = false});

  final Color color;
  final String label;
  final bool isLine;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        CustomPaint(
          size: const Size(18, 12),
          painter: _LegendMarkPainter(color: color, isLine: isLine),
        ),
        const SizedBox(width: 6),
        Text(label, style: const TextStyle(fontSize: 12, color: Colors.black87)),
      ],
    );
  }
}

class _LegendMarkPainter extends CustomPainter {
  _LegendMarkPainter({required this.color, required this.isLine});

  final Color color;
  final bool isLine;

  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()
      ..color = color
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;
    if (isLine) {
      canvas.drawLine(Offset(0, size.height / 2), Offset(size.width, size.height / 2), p);
      canvas.drawCircle(Offset(size.width * 0.6, size.height / 2), 2.3, Paint()..color = color);
    } else {
      final fill = Paint()
        ..color = color
        ..style = PaintingStyle.fill;
      canvas.drawRect(Rect.fromLTWH(0, 2, size.width, size.height - 4), fill);
    }
  }

  @override
  bool shouldRepaint(covariant _LegendMarkPainter oldDelegate) {
    return oldDelegate.color != color || oldDelegate.isLine != isLine;
  }
}

class _CategoryOnOffPainter extends CustomPainter {
  _CategoryOnOffPainter({
    required this.rows,
    required this.labelKey,
    required this.onKeys,
    required this.offKeys,
    required this.titleLeft,
  });

  final List<Map<String, dynamic>> rows;
  final String labelKey;
  final List<String> onKeys;
  final List<String> offKeys;
  final String titleLeft;

  double _readNum(Map<String, dynamic> r, List<String> keys) {
    for (final k in keys) {
      final v = num.tryParse((r[k] ?? '').toString());
      if (v != null) return v.toDouble();
    }
    return 0.0;
  }

  String _labelOf(Map<String, dynamic> r) {
    final s = (r[labelKey] ?? '').toString().trim();
    return s.isEmpty ? '-' : s;
  }

  @override
  void paint(Canvas canvas, Size size) {
    // Render top categories by total (on+off).
    final items = <({String label, double on, double off})>[];
    for (final r in rows) {
      final on = _readNum(r, onKeys);
      final off = _readNum(r, offKeys);
      if (on + off <= 0) continue;
      items.add((label: _labelOf(r), on: on, off: off));
    }
    items.sort((a, b) => (b.on + b.off).compareTo(a.on + a.off));
    final top = items.take(10).toList();
    if (top.isEmpty) return;

    final paddingLeft = 120.0;
    final paddingRight = 16.0;
    final paddingTop = 10.0;
    final paddingBottom = 12.0;
    final w = size.width;
    final h = size.height;
    final chartW = (w - paddingLeft - paddingRight).clamp(1.0, double.infinity);
    final chartH = (h - paddingTop - paddingBottom).clamp(1.0, double.infinity);

    final maxTotal = () {
      var m = 1.0;
      for (final it in top) {
        final t = it.on + it.off;
        if (t > m) m = t;
      }
      return m;
    }();

    final textPainter = TextPainter(textDirection: TextDirection.ltr, maxLines: 1, ellipsis: '…');
    final labelStyle = const TextStyle(fontSize: 11, color: Colors.black87);
    final subStyle = const TextStyle(fontSize: 10, color: Colors.black54);

    final onPaint = Paint()..color = const Color(0xFFA9EC71);
    final offPaint = Paint()..color = const Color(0xFFFF0000);
    final bgPaint = Paint()..color = Colors.black.withValues(alpha: 0.04);

    final rowH = (chartH / top.length).clamp(18.0, 28.0);
    final barH = (rowH * 0.55).clamp(10.0, 14.0);
    final startY = paddingTop + (chartH - rowH * top.length) / 2;

    for (var i = 0; i < top.length; i++) {
      final it = top[i];
      final yCenter = startY + rowH * i + rowH / 2;
      final x0 = paddingLeft;
      final total = it.on + it.off;
      final barTotalW = (total / maxTotal) * chartW;
      final offW = total <= 0 ? 0.0 : (it.off / total) * barTotalW;
      final onW = total <= 0 ? 0.0 : (it.on / total) * barTotalW;

      // Label
      textPainter.text = TextSpan(text: it.label, style: labelStyle);
      textPainter.layout(maxWidth: paddingLeft - 8);
      textPainter.paint(canvas, Offset(paddingLeft - textPainter.width - 8, yCenter - textPainter.height / 2));

      // Background
      final bg = Rect.fromLTWH(x0, yCenter - barH / 2, chartW, barH);
      canvas.drawRRect(RRect.fromRectAndRadius(bg, const Radius.circular(3)), bgPaint);

      // Bars
      final rOff = Rect.fromLTWH(x0, yCenter - barH / 2, offW, barH);
      canvas.drawRRect(RRect.fromRectAndRadius(rOff, const Radius.circular(3)), offPaint);
      final rOn = Rect.fromLTWH(x0 + offW, yCenter - barH / 2, onW, barH);
      canvas.drawRRect(RRect.fromRectAndRadius(rOn, const Radius.circular(3)), onPaint);

      // Value text
      final pct = total <= 0 ? 0.0 : (it.on / total) * 100.0;
      final valText = '${total.toStringAsFixed(0)} | ${pct.toStringAsFixed(0)}%';
      textPainter.text = TextSpan(text: valText, style: subStyle);
      textPainter.layout(maxWidth: chartW);
      textPainter.paint(canvas, Offset(x0 + barTotalW + 6, yCenter - textPainter.height / 2));
    }

    // Simple axis/legend titles
    textPainter.text = TextSpan(text: titleLeft, style: const TextStyle(fontSize: 10, color: Colors.black54));
    textPainter.layout(maxWidth: paddingLeft - 8);
    textPainter.paint(canvas, const Offset(4, 2));
  }

  @override
  bool shouldRepaint(covariant _CategoryOnOffPainter oldDelegate) {
    return oldDelegate.rows != rows || oldDelegate.labelKey != labelKey;
  }
}
