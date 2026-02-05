import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:pluto_grid/pluto_grid.dart';

import '../../../../../../core/providers.dart';

class OqcDataTab extends ConsumerStatefulWidget {
  const OqcDataTab({super.key});

  @override
  ConsumerState<OqcDataTab> createState() => _OqcDataTabState();
}

class _OqcDataTabState extends ConsumerState<OqcDataTab> {
  bool _loading = false;
  bool _showFilter = true;

  DateTime _fromDate = DateTime.now();
  DateTime _toDate = DateTime.now();

  final TextEditingController _custCtrl = TextEditingController();
  final TextEditingController _ycsxCtrl = TextEditingController();
  final TextEditingController _gNameKdCtrl = TextEditingController();
  final TextEditingController _gCodeCtrl = TextEditingController();

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

  String _fmtYmd(dynamic raw) {
    final s = _s(raw).trim();
    if (s.isEmpty) return '';
    try {
      final dt = DateTime.parse(s.replaceFirst(' ', 'T'));
      final local = dt.isUtc ? dt.toLocal() : dt;
      return DateFormat('yyyy-MM-dd').format(local);
    } catch (_) {
      return s.length >= 10 ? s.substring(0, 10) : s;
    }
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

  List<PlutoColumn> _buildCols() {
    PlutoColumn col(String field, String title, double width) {
      return PlutoColumn(
        field: field,
        title: title,
        width: width,
        minWidth: 60,
        type: PlutoColumnType.text(),
        enableColumnDrag: true,
        enableContextMenu: true,
      );
    }

    return <PlutoColumn>[
      col('OQC_ID', 'OQC_ID', 70),
      col('DELIVERY_DATE', 'DELIVERY_DATE', 110),
      col('SHIFT_CODE', 'SHIFT_CODE', 90),
      col('FACTORY_NAME', 'FACTORY_NAME', 110),
      col('FULL_NAME', 'FULL_NAME', 140),
      col('CUST_NAME_KD', 'CUST_NAME_KD', 120),
      col('PROD_REQUEST_NO', 'PROD_REQUEST_NO', 140),
      col('PROCESS_LOT_NO', 'PROCESS_LOT_NO', 140),
      col('M_LOT_NO', 'M_LOT_NO', 140),
      col('LOTNCC', 'LOTNCC', 130),
      col('LABEL_ID', 'LABEL_ID', 110),
      col('PROD_REQUEST_DATE', 'YCSX_DATE', 110),
      col('PROD_REQUEST_QTY', 'YCSX_QTY', 110),
      col('G_CODE', 'G_CODE', 110),
      col('G_NAME', 'G_NAME', 220),
      col('G_NAME_KD', 'G_NAME_KD', 220),
      col('DELIVERY_QTY', 'DELIVERY_QTY', 120),
      col('SAMPLE_QTY', 'SAMPLE_QTY', 110),
      col('SAMPLE_NG_QTY', 'SAMPLE_NG_QTY', 130),
      col('PROD_LAST_PRICE', 'PROD_LAST_PRICE', 140),
      col('DELIVERY_AMOUNT', 'DELIVERY_AMOUNT', 140),
      col('SAMPLE_NG_AMOUNT', 'SAMPLE_NG_AMOUNT', 150),
      col('REMARK', 'REMARK', 160),
      col('RUNNING_COUNT', 'RUNNING_COUNT', 140),
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

  Future<void> _load() async {
    if (!mounted) return;
    setState(() {
      _loading = true;
      _showFilter = false;
    });

    try {
      final body = await _post('traOQCData', {
        'CUST_NAME_KD': _custCtrl.text.trim(),
        'PROD_REQUEST_NO': _ycsxCtrl.text.trim(),
        'G_NAME': _gNameKdCtrl.text.trim(),
        'G_CODE': _gCodeCtrl.text.trim(),
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

      for (final r in rows) {
        r['DELIVERY_DATE'] = _fmtYmd(r['DELIVERY_DATE']);
        if (r['PROD_REQUEST_DATE'] != null) {
          r['PROD_REQUEST_DATE'] = _fmtYmd(r['PROD_REQUEST_DATE']);
        }
        // normalize numbers as string for display
        for (final k in <String>[
          'DELIVERY_QTY',
          'SAMPLE_QTY',
          'SAMPLE_NG_QTY',
          'PROD_LAST_PRICE',
          'DELIVERY_AMOUNT',
          'SAMPLE_NG_AMOUNT',
          'RUNNING_COUNT',
        ]) {
          if (r.containsKey(k)) {
            final v = r[k];
            if (v is num) {
              r[k] = v.toString();
            } else if (_s(v).isNotEmpty) {
              r[k] = _d(v).toString();
            }
          }
        }
      }

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
  void initState() {
    super.initState();
    // keep empty by default (web requires click Load)
  }

  @override
  void dispose() {
    _custCtrl.dispose();
    _ycsxCtrl.dispose();
    _gNameKdCtrl.dispose();
    _gCodeCtrl.dispose();
    super.dispose();
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
              const Expanded(child: Text('OQC DATA', style: TextStyle(fontWeight: FontWeight.w900))),
              FilledButton.tonal(
                onPressed: _loading ? null : _load,
                child: const Text('Load'),
              ),
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
              SizedBox(
                width: 220,
                child: TextField(
                  controller: _gNameKdCtrl,
                  decoration: const InputDecoration(labelText: 'Code KD (G_NAME)', border: OutlineInputBorder()),
                  onSubmitted: (_) => _load(),
                ),
              ),
              SizedBox(
                width: 180,
                child: TextField(
                  controller: _gCodeCtrl,
                  decoration: const InputDecoration(labelText: 'Code ERP (G_CODE)', border: OutlineInputBorder()),
                  onSubmitted: (_) => _load(),
                ),
              ),
              SizedBox(
                width: 200,
                child: TextField(
                  controller: _ycsxCtrl,
                  decoration: const InputDecoration(labelText: 'YCSX (PROD_REQUEST_NO)', border: OutlineInputBorder()),
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
