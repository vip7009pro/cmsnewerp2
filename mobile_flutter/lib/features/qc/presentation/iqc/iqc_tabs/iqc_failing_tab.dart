import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:pluto_grid/pluto_grid.dart';

import '../../../../../core/providers.dart';
import '../../../../auth/application/auth_notifier.dart';
import '../../../../auth/application/auth_state.dart';

enum _FailLoai { nvl, btp }

class IqcFailingTab extends ConsumerStatefulWidget {
  const IqcFailingTab({super.key});

  @override
  ConsumerState<IqcFailingTab> createState() => _IqcFailingTabState();
}

class _IqcFailingTabState extends ConsumerState<IqcFailingTab> {
  bool _loading = false;
  bool _isNewFailing = false;
  bool _showFilter = true;

  bool _cmsv = true;
  bool _onlyPending = true;
  _FailLoai _loai = _FailLoai.nvl;

  final TextEditingController _planIdCtrl = TextEditingController();
  final TextEditingController _mLotNoCtrl = TextEditingController();
  final TextEditingController _processLotCtrl = TextEditingController();
  final TextEditingController _vendorLotCtrl = TextEditingController();
  final TextEditingController _defectCtrl = TextEditingController();
  final TextEditingController _remarkCtrl = TextEditingController();
  final TextEditingController _ncrIdCtrl = TextEditingController(text: '0');
  final TextEditingController _outEmpl1Ctrl = TextEditingController();
  final TextEditingController _outEmpl2Ctrl = TextEditingController();

  String _emplName1 = '';
  String _emplName2 = '';

  String _gName = '';
  String _gCode = '';
  int _pqc3Id = 0;
  String _pqcDefect = '';

  String _mName = '';
  String _mCode = '';
  num _widthCd = 0;
  num _rollQty = 0;
  num _inQty = 0;
  num _lieuQlSx = 0;
  String _outDate = '';

  List<Map<String, dynamic>> _customerList = const [];
  String _custCd = '6969';

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

  int _i(dynamic v) => int.tryParse(_s(v)) ?? 0;

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

  String _subDept() {
    final a = ref.read(authNotifierProvider);
    if (a is AuthAuthenticated) return (a.session.user.subDeptName ?? '').trim();
    return '';
  }

  String _mainDept() {
    final a = ref.read(authNotifierProvider);
    if (a is AuthAuthenticated) return (a.session.user.mainDeptName ?? '').trim();
    return '';
  }

  String _emplNo() {
    final a = ref.read(authNotifierProvider);
    if (a is AuthAuthenticated) return a.session.user.emplNo;
    return '';
  }

  int _factoryCode() {
    return 1;
  }

  bool _isIqc() => _subDept().toUpperCase() == 'IQC';
  bool _canClose() => _subDept().toUpperCase() == 'MUA' || _emplNo().toUpperCase() == 'NHU1903';
  bool _canOutput() {
    final md = _mainDept().toUpperCase();
    final sd = _subDept().toUpperCase();
    return md == 'QC' || sd == 'QC';
  }

  int _ncrId() => int.tryParse(_ncrIdCtrl.text.trim()) ?? 0;

  List<Map<String, dynamic>> _checked() {
    final checked = _sm?.checkedRows ?? const [];
    return checked
        .map((r) => (r.cells['__raw__']?.value as Map<String, dynamic>?) ?? <String, dynamic>{})
        .where((e) => e.isNotEmpty)
        .toList();
  }

  List<PlutoColumn> _buildColumns(List<Map<String, dynamic>> rows) {
    if (rows.isEmpty) return const [];
    final keys = rows.first.keys.map((e) => e.toString()).toList();

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

  Future<void> _loadCustomers() async {
    try {
      final body = await _post('selectcustomerList', {});
      if (_isNg(body)) return;
      final raw = body['data'];
      final arr = raw is List ? raw : const [];
      final rows = arr.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();
      if (!mounted) return;
      setState(() => _customerList = rows);
    } catch (_) {
      // ignore
    }
  }

  Future<void> _loadFailing() async {
    final messenger = ScaffoldMessenger.of(context);
    setState(() {
      _loading = true;
      _showFilter = false;
      _isNewFailing = false;
    });
    try {
      final body = await _post('loadQCFailData', {'ONLY_PENDING': _onlyPending});
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() {
          _loading = false;
          _rows = const [];
          _cols = const [];
          _plutoRows = const [];
        });
        messenger.showSnackBar(const SnackBar(content: Text('Không có dữ liệu')));
        return;
      }

      final raw = body['data'];
      final arr = raw is List ? raw : const [];
      final rows = arr.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();
      final cols = _buildColumns(rows);
      final plutoRows = _buildRows(rows, cols);

      if (!mounted) return;
      setState(() {
        _loading = false;
        _rows = rows;
        _cols = cols;
        _plutoRows = plutoRows;
      });
      messenger.showSnackBar(SnackBar(content: Text('Đã load: ${rows.length} dòng')));
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  Future<void> _setQcPass(String value) async {
    final selected = _checked();
    if (selected.isEmpty) {
      _snack('Chọn ít nhất 1 dòng');
      return;
    }
    if (!_isIqc()) {
      _snack('Bạn không phải người bộ phận IQC');
      return;
    }

    final messenger = ScaffoldMessenger.of(context);
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('SET QC PASS'),
        content: Text('Chắc chắn SET ${value == 'Y' ? 'PASS' : 'FAIL'} cho ${selected.length} dòng?'),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Hủy')),
          FilledButton(onPressed: () => Navigator.of(ctx).pop(true), child: const Text('OK')),
        ],
      ),
    );
    if (ok != true) return;

    setState(() => _loading = true);
    try {
      var failed = 0;
      for (final r in selected) {
        final body = await _post('updateQCPASS_FAILING', {
          'FAIL_ID': r['FAIL_ID'],
          'M_LOT_NO': _s(r['M_LOT_NO']),
          'PLAN_ID_SUDUNG': r['PLAN_ID_SUDUNG'],
          'VALUE': value,
        });
        if (_isNg(body)) failed++;
      }
      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(SnackBar(content: Text(failed == 0 ? 'SET thành công' : 'Xong, lỗi: $failed')));
      await _loadFailing();
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  Future<void> _setClose(String value) async {
    final selected = _checked();
    if (selected.isEmpty) {
      _snack('Chọn ít nhất 1 dòng');
      return;
    }
    if (!_canClose()) {
      _snack('Bạn không phải người bộ phận MUA');
      return;
    }

    final messenger = ScaffoldMessenger.of(context);
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('SET CLOSE STATUS'),
        content: Text('Chắc chắn SET ${value == 'C' ? 'CLOSED' : 'PENDING'} cho ${selected.length} dòng?'),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Hủy')),
          FilledButton(onPressed: () => Navigator.of(ctx).pop(true), child: const Text('OK')),
        ],
      ),
    );
    if (ok != true) return;

    setState(() => _loading = true);
    try {
      var failed = 0;
      for (final r in selected) {
        final body = await _post('updateCLOSE_FAILING', {
          'FAIL_ID': r['FAIL_ID'],
          'M_LOT_NO': _s(r['M_LOT_NO']),
          'PLAN_ID_SUDUNG': r['PLAN_ID_SUDUNG'],
          'VALUE': value,
        });
        if (_isNg(body)) failed++;
      }
      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(SnackBar(content: Text(failed == 0 ? 'SET thành công' : 'Xong, lỗi: $failed')));
      await _loadFailing();
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  Future<void> _iqcConfirm() async {
    final selected = _checked();
    if (selected.isEmpty) {
      _snack('Chọn ít nhất 1 dòng');
      return;
    }
    if (!_isIqc()) {
      _snack('Bạn không phải người bộ phận IQC');
      return;
    }
    final conf = _outEmpl2Ctrl.text.trim();
    if (conf.isEmpty) {
      _snack('Hãy nhập mã người xác nhận');
      return;
    }

    final messenger = ScaffoldMessenger.of(context);
    setState(() => _loading = true);
    try {
      var failed = 0;
      for (final r in selected) {
        final body = await _post('updateIQCConfirm_FAILING', {
          'FAIL_ID': r['FAIL_ID'],
          'IN2_EMPL': conf.toUpperCase(),
        });
        if (_isNg(body)) failed++;
      }
      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(SnackBar(content: Text(failed == 0 ? 'Confirm thành công' : 'Xong, lỗi: $failed')));
      await _loadFailing();
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  Future<void> _updateNcr() async {
    final selected = _checked();
    if (selected.isEmpty) {
      _snack('Chọn ít nhất 1 dòng');
      return;
    }
    if (!_isIqc()) {
      _snack('Bạn không phải người bộ phận IQC');
      return;
    }
    final ncr = _ncrId();
    if (ncr == 0) {
      _snack('NCR_ID phải khác 0');
      return;
    }

    final messenger = ScaffoldMessenger.of(context);
    setState(() => _loading = true);
    try {
      var failed = 0;
      for (final r in selected) {
        final body = await _post('updateNCRIDForFailing', {
          'FAIL_ID': r['FAIL_ID'],
          'NCR_ID': ncr,
        });
        if (_isNg(body)) failed++;
      }
      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(SnackBar(content: Text(failed == 0 ? 'UPDATE thành công' : 'Xong, lỗi: $failed')));
      await _loadFailing();
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  Future<void> _checkEmplName(int which, String emplNo) async {
    if (emplNo.trim().length < 7) {
      setState(() {
        if (which == 1) {
          _emplName1 = '';
        } else {
          _emplName2 = '';
        }
      });
      return;
    }

    try {
      final body = await _post('checkEMPL_NO_mobile', {'EMPL_NO': emplNo.trim()});
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() {
          if (which == 1) {
            _emplName1 = '';
          } else {
            _emplName2 = '';
          }
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
        if (which == 1) {
          _emplName1 = name;
        } else {
          _emplName2 = name;
        }
      });
    } catch (_) {
      // ignore
    }
  }

  Future<void> _checkPlanId(String planId) async {
    if (planId.trim().length < 7) {
      setState(() {
        _gName = '';
        _gCode = '';
      });
      return;
    }
    try {
      final body = await _post('checkPLAN_ID', {'PLAN_ID': planId.trim()});
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() {
          _gName = '';
          _gCode = '';
        });
        return;
      }
      final raw = body['data'];
      final arr = raw is List ? raw : const [];
      if (arr.isEmpty || arr.first is! Map) return;
      final m = arr.first as Map;
      if (!mounted) return;
      setState(() {
        _gName = _s(m['G_NAME']);
        _gCode = _s(m['G_CODE']);
      });
    } catch (_) {
      // ignore
    }
  }

  Future<void> _checkPqc3(String planId) async {
    if (planId.trim().length < 7) {
      setState(() {
        _pqc3Id = 0;
        _pqcDefect = '';
      });
      return;
    }
    try {
      final body = await _post('checkPQC3_IDfromPLAN_ID', {'PLAN_ID': planId.trim()});
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() {
          _pqc3Id = 0;
          _pqcDefect = '';
        });
        return;
      }
      final raw = body['data'];
      final arr = raw is List ? raw : const [];
      if (arr.isEmpty || arr.first is! Map) return;
      final m = arr.first as Map;
      if (!mounted) return;
      setState(() {
        _pqc3Id = _i(m['PQC3_ID']);
        _pqcDefect = _s(m['DEFECT_PHENOMENON']);
      });
    } catch (_) {
      // ignore
    }
  }

  Future<void> _checkLotNVL(String lot) async {
    if (lot.trim().length < 7) return;
    try {
      final body = await _post('checkMNAMEfromLot', {'M_LOT_NO': lot.trim()});
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() {
          _mName = '';
          _mCode = '';
          _widthCd = 0;
          _rollQty = 0;
          _inQty = 0;
          _lieuQlSx = 0;
          _outDate = '';
          _vendorLotCtrl.text = '';
        });
        return;
      }
      final raw = body['data'];
      final arr = raw is List ? raw : const [];
      if (arr.isEmpty || arr.first is! Map) return;
      final m = arr.first as Map;
      final plan = _s(m['PLAN_ID']);
      if (!mounted) return;
      setState(() {
        _mName = '${_s(m['M_NAME'])} | ${_s(m['WIDTH_CD'])}'.trim();
        _mCode = _s(m['M_CODE']);
        _widthCd = _d(m['WIDTH_CD']);
        _inQty = _d(m['OUT_CFM_QTY']);
        _rollQty = _d(m['ROLL_QTY']);
        _vendorLotCtrl.text = _s(m['LOTNCC']);
        _lieuQlSx = _d(m['LIEUQL_SX']);
        _outDate = _s(m['OUT_DATE']);
      });
      if (plan.length > 7) {
        await _checkPqc3(plan);
      }
    } catch (_) {
      // ignore
    }
  }

  Future<void> _checkProcessLot(String processLot) async {
    if (processLot.trim().length < 7) return;
    try {
      final body = await _post('checkProcessLotNoInfo', {'PROCESS_LOT_NO': processLot.trim()});
      if (_isNg(body)) return;
      final raw = body['data'];
      final arr = raw is List ? raw : const [];
      if (arr.isEmpty || arr.first is! Map) return;
      final m = arr.first as Map;
      final mLotNo = _s(m['M_LOT_NO']);
      final totalIn = _d(m['BTP_MET']);
      final plan = _s(m['PLAN_ID']);
      if (!mounted) return;
      setState(() {
        _planIdCtrl.text = plan;
        _mLotNoCtrl.text = mLotNo;
        _rollQty = 1;
        _inQty = totalIn;
      });
      await _checkPlanId(plan);
      await _checkPqc3(plan);
      await _checkLotNVL(mLotNo);
    } catch (_) {
      // ignore
    }
  }

  Future<bool> _boolCmd(String command, Map<String, dynamic> data) async {
    final body = await _post(command, data);
    return !_isNg(body);
  }

  bool _checkInput() {
    return _planIdCtrl.text.trim().isNotEmpty && _outEmpl1Ctrl.text.trim().isNotEmpty;
  }

  Future<void> _newFailing() async {
    setState(() {
      _rows = const [];
      _cols = const [];
      _plutoRows = const [];
      _isNewFailing = true;
    });
  }

  Future<void> _addRow() async {
    if (!_isNewFailing || !_checkInput()) {
      _snack('Hãy chọn New Failing rồi nhập đủ thông tin');
      return;
    }

    final planId = _planIdCtrl.text.trim().toUpperCase();
    if (_gName.isEmpty) {
      _snack('Số chỉ thị chưa đúng');
      return;
    }

    final lot = (_loai == _FailLoai.nvl ? _mLotNoCtrl.text.trim() : _mLotNoCtrl.text.trim());
    if (lot.isEmpty) {
      _snack('Nhập LOT');
      return;
    }

    if (_pqc3Id == 0) {
      _snack('Số chỉ thị này PQC chưa lập lỗi, không thêm được');
      return;
    }

    final existsP500 = await _boolCmd('isM_LOT_NO_in_P500', {'PLAN_ID': planId, 'M_LOT_NO': lot});
    final existsInKho = await _boolCmd('isM_LOT_NO_in_IN_KHO_SX', {'PLAN_ID': planId, 'M_LOT_NO': lot});
    final existsO302 = await _boolCmd('isM_LOT_NO_in_O302', {'PLAN_ID': planId, 'M_LOT_NO': lot});
    final lotOk = existsP500 || existsInKho || existsO302;
    if (!lotOk) {
      _snack('LOT này không dùng cho chỉ thị này');
      return;
    }

    if (_rows.any((e) => _s(e['M_LOT_NO']) == lot)) {
      _snack('LOT này đã được thêm rồi');
      return;
    }

    final now = DateTime.now();
    final insDate = DateFormat('yyyy-MM-dd HH:mm:ss').format(now);
    final row = <String, dynamic>{
      'FACTORY': _factoryCode() == 1 ? 'NM1' : 'NM2',
      'PLAN_ID_SUDUNG': planId,
      'G_NAME': _gName,
      'G_CODE': _gCode,
      'LIEUQL_SX': _lieuQlSx,
      'M_CODE': _mCode,
      'M_LOT_NO': lot,
      'VENDOR_LOT': _vendorLotCtrl.text.trim(),
      'M_NAME': _mName,
      'WIDTH_CD': _widthCd,
      'ROLL_QTY': _rollQty,
      'IN_QTY': _inQty,
      'TOTAL_IN_QTY': _rollQty * _inQty,
      'USE_YN': 'Y',
      'PQC3_ID': _pqc3Id,
      'DEFECT_PHENOMENON': _defectCtrl.text.trim().isEmpty ? _pqcDefect : _defectCtrl.text.trim(),
      'SX_DEFECT': _defectCtrl.text.trim().isEmpty ? _pqcDefect : _defectCtrl.text.trim(),
      'OUT_DATE': _outDate,
      'INS_EMPL': _emplNo(),
      'INS_DATE': insDate,
      'UPD_EMPL': '',
      'UPD_DATE': '',
      'PHANLOAI': _loai == _FailLoai.nvl ? 'NVL' : 'BTP',
      'QC_PASS': 'P',
      'QC_PASS_DATE': '',
      'QC_PASS_EMPL': '',
      'REMARK': _remarkCtrl.text.trim(),
      'IN1_EMPL': _outEmpl1Ctrl.text.trim().toUpperCase(),
      'IN2_EMPL': _outEmpl2Ctrl.text.trim().toUpperCase(),
      'OUT1_EMPL': '',
      'OUT2_EMPL': '',
      'OUT_PLAN_ID': '',
      'IN_CUST_CD': '',
      'OUT_CUST_CD': '',
      'IN_CUST_NAME': '',
      'OUT_CUST_NAME': '',
      'REMARK_OUT': '',
      'FAIL_ID': 0,
      'NCR_ID': 0,
      'PROCESS_LOT_NO': _processLotCtrl.text.trim(),
    };

    final newRows = [..._rows, row];
    final cols = _buildColumns(newRows);
    final plutoRows = _buildRows(newRows, cols);

    setState(() {
      _rows = newRows;
      _cols = cols;
      _plutoRows = plutoRows;
      _mLotNoCtrl.clear();
      _processLotCtrl.clear();
      _mName = '';
      _mCode = '';
      _widthCd = 0;
      _vendorLotCtrl.text = '';
    });
  }

  Future<void> _saveNewFailing() async {
    if (!_isNewFailing) {
      _snack('Hãy chọn New Failing trước');
      return;
    }
    if (_rows.isEmpty) {
      _snack('Chưa có dòng nào để lưu');
      return;
    }

    final messenger = ScaffoldMessenger.of(context);
    setState(() => _loading = true);
    try {
      var failed = 0;
      for (final r in _rows) {
        final body = await _post('insertFailingData', {
          'FACTORY': r['FACTORY'],
          'PLAN_ID_SUDUNG': r['PLAN_ID_SUDUNG'],
          'LIEUQL_SX': r['LIEUQL_SX'],
          'M_CODE': r['M_CODE'],
          'M_LOT_NO': r['M_LOT_NO'],
          'VENDOR_LOT': r['VENDOR_LOT'],
          'ROLL_QTY': r['ROLL_QTY'],
          'IN_QTY': r['IN_QTY'],
          'TOTAL_IN_QTY': r['TOTAL_IN_QTY'],
          'USE_YN': r['USE_YN'],
          'PQC3_ID': r['PQC3_ID'],
          'DEFECT_PHENOMENON': r['DEFECT_PHENOMENON'],
          'OUT_DATE': r['OUT_DATE'],
          'INS_EMPL': r['INS_EMPL'],
          'INS_DATE': r['INS_DATE'],
          'UPD_EMPL': r['UPD_EMPL'],
          'UPD_DATE': r['UPD_DATE'],
          'PHANLOAI': r['PHANLOAI'],
          'QC_PASS': r['QC_PASS'],
          'QC_PASS_DATE': r['QC_PASS_DATE'],
          'QC_PASS_EMPL': r['QC_PASS_EMPL'],
          'REMARK': r['REMARK'],
          'IN1_EMPL': r['IN1_EMPL'],
          'IN2_EMPL': r['IN2_EMPL'],
          'OUT1_EMPL': r['OUT1_EMPL'],
          'OUT2_EMPL': r['OUT2_EMPL'],
          'OUT_PLAN_ID': r['OUT_PLAN_ID'],
          'IN_CUST_CD': r['IN_CUST_CD'],
          'OUT_CUST_CD': r['OUT_CUST_CD'],
          'PROCESS_LOT_NO': r['PROCESS_LOT_NO'],
        });
        if (_isNg(body)) {
          failed++;
          continue;
        }

        final inP500 = await _boolCmd('isM_LOT_NO_in_P500', {'PLAN_ID': r['PLAN_ID_SUDUNG'], 'M_LOT_NO': r['M_LOT_NO']});
        if (inP500) {
          await _post('resetKhoSX_IQC2', {'PLAN_ID': r['PLAN_ID_SUDUNG'], 'M_LOT_NO': r['M_LOT_NO']});
          if (_s(r['PHANLOAI']).toUpperCase() == 'BTP') {
            await _post('updateLOT_SX_STATUS', {'PROCESS_LOT_NO': r['PROCESS_LOT_NO'], 'LOT_STATUS': 'IQ'});
          }
        } else {
          await _post('resetKhoSX_IQC1', {'PLAN_ID': r['PLAN_ID_SUDUNG'], 'M_LOT_NO': r['M_LOT_NO']});
        }
      }

      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(SnackBar(content: Text(failed == 0 ? 'Thêm data thành công' : 'Xong, lỗi: $failed')));
      await _loadFailing();
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  Future<void> _outputSelected() async {
    final selected = _checked();
    if (selected.isEmpty) {
      _snack('Chọn ít nhất 1 dòng');
      return;
    }
    if (!_canOutput()) {
      _snack('Chỉ bộ phận QC mới được xuất');
      return;
    }
    if (_gName.isEmpty) {
      _snack('Số chỉ thị chưa đúng');
      return;
    }
    if (_emplName1.isEmpty) {
      _snack('Phải nhập mã nhân viên người giao');
      return;
    }
    if (_emplName2.isEmpty) {
      _snack('Phải nhập mã nhân viên người nhận');
      return;
    }

    final planId = _planIdCtrl.text.trim();
    final messenger = ScaffoldMessenger.of(context);
    setState(() => _loading = true);
    try {
      var err = '';
      for (final r in selected) {
        final out1 = _s(r['OUT1_EMPL']);
        final out2 = _s(r['OUT2_EMPL']);
        final useYn = _s(r['USE_YN']);
        if ((out1.isNotEmpty || out2.isNotEmpty) && useYn == 'N') {
          err += 'Lỗi: Cuộn ${_s(r['M_LOT_NO'])} đã out rồi | ';
          continue;
        }

        final body = await _post('updateQCFailTableData', {
          'OUT1_EMPL': _outEmpl1Ctrl.text.trim(),
          'OUT2_EMPL': _outEmpl2Ctrl.text.trim(),
          'OUT_CUST_CD': _cmsv ? '6969' : _custCd,
          'OUT_PLAN_ID': planId,
          'REMARK_OUT': _remarkCtrl.text.trim(),
          'FAIL_ID': r['FAIL_ID'],
        });
        if (_isNg(body)) {
          err += 'Lỗi: ${_s(body['message'])} | ';
          continue;
        }

        final checkBom = await _boolCmd('check_m_code_m140_main', {
          'M_CODE': r['M_CODE'],
          'G_CODE': _gCode,
        });

        if (checkBom) {
          await _post('nhapkhoao', {
            'FACTORY': r['FACTORY'],
            'PHANLOAI': 'R',
            'PLAN_ID_INPUT': planId,
            'PLAN_ID_SUDUNG': null,
            'M_CODE': r['M_CODE'],
            'M_LOT_NO': r['M_LOT_NO'],
            'ROLL_QTY': r['ROLL_QTY'],
            'IN_QTY': r['IN_QTY'],
            'TOTAL_IN_QTY': r['TOTAL_IN_QTY'],
            'USE_YN': 'Y',
            'FSC': 'N',
            'FSC_MCODE': '01',
            'FSC_GCODE': '01',
          });
        } else {
          err += 'Chú ý: Có cuộn không phải liệu chính trong BOM của code được chỉ thị vào | ';
        }
      }

      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(SnackBar(content: Text(err.isEmpty ? 'Xuất thành công' : 'Có lỗi: $err')));
      await _loadFailing();
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  @override
  void initState() {
    super.initState();
    Future.microtask(_loadCustomers);
    Future.microtask(_loadFailing);
  }

  @override
  void dispose() {
    _planIdCtrl.dispose();
    _mLotNoCtrl.dispose();
    _processLotCtrl.dispose();
    _vendorLotCtrl.dispose();
    _defectCtrl.dispose();
    _remarkCtrl.dispose();
    _ncrIdCtrl.dispose();
    _outEmpl1Ctrl.dispose();
    _outEmpl2Ctrl.dispose();
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
            const Expanded(child: Text('FAILING', style: TextStyle(fontWeight: FontWeight.w900))),
          ],
        ),
      ),
    );

    Widget topForm = Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Wrap(
          spacing: 12,
          runSpacing: 8,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            DropdownButton<String>(
              value: _cmsv ? 'CMSV' : 'VENDOR',
              items: const [
                DropdownMenuItem(value: 'CMSV', child: Text('CMSV')),
                DropdownMenuItem(value: 'VENDOR', child: Text('Vendor')),
              ],
              onChanged: _loading
                  ? null
                  : (v) {
                      setState(() {
                        _cmsv = v == 'CMSV';
                        if (_cmsv) _custCd = '6969';
                      });
                    },
            ),
            DropdownButton<_FailLoai>(
              value: _loai,
              items: const [
                DropdownMenuItem(value: _FailLoai.nvl, child: Text('Vật Liệu')),
                DropdownMenuItem(value: _FailLoai.btp, child: Text('Bán Thành Phẩm')),
              ],
              onChanged: _loading ? null : (v) => setState(() => _loai = v ?? _FailLoai.nvl),
            ),
            SizedBox(
              width: 220,
              child: DropdownButtonFormField<String>(
                isExpanded: true,
                initialValue: _custCd,
                decoration: const InputDecoration(labelText: 'Vendor'),
                items: _customerList
                    .map((e) {
                      final label = _s(e['CUST_NAME_KD']).isEmpty ? _s(e['CUST_CD']) : _s(e['CUST_NAME_KD']);
                      return DropdownMenuItem(
                        value: _s(e['CUST_CD']),
                        child: Text(label, overflow: TextOverflow.ellipsis, maxLines: 1),
                      );
                    })
                    .toList(),
                onChanged: (_loading || _cmsv) ? null : (v) => setState(() => _custCd = (v ?? '')),
              ),
            ),
            SizedBox(
              width: 160,
              child: TextField(
                controller: _planIdCtrl,
                decoration: const InputDecoration(labelText: 'Số chỉ thị (PLAN_ID)'),
                onChanged: (v) {
                  if (v.trim().length >= 7) {
                    _checkPlanId(v);
                    _checkPqc3(v);
                  } else {
                    setState(() => _gName = '');
                  }
                },
              ),
            ),
            if (_gName.isNotEmpty) Text(_gName, style: const TextStyle(fontWeight: FontWeight.w900, color: Colors.blue)),
            SizedBox(
              width: 180,
              child: TextField(
                controller: _loai == _FailLoai.nvl ? _mLotNoCtrl : _processLotCtrl,
                decoration: InputDecoration(labelText: _loai == _FailLoai.nvl ? 'LOT NVL (M_LOT_NO)' : 'LOT SX (PROCESS_LOT_NO)'),
                onChanged: (v) {
                  if (v.trim().length >= 7) {
                    if (_loai == _FailLoai.nvl) {
                      _checkLotNVL(v);
                    } else {
                      _checkProcessLot(v);
                    }
                  }
                },
                onSubmitted: (_) => _addRow(),
              ),
            ),
            if (_mName.isNotEmpty) Text(_mName, style: const TextStyle(fontWeight: FontWeight.w700, color: Colors.blue)),
            SizedBox(width: 180, child: TextField(controller: _vendorLotCtrl, decoration: const InputDecoration(labelText: 'VENDOR LOT'))),
            SizedBox(width: 220, child: TextField(controller: _defectCtrl, decoration: const InputDecoration(labelText: 'DEFECT PHENOMENON'))),
            SizedBox(
              width: 160,
              child: TextField(
                controller: _outEmpl1Ctrl,
                decoration: const InputDecoration(labelText: 'Mã NV giao'),
                onChanged: (v) => _checkEmplName(1, v),
              ),
            ),
            if (_emplName1.isNotEmpty) Text(_emplName1, style: const TextStyle(fontWeight: FontWeight.w700, color: Colors.blue)),
            SizedBox(
              width: 160,
              child: TextField(
                controller: _outEmpl2Ctrl,
                decoration: const InputDecoration(labelText: 'Mã NV nhận / confirm'),
                onChanged: (v) => _checkEmplName(2, v),
              ),
            ),
            if (_emplName2.isNotEmpty) Text(_emplName2, style: const TextStyle(fontWeight: FontWeight.w700, color: Colors.blue)),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Checkbox(value: _onlyPending, onChanged: _loading ? null : (v) => setState(() => _onlyPending = v ?? true)),
                const Text('ONLY PENDING'),
              ],
            ),
            SizedBox(width: 220, child: TextField(controller: _remarkCtrl, decoration: const InputDecoration(labelText: 'Remark'))),
            SizedBox(
              width: 120,
              child: TextField(
                controller: _ncrIdCtrl,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'NCR_ID'),
              ),
            ),
            FilledButton.tonal(
              onPressed: _loading
                  ? null
                  : () {
                      _newFailing();
                    },
              child: const Text('New Failing'),
            ),
            FilledButton.icon(onPressed: _loading ? null : _loadFailing, icon: const Icon(Icons.search), label: const Text('Tra Data')),
            FilledButton.tonal(onPressed: (_loading || !_isIqc()) ? null : () => _setQcPass('Y'), child: const Text('SET PASS')),
            FilledButton.tonal(onPressed: (_loading || !_isIqc()) ? null : () => _setQcPass('N'), child: const Text('SET FAIL')),
            FilledButton.tonal(onPressed: (_loading || !_isIqc()) ? null : _iqcConfirm, child: const Text('IQC CONFIRM')),
            FilledButton.tonal(onPressed: (_loading || !_isIqc()) ? null : _updateNcr, child: const Text('UPDATE NCR_ID')),
            FilledButton.tonal(onPressed: (_loading || !_canClose()) ? null : () => _setClose('C'), child: const Text('SET CLOSED')),
            FilledButton.tonal(onPressed: (_loading || !_canClose()) ? null : () => _setClose('P'), child: const Text('SET PENDING')),
            Text('Rows: ${_rows.length}', style: TextStyle(color: scheme.onSurfaceVariant)),
          ],
        ),
      ),
    );

    Widget newFailingActions = Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Wrap(
          spacing: 12,
          runSpacing: 8,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            FilledButton.tonal(onPressed: (_loading || !_isNewFailing) ? null : _addRow, child: const Text('Add')),
            FilledButton.tonal(onPressed: (_loading || !_isNewFailing) ? null : _saveNewFailing, child: const Text('Save')),
          ],
        ),
      ),
    );

    final gridHeight = MediaQuery.of(context).size.height * 0.6;
    Widget grid = Card(
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: SizedBox(
          height: gridHeight,
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
                      configuration: const PlutoGridConfiguration(
                        columnSize: PlutoGridColumnSizeConfig(autoSizeMode: PlutoAutoSizeMode.scale),
                      ),
                      createFooter: (sm) => PlutoPagination(sm),
                    )),
        ),
      ),
    );

    Widget outputSection = Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text('OUTPUT LIỆU QC FAIL', style: TextStyle(fontWeight: FontWeight.w900, color: Colors.blue)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 12,
              runSpacing: 8,
              crossAxisAlignment: WrapCrossAlignment.center,
              children: [
                SizedBox(
                  width: 220,
                  child: DropdownButtonFormField<String>(
                    isExpanded: true,
                    initialValue: _custCd,
                    decoration: const InputDecoration(labelText: 'Vendor'),
                    items: _customerList
                        .map((e) {
                          final label = _s(e['CUST_NAME_KD']).isEmpty ? _s(e['CUST_CD']) : _s(e['CUST_NAME_KD']);
                          return DropdownMenuItem(
                            value: _s(e['CUST_CD']),
                            child: Text(label, overflow: TextOverflow.ellipsis, maxLines: 1),
                          );
                        })
                        .toList(),
                    onChanged: (_loading || _cmsv) ? null : (v) => setState(() => _custCd = (v ?? '')),
                  ),
                ),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Checkbox(
                      value: _cmsv,
                      onChanged: _loading
                          ? null
                          : (v) {
                              setState(() {
                                _cmsv = v ?? true;
                                if (_cmsv) _custCd = '6969';
                              });
                            },
                    ),
                    const Text('CMSV'),
                  ],
                ),
                SizedBox(width: 160, child: TextField(controller: _planIdCtrl, decoration: const InputDecoration(labelText: 'Số CT'))),
                SizedBox(width: 160, child: TextField(controller: _outEmpl1Ctrl, decoration: const InputDecoration(labelText: 'Ng.Giao'))),
                SizedBox(width: 160, child: TextField(controller: _outEmpl2Ctrl, decoration: const InputDecoration(labelText: 'Ng.Nhận'))),
                SizedBox(width: 220, child: TextField(controller: _remarkCtrl, decoration: const InputDecoration(labelText: 'Remark'))),
                FilledButton.tonal(onPressed: _loading ? null : _outputSelected, child: const Text('Xuất')),
              ],
            ),
          ],
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
            if (_showFilter) topForm,
            if (_loading) const LinearProgressIndicator(),
            newFailingActions,
            grid,
            outputSection,
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
