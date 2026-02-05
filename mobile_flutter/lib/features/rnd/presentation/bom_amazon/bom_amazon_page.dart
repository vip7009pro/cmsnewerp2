import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pluto_grid/pluto_grid.dart';

import '../../../../app/app_drawer.dart';
import '../../../../core/config/app_config.dart';
import '../../../../core/providers.dart';
import '../../../../core/utils/excel_exporter.dart';
import '../../../auth/application/auth_notifier.dart';
import '../../../auth/application/auth_state.dart';

class BomAmazonPage extends ConsumerStatefulWidget {
  const BomAmazonPage({super.key});

  @override
  ConsumerState<BomAmazonPage> createState() => _BomAmazonPageState();
}

class _BomAmazonPageState extends ConsumerState<BomAmazonPage> {
  bool _loading = false;
  bool _showFilter = true;
  bool _enableEdit = false;

  final TextEditingController _codeSearchCtrl = TextEditingController(text: '');

  List<Map<String, dynamic>> _codePhoiList = const [];
  String _gCodeMau = '7A07994A';

  List<Map<String, dynamic>> _codeInfoRows = const [];
  List<Map<String, dynamic>> _listAmazonRows = const [];
  List<Map<String, dynamic>> _bomAmazonRows = const [];

  String _codeinfoCMS = '';
  String _codeinfoKD = '';

  String _amzCountry = '';
  String _amzProdName = '';

  final TextEditingController _amzProdNameCtrl = TextEditingController();
  final TextEditingController _amzCountryCtrl = TextEditingController();

  @override
  void dispose() {
    _codeSearchCtrl.dispose();
    _amzProdNameCtrl.dispose();
    _amzCountryCtrl.dispose();
    super.dispose();
  }

  Future<Map<String, dynamic>> _post(String command, Map<String, dynamic> data) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(command, data: data);
    final body = res.data;
    if (body is Map<String, dynamic>) return body;
    return <String, dynamic>{'tk_status': 'NG', 'message': 'Bad response'};
  }

  bool _isNg(Map<String, dynamic> body) => (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  String _s(dynamic v) => (v ?? '').toString();

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  AuthAuthenticated? _auth() {
    final s = ref.read(authNotifierProvider);
    return s is AuthAuthenticated ? s : null;
  }

  bool _isRndUser() {
    final a = _auth();
    if (a == null) return false;
    final md = (a.session.user.mainDeptName ?? '').toUpperCase();
    final sd = (a.session.user.subDeptName ?? '').toUpperCase();
    return md.contains('RND') || sd.contains('RND');
  }

  String _emplNo() {
    final a = _auth();
    return a?.session.user.emplNo ?? '';
  }

  Future<void> _init() async {
    await _loadListAmazon(gName: '');
    await _loadCodePhoi();
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _init());
  }

  Future<void> _loadCodePhoi() async {
    try {
      final body = await _post('loadcodephoi', {});
      if (_isNg(body)) return;
      final data = body['data'];
      final list = (data is List ? data : const [])
          .whereType<Map>()
          .map((e) => e.map((k, v) => MapEntry(k.toString(), v)))
          .toList();
      if (!mounted) return;
      setState(() {
        _codePhoiList = list;
        if (_codePhoiList.isNotEmpty) {
          _gCodeMau = _s(_codePhoiList.first['G_CODE_MAU']).isEmpty ? _gCodeMau : _s(_codePhoiList.first['G_CODE_MAU']);
        }
      });
    } catch (_) {}
  }

  Future<void> _loadCodeInfo() async {
    setState(() => _loading = true);
    try {
      final body = await _post('codeinfo', {'G_NAME': _codeSearchCtrl.text.trim()});
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() => _loading = false);
        _snack('Lỗi: ${_s(body['message'])}');
        return;
      }

      final data = body['data'];
      final list = (data is List ? data : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList(growable: false);

      if (!mounted) return;
      setState(() {
        _codeInfoRows = list;
        _loading = false;
      });
      _snack('Đã load ${list.length} dòng');
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Future<void> _loadListAmazon({required String gName}) async {
    try {
      final body = await _post('listAmazon', {'G_NAME': gName});
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() => _listAmazonRows = const []);
        return;
      }

      final data = body['data'];
      final list = (data is List ? data : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList(growable: false);

      if (!mounted) return;
      setState(() => _listAmazonRows = list);
    } catch (_) {}
  }

  Future<void> _loadBomAmazon({required String gCode}) async {
    setState(() => _loading = true);
    try {
      final body = await _post('getBOMAMAZON', {'G_CODE': gCode});
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() {
          _bomAmazonRows = const [];
          _loading = false;
        });
        return;
      }

      final data = body['data'];
      final list = (data is List ? data : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList();

      if (list.isNotEmpty) {
        _amzCountry = _s(list.first['AMZ_COUNTRY']);
        _amzProdName = _s(list.first['AMZ_PROD_NAME']);
        _codeinfoCMS = _s(list.first['G_CODE']);
        _codeinfoKD = _s(list.first['G_NAME']);
      }

      if (!mounted) return;
      setState(() {
        _bomAmazonRows = list;
        _loading = false;
        _amzCountryCtrl.text = _amzCountry;
        _amzProdNameCtrl.text = _amzProdName;
        _enableEdit = true;
        _showFilter = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Future<void> _loadBomAmazonEmpty({required String gCode, required String gName}) async {
    setState(() => _loading = true);
    try {
      final body = await _post('getBOMAMAZON_EMPTY', {'G_CODE_MAU': _gCodeMau});
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() {
          _bomAmazonRows = const [];
          _loading = false;
        });
        return;
      }

      final data = body['data'];
      final list = (data is List ? data : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .map((e) {
        return {
          'G_CODE': gCode,
          'G_NAME': gName,
          ...e,
          'GIATRI': '',
          'REMARK': '',
          'DOITUONG_NAME2': e['DOITUONG_NAME2'] ?? '',
        };
      }).toList(growable: false);

      if (!mounted) return;
      if (_codeinfoCMS != gCode) {
        setState(() => _loading = false);
        return;
      }
      setState(() {
        _bomAmazonRows = list;
        _loading = false;
        _enableEdit = true;
        _showFilter = false;
        _amzCountry = '';
        _amzProdName = '';
        _amzCountryCtrl.text = '';
        _amzProdNameCtrl.text = '';
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Future<bool> _confirm({required String title, required String body}) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(title),
        content: Text(body),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Cancel')),
          FilledButton(onPressed: () => Navigator.of(ctx).pop(true), child: const Text('OK')),
        ],
      ),
    );
    return ok == true;
  }

  Future<String?> _askPassword() async {
    final ctrl = TextEditingController();
    final pass = await showDialog<String?>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Xác nhận'),
        content: TextField(
          controller: ctrl,
          obscureText: true,
          decoration: const InputDecoration(labelText: 'Nhập mật mã'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(null), child: const Text('Cancel')),
          FilledButton(onPressed: () => Navigator.of(ctx).pop(ctrl.text), child: const Text('OK')),
        ],
      ),
    );
    ctrl.dispose();
    return pass;
  }

  Future<bool> _checkExistBomAmazon(String gCode) async {
    try {
      final body = await _post('checkExistBOMAMAZON', {'G_CODE': gCode});
      if (_isNg(body)) return false;
      final data = body['data'];
      if (data is List) return data.isNotEmpty;
      return false;
    } catch (_) {
      return false;
    }
  }

  Future<void> _saveBomAmazon() async {
    if (!_isRndUser()) {
      _snack('Bạn không có quyền (RND)');
      return;
    }

    if (_codeinfoCMS.trim().isEmpty) {
      _snack('Chọn code trước');
      return;
    }

    final ok = await _confirm(title: 'Xác nhận', body: 'Chắc chắn muốn lưu BOM AMAZON?');
    if (!ok) return;

    setState(() => _loading = true);
    try {
      final exists = await _checkExistBomAmazon(_codeinfoCMS);

      for (final r in _bomAmazonRows) {
        final payload = <String, dynamic>{
          'G_CODE': _codeinfoCMS,
          'G_CODE_MAU': exists ? _s(r['G_CODE_MAU']) : _gCodeMau,
          'DOITUONG_NO': r['DOITUONG_NO'],
          'GIATRI': r['GIATRI'],
          'REMARK': r['REMARK'],
          'AMZ_PROD_NAME': _amzProdName,
          'AMZ_COUNTRY': _amzCountry,
        };

        if (exists) {
          payload['DOITUONG_NAME2'] = r['DOITUONG_NAME2'];
          await _post('updateAmazonBOM', payload);
        } else {
          await _post('insertAmazonBOM', payload);
        }
      }

      await _loadListAmazon(gName: '');
      if (!mounted) return;
      setState(() => _loading = false);
      _snack(exists ? 'Đã update BOM AMAZON' : 'Đã thêm BOM AMAZON mới');
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Future<void> _updateAmazonCodeInfo() async {
    if (_codeinfoCMS.trim().isEmpty) {
      _snack('Chọn code trước');
      return;
    }

    final pass = await _askPassword();
    if (pass == null) return;
    if (pass != 'okema') {
      _snack('Sai mật mã');
      return;
    }

    try {
      final body = await _post('updateAmazonBOMCodeInfo', {
        'G_CODE': _codeinfoCMS,
        'AMZ_PROD_NAME': _amzProdName,
        'AMZ_COUNTRY': _amzCountry,
      });
      if (_isNg(body)) {
        _snack('Update thất bại: ${_s(body['message'])}');
        return;
      }
      _snack('Update data thành công');
    } catch (e) {
      _snack('Lỗi: $e');
    }
  }

  List<PlutoColumn> _colsFor(List<Map<String, dynamic>> rows, List<String> prefer, {Set<String> hidden = const {}}) {
    final keys = <String>{};
    for (final r in rows) {
      keys.addAll(r.keys);
    }

    final fields = <String>[];
    for (final p in prefer) {
      if (keys.contains(p)) fields.add(p);
    }
    final remain = keys.difference(fields.toSet()).toList()..sort();
    fields.addAll(remain);

    PlutoColumn col(String f) {
      final hide = hidden.contains(f);
      return PlutoColumn(
        title: f,
        field: f,
        type: PlutoColumnType.text(),
        width: hide ? 0 : 120,
        hide: hide,
        enableEditingMode: _enableEdit,
        enableColumnDrag: false,
      );
    }

    return [for (final f in fields) col(f)];
  }

  List<PlutoRow> _rowsFor(List<Map<String, dynamic>> rows, List<PlutoColumn> cols) {
    return [
      for (final r in rows)
        PlutoRow(
          cells: {
            for (final c in cols) c.field: PlutoCell(value: r[c.field]),
          },
        ),
    ];
  }

  Widget _grid({
    Key? gridKey,
    required List<Map<String, dynamic>> rows,
    required List<PlutoColumn> cols,
    required List<PlutoRow> plutoRows,
    void Function(PlutoGridOnChangedEvent e)? onChanged,
    void Function(Map<String, dynamic> raw)? onRowTap,
    void Function(PlutoGridOnRowDoubleTapEvent e)? onRowDoubleTap,
  }) {
    if (rows.isEmpty) {
      return const Center(child: Text('Chưa có dữ liệu'));
    }

    return LayoutBuilder(
      builder: (ctx, constraints) {
        return ClipRect(
          child: SizedBox(
            width: constraints.maxWidth,
            child: PlutoGrid(
              key: gridKey,
              columns: cols,
              rows: plutoRows,
              onLoaded: (e) {
                e.stateManager.setShowColumnFilter(true);
                e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
              },
              onSelected: (e) {
                final row = e.row;
                if (row == null) return;
                final data = <String, dynamic>{};
                for (final c in row.cells.entries) {
                  data[c.key] = c.value.value;
                }
                onRowTap?.call(data);
              },
              onRowDoubleTap: (e) {
                final row = e.row;
                final data = <String, dynamic>{};
                for (final c in row.cells.entries) {
                  data[c.key] = c.value.value;
                }
                onRowTap?.call(data);

                onRowDoubleTap?.call(e);
              },
              onChanged: onChanged,
              configuration: const PlutoGridConfiguration(
                columnSize: PlutoGridColumnSizeConfig(autoSizeMode: PlutoAutoSizeMode.scale),
                style: PlutoGridStyleConfig(
                  rowHeight: 32,
                  columnHeight: 32,
                  cellTextStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
                  columnTextStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w900),
                  defaultCellPadding: EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final dropdownTextColor = Theme.of(context).brightness == Brightness.dark ? Theme.of(context).colorScheme.onSurface : Colors.black87;

    final codeInfoCols = _colsFor(
      _codeInfoRows,
      const ['G_CODE', 'G_NAME', 'G_NAME_KD'],
    );
    final codeInfoPlutoRows = _rowsFor(_codeInfoRows, codeInfoCols);

    final listAmazonCols = _colsFor(
      _listAmazonRows,
      const ['G_NAME', 'G_NAME_KD', 'G_CODE'],
    );
    final listAmazonPlutoRows = _rowsFor(_listAmazonRows, listAmazonCols);

    final bomCols = _colsFor(
      _bomAmazonRows,
      const [
        'G_CODE',
        'G_NAME',
        'G_CODE_MAU',
        'TEN_MAU',
        'DOITUONG_NO',
        'DOITUONG_NAME',
        'GIATRI',
        'REMARK',
        'DOITUONG_NAME2',
        'PHANLOAI_DT',
      ],
    ).map((c) {
      if (c.field != 'DOITUONG_NAME2') return c;

      return PlutoColumn(
        title: c.title,
        field: c.field,
        type: PlutoColumnType.text(),
        width: c.width,
        hide: c.hide,
        enableEditingMode: false,
        enableColumnDrag: false,
        renderer: (ctx) {
          final raw = (ctx.cell.value ?? '').toString();
          final phanLoai = (ctx.row.cells['PHANLOAI_DT']?.value ?? '').toString().toUpperCase();
          final allowSelect = phanLoai == 'QRCODE' || phanLoai == '2D MATRIX';
          if (!allowSelect) return Text(raw);

          final current = raw;
          final disabled = !_enableEdit;

          return DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              isExpanded: true,
              value: current.isEmpty ? '' : current,
              dropdownColor: Theme.of(context).colorScheme.surface,
              iconEnabledColor: dropdownTextColor,
              style: TextStyle(color: dropdownTextColor, fontWeight: FontWeight.w700, fontSize: 11),
              onChanged: disabled
                  ? null
                  : (v) {
                      final empl = _emplNo();
                      final canChangeAny = empl == 'NHU1903' || empl == 'NVD1201';
                      final old = (ctx.row.cells['DOITUONG_NAME2']?.value ?? '').toString();
                      if (!canChangeAny && old.isNotEmpty) {
                        _snack('Chỉ thay đổi 1 lần');
                        return;
                      }

                      final newVal = v ?? '';
                      setState(() {
                        ctx.row.cells['DOITUONG_NAME2']?.value = newVal;
                        final idx = _bomAmazonRows.indexWhere((e) => _s(e['DOITUONG_NO']) == _s(ctx.row.cells['DOITUONG_NO']?.value));
                        if (idx >= 0) {
                          _bomAmazonRows[idx]['DOITUONG_NAME2'] = newVal;
                        }
                      });
                    },
              items: const [
                DropdownMenuItem(value: '', child: Text('Chọn')),
                DropdownMenuItem(value: 'QRCODE', child: Text('QRCODE')),
                DropdownMenuItem(value: '2D MATRIX', child: Text('2D MATRIX')),
              ],
            ),
          );
        },
      );
    }).toList(growable: false);

    final bomPlutoRows = _rowsFor(_bomAmazonRows, bomCols);

    return Scaffold(
      appBar: AppBar(
        title: const Text('RND / BOM AMAZON'),
        actions: [
          IconButton(
            onPressed: () => setState(() => _showFilter = !_showFilter),
            icon: Icon(_showFilter ? Icons.filter_alt_off : Icons.filter_alt),
            tooltip: _showFilter ? 'Ẩn bộ lọc' : 'Hiện bộ lọc',
          ),
          IconButton(
            onPressed: () {
              if (!_isRndUser()) {
                _snack('Bạn không có quyền (RND)');
                return;
              }
              setState(() => _enableEdit = !_enableEdit);
            },
            icon: Icon(_enableEdit ? Icons.edit_off : Icons.edit),
            tooltip: _enableEdit ? 'Tắt sửa' : 'Bật sửa',
          ),
        ],
      ),
      drawer: const AppDrawer(title: 'ERP'),
      body: RefreshIndicator(
        onRefresh: () async {
          await _loadListAmazon(gName: '');
          await _loadCodePhoi();
        },
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              children: [
                if (_showFilter)
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                      child: Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        crossAxisAlignment: WrapCrossAlignment.center,
                        children: [
                          ConstrainedBox(
                            constraints: const BoxConstraints(maxWidth: 280),
                            child: DropdownButtonHideUnderline(
                              child: DropdownButton<String>(
                                isExpanded: true,
                                value: _gCodeMau,
                                dropdownColor: Theme.of(context).colorScheme.surface,
                                iconEnabledColor: dropdownTextColor,
                                style: TextStyle(color: dropdownTextColor, fontWeight: FontWeight.w700),
                                onChanged: _loading ? null : (v) => setState(() => _gCodeMau = v ?? _gCodeMau),
                                items: _codePhoiList
                                    .map(
                                      (e) => DropdownMenuItem(
                                        value: _s(e['G_CODE_MAU']),
                                        child: Text(_s(e['G_NAME']), overflow: TextOverflow.ellipsis),
                                      ),
                                    )
                                    .toList(),
                              ),
                            ),
                          ),
                          SizedBox(
                            width: 260,
                            child: TextField(
                              controller: _codeSearchCtrl,
                              decoration: const InputDecoration(labelText: 'All Code (G_NAME)'),
                              textInputAction: TextInputAction.search,
                              onSubmitted: (_) => _loadCodeInfo(),
                            ),
                          ),
                          FilledButton.icon(
                            onPressed: _loading ? null : _loadCodeInfo,
                            icon: const Icon(Icons.search),
                            label: const Text('Tìm code'),
                          ),
                        ],
                      ),
                    ),
                  ),
                if (_loading) const LinearProgressIndicator(),
                const SizedBox(height: 12),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Row(
                          children: [
                            const Expanded(child: Text('CODE INFO', style: TextStyle(fontWeight: FontWeight.w900))),
                            OutlinedButton.icon(
                              onPressed: _codeInfoRows.isEmpty
                                  ? null
                                  : () => ExcelExporter.shareAsXlsx(
                                        fileName: 'code_info_${DateTime.now().millisecondsSinceEpoch}.xlsx',
                                        rows: _codeInfoRows,
                                      ),
                              icon: const Icon(Icons.table_view),
                              label: const Text('Excel'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        SizedBox(
                          height: 260,
                          child: _grid(
                            rows: _codeInfoRows,
                            cols: codeInfoCols,
                            plutoRows: codeInfoPlutoRows,
                            onRowTap: (raw) async {
                              final gCode = _s(raw['G_CODE']);
                              final gName = _s(raw['G_NAME']);
                              setState(() {
                                _codeinfoCMS = gCode;
                                _codeinfoKD = gName;
                                _bomAmazonRows = const [];
                                _enableEdit = true;
                                _showFilter = false;
                                _amzCountry = '';
                                _amzProdName = '';
                                _amzCountryCtrl.text = '';
                                _amzProdNameCtrl.text = '';
                              });
                              await _loadBomAmazonEmpty(gCode: gCode, gName: gName);
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        const Text('LIST CODE ĐÃ CÓ BOM AMAZON', style: TextStyle(fontWeight: FontWeight.w900)),
                        const SizedBox(height: 8),
                        SizedBox(
                          height: 220,
                          child: _grid(
                            rows: _listAmazonRows,
                            cols: listAmazonCols,
                            plutoRows: listAmazonPlutoRows,
                            onRowTap: (raw) async {
                              final gCode = _s(raw['G_CODE']);
                              if (gCode.isEmpty) return;
                              await _loadBomAmazon(gCode: gCode);
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          crossAxisAlignment: WrapCrossAlignment.center,
                          children: [
                            Text(
                              'BOM AMAZON (${_enableEdit ? 'Bật Sửa' : 'Tắt Sửa'})',
                              style: const TextStyle(fontWeight: FontWeight.w900),
                            ),
                            FilledButton.icon(
                              onPressed: _loading ? null : _saveBomAmazon,
                              icon: const Icon(Icons.save),
                              label: const Text('Lưu BOM'),
                            ),
                            OutlinedButton.icon(
                              onPressed: _bomAmazonRows.isEmpty
                                  ? null
                                  : () => ExcelExporter.shareAsXlsx(
                                        fileName: 'bom_amazon_${_codeinfoCMS}_${DateTime.now().millisecondsSinceEpoch}.xlsx',
                                        rows: _bomAmazonRows,
                                      ),
                              icon: const Icon(Icons.table_view),
                              label: const Text('Excel'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        SizedBox(
                          height: 340,
                          child: _grid(
                            gridKey: ValueKey('bom_${_codeinfoCMS.trim()}_${_bomAmazonRows.length}'),
                            rows: _bomAmazonRows,
                            cols: bomCols,
                            plutoRows: bomPlutoRows,
                            onChanged: !_enableEdit
                                ? null
                                : (e) {
                                    final idx = _bomAmazonRows.indexWhere((x) => _s(x['DOITUONG_NO']) == _s(e.row.cells['DOITUONG_NO']?.value));
                                    if (idx < 0) return;
                                    setState(() {
                                      _bomAmazonRows[idx][e.column.field] = e.value;
                                    });
                                  },
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text(
                          _codeinfoCMS.trim().isEmpty ? 'Chưa chọn code' : '$_codeinfoCMS: $_codeinfoKD',
                          style: const TextStyle(fontWeight: FontWeight.w900),
                        ),
                        const SizedBox(height: 8),
                        const Text('Thông tin sản phẩm', style: TextStyle(fontWeight: FontWeight.w900)),
                        const SizedBox(height: 8),
                        if (_codeinfoCMS.trim().isNotEmpty)
                          SizedBox(
                            height: 240,
                            child: Image.network(
                              '${AppConfig.imageBaseUrl}/amazon_image/AMZ_${_codeinfoCMS.trim()}.jpg',
                              fit: BoxFit.contain,
                              errorBuilder: (ctx, err, st) => const Center(child: Text('Không có ảnh')),
                            ),
                          ),
                        const SizedBox(height: 8),
                        TextField(
                          controller: _amzProdNameCtrl,
                          maxLines: 3,
                          decoration: const InputDecoration(labelText: 'Tên sản phẩm thực tế'),
                          onChanged: (v) => _amzProdName = v,
                        ),
                        const SizedBox(height: 8),
                        TextField(
                          controller: _amzCountryCtrl,
                          decoration: const InputDecoration(labelText: 'Thị trường'),
                          onChanged: (v) => _amzCountry = v,
                        ),
                        const SizedBox(height: 12),
                        FilledButton(
                          onPressed: _loading ? null : _updateAmazonCodeInfo,
                          child: const Text('UPDATE'),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
