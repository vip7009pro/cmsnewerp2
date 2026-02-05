import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import 'package:pluto_grid/pluto_grid.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../../core/config/app_config.dart';
import '../../../../../core/providers.dart';
import '../../../../../core/utils/excel_exporter.dart';

class CsDataTab extends ConsumerStatefulWidget {
  const CsDataTab({super.key});

  @override
  ConsumerState<CsDataTab> createState() => _CsDataTabState();
}

class _CsDataTabState extends ConsumerState<CsDataTab> {
  bool _loading = false;
  bool _showFilter = true;

  DateTime _fromDate = DateTime.now();
  DateTime _toDate = DateTime.now();

  String _option = 'dataconfirm';

  final TextEditingController _confirmIdCtrl = TextEditingController();
  final TextEditingController _contactIdCtrl = TextEditingController();
  final TextEditingController _custCtrl = TextEditingController();
  final TextEditingController _codeCtrl = TextEditingController();
  final TextEditingController _contentCtrl = TextEditingController();
  final TextEditingController _csEmplCtrl = TextEditingController();
  final TextEditingController _statusCtrl = TextEditingController();

  List<Map<String, dynamic>> _rows = const [];
  List<PlutoColumn> _cols = const [];
  List<PlutoRow> _plutoRows = const [];

  String _s(dynamic v) => (v ?? '').toString();
  num _n(dynamic v) => (v is num) ? v : (num.tryParse(_s(v).replaceAll(',', '')) ?? 0);

  bool _isNg(Map<String, dynamic> body) => (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  String _ymd(DateTime dt) => DateFormat('yyyy-MM-dd').format(dt);

  String _ymdHms(dynamic v) {
    final raw = _s(v).trim();
    if (raw.isEmpty) return raw;
    DateTime? dt = DateTime.tryParse(raw.replaceFirst(' ', 'T')) ?? DateTime.tryParse(raw);
    if (dt == null) return raw;
    final local = dt.isUtc ? dt.toLocal() : dt;
    return DateFormat('yyyy-MM-dd HH:mm:ss').format(local);
  }

  @override
  void dispose() {
    _confirmIdCtrl.dispose();
    _contactIdCtrl.dispose();
    _custCtrl.dispose();
    _codeCtrl.dispose();
    _contentCtrl.dispose();
    _csEmplCtrl.dispose();
    _statusCtrl.dispose();
    super.dispose();
  }

  Future<Map<String, dynamic>> _post(String cmd, Map<String, dynamic> data) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(cmd, data: data);
    final body = res.data;
    if (body is Map<String, dynamic>) return body;
    return <String, dynamic>{'tk_status': 'NG', 'message': 'Bad response'};
  }

  Future<void> _pickDate({required bool from}) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: from ? _fromDate : _toDate,
      firstDate: DateTime(2020, 1, 1),
      lastDate: DateTime(2100, 12, 31),
    );
    if (picked == null) return;
    setState(() {
      if (from) {
        _fromDate = picked;
        if (_toDate.isBefore(_fromDate)) _toDate = _fromDate;
      } else {
        _toDate = picked;
      }
    });
  }

  Map<String, dynamic> _filterPayload() {
    return <String, dynamic>{
      'FROM_DATE': _ymd(_fromDate),
      'TO_DATE': _ymd(_toDate),
      'CONFIRM_ID': int.tryParse(_confirmIdCtrl.text.trim()) ?? 0,
      'CONTACT_ID': int.tryParse(_contactIdCtrl.text.trim()) ?? 0,
      'CUST_NAME_KD': _custCtrl.text.trim(),
      'G_NAME_KD': _codeCtrl.text.trim(),
      'CONTENT': _contentCtrl.text.trim(),
      'CS_EMPL_NO': _csEmplCtrl.text.trim(),
      'CONFIRM_STATUS': _statusCtrl.text.trim(),
    };
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _rows = const [];
      _cols = const [];
      _plutoRows = const [];
    });

    try {
      final payload = _filterPayload();
      late final String cmd;
      if (_option == 'dataconfirm') {
        cmd = 'tracsconfirm';
      } else if (_option == 'datarma') {
        cmd = 'tracsrma';
      } else if (_option == 'datacndbkhachhang') {
        cmd = 'tracsCNDB';
      } else {
        cmd = 'tracsTAXI';
      }

      final body = await _post(cmd, payload);
      if (_isNg(body)) {
        if (!mounted) return;
        _snack('NG: ${_s(body['message'])}');
        return;
      }

      final raw = body['data'];
      final arr = raw is List ? raw : const [];
      final rows = arr.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();

      for (final r in rows) {
        if (r.containsKey('INS_DATETIME')) r['INS_DATETIME'] = _ymdHms(r['INS_DATETIME']);
        if (r.containsKey('CONFIRM_DATE')) r['CONFIRM_DATE'] = _s(r['CONFIRM_DATE']).isEmpty ? '' : _ymdHms(r['CONFIRM_DATE']).substring(0, 10);
        if (r.containsKey('RETURN_DATE')) r['RETURN_DATE'] = _s(r['RETURN_DATE']).isEmpty ? '' : _ymdHms(r['RETURN_DATE']).substring(0, 10);
        if (r.containsKey('REQUEST_DATETIME')) r['REQUEST_DATETIME'] = _s(r['REQUEST_DATETIME']).isEmpty ? '' : _ymdHms(r['REQUEST_DATETIME']).substring(0, 10);
        if (r.containsKey('SA_REQUEST_DATE')) r['SA_REQUEST_DATE'] = _s(r['SA_REQUEST_DATE']).isEmpty ? '' : _ymdHms(r['SA_REQUEST_DATE']).substring(0, 10);
      }

      final cols = _buildCols(rows);
      final plutoRows = _buildRows(rows, cols);

      if (!mounted) return;
      setState(() {
        _rows = rows;
        _cols = cols;
        _plutoRows = plutoRows;
      });
      _snack('Đã load ${rows.length} dòng');
    } catch (e) {
      if (!mounted) return;
      _snack('Lỗi: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  List<PlutoColumn> _buildCols(List<Map<String, dynamic>> rows) {
    if (rows.isEmpty) return const [];
    final keys = <String>{};
    for (final r in rows) {
      keys.addAll(r.keys.map((e) => e.toString()));
    }

    final ordered = keys.toList();
    ordered.sort();

    PlutoColumn makeText(String field, {double w = 140}) {
      return PlutoColumn(
        title: field,
        field: field,
        width: w,
        type: PlutoColumnType.text(),
        enableRowChecked: false,
        enableColumnDrag: false,
        renderer: (ctx) {
          if (field == 'LINK' || field == 'DEFECT_IMAGE') {
            final id = _n(ctx.row.cells['CONFIRM_ID']?.value).toInt();
            final url = Uri.parse('${AppConfig.baseUrl}/cs/CS_$id.jpg');
            final has = _s(ctx.cell.value).trim().toUpperCase() == 'Y';
            return Align(
              alignment: Alignment.centerLeft,
              child: Wrap(
                spacing: 6,
                runSpacing: 6,
                children: [
                  if (id > 0)
                    OutlinedButton(
                      onPressed: () => launchUrl(url, mode: LaunchMode.externalApplication),
                      child: const Text('Open'),
                    ),
                  if (!has && id > 0)
                    FilledButton(
                      onPressed: () => _pickAndUploadCsImage(confirmId: id),
                      child: const Text('Upload'),
                    ),
                ],
              ),
            );
          }

          if (field == 'UP_NNDS' || field == 'UPDATE_NNDS') {
            return Align(
              alignment: Alignment.centerLeft,
              child: FilledButton(
                onPressed: () => _showUpdateNnds(ctx.row.cells),
                child: const Text('Update NNDS'),
              ),
            );
          }

          final v = _s(ctx.cell.value);
          TextStyle? style;
          if (field.contains('QTY')) {
            style = TextStyle(color: field.contains('NG') ? Colors.red : Colors.blue, fontWeight: FontWeight.w800);
          }
          if (field.contains('AMOUNT') || field.contains('PRICE')) {
            style = const TextStyle(color: Colors.green, fontWeight: FontWeight.w800);
          }
          if (field.contains('RATE')) {
            style = const TextStyle(color: Colors.purple, fontWeight: FontWeight.w800);
          }
          return Text(v, overflow: TextOverflow.ellipsis, style: style);
        },
      );
    }

    return [
      for (final k in ordered)
        if (k == 'CONTENT')
          makeText(k, w: 260)
        else if (k == 'LINK' || k == 'DEFECT_IMAGE')
          makeText(k, w: 220)
        else
          makeText(k, w: 140),
    ];
  }

  List<PlutoRow> _buildRows(List<Map<String, dynamic>> rows, List<PlutoColumn> cols) {
    return rows
        .map(
          (r) => PlutoRow(
            cells: {
              for (final c in cols) c.field: PlutoCell(value: r[c.field]),
            },
          ),
        )
        .toList(growable: false);
  }

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  Future<void> _showUpdateNnds(Map<String, PlutoCell> cells) async {
    final confirmId = _n(cells['CONFIRM_ID']?.value).toInt();
    final ngNhanInit = _s(cells['NG_NHAN']?.value);
    final doiSachInit = _s(cells['DOI_SACH']?.value);

    final nnCtrl = TextEditingController(text: ngNhanInit);
    final dsCtrl = TextEditingController(text: doiSachInit);

    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            left: 12,
            right: 12,
            top: 12,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 12,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Update NNDS (CONFIRM_ID=$confirmId)', style: const TextStyle(fontWeight: FontWeight.w900)),
              const SizedBox(height: 10),
              TextField(
                controller: nnCtrl,
                maxLines: 4,
                decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'NG_NHAN'),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: dsCtrl,
                maxLines: 4,
                decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'DOI_SACH'),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.of(ctx).pop(),
                      child: const Text('Close'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: FilledButton(
                      onPressed: () async {
                        try {
                          final body = await _post('updatenndscs', {
                            'CONFIRM_ID': confirmId,
                            'NG_NHAN': nnCtrl.text,
                            'DOI_SACH': dsCtrl.text,
                          });
                          if (_isNg(body)) {
                            throw Exception(_s(body['message']));
                          }

                          if (!ctx.mounted) return;
                          Navigator.of(ctx).pop();
                          _snack('Update thành công');
                          await _load();
                        } catch (e) {
                          _snack('NG: $e');
                        }
                      },
                      child: const Text('Update'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );

    nnCtrl.dispose();
    dsCtrl.dispose();
  }

  Future<void> _pickAndUploadCsImage({required int confirmId}) async {
    try {
      final picker = ImagePicker();
      final img = await picker.pickImage(source: ImageSource.gallery);
      if (img == null) return;

      final file = File(img.path);
      final api = ref.read(apiClientProvider);
      await api.uploadFile(file: file, filename: 'CS_$confirmId.jpg', uploadFolderName: 'cs');

      final body = await _post('updateCSImageStatus', {'CONFIRM_ID': confirmId});
      if (_isNg(body)) {
        throw Exception(_s(body['message']));
      }

      _snack('Upload thành công');
      await _load();
    } catch (e) {
      _snack('Upload lỗi: $e');
    }
  }

  Future<void> _exportExcel() async {
    if (_rows.isEmpty) return;
    await ExcelExporter.shareAsXlsx(
      fileName: 'cs_${_option}_${_ymd(DateTime.now())}.xlsx',
      rows: _rows,
    );
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Column(
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
                const Expanded(child: Text('DATA CS', style: TextStyle(fontWeight: FontWeight.w900))),
                IconButton(
                  onPressed: _rows.isEmpty ? null : _exportExcel,
                  tooltip: 'Export Excel',
                  icon: const Icon(Icons.table_view),
                ),
                const SizedBox(width: 6),
                FilledButton.icon(
                  onPressed: _loading ? null : _load,
                  icon: const Icon(Icons.refresh),
                  label: const Text('Load'),
                ),
              ],
            ),
          ),
        ),
        if (_showFilter)
          Card(
            child: Padding(
              padding: const EdgeInsets.all(10),
              child: Wrap(
                spacing: 10,
                runSpacing: 10,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: [
                  OutlinedButton(onPressed: _loading ? null : () => _pickDate(from: true), child: Text('Từ: ${_ymd(_fromDate)}')),
                  OutlinedButton(onPressed: _loading ? null : () => _pickDate(from: false), child: Text('Đến: ${_ymd(_toDate)}')),
                  DropdownButton<String>(
                    value: _option,
                    style: TextStyle(color: scheme.onSurface, fontWeight: FontWeight.w700),
                    dropdownColor: scheme.surface,
                    iconEnabledColor: scheme.onSurface,
                    onChanged: _loading
                        ? null
                        : (v) {
                            setState(() => _option = v ?? 'dataconfirm');
                          },
                    items: const [
                      DropdownMenuItem(value: 'dataconfirm', child: Text('Lịch Sử Xác Nhận Lỗi')),
                      DropdownMenuItem(value: 'datarma', child: Text('RMA Data')),
                      DropdownMenuItem(value: 'datacndbkhachhang', child: Text('CNĐB Khách Hàng')),
                      DropdownMenuItem(value: 'datataxi', child: Text('Taxi Data')),
                    ],
                  ),
                  SizedBox(width: 140, child: TextField(controller: _confirmIdCtrl, decoration: const InputDecoration(labelText: 'CONFIRM_ID'))),
                  SizedBox(width: 140, child: TextField(controller: _contactIdCtrl, decoration: const InputDecoration(labelText: 'CONTACT_ID'))),
                  SizedBox(width: 200, child: TextField(controller: _custCtrl, decoration: const InputDecoration(labelText: 'CUST_NAME_KD'))),
                  SizedBox(width: 200, child: TextField(controller: _codeCtrl, decoration: const InputDecoration(labelText: 'G_NAME_KD'))),
                  SizedBox(width: 220, child: TextField(controller: _contentCtrl, decoration: const InputDecoration(labelText: 'CONTENT'))),
                  SizedBox(width: 160, child: TextField(controller: _csEmplCtrl, decoration: const InputDecoration(labelText: 'CS_EMPL_NO'))),
                  SizedBox(width: 160, child: TextField(controller: _statusCtrl, decoration: const InputDecoration(labelText: 'CONFIRM_STATUS'))),
                  OutlinedButton.icon(
                    onPressed: _loading
                        ? null
                        : () {
                            final url = Uri.parse('${AppConfig.baseUrl}/cs/');
                            launchUrl(url, mode: LaunchMode.externalApplication);
                          },
                    icon: const Icon(Icons.open_in_new),
                    label: const Text('Open CS Folder'),
                  ),
                ],
              ),
            ),
          ),
        if (_loading) const LinearProgressIndicator(),
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
                    onRowDoubleTap: (e) {
                      final id = _n(e.row.cells['CONFIRM_ID']?.value).toInt();
                      if (id <= 0) return;
                      final url = Uri.parse('${AppConfig.baseUrl}/cs/CS_$id.jpg');
                      launchUrl(url, mode: LaunchMode.externalApplication);
                    },
                    configuration: PlutoGridConfiguration(
                      style: PlutoGridStyleConfig(
                        rowHeight: _option == 'dataconfirm' ? 64 : 34,
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
    );
  }
}
