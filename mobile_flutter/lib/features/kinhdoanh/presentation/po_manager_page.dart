import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:excel/excel.dart' as xls;
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';
import 'package:flutter/foundation.dart';
import 'dart:async';
import 'dart:io';

import '../../../app/app_drawer.dart';
import '../../../core/providers.dart';
import '../../auth/application/auth_notifier.dart';
import '../../auth/application/auth_state.dart';
import '../../../core/config/app_config.dart';

class PoManagerPage extends ConsumerStatefulWidget {
  const PoManagerPage({super.key});

  @override
  ConsumerState<PoManagerPage> createState() => _PoManagerPageState();
}

class _PoManagerPageState extends ConsumerState<PoManagerPage> {
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

  bool _loading = false;
  List<Map<String, dynamic>> _rows = const [];

  final Set<int> _selectedPoIds = <int>{};

  List<Map<String, dynamic>>? _customerCache;
  final Map<String, List<Map<String, dynamic>>> _codeCache = <String, List<Map<String, dynamic>>>{};

  int _sumPoQty = 0;
  int _sumDeliveredQty = 0;
  int _sumBalanceQty = 0;
  num _sumPoAmount = 0;
  num _sumDeliveredAmount = 0;
  num _sumBalanceAmount = 0;

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
    super.dispose();
  }

  bool get _isAllSelected => _rows.isNotEmpty && _selectedPoIds.length == _rows.length;

  void _toggleSelectAll(bool? v) {
    setState(() {
      if (v == true) {
        _selectedPoIds
          ..clear()
          ..addAll(_rows.map((e) => _toInt(e['PO_ID'])));
      } else {
        _selectedPoIds.clear();
      }
    });
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
    var poQty = 0;
    var deliveredQty = 0;
    var balanceQty = 0;
    num poAmt = 0;
    num deliveredAmt = 0;
    num balanceAmt = 0;

    for (final r in rows) {
      poQty += _toInt(r['PO_QTY']);
      deliveredQty += _toInt(r['TOTAL_DELIVERED']);
      balanceQty += _toInt(r['PO_BALANCE']);
      poAmt += _toNum(r['PO_AMOUNT']);
      deliveredAmt += _toNum(r['DELIVERED_AMOUNT']);
      balanceAmt += _toNum(r['BALANCE_AMOUNT']);
    }

    _sumPoQty = poQty;
    _sumDeliveredQty = deliveredQty;
    _sumBalanceQty = balanceQty;
    _sumPoAmount = poAmt;
    _sumDeliveredAmount = deliveredAmt;
    _sumBalanceAmount = balanceAmt;
  }

  Future<void> _search() async {
    if (mounted) {
      setState(() {
        _loading = true;
        _showFilter = false;
        _selectedPoIds.clear();
      });
    }
    try {
      final api = ref.read(apiClientProvider);
      final res = await api.postCommand(
        'traPODataFull',
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
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  List<Map<String, dynamic>> _selectedRows() {
    if (_selectedPoIds.isEmpty) return const [];
    return _rows.where((r) => _selectedPoIds.contains(_toInt(r['PO_ID']))).toList();
  }

  Future<bool> _checkPoExists({required String gCode, required String custCd, required String poNo}) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand('checkPOExist', data: {'G_CODE': gCode, 'CUST_CD': custCd, 'PO_NO': poNo});
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

  Future<void> _exportExcel() async {
    final rows = _rows;
    if (rows.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Chưa có dữ liệu để xuất')));
      return;
    }

    final excel = xls.Excel.createExcel();
    final sheet = excel['PO'];
    final headers = <String>[
      'PO_ID',
      'CUST_NAME_KD',
      'PO_NO',
      'G_NAME',
      'G_NAME_KD',
      'G_CODE',
      'PO_DATE',
      'RD_DATE',
      'PROD_PRICE',
      'PO_QTY',
      'TOTAL_DELIVERED',
      'PO_BALANCE',
      'PO_AMOUNT',
      'DELIVERED_AMOUNT',
      'BALANCE_AMOUNT',
      'EMPL_NAME',
      'PROD_TYPE',
      'PROD_MAIN_MATERIAL',
      'OVERDUE',
      'REMARK',
    ];

    sheet.appendRow(headers.map((h) => xls.TextCellValue(h)).toList());
    for (final r in rows) {
      sheet.appendRow(headers.map((h) => xls.TextCellValue((r[h] ?? '').toString())).toList());
    }

    final bytes = excel.encode();
    if (bytes == null) return;

    final dir = await getTemporaryDirectory();
    final filename = 'PO_${DateTime.now().millisecondsSinceEpoch}.xlsx';
    final file = File('${dir.path}/$filename');
    await file.writeAsBytes(bytes, flush: true);

    await Share.shareXFiles([
      XFile(file.path, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    ]);
  }

  Future<void> _openPoForm({Map<String, dynamic>? existing}) async {
    final authState = ref.read(authNotifierProvider);
    final emplNo = authState is AuthAuthenticated ? authState.session.user.emplNo : '';

    final gCodeCtrl = TextEditingController(text: (existing?['G_CODE'] ?? '').toString());
    final gNameCtrl = TextEditingController(text: (existing?['G_NAME_KD'] ?? existing?['G_NAME'] ?? '').toString());
    final custCdCtrl = TextEditingController(text: (existing?['CUST_CD'] ?? '').toString());
    final custNameCtrl = TextEditingController(text: (existing?['CUST_NAME_KD'] ?? '').toString());
    final poNoCtrl = TextEditingController(text: (existing?['PO_NO'] ?? '').toString());
    final poQtyCtrl = TextEditingController(text: (existing?['PO_QTY'] ?? '').toString());
    final prodPriceCtrl = TextEditingController(text: (existing?['PROD_PRICE'] ?? '').toString());
    final bepCtrl = TextEditingController(text: (existing?['BEP'] ?? '').toString());
    final remarkCtrl = TextEditingController(text: (existing?['REMARK'] ?? '').toString());

    var poDate = (existing?['PO_DATE'] ?? _ymd(DateTime.now())).toString();
    var rdDate = (existing?['RD_DATE'] ?? _ymd(DateTime.now())).toString();

    final isEdit = existing != null;
    final selectedPoId = _toInt(existing?['PO_ID']);
    final currentDelivered = _toInt(existing?['TOTAL_DELIVERED']);
    final originalPrice = (existing?['PROD_PRICE'] ?? '').toString();

    Future<void> pickSheetDate({required bool isPo}) async {
      final init = isPo ? poDate : rdDate;
      DateTime initial = DateTime.now();
      if (init.length >= 10 && init[4] == '-' && init[7] == '-') {
        final y = int.tryParse(init.substring(0, 4));
        final m = int.tryParse(init.substring(5, 7));
        final d = int.tryParse(init.substring(8, 10));
        if (y != null && m != null && d != null) initial = DateTime(y, m, d);
      }
      final picked = await showDatePicker(
        context: context,
        initialDate: initial,
        firstDate: DateTime(2020, 1, 1),
        lastDate: DateTime(2100, 12, 31),
      );
      if (picked == null) return;
      if (!mounted) return;
      setState(() {
        final v = _ymd(picked);
        if (isPo) {
          poDate = v;
        } else {
          rdDate = v;
        }
      });
    }

    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (ctx) {
        final scheme = Theme.of(ctx).colorScheme;
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
              Text(isEdit ? 'Sửa PO' : 'Thêm PO', style: Theme.of(ctx).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
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
              TextField(controller: poNoCtrl, decoration: const InputDecoration(labelText: 'PO_NO'), textInputAction: TextInputAction.next),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(child: TextField(controller: poQtyCtrl, decoration: const InputDecoration(labelText: 'PO_QTY'), keyboardType: TextInputType.number, textInputAction: TextInputAction.next)),
                  const SizedBox(width: 12),
                  Expanded(child: TextField(controller: prodPriceCtrl, decoration: const InputDecoration(labelText: 'PROD_PRICE'), keyboardType: const TextInputType.numberWithOptions(decimal: true), textInputAction: TextInputAction.next)),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(child: TextField(controller: bepCtrl, decoration: const InputDecoration(labelText: 'BEP'), keyboardType: const TextInputType.numberWithOptions(decimal: true), textInputAction: TextInputAction.next)),
                  const SizedBox(width: 12),
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => pickSheetDate(isPo: true),
                      child: Text('PO: ${_fmtDateShort(poDate)}'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => pickSheetDate(isPo: false),
                      child: Text('RD: ${_fmtDateShort(rdDate)}'),
                    ),
                  ),
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
                    final gCode = gCodeCtrl.text.trim();
                    final custCd = custCdCtrl.text.trim();
                    final poNo = poNoCtrl.text.trim();
                    final poQty = int.tryParse(poQtyCtrl.text.trim()) ?? 0;
                    final prodPrice = prodPriceCtrl.text.trim();
                    final bep = num.tryParse(bepCtrl.text.trim()) ?? 0;
                    final remark = remarkCtrl.text.trim();

                    if (gCode.isEmpty || custCd.isEmpty || poNo.isEmpty || emplNo.isEmpty || poQty <= 0 || prodPrice.isEmpty) {
                      messenger.showSnackBar(const SnackBar(content: Text('Thiếu thông tin bắt buộc')));
                      return;
                    }

                    if (_isFutureDateYmd(poDate)) {
                      messenger.showSnackBar(const SnackBar(content: Text('Ngày PO không được sau hôm nay')));
                      return;
                    }

                    final gCodeStatus = await _checkGCodeUseYn(gCode);
                    if (gCodeStatus == 1) {
                      messenger.showSnackBar(const SnackBar(content: Text('Ver này đã bị khóa (USE_YN=N)')));
                      return;
                    }
                    if (gCodeStatus == 2) {
                      messenger.showSnackBar(const SnackBar(content: Text('Không có Code ERP này')));
                      return;
                    }

                    final companyIsCms = AppConfig.company.toUpperCase() == 'CMS';

                    if (!isEdit) {
                      final exists = await _checkPoExists(gCode: gCode, custCd: custCd, poNo: poNo);
                      if (exists) {
                        messenger.showSnackBar(const SnackBar(content: Text('Đã tồn tại PO')));
                        return;
                      }
                    } else {
                      if (poQty < currentDelivered) {
                        messenger.showSnackBar(const SnackBar(content: Text('PO_QTY mới không được nhỏ hơn số đã giao')));
                        return;
                      }
                      if (!companyIsCms && prodPrice != originalPrice) {
                        messenger.showSnackBar(const SnackBar(content: Text('Không được đổi giá PO, hãy xóa và tạo lại')));
                        return;
                      }
                    }

                    try {
                      final api = ref.read(apiClientProvider);
                      if (!isEdit) {
                        final res = await api.postCommand('insert_po', data: {
                          'G_CODE': gCode,
                          'CUST_CD': custCd,
                          'PO_NO': poNo,
                          'EMPL_NO': emplNo,
                          'PO_QTY': poQty,
                          'PO_DATE': poDate,
                          'RD_DATE': rdDate,
                          'PROD_PRICE': prodPrice,
                          'BEP': bep,
                          'REMARK': remark,
                        });
                        final body = res.data;
                        if (body is Map<String, dynamic> && (body['tk_status'] ?? '').toString().toUpperCase() == 'NG') {
                          messenger.showSnackBar(SnackBar(content: Text('Thêm PO thất bại: ${(body['message'] ?? 'NG').toString()}')));
                          return;
                        }
                      } else {
                        final res = await api.postCommand('update_po', data: {
                          'G_CODE': gCode,
                          'CUST_CD': custCd,
                          'PO_NO': poNo,
                          'EMPL_NO': emplNo,
                          'PO_QTY': poQty,
                          'PO_DATE': poDate,
                          'RD_DATE': rdDate,
                          'PROD_PRICE': prodPrice,
                          'BEP': bep,
                          'REMARK': remark,
                          'PO_ID': selectedPoId,
                        });
                        final body = res.data;
                        if (body is Map<String, dynamic> && (body['tk_status'] ?? '').toString().toUpperCase() == 'NG') {
                          messenger.showSnackBar(SnackBar(content: Text('Sửa PO thất bại: ${(body['message'] ?? 'NG').toString()}')));
                          return;
                        }
                      }

                      if (!mounted) return;
                      navigator.pop();
                      messenger.showSnackBar(SnackBar(content: Text(isEdit ? 'Update PO thành công' : 'Thêm PO thành công')));
                      await _search();
                    } catch (e) {
                      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
                    }
                  },
                  child: Text(isEdit ? 'Cập nhật' : 'Thêm'),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Gợi ý: Các rule nghiệp vụ đang bám theo web (check tồn tại PO, check code ver, validate ngày, update qty...).',
                style: TextStyle(color: scheme.onSurfaceVariant),
              ),
            ],
          ),
        );
      },
    );

  }

  Future<void> _deleteSelectedPo() async {
    final selected = _selectedRows();
    if (selected.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Chọn ít nhất 1 PO để xóa')));
      return;
    }

    final messenger = ScaffoldMessenger.of(context);

    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Xóa PO'),
        content: Text('Chắc chắn muốn xóa ${selected.length} PO đã chọn? (chỉ xóa PO của user đăng nhập)'),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Hủy')),
          FilledButton(onPressed: () => Navigator.of(ctx).pop(true), child: const Text('Xóa')),
        ],
      ),
    );
    if (ok != true) return;

    final authState = ref.read(authNotifierProvider);
    final emplNo = authState is AuthAuthenticated ? authState.session.user.emplNo : '';
    if (emplNo.isEmpty) return;
    var deleted = 0;
    var failed = 0;

    try {
      final api = ref.read(apiClientProvider);
      for (final r in selected) {
        final owner = (r['EMPL_NO'] ?? '').toString();
        if (owner != emplNo) continue;
        final poId = _toInt(r['PO_ID']);
        final res = await api.postCommand('delete_po', data: {'PO_ID': poId});
        final body = res.data;
        if (body is Map<String, dynamic> && (body['tk_status'] ?? '').toString().toUpperCase() == 'NG') {
          failed++;
        } else {
          deleted++;
        }
      }

      messenger.showSnackBar(
        SnackBar(content: Text('Đã xóa: $deleted, lỗi: $failed (PO không phải của bạn sẽ bị bỏ qua)')),
      );
      await _search();
    } catch (e) {
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final selectedCount = _selectedPoIds.length;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Quản lý PO'),
        actions: [
          IconButton(
            onPressed: () {
              setState(() => _showFilter = !_showFilter);
            },
            icon: Icon(_showFilter ? Icons.filter_alt_off : Icons.filter_alt),
            tooltip: _showFilter ? 'Ẩn bộ lọc' : 'Hiện bộ lọc',
          ),
          PopupMenuButton<String>(
            onSelected: (v) async {
              if (v == 'search') {
                await _search();
              } else if (v == 'add') {
                await _openPoForm();
              } else if (v == 'edit') {
                final sel = _selectedRows();
                if (sel.length != 1) {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Chọn đúng 1 PO để sửa')));
                  return;
                }
                await _openPoForm(existing: sel.first);
              } else if (v == 'delete') {
                await _deleteSelectedPo();
              } else if (v == 'export') {
                await _exportExcel();
              }
            },
            itemBuilder: (ctx) => [
              const PopupMenuItem(value: 'search', child: Text('Tra cứu')),
              const PopupMenuDivider(),
              const PopupMenuItem(value: 'add', child: Text('Thêm PO')),
              PopupMenuItem(value: 'edit', enabled: selectedCount == 1, child: const Text('Sửa PO')),
              PopupMenuItem(value: 'delete', enabled: selectedCount >= 1, child: const Text('Xóa PO')),
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
                                _overCtrl.clear();
                                _poNoCtrl.clear();
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
                          Expanded(child: TextField(controller: _idCtrl, decoration: const InputDecoration(labelText: 'PO_ID'), textInputAction: TextInputAction.next, keyboardType: TextInputType.number)),
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
                      TextField(
                        controller: _poNoCtrl,
                        decoration: const InputDecoration(labelText: 'PO NO'),
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
                        Expanded(child: Text(_fmtInt(_sumPoQty), style: const TextStyle(fontWeight: FontWeight.w800))),
                        Expanded(child: Text(_fmtInt(_sumDeliveredQty), style: const TextStyle(fontWeight: FontWeight.w800))),
                        Expanded(
                          child: Text(
                            _fmtInt(_sumBalanceQty),
                            textAlign: TextAlign.right,
                            style: TextStyle(fontWeight: FontWeight.w900, color: _sumBalanceQty > 0 ? scheme.primary : scheme.onSurfaceVariant),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Expanded(child: Text(_fmtMoney(_sumPoAmount), style: TextStyle(color: scheme.onSurfaceVariant, fontWeight: FontWeight.w700))),
                        Expanded(child: Text(_fmtMoney(_sumDeliveredAmount), style: TextStyle(color: scheme.onSurfaceVariant, fontWeight: FontWeight.w700))),
                        Expanded(
                          child: Text(
                            _fmtMoney(_sumBalanceAmount),
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
            if (_loading) const Center(child: Padding(padding: EdgeInsets.all(16), child: CircularProgressIndicator())) else ...[
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
              for (final r in _rows) _poCard(context, scheme, r),
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

  Widget _poCard(BuildContext context, ColorScheme scheme, Map<String, dynamic> r) {
    final poId = _toInt(r['PO_ID']);
    final selected = _selectedPoIds.contains(poId);
    final poNo = (r['PO_NO'] ?? '').toString();
    final cust = (r['CUST_NAME_KD'] ?? '').toString();
    final gName = (r['G_NAME'] ?? '').toString();
    final gNameKd = (r['G_NAME_KD'] ?? '').toString();
    final poDate = _fmtDateShort((r['PO_DATE'] ?? '').toString());
    final rdDate = _fmtDateShort((r['RD_DATE'] ?? '').toString());

    final poQty = _toInt(r['PO_QTY']);
    final delivered = _toInt(r['TOTAL_DELIVERED']);
    final balance = _toInt(r['PO_BALANCE']);

    final poAmt = _toNum(r['PO_AMOUNT']);
    final delAmt = _toNum(r['DELIVERED_AMOUNT']);
    final balAmt = _toNum(r['BALANCE_AMOUNT']);

    final overdue = (r['OVERDUE'] ?? '').toString();

    final balanceColor = balance > 0 ? scheme.primary : scheme.onSurfaceVariant;

    return Card(
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () {
          setState(() {
            if (selected) {
              _selectedPoIds.remove(poId);
            } else {
              _selectedPoIds.add(poId);
            }
          });
        },
        onLongPress: () async {
          setState(() {
            _selectedPoIds
              ..clear()
              ..add(poId);
          });
          await _openPoForm(existing: r);
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
                      poNo.isNotEmpty ? poNo : '(No PO NO)',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w800,
                            color: scheme.onSurface,
                          ),
                    ),
                  ),
                  if (overdue.isNotEmpty)
                    Text(
                      overdue,
                      style: TextStyle(color: scheme.error, fontWeight: FontWeight.w700),
                    ),
                ],
              ),
              const SizedBox(height: 4),
              Text(cust, style: TextStyle(color: scheme.onSurfaceVariant)),
              const SizedBox(height: 8),
              Text(gNameKd.isNotEmpty ? gNameKd : gName, style: const TextStyle(fontWeight: FontWeight.w700)),
              const SizedBox(height: 8),
              Text(
                'PO $poDate   RD $rdDate',
                style: TextStyle(color: scheme.onSurfaceVariant, fontWeight: FontWeight.w600),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(child: Text(_fmtInt(poQty), style: const TextStyle(fontWeight: FontWeight.w800))),
                  Expanded(child: Text(_fmtInt(delivered), style: const TextStyle(fontWeight: FontWeight.w800))),
                  Expanded(
                    child: Text(
                      _fmtInt(balance),
                      textAlign: TextAlign.right,
                      style: TextStyle(color: balanceColor, fontWeight: FontWeight.w900),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Row(
                children: [
                  Expanded(child: Text(_fmtMoney(poAmt), style: TextStyle(color: scheme.onSurfaceVariant, fontWeight: FontWeight.w700))),
                  Expanded(child: Text(_fmtMoney(delAmt), style: TextStyle(color: scheme.onSurfaceVariant, fontWeight: FontWeight.w700))),
                  Expanded(
                    child: Text(
                      _fmtMoney(balAmt),
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
    );
  }
}
