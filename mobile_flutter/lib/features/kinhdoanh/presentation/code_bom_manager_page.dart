import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pluto_grid/pluto_grid.dart';

import '../../../app/app_drawer.dart';
import '../../../core/config/app_config.dart';
import '../../../core/providers.dart';
import '../../auth/application/auth_notifier.dart';
import '../../auth/application/auth_state.dart';

class CodeBomManagerPage extends ConsumerStatefulWidget {
  const CodeBomManagerPage({super.key, this.initialGCode});

  final String? initialGCode;

  @override
  ConsumerState<CodeBomManagerPage> createState() => _CodeBomManagerPageState();
}

class _CodeBomManagerPageState extends ConsumerState<CodeBomManagerPage> {
  final _gCodeCtrl = TextEditingController();

  bool _loading = false;

  Map<String, dynamic>? _selectedCode;
  Map<String, dynamic>? _codeFullInfo;

  List<Map<String, dynamic>> _bomSx = const [];
  List<Map<String, dynamic>> _bomGia = const [];

  List<Map<String, dynamic>> _materialList = const [];

  List<Map<String, dynamic>> _machineList = const [];
  List<Map<String, dynamic>> _fscList = const [];

  List<PlutoColumn> _bomSxCols = const [];
  List<PlutoRow> _bomSxRows = const [];

  List<PlutoColumn> _bomGiaCols = const [];
  List<PlutoRow> _bomGiaRows = const [];

  @override
  void dispose() {
    _gCodeCtrl.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    final g = (widget.initialGCode ?? '').trim();
    if (g.isNotEmpty) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _selectCode({'G_CODE': g});
      });
    }
  }

  String _emplNo() {
    final s = ref.read(authNotifierProvider);
    if (s is AuthAuthenticated) return s.session.user.emplNo;
    return '';
  }

  Future<Map<String, dynamic>> _post(String command, Map<String, dynamic> data) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(command, data: data);
    final body = res.data;
    if (body is Map<String, dynamic>) return body;
    return <String, dynamic>{'tk_status': 'NG', 'message': 'Bad response'};
  }

  bool _isNg(Map<String, dynamic> body) {
    return (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';
  }

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  String _company() => AppConfig.company;

  Future<void> _ensureMachineListLoaded() async {
    if (_machineList.isNotEmpty) return;
    try {
      final res = await _post('getmachinelist', {});
      if (_isNg(res)) return;
      final data = res['data'];
      final list = (data is List ? data : const [])
          .whereType<Map>()
          .map((e) => e.map((k, v) => MapEntry(k.toString(), v)))
          .toList();
      list.addAll([
        {'EQ_NAME': 'NO'},
        {'EQ_NAME': 'NA'},
        {'EQ_NAME': 'ALL'},
      ]);
      list.sort((a, b) => _s(a['EQ_NAME']).compareTo(_s(b['EQ_NAME'])));
      if (!mounted) return;
      setState(() => _machineList = list);
    } catch (_) {}
  }

  Future<void> _ensureFscListLoaded() async {
    if (_fscList.isNotEmpty) return;
    try {
      final res = await _post('getFSCList', {});
      if (_isNg(res)) return;
      final data = res['data'];
      final list = (data is List ? data : const [])
          .whereType<Map>()
          .map((e) => e.map((k, v) => MapEntry(k.toString(), v)))
          .toList();
      if (!mounted) return;
      setState(() => _fscList = list);
    } catch (_) {}
  }

  String _zeroPad(int num, int places) => num.toString().padLeft(places, '0');

  String _code27FromProdType(String prodType) {
    final v = prodType.trim().toUpperCase();
    if (v == 'TSP' || v == 'OLED' || v == 'UV') return 'C';
    if (v == 'LABEL') return 'A';
    if (v == 'TAPE') return 'B';
    if (v == 'RIBBON') return 'E';
    return 'C';
  }

  Future<({String nextGCode, String nextSeqNo})> _getNextGCode({
    required String code12,
    required String code27,
  }) async {
    String nextSeq;
    String nextSeqNo;
    try {
      final res = await _post('getNextSEQ_G_CODE', {
        'CODE_12': code12,
        'CODE_27': code27,
      });

      if (!_isNg(res)) {
        final data = res['data'];
        final last = (data is List && data.isNotEmpty && data.first is Map)
            ? Map<String, dynamic>.from(data.first as Map)
            : <String, dynamic>{};
        final lastSeq = _s(last['LAST_SEQ_NO']).trim();
        final current = int.tryParse(lastSeq) ?? 0;
        if (code12 == '9') {
          nextSeq = _zeroPad(current + 1, 6);
          nextSeqNo = nextSeq;
        } else {
          nextSeq = '${_zeroPad(current + 1, 5)}A';
          nextSeqNo = _zeroPad(current + 1, 5);
        }
      } else {
        if (code12 == '9') {
          nextSeq = '000001';
          nextSeqNo = nextSeq;
        } else {
          nextSeq = '00001A';
          nextSeqNo = '00001';
        }
      }
    } catch (_) {
      if (code12 == '9') {
        nextSeq = '000001';
        nextSeqNo = nextSeq;
      } else {
        nextSeq = '00001A';
        nextSeqNo = '00001';
      }
    }

    return (nextGCode: '$code12$code27$nextSeq', nextSeqNo: nextSeqNo);
  }

  Future<bool> _checkGNameKdExist(String gNameKd) async {
    if (gNameKd.trim().isEmpty) return false;
    try {
      final res = await _post('checkGNAMEKDExist', {
        'G_NAME_KD': gNameKd.trim(),
      });
      return !_isNg(res);
    } catch (_) {
      return false;
    }
  }

  List<String> _prioritizedCodeInfoFields(Map<String, dynamic> info) {
    final keys = info.keys.toSet();
    final preferred = <String>[
      'G_CODE',
      'G_NAME_KD',
      'G_NAME',
      'DESCR',
      'CUST_CD',
      'CUST_NAME',
      'CODE_12',
      'PROD_TYPE',
      'USE_YN',
      'PROD_PROJECT',
      'PROD_MODEL',
      'PROD_MAIN_MATERIAL',
      'G_LENGTH',
      'G_WIDTH',
      'PD',
      'G_C',
      'G_C_R',
      'G_CG',
      'G_LG',
      'G_SG_L',
      'G_SG_R',
      'PACK_DRT',
      'KNIFE_TYPE',
      'KNIFE_LIFECYCLE',
      'KNIFE_PRICE',
      'CODE_33',
      'PROD_DVT',
      'ROLE_EA_QTY',
      'RPM',
      'PIN_DISTANCE',
      'PROCESS_TYPE',
      'EQ1',
      'EQ2',
      'EQ3',
      'EQ4',
      'PROD_DIECUT_STEP',
      'PROD_PRINT_TIMES',
      'PO_TYPE',
      'FSC',
      'FSC_CODE',
      'QL_HSD',
      'EXP_DATE',
      'BANVE',
      'PDBV',
      'APPSHEET',
      'NO_INSPECTION',
      'APPROVED_YN',
      'REMK',
      'NOTE',
      'UPD_DATE',
      'UPD_EMPL',
      'UPD_COUNT',
      'UPDATE_REASON',
    ];

    final out = <String>[];
    for (final f in preferred) {
      if (keys.contains(f)) out.add(f);
    }
    final remain = keys.difference(out.toSet()).toList()..sort();
    out.addAll(remain);
    return out;
  }

  Widget _kv(String k, String v) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 150,
            child: Text(
              k,
              style: const TextStyle(fontWeight: FontWeight.w800),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: SelectableText(v),
          ),
        ],
      ),
    );
  }

  Future<void> _ensureMaterialListLoaded() async {
    if (_materialList.isNotEmpty) return;
    try {
      final res = await _post('getMaterialList', {});
      if (_isNg(res)) return;
      final data = res['data'];
      final list = (data is List ? data : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList();
      if (!mounted) return;
      setState(() {
        _materialList = list;
      });
    } catch (_) {}
  }

  Future<Map<String, dynamic>?> _pickMaterial() async {
    await _ensureMaterialListLoaded();
    if (!mounted) return null;

    final filterCtrl = TextEditingController(text: '');
    return showDialog<Map<String, dynamic>>(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx2, setLocal) {
            final q = filterCtrl.text.trim().toLowerCase();
            final list = q.isEmpty
                ? _materialList
                : _materialList.where((e) {
                    final name = _s(e['M_NAME']).toLowerCase();
                    final code = _s(e['M_CODE']).toLowerCase();
                    return name.contains(q) || code.contains(q);
                  }).toList();

            return AlertDialog(
              title: const Text('Chọn Material'),
              content: SizedBox(
                width: 520,
                height: 520,
                child: Column(
                  children: [
                    TextField(
                      controller: filterCtrl,
                      decoration: const InputDecoration(labelText: 'Filter (M_NAME / M_CODE)'),
                      onChanged: (_) => setLocal(() {}),
                    ),
                    const SizedBox(height: 8),
                    Expanded(
                      child: ListView.builder(
                        itemCount: list.length,
                        itemBuilder: (c, i) {
                          final it = list[i];
                          final title = _s(it['M_NAME']).isEmpty ? _s(it['M_CODE']) : _s(it['M_NAME']);
                          final sub = '${_s(it['M_CODE'])}  |  WIDTH: ${_s(it['WIDTH_CD'])}';
                          return ListTile(
                            dense: true,
                            title: Text(title, maxLines: 1, overflow: TextOverflow.ellipsis),
                            subtitle: Text(sub, maxLines: 1, overflow: TextOverflow.ellipsis),
                            onTap: () => Navigator.pop(ctx2, it),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(onPressed: () => Navigator.pop(ctx2), child: const Text('Đóng')),
              ],
            );
          },
        );
      },
    );
  }

  Future<bool> _canEditBomByMassRule(String gCode) async {
    if (_company() != 'CMS') return true;
    try {
      final res = await _post('checkMassG_CODE', {'G_CODE': gCode});
      if (_isNg(res)) return true;
      final data = res['data'];
      if (data is List && data.isNotEmpty && data.first is Map) {
        final row = Map<String, dynamic>.from(data.first as Map);
        final prodReq = int.tryParse(_s(row['PROD_REQUEST_DATE']).trim());
        final isNewCode = (prodReq == null || prodReq <= 20250112) || _emplNo() == 'NHU1903';
        return isNewCode;
      }
      return true;
    } catch (_) {
      return true;
    }
  }

  Future<void> _editCodeFullInfo() async {
    final current = _codeFullInfo;
    final temp = current == null
        ? <String, dynamic>{
            'CODE_12': '6',
            'PROD_TYPE': 'TSP',
            'USE_YN': 'Y',
            'G_CODE': '',
          }
        : Map<String, dynamic>.from(current);

    await _ensureMachineListLoaded();
    await _ensureFscListLoaded();
    if (!mounted) return;

    final code12Options = const <String, String>{
      '6': 'Bán Thành Phẩm',
      '7': 'Thành Phẩm',
      '8': 'Nguyên Chiếc Không Ribbon',
      '9': 'Nguyên Chiếc Ribbon',
    };
    final prodTypeOptions = const <String>['TSP', 'OLED', 'UV', 'TAPE', 'LABEL', 'RIBBON', 'SPT'];
    final packDrtOptions = const <String, String>{
      '1': 'Hàng ở mặt ngoài',
      '0': 'Hàng ở mặt trong',
    };
    final knifeTypeOptions = const <int, String>{
      0: 'PVC',
      1: 'PINACLE',
      2: 'NO',
    };
    final code33Options = const <String, String>{
      '02': 'ROLL',
      '03': 'SHEET',
    };
    final prodDvtOptions = const <String, String>{
      '01': 'EA',
      '02': 'Met',
      '03': 'Cuộn',
      '04': 'Bộ',
      '05': 'Gói',
      '06': 'Kg',
      '99': 'X',
    };
    final poTypeOptions = const <String>['E1', 'E2'];
    final ynOptions = const <String, String>{'Y': 'YES', 'N': 'NO'};
    final expDateOptions = const <String, String>{
      '0': 'Chưa nhập HSD',
      '6': '6 tháng',
      '12': '12 tháng',
      '18': '18 tháng',
      '24': '24 tháng',
    };

    final stringFields = <String>[
      'CODE_12',
      'PROD_TYPE',
      'G_NAME_KD',
      'G_NAME',
      'DESCR',
      'CUST_CD',
      'CUST_NAME',
      'USE_YN',
      'PROD_PROJECT',
      'PROD_MODEL',
      'PROD_MAIN_MATERIAL',
      'PACK_DRT',
      'PROCESS_TYPE',
      'EQ1',
      'EQ2',
      'EQ3',
      'EQ4',
      'PO_TYPE',
      'FSC',
      'FSC_CODE',
      'QL_HSD',
      'EXP_DATE',
      'APPROVED_YN',
      'NO_INSPECTION',
      'REMK',
      'NOTE',
      'CODE_33',
      'PROD_DVT',
    ];
    final numberFields = <String>[
      'G_LENGTH',
      'G_WIDTH',
      'PD',
      'G_C',
      'G_C_R',
      'G_CG',
      'G_LG',
      'G_SG_L',
      'G_SG_R',
      'KNIFE_TYPE',
      'KNIFE_LIFECYCLE',
      'KNIFE_PRICE',
      'ROLE_EA_QTY',
      'RPM',
      'PIN_DISTANCE',
      'PROD_DIECUT_STEP',
      'PROD_PRINT_TIMES',
    ];

    final ctrls = <String, TextEditingController>{
      for (final f in stringFields)
        f: TextEditingController(text: f == 'USE_YN' ? (_s(temp[f]).isEmpty ? 'Y' : _s(temp[f])) : _s(temp[f])),
      for (final f in numberFields) f: TextEditingController(text: _s(temp[f])),
    };

    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx2, setLocal) {
            final scheme = Theme.of(ctx2).colorScheme;
            final fillColor = scheme.surfaceContainerHighest;
            const fieldPad = EdgeInsets.only(bottom: 12);
            const contentPad = EdgeInsets.symmetric(horizontal: 12, vertical: 12);

            Widget field(Widget child) => Padding(padding: fieldPad, child: child);

            InputDecoration dec(String label) => InputDecoration(
                  labelText: label,
                  filled: true,
                  fillColor: fillColor,
                  contentPadding: contentPad,
                );

            String vStr(String key, {required String fallback}) {
              final v = (ctrls[key]?.text ?? '').trim();
              return v.isEmpty ? fallback : v;
            }

            int vInt(String key, {required int fallback}) {
              final v = (ctrls[key]?.text ?? '').trim();
              return int.tryParse(v) ?? fallback;
            }

            DropdownButtonFormField<String> ddStr({
              required String key,
              required String label,
              required List<DropdownMenuItem<String>> items,
              required String fallback,
              bool enabled = true,
              void Function(String)? onChanged,
            }) {
              final seen = <String>{};
              final dedupItems = <DropdownMenuItem<String>>[
                for (final it in items)
                  if (it.value != null && seen.add(it.value!))
                    DropdownMenuItem<String>(
                      value: it.value,
                      enabled: it.enabled,
                      alignment: it.alignment,
                      onTap: it.onTap,
                      child: it.child,
                    ),
              ];

              final wanted = vStr(key, fallback: fallback);
              final hasExactlyOne = dedupItems.where((it) => it.value == wanted).length == 1;

              return DropdownButtonFormField<String>(
                initialValue: hasExactlyOne ? wanted : null,
                items: dedupItems,
                style: TextStyle(color: scheme.onSurface),
                dropdownColor: scheme.surface,
                iconEnabledColor: scheme.onSurface,
                onChanged: !enabled
                    ? null
                    : (nv) {
                        final v = (nv ?? '').toString();
                        ctrls[key]?.text = v;
                        onChanged?.call(v);
                        setLocal(() {});
                      },
                decoration: dec(label),
              );
            }

            DropdownButtonFormField<int> ddInt({
              required String key,
              required String label,
              required List<DropdownMenuItem<int>> items,
              required int fallback,
            }) {
              return DropdownButtonFormField<int>(
                initialValue: vInt(key, fallback: fallback),
                items: items,
                style: TextStyle(color: scheme.onSurface),
                dropdownColor: scheme.surface,
                iconEnabledColor: scheme.onSurface,
                onChanged: (nv) {
                  final v = nv ?? fallback;
                  ctrls[key]?.text = v.toString();
                  setLocal(() {});
                },
                decoration: dec(label),
              );
            }

            Widget tf(String key, String label,
                {TextInputType? keyboardType, int maxLines = 1}) {
              return TextField(
                controller: ctrls[key],
                decoration: dec(label),
                keyboardType: keyboardType,
                maxLines: maxLines,
              );
            }

            return AlertDialog(
              title: const Text('Sửa CODE_FULL_INFO'),
              content: SizedBox(
                width: 520,
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      field(
                        ddStr(
                          key: 'CODE_12',
                          label: 'Đặc tính sản phẩm (CODE_12)',
                          fallback: '7',
                          items: [
                            for (final e in code12Options.entries)
                              DropdownMenuItem(value: e.key, child: Text(e.value)),
                          ],
                        ),
                      ),
                      field(
                        ddStr(
                          key: 'PROD_TYPE',
                          label: 'Phân loại sản phẩm (PROD_TYPE)',
                          fallback: _company() == 'CMS' ? 'TSP' : 'LABEL',
                          items: [
                            for (final v in prodTypeOptions)
                              DropdownMenuItem(value: v, child: Text(v)),
                          ],
                        ),
                      ),
                      field(tf('G_NAME_KD', 'G_NAME_KD')),
                      field(tf('G_NAME', 'G_NAME')),
                      field(tf('DESCR', 'DESCR')),
                      field(tf('CUST_CD', 'CUST_CD')),
                      field(tf('CUST_NAME', 'CUST_NAME')),
                      field(
                        ddStr(
                          key: 'USE_YN',
                          label: 'Mở/Khóa (USE_YN)',
                          fallback: 'Y',
                          items: [
                            for (final e in ynOptions.entries)
                              DropdownMenuItem(value: e.key, child: Text(e.value)),
                          ],
                        ),
                      ),
                      field(tf('PROD_PROJECT', 'PROD_PROJECT')),
                      field(tf('PROD_MODEL', 'PROD_MODEL')),
                      field(tf('PROD_MAIN_MATERIAL', 'PROD_MAIN_MATERIAL')),
                      field(
                        Row(
                          children: [
                            Expanded(
                              child: tf(
                                'G_LENGTH',
                                'G_LENGTH',
                                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: tf(
                                'G_WIDTH',
                                'G_WIDTH',
                                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                              ),
                            ),
                          ],
                        ),
                      ),
                      field(
                        tf(
                          'PD',
                          'PD',
                          keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        ),
                      ),
                      field(
                        Row(
                          children: [
                            Expanded(
                              child: tf(
                                'G_C',
                                'G_C',
                                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: tf(
                                'G_C_R',
                                'G_C_R',
                                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                              ),
                            ),
                          ],
                        ),
                      ),
                      field(
                        Row(
                          children: [
                            Expanded(
                              child: tf(
                                'G_CG',
                                'G_CG',
                                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: tf(
                                'G_LG',
                                'G_LG',
                                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                              ),
                            ),
                          ],
                        ),
                      ),
                      field(
                        Row(
                          children: [
                            Expanded(
                              child: tf(
                                'G_SG_L',
                                'G_SG_L',
                                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: tf(
                                'G_SG_R',
                                'G_SG_R',
                                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                              ),
                            ),
                          ],
                        ),
                      ),
                      field(
                        ddStr(
                          key: 'PACK_DRT',
                          label: 'Hướng cuộn (PACK_DRT)',
                          fallback: '1',
                          items: [
                            for (final e in packDrtOptions.entries)
                              DropdownMenuItem(value: e.key, child: Text(e.value)),
                          ],
                        ),
                      ),
                      field(
                        Row(
                          children: [
                            Expanded(
                              child: ddInt(
                                key: 'KNIFE_TYPE',
                                label: 'Loại dao (KNIFE_TYPE)',
                                fallback: 0,
                                items: [
                                  for (final e in knifeTypeOptions.entries)
                                    DropdownMenuItem(value: e.key, child: Text(e.value)),
                                ],
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: tf(
                                'KNIFE_LIFECYCLE',
                                'KNIFE_LIFECYCLE',
                                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                              ),
                            ),
                          ],
                        ),
                      ),
                      field(
                        tf(
                          'KNIFE_PRICE',
                          'KNIFE_PRICE',
                          keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        ),
                      ),
                      field(
                        Row(
                          children: [
                            Expanded(
                              child: tf(
                                'ROLE_EA_QTY',
                                'ROLE_EA_QTY',
                                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: tf(
                                'RPM',
                                'RPM',
                                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                              ),
                            ),
                          ],
                        ),
                      ),
                      field(
                        tf(
                          'PIN_DISTANCE',
                          'PIN_DISTANCE',
                          keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        ),
                      ),
                      field(tf('PROCESS_TYPE', 'PROCESS_TYPE')),
                      field(
                        ddStr(
                          key: 'EQ1',
                          label: 'Máy 1 (EQ1)',
                          fallback: 'NA',
                          items: [
                            for (final it in _machineList)
                              DropdownMenuItem(
                                value: _s(it['EQ_NAME']).isEmpty ? 'NA' : _s(it['EQ_NAME']),
                                child: Text(_s(it['EQ_NAME']).isEmpty ? 'NA' : _s(it['EQ_NAME'])),
                              ),
                          ],
                        ),
                      ),
                      field(
                        ddStr(
                          key: 'EQ2',
                          label: 'Máy 2 (EQ2)',
                          fallback: 'NA',
                          items: [
                            for (final it in _machineList)
                              DropdownMenuItem(
                                value: _s(it['EQ_NAME']).isEmpty ? 'NA' : _s(it['EQ_NAME']),
                                child: Text(_s(it['EQ_NAME']).isEmpty ? 'NA' : _s(it['EQ_NAME'])),
                              ),
                          ],
                        ),
                      ),
                      field(
                        ddStr(
                          key: 'EQ3',
                          label: 'Máy 3 (EQ3)',
                          fallback: 'NA',
                          items: [
                            for (final it in _machineList)
                              DropdownMenuItem(
                                value: _s(it['EQ_NAME']).isEmpty ? 'NA' : _s(it['EQ_NAME']),
                                child: Text(_s(it['EQ_NAME']).isEmpty ? 'NA' : _s(it['EQ_NAME'])),
                              ),
                          ],
                        ),
                      ),
                      field(
                        ddStr(
                          key: 'EQ4',
                          label: 'Máy 4 (EQ4)',
                          fallback: 'NA',
                          items: [
                            for (final it in _machineList)
                              DropdownMenuItem(
                                value: _s(it['EQ_NAME']).isEmpty ? 'NA' : _s(it['EQ_NAME']),
                                child: Text(_s(it['EQ_NAME']).isEmpty ? 'NA' : _s(it['EQ_NAME'])),
                              ),
                          ],
                        ),
                      ),
                      field(
                        Row(
                          children: [
                            Expanded(
                              child: tf(
                                'PROD_DIECUT_STEP',
                                'PROD_DIECUT_STEP',
                                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: tf(
                                'PROD_PRINT_TIMES',
                                'PROD_PRINT_TIMES',
                                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                              ),
                            ),
                          ],
                        ),
                      ),
                      field(
                        ddStr(
                          key: 'CODE_33',
                          label: 'Packing Type (CODE_33)',
                          fallback: '03',
                          items: [
                            for (final e in code33Options.entries)
                              DropdownMenuItem(value: e.key, child: Text(e.value)),
                          ],
                        ),
                      ),
                      field(
                        ddStr(
                          key: 'PROD_DVT',
                          label: 'Đơn vị (PROD_DVT)',
                          fallback: '01',
                          items: [
                            for (final e in prodDvtOptions.entries)
                              DropdownMenuItem(value: e.key, child: Text(e.value)),
                          ],
                        ),
                      ),
                      field(
                        ddStr(
                          key: 'PO_TYPE',
                          label: 'PO TYPE (PO_TYPE)',
                          fallback: 'E1',
                          items: [
                            for (final v in poTypeOptions)
                              DropdownMenuItem(value: v, child: Text(v)),
                          ],
                        ),
                      ),
                      field(
                        ddStr(
                          key: 'FSC',
                          label: 'FSC',
                          fallback: 'N',
                          items: [
                            for (final e in ynOptions.entries)
                              DropdownMenuItem(value: e.key, child: Text(e.value)),
                          ],
                          onChanged: (v) {
                            if (v == 'N') {
                              ctrls['FSC_CODE']?.text = '01';
                            }
                          },
                        ),
                      ),
                      field(
                        ddStr(
                          key: 'FSC_CODE',
                          label: 'Loại FSC (FSC_CODE)',
                          fallback: '01',
                          enabled: (ctrls['FSC']?.text ?? '').trim().toUpperCase() != 'N',
                          items: [
                            ...() {
                              final seen = <String>{};
                              final out = <DropdownMenuItem<String>>[];
                              for (final it in _fscList) {
                                final code = _s(it['FSC_CODE']).trim();
                                if (code.isEmpty) continue;
                                if (!seen.add(code)) continue;
                                final name = _s(it['FSC_NAME']).trim();
                                out.add(
                                  DropdownMenuItem(
                                    value: code,
                                    child: Text(name.isEmpty ? code : name),
                                  ),
                                );
                              }
                              if (!seen.contains('01')) {
                                out.insert(0, const DropdownMenuItem(value: '01', child: Text('01')));
                              }
                              return out;
                            }(),
                          ],
                        ),
                      ),
                      if (_company() == 'CMS')
                        field(
                          ddStr(
                            key: 'QL_HSD',
                            label: 'QL_HSD',
                            fallback: 'N',
                            items: [
                              for (final e in ynOptions.entries)
                                DropdownMenuItem(value: e.key, child: Text(e.value)),
                            ],
                          ),
                        )
                      else
                        field(tf('QL_HSD', 'QL_HSD')),
                      if (_company() == 'CMS')
                        field(
                          ddStr(
                            key: 'EXP_DATE',
                            label: 'HSD (EXP_DATE)',
                            fallback: '0',
                            items: [
                              for (final e in expDateOptions.entries)
                                DropdownMenuItem(value: e.key, child: Text(e.value)),
                            ],
                          ),
                        )
                      else
                        field(tf('EXP_DATE', 'EXP_DATE')),
                      if (_company() == 'CMS')
                        field(
                          ddStr(
                            key: 'APPROVED_YN',
                            label: 'PHE_DUYET (APPROVED_YN)',
                            fallback: 'N',
                            items: [
                              for (final e in ynOptions.entries)
                                DropdownMenuItem(value: e.key, child: Text(e.value)),
                            ],
                          ),
                        )
                      else
                        field(tf('APPROVED_YN', 'APPROVED_YN')),
                      field(tf('NO_INSPECTION', 'NO_INSPECTION')),
                      field(tf('REMK', 'REMK')),
                      field(tf('NOTE', 'NOTE')),
                    ],
                  ),
                ),
              ),
              actions: [
                TextButton(onPressed: () => Navigator.pop(ctx2, false), child: const Text('Hủy')),
                FilledButton(onPressed: () => Navigator.pop(ctx2, true), child: const Text('Lưu')),
              ],
            );
          },
        );
      },
    );

    if (ok != true) return;

    final code12 = (ctrls['CODE_12']?.text ?? '').trim();
    final prodType = (ctrls['PROD_TYPE']?.text ?? '').trim();
    final code12Num = int.tryParse(code12);
    if (code12Num == null || code12Num < 6 || code12Num > 9) {
      _snack('CODE_12 phải là số từ 6 đến 9');
      return;
    }
    if (prodType.isEmpty) {
      _snack('PROD_TYPE không được để trống');
      return;
    }

    final updated = Map<String, dynamic>.from(temp);

    for (final f in stringFields) {
      final v = (ctrls[f]?.text ?? '').trim();
      if (f == 'USE_YN') {
        updated[f] = v.isEmpty ? 'Y' : v;
      } else {
        updated[f] = v;
      }
    }

    if (_company() == 'CMS') {
      final expRaw = (ctrls['EXP_DATE']?.text ?? '').trim();
      updated['EXP_DATE'] = int.tryParse(expRaw) ?? 0;
    }

    for (final f in numberFields) {
      final raw = (ctrls[f]?.text ?? '').trim();
      final num = double.tryParse(raw);
      if (num != null) {
        updated[f] = num;
      }
    }

    if (updated['KNIFE_PRICE'] == null) {
      updated['KNIFE_PRICE'] = 0.0;
    }

    if (!mounted) return;
    setState(() {
      _codeFullInfo = updated;
    });
  }

  String _s(dynamic v) => (v ?? '').toString();
  int _i(dynamic v) => int.tryParse((v ?? '').toString()) ?? 0;
  double _d(dynamic v) => double.tryParse((v ?? '').toString()) ?? 0;

  List<PlutoColumn> _buildBomSxColumns(List<Map<String, dynamic>> rows) {
    final fields = <String>{};
    for (final r in rows) {
      fields.addAll(r.keys);
    }
    final base = <String>{
      'G_CODE',
      'M_CODE',
      'M_NAME',
      'WIDTH_CD',
      'M_QTY',
      'MAIN_M',
      'LIEUQL_SX',
      'RIV_NO',
      'G_SEQ',
      'REMARK',
    };
    final extra = fields.difference(base).toList()..sort();
    final ordered = <String>[
      'G_CODE',
      'M_CODE',
      'M_NAME',
      'WIDTH_CD',
      'M_QTY',
      'MAIN_M',
      'LIEUQL_SX',
      'RIV_NO',
      'G_SEQ',
      'REMARK',
      ...extra,
    ];

    PlutoColumn col(String field) {
      final isNum = field == 'M_QTY' || field == 'MAIN_M' || field == 'LIEUQL_SX';
      return PlutoColumn(
        title: field,
        field: field,
        type: isNum ? PlutoColumnType.number() : PlutoColumnType.text(),
        enableContextMenu: false,
        enableSorting: true,
        enableFilterMenuItem: true,
        enableEditingMode: true,
        width: field == 'M_NAME' ? 180 : 120,
        minWidth: 80,
        renderer: (ctx) {
          final v = (ctx.cell.value ?? '').toString();
          return Text(
            v,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(fontSize: 11),
          );
        },
      );
    }

    return [
      PlutoColumn(
        title: 'DEL',
        field: '__DEL__',
        type: PlutoColumnType.text(),
        width: 60,
        minWidth: 60,
        enableContextMenu: false,
        enableSorting: false,
        enableFilterMenuItem: false,
        enableEditingMode: false,
        renderer: (ctx) {
          final v = ctx.cell.value;
          final checked = v == true || v == 1 || v == '1' || v == 'Y';
          return Center(
            child: Checkbox(
              value: checked,
              onChanged: (nv) {
                ctx.stateManager.changeCellValue(ctx.cell, nv == true);
              },
              visualDensity: VisualDensity.compact,
            ),
          );
        },
      ),
      PlutoColumn(
        title: '',
        field: '__raw__',
        type: PlutoColumnType.text(),
        width: 0,
        hide: true,
        enableContextMenu: false,
        enableSorting: false,
        enableFilterMenuItem: false,
      ),
      for (final f in ordered) col(f),
    ];
  }

  List<PlutoColumn> _buildBomGiaColumns(List<Map<String, dynamic>> rows) {
    final fields = <String>{};
    for (final r in rows) {
      fields.addAll(r.keys);
    }
    final base = <String>{
      'G_CODE',
      'G_SEQ',
      'M_CODE',
      'M_NAME',
      'CUST_CD',
      'USAGE',
      'MAIN_M',
      'M_QTY',
      'M_CMS_PRICE',
      'M_SS_PRICE',
      'M_SLITTING_PRICE',
      'MAT_MASTER_WIDTH',
      'MAT_CUTWIDTH',
      'MAT_ROLL_LENGTH',
      'MAT_THICKNESS',
      'PROCESS_ORDER',
      'REMARK',
    };
    final extra = fields.difference(base).toList()..sort();
    final ordered = <String>[
      'G_CODE',
      'G_SEQ',
      'M_CODE',
      'M_NAME',
      'CUST_CD',
      'USAGE',
      'MAIN_M',
      'M_QTY',
      'M_CMS_PRICE',
      'M_SS_PRICE',
      'M_SLITTING_PRICE',
      'MAT_MASTER_WIDTH',
      'MAT_CUTWIDTH',
      'MAT_ROLL_LENGTH',
      'MAT_THICKNESS',
      'PROCESS_ORDER',
      'REMARK',
      ...extra,
    ];

    PlutoColumn col(String field) {
      final isNum = {
        'MAIN_M',
        'M_QTY',
        'M_CMS_PRICE',
        'M_SS_PRICE',
        'M_SLITTING_PRICE',
        'MAT_MASTER_WIDTH',
        'MAT_ROLL_LENGTH',
        'MAT_THICKNESS',
        'PROCESS_ORDER',
      }.contains(field);
      return PlutoColumn(
        title: field,
        field: field,
        type: isNum ? PlutoColumnType.number() : PlutoColumnType.text(),
        enableContextMenu: false,
        enableSorting: true,
        enableFilterMenuItem: true,
        enableEditingMode: true,
        width: field == 'M_NAME' ? 180 : 120,
        minWidth: 80,
        renderer: (ctx) {
          final v = (ctx.cell.value ?? '').toString();
          final raw = ctx.row.cells['__raw__']?.value;
          final it = raw is Map<String, dynamic> ? raw : null;

          bool invalid = false;
          if (it != null) {
            final cust = _s(it['CUST_CD']).trim();
            final usage = _s(it['USAGE']).trim();
            final mw = _d(it['MAT_MASTER_WIDTH']);
            final rl = _d(it['MAT_ROLL_LENGTH']);
            if (field == 'CUST_CD' && cust.isEmpty) invalid = true;
            if (field == 'USAGE' && usage.isEmpty) invalid = true;
            if (field == 'MAT_MASTER_WIDTH' && mw == 0) invalid = true;
            if (field == 'MAT_ROLL_LENGTH' && rl == 0) invalid = true;
          }

          final bg = invalid ? Colors.red.withValues(alpha: 0.22) : null;
          return Container(
            color: bg,
            padding: const EdgeInsets.symmetric(horizontal: 6),
            alignment: Alignment.centerLeft,
            child: Text(
              v,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontSize: 11),
            ),
          );
        },
      );
    }

    return [
      PlutoColumn(
        title: 'DEL',
        field: '__DEL__',
        type: PlutoColumnType.text(),
        width: 60,
        minWidth: 60,
        enableContextMenu: false,
        enableSorting: false,
        enableFilterMenuItem: false,
        enableEditingMode: false,
        renderer: (ctx) {
          final v = ctx.cell.value;
          final checked = v == true || v == 1 || v == '1' || v == 'Y';
          return Center(
            child: Checkbox(
              value: checked,
              onChanged: (nv) {
                ctx.stateManager.changeCellValue(ctx.cell, nv == true);
              },
              visualDensity: VisualDensity.compact,
            ),
          );
        },
      ),
      PlutoColumn(
        title: '',
        field: '__raw__',
        type: PlutoColumnType.text(),
        width: 0,
        hide: true,
        enableContextMenu: false,
        enableSorting: false,
        enableFilterMenuItem: false,
      ),
      for (final f in ordered) col(f),
    ];
  }

  List<PlutoRow> _buildBomRows(
    List<Map<String, dynamic>> rows,
    List<PlutoColumn> columns,
  ) {
    Object? val(Map<String, dynamic> it, String field) {
      if (field == '__raw__') return it;
      return it[field];
    }

    return [
      for (final it in rows)
        PlutoRow(
          cells: {
            for (final c in columns) c.field: PlutoCell(value: val(it, c.field)),
          },
        ),
    ];
  }

  Widget _buildBomGrid({
    required List<PlutoColumn> cols,
    required List<PlutoRow> rows,
    PlutoOnChangedEventCallback? onChanged,
  }) {
    if (cols.isEmpty) return const SizedBox.shrink();
    return PlutoGrid(
      columns: cols,
      rows: rows,
      onChanged: onChanged,
      onLoaded: (e) {
        e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
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
    );
  }

  Future<void> _selectCode(Map<String, dynamic> codeRow) async {
    final gCode = _s(codeRow['G_CODE']).trim();
    if (gCode.isEmpty) return;

    setState(() {
      _selectedCode = codeRow;
      _gCodeCtrl.text = gCode;
      _loading = true;
    });

    try {
      final infoBody = await _post('getcodefullinfo', {'G_CODE': gCode});
      final sxBody = await _post('getbomsx', {'G_CODE': gCode});
      final giaBody = await _post('getbomgia', {'G_CODE': gCode});

      if (!mounted) return;

      Map<String, dynamic>? full;
      if (!_isNg(infoBody)) {
        final data = infoBody['data'];
        if (data is List && data.isNotEmpty && data.first is Map) {
          full = Map<String, dynamic>.from(data.first as Map);
        }
      }

      final sxList = (!_isNg(sxBody) ? sxBody['data'] : null);
      final giaList = (!_isNg(giaBody) ? giaBody['data'] : null);

      final sx = (sxList is List ? sxList : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList();
      final gia = (giaList is List ? giaList : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList();

      final sxCols = _buildBomSxColumns(sx);
      final giaCols = _buildBomGiaColumns(gia);

      setState(() {
        _codeFullInfo = full;
        _bomSx = sx;
        _bomGia = gia;
        _bomSxCols = sxCols;
        _bomSxRows = _buildBomRows(sx, sxCols);
        _bomGiaCols = giaCols;
        _bomGiaRows = _buildBomRows(gia, giaCols);
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Future<void> _addCode() async {
    final info = _codeFullInfo;
    if (info == null) {
      _snack('Chưa có CODE_FULL_INFO (hãy chọn 1 code để load detail rồi sửa thông tin trước)');
      return;
    }

    final code12 = _s(info['CODE_12']).trim();
    final prodType = _s(info['PROD_TYPE']).trim();
    final gNameKd = _s(info['G_NAME_KD']).trim();
    final code12Num = int.tryParse(code12);
    if (code12Num == null || code12Num < 6 || code12Num > 9) {
      _snack('CODE_12 phải là số từ 6 đến 9');
      return;
    }
    if (prodType.isEmpty) {
      _snack('PROD_TYPE không được để trống');
      return;
    }

    if (_company() != 'CMS') {
      final exists = await _checkGNameKdExist(gNameKd.isEmpty ? 'zzzzzzzzz' : gNameKd);
      if (exists) {
        _snack('G_NAME_KD đã tồn tại, không thể thêm code mới');
        return;
      }
    }

    final code27 = _code27FromProdType(prodType);

    setState(() => _loading = true);
    try {
      final next = await _getNextGCode(code12: code12, code27: code27);
      final tempInfo = Map<String, dynamic>.from(info);
      tempInfo['G_CODE'] = next.nextGCode;
      tempInfo['KNIFE_PRICE'] = _d(tempInfo['KNIFE_PRICE']);
      if (_company() == 'CMS') {
        tempInfo['EXP_DATE'] = _i(tempInfo['EXP_DATE']);
      }

      final body = await _post('insertM100', {
        'G_CODE': next.nextGCode,
        'CODE_27': code27,
        'NEXT_SEQ_NO': next.nextSeqNo,
        'CODE_FULL_INFO': tempInfo,
      });
      setState(() => _loading = false);
      if (_isNg(body)) {
        _snack('Lỗi: ${(body['message'] ?? 'NG').toString()}');
        return;
      }
      _snack('Code mới: ${next.nextGCode}');
      await _selectCode({'G_CODE': next.nextGCode});
    } catch (e) {
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Future<void> _addVer() async {
    final info = _codeFullInfo;
    if (info == null) {
      _snack('Chưa có CODE_FULL_INFO');
      return;
    }

    final gCode = _s(info['G_CODE']).trim();
    if (gCode.isEmpty) {
      _snack('Chưa có G_CODE');
      return;
    }
    final code12 = _s(info['CODE_12']).trim();
    final prodType = _s(info['PROD_TYPE']).trim();
    if (code12.isEmpty || prodType.isEmpty) {
      _snack('Thiếu CODE_12 / PROD_TYPE');
      return;
    }

    final code27 = _code27FromProdType(prodType);

    String newGCode;
    String nextSeqNo;
    String nextRevNo = '';

    if (gCode.length < 8) {
      _snack('G_CODE không hợp lệ: $gCode');
      return;
    }

    if (code12 == '9') {
      final seq = int.tryParse(gCode.substring(2, 8)) ?? 0;
      nextSeqNo = _zeroPad(seq + 1, 6);
      newGCode = '$code12$code27$nextSeqNo';
    } else {
      if (gCode.length < 8) {
        _snack('G_CODE không đủ để tăng REV: $gCode');
        return;
      }
      nextSeqNo = gCode.substring(2, 7);
      final currentRev = gCode.substring(7, 8);
      if (currentRev.isEmpty) {
        _snack('REV_NO hiện tại không hợp lệ');
        return;
      }
      nextRevNo = String.fromCharCode(currentRev.codeUnitAt(0) + 1);
      newGCode = '$code12$code27$nextSeqNo$nextRevNo';
    }

    setState(() => _loading = true);
    try {
      final tempInfo = Map<String, dynamic>.from(info)..['G_CODE'] = newGCode;
      tempInfo['KNIFE_PRICE'] = _d(tempInfo['KNIFE_PRICE']);
      if (_company() == 'CMS') {
        tempInfo['EXP_DATE'] = _i(tempInfo['EXP_DATE']);
      }
      final body = await _post('insertM100_AddVer', {
        'G_CODE': newGCode,
        'CODE_27': code27,
        'NEXT_SEQ_NO': nextSeqNo,
        'REV_NO': nextRevNo,
        'CODE_FULL_INFO': tempInfo,
      });
      setState(() => _loading = false);
      if (_isNg(body)) {
        _snack('Lỗi: ${(body['message'] ?? 'NG').toString()}');
        return;
      }
      _snack('Ver mới: $newGCode');
      await _selectCode({'G_CODE': newGCode});
    } catch (e) {
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Future<void> _updateCode() async {
    final info = _codeFullInfo;
    if (info == null) {
      _snack('Chưa có CODE_FULL_INFO');
      return;
    }

    final reasonCtrl = TextEditingController(text: '');
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          title: const Text('Lý do update'),
          content: TextField(
            controller: reasonCtrl,
            decoration: const InputDecoration(labelText: 'UPDATE_REASON'),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Hủy')),
            FilledButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('OK')),
          ],
        );
      },
    );
    if (ok != true) return;
    final reason = reasonCtrl.text.trim();
    if (reason.isEmpty) {
      _snack('Phải nhập lý do update');
      return;
    }

    final empl = _emplNo();
    final temp = Map<String, dynamic>.from(info);
    temp['UPDATE_REASON'] = reason;
    temp['UPD_EMPL'] = empl;
    temp['KNIFE_PRICE'] = _d(temp['KNIFE_PRICE']);
    if (_company() == 'CMS') {
      temp['EXP_DATE'] = _i(temp['EXP_DATE']);
    }

    setState(() => _loading = true);
    try {
      final body = await _post('updateM100', temp);
      setState(() => _loading = false);
      if (_isNg(body)) {
        _snack('Lỗi: ${(body['message'] ?? 'NG').toString()}');
        return;
      }
      _snack('Update OK: ${_s(info['G_CODE'])}');
    } catch (e) {
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Future<void> _addBomSxLine() async {
    final gCode = _gCodeCtrl.text.trim();
    if (gCode.isEmpty) {
      _snack('Chọn 1 code trước');
      return;
    }

    final mCode = TextEditingController();
    final mName = TextEditingController();
    final width = TextEditingController();
    final qty = TextEditingController(text: '1');
    final lieuQl = TextEditingController(text: '0');
    final mainM = TextEditingController(text: '0');

    Map<String, dynamic>? selectedMaterial;

    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx2, setLocal) {
            return AlertDialog(
              title: const Text('Thêm BOM NVL'),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            selectedMaterial == null
                                ? 'Chưa chọn material'
                                : '${_s(selectedMaterial?['M_CODE'])} - ${_s(selectedMaterial?['M_NAME'])}',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 8),
                        OutlinedButton(
                          onPressed: () async {
                            final picked = await _pickMaterial();
                            if (picked == null) return;
                            selectedMaterial = picked;
                            mCode.text = _s(picked['M_CODE']);
                            mName.text = _s(picked['M_NAME']);
                            width.text = _s(picked['WIDTH_CD']);
                            setLocal(() {});
                          },
                          child: const Text('Chọn'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    TextField(controller: mCode, decoration: const InputDecoration(labelText: 'M_CODE')),
                    TextField(controller: mName, decoration: const InputDecoration(labelText: 'M_NAME')),
                    TextField(controller: width, decoration: const InputDecoration(labelText: 'WIDTH_CD')),
                    TextField(controller: qty, decoration: const InputDecoration(labelText: 'M_QTY'), keyboardType: TextInputType.number),
                    TextField(controller: lieuQl, decoration: const InputDecoration(labelText: 'LIEUQL_SX (0/1)'), keyboardType: TextInputType.number),
                    TextField(controller: mainM, decoration: const InputDecoration(labelText: 'MAIN_M (0/1)'), keyboardType: TextInputType.number),
                  ],
                ),
              ),
              actions: [
                TextButton(onPressed: () => Navigator.pop(ctx2, false), child: const Text('Hủy')),
                FilledButton(onPressed: () => Navigator.pop(ctx2, true), child: const Text('Thêm')),
              ],
            );
          },
        );
      },
    );
    if (ok != true) return;

    final r = <String, dynamic>{
      'G_CODE': gCode,
      'M_CODE': mCode.text.trim(),
      'M_NAME': mName.text.trim(),
      'WIDTH_CD': width.text.trim(),
      'M_QTY': _d(qty.text),
      'LIEUQL_SX': _i(lieuQl.text),
      'MAIN_M': _i(mainM.text).toString(),
      'RIV_NO': 'A',
    };

    setState(() {
      _bomSx = [..._bomSx, r];
      _bomSxCols = _buildBomSxColumns(_bomSx);
      _bomSxRows = _buildBomRows(_bomSx, _bomSxCols);
    });
  }

  void _deleteMarkedBomSxLines() {
    final before = _bomSx.length;
    final kept = _bomSx.where((e) => e['__DEL__'] != true).toList();
    final deleted = before - kept.length;
    if (deleted <= 0) {
      _snack('Chưa tick dòng nào để xóa');
      return;
    }

    setState(() {
      _bomSx = kept;
      _bomSxCols = _buildBomSxColumns(_bomSx);
      _bomSxRows = _buildBomRows(_bomSx, _bomSxCols);
    });
    _snack('Đã xóa $deleted dòng (chưa lưu)');
  }

  Future<void> _saveBomSx() async {
    final gCode = _gCodeCtrl.text.trim();
    if (gCode.isEmpty) {
      _snack('Chọn 1 code trước');
      return;
    }
    if (_bomGia.isEmpty) {
      _snack('Code chưa có BOM giá, phải thêm BOM giá trước');
      return;
    }
    if (_bomSx.isEmpty) {
      _snack('Thêm ít nhất 1 liệu để lưu BOM');
      return;
    }

    final totalLieu = _bomSx.fold<int>(0, (p, e) => p + _i(e['LIEUQL_SX']));
    if (totalLieu <= 0) {
      _snack('Check lại liệu quản lý (liệu chính)');
      return;
    }

    final mList = _bomSx.map((e) => "'${_s(e['M_CODE'])}'").join(',');
    setState(() => _loading = true);
    try {
      await _post('deleteM140_2', {'G_CODE': gCode, 'M_LIST': mList});
      final maxBody = await _post('checkGSEQ_M140', {'G_CODE': gCode});
      var maxG = '001';
      if (!_isNg(maxBody)) {
        final data = maxBody['data'];
        if (data is List && data.isNotEmpty && data.first is Map) {
          maxG = _s((data.first as Map)['MAX_G_SEQ']);
        }
      }
      final base = int.tryParse(maxG) ?? 1;

      for (var idx = 0; idx < _bomSx.length; idx++) {
        final it = _bomSx[idx];
        final mCode = _s(it['M_CODE']);
        final chk = await _post('check_m_code_m140', {'G_CODE': gCode, 'M_CODE': mCode});
        final exists = !_isNg(chk);
        if (exists) {
          await _post('update_M140', {
            'G_CODE': gCode,
            'M_CODE': mCode,
            'M_QTY': _d(it['M_QTY']),
            'MAIN_M': _s(it['MAIN_M']).isEmpty ? '0' : _s(it['MAIN_M']),
            'LIEUQL_SX': _s(it['LIEUQL_SX']).isEmpty ? '0' : _s(it['LIEUQL_SX']),
          });
        } else {
          final gSeq = (base + idx + 1).toString().padLeft(3, '0');
          await _post('insertM140', {
            'G_CODE': gCode,
            'G_SEQ': gSeq,
            'M_CODE': mCode,
            'M_QTY': _d(it['M_QTY']),
            'MAIN_M': _s(it['MAIN_M']).isEmpty ? '0' : _s(it['MAIN_M']),
            'LIEUQL_SX': _s(it['LIEUQL_SX']).isEmpty ? '0' : _s(it['LIEUQL_SX']),
          });
        }
      }
      setState(() => _loading = false);
      _snack('Đã lưu BOM NVL');
      await _selectCode(_selectedCode ?? {'G_CODE': gCode});
    } catch (e) {
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Future<void> _addBomGiaLine() async {
    final gCode = _gCodeCtrl.text.trim();
    if (gCode.isEmpty) {
      _snack('Chọn 1 code trước');
      return;
    }

    final mCode = TextEditingController();
    final mName = TextEditingController();
    final custCd = TextEditingController();
    final usage = TextEditingController(text: '');
    final mainM = TextEditingController(text: '0');
    final qty = TextEditingController(text: '1');
    final cms = TextEditingController(text: '0');
    final ss = TextEditingController(text: '0');
    final slitting = TextEditingController(text: '0');
    final mw = TextEditingController(text: '0');
    final cw = TextEditingController(text: '');
    final rl = TextEditingController(text: '0');
    final th = TextEditingController(text: '0');

    Map<String, dynamic>? selectedMaterial;

    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx2, setLocal) {
            return AlertDialog(
              title: const Text('Thêm BOM giá'),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            selectedMaterial == null
                                ? 'Chưa chọn material'
                                : '${_s(selectedMaterial?['M_CODE'])} - ${_s(selectedMaterial?['M_NAME'])}',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 8),
                        OutlinedButton(
                          onPressed: () async {
                            final picked = await _pickMaterial();
                            if (picked == null) return;
                            selectedMaterial = picked;
                            mCode.text = _s(picked['M_CODE']);
                            mName.text = _s(picked['M_NAME']);
                            cw.text = _s(picked['WIDTH_CD']);

                            try {
                              final info = await _post('checkMaterialInfo', {
                                'M_NAME': _s(picked['M_NAME']),
                              });
                              if (!_isNg(info)) {
                                final data = info['data'];
                                if (data is List && data.isNotEmpty && data.first is Map) {
                                  final r = Map<String, dynamic>.from(data.first as Map);
                                  custCd.text = _s(r['CUST_CD']);
                                  cms.text = _s(r['CMSPRICE']);
                                  ss.text = _s(r['SSPRICE']);
                                  slitting.text = _s(r['SLITTING_PRICE']);
                                  mw.text = _s(r['MASTER_WIDTH']);
                                  rl.text = _s(r['ROLL_LENGTH']);
                                }
                              }
                            } catch (_) {}

                            setLocal(() {});
                          },
                          child: const Text('Chọn'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    TextField(controller: mCode, decoration: const InputDecoration(labelText: 'M_CODE')),
                    TextField(controller: mName, decoration: const InputDecoration(labelText: 'M_NAME')),
                    TextField(controller: custCd, decoration: const InputDecoration(labelText: 'CUST_CD')),
                    TextField(controller: usage, decoration: const InputDecoration(labelText: 'USAGE (vd MAIN)')),
                    TextField(controller: mainM, decoration: const InputDecoration(labelText: 'MAIN_M (0/1)'), keyboardType: TextInputType.number),
                    TextField(controller: qty, decoration: const InputDecoration(labelText: 'M_QTY'), keyboardType: TextInputType.number),
                    TextField(controller: cms, decoration: const InputDecoration(labelText: 'M_CMS_PRICE'), keyboardType: TextInputType.number),
                    TextField(controller: ss, decoration: const InputDecoration(labelText: 'M_SS_PRICE'), keyboardType: TextInputType.number),
                    TextField(controller: slitting, decoration: const InputDecoration(labelText: 'M_SLITTING_PRICE'), keyboardType: TextInputType.number),
                    TextField(controller: mw, decoration: const InputDecoration(labelText: 'MAT_MASTER_WIDTH'), keyboardType: TextInputType.number),
                    TextField(controller: cw, decoration: const InputDecoration(labelText: 'MAT_CUTWIDTH')),
                    TextField(controller: rl, decoration: const InputDecoration(labelText: 'MAT_ROLL_LENGTH'), keyboardType: TextInputType.number),
                    TextField(controller: th, decoration: const InputDecoration(labelText: 'MAT_THICKNESS'), keyboardType: TextInputType.number),
                  ],
                ),
              ),
              actions: [
                TextButton(onPressed: () => Navigator.pop(ctx2, false), child: const Text('Hủy')),
                FilledButton(onPressed: () => Navigator.pop(ctx2, true), child: const Text('Thêm')),
              ],
            );
          },
        );
      },
    );
    if (ok != true) return;

    final r = <String, dynamic>{
      'G_CODE': gCode,
      'G_SEQ': (_bomGia.length + 1).toString().padLeft(3, '0'),
      'M_CODE': mCode.text.trim(),
      'M_NAME': mName.text.trim(),
      'CUST_CD': custCd.text.trim(),
      'USAGE': usage.text.trim(),
      'MAIN_M': _i(mainM.text),
      'M_QTY': _d(qty.text),
      'M_CMS_PRICE': _d(cms.text),
      'M_SS_PRICE': _d(ss.text),
      'M_SLITTING_PRICE': _d(slitting.text),
      'MAT_MASTER_WIDTH': _d(mw.text),
      'MAT_CUTWIDTH': cw.text.trim(),
      'MAT_ROLL_LENGTH': _d(rl.text),
      'MAT_THICKNESS': _d(th.text),
      'PROCESS_ORDER': _bomGia.length + 1,
      'REMARK': '',
    };

    setState(() {
      _bomGia = [..._bomGia, r];
      _bomGiaCols = _buildBomGiaColumns(_bomGia);
      _bomGiaRows = _buildBomRows(_bomGia, _bomGiaCols);
    });
  }

  void _deleteMarkedBomGiaLines() {
    final before = _bomGia.length;
    final kept = _bomGia.where((e) => e['__DEL__'] != true).toList();
    final deleted = before - kept.length;
    if (deleted <= 0) {
      _snack('Chưa tick dòng nào để xóa');
      return;
    }

    setState(() {
      _bomGia = kept;
      _bomGiaCols = _buildBomGiaColumns(_bomGia);
      _bomGiaRows = _buildBomRows(_bomGia, _bomGiaCols);
    });
    _snack('Đã xóa $deleted dòng (chưa lưu)');
  }

  Future<void> _saveBomGia() async {
    final gCode = _gCodeCtrl.text.trim();
    if (gCode.isEmpty) {
      _snack('Chọn 1 code trước');
      return;
    }
    if (_bomGia.isEmpty) {
      _snack('Thêm ít nhất 1 liệu để lưu BOM');
      return;
    }

    final canEdit = await _canEditBomByMassRule(gCode);
    if (!canEdit) {
      _snack('Code đã YCSX mass sau 2025-01-12, không thể sửa BOM');
      return;
    }

    final mainSum = _bomGia.fold<int>(0, (p, e) => p + _i(e['MAIN_M']));
    if (mainSum == 0) {
      _snack('Phải chỉ định liệu quản lý');
      return;
    }

    String err = '0';
    var checkMainM = 0;
    var totalLieuQl = 0;
    var checkLieuQlSot = 0;
    var checkNumLieuQl = 1;
    var checkLieuQlKhac1 = 0;
    var checkUsageMain = 0;

    for (final it in _bomGia) {
      final usage = _s(it['USAGE']).trim().toUpperCase();
      if (usage == 'MAIN') checkUsageMain += 1;
    }

    for (final it in _bomGia) {
      final mm = _i(it['MAIN_M']);
      totalLieuQl += mm;
      if (mm > 1) checkLieuQlKhac1 += 1;
    }

    for (final it in _bomGia) {
      if (_i(it['MAIN_M']) == 1) {
        for (final other in _bomGia) {
          if (_s(other['M_NAME']) == _s(it['M_NAME']) && _i(other['MAIN_M']) == 0) {
            checkLieuQlSot += 1;
          }
        }
      }
    }

    for (final it in _bomGia) {
      if (_i(it['MAIN_M']) == 1) {
        for (final other in _bomGia) {
          if (_i(other['MAIN_M']) == 1) {
            if (_s(it['M_NAME']) != _s(other['M_NAME'])) {
              checkNumLieuQl = 2;
            }
          }
        }
      }
    }

    for (final it in _bomGia) {
      checkMainM += _i(it['MAIN_M']);
      final cust = _s(it['CUST_CD']).trim();
      final usage = _s(it['USAGE']).trim();
      final mw = _d(it['MAT_MASTER_WIDTH']);
      final rl = _d(it['MAT_ROLL_LENGTH']);
      if (cust.isEmpty || usage.isEmpty || mw == 0 || rl == 0) {
        err = 'Không được để ô nào NG màu đỏ';
      }
    }

    if (!(totalLieuQl > 0 && checkLieuQlSot == 0 && checkNumLieuQl == 1 && checkLieuQlKhac1 == 0)) {
      err += ' | Check lại liệu quản lý (liệu chính)';
    }
    if (checkUsageMain == 0) {
      err += '_Cột USAGE chưa chỉ định liệu MAIN, hãy viết MAIN vào ô tương ứng';
    }
    if (checkMainM == 0) {
      err += '_ Phải chỉ định liệu quản lý';
    }

    if (err != '0') {
      _snack(err);
      return;
    }

    setState(() => _loading = true);
    try {
      await _post('deleteBOM2', {'G_CODE': gCode});
      for (var i = 0; i < _bomGia.length; i++) {
        final it = _bomGia[i];
        await _post('insertBOM2', {
          'G_CODE': gCode,
          'G_SEQ': (i + 1).toString().padLeft(3, '0'),
          'M_CODE': _s(it['M_CODE']),
          'M_NAME': _s(it['M_NAME']),
          'CUST_CD': _s(it['CUST_CD']),
          'USAGE': _s(it['USAGE']),
          'MAIN_M': _i(it['MAIN_M']),
          'M_CMS_PRICE': _d(it['M_CMS_PRICE']),
          'M_SS_PRICE': _d(it['M_SS_PRICE']),
          'M_SLITTING_PRICE': _d(it['M_SLITTING_PRICE']),
          'MAT_MASTER_WIDTH': _d(it['MAT_MASTER_WIDTH']),
          'MAT_CUTWIDTH': _s(it['MAT_CUTWIDTH']),
          'MAT_ROLL_LENGTH': _d(it['MAT_ROLL_LENGTH']),
          'MAT_THICKNESS': _d(it['MAT_THICKNESS']),
          'M_QTY': _d(it['M_QTY']),
          'PROCESS_ORDER': _i(it['PROCESS_ORDER']) == 0 ? i + 1 : _i(it['PROCESS_ORDER']),
          'REMARK': _s(it['REMARK']),
        });
      }
      setState(() => _loading = false);
      _snack('Đã lưu BOM giá');
      await _selectCode(_selectedCode ?? {'G_CODE': gCode});
    } catch (e) {
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  void _cloneBomSxToBomGia() {
    final gCode = _gCodeCtrl.text.trim();
    if (gCode.isEmpty) {
      _snack('Chọn 1 code trước');
      return;
    }
    if (_bomSx.isEmpty) {
      _snack('Không có BOM SX để Clone sang');
      return;
    }

    final cloned = <Map<String, dynamic>>[];
    for (var i = 0; i < _bomSx.length; i++) {
      final sx = _bomSx[i];
      cloned.add({
        'G_CODE': gCode,
        'G_SEQ': (i + 1).toString().padLeft(3, '0'),
        'M_CODE': _s(sx['M_CODE']),
        'M_NAME': _s(sx['M_NAME']),
        'CUST_CD': '',
        'USAGE': '',
        'MAIN_M': 0,
        'M_QTY': 1,
        'M_CMS_PRICE': 0,
        'M_SS_PRICE': 0,
        'M_SLITTING_PRICE': 0,
        'MAT_MASTER_WIDTH': 0,
        'MAT_CUTWIDTH': _s(sx['WIDTH_CD']),
        'MAT_ROLL_LENGTH': 0,
        'MAT_THICKNESS': 0,
        'PROCESS_ORDER': i + 1,
        'REMARK': '',
      });
    }
    setState(() {
      _bomGia = cloned;
      _bomGiaCols = _buildBomGiaColumns(_bomGia);
      _bomGiaRows = _buildBomRows(_bomGia, _bomGiaCols);
    });
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Quản lý Code BOM'),
        actions: [
          PopupMenuButton<String>(
            onSelected: (v) async {
              if (v == 'edit_code_info') {
                await _editCodeFullInfo();
              } else if (v == 'add_code') {
                await _addCode();
              } else if (v == 'add_ver') {
                await _addVer();
              } else if (v == 'update_code') {
                await _updateCode();
              }
            },
            itemBuilder: (ctx) => [
              const PopupMenuItem(value: 'edit_code_info', child: Text('Sửa CODE_FULL_INFO')),
              const PopupMenuDivider(),
              const PopupMenuItem(value: 'add_code', child: Text('Thêm code (insertM100)')),
              const PopupMenuItem(value: 'add_ver', child: Text('Thêm ver (insertM100_AddVer)')),
              const PopupMenuItem(value: 'update_code', child: Text('Update code (updateM100)')),
            ],
          ),
        ],
      ),
      drawer: const AppDrawer(title: 'ERP'),
      body: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        'G_CODE: ${_gCodeCtrl.text.trim().isEmpty ? '-' : _gCodeCtrl.text.trim()}',
                        style: const TextStyle(fontWeight: FontWeight.w900),
                      ),
                    ),
                    OutlinedButton(
                      onPressed: _gCodeCtrl.text.trim().isEmpty
                          ? null
                          : () => _selectCode({'G_CODE': _gCodeCtrl.text.trim()}),
                      child: const Text('Reload'),
                    ),
                    const SizedBox(width: 8),
                    OutlinedButton.icon(
                      onPressed: _editCodeFullInfo,
                      icon: const Icon(Icons.edit, size: 18),
                      label: const Text('Sửa info'),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            Expanded(
              child: _loading
                  ? const Center(child: CircularProgressIndicator())
                  : Column(
                      children: [
                        Expanded(
                          child: Card(
                            child: _codeFullInfo == null
                                ? Padding(
                                    padding: const EdgeInsets.all(12),
                                    child: Text(
                                      'Chưa có CODE_FULL_INFO. Bấm "Sửa info" để nhập thông tin hoặc dùng menu để thêm code.',
                                      style: TextStyle(color: scheme.onSurfaceVariant),
                                    ),
                                  )
                                : Builder(
                                    builder: (ctx) {
                                      final info = _codeFullInfo ?? <String, dynamic>{};
                                      final fields = _prioritizedCodeInfoFields(info);
                                      return ListView(
                                        padding: const EdgeInsets.all(12),
                                        children: [
                                          for (final f in fields) _kv(f, _s(info[f])),
                                        ],
                                      );
                                    },
                                  ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        Expanded(
                          child: DefaultTabController(
                            length: 2,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const TabBar(
                                  isScrollable: true,
                                  tabs: [
                                    Tab(text: 'BOM NVL'),
                                    Tab(text: 'BOM GIÁ'),
                                  ],
                                ),
                                Expanded(
                                  child: TabBarView(
                                    children: [
                                      Column(
                                        children: [
                                          Padding(
                                            padding: const EdgeInsets.fromLTRB(12, 8, 12, 8),
                                            child: Row(
                                              children: [
                                                Tooltip(
                                                  message: 'Thêm dòng BOM NVL',
                                                  child: IconButton(
                                                    onPressed: _gCodeCtrl.text.trim().isEmpty ? null : () => _addBomSxLine(),
                                                    icon: const Icon(Icons.add),
                                                  ),
                                                ),
                                                Tooltip(
                                                  message: 'Xóa dòng BOM NVL (đã tick DEL)',
                                                  child: IconButton(
                                                    onPressed: _bomSx.isEmpty ? null : _deleteMarkedBomSxLines,
                                                    icon: const Icon(Icons.delete_outline),
                                                  ),
                                                ),
                                                Tooltip(
                                                  message: 'Lưu BOM NVL',
                                                  child: IconButton(
                                                    onPressed: _gCodeCtrl.text.trim().isEmpty ? null : () => _saveBomSx(),
                                                    icon: const Icon(Icons.save),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                          Expanded(
                                            child: _bomSx.isEmpty
                                                ? Padding(
                                                    padding: const EdgeInsets.all(12),
                                                    child: Text(
                                                      'Chưa có BOM NVL',
                                                      style: TextStyle(color: scheme.onSurfaceVariant),
                                                    ),
                                                  )
                                                : _buildBomGrid(
                                                    cols: _bomSxCols,
                                                    rows: _bomSxRows,
                                                    onChanged: (e) {
                                                      final raw = e.row.cells['__raw__']?.value;
                                                      if (raw is Map<String, dynamic>) {
                                                        raw[e.column.field] = e.value;
                                                      }
                                                    },
                                                  ),
                                          ),
                                        ],
                                      ),
                                      Column(
                                        children: [
                                          Padding(
                                            padding: const EdgeInsets.fromLTRB(12, 8, 12, 8),
                                            child: Row(
                                              children: [
                                                Tooltip(
                                                  message: 'Thêm dòng BOM giá',
                                                  child: IconButton(
                                                    onPressed: _gCodeCtrl.text.trim().isEmpty ? null : () => _addBomGiaLine(),
                                                    icon: const Icon(Icons.add),
                                                  ),
                                                ),
                                                Tooltip(
                                                  message: 'Xóa dòng BOM giá (đã tick DEL)',
                                                  child: IconButton(
                                                    onPressed: _bomGia.isEmpty ? null : _deleteMarkedBomGiaLines,
                                                    icon: const Icon(Icons.delete_outline),
                                                  ),
                                                ),
                                                Tooltip(
                                                  message: 'Lưu BOM giá',
                                                  child: IconButton(
                                                    onPressed: _gCodeCtrl.text.trim().isEmpty ? null : () => _saveBomGia(),
                                                    icon: const Icon(Icons.save),
                                                  ),
                                                ),
                                                Tooltip(
                                                  message: 'Clone BOM NVL -> BOM giá',
                                                  child: IconButton(
                                                    onPressed: _gCodeCtrl.text.trim().isEmpty ? null : _cloneBomSxToBomGia,
                                                    icon: const Icon(Icons.copy),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                          Expanded(
                                            child: _bomGia.isEmpty
                                                ? Padding(
                                                    padding: const EdgeInsets.all(12),
                                                    child: Text(
                                                      'Chưa có BOM giá',
                                                      style: TextStyle(color: scheme.onSurfaceVariant),
                                                    ),
                                                  )
                                                : _buildBomGrid(
                                                    cols: _bomGiaCols,
                                                    rows: _bomGiaRows,
                                                    onChanged: (e) {
                                                      final raw = e.row.cells['__raw__']?.value;
                                                      if (raw is Map<String, dynamic>) {
                                                        raw[e.column.field] = e.value;
                                                      }
                                                    },
                                                  ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
