import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pluto_grid/pluto_grid.dart';

import '../../../app/app_drawer.dart';
import '../../../core/providers.dart';

class CustomerManagerPage extends ConsumerStatefulWidget {
  const CustomerManagerPage({super.key});

  @override
  ConsumerState<CustomerManagerPage> createState() => _CustomerManagerPageState();
}

class _CustomerManagerPageState extends ConsumerState<CustomerManagerPage> {
  final _offlineFilterCtrl = TextEditingController();

  bool _loading = false;
  bool _gridView = true;

  List<Map<String, dynamic>> _rows = const [];
  List<Map<String, dynamic>> _filteredRows = const [];

  List<PlutoColumn> _gridColumns = const [];
  List<PlutoRow> _gridRows = const [];

  Map<String, dynamic> _selected = const {
    'CUST_TYPE': 'KH',
    'CUST_CD': '',
    'CUST_NAME_KD': '',
    'CUST_NAME': '',
    'CUST_ADDR1': '',
    'CUST_ADDR2': '',
    'CUST_ADDR3': '',
    'EMAIL': '',
    'TAX_NO': '',
    'CUST_NUMBER': '',
    'BOSS_NAME': '',
    'TEL_NO1': '',
    'FAX_NO': '',
    'CUST_POSTAL': '',
    'REMK': '',
    'USE_YN': 'Y',
  };

  @override
  void dispose() {
    _offlineFilterCtrl.dispose();
    super.dispose();
  }

  String _s(dynamic v) => (v ?? '').toString();

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
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

  String _zeroPad(int num, int places) => num.toString().padLeft(places, '0');

  Future<String> _autoGenerateCustCd(String custType) async {
    var next = '${custType}001';
    try {
      final res = await _post('checkcustcd', {'COMPANY_TYPE': custType});
      if (_isNg(res)) return next;
      final data = res['data'];
      if (data is List && data.isNotEmpty && data.first is Map) {
        final last = Map<String, dynamic>.from(data.first as Map);
        final lastCd = _s(last['CUST_CD']).trim();
        if (lastCd.isNotEmpty) {
          final stt = custType == 'KH'
              ? (lastCd.length >= 5 ? lastCd.substring(2, 5) : '')
              : (lastCd.length >= 6 ? lastCd.substring(3, 6) : '');
          final cur = int.tryParse(stt) ?? 0;
          next = custType + _zeroPad(cur + 1, 3);
        }
      }
    } catch (_) {}
    return next;
  }

  Future<void> _loadData() async {
    setState(() => _loading = true);
    try {
      final res = await _post('get_listcustomer', {});
      if (!mounted) return;
      if (_isNg(res)) {
        setState(() {
          _loading = false;
          _rows = const [];
          _filteredRows = const [];
          _gridColumns = const [];
          _gridRows = const [];
        });
        _snack('Lỗi: ${(res['message'] ?? 'NG').toString()}');
        return;
      }

      final data = res['data'];
      final list = (data is List ? data : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .map((e) {
        String safeStr(dynamic v) {
          final s = _s(v);
          if (s.toLowerCase() == 'undefined') return '';
          return s;
        }

        return {
          ...e,
          'CUST_NAME': safeStr(e['CUST_NAME']),
          'CUST_NAME_KD': safeStr(e['CUST_NAME_KD']),
          'CUST_ADDR1': safeStr(e['CUST_ADDR1']),
          'CUST_ADDR2': safeStr(e['CUST_ADDR2']),
          'CUST_ADDR3': safeStr(e['CUST_ADDR3']),
          'EMAIL': safeStr(e['EMAIL']),
          'TAX_NO': safeStr(e['TAX_NO']),
          'CUST_NUMBER': safeStr(e['CUST_NUMBER']),
          'BOSS_NAME': safeStr(e['BOSS_NAME']),
          'TEL_NO1': safeStr(e['TEL_NO1']),
          'FAX_NO': safeStr(e['FAX_NO']),
          'CUST_POSTAL': safeStr(e['CUST_POSTAL']),
          'REMK': safeStr(e['REMK']),
          'USE_YN': safeStr(e['USE_YN']).isEmpty ? 'Y' : safeStr(e['USE_YN']),
          'CUST_TYPE': safeStr(e['CUST_TYPE']).isEmpty ? 'KH' : safeStr(e['CUST_TYPE']),
        };
      }).toList();

      final cols = _buildPlutoColumns(list);
      final rws = _buildPlutoRows(list, cols);

      setState(() {
        _rows = list;
        _filteredRows = list;
        _gridColumns = cols;
        _gridRows = rws;
        _loading = false;
      });

      _applyOfflineFilter();
      _snack('Đã load ${list.length} dòng');
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  void _applyOfflineFilter() {
    final q = _offlineFilterCtrl.text.trim().toLowerCase();
    if (q.isEmpty) {
      setState(() => _filteredRows = _rows);
      return;
    }

    bool match(Map<String, dynamic> r) {
      return _s(r['CUST_CD']).toLowerCase().contains(q) ||
          _s(r['CUST_NAME_KD']).toLowerCase().contains(q) ||
          _s(r['CUST_NAME']).toLowerCase().contains(q) ||
          _s(r['TAX_NO']).toLowerCase().contains(q);
    }

    setState(() => _filteredRows = _rows.where(match).toList());
  }

  List<String> _prioritizedFields(List<Map<String, dynamic>> rows) {
    final keys = <String>{};
    for (final r in rows) {
      keys.addAll(r.keys);
    }

    final preferred = <String>[
      'CUST_TYPE',
      'CUST_CD',
      'CUST_NAME_KD',
      'CUST_NAME',
      'CUST_ADDR1',
      'CUST_ADDR2',
      'CUST_ADDR3',
      'TAX_NO',
      'CUST_NUMBER',
      'BOSS_NAME',
      'TEL_NO1',
      'FAX_NO',
      'CUST_POSTAL',
      'EMAIL',
      'REMK',
      'USE_YN',
    ];

    final out = <String>['__raw__'];
    for (final f in preferred) {
      if (keys.contains(f)) out.add(f);
    }
    final remain = keys.difference(out.toSet()).toList()..sort();
    out.addAll(remain);
    return out;
  }

  List<PlutoColumn> _buildPlutoColumns(List<Map<String, dynamic>> rows) {
    final fields = _prioritizedFields(rows);

    PlutoColumn col(String field) {
      return PlutoColumn(
        title: field,
        field: field,
        type: PlutoColumnType.text(),
        width: field == 'CUST_NAME' ? 180 : 120,
        minWidth: 80,
        hide: field == '__raw__',
        enableContextMenu: false,
        enableDropToResize: true,
        renderer: (ctx) {
          if (field != 'USE_YN') {
            final v = (ctx.cell.value ?? '').toString();
            return Text(
              v,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontSize: 11),
            );
          }

          final v = (ctx.cell.value ?? '').toString().trim().toUpperCase();
          final use = v == 'Y';
          return Container(
            decoration: BoxDecoration(
              color: use ? Colors.green : Colors.red,
              borderRadius: BorderRadius.circular(4),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
            child: Text(
              use ? 'USE' : 'NOT USE',
              style: const TextStyle(fontSize: 11, color: Colors.white, fontWeight: FontWeight.w700),
            ),
          );
        },
      );
    }

    return [
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
      for (final f in fields) if (f != '__raw__') col(f),
    ];
  }

  List<PlutoRow> _buildPlutoRows(List<Map<String, dynamic>> rows, List<PlutoColumn> columns) {
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

  Future<void> _createNewCustomer(String custType) async {
    final nextCd = await _autoGenerateCustCd(custType);
    setState(() {
      _selected = {
        'id': '0',
        'CUST_TYPE': custType,
        'CUST_CD': nextCd,
        'CUST_NAME_KD': '',
        'CUST_NAME': '',
        'CUST_ADDR1': '',
        'CUST_ADDR2': '',
        'CUST_ADDR3': '',
        'EMAIL': '',
        'TAX_NO': '',
        'CUST_NUMBER': '',
        'BOSS_NAME': '',
        'TEL_NO1': '',
        'FAX_NO': '',
        'CUST_POSTAL': '',
        'REMK': '',
        'USE_YN': 'Y',
      };
    });
  }

  Future<void> _openAddUpdateDialog() async {
    final temp = Map<String, dynamic>.from(_selected);

    final ctrls = <String, TextEditingController>{
      'CUST_CD': TextEditingController(text: _s(temp['CUST_CD'])),
      'CUST_NAME_KD': TextEditingController(text: _s(temp['CUST_NAME_KD'])),
      'CUST_NAME': TextEditingController(text: _s(temp['CUST_NAME'])),
      'CUST_ADDR1': TextEditingController(text: _s(temp['CUST_ADDR1'])),
      'CUST_ADDR2': TextEditingController(text: _s(temp['CUST_ADDR2'])),
      'CUST_ADDR3': TextEditingController(text: _s(temp['CUST_ADDR3'])),
      'TAX_NO': TextEditingController(text: _s(temp['TAX_NO'])),
      'CUST_NUMBER': TextEditingController(text: _s(temp['CUST_NUMBER'])),
      'BOSS_NAME': TextEditingController(text: _s(temp['BOSS_NAME'])),
      'TEL_NO1': TextEditingController(text: _s(temp['TEL_NO1'])),
      'FAX_NO': TextEditingController(text: _s(temp['FAX_NO'])),
      'CUST_POSTAL': TextEditingController(text: _s(temp['CUST_POSTAL'])),
      'REMK': TextEditingController(text: _s(temp['REMK'])),
      'EMAIL': TextEditingController(text: _s(temp['EMAIL'])),
    };

    String custType = _s(temp['CUST_TYPE']).trim().isEmpty ? 'KH' : _s(temp['CUST_TYPE']).trim();
    String useYn = _s(temp['USE_YN']).trim().isEmpty ? 'Y' : _s(temp['USE_YN']).trim();

    Future<void> doAdd(Map<String, dynamic> payload) async {
      setState(() => _loading = true);
      try {
        final res = await _post('add_customer', payload);
        if (!mounted) return;
        setState(() => _loading = false);
        if (_isNg(res)) {
          _snack('Thêm khách thất bại: ${(res['message'] ?? 'NG').toString()}');
          return;
        }
        _snack('Thêm khách thành công');
        await _loadData();
      } catch (e) {
        if (!mounted) return;
        setState(() => _loading = false);
        _snack('Lỗi: $e');
      }
    }

    Future<void> doUpdate(Map<String, dynamic> payload) async {
      setState(() => _loading = true);
      try {
        final res = await _post('edit_customer', payload);
        if (!mounted) return;
        setState(() => _loading = false);
        if (_isNg(res)) {
          _snack('Sửa khách thất bại: ${(res['message'] ?? 'NG').toString()}');
          return;
        }
        _snack('Sửa khách thành công');
        await _loadData();
      } catch (e) {
        if (!mounted) return;
        setState(() => _loading = false);
        _snack('Lỗi: $e');
      }
    }

    if (!mounted) return;
    await showDialog<void>(
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

            Widget tf(String key, String label, {TextInputType? keyboardType}) {
              return TextField(
                controller: ctrls[key],
                decoration: dec(label),
                keyboardType: keyboardType,
              );
            }

            DropdownButtonFormField<String> dd({
              required String label,
              required String value,
              required List<DropdownMenuItem<String>> items,
              required void Function(String v) onChanged,
            }) {
              return DropdownButtonFormField<String>(
                initialValue: value,
                items: items,
                style: TextStyle(color: scheme.onSurface),
                dropdownColor: scheme.surface,
                iconEnabledColor: scheme.onSurface,
                onChanged: (nv) {
                  final v = (nv ?? '').toString();
                  onChanged(v);
                  setLocal(() {});
                },
                decoration: dec(label),
              );
            }

            return AlertDialog(
              title: Text('Add/Update Customer (CUST_CD: ${ctrls['CUST_CD']?.text.trim().isEmpty == true ? '-' : ctrls['CUST_CD']?.text.trim()})'),
              content: SizedBox(
                width: 560,
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      field(tf('CUST_CD', 'Mã KH (CUST_CD)')),
                      field(tf('CUST_NAME_KD', 'Tên KH (KD) (CUST_NAME_KD)')),
                      field(tf('CUST_NAME', 'Tên KH (FULL) (CUST_NAME)')),
                      field(tf('CUST_ADDR1', 'Địa chỉ chính (CUST_ADDR1)')),
                      field(tf('CUST_ADDR2', 'Địa chỉ 2 (CUST_ADDR2)')),
                      field(tf('CUST_ADDR3', 'Địa chỉ 3 (CUST_ADDR3)')),
                      field(tf('TAX_NO', 'MST (TAX_NO)')),
                      field(tf('CUST_NUMBER', 'Số ĐT (CUST_NUMBER)')),
                      field(tf('BOSS_NAME', 'Tên chủ (BOSS_NAME)')),
                      field(tf('TEL_NO1', 'Số phone (TEL_NO1)')),
                      field(tf('FAX_NO', 'Fax (FAX_NO)')),
                      field(tf('CUST_POSTAL', 'Mã bưu điện (CUST_POSTAL)')),
                      field(tf('REMK', 'Remark (REMK)')),
                      field(tf('EMAIL', 'Email (EMAIL)')),
                      field(
                        dd(
                          label: 'Phân loại (CUST_TYPE)',
                          value: custType,
                          items: const [
                            DropdownMenuItem(value: 'KH', child: Text('Khách Hàng')),
                            DropdownMenuItem(value: 'NCC', child: Text('Nhà Cung Cấp')),
                          ],
                          onChanged: (v) async {
                            custType = v;
                            final next = await _autoGenerateCustCd(custType);
                            ctrls['CUST_CD']?.text = next;
                          },
                        ),
                      ),
                      field(
                        dd(
                          label: 'Mở/Khóa (USE_YN)',
                          value: useYn,
                          items: const [
                            DropdownMenuItem(value: 'Y', child: Text('Mở')),
                            DropdownMenuItem(value: 'N', child: Text('Khóa')),
                          ],
                          onChanged: (v) {
                            useYn = v;
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () async {
                    await _createNewCustomer(custType);
                    if (!ctx2.mounted) return;
                    Navigator.pop(ctx2);
                    await _openAddUpdateDialog();
                  },
                  child: const Text('Clear'),
                ),
                FilledButton(
                  onPressed: () async {
                    final payload = {
                      ...temp,
                      'CUST_TYPE': custType,
                      'USE_YN': useYn,
                      for (final e in ctrls.entries) e.key: e.value.text.trim(),
                    };
                    await doAdd(payload);
                  },
                  child: const Text('Add'),
                ),
                FilledButton(
                  onPressed: () async {
                    final payload = {
                      ...temp,
                      'CUST_TYPE': custType,
                      'USE_YN': useYn,
                      for (final e in ctrls.entries) e.key: e.value.text.trim(),
                    };
                    await doUpdate(payload);
                  },
                  child: const Text('Update'),
                ),
                TextButton(
                  onPressed: () => Navigator.pop(ctx2),
                  child: const Text('Đóng'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadData();
    });
  }

  @override
  Widget build(BuildContext context) {
    final list = _filteredRows;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Quản lý khách hàng'),
        actions: [
          IconButton(
            onPressed: _loadData,
            icon: const Icon(Icons.refresh),
            tooltip: 'Load Data',
          ),
          IconButton(
            onPressed: _openAddUpdateDialog,
            icon: const Icon(Icons.add),
            tooltip: 'Add/Update',
          ),
          IconButton(
            onPressed: () => setState(() => _gridView = !_gridView),
            icon: Icon(_gridView ? Icons.view_agenda : Icons.grid_on),
            tooltip: _gridView ? 'List view' : 'Grid view',
          ),
        ],
      ),
      drawer: const AppDrawer(title: 'ERP'),
      body: RefreshIndicator(
        onRefresh: () async => _loadData(),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            children: [
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _offlineFilterCtrl,
                          decoration: const InputDecoration(
                            labelText: 'Filter offline (CUST_CD / CUST_NAME / TAX_NO)',
                          ),
                          onChanged: (_) => _applyOfflineFilter(),
                        ),
                      ),
                      const SizedBox(width: 8),
                      TextButton(
                        onPressed: () {
                          _offlineFilterCtrl.text = '';
                          _applyOfflineFilter();
                        },
                        child: const Text('Clear'),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Expanded(
                child: _loading
                    ? const Center(child: CircularProgressIndicator())
                    : _gridView
                        ? Card(
                            child: Padding(
                              padding: const EdgeInsets.all(8),
                              child: _gridColumns.isEmpty
                                  ? const Center(child: Text('Chưa có dữ liệu'))
                                  : PlutoGrid(
                                      columns: _gridColumns,
                                      rows: _gridRows,
                                      onLoaded: (e) {
                                        e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                                      },
                                      onRowDoubleTap: (e) async {
                                        final raw = e.row.cells['__raw__']?.value;
                                        if (raw is Map<String, dynamic>) {
                                          setState(() => _selected = raw);
                                          await _openAddUpdateDialog();
                                        }
                                      },
                                      onSelected: (e) {
                                        final raw = e.row?.cells['__raw__']?.value;
                                        if (raw is Map<String, dynamic>) {
                                          setState(() => _selected = raw);
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
                                    ),
                            ),
                          )
                        : ListView.builder(
                            itemCount: list.length,
                            itemBuilder: (ctx, i) {
                              final it = list[i];
                              final cd = _s(it['CUST_CD']);
                              final kd = _s(it['CUST_NAME_KD']);
                              final name = _s(it['CUST_NAME']);
                              final use = _s(it['USE_YN']).trim().toUpperCase() == 'Y';
                              return Card(
                                child: ListTile(
                                  dense: true,
                                  title: Text(
                                    '${cd.isEmpty ? '-' : cd}  |  ${kd.isEmpty ? name : kd}',
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  subtitle: Text(
                                    name,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  trailing: Container(
                                    decoration: BoxDecoration(
                                      color: use ? Colors.green : Colors.red,
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    child: Text(
                                      use ? 'USE' : 'NOT USE',
                                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700),
                                    ),
                                  ),
                                  onTap: () => setState(() => _selected = it),
                                  onLongPress: () async {
                                    setState(() => _selected = it);
                                    await _openAddUpdateDialog();
                                  },
                                ),
                              );
                            },
                          ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
