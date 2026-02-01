import 'dart:async';
import 'dart:io';
import 'package:awesome_dialog/awesome_dialog.dart';
import 'package:excel/excel.dart' as xls;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:path_provider/path_provider.dart';
import 'package:pluto_grid/pluto_grid.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../app/app_drawer.dart';
import '../../../core/config/app_config.dart';
import '../../../core/providers.dart';
import '../../auth/application/auth_notifier.dart';
import '../../auth/application/auth_state.dart';
class YcsxManagerPage extends ConsumerStatefulWidget {
  const YcsxManagerPage({super.key});
  @override
  ConsumerState<YcsxManagerPage> createState() => _YcsxManagerPageState();
}
class _YcsxManagerPageState extends ConsumerState<YcsxManagerPage> {
  DateTime _fromDate = DateTime.now();
  DateTime _toDate = DateTime.now();
  bool _allTime = false;
  bool _showFilter = true;
  final _codeKdCtrl = TextEditingController();
  final _codeCmsCtrl = TextEditingController();
  final _custNameCtrl = TextEditingController();
  final _emplNameCtrl = TextEditingController();
  final _prodTypeCtrl = TextEditingController();
  final _prodRequestNoCtrl = TextEditingController();
  final _materialCtrl = TextEditingController();
  String _phanloai = '00';
  String _phanloaihang = 'ALL';
  String _isTamThoi = 'N';
  bool _materialYesOnly = false;
  bool _ycsxPendingCheck = false;
  bool _inspectInputCheck = false;
  List<Map<String, dynamic>>? _customerCache;
  final Map<String, List<Map<String, dynamic>>> _codeCache =
      <String, List<Map<String, dynamic>>>{};
  final Map<String, List<Map<String, dynamic>>> _ponoCache =
      <String, List<Map<String, dynamic>>>{};
  bool _loading = false;
  List<Map<String, dynamic>> _rows = const [];
  final Set<String> _selectedIds = <String>{};

  bool _gridView = false;
  List<PlutoColumn> _gridColumns = const [];
  List<PlutoRow> _gridRows = const [];
  PlutoGridStateManager? _gridSm;
  @override
  void dispose() {
    _codeKdCtrl.dispose();
    _codeCmsCtrl.dispose();
    _custNameCtrl.dispose();
    _emplNameCtrl.dispose();
    _prodTypeCtrl.dispose();
    _prodRequestNoCtrl.dispose();
    _materialCtrl.dispose();
    super.dispose();
  }
  static const List<String> _monthArray = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
  ];
  static const List<String> _dayArray = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
  ];
  String _zeroPad(int n, int width) {
    final s = n.toString();
    if (s.length >= width) return s;
    return '${'0' * (width - s.length)}$s';
  }
  String _ymdNoDash(DateTime d) {
    return '${d.year}${d.month.toString().padLeft(2, '0')}${d.day.toString().padLeft(2, '0')}';
  }
  Future<DateTime> _getSystemDateTime() async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand('getSystemDateTime', data: {});
    final body = res.data;
    if (body is Map<String, dynamic> &&
        (body['tk_status'] ?? '').toString().toUpperCase() != 'NG') {
      final data = body['data'];
      if (data is List && data.isNotEmpty) {
        final first = data.first;
        if (first is Map) {
          final raw = (first['SYSTEM_DATETIME'] ?? '').toString();
          final dt = DateTime.tryParse(raw.replaceAll('/', '-'));
          if (dt != null) return dt.toUtc();
        }
      }
    }
    return DateTime.now().toUtc();
  }
  Future<String> _createYcsxHeader() async {
    final sys = await _getSystemDateTime();
    final month = sys.month - 1;
    final day = sys.day;
    final yearStr = sys.toIso8601String().substring(3, 4);
    final monthStr = _monthArray[month.clamp(0, 11)];
    final dayStr = _dayArray[(day - 1).clamp(0, _dayArray.length - 1)];
    return '$yearStr$monthStr$dayStr';
  }
  Future<String> _generateNextProdRequestNo() async {
    final api = ref.read(apiClientProvider);
    final header = await _createYcsxHeader();
    String? last;
    final res = await api.postCommand('checkLastYCSX', data: {});
    final body = res.data;
    if (body is Map<String, dynamic> &&
        (body['tk_status'] ?? '').toString().toUpperCase() != 'NG') {
      final data = body['data'];
      if (data is List && data.isNotEmpty) {
        final first = data.first;
        if (first is Map) {
          last = (first['PROD_REQUEST_NO'] ?? '').toString();
        }
      }
    }
    final yearDigit = DateTime.now().year.toString().substring(2, 3);
    if (last != null && last.length >= 7) {
      final seq = int.tryParse(last.substring(4, 7)) ?? 0;
      return '$header$yearDigit${_zeroPad(seq + 1, 3)}';
    }
    return '$header${yearDigit}001';
  }
  Future<List<Map<String, dynamic>>> _ensureCustomerList() async {
    if (_customerCache != null) return _customerCache!;
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand('selectcustomerList', data: {});
    final body = res.data;
    final data = (body is Map<String, dynamic> ? body['data'] : null);
    final list = (data is List ? data : const [])
        .map(
          (e) =>
              (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{}),
        )
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
        .map(
          (e) =>
              (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{}),
        )
        .toList();
    _codeCache[key] = list;
    return list;
  }
  Future<List<Map<String, dynamic>>> _loadPonoList({
    required String gCode,
    required String custCd,
  }) async {
    final key = '$gCode|$custCd';
    if (_ponoCache.containsKey(key)) return _ponoCache[key]!;
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(
      'loadpono',
      data: {'G_CODE': gCode, 'CUST_CD': custCd},
    );
    final body = res.data;
    final data = (body is Map<String, dynamic> ? body['data'] : null);
    final list = (data is List ? data : const [])
        .map(
          (e) =>
              (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{}),
        )
        .toList();
    _ponoCache[key] = list;
    return list;
  }
  Future<Map<String, dynamic>> _postCommandChecked(
    String command, {
    required Map<String, dynamic> data,
    bool throwOnNg = false,
  }) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(command, data: data);
    final body = res.data;
    if (throwOnNg &&
        body is Map<String, dynamic> &&
        (body['tk_status'] ?? '').toString().toUpperCase() == 'NG') {
      throw Exception((body['message'] ?? 'NG').toString());
    }
    if (body is Map<String, dynamic>) return body;
    return <String, dynamic>{'data': body};
  }

  Future<void> _showAwesome(
    BuildContext ctx, {
    required DialogType type,
    String? title,
    required String message,
  }) async {
    if (!mounted) return;
    await AwesomeDialog(
      context: ctx,
      dialogType: type,
      animType: AnimType.scale,
      title: title,
      desc: message,
      dismissOnTouchOutside: true,
      btnOkOnPress: () {},
    ).show();
  }

  Future<void> _openUrl(String url) async {
    final uri = Uri.tryParse(url);
    if (uri == null) {
      if (!mounted) return;
      await _showAwesome(
        context,
        type: DialogType.error,
        title: 'Không hợp lệ',
        message: 'URL không hợp lệ: $url',
      );
      return;
    }
    final ok = await launchUrl(uri, mode: LaunchMode.externalApplication);
    if (!ok) {
      if (!mounted) return;
      await _showAwesome(
        context,
        type: DialogType.error,
        title: 'Thất bại',
        message: 'Không mở được link: $url',
      );
    }
  }
  Future<Map<String, dynamic>?> _pickFromList({
    required String title,
    required Future<List<Map<String, dynamic>>> Function(String keyword) loader,
    required String Function(Map<String, dynamic> row) titleOf,
    required String Function(Map<String, dynamic> row) subtitleOf,
    String initial = '',
  }) async {
    final searchCtrl = TextEditingController(text: initial);
    Timer? debounce;
    List<Map<String, dynamic>> view = const [];
    var loading = false;
    Future<void> doSearch(StateSetter setSheetState, String q) async {
      loading = true;
      setSheetState(() {});
      try {
        view = (await loader(q)).take(200).toList();
      } finally {
        loading = false;
        if (mounted) setSheetState(() {});
      }
    }
    final picked = await showModalBottomSheet<Map<String, dynamic>>(
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
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      title,
                      style: Theme.of(ctx).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: searchCtrl,
                    decoration: const InputDecoration(
                      prefixIcon: Icon(Icons.search),
                      labelText: 'Search',
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
                        'Hiển thị ${view.length} (giới hạn 200)',
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
                        return ListTile(
                          dense: true,
                          title: Text(
                            titleOf(r),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          subtitle: Text(
                            subtitleOf(r),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
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
    return picked;
  }
  Future<Map<String, dynamic>?> _pickCustomer() async {
    final list = await _ensureCustomerList();
    return _pickFromList(
      title: 'Chọn khách hàng',
      loader: (q) async {
        final qq = q.trim().toLowerCase();
        if (qq.isEmpty) return list;
        return list.where((e) {
          final cd = (e['CUST_CD'] ?? '').toString().toLowerCase();
          final name = (e['CUST_NAME_KD'] ?? '').toString().toLowerCase();
          return cd.contains(qq) || name.contains(qq);
        }).toList();
      },
      titleOf: (r) => '${r['CUST_CD'] ?? ''} : ${r['CUST_NAME_KD'] ?? ''}',
      subtitleOf: (r) => (r['CUST_NAME'] ?? '').toString(),
    );
  }
  Future<Map<String, dynamic>?> _pickCode(String keyword) async {
    return _pickFromList(
      title: 'Chọn code',
      loader: _loadCodeList,
      titleOf: (r) => '${r['G_CODE'] ?? ''} : ${r['G_NAME_KD'] ?? ''}',
      subtitleOf: (r) => (r['G_NAME'] ?? '').toString(),
      initial: keyword,
    );
  }
  Future<Map<String, dynamic>?> _pickPono({
    required String gCode,
    required String custCd,
  }) async {
    final list = await _loadPonoList(gCode: gCode, custCd: custCd);
    return _pickFromList(
      title: 'Chọn PO NO',
      loader: (q) async {
        final qq = q.trim().toLowerCase();
        if (qq.isEmpty) return list;
        return list
            .where(
              (e) => (e['PO_NO'] ?? '').toString().toLowerCase().contains(qq),
            )
            .toList();
      },
      titleOf: (r) => (r['PO_NO'] ?? '').toString(),
      subtitleOf: (r) =>
          'RD: ${(r['RD_DATE'] ?? '').toString()} | QTY: ${(r['PO_QTY'] ?? '').toString()}',
    );
  }
  Future<bool> _checkBomGiaHasMain(String gCode) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand('checkmainBOM2', data: {'G_CODE': gCode});
    final body = res.data;
    return body is Map<String, dynamic> &&
        (body['tk_status'] ?? '').toString().toUpperCase() != 'NG';
  }
  Future<String> _checkBomMatching(String gCode) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(
      'checkmainBOM2_M140_M_CODE_MATCHING',
      data: {'G_CODE': gCode},
    );
    final body = res.data;
    if (body is Map<String, dynamic> &&
        (body['tk_status'] ?? '').toString().toUpperCase() != 'NG') {
      final data = body['data'];
      if (data is List && data.isNotEmpty && data.first is Map) {
        final first = data.first as Map;
        final bom2 =
            int.tryParse((first['BOM2_M_CODE_COUNT'] ?? '0').toString()) ?? 0;
        final m140 =
            int.tryParse((first['M140_M_CODE_COUNT'] ?? '0').toString()) ?? 0;
        if (bom2 > m140) {
          return 'NG: M_CODE trong bom Giá fai có đủ trong bom sản xuất, bom sx thiếu ${(first['THIEU'] ?? '').toString()} M_CODE so với bom giá';
        }
      }
      return 'OK';
    }
    return 'NG: Chưa có BOM Giá';
  }
  Future<bool> _checkTwoVerActive(String gCode) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(
      'check_G_NAME_2Ver_active',
      data: {'G_CODE': gCode},
    );
    final body = res.data;
    if (body is Map<String, dynamic> &&
        (body['tk_status'] ?? '').toString().toUpperCase() != 'NG') {
      final data = body['data'];
      return data is List && data.length > 1;
    }
    return false;
  }
  Future<int> _checkGCodeActiveErr(String gCode) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand('checkGCodeVer', data: {'G_CODE': gCode});
    final body = res.data;
    if (body is Map<String, dynamic> &&
        (body['tk_status'] ?? '').toString().toUpperCase() != 'NG') {
      final data = body['data'];
      if (data is List && data.isNotEmpty && data.first is Map) {
        final first = data.first as Map;
        if ((first['USE_YN'] ?? '').toString().toUpperCase() == 'Y') return 0;
        return 3;
      }
      return 0;
    }
    return 4;
  }
  Future<Map<String, dynamic>> _checkPoBalanceTdycsx(String gCode) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(
      'checkpobalance_tdycsx',
      data: {'G_CODE': gCode},
    );
    final body = res.data;
    if (body is Map<String, dynamic> &&
        (body['tk_status'] ?? '').toString().toUpperCase() != 'NG') {
      final data = body['data'];
      if (data is List && data.isNotEmpty && data.first is Map) {
        return Map<String, dynamic>.from(data.first);
      }
    }
    return <String, dynamic>{'G_CODE': gCode, 'PO_BALANCE': 0};
  }
  Future<Map<String, dynamic>> _checkStockTdycsx(String gCode) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(
      'checktonkho_tdycsx',
      data: {'G_CODE': gCode},
    );
    final body = res.data;
    if (body is Map<String, dynamic> &&
        (body['tk_status'] ?? '').toString().toUpperCase() != 'NG') {
      final data = body['data'];
      if (data is List && data.isNotEmpty && data.first is Map) {
        return Map<String, dynamic>.from(data.first);
      }
    }
    return <String, dynamic>{
      'G_CODE': gCode,
      'BTP': 0,
      'TONG_TON_KIEM': 0,
      'BLOCK_QTY': 0,
      'TON_TP': 0,
    };
  }
  Future<Map<String, dynamic>> _checkFcstTdycsx(String gCode) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(
      'checkfcst_tdycsx',
      data: {'G_CODE': gCode},
    );
    final body = res.data;
    if (body is Map<String, dynamic> &&
        (body['tk_status'] ?? '').toString().toUpperCase() != 'NG') {
      final data = body['data'];
      if (data is List && data.isNotEmpty && data.first is Map) {
        return Map<String, dynamic>.from(data.first);
      }
    }
    return <String, dynamic>{
      'G_CODE': gCode,
      'W1': 0,
      'W2': 0,
      'W3': 0,
      'W4': 0,
      'W5': 0,
      'W6': 0,
      'W7': 0,
      'W8': 0,
    };
  }
  Future<bool> _isGCodeFl(String gCode) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(
      'checkMassG_CODE',
      data: {'G_CODE': gCode},
    );
    final body = res.data;
    if (body is Map<String, dynamic> &&
        (body['tk_status'] ?? '').toString().toUpperCase() != 'NG') {
      final data = body['data'];
      if (data is List) return data.isEmpty;
      return true;
    }
    return true;
  }
  Future<String> _processLotNoGenerate(String machinename) async {
    final api = ref.read(apiClientProvider);
    final inDate = _ymdNoDash(DateTime.now());
    var next = '$machinename${await _createYcsxHeader()}';
    final res = await api.postCommand(
      'getLastProcessLotNo',
      data: {'machine': machinename, 'in_date': inDate},
    );
    final body = res.data;
    if (body is Map<String, dynamic> &&
        (body['tk_status'] ?? '').toString().toUpperCase() != 'NG') {
      final data = body['data'];
      if (data is List && data.isNotEmpty && data.first is Map) {
        final first = data.first as Map;
        final seq = int.tryParse((first['SEQ_NO'] ?? '0').toString()) ?? 0;
        next += _zeroPad(seq + 1, 3);
        return next;
      }
    }
    next += '001';
    return next;
  }

  Future<String> _getNextP500InNo() async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand('checkProcessInNoP500', data: {});
    final body = res.data;
    if (body is Map<String, dynamic> &&
        (body['tk_status'] ?? '').toString().toUpperCase() != 'NG') {
      final data = body['data'];
      if (data is List && data.isNotEmpty && data.first is Map) {
        final first = data.first as Map;
        final raw = (first['PROCESS_IN_NO'] ?? '0').toString();
        final n = int.tryParse(raw) ?? 0;
        return _zeroPad(n + 1, 3);
      }
    }
    return '001';
  }
  Future<void> _openAddYcsxForm() async {
    final authState = ref.read(authNotifierProvider);
    final emplNo = authState is AuthAuthenticated
        ? authState.session.user.emplNo
        : '';
    if (emplNo.isEmpty) return;
    Map<String, dynamic>? selectedCust;
    Map<String, dynamic>? selectedCode;
    Map<String, dynamic>? selectedPo;
    var newphanloai = 'TT';
    var loaisx = '01';
    var loaixh = '02';
    var isFirstLot = false;
    var isTamThoi = 'N';
    var deliveryDate = DateTime.now();
    final qtyCtrl = TextEditingController(text: '0');
    final remarkCtrl = TextEditingController();
    final codeSearchCtrl = TextEditingController();
    Future<void> pickDelivery() async {
      final picked = await showDatePicker(
        context: context,
        initialDate: deliveryDate,
        firstDate: DateTime(2020, 1, 1),
        lastDate: DateTime(2100, 12, 31),
      );
      if (picked == null) return;
      deliveryDate = picked;
      if (mounted) setState(() {});
    }
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setSheetState) {
            void refresh() => setSheetState(() {});
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
                  Text(
                    'Thêm YCSX',
                    style: Theme.of(ctx).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w800,
                      color: scheme.onSurface,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () async {
                            final p = await _pickCustomer();
                            if (p == null) return;
                            selectedCust = p;
                            selectedPo = null;
                            refresh();
                          },
                          style: OutlinedButton.styleFrom(
                            foregroundColor: scheme.onSurface,
                          ),
                          child: Text(
                            selectedCust == null
                                ? 'Chọn khách'
                                : '${selectedCust!['CUST_CD'] ?? ''}',
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () async {
                            final p = await _pickCode(codeSearchCtrl.text);
                            if (p == null) return;
                            selectedCode = p;
                            codeSearchCtrl.text = (p['G_CODE'] ?? '')
                                .toString();
                            selectedPo = null;
                            if (loaisx == '04') {
                              isFirstLot = false;
                            } else {
                              isFirstLot = await _isGCodeFl(
                                (p['G_CODE'] ?? '').toString(),
                              );
                            }
                            refresh();
                          },
                          style: OutlinedButton.styleFrom(
                            foregroundColor: scheme.onSurface,
                          ),
                          child: Text(
                            selectedCode == null
                                ? 'Chọn code'
                                : '${selectedCode!['G_CODE'] ?? ''}',
                          ),
                        ),
                      ),
                    ],
                  ),
                  if (selectedCust != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      (selectedCust!['CUST_NAME_KD'] ?? '').toString(),
                      style: TextStyle(
                        color: Theme.of(ctx).colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ],
                  if (selectedCode != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      (selectedCode!['G_NAME_KD'] ?? '').toString(),
                      style: TextStyle(
                        color: Theme.of(ctx).colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ],
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    isExpanded: true,
                    key: ValueKey<String>('add_phanloai_$newphanloai'),
                    initialValue: newphanloai,
                    dropdownColor: scheme.surface,
                    style: TextStyle(color: scheme.onSurface),
                    decoration: const InputDecoration(
                      labelText: 'Loại SP (PHANLOAI)',
                    ),
                    items: const [
                      DropdownMenuItem(
                        value: 'TT',
                        child: Text('Hàng Thường (TT)'),
                      ),
                      DropdownMenuItem(
                        value: 'SP',
                        child: Text('Sample sang FL (SP)'),
                      ),
                      DropdownMenuItem(value: 'RB', child: Text('Ribbon (RB)')),
                      DropdownMenuItem(
                        value: 'HQ',
                        child: Text('Hàn Quốc (HQ)'),
                      ),
                      DropdownMenuItem(
                        value: 'VN',
                        child: Text('Việt Nam (VN)'),
                      ),
                      DropdownMenuItem(value: 'AM', child: Text('Amazon (AM)')),
                      DropdownMenuItem(
                        value: 'DL',
                        child: Text('Đổi LOT (DL)'),
                      ),
                      DropdownMenuItem(value: 'M4', child: Text('NM4 (M4)')),
                      DropdownMenuItem(
                        value: 'GC',
                        child: Text('Hàng Gia Công (GC)'),
                      ),
                      DropdownMenuItem(
                        value: 'TM',
                        child: Text('Hàng Thương Mại (TM)'),
                      ),
                    ],
                    onChanged: (v) {
                      if (v == null) return;
                      newphanloai = v;
                      refresh();
                    },
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: DropdownButtonFormField<String>(
                          isExpanded: true,
                          key: ValueKey<String>('add_loaisx_$loaisx'),
                          initialValue: loaisx,
                          dropdownColor: scheme.surface,
                          style: TextStyle(color: scheme.onSurface),
                          decoration: const InputDecoration(
                            labelText: 'Loại SX (CODE_55)',
                          ),
                          items: const [
                            DropdownMenuItem(
                              value: '01',
                              child: Text('Thông Thường'),
                            ),
                            DropdownMenuItem(value: '02', child: Text('SDI')),
                            DropdownMenuItem(value: '03', child: Text('ETC')),
                            DropdownMenuItem(
                              value: '04',
                              child: Text('SAMPLE'),
                            ),
                          ],
                          onChanged: (v) {
                            if (v == null) return;
                            loaisx = v;
                            if (v == '04') isFirstLot = false;
                            refresh();
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: DropdownButtonFormField<String>(
                          isExpanded: true,
                          key: ValueKey<String>('add_loaixh_$loaixh'),
                          initialValue: loaixh,
                          dropdownColor: scheme.surface,
                          style: TextStyle(color: scheme.onSurface),
                          decoration: const InputDecoration(
                            labelText: 'Loại XH (CODE_50)',
                          ),
                          items: const [
                            DropdownMenuItem(value: '01', child: Text('GC')),
                            DropdownMenuItem(value: '02', child: Text('SK')),
                            DropdownMenuItem(value: '03', child: Text('KD')),
                            DropdownMenuItem(value: '04', child: Text('VN')),
                            DropdownMenuItem(
                              value: '05',
                              child: Text('SAMPLE'),
                            ),
                            DropdownMenuItem(
                              value: '06',
                              child: Text('Vai bac 4'),
                            ),
                            DropdownMenuItem(value: '07', child: Text('ETC')),
                          ],
                          onChanged: (v) {
                            if (v == null) return;
                            loaixh = v;
                            refresh();
                          },
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: pickDelivery,
                          child: Text(
                            'Delivery: ${_fmtDateShort(_ymd(deliveryDate))}',
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () async {
                            if (selectedCust == null || selectedCode == null) {
                              return;
                            }
                            final gCode = (selectedCode!['G_CODE'] ?? '')
                                .toString();
                            final custCd = (selectedCust!['CUST_CD'] ?? '')
                                .toString();
                            final p = await _pickPono(
                              gCode: gCode,
                              custCd: custCd,
                            );
                            if (p == null) return;
                            selectedPo = p;
                            final rd = (p['RD_DATE'] ?? '').toString();
                            final dt = DateTime.tryParse(rd.substring(0, 10));
                            if (dt != null) deliveryDate = dt;
                            qtyCtrl.text = (p['PO_QTY'] ?? '0').toString();
                            refresh();
                          },
                          style: OutlinedButton.styleFrom(
                            foregroundColor: scheme.onSurface,
                          ),
                          child: Text(
                            selectedPo == null
                                ? 'PO NO'
                                : (selectedPo!['PO_NO'] ?? '').toString(),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: qtyCtrl,
                    decoration: const InputDecoration(labelText: 'YCSX QTY'),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: remarkCtrl,
                    decoration: const InputDecoration(labelText: 'Remark'),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: DropdownButtonFormField<String>(
                          isExpanded: true,
                          key: ValueKey<String>(
                            'add_firstlot_${isFirstLot ? 'Y' : 'N'}',
                          ),
                          initialValue: isFirstLot ? 'Y' : 'N',
                          dropdownColor: scheme.surface,
                          style: TextStyle(color: scheme.onSurface),
                          decoration: const InputDecoration(
                            labelText: 'First LOT',
                          ),
                          items: const [
                            DropdownMenuItem(
                              value: 'Y',
                              child: Text('First LOT'),
                            ),
                            DropdownMenuItem(
                              value: 'N',
                              child: Text('Not First LOT'),
                            ),
                          ],
                          onChanged: (v) {
                            if (v == null) return;
                            isFirstLot = v == 'Y';
                            refresh();
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: DropdownButtonFormField<String>(
                          isExpanded: true,
                          key: ValueKey<String>('add_istamthoi_$isTamThoi'),
                          initialValue: isTamThoi,
                          dropdownColor: scheme.surface,
                          style: TextStyle(color: scheme.onSurface),
                          decoration: const InputDecoration(
                            labelText: 'YC Tạm',
                          ),
                          items: const [
                            DropdownMenuItem(
                              value: 'Y',
                              child: Text('Tạm thời'),
                            ),
                            DropdownMenuItem(
                              value: 'N',
                              child: Text('Bình thường'),
                            ),
                          ],
                          onChanged: (v) {
                            if (v == null) return;
                            isTamThoi = v;
                            refresh();
                          },
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      onPressed: () async {
                        final nav = Navigator.of(ctx);
                        final qty = int.tryParse(qtyCtrl.text.trim()) ?? 0;
                        if (selectedCust == null ||
                            selectedCode == null ||
                            qty == 0) {
                          if (!mounted) return;
                          await _showAwesome(
                            context,
                            type: DialogType.warning,
                            title: 'Thiếu thông tin',
                            message: 'Vui lòng nhập đủ thông tin bắt buộc.',
                          );
                          return;
                        }
                        final gCode = (selectedCode!['G_CODE'] ?? '')
                            .toString();
                        final custCd = (selectedCust!['CUST_CD'] ?? '')
                            .toString();
                        final verErr = await _checkGCodeActiveErr(gCode);
                        if (verErr == 3) {
                          if (!mounted) return;
                          await _showAwesome(
                            context,
                            type: DialogType.error,
                            title: 'Không hợp lệ',
                            message: 'NG: ver bị khóa',
                          );
                          return;
                        }
                        if (verErr == 4) {
                          if (!mounted) return;
                          await _showAwesome(
                            context,
                            type: DialogType.error,
                            title: 'Không hợp lệ',
                            message: 'NG: không có code',
                          );
                          return;
                        }
                        final hasMain = await _checkBomGiaHasMain(gCode);
                        if (!hasMain) {
                          if (!mounted) return;
                          await _showAwesome(
                            context,
                            type: DialogType.error,
                            title: 'Không hợp lệ',
                            message: 'NG: BOM Giá chưa có main',
                          );
                          return;
                        }
                        final bomMatch = await _checkBomMatching(gCode);
                        if (bomMatch != 'OK') {
                          if (!mounted) return;
                          await _showAwesome(
                            context,
                            type: DialogType.error,
                            title: 'Không hợp lệ',
                            message: bomMatch,
                          );
                          return;
                        }
                        final twoVer = await _checkTwoVerActive(gCode);
                        if (twoVer && loaisx != '04') {
                          if (!mounted) return;
                          await _showAwesome(
                            context,
                            type: DialogType.error,
                            title: 'Không hợp lệ',
                            message: 'NG: cùng G_NAME_KD đang có 2 ver active',
                          );
                          return;
                        }
                        final nextNo = await _generateNextProdRequestNo();
                        final poBal = await _checkPoBalanceTdycsx(gCode);
                        final stock = await _checkStockTdycsx(gCode);
                        final fcst = await _checkFcstTdycsx(gCode);
                        final wSum =
                            _toInt(fcst['W1']) +
                            _toInt(fcst['W2']) +
                            _toInt(fcst['W3']) +
                            _toInt(fcst['W4']) +
                            _toInt(fcst['W5']) +
                            _toInt(fcst['W6']) +
                            _toInt(fcst['W7']) +
                            _toInt(fcst['W8']);
                        String remark = remarkCtrl.text.trim();
                        String code03 = '01';
                        String phanloaiInsert = newphanloai;
                        String materialYn = 'N';
                        if (newphanloai != 'TT' && newphanloai != 'AM') {
                          final lot = await _processLotNoGenerate(newphanloai);
                          materialYn = 'Y';
                          if (newphanloai == 'GD') {
                            phanloaiInsert = 'TT';
                            code03 = '09';
                            remark = 'GD: $remark';
                          } else {
                            remark = '$lot REMARK: $remark';
                          }
                        }
                        try {
                          if (newphanloai == 'TT' || newphanloai == 'AM') {
                            await _postCommandChecked(
                              'insertDBYCSX',
                              data: {
                                'PROD_REQUEST_NO': nextNo,
                                'G_CODE': gCode,
                              },
                              throwOnNg: false,
                            );
                            await _postCommandChecked(
                              'insertDBYCSX_New',
                              data: {
                                'PROD_REQUEST_NO': nextNo,
                                'G_CODE': gCode,
                              },
                              throwOnNg: false,
                            );
                          }
                          final payload = <String, dynamic>{
                            'PHANLOAI': phanloaiInsert,
                            'G_CODE': gCode.trim(),
                            'CUST_CD': custCd,
                            'REMK': remark,
                            'PROD_REQUEST_DATE': _ymdNoDash(DateTime.now()),
                            'PROD_REQUEST_NO': nextNo,
                            'CODE_50': loaixh,
                            'CODE_03': code03,
                            'CODE_55': loaisx,
                            'RIV_NO': 'A',
                            'PROD_REQUEST_QTY': qty,
                            'EMPL_NO': emplNo,
                            'USE_YN': 'Y',
                            'DELIVERY_DT': _ymdNoDash(deliveryDate),
                            'PO_NO': (selectedPo?['PO_NO'] ?? '').toString(),
                            'INS_EMPL': emplNo,
                            'UPD_EMPL': emplNo,
                            'YCSX_PENDING': 1,
                            'G_CODE2': gCode,
                            'PO_TDYCSX': _toInt(poBal['PO_BALANCE']),
                            'TKHO_TDYCSX': _toInt(stock['TON_TP']),
                            'FCST_TDYCSX': wSum,
                            'W1': _toInt(fcst['W1']),
                            'W2': _toInt(fcst['W2']),
                            'W3': _toInt(fcst['W3']),
                            'W4': _toInt(fcst['W4']),
                            'W5': _toInt(fcst['W5']),
                            'W6': _toInt(fcst['W6']),
                            'W7': _toInt(fcst['W7']),
                            'W8': _toInt(fcst['W8']),
                            'BTP_TDYCSX': _toInt(stock['BTP']),
                            'CK_TDYCSX': _toInt(stock['TONG_TON_KIEM']),
                            'PDUYET':
                                (_toInt(poBal['PO_BALANCE']) > 0 ||
                                    loaisx == '04')
                                ? 1
                                : 0,
                            'BLOCK_TDYCSX': _toInt(stock['BLOCK_QTY']),
                            'MATERIAL_YN': materialYn,
                            'IS_TAM_THOI': isTamThoi,
                            'FL_YN': isFirstLot ? 'Y' : 'N',
                          };
                          await _postCommandChecked(
                            'insert_ycsx',
                            data: payload,
                            throwOnNg: true,
                          );

                          if (newphanloai != 'TT' &&
                              newphanloai != 'AM' &&
                              newphanloai != 'GD') {
                            try {
                              final nextP500InNo = await _getNextP500InNo();
                              final inDate = _ymdNoDash(DateTime.now());
                              final planId = '${nextNo}A';
                              final nextProcessLotNoP501 =
                                  await _processLotNoGenerate(newphanloai);
                              final nextProcessPrtSeq =
                                  nextProcessLotNoP501.length >= 8
                                      ? nextProcessLotNoP501.substring(5, 8)
                                      : '';

                              await _postCommandChecked(
                                'insert_p500',
                                data: {
                                  'in_date': inDate,
                                  'next_process_in_no': nextP500InNo,
                                  'PROD_REQUEST_DATE': inDate,
                                  'PROD_REQUEST_NO': nextNo,
                                  'G_CODE': gCode,
                                  'EMPL_NO': emplNo,
                                  'phanloai': newphanloai,
                                  'PLAN_ID': planId,
                                  'PR_NB': 0,
                                },
                              );
                              await _postCommandChecked(
                                'insert_p501',
                                data: {
                                  'in_date': inDate,
                                  'next_process_in_no': nextP500InNo,
                                  'EMPL_NO': emplNo,
                                  'next_process_lot_no': nextProcessLotNoP501,
                                  'next_process_prt_seq': nextProcessPrtSeq,
                                  'PROD_REQUEST_DATE': inDate,
                                  'PROD_REQUEST_NO': nextNo,
                                  'PLAN_ID': planId,
                                  'PROCESS_NUMBER': 0,
                                  'TEMP_QTY': qty,
                                  'USE_YN': 'X',
                                },
                              );
                            } catch (e) {
                              if (mounted) {
                                await _showAwesome(
                                  context,
                                  type: DialogType.warning,
                                  title: 'Cảnh báo',
                                  message:
                                      'Đã thêm YCSX nhưng lỗi insert P500/P501: $e',
                                );
                              }
                            }
                          }

                          if (!mounted) return;
                          nav.pop();
                          await _showAwesome(
                            context,
                            type: DialogType.success,
                            title: 'Thành công',
                            message: 'Thêm YCSX thành công',
                          );
                          await _search();
                        } catch (e) {
                          if (!mounted) return;
                          await _showAwesome(
                            context,
                            type: DialogType.error,
                            title: 'Thất bại',
                            message: 'Thêm YCSX thất bại: $e',
                          );
                        }
                      },
                      child: const Text('Add'),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }
  Future<void> _openEditYcsxForm() async {
    final selected = _selectedRows();
    if (selected.length != 1) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Chọn đúng 1 YCSX để sửa')));
      return;
    }
    final authState = ref.read(authNotifierProvider);
    final emplNo = authState is AuthAuthenticated
        ? authState.session.user.emplNo
        : '';
    if (!(emplNo.toUpperCase() == 'LVT1906' ||
        emplNo.toUpperCase() == 'NHU1903')) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Không đủ quyền hạn để sửa')),
      );
      return;
    }
    final row = selected.first;
    final prodRequestNo = (row['PROD_REQUEST_NO'] ?? '').toString();
    var loaisx = (row['PHAN_LOAI'] ?? '01').toString();
    var loaixh = (row['LOAIXH'] ?? '02').toString();
    final qtyCtrl = TextEditingController(
      text: (row['PROD_REQUEST_QTY'] ?? '0').toString(),
    );
    final remarkCtrl = TextEditingController(
      text: (row['REMARK'] ?? '').toString(),
    );
    DateTime deliveryDate = DateTime.now();
    final rawDel = (row['DELIVERY_DT'] ?? '').toString();
    if (rawDel.length >= 10) {
      final dt = DateTime.tryParse(rawDel.substring(0, 10));
      if (dt != null) deliveryDate = dt;
    }
    Map<String, dynamic>? selectedCust = {
      'CUST_CD': row['CUST_CD'],
      'CUST_NAME_KD': row['CUST_NAME_KD'],
    };
    Map<String, dynamic>? selectedCode = {
      'G_CODE': row['G_CODE'],
      'G_NAME_KD': row['G_NAME_KD'],
      'G_NAME': row['G_NAME'],
    };
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setSheetState) {
            void refresh() => setSheetState(() {});
            final scheme = Theme.of(ctx).colorScheme;
            Future<void> pickDelivery() async {
              final picked = await showDatePicker(
                context: ctx,
                initialDate: deliveryDate,
                firstDate: DateTime(2020, 1, 1),
                lastDate: DateTime(2100, 12, 31),
              );
              if (picked == null) return;
              deliveryDate = picked;
              refresh();
            }
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
                  Text(
                    'Sửa YCSX $prodRequestNo',
                    style: Theme.of(ctx).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w800,
                      color: scheme.onSurface,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () async {
                            final p = await _pickCustomer();
                            if (p == null) return;
                            selectedCust = p;
                            refresh();
                          },
                          style: OutlinedButton.styleFrom(
                            foregroundColor: scheme.onSurface,
                          ),
                          child: Text('${selectedCust?['CUST_CD'] ?? ''}'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () async {
                            final p = await _pickCode(
                              (selectedCode?['G_CODE'] ?? '').toString(),
                            );
                            if (p == null) return;
                            selectedCode = p;
                            refresh();
                          },
                          style: OutlinedButton.styleFrom(
                            foregroundColor: scheme.onSurface,
                          ),
                          child: Text('${selectedCode?['G_CODE'] ?? ''}'),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: DropdownButtonFormField<String>(
                          isExpanded: true,
                          key: ValueKey<String>('edit_loaisx_$loaisx'),
                          initialValue: loaisx,
                          dropdownColor: scheme.surface,
                          style: TextStyle(color: scheme.onSurface),
                          decoration: const InputDecoration(
                            labelText: 'Loại SX (CODE_55)',
                          ),
                          items: const [
                            DropdownMenuItem(
                              value: '01',
                              child: Text('Thông Thường'),
                            ),
                            DropdownMenuItem(value: '02', child: Text('SDI')),
                            DropdownMenuItem(value: '03', child: Text('ETC')),
                            DropdownMenuItem(
                              value: '04',
                              child: Text('SAMPLE'),
                            ),
                          ],
                          onChanged: (v) {
                            if (v == null) return;
                            loaisx = v;
                            refresh();
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: DropdownButtonFormField<String>(
                          isExpanded: true,
                          key: ValueKey<String>('edit_loaixh_$loaixh'),
                          initialValue: loaixh,
                          dropdownColor: scheme.surface,
                          style: TextStyle(color: scheme.onSurface),
                          decoration: const InputDecoration(
                            labelText: 'Loại XH (CODE_50)',
                          ),
                          items: const [
                            DropdownMenuItem(value: '01', child: Text('GC')),
                            DropdownMenuItem(value: '02', child: Text('SK')),
                            DropdownMenuItem(value: '03', child: Text('KD')),
                            DropdownMenuItem(value: '04', child: Text('VN')),
                            DropdownMenuItem(
                              value: '05',
                              child: Text('SAMPLE'),
                            ),
                            DropdownMenuItem(
                              value: '06',
                              child: Text('Vai bac 4'),
                            ),
                            DropdownMenuItem(value: '07', child: Text('ETC')),
                          ],
                          onChanged: (v) {
                            if (v == null) return;
                            loaixh = v;
                            refresh();
                          },
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  OutlinedButton(
                    onPressed: pickDelivery,
                    style: OutlinedButton.styleFrom(
                      foregroundColor: scheme.onSurface,
                    ),
                    child: Text(
                      'Delivery: ${_fmtDateShort(_ymd(deliveryDate))}',
                    ),
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: qtyCtrl,
                    decoration: const InputDecoration(labelText: 'YCSX QTY'),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: remarkCtrl,
                    decoration: const InputDecoration(labelText: 'Remark'),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      onPressed: () async {
                        final nav = Navigator.of(ctx);
                        final qty = int.tryParse(qtyCtrl.text.trim()) ?? 0;
                        final gCode = (selectedCode?['G_CODE'] ?? '')
                            .toString();
                        final custCd = (selectedCust?['CUST_CD'] ?? '')
                            .toString();
                        if (gCode.isEmpty || custCd.isEmpty || qty == 0) {
                          if (!mounted) return;
                          await _showAwesome(
                            context,
                            type: DialogType.warning,
                            title: 'Thiếu thông tin',
                            message: 'NG: Không để trống thông tin bắt buộc',
                          );
                          return;
                        }
                        final exists = await _checkExistsCommand(
                          'checkYcsxExist',
                          prodRequestNo: prodRequestNo,
                        );
                        if (!exists) {
                          if (!mounted) return;
                          await _showAwesome(
                            context,
                            type: DialogType.error,
                            title: 'Không hợp lệ',
                            message: 'NG: Không tồn tại YCSX',
                          );
                          return;
                        }
                        try {
                          final api = ref.read(apiClientProvider);
                          final res = await api.postCommand(
                            'update_ycsx',
                            data: {
                              'G_CODE': gCode,
                              'CUST_CD': custCd,
                              'PROD_REQUEST_NO': prodRequestNo,
                              'REMK': remarkCtrl.text.trim(),
                              'CODE_50': loaixh,
                              'CODE_55': loaisx,
                              'PROD_REQUEST_QTY': qty,
                              'EMPL_NO': emplNo,
                              'DELIVERY_DT': _ymdNoDash(deliveryDate),
                            },
                          );
                          final body = res.data;
                          if (body is Map<String, dynamic> &&
                              (body['tk_status'] ?? '')
                                      .toString()
                                      .toUpperCase() ==
                                  'NG') {
                            if (!mounted) return;
                            await _showAwesome(
                              context,
                              type: DialogType.error,
                              title: 'Thất bại',
                              message:
                                  'Update YCSX thất bại: ${(body['message'] ?? 'NG').toString()}',
                            );
                            return;
                          }
                          if (!mounted) return;
                          nav.pop();
                          await _showAwesome(
                            context,
                            type: DialogType.success,
                            title: 'Thành công',
                            message: 'Update YCSX thành công',
                          );
                          await _search();
                        } catch (e) {
                          if (!mounted) return;
                          await _showAwesome(
                            context,
                            type: DialogType.error,
                            title: 'Lỗi',
                            message: e.toString(),
                          );
                        }
                      },
                      child: const Text('Update'),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
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
  bool get _isAllSelected =>
      _rows.isNotEmpty && _selectedIds.length == _rows.length;
  void _toggleSelectAll(bool? v) {
    setState(() {
      if (v == true) {
        _selectedIds
          ..clear()
          ..addAll(_rows.map((e) => (e['PROD_REQUEST_NO'] ?? '').toString()));
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
      'PROD_REQUEST_NO',
      'PROD_REQUEST_DATE',
      'DELIVERY_DT',
      'CUST_NAME_KD',
      'CUST_CD',
      'G_CODE',
      'G_NAME_KD',
      'G_NAME',
      'PROD_TYPE',
      'PROD_MAIN_MATERIAL',
      'PHANLOAI',
      'PHANLOAIHANG',
      'IS_TAM_THOI',
      'USE_YN',
      'PDUYET',
      'PENDING',
      'MATERIAL_YN',
      'REMARK',
      'QTY',
      'PO',
      'TONKHO',
      'BTP',
      'CK',
      'BLOCK',
      'FCST',
      'BANVE',
      for (var i = 1; i <= 8; i++) 'W$i',
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
      final isWeek = RegExp(r'^W[1-8]$').hasMatch(field);
      return PlutoColumn(
        title: field,
        field: field,
        type: PlutoColumnType.text(),
        enableContextMenu: false,
        enableSorting: true,
        enableFilterMenuItem: true,
        width: isWeek ? 70 : 120,
        minWidth: isWeek ? 60 : 90,
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

    String prNo(Map<String, dynamic> it) {
      return (it['PROD_REQUEST_NO'] ?? '').toString();
    }

    return [
      for (final it in rows)
        PlutoRow(
          checked: _selectedIds.contains(prNo(it)),
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
              .map((raw) => (raw['PROD_REQUEST_NO'] ?? '').toString()),
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
        'traYCSXDataFull',
        data: {
          'alltime': _allTime,
          'start_date': _ymd(_fromDate),
          'end_date': _ymd(_toDate),
          'cust_name': _custNameCtrl.text.trim(),
          'codeCMS': _codeCmsCtrl.text.trim(),
          'codeKD': _codeKdCtrl.text.trim(),
          'prod_type': _prodTypeCtrl.text.trim(),
          'empl_name': _emplNameCtrl.text.trim(),
          'phanloai': _phanloai,
          'ycsx_pending': _ycsxPendingCheck,
          'inspect_inputcheck': _inspectInputCheck,
          'prod_request_no': _prodRequestNoCtrl.text.trim(),
          'material': _materialCtrl.text.trim(),
          'phanloaihang': _phanloaihang,
          'is_tam_thoi': _isTamThoi,
          'material_yes': _materialYesOnly,
        },
      );
      final body = res.data;
      if (body is Map<String, dynamic> &&
          (body['tk_status'] ?? '').toString().toUpperCase() == 'NG') {
        if (!mounted) return;
        setState(() => _loading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text((body['message'] ?? 'NG').toString())),
        );
        return;
      }
      final data = (body is Map<String, dynamic> ? body['data'] : null);
      final list = (data is List ? data : const [])
          .map(
            (e) =>
                (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{}),
          )
          .toList();
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
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }
  List<Map<String, dynamic>> _selectedRows() {
    if (_selectedIds.isEmpty) return const [];
    return _rows
        .where(
          (r) => _selectedIds.contains((r['PROD_REQUEST_NO'] ?? '').toString()),
        )
        .toList();
  }
  Future<void> _runBatchCommand({
    required String command,
    required Map<String, dynamic> Function(Map<String, dynamic> row)
    dataBuilder,
    bool onlyOwnRows = false,
  }) async {
    final selected = _selectedRows();
    if (selected.isEmpty) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Chọn ít nhất 1 dòng')));
      return;
    }
    final messenger = ScaffoldMessenger.of(context);
    final authState = ref.read(authNotifierProvider);
    final emplNo = authState is AuthAuthenticated
        ? authState.session.user.emplNo
        : '';
    if (emplNo.isEmpty) return;
    try {
      final api = ref.read(apiClientProvider);
      var okCount = 0;
      var skipped = 0;
      var failed = 0;
      for (final r in selected) {
        if (onlyOwnRows) {
          final owner = (r['EMPL_NO'] ?? '').toString();
          if (owner.isNotEmpty && owner != emplNo) {
            skipped++;
            continue;
          }
        }
        final res = await api.postCommand(command, data: dataBuilder(r));
        final body = res.data;
        if (body is Map<String, dynamic> &&
            (body['tk_status'] ?? '').toString().toUpperCase() == 'NG') {
          failed++;
        } else {
          okCount++;
        }
      }
      if (!mounted) return;
      messenger.showSnackBar(
        SnackBar(content: Text('OK: $okCount, skip: $skipped, lỗi: $failed')),
      );
      await _search();
    } catch (e) {
      if (!mounted) return;
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }
  Future<void> _confirmAndRun(String title, Future<void> Function() fn) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(title),
        content: const Text('Xác nhận thực hiện trên các dòng đã chọn?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('Hủy'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            child: const Text('OK'),
          ),
        ],
      ),
    );
    if (ok != true) return;
    if (!mounted) return;
    await fn();
  }
  bool _canApprove(String emplNo, String emplNameFilter) {
    return emplNo.toUpperCase() == 'LVT1906' ||
        emplNameFilter.trim().toLowerCase() == 'pd';
  }
  Future<void> _setPheDuyet(int value) async {
    final authState = ref.read(authNotifierProvider);
    final emplNo = authState is AuthAuthenticated
        ? authState.session.user.emplNo
        : '';
    if (!_canApprove(emplNo, _emplNameCtrl.text)) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Không đủ quyền phê duyệt')));
      return;
    }
    await _confirmAndRun('Set phê duyệt = $value', () async {
      await _runBatchCommand(
        command: 'pheduyet_ycsx',
        dataBuilder: (r) => {
          'PROD_REQUEST_NO': (r['PROD_REQUEST_NO'] ?? '').toString(),
          'PDUYET': value,
        },
      );
    });
  }
  Future<void> _setMaterialYn(String v) async {
    await _confirmAndRun('Set MATERIAL_YN = $v', () async {
      await _runBatchCommand(
        command: 'setMaterial_YN',
        dataBuilder: (r) => {
          'PROD_REQUEST_NO': (r['PROD_REQUEST_NO'] ?? '').toString(),
          'MATERIAL_YN': v,
        },
      );
    });
  }
  Future<void> _setPending(int v) async {
    await _confirmAndRun('Set pending = $v', () async {
      await _runBatchCommand(
        command: 'setpending_ycsx',
        dataBuilder: (r) => {
          'PROD_REQUEST_NO': (r['PROD_REQUEST_NO'] ?? '').toString(),
          'YCSX_PENDING': v,
        },
      );
    });
  }
  Future<void> _setOpen(String v) async {
    await _confirmAndRun('Set USE_YN = $v', () async {
      await _runBatchCommand(
        command: 'setopen_ycsx',
        dataBuilder: (r) => {
          'PROD_REQUEST_NO': (r['PROD_REQUEST_NO'] ?? '').toString(),
          'USE_YN': v,
        },
      );
    });
  }
  Future<bool> _checkExistsCommand(
    String command, {
    required String prodRequestNo,
  }) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(
      command,
      data: {'PROD_REQUEST_NO': prodRequestNo},
    );
    final body = res.data;
    return body is Map<String, dynamic> &&
        (body['tk_status'] ?? '').toString().toUpperCase() != 'NG';
  }
  Future<bool> _shouldDeleteAmzData(String prodRequestNo) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(
      'checkInLaiCount_AMZ',
      data: {'PROD_REQUEST_NO': prodRequestNo},
    );
    final body = res.data;
    if (body is Map<String, dynamic> &&
        (body['tk_status'] ?? '').toString().toUpperCase() != 'NG') {
      final data = body['data'];
      if (data is List && data.isNotEmpty) {
        final first = data.first;
        if (first is Map) {
          final inLai =
              int.tryParse((first['IN_LAI_QTY'] ?? '0').toString()) ?? 0;
          return inLai == 0;
        }
      }
    }
    return false;
  }
  Future<void> _deleteSelected() async {
    final selected = _selectedRows();
    if (selected.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Chọn ít nhất 1 YCSX để xóa')),
      );
      return;
    }
    final messenger = ScaffoldMessenger.of(context);
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Xóa YCSX'),
        content: Text(
          'Chắc chắn muốn xóa ${selected.length} YCSX đã chọn? (chỉ xóa của user đăng nhập)',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('Hủy'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            child: const Text('Xóa'),
          ),
        ],
      ),
    );
    if (ok != true) return;
    if (!mounted) return;
    final authState = ref.read(authNotifierProvider);
    final emplNo = authState is AuthAuthenticated
        ? authState.session.user.emplNo
        : '';
    if (emplNo.isEmpty) return;
    try {
      final api = ref.read(apiClientProvider);
      var deleted = 0;
      var skipped = 0;
      var failed = 0;
      var blocked = 0;
      var planBlocked = 0;
      for (final r in selected) {
        final owner = (r['EMPL_NO'] ?? '').toString();
        if (owner.isNotEmpty && owner != emplNo) {
          skipped++;
          continue;
        }
        final prNo = (r['PROD_REQUEST_NO'] ?? '').toString();
        final checkO300 = await _checkExistsCommand(
          'checkYCSXQLSXPLAN',
          prodRequestNo: prNo,
        );
        if (checkO300) {
          blocked++;
          failed++;
          continue;
        }
        final checkPlanIdExist = await _checkExistsCommand(
          'checkPLAN_ID_Exist',
          prodRequestNo: prNo,
        );
        if (checkPlanIdExist) {
          planBlocked++;
          failed++;
          continue;
        }
        final res = await api.postCommand(
          'delete_ycsx',
          data: {'PROD_REQUEST_NO': prNo},
        );
        final body = res.data;
        if (body is Map<String, dynamic> &&
            (body['tk_status'] ?? '').toString().toUpperCase() == 'NG') {
          failed++;
          continue;
        }
        await api.postCommand('deleteDMYCSX', data: {'PROD_REQUEST_NO': prNo});
        await api.postCommand('deleteDMYCSX2', data: {'PROD_REQUEST_NO': prNo});
        await api.postCommand(
          'delete_P500_YCSX',
          data: {'PROD_REQUEST_NO': prNo, 'INS_EMPL': emplNo},
        );
        await api.postCommand(
          'delete_P501_YCSX',
          data: {'PLAN_ID': '${prNo}A', 'INS_EMPL': emplNo},
        );
        if (await _shouldDeleteAmzData(prNo)) {
          await api.postCommand(
            'deleteAMZ_DATA',
            data: {'PROD_REQUEST_NO': prNo},
          );
        }
        deleted++;
      }
      if (!mounted) return;
      messenger.showSnackBar(
        SnackBar(
          content: Text(
            'Đã xóa: $deleted, bỏ qua: $skipped, lỗi: $failed (đã xuất liệu: $blocked, đã chỉ thị: $planBlocked)',
          ),
        ),
      );
      await _search();
    } catch (e) {
      if (!mounted) return;
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }
  Future<void> _exportExcel() async {
    if (_rows.isEmpty) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Chưa có dữ liệu để xuất')));
      return;
    }
    final excel = xls.Excel.createExcel();
    final sheet = excel['YCSX'];
    final headers = <String>[
      'PROD_REQUEST_NO',
      'PROD_REQUEST_DATE',
      'DELIVERY_DT',
      'EMPL_NO',
      'EMPL_NAME',
      'CUST_CD',
      'CUST_NAME_KD',
      'G_CODE',
      'G_NAME_KD',
      'G_NAME',
      'PROD_TYPE',
      'PROD_MAIN_MATERIAL',
      'PROD_REQUEST_QTY',
      'PO_TDYCSX',
      'TOTAL_TKHO_TDYCSX',
      'TKHO_TDYCSX',
      'BTP_TDYCSX',
      'CK_TDYCSX',
      'BLOCK_TDYCSX',
      'FCST_TDYCSX',
      'W1',
      'W2',
      'W3',
      'W4',
      'W5',
      'W6',
      'W7',
      'W8',
      'YCSX_PENDING',
      'MATERIAL_YN',
      'PDUYET',
      'USE_YN',
      'PDBV',
      'SETVL',
      'DACHITHI',
      'DAUPAMZ',
      'REMARK',
      'INS_DATE',
      'UPD_DATE',
    ];
    sheet.appendRow(headers.map((h) => xls.TextCellValue(h)).toList());
    for (final r in _rows) {
      sheet.appendRow(
        headers.map((h) => xls.TextCellValue((r[h] ?? '').toString())).toList(),
      );
    }
    final bytes = excel.encode();
    if (bytes == null) return;
    final dir = await getTemporaryDirectory();
    final filename = 'YCSX_${DateTime.now().millisecondsSinceEpoch}.xlsx';
    final file = File('${dir.path}/$filename');
    await file.writeAsBytes(bytes, flush: true);
    await Share.shareXFiles([
      XFile(
        file.path,
        mimeType:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ),
    ]);
  }
  Widget _metricBox(
    ColorScheme scheme, {
    required String label,
    required String value,
    Color? valueColor,
  }) {
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
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
              color: scheme.onSurfaceVariant,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            value,
            style: TextStyle(
              fontSize: 12,
              color: valueColor ?? scheme.onSurface,
              fontWeight: FontWeight.w900,
            ),
          ),
        ],
      ),
    );
  }
  Widget _ycsxCard(
    BuildContext context,
    ColorScheme scheme,
    Map<String, dynamic> r,
  ) {
    final prNo = (r['PROD_REQUEST_NO'] ?? '').toString();
    final selected = _selectedIds.contains(prNo);
    final reqDate = _fmtDateShort((r['PROD_REQUEST_DATE'] ?? '').toString());
    final delDate = _fmtDateShort((r['DELIVERY_DT'] ?? '').toString());
    final cust = (r['CUST_NAME_KD'] ?? '').toString();
    final gCode = (r['G_CODE'] ?? '').toString();
    final gNameKd = (r['G_NAME_KD'] ?? '').toString();
    final gName = (r['G_NAME'] ?? '').toString();
    final prodType = (r['PROD_TYPE'] ?? '').toString();
    final material = (r['PROD_MAIN_MATERIAL'] ?? '').toString();
    final qty = _toInt(r['PROD_REQUEST_QTY']);
    final pending = _toInt(r['YCSX_PENDING']);
    final pduyet = _toInt(r['PDUYET']);
    final materialYn = (r['MATERIAL_YN'] ?? '').toString().toUpperCase();
    final useYn = (r['USE_YN'] ?? '').toString().toUpperCase();
    final banve = (r['BANVE'] ?? r['BAN_VE'] ?? '').toString().toUpperCase();
    final pdbv = _toInt(r['PDBV']);
    final setvl = _toInt(r['SETVL']);
    final dachithi = _toInt(r['DACHITHI']);
    final daupamz = _toInt(r['DAUPAMZ']);
    final po = _toInt(r['PO_TDYCSX']);
    final tkho = _toInt(r['TOTAL_TKHO_TDYCSX']);
    final btp = _toInt(r['BTP_TDYCSX']);
    final ck = _toInt(r['CK_TDYCSX']);
    final block = _toInt(r['BLOCK_TDYCSX']);
    final fcst = _toInt(r['FCST_TDYCSX']);
    final w = List<int>.generate(8, (i) => _toInt(r['W${i + 1}']));
    return Card(
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () {
          setState(() {
            if (selected) {
              _selectedIds.remove(prNo);
            } else {
              _selectedIds.add(prNo);
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
                      border: Border.all(
                        color: selected
                            ? scheme.primary
                            : scheme.outlineVariant,
                      ),
                    ),
                    child: selected
                        ? Icon(Icons.check, size: 16, color: scheme.onPrimary)
                        : null,
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      prNo,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w800,
                        color: scheme.onSurface,
                      ),
                    ),
                  ),
                  if (pending == 1)
                    Text(
                      'PENDING',
                      style: TextStyle(
                        color: Colors.orange.shade800,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  if (pduyet == 1) ...[
                    const SizedBox(width: 8),
                    Text(
                      'PD',
                      style: TextStyle(
                        color: Colors.green.shade700,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ],
                ],
              ),
              if (materialYn.isNotEmpty ||
                  useYn.isNotEmpty ||
                  pdbv == 1 ||
                  setvl == 1 ||
                  dachithi == 1 ||
                  daupamz == 1) ...[
                const SizedBox(height: 6),
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: [
                    if (useYn == 'N')
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade300,
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: const Text(
                          'CLOSE',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ),
                    if (materialYn == 'Y')
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.deepPurple.shade100,
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: Text(
                          'SET VL',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w900,
                            color: Colors.deepPurple.shade900,
                          ),
                        ),
                      ),
                    if (pdbv == 1)
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.teal.shade100,
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: Text(
                          'PDBV',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w900,
                            color: Colors.teal.shade900,
                          ),
                        ),
                      ),
                    if (setvl == 1)
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.deepPurple.shade100,
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: Text(
                          'SETVL',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w900,
                            color: Colors.deepPurple.shade900,
                          ),
                        ),
                      ),
                    if (dachithi == 1)
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.blue.shade100,
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: Text(
                          'CHỈ THỊ',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w900,
                            color: Colors.blue.shade900,
                          ),
                        ),
                      ),
                    if (daupamz == 1)
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.orange.shade100,
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: Text(
                          'UP AMZ',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w900,
                            color: Colors.orange.shade900,
                          ),
                        ),
                      ),
                  ],
                ),
              ],
              const SizedBox(height: 4),
              Text(
                'Req: $reqDate  •  Del: $delDate',
                style: TextStyle(
                  color: scheme.onSurfaceVariant,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                cust,
                style: TextStyle(
                  color: scheme.onSurfaceVariant,
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                gCode,
                style: TextStyle(
                  color: scheme.onSurface,
                  fontSize: 12,
                  fontWeight: FontWeight.w900,
                ),
              ),
              if (gNameKd.isNotEmpty || gName.isNotEmpty) ...[
                const SizedBox(height: 2),
                Text(
                  gNameKd.isNotEmpty ? gNameKd : gName,
                  style: TextStyle(
                    color: scheme.onSurfaceVariant,
                    fontSize: 12,
                  ),
                ),
              ],
              if (prodType.isNotEmpty || material.isNotEmpty) ...[
                const SizedBox(height: 2),
                Text(
                  [
                    prodType,
                    material,
                  ].where((e) => e.trim().isNotEmpty).join(' • '),
                  style: TextStyle(
                    color: scheme.onSurfaceVariant,
                    fontSize: 12,
                  ),
                ),
              ],
              const SizedBox(height: 8),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    _metricBox(
                      scheme,
                      label: 'QTY',
                      value: _fmtInt(qty),
                      valueColor: Colors.blue.shade700,
                    ),
                    const SizedBox(width: 6),
                    _metricBox(
                      scheme,
                      label: 'PO',
                      value: _fmtInt(po),
                      valueColor: Colors.red.shade700,
                    ),
                    const SizedBox(width: 6),
                    _metricBox(scheme, label: 'T_KHO', value: _fmtInt(tkho)),
                    const SizedBox(width: 6),
                    _metricBox(scheme, label: 'BTP', value: _fmtInt(btp)),
                    const SizedBox(width: 6),
                    _metricBox(scheme, label: 'CK', value: _fmtInt(ck)),
                    const SizedBox(width: 6),
                    _metricBox(scheme, label: 'BLOCK', value: _fmtInt(block)),
                    const SizedBox(width: 6),
                    _metricBox(
                      scheme,
                      label: 'FCST',
                      value: _fmtInt(fcst),
                      valueColor: Colors.green.shade700,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: List<Widget>.generate(8, (i) {
                    return Padding(
                      padding: EdgeInsets.only(right: i == 7 ? 0 : 6),
                      child: _metricBox(
                        scheme,
                        label: 'W${i + 1}',
                        value: _fmtInt(w[i]),
                      ),
                    );
                  }),
                ),
              ),

              if (banve == 'Y') ...[
                const SizedBox(height: 10),
                Align(
                  alignment: Alignment.centerRight,
                  child: OutlinedButton.icon(
                    onPressed: () {
                      final url = '${AppConfig.imageBaseUrl}/banve/$gCode.pdf?v=${DateTime.now().millisecondsSinceEpoch}';
                      _openUrl(url);
                    },
                    icon: const Icon(Icons.picture_as_pdf),
                    label: const Text('Bản vẽ'),
                  ),
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
    final selectedCount = _selectedIds.length;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Quản lý YCSX'),
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
                await _openAddYcsxForm();
              } else if (v == 'edit') {
                await _openEditYcsxForm();
              } else if (v == 'delete') {
                await _deleteSelected();
              } else if (v == 'export') {
                await _exportExcel();
              } else if (v == 'approve_1') {
                await _setPheDuyet(1);
              } else if (v == 'approve_0') {
                await _setPheDuyet(0);
              } else if (v == 'material_y') {
                await _setMaterialYn('Y');
              } else if (v == 'material_n') {
                await _setMaterialYn('N');
              } else if (v == 'pending_1') {
                await _setPending(1);
              } else if (v == 'pending_0') {
                await _setPending(0);
              } else if (v == 'open_y') {
                await _setOpen('Y');
              } else if (v == 'open_n') {
                await _setOpen('N');
              }
            },
            itemBuilder: (ctx) => [
              const PopupMenuItem(value: 'search', child: Text('Tra cứu')),
              const PopupMenuDivider(),
              const PopupMenuItem(value: 'add', child: Text('Thêm YCSX')),
              PopupMenuItem(
                value: 'edit',
                enabled: selectedCount == 1,
                child: const Text('Sửa YCSX'),
              ),
              PopupMenuItem(
                value: 'delete',
                enabled: selectedCount >= 1,
                child: const Text('Xóa YCSX'),
              ),
              const PopupMenuDivider(),
              PopupMenuItem(
                value: 'approve_1',
                enabled: selectedCount >= 1,
                child: const Text('Phê duyệt (PDUYET=1)'),
              ),
              PopupMenuItem(
                value: 'approve_0',
                enabled: selectedCount >= 1,
                child: const Text('Bỏ phê duyệt (PDUYET=0)'),
              ),
              PopupMenuItem(
                value: 'material_y',
                enabled: selectedCount >= 1,
                child: const Text('Material lock (Y)'),
              ),
              PopupMenuItem(
                value: 'material_n',
                enabled: selectedCount >= 1,
                child: const Text('Material unlock (N)'),
              ),
              PopupMenuItem(
                value: 'pending_1',
                enabled: selectedCount >= 1,
                child: const Text('Set pending (1)'),
              ),
              PopupMenuItem(
                value: 'pending_0',
                enabled: selectedCount >= 1,
                child: const Text('Unset pending (0)'),
              ),
              PopupMenuItem(
                value: 'open_y',
                enabled: selectedCount >= 1,
                child: const Text('Open (USE_YN=Y)'),
              ),
              PopupMenuItem(
                value: 'open_n',
                enabled: selectedCount >= 1,
                child: const Text('Close (USE_YN=N)'),
              ),
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
                              style: Theme.of(context).textTheme.titleSmall
                                  ?.copyWith(fontWeight: FontWeight.bold),
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
                                _prodRequestNoCtrl.clear();
                                _materialCtrl.clear();
                                _phanloai = '00';
                                _phanloaihang = 'ALL';
                                _isTamThoi = 'N';
                                _materialYesOnly = false;
                                _ycsxPendingCheck = false;
                                _inspectInputCheck = false;
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
                              child: Text(
                                'Từ: ${_fmtDateShort(_ymd(_fromDate))}',
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () => _pickDate(from: false),
                              child: Text(
                                'Đến: ${_fmtDateShort(_ymd(_toDate))}',
                              ),
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
                          Expanded(
                            child: DropdownButtonFormField<String>(
                              isExpanded: true,
                              key: ValueKey<String>(
                                'filter_phanloai_$_phanloai',
                              ),
                              initialValue: _phanloai,
                              dropdownColor: scheme.surface,
                              style: TextStyle(color: scheme.onSurface),
                              decoration: const InputDecoration(
                                labelText: 'Phân loại (PHANLOAI)',
                              ),
                              items: const [
                                DropdownMenuItem(
                                  value: '00',
                                  child: Text('ALL'),
                                ),
                                DropdownMenuItem(
                                  value: '01',
                                  child: Text('Thông thường'),
                                ),
                                DropdownMenuItem(
                                  value: '02',
                                  child: Text('SDI'),
                                ),
                                DropdownMenuItem(
                                  value: '03',
                                  child: Text('GC'),
                                ),
                                DropdownMenuItem(
                                  value: '04',
                                  child: Text('SAMPLE'),
                                ),
                                DropdownMenuItem(
                                  value: '22',
                                  child: Text('NOT SAMPLE'),
                                ),
                              ],
                              onChanged: (v) {
                                if (v == null) return;
                                setState(() => _phanloai = v);
                              },
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: DropdownButtonFormField<String>(
                              isExpanded: true,
                              key: ValueKey<String>(
                                'filter_phanloaihang_$_phanloaihang',
                              ),
                              initialValue: _phanloaihang,
                              dropdownColor: scheme.surface,
                              style: TextStyle(color: scheme.onSurface),
                              decoration: const InputDecoration(
                                labelText: 'PL hàng (PHANLOAIHANG)',
                              ),
                              items: const [
                                DropdownMenuItem(
                                  value: 'ALL',
                                  child: Text('ALL'),
                                ),
                                DropdownMenuItem(
                                  value: 'TT',
                                  child: Text('Hàng Thường (TT)'),
                                ),
                                DropdownMenuItem(
                                  value: 'SP',
                                  child: Text('Sample sang FL (SP)'),
                                ),
                                DropdownMenuItem(
                                  value: 'RB',
                                  child: Text('Ribbon (RB)'),
                                ),
                                DropdownMenuItem(
                                  value: 'HQ',
                                  child: Text('Hàn Quốc (HQ)'),
                                ),
                                DropdownMenuItem(
                                  value: 'VN',
                                  child: Text('Việt Nam (VN)'),
                                ),
                                DropdownMenuItem(
                                  value: 'AM',
                                  child: Text('Amazon (AM)'),
                                ),
                                DropdownMenuItem(
                                  value: 'DL',
                                  child: Text('Đổi LOT (DL)'),
                                ),
                                DropdownMenuItem(
                                  value: 'M4',
                                  child: Text('NM4 (M4)'),
                                ),
                                DropdownMenuItem(
                                  value: 'GC',
                                  child: Text('Hàng Gia Công (GC)'),
                                ),
                                DropdownMenuItem(
                                  value: 'TM',
                                  child: Text('Hàng Thương Mại (TM)'),
                                ),
                              ],
                              onChanged: (v) {
                                if (v == null) return;
                                setState(() => _phanloaihang = v);
                              },
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      DropdownButtonFormField<String>(
                        isExpanded: true,
                        key: ValueKey<String>('filter_istamthoi_$_isTamThoi'),
                        initialValue: _isTamThoi,
                        dropdownColor: scheme.surface,
                        style: TextStyle(color: scheme.onSurface),
                        decoration: const InputDecoration(
                          labelText: 'Tạm thời (IS_TAM_THOI)',
                        ),
                        items: const [
                          DropdownMenuItem(
                            value: 'N',
                            child: Text('ALL / Bình thường'),
                          ),
                          DropdownMenuItem(value: 'Y', child: Text('Tạm thời')),
                        ],
                        onChanged: (v) {
                          if (v == null) return;
                          setState(() => _isTamThoi = v);
                        },
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(
                            child: SwitchListTile(
                              contentPadding: EdgeInsets.zero,
                              title: const Text('Material YES only'),
                              value: _materialYesOnly,
                              onChanged: (v) =>
                                  setState(() => _materialYesOnly = v),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: SwitchListTile(
                              contentPadding: EdgeInsets.zero,
                              title: const Text('Pending'),
                              value: _ycsxPendingCheck,
                              onChanged: (v) =>
                                  setState(() => _ycsxPendingCheck = v),
                            ),
                          ),
                        ],
                      ),
                      SwitchListTile(
                        contentPadding: EdgeInsets.zero,
                        title: const Text('Inspect input check'),
                        value: _inspectInputCheck,
                        onChanged: (v) =>
                            setState(() => _inspectInputCheck = v),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: _codeKdCtrl,
                              decoration: const InputDecoration(
                                labelText: 'Code KD',
                              ),
                              textInputAction: TextInputAction.next,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: TextField(
                              controller: _codeCmsCtrl,
                              decoration: const InputDecoration(
                                labelText: 'Code ERP',
                              ),
                              textInputAction: TextInputAction.next,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: _custNameCtrl,
                              decoration: const InputDecoration(
                                labelText: 'Customer',
                              ),
                              textInputAction: TextInputAction.next,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: TextField(
                              controller: _emplNameCtrl,
                              decoration: const InputDecoration(
                                labelText: 'Empl name',
                              ),
                              textInputAction: TextInputAction.next,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: _prodTypeCtrl,
                              decoration: const InputDecoration(
                                labelText: 'Prod type',
                              ),
                              textInputAction: TextInputAction.next,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: TextField(
                              controller: _materialCtrl,
                              decoration: const InputDecoration(
                                labelText: 'Material',
                              ),
                              textInputAction: TextInputAction.next,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      TextField(
                        controller: _prodRequestNoCtrl,
                        decoration: const InputDecoration(
                          labelText: 'PROD_REQUEST_NO',
                        ),
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
            if (_loading)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: CircularProgressIndicator(),
                ),
              )
            else ...[
              Row(
                children: [
                  Expanded(
                    child: Text(
                      'Kết quả: ${_rows.length} dòng',
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  if (_rows.isNotEmpty)
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Checkbox(
                          value: _isAllSelected,
                          onChanged: _toggleSelectAll,
                        ),
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
                for (final r in _rows) _ycsxCard(context, scheme, r),
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
