import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pluto_grid/pluto_grid.dart';

import '../../../../core/providers.dart';

class DtcResultTab extends ConsumerStatefulWidget {
  const DtcResultTab({super.key});

  @override
  ConsumerState<DtcResultTab> createState() => _DtcResultTabState();
}

class _DtcResultTabState extends ConsumerState<DtcResultTab> {
  bool _loading = false;
  bool _byLot = false;

  final _idOrLotCtrl = TextEditingController();
  final _remarkCtrl = TextEditingController();

  String _dtcId = '';

  List<Map<String, dynamic>> _testList = const [];
  String _selectedTestCode = '';

  List<Map<String, dynamic>> _rows = const [];
  List<PlutoColumn> _cols = const [];
  List<PlutoRow> _gridRows = const [];
  PlutoGridStateManager? _sm;

  String _s(dynamic v) => (v ?? '').toString();
  int _i(dynamic v) => int.tryParse(_s(v)) ?? 0;
  double _d(dynamic v) => double.tryParse(_s(v).replaceAll(',', '')) ?? 0.0;

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
      _loadInit();
    });
  }

  @override
  void dispose() {
    _idOrLotCtrl.dispose();
    _remarkCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadInit() async {
    setState(() => _loading = true);
    try {
      await _loadTestList();
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
      _testList = list;
      if (_selectedTestCode.isEmpty && list.isNotEmpty) {
        _selectedTestCode = _s(list.first['TEST_CODE']);
      }
    });
  }

  Future<void> _resolveFromLot(String lot) async {
    final body = await _post('getidDTCfromlotNVL', {'M_LOT_NO': lot});
    if (_isNg(body)) {
      _snack('Không resolve được DTC_ID');
      return;
    }
    final data = body['data'];
    final list = (data is List ? data : const [])
        .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
        .toList();
    if (list.isEmpty) {
      _snack('Không tìm thấy DTC_ID theo LOT');
      return;
    }
    final dtcId = _s(list.first['DTC_ID']);
    if (!mounted) return;
    setState(() {
      _dtcId = dtcId;
    });
    await _checkRegisteredTests(dtcId);
  }

  Future<void> _checkRegisteredTests(String dtcId) async {
    final body = await _post('checkRegisterdDTCTEST', {'DTC_ID': dtcId});
    if (_isNg(body)) {
      _snack('Chưa có test đăng ký cho ID này');
      return;
    }
    final data = body['data'];
    final list = (data is List ? data : const [])
        .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
        .toList();
    if (!mounted) return;
    setState(() {
      // Prefer registered list (often already filtered by DTC_ID)
      _testList = list.isNotEmpty ? list : _testList;
      if (_testList.isNotEmpty) {
        _selectedTestCode = _s(_testList.first['TEST_CODE']);
      }
    });
  }

  List<PlutoColumn> _buildCols() {
    PlutoColumn c(
      String f, {
      double w = 120,
      bool editable = false,
      bool numeric = false,
    }) {
      return PlutoColumn(
        title: f,
        field: f,
        width: w,
        enableContextMenu: false,
        enableDropToResize: true,
        enableEditingMode: editable,
        type: PlutoColumnType.text(),
        renderer: (ctx) {
          final v = ctx.cell.value;
          if (numeric) {
            return Align(
              alignment: Alignment.centerRight,
              child: Text(_d(v).toString(), style: const TextStyle(fontWeight: FontWeight.w800)),
            );
          }
          return Text(_s(v));
        },
      );
    }

    return [
      PlutoColumn(title: '', field: '__raw__', type: PlutoColumnType.text(), width: 0, hide: true, enableContextMenu: false),
      c('DTC_ID', w: 90),
      c('G_CODE', w: 110),
      c('G_NAME', w: 180),
      c('M_CODE', w: 110),
      c('M_NAME', w: 160),
      c('TEST_CODE', w: 110),
      c('TEST_NAME', w: 120),
      c('POINT_CODE', w: 110),
      c('POINT_NAME', w: 120),
      c('SAMPLE_NO', w: 100, editable: true, numeric: true),
      c('CENTER_VALUE', w: 120, numeric: true),
      c('UPPER_TOR', w: 120, numeric: true),
      c('LOWER_TOR', w: 120, numeric: true),
      c('RESULT', w: 120, editable: true, numeric: true),
      c('REMARK', w: 160, editable: true),
    ];
  }

  List<PlutoRow> _buildGridRows(List<Map<String, dynamic>> list, List<PlutoColumn> cols) {
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

  Future<void> _loadSpec() async {
    final dtcId = _dtcId.trim();
    if (dtcId.isEmpty) {
      _snack('Chưa có DTC_ID');
      return;
    }
    if (_selectedTestCode.trim().isEmpty) {
      _snack('Chưa chọn TEST_CODE');
      return;
    }
    setState(() => _loading = true);
    try {
      final body = await _post('getinputdtcspec', {
        'DTC_ID': dtcId,
        'TEST_CODE': _selectedTestCode,
      });
      if (_isNg(body)) {
        setState(() {
          _rows = const [];
          _cols = const [];
          _gridRows = const [];
        });
        _snack('Không load được spec');
        return;
      }
      final data = body['data'];
      final list = (data is List ? data : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList();

      final normalized = list
          .map((e) => {
                ...e,
                'SAMPLE_NO': e['SAMPLE_NO'] ?? 1,
                'RESULT': e['RESULT'],
                'REMARK': e['REMARK'] ?? '',
              })
          .toList();

      final cols = _buildCols();
      setState(() {
        _rows = normalized;
        _cols = cols;
        _gridRows = _buildGridRows(normalized, cols);
      });
    } catch (e) {
      _snack('Lỗi: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  bool _checkInput() {
    if (_dtcId.trim().isEmpty) return false;
    if (_rows.isEmpty) return false;
    for (final r in _rows) {
      final v = r['RESULT'];
      if (_s(v).trim().isEmpty) return false;
      if (double.tryParse(_s(v).replaceAll(',', '')) == null) return false;
    }
    return true;
  }

  Future<void> _submit() async {
    if (!_checkInput()) {
      _snack('Thiếu RESULT hoặc DTC_ID');
      return;
    }
    setState(() => _loading = true);
    try {
      // collect latest grid state if user edited
      final latest = (_sm?.rows ?? const <PlutoRow>[])
          .map((r) => r.cells['__raw__']?.value)
          .whereType<Map<String, dynamic>>()
          .toList();
      final dataRows = latest.isNotEmpty ? latest : _rows;

      var err = '';
      for (final r in dataRows) {
        final body = await _post('insert_dtc_result', {
          'DTC_ID': _i(r['DTC_ID']) == 0 ? _i(_dtcId) : _i(r['DTC_ID']),
          'G_CODE': r['G_CODE'],
          'M_CODE': r['M_CODE'],
          'TEST_CODE': r['TEST_CODE'],
          'POINT_CODE': r['POINT_CODE'],
          'SAMPLE_NO': r['SAMPLE_NO'],
          'RESULT': r['RESULT'],
          'REMARK': _remarkCtrl.text.trim().isEmpty ? (r['REMARK'] ?? '') : _remarkCtrl.text.trim(),
        });
        if (_isNg(body)) {
          err += ' ${_s(body['message'])}';
          continue;
        }
        await _post('updateDTC_TEST_EMPL', {
          'DTC_ID': _i(r['DTC_ID']) == 0 ? _i(_dtcId) : _i(r['DTC_ID']),
          'TEST_CODE': _i(r['TEST_CODE']),
        });
      }

      if (err.isNotEmpty) {
        _snack('Lỗi:$err');
      } else {
        _snack('Up kết quả thành công');
        setState(() {
          _rows = const [];
          _cols = const [];
          _gridRows = const [];
        });
      }
    } catch (e) {
      _snack('Lỗi: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final title = 'NHẬP KQ ĐTC';

    return LayoutBuilder(
      builder: (context, constraints) {
        final gridHeight = constraints.maxHeight * 0.70;

        return Padding(
          padding: const EdgeInsets.all(12),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(title, style: TextStyle(color: scheme.primary, fontWeight: FontWeight.w900)),
                const SizedBox(height: 8),
                Card(
                  child: ExpansionTile(
                    initiallyExpanded: true,
                    title: const Text('Form'),
                    childrenPadding: const EdgeInsets.all(12),
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(_byLot ? 'Nhập LOT NVL (auto resolve DTC_ID)' : 'Nhập DTC_ID'),
                          ),
                          Checkbox(
                            value: _byLot,
                            onChanged: (v) {
                              setState(() {
                                _byLot = v ?? false;
                                _dtcId = '';
                                _rows = const [];
                                _cols = const [];
                                _gridRows = const [];
                                _idOrLotCtrl.text = '';
                              });
                            },
                          ),
                        ],
                      ),
                      TextField(
                        controller: _idOrLotCtrl,
                        decoration: InputDecoration(
                          labelText: _byLot ? 'LOT NVL' : 'DTC_ID',
                          helperText: _byLot ? 'Gõ đủ 10 ký tự sẽ auto resolve' : null,
                        ),
                        onChanged: (v) async {
                          final vv = v.trim();
                          if (_byLot) {
                            if (vv.length == 10) {
                              setState(() => _loading = true);
                              try {
                                await _resolveFromLot(vv);
                              } finally {
                                if (mounted) setState(() => _loading = false);
                              }
                            }
                          }
                        },
                        onSubmitted: (v) async {
                          final vv = v.trim();
                          if (vv.isEmpty) return;
                          setState(() => _loading = true);
                          try {
                            if (_byLot) {
                              await _resolveFromLot(vv);
                            } else {
                              setState(() => _dtcId = vv);
                              await _checkRegisteredTests(vv);
                            }
                          } finally {
                            if (mounted) setState(() => _loading = false);
                          }
                        },
                      ),
                      const SizedBox(height: 8),
                      if (_dtcId.isNotEmpty)
                        Text('Resolved DTC_ID: $_dtcId', style: TextStyle(color: scheme.onSurfaceVariant)),
                      const SizedBox(height: 10),
                      DropdownButtonFormField<String>(
                        key: ValueKey<String>('test_${_selectedTestCode}_$_dtcId'),
                        initialValue: _selectedTestCode.isEmpty ? null : _selectedTestCode,
                        isExpanded: true,
                        dropdownColor: scheme.surface,
                        style: TextStyle(color: scheme.onSurface),
                        iconEnabledColor: scheme.onSurface,
                        decoration: const InputDecoration(labelText: 'TEST'),
                        items: _testList
                            .map((e) => DropdownMenuItem(
                                  value: _s(e['TEST_CODE']),
                                  child: Text('${_s(e['TEST_NAME'])} (${_s(e['TEST_CODE'])})', overflow: TextOverflow.ellipsis),
                                ))
                            .toList(),
                        onChanged: (v) {
                          setState(() {
                            _selectedTestCode = v ?? '';
                          });
                        },
                      ),
                      const SizedBox(height: 10),
                      TextField(
                        controller: _remarkCtrl,
                        decoration: const InputDecoration(labelText: 'REMARK (optional override)'),
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          Expanded(
                            child: FilledButton(
                              onPressed: _loading ? null : _loadSpec,
                              child: const Text('Load Spec'),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: FilledButton(
                              onPressed: _loading ? null : _submit,
                              child: const Text('Submit'),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  height: gridHeight < 320 ? 320 : gridHeight,
                  child: _loading
                      ? const Center(child: CircularProgressIndicator())
                      : (_cols.isEmpty
                          ? Center(child: Text('Chưa có dữ liệu', style: TextStyle(color: scheme.onSurfaceVariant)))
                          : PlutoGrid(
                              columns: _cols,
                              rows: _gridRows,
                              onLoaded: (e) {
                                _sm = e.stateManager;
                                e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                                e.stateManager.setShowColumnFilter(true);
                              },
                              onChanged: (event) {
                                final raw = event.row.cells['__raw__']?.value;
                                if (raw is Map<String, dynamic>) {
                                  raw[event.column.field] = event.value;
                                }
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
