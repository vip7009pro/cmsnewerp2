import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pluto_grid/pluto_grid.dart';

import '../../../../../../core/providers.dart';

class QtrDataTab extends ConsumerStatefulWidget {
  const QtrDataTab({super.key});

  @override
  ConsumerState<QtrDataTab> createState() => _QtrDataTabState();
}

class _QtrDataTabState extends ConsumerState<QtrDataTab> {
  bool _loading = false;
  bool _showFilter = true;

  DateTime _fromDate = DateTime.now();
  DateTime _toDate = DateTime.now();

  List<PlutoColumn> _cols = const [];
  List<PlutoRow> _plutoRows = const [];

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

  PlutoColumn _textCol(String field, String title, double width, {PlutoColumnRenderer? renderer}) {
    return PlutoColumn(
      field: field,
      title: title,
      width: width,
      minWidth: 80,
      type: PlutoColumnType.text(),
      renderer: renderer,
    );
  }

  List<PlutoColumn> _buildCols() {
    PlutoColumn coloredText(String field, String title, double width, Color Function(Map<String, dynamic> row) colorFn) {
      return _textCol(
        field,
        title,
        width,
        renderer: (ctx) {
          final raw = ctx.cell.value;
          final txt = raw == null ? '' : raw.toString();
          final c = colorFn(ctx.row.cells['__raw__']?.value as Map<String, dynamic>? ?? <String, dynamic>{});
          return Text(txt, style: TextStyle(color: c, fontWeight: FontWeight.w800, fontSize: 11));
        },
      );
    }

    return <PlutoColumn>[
      _textCol('MANAGEMENT_NUMBER', 'MANAGEMENT_NUMBER', 150),
      _textCol('REGISTERED_DATE', 'REGISTERED_DATE', 120),
      _textCol('PLANT', 'PLANT', 100),
      _textCol('MONTH_QTR', 'MONTH_QTR', 120),
      _textCol('PART_CODE', 'PART_CODE', 120),
      coloredText('QTR_PPM', 'QTR_PPM', 110, (row) {
        final whOut = _d(row['WH_OUT_QTY']);
        final ppm = _d(row['QTR_PPM']);
        final occur = _s(row['OCCUR_PLACE']);
        final isRed = whOut >= 100000 && ppm >= 500 && occur == 'Main';
        return isRed ? Colors.red : Colors.green;
      }),
      _textCol('OCCUR_PLACE', 'OCCUR_PLACE', 120),
      _textCol('DEFECT_QTY', 'DEFECT_QTY', 110),
      coloredText('WH_OUT_QTY', 'WH_OUT_QTY', 120, (_) => Colors.blue),
      coloredText('APPROVAL', 'APPROVAL', 130, (row) {
        final v = _s(row['APPROVAL']);
        return v == 'Hoàn thành' ? Colors.red : Colors.green;
      }),
      _textCol('TITLE', 'TITLE', 200),
      _textCol('PART_NAME', 'PART_NAME', 180),
      _textCol('PART_GROUP', 'PART_GROUP', 140),
      _textCol('MAIN_CATEGORY', 'MAIN_CATEGORY', 140),
      _textCol('PROJECT', 'PROJECT', 140),
      _textCol('BASIC_MODEL', 'BASIC_MODEL', 140),
      _textCol('DEFECT_DETAILS', 'DEFECT_DETAILS', 200),
      _textCol('SAMPLE_QTY', 'SAMPLE_QTY', 110),
      _textCol('DEFECT_RATE', 'DEFECT_RATE', 110),
      _textCol('APPROVER', 'APPROVER', 140),
      _textCol('APPROVAL_DATE', 'APPROVAL_DATE', 130),
      _textCol('REASON1', 'REASON1', 160),
      _textCol('G_CODE', 'G_CODE', 120),
      _textCol('CUST_CD', 'CUST_CD', 120),
      _textCol('G_NAME', 'G_NAME', 200),
      _textCol('UNIT', 'UNIT', 100),
      _textCol('PROD_TYPE', 'PROD_TYPE', 110),
      _textCol('INS_EMPL', 'INS_EMPL', 140),
      _textCol('INS_DATE', 'INS_DATE', 140),
      _textCol('UPD_DATE', 'UPD_DATE', 140),
      _textCol('UPD_EMPL', 'UPD_EMPL', 140),
      _textCol('QTR_YN', 'QTR_YN', 100),
    ];
  }

  List<PlutoRow> _buildRows(List<Map<String, dynamic>> rows, List<PlutoColumn> cols) {
    return List.generate(rows.length, (i) {
      final r = rows[i];
      final cells = <String, PlutoCell>{
        '__raw__': PlutoCell(value: r),
      };
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
    });

    try {
      final body = await _post('loadQTRData', {
        'FROM_DATE': _ymd(_fromDate),
        'TO_DATE': _ymd(_toDate),
      });

      if (_isNg(body)) {
        if (!mounted) return;
        setState(() {
          _cols = const [];
          _plutoRows = const [];
        });
        _snack('NG: ${_s(body['message'])}');
        return;
      }

      final raw = body['data'];
      final arr = raw is List ? raw : const [];
      final rows = arr.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();

      final cols = _buildCols();
      final plutoRows = _buildRows(rows, cols);
      if (!mounted) return;
      setState(() {
        _cols = cols;
        _plutoRows = plutoRows;
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
  Widget build(BuildContext context) {
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
              const Expanded(child: Text('QTR DATA', style: TextStyle(fontWeight: FontWeight.w900))),
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
                rows: _plutoRows,
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
