import 'dart:io';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:pluto_grid/pluto_grid.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../../core/config/app_config.dart';
import '../../../../../core/providers.dart';

class AuditHistoryTab extends ConsumerStatefulWidget {
  const AuditHistoryTab({super.key});

  @override
  ConsumerState<AuditHistoryTab> createState() => _AuditHistoryTabState();
}

class _AuditHistoryTabState extends ConsumerState<AuditHistoryTab> {
  bool _loading = false;
  bool _showFilter = true;

  DateTime _fromDate = DateTime.now().subtract(const Duration(days: 8));
  DateTime _toDate = DateTime.now();
  bool _allTime = false;

  List<PlutoColumn> _cols = const [];
  List<PlutoRow> _plutoRows = const [];

  Map<String, dynamic>? _selected;

  List<Map<String, dynamic>> _customerList = const [];

  String _s(dynamic v) => (v ?? '').toString();
  num _n(dynamic v) => (v is num) ? v : (num.tryParse(_s(v).replaceAll(',', '')) ?? 0);

  bool _isNg(Map<String, dynamic> body) => (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  String _ymd(DateTime dt) => DateFormat('yyyy-MM-dd').format(dt);

  Future<Map<String, dynamic>> _post(String cmd, Map<String, dynamic> data) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(cmd, data: data);
    final body = res.data;
    if (body is Map<String, dynamic>) return body;
    return <String, dynamic>{'tk_status': 'NG', 'message': 'Bad response'};
  }

  @override
  void initState() {
    super.initState();
    Future.microtask(_load);
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

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _selected = null;
    });

    try {
      final body = await _post('loadAUDIT_HISTORY_DATA', {
        'FROM_DATE': _ymd(_fromDate),
        'TO_DATE': _ymd(_toDate),
        'ALLTIME': _allTime,
      });

      if (_isNg(body)) {
        _snack('Không có dữ liệu');
        setState(() {
          _cols = const [];
          _plutoRows = const [];
        });
        return;
      }

      final raw = body['data'];
      final list = raw is List ? raw : const [];
      final rows = list.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();

      for (var i = 0; i < rows.length; i++) {
        rows[i]['id'] = i;
        rows[i]['AUDIT_DATE'] = _fmtYmd(rows[i]['AUDIT_DATE']);
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

  String _fmtYmd(dynamic v) {
    final s = _s(v).trim();
    if (s.isEmpty) return '';
    final dt = DateTime.tryParse(s.replaceFirst(' ', 'T')) ?? DateTime.tryParse(s);
    if (dt == null) return s;
    return DateFormat('yyyy-MM-dd').format(dt.toUtc());
  }

  Uri _fileUrl(Map<String, dynamic> row) {
    final protocol = AppConfig.baseUrl.startsWith('https') ? 'https' : 'http';
    final host = AppConfig.baseUrl.replaceFirst(RegExp(r'^https?://'), '');
    final id = _n(row['AUDIT_ID']).toInt();
    final ext = _s(row['AUDIT_FILE_EXT']);
    final filename = '${AppConfig.ctrCd}_$id$ext';
    return Uri.parse('$protocol://$host/audithistory/$filename');
  }

  Future<void> _loadCustomers() async {
    if (_customerList.isNotEmpty) return;
    try {
      final body = await _post('selectCustomerAndVendorList', {});
      if (_isNg(body)) return;
      final raw = body['data'];
      final list = raw is List ? raw : const [];
      final rows = list.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();
      if (!mounted) return;
      setState(() => _customerList = rows);
    } catch (_) {
      // ignore
    }
  }

  Future<void> _showAddEdit({required bool isEdit}) async {
    await _loadCustomers();
    if (!context.mounted) return;
    final parentContext = context;
    final init = isEdit ? (_selected ?? <String, dynamic>{}) : <String, dynamic>{};

    final custCd = ValueNotifier<String>(_s(init['CUST_CD']));
    final custName = TextEditingController(text: _s(init['CUST_NAME_KD']));
    final auditId = TextEditingController(text: isEdit ? _s(init['AUDIT_ID']) : '0');
    final auditDate = ValueNotifier<DateTime>(DateTime.tryParse(_s(init['AUDIT_DATE'])) ?? DateTime.now());
    final auditName = TextEditingController(text: _s(init['AUDIT_NAME']));
    final maxScore = TextEditingController(text: _s(init['AUDIT_MAX_SCORE']));
    final score = TextEditingController(text: _s(init['AUDIT_SCORE']));
    final passScore = TextEditingController(text: _s(init['AUDIT_PASS_SCORE']));
    final fileExt = TextEditingController(text: _s(init['AUDIT_FILE_EXT']));

    Future<void> pickAuditDate() async {
      final picked = await showDatePicker(
        context: context,
        initialDate: auditDate.value,
        firstDate: DateTime(2020, 1, 1),
        lastDate: DateTime(2100, 12, 31),
      );
      if (picked == null) return;
      auditDate.value = picked;
    }

    if (!mounted) return;
    await showDialog<void>(
      context: parentContext,
      builder: (dialogCtx) {
        return AlertDialog(
          title: Text(isEdit ? 'Sửa Audit' : 'Thêm Audit mới'),
          content: SizedBox(
            width: 560,
            child: SingleChildScrollView(
              child: Column(
                children: [
                  DropdownButtonFormField<String>(
                    initialValue: custCd.value.isEmpty ? null : custCd.value,
                    decoration: const InputDecoration(labelText: 'Khách hàng (CUST_CD)'),
                    dropdownColor: Theme.of(dialogCtx).colorScheme.surface,
                    iconEnabledColor: Theme.of(dialogCtx).colorScheme.onSurface,
                    style: TextStyle(color: Theme.of(dialogCtx).colorScheme.onSurface, fontWeight: FontWeight.w700),
                    items: _customerList
                        .map(
                          (c) => DropdownMenuItem(
                            value: _s(c['CUST_CD']),
                            child: Text('${_s(c['CUST_CD'])} - ${_s(c['CUST_NAME_KD'])}'),
                          ),
                        )
                        .toList(),
                    onChanged: (v) {
                      custCd.value = v ?? '';
                      final row = _customerList.firstWhere(
                        (e) => _s(e['CUST_CD']) == (v ?? ''),
                        orElse: () => <String, dynamic>{},
                      );
                      custName.text = _s(row['CUST_NAME_KD']);
                    },
                  ),
                  const SizedBox(height: 8),
                  TextField(controller: custName, decoration: const InputDecoration(labelText: 'CUST_NAME_KD')),
                  const SizedBox(height: 8),
                  TextField(controller: auditId, decoration: const InputDecoration(labelText: 'AUDIT_ID'), keyboardType: TextInputType.number),
                  const SizedBox(height: 8),
                  ValueListenableBuilder<DateTime>(
                    valueListenable: auditDate,
                    builder: (ctx2, v, _) {
                      return OutlinedButton(onPressed: pickAuditDate, child: Text('AUDIT_DATE: ${_ymd(v)}'));
                    },
                  ),
                  const SizedBox(height: 8),
                  TextField(controller: auditName, decoration: const InputDecoration(labelText: 'AUDIT_NAME')),
                  const SizedBox(height: 8),
                  TextField(controller: maxScore, decoration: const InputDecoration(labelText: 'AUDIT_MAX_SCORE'), keyboardType: TextInputType.number),
                  const SizedBox(height: 8),
                  TextField(controller: score, decoration: const InputDecoration(labelText: 'AUDIT_SCORE'), keyboardType: TextInputType.number),
                  const SizedBox(height: 8),
                  TextField(controller: passScore, decoration: const InputDecoration(labelText: 'AUDIT_PASS_SCORE'), keyboardType: TextInputType.number),
                  const SizedBox(height: 8),
                  TextField(controller: fileExt, decoration: const InputDecoration(labelText: 'AUDIT_FILE_EXT (vd .pdf/.xlsx)')),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.of(dialogCtx).pop(), child: const Text('Cancel')),
            FilledButton(
              onPressed: () async {
                final data = <String, dynamic>{
                  'CUST_CD': custCd.value,
                  'CUST_NAME_KD': custName.text.trim(),
                  'AUDIT_ID': int.tryParse(auditId.text.trim()) ?? 0,
                  'AUDIT_DATE': _ymd(auditDate.value),
                  'AUDIT_NAME': auditName.text.trim(),
                  'AUDIT_MAX_SCORE': int.tryParse(maxScore.text.trim()) ?? 0,
                  'AUDIT_SCORE': int.tryParse(score.text.trim()) ?? 0,
                  'AUDIT_PASS_SCORE': int.tryParse(passScore.text.trim()) ?? 0,
                  'AUDIT_RESULT': (int.tryParse(score.text.trim()) ?? 0) >= (int.tryParse(passScore.text.trim()) ?? 0) ? 'PASS' : 'FAIL',
                  'AUDIT_FILE_EXT': fileExt.text.trim(),
                };

                try {
                  if (isEdit) {
                    final body = await _post('update_AUDIT_HISTORY_DATA', data);
                    if (_isNg(body)) throw Exception(_s(body['message']));
                  } else {
                    final body = await _post('add_AUDIT_HISTORY_DATA', data);
                    if (_isNg(body)) throw Exception(_s(body['message']));
                  }

                  if (!dialogCtx.mounted) return;
                  Navigator.of(dialogCtx).pop();
                  await _load();
                } catch (e) {
                  if (!dialogCtx.mounted) return;
                  ScaffoldMessenger.of(dialogCtx).showSnackBar(SnackBar(content: Text('NG: $e')));
                }
              },
              child: const Text('Save'),
            ),
          ],
        );
      },
    );

    custName.dispose();
    auditId.dispose();
    auditName.dispose();
    maxScore.dispose();
    score.dispose();
    passScore.dispose();
    fileExt.dispose();
    custCd.dispose();
    auditDate.dispose();
  }

  Future<void> _deleteSelected() async {
    final row = _selected;
    if (row == null) {
      _snack('Chưa chọn dòng');
      return;
    }
    try {
      final body = await _post('delete_AUDIT_HISTORY_DATA', row);
      if (_isNg(body)) throw Exception(_s(body['message']));
      await _load();
    } catch (e) {
      _snack('NG: $e');
    }
  }

  Future<void> _uploadDoc() async {
    final row = _selected;
    if (row == null) {
      _snack('Chưa chọn dòng');
      return;
    }

    try {
      final result = await FilePicker.platform.pickFiles(allowMultiple: false, withData: false);
      if (result == null || result.files.isEmpty) return;
      final p = result.files.first.path;
      if (p == null || p.isEmpty) return;

      final ext = result.files.first.extension;
      if (ext == null || ext.isEmpty) {
        _snack('File không có extension');
        return;
      }

      final auditId = _n(row['AUDIT_ID']).toInt();
      if (auditId <= 0) {
        _snack('AUDIT_ID không hợp lệ');
        return;
      }

      final api = ref.read(apiClientProvider);
      final filename = '${AppConfig.ctrCd}_$auditId.$ext';
      await api.uploadFile(file: File(p), filename: filename, uploadFolderName: 'audithistory');

      final body = await _post('updateFileInfo_AUDIT_HISTORY', {
        'AUDIT_ID': auditId,
        'AUDIT_FILE_EXT': '.$ext',
      });
      if (_isNg(body)) throw Exception(_s(body['message']));

      _snack('Upload thành công');
      await _load();
    } catch (e) {
      _snack('Upload lỗi: $e');
    }
  }

  List<PlutoColumn> _buildCols() {
    PlutoColumn text(String field, {double w = 140, PlutoColumnRenderer? renderer}) {
      return PlutoColumn(
        title: field,
        field: field,
        width: w,
        type: PlutoColumnType.text(),
        enableColumnDrag: false,
        renderer: renderer,
      );
    }

    return [
      text('id', w: 60),
      text('CUST_CD', w: 110),
      text('CUST_NAME_KD', w: 160),
      text('AUDIT_ID', w: 100),
      text('AUDIT_DATE', w: 110),
      text('AUDIT_NAME', w: 160),
      text('AUDIT_MAX_SCORE', w: 120),
      text('AUDIT_SCORE', w: 110),
      text('AUDIT_PASS_SCORE', w: 130),
      text(
        'AUDIT_RESULT',
        w: 110,
        renderer: (ctx) {
          final v = _s(ctx.cell.value);
          final isPass = v.toUpperCase() == 'PASS';
          return Text(v, style: TextStyle(color: isPass ? Colors.green : Colors.red, fontWeight: FontWeight.w900));
        },
      ),
      text(
        'AUDIT_FILE_EXT',
        w: 160,
        renderer: (ctx) {
          final v = _s(ctx.cell.value);
          final row = ctx.row.cells;
          final data = {for (final e in row.entries) e.key: e.value.value};
          if (v.isEmpty) {
            return OutlinedButton(
              onPressed: _loading ? null : _uploadDoc,
              child: const Text('Upload'),
            );
          }
          return OutlinedButton(
            onPressed: () async {
              await launchUrl(_fileUrl(data), mode: LaunchMode.externalApplication);
            },
            child: const Text('Download'),
          );
        },
      ),
      text('INS_DATE', w: 140),
      text('INS_EMPL', w: 110),
      text('UPD_DATE', w: 140),
      text('UPD_EMPL', w: 110),
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

  @override
  Widget build(BuildContext context) {
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
                const Expanded(child: Text('AUDIT HISTORY', style: TextStyle(fontWeight: FontWeight.w900))),
                FilledButton.icon(
                  onPressed: _loading ? null : () => _showAddEdit(isEdit: false),
                  icon: const Icon(Icons.add),
                  label: const Text('Add'),
                ),
                const SizedBox(width: 6),
                OutlinedButton.icon(
                  onPressed: _loading ? null : () => _showAddEdit(isEdit: true),
                  icon: const Icon(Icons.edit),
                  label: const Text('Edit'),
                ),
                const SizedBox(width: 6),
                OutlinedButton.icon(
                  onPressed: _loading ? null : _deleteSelected,
                  icon: const Icon(Icons.delete),
                  label: const Text('Delete'),
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
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Checkbox(value: _allTime, onChanged: _loading ? null : (v) => setState(() => _allTime = v ?? false)),
                      const Text('All Time'),
                    ],
                  ),
                  FilledButton.icon(
                    onPressed: _loading ? null : _load,
                    icon: const Icon(Icons.refresh),
                    label: const Text('Load'),
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
                    onLoaded: (e) => e.stateManager.setShowColumnFilter(true),
                    onRowChecked: (e) {
                      final r = e.row;
                      if (r == null) return;
                      _selected = {
                        for (final c in r.cells.entries) c.key: c.value.value,
                      };
                    },
                    onRowDoubleTap: (e) async {
                      final r = e.row;
                      final row = {
                        for (final c in r.cells.entries) c.key: c.value.value,
                      };
                      final ext = _s(row['AUDIT_FILE_EXT']);
                      if (ext.isEmpty) {
                        await _uploadDoc();
                        return;
                      }
                      await launchUrl(_fileUrl(row), mode: LaunchMode.externalApplication);
                    },
                    configuration: const PlutoGridConfiguration(
                      style: PlutoGridStyleConfig(
                        rowHeight: 34,
                        columnHeight: 34,
                        cellTextStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
                        columnTextStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w900),
                        defaultCellPadding: EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                      ),
                    ),
                  ),
          ),
        ),
      ],
    );
  }
}
