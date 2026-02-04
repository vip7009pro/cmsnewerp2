import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:pluto_grid/pluto_grid.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../../core/config/app_config.dart';
import '../../../../../core/providers.dart';
import '../../../../../core/utils/excel_exporter.dart';

class PqcDataTab extends ConsumerStatefulWidget {
  const PqcDataTab({super.key});

  @override
  ConsumerState<PqcDataTab> createState() => _PqcDataTabState();
}

class _UpdateNndsSheet extends StatefulWidget {
  const _UpdateNndsSheet({
    required this.row,
    required this.onSave,
    required this.onSnack,
    required this.formatTime,
    required this.s,
    required this.numFn,
  });

  final Map<String, dynamic> row;
  final Future<void> Function(String ngNhan, String doiSach) onSave;
  final void Function(String msg) onSnack;
  final String Function(String s) formatTime;
  final String Function(dynamic v) s;
  final num Function(dynamic v) numFn;

  @override
  State<_UpdateNndsSheet> createState() => _UpdateNndsSheetState();
}

class _UpdateNndsSheetState extends State<_UpdateNndsSheet> {
  late final TextEditingController _nnCtrl;
  late final TextEditingController _dsCtrl;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _nnCtrl = TextEditingController(text: widget.s(widget.row['NG_NHAN']));
    _dsCtrl = TextEditingController(text: widget.s(widget.row['DOI_SACH']));
  }

  @override
  void dispose() {
    _nnCtrl.dispose();
    _dsCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final defect = '${widget.s(widget.row['ERR_CODE'])}: ${widget.s(widget.row['DEFECT_PHENOMENON'])}';
    final imgUrl = '${AppConfig.imageBaseUrl}/pqc/PQC3_${(widget.numFn(widget.row['PQC3_ID']).toInt() + 1)}.png';

    return SafeArea(
      child: Padding(
        padding: EdgeInsets.only(
          left: 12,
          right: 12,
          top: 12,
          bottom: MediaQuery.of(context).viewInsets.bottom + 12,
        ),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text('Update Nguyên nhân / Đối sách', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
              const SizedBox(height: 10),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('HIỆN TƯỢNG', style: TextStyle(fontWeight: FontWeight.w900, color: Theme.of(context).colorScheme.primary)),
                      const SizedBox(height: 6),
                      Text(defect, style: TextStyle(fontWeight: FontWeight.w900, color: Theme.of(context).colorScheme.error)),
                      const SizedBox(height: 6),
                      Text('FACTORY: ${widget.s(widget.row['FACTORY'])} | LINE: ${widget.s(widget.row['LINE_NO'])}'),
                      Text('CUST: ${widget.s(widget.row['CUST_NAME_KD'])}'),
                      Text('CODE: ${widget.s(widget.row['G_NAME_KD'])}'),
                      Text('TIME: ${widget.formatTime(widget.s(widget.row['OCCURR_TIME']))}'),
                      const SizedBox(height: 10),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(10),
                        child: AspectRatio(
                          aspectRatio: 1.8,
                          child: Image.network(
                            imgUrl,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => const Center(child: Text('No image')),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: _nnCtrl,
                maxLines: 6,
                decoration: const InputDecoration(labelText: '2. Nguyên nhân (원인)', border: OutlineInputBorder()),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: _dsCtrl,
                maxLines: 6,
                decoration: const InputDecoration(labelText: '3. Đối sách (대책)', border: OutlineInputBorder()),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: _saving ? null : () => Navigator.of(context).pop(),
                      child: const Text('Close'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: FilledButton(
                      onPressed: _saving
                          ? null
                          : () async {
                              setState(() => _saving = true);
                              try {
                                await widget.onSave(_nnCtrl.text, _dsCtrl.text);
                                if (!mounted) return;
                                widget.onSnack('Update thành công');
                              } catch (e) {
                                widget.onSnack('NG: $e');
                              } finally {
                                if (mounted) setState(() => _saving = false);
                              }
                            },
                      child: Text(_saving ? 'Saving...' : 'Update'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _PqcDataTabState extends ConsumerState<PqcDataTab> {
  bool _loading = false;
  bool _showFilter = true;

  DateTime _fromDate = DateTime.now();
  DateTime _toDate = DateTime.now();

  final TextEditingController _codeKdCtrl = TextEditingController();
  final TextEditingController _codeErpCtrl = TextEditingController();
  final TextEditingController _emplNameCtrl = TextEditingController();
  final TextEditingController _custNameCtrl = TextEditingController();
  final TextEditingController _processLotCtrl = TextEditingController();
  final TextEditingController _prodTypeCtrl = TextEditingController();
  final TextEditingController _prodRequestNoCtrl = TextEditingController();
  final TextEditingController _idCtrl = TextEditingController();

  bool _allTime = false;
  String _factory = 'All';

  String _mode = 'Setting';

  List<Map<String, dynamic>> _rows = const [];
  List<PlutoColumn> _cols = const [];
  List<PlutoRow> _plutoRows = const [];

  String _summary = '';

  String _s(dynamic v) => (v ?? '').toString();
  num _num(dynamic v) => (v is num) ? v : (num.tryParse(_s(v).replaceAll(',', '')) ?? 0);

  @override
  void dispose() {
    _codeKdCtrl.dispose();
    _codeErpCtrl.dispose();
    _emplNameCtrl.dispose();
    _custNameCtrl.dispose();
    _processLotCtrl.dispose();
    _prodTypeCtrl.dispose();
    _prodRequestNoCtrl.dispose();
    _idCtrl.dispose();
    super.dispose();
  }

  bool _isNg(Map<String, dynamic> body) => (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  String _ymd(DateTime dt) {
    final y = dt.year.toString().padLeft(4, '0');
    final m = dt.month.toString().padLeft(2, '0');
    final d = dt.day.toString().padLeft(2, '0');
    return '$y-$m-$d';
  }

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

  Future<Map<String, dynamic>> _post(String command, Map<String, dynamic> data) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(command, data: data);
    final body = res.data;
    if (body is Map<String, dynamic>) return body;
    return <String, dynamic>{'tk_status': 'NG', 'message': 'Bad response'};
  }

  Future<void> _exportExcel() async {
    if (_rows.isEmpty) return;
    await ExcelExporter.shareAsXlsx(fileName: 'DATA_PQC_${_mode}_${_ymd(_fromDate)}_${_ymd(_toDate)}.xlsx', rows: _rows);
  }

  PlutoColumn _col(
    String f, {
    double w = 140,
    PlutoColumnType? type,
    bool editable = false,
    PlutoColumnRenderer? renderer,
  }) {
    return PlutoColumn(
      title: f,
      field: f,
      width: w,
      type: type ?? PlutoColumnType.text(),
      enableEditingMode: editable,
      renderer: renderer,
    );
  }

  List<String> _preferredFieldsForMode(String mode) {
    switch (mode) {
      case 'Setting':
        return const [
          'PQC1_ID',
          'YEAR_WEEK',
          'CUST_NAME_KD',
          'PROD_REQUEST_NO',
          'PROD_REQUEST_QTY',
          'PROD_REQUEST_DATE',
          'PLAN_ID',
          'PROCESS_LOT_NO',
          'G_NAME',
          'G_NAME_KD',
          'DESCR',
          'LINEQC_PIC',
          'PROD_PIC',
          'PROD_LEADER',
          'LINE_NO',
          'STEPS',
          'CAVITY',
          'SETTING_OK_TIME',
          'FACTORY',
          'INSPECT_SAMPLE_QTY',
          'PROD_LAST_PRICE',
          'SAMPLE_AMOUNT',
          'REMARK',
          'PQC3_ID',
          'OCCURR_TIME',
          'INSPECT_QTY',
          'DEFECT_QTY',
          'DEFECT_RATE',
          'DEFECT_PHENOMENON',
          'INS_DATE',
          'UPD_DATE',
          'IMG_1',
          'IMG_2',
          'IMG_3',
        ];
      case 'Defect':
        return const [
          'YEAR_WEEK',
          'PQC3_ID',
          'PQC1_ID',
          'CUST_NAME_KD',
          'FACTORY',
          'PROD_REQUEST_NO',
          'PROD_REQUEST_DATE',
          'PROCESS_LOT_NO',
          'G_CODE',
          'G_NAME',
          'G_NAME_KD',
          'DESCR',
          'PROD_LAST_PRICE',
          'LINEQC_PIC',
          'PROD_PIC',
          'PROD_LEADER',
          'LINE_NO',
          'OCCURR_TIME',
          'INSPECT_QTY',
          'DEFECT_QTY',
          'DEFECT_AMOUNT',
          'ERR_CODE',
          'DEFECT_PHENOMENON',
          'DEFECT_IMAGE_LINK',
          'REMARK',
          'WORST5',
          'WORST5_MONTH',
          'NG_NHAN',
          'DOI_SACH',
        ];
      case 'Dao-film':
        return const [
          'KNIFE_FILM_ID',
          'FACTORY_NAME',
          'NGAYBANGIAO',
          'G_CODE',
          'G_NAME',
          'LOAIBANGIAO_PDP',
          'LOAIPHATHANH',
          'SOLUONG',
          'SOLUONGOHP',
          'LYDOBANGIAO',
          'PQC_EMPL_NO',
          'RND_EMPL_NO',
          'SX_EMPL_NO',
          'MA_DAO',
          'REMARK',
        ];
      case 'CNĐB':
        return const [
          'CNDB_DATE',
          'CNDB_NO',
          'CNDB_ENCODE',
          'M_NAME',
          'DEFECT_NAME',
          'DEFECT_CONTENT',
          'REG_EMPL_NO',
          'REMARK',
          'M_NAME2',
          'INS_DATE',
          'APPROVAL_STATUS',
          'APPROVAL_EMPL',
          'APPROVAL_DATE',
          'G_CODE',
          'G_NAME',
        ];
    }
    return const [];
  }

  List<PlutoColumn> _buildCols(List<Map<String, dynamic>> rows, String mode) {
    if (rows.isEmpty) return const [];
    final keys = rows.first.keys.map((e) => e.toString()).toList();

    final prefer = _preferredFieldsForMode(mode);
    final ordered = <String>[
      ...prefer.where(keys.contains),
      ...keys.where((k) => !prefer.contains(k)),
    ];

    PlutoColumn linkCol(String field, String folder, String file) {
      return _col(
        field,
        w: 90,
        renderer: (ctx) {
          final raw = (ctx.row.cells['__raw__']?.value as Map<String, dynamic>?);
          final ok = raw != null && (raw[field] == true || raw[field] == 1 || raw[field] == 'Y');
          if (!ok) return const Text('NO', style: TextStyle(color: Colors.black54));
          return TextButton(
            onPressed: () async {
              final planId = _s(raw['PLAN_ID']);
              final url = Uri.parse('${AppConfig.imageBaseUrl}/$folder/${planId}_$file');
              await launchUrl(url, mode: LaunchMode.externalApplication);
            },
            child: const Text('LINK'),
          );
        },
      );
    }

    return [
      PlutoColumn(title: '', field: '__raw__', type: PlutoColumnType.text(), width: 0, hide: true),
      ...ordered.map((f) {
        if (f == 'SETTING_OK_TIME' || f == 'INS_DATE' || f == 'UPD_DATE' || f == 'OCCURR_TIME') {
          return _col(
            f,
            w: 170,
            renderer: (ctx) {
              final raw = (ctx.row.cells['__raw__']?.value as Map<String, dynamic>?);
              final v = raw == null ? '' : _s(raw[f]);
              return Text(_ymdHms(v), style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.w800));
            },
          );
        }
        if (f == 'DEFECT_IMAGE_LINK') {
          return _col(
            f,
            w: 90,
            renderer: (ctx) {
              final raw = (ctx.row.cells['__raw__']?.value as Map<String, dynamic>?);
              if (raw == null) return const SizedBox.shrink();
              final id = _num(raw['PQC3_ID']).toInt();
              final url = Uri.parse('${AppConfig.imageBaseUrl}/pqc/PQC3_${id + 1}.png');
              return TextButton(
                onPressed: () async {
                  await launchUrl(url, mode: LaunchMode.externalApplication);
                },
                child: const Text('LINK'),
              );
            },
          );
        }
        if (f == 'DEFECT_RATE') {
          return _col(
            f,
            w: 110,
            renderer: (ctx) {
              final raw = (ctx.row.cells['__raw__']?.value as Map<String, dynamic>?);
              final v = raw == null ? 0 : _num(raw[f]);
              return Text('${v.toStringAsFixed(0)}%', style: const TextStyle(color: Colors.red, fontWeight: FontWeight.w900));
            },
          );
        }
        if (f == 'IMG_1') return linkCol('IMG_1', 'lineqc', '1.jpg');
        if (f == 'IMG_2') return linkCol('IMG_2', 'lineqc', '2.jpg');
        if (f == 'IMG_3') return linkCol('IMG_3', 'lineqc', '3.jpg');
        if (f == 'UPDATE_NNDS') {
          return _col(
            f,
            w: 140,
            renderer: (ctx) {
              return FilledButton.tonal(
                onPressed: () {
                  final raw = (ctx.row.cells['__raw__']?.value as Map<String, dynamic>?);
                  if (raw == null) return;
                  _showUpdateNnds(raw);
                },
                child: const Text('Update NNDS'),
              );
            },
          );
        }
        final isNum = rows.any((r) => r[f] is num) || const <String>{'INSPECT_QTY', 'DEFECT_QTY', 'DEFECT_AMOUNT', 'PROD_LAST_PRICE', 'SAMPLE_AMOUNT'}.contains(f);
        return _col(f, type: isNum ? PlutoColumnType.number() : PlutoColumnType.text());
      }),
    ];
  }

  List<PlutoRow> _buildRows(List<Map<String, dynamic>> rows, List<PlutoColumn> cols) {
    return List.generate(rows.length, (i) {
      final r = rows[i];
      final cells = <String, PlutoCell>{
        '__raw__': PlutoCell(value: r),
      };
      for (final c in cols) {
        if (c.field == '__raw__') continue;
        cells[c.field] = PlutoCell(value: r[c.field]);
      }
      return PlutoRow(cells: cells);
    });
  }

  Future<void> _load(String mode) async {
    setState(() {
      _loading = true;
      _showFilter = false;
      _mode = mode;
      _summary = '';
      _rows = const [];
      _cols = const [];
      _plutoRows = const [];
    });

    final from = _ymd(_fromDate);
    final to = _ymd(_toDate);

    final codeKd = _codeKdCtrl.text.trim();
    final codeErp = _codeErpCtrl.text.trim();
    final empl = _emplNameCtrl.text.trim();
    final cust = _custNameCtrl.text.trim();
    final lot = _processLotCtrl.text.trim();
    final prodType = _prodTypeCtrl.text.trim();
    final ycsx = _prodRequestNoCtrl.text.trim();
    final id = _idCtrl.text.trim();

    try {
      String cmd;
      final payload = <String, dynamic>{};

      if (mode == 'Setting') {
        cmd = 'trapqc1data';
        payload.addAll({
          'ALLTIME': _allTime,
          'FROM_DATE': from,
          'TO_DATE': to,
          'CUST_NAME': cust,
          'PROCESS_LOT_NO': lot,
          'G_CODE': codeErp,
          'G_NAME': codeKd,
          'PROD_TYPE': prodType,
          'EMPL_NAME': empl,
          'PROD_REQUEST_NO': ycsx,
          'ID': id,
          'FACTORY': _factory,
        });
      } else if (mode == 'Defect') {
        cmd = 'trapqc3data';
        payload.addAll({
          'ALLTIME': _allTime,
          'FROM_DATE': from,
          'TO_DATE': to,
          'CUST_NAME': cust,
          'PROCESS_LOT_NO': lot,
          'G_CODE': codeErp,
          'G_NAME': codeKd,
          'PROD_TYPE': prodType,
          'EMPL_NAME': empl,
          'PROD_REQUEST_NO': ycsx,
          'ID': id,
          'FACTORY': _factory,
        });
      } else if (mode == 'Dao-film') {
        cmd = 'tradaofilm';
        payload.addAll({
          'ALLTIME': _allTime,
          'FROM_DATE': from,
          'TO_DATE': to,
          'G_CODE': codeErp,
          'G_NAME': codeKd,
          'FACTORY': _factory,
        });
      } else {
        cmd = 'traCNDB';
        payload.addAll({
          'ALLTIME': _allTime,
          'FROM_DATE': from,
          'TO_DATE': to,
          'CUST_NAME': cust,
          'process_lot_no': lot,
          'G_CODE': codeErp,
          'G_NAME': codeKd,
          'PROD_TYPE': prodType,
          'EMPL_NAME': empl,
          'PROD_REQUEST_NO': ycsx,
        });
      }

      final body = await _post(cmd, payload);
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() => _loading = false);
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('NG: ${_s(body['message'])}')));
        return;
      }

      final raw = body['data'];
      final data = raw is List ? raw : const [];
      final rows = data.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();

      // Post-process like web
      if (mode == 'Setting') {
        for (final r in rows) {
          r['OCCURR_TIME'] = _ymdHms(_s(r['OCCURR_TIME']));
          r['SETTING_OK_TIME'] = _ymdHms(_s(r['SETTING_OK_TIME']));
          r['INS_DATE'] = _ymdHms(_s(r['INS_DATE']));
          r['UPD_DATE'] = _ymdHms(_s(r['UPD_DATE']));
          final inspect = _num(r['INSPECT_QTY']);
          final ng = _num(r['DEFECT_QTY']);
          if (inspect > 0) {
            r['DEFECT_RATE'] = (ng / inspect) * 100;
          }
        }
      }
      if (mode == 'Defect') {
        for (final r in rows) {
          r['OCCURR_TIME'] = _ymdHms(_s(r['OCCURR_TIME']));
          // Add update button column similar to web
          r['UPDATE_NNDS'] = 'Update NNDS';
        }
      }
      if (mode == 'CNĐB') {
        for (final r in rows) {
          if (r['CNDB_DATE'] != null) {
            // leave as-is, server may return YYYY-MM-DD
          }
          r['INS_DATE'] = _ymdHms(_s(r['INS_DATE']));
          r['APPROVAL_DATE'] = _ymdHms(_s(r['APPROVAL_DATE']));
        }
      }

      final cols = _buildCols(rows, mode);
      final plutoRows = _buildRows(rows, cols);

      if (!mounted) return;
      setState(() {
        _rows = rows;
        _cols = cols;
        _plutoRows = plutoRows;
        _loading = false;
        _summary = 'Đã load ${rows.length} dòng';
      });
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(_summary)));
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  Future<void> _showUpdateNnds(Map<String, dynamic> row) async {
    if (!mounted) return;
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      builder: (ctx) => _UpdateNndsSheet(
        row: row,
        onSave: (ngNhan, doiSach) async {
          final body = await _post('updatenndspqc', {
            'PQC3_ID': _num(row['PQC3_ID']).toInt(),
            'NG_NHAN': ngNhan,
            'DOI_SACH': doiSach,
          });
          if (_isNg(body)) {
            throw Exception(_s(body['message']));
          }
          if (!mounted) return;
          setState(() {
            final idx = _rows.indexWhere((e) => _num(e['PQC3_ID']).toInt() == _num(row['PQC3_ID']).toInt());
            if (idx >= 0) {
              _rows[idx]['NG_NHAN'] = ngNhan;
              _rows[idx]['DOI_SACH'] = doiSach;
            }
          });
        },
        onSnack: _snack,
        formatTime: _ymdHms,
        s: _s,
        numFn: _num,
      ),
    );
  }

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
              child: Row(
                children: [
                  IconButton(
                    tooltip: _showFilter ? 'Ẩn filter' : 'Hiện filter',
                    onPressed: _loading ? null : () => setState(() => _showFilter = !_showFilter),
                    icon: Icon(_showFilter ? Icons.filter_alt_off : Icons.filter_alt),
                  ),
                  const Expanded(child: Text('DATA PQC (TRAPQC)', style: TextStyle(fontWeight: FontWeight.w900))),
                  IconButton(
                    onPressed: _rows.isEmpty ? null : _exportExcel,
                    tooltip: 'Export Excel',
                    icon: const Icon(Icons.table_view),
                  ),
                ],
              ),
            ),
          ),
          if (_showFilter)
            Card(
              child: Padding(
                padding: const EdgeInsets.all(8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Wrap(
                      spacing: 10,
                      runSpacing: 8,
                      crossAxisAlignment: WrapCrossAlignment.center,
                      children: [
                        OutlinedButton(onPressed: _loading ? null : () => _pickDate(isFrom: true), child: Text('Từ: ${_ymd(_fromDate)}')),
                        OutlinedButton(onPressed: _loading ? null : () => _pickDate(isFrom: false), child: Text('Đến: ${_ymd(_toDate)}')),
                        SizedBox(width: 200, child: TextField(controller: _codeKdCtrl, decoration: const InputDecoration(labelText: 'Code KD'))),
                        SizedBox(width: 200, child: TextField(controller: _codeErpCtrl, decoration: const InputDecoration(labelText: 'Code ERP'))),
                        SizedBox(width: 200, child: TextField(controller: _emplNameCtrl, decoration: const InputDecoration(labelText: 'Tên NV'))),
                        SizedBox(width: 200, child: TextField(controller: _custNameCtrl, decoration: const InputDecoration(labelText: 'Customer'))),
                        SizedBox(width: 200, child: TextField(controller: _processLotCtrl, decoration: const InputDecoration(labelText: 'LOT SX'))),
                        SizedBox(width: 200, child: TextField(controller: _prodTypeCtrl, decoration: const InputDecoration(labelText: 'Loại SP'))),
                        SizedBox(width: 200, child: TextField(controller: _prodRequestNoCtrl, decoration: const InputDecoration(labelText: 'Số YCSX'))),
                        SizedBox(width: 140, child: TextField(controller: _idCtrl, decoration: const InputDecoration(labelText: 'ID'))),
                        DropdownButton<String>(
                          value: _factory,
                          style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w700),
                          dropdownColor: Theme.of(context).colorScheme.surface,
                          iconEnabledColor: Theme.of(context).colorScheme.onSurface,
                          onChanged: _loading ? null : (v) => setState(() => _factory = v ?? 'All'),
                          items: const [
                            DropdownMenuItem(value: 'All', child: Text('All')),
                            DropdownMenuItem(value: 'NM1', child: Text('NM1')),
                            DropdownMenuItem(value: 'NM2', child: Text('NM2')),
                          ],
                        ),
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Checkbox(value: _allTime, onChanged: _loading ? null : (v) => setState(() => _allTime = v ?? false)),
                            const Text('All Time'),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Wrap(
                      spacing: 10,
                      runSpacing: 10,
                      children: [
                        FilledButton(
                          onPressed: _loading ? null : () => _load('Setting'),
                          child: const Text('Setting'),
                        ),
                        FilledButton(
                          style: FilledButton.styleFrom(backgroundColor: const Color(0xFF9DDD49), foregroundColor: Colors.black),
                          onPressed: _loading ? null : () => _load('Defect'),
                          child: const Text('Defect'),
                        ),
                        FilledButton(
                          style: FilledButton.styleFrom(backgroundColor: const Color(0xFFF396FC), foregroundColor: Colors.black),
                          onPressed: _loading ? null : () => _load('Dao-film'),
                          child: const Text('Dao-film'),
                        ),
                        FilledButton(
                          style: FilledButton.styleFrom(backgroundColor: const Color(0xFFF7AB7E), foregroundColor: Colors.black),
                          onPressed: _loading ? null : () => _load('CNĐB'),
                          child: const Text('CNĐB'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          if (_loading) const LinearProgressIndicator(),
          if (_summary.isNotEmpty)
            Padding(
              padding: const EdgeInsets.fromLTRB(4, 8, 4, 8),
              child: Text(_summary, style: const TextStyle(fontWeight: FontWeight.w800)),
            ),
          Expanded(
            child: Card(
              child: _cols.isEmpty
                  ? const Center(child: Text('Chưa có dữ liệu'))
                  : PlutoGrid(
                      columns: _cols,
                      rows: _plutoRows,
                      onLoaded: (e) {
                        e.stateManager.setShowColumnFilter(true);
                      },
                      configuration: PlutoGridConfiguration(
                        style: PlutoGridStyleConfig(
                          rowHeight: 34,
                          columnHeight: 34,
                          cellTextStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
                          columnTextStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900),
                          defaultCellPadding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                        ),
                      ),
                    ),
            ),
          ),
        ],
      ),
    );
  }
}
