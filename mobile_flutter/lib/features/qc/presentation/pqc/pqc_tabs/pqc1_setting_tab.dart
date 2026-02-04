import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:pluto_grid/pluto_grid.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../../core/config/app_config.dart';
import '../../../../../core/providers.dart';
import '../../../../auth/application/auth_notifier.dart';
import '../../../../auth/application/auth_state.dart';

class Pqc1SettingTab extends ConsumerStatefulWidget {
  const Pqc1SettingTab({super.key});

  @override
  ConsumerState<Pqc1SettingTab> createState() => _Pqc1SettingTabState();
}

class _Pqc1SettingTabState extends ConsumerState<Pqc1SettingTab> {
  bool _loading = false;
  bool _showFilter = true;

  bool _showInput = true;

  DateTime _fromDate = DateTime.now().subtract(const Duration(days: 2));
  DateTime _toDate = DateTime.now();
  bool _allTime = false;
  String _factory = 'NM1';

  final TextEditingController _planIdCtrl = TextEditingController();
  final TextEditingController _lineQcCtrl = TextEditingController();
  final TextEditingController _leaderCtrl = TextEditingController();
  final TextEditingController _remarkCtrl = TextEditingController();

  String _lineQcName = '';
  String _leaderName = '';

  String _processLotNo = '';
  String _mLotNo = '';
  String _mName = '';
  String _ktdtc = 'CKT';

  List<Map<String, dynamic>> _sxData = const [];

  List<Map<String, dynamic>> _rows = const [];
  List<PlutoColumn> _cols = const [];
  List<PlutoRow> _plutoRows = const [];
  final Set<int> _selectedPqc1Ids = <int>{};

  String _s(dynamic v) => (v ?? '').toString();
  num _num(dynamic v) => (v is num) ? v : (num.tryParse(_s(v).replaceAll(',', '')) ?? 0);
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

  @override
  void initState() {
    super.initState();
    final authState = ref.read(authNotifierProvider);
    final session = authState is AuthAuthenticated ? authState.session : null;
    final user = session?.user;
    if (user?.emplNo != null) {
      _lineQcCtrl.text = user!.emplNo;
      _checkEmplName(1, user.emplNo);
    }
    _factory = 'NM1';
    _traData();
  }

  @override
  void dispose() {
    _planIdCtrl.dispose();
    _lineQcCtrl.dispose();
    _leaderCtrl.dispose();
    _remarkCtrl.dispose();
    super.dispose();
  }

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  Future<Map<String, dynamic>> _post(String command, Map<String, dynamic>? data) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(command, data: data);
    final body = res.data;
    if (body is Map<String, dynamic>) return body;
    return <String, dynamic>{'tk_status': 'NG', 'message': 'Bad response'};
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

  Future<void> _checkKtdtc(String processLot) async {
    try {
      final body = await _post('checkktdtc', {'PROCESS_LOT_NO': processLot});
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() => _ktdtc = 'CKT');
        return;
      }
      final data = body['data'];
      final first = (data is List && data.isNotEmpty && data.first is Map) ? (data.first as Map) : null;
      final trangThai = first == null ? null : first['TRANGTHAI'];
      if (!mounted) return;
      setState(() => _ktdtc = (trangThai != null) ? 'DKT' : 'CKT');
    } catch (_) {
      if (!mounted) return;
      setState(() => _ktdtc = 'CKT');
    }
  }

  Future<void> _checkEmplName(int selection, String emplNo) async {
    try {
      final body = await _post('checkEMPL_NO_mobile', {'EMPL_NO': emplNo});
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() {
          if (selection == 1) {
            _lineQcName = '';
          } else {
            _leaderName = '';
          }
        });
        return;
      }
      final data = body['data'];
      final first = (data is List && data.isNotEmpty && data.first is Map) ? (data.first as Map) : null;
      if (first == null) return;
      final name = '${_s(first['MIDLAST_NAME'])} ${_s(first['FIRST_NAME'])}'.trim();
      if (!mounted) return;
      setState(() {
        if (selection == 1) {
          _lineQcName = name;
        } else {
          _leaderName = name;
        }
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        if (selection == 1) {
          _lineQcName = '';
        } else {
          _leaderName = '';
        }
      });
    }
  }

  Future<void> _checkPlanId(String planId) async {
    final body = await _post('checkPLAN_ID', {'PLAN_ID': planId});
    if (_isNg(body)) {
      if (!mounted) return;
      setState(() {
        // no-op
      });
      return;
    }
    final data = body['data'];
    final first = (data is List && data.isNotEmpty && data.first is Map) ? (data.first as Map) : null;
    if (first == null) return;
    if (!mounted) return;
    setState(() {
      // no-op
    });
  }

  Future<void> _loadDataSx(String planId) async {
    final body = await _post('loadDataSX', {
      'ALLTIME': true,
      'FROM_DATE': '',
      'TO_DATE': '',
      'PROD_REQUEST_NO': '',
      'PLAN_ID': planId,
      'M_NAME': '',
      'M_CODE': '',
      'G_NAME': '',
      'G_CODE': '',
      'FACTORY': 'ALL',
      'PLAN_EQ': 'ALL',
    });
    if (_isNg(body)) {
      if (!mounted) return;
      setState(() => _sxData = const []);
      return;
    }
    final raw = body['data'];
    final list = raw is List ? raw : const [];
    final rows = list.map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{}).toList();
    if (!mounted) return;
    setState(() => _sxData = rows);
  }

  Future<void> _checkPlanIdP501(String planId) async {
    if (_sxData.isEmpty) return;
    final first = _sxData.first;
    final body = await _post('checkPlanIdP501', {'PLAN_ID': planId});
    if (!_isNg(body)) {
      final data = body['data'];
      final r0 = (data is List && data.isNotEmpty && data.first is Map) ? Map<String, dynamic>.from(data.first as Map) : null;
      if (r0 != null) {
        final mLot = _s(r0['M_LOT_NO']);
        final procLot = _s(r0['PROCESS_LOT_NO']);
        if (!mounted) return;
        setState(() {
          _mLotNo = mLot;
          _processLotNo = procLot;
        });
        if (mLot.isNotEmpty) await _checkLotNvl(mLot);
        if (procLot.isNotEmpty) await _checkKtdtc(procLot);
        return;
      }
    }

    final processNumber = _num(first['PROCESS_NUMBER']).toInt();
    if (processNumber == 0) {
      if (!mounted) return;
      setState(() {
        _mLotNo = '';
        _processLotNo = '';
      });
      return;
    }
    final prodReqNo = _s(first['PROD_REQUEST_NO']);
    if (prodReqNo.isEmpty) return;
    final b2 = await _post('checkProcessLotNo_Prod_Req_No', {'PROD_REQUEST_NO': prodReqNo});
    if (_isNg(b2)) {
      if (!mounted) return;
      setState(() {
        _mLotNo = '';
        _processLotNo = '';
      });
      return;
    }
    final data2 = b2['data'];
    final r1 = (data2 is List && data2.isNotEmpty && data2.first is Map) ? Map<String, dynamic>.from(data2.first as Map) : null;
    if (r1 == null) return;
    final mLot = _s(r1['M_LOT_NO']);
    final procLot = _s(r1['PROCESS_LOT_NO']);
    if (!mounted) return;
    setState(() {
      _mLotNo = mLot;
      _processLotNo = procLot;
    });
    if (mLot.isNotEmpty) await _checkLotNvl(mLot);
    if (procLot.isNotEmpty) await _checkKtdtc(procLot);
  }

  Future<void> _checkLotNvl(String mLotNo) async {
    final body = await _post('checkMNAMEfromLot', {'M_LOT_NO': mLotNo});
    if (_isNg(body)) {
      if (!mounted) return;
      setState(() {
        _mName = '';
      });
      return;
    }
    final data = body['data'];
    final first = (data is List && data.isNotEmpty && data.first is Map) ? (data.first as Map) : null;
    if (first == null) return;
    if (!mounted) return;
    setState(() {
      _mName = '${_s(first['M_NAME'])} | ${_s(first['WIDTH_CD'])}'.trim();
    });
  }

  Future<void> _onPlanChanged(String v) async {
    final p = v.trim();
    if (p.length < 8) {
      if (!mounted) return;
      setState(() {
        _sxData = const [];
        _mLotNo = '';
        _processLotNo = '';
        _ktdtc = 'CKT';
      });
      return;
    }
    setState(() {
      _loading = true;
      _showFilter = false;
    });
    try {
      await _checkPlanId(p);
      await _loadDataSx(p);
      await _checkPlanIdP501(p);
    } catch (e) {
      _snack('Lỗi load CTSX: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  bool _canInput() {
    if (_planIdCtrl.text.trim().isEmpty) return false;
    if (_lineQcCtrl.text.trim().isEmpty) return false;
    if (_leaderCtrl.text.trim().isEmpty) return false;
    if (_sxData.isEmpty) return false;
    if (_processLotNo.trim().isEmpty) return false;
    return true;
  }

  Future<void> _inputData() async {
    if (_loading) return;
    if (!_canInput()) {
      _snack('Hãy nhập đủ thông tin trước khi input');
      return;
    }
    final first = _sxData.first;
    final eq = _s(first['EQ_NAME_TT']);
    if (eq.isEmpty) {
      _snack('Chỉ thị đã được bắn setting hay chưa ?');
      return;
    }

    setState(() {
      _loading = true;
      _showFilter = false;
    });
    try {
      final body = await _post('insert_pqc1', {
        'PROCESS_LOT_NO': _processLotNo.toUpperCase(),
        'LINEQC_PIC': _lineQcCtrl.text.trim().toUpperCase(),
        'PROD_PIC': _s(first['INS_EMPL']).toUpperCase(),
        'PROD_LEADER': _leaderCtrl.text.trim().toUpperCase(),
        'STEPS': first['STEP'],
        'CAVITY': first['CAVITY'],
        'SETTING_OK_TIME': first['MASS_START_TIME'],
        'FACTORY': first['PLAN_FACTORY'],
        'REMARK': _ktdtc,
        'PROD_REQUEST_NO': _s(first['PROD_REQUEST_NO']).toUpperCase(),
        'G_CODE': first['G_CODE'],
        'PLAN_ID': _planIdCtrl.text.trim().toUpperCase(),
        'PROCESS_NUMBER': first['PROCESS_NUMBER'],
        'LINE_NO': eq,
        'REMARK2': _remarkCtrl.text,
      });

      if (_isNg(body)) {
        _snack('Có lỗi: ${_s(body['message'])}');
        return;
      }
      _snack('Input data thành công');
      await _traData();
      if (!mounted) return;
      setState(() {
        _planIdCtrl.clear();
        _remarkCtrl.clear();
        _leaderCtrl.clear();
        _leaderName = '';
        _sxData = const [];
        _mLotNo = '';
        _processLotNo = '';
      });
    } catch (e) {
      _snack('Lỗi input: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
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

  List<String> _preferredFields() {
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
  }

  List<PlutoColumn> _buildCols(List<Map<String, dynamic>> rows) {
    if (rows.isEmpty) return const [];
    final keys = rows.first.keys.map((e) => e.toString()).toList();
    final prefer = _preferredFields();
    final ordered = <String>[
      ...prefer.where(keys.contains),
      ...keys.where((k) => !prefer.contains(k)),
    ];

    PlutoColumn linkCol(String field, String file) {
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
              final url = Uri.parse('${AppConfig.imageBaseUrl}/lineqc/${planId}_$file');
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
        if (f == 'SAMPLE_AMOUNT') {
          return _col(
            f,
            w: 140,
            renderer: (ctx) {
              final raw = (ctx.row.cells['__raw__']?.value as Map<String, dynamic>?);
              final v = raw == null ? 0 : _num(raw[f]);
              return Text(NumberFormat.decimalPattern().format(v), style: const TextStyle(color: Colors.black54, fontWeight: FontWeight.w800));
            },
          );
        }
        if (f == 'IMG_1') return linkCol('IMG_1', '1.jpg');
        if (f == 'IMG_2') return linkCol('IMG_2', '2.jpg');
        if (f == 'IMG_3') return linkCol('IMG_3', '3.jpg');
        if (f == 'INSPECT_SAMPLE_QTY') {
          return _col(f, w: 140, type: PlutoColumnType.number(), editable: true);
        }
        final isNum = rows.any((r) => r[f] is num) || const <String>{'INSPECT_QTY', 'DEFECT_QTY', 'PROD_LAST_PRICE', 'PROD_REQUEST_QTY'}.contains(f);
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

  Future<void> _traData() async {
    setState(() {
      _loading = true;
      _showFilter = false;
      _selectedPqc1Ids.clear();
    });
    try {
      final body = await _post('trapqc1data', {
        'ALLTIME': _allTime,
        'FROM_DATE': _allTime ? '' : _ymd(_fromDate),
        'TO_DATE': _allTime ? '' : _ymd(_toDate),
        'CUST_NAME': '',
        'PROCESS_LOT_NO': '',
        'G_CODE': '',
        'G_NAME': '',
        'PROD_TYPE': '',
        'EMPL_NAME': '',
        'PROD_REQUEST_NO': '',
        'ID': '',
        'FACTORY': _factory,
      });
      if (_isNg(body)) {
        _snack('NG: ${_s(body['message'])}');
        return;
      }

      final raw = body['data'];
      final data = raw is List ? raw : const [];
      final rows = data.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();

      for (final r in rows) {
        r['INS_DATE'] = _ymdHms(_s(r['INS_DATE']));
        r['UPD_DATE'] = _ymdHms(_s(r['UPD_DATE']));
        r['SETTING_OK_TIME'] = _ymdHms(_s(r['SETTING_OK_TIME']));
        final inspect = _num(r['INSPECT_QTY']);
        final ng = _num(r['DEFECT_QTY']);
        if (inspect > 0) {
          r['DEFECT_RATE'] = (ng / inspect) * 100;
        }
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
      _snack('Lỗi: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _updateSampleQty() async {
    if (_loading) return;
    if (_selectedPqc1Ids.isEmpty) {
      _snack('Chọn ít nhất 1 dòng để update');
      return;
    }

    setState(() {
      _loading = true;
      _showFilter = false;
    });

    try {
      String err = '';
      final selectedRows = _rows.where((r) => _selectedPqc1Ids.contains(_num(r['PQC1_ID']).toInt())).toList();
      for (final r in selectedRows) {
        final pqc1Id = _num(r['PQC1_ID']).toInt();
        final qty = _num(r['INSPECT_SAMPLE_QTY']).toInt();
        final res = await _post('updatepqc1sampleqty', {
          'PQC1_ID': pqc1Id,
          'INSPECT_SAMPLE_QTY': qty,
        });
        if (_isNg(res)) {
          err += '| ${_s(res['message'])}';
        }
      }
      if (err.isEmpty) {
        _snack('Update sample qty thành công');
      } else {
        _snack('Có lỗi: $err');
      }
    } catch (e) {
      _snack('Lỗi update: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final canInput = _canInput();
    final sx0 = _sxData.isEmpty ? null : _sxData.first;

    Widget header() {
      return Card(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
          child: Row(
            children: [
              IconButton(
                tooltip: _showFilter ? 'Ẩn form' : 'Hiện form',
                onPressed: _loading ? null : () => setState(() => _showFilter = !_showFilter),
                icon: Icon(_showFilter ? Icons.filter_alt_off : Icons.filter_alt),
              ),
              IconButton(
                tooltip: _showInput ? 'Ẩn input' : 'Hiện input',
                onPressed: _loading ? null : () => setState(() => _showInput = !_showInput),
                icon: Icon(_showInput ? Icons.visibility_off : Icons.visibility),
              ),
              const SizedBox(width: 6),
              FilledButton.tonal(
                onPressed: _loading ? null : _traData,
                child: const Text('Tra Data'),
              ),
              const SizedBox(width: 6),
              FilledButton.tonal(
                onPressed: _loading ? null : _updateSampleQty,
                child: const Text('Update QTY'),
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
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Checkbox(value: _allTime, onChanged: _loading ? null : (v) => setState(() => _allTime = v ?? false)),
                  const Text('All Time'),
                ],
              ),
              DropdownButton<String>(
                value: _factory,
                style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w700),
                dropdownColor: Theme.of(context).colorScheme.surface,
                iconEnabledColor: Theme.of(context).colorScheme.onSurface,
                onChanged: _loading ? null : (v) => setState(() => _factory = v ?? 'NM1'),
                items: const [
                  DropdownMenuItem(value: 'NM1', child: Text('NM1')),
                  DropdownMenuItem(value: 'NM2', child: Text('NM2')),
                ],
              ),
            ],
          ),
        ),
      );
    }

    Widget input() {
      if (!_showInput) return const SizedBox.shrink();
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                '${_lineQcName.isEmpty ? '' : _lineQcName} | NHẬP THÔNG TIN SETTING | ${_leaderName.isEmpty ? '' : _leaderName}',
                style: const TextStyle(fontWeight: FontWeight.w900, color: Colors.blue),
              ),
              const SizedBox(height: 10),
              Wrap(
                spacing: 10,
                runSpacing: 10,
                children: [
                  SizedBox(
                    width: 160,
                    child: DropdownButtonFormField<String>(
                      initialValue: _factory,
                      decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'FACTORY'),
                      onChanged: _loading ? null : (v) => setState(() => _factory = v ?? 'NM1'),
                      items: const [
                        DropdownMenuItem(value: 'NM1', child: Text('NM1')),
                        DropdownMenuItem(value: 'NM2', child: Text('NM2')),
                      ],
                    ),
                  ),
                  SizedBox(
                    width: 220,
                    child: TextField(
                      controller: _planIdCtrl,
                      enabled: !_loading,
                      decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'Số chỉ thị sản xuất (PLAN_ID)'),
                      onChanged: (v) {
                        if (v.trim().length >= 8) {
                          _onPlanChanged(v);
                        } else {
                          setState(() {
                            _sxData = const [];
                            _mLotNo = '';
                            _processLotNo = '';
                          });
                        }
                      },
                    ),
                  ),
                  SizedBox(
                    width: 200,
                    child: TextField(
                      controller: _lineQcCtrl,
                      enabled: !_loading,
                      decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'Mã LINEQC'),
                      onChanged: (v) {
                        if (v.trim().length >= 7) {
                          _checkEmplName(1, v.trim());
                        } else {
                          setState(() => _lineQcName = '');
                        }
                      },
                    ),
                  ),
                  SizedBox(
                    width: 200,
                    child: TextField(
                      controller: _leaderCtrl,
                      enabled: !_loading,
                      decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'Mã Leader SX'),
                      onChanged: (v) {
                        if (v.trim().length >= 7) {
                          _checkEmplName(2, v.trim());
                        } else {
                          setState(() => _leaderName = '');
                        }
                      },
                    ),
                  ),
                  SizedBox(
                    width: 260,
                    child: TextField(
                      controller: _remarkCtrl,
                      enabled: !_loading,
                      decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'Remark'),
                    ),
                  ),
                  SizedBox(
                    width: 160,
                    child: FilledButton(
                      onPressed: _loading ? null : _inputData,
                      child: Text(canInput ? 'Input Data' : 'Input Data (thiếu thông tin)'),
                    ),
                  ),
                  Text('KTDTC: $_ktdtc', style: const TextStyle(fontWeight: FontWeight.w900, color: Colors.blue)),
                ],
              ),
              const SizedBox(height: 12),
              const Text('THÔNG TIN CHỈ THỊ', style: TextStyle(fontWeight: FontWeight.w900, color: Colors.blue)),
              const SizedBox(height: 8),
              Wrap(
                spacing: 10,
                runSpacing: 8,
                children: [
                  _infoBox('LOT SX', _processLotNo, blue: true),
                  _infoBox('LOT NVL', _mLotNo, blue: true),
                  _infoBox('M_NAME', _mName, blue: true),
                  _infoBox('LINE NO', _s(sx0?['EQ_NAME_TT']), blue: true),
                  _infoBox('Công đoạn', _s(sx0?['PROCESS_NUMBER']), blue: true),
                  _infoBox('STEP', _s(sx0?['STEP']), blue: true),
                  _infoBox('PD', _s(sx0?['PD']), blue: true),
                  _infoBox('CAVITY', _s(sx0?['CAVITY']), blue: true),
                  _infoBox('ST.OK', _s(sx0?['MASS_START_TIME']), blue: true),
                  _infoBox('Mã CNSX', _s(sx0?['INS_EMPL']), blue: true),
                ],
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
                onLoaded: (e) {
                  e.stateManager.setShowColumnFilter(true);
                },
                onSelected: (event) {
                  final raw = event.row?.cells['__raw__']?.value;
                  if (raw is! Map) return;
                  final id = _num(raw['PQC1_ID']).toInt();
                  final isChecked = event.row?.checked == true;
                  setState(() {
                    if (isChecked) {
                      _selectedPqc1Ids.add(id);
                    } else {
                      _selectedPqc1Ids.remove(id);
                    }
                  });
                },
                onChanged: (event) {
                  final raw = event.row.cells['__raw__']?.value;
                  if (raw is! Map<String, dynamic>) return;
                  raw[event.column.field] = event.value;
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
      );
    }

    return Padding(
      padding: const EdgeInsets.all(8),
      child: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(child: header()),
          if (_loading) const SliverToBoxAdapter(child: LinearProgressIndicator()),
          SliverToBoxAdapter(child: filter()),
          SliverToBoxAdapter(child: input()),
          SliverFillRemaining(hasScrollBody: true, child: grid()),
        ],
      ),
    );
  }

  Widget _infoBox(String title, String value, {bool blue = false}) {
    return SizedBox(
      width: 220,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontWeight: FontWeight.w900, color: Colors.black54)),
          const SizedBox(height: 2),
          Text(value.isEmpty ? '-' : value, style: TextStyle(fontWeight: FontWeight.w900, color: blue ? Colors.blue : Colors.black87)),
        ],
      ),
    );
  }
}
