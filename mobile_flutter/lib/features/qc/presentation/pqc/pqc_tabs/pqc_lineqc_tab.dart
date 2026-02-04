import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';

import '../../../../../core/providers.dart';
import '../../../../auth/application/auth_notifier.dart';
import '../../../../auth/application/auth_state.dart';
import '../../dtc_tabs/dtc_scan_page.dart';

class PqcLineQcTab extends ConsumerStatefulWidget {
  const PqcLineQcTab({super.key});

  @override
  ConsumerState<PqcLineQcTab> createState() => _PqcLineQcTabState();
}

class _PqcLineQcTabState extends ConsumerState<PqcLineQcTab> {
  bool _loading = false;
  bool _showFilter = true;

  String _factory = 'NM1';
  final TextEditingController _planIdCtrl = TextEditingController();
  String _gName = '';
  String _gCode = '';
  String _prodRequestNo = '';
  String _prodReqDate = '';

  final TextEditingController _lineQcEmplCtrl = TextEditingController();
  String _emplName = '';

  final TextEditingController _remarkCtrl = TextEditingController();
  String _ktdtc = 'CKT';

  List<Map<String, dynamic>> _sxData = const [];

  String _inputNo = '';
  String _processLotNo = '';

  String _mName = '';
  num _widthCd = 0;
  num _inCfmQty = 0;
  num _rollQty = 0;
  num _lieuQlSx = 0;
  String _outDate = '';

  File? _imageFile;

  String _s(dynamic v) => (v ?? '').toString();
  num _num(dynamic v) => (v is num) ? v : (num.tryParse(_s(v).replaceAll(',', '')) ?? 0);

  bool _isNg(Map<String, dynamic> body) => (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  @override
  void initState() {
    super.initState();
    final authState = ref.read(authNotifierProvider);
    final session = authState is AuthAuthenticated ? authState.session : null;
    final user = session?.user;
    _lineQcEmplCtrl.text = user?.emplNo ?? '';
    _factory = 'NM1';
    if (_lineQcEmplCtrl.text.trim().isNotEmpty) {
      _checkEmplName(_lineQcEmplCtrl.text.trim());
    }
  }

  @override
  void dispose() {
    _planIdCtrl.dispose();
    _lineQcEmplCtrl.dispose();
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

  Future<void> _scanPlanId() async {
    final raw = await Navigator.of(context).push<String>(
      MaterialPageRoute(builder: (_) => const DtcScanPage(title: 'Scan CTSX')),
    );
    if (raw == null || raw.trim().isEmpty) return;
    _planIdCtrl.text = raw.trim();
    await _onPlanIdChanged(raw.trim());
  }

  Future<void> _pickImage() async {
    final picked = await ImagePicker().pickImage(source: ImageSource.gallery, imageQuality: 95);
    if (picked == null) return;
    setState(() {
      _imageFile = File(picked.path);
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

  Future<void> _checkEmplName(String emplNo) async {
    try {
      final body = await _post('checkEMPL_NO_mobile', {'EMPL_NO': emplNo});
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() => _emplName = '');
        return;
      }
      final data = body['data'];
      final first = (data is List && data.isNotEmpty && data.first is Map) ? (data.first as Map) : null;
      if (first == null) return;
      final name = '${_s(first['MIDLAST_NAME'])} ${_s(first['FIRST_NAME'])}'.trim();
      if (!mounted) return;
      setState(() => _emplName = name);
    } catch (_) {
      if (!mounted) return;
      setState(() => _emplName = '');
    }
  }

  Future<void> _checkPlanId(String planId) async {
    final body = await _post('checkPLAN_ID', {'PLAN_ID': planId});
    if (_isNg(body)) {
      if (!mounted) return;
      setState(() {
        _gName = '';
        _gCode = '';
        _prodRequestNo = '';
        _prodReqDate = '';
      });
      return;
    }
    final data = body['data'];
    final first = (data is List && data.isNotEmpty && data.first is Map) ? (data.first as Map) : null;
    if (first == null) return;
    if (!mounted) return;
    setState(() {
      _gName = _s(first['G_NAME']);
      _prodRequestNo = _s(first['PROD_REQUEST_NO']);
      _prodReqDate = _s(first['PROD_REQUEST_DATE']);
      _gCode = _s(first['G_CODE']);
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
          _inputNo = mLot;
          _processLotNo = procLot;
        });
        if (mLot.isNotEmpty) {
          await _checkLotNvl(mLot);
        }
        if (procLot.isNotEmpty) {
          await _checkKtdtc(procLot);
        }
        return;
      }
    }

    final processNumber = _num(first['PROCESS_NUMBER']).toInt();
    if (processNumber == 0) {
      if (!mounted) return;
      setState(() {
        _inputNo = '';
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
        _inputNo = '';
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
      _inputNo = mLot;
      _processLotNo = procLot;
    });
    if (mLot.isNotEmpty) {
      await _checkLotNvl(mLot);
    }
    if (procLot.isNotEmpty) {
      await _checkKtdtc(procLot);
    }
  }

  Future<void> _checkLotNvl(String mLotNo) async {
    final body = await _post('checkMNAMEfromLot', {'M_LOT_NO': mLotNo});
    if (_isNg(body)) {
      if (!mounted) return;
      setState(() {
        _mName = '';
        _widthCd = 0;
        _rollQty = 0;
        _inCfmQty = 0;
        _lieuQlSx = 0;
        _outDate = '';
      });
      return;
    }
    final data = body['data'];
    final first = (data is List && data.isNotEmpty && data.first is Map) ? (data.first as Map) : null;
    if (first == null) return;
    if (!mounted) return;
    setState(() {
      _mName = '${_s(first['M_NAME'])} | ${_s(first['WIDTH_CD'])}'.trim();
      _widthCd = _num(first['WIDTH_CD']);
      _inCfmQty = _num(first['OUT_CFM_QTY']);
      _rollQty = _num(first['ROLL_QTY']);
      _lieuQlSx = _num(first['LIEUQL_SX']);
      _outDate = _s(first['OUT_DATE']);
    });
  }

  Future<int> _checkPlanIdChecksheetStt(String planId) async {
    try {
      final body = await _post('checkPlanIdChecksheet', {'PLAN_ID': planId});
      if (_isNg(body)) return 1;
      final data = body['data'];
      final first = (data is List && data.isNotEmpty && data.first is Map) ? (data.first as Map) : null;
      if (first == null) return 1;
      final img1 = _s(first['IMG_1']).toUpperCase();
      final img2 = _s(first['IMG_2']).toUpperCase();
      final img3 = _s(first['IMG_3']).toUpperCase();
      if (img3 == 'Y') return 4;
      if (img2 == 'Y') return 3;
      if (img1 == 'Y') return 2;
      return 1;
    } catch (_) {
      return 1;
    }
  }

  bool _canInput() {
    if (_planIdCtrl.text.trim().isEmpty) return false;
    if (_lineQcEmplCtrl.text.trim().isEmpty) return false;
    if (_sxData.isEmpty) return false;
    final first = _sxData.first;
    final massStart = _s(first['MASS_START_TIME']);
    if (massStart.isEmpty) return false;
    if (_imageFile == null) return false;
    return true;
  }

  Future<void> _onPlanIdChanged(String planId) async {
    final p = planId.trim();
    if (p.length < 8) {
      if (!mounted) return;
      setState(() {
        _gName = '';
        _gCode = '';
        _prodRequestNo = '';
        _prodReqDate = '';
        _sxData = const [];
        _inputNo = '';
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
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  Future<void> _inputData() async {
    if (_loading) return;
    final planId = _planIdCtrl.text.trim().toUpperCase();
    if (planId.isEmpty) return;
    if (!_canInput()) {
      _snack('Hãy nhập đủ thông tin + chọn ảnh trước khi input');
      return;
    }
    if (_sxData.isEmpty) {
      _snack('Thiếu SX data');
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
      final stt = await _checkPlanIdChecksheetStt(planId);
      if (stt >= 4) {
        _snack('Đã up đủ đầu/giữa/cuối rồi');
        return;
      }

      if (stt == 1) {
        final insert = await _post('insert_pqc1', {
          'PROCESS_LOT_NO': _processLotNo.toUpperCase(),
          'LINEQC_PIC': _lineQcEmplCtrl.text.trim().toUpperCase(),
          'PROD_PIC': _s(first['INS_EMPL']).toUpperCase(),
          'PROD_LEADER': _s(first['PROD_LEADER']).toUpperCase(),
          'STEPS': first['STEP'],
          'CAVITY': first['CAVITY'],
          'SETTING_OK_TIME': first['MASS_START_TIME'],
          'FACTORY': first['PLAN_FACTORY'],
          'REMARK': _ktdtc,
          'PROD_REQUEST_NO': _s(first['PROD_REQUEST_NO']).toUpperCase(),
          'G_CODE': first['G_CODE'],
          'PLAN_ID': planId,
          'PROCESS_NUMBER': first['PROCESS_NUMBER'],
          'LINE_NO': eq,
          'REMARK2': _remarkCtrl.text,
        });
        if (_isNg(insert)) {
          _snack('Insert PQC1 lỗi: ${_s(insert['message'])}');
        }
      }

      final upd = await _post('update_checksheet_image_status', {
        'PLAN_ID': planId,
        'STT': stt,
      });
      if (_isNg(upd)) {
        _snack('Update status lỗi: ${_s(upd['message'])}');
        return;
      }

      final api = ref.read(apiClientProvider);
      final file = _imageFile;
      if (file == null) {
        _snack('Chưa chọn ảnh');
        return;
      }
      final uploadName = '${planId}_$stt.jpg';
      final upRes = await api.uploadFile(file: file, filename: uploadName, uploadFolderName: 'lineqc');
      final body = upRes.data;
      if (body is Map && (body['tk_status'] ?? '').toString().toUpperCase() == 'NG') {
        _snack('Upload thất bại: ${_s(body['message'])}');
        return;
      }

      _snack('Input data thành công');
      if (!mounted) return;
      setState(() {
        _planIdCtrl.clear();
        _gName = '';
        _gCode = '';
        _prodRequestNo = '';
        _prodReqDate = '';
        _sxData = const [];
        _inputNo = '';
        _processLotNo = '';
        _ktdtc = 'CKT';
        _imageFile = null;
        _remarkCtrl.clear();
      });
    } catch (e) {
      _snack('Lỗi input: $e');
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final first = _sxData.isEmpty ? null : _sxData.first;
    final canInput = _canInput();

    return Padding(
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
                    tooltip: _showFilter ? 'Ẩn form' : 'Hiện form',
                    onPressed: _loading ? null : () => setState(() => _showFilter = !_showFilter),
                    icon: Icon(_showFilter ? Icons.filter_alt_off : Icons.filter_alt),
                  ),
                  const Expanded(child: Text('LINEQC', style: TextStyle(fontWeight: FontWeight.w900))),
                ],
              ),
            ),
          ),
          if (_showFilter)
            Card(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Row(
                      children: [
                        const Text('FACTORY:', style: TextStyle(fontWeight: FontWeight.w900)),
                        const SizedBox(width: 8),
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
                        const Spacer(),
                        OutlinedButton.icon(
                          onPressed: _loading ? null : _scanPlanId,
                          icon: const Icon(Icons.qr_code_scanner),
                          label: const Text('Scan'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: _planIdCtrl,
                      enabled: !_loading,
                      decoration: const InputDecoration(
                        labelText: 'Số CTSX (PLAN_ID)',
                        border: OutlineInputBorder(),
                      ),
                      onChanged: (v) {
                        if (v.trim().length >= 8) {
                          _onPlanIdChanged(v);
                        }
                      },
                    ),
                    if (_gName.isNotEmpty || _processLotNo.isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.only(top: 8),
                        child: Text(
                          '${_gName.isEmpty ? '-' : _gName} | ${_processLotNo.isEmpty ? '-' : _processLotNo}',
                          style: const TextStyle(fontWeight: FontWeight.w900, color: Colors.red),
                        ),
                      ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: _lineQcEmplCtrl,
                      enabled: !_loading,
                      decoration: const InputDecoration(
                        labelText: 'Mã LINEQC',
                        border: OutlineInputBorder(),
                      ),
                      onChanged: (v) {
                        if (v.trim().length >= 7) {
                          _checkEmplName(v.trim());
                        } else {
                          setState(() => _emplName = '');
                        }
                      },
                    ),
                    if (_emplName.isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.only(top: 6),
                        child: Text(_emplName, style: const TextStyle(fontWeight: FontWeight.w900, color: Colors.red)),
                      ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: _loading ? null : _pickImage,
                            icon: const Icon(Icons.image_outlined),
                            label: Text(_imageFile == null ? 'Chọn ảnh checksheet (.jpg)' : 'Đã chọn ảnh'),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Text('KTDTC: $_ktdtc', style: const TextStyle(fontWeight: FontWeight.w900, color: Colors.blue)),
                      ],
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: _remarkCtrl,
                      enabled: !_loading,
                      decoration: const InputDecoration(
                        labelText: 'Remark (tuỳ chọn)',
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 12),
                    FilledButton(
                      onPressed: _loading ? null : _inputData,
                      child: Text(canInput ? 'Input Data' : 'Input Data (thiếu thông tin)'),
                    ),
                  ],
                ),
              ),
            ),
          if (_loading) const LinearProgressIndicator(),
          const SizedBox(height: 10),
          Expanded(
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: ListView(
                  children: [
                    const Text('Thông tin CTSX / SX', style: TextStyle(fontWeight: FontWeight.w900)),
                    const SizedBox(height: 8),
                    _kv('PLAN_ID', _planIdCtrl.text.trim()),
                    _kv('G_CODE', _gCode),
                    _kv('PROD_REQUEST_NO', _prodRequestNo),
                    _kv('PROD_REQUEST_DATE', _prodReqDate),
                    _kv('M_LOT_NO', _inputNo),
                    _kv('M_NAME', _mName),
                    _kv('WIDTH_CD', _widthCd.toString()),
                    _kv('ROLL_QTY', _rollQty.toString()),
                    _kv('OUT_CFM_QTY', _inCfmQty.toString()),
                    _kv('LIEUQL_SX', _lieuQlSx.toString()),
                    _kv('OUT_DATE', _outDate),
                    const Divider(),
                    _kv('SX rows', _sxData.length.toString()),
                    if (first != null) ...[
                      _kv('EQ_NAME_TT', _s(first['EQ_NAME_TT'])),
                      _kv('STEP', _s(first['STEP'])),
                      _kv('CAVITY', _s(first['CAVITY'])),
                      _kv('MASS_START_TIME', _s(first['MASS_START_TIME'])),
                      _kv('INS_EMPL', _s(first['INS_EMPL'])),
                      _kv('PLAN_FACTORY', _s(first['PLAN_FACTORY'])),
                      _kv('PROCESS_NUMBER', _s(first['PROCESS_NUMBER'])),
                    ],
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _kv(String k, String v) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(width: 140, child: Text(k, style: const TextStyle(fontWeight: FontWeight.w900))),
          Expanded(child: Text(v.isEmpty ? '-' : v)),
        ],
      ),
    );
  }
}
