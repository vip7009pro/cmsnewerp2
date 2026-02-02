import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:pluto_grid/pluto_grid.dart';

import '../../../app/app_drawer.dart';
import '../../../core/config/app_config.dart';
import '../../../core/providers.dart';

enum MrpMode { detail, summary, byPlan }

class MrpPage extends ConsumerStatefulWidget {
  const MrpPage({super.key});

  @override
  ConsumerState<MrpPage> createState() => _MrpPageState();
}

class _MrpPageState extends ConsumerState<MrpPage> {
  bool _loading = false;
  bool _showFilter = true;
  bool _gridView = true;

  MrpMode _mode = MrpMode.detail;

  DateTime _fromDate = DateTime.now();
  DateTime _toDate = DateTime.now();
  bool _allTime = false;
  bool _shortageOnly = false;
  bool _newPoOnly = false;

  List<Map<String, dynamic>> _rows = const [];
  List<PlutoColumn> _gridColumns = const [];
  List<PlutoRow> _gridRows = const [];

  PlutoGridStateManager? _gridState;

  String _s(dynamic v) => (v ?? '').toString();
  double _d(dynamic v) {
    final raw = (v ?? '').toString().trim();
    if (raw.isEmpty) return 0.0;
    final normalized = raw.replaceAll(',', '').replaceAll(RegExp(r'[^0-9\.-]'), '');
    if (normalized.isEmpty) return 0.0;
    return double.tryParse(normalized) ?? 0.0;
  }

  Future<Map<String, dynamic>> _post(String command, Map<String, dynamic> data) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(command, data: data);
    final body = res.data;
    if (body is Map<String, dynamic>) return body;
    return <String, dynamic>{'tk_status': 'NG', 'message': 'Bad response'};
  }

  bool _isNg(Map<String, dynamic> body) => (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  String _fmtDate(DateTime d) => DateFormat('yyyy-MM-dd').format(d);

  double _totalMd(Map<String, dynamic> r) {
    var sum = 0.0;
    for (var i = 1; i <= 15; i++) {
      sum += _d(r['MD$i']);
    }
    return sum;
  }

  double _shortage(Map<String, dynamic> r) {
    final totalStock = _d(r['TOTAL_STOCK']);
    final need = _totalMd(r);
    final s = need - totalStock;
    return s > 0 ? s : 0;
  }

  Future<void> _pickDate({required bool from}) async {
    final init = from ? _fromDate : _toDate;
    final picked = await showDatePicker(
      context: context,
      initialDate: init,
      firstDate: DateTime(2019, 1, 1),
      lastDate: DateTime(2100, 12, 31),
    );
    if (picked == null || !mounted) return;
    setState(() {
      if (from) {
        _fromDate = picked;
      } else {
        _toDate = picked;
      }
    });
  }

  Map<String, dynamic> _payload() {
    return {
      'CUST_NAME_KD': '',
      'M_NAME': '',
      'SHORTAGE_ONLY': _shortageOnly,
      'NEWPO': _newPoOnly,
      'FROM_DATE': _fmtDate(_fromDate),
      'TO_DATE': _fmtDate(_toDate),
      'ALLTIME': _allTime,
    };
  }

  Future<void> _load() async {
    if (!mounted) return;
    setState(() => _loading = true);

    try {
      final company = AppConfig.company;
      String command;

      if (_mode == MrpMode.byPlan) {
        command = 'loadMRPPlan';
      } else if (_mode == MrpMode.summary) {
        command = company == 'CMS' ? 'loadMaterialMRPALL' : 'loadMaterialByYCSX_ALL';
      } else {
        command = company == 'CMS' ? 'loadMaterialByPO' : 'loadMaterialByYCSX';
      }

      final data = _payload();
      if (_mode == MrpMode.byPlan) {
        data.clear();
        data['PLAN_DATE'] = _fmtDate(_fromDate);
      }

      final body = await _post(command, data);
      if (_isNg(body)) {
        setState(() {
          _loading = false;
          _rows = const [];
          _gridColumns = const [];
          _gridRows = const [];
        });
        _snack('Lỗi: ${(body['message'] ?? 'NG').toString()}');
        return;
      }

      final raw = body['data'];
      final list = (raw is List ? raw : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList();

      final cols = _buildColumns(list);
      final rws = _buildRows(list, cols);

      if (!mounted) return;
      setState(() {
        _rows = list;
        _gridColumns = cols;
        _gridRows = rws;
        _loading = false;
      });

      _snack('Đã load ${list.length} dòng');
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  List<PlutoColumn> _buildColumns(List<Map<String, dynamic>> rows) {
    final keys = <String>{};
    for (final r in rows) {
      keys.addAll(r.keys);
    }

    final preferred = <String>[
      'PROD_REQUEST_NO',
      'PROD_REQUEST_DATE',
      'CUST_CD',
      'CUST_NAME_KD',
      'G_CODE',
      'G_NAME_KD',
      'M_CODE',
      'M_NAME',
      'WIDTH_CD',
      'PO_NO',
      'PO_QTY',
      'DELIVERY_QTY',
      'PO_BALANCE',
      'PROD_REQUEST_QTY',
      'PD',
      'CAVITY_COT',
      'CAVITY_HANG',
      'CAVITY',
      'NEED_M_QTY',
      'MATERIAL_YN',
      'M_INIT_WH_STOCK',
      'M_INIT_INSP_STOCK',
      'M_INIT_BTP_STOCK',
      'RAW_M_STOCK',
      'TOTAL_STOCK',
      'STOCK_M',
      'HOLDING_M',
      'M_SHORTAGE',
      ...List<String>.generate(15, (i) => 'MD${i + 1}'),
    ];

    final fields = <String>[];
    for (final f in preferred) {
      if (keys.contains(f)) fields.add(f);
    }
    final remain = keys.difference(fields.toSet()).toList()..sort();
    fields.addAll(remain);

    Color? mdBg(Map<String, dynamic> it, String field) {
      if (!field.startsWith('MD')) return null;
      final total = _d(it['TOTAL_STOCK']);
      var sum = 0.0;
      for (var i = 1; i <= 15; i++) {
        final k = 'MD$i';
        sum += _d(it[k]);
        if (k == field) break;
      }
      if (total == 0) return const Color(0xFF12E928);
      return sum > total ? Colors.red : const Color(0xFF12E928);
    }

    TextStyle? mdText(Map<String, dynamic> it, String field) {
      final bg = mdBg(it, field);
      if (bg == null) return null;
      return TextStyle(color: bg == Colors.red ? Colors.white : Colors.black, fontWeight: FontWeight.w800);
    }

    PlutoColumn col(String field) {
      final isKeyBlue = field == 'M_NAME';
      final isYn = field == 'MATERIAL_YN';
      final isNumber = field.contains('QTY') || field.contains('STOCK') || field.contains('BALANCE') || field.startsWith('MD') || field == 'NEED_M_QTY' || field == 'M_SHORTAGE';

      return PlutoColumn(
        title: field,
        field: field,
        type: PlutoColumnType.text(),
        width: field.length <= 6 ? 90 : 120,
        enableContextMenu: false,
        enableDropToResize: true,
        renderer: (ctx) {
          final raw = ctx.row.cells['__raw__']?.value;
          final map = raw is Map<String, dynamic> ? raw : <String, dynamic>{};
          final val = ctx.cell.value;

          if (isYn) {
            final s = _s(val).toUpperCase();
            Color c;
            if (s == 'N') {
              c = Colors.red;
            } else if (s == 'Y') {
              c = Colors.green;
            } else {
              c = Colors.orange;
            }
            return Text(s, style: TextStyle(color: c, fontWeight: FontWeight.w900));
          }

          if (isKeyBlue) {
            return Text(_s(val), style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.w800));
          }

          if (field.startsWith('MD')) {
            final bg = mdBg(map, field);
            final style = mdText(map, field);
            return Container(
              color: bg,
              alignment: Alignment.centerRight,
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              child: Text(NumberFormat.decimalPattern().format(_d(val)), style: style),
            );
          }

          if (isNumber) {
            final numVal = _d(val);
            final color = numVal < 0 ? Colors.red : Colors.black;
            final style = TextStyle(color: color, fontWeight: FontWeight.w700);
            return Align(
              alignment: Alignment.centerRight,
              child: Text(NumberFormat.decimalPattern().format(numVal), style: style),
            );
          }

          return Text(_s(val));
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
      ),
      PlutoColumn(
        title: '✓',
        field: '__check__',
        type: PlutoColumnType.text(),
        width: 44,
        enableContextMenu: false,
        enableSorting: false,
        enableFilterMenuItem: false,
        enableRowChecked: true,
      ),
      ...fields.where((e) => e != '__raw__').map(col),
    ];
  }

  List<PlutoRow> _buildRows(List<Map<String, dynamic>> rows, List<PlutoColumn> columns) {
    Object? val(Map<String, dynamic> it, String field) {
      if (field == '__raw__') return it;
      if (field == '__check__') return '';
      return it[field];
    }

    return [
      for (final it in rows)
        PlutoRow(
          cells: {
            for (final c in columns) c.field: PlutoCell(value: val(it, c.field)),
          },
        ),
    ];
  }

  List<Map<String, dynamic>> _selectedRows() {
    final sm = _gridState;
    if (sm == null) return const [];
    final rows = sm.checkedRows;
    return rows
        .map((r) => r.cells['__raw__']?.value)
        .whereType<Map<String, dynamic>>()
        .map((e) => Map<String, dynamic>.from(e))
        .toList();
  }

  Future<void> _setMaterialYn(String v) async {
    final selected = _selectedRows();
    if (selected.isEmpty) {
      _snack('Chọn ít nhất 1 dòng');
      return;
    }

    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          title: Text(v == 'Y' ? 'MỞ LIỆU' : 'KHÓA LIỆU'),
          content: Text('Sẽ set MATERIAL_YN = $v cho ${selected.length} dòng được chọn'),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Hủy')),
            FilledButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('OK')),
          ],
        );
      },
    );

    if (ok != true) return;

    setState(() => _loading = true);
    try {
      var err = false;
      for (final r in selected) {
        final prNo = _s(r['PROD_REQUEST_NO']);
        if (prNo.isEmpty) continue;
        final res = await _post('setMaterial_YN', {
          'PROD_REQUEST_NO': prNo,
          'MATERIAL_YN': v,
        });
        if (_isNg(res)) err = true;
      }

      setState(() => _loading = false);
      _snack(err ? 'Có lỗi khi set' : 'SET thành công');
      await _load();
    } catch (e) {
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final canLockUnlock = AppConfig.company == 'CMS' || AppConfig.company == 'PVN';

    Widget kvTable(Map<String, dynamic> r) {
      final keys = r.keys.toList()..sort();
      return Column(
        children: [
          for (final k in keys)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 2),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(
                    width: 130,
                    child: Text(
                      k,
                      style: TextStyle(color: scheme.onSurfaceVariant, fontWeight: FontWeight.w700, fontSize: 12),
                    ),
                  ),
                  Expanded(
                    child: Text(
                      _s(r[k]),
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
                    ),
                  ),
                ],
              ),
            ),
        ],
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('MRP / Tính liệu'),
        actions: [
          IconButton(
            onPressed: () => setState(() => _showFilter = !_showFilter),
            icon: Icon(_showFilter ? Icons.filter_alt_off : Icons.filter_alt),
            tooltip: _showFilter ? 'Ẩn bộ lọc' : 'Hiện bộ lọc',
          ),
          IconButton(
            onPressed: () => setState(() => _gridView = !_gridView),
            icon: Icon(_gridView ? Icons.view_agenda : Icons.grid_on),
            tooltip: _gridView ? 'List view' : 'Grid view',
          ),
          IconButton(onPressed: _loading ? null : _load, icon: const Icon(Icons.refresh)),
        ],
      ),
      drawer: const AppDrawer(title: 'ERP'),
      body: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            if (_showFilter)
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Bộ lọc', style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          FilledButton.tonal(
                            onPressed: _loading
                                ? null
                                : () {
                                    setState(() => _mode = MrpMode.detail);
                                    _load();
                                  },
                            child: const Text('MRP DETAIL'),
                          ),
                          FilledButton.tonal(
                            onPressed: _loading
                                ? null
                                : () {
                                    setState(() => _mode = MrpMode.summary);
                                    _load();
                                  },
                            child: const Text('MRP SUMMARY'),
                          ),
                          if (AppConfig.company == 'CMS')
                            FilledButton.tonal(
                              onPressed: _loading
                                  ? null
                                  : () {
                                      setState(() => _mode = MrpMode.byPlan);
                                      _load();
                                    },
                              child: const Text('MRP BY PLAN'),
                            ),
                          if (canLockUnlock)
                            FilledButton(
                              onPressed: _loading ? null : () => _setMaterialYn('Y'),
                              style: FilledButton.styleFrom(backgroundColor: const Color(0xFF19FC51), foregroundColor: Colors.black),
                              child: const Text('MỞ LIỆU'),
                            ),
                          if (canLockUnlock)
                            FilledButton(
                              onPressed: _loading ? null : () => _setMaterialYn('N'),
                              style: FilledButton.styleFrom(backgroundColor: const Color(0xFFF80404)),
                              child: const Text('KHÓA LIỆU'),
                            ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          Expanded(
                            child: ListTile(
                              dense: true,
                              contentPadding: EdgeInsets.zero,
                              title: const Text('Từ ngày'),
                              subtitle: Text(_fmtDate(_fromDate)),
                              onTap: () => _pickDate(from: true),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: ListTile(
                              dense: true,
                              contentPadding: EdgeInsets.zero,
                              title: const Text('Tới ngày'),
                              subtitle: Text(_fmtDate(_toDate)),
                              onTap: () => _pickDate(from: false),
                            ),
                          ),
                        ],
                      ),
                      CheckboxListTile(
                        contentPadding: EdgeInsets.zero,
                        title: const Text('All Time'),
                        value: _allTime,
                        onChanged: _loading ? null : (v) => setState(() => _allTime = v ?? false),
                      ),
                      Row(
                        children: [
                          Expanded(
                            child: CheckboxListTile(
                              contentPadding: EdgeInsets.zero,
                              title: const Text('Chỉ liệu thiếu'),
                              value: _shortageOnly,
                              onChanged: _loading ? null : (v) => setState(() => _shortageOnly = v ?? false),
                            ),
                          ),
                          Expanded(
                            child: CheckboxListTile(
                              contentPadding: EdgeInsets.zero,
                              title: const Text('Chỉ PO mới'),
                              value: _newPoOnly,
                              onChanged: _loading ? null : (v) => setState(() => _newPoOnly = v ?? false),
                            ),
                          ),
                        ],
                      ),
                      SizedBox(
                        width: double.infinity,
                        child: FilledButton.icon(
                          onPressed: _loading ? null : _load,
                          icon: const Icon(Icons.search),
                          label: const Text('Load data'),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            const SizedBox(height: 12),
            Expanded(
              child: _loading
                  ? const Center(child: CircularProgressIndicator())
                  : _rows.isEmpty
                      ? Center(child: Text('Chưa có dữ liệu', style: TextStyle(color: scheme.onSurfaceVariant)))
                      : (_gridView
                          ? PlutoGrid(
                              columns: _gridColumns,
                              rows: _gridRows,
                              onLoaded: (e) {
                                _gridState = e.stateManager;
                                e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                                e.stateManager.setShowColumnFilter(true);
                              },
                              onRowChecked: (_) {
                                // keep _gridState.checkedRows in sync for MỞ/KHÓA actions
                                setState(() {});
                              },
                              onSelected: (_) {},
                              configuration: const PlutoGridConfiguration(
                                columnSize: PlutoGridColumnSizeConfig(autoSizeMode: PlutoAutoSizeMode.scale),
                                style: PlutoGridStyleConfig(
                                  enableCellBorderVertical: true,
                                  enableCellBorderHorizontal: true,
                                  rowHeight: 28,
                                  columnHeight: 28,
                                  cellTextStyle: TextStyle(fontSize: 11),
                                  columnTextStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w800),
                                ),
                              ),
                            )
                          : ListView.builder(
                              itemCount: _rows.length,
                              itemBuilder: (ctx, i) {
                                final r = _rows[i];

                                if (_mode == MrpMode.summary) {
                                  return Card(
                                    child: Padding(
                                      padding: const EdgeInsets.all(12),
                                      child: kvTable(r),
                                    ),
                                  );
                                }

                                if (_mode == MrpMode.byPlan) {
                                  final title = _s(r['M_NAME']).isEmpty ? _s(r['M_CODE']) : _s(r['M_NAME']);
                                  final vendor = _s(r['CUST_NAME_KD']);
                                  final totalStock = _d(r['TOTAL_STOCK']);
                                  final totalMd = _totalMd(r);
                                  final shortage = _shortage(r);

                                  return Card(
                                    child: Padding(
                                      padding: const EdgeInsets.all(12),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(title, style: const TextStyle(fontWeight: FontWeight.w900)),
                                          if (vendor.isNotEmpty)
                                            Padding(
                                              padding: const EdgeInsets.only(top: 2),
                                              child: Text(vendor, style: TextStyle(color: scheme.onSurfaceVariant)),
                                            ),
                                          const SizedBox(height: 8),
                                          Row(
                                            children: [
                                              Expanded(
                                                child: Text('TOTAL_STOCK: ${NumberFormat.decimalPattern().format(totalStock)}', style: const TextStyle(fontWeight: FontWeight.w800)),
                                              ),
                                              Expanded(
                                                child: Text('TOTAL_MD: ${NumberFormat.decimalPattern().format(totalMd)}', style: const TextStyle(fontWeight: FontWeight.w800)),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            'SHORTAGE: ${NumberFormat.decimalPattern().format(shortage)}',
                                            style: TextStyle(fontWeight: FontWeight.w900, color: shortage > 0 ? scheme.error : Colors.green),
                                          ),
                                        ],
                                      ),
                                    ),
                                  );
                                }

                                // DETAIL
                                final mName = _s(r['M_NAME']);
                                final title = mName.isEmpty ? _s(r['M_CODE']) : mName;
                                final cust = _s(r['CUST_NAME_KD']);
                                final gCode = _s(r['G_CODE']);
                                final gName = _s(r['G_NAME_KD']);
                                final poQty = _d(r['PO_QTY']);
                                final needQty = _d(r['NEED_M_QTY']);

                                return Card(
                                  child: Padding(
                                    padding: const EdgeInsets.all(12),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(title, style: const TextStyle(fontWeight: FontWeight.w900)),
                                        const SizedBox(height: 6),
                                        Text('G_CODE: $gCode', style: const TextStyle(fontWeight: FontWeight.w800)),
                                        Text('G_NAME_KD: $gName', style: const TextStyle(fontWeight: FontWeight.w800)),
                                        if (cust.isNotEmpty)
                                          Text('CUST_NAME_KD: $cust', style: const TextStyle(fontWeight: FontWeight.w800)),
                                        const SizedBox(height: 6),
                                        Row(
                                          children: [
                                            Expanded(
                                              child: Text(
                                                'PO_QTY: ${NumberFormat.decimalPattern().format(poQty)}',
                                                style: TextStyle(fontWeight: FontWeight.w900, color: poQty < 0 ? scheme.error : scheme.onSurface),
                                              ),
                                            ),
                                            Expanded(
                                              child: Text(
                                                'NEED_M_QTY: ${NumberFormat.decimalPattern().format(needQty)}',
                                                style: TextStyle(fontWeight: FontWeight.w900, color: needQty < 0 ? scheme.error : Colors.blue),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                );
                              },
                            )),
            ),
          ],
        ),
      ),
    );
  }
}
