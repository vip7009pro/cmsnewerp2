import 'dart:io';

import 'package:excel/excel.dart' as xls;
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:pluto_grid/pluto_grid.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../../core/config/app_config.dart';
import '../../../../../core/providers.dart';
import '../../../../../core/utils/excel_exporter.dart';

class AuditTab extends ConsumerStatefulWidget {
  const AuditTab({super.key});

  @override
  ConsumerState<AuditTab> createState() => _AuditTabState();
}

class _AuditTabState extends ConsumerState<AuditTab> {
  bool _loading = false;
  bool _showFilter = true;

  DateTime _fromDate = DateTime.now();
  DateTime _toDate = DateTime.now();

  int _selectedAuditId = 1;
  int _selectedAuditResultId = -1;

  List<Map<String, dynamic>> _auditList = const [];
  List<Map<String, dynamic>> _auditResultList = const [];
  List<Map<String, dynamic>> _auditResultCheckList = const [];

  final Set<int> _selectedCheckDetailIds = <int>{};

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
    Future.microtask(_loadAuditList);
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

  Future<void> _loadAuditList() async {
    setState(() => _loading = true);
    try {
      final body = await _post('auditlistcheck', {
        'FROM_DATE': _ymd(_fromDate),
        'TO_DATE': _ymd(_toDate),
      });
      if (_isNg(body)) {
        setState(() {
          _auditList = const [];
          _auditResultList = const [];
          _auditResultCheckList = const [];
          _selectedAuditResultId = -1;
          _selectedCheckDetailIds.clear();
        });
        return;
      }
      final raw = body['data'];
      final list = raw is List ? raw : const [];
      final rows = list.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();
      for (var i = 0; i < rows.length; i++) {
        rows[i]['id'] = i;
      }
      if (!mounted) return;
      setState(() {
        _auditList = rows;
        if (_auditList.isNotEmpty) {
          _selectedAuditId = _n(_auditList.first['AUDIT_ID']).toInt();
        }
      });
      await _loadAuditResultList(auditId: _selectedAuditId);
    } catch (e) {
      _snack('Lỗi: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _loadAuditResultList({required int auditId}) async {
    try {
      final body = await _post('loadAuditResultList', {'AUDIT_ID': auditId});
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() {
          _auditResultList = const [];
          _auditResultCheckList = const [];
          _selectedAuditResultId = -1;
          _selectedCheckDetailIds.clear();
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
      if (!mounted) return;
      setState(() {
        _auditResultList = rows;
        _auditResultCheckList = const [];
        _selectedAuditResultId = -1;
        _selectedCheckDetailIds.clear();
      });
    } catch (e) {
      _snack('Lỗi: $e');
    }
  }

  Future<void> _loadAuditResultCheckList({required int auditResultId}) async {
    try {
      final body = await _post('loadAuditResultCheckList', {'AUDIT_RESULT_ID': auditResultId});
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() {
          _auditResultCheckList = const [];
          _selectedCheckDetailIds.clear();
        });
        return;
      }
      final raw = body['data'];
      final list = raw is List ? raw : const [];
      final rows = list.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();
      for (var i = 0; i < rows.length; i++) {
        rows[i]['id'] = i;
        rows[i]['INS_DATE'] = _fmtYmdHms(rows[i]['INS_DATE']);
        rows[i]['UPD_DATE'] = _fmtYmdHms(rows[i]['UPD_DATE']);
      }
      if (!mounted) return;
      setState(() {
        _auditResultCheckList = rows;
        _selectedCheckDetailIds.clear();
      });
    } catch (e) {
      _snack('Lỗi: $e');
    }
  }

  Future<bool> _checkAuditResultCheckListExist(int auditResultId) async {
    try {
      final body = await _post('checkAuditResultCheckListExist', {'AUDIT_RESULT_ID': auditResultId});
      if (_isNg(body)) return false;
      final raw = body['data'];
      final list = raw is List ? raw : const [];
      return list.isNotEmpty;
    } catch (_) {
      return false;
    }
  }

  Future<void> _insertNewResultCheckList({required int auditResultId, required int auditId}) async {
    try {
      await _post('insertResultIDtoCheckList', {'AUDIT_RESULT_ID': auditResultId, 'AUDIT_ID': auditId});
    } catch (_) {
      // ignore
    }
  }

  Future<void> _createNewAudit() async {
    final audit = _auditList.firstWhere(
      (e) => _n(e['AUDIT_ID']).toInt() == _selectedAuditId,
      orElse: () => <String, dynamic>{},
    );
    if (audit.isEmpty) {
      _snack('Chưa có Audit');
      return;
    }

    try {
      final body = await _post('createNewAudit', {
        'AUDIT_ID': _selectedAuditId,
        'AUDIT_NAME': _s(audit['AUDIT_NAME']),
      });
      if (_isNg(body)) {
        _snack('NG: ${_s(body['message'])}');
        return;
      }
      await _loadAuditResultList(auditId: _selectedAuditId);
      _snack('Đã tạo Audit');
    } catch (e) {
      _snack('Lỗi: $e');
    }
  }

  Future<void> _resetEvident() async {
    if (_selectedCheckDetailIds.isEmpty) {
      _snack('Chưa chọn dòng checksheet');
      return;
    }

    try {
      for (final id in _selectedCheckDetailIds) {
        await _post('resetEvident', {'AUDIT_RESULT_DETAIL_ID': id});
      }
      await _loadAuditResultCheckList(auditResultId: _selectedAuditResultId);
      _snack('Đã reset');
    } catch (e) {
      _snack('Lỗi: $e');
    }
  }

  Future<void> _saveCheckSheet() async {
    if (_selectedCheckDetailIds.isEmpty) {
      _snack('Chưa chọn dòng checksheet');
      return;
    }

    try {
      for (final id in _selectedCheckDetailIds) {
        final row = _auditResultCheckList.firstWhere(
          (e) => _n(e['AUDIT_RESULT_DETAIL_ID']).toInt() == id,
          orElse: () => <String, dynamic>{},
        );
        if (row.isEmpty) continue;
        await _post('updatechecksheetResultRow', {
          'AUDIT_RESULT_DETAIL_ID': id,
          'REMARK': _s(row['REMARK']),
          'AUDIT_SCORE': _n(row['AUDIT_SCORE']).toInt(),
        });
      }
      _snack('Đã lưu checksheet');
      await _loadAuditResultCheckList(auditResultId: _selectedAuditResultId);
    } catch (e) {
      _snack('Lỗi: $e');
    }
  }

  Uri _evidentUrl({required int auditResultId, required int detailId, required String filename}) {
    final protocol = AppConfig.baseUrl.startsWith('https') ? 'https' : 'http';
    final host = AppConfig.baseUrl.replaceFirst(RegExp(r'^https?://'), '');
    return Uri.parse('$protocol://$host/audit/AUDIT_${auditResultId}_${detailId}_$filename');
  }

  Future<void> _uploadEvidentForRow(Map<String, dynamic> row) async {
    final auditResultId = _n(row['AUDIT_RESULT_ID']).toInt();
    final detailId = _n(row['AUDIT_RESULT_DETAIL_ID']).toInt();
    if (auditResultId <= 0 || detailId <= 0) return;

    final result = await FilePicker.platform.pickFiles(allowMultiple: true, withData: false);
    if (result == null || result.files.isEmpty) return;

    final api = ref.read(apiClientProvider);
    final uploadedNames = <String>[];

    try {
      for (final f in result.files) {
        final p = f.path;
        if (p == null || p.isEmpty) continue;
        final name = f.name;
        final upName = 'AUDIT_${auditResultId}_${detailId}_$name';
        await api.uploadFile(file: File(p), filename: upName, uploadFolderName: 'audit');
        uploadedNames.add(name);
      }

      if (uploadedNames.isNotEmpty) {
        final list = uploadedNames.join(',');
        final body = await _post('updateEvident', {
          'AUDIT_RESULT_DETAIL_ID': detailId,
          'AUDIT_EVIDENT': list,
        });
        if (_isNg(body)) throw Exception(_s(body['message']));
      }

      await _loadAuditResultCheckList(auditResultId: _selectedAuditResultId);
      _snack('Upload thành công');
    } catch (e) {
      _snack('Upload lỗi: $e');
    }
  }

  Future<void> _addFormFromExcel() async {
    await _loadCustomers();
    if (!context.mounted) return;
    final parentContext = context;

    final auditNameCtrl = TextEditingController();
    final passScoreCtrl = TextEditingController(text: '80');

    String selectedCustCd = _customerList.isNotEmpty ? _s(_customerList.first['CUST_CD']) : '';

    List<Map<String, dynamic>> uploadRows = const [];

    Future<void> pickExcel() async {
      final res = await FilePicker.platform.pickFiles(
        allowMultiple: false,
        withData: true,
        type: FileType.custom,
        allowedExtensions: const ['xlsx', 'xls'],
      );
      if (res == null || res.files.isEmpty) return;
      final file = res.files.first;
      final bytes = file.bytes;
      if (bytes == null) return;

      final excel = xls.Excel.decodeBytes(bytes);
      final sheet = excel.tables.values.isEmpty ? null : excel.tables.values.first;
      if (sheet == null) return;

      final rows = <Map<String, dynamic>>[];
      if (sheet.maxRows < 2) return;

      final header = sheet.rows.first.map((c) => c?.value?.toString() ?? '').toList();
      for (var i = 1; i < sheet.maxRows; i++) {
        final r = sheet.rows[i];
        if (r.isEmpty) continue;
        final m = <String, dynamic>{};
        for (var j = 0; j < header.length && j < r.length; j++) {
          final k = header[j];
          if (k.trim().isEmpty) continue;
          m[k] = r[j]?.value;
        }
        if (m.isNotEmpty) rows.add(m);
      }

      uploadRows = rows;
      _snack('Đã đọc ${rows.length} dòng Excel');
    }

    Future<void> save() async {
      if (auditNameCtrl.text.trim().isEmpty) throw Exception('Hãy nhập tên Audit');
      if (uploadRows.isEmpty) throw Exception('Nội dung checksheet trống');

      // check name exist
      final check = await _post('checkAuditNamebyCustomer', {
        'AUDIT_NAME': auditNameCtrl.text.trim(),
        'CUST_CD': selectedCustCd,
      });
      if (!_isNg(check)) {
        final raw = check['data'];
        final list = raw is List ? raw : const [];
        if (list.isNotEmpty) throw Exception('Đã có Audit này với khách này rồi');
      }

      final insert = await _post('insertNewAuditInfo', {
        'AUDIT_NAME': auditNameCtrl.text.trim(),
        'CUST_CD': selectedCustCd,
        'PASS_SCORE': int.tryParse(passScoreCtrl.text.trim()) ?? 80,
      });
      if (_isNg(insert)) throw Exception(_s(insert['message']));

      // get last audit id
      var lastAuditId = 1;
      final last = await _post('checklastAuditID', {});
      if (!_isNg(last)) {
        final raw = last['data'];
        final list = raw is List ? raw : const [];
        if (list.isNotEmpty) {
          lastAuditId = _n((list.first as Map)['MAX_AUDIT_ID']).toInt();
        }
      }

      for (final r in uploadRows) {
        await _post('insertCheckSheetData', {
          'AUDIT_ID': lastAuditId,
          'MAIN_ITEM_NO': r['MAIN_ITEM_NO'],
          'MAIN_ITEM_CONTENT': r['MAIN_ITEM_CONTENT'],
          'SUB_ITEM_NO': r['SUB_ITEM_NO'],
          'SUB_ITEM_CONTENT': r['SUB_ITEM_CONTENT'],
          'LEVEL_CAT': r['LEVEL_CAT'],
          'DETAIL_VN': r['DETAIL_VN'],
          'DETAIL_KR': r['DETAIL_KR'],
          'DETAIL_EN': r['DETAIL_EN'],
          'MAX_SCORE': r['MAX_SCORE'],
          'DEPARTMENT': r['DEPARTMENT'],
        });
      }
    }

    await showDialog<void>(
      context: parentContext,
      builder: (dialogCtx) {
        return StatefulBuilder(
          builder: (ctx2, setState2) {
            return AlertDialog(
              title: const Text('Add Form (Upload Excel Checksheet)'),
              content: SizedBox(
                width: 720,
                child: SingleChildScrollView(
                  child: Column(
                    children: [
                      DropdownButtonFormField<String>(
                        initialValue: selectedCustCd.isEmpty ? null : selectedCustCd,
                        decoration: const InputDecoration(labelText: 'Customer (CUST_CD)'),
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
                        onChanged: (v) => setState2(() => selectedCustCd = v ?? ''),
                      ),
                      const SizedBox(height: 8),
                      TextField(controller: auditNameCtrl, decoration: const InputDecoration(labelText: 'Audit name')),
                      const SizedBox(height: 8),
                      TextField(controller: passScoreCtrl, decoration: const InputDecoration(labelText: 'Pass score'), keyboardType: TextInputType.number),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          FilledButton.icon(onPressed: pickExcel, icon: const Icon(Icons.upload_file), label: const Text('Chọn Excel')),
                          const SizedBox(width: 10),
                          Text('Rows: ${uploadRows.length}', style: const TextStyle(fontWeight: FontWeight.w900)),
                        ],
                      ),
                      const SizedBox(height: 10),
                      if (uploadRows.isNotEmpty)
                        SizedBox(
                          height: 260,
                          child: ListView.builder(
                            itemCount: uploadRows.length.clamp(0, 10),
                            itemBuilder: (_, i) {
                              final r = uploadRows[i];
                              return Text('${r['MAIN_ITEM_NO'] ?? ''}.${r['SUB_ITEM_NO'] ?? ''} - ${_s(r['SUB_ITEM_CONTENT'])}');
                            },
                          ),
                        ),
                    ],
                  ),
                ),
              ),
              actions: [
                TextButton(onPressed: () => Navigator.of(ctx2).pop(), child: const Text('Cancel')),
                FilledButton(
                  onPressed: () async {
                    try {
                      await save();
                      if (!ctx2.mounted) return;
                      Navigator.of(ctx2).pop();
                      await _loadAuditList();
                      _snack('Thêm thành công');
                    } catch (e) {
                      if (!ctx2.mounted) return;
                      ScaffoldMessenger.of(dialogCtx).showSnackBar(SnackBar(content: Text('NG: $e')));
                    }
                  },
                  child: const Text('Save'),
                ),
              ],
            );
          },
        );
      },
    );

    auditNameCtrl.dispose();
    passScoreCtrl.dispose();
  }

  String _fmtYmd(dynamic v) {
    final s = _s(v).trim();
    if (s.isEmpty) return '';
    final dt = DateTime.tryParse(s.replaceFirst(' ', 'T')) ?? DateTime.tryParse(s);
    if (dt == null) return s;
    return DateFormat('yyyy-MM-dd').format(dt.toLocal());
  }

  String _fmtYmdHms(dynamic v) {
    final s = _s(v).trim();
    if (s.isEmpty || s == 'null') return '';
    final dt = DateTime.tryParse(s.replaceFirst(' ', 'T')) ?? DateTime.tryParse(s);
    if (dt == null) return s;
    final local = dt.isUtc ? dt.toLocal() : dt;
    return DateFormat('yyyy-MM-dd HH:mm:ss').format(local);
  }

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  @override
  Widget build(BuildContext context) {
    final dropdownTextColor = Theme.of(context).brightness == Brightness.dark ? Theme.of(context).colorScheme.onSurface : Colors.black87;
    final auditNameLabel = _auditList.isEmpty
        ? 'No audits'
        : _auditList.firstWhere(
            (e) => _n(e['AUDIT_ID']).toInt() == _selectedAuditId,
            orElse: () => _auditList.first,
          )['AUDIT_NAME']?.toString();

    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(12),
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
                    const Expanded(child: Text('SELF AUDIT', style: TextStyle(fontWeight: FontWeight.w900))),
                    FilledButton.icon(
                      onPressed: _loading ? null : _addFormFromExcel,
                      icon: const Icon(Icons.add),
                      label: const Text('Add Form'),
                    ),
                    const SizedBox(width: 8),
                    FilledButton.icon(
                      onPressed: _loading ? null : _createNewAudit,
                      icon: const Icon(Icons.play_circle),
                      label: const Text('Create Audit'),
                    ),
                  ],
                ),
              ),
            ),
            if (_showFilter)
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Wrap(
                    spacing: 12,
                    runSpacing: 8,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: [
                      OutlinedButton(onPressed: _loading ? null : () => _pickDate(from: true), child: Text('Từ: ${_ymd(_fromDate)}')),
                      OutlinedButton(onPressed: _loading ? null : () => _pickDate(from: false), child: Text('Đến: ${_ymd(_toDate)}')),
                      ConstrainedBox(
                        constraints: const BoxConstraints(maxWidth: 520),
                        child: DropdownButtonHideUnderline(
                          child: DropdownButton<int>(
                            isExpanded: true,
                            value: _selectedAuditId,
                            dropdownColor: Theme.of(context).colorScheme.surface,
                            iconEnabledColor: dropdownTextColor,
                            style: TextStyle(color: dropdownTextColor, fontWeight: FontWeight.w700),
                            selectedItemBuilder: (ctx) {
                              return _auditList
                                  .map(
                                    (e) => Align(
                                      alignment: Alignment.centerLeft,
                                      child: Text(
                                        '${_s(e['CUST_NAME_KD'])}:${_s(e['AUDIT_NAME'])}',
                                        overflow: TextOverflow.ellipsis,
                                        maxLines: 1,
                                        style: TextStyle(color: dropdownTextColor, fontWeight: FontWeight.w700),
                                      ),
                                    ),
                                  )
                                  .toList();
                            },
                            onChanged: _loading
                                ? null
                                : (v) async {
                                    final id = v ?? _selectedAuditId;
                                    setState(() {
                                      _selectedAuditId = id;
                                      _selectedAuditResultId = -1;
                                      _auditResultCheckList = const [];
                                      _selectedCheckDetailIds.clear();
                                    });
                                    await _loadAuditResultList(auditId: id);
                                  },
                            items: _auditList
                                .map(
                                  (e) => DropdownMenuItem(
                                    value: _n(e['AUDIT_ID']).toInt(),
                                    child: Text(
                                      '${_s(e['CUST_NAME_KD'])}:${_s(e['AUDIT_NAME'])}',
                                      overflow: TextOverflow.ellipsis,
                                      maxLines: 1,
                                    ),
                                  ),
                                )
                                .toList(),
                          ),
                        ),
                      ),
                      FilledButton.icon(
                        onPressed: _loading ? null : _loadAuditList,
                        icon: const Icon(Icons.refresh),
                        label: const Text('Refresh'),
                      ),
                      Text('Selected audit: ${auditNameLabel ?? ''}', style: const TextStyle(fontWeight: FontWeight.w700)),
                    ],
                  ),
                ),
              ),
            if (_loading) const LinearProgressIndicator(),
            _sectionTitle('Audit Result List'),
            _grid(
              rows: _auditResultList,
              columns: [
                _col('AUDIT_RESULT_ID', 90),
                _col('AUDIT_ID', 70),
                _col('AUDIT_NAME', 180),
                _col('AUDIT_DATE', 110),
                _col('REMARK', 160),
                _col('INS_DATE', 160),
                _col('INS_EMPL', 100),
                _col('UPD_DATE', 160),
                _col('UPD_EMPL', 100),
              ],
              onRowTap: (row) async {
                final auditResultId = _n(row['AUDIT_RESULT_ID']).toInt();
                final auditId = _n(row['AUDIT_ID']).toInt();
                setState(() {
                  _selectedAuditResultId = auditResultId;
                  _selectedCheckDetailIds.clear();
                });

                final exist = await _checkAuditResultCheckListExist(auditResultId);
                if (!exist) {
                  await _insertNewResultCheckList(auditResultId: auditResultId, auditId: auditId);
                }
                await _loadAuditResultCheckList(auditResultId: auditResultId);
              },
            ),
            _sectionTitle('Audit CheckList Result'),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              crossAxisAlignment: WrapCrossAlignment.center,
              children: [
                FilledButton.icon(
                  onPressed: (_loading || _selectedAuditResultId <= 0) ? null : _saveCheckSheet,
                  icon: const Icon(Icons.save),
                  label: const Text('Lưu Checksheet'),
                ),
                OutlinedButton.icon(
                  onPressed: (_loading || _selectedAuditResultId <= 0) ? null : _resetEvident,
                  icon: const Icon(Icons.refresh),
                  label: const Text('Reset Evident'),
                ),
                OutlinedButton.icon(
                  onPressed: (_loading || _selectedAuditResultId <= 0)
                      ? null
                      : () => _loadAuditResultCheckList(auditResultId: _selectedAuditResultId),
                  icon: const Icon(Icons.replay),
                  label: const Text('Reload'),
                ),
                OutlinedButton.icon(
                  onPressed: _auditResultCheckList.isEmpty
                      ? null
                      : () => ExcelExporter.shareAsXlsx(
                            fileName: 'audit_checklist_${_selectedAuditResultId}_${_ymd(DateTime.now())}.xlsx',
                            rows: _auditResultCheckList,
                          ),
                  icon: const Icon(Icons.table_view),
                  label: const Text('Excel'),
                ),
              ],
            ),
            const SizedBox(height: 8),
            _grid(
              rows: _auditResultCheckList,
              columns: [
                _col('AUDIT_RESULT_DETAIL_ID', 130),
                _col('AUDIT_RESULT_ID', 110),
                _col('AUDIT_DETAIL_ID', 110),
                _col('AUDIT_ID', 90),
                _col('AUDIT_NAME', 200),
                _col('MAIN_ITEM_NO', 110),
                _col('SUB_ITEM_NO', 110),
                _col('SUB_ITEM_CONTENT', 280),
                _col('LEVEL_CAT', 110),
                _col('DETAIL_VN', 320),
                _col('MAX_SCORE', 110),
                _col('AUDIT_SCORE', 110, editable: true),
                _col('AUDIT_EVIDENT', 160),
                _col('REMARK', 220, editable: true),
                _col('DEPARTMENT', 120),
                _col('INS_DATE', 160),
                _col('INS_EMPL', 100),
                _col('UPD_DATE', 160),
                _col('UPD_EMPL', 100),
              ],
              rowHeight: 46,
              onRowTap: (_) async {},
              onCustomCellTap: (row) async {
                await _uploadEvidentForRow(row);
              },
              customCellField: 'AUDIT_EVIDENT',
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _sectionTitle(String t) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(4, 12, 4, 6),
      child: Text(t, style: const TextStyle(fontWeight: FontWeight.w900)),
    );
  }

  PlutoColumn _col(String field, double width, {bool editable = false}) {
    return PlutoColumn(
      title: field,
      field: field,
      width: width,
      type: PlutoColumnType.text(),
      enableColumnDrag: false,
      enableEditingMode: editable,
      renderer: (ctx) {
        if (field == 'AUDIT_EVIDENT') {
          final v = _s(ctx.cell.value);
          final auditResultId = _n(ctx.row.cells['AUDIT_RESULT_ID']?.value).toInt();
          final detailId = _n(ctx.row.cells['AUDIT_RESULT_DETAIL_ID']?.value).toInt();
          if (v.isNotEmpty && auditResultId > 0 && detailId > 0) {
            final files = v.split(',').where((e) => e.trim().isNotEmpty).toList();
            return Wrap(
              spacing: 6,
              children: [
                for (final f in files.take(3))
                  OutlinedButton(
                    onPressed: () => launchUrl(_evidentUrl(auditResultId: auditResultId, detailId: detailId, filename: f), mode: LaunchMode.externalApplication),
                    child: Text(f, overflow: TextOverflow.ellipsis),
                  ),
                FilledButton(
                  onPressed: () {
                    // handled by onCustomCellTap
                  },
                  child: const Text('Upload'),
                ),
              ],
            );
          }
          return FilledButton(
            onPressed: () {
              // handled by onCustomCellTap
            },
            child: const Text('Upload'),
          );
        }

        if (field == 'AUDIT_SCORE') {
          final v = _s(ctx.cell.value);
          return Text(v, style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.w800));
        }

        return Text(_s(ctx.cell.value), maxLines: 2, overflow: TextOverflow.ellipsis);
      },
    );
  }

  Widget _grid({
    required List<Map<String, dynamic>> rows,
    required List<PlutoColumn> columns,
    required Future<void> Function(Map<String, dynamic> row) onRowTap,
    double rowHeight = 34,
    String? customCellField,
    Future<void> Function(Map<String, dynamic> row)? onCustomCellTap,
  }) {
    if (rows.isEmpty) {
      return const Card(child: SizedBox(height: 120, child: Center(child: Text('No data'))));
    }

    final plutoRows = rows
        .map(
          (r) => PlutoRow(
            cells: {
              for (final c in columns) c.field: PlutoCell(value: r[c.field]),
            },
            checked: false,
          ),
        )
        .toList(growable: false);

    return Card(
      child: SizedBox(
        height: 320,
        child: PlutoGrid(
          columns: columns,
          rows: plutoRows,
          onLoaded: (e) {
            e.stateManager.setShowColumnFilter(true);
          },
          onRowChecked: (e) {
            final r = e.row;
            if (r == null) return;
            final id = _n(r.cells['AUDIT_RESULT_DETAIL_ID']?.value).toInt();
            if (id > 0) {
              setState(() {
                if (e.isChecked == true) {
                  _selectedCheckDetailIds.add(id);
                } else {
                  _selectedCheckDetailIds.remove(id);
                }

                final idx = _auditResultCheckList.indexWhere((x) => _n(x['AUDIT_RESULT_DETAIL_ID']).toInt() == id);
                if (idx >= 0) {
                  // keep selection in sync
                }
              });
            }
          },
          onRowDoubleTap: (e) async {
            final row = e.row;
            final data = {
              for (final c in row.cells.entries) c.key: c.value.value,
            };
            await onRowTap(data);
          },
          onChanged: (e) {
            final field = e.column.field;
            if (field != 'REMARK' && field != 'AUDIT_SCORE') return;

            final id = _n(e.row.cells['AUDIT_RESULT_DETAIL_ID']?.value).toInt();
            if (id <= 0) return;

            final idx = _auditResultCheckList.indexWhere((x) => _n(x['AUDIT_RESULT_DETAIL_ID']).toInt() == id);
            if (idx < 0) return;

            setState(() {
              _auditResultCheckList[idx][field] = e.value;
            });
          },
          onSelected: (e) async {
            if (customCellField == null || onCustomCellTap == null) return;
            final cell = e.cell;
            final row = e.row;
            if (cell == null || row == null) return;
            if (cell.column.field != customCellField) return;
            final data = {
              for (final c in row.cells.entries) c.key: c.value.value,
            };
            await onCustomCellTap(data);
          },
          configuration: PlutoGridConfiguration(
            style: PlutoGridStyleConfig(
              rowHeight: rowHeight,
              columnHeight: 34,
              cellTextStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
              columnTextStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900),
              defaultCellPadding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
            ),
          ),
        ),
      ),
    );
  }
}
