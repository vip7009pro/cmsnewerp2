import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:pluto_grid/pluto_grid.dart';

import '../../../../../core/providers.dart';

class InspectionDataTab extends ConsumerStatefulWidget {
  const InspectionDataTab({super.key});

  @override
  ConsumerState<InspectionDataTab> createState() => _InspectionDataTabState();
}

class _InspectionDataTabState extends ConsumerState<InspectionDataTab> {
  bool _loading = false;
  bool _showFilter = true;

  DateTime _fromDate = DateTime.now();
  DateTime _toDate = DateTime.now();
  bool _allTime = false;

  String _option = 'Nhập Kiểm (LOT)';

  final TextEditingController _codeKdCtrl = TextEditingController();
  final TextEditingController _codeCmsCtrl = TextEditingController();
  final TextEditingController _emplCtrl = TextEditingController();
  final TextEditingController _custCtrl = TextEditingController();
  final TextEditingController _processLotCtrl = TextEditingController();
  final TextEditingController _prodTypeCtrl = TextEditingController();
  final TextEditingController _ycsxCtrl = TextEditingController();

  List<PlutoColumn> _cols = const [];
  List<PlutoRow> _rows = const [];

  ScaffoldMessengerState? _messenger;

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

  String _ymdHms(String s) {
    final raw = s.trim();
    if (raw.isEmpty) return raw;
    DateTime? dt;
    try {
      dt = DateTime.parse(raw.replaceFirst(' ', 'T'));
    } catch (_) {
      try {
        dt = DateTime.parse(raw);
      } catch (_) {
        dt = null;
      }
    }
    if (dt == null) return raw;
    final local = dt.isUtc ? dt.toLocal() : dt;
    return DateFormat('yyyy-MM-dd HH:mm:ss').format(local);
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

  Map<String, dynamic> _payloadBase() {
    return {
      'ALLTIME': _allTime,
      'FROM_DATE': _ymd(_fromDate),
      'TO_DATE': _ymd(_toDate),
      'CUST_NAME': _custCtrl.text.trim(),
      'process_lot_no': _processLotCtrl.text.trim(),
      'G_CODE': _codeCmsCtrl.text.trim(),
      'G_NAME': _codeKdCtrl.text.trim(),
      'PROD_TYPE': _prodTypeCtrl.text.trim(),
      'EMPL_NAME': _emplCtrl.text.trim(),
      'PROD_REQUEST_NO': _ycsxCtrl.text.trim(),
    };
  }

  List<PlutoColumn> _autoColumns(List<Map<String, dynamic>> rows) {
    if (rows.isEmpty) return const [];

    PlutoColumn col(String field) {
      return PlutoColumn(
        field: field,
        title: field,
        type: PlutoColumnType.text(),
        minWidth: 80,
        width: 130,
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

  Future<void> _load() async {
    if (!mounted) return;
    setState(() {
      _loading = true;
      _showFilter = false;
      _cols = const [];
      _rows = const [];
    });

    try {
      final payload = _payloadBase();

      late final String cmd;
      Map<String, dynamic> data;
      if (_option == 'Chờ Kiểm (Gộp)') {
        cmd = 'loadChoKiemGop_NEW';
        data = payload;
      } else if (_option == 'Inspection Patrol') {
        cmd = 'loadInspectionPatrol';
        data = payload;
      } else {
        cmd = 'get_inspection';
        data = {
          ...payload,
          'OPTIONS': _option,
        };
      }

      final body = await _post(cmd, data);
      if (_isNg(body)) {
        _snack('NG: ${_s(body['message'])}');
        return;
      }

      final raw = body['data'];
      final arr = raw is List ? raw : const [];
      final rows = arr.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();

      // Basic normalization for common datetime fields in this module
      const timeKeys = <String>{
        'INPUT_DATETIME',
        'OUTPUT_DATETIME',
        'PROD_DATETIME',
        'INSPECT_DATETIME',
        'INSPECT_START_TIME',
        'INSPECT_FINISH_TIME',
      };
      for (final r in rows) {
        for (final k in timeKeys) {
          if (r[k] != null && _s(r[k]).isNotEmpty) {
            r[k] = _ymdHms(_s(r[k]));
          }
        }
        // Some numeric fields might come as strings; keep them as text for now.
        for (final k in r.keys.toList()) {
          final v = r[k];
          if (v is num) continue;
          final sv = _s(v);
          if (sv.isEmpty) continue;
          if (sv.length <= 20 && RegExp(r'^-?[0-9]+(\.[0-9]+)?$').hasMatch(sv)) {
            // keep as string; Pluto text column
            r[k] = sv;
          } else if (sv.contains(',') && _d(sv) != 0) {
            r[k] = _d(sv).toString();
          }
        }
      }

      final cols = _autoColumns(rows);
      final pr = _toPlutoRows(rows, cols);

      if (!mounted) return;
      setState(() {
        _cols = cols;
        _rows = pr;
      });
      _snack('Đã load ${rows.length} dòng');
    } catch (e) {
      _snack('Lỗi: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _messenger = ScaffoldMessenger.maybeOf(context);
  }

  @override
  void dispose() {
    _codeKdCtrl.dispose();
    _codeCmsCtrl.dispose();
    _emplCtrl.dispose();
    _custCtrl.dispose();
    _processLotCtrl.dispose();
    _prodTypeCtrl.dispose();
    _ycsxCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

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
              const Expanded(child: Text('INSPECTION DATA', style: TextStyle(fontWeight: FontWeight.w900))),
              FilledButton.tonal(onPressed: _loading ? null : _load, child: const Text('Load')),
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
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Checkbox(
                    value: _allTime,
                    onChanged: _loading ? null : (v) => setState(() => _allTime = v ?? false),
                  ),
                  const Text('All time'),
                ],
              ),
              DropdownButton<String>(
                value: _option,
                style: TextStyle(color: scheme.onSurface, fontWeight: FontWeight.w700),
                dropdownColor: scheme.surface,
                iconEnabledColor: scheme.onSurface,
                items: const [
                  DropdownMenuItem(value: 'Nhập Kiểm (LOT)', child: Text('Nhập Kiểm (LOT)')),
                  DropdownMenuItem(value: 'Xuất Kiểm (LOT)', child: Text('Xuất Kiểm (LOT)')),
                  DropdownMenuItem(value: 'Nhật Ký Kiểm Tra', child: Text('Nhật Ký Kiểm Tra')),
                  DropdownMenuItem(value: 'Nhập Xuất Kiểm (YCSX)', child: Text('Nhập Xuất Kiểm (YCSX)')),
                  DropdownMenuItem(value: 'Chờ Kiểm (Gộp)', child: Text('Chờ Kiểm (Gộp)')),
                  DropdownMenuItem(value: 'Inspection Patrol', child: Text('Inspection Patrol')),
                ],
                onChanged: _loading
                    ? null
                    : (v) {
                        if (v == null) return;
                        setState(() => _option = v);
                      },
              ),
              SizedBox(
                width: 220,
                child: TextField(
                  controller: _codeKdCtrl,
                  decoration: const InputDecoration(labelText: 'Code KD (G_NAME)', border: OutlineInputBorder()),
                  onSubmitted: (_) => _load(),
                ),
              ),
              SizedBox(
                width: 160,
                child: TextField(
                  controller: _codeCmsCtrl,
                  decoration: const InputDecoration(labelText: 'Code CMS (G_CODE)', border: OutlineInputBorder()),
                  onSubmitted: (_) => _load(),
                ),
              ),
              SizedBox(
                width: 180,
                child: TextField(
                  controller: _ycsxCtrl,
                  decoration: const InputDecoration(labelText: 'YCSX', border: OutlineInputBorder()),
                  onSubmitted: (_) => _load(),
                ),
              ),
              SizedBox(
                width: 180,
                child: TextField(
                  controller: _custCtrl,
                  decoration: const InputDecoration(labelText: 'Customer', border: OutlineInputBorder()),
                  onSubmitted: (_) => _load(),
                ),
              ),
              SizedBox(
                width: 160,
                child: TextField(
                  controller: _emplCtrl,
                  decoration: const InputDecoration(labelText: 'Nhân viên', border: OutlineInputBorder()),
                  onSubmitted: (_) => _load(),
                ),
              ),
              SizedBox(
                width: 160,
                child: TextField(
                  controller: _processLotCtrl,
                  decoration: const InputDecoration(labelText: 'LOT SX', border: OutlineInputBorder()),
                  onSubmitted: (_) => _load(),
                ),
              ),
              SizedBox(
                width: 120,
                child: TextField(
                  controller: _prodTypeCtrl,
                  decoration: const InputDecoration(labelText: 'Loại', border: OutlineInputBorder()),
                  onSubmitted: (_) => _load(),
                ),
              ),
            ],
          ),
        ),
      );
    }

    Widget grid() {
      return Card(
        margin: EdgeInsets.zero,
        child: _cols.isEmpty
            ? const Center(child: Text('Chưa có dữ liệu'))
            : PlutoGrid(
                columns: _cols,
                rows: _rows,
                onLoaded: (e) => e.stateManager.setShowColumnFilter(true),
                configuration: _gridConfig(),
              ),
      );
    }

    return Padding(
      padding: const EdgeInsets.all(8),
      child: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(child: header()),
          SliverToBoxAdapter(child: filter()),
          if (_loading) const SliverToBoxAdapter(child: LinearProgressIndicator()),
          SliverFillRemaining(hasScrollBody: true, child: grid()),
        ],
      ),
    );
  }
}
