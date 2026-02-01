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

class InvoiceManagerPage extends ConsumerStatefulWidget {
  const InvoiceManagerPage({super.key});

  @override
  ConsumerState<InvoiceManagerPage> createState() => _InvoiceManagerPageState();
}

class _InvoiceManagerPageState extends ConsumerState<InvoiceManagerPage> {

  DateTime _fromDate = DateTime.now();
  DateTime _toDate = DateTime.now();

  bool _allTime = false;
  bool _justPoBalance = true;
  bool _showFilter = true;

  final _codeKdCtrl = TextEditingController();
  final _codeCmsCtrl = TextEditingController();
  final _custNameCtrl = TextEditingController();
  final _emplNameCtrl = TextEditingController();
  final _prodTypeCtrl = TextEditingController();
  final _idCtrl = TextEditingController();
  final _materialCtrl = TextEditingController();
  final _overCtrl = TextEditingController();
  final _poNoCtrl = TextEditingController();
  final _invoiceNoCtrl = TextEditingController();

  bool _loading = false;
  List<Map<String, dynamic>> _rows = const [];

  bool _gridView = false;
  List<PlutoColumn> _gridColumns = const [];
  List<PlutoRow> _gridRows = const [];
  PlutoGridStateManager? _gridSm;

  final Set<int> _selectedDeliveryIds = <int>{};

  List<Map<String, dynamic>>? _customerCache;
  final Map<String, List<Map<String, dynamic>>> _codeCache = <String, List<Map<String, dynamic>>>{};

  int _sumDeliveredQty = 0;
  num _sumDeliveredAmount = 0;

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    _codeKdCtrl.dispose();
    _codeCmsCtrl.dispose();
    _custNameCtrl.dispose();
    _emplNameCtrl.dispose();
    _prodTypeCtrl.dispose();
    _idCtrl.dispose();
    _materialCtrl.dispose();
    _overCtrl.dispose();
    _poNoCtrl.dispose();
    _invoiceNoCtrl.dispose();
    super.dispose();
  }

  bool get _isAllSelected => _rows.isNotEmpty && _selectedDeliveryIds.length == _rows.length;

  void _toggleSelectAll(bool? v) {
    setState(() {
      if (v == true) {
        _selectedDeliveryIds
          ..clear()
          ..addAll(_rows.map((e) => _toInt(e['DELIVERY_ID'])));
      } else {
        _selectedDeliveryIds.clear();
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
      'DELIVERY_ID',
      'INVOICE_NO',
      'PO_NO',
      'CUST_NAME_KD',
      'CUST_CD',
      'G_CODE',
      'G_NAME_KD',
      'G_NAME',
      'DELIVERY_DATE',
      'DELIVERY_QTY',
      'DELIVERED_AMOUNT',
      'EMPL_NAME',
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
      return PlutoColumn(
        title: field,
        field: field,
        type: PlutoColumnType.text(),
        enableContextMenu: false,
        enableSorting: true,
        enableFilterMenuItem: true,
        width: 120,
        minWidth: 90,
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
          checked: _selectedDeliveryIds.contains(_toInt(it['DELIVERY_ID'])),
          cells: {
            for (final c in columns) c.field: PlutoCell(value: val(it, c.field)),
          },
        ),
    ];
  }

  void _syncSelectedFromGrid(PlutoGridStateManager sm) {
    final checked = sm.checkedRows;
    setState(() {
      _selectedDeliveryIds
        ..clear()
        ..addAll(
          checked
              .map((r) => r.cells['__raw__']?.value)
              .whereType<Map<String, dynamic>>()
              .map((raw) => _toInt(raw['DELIVERY_ID'])),
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

  int _toInt(dynamic v) {
    if (v == null) return 0;
    if (v is int) return v;
    return int.tryParse(v.toString()) ?? 0;
  }

  num _toNum(dynamic v) {
    if (v == null) return 0;
    if (v is num) return v;
    return num.tryParse(v.toString()) ?? 0;
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
    final whole = abs.floor();
    final frac = ((abs - whole) * 100).round().toString().padLeft(2, '0');
    final w = _fmtInt(whole);
    return '${neg ? '-' : ''}\$$w.$frac';
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

  bool _isFutureDateYmd(String ymd) {
    if (ymd.length < 10) return false;
    final y = int.tryParse(ymd.substring(0, 4));
    final m = int.tryParse(ymd.substring(5, 7));
    final d = int.tryParse(ymd.substring(8, 10));
    if (y == null || m == null || d == null) return false;
    final dt = DateTime(y, m, d);
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    return dt.isAfter(today);
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

  void _recalcSummary(List<Map<String, dynamic>> rows) {
    var deliveredQty = 0;
    num deliveredAmt = 0;
    for (final r in rows) {
      deliveredQty += _toInt(r['DELIVERY_QTY']);
      deliveredAmt += _toNum(r['DELIVERED_AMOUNT']);
    }
    _sumDeliveredQty = deliveredQty;
    _sumDeliveredAmount = deliveredAmt;
  }

  Future<void> _search() async {
    if (mounted) {
      setState(() {
        _loading = true;
        _showFilter = false;
        _selectedDeliveryIds.clear();
      });
    }

    try {
      final api = ref.read(apiClientProvider);
      final res = await api.postCommand(
        'traInvoiceDataFull',
        data: {
          'alltime': _allTime,
          'justPoBalance': _justPoBalance,
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
          'invoice_no': _invoiceNoCtrl.text.trim(),
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
    if (_selectedDeliveryIds.isEmpty) return const [];
    return _rows.where((r) => _selectedDeliveryIds.contains(_toInt(r['DELIVERY_ID']))).toList();
  }

  Future<void> _exportExcel() async {
    final rows = _rows;
    if (rows.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Chưa có dữ liệu để xuất')));
      return;
    }

    final excel = xls.Excel.createExcel();
    final sheet = excel['Invoice'];
    final headers = <String>[
      'DELIVERY_ID',
      'CUST_NAME_KD',
      'CUST_CD',
      'G_CODE',
      'G_NAME',
      'G_NAME_KD',
      'PO_NO',
      'DELIVERY_DATE',
      'DELIVERY_QTY',
      'DELIVERED_AMOUNT',
      'INVOICE_NO',
      'EMPL_NAME',
      'REMARK',
    ];

    sheet.appendRow(headers.map((h) => xls.TextCellValue(h)).toList());
    for (final r in rows) {
      sheet.appendRow(headers.map((h) => xls.TextCellValue((r[h] ?? '').toString())).toList());
    }

    final bytes = excel.encode();
    if (bytes == null) return;

    final dir = await getTemporaryDirectory();
    final filename = 'Invoice_${DateTime.now().millisecondsSinceEpoch}.xlsx';
    final file = File('${dir.path}/$filename');
    await file.writeAsBytes(bytes, flush: true);

    await Share.shareXFiles([
      XFile(file.path, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    ]);
  }

  Future<void> _openInvoiceForm({Map<String, dynamic>? existing}) async {
    final authState = ref.read(authNotifierProvider);
    final emplNo = authState is AuthAuthenticated ? authState.session.user.emplNo : '';

    final isEdit = existing != null;

    final deliveryId = _toInt(existing?['DELIVERY_ID']);
    final currentGCodeCtrl = TextEditingController(text: (existing?['G_CODE'] ?? '').toString());
    final currentGNameCtrl = TextEditingController(text: (existing?['G_NAME_KD'] ?? existing?['G_NAME'] ?? '').toString());
    final currentCustCdCtrl = TextEditingController(text: (existing?['CUST_CD'] ?? '').toString());
    final currentCustNameCtrl = TextEditingController(text: (existing?['CUST_NAME_KD'] ?? '').toString());
    final poNoCtrl = TextEditingController(text: (existing?['PO_NO'] ?? '').toString());
    final qtyCtrl = TextEditingController(text: (existing?['DELIVERY_QTY'] ?? '').toString());
    final invoiceNoCtrl = TextEditingController(text: (existing?['INVOICE_NO'] ?? '').toString());
    final remarkCtrl = TextEditingController(text: (existing?['REMARK'] ?? '').toString());

    var deliveryDate = (existing?['DELIVERY_DATE'] ?? _ymd(DateTime.now())).toString();

    Future<void> pickDeliveryDate() async {
      DateTime initial = DateTime.now();
      if (deliveryDate.length >= 10 && deliveryDate[4] == '-' && deliveryDate[7] == '-') {
        final y = int.tryParse(deliveryDate.substring(0, 4));
        final m = int.tryParse(deliveryDate.substring(5, 7));
        final d = int.tryParse(deliveryDate.substring(8, 10));
        if (y != null && m != null && d != null) initial = DateTime(y, m, d);
      }
      final picked = await showDatePicker(
        context: context,
        initialDate: initial,
        firstDate: DateTime(2020, 1, 1),
        lastDate: DateTime(2100, 12, 31),
      );
      if (picked == null) return;
      deliveryDate = _ymd(picked);
      if (mounted) setState(() {});
    }

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
              Text(isEdit ? 'Sửa Invoice' : 'Thêm Invoice', style: Theme.of(ctx).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: currentCustNameCtrl.text.isNotEmpty ? currentCustNameCtrl : currentCustCdCtrl,
                      readOnly: true,
                      decoration: InputDecoration(
                        labelText: 'Customer',
                        suffixIcon: IconButton(
                          onPressed: () async {
                            final picked = await _pickCustomer(initialCd: currentCustCdCtrl.text, initialName: currentCustNameCtrl.text);
                            if (picked == null) return;
                            currentCustCdCtrl.text = (picked['CUST_CD'] ?? '').toString();
                            currentCustNameCtrl.text = (picked['CUST_NAME_KD'] ?? '').toString();
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
                      controller: currentGNameCtrl.text.isNotEmpty ? currentGNameCtrl : currentGCodeCtrl,
                      readOnly: true,
                      decoration: InputDecoration(
                        labelText: 'Code',
                        suffixIcon: IconButton(
                          onPressed: () async {
                            final picked = await _pickCode(currentKeyword: currentGNameCtrl.text.isNotEmpty ? currentGNameCtrl.text : currentGCodeCtrl.text);
                            if (picked == null) return;
                            currentGCodeCtrl.text = (picked['G_CODE'] ?? '').toString();
                            currentGNameCtrl.text = (picked['G_NAME_KD'] ?? picked['G_NAME'] ?? '').toString();
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
              TextField(controller: poNoCtrl, decoration: const InputDecoration(labelText: 'PO_NO'), textInputAction: TextInputAction.next),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(child: TextField(controller: qtyCtrl, decoration: const InputDecoration(labelText: 'DELIVERY_QTY'), keyboardType: TextInputType.number, textInputAction: TextInputAction.next)),
                  const SizedBox(width: 12),
                  Expanded(
                    child: OutlinedButton(
                      onPressed: pickDeliveryDate,
                      child: Text('Date: ${_fmtDateShort(deliveryDate)}'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(child: TextField(controller: invoiceNoCtrl, decoration: const InputDecoration(labelText: 'INVOICE_NO'), textInputAction: TextInputAction.next)),
                  const SizedBox(width: 12),
                  Expanded(child: TextField(controller: remarkCtrl, decoration: const InputDecoration(labelText: 'REMARK'), textInputAction: TextInputAction.done)),
                ],
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: () async {
                    final messenger = ScaffoldMessenger.of(context);
                    final navigator = Navigator.of(ctx);

                    final gCode = currentGCodeCtrl.text.trim();
                    final custCd = currentCustCdCtrl.text.trim();
                    final poNo = poNoCtrl.text.trim();
                    final qty = int.tryParse(qtyCtrl.text.trim()) ?? 0;
                    final invoiceNo = invoiceNoCtrl.text.trim();
                    final remark = remarkCtrl.text.trim();

                    if (gCode.isEmpty || custCd.isEmpty || poNo.isEmpty || emplNo.isEmpty || qty <= 0) {
                      messenger.showSnackBar(const SnackBar(content: Text('Thiếu thông tin bắt buộc')));
                      return;
                    }

                    if (_isFutureDateYmd(deliveryDate)) {
                      messenger.showSnackBar(const SnackBar(content: Text('Ngày giao không được sau hôm nay')));
                      return;
                    }

                    try {
                      final api = ref.read(apiClientProvider);
                      if (!isEdit) {
                        final res = await api.postCommand('insert_invoice', data: {
                          'G_CODE': gCode,
                          'CUST_CD': custCd,
                          'PO_NO': poNo,
                          'EMPL_NO': emplNo,
                          'DELIVERY_QTY': qty,
                          'DELIVERY_DATE': deliveryDate,
                          'REMARK': remark,
                          'INVOICE_NO': invoiceNo,
                        });
                        final body = res.data;
                        if (body is Map<String, dynamic> && (body['tk_status'] ?? '').toString().toUpperCase() == 'NG') {
                          messenger.showSnackBar(SnackBar(content: Text('Thêm Invoice thất bại: ${(body['message'] ?? 'NG').toString()}')));
                          return;
                        }
                      } else {
                        final res = await api.postCommand('update_invoice', data: {
                          'G_CODE': gCode,
                          'CUST_CD': custCd,
                          'PO_NO': poNo,
                          'EMPL_NO': emplNo,
                          'DELIVERY_DATE': deliveryDate,
                          'DELIVERY_QTY': qty,
                          'REMARK': remark,
                          'DELIVERY_ID': deliveryId,
                        });
                        final body = res.data;
                        if (body is Map<String, dynamic> && (body['tk_status'] ?? '').toString().toUpperCase() == 'NG') {
                          messenger.showSnackBar(SnackBar(content: Text('Sửa Invoice thất bại: ${(body['message'] ?? 'NG').toString()}')));
                          return;
                        }

                        if (invoiceNo.isNotEmpty) {
                          await api.postCommand('update_invoice_no', data: {'DELIVERY_ID': deliveryId, 'INVOICE_NO': invoiceNo});
                        }
                      }

                      if (!mounted) return;
                      navigator.pop();
                      messenger.showSnackBar(SnackBar(content: Text(isEdit ? 'Update Invoice thành công' : 'Thêm Invoice thành công')));
                      await _search();
                    } catch (e) {
                      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
                    }
                  },
                  child: Text(isEdit ? 'Cập nhật' : 'Thêm'),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _deleteSelectedInvoice() async {
    final selected = _selectedRows();
    if (selected.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Chọn ít nhất 1 invoice để xóa')));
      return;
    }

    final messenger = ScaffoldMessenger.of(context);

    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Xóa Invoice'),
        content: Text('Chắc chắn muốn xóa ${selected.length} dòng đã chọn?'),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Hủy')),
          FilledButton(onPressed: () => Navigator.of(ctx).pop(true), child: const Text('Xóa')),
        ],
      ),
    );
    if (ok != true) return;

    try {
      final api = ref.read(apiClientProvider);
      var deleted = 0;
      var failed = 0;
      for (final r in selected) {
        final id = _toInt(r['DELIVERY_ID']);
        final res = await api.postCommand('delete_invoice', data: {'DELIVERY_ID': id});
        final body = res.data;
        if (body is Map<String, dynamic> && (body['tk_status'] ?? '').toString().toUpperCase() == 'NG') {
          failed++;
        } else {
          deleted++;
        }
      }
      if (!mounted) return;
      messenger.showSnackBar(SnackBar(content: Text('Đã xóa: $deleted, lỗi: $failed')));
      await _search();
    } catch (e) {
      if (!mounted) return;
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  Widget _buildManageTab(ColorScheme scheme) {
    final selectedCount = _selectedDeliveryIds.length;

    return RefreshIndicator(
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
                              _overCtrl.clear();
                              _poNoCtrl.clear();
                              _invoiceNoCtrl.clear();
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
                    Row(
                      children: [
                        Expanded(
                          child: SwitchListTile(
                            contentPadding: EdgeInsets.zero,
                            title: const Text('All time'),
                            value: _allTime,
                            onChanged: (v) => setState(() => _allTime = v),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: SwitchListTile(
                            contentPadding: EdgeInsets.zero,
                            title: const Text('PO balance'),
                            value: _justPoBalance,
                            onChanged: (v) => setState(() => _justPoBalance = v),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(child: TextField(controller: _codeKdCtrl, decoration: const InputDecoration(labelText: 'CODE KD'), textInputAction: TextInputAction.next)),
                        const SizedBox(width: 12),
                        Expanded(child: TextField(controller: _codeCmsCtrl, decoration: const InputDecoration(labelText: 'CODE CMS'), textInputAction: TextInputAction.next)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(child: TextField(controller: _custNameCtrl, decoration: const InputDecoration(labelText: 'Customer'), textInputAction: TextInputAction.next)),
                        const SizedBox(width: 12),
                        Expanded(child: TextField(controller: _emplNameCtrl, decoration: const InputDecoration(labelText: 'EMPL name'), textInputAction: TextInputAction.next)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(child: TextField(controller: _prodTypeCtrl, decoration: const InputDecoration(labelText: 'PROD type'), textInputAction: TextInputAction.next)),
                        const SizedBox(width: 12),
                        Expanded(child: TextField(controller: _idCtrl, decoration: const InputDecoration(labelText: 'DELIVERY_ID'), textInputAction: TextInputAction.next, keyboardType: TextInputType.number)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(child: TextField(controller: _materialCtrl, decoration: const InputDecoration(labelText: 'Material'), textInputAction: TextInputAction.next)),
                        const SizedBox(width: 12),
                        Expanded(child: TextField(controller: _overCtrl, decoration: const InputDecoration(labelText: 'Overdue'), textInputAction: TextInputAction.next)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(child: TextField(controller: _poNoCtrl, decoration: const InputDecoration(labelText: 'PO NO'), textInputAction: TextInputAction.next)),
                        const SizedBox(width: 12),
                        Expanded(child: TextField(controller: _invoiceNoCtrl, decoration: const InputDecoration(labelText: 'Invoice NO'), textInputAction: TextInputAction.search, onSubmitted: (_) => _search())),
                      ],
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
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          'Tổng hợp',
                          style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
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
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(child: Text(_fmtInt(_sumDeliveredQty), style: const TextStyle(fontWeight: FontWeight.w800))),
                      Expanded(
                        child: Text(
                          _fmtMoney(_sumDeliveredAmount),
                          textAlign: TextAlign.right,
                          style: TextStyle(color: scheme.onSurfaceVariant, fontWeight: FontWeight.w700),
                        ),
                      ),
                    ],
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
              for (final r in _rows) _invoiceCard(context, scheme, r),
            if (_rows.isEmpty)
              const Padding(
                padding: EdgeInsets.all(24),
                child: Center(child: Text('Chưa có dữ liệu')),
              ),
          ],
        ],
      ),
    );
  }

  Widget _invoiceCard(BuildContext context, ColorScheme scheme, Map<String, dynamic> r) {
    final deliveryId = _toInt(r['DELIVERY_ID']);
    final selected = _selectedDeliveryIds.contains(deliveryId);

    final invoiceNo = (r['INVOICE_NO'] ?? '').toString();
    final poNo = (r['PO_NO'] ?? '').toString();
    final cust = (r['CUST_NAME_KD'] ?? '').toString();
    final gName = (r['G_NAME'] ?? '').toString();
    final gNameKd = (r['G_NAME_KD'] ?? '').toString();
    final deliveryDate = _fmtDateShort((r['DELIVERY_DATE'] ?? '').toString());

    final qty = _toInt(r['DELIVERY_QTY']);
    final amount = _toNum(r['DELIVERED_AMOUNT']);

    return Card(
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () {
          setState(() {
            if (selected) {
              _selectedDeliveryIds.remove(deliveryId);
            } else {
              _selectedDeliveryIds.add(deliveryId);
            }
          });
        },
        onLongPress: () async {
          setState(() {
            _selectedDeliveryIds
              ..clear()
              ..add(deliveryId);
          });
          await _openInvoiceForm(existing: r);
        },
        child: Padding(
          padding: const EdgeInsets.all(12),
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
                      invoiceNo.isNotEmpty ? invoiceNo : (poNo.isNotEmpty ? poNo : '(No Invoice/PO)'),
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800, color: scheme.onSurface),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Text(cust, style: TextStyle(color: scheme.onSurfaceVariant)),
              const SizedBox(height: 8),
              Text(gNameKd.isNotEmpty ? gNameKd : gName, style: const TextStyle(fontWeight: FontWeight.w700)),
              const SizedBox(height: 8),
              Text('Date $deliveryDate   PO $poNo', style: TextStyle(color: scheme.onSurfaceVariant, fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(child: Text(_fmtInt(qty), style: const TextStyle(fontWeight: FontWeight.w900))),
                  Expanded(
                    child: Text(
                      _fmtMoney(amount),
                      textAlign: TextAlign.right,
                      style: TextStyle(color: scheme.onSurfaceVariant, fontWeight: FontWeight.w800),
                    ),
                  ),
                ],
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
    final selectedCount = _selectedDeliveryIds.length;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Quản lý Invoice'),
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
                await _openInvoiceForm();
              } else if (v == 'edit') {
                final sel = _selectedRows();
                if (sel.length != 1) {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Chọn đúng 1 invoice để sửa')));
                  return;
                }
                await _openInvoiceForm(existing: sel.first);
              } else if (v == 'delete') {
                await _deleteSelectedInvoice();
              } else if (v == 'export') {
                await _exportExcel();
              }
            },
            itemBuilder: (ctx) => [
              const PopupMenuItem(value: 'search', child: Text('Tra cứu')),
              const PopupMenuDivider(),
              const PopupMenuItem(value: 'add', child: Text('Thêm Invoice')),
              PopupMenuItem(value: 'edit', enabled: selectedCount == 1, child: const Text('Sửa Invoice')),
              PopupMenuItem(value: 'delete', enabled: selectedCount >= 1, child: const Text('Xóa Invoice')),
              const PopupMenuDivider(),
              const PopupMenuItem(value: 'export', child: Text('Xuất Excel')),
            ],
          ),
        ],
      ),
      drawer: const AppDrawer(title: 'ERP'),
      body: _buildManageTab(scheme),
    );
  }
}
