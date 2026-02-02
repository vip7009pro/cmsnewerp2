import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:pluto_grid/pluto_grid.dart';

import '../../../../core/providers.dart';
import '../../../auth/application/auth_notifier.dart';
import '../../../auth/application/auth_state.dart';
import 'dtc_scan_page.dart';

class DkDtcTab extends ConsumerStatefulWidget {
  const DkDtcTab({super.key});

  @override
  ConsumerState<DkDtcTab> createState() => _DkDtcTabState();
}

class _DkDtcTabState extends ConsumerState<DkDtcTab> {
  bool _loading = false;

  bool _checkNvl = false;
  String _testType = '3';

  final _inputNoCtrl = TextEditingController();
  final _requestEmplCtrl = TextEditingController();
  final _remarkCtrl = TextEditingController();

  final _lotNccCtrl = TextEditingController();

  String _emplName = '';
  String _reqDeptCode = '';

  String _gName = '';
  String _gCode = '';
  String _prodReqNo = '';
  String _prodReqDate = '';

  String _mName = '';
  String _mCode = '';
  String _custCd = '';
  String _lotNcc = '';

  List<Map<String, dynamic>> _testList = const [];
  List<int> _testedCodes = const [];
  List<Map<String, dynamic>> _addedSpec = const [];

  List<PlutoColumn> _recentCols = const [];
  List<PlutoRow> _recentRows = const [];

  String _s(dynamic v) => (v ?? '').toString();
  int _i(dynamic v) => int.tryParse(_s(v)) ?? 0;

  Future<Map<String, dynamic>> _post(String command, Map<String, dynamic> data) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(command, data: data);
    final body = res.data;
    if (body is Map<String, dynamic>) return body;
    return <String, dynamic>{'tk_status': 'NG', 'message': 'Bad response'};
  }

  bool _isNg(Map<String, dynamic> body) => (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _initFromUser();
      _loadInit();
    });
  }

  void _initFromUser() {
    final auth = ref.read(authNotifierProvider);
    if (auth is AuthAuthenticated) {
      _requestEmplCtrl.text = _s(auth.session.user.emplNo);
      _checkNvl = (_s(auth.session.user.subDeptName).toUpperCase() == 'IQC');
    }
  }

  @override
  void dispose() {
    _inputNoCtrl.dispose();
    _requestEmplCtrl.dispose();
    _remarkCtrl.dispose();
    _lotNccCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadInit() async {
    setState(() => _loading = true);
    try {
      await Future.wait([
        _loadTestList(),
        _loadRecent(),
      ]);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _loadTestList() async {
    final body = await _post('loadDtcTestList', {});
    if (_isNg(body)) return;
    final data = body['data'];
    final list = (data is List ? data : const [])
        .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
        .toList();
    if (!mounted) return;
    setState(() {
      _testList = list
          .map((e) => {
                ...e,
                'SELECTED': false,
              })
          .toList();
    });
  }

  List<PlutoColumn> _buildRecentCols() {
    PlutoColumn c(String f, {double w = 120}) => PlutoColumn(
          title: f,
          field: f,
          width: w,
          enableContextMenu: false,
          enableDropToResize: true,
          type: PlutoColumnType.text(),
        );

    return [
      PlutoColumn(title: '', field: '__raw__', type: PlutoColumnType.text(), width: 0, hide: true, enableContextMenu: false),
      c('DTC_ID', w: 90),
      c('TEST_NAME', w: 110),
      c('REQUEST_EMPL_NO', w: 120),
      c('M_NAME', w: 150),
      c('SIZE', w: 90),
      c('FACTORY', w: 80),
      c('TEST_FINISH_TIME', w: 160),
      c('TEST_EMPL_NO', w: 120),
      c('G_CODE', w: 120),
      c('PROD_REQUEST_NO', w: 140),
      c('G_NAME', w: 200),
      c('TEST_TYPE_NAME', w: 120),
      c('WORK_POSITION_NAME', w: 160),
      c('REQUEST_DATETIME', w: 160),
      c('REMARK', w: 160),
      c('LOTCMS', w: 120),
    ];
  }

  List<PlutoRow> _buildRecentRows(List<Map<String, dynamic>> list, List<PlutoColumn> cols) {
    Object? val(Map<String, dynamic> it, String field) {
      if (field == '__raw__') return it;
      return it[field];
    }

    return [
      for (final it in list)
        PlutoRow(
          cells: {for (final c in cols) c.field: PlutoCell(value: val(it, c.field))},
        ),
    ];
  }

  Future<void> _loadRecent() async {
    final body = await _post('loadrecentRegisteredDTCData', {});
    if (_isNg(body)) return;
    final data = body['data'];
    final list = (data is List ? data : const [])
        .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
        .toList();

    String fmtTime(dynamic v) {
      final s = _s(v);
      if (s.isEmpty || s.startsWith('1900-01-01') || s == 'null') return '';
      final dt = DateTime.tryParse(s);
      if (dt == null) return s;
      return DateFormat('yyyy-MM-dd HH:mm:ss').format(dt.toLocal());
    }

    final normalized = list
        .map((e) => {
              ...e,
              'TEST_FINISH_TIME': fmtTime(e['TEST_FINISH_TIME']),
              'REQUEST_DATETIME': fmtTime(e['REQUEST_DATETIME']),
            })
        .toList();

    if (!mounted) return;
    final cols = _buildRecentCols();
    setState(() {
      _recentCols = cols;
      _recentRows = _buildRecentRows(normalized, cols);
    });
  }

  Future<void> _checkEmplName(String emplNo) async {
    final body = await _post('checkEMPL_NO_mobile', {'EMPL_NO': emplNo});
    if (_isNg(body)) {
      if (!mounted) return;
      setState(() {
        _emplName = '';
        _reqDeptCode = '';
      });
      return;
    }
    final data = body['data'];
    final list = (data is List ? data : const [])
        .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
        .toList();
    if (!mounted) return;
    if (list.isEmpty) {
      setState(() {
        _emplName = '';
        _reqDeptCode = '';
      });
      return;
    }
    setState(() {
      _emplName = '${_s(list.first['MIDLAST_NAME'])} ${_s(list.first['FIRST_NAME'])}'.trim();
      _reqDeptCode = _s(list.first['WORK_POSITION_CODE']);
    });
  }

  Future<void> _checkYcsx(String prodRequestNo) async {
    final body = await _post('ycsx_fullinfo', {'PROD_REQUEST_NO': prodRequestNo});
    if (_isNg(body)) {
      if (!mounted) return;
      setState(() {
        _prodReqNo = '';
        _gName = '';
        _prodReqDate = '';
        _gCode = '';
      });
      return;
    }
    final data = body['data'];
    final list = (data is List ? data : const [])
        .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
        .toList();
    if (!mounted) return;
    if (list.isEmpty) return;
    setState(() {
      _prodReqNo = prodRequestNo;
      _gName = _s(list.first['G_NAME']);
      _prodReqDate = _s(list.first['PROD_REQUEST_DATE']);
      _gCode = _s(list.first['G_CODE']);
    });
    await _checkAddedSpec(mCode: '', gCode: _gCode);
  }

  Future<void> _checkLotNvl(String mLotNo) async {
    final body = await _post('checkMNAMEfromLotI222', {'M_LOT_NO': mLotNo});
    if (_isNg(body)) {
      if (!mounted) return;
      setState(() {
        _mName = '';
        _mCode = '';
        _custCd = '';
        _lotNcc = '';
        _testedCodes = const [];
        _testList = _testList.map((e) => {...e, 'SELECTED': false}).toList();
      });
      return;
    }
    final data = body['data'];
    final list = (data is List ? data : const [])
        .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
        .toList();
    if (!mounted) return;
    if (list.isEmpty) return;
    setState(() {
      _mName = '${_s(list.first['M_NAME'])} | ${_s(list.first['WIDTH_CD'])}'.trim();
      _mCode = _s(list.first['M_CODE']);
      _custCd = _s(list.first['CUST_CD']);
      _lotNcc = _s(list.first['LOTNCC']);
      _lotNccCtrl.text = _lotNcc;
    });
    await _checkAddedSpec(mCode: _mCode, gCode: '');
    await _getTestedCodeByMCode(_mCode);
  }

  Future<void> _checkAddedSpec({required String mCode, required String gCode}) async {
    final body = await _post('checkAddedSpec', {
      'M_CODE': _checkNvl ? mCode : 'B0000035',
      'G_CODE': _checkNvl ? '7A07540A' : gCode,
    });
    if (_isNg(body)) return;
    final data = body['data'];
    final list = (data is List ? data : const [])
        .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
        .toList();
    if (!mounted) return;
    setState(() {
      _addedSpec = list;
    });
  }

  Future<void> _getTestedCodeByMCode(String mCode) async {
    final body = await _post('lichSuTestM_CODE', {'M_CODE': mCode});
    final tested = <int>[];
    if (!_isNg(body)) {
      final data = body['data'];
      final list = (data is List ? data : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList();
      for (final e in list) {
        tested.add(_i(e['TEST_CODE']));
      }
    }

    if (!mounted) return;
    setState(() {
      _testedCodes = tested;
      _testList = _testList
          .map((e) {
            final tc = _i(e['TEST_CODE']);
            if (tested.contains(tc)) {
              return {...e, 'SELECTED': true};
            }
            return {...e, 'SELECTED': false};
          })
          .toList();
    });
  }

  Future<int> _getLastDtcId() async {
    final body = await _post('getLastDTCID', {});
    if (_isNg(body)) return 0;
    final data = body['data'];
    final list = (data is List ? data : const [])
        .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
        .toList();
    if (list.isEmpty) return 0;
    return _i(list.first['LAST_DCT_ID']) + 1;
  }

  Future<int> _getDtcIdByLot(String lot) async {
    final body = await _post('checkDTC_ID_FROM_M_LOT_NO', {'M_LOT_NO': lot});
    if (_isNg(body)) return -1;
    final data = body['data'];
    final list = (data is List ? data : const [])
        .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
        .toList();
    if (list.isEmpty) return -1;
    return _i(list.first['DTC_ID']);
  }

  Future<bool> _isLotAndTestCodeExist(String lot, int testCode) async {
    final body = await _post('checkDTC_M_LOT_NO_TEST_CODE_REG', {
      'M_LOT_NO': lot,
      'TEST_CODE': testCode,
    });
    if (_isNg(body)) return false;
    final data = body['data'];
    final list = (data is List ? data : const []);
    return list.isNotEmpty;
  }

  Future<void> _insertIncomingData(int dtcId) async {
    final auth = ref.read(authNotifierProvider);
    final empl = auth is AuthAuthenticated ? _s(auth.session.user.emplNo) : '';
    final body = await _post('insertIQC1table', {
      'M_CODE': _mCode,
      'M_LOT_NO': _inputNoCtrl.text.trim(),
      'LOT_CMS': _inputNoCtrl.text.trim().length >= 6 ? _inputNoCtrl.text.trim().substring(0, 6) : _inputNoCtrl.text.trim(),
      'LOT_VENDOR': _lotNccCtrl.text.trim().isNotEmpty ? _lotNccCtrl.text.trim() : _lotNcc,
      'CUST_CD': _custCd,
      'EXP_DATE': '',
      'INPUT_LENGTH': 0,
      'TOTAL_ROLL': 0,
      'NQ_CHECK_ROLL': 0,
      'DTC_ID': dtcId,
      'TEST_EMPL': empl,
      'REMARK': '',
    });
    if (_isNg(body)) {
      _snack('Lỗi insert IQC1: ${_s(body['message'])}');
    }
  }

  Future<void> _register() async {
    final inputNo = _inputNoCtrl.text.trim();
    final requestEmpl = _requestEmplCtrl.text.trim();
    if (inputNo.isEmpty || requestEmpl.isEmpty) {
      _snack('Thiếu Input/Empl');
      return;
    }

    final selected = _testList.where((e) => (e['SELECTED'] == true)).toList();
    if (selected.isEmpty) {
      _snack('Chọn ít nhất 1 hạng mục test');
      return;
    }

    setState(() => _loading = true);
    try {
      var nextId = await _getLastDtcId();
      if (nextId <= 0) {
        _snack('Không lấy được DTC_ID');
        return;
      }

      if (_checkNvl) {
        final oldId = await _getDtcIdByLot(inputNo);
        if (oldId != -1) nextId = oldId;
      }

      var err = '';
      for (final t in selected) {
        final testCode = _i(t['TEST_CODE']);
        if (_checkNvl) {
          final existed = await _isLotAndTestCodeExist(inputNo, testCode);
          if (existed) continue;
        }

        final body = await _post('registerDTCTest', {
          'DTC_ID': nextId,
          'TEST_CODE': testCode,
          'TEST_TYPE_CODE': _testType,
          'REQUEST_DEPT_CODE': _reqDeptCode,
          'PROD_REQUEST_NO': _checkNvl ? '1IG0008' : _prodReqNo,
          'M_LOT_NO': _checkNvl ? inputNo : '2101011325',
          'PROD_REQUEST_DATE': _checkNvl ? '20210916' : _prodReqDate,
          'REQUEST_EMPL_NO': requestEmpl,
          'REMARK': _remarkCtrl.text.trim(),
          'G_CODE': _checkNvl ? '7A07540A' : _gCode,
          'M_CODE': _checkNvl ? _mCode : 'B0000035',
        });
        if (_isNg(body)) {
          err += ' ${_s(body['message'])}';
        }
      }

      if (err.isNotEmpty) {
        _snack('Đăng ký thất bại:$err');
        return;
      }

      if (_checkNvl) {
        final auth = ref.read(authNotifierProvider);
        final sub = auth is AuthAuthenticated ? _s(auth.session.user.subDeptName) : '';
        if (sub.toUpperCase().contains('IQC')) {
          await _insertIncomingData(nextId);
        }
      }

      _snack('Đăng ký ĐTC thành công, ID: $nextId');
      await _loadRecent();
    } catch (e) {
      _snack('Lỗi: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Widget _addedSpecChips() {
    if (_addedSpec.isEmpty) return const SizedBox.shrink();
    return Wrap(
      spacing: 12,
      runSpacing: 6,
      children: [
        for (final e in _addedSpec)
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('${_s(e['TEST_NAME'])}: ', style: const TextStyle(fontSize: 12)),
              Text(
                (_i(e['CHECKADDED']) != 0) ? 'YES' : 'NO',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w900,
                  color: (_i(e['CHECKADDED']) != 0) ? Colors.blue : Colors.red,
                ),
              ),
            ],
          ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final title = _checkNvl ? 'ĐKÝ TEST ĐTC NVL (IQC)' : 'ĐKÝ TEST ĐTC SẢN PHẨM';

    return LayoutBuilder(
      builder: (context, constraints) {
        final gridHeight = constraints.maxHeight * 0.60;

        return Padding(
          padding: const EdgeInsets.all(12),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(title, style: TextStyle(color: scheme.primary, fontWeight: FontWeight.w900)),
                    ),
                    Switch(
                      value: _checkNvl,
                      onChanged: (v) {
                        setState(() {
                          _checkNvl = v;
                          _addedSpec = const [];
                          _testedCodes = const [];
                          _mName = '';
                          _mCode = '';
                          _gName = '';
                          _gCode = '';
                          _prodReqNo = '';
                          _prodReqDate = '';
                          _inputNoCtrl.text = '';
                          _testList = _testList.map((e) => {...e, 'SELECTED': false}).toList();
                        });
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Card(
                  child: ExpansionTile(
                    initiallyExpanded: true,
                    title: const Text('Form / Đăng ký'),
                    childrenPadding: const EdgeInsets.all(12),
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: _inputNoCtrl,
                              decoration: InputDecoration(
                                labelText: _checkNvl ? 'LOT NVL' : 'PROD_REQUEST_NO',
                              ),
                              onSubmitted: (v) async {
                                final vv = v.trim();
                                if (vv.isEmpty) return;
                                setState(() => _loading = true);
                                try {
                                  if (_checkNvl) {
                                    await _checkLotNvl(vv);
                                  } else {
                                    await _checkYcsx(vv);
                                  }
                                } finally {
                                  if (mounted) setState(() => _loading = false);
                                }
                              },
                            ),
                          ),
                          const SizedBox(width: 8),
                          IconButton(
                            onPressed: _loading
                                ? null
                                : () async {
                                    final raw = await Navigator.of(context).push<String>(
                                      MaterialPageRoute(builder: (_) => const DtcScanPage(title: 'Scan Lot/Label')),
                                    );
                                    if (raw == null || raw.trim().isEmpty) return;
                                    if (!mounted) return;
                                    _inputNoCtrl.text = raw.trim();
                                    setState(() => _loading = true);
                                    try {
                                      if (_checkNvl) {
                                        await _checkLotNvl(_inputNoCtrl.text.trim());
                                      } else {
                                        await _checkYcsx(_inputNoCtrl.text.trim());
                                      }
                                    } finally {
                                      if (mounted) setState(() => _loading = false);
                                    }
                                  },
                            icon: const Icon(Icons.qr_code_scanner),
                          ),
                        ],
                      ),
                      if (_checkNvl) ...[
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            Expanded(
                              child: TextField(
                                controller: _lotNccCtrl,
                                decoration: const InputDecoration(labelText: 'LOT NCC (LOT_VENDOR)'),
                              ),
                            ),
                            const SizedBox(width: 8),
                            IconButton(
                              onPressed: _loading
                                  ? null
                                  : () async {
                                      final raw = await Navigator.of(context).push<String>(
                                        MaterialPageRoute(builder: (_) => const DtcScanPage(title: 'Scan Lot NCC')),
                                      );
                                      if (raw == null || raw.trim().isEmpty) return;
                                      if (!mounted) return;
                                      _lotNccCtrl.text = raw.trim();
                                    },
                              icon: const Icon(Icons.qr_code_scanner),
                            ),
                          ],
                        ),
                      ],
                      const SizedBox(height: 10),
                      TextField(
                        controller: _requestEmplCtrl,
                        decoration: const InputDecoration(labelText: 'REQUEST_EMPL_NO'),
                        onSubmitted: (v) => _checkEmplName(v.trim()),
                      ),
                      if (_emplName.isNotEmpty) ...[
                        const SizedBox(height: 6),
                        Text('$_emplName ($_reqDeptCode)', style: TextStyle(color: scheme.onSurfaceVariant)),
                      ],
                      const SizedBox(height: 10),
                      TextField(
                        controller: _remarkCtrl,
                        decoration: const InputDecoration(labelText: 'REMARK'),
                      ),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        initialValue: _testType,
                        isExpanded: true,
                        dropdownColor: scheme.surface,
                        style: TextStyle(color: scheme.onSurface),
                        iconEnabledColor: scheme.onSurface,
                        decoration: const InputDecoration(labelText: 'TEST TYPE'),
                        items: const [
                          DropdownMenuItem(value: '1', child: Text('FIRST_LOT')),
                          DropdownMenuItem(value: '2', child: Text('ECN')),
                          DropdownMenuItem(value: '3', child: Text('MASS PRODUCTION')),
                          DropdownMenuItem(value: '4', child: Text('SAMPLE')),
                        ],
                        onChanged: (v) => setState(() => _testType = v ?? '3'),
                      ),
                      const SizedBox(height: 10),
                      if (_checkNvl) ...[
                        Text('M: $_mName', maxLines: 1, overflow: TextOverflow.ellipsis),
                        Text('M_CODE: $_mCode', maxLines: 1, overflow: TextOverflow.ellipsis),
                      ] else ...[
                        Text('G: $_gName', maxLines: 1, overflow: TextOverflow.ellipsis),
                        Text('G_CODE: $_gCode', maxLines: 1, overflow: TextOverflow.ellipsis),
                      ],
                      const SizedBox(height: 10),
                      _addedSpecChips(),
                      const SizedBox(height: 10),
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Text('Chọn hạng mục test', style: TextStyle(fontWeight: FontWeight.w900, color: scheme.primary)),
                      ),
                      const SizedBox(height: 6),
                      ..._testList.map((e) {
                        final tc = _i(e['TEST_CODE']);
                        final tested = _testedCodes.contains(tc);
                        return CheckboxListTile(
                          dense: true,
                          value: e['SELECTED'] == true,
                          onChanged: (v) {
                            setState(() {
                              _testList = _testList
                                  .map((x) => x == e ? {...x, 'SELECTED': (v ?? false)} : x)
                                  .toList();
                            });
                          },
                          title: Text('${_s(e['TEST_NAME'])} (${_s(e['TEST_CODE'])})'),
                          subtitle: tested ? const Text('Đã từng test (auto-selected)') : null,
                        );
                      }),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          Expanded(
                            child: FilledButton(
                              onPressed: _loading ? null : _register,
                              child: const Text('Đăng ký'),
                            ),
                          ),
                          const SizedBox(width: 8),
                          IconButton(
                            onPressed: _loading ? null : _loadRecent,
                            icon: const Icon(Icons.refresh),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  height: gridHeight < 280 ? 280 : gridHeight,
                  child: _loading
                      ? const Center(child: CircularProgressIndicator())
                      : (_recentCols.isEmpty
                          ? Center(child: Text('Chưa có recent', style: TextStyle(color: scheme.onSurfaceVariant)))
                          : PlutoGrid(
                              columns: _recentCols,
                              rows: _recentRows,
                              onLoaded: (e) {
                                e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                                e.stateManager.setShowColumnFilter(true);
                              },
                              configuration: const PlutoGridConfiguration(
                                columnSize: PlutoGridColumnSizeConfig(autoSizeMode: PlutoAutoSizeMode.scale),
                                style: PlutoGridStyleConfig(
                                  enableCellBorderVertical: true,
                                  enableCellBorderHorizontal: true,
                                  rowHeight: 28,
                                  columnHeight: 28,
                                  cellTextStyle: TextStyle(fontSize: 11),
                                  columnTextStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w800),
                                ),
                              ),
                            )),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
