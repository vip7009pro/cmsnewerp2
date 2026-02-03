import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pluto_grid/pluto_grid.dart';

import '../../../app/app_drawer.dart';
import '../../../core/config/app_config.dart';
import '../../../core/providers.dart';

enum KhoTpMode {
  nhapKho,
  xuatKho,
  xuatPack,
  tonTheoGCode,
  tonTheoCodeKd,
  tonTheoViTri,
}

class NhapXuatTonTpPage extends ConsumerStatefulWidget {
  const NhapXuatTonTpPage({super.key});

  @override
  ConsumerState<NhapXuatTonTpPage> createState() => _NhapXuatTonTpPageState();
}

class _NhapXuatTonTpPageState extends ConsumerState<NhapXuatTonTpPage> {
  bool _loading = false;
  bool _showFilter = true;

  DateTime _fromDate = DateTime.now();
  DateTime _toDate = DateTime.now();

  final TextEditingController _codeKdCtrl = TextEditingController();
  final TextEditingController _codeErpCtrl = TextEditingController();
  final TextEditingController _custNameCtrl = TextEditingController();

  bool _allTime = false;
  bool _capBu = false;
  bool _justBalance = true;

  KhoTpMode _mode = KhoTpMode.nhapKho;

  String _summary = '';

  List<Map<String, dynamic>> _rows = const [];
  List<PlutoColumn> _cols = const [];
  List<PlutoRow> _plutoRows = const [];

  String _s(dynamic v) => (v ?? '').toString();
  num _num(dynamic v) => (v is num) ? v : (num.tryParse(_s(v)) ?? 0);

  @override
  void dispose() {
    _codeKdCtrl.dispose();
    _codeErpCtrl.dispose();
    _custNameCtrl.dispose();
    super.dispose();
  }

  bool _isNg(Map<String, dynamic> body) => (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  Future<Map<String, dynamic>> _post(String command, Map<String, dynamic> data) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(command, data: data);
    final body = res.data;
    if (body is Map<String, dynamic>) return body;
    return <String, dynamic>{'tk_status': 'NG', 'message': 'Bad response'};
  }

  String _ymd(DateTime dt) {
    final y = dt.year.toString().padLeft(4, '0');
    final m = dt.month.toString().padLeft(2, '0');
    final d = dt.day.toString().padLeft(2, '0');
    return '$y-$m-$d';
  }

  Future<void> _pickDate({required bool isFrom}) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: isFrom ? _fromDate : _toDate,
      firstDate: DateTime(2020, 1, 1),
      lastDate: DateTime(2100, 12, 31),
    );
    if (picked == null) return;
    setState(() {
      if (isFrom) {
        _fromDate = picked;
      } else {
        _toDate = picked;
      }
    });
  }

  List<String> _preferredFieldsForMode(KhoTpMode mode) {
    switch (mode) {
      case KhoTpMode.nhapKho:
      case KhoTpMode.xuatKho:
        return const [
          'G_CODE',
          'G_NAME',
          'G_NAME_KD',
          'CUST_NAME_KD',
          'Customer_ShortName',
          'IO_Date',
          'INPUT_DATETIME',
          'IO_Shift',
          'IO_Type',
          'IO_Status',
          'IO_Qty',
          'IO_Note',
          'IO_Number',
        ];
      case KhoTpMode.xuatPack:
        return const [
          'G_CODE',
          'G_NAME',
          'G_NAME_KD',
          'PROD_MODEL',
          'OutID',
          'CUST_NAME_KD',
          'Customer_SortName',
          'OUT_DATE',
          'OUT_DATETIME',
          'Out_Qty',
          'SX_DATE',
          'INSPECT_LOT_NO',
          'PROCESS_LOT_NO',
          'M_LOT_NO',
          'LOTNCC',
          'M_NAME',
          'WIDTH_CD',
          'SX_EMPL',
          'LINEQC_EMPL',
          'INSPECT_EMPL',
          'EXP_DATE',
          'Outtype',
          'PLAN_ID',
          'PROD_REQUEST_NO',
        ];
      case KhoTpMode.tonTheoGCode:
        return const [
          'G_CODE',
          'G_NAME',
          'G_NAME_KD',
          'CHO_KIEM',
          'CHO_CS_CHECK',
          'CHO_KIEM_RMA',
          'TONG_TON_KIEM',
          'BTP',
          'TON_TP',
          'PENDINGXK',
          'TON_TPTT',
          'BLOCK_QTY',
          'GRAND_TOTAL_STOCK',
        ];
      case KhoTpMode.tonTheoCodeKd:
        return const [
          'G_NAME_KD',
          'CHO_KIEM',
          'CHO_CS_CHECK',
          'CHO_KIEM_RMA',
          'TONG_TON_KIEM',
          'BTP',
          'TON_TP',
          'PENDINGXK',
          'TON_TPTT',
          'BLOCK_QTY',
          'GRAND_TOTAL_STOCK',
        ];
      case KhoTpMode.tonTheoViTri:
        return const [
          'KHO_NAME',
          'LC_NAME',
          'G_CODE',
          'G_NAME',
          'G_NAME_KD',
          'NHAPKHO',
          'XUATKHO',
          'TONKHO',
          'BLOCK_QTY',
          'GRAND_TOTAL_TP',
        ];
    }
  }

  List<PlutoColumn> _buildColumns(List<Map<String, dynamic>> rows, KhoTpMode mode) {
    if (rows.isEmpty) return const [];

    final keys = rows.first.keys.map((e) => e.toString()).toSet();
    final preferred = _preferredFieldsForMode(mode);

    final ordered = <String>[];
    for (final f in preferred) {
      if (keys.contains(f)) ordered.add(f);
    }
    for (final k in keys) {
      if (!ordered.contains(k)) ordered.add(k);
    }

    PlutoColumn c(String f) {
      final isNum = rows.any((r) => r[f] is num);
      return PlutoColumn(
        title: f,
        field: f,
        type: isNum ? PlutoColumnType.number() : PlutoColumnType.text(),
        width: 140,
        enableSorting: true,
        enableFilterMenuItem: true,
      );
    }

    return [
      PlutoColumn(title: '', field: '__raw__', type: PlutoColumnType.text(), width: 0, hide: true),
      for (final f in ordered) c(f),
    ];
  }

  List<PlutoRow> _buildRows(List<Map<String, dynamic>> rows, List<PlutoColumn> cols) {
    Object? val(Map<String, dynamic> it, String f) {
      if (f == '__raw__') return it;
      return it[f];
    }

    return [
      for (final it in rows)
        PlutoRow(
          cells: {
            for (final c in cols) c.field: PlutoCell(value: val(it, c.field)),
          },
        ),
    ];
  }

  String _commandForMode(KhoTpMode mode) {
    switch (mode) {
      case KhoTpMode.nhapKho:
      case KhoTpMode.xuatKho:
        return 'trakhotpInOut';
      case KhoTpMode.xuatPack:
        return 'xuatpackkhotp';
      case KhoTpMode.tonTheoGCode:
        return (AppConfig.company.toUpperCase() == 'CMS') ? 'traSTOCKCMS_NEW' : 'traSTOCKCMS';
      case KhoTpMode.tonTheoCodeKd:
        return (AppConfig.company.toUpperCase() == 'CMS') ? 'traSTOCKKD_NEW' : 'traSTOCKKD';
      case KhoTpMode.tonTheoViTri:
        return 'traSTOCKTACH';
    }
  }

  Future<void> _load() async {
    final messenger = ScaffoldMessenger.of(context);

    setState(() {
      _loading = true;
      _showFilter = false;
      _summary = '';
      _rows = const [];
      _cols = const [];
      _plutoRows = const [];
    });

    try {
      final cmd = _commandForMode(_mode);

      final payload = <String, dynamic>{
        'G_CODE': _codeErpCtrl.text.trim(),
        'G_NAME': _codeKdCtrl.text.trim(),
        'ALLTIME': _allTime,
        'JUSTBALANCE': _justBalance,
        'CUST_NAME': _custNameCtrl.text.trim(),
        'CUST_NAME_KD': _custNameCtrl.text.trim(),
        'FROM_DATE': _ymd(_fromDate),
        'TO_DATE': _ymd(_toDate),
        'CAPBU': _capBu,
      };

      if (_mode == KhoTpMode.nhapKho) {
        payload['INOUT'] = 'IN';
      } else if (_mode == KhoTpMode.xuatKho) {
        payload['INOUT'] = 'OUT';
      }

      final body = await _post(cmd, payload);
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() => _loading = false);
        messenger.showSnackBar(SnackBar(content: Text('Lỗi: ${_s(body['message'])}')));
        return;
      }

      final rawData = body['data'];
      final data = rawData is List ? rawData : const [];
      final rows = data.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();

      num totalQty = 0;
      if (_mode == KhoTpMode.xuatPack) {
        for (final r in rows) {
          totalQty += _num(r['Out_Qty']);
        }
      } else if (_mode == KhoTpMode.nhapKho || _mode == KhoTpMode.xuatKho) {
        for (final r in rows) {
          totalQty += _num(r['IO_Qty']);
        }
      }

      final cols = rows.isEmpty ? const <PlutoColumn>[] : _buildColumns(rows, _mode);
      final plutoRows = rows.isEmpty ? const <PlutoRow>[] : _buildRows(rows, cols);

      if (!mounted) return;
      setState(() {
        _rows = rows;
        _cols = cols;
        _plutoRows = plutoRows;
        _loading = false;
        _summary = (totalQty > 0) ? 'TOTAL QTY: ${totalQty.toStringAsFixed(0)} EA' : '';
      });

      messenger.showSnackBar(SnackBar(content: Text('Đã load ${rows.length} dòng')));
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final rowCount = _rows.length;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Kho TP'),
        actions: [
          IconButton(
            tooltip: _showFilter ? 'Ẩn filter' : 'Hiện filter',
            onPressed: () => setState(() => _showFilter = !_showFilter),
            icon: Icon(_showFilter ? Icons.filter_alt_off : Icons.filter_alt),
          ),
        ],
      ),
      drawer: const AppDrawer(),
      body: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (_showFilter)
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Wrap(
                        spacing: 12,
                        runSpacing: 8,
                        crossAxisAlignment: WrapCrossAlignment.center,
                        children: [
                          OutlinedButton(onPressed: _loading ? null : () => _pickDate(isFrom: true), child: Text('Từ: ${_ymd(_fromDate)}')),
                          OutlinedButton(onPressed: _loading ? null : () => _pickDate(isFrom: false), child: Text('Đến: ${_ymd(_toDate)}')),
                          SizedBox(width: 180, child: TextField(controller: _codeKdCtrl, decoration: const InputDecoration(labelText: 'Code KD (G_NAME)'))),
                          SizedBox(width: 180, child: TextField(controller: _codeErpCtrl, decoration: const InputDecoration(labelText: 'Code ERP (G_CODE)'))),
                          SizedBox(width: 180, child: TextField(controller: _custNameCtrl, decoration: const InputDecoration(labelText: 'Khách'))),
                          DropdownButton<KhoTpMode>(
                            value: _mode,
                            items: const [
                              DropdownMenuItem(value: KhoTpMode.nhapKho, child: Text('Nhập Kho')),
                              DropdownMenuItem(value: KhoTpMode.xuatKho, child: Text('Xuất Kho')),
                              DropdownMenuItem(value: KhoTpMode.xuatPack, child: Text('Xuất Pack')),
                              DropdownMenuItem(value: KhoTpMode.tonTheoGCode, child: Text('Tồn theo G_CODE')),
                              DropdownMenuItem(value: KhoTpMode.tonTheoCodeKd, child: Text('Tồn theo Code KD')),
                              DropdownMenuItem(value: KhoTpMode.tonTheoViTri, child: Text('Tồn theo vị trí kho')),
                            ],
                            onChanged: _loading ? null : (v) => setState(() => _mode = v ?? KhoTpMode.nhapKho),
                          ),
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Checkbox(value: _allTime, onChanged: _loading ? null : (v) => setState(() => _allTime = v ?? false)),
                              const Text('All Time'),
                            ],
                          ),
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Checkbox(value: _capBu, onChanged: _loading ? null : (v) => setState(() => _capBu = v ?? false)),
                              const Text('Tính cả xuất cấp bù'),
                            ],
                          ),
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Checkbox(value: _justBalance, onChanged: _loading ? null : (v) => setState(() => _justBalance = v ?? false)),
                              const Text('Chỉ code có tồn'),
                            ],
                          ),
                          FilledButton.icon(
                            onPressed: _loading ? null : _load,
                            icon: const Icon(Icons.search),
                            label: const Text('Load'),
                          ),
                        ],
                      ),
                      if (_summary.isNotEmpty) ...[
                        const SizedBox(height: 8),
                        Text(_summary, style: TextStyle(color: scheme.primary, fontWeight: FontWeight.w800)),
                      ],
                      const SizedBox(height: 6),
                      Text('Rows: $rowCount', style: TextStyle(color: scheme.onSurfaceVariant)),
                    ],
                  ),
                ),
              ),
            const SizedBox(height: 12),
            Expanded(
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(8),
                  child: _loading
                      ? const Center(child: CircularProgressIndicator())
                      : (_cols.isEmpty
                          ? const Center(child: Text('Chưa có dữ liệu'))
                          : PlutoGrid(
                              columns: _cols,
                              rows: _plutoRows,
                              onLoaded: (e) {
                                e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                                e.stateManager.setShowColumnFilter(true);
                              },
                              configuration: const PlutoGridConfiguration(
                                columnSize: PlutoGridColumnSizeConfig(autoSizeMode: PlutoAutoSizeMode.scale),
                              ),
                            )),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
