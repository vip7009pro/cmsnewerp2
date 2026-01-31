import 'dart:async';
import 'dart:io';

import 'package:excel/excel.dart' as xls;
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';

import '../../../app/app_drawer.dart';
import '../../../core/providers.dart';
import '../../auth/application/auth_notifier.dart';
import '../../auth/application/auth_state.dart';

class PlanManagerPage extends ConsumerStatefulWidget {
  const PlanManagerPage({super.key});

  @override
  ConsumerState<PlanManagerPage> createState() => _PlanManagerPageState();
}

class _PlanManagerPageState extends ConsumerState<PlanManagerPage> {
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

  final Set<int> _selectedPlanIds = <int>{};

  List<Map<String, dynamic>>? _customerCache;
  final Map<String, List<Map<String, dynamic>>> _codeCache = <String, List<Map<String, dynamic>>>{};

  int _sumTotalPlanQty = 0;

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

  bool get _isAllSelected => _rows.isNotEmpty && _selectedPlanIds.length == _rows.length;

  void _toggleSelectAll(bool? v) {
    setState(() {
      if (v == true) {
        _selectedPlanIds
          ..clear()
          ..addAll(_rows.map((e) => _toInt(e['PLAN_ID'])));
      } else {
        _selectedPlanIds.clear();
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

  int _sumPlanRow(Map<String, dynamic> r) {
    var sum = 0;
    for (var i = 1; i <= 15; i++) {
      sum += _toInt(r['D$i']);
    }
    return sum;
  }

  void _recalcSummary(List<Map<String, dynamic>> rows) {
    var total = 0;
    for (final r in rows) {
      total += _sumPlanRow(r);
    }
    _sumTotalPlanQty = total;
  }

  Future<void> _search() async {
    if (mounted) {
      setState(() {
        _loading = true;
        _showFilter = false;
        _selectedPlanIds.clear();
      });
    }

    try {
      final api = ref.read(apiClientProvider);
      final res = await api.postCommand(
        'traPlanDataFull',
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

  Widget _kv(ColorScheme scheme, {required String k, required String v, TextStyle? valueStyle}) {
    if (v.trim().isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.only(top: 2),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 88,
            child: Text(
              k,
              style: TextStyle(color: scheme.onSurfaceVariant, fontWeight: FontWeight.w600, fontSize: 12),
            ),
          ),
          const SizedBox(width: 6),
          Expanded(
            child: Text(
              v,
              style: valueStyle ?? const TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
            ),
          ),
        ],
      ),
    );
  }

  Widget _dBox(ColorScheme scheme, {required String label, required int value}) {
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
          Text(_fmtInt(value), style: TextStyle(fontSize: 12, color: scheme.onSurface, fontWeight: FontWeight.w900)),
        ],
      ),
    );
  }

  List<Map<String, dynamic>> _selectedRows() {
    if (_selectedPlanIds.isEmpty) return const [];
    return _rows.where((r) => _selectedPlanIds.contains(_toInt(r['PLAN_ID']))).toList();
  }

  Future<bool> _checkPlanExists({required String gCode, required String custCd, required String planDate}) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand('checkPlanExist', data: {'G_CODE': gCode, 'CUST_CD': custCd, 'PLAN_DATE': planDate});
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
    final sheet = excel['Plan'];

    final headers = <String>[
      'PLAN_ID',
      'EMPL_NAME',
      'CUST_NAME_KD',
      'CUST_CD',
      'G_CODE',
      'G_NAME',
      'G_NAME_KD',
      'PROD_TYPE',
      'PROD_MAIN_MATERIAL',
      'PLAN_DATE',
      'D1',
      'D2',
      'D3',
      'D4',
      'D5',
      'D6',
      'D7',
      'D8',
      'D9',
      'D10',
      'D11',
      'D12',
      'D13',
      'D14',
      'D15',
      'REMARK',
      'STATUS',
    ];

    sheet.appendRow(headers.map((h) => xls.TextCellValue(h)).toList());
    for (final r in rows) {
      sheet.appendRow(headers.map((h) => xls.TextCellValue((r[h] ?? '').toString())).toList());
    }

    final bytes = excel.encode();
    if (bytes == null) return;

    final dir = await getTemporaryDirectory();
    final filename = 'Plan_${DateTime.now().millisecondsSinceEpoch}.xlsx';
    final file = File('${dir.path}/$filename');
    await file.writeAsBytes(bytes, flush: true);

    await Share.shareXFiles([
      XFile(file.path, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    ]);
  }

  Future<void> _openPlanForm() async {
    final authState = ref.read(authNotifierProvider);
    final emplNo = authState is AuthAuthenticated ? authState.session.user.emplNo : '';

    final gCodeCtrl = TextEditingController();
    final gNameCtrl = TextEditingController();
    final custCdCtrl = TextEditingController();
    final custNameCtrl = TextEditingController();
    final remarkCtrl = TextEditingController();

    final dayCtrls = List<TextEditingController>.generate(15, (_) => TextEditingController(text: '0'));

    var planDate = _ymd(DateTime.now());

    Future<void> pickPlanDate() async {
      DateTime initial = DateTime.now();
      if (planDate.length >= 10 && planDate[4] == '-' && planDate[7] == '-') {
        final y = int.tryParse(planDate.substring(0, 4));
        final m = int.tryParse(planDate.substring(5, 7));
        final d = int.tryParse(planDate.substring(8, 10));
        if (y != null && m != null && d != null) initial = DateTime(y, m, d);
      }
      final picked = await showDatePicker(
        context: context,
        initialDate: initial,
        firstDate: DateTime(2020, 1, 1),
        lastDate: DateTime(2100, 12, 31),
      );
      if (picked == null) return;
      planDate = _ymd(picked);
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
              Text('Thêm Plan', style: Theme.of(ctx).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
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
                  Expanded(
                    child: OutlinedButton(
                      onPressed: pickPlanDate,
                      child: Text('Plan date: ${_fmtDateShort(planDate)}'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(child: TextField(controller: remarkCtrl, decoration: const InputDecoration(labelText: 'REMARK'), textInputAction: TextInputAction.done)),
                ],
              ),
              const SizedBox(height: 12),
              Text('D1..D15', style: Theme.of(ctx).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Wrap(
                spacing: 10,
                runSpacing: 8,
                children: List<Widget>.generate(15, (i) {
                  final idx = i + 1;
                  return SizedBox(
                    width: 88,
                    child: TextField(
                      controller: dayCtrls[i],
                      decoration: InputDecoration(labelText: 'D$idx'),
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

                    final gCode = gCodeCtrl.text.trim();
                    final custCd = custCdCtrl.text.trim();
                    final remark = remarkCtrl.text.trim();

                    if (gCode.isEmpty || custCd.isEmpty || emplNo.isEmpty) {
                      messenger.showSnackBar(const SnackBar(content: Text('Thiếu thông tin bắt buộc')));
                      return;
                    }

                    if (_isFutureDateYmd(planDate)) {
                      messenger.showSnackBar(const SnackBar(content: Text('Ngày plan không được sau hôm nay')));
                      return;
                    }

                    final exists = await _checkPlanExists(gCode: gCode, custCd: custCd, planDate: planDate);
                    if (exists) {
                      messenger.showSnackBar(const SnackBar(content: Text('Plan đã tồn tại')));
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
                      'REMARK': remark,
                      'G_CODE': gCode,
                      'CUST_CD': custCd,
                      'PLAN_DATE': planDate,
                      'EMPL_NO': emplNo,
                    };

                    for (var i = 0; i < 15; i++) {
                      payload['D${i + 1}'] = int.tryParse(dayCtrls[i].text.trim()) ?? 0;
                    }

                    try {
                      final api = ref.read(apiClientProvider);
                      final res = await api.postCommand('insert_plan', data: payload);
                      final body = res.data;
                      if (body is Map<String, dynamic> && (body['tk_status'] ?? '').toString().toUpperCase() == 'NG') {
                        messenger.showSnackBar(SnackBar(content: Text('Thêm Plan thất bại: ${(body['message'] ?? 'NG').toString()}')));
                        return;
                      }

                      if (!mounted) return;
                      navigator.pop();
                      messenger.showSnackBar(const SnackBar(content: Text('Thêm Plan thành công')));
                      await _search();
                    } catch (e) {
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

  Future<void> _deleteSelectedPlan() async {
    final selected = _selectedRows();
    if (selected.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Chọn ít nhất 1 Plan để xóa')));
      return;
    }

    final messenger = ScaffoldMessenger.of(context);

    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Xóa Plan'),
        content: Text('Chắc chắn muốn xóa ${selected.length} Plan đã chọn? (chỉ xóa Plan của user đăng nhập)'),
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

    try {
      final api = ref.read(apiClientProvider);
      var deleted = 0;
      var skipped = 0;
      var failed = 0;

      for (final r in selected) {
        final owner = (r['EMPL_NO'] ?? '').toString();
        if (owner != emplNo) {
          skipped++;
          continue;
        }
        final planId = _toInt(r['PLAN_ID']);
        final res = await api.postCommand('delete_plan', data: {'PLAN_ID': planId});
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

  Widget _planCard(BuildContext context, ColorScheme scheme, Map<String, dynamic> r) {
    final planId = _toInt(r['PLAN_ID']);
    final selected = _selectedPlanIds.contains(planId);

    final planDate = _fmtDateShort((r['PLAN_DATE'] ?? '').toString());
    final emplName = (r['EMPL_NAME'] ?? '').toString();
    final emplNo = (r['EMPL_NO'] ?? '').toString();
    final cust = (r['CUST_NAME_KD'] ?? '').toString();
    final custCd = (r['CUST_CD'] ?? '').toString();
    final gNameKd = (r['G_NAME_KD'] ?? '').toString();
    final gName = (r['G_NAME'] ?? '').toString();
    final gCode = (r['G_CODE'] ?? '').toString();
    final prodType = (r['PROD_TYPE'] ?? '').toString();
    final material = (r['PROD_MAIN_MATERIAL'] ?? '').toString();
    final status = (r['STATUS'] ?? '').toString();
    final remark = (r['REMARK'] ?? '').toString();

    final sumQty = _sumPlanRow(r);

    return Card(
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () {
          setState(() {
            if (selected) {
              _selectedPlanIds.remove(planId);
            } else {
              _selectedPlanIds.add(planId);
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
                      'PLAN $planId  •  $planDate',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800, color: scheme.onSurface),
                    ),
                  ),
                  if (status.isNotEmpty) Text(status, style: TextStyle(color: scheme.primary, fontWeight: FontWeight.w700)),
                ],
              ),
              const SizedBox(height: 6),
              _kv(scheme, k: 'Customer', v: cust.isNotEmpty ? cust : custCd),
              _kv(scheme, k: 'CUST_CD', v: custCd),
              _kv(
                scheme,
                k: 'Code',
                v: gCode,
                valueStyle: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: scheme.onSurface),
              ),
              _kv(scheme, k: 'G_NAME', v: gNameKd.isNotEmpty ? gNameKd : gName),
              _kv(scheme, k: 'Type', v: prodType),
              _kv(scheme, k: 'Material', v: material),
              _kv(scheme, k: 'Empl', v: emplName.isNotEmpty ? emplName : emplNo),
              const SizedBox(height: 6),
              Row(
                children: [
                  Text('Total', style: TextStyle(color: scheme.onSurfaceVariant, fontWeight: FontWeight.w700, fontSize: 12)),
                  const SizedBox(width: 8),
                  Text(_fmtInt(sumQty), style: TextStyle(color: scheme.onSurface, fontWeight: FontWeight.w900, fontSize: 14)),
                ],
              ),
              const SizedBox(height: 6),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: List<Widget>.generate(15, (i) {
                    final idx = i + 1;
                    final v = _toInt(r['D$idx']);
                    return Padding(
                      padding: EdgeInsets.only(right: i == 14 ? 0 : 6),
                      child: _dBox(scheme, label: 'D$idx', value: v),
                    );
                  }),
                ),
              ),
              if (remark.isNotEmpty) ...[
                const SizedBox(height: 6),
                Text(
                  remark,
                  style: TextStyle(color: scheme.onSurfaceVariant, fontSize: 12),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final selectedCount = _selectedPlanIds.length;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Quản lý Plan'),
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
                await _openPlanForm();
              } else if (v == 'delete') {
                await _deleteSelectedPlan();
              } else if (v == 'export') {
                await _exportExcel();
              }
            },
            itemBuilder: (ctx) => [
              const PopupMenuItem(value: 'search', child: Text('Tra cứu')),
              const PopupMenuDivider(),
              const PopupMenuItem(value: 'add', child: Text('Thêm Plan')),
              PopupMenuItem(value: 'delete', enabled: selectedCount >= 1, child: const Text('Xóa Plan')),
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
                          Expanded(child: TextField(controller: _idCtrl, decoration: const InputDecoration(labelText: 'PLAN_ID'), keyboardType: TextInputType.number, textInputAction: TextInputAction.next)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(child: TextField(controller: _poNoCtrl, decoration: const InputDecoration(labelText: 'PO NO'), textInputAction: TextInputAction.next)),
                          const SizedBox(width: 12),
                          Expanded(child: TextField(controller: _materialCtrl, decoration: const InputDecoration(labelText: 'Material'), textInputAction: TextInputAction.next)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      TextField(controller: _overCtrl, decoration: const InputDecoration(labelText: 'Overdue'), textInputAction: TextInputAction.search, onSubmitted: (_) => _search()),
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
                    Text(_fmtInt(_sumTotalPlanQty), style: const TextStyle(fontWeight: FontWeight.w900)),
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
              for (final r in _rows) _planCard(context, scheme, r),
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
