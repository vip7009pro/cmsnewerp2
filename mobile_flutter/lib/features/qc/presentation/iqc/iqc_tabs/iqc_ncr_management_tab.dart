import 'dart:async';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:pluto_grid/pluto_grid.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../../core/config/app_config.dart';
import '../../../../../core/providers.dart';
import '../../../../auth/application/auth_notifier.dart';
import '../../../../auth/application/auth_state.dart';

class IqcNcrManagementTab extends ConsumerStatefulWidget {
  const IqcNcrManagementTab({super.key});

  @override
  ConsumerState<IqcNcrManagementTab> createState() => _IqcNcrManagementTabState();
}

class _IqcNcrManagementTabState extends ConsumerState<IqcNcrManagementTab> {
  bool _loading = false;
  bool _newRegister = false;
  bool _showFilter = true;

  DateTime _fromDate = DateTime.now();
  DateTime _toDate = DateTime.now();
  final TextEditingController _vendorCtrl = TextEditingController();
  final TextEditingController _mCodeFilterCtrl = TextEditingController();
  final TextEditingController _mNameFilterCtrl = TextEditingController();
  final TextEditingController _vendorLotFilterCtrl = TextEditingController();

  // New register fields
  final TextEditingController _cmsLotCtrl = TextEditingController();
  final TextEditingController _iqcEmplCtrl = TextEditingController();
  final TextEditingController _remarkCtrl = TextEditingController();
  final TextEditingController _defectTitleCtrl = TextEditingController();
  final TextEditingController _defectDetailCtrl = TextEditingController();
  final TextEditingController _vendorLotCtrl = TextEditingController();

  DateTime _expDate = DateTime.now();
  DateTime _ncrDate = DateTime.now();
  DateTime _responseReqDate = DateTime.now();

  String _emplName = '';
  String _mName = '';
  String _mCode = '';
  String _custCd = '';
  String _custNameKd = '';
  num _widthCd = 0;
  num _inQty = 0;
  num _rollQty = 0;
  num _totalQty = 0;
  num _totalRoll = 0;

  // Data
  List<Map<String, dynamic>> _ncrRows = const [];
  List<PlutoColumn> _ncrCols = const [];
  List<PlutoRow> _ncrPlutoRows = const [];
  PlutoGridStateManager? _ncrSm;

  List<PlutoColumn> _holdingCols = const [];
  List<PlutoRow> _holdingPlutoRows = const [];

  String _s(dynamic v) => (v ?? '').toString();
  double _d(dynamic v) {
    final raw = (v ?? '').toString().trim();
    if (raw.isEmpty) return 0.0;
    final normalized = raw.replaceAll(',', '').replaceAll(RegExp(r'[^0-9\.-]'), '');
    if (normalized.isEmpty) return 0.0;
    return double.tryParse(normalized) ?? 0.0;
  }

  bool _isNg(Map<String, dynamic> body) => (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  Future<Map<String, dynamic>> _post(String command, Map<String, dynamic> data) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(command, data: data);
    final body = res.data;
    if (body is Map<String, dynamic>) return body;
    return <String, dynamic>{'tk_status': 'NG', 'message': 'Bad response'};
  }

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  String _ymd(DateTime d) => '${d.year.toString().padLeft(4, '0')}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

  String _emplNo() {
    final a = ref.read(authNotifierProvider);
    if (a is AuthAuthenticated) return a.session.user.emplNo;
    return '';
  }

  String _jobName() {
    final a = ref.read(authNotifierProvider);
    if (a is AuthAuthenticated) return a.session.user.jobName;
    return '';
  }

  bool _canUpload() {
    // web uses checkBP(QC, Leader/Dept Staff/Sub Leader). We approximate by jobName not Worker.
    return _jobName().toUpperCase() != 'WORKER';
  }

  List<Map<String, dynamic>> _checkedNcrRows() {
    final checked = _ncrSm?.checkedRows ?? const [];
    return checked
        .map((r) => (r.cells['__raw__']?.value as Map<String, dynamic>?) ?? <String, dynamic>{})
        .where((e) => e.isNotEmpty)
        .toList();
  }

  List<PlutoColumn> _buildColumns(List<Map<String, dynamic>> rows) {
    if (rows.isEmpty) return const [];
    final keys = <String>[];
    final seen = <String>{};
    for (final r in rows) {
      for (final k in r.keys) {
        if (seen.add(k)) keys.add(k);
      }
    }

    PlutoColumn col(String f) {
      return PlutoColumn(
        title: f,
        field: f,
        type: rows.any((r) => r[f] is num) ? PlutoColumnType.number() : PlutoColumnType.text(),
        width: 140,
        enableSorting: true,
        enableFilterMenuItem: true,
        readOnly: true,
      );
    }

    return [
      PlutoColumn(title: '', field: '__raw__', type: PlutoColumnType.text(), width: 0, hide: true),
      PlutoColumn(
        title: '',
        field: '__check__',
        type: PlutoColumnType.text(),
        width: 44,
        enableRowChecked: true,
        enableSorting: false,
        enableFilterMenuItem: false,
      ),
      for (final f in keys) col(f),
    ];
  }

  List<PlutoRow> _buildRows(List<Map<String, dynamic>> rows, List<PlutoColumn> cols) {
    return rows
        .map(
          (r) => PlutoRow(
            cells: {
              for (final c in cols)
                c.field: PlutoCell(
                  value: c.field == '__raw__'
                      ? r
                      : (c.field == '__check__' ? '' : r[c.field]),
                ),
            },
          ),
        )
        .toList();
  }

  Future<void> _pickDate({required bool isFrom}) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: isFrom ? _fromDate : _toDate,
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
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

  Future<void> _pickNewDate({required String which}) async {
    final initial = switch (which) {
      'exp' => _expDate,
      'ncr' => _ncrDate,
      'resp' => _responseReqDate,
      _ => DateTime.now(),
    };
    final picked = await showDatePicker(
      context: context,
      initialDate: initial,
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
    );
    if (picked == null) return;
    setState(() {
      if (which == 'exp') _expDate = picked;
      if (which == 'ncr') _ncrDate = picked;
      if (which == 'resp') _responseReqDate = picked;
    });
  }

  Future<void> _loadNcrData() async {
    final messenger = ScaffoldMessenger.of(context);
    setState(() => _loading = true);
    try {
      final body = await _post('loadNCRData', {
        'M_CODE': _mCodeFilterCtrl.text.trim(),
        'M_NAME': _mNameFilterCtrl.text.trim(),
        'LOTNCC': _vendorLotFilterCtrl.text.trim(),
        'FROM_DATE': _ymd(_fromDate),
        'TO_DATE': _ymd(_toDate),
        'VENDOR_NAME': _vendorCtrl.text.trim(),
      });

      if (_isNg(body)) {
        if (!mounted) return;
        setState(() {
          _loading = false;
          _ncrRows = const [];
          _ncrCols = const [];
          _ncrPlutoRows = const [];
        });
        messenger.showSnackBar(SnackBar(content: Text('Lỗi: ${_s(body['message'])}')));
        return;
      }

      final raw = body['data'];
      final arr = raw is List ? raw : const [];
      final rows = arr.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();
      final cols = _buildColumns(rows);
      final rws = _buildRows(rows, cols);

      if (!mounted) return;
      setState(() {
        _loading = false;
        _showFilter = false;
        _newRegister = false;
        _ncrRows = rows;
        _ncrCols = cols;
        _ncrPlutoRows = rws;
      });
      messenger.showSnackBar(SnackBar(content: Text('Đã load ${rows.length} dòng')));
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  Future<void> _loadHoldingByNcrId(dynamic ncrId) async {
    setState(() => _loading = true);
    try {
      final body = await _post('loadHoldingMaterialByNCR_ID', {'NCR_ID': ncrId});
      final raw = body['data'];
      final arr = (!_isNg(body) && raw is List) ? raw : const [];
      final rows = arr.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();
      final cols = _buildColumns(rows);
      final rws = _buildRows(rows, cols);

      if (!mounted) return;
      setState(() {
        _loading = false;
        _holdingCols = cols;
        _holdingPlutoRows = rws;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Future<void> _checkEmplName(String emplNo) async {
    if (emplNo.trim().length < 7) {
      setState(() => _emplName = '');
      return;
    }
    try {
      final body = await _post('checkEMPL_NO_mobile', {'EMPL_NO': emplNo.trim()});
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() => _emplName = '');
        return;
      }
      final raw = body['data'];
      final arr = raw is List ? raw : const [];
      if (arr.isEmpty || arr.first is! Map) return;
      final m = arr.first as Map;
      final name = '${_s(m['MIDLAST_NAME'])} ${_s(m['FIRST_NAME'])}'.trim();
      if (!mounted) return;
      setState(() => _emplName = name);
    } catch (_) {
      // ignore
    }
  }

  Future<void> _checkLotI222(String cmsLot) async {
    if (cmsLot.trim().length < 6) return;
    try {
      final body = await _post('checkMNAMEfromLotI222', {'M_LOT_NO': cmsLot.trim()});
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() {
          _mName = '';
          _mCode = '';
          _custCd = '';
          _custNameKd = '';
          _vendorLotCtrl.text = '';
          _widthCd = 0;
          _inQty = 0;
          _rollQty = 0;
          _totalQty = 0;
          _totalRoll = 0;
        });
        return;
      }

      final raw = body['data'];
      final arr = raw is List ? raw : const [];
      if (arr.isEmpty || arr.first is! Map) return;
      final m = arr.first as Map;

      if (!mounted) return;
      setState(() {
        _mCode = _s(m['M_CODE']);
        _mName = '${_s(m['M_NAME'])} | ${_s(m['WIDTH_CD'])}'.trim();
        _widthCd = _d(m['WIDTH_CD']);
        _inQty = _d(m['OUT_CFM_QTY']);
        _rollQty = _d(m['ROLL_QTY']);
        _custCd = _s(m['CUST_CD']);
        _custNameKd = _s(m['CUST_NAME_KD']);
        _vendorLotCtrl.text = _s(m['LOTNCC']);
        final exp = DateTime.tryParse(_s(m['EXP_DATE']).substring(0, 10));
        if (exp != null) _expDate = exp;
      });

      final lotCms = cmsLot.trim().length >= 6 ? cmsLot.trim().substring(0, 6) : cmsLot.trim();
      final totalBody = await _post('checkMNAMEfromLotI222Total', {
        'M_CODE': _mCode,
        'LOTCMS': lotCms,
      });
      if (_isNg(totalBody)) return;
      final raw2 = totalBody['data'];
      final arr2 = raw2 is List ? raw2 : const [];
      if (arr2.isEmpty || arr2.first is! Map) return;
      final t = arr2.first as Map;
      if (!mounted) return;
      setState(() {
        _totalQty = _d(t['TOTAL_QTY']);
        _totalRoll = _d(t['TOTAL_ROLL']);
      });
    } catch (_) {
      // ignore
    }
  }

  Future<void> _newNcr() async {
    setState(() {
      _newRegister = true;
      _ncrRows = const [];
      _holdingCols = const [];
      _holdingPlutoRows = const [];
      _vendorLotCtrl.text = '';
      _mCode = '';
      _mName = '';
      _custCd = '';
      _custNameKd = '';
      _widthCd = 0;
      _inQty = 0;
      _rollQty = 0;
      _totalQty = 0;
      _totalRoll = 0;
      _cmsLotCtrl.text = '';
      _defectTitleCtrl.text = '';
      _defectDetailCtrl.text = '';
    });
  }

  Future<void> _addNewRow() async {
    if (!_newRegister) {
      _snack('Bấm NEW NCR trước');
      return;
    }

    final cmsLot = _cmsLotCtrl.text.trim();
    if (cmsLot.isEmpty) {
      _snack('Nhập CMS LOT');
      return;
    }
    if (_mCode.isEmpty) {
      _snack('LOT không hợp lệ (chưa check được M_CODE)');
      return;
    }

    final row = <String, dynamic>{
      'FACTORY': AppConfig.company == 'CMS' ? 'NM1' : 'NM1',
      'NCR_NO': '',
      'NCR_DATE': _ymd(_ncrDate),
      'RESPONSE_REQ_DATE': _ymd(_responseReqDate),
      'CUST_CD': _custCd,
      'VENDOR': _custNameKd,
      'M_CODE': _mCode,
      'M_NAME': _mName,
      'WIDTH_CD': _widthCd,
      'CMS_LOT': cmsLot,
      'VENDOR_LOT': _vendorLotCtrl.text.trim(),
      'EXP_DATE': _ymd(_expDate),
      'DEFECT_TITLE': _defectTitleCtrl.text.trim(),
      'DEFECT_DETAIL': _defectDetailCtrl.text.trim(),
      'TOTAL_QTY': _totalQty,
      'TOTAL_ROLL': _totalRoll,
      'IQC_EMPL': _iqcEmplCtrl.text.trim().isEmpty ? _emplNo() : _iqcEmplCtrl.text.trim(),
      'REMARK': _remarkCtrl.text.trim(),
      'DEFECT_IMAGE': 'N',
      'PROCESS_STATUS': 'P',
      'USE_YN': 'Y',
    };

    final newRows = [..._ncrRows, row];
    final cols = _buildColumns(newRows);
    final rws = _buildRows(newRows, cols);
    setState(() {
      _ncrRows = newRows;
      _ncrCols = cols;
      _ncrPlutoRows = rws;
    });
  }

  Future<void> _saveNewNcr() async {
    if (!_newRegister) {
      _snack('Bấm NEW NCR rồi ADD trước');
      return;
    }
    if (_ncrRows.isEmpty) {
      _snack('Chưa có dòng');
      return;
    }

    final messenger = ScaffoldMessenger.of(context);
    setState(() => _loading = true);
    try {
      var failed = 0;
      for (final r in _ncrRows) {
        final body = await _post('insertNCRData', r);
        if (_isNg(body)) failed++;
      }
      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(SnackBar(content: Text(failed == 0 ? 'Lưu NCR thành công' : 'Lưu xong, lỗi: $failed')));
      await _loadNcrData();
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  Future<void> _openNcrImage(dynamic ncrId) async {
    final url = '${AppConfig.imageBaseUrl}/ncrimage/NCR_$ncrId.png';
    final uri = Uri.tryParse(url);
    if (uri == null) {
      _snack('URL không hợp lệ');
      return;
    }
    final ok = await launchUrl(uri, mode: LaunchMode.externalApplication);
    if (!ok) _snack('Không mở được link');
  }

  Future<void> _uploadNcrImage(Map<String, dynamic> row) async {
    if (!_canUpload()) {
      _snack('Không đủ quyền upload');
      return;
    }

    final ncrId = row['NCR_ID'];
    if (ncrId == null) {
      _snack('Thiếu NCR_ID');
      return;
    }

    final picker = ImagePicker();
    final picked = await picker.pickImage(source: ImageSource.gallery, imageQuality: 90);
    if (picked == null) return;

    setState(() => _loading = true);
    try {
      final api = ref.read(apiClientProvider);
      final uploadRes = await api.uploadFile(
        file: File(picked.path),
        filename: 'NCR_$ncrId.png',
        uploadFolderName: 'ncrimage',
      );

      final body = uploadRes.data;
      if (body is Map && (body['tk_status'] ?? '').toString().toUpperCase() == 'NG') {
        if (!mounted) return;
        setState(() => _loading = false);
        _snack('Upload thất bại: ${_s(body['message'])}');
        return;
      }

      final upd = await _post('update_ncr_image', {'NCR_ID': ncrId, 'imagevalue': 'Y'});
      if (_isNg(upd)) {
        if (!mounted) return;
        setState(() => _loading = false);
        _snack('Cập nhật DB thất bại: ${_s(upd['message'])}');
        return;
      }

      if (!mounted) return;
      setState(() {
        _loading = false;
        _ncrRows = _ncrRows.map((e) {
          if (_s(e['NCR_ID']) == _s(ncrId)) {
            final m = Map<String, dynamic>.from(e);
            m['DEFECT_IMAGE'] = 'Y';
            return m;
          }
          return e;
        }).toList();
        _ncrCols = _buildColumns(_ncrRows);
        _ncrPlutoRows = _buildRows(_ncrRows, _ncrCols);
      });
      _snack('Upload ảnh thành công');
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi upload: $e');
    }
  }

  @override
  void initState() {
    super.initState();
    _iqcEmplCtrl.text = _emplNo();
    scheduleMicrotask(_loadNcrData);
  }

  @override
  void dispose() {
    _vendorCtrl.dispose();
    _mCodeFilterCtrl.dispose();
    _mNameFilterCtrl.dispose();
    _vendorLotFilterCtrl.dispose();
    _cmsLotCtrl.dispose();
    _iqcEmplCtrl.dispose();
    _remarkCtrl.dispose();
    _defectTitleCtrl.dispose();
    _defectDetailCtrl.dispose();
    _vendorLotCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    Widget filterHeader = Card(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        child: Row(
          children: [
            IconButton(
              tooltip: _showFilter ? 'Ẩn filter' : 'Hiện filter',
              onPressed: _loading ? null : () => setState(() => _showFilter = !_showFilter),
              icon: Icon(_showFilter ? Icons.filter_alt_off : Icons.filter_alt),
            ),
            const Expanded(child: Text('NCR MANAGEMENT', style: TextStyle(fontWeight: FontWeight.w900))),
          ],
        ),
      ),
    );

    Widget filterCard = !_showFilter
        ? const SizedBox.shrink()
        : Card(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Wrap(
                spacing: 12,
                runSpacing: 8,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: [
                  OutlinedButton(onPressed: _loading ? null : () => _pickDate(isFrom: true), child: Text('Từ: ${_ymd(_fromDate)}')),
                  OutlinedButton(onPressed: _loading ? null : () => _pickDate(isFrom: false), child: Text('Đến: ${_ymd(_toDate)}')),
                  SizedBox(width: 160, child: TextField(controller: _mCodeFilterCtrl, decoration: const InputDecoration(labelText: 'M_CODE'))),
                  SizedBox(width: 180, child: TextField(controller: _mNameFilterCtrl, decoration: const InputDecoration(labelText: 'M_NAME'))),
                  SizedBox(width: 160, child: TextField(controller: _vendorLotFilterCtrl, decoration: const InputDecoration(labelText: 'VENDOR LOT'))),
                  SizedBox(width: 160, child: TextField(controller: _vendorCtrl, decoration: const InputDecoration(labelText: 'VENDOR NAME'))),
                  FilledButton.icon(onPressed: _loading ? null : _loadNcrData, icon: const Icon(Icons.search), label: const Text('Tra Data')),
                  FilledButton.tonal(onPressed: _loading ? null : _newNcr, child: const Text('NEW NCR')),
                ],
              ),
            ),
          );

    Widget newCard = !_newRegister
        ? const SizedBox.shrink()
        : Card(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Text('Đăng ký NCR', style: TextStyle(fontWeight: FontWeight.w900)),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 12,
                    runSpacing: 8,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: [
                      SizedBox(
                        width: 200,
                        child: TextField(
                          controller: _cmsLotCtrl,
                          decoration: const InputDecoration(labelText: 'CMS LOT'),
                          onChanged: (v) {
                            if (v.trim().length >= 6) {
                              unawaited(_checkLotI222(v));
                            }
                          },
                        ),
                      ),
                      SizedBox(
                        width: 160,
                        child: TextField(
                          controller: _iqcEmplCtrl,
                          decoration: const InputDecoration(labelText: 'IQC EMPL'),
                          onChanged: (v) => unawaited(_checkEmplName(v)),
                        ),
                      ),
                      if (_emplName.isNotEmpty) Text(_emplName, style: const TextStyle(fontWeight: FontWeight.w700, color: Colors.blue)),
                      SizedBox(width: 180, child: TextField(controller: _vendorLotCtrl, decoration: const InputDecoration(labelText: 'VENDOR LOT'))),
                      SizedBox(width: 180, child: TextField(controller: _defectTitleCtrl, decoration: const InputDecoration(labelText: 'DEFECT TITLE'))),
                      SizedBox(width: 260, child: TextField(controller: _defectDetailCtrl, decoration: const InputDecoration(labelText: 'DEFECT DETAIL'))),
                      SizedBox(width: 220, child: TextField(controller: _remarkCtrl, decoration: const InputDecoration(labelText: 'Remark'))),
                      OutlinedButton(onPressed: _loading ? null : () => _pickNewDate(which: 'ncr'), child: Text('NCR: ${_ymd(_ncrDate)}')),
                      OutlinedButton(onPressed: _loading ? null : () => _pickNewDate(which: 'resp'), child: Text('Resp: ${_ymd(_responseReqDate)}')),
                      OutlinedButton(onPressed: _loading ? null : () => _pickNewDate(which: 'exp'), child: Text('EXP: ${_ymd(_expDate)}')),
                      FilledButton.tonal(onPressed: _loading ? null : _addNewRow, child: const Text('Add')),
                      FilledButton.tonal(onPressed: _loading ? null : _saveNewNcr, child: const Text('Save')),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 12,
                    runSpacing: 6,
                    children: [
                      Text('M_CODE: $_mCode', style: TextStyle(color: scheme.onSurfaceVariant)),
                      Text('M_NAME: $_mName', style: TextStyle(color: scheme.onSurfaceVariant)),
                      Text('CUST: $_custNameKd ($_custCd)', style: TextStyle(color: scheme.onSurfaceVariant)),
                      Text('WIDTH: ${_widthCd.toStringAsFixed(0)}', style: TextStyle(color: scheme.onSurfaceVariant)),
                      Text('ROLL: ${_rollQty.toStringAsFixed(0)}  QTY: ${_inQty.toStringAsFixed(0)}', style: TextStyle(color: scheme.onSurfaceVariant)),
                      Text('TOTAL ROLL: ${_totalRoll.toStringAsFixed(0)}  TOTAL QTY: ${_totalQty.toStringAsFixed(0)}', style: TextStyle(color: scheme.onSurfaceVariant)),
                    ],
                  ),
                ],
              ),
            ),
          );

    Widget ncrTable = Card(
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: SizedBox(
          height: 420,
          child: _loading
              ? const Center(child: CircularProgressIndicator())
              : (_ncrCols.isEmpty
                  ? const Center(child: Text('Chưa có dữ liệu'))
                  : PlutoGrid(
                      columns: _ncrCols,
                      rows: _ncrPlutoRows,
                      onLoaded: (e) {
                        _ncrSm = e.stateManager;
                        e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                        e.stateManager.setShowColumnFilter(true);
                      },
                      onRowDoubleTap: (e) {
                        final raw = e.row.cells['__raw__']?.value;
                        if (raw is Map<String, dynamic>) {
                          _loadHoldingByNcrId(raw['NCR_ID']);
                        }
                      },
                      onRowChecked: (e) {
                        // no-op
                      },
                      createFooter: (sm) => PlutoPagination(sm),
                      configuration: const PlutoGridConfiguration(
                        columnSize: PlutoGridColumnSizeConfig(autoSizeMode: PlutoAutoSizeMode.scale),
                      ),
                    )),
        ),
      ),
    );

    Widget ncrActions = Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Wrap(
          spacing: 12,
          runSpacing: 8,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            FilledButton.tonal(
              onPressed: (!_canUpload() || _loading)
                  ? null
                  : () async {
                      final checked = _checkedNcrRows();
                      if (checked.length != 1) {
                        _snack('Chọn đúng 1 dòng để upload');
                        return;
                      }
                      await _uploadNcrImage(checked.first);
                    },
              child: const Text('Upload Image (checked 1 dòng)'),
            ),
            FilledButton.tonal(
              onPressed: _loading
                  ? null
                  : () async {
                      final checked = _checkedNcrRows();
                      if (checked.length != 1) {
                        _snack('Chọn đúng 1 dòng để mở link');
                        return;
                      }
                      await _openNcrImage(checked.first['NCR_ID']);
                    },
              child: const Text('Open Image Link'),
            ),
            Text('Tip: double tap row để load Holding', style: TextStyle(color: scheme.onSurfaceVariant)),
          ],
        ),
      ),
    );

    Widget holdingTable = Card(
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: SizedBox(
          height: 260,
          child: _holdingCols.isEmpty
              ? const Center(child: Text('Holding by NCR_ID'))
              : PlutoGrid(
                  columns: _holdingCols,
                  rows: _holdingPlutoRows,
                  onLoaded: (e) {
                    e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                    e.stateManager.setShowColumnFilter(true);
                  },
                  configuration: const PlutoGridConfiguration(
                    columnSize: PlutoGridColumnSizeConfig(autoSizeMode: PlutoAutoSizeMode.scale),
                  ),
                ),
        ),
      ),
    );

    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            filterHeader,
            filterCard,
            if (_loading) const LinearProgressIndicator(),
            newCard,
            ncrActions,
            ncrTable,
            holdingTable,
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
