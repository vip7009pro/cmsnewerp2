import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pluto_grid/pluto_grid.dart';

import '../../../../../core/providers.dart';
import '../../../../auth/application/auth_notifier.dart';
import '../../../../auth/application/auth_state.dart';

class IqcIncomingTab extends ConsumerStatefulWidget {
  const IqcIncomingTab({super.key});

  @override
  ConsumerState<IqcIncomingTab> createState() => _IqcIncomingTabState();
}

class _IqcIncomingTabState extends ConsumerState<IqcIncomingTab> {
  bool _loading = false;
  bool _newRegister = false;
  bool _showFilter = true;

  DateTime _fromDate = DateTime.now();
  DateTime _toDate = DateTime.now();
  final TextEditingController _vendorCtrl = TextEditingController();
  final TextEditingController _mCodeFilterCtrl = TextEditingController();
  final TextEditingController _mNameFilterCtrl = TextEditingController();
  final TextEditingController _vendorLotFilterCtrl = TextEditingController();

  // New register
  final TextEditingController _inputNoCtrl = TextEditingController();
  final TextEditingController _requestEmplCtrl = TextEditingController();
  final TextEditingController _nqQtyCtrl = TextEditingController();
  final TextEditingController _dtcIdCtrl = TextEditingController();
  final TextEditingController _remarkCtrl = TextEditingController();

  String _emplName = '';
  String _reqDeptCode = '';
  String _mName = '';
  num _widthCd = 0;
  num _inCfmQty = 0;
  num _rollQty = 0;
  String _mCode = '';
  String _custCd = '';
  String _custNameKd = '';
  String _vendorLot = '';
  DateTime _expDate = DateTime.now();
  num _totalQty = 0;
  num _totalRoll = 0;

  List<Map<String, dynamic>> _rows = const [];
  List<PlutoColumn> _cols = const [];
  List<PlutoRow> _plutoRows = const [];
  PlutoGridStateManager? _sm;

  String _s(dynamic v) => (v ?? '').toString();
  double _d(dynamic v) {
    final raw = (v ?? '').toString().trim();
    if (raw.isEmpty) return 0.0;
    final normalized = raw.replaceAll(',', '').replaceAll(RegExp(r'[^0-9\.-]'), '');
    if (normalized.isEmpty) return 0.0;
    return double.tryParse(normalized) ?? 0.0;
  }

  int _i(dynamic v) {
    if (v is int) return v;
    final s = _s(v).trim();
    return int.tryParse(s) ?? 0;
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

  String _subDeptName() {
    final a = ref.read(authNotifierProvider);
    if (a is AuthAuthenticated) return a.session.user.subDeptName ?? '';
    return '';
  }

  String _jobName() {
    final a = ref.read(authNotifierProvider);
    if (a is AuthAuthenticated) return a.session.user.jobName;
    return '';
  }

  bool _canIqcAction() => _subDeptName().toUpperCase().contains('IQC');

  int _testQtyFromTotalRoll(num totalRoll) {
    final r = totalRoll.toInt();
    if (r <= 1) return 1;
    if (r <= 15) return 2;
    if (r <= 25) return 3;
    if (r <= 90) return 5;
    if (r <= 150) return 8;
    if (r <= 280) return 13;
    if (r <= 500) return 20;
    return 20;
  }

  String _autoJudgeFromKq(Map<String, dynamic> row) {
    final keys = row.keys.where((k) => k.startsWith('KQ')).toList();
    if (keys.isEmpty) return 'N/A';
    final values = keys.map((k) => row[k]).toList();
    final hasNg = values.any((v) => _i(v) == 0);
    if (hasNg) return 'NG';
    final hasPd = values.any((v) => _i(v) == 2);
    if (hasPd) return 'PD';
    return 'OK';
  }

  Map<String, dynamic> _withComputed(Map<String, dynamic> row) {
    final iqcTest = _s(row['IQC_TEST_RESULT']).toUpperCase();
    final dtcAuto = _autoJudgeFromKq(row);
    String auto;
    if (iqcTest == 'OK') {
      auto = dtcAuto;
    } else if (iqcTest == 'PD' && dtcAuto == 'NG') {
      auto = 'NG';
    } else if (iqcTest == 'PD' && dtcAuto == 'PD') {
      auto = 'PD';
    } else if (iqcTest == 'PD' && dtcAuto == 'OK') {
      auto = 'PD';
    } else if (iqcTest == 'NG' && dtcAuto == 'NG') {
      auto = 'NG';
    } else {
      auto = 'OK';
    }

    final m = Map<String, dynamic>.from(row);
    m['DTC_AUTO'] = dtcAuto;
    m['AUTO_JUDGEMENT'] = auto;
    return m;
  }

  List<Map<String, dynamic>> _checkedRows() {
    final checked = _sm?.checkedRows ?? const [];
    return checked
        .map((r) => (r.cells['__raw__']?.value as Map<String, dynamic>?) ?? <String, dynamic>{})
        .where((e) => e.isNotEmpty)
        .toList();
  }

  Color _kqColor(dynamic v) {
    final x = _i(v);
    if (x == 1) return Colors.green;
    if (x == 0) return Colors.red;
    if (x == 2) return const Color(0xFF1848FC);
    return const Color(0xFFC1C7C3);
  }

  String _kqText(dynamic v) {
    final x = _i(v);
    if (x == 1) return 'OK';
    if (x == 0) return 'NG';
    if (x == 2) return 'PENDING';
    return 'N/A';
  }

  PlutoColumn _colText(String f, {bool readOnly = true, double width = 140}) {
    return PlutoColumn(
      title: f,
      field: f,
      type: PlutoColumnType.text(),
      width: width,
      enableSorting: true,
      enableFilterMenuItem: true,
      readOnly: readOnly,
    );
  }

  PlutoColumn _colNumber(String f, {bool readOnly = true, double width = 120}) {
    return PlutoColumn(
      title: f,
      field: f,
      type: PlutoColumnType.number(),
      width: width,
      enableSorting: true,
      enableFilterMenuItem: true,
      readOnly: readOnly,
    );
  }

  List<PlutoColumn> _buildColumns(List<Map<String, dynamic>> rows) {
    if (rows.isEmpty) return const [];

    final fixed = <PlutoColumn>[
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
      _colNumber('IQC1_ID', width: 90),
      _colText('M_CODE', width: 110),
      _colText('M_NAME', width: 220),
      _colNumber('WIDTH_CD', width: 110),
      _colText('M_LOT_NO', width: 150),
      _colText('LOT_CMS', width: 110),
      _colText('LOT_VENDOR', width: 140),
      _colText('CUST_NAME_KD', width: 160),
      _colText('EXP_DATE', width: 120),
      _colNumber('TOTAL_ROLL', width: 110),
      _colNumber('NQ_AQL', width: 90),
      _colNumber('NQ_CHECK_ROLL', width: 120, readOnly: false),
      _colNumber('DTC_ID', width: 90),
      _colText('TEST_EMPL', width: 110),
      _colText('TOTAL_RESULT', width: 130, readOnly: false),
      _colText('IQC_TEST_RESULT', width: 140, readOnly: false),
      _colText('DTC_RESULT', width: 110, readOnly: false),
      _colText('AUTO_JUDGEMENT', width: 140),
      _colText('DTC_AUTO', width: 120),
      _colText('REMARK', width: 200, readOnly: false),
    ];

    final anyRow = rows.first;
    final kqKeys = anyRow.keys.where((k) => k.startsWith('KQ')).toList();
    final kqCols = kqKeys
        .map(
          (k) => PlutoColumn(
            title: k,
            field: k,
            type: PlutoColumnType.text(),
            width: 92,
            readOnly: true,
            renderer: (ctx) {
              final v = ctx.cell.value;
              final t = _kqText(v);
              final c = _kqColor(v);
              return Text(t, style: TextStyle(color: c, fontWeight: FontWeight.w800));
            },
          ),
        )
        .toList();

    final tailKeys = <String>['INS_DATE', 'INS_EMPL', 'UPD_DATE', 'UPD_EMPL'];
    final tailCols = tailKeys.where((k) => anyRow.containsKey(k)).map((k) => _colText(k, width: 160)).toList();

    return [...fixed, ...kqCols, ...tailCols];
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

  Future<void> _loadIqC1() async {
    setState(() => _loading = true);
    try {
      final body = await _post('loadIQC1table', {
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
          _rows = const [];
          _cols = const [];
          _plutoRows = const [];
          _newRegister = false;
        });
        _snack('Lỗi: ${_s(body['message'])}');
        return;
      }

      final raw = body['data'];
      final arr = raw is List ? raw : const [];
      var rows = arr.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();
      rows = rows.map(_withComputed).toList();
      rows = rows.map((r) {
        final m = Map<String, dynamic>.from(r);
        m['NQ_AQL'] = _testQtyFromTotalRoll((_d(m['TOTAL_ROLL'])));
        return m;
      }).toList();

      final cols = _buildColumns(rows);
      final rws = _buildRows(rows, cols);
      if (!mounted) return;
      setState(() {
        _loading = false;
        _showFilter = false;
        _rows = rows;
        _cols = cols;
        _plutoRows = rws;
        _newRegister = false;
      });
      _snack('Đã load ${rows.length} dòng');
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Future<void> _checkEmplName(String emplNo) async {
    if (emplNo.trim().length < 7) {
      setState(() {
        _emplName = '';
        _reqDeptCode = '';
      });
      return;
    }
    try {
      final body = await _post('checkEMPL_NO_mobile', {'EMPL_NO': emplNo.trim()});
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() {
          _emplName = '';
          _reqDeptCode = '';
        });
        return;
      }
      final raw = body['data'];
      final arr = raw is List ? raw : const [];
      if (arr.isEmpty || arr.first is! Map) return;
      final m = arr.first as Map;
      final name = '${_s(m['MIDLAST_NAME'])} ${_s(m['FIRST_NAME'])}'.trim();
      if (!mounted) return;
      setState(() {
        _emplName = name;
        _reqDeptCode = _s(m['WORK_POSITION_CODE']);
      });
    } catch (_) {
      // ignore
    }
  }

  Future<void> _checkLotI222(String lot) async {
    if (lot.trim().length < 6) return;
    try {
      final body = await _post('checkMNAMEfromLotI222', {'M_LOT_NO': lot.trim()});
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() {
          _mName = '';
          _mCode = '';
          _widthCd = 0;
          _inCfmQty = 0;
          _rollQty = 0;
          _custCd = '';
          _custNameKd = '';
          _vendorLot = '';
          _expDate = DateTime.now();
          _totalQty = 0;
          _totalRoll = 0;
        });
        return;
      }

      final raw = body['data'];
      final arr = raw is List ? raw : const [];
      if (arr.isEmpty || arr.first is! Map) return;
      final m = arr.first as Map;
      final expStr = _s(m['EXP_DATE']);
      final exp = expStr.length >= 10 ? DateTime.tryParse(expStr.substring(0, 10)) : null;

      if (!mounted) return;
      setState(() {
        _mName = '${_s(m['M_NAME'])} | ${_s(m['WIDTH_CD'])}'.trim();
        _mCode = _s(m['M_CODE']);
        _widthCd = _d(m['WIDTH_CD']);
        _inCfmQty = _d(m['OUT_CFM_QTY']);
        _rollQty = _d(m['ROLL_QTY']);
        _custCd = _s(m['CUST_CD']);
        _custNameKd = _s(m['CUST_NAME_KD']);
        _vendorLot = _s(m['LOTNCC']);
        if (exp != null) _expDate = exp;
      });

      final lotCms = lot.trim().length >= 6 ? lot.trim().substring(0, 6) : lot.trim();
      final totalBody = await _post('checkMNAMEfromLotI222Total', {'M_CODE': _mCode, 'LOTCMS': lotCms});
      if (_isNg(totalBody)) return;
      final raw2 = totalBody['data'];
      final arr2 = raw2 is List ? raw2 : const [];
      if (arr2.isEmpty || arr2.first is! Map) return;
      final t = arr2.first as Map;
      if (!mounted) return;
      setState(() {
        _totalQty = _d(t['TOTAL_CFM_QTY']);
        _totalRoll = _d(t['TOTAL_ROLL']);
      });
    } catch (_) {
      // ignore
    }
  }

  Future<void> _new() async {
    setState(() {
      _newRegister = true;
      _rows = const [];
      _cols = const [];
      _plutoRows = const [];
      _inputNoCtrl.text = '';
      _nqQtyCtrl.text = '';
      _dtcIdCtrl.text = '';
      _remarkCtrl.text = '';
      _mName = '';
      _mCode = '';
      _widthCd = 0;
      _inCfmQty = 0;
      _rollQty = 0;
      _custCd = '';
      _custNameKd = '';
      _vendorLot = '';
      _expDate = DateTime.now();
      _totalQty = 0;
      _totalRoll = 0;
    });
  }

  bool _checkInput() {
    final inputNo = _inputNoCtrl.text.trim();
    final req = _requestEmplCtrl.text.trim();
    final nq = int.tryParse(_nqQtyCtrl.text.trim()) ?? 0;
    final dtc = int.tryParse(_dtcIdCtrl.text.trim()) ?? 0;
    return inputNo.isNotEmpty && req.isNotEmpty && nq != 0 && dtc != 0;
  }

  Future<void> _addRow() async {
    if (!_newRegister) {
      _snack('Bấm NEW trước');
      return;
    }
    if (!_checkInput()) {
      _snack('Thiếu dữ liệu: LOT/EMPL/NQ/DTC');
      return;
    }
    final inputNo = _inputNoCtrl.text.trim();
    final nq = int.tryParse(_nqQtyCtrl.text.trim()) ?? 0;
    final dtc = int.tryParse(_dtcIdCtrl.text.trim()) ?? 0;
    final req = _requestEmplCtrl.text.trim();

    final row = <String, dynamic>{
      'IQC1_ID': _rows.length,
      'M_CODE': _mCode,
      'M_NAME': _mName,
      'WIDTH_CD': _widthCd,
      'M_LOT_NO': inputNo,
      'LOT_CMS': inputNo.length >= 6 ? inputNo.substring(0, 6) : inputNo,
      'LOT_VENDOR': _vendorLot,
      'CUST_CD': _custCd,
      'CUST_NAME_KD': _custNameKd,
      'EXP_DATE': _ymd(_expDate),
      'INPUT_LENGTH': _totalQty,
      'TOTAL_ROLL': _totalRoll,
      'NQ_AQL': _testQtyFromTotalRoll(_totalRoll),
      'NQ_CHECK_ROLL': nq,
      'DTC_ID': dtc,
      'TEST_EMPL': req,
      'TOTAL_RESULT': '',
      'IQC_TEST_RESULT': 'PD',
      'DTC_RESULT': 'PD',
      'REMARK': _remarkCtrl.text.trim(),
    };

    final newRows = [..._rows, _withComputed(row)];
    final cols = _buildColumns(newRows);
    final rws = _buildRows(newRows, cols);
    setState(() {
      _rows = newRows;
      _cols = cols;
      _plutoRows = rws;
    });
  }

  Future<void> _save() async {
    if (!_newRegister) {
      _snack('Bấm NEW rồi ADD trước');
      return;
    }
    if (_rows.isEmpty) {
      _snack('Chưa có dòng');
      return;
    }
    setState(() => _loading = true);
    try {
      var failed = 0;
      for (final r in _rows) {
        final body = await _post('insertIQC1table', r);
        if (_isNg(body)) failed++;
      }
      if (!mounted) return;
      setState(() => _loading = false);
      _snack(failed == 0 ? 'Thêm data thành công' : 'Thêm xong, lỗi: $failed');
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Future<void> _insertHoldingFromI222({required String reason, required String mCode, required String lotCms}) async {
    try {
      final maxBody = await _post('getMaxHoldingID', {});
      if (_isNg(maxBody)) return;
      final raw = maxBody['data'];
      final arr = raw is List ? raw : const [];
      var nextId = 0;
      if (arr.isNotEmpty && arr.first is Map) {
        final m = arr.first as Map;
        nextId = (_i(m['MAX_ID']) + 1);
      }
      await _post('insertHoldingFromI222', {'ID': nextId, 'REASON': reason, 'M_CODE': mCode, 'M_LOT_NO': lotCms});
      await _post('updateStockM090', {});
    } catch (_) {
      // ignore
    }
  }

  Future<void> _setQcPass(String value) async {
    if (!_canIqcAction()) {
      _snack('Chỉ IQC mới được thao tác');
      return;
    }
    final selected = _checkedRows();
    if (selected.isEmpty) {
      _snack('Chọn ít nhất 1 dòng');
      return;
    }

    setState(() => _loading = true);
    try {
      var failed = 0;
      for (final r in selected) {
        final mCode = _s(r['M_CODE']);
        final lotCms = _s(r['LOT_CMS']);
        final iqc1Id = r['IQC1_ID'];
        final remark = _s(r['REMARK']);

        final b1 = await _post('updateQCPASSI222', {'M_CODE': mCode, 'LOT_CMS': lotCms, 'VALUE': value});
        if (_isNg(b1)) {
          failed++;
          continue;
        }
        final b2 = await _post('updateIQC1Table', {
          'M_CODE': mCode,
          'LOT_CMS': lotCms,
          'VALUE': value == 'Y' ? 'OK' : 'NG',
          'IQC1_ID': iqc1Id,
          'REMARK': remark,
        });
        if (_isNg(b2)) {
          failed++;
          continue;
        }
        if (value == 'N') {
          await _insertHoldingFromI222(reason: remark, mCode: mCode, lotCms: lotCms);
        }
      }

      if (!mounted) return;
      setState(() => _loading = false);
      _snack(failed == 0 ? 'SET thành công' : 'SET xong, lỗi: $failed');
      await _loadIqC1();
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Future<void> _updateIncomingData() async {
    final selected = _checkedRows();
    if (selected.isEmpty) {
      _snack('Chọn ít nhất 1 dòng');
      return;
    }

    setState(() => _loading = true);
    try {
      var failed = 0;
      for (final r in selected) {
        final iqc1Id = r['IQC1_ID'];
        final totalResult = _s(r['TOTAL_RESULT']).isEmpty ? 'PD' : _s(r['TOTAL_RESULT']).toUpperCase();
        final iqcTest = _s(r['IQC_TEST_RESULT']).isEmpty ? 'PD' : _s(r['IQC_TEST_RESULT']).toUpperCase();
        final dtc = _s(r['DTC_RESULT']).isEmpty ? 'PD' : _s(r['DTC_RESULT']).toUpperCase();
        final nq = r['NQ_CHECK_ROLL'];
        final remark = _s(r['REMARK']);

        final b = await _post('updateIncomingData_web', {
          'IQC1_ID': iqc1Id,
          'TOTAL_RESULT': totalResult,
          'NQ_CHECK_ROLL': nq,
          'IQC_TEST_RESULT': iqcTest,
          'DTC_RESULT': dtc,
          'REMARK': remark,
        });
        if (_isNg(b)) {
          failed++;
          continue;
        }
        await _post('updateQCPASSI222', {
          'M_CODE': _s(r['M_CODE']),
          'LOT_CMS': _s(r['LOT_CMS']),
          'VALUE': totalResult == 'OK' ? 'Y' : 'N',
        });
        if (totalResult == 'NG') {
          await _insertHoldingFromI222(reason: remark, mCode: _s(r['M_CODE']), lotCms: _s(r['LOT_CMS']));
        }
      }
      if (!mounted) return;
      setState(() => _loading = false);
      _snack(failed == 0 ? 'Update thành công' : 'Update xong, lỗi: $failed');
      await _loadIqC1();
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  void _syncEditedRow(PlutoRow row) {
    final raw = row.cells['__raw__']?.value;
    if (raw is! Map<String, dynamic>) return;
    final updated = Map<String, dynamic>.from(raw);
    for (final c in _cols) {
      if (c.field == '__raw__' || c.field == '__check__') continue;
      updated[c.field] = row.cells[c.field]?.value;
    }
    final computed = _withComputed(updated);
    final id = _s(updated['IQC1_ID']);
    setState(() {
      _rows = _rows.map((e) => _s(e['IQC1_ID']) == id ? computed : e).toList();
      _cols = _buildColumns(_rows);
      _plutoRows = _buildRows(_rows, _cols);
    });
  }

  @override
  void initState() {
    super.initState();
    _requestEmplCtrl.text = _emplNo();
    scheduleMicrotask(_loadIqC1);
  }

  @override
  void dispose() {
    _vendorCtrl.dispose();
    _mCodeFilterCtrl.dispose();
    _mNameFilterCtrl.dispose();
    _vendorLotFilterCtrl.dispose();
    _inputNoCtrl.dispose();
    _requestEmplCtrl.dispose();
    _nqQtyCtrl.dispose();
    _dtcIdCtrl.dispose();
    _remarkCtrl.dispose();
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
            Expanded(child: Text('INCOMING (${_jobName()})', style: const TextStyle(fontWeight: FontWeight.w900))),
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
                  FilledButton.icon(onPressed: _loading ? null : _loadIqC1, icon: const Icon(Icons.search), label: const Text('Tra Data')),
                  FilledButton.tonal(onPressed: _loading ? null : _new, child: const Text('NEW')),
                  FilledButton.tonal(
                    onPressed: (!_canIqcAction() || _loading) ? null : () => _setQcPass('Y'),
                    child: const Text('Set QC Pass OK'),
                  ),
                  FilledButton.tonal(
                    onPressed: (!_canIqcAction() || _loading) ? null : () => _setQcPass('N'),
                    child: const Text('Set QC Pass NG'),
                  ),
                  FilledButton.tonal(onPressed: _loading ? null : _updateIncomingData, child: const Text('Update Data')),
                  Text('Role: ${_jobName()}', style: TextStyle(color: scheme.onSurfaceVariant)),
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
                  const Text('INPUT DATA KIỂM TRA INCOMMING', style: TextStyle(fontWeight: FontWeight.w900, color: Colors.blue)),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 12,
                    runSpacing: 8,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: [
                      SizedBox(
                        width: 220,
                        child: TextField(
                          controller: _inputNoCtrl,
                          decoration: const InputDecoration(labelText: 'LOT NVL ERP'),
                          onChanged: (v) {
                            if (v.trim().length >= 7) {
                              unawaited(_checkLotI222(v));
                            }
                          },
                        ),
                      ),
                      if (_mName.isNotEmpty) Text(_mName, style: const TextStyle(fontWeight: FontWeight.w800, color: Colors.blue)),
                      SizedBox(
                        width: 160,
                        child: TextField(
                          controller: _requestEmplCtrl,
                          decoration: const InputDecoration(labelText: 'NV YC'),
                          onChanged: (v) => unawaited(_checkEmplName(v)),
                        ),
                      ),
                      if (_emplName.isNotEmpty) Text(_emplName, style: const TextStyle(fontWeight: FontWeight.w800, color: Colors.blue)),
                      SizedBox(width: 120, child: TextField(controller: _dtcIdCtrl, decoration: const InputDecoration(labelText: 'DTC_ID'), keyboardType: TextInputType.number)),
                      SizedBox(width: 160, child: TextField(controller: _nqQtyCtrl, decoration: const InputDecoration(labelText: 'NQ_CHECK_ROLL'), keyboardType: TextInputType.number)),
                      SizedBox(width: 220, child: TextField(controller: _remarkCtrl, decoration: const InputDecoration(labelText: 'REMARK'))),
                      FilledButton.tonal(onPressed: _loading ? null : _addRow, child: const Text('Add')),
                      FilledButton.tonal(onPressed: _loading ? null : _save, child: const Text('Save')),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 12,
                    runSpacing: 6,
                    children: [
                      Text('M_CODE: $_mCode', style: TextStyle(color: scheme.onSurfaceVariant)),
                      Text('WIDTH: ${_widthCd.toStringAsFixed(0)}', style: TextStyle(color: scheme.onSurfaceVariant)),
                      Text('ROLL: ${_rollQty.toStringAsFixed(0)}  QTY: ${_inCfmQty.toStringAsFixed(0)}', style: TextStyle(color: scheme.onSurfaceVariant)),
                      Text('TOTAL ROLL: ${_totalRoll.toStringAsFixed(0)}  TOTAL QTY: ${_totalQty.toStringAsFixed(0)}', style: TextStyle(color: scheme.onSurfaceVariant)),
                      Text('VENDOR LOT: $_vendorLot', style: TextStyle(color: scheme.onSurfaceVariant)),
                      Text('CUST: $_custNameKd ($_custCd)', style: TextStyle(color: scheme.onSurfaceVariant)),
                      Text('EXP: ${_ymd(_expDate)}', style: TextStyle(color: scheme.onSurfaceVariant)),
                      if (_reqDeptCode.isNotEmpty) Text('DEPT: $_reqDeptCode', style: TextStyle(color: scheme.onSurfaceVariant)),
                    ],
                  ),
                ],
              ),
            ),
          );

    Widget table = Card(
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: SizedBox(
          height: 520,
          child: _loading
              ? const Center(child: CircularProgressIndicator())
              : (_cols.isEmpty
                  ? const Center(child: Text('Chưa có dữ liệu'))
                  : PlutoGrid(
                      columns: _cols,
                      rows: _plutoRows,
                      onLoaded: (e) {
                        _sm = e.stateManager;
                        e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                        e.stateManager.setShowColumnFilter(true);
                      },
                      onChanged: (e) {
                        final row = e.row;
                        _syncEditedRow(row);
                      },
                      createFooter: (sm) => PlutoPagination(sm),
                      configuration: const PlutoGridConfiguration(
                        columnSize: PlutoGridColumnSizeConfig(autoSizeMode: PlutoAutoSizeMode.scale),
                      ),
                    )),
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
            table,
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
