import 'dart:async';
import 'dart:io';

import 'package:excel/excel.dart' as xls;
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:path_provider/path_provider.dart';
import 'package:pluto_grid/pluto_grid.dart';
import 'package:share_plus/share_plus.dart';

import '../../../app/app_drawer.dart';
import '../../../core/providers.dart';
import '../../auth/application/auth_notifier.dart';
import '../../auth/application/auth_state.dart';

class FcstManagerPage extends ConsumerStatefulWidget {
  const FcstManagerPage({super.key});

  @override
  ConsumerState<FcstManagerPage> createState() => _FcstManagerPageState();
}

class _FcstManagerPageState extends ConsumerState<FcstManagerPage> {
  DateTime _fromDate = DateTime.now();
  DateTime _toDate = DateTime.now();

  bool _allTime = false;
  bool _showFilter = true;

  final _codeKdCtrl = TextEditingController();
  final _codeCmsCtrl = TextEditingController();
  final _custNameCtrl = TextEditingController();
  final _emplNameCtrl = TextEditingController();
  final _prodTypeCtrl = TextEditingController();
  final _idCtrl = TextEditingController();
  final _materialCtrl = TextEditingController();
  final _poNoCtrl = TextEditingController();
  final _overCtrl = TextEditingController();

  bool _loading = false;
  List<Map<String, dynamic>> _rows = const [];

  bool _gridView = false;
  List<PlutoColumn> _gridColumns = const [];
  List<PlutoRow> _gridRows = const [];
  PlutoGridStateManager? _gridSm;

  final Set<int> _selectedIds = <int>{};

  List<Map<String, dynamic>>? _customerCache;
  final Map<String, List<Map<String, dynamic>>> _codeCache = <String, List<Map<String, dynamic>>>{};

  int _sumTotalQty = 0;

  @override
  void dispose() {
    _codeKdCtrl.dispose();
    _codeCmsCtrl.dispose();
    _custNameCtrl.dispose();
    _emplNameCtrl.dispose();
    _prodTypeCtrl.dispose();
    _idCtrl.dispose();
    _materialCtrl.dispose();
    _poNoCtrl.dispose();
    _overCtrl.dispose();
    super.dispose();
  }

  bool get _isAllSelected => _rows.isNotEmpty && _selectedIds.length == _rows.length;

  void _toggleSelectAll(bool? v) {
    setState(() {
      if (v == true) {
        _selectedIds
          ..clear()
          ..addAll(_rows.map((e) => _toInt(e['FCST_ID'])));
      } else {
        _selectedIds.clear();
      }

      if (_gridColumns.isNotEmpty) {
        _gridRows = _buildPlutoRows(_rows, _gridColumns);
      }
    });
  }

  List<String> _prioritizedFields(List<Map<String, dynamic>> rows) {
    final keys = <String>{};
    for (final r in rows) {
      keys.addAll(r.keys);
    }

    final preferred = <String>[
      'FCST_ID',
      'FCSTYEAR',
      'FCSTWEEKNO',
      'CUST_NAME_KD',
      'CUST_CD',
      'G_CODE',
      'G_NAME_KD',
      'G_NAME',
      'PO_NO',
      'PROD_TYPE',
      'PROD_PROJECT',
      'PROD_MODEL',
      'PROD_MAIN_MATERIAL',
      'PROD_PRICE',
      'EMPL_NAME',
      'EMPL_NO',
      ...List<String>.generate(22, (i) => 'W${i + 1}'),
      ...List<String>.generate(22, (i) => 'W${i + 1}A'),
      'REMARK',
    ];

    final out = <String>[];
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
      final isWeek = RegExp(r'^W(\d{1,2})(A)?$').hasMatch(field);
      return PlutoColumn(
        title: field,
        field: field,
        type: PlutoColumnType.text(),
        enableContextMenu: false,
        enableSorting: true,
        enableFilterMenuItem: true,
        width: isWeek ? 80 : 120,
        minWidth: isWeek ? 70 : 90,
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
        title: '',
        field: '__raw__',
        type: PlutoColumnType.text(),
        width: 0,
        hide: true,
        enableContextMenu: false,
        enableSorting: false,
        enableFilterMenuItem: false,
      ),
      PlutoColumn(
        title: '✓',
        field: '__check__',
        type: PlutoColumnType.text(),
        width: 44,
        enableContextMenu: false,
        enableSorting: false,
        enableFilterMenuItem: false,
        enableRowChecked: true,
      ),
      for (final f in fields) col(f),
    ];
  }

  List<PlutoRow> _buildPlutoRows(
    List<Map<String, dynamic>> rows,
    List<PlutoColumn> columns,
  ) {
    Object? val(Map<String, dynamic> it, String field) {
      if (field == '__raw__') return it;
      if (field == '__check__') return '';
      return (it[field] ?? '').toString();
    }

    return [
      for (final it in rows)
        PlutoRow(
          checked: _selectedIds.contains(_toInt(it['FCST_ID'])),
          cells: {
            for (final c in columns) c.field: PlutoCell(value: val(it, c.field)),
          },
        ),
    ];
  }

  void _syncSelectedFromGrid(PlutoGridStateManager sm) {
    final checked = sm.checkedRows;
    setState(() {
      _selectedIds
        ..clear()
        ..addAll(
          checked
              .map((r) => r.cells['__raw__']?.value)
              .whereType<Map<String, dynamic>>()
              .map((raw) => _toInt(raw['FCST_ID'])),
        );
    });
  }

  Widget _buildGrid(ColorScheme scheme) {
    if (_gridColumns.isEmpty) return const SizedBox.shrink();
    return PlutoGrid(
      columns: _gridColumns,
      rows: _gridRows,
      onLoaded: (e) {
        _gridSm = e.stateManager;
        e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
        e.stateManager.setShowColumnFilter(true);
      },
      onRowChecked: (_) {
        final sm = _gridSm;
        if (sm == null) return;
        _syncSelectedFromGrid(sm);
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

  String _ymd(DateTime d) {
    return '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';
  }

  String _fmtDateShort(String raw) {
    final s = raw.trim();
    if (s.length >= 10 && s[4] == '-' && s[7] == '-') {
      final y = s.substring(0, 4);
      final m = s.substring(5, 7);
      final d = s.substring(8, 10);
      return '$d/$m/$y';
    }
    return s;
  }

  int _toInt(dynamic v) {
    if (v == null) return 0;
    if (v is int) return v;
    return int.tryParse(v.toString()) ?? 0;
  }

  double _toDouble(dynamic v) {
    if (v == null) return 0;
    if (v is double) return v;
    if (v is int) return v.toDouble();
    return double.tryParse(v.toString()) ?? 0;
  }

  String _fmtInt(num v) {
    final s = v.round().toString();
    final b = StringBuffer();
    for (var i = 0; i < s.length; i++) {
      final idxFromEnd = s.length - i;
      b.write(s[i]);
      if (idxFromEnd > 1 && idxFromEnd % 3 == 1) b.write(',');
    }
    return b.toString();
  }

  String _fmtMoney(num v) {
    final neg = v < 0;
    final abs = v.abs();
    final s = abs.toStringAsFixed(2);
    final parts = s.split('.');
    final iPart = parts[0];
    final dPart = parts.length > 1 ? parts[1] : '00';
    final b = StringBuffer();
    for (var i = 0; i < iPart.length; i++) {
      final idxFromEnd = iPart.length - i;
      b.write(iPart[i]);
      if (idxFromEnd > 1 && idxFromEnd % 3 == 1) b.write(',');
    }
    return '${neg ? '-' : ''}${b.toString()}.$dPart';
  }

  Future<void> _pickDate({required bool from}) async {
    final initial = from ? _fromDate : _toDate;
    final picked = await showDatePicker(
      context: context,
      initialDate: initial,
      firstDate: DateTime(2020, 1, 1),
      lastDate: DateTime(2100, 12, 31),
    );
    if (picked == null) return;
    if (!mounted) return;
    setState(() {
      if (from) {
        _fromDate = picked;
        if (_fromDate.isAfter(_toDate)) _toDate = _fromDate;
      } else {
        _toDate = picked;
        if (_toDate.isBefore(_fromDate)) _fromDate = _toDate;
      }
    });
  }

  static List<Map<String, dynamic>> _filterCustomersIsolate(Map<String, dynamic> args) {
    final list = (args['list'] as List).cast<Map<String, dynamic>>();
    final q = (args['q'] as String).trim().toLowerCase();
    final limit = args['limit'] as int;
    if (q.isEmpty) return list.take(limit).toList();
    final out = <Map<String, dynamic>>[];
    for (final e in list) {
      final cd = (e['CUST_CD'] ?? '').toString().toLowerCase();
      final name = (e['CUST_NAME_KD'] ?? '').toString().toLowerCase();
      if (cd.contains(q) || name.contains(q)) {
        out.add(e);
        if (out.length >= limit) break;
      }
    }
    return out;
  }

  Future<List<Map<String, dynamic>>> _ensureCustomerList() async {
    if (_customerCache != null) return _customerCache!;
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand('selectcustomerList', data: {});
    final body = res.data;
    final data = (body is Map<String, dynamic> ? body['data'] : null);
    final list = (data is List ? data : const [])
        .map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{}))
        .toList();
    _customerCache = list;
    return list;
  }

  Future<List<Map<String, dynamic>>> _loadCodeList(String keyword) async {
    final key = keyword.trim();
    if (_codeCache.containsKey(key)) return _codeCache[key]!;
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand('selectcodeList', data: {'G_NAME': key});
    final body = res.data;
    final data = (body is Map<String, dynamic> ? body['data'] : null);
    final list = (data is List ? data : const [])
        .map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{}))
        .toList();
    _codeCache[key] = list;
    return list;
  }

  Future<Map<String, dynamic>?> _pickCustomer({String? initialCd, String? initialName}) async {
    final searchCtrl = TextEditingController(text: (initialCd ?? initialName ?? '').toString());
    Timer? debounce;

    List<Map<String, dynamic>> base = const [];
    List<Map<String, dynamic>> view = const [];
    var loading = true;

    Future<void> refresh(StateSetter setSheetState, String q) async {
      if (loading) return;
      loading = true;
      setSheetState(() {});
      final filtered = await compute(
        _filterCustomersIsolate,
        <String, dynamic>{'list': base, 'q': q, 'limit': 200},
      );
      view = filtered;
      loading = false;
      setSheetState(() {});
    }

    final selected = await showModalBottomSheet<Map<String, dynamic>>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (ctx) {
        final scheme = Theme.of(ctx).colorScheme;
        return StatefulBuilder(
          builder: (ctx, setSheetState) {
            Future<void> initIfNeeded() async {
              if (!loading || base.isNotEmpty) return;
              try {
                base = await _ensureCustomerList();
                view = await compute(
                  _filterCustomersIsolate,
                  <String, dynamic>{'list': base, 'q': searchCtrl.text, 'limit': 200},
                );
              } finally {
                loading = false;
                if (ctx.mounted) setSheetState(() {});
              }
            }

            initIfNeeded();

            return Padding(
              padding: EdgeInsets.only(
                left: 12,
                right: 12,
                bottom: MediaQuery.of(ctx).viewInsets.bottom + 12,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextField(
                    controller: searchCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Tìm khách (mã hoặc tên)',
                      prefixIcon: Icon(Icons.search),
                    ),
                    onChanged: (v) {
                      debounce?.cancel();
                      debounce = Timer(const Duration(milliseconds: 250), () {
                        refresh(setSheetState, v);
                      });
                    },
                  ),
                  const SizedBox(height: 8),
                  if (loading)
                    const Padding(
                      padding: EdgeInsets.all(16),
                      child: Center(child: CircularProgressIndicator()),
                    )
                  else
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Hiển thị ${view.length} / ${base.length} (giới hạn 200 kết quả)',
                        style: TextStyle(color: scheme.onSurfaceVariant),
                      ),
                    ),
                  const SizedBox(height: 8),
                  SizedBox(
                    height: MediaQuery.of(ctx).size.height * 0.55,
                    child: ListView.builder(
                      itemCount: view.length,
                      itemBuilder: (ctx, i) {
                        final r = view[i];
                        final cd = (r['CUST_CD'] ?? '').toString();
                        final name = (r['CUST_NAME_KD'] ?? '').toString();
                        return ListTile(
                          dense: true,
                          title: Text(name.isNotEmpty ? name : cd),
                          subtitle: Text(cd),
                          onTap: () => Navigator.of(ctx).pop(r),
                        );
                      },
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );

    debounce?.cancel();
    return selected;
  }

  Future<Map<String, dynamic>?> _pickCode({required String currentKeyword}) async {
    final searchCtrl = TextEditingController(text: currentKeyword);
    Timer? debounce;

    List<Map<String, dynamic>> view = const [];
    var loading = false;

    Future<void> doSearch(StateSetter setSheetState, String q) async {
      loading = true;
      setSheetState(() {});
      try {
        final list = await _loadCodeList(q);
        view = list.take(200).toList();
      } finally {
        loading = false;
        if (mounted) setSheetState(() {});
      }
    }

    final selected = await showModalBottomSheet<Map<String, dynamic>>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (ctx) {
        final scheme = Theme.of(ctx).colorScheme;
        return StatefulBuilder(
          builder: (ctx, setSheetState) {
            Future<void> initIfNeeded() async {
              if (view.isNotEmpty || loading) return;
              await doSearch(setSheetState, searchCtrl.text);
            }

            initIfNeeded();

            return Padding(
              padding: EdgeInsets.only(
                left: 12,
                right: 12,
                bottom: MediaQuery.of(ctx).viewInsets.bottom + 12,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextField(
                    controller: searchCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Tìm code (tên code)',
                      prefixIcon: Icon(Icons.search),
                    ),
                    onChanged: (v) {
                      debounce?.cancel();
                      debounce = Timer(const Duration(milliseconds: 250), () {
                        doSearch(setSheetState, v);
                      });
                    },
                  ),
                  const SizedBox(height: 8),
                  if (loading)
                    const Padding(
                      padding: EdgeInsets.all(16),
                      child: Center(child: CircularProgressIndicator()),
                    )
                  else
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Hiển thị ${view.length} kết quả (giới hạn 200)',
                        style: TextStyle(color: scheme.onSurfaceVariant),
                      ),
                    ),
                  const SizedBox(height: 8),
                  SizedBox(
                    height: MediaQuery.of(ctx).size.height * 0.55,
                    child: ListView.builder(
                      itemCount: view.length,
                      itemBuilder: (ctx, i) {
                        final r = view[i];
                        final gCode = (r['G_CODE'] ?? '').toString();
                        final gName = (r['G_NAME'] ?? '').toString();
                        final gNameKd = (r['G_NAME_KD'] ?? '').toString();
                        final title = gNameKd.isNotEmpty ? gNameKd : (gName.isNotEmpty ? gName : gCode);
                        return ListTile(
                          dense: true,
                          title: Text(title),
                          subtitle: Text(gCode),
                          onTap: () => Navigator.of(ctx).pop(r),
                        );
                      },
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );

    debounce?.cancel();
    return selected;
  }

  int _sumWeeks(Map<String, dynamic> r) {
    var sum = 0;
    for (var i = 1; i <= 22; i++) {
      sum += _toInt(r['W$i']);
    }
    return sum;
  }

  void _recalcSummary(List<Map<String, dynamic>> rows) {
    var total = 0;
    for (final r in rows) {
      total += _sumWeeks(r);
    }
    _sumTotalQty = total;
  }

  Future<void> _search() async {
    if (mounted) {
      setState(() {
        _loading = true;
        _showFilter = false;
        _selectedIds.clear();
      });
    }

    try {
      final api = ref.read(apiClientProvider);
      final res = await api.postCommand(
        'traFcstDataFull',
        data: {
          'alltime': _allTime,
          'justPoBalance': true,
          'start_date': _ymd(_fromDate),
          'end_date': _ymd(_toDate),
          'cust_name': _custNameCtrl.text.trim(),
          'codeCMS': _codeCmsCtrl.text.trim(),
          'codeKD': _codeKdCtrl.text.trim(),
          'prod_type': _prodTypeCtrl.text.trim(),
          'empl_name': _emplNameCtrl.text.trim(),
          'po_no': _poNoCtrl.text.trim(),
          'over': _overCtrl.text.trim(),
          'id': _idCtrl.text.trim(),
          'material': _materialCtrl.text.trim(),
        },
      );

      final body = res.data;
      if (body is Map<String, dynamic> && (body['tk_status'] ?? '').toString().toUpperCase() == 'NG') {
        if (!mounted) return;
        setState(() => _loading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text((body['message'] ?? 'NG').toString())),
        );
        return;
      }

      final data = (body is Map<String, dynamic> ? body['data'] : null);
      final list = (data is List ? data : const [])
          .map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{}))
          .toList();

      _recalcSummary(list);

      if (!mounted) return;
      setState(() {
        _rows = list;
        _gridColumns = _buildPlutoColumns(list);
        _gridRows = _buildPlutoRows(list, _gridColumns);
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  List<Map<String, dynamic>> _selectedRows() {
    if (_selectedIds.isEmpty) return const [];
    return _rows.where((r) => _selectedIds.contains(_toInt(r['FCST_ID']))).toList();
  }

  Future<bool> _checkFcstExists({required int year, required int weekNo, required String gCode, required String custCd}) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(
      'checkFcstExist',
      data: {
        'FCSTYEAR': year,
        'FCSTWEEKNO': weekNo,
        'G_CODE': gCode,
        'CUST_CD': custCd,
      },
    );
    final body = res.data;
    if (body is Map<String, dynamic> && (body['tk_status'] ?? '').toString().toUpperCase() != 'NG') return true;
    return false;
  }

  Future<int> _checkGCodeUseYn(String gCode) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand('checkGCodeVer', data: {'G_CODE': gCode});
    final body = res.data;
    if (body is Map<String, dynamic> && (body['tk_status'] ?? '').toString().toUpperCase() != 'NG') {
      final data = body['data'];
      if (data is List && data.isNotEmpty) {
        final first = data.first;
        if (first is Map && (first['USE_YN'] ?? '').toString().toUpperCase() == 'Y') return 0;
        return 1;
      }
      return 0;
    }
    return 2;
  }

  Future<void> _openAddFcstForm() async {
    final authState = ref.read(authNotifierProvider);
    final emplNo = authState is AuthAuthenticated ? authState.session.user.emplNo : '';

    final custCdCtrl = TextEditingController();
    final custNameCtrl = TextEditingController();
    final gCodeCtrl = TextEditingController();
    final gNameCtrl = TextEditingController();
    final yearCtrl = TextEditingController(text: DateTime.now().year.toString());
    final weekCtrl = TextEditingController(text: '1');
    final priceCtrl = TextEditingController(text: '0');

    final weekCtrls = List<TextEditingController>.generate(22, (_) => TextEditingController(text: '0'));

    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            left: 12,
            right: 12,
            top: 8,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 12,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Thêm FCST', style: Theme.of(ctx).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: custNameCtrl.text.isNotEmpty ? custNameCtrl : custCdCtrl,
                      readOnly: true,
                      decoration: InputDecoration(
                        labelText: 'Customer',
                        suffixIcon: IconButton(
                          onPressed: () async {
                            final picked = await _pickCustomer(initialCd: custCdCtrl.text, initialName: custNameCtrl.text);
                            if (picked == null) return;
                            custCdCtrl.text = (picked['CUST_CD'] ?? '').toString();
                            custNameCtrl.text = (picked['CUST_NAME_KD'] ?? '').toString();
                            if (mounted) setState(() {});
                          },
                          icon: const Icon(Icons.search),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: TextField(
                      controller: gNameCtrl.text.isNotEmpty ? gNameCtrl : gCodeCtrl,
                      readOnly: true,
                      decoration: InputDecoration(
                        labelText: 'Code',
                        suffixIcon: IconButton(
                          onPressed: () async {
                            final picked = await _pickCode(currentKeyword: gNameCtrl.text.isNotEmpty ? gNameCtrl.text : gCodeCtrl.text);
                            if (picked == null) return;
                            gCodeCtrl.text = (picked['G_CODE'] ?? '').toString();
                            gNameCtrl.text = (picked['G_NAME_KD'] ?? picked['G_NAME'] ?? '').toString();
                            if (mounted) setState(() {});
                          },
                          icon: const Icon(Icons.search),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(child: TextField(controller: yearCtrl, decoration: const InputDecoration(labelText: 'YEAR'), keyboardType: TextInputType.number)),
                  const SizedBox(width: 12),
                  Expanded(child: TextField(controller: weekCtrl, decoration: const InputDecoration(labelText: 'WEEKNO'), keyboardType: TextInputType.number)),
                  const SizedBox(width: 12),
                  Expanded(child: TextField(controller: priceCtrl, decoration: const InputDecoration(labelText: 'PROD_PRICE'), keyboardType: TextInputType.number)),
                ],
              ),
              const SizedBox(height: 12),
              Text('W1..W22', style: Theme.of(ctx).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Wrap(
                spacing: 10,
                runSpacing: 8,
                children: List<Widget>.generate(22, (i) {
                  final idx = i + 1;
                  return SizedBox(
                    width: 86,
                    child: TextField(
                      controller: weekCtrls[i],
                      decoration: InputDecoration(labelText: 'W$idx'),
                      keyboardType: TextInputType.number,
                    ),
                  );
                }),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: () async {
                    final messenger = ScaffoldMessenger.of(context);
                    final navigator = Navigator.of(ctx);

                    final custCd = custCdCtrl.text.trim();
                    final gCode = gCodeCtrl.text.trim();
                    final year = int.tryParse(yearCtrl.text.trim()) ?? 0;
                    final weekNo = int.tryParse(weekCtrl.text.trim()) ?? 0;
                    final price = double.tryParse(priceCtrl.text.trim()) ?? 0;

                    if (emplNo.isEmpty || custCd.isEmpty || gCode.isEmpty || year <= 0 || weekNo <= 0) {
                      messenger.showSnackBar(const SnackBar(content: Text('Thiếu thông tin bắt buộc')));
                      return;
                    }

                    final exists = await _checkFcstExists(year: year, weekNo: weekNo, gCode: gCode, custCd: custCd);
                    if (exists) {
                      messenger.showSnackBar(const SnackBar(content: Text('FCST đã tồn tại')));
                      return;
                    }

                    final gCodeCheck = await _checkGCodeUseYn(gCode);
                    if (gCodeCheck == 1) {
                      messenger.showSnackBar(const SnackBar(content: Text('Ver này đã bị khóa')));
                      return;
                    }
                    if (gCodeCheck == 2) {
                      messenger.showSnackBar(const SnackBar(content: Text('Không có Code ERP này')));
                      return;
                    }

                    final payload = <String, dynamic>{
                      'EMPL_NO': emplNo,
                      'CUST_CD': custCd,
                      'G_CODE': gCode,
                      'PROD_PRICE': price,
                      'YEAR': year,
                      'WEEKNO': weekNo,
                    };

                    for (var i = 0; i < 22; i++) {
                      payload['W${i + 1}'] = int.tryParse(weekCtrls[i].text.trim()) ?? 0;
                    }

                    try {
                      final api = ref.read(apiClientProvider);
                      final res = await api.postCommand('insert_fcst', data: payload);
                      final body = res.data;
                      if (body is Map<String, dynamic> && (body['tk_status'] ?? '').toString().toUpperCase() == 'NG') {
                        messenger.showSnackBar(SnackBar(content: Text('Thêm FCST thất bại: ${(body['message'] ?? 'NG').toString()}')));
                        return;
                      }

                      if (!mounted) return;
                      navigator.pop();
                      messenger.showSnackBar(const SnackBar(content: Text('Thêm FCST thành công')));
                      await _search();
                    } catch (e) {
                      if (!mounted) return;
                      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
                    }
                  },
                  child: const Text('Thêm'),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _deleteSelected() async {
    final selected = _selectedRows();
    if (selected.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Chọn ít nhất 1 FCST để xóa')));
      return;
    }

    final messenger = ScaffoldMessenger.of(context);
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Xóa FCST'),
        content: Text('Chắc chắn muốn xóa ${selected.length} FCST đã chọn? (chỉ xóa của user đăng nhập)'),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Hủy')),
          FilledButton(onPressed: () => Navigator.of(ctx).pop(true), child: const Text('Xóa')),
        ],
      ),
    );
    if (ok != true) return;
    if (!mounted) return;

    final authState = ref.read(authNotifierProvider);
    final emplNo = authState is AuthAuthenticated ? authState.session.user.emplNo : '';
    if (emplNo.isEmpty) return;

    try {
      final api = ref.read(apiClientProvider);
      var deleted = 0;
      var skipped = 0;
      var failed = 0;

      for (final r in selected) {
        final owner = (r['EMPL_NO'] ?? '').toString();
        if (owner.isNotEmpty && owner != emplNo) {
          skipped++;
          continue;
        }
        final fcstId = _toInt(r['FCST_ID']);
        final res = await api.postCommand('delete_fcst', data: {'FCST_ID': fcstId});
        final body = res.data;
        if (body is Map<String, dynamic> && (body['tk_status'] ?? '').toString().toUpperCase() == 'NG') {
          failed++;
        } else {
          deleted++;
        }
      }

      if (!mounted) return;
      messenger.showSnackBar(SnackBar(content: Text('Đã xóa: $deleted, bỏ qua: $skipped, lỗi: $failed')));
      await _search();
    } catch (e) {
      if (!mounted) return;
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  Future<void> _exportExcel() async {
    if (_rows.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Chưa có dữ liệu để xuất')));
      return;
    }

    final excel = xls.Excel.createExcel();
    final sheet = excel['FCST'];

    final headers = <String>[
      'FCST_ID',
      'FCSTYEAR',
      'FCSTWEEKNO',
      'G_CODE',
      'G_NAME_KD',
      'G_NAME',
      'DESCR',
      'EMPL_NO',
      'EMPL_NAME',
      'CUST_NAME_KD',
      'PROD_PROJECT',
      'PROD_MODEL',
      'PROD_MAIN_MATERIAL',
      'PROD_PRICE',
      ...List<String>.generate(22, (i) => 'W${i + 1}'),
      ...List<String>.generate(22, (i) => 'W${i + 1}A'),
    ];

    sheet.appendRow(headers.map((h) => xls.TextCellValue(h)).toList());
    for (final r in _rows) {
      sheet.appendRow(headers.map((h) => xls.TextCellValue((r[h] ?? '').toString())).toList());
    }

    final bytes = excel.encode();
    if (bytes == null) return;

    final dir = await getTemporaryDirectory();
    final filename = 'FCST_${DateTime.now().millisecondsSinceEpoch}.xlsx';
    final file = File('${dir.path}/$filename');
    await file.writeAsBytes(bytes, flush: true);

    await Share.shareXFiles([
      XFile(file.path, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    ]);
  }

  Widget _dBox(ColorScheme scheme, {required String label, required String value, Color? valueColor}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
      decoration: BoxDecoration(
        color: scheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: scheme.outlineVariant),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(label, style: TextStyle(fontSize: 11, color: scheme.onSurfaceVariant, fontWeight: FontWeight.w700)),
          const SizedBox(height: 2),
          Text(
            value,
            style: TextStyle(fontSize: 12, color: valueColor ?? scheme.onSurface, fontWeight: FontWeight.w900),
          ),
        ],
      ),
    );
  }

  Widget _fcstCard(BuildContext context, ColorScheme scheme, Map<String, dynamic> r) {
    final fcstId = _toInt(r['FCST_ID']);
    final selected = _selectedIds.contains(fcstId);

    final year = _toInt(r['FCSTYEAR']);
    final weekNo = _toInt(r['FCSTWEEKNO']);

    final gCode = (r['G_CODE'] ?? '').toString();
    final gNameKd = (r['G_NAME_KD'] ?? '').toString();
    final gName = (r['G_NAME'] ?? '').toString();

    final cust = (r['CUST_NAME_KD'] ?? '').toString();
    final empl = (r['EMPL_NAME'] ?? r['EMPL_NO'] ?? '').toString();

    final material = (r['PROD_MAIN_MATERIAL'] ?? '').toString();
    final project = (r['PROD_PROJECT'] ?? '').toString();
    final model = (r['PROD_MODEL'] ?? '').toString();

    final price = _toDouble(r['PROD_PRICE']);
    final sumQty = _sumWeeks(r);

    final wValues = List<int>.generate(22, (i) => _toInt(r['W${i + 1}']));
    final wAValues = List<double>.generate(22, (i) => _toDouble(r['W${i + 1}A']));

    return Card(
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () {
          setState(() {
            if (selected) {
              _selectedIds.remove(fcstId);
            } else {
              _selectedIds.add(fcstId);
            }
          });
        },
        child: Padding(
          padding: const EdgeInsets.fromLTRB(10, 10, 10, 10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 22,
                    height: 22,
                    decoration: BoxDecoration(
                      color: selected ? scheme.primary : scheme.surface,
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: selected ? scheme.primary : scheme.outlineVariant),
                    ),
                    child: selected ? Icon(Icons.check, size: 16, color: scheme.onPrimary) : null,
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'FCST $fcstId  •  $year-W$weekNo',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800, color: scheme.onSurface),
                    ),
                  ),
                  Text(_fmtInt(sumQty), style: TextStyle(color: scheme.primary, fontWeight: FontWeight.w900)),
                ],
              ),
              const SizedBox(height: 6),
              Text(cust, style: TextStyle(color: scheme.onSurfaceVariant, fontSize: 12, fontWeight: FontWeight.w700)),
              const SizedBox(height: 2),
              Text(gCode, style: TextStyle(color: scheme.onSurface, fontSize: 12, fontWeight: FontWeight.w900)),
              if (gNameKd.isNotEmpty || gName.isNotEmpty) ...[
                const SizedBox(height: 2),
                Text(gNameKd.isNotEmpty ? gNameKd : gName, style: TextStyle(color: scheme.onSurfaceVariant, fontSize: 12)),
              ],
              if (project.isNotEmpty || model.isNotEmpty || material.isNotEmpty) ...[
                const SizedBox(height: 2),
                Text(
                  [project, model, material].where((e) => e.trim().isNotEmpty).join(' • '),
                  style: TextStyle(color: scheme.onSurfaceVariant, fontSize: 12),
                ),
              ],
              const SizedBox(height: 2),
              Text(empl, style: TextStyle(color: scheme.onSurfaceVariant, fontSize: 12)),
              const SizedBox(height: 8),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    _dBox(scheme, label: 'PRICE', value: _fmtMoney(price)),
                    const SizedBox(width: 6),
                    _dBox(scheme, label: 'TOTAL_Q', value: _fmtInt(sumQty), valueColor: Colors.blue.shade700),
                    const SizedBox(width: 6),
                    _dBox(scheme, label: 'TOTAL_A', value: _fmtMoney(price * sumQty), valueColor: Colors.green.shade700),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: List<Widget>.generate(22, (i) {
                    return Padding(
                      padding: EdgeInsets.only(right: i == 21 ? 0 : 6),
                      child: _dBox(scheme, label: 'W${i + 1}', value: _fmtInt(wValues[i])),
                    );
                  }),
                ),
              ),
              const SizedBox(height: 8),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: List<Widget>.generate(22, (i) {
                    return Padding(
                      padding: EdgeInsets.only(right: i == 21 ? 0 : 6),
                      child: _dBox(scheme, label: 'W${i + 1}A', value: _fmtMoney(wAValues[i]), valueColor: Colors.green.shade700),
                    );
                  }),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final selectedCount = _selectedIds.length;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Quản lý FCST'),
        actions: [
          IconButton(
            onPressed: () {
              setState(() => _showFilter = !_showFilter);
            },
            icon: Icon(_showFilter ? Icons.filter_alt_off : Icons.filter_alt),
            tooltip: _showFilter ? 'Ẩn bộ lọc' : 'Hiện bộ lọc',
          ),
          IconButton(
            onPressed: () {
              setState(() => _gridView = !_gridView);
            },
            icon: Icon(_gridView ? Icons.view_agenda : Icons.grid_on),
            tooltip: _gridView ? 'List view' : 'Grid view',
          ),
          PopupMenuButton<String>(
            onSelected: (v) async {
              if (v == 'search') {
                await _search();
              } else if (v == 'add') {
                await _openAddFcstForm();
              } else if (v == 'delete') {
                await _deleteSelected();
              } else if (v == 'export') {
                await _exportExcel();
              }
            },
            itemBuilder: (ctx) => [
              const PopupMenuItem(value: 'search', child: Text('Tra cứu')),
              const PopupMenuDivider(),
              const PopupMenuItem(value: 'add', child: Text('Thêm FCST')),
              PopupMenuItem(value: 'delete', enabled: selectedCount >= 1, child: const Text('Xóa FCST')),
              const PopupMenuDivider(),
              const PopupMenuItem(value: 'export', child: Text('Xuất Excel')),
            ],
          ),
        ],
      ),
      drawer: const AppDrawer(title: 'ERP'),
      body: RefreshIndicator(
        onRefresh: _search,
        child: ListView(
          padding: const EdgeInsets.all(12),
          children: [
            if (_showFilter)
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              'Bộ lọc',
                              style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
                            ),
                          ),
                          TextButton(
                            onPressed: () {
                              setState(() {
                                _codeKdCtrl.clear();
                                _codeCmsCtrl.clear();
                                _custNameCtrl.clear();
                                _emplNameCtrl.clear();
                                _prodTypeCtrl.clear();
                                _idCtrl.clear();
                                _materialCtrl.clear();
                                _poNoCtrl.clear();
                                _overCtrl.clear();
                              });
                            },
                            child: const Text('Clear'),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () => _pickDate(from: true),
                              child: Text('Từ: ${_fmtDateShort(_ymd(_fromDate))}'),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () => _pickDate(from: false),
                              child: Text('Đến: ${_fmtDateShort(_ymd(_toDate))}'),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      SwitchListTile(
                        contentPadding: EdgeInsets.zero,
                        title: const Text('All time'),
                        value: _allTime,
                        onChanged: (v) => setState(() => _allTime = v),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(child: TextField(controller: _codeKdCtrl, decoration: const InputDecoration(labelText: 'Code KD'), textInputAction: TextInputAction.next)),
                          const SizedBox(width: 12),
                          Expanded(child: TextField(controller: _codeCmsCtrl, decoration: const InputDecoration(labelText: 'Code ERP'), textInputAction: TextInputAction.next)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(child: TextField(controller: _custNameCtrl, decoration: const InputDecoration(labelText: 'Customer'), textInputAction: TextInputAction.next)),
                          const SizedBox(width: 12),
                          Expanded(child: TextField(controller: _emplNameCtrl, decoration: const InputDecoration(labelText: 'Empl name'), textInputAction: TextInputAction.next)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(child: TextField(controller: _prodTypeCtrl, decoration: const InputDecoration(labelText: 'Prod type'), textInputAction: TextInputAction.next)),
                          const SizedBox(width: 12),
                          Expanded(child: TextField(controller: _materialCtrl, decoration: const InputDecoration(labelText: 'Material'), textInputAction: TextInputAction.next)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(child: TextField(controller: _poNoCtrl, decoration: const InputDecoration(labelText: 'PO NO'), textInputAction: TextInputAction.next)),
                          const SizedBox(width: 12),
                          Expanded(child: TextField(controller: _idCtrl, decoration: const InputDecoration(labelText: 'FCST_ID'), keyboardType: TextInputType.number, textInputAction: TextInputAction.next)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      TextField(
                        controller: _overCtrl,
                        decoration: const InputDecoration(labelText: 'Over/OK'),
                        textInputAction: TextInputAction.search,
                        onSubmitted: (_) => _search(),
                      ),
                      const SizedBox(height: 12),
                      SizedBox(
                        width: double.infinity,
                        child: FilledButton.icon(
                          onPressed: _loading ? null : _search,
                          icon: const Icon(Icons.search),
                          label: const Text('Tra cứu'),
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
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        'Tổng W1..W22: ${_fmtInt(_sumTotalQty)}',
                        style: const TextStyle(fontWeight: FontWeight.w900),
                      ),
                    ),
                    if (selectedCount > 0)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: scheme.primaryContainer,
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: Text(
                          '$selectedCount selected',
                          style: TextStyle(color: scheme.onPrimaryContainer, fontWeight: FontWeight.w700),
                        ),
                      ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            if (_loading)
              const Center(child: Padding(padding: EdgeInsets.all(16), child: CircularProgressIndicator()))
            else ...[
              Row(
                children: [
                  Expanded(
                    child: Text(
                      'Kết quả: ${_rows.length} dòng',
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
                    ),
                  ),
                  if (_rows.isNotEmpty)
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Checkbox(value: _isAllSelected, onChanged: _toggleSelectAll),
                        const Text('All'),
                      ],
                    ),
                ],
              ),
              const SizedBox(height: 8),
              if (_gridView)
                SizedBox(
                  height: 520,
                  child: _buildGrid(scheme),
                )
              else
                for (final r in _rows) _fcstCard(context, scheme, r),
              if (_rows.isEmpty)
                const Padding(
                  padding: EdgeInsets.all(24),
                  child: Center(child: Text('Chưa có dữ liệu')),
                ),
            ],
          ],
        ),
      ),
    );
  }
}
