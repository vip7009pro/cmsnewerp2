import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pluto_grid/pluto_grid.dart';

import '../../../../app/app_drawer.dart';
import '../../../../core/providers.dart';
import '../../../auth/application/auth_notifier.dart';
import '../../../auth/application/auth_state.dart';

class SampleMonitorPage extends ConsumerStatefulWidget {
  const SampleMonitorPage({super.key});

  @override
  ConsumerState<SampleMonitorPage> createState() => _SampleMonitorPageState();
}

class _SampleMonitorPageState extends ConsumerState<SampleMonitorPage> {
  bool _loading = false;

  final TextEditingController _ycsxCtrl = TextEditingController();

  List<Map<String, dynamic>> _rows = const [];

  List<Map<String, dynamic>> _ycsxInfo = const [];

  PlutoGridStateManager? _sm;

  String _s(dynamic v) => (v ?? '').toString();

  AuthAuthenticated? _auth() {
    final s = ref.read(authNotifierProvider);
    return s is AuthAuthenticated ? s : null;
  }

  String _mainDeptTag() {
    final a = _auth();
    final md = (a?.session.user.mainDeptName ?? '').toUpperCase();
    if (md.contains('RND')) return 'RND';
    if (md.contains('QC')) return 'QC';
    if (md.contains('KD') || md.contains('KINH')) return 'KD';
    if (md.contains('MUA')) return 'MUA';
    if (md.contains('KHO')) return 'KHO';
    return md;
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
      _loadSampleList();
    });
  }

  @override
  void dispose() {
    _ycsxCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadSampleList() async {
    setState(() => _loading = true);
    try {
      final body = await _post('loadSampleMonitorTable', {});
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() {
          _rows = const [];
          _loading = false;
        });
        _snack('Lỗi: ${_s(body['message'])}');
        return;
      }

      final data = body['data'];
      final list = (data is List ? data : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList(growable: false);

      if (!mounted) return;
      setState(() {
        _rows = list;
        _loading = false;
      });

      _sm?.removeAllRows();
      _sm?.appendRows(_buildGridRows(list));
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Future<void> _loadYcsxInfo(String ycsx) async {
    if (ycsx.trim().length != 7) {
      setState(() => _ycsxInfo = const []);
      return;
    }

    try {
      final body = await _post('ycsx_fullinfo', {'PROD_REQUEST_NO': ycsx.trim()});
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() => _ycsxInfo = const []);
        return;
      }
      final data = body['data'];
      final list = (data is List ? data : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList(growable: false);
      if (!mounted) return;
      setState(() => _ycsxInfo = list);
    } catch (_) {}
  }

  Future<void> _addSample() async {
    if (_ycsxInfo.isEmpty) {
      _snack('Hãy nhập số YCSX');
      return;
    }
    final y = _ycsxInfo.first;
    try {
      final body = await _post('addMonitoringSample', {
        'PROD_REQUEST_NO': y['PROD_REQUEST_NO'],
        'G_NAME_KD': y['G_NAME_KD'],
        'G_CODE': y['G_CODE'],
        'REQ_ID': 0,
      });
      if (_isNg(body)) {
        final msg = _s(body['message']);
        if (msg.toUpperCase().contains('PRIMARY KEY')) {
          _snack('Thêm sample thất bại, ycsx này đã thêm rồi');
        } else {
          _snack('Thêm sample thất bại: $msg');
        }
        return;
      }
      _snack('Thêm sample thành công');
      await _loadSampleList();
    } catch (e) {
      _snack('Lỗi: $e');
    }
  }

  Future<void> _lockSample(String useYn) async {
    if (_sm == null) return;
    final checked = _sm!.checkedRows;
    if (checked.isEmpty) {
      _snack('Chọn ít nhất 1 dòng');
      return;
    }

    String err = '';
    for (final r in checked) {
      final raw = r.cells['__raw__']?.value;
      if (raw is! Map<String, dynamic>) continue;
      try {
        final body = await _post('lockSample', {
          'SAMPLE_ID': raw['SAMPLE_ID'],
          'USE_YN': useYn,
        });
        if (_isNg(body)) err += '| ${_s(body['message'])}';
      } catch (e) {
        err += '| $e';
      }
    }

    if (err.isEmpty) {
      _snack('Cập nhật thành công');
    } else {
      _snack('Cập nhật thất bại: $err');
    }

    await _loadSampleList();
  }

  Future<void> _saveSelected() async {
    if (_sm == null) return;
    final checked = _sm!.checkedRows;
    if (checked.isEmpty) {
      _snack('Chọn ít nhất 1 dòng');
      return;
    }

    final dept = _mainDeptTag();

    for (final r in checked) {
      final raw = r.cells['__raw__']?.value;
      if (raw is! Map<String, dynamic>) continue;

      final dataToUpdate = _collectRowData(r, raw);
      try {
        switch (dept) {
          case 'RND':
            await _post('updateRND_SAMPLE_STATUS', {
              'SAMPLE_ID': dataToUpdate['SAMPLE_ID'],
              'FILE_MAKET': dataToUpdate['FILE_MAKET'],
              'FILM_FILE': dataToUpdate['FILM_FILE'],
              'KNIFE_STATUS': dataToUpdate['KNIFE_STATUS'],
              'KNIFE_CODE': dataToUpdate['KNIFE_CODE'],
              'FILM': dataToUpdate['FILM'],
            });
            break;
          case 'SX':
            await _post('updateSX_SAMPLE_STATUS', {
              'SAMPLE_ID': dataToUpdate['SAMPLE_ID'],
              'PRINT_STATUS': dataToUpdate['PRINT_STATUS'],
              'DIECUT_STATUS': dataToUpdate['DIECUT_STATUS'],
            });
            break;
          case 'QC':
            await _post('updateQC_SAMPLE_STATUS', {
              'SAMPLE_ID': dataToUpdate['SAMPLE_ID'],
              'QC_STATUS': dataToUpdate['QC_STATUS'],
            });
            break;
          case 'KD':
            await _post('updateAPPROVE_SAMPLE_STATUS', {
              'SAMPLE_ID': dataToUpdate['SAMPLE_ID'],
              'APPROVE_STATUS': dataToUpdate['APPROVE_STATUS'],
              'USE_YN': dataToUpdate['USE_YN'],
              'REMARK': dataToUpdate['REMARK'],
            });
            break;
          case 'MUA':
          case 'KHO':
            await _post('updateMATERIAL_STATUS', {
              'SAMPLE_ID': dataToUpdate['SAMPLE_ID'],
              'MATERIAL_STATUS': dataToUpdate['MATERIAL_STATUS'],
            });
            break;
          default:
            _snack('Bạn không thuộc bộ phận hợp lệ');
            return;
        }
      } catch (e) {
        _snack('Lỗi update: $e');
      }
    }

    _snack('Update data thành công');
    await _loadSampleList();
  }

  Map<String, dynamic> _collectRowData(PlutoRow row, Map<String, dynamic> raw) {
    final updated = Map<String, dynamic>.from(raw);
    for (final e in row.cells.entries) {
      if (e.key == '__check__' || e.key == '__raw__') continue;
      updated[e.key] = e.value.value;
    }
    return updated;
  }

  List<PlutoColumn> _buildColumns() {
    PlutoColumn text(
      String field, {
      double width = 120,
      bool editable = false,
      PlutoColumnFrozen frozen = PlutoColumnFrozen.none,
      PlutoColumnTextAlign align = PlutoColumnTextAlign.left,
      Widget Function(PlutoColumnRendererContext ctx)? renderer,
    }) {
      return PlutoColumn(
        title: field,
        field: field,
        type: PlutoColumnType.text(),
        width: width,
        enableEditingMode: editable,
        frozen: frozen,
        enableColumnDrag: false,
        enableDropToResize: true,
        enableContextMenu: false,
        textAlign: align,
        titleTextAlign: align,
        renderer: renderer,
      );
    }

    PlutoColumn statusToggle(
      String field, {
      required String title,
      required Color Function(String v) bg,
      required bool editable,
      double width = 120,
      PlutoColumnFrozen frozen = PlutoColumnFrozen.none,
      bool isRadioTri = false,
    }) {
      return PlutoColumn(
        title: title,
        field: field,
        type: PlutoColumnType.text(),
        width: width,
        enableEditingMode: false,
        frozen: frozen,
        enableColumnDrag: false,
        enableDropToResize: true,
        enableContextMenu: false,
        renderer: (ctx) {
          final v = _s(ctx.cell.value).toUpperCase();
          final canEdit = !_loading && editable;

          Widget inner;
          if (isRadioTri) {
            inner = DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                isExpanded: true,
                value: (v == 'Y' || v == 'N') ? v : 'P',
                onChanged: !canEdit
                    ? null
                    : (nv) {
                        final newVal = nv ?? 'P';
                        setState(() {
                          ctx.row.cells[field]?.value = newVal;
                        });
                      },
                items: const [
                  DropdownMenuItem(value: 'P', child: Text('PENDING')),
                  DropdownMenuItem(value: 'Y', child: Text('OK')),
                  DropdownMenuItem(value: 'N', child: Text('NG')),
                ],
              ),
            );
          } else {
            inner = Checkbox(
              value: v == 'Y',
              onChanged: !canEdit
                  ? null
                  : (checked) {
                      setState(() {
                        ctx.row.cells[field]?.value = checked == true ? 'Y' : 'N';
                      });
                    },
            );
          }

          final bgc = bg(v);
          final txt = isRadioTri
              ? (v == 'Y'
                  ? 'COMPLETED'
                  : v == 'N'
                      ? 'NG'
                      : 'PENDING')
              : (v == 'Y' ? 'COMPLETED' : 'PENDING');

          return Container(
            padding: const EdgeInsets.symmetric(horizontal: 6),
            color: bgc,
            child: Row(
              children: [
                SizedBox(width: 40, child: FittedBox(fit: BoxFit.scaleDown, child: inner)),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    txt,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                      color: ThemeData.estimateBrightnessForColor(bgc) == Brightness.dark ? Colors.white : Colors.black,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          );
        },
      );
    }

    Color ynColor(String v) => v == 'Y' ? const Color(0xFF77DA41) : const Color(0xFFE7A44B);

    Color qcColor(String v) {
      if (v == 'Y') return const Color(0xFF77DA41);
      if (v == 'N') return const Color(0xFFFF0000);
      return const Color(0xFFE7A44B);
    }

    Color approveColor(String v) {
      if (v == 'Y') return const Color(0xFF06D436);
      if (v == 'N') return const Color(0xFFFF0000);
      return const Color(0xFFE7A44B);
    }

    PlutoColumn totalStatus() {
      return PlutoColumn(
        title: 'TOTAL_STATUS',
        field: 'TOTAL_STATUS',
        type: PlutoColumnType.text(),
        width: 120,
        enableEditingMode: false,
        enableColumnDrag: false,
        enableDropToResize: true,
        enableContextMenu: false,
        renderer: (ctx) {
          final row = ctx.row;
          bool ok = true;
          bool isY(String f) => _s(row.cells[f]?.value).toUpperCase() == 'Y';

          ok =
              isY('FILE_MAKET') &&
              isY('FILM_FILE') &&
              isY('KNIFE_STATUS') &&
              _s(row.cells['KNIFE_CODE']?.value).trim().isNotEmpty &&
              isY('FILM') &&
              isY('PRINT_STATUS') &&
              isY('DIECUT_STATUS') &&
              isY('MATERIAL_STATUS') &&
              _s(row.cells['QC_STATUS']?.value).toUpperCase() == 'Y';

          final bgc = ok ? const Color(0xFF0AA03C) : const Color(0xFFD8000E);
          return Container(
            color: bgc,
            alignment: Alignment.center,
            child: Text(
              ok ? 'COMPLETED' : 'NOT COMPLETED',
              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 11),
            ),
          );
        },
      );
    }

    return [
      PlutoColumn(
        title: '✓',
        field: '__check__',
        type: PlutoColumnType.text(),
        width: 44,
        enableRowChecked: true,
        enableSorting: false,
        enableFilterMenuItem: false,
        enableColumnDrag: false,
        frozen: PlutoColumnFrozen.start,
      ),
      PlutoColumn(
        title: '',
        field: '__raw__',
        type: PlutoColumnType.text(),
        width: 0,
        hide: true,
        enableContextMenu: false,
      ),
      text('SAMPLE_ID', width: 80, frozen: PlutoColumnFrozen.start),
      text('PROD_REQUEST_NO', width: 90),
      text('CUST_NAME_KD', width: 120),
      text('G_CODE', width: 90),
      text('G_NAME_KD', width: 160),
      text('G_NAME', width: 160),
      text('G_WIDTH', width: 90, align: PlutoColumnTextAlign.right),
      text('G_LENGTH', width: 90, align: PlutoColumnTextAlign.right),
      text('DELIVERY_DT', width: 110),
      text(
        'PROD_REQUEST_QTY',
        width: 110,
        align: PlutoColumnTextAlign.right,
        renderer: (ctx) {
          final v = ctx.cell.value;
          final n = v is num ? v : num.tryParse(_s(v).replaceAll(',', ''));
          return Align(
            alignment: Alignment.centerRight,
            child: Text(n == null ? _s(v) : n.toStringAsFixed(0)),
          );
        },
      ),
      statusToggle('FILE_MAKET', title: 'FILE_MAKET', bg: ynColor, editable: _mainDeptTag() == 'RND', width: 150),
      statusToggle('FILM_FILE', title: 'FILM_FILE', bg: ynColor, editable: _mainDeptTag() == 'RND', width: 150),
      statusToggle('KNIFE_STATUS', title: 'KNIFE_STATUS', bg: ynColor, editable: _mainDeptTag() == 'RND', width: 150),
      text('KNIFE_CODE', width: 120, editable: _mainDeptTag() == 'RND'),
      statusToggle('FILM', title: 'FILM', bg: ynColor, editable: _mainDeptTag() == 'RND', width: 150),
      statusToggle('MATERIAL_STATUS', title: 'MATERIAL_STATUS', bg: ynColor, editable: _mainDeptTag() == 'MUA' || _mainDeptTag() == 'KHO', width: 160),
      statusToggle('PRINT_STATUS', title: 'PRINT_STATUS', bg: ynColor, editable: _mainDeptTag() == 'SX', width: 150),
      statusToggle('DIECUT_STATUS', title: 'DIECUT_STATUS', bg: ynColor, editable: _mainDeptTag() == 'SX', width: 150),
      statusToggle('QC_STATUS', title: 'QC_STATUS', bg: qcColor, editable: _mainDeptTag() == 'QC', width: 170, isRadioTri: true),
      totalStatus(),
      statusToggle('APPROVE_STATUS', title: 'APPROVE_STATUS', bg: approveColor, editable: _mainDeptTag() == 'KD', width: 190, isRadioTri: true),
      text('APPROVE_DATE', width: 110),
      text('REMARK', width: 180, editable: _mainDeptTag() == 'KD'),
      statusToggle('USE_YN', title: 'USE_YN', bg: (v) => v == 'Y' ? const Color(0xFF06D436) : const Color(0xFFFF0000), editable: _mainDeptTag() == 'KD', width: 120, isRadioTri: true),
      text('INS_DATE', width: 110),
      text('INS_EMPL', width: 120),
    ];
  }

  List<PlutoRow> _buildGridRows(List<Map<String, dynamic>> rows) {
    return [
      for (final r in rows)
        PlutoRow(
          cells: {
            '__check__': PlutoCell(value: ''),
            '__raw__': PlutoCell(value: r),
            for (final k in r.keys) k: PlutoCell(value: r[k]),
          },
        ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final cols = _buildColumns();
    final gridRows = _buildGridRows(_rows);

    return Scaffold(
      appBar: AppBar(
        title: const Text('RND / SAMPLE MONITOR'),
        actions: [
          IconButton(
            onPressed: _loading ? null : _loadSampleList,
            icon: const Icon(Icons.refresh),
            tooltip: 'Reload',
          ),
          IconButton(
            onPressed: _loading ? null : _saveSelected,
            icon: const Icon(Icons.save),
            tooltip: 'Save',
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
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                child: Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                    SizedBox(
                      width: 180,
                      child: TextField(
                        controller: _ycsxCtrl,
                        decoration: const InputDecoration(labelText: 'Số YCSX', hintText: '1F80008'),
                        onChanged: (v) {
                          if (v.trim().length == 7) {
                            _loadYcsxInfo(v);
                          } else {
                            setState(() => _ycsxInfo = const []);
                          }
                        },
                      ),
                    ),
                    Text(
                      _ycsxInfo.isEmpty ? '' : '${_s(_ycsxInfo.first['G_NAME_KD'])} | ${_s(_ycsxInfo.first['G_NAME'])}',
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800),
                      overflow: TextOverflow.ellipsis,
                    ),
                    FilledButton.icon(
                      onPressed: _loading ? null : _addSample,
                      icon: const Icon(Icons.add),
                      label: const Text('Add Sample'),
                    ),
                    OutlinedButton.icon(
                      onPressed: _loading ? null : () => _lockSample('N'),
                      icon: const Icon(Icons.lock),
                      label: const Text('Khóa Sample'),
                    ),
                    OutlinedButton.icon(
                      onPressed: _loading ? null : () => _lockSample('Y'),
                      icon: const Icon(Icons.lock_open),
                      label: const Text('Mở Sample'),
                    ),
                  ],
                ),
              ),
            ),
            if (_loading) const LinearProgressIndicator(),
            const SizedBox(height: 12),
            Expanded(
              child: ClipRect(
                child: PlutoGrid(
                  columns: cols,
                  rows: gridRows,
                  onLoaded: (e) {
                    _sm = e.stateManager;
                    e.stateManager.setShowColumnFilter(true);
                    e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                  },
                  onRowChecked: (_) {
                    setState(() {});
                  },
                  onChanged: (e) {
                    final idx = _rows.indexWhere((x) => _s(x['SAMPLE_ID']) == _s(e.row.cells['SAMPLE_ID']?.value));
                    if (idx < 0) return;
                    setState(() {
                      _rows[idx][e.column.field] = e.value;
                    });
                  },
                  configuration: const PlutoGridConfiguration(
                    columnSize: PlutoGridColumnSizeConfig(autoSizeMode: PlutoAutoSizeMode.none),
                    style: PlutoGridStyleConfig(
                      rowHeight: 34,
                      columnHeight: 34,
                      cellTextStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
                      columnTextStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w900),
                      defaultCellPadding: EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
