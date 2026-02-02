import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:pluto_grid/pluto_grid.dart';

import 'dart:async';

import '../../../../core/config/app_config.dart';
import '../../../../core/providers.dart';
import '../../../auth/application/auth_notifier.dart';
import '../../../auth/application/auth_state.dart';

class AddSpecDtcTab extends ConsumerStatefulWidget {
  const AddSpecDtcTab({super.key});

  @override
  ConsumerState<AddSpecDtcTab> createState() => _AddSpecDtcTabState();
}

class _AddSpecDtcTabState extends ConsumerState<AddSpecDtcTab> {
  bool _loading = false;
  bool _checkNvl = false;

  List<Map<String, dynamic>> _testList = const [];
  String _testCode = '0';

  List<Map<String, dynamic>> _addedSpec = const [];

  List<Map<String, dynamic>> _materialList = const [];
  Map<String, dynamic>? _selectedMaterial;

  List<Map<String, dynamic>> _codeList = const [];
  Map<String, dynamic>? _selectedCode;

  final _searchCodeNameCtrl = TextEditingController();

  Timer? _debounce;

  List<Map<String, dynamic>> _rows = const [];
  List<PlutoColumn> _columns = const [];
  List<PlutoRow> _gridRows = const [];
  PlutoGridStateManager? _sm;

  String _s(dynamic v) => (v ?? '').toString();
  double _d(dynamic v) {
    final raw = (v ?? '').toString().trim();
    if (raw.isEmpty) return 0.0;
    final normalized = raw.replaceAll(',', '').replaceAll(RegExp(r'[^0-9\.-]'), '');
    if (normalized.isEmpty) return 0.0;
    return double.tryParse(normalized) ?? 0.0;
  }

  List<Map<String, dynamic>> _dedupeByKey(List<Map<String, dynamic>> src, String key) {
    final seen = <String>{};
    final out = <Map<String, dynamic>>[];
    for (final e in src) {
      final v = _s(e[key]);
      if (v.isEmpty) continue;
      if (seen.add(v)) out.add(e);
    }
    return out;
  }

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

  Future<void> _ensureMaterialLoaded() async {
    if (_materialList.isNotEmpty) return;
    setState(() => _loading = true);
    try {
      await _loadMaterialList();
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<Map<String, dynamic>?> _showSearchPickDialog({
    required String title,
    required String hint,
    required Future<List<Map<String, dynamic>>> Function(String q) onSearch,
    required String Function(Map<String, dynamic> e) itemTitle,
    required String Function(Map<String, dynamic> e) itemSubtitle,
  }) async {
    return showDialog<Map<String, dynamic>>(
      context: context,
      builder: (ctx) {
        return _SearchPickDialog(
          title: title,
          hint: hint,
          onSearch: onSearch,
          itemTitle: itemTitle,
          itemSubtitle: itemSubtitle,
        );
      },
    );
  }

  void _initFromUser() {
    final auth = ref.read(authNotifierProvider);
    if (auth is AuthAuthenticated) {
      final u = auth.session.user;
      _checkNvl = (u.subDeptName ?? '').toUpperCase() == 'IQC';
    }
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _searchCodeNameCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadInit() async {
    setState(() => _loading = true);
    try {
      await Future.wait([
        _loadTestList(),
      ]);

      setState(() => _loading = false);
    } catch (e) {
      setState(() => _loading = false);
      _snack('Lỗi: $e');
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
      _testList = _dedupeByKey(
        [
          {'TEST_CODE': 0, 'TEST_NAME': 'ALL'},
          ...list,
        ],
        'TEST_CODE',
      );
    });
  }

  Future<void> _loadMaterialList() async {
    final body = await _post('getMaterialList', {});
    if (_isNg(body)) return;
    final data = body['data'];
    final list = (data is List ? data : const [])
        .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
        .toList();
    if (!mounted) return;
    setState(() {
      _materialList = _dedupeByKey(list, 'M_CODE');
      final sel = _s(_selectedMaterial?['M_CODE']);
      if (_materialList.isEmpty) {
        _selectedMaterial = null;
      } else if (sel.isNotEmpty && _materialList.any((e) => _s(e['M_CODE']) == sel)) {
        _selectedMaterial = _materialList.firstWhere((e) => _s(e['M_CODE']) == sel);
      } else {
        _selectedMaterial = _materialList.first;
      }
    });
  }

  Future<void> _loadCodeList(String gName) async {
    final body = await _post('selectcodeList', {'G_NAME': gName});
    if (_isNg(body)) return;
    final data = body['data'];
    final list = (data is List ? data : const [])
        .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
        .toList();
    if (!mounted) return;
    setState(() {
      _codeList = _dedupeByKey(list, 'G_CODE');
      final sel = _s(_selectedCode?['G_CODE']);
      if (_codeList.isEmpty) {
        _selectedCode = null;
      } else if (sel.isNotEmpty && _codeList.any((e) => _s(e['G_CODE']) == sel)) {
        _selectedCode = _codeList.firstWhere((e) => _s(e['G_CODE']) == sel);
      } else {
        _selectedCode = _codeList.first;
      }
    });
  }

  List<PlutoColumn> _buildColumns() {
    PlutoColumn c(String f, {double width = 120, bool editable = false, bool numeric = false}) {
      return PlutoColumn(
        title: f,
        field: f,
        type: PlutoColumnType.text(),
        width: width,
        enableContextMenu: false,
        enableDropToResize: true,
        enableEditingMode: editable,
        renderer: (ctx) {
          final v = ctx.cell.value;
          if (numeric) {
            final val = _d(v);
            return Align(
              alignment: Alignment.centerRight,
              child: Text(NumberFormat.decimalPattern().format(val), style: const TextStyle(fontWeight: FontWeight.w800)),
            );
          }
          if (f == 'TEST_NAME' || f == 'POINT_NAME' || f == 'M_NAME' || f == 'G_NAME') {
            return Text(_s(v), style: const TextStyle(fontWeight: FontWeight.w800));
          }
          return Text(_s(v));
        },
      );
    }

    return [
      PlutoColumn(title: '', field: '__raw__', type: PlutoColumnType.text(), width: 0, hide: true, enableContextMenu: false),
      c('CUST_NAME_KD', width: 140),
      c('G_CODE', width: 110),
      c('G_NAME', width: 200),
      c('M_CODE', width: 120),
      c('M_NAME', width: 160),
      c('WIDTH_CD', width: 110, numeric: true),
      c('TEST_CODE', width: 100),
      c('TEST_NAME', width: 130),
      c('POINT_CODE', width: 110),
      c('POINT_NAME', width: 140),
      c('PRI', width: 90, editable: true, numeric: true),
      c('CENTER_VALUE', width: 120, editable: true, numeric: true),
      c('LOWER_TOR', width: 110, editable: true, numeric: true),
      c('UPPER_TOR', width: 110, editable: true, numeric: true),
      c('BARCODE_CONTENT', width: 160, editable: true),
      c('REMARK', width: 160, editable: true),
      c('TDS', width: 120, editable: true),
      c('BANVE', width: 120, editable: true),
    ];
  }

  List<PlutoRow> _buildRows(List<Map<String, dynamic>> list, List<PlutoColumn> cols) {
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
    if (_testCode == '0') {
      _snack('Hãy chọn một hạng mục test bất kỳ');
      return;
    }

    final gCode = _checkNvl ? '7A07540A' : _s(_selectedCode?['G_CODE']);
    final mCode = _checkNvl ? _s(_selectedMaterial?['M_CODE']) : 'B0000035';

    setState(() => _loading = true);
    try {
      var body = await _post('checkSpecDTC', {
        'checkNVL': _checkNvl,
        'FROM_DATE': '',
        'TO_DATE': '',
        'G_CODE': _checkNvl ? '' : gCode,
        'G_NAME': '',
        'M_NAME': '',
        'M_CODE': _checkNvl ? mCode : '',
        'TEST_NAME': _testCode,
        'PROD_REQUEST_NO': '',
        'TEST_TYPE': '0',
        'ID': '',
      });

      if (_isNg(body)) {
        body = await _post('checkSpecDTC2', {
          'checkNVL': _checkNvl,
          'FROM_DATE': '',
          'TO_DATE': '',
          'G_CODE': _checkNvl ? '' : gCode,
          'G_NAME': '',
          'M_NAME': '',
          'M_CODE': _checkNvl ? mCode : '',
          'TEST_NAME': _testCode,
          'PROD_REQUEST_NO': '',
          'TEST_TYPE': '0',
          'ID': '',
        });
      }

      if (_isNg(body)) {
        setState(() {
          _rows = const [];
          _columns = const [];
          _gridRows = const [];
          _loading = false;
        });
        _snack('Không load được spec');
        return;
      }

      final data = body['data'];
      var list = (data is List ? data : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList();

      if (_checkNvl && _testCode == '1' && list.isNotEmpty) {
        list = [list.first];
      }

      final cols = _buildColumns();
      final rws = _buildRows(list, cols);

      setState(() {
        _rows = list;
        _columns = cols;
        _gridRows = rws;
        _loading = false;
      });

      await _checkAddedSpec();
      _snack('Đã load ${list.length} dòng');
    } catch (e) {
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Future<void> _checkAddedSpec() async {
    final gCode = _checkNvl ? '7A07540A' : _s(_selectedCode?['G_CODE']);
    final mCode = _checkNvl ? _s(_selectedMaterial?['M_CODE']) : 'B0000035';

    try {
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
    } catch (_) {}
  }

  Future<void> _insertOrUpdate({required bool update}) async {
    if (_testCode == '0') {
      _snack('Hãy chọn một hạng mục test bất kỳ');
      return;
    }
    if (_rows.isEmpty) {
      _snack('Không có dữ liệu để thao tác');
      return;
    }

    final state = _sm;
    final selected = (state?.currentSelectingRows ?? const <PlutoRow>[])
        .map((r) => r.cells['__raw__']?.value)
        .whereType<Map<String, dynamic>>()
        .toList();

    final targetRows = update ? selected : _rows;
    if (update && targetRows.isEmpty) {
      _snack('Chọn ít nhất một dòng để update');
      return;
    }

    setState(() => _loading = true);

    try {
      final cmd = update ? 'updateSpecDTC' : 'insertSpecDTC';

      if (!_checkNvl) {
        final gCode = _s(_selectedCode?['G_CODE']);
        var err = '';
        for (final r in targetRows) {
          final body = await _post(cmd, {
            'checkNVL': _checkNvl,
            'G_CODE': gCode,
            'M_CODE': 'B0000035',
            'TEST_CODE': _testCode,
            'POINT_CODE': r['POINT_CODE'],
            'PRI': r['PRI'],
            'CENTER_VALUE': r['CENTER_VALUE'],
            'UPPER_TOR': r['UPPER_TOR'],
            'LOWER_TOR': r['LOWER_TOR'],
            'BARCODE_CONTENT': r['BARCODE_CONTENT'] ?? '',
            'REMARK': r['REMARK'] ?? '',
          });
          if (_isNg(body)) {
            err += ' ${_s(r['POINT_CODE'])}:${_s(body['message'])}';
          }
        }
        setState(() => _loading = false);
        await _checkAddedSpec();
        if (err.isNotEmpty) {
          _snack('Có lỗi:$err');
        } else {
          _snack(update ? 'Update SPEC thành công' : 'Add SPEC thành công');
        }
        return;
      }

      // NVL: apply to all M_CODE with same M_NAME
      final selectedName = _s(_selectedMaterial?['M_NAME']);
      final sameNameList = _materialList.where((e) => _s(e['M_NAME']) == selectedName).toList();
      var err = '';

      for (final m in sameNameList) {
        final mCode = _s(m['M_CODE']);
        final widthCd = _d(m['WIDTH_CD']);
        for (final r in targetRows) {
          final centerValue = (_testCode == '1') ? widthCd : _d(r['CENTER_VALUE']);
          final body = await _post(cmd, {
            'checkNVL': _checkNvl,
            'G_CODE': '7A07540A',
            'M_CODE': mCode,
            'TEST_CODE': _testCode,
            'POINT_CODE': r['POINT_CODE'],
            'PRI': r['PRI'],
            'CENTER_VALUE': centerValue,
            'UPPER_TOR': r['UPPER_TOR'],
            'LOWER_TOR': r['LOWER_TOR'],
            'BARCODE_CONTENT': r['BARCODE_CONTENT'] ?? '',
            'REMARK': r['REMARK'] ?? '',
          });
          if (_isNg(body)) {
            err += ' $mCode:${_s(r['POINT_CODE'])}:${_s(body['message'])}';
          }
        }
      }

      setState(() => _loading = false);
      await _checkAddedSpec();
      if (err.isNotEmpty) {
        _snack('Có lỗi:$err');
      } else {
        _snack(update ? 'Update SPEC thành công' : 'Add SPEC thành công');
      }
    } catch (e) {
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Future<void> _copyXrfSpec({required bool sdi}) async {
    if (AppConfig.company != 'CMS') return;
    if (_testCode != '3') {
      _snack('Chỉ dùng cho test XRF');
      return;
    }

    final cmd = sdi ? 'copyXRFSpecSDI' : 'copyXRFSpec';

    setState(() => _loading = true);
    try {
      if (!_checkNvl) {
        final gCode = _s(_selectedCode?['G_CODE']);
        final body = await _post(cmd, {
          'M_CODE': 'B0000035',
          'G_CODE': gCode,
        });
        setState(() => _loading = false);
        if (_isNg(body)) {
          _snack('Lỗi: ${_s(body['message'])}');
        } else {
          _snack('Copy XRF Spec thành công');
        }
        return;
      }

      final selectedName = _s(_selectedMaterial?['M_NAME']);
      final sameNameList = _materialList.where((e) => _s(e['M_NAME']) == selectedName).toList();
      var err = '';
      for (final m in sameNameList) {
        final body = await _post(cmd, {
          'M_CODE': _s(m['M_CODE']),
          'G_CODE': '7A07540A',
        });
        if (_isNg(body)) err += ' ${_s(m['M_CODE'])}:${_s(body['message'])}';
      }
      setState(() => _loading = false);
      if (err.isNotEmpty) {
        _snack('Có lỗi:$err');
      } else {
        _snack('Copy XRF Spec thành công');
      }
    } catch (e) {
      setState(() => _loading = false);
      _snack('Lỗi: $e');
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
                (_d(e['CHECKADDED']) != 0) ? 'YES' : 'NO',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w900,
                  color: (_d(e['CHECKADDED']) != 0) ? Colors.blue : Colors.red,
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
    final title = _checkNvl ? 'ADD SPEC ĐTC NVL (IQC)' : 'ADD SPEC ĐTC SẢN PHẨM (RND)';

    return LayoutBuilder(
      builder: (context, constraints) {
        final gridHeight = constraints.maxHeight * 0.70;

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
                          _rows = const [];
                          _gridRows = const [];
                          _columns = const [];
                        });
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Card(
                  child: ExpansionTile(
                    initiallyExpanded: false,
                    title: const Text('Form / Filters'),
                    childrenPadding: const EdgeInsets.all(12),
                    children: [
                      if (!_checkNvl)
                        Row(
                          children: [
                            Expanded(
                              child: OutlinedButton.icon(
                                onPressed: _loading
                                    ? null
                                    : () async {
                                        final picked = await _showSearchPickDialog(
                                          title: 'Chọn Code/Sản phẩm',
                                          hint: 'Nhập G_NAME...',
                                          onSearch: (q) async {
                                            if (q.isEmpty) return const [];
                                            await _loadCodeList(q);
                                            return _codeList;
                                          },
                                          itemTitle: (e) => '${_s(e['G_CODE'])} - ${_s(e['G_NAME'])}',
                                          itemSubtitle: (e) => _s(e['CUST_NAME_KD']),
                                        );
                                        if (picked == null) return;
                                        if (!mounted) return;
                                        setState(() {
                                          _selectedCode = picked;
                                        });
                                      },
                                icon: const Icon(Icons.search),
                                label: Text(
                                  _selectedCode == null
                                      ? 'Chọn Code'
                                      : '${_s(_selectedCode?['G_CODE'])}: ${_s(_selectedCode?['G_NAME'])}',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            IconButton(
                              onPressed: _selectedCode == null
                                  ? null
                                  : () => setState(() {
                                        _selectedCode = null;
                                      }),
                              icon: const Icon(Icons.clear),
                            ),
                          ],
                        )
                      else
                        Row(
                          children: [
                            Expanded(
                              child: OutlinedButton.icon(
                                onPressed: _loading
                                    ? null
                                    : () async {
                                        await _ensureMaterialLoaded();
                                        if (!mounted) return;
                                        final picked = await _showSearchPickDialog(
                                          title: 'Chọn NVL',
                                          hint: 'Nhập M_NAME / M_CODE...',
                                          onSearch: (q) async {
                                            final qq = q.toUpperCase();
                                            if (qq.isEmpty) return const [];
                                            return _materialList
                                                .where((e) {
                                                  final name = _s(e['M_NAME']).toUpperCase();
                                                  final code = _s(e['M_CODE']).toUpperCase();
                                                  return name.contains(qq) || code.contains(qq);
                                                })
                                                .take(200)
                                                .toList();
                                          },
                                          itemTitle: (e) => '${_s(e['M_NAME'])} | ${_s(e['WIDTH_CD'])}',
                                          itemSubtitle: (e) => _s(e['M_CODE']),
                                        );
                                        if (picked == null) return;
                                        if (!mounted) return;
                                        setState(() {
                                          _selectedMaterial = picked;
                                        });
                                      },
                                icon: const Icon(Icons.search),
                                label: Text(
                                  _selectedMaterial == null
                                      ? 'Chọn NVL'
                                      : '${_s(_selectedMaterial?['M_NAME'])}|${_s(_selectedMaterial?['WIDTH_CD'])}|${_s(_selectedMaterial?['M_CODE'])}',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            IconButton(
                              onPressed: _selectedMaterial == null
                                  ? null
                                  : () => setState(() {
                                        _selectedMaterial = null;
                                      }),
                              icon: const Icon(Icons.clear),
                            ),
                          ],
                        ),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        key: ValueKey<String>('test_$_testCode'),
                        initialValue: _testCode,
                        isExpanded: true,
                        dropdownColor: scheme.surface,
                        style: TextStyle(color: scheme.onSurface),
                        iconEnabledColor: scheme.onSurface,
                        decoration: const InputDecoration(labelText: 'Hạng mục test'),
                        items: _testList
                            .map((e) => DropdownMenuItem(
                                  value: _s(e['TEST_CODE']),
                                  child: Text('${_s(e['TEST_NAME'])} (${_s(e['TEST_CODE'])})', overflow: TextOverflow.ellipsis),
                                ))
                            .toList(),
                        onChanged: (v) {
                          setState(() => _testCode = v ?? '0');
                        },
                      ),
                      const SizedBox(height: 12),
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
                              onPressed: _loading ? null : () => _insertOrUpdate(update: false),
                              child: const Text('Add Spec'),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: FilledButton(
                              onPressed: _loading ? null : () => _insertOrUpdate(update: true),
                              child: const Text('Update Spec'),
                            ),
                          ),
                        ],
                      ),
                      if (AppConfig.company == 'CMS') ...[
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            Expanded(
                              child: FilledButton(
                                onPressed: _loading ? null : () => _copyXrfSpec(sdi: false),
                                child: const Text('Copy XRF Spec SS'),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: FilledButton(
                                onPressed: _loading ? null : () => _copyXrfSpec(sdi: true),
                                child: const Text('Copy XRF Spec SDI'),
                              ),
                            ),
                          ],
                        ),
                      ],
                      const SizedBox(height: 10),
                      _addedSpecChips(),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  height: gridHeight < 320 ? 320 : gridHeight,
                  child: _loading
                      ? const Center(child: CircularProgressIndicator())
                      : (_columns.isEmpty
                          ? Center(child: Text('Chưa có dữ liệu', style: TextStyle(color: scheme.onSurfaceVariant)))
                          : PlutoGrid(
                              columns: _columns,
                              rows: _gridRows,
                              onLoaded: (e) {
                                _sm = e.stateManager;
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

class _SearchPickDialog extends StatefulWidget {
  const _SearchPickDialog({
    required this.title,
    required this.hint,
    required this.onSearch,
    required this.itemTitle,
    required this.itemSubtitle,
  });

  final String title;
  final String hint;
  final Future<List<Map<String, dynamic>>> Function(String q) onSearch;
  final String Function(Map<String, dynamic> e) itemTitle;
  final String Function(Map<String, dynamic> e) itemSubtitle;

  @override
  State<_SearchPickDialog> createState() => _SearchPickDialogState();
}

class _SearchPickDialogState extends State<_SearchPickDialog> {
  final TextEditingController _ctrl = TextEditingController();
  Timer? _t;
  bool _loading = false;
  List<Map<String, dynamic>> _results = const [];

  @override
  void dispose() {
    _t?.cancel();
    _ctrl.dispose();
    super.dispose();
  }

  Future<void> _run(String q) async {
    if (!mounted) return;
    setState(() => _loading = true);
    try {
      final r = await widget.onSearch(q);
      if (!mounted) return;
      setState(() => _results = r);
    } catch (_) {
      if (!mounted) return;
      setState(() => _results = const []);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return AlertDialog(
      title: Text(widget.title),
      content: SizedBox(
        width: double.maxFinite,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _ctrl,
              decoration: InputDecoration(
                labelText: widget.hint,
                suffixIcon: _loading
                    ? Padding(
                        padding: const EdgeInsets.all(12),
                        child: SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2, color: scheme.primary),
                        ),
                      )
                    : IconButton(
                        onPressed: () => _run(_ctrl.text.trim()),
                        icon: const Icon(Icons.search),
                      ),
              ),
              onChanged: (v) {
                _t?.cancel();
                _t = Timer(const Duration(milliseconds: 350), () {
                  _run(v.trim());
                });
              },
              onSubmitted: (v) => _run(v.trim()),
            ),
            const SizedBox(height: 12),
            Flexible(
              child: _results.isEmpty
                  ? Text('Nhập từ khóa để tìm', style: TextStyle(color: scheme.onSurfaceVariant))
                  : ListView.builder(
                      shrinkWrap: true,
                      itemCount: _results.length,
                      itemBuilder: (ctx, i) {
                        final e = _results[i];
                        return ListTile(
                          dense: true,
                          title: Text(widget.itemTitle(e), maxLines: 1, overflow: TextOverflow.ellipsis),
                          subtitle: Text(widget.itemSubtitle(e), maxLines: 1, overflow: TextOverflow.ellipsis),
                          onTap: () => Navigator.of(context).pop(e),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(onPressed: () => Navigator.of(context).pop(), child: const Text('Đóng')),
      ],
    );
  }
}
