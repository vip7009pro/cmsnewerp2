import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import 'package:pluto_grid/pluto_grid.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../../core/config/app_config.dart';
import '../../../../../core/providers.dart';
import '../../../../auth/application/auth_notifier.dart';
import '../../../../auth/application/auth_state.dart';

class Pqc3DefectTab extends ConsumerStatefulWidget {
  const Pqc3DefectTab({super.key});

  @override
  ConsumerState<Pqc3DefectTab> createState() => _Pqc3DefectTabState();
}

class _Pqc3DefectTabState extends ConsumerState<Pqc3DefectTab> {
  bool _loading = false;
  bool _showFilter = true;

  String _factory = 'NM1';

  final TextEditingController _lotCtrl = TextEditingController();
  final TextEditingController _lineQcCtrl = TextEditingController();
  final TextEditingController _defectPheCtrl = TextEditingController();
  final TextEditingController _remarkCtrl = TextEditingController();
  final TextEditingController _sampleQtyCtrl = TextEditingController(text: '0');
  final TextEditingController _defectQtyCtrl = TextEditingController(text: '0');

  String _lineQcName = '';

  DateTime _occurr = DateTime.now();
  String _errCode = 'ERR1';

  List<Map<String, dynamic>> _errTb = const [];

  // derived from checkPLAN_ID
  String _planId = '';
  String _gCode = '';
  String _prodRequestNo = '';
  int _pqc1Id = 0;

  File? _imageFile;

  List<PlutoColumn> _pqc1Cols = const [];
  List<PlutoRow> _pqc1GridRows = const [];

  List<PlutoColumn> _pqc3Cols = const [];
  List<PlutoRow> _pqc3GridRows = const [];

  String _s(dynamic v) => (v ?? '').toString();
  num _num(dynamic v) => (v is num) ? v : (num.tryParse(_s(v).replaceAll(',', '')) ?? 0);
  bool _isNg(Map<String, dynamic> body) => (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  String _ymdHms(DateTime dt) => DateFormat('yyyy-MM-dd HH:mm:ss').format(dt);
  String _ymd(DateTime dt) => DateFormat('yyyy-MM-dd').format(dt);

  @override
  void initState() {
    super.initState();
    final auth = ref.read(authNotifierProvider);
    final session = auth is AuthAuthenticated ? auth.session : null;
    final user = session?.user;
    if (user?.emplNo != null) {
      _lineQcCtrl.text = user!.emplNo;
      _checkEmplName(user.emplNo);
    }
    _factory = 'NM1';
    _loadInit();
  }

  @override
  void dispose() {
    _lotCtrl.dispose();
    _lineQcCtrl.dispose();
    _defectPheCtrl.dispose();
    _remarkCtrl.dispose();
    _sampleQtyCtrl.dispose();
    _defectQtyCtrl.dispose();
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

  Future<void> _loadInit() async {
    setState(() {
      _loading = true;
      _showFilter = false;
    });
    try {
      await _loadErrTable();
      await _traPqc3Data();
    } catch (e) {
      _snack('Lỗi init: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _loadErrTable() async {
    final body = await _post('loadErrTable', {});
    if (_isNg(body)) {
      if (!mounted) return;
      setState(() => _errTb = const []);
      return;
    }
    final raw = body['data'];
    final data = raw is List ? raw : const [];
    final rows = data.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();
    if (!mounted) return;
    setState(() {
      _errTb = rows;
      if (_errTb.isNotEmpty) {
        _errCode = _s(_errTb.first['ERR_CODE']).isEmpty ? _errCode : _s(_errTb.first['ERR_CODE']);
      }
    });
  }

  Future<void> _checkEmplName(String emplNo) async {
    try {
      final body = await _post('checkEMPL_NO_mobile', {'EMPL_NO': emplNo});
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() => _lineQcName = '');
        return;
      }
      final data = body['data'];
      final first = (data is List && data.isNotEmpty && data.first is Map) ? (data.first as Map) : null;
      if (first == null) return;
      final name = '${_s(first['MIDLAST_NAME'])} ${_s(first['FIRST_NAME'])}'.trim();
      if (!mounted) return;
      setState(() => _lineQcName = name);
    } catch (_) {
      if (!mounted) return;
      setState(() => _lineQcName = '');
    }
  }

  Future<void> _checkProcessLot(String lot) async {
    final body = await _post('checkPROCESS_LOT_NO', {'PROCESS_LOT_NO': lot});
    if (_isNg(body)) {
      if (!mounted) return;
      setState(() {
        _planId = '';
        _gCode = '';
        _prodRequestNo = '';
        _pqc1Id = 0;
        _pqc1Cols = const [];
        _pqc1GridRows = const [];
      });
      return;
    }
    final data = body['data'];
    final first = (data is List && data.isNotEmpty && data.first is Map) ? (data.first as Map) : null;
    final plan = first == null ? '' : _s(first['PLAN_ID']);
    if (plan.isEmpty) return;
    await _checkPlanId(plan);
  }

  Future<void> _checkPlanId(String planId) async {
    final body = await _post('checkPLAN_ID', {'PLAN_ID': planId});
    if (_isNg(body)) {
      if (!mounted) return;
      setState(() {
        _planId = '';
        _gCode = '';
        _prodRequestNo = '';
        _pqc1Id = 0;
      });
      return;
    }
    final data = body['data'];
    final first = (data is List && data.isNotEmpty && data.first is Map) ? (data.first as Map) : null;
    if (first == null) return;
    final gCode = _s(first['G_CODE']);
    final prodReq = _s(first['PROD_REQUEST_NO']);
    if (!mounted) return;
    setState(() {
      _planId = planId;
      _gCode = gCode;
      _prodRequestNo = prodReq;
    });
    if (gCode.isNotEmpty) {
      await _traPqc1Data(gCode);
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

  List<PlutoColumn> _buildCols(List<Map<String, dynamic>> rows, {required List<String> prefer, Map<String, PlutoColumnRenderer>? renderers}) {
    if (rows.isEmpty) return const [];
    final keys = rows.first.keys.map((e) => e.toString()).toList();
    final ordered = <String>[
      ...prefer.where(keys.contains),
      ...keys.where((k) => !prefer.contains(k)),
    ];
    return [
      PlutoColumn(title: '', field: '__raw__', type: PlutoColumnType.text(), width: 0, hide: true),
      ...ordered.map((f) {
        if (renderers != null && renderers.containsKey(f)) {
          return _col(f, w: 110, renderer: renderers[f]);
        }
        final isNum = rows.any((r) => r[f] is num) || const <String>{'INSPECT_QTY', 'DEFECT_QTY', 'PROD_LAST_PRICE', 'PROD_REQUEST_QTY', 'INSPECT_SAMPLE_QTY'}.contains(f);
        final editable = f == 'INSPECT_SAMPLE_QTY';
        return _col(f, type: isNum ? PlutoColumnType.number() : PlutoColumnType.text(), editable: editable);
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

  Future<void> _traPqc1Data(String gCode) async {
    final body = await _post('trapqc1data', {
      'ALLTIME': true,
      'FROM_DATE': _ymd(DateTime.now().subtract(const Duration(days: 2))),
      'TO_DATE': _ymd(DateTime.now()),
      'CUST_NAME': '',
      'PROCESS_LOT_NO': '',
      'G_CODE': gCode,
      'G_NAME': '',
      'PROD_TYPE': '',
      'EMPL_NAME': '',
      'PROD_REQUEST_NO': '',
      'ID': '',
      'FACTORY': _factory,
    });
    if (_isNg(body)) {
      if (!mounted) return;
      setState(() {
        _pqc1Cols = const [];
        _pqc1GridRows = const [];
      });
      return;
    }
    final raw = body['data'];
    final data = raw is List ? raw : const [];
    final rows = data.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();
    final prefer = const [
      'PQC1_ID',
      'G_NAME_KD',
      'LINE_NO',
      'SETTING_OK_TIME',
      'PROCESS_LOT_NO',
      'PLAN_ID',
      'INSPECT_SAMPLE_QTY',
      'YEAR_WEEK',
      'FACTORY',
      'G_NAME',
      'LINEQC_PIC',
      'PROD_PIC',
      'PROD_LEADER',
      'STEPS',
      'CAVITY',
      'PROD_LAST_PRICE',
      'SAMPLE_AMOUNT',
      'REMARK',
    ];
    final cols = _buildCols(rows, prefer: prefer);
    final gridRows = _buildRows(rows, cols);
    if (!mounted) return;
    setState(() {
      _pqc1Cols = cols;
      _pqc1GridRows = gridRows;
      if (_pqc1Id == 0 && rows.isNotEmpty) {
        _pqc1Id = _num(rows.first['PQC1_ID']).toInt();
      }
    });
  }

  Future<void> _traPqc3Data() async {
    final body = await _post('trapqc3data', {
      'ALLTIME': true,
      'FROM_DATE': _ymd(DateTime.now().subtract(const Duration(days: 2))),
      'TO_DATE': _ymd(DateTime.now()),
      'CUST_NAME': '',
      'PROCESS_LOT_NO': '',
      'G_CODE': '',
      'G_NAME': '',
      'PROD_TYPE': '',
      'EMPL_NAME': '',
      'PROD_REQUEST_NO': '',
      'ID': '',
      'FACTORY': 'All',
    });
    if (_isNg(body)) {
      if (!mounted) return;
      setState(() {
        _pqc3Cols = const [];
        _pqc3GridRows = const [];
      });
      return;
    }
    final raw = body['data'];
    final data = raw is List ? raw : const [];
    final rows = data.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();

    final renderers = <String, PlutoColumnRenderer>{
      'DEFECT_IMAGE_LINK': (ctx) {
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
    };

    final prefer = const [
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
      'PROD_LAST_PRICE',
      'LINEQC_PIC',
      'PROD_PIC',
      'PROD_LEADER',
      'LINE_NO',
      'OCCURR_TIME',
      'INSPECT_QTY',
      'DEFECT_QTY',
      'DEFECT_AMOUNT',
      'DEFECT_PHENOMENON',
      'DEFECT_IMAGE_LINK',
      'REMARK',
      'WORST5',
      'WORST5_MONTH',
      'ERR_CODE',
      'NG_NHAN',
      'DOI_SACH',
      'STATUS',
    ];

    final cols = _buildCols(rows, prefer: prefer, renderers: renderers);
    final gridRows = _buildRows(rows, cols);
    if (!mounted) return;
    setState(() {
      _pqc3Cols = cols;
      _pqc3GridRows = gridRows;
    });
  }

  Future<void> _pickOccurr() async {
    final d = await showDatePicker(
      context: context,
      initialDate: _occurr,
      firstDate: DateTime(2020, 1, 1),
      lastDate: DateTime(2100, 12, 31),
    );
    if (d == null) return;
    if (!mounted) return;
    final t = await showTimePicker(context: context, initialTime: TimeOfDay.fromDateTime(_occurr));
    if (t == null) return;
    if (!mounted) return;
    setState(() {
      _occurr = DateTime(d.year, d.month, d.day, t.hour, t.minute);
    });
  }

  Future<void> _pickImage() async {
    final x = await ImagePicker().pickImage(source: ImageSource.gallery);
    if (x == null) return;
    setState(() {
      _imageFile = File(x.path);
    });
  }

  bool _checkInput() {
    if (_lotCtrl.text.trim().isEmpty) return false;
    if (_lineQcCtrl.text.trim().isEmpty) return false;
    if (_pqc1Id == 0) return false;
    if (_imageFile == null) return false;
    if (_errCode.trim().isEmpty) return false;
    if (_defectPheCtrl.text.trim().isEmpty) return false;
    if (_prodRequestNo.trim().isEmpty) return false;
    if (_gCode.trim().isEmpty) return false;
    return true;
  }

  Future<void> _inputData() async {
    if (_loading) return;
    if (!_checkInput()) {
      _snack('Nhập đủ thông tin cần thiết');
      return;
    }
    setState(() {
      _loading = true;
      _showFilter = false;
    });
    try {
      final uploadData = {
        'PROCESS_LOT_NO': _lotCtrl.text.trim().toUpperCase(),
        'LINEQC_PIC': _lineQcCtrl.text.trim().toUpperCase(),
        'OCCURR_TIME': _ymdHms(_occurr),
        'INSPECT_QTY': _num(_sampleQtyCtrl.text),
        'DEFECT_QTY': _num(_defectQtyCtrl.text),
        'DEFECT_PHENOMENON': _defectPheCtrl.text.trim(),
        'DEFECT_IMAGE_LINK': 'Link_Web',
        'REMARK': _remarkCtrl.text,
        'PQC1_ID': _pqc1Id,
        'ERR_CODE': _errCode,
        'PROD_REQUEST_NO': _prodRequestNo,
        'G_CODE': _gCode,
      };
      final body = await _post('insert_pqc3', uploadData);
      if (_isNg(body)) {
        _snack('Có lỗi: ${_s(body['message'])}');
        return;
      }

      final idBody = await _post('getlastestPQC3_ID', {});
      if (_isNg(idBody)) {
        _snack('Input OK nhưng không lấy được PQC3_ID');
        return;
      }
      final data = idBody['data'];
      final first = (data is List && data.isNotEmpty && data.first is Map) ? (data.first as Map) : null;
      final pqc3Id = first == null ? 0 : _num(first['PQC3_ID']).toInt();
      if (pqc3Id <= 0) {
        _snack('Input OK nhưng PQC3_ID không hợp lệ');
        return;
      }

      final api = ref.read(apiClientProvider);
      await api.uploadFile(
        file: _imageFile!,
        filename: 'PQC3_${pqc3Id + 1}.png',
        uploadFolderName: 'pqc',
      );

      _snack('Input PQC3 thành công');
      await _traPqc3Data();
    } catch (e) {
      _snack('Lỗi: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final canInput = _checkInput();

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
              const Expanded(child: Text('PQC3-DEFECT', style: TextStyle(fontWeight: FontWeight.w900))),
              FilledButton.tonal(onPressed: _loading ? null : _traPqc3Data, child: const Text('Tra Data')),
            ],
          ),
        ),
      );
    }

    Widget form() {
      if (!_showFilter) return const SizedBox.shrink();
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                '${_lineQcName.isEmpty ? '' : _lineQcName} | PQC3 INPUT',
                style: const TextStyle(fontWeight: FontWeight.w900, color: Colors.blue),
              ),
              const SizedBox(height: 10),
              Wrap(
                spacing: 10,
                runSpacing: 10,
                children: [
                  SizedBox(
                    width: 140,
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
                    width: 180,
                    child: TextField(
                      controller: _lotCtrl,
                      enabled: !_loading,
                      decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'Lot SX'),
                      onChanged: (v) {
                        final t = v.trim();
                        if (t.length >= 8) {
                          _checkProcessLot(t);
                        }
                      },
                    ),
                  ),
                  SizedBox(
                    width: 180,
                    child: TextField(
                      controller: _lineQcCtrl,
                      enabled: !_loading,
                      decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'Mã LINEQC'),
                      onChanged: (v) {
                        final t = v.trim();
                        if (t.length >= 7) {
                          _checkEmplName(t);
                        } else {
                          setState(() => _lineQcName = '');
                        }
                      },
                    ),
                  ),
                  SizedBox(
                    width: 220,
                    child: DropdownButtonFormField<String>(
                      initialValue: _errCode,
                      isExpanded: true,
                      decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'Mã lỗi'),
                      onChanged: _loading ? null : (v) => setState(() => _errCode = v ?? _errCode),
                      selectedItemBuilder: (context) {
                        return _errTb.map((e) {
                          final text = '${_s(e['ERR_CODE'])} | ${_s(e['ERR_NAME_VN'])}';
                          return Align(
                            alignment: Alignment.centerLeft,
                            child: Text(
                              text,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          );
                        }).toList();
                      },
                      items: _errTb
                          .map((e) => DropdownMenuItem(
                                value: _s(e['ERR_CODE']),
                                child: Text(
                                  '${_s(e['ERR_CODE'])} | ${_s(e['ERR_NAME_VN'])}',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ))
                          .toList(),
                    ),
                  ),
                  SizedBox(
                    width: 240,
                    child: TextField(
                      controller: _defectPheCtrl,
                      enabled: !_loading,
                      decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'Hiện tượng lỗi'),
                    ),
                  ),
                  SizedBox(
                    width: 220,
                    child: OutlinedButton.icon(
                      onPressed: _loading ? null : _pickOccurr,
                      icon: const Icon(Icons.schedule),
                      label: Text('Time: ${_ymdHms(_occurr)}'),
                    ),
                  ),
                  SizedBox(
                    width: 220,
                    child: TextField(
                      controller: _remarkCtrl,
                      enabled: !_loading,
                      decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'Remark'),
                    ),
                  ),
                  SizedBox(
                    width: 220,
                    child: OutlinedButton.icon(
                      onPressed: _loading ? null : _pickImage,
                      icon: const Icon(Icons.photo),
                      label: Text(_imageFile == null ? 'Chọn ảnh' : 'Đã chọn ảnh'),
                    ),
                  ),
                  SizedBox(
                    width: 140,
                    child: TextField(
                      controller: _sampleQtyCtrl,
                      enabled: !_loading,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'SAMPLE QTY'),
                    ),
                  ),
                  SizedBox(
                    width: 140,
                    child: TextField(
                      controller: _defectQtyCtrl,
                      enabled: !_loading,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'DEFECT QTY'),
                    ),
                  ),
                  SizedBox(
                    width: 150,
                    child: FilledButton(
                      onPressed: _loading ? null : _inputData,
                      child: Text(canInput ? 'Input Data' : 'Input Data (thiếu)'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 12,
                runSpacing: 6,
                children: [
                  _miniInfo('PLAN_ID', _planId),
                  _miniInfo('G_CODE', _gCode),
                  _miniInfo('YCSX', _prodRequestNo),
                  _miniInfo('PQC1_ID', _pqc1Id == 0 ? '' : _pqc1Id.toString()),
                ],
              ),
            ],
          ),
        ),
      );
    }

    Widget pqc1Grid() {
      return Card(
        margin: EdgeInsets.zero,
        child: _pqc1Cols.isEmpty
            ? const Center(child: Text('Chưa có dữ liệu PQC1'))
            : PlutoGrid(
                columns: _pqc1Cols,
                rows: _pqc1GridRows,
                onLoaded: (e) => e.stateManager.setShowColumnFilter(true),
                onRowChecked: (event) {
                  if (event.row == null) return;
                  final raw = event.row!.cells['__raw__']?.value;
                  if (raw is! Map<String, dynamic>) return;
                  final id = _num(raw['PQC1_ID']).toInt();
                  setState(() => _pqc1Id = id);
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

    Widget pqc3Grid() {
      return Card(
        margin: EdgeInsets.zero,
        child: _pqc3Cols.isEmpty
            ? const Center(child: Text('Chưa có dữ liệu PQC3'))
            : PlutoGrid(
                columns: _pqc3Cols,
                rows: _pqc3GridRows,
                onLoaded: (e) => e.stateManager.setShowColumnFilter(true),
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
          SliverToBoxAdapter(child: form()),
          const SliverToBoxAdapter(child: SizedBox(height: 8)),
          SliverToBoxAdapter(
            child: SizedBox(
              height: 260,
              child: pqc1Grid(),
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 8)),
          SliverFillRemaining(hasScrollBody: true, child: pqc3Grid()),
        ],
      ),
    );
  }

  Widget _miniInfo(String title, String value) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text('$title: ', style: const TextStyle(fontWeight: FontWeight.w900, color: Colors.black54)),
        Text(value.isEmpty ? '-' : value, style: const TextStyle(fontWeight: FontWeight.w900, color: Colors.blue)),
      ],
    );
  }
}
