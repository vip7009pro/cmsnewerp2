import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pluto_grid/pluto_grid.dart';

import '../../../app/app_drawer.dart';
import '../../../core/providers.dart';
import '../../auth/application/auth_notifier.dart';
import '../../auth/application/auth_state.dart';

enum _TraCuuMode { nhap, xuat, ton }

class NhapXuatTonLieuPage extends ConsumerStatefulWidget {
  const NhapXuatTonLieuPage({super.key});

  @override
  ConsumerState<NhapXuatTonLieuPage> createState() => _NhapXuatTonLieuPageState();
}

class _NhapXuatTonLieuPageState extends ConsumerState<NhapXuatTonLieuPage> with SingleTickerProviderStateMixin {
  late final TabController _tabCtrl;
  final ValueNotifier<bool> _showFilter = ValueNotifier<bool>(true);

  @override
  void initState() {
    super.initState();
    _tabCtrl = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabCtrl.dispose();
    _showFilter.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Nhập/Xuất/Tồn Liệu'),
        actions: [
          ValueListenableBuilder<bool>(
            valueListenable: _showFilter,
            builder: (ctx, v, _) {
              return IconButton(
                tooltip: v ? 'Ẩn filter' : 'Hiện filter',
                onPressed: () => _showFilter.value = !_showFilter.value,
                icon: Icon(v ? Icons.filter_alt_off : Icons.filter_alt),
              );
            },
          ),
        ],
        bottom: TabBar(
          controller: _tabCtrl,
          tabs: const [
            Tab(text: 'Tra cứu'),
            Tab(text: 'Nhập liệu'),
            Tab(text: 'Xuất liệu'),
          ],
        ),
      ),
      drawer: const AppDrawer(),
      body: TabBarView(
        controller: _tabCtrl,
        children: [
          _TraCuuTab(showFilter: _showFilter),
          const _NhapLieuTab(),
          const _XuatLieuTab(),
        ],
      ),
    );
  }
}

class _TraCuuTab extends ConsumerStatefulWidget {
  const _TraCuuTab({required this.showFilter});

  final ValueNotifier<bool> showFilter;

  @override
  ConsumerState<_TraCuuTab> createState() => _TraCuuTabState();
}

class _TraCuuTabState extends ConsumerState<_TraCuuTab> {
  bool _loading = false;

  void _hideFilter() {
    widget.showFilter.value = false;
  }

  DateTime _fromDate = DateTime.now().subtract(const Duration(days: 7));
  DateTime _toDate = DateTime.now();

  bool _allTime = false;
  bool _justBalance = false;

  final TextEditingController _mNameCtrl = TextEditingController();
  final TextEditingController _mCodeCtrl = TextEditingController();
  final TextEditingController _codeKdCtrl = TextEditingController();
  final TextEditingController _prodRequestNoCtrl = TextEditingController();
  final TextEditingController _planIdCtrl = TextEditingController();
  final TextEditingController _inNhanhCtrl = TextEditingController();
  final TextEditingController _rollNoCtrl = TextEditingController();
  final TextEditingController _lotNccCtrl = TextEditingController();

  _TraCuuMode _mode = _TraCuuMode.nhap;

  List<PlutoColumn> _cols = const [];
  List<PlutoRow> _plutoRows = const [];
  PlutoGridStateManager? _sm;

  String _s(dynamic v) => (v ?? '').toString();

  @override
  void dispose() {
    _mNameCtrl.dispose();
    _mCodeCtrl.dispose();
    _codeKdCtrl.dispose();
    _prodRequestNoCtrl.dispose();
    _planIdCtrl.dispose();
    _inNhanhCtrl.dispose();
    _rollNoCtrl.dispose();
    _lotNccCtrl.dispose();
    super.dispose();
  }

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  bool _isNg(Map<String, dynamic> body) => (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  Future<Map<String, dynamic>> _post(String command, Map<String, dynamic> data) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(command, data: data);
    final body = res.data;
    if (body is Map<String, dynamic>) return body;
    return <String, dynamic>{'tk_status': 'NG', 'message': 'Bad response'};
  }

  String _ymd(DateTime dt) {
    final y = dt.year.toString().padLeft(4, '0');
    final m = dt.month.toString().padLeft(2, '0');
    final d = dt.day.toString().padLeft(2, '0');
    return '$y-$m-$d';
  }

  List<Map<String, dynamic>> _selectedRows() {
    final sm = _sm;
    if (sm == null) return const [];
    final checked = sm.checkedRows;
    if (checked.isEmpty) return const [];
    final out = <Map<String, dynamic>>[];
    for (final r in checked) {
      final raw = r.cells['__raw__']?.value;
      if (raw is Map<String, dynamic>) out.add(raw);
    }
    return out;
  }

  List<PlutoColumn> _buildCols(List<Map<String, dynamic>> rows) {
    if (rows.isEmpty) return const [];
    final keys = rows.first.keys.map((e) => e.toString()).toList();

    PlutoColumn c(String f) => PlutoColumn(
          title: f,
          field: f,
          type: PlutoColumnType.text(),
          width: 140,
          enableSorting: true,
          enableFilterMenuItem: true,
        );

    return [
      PlutoColumn(title: '', field: '__raw__', type: PlutoColumnType.text(), width: 0, hide: true),
      PlutoColumn(
        title: '✓',
        field: '__check__',
        type: PlutoColumnType.text(),
        width: 44,
        enableRowChecked: true,
        enableSorting: false,
        enableFilterMenuItem: false,
      ),
      for (final k in keys) c(k),
    ];
  }

  List<PlutoRow> _buildRows(List<Map<String, dynamic>> rows, List<PlutoColumn> cols) {
    Object? val(Map<String, dynamic> it, String f) {
      if (f == '__raw__') return it;
      if (f == '__check__') return '';
      final v = it[f];
      return v == null ? '' : v.toString();
    }

    return [
      for (final it in rows)
        PlutoRow(
          checked: false,
          cells: {
            for (final c in cols) c.field: PlutoCell(value: val(it, c.field)),
          },
        ),
    ];
  }

  Future<void> _loadNhap() async {
    _hideFilter();
    setState(() {
      _loading = true;
      _mode = _TraCuuMode.nhap;
    });

    try {
      final rollParts = _rollNoCtrl.text.trim().split('-');
      final body = await _post('tranhaplieu', {
        'M_NAME': _mNameCtrl.text.trim(),
        'FROM_DATE': _ymd(_fromDate),
        'TO_DATE': _ymd(_toDate),
        'ROLL_NO_START': rollParts.length == 2 ? rollParts[0].trim() : '',
        'ROLL_NO_STOP': rollParts.length == 2 ? rollParts[1].trim() : '',
      });

      if (_isNg(body)) {
        setState(() {
          _cols = const [];
          _plutoRows = const [];
          _loading = false;
        });
        _snack('Lỗi: ${_s(body['message'])}');
        return;
      }

      final rawData = body['data'];
      final data = rawData is List ? rawData : const [];
      final rows = data.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();

      final cols = _buildCols(rows);
      final rws = _buildRows(rows, cols);

      setState(() {
        _cols = cols;
        _plutoRows = rws;
        _loading = false;
      });

      _snack('Đã load ${rows.length} dòng');
    } catch (e) {
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Future<void> _loadXuat() async {
    _hideFilter();
    setState(() {
      _loading = true;
      _mode = _TraCuuMode.xuat;
    });

    try {
      final body = await _post('traxuatlieu', {
        'G_NAME': _codeKdCtrl.text.trim(),
        'ALLTIME': _allTime,
        'JUSTBALANCE': _justBalance,
        'PROD_REQUEST_NO': _prodRequestNoCtrl.text.trim(),
        'M_NAME': _mNameCtrl.text.trim(),
        'M_CODE': _mCodeCtrl.text.trim(),
        'FROM_DATE': _ymd(_fromDate),
        'TO_DATE': _ymd(_toDate),
        'PLAN_ID': _planIdCtrl.text.trim(),
        'IN_NHANH': _inNhanhCtrl.text.trim(),
      });

      if (_isNg(body)) {
        setState(() {
          _cols = const [];
          _plutoRows = const [];
          _loading = false;
        });
        _snack('Lỗi: ${_s(body['message'])}');
        return;
      }

      final rawData = body['data'];
      final data = rawData is List ? rawData : const [];
      final rows = data.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();

      final cols = _buildCols(rows);
      final rws = _buildRows(rows, cols);

      setState(() {
        _cols = cols;
        _plutoRows = rws;
        _loading = false;
      });

      _snack('Đã load ${rows.length} dòng');
    } catch (e) {
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Future<void> _loadTon() async {
    _hideFilter();
    setState(() {
      _loading = true;
      _mode = _TraCuuMode.ton;
    });

    try {
      final body = await _post('tratonlieu', {
        'M_CODE': _mCodeCtrl.text.trim(),
        'M_NAME': _mNameCtrl.text.trim(),
        'JUSTBALANCE': _justBalance,
      });

      if (_isNg(body)) {
        setState(() {
          _cols = const [];
          _plutoRows = const [];
          _loading = false;
        });
        _snack('Lỗi: ${_s(body['message'])}');
        return;
      }

      final rawData = body['data'];
      final data = rawData is List ? rawData : const [];
      final rows = data.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();

      final cols = _buildCols(rows);
      final rws = _buildRows(rows, cols);

      setState(() {
        _cols = cols;
        _plutoRows = rws;
        _loading = false;
      });

      _snack('Đã load ${rows.length} dòng');
    } catch (e) {
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  bool _isIqc() {
    final auth = ref.read(authNotifierProvider);
    if (auth is! AuthAuthenticated) return false;
    return (auth.session.user.subDeptName ?? '').toUpperCase() == 'IQC';
  }

  Future<void> _updateLotNcc() async {
    if (_mode != _TraCuuMode.nhap) {
      _snack('Chỉ update LOT NCC ở mode Data Nhập');
      return;
    }

    if (!_isIqc()) {
      _snack('Chỉ IQC mới được update LOT NCC');
      return;
    }

    final lotNcc = _lotNccCtrl.text.trim();
    if (lotNcc.isEmpty) {
      _snack('Nhập LOT NCC');
      return;
    }

    final selected = _selectedRows();
    if (selected.isEmpty) {
      _snack('Chọn ít nhất 1 dòng');
      return;
    }

    final messenger = ScaffoldMessenger.of(context);
    setState(() => _loading = true);

    try {
      var failed = 0;
      for (final r in selected) {
        final mLotNo = _s(r['M_LOT_NO']);
        if (mLotNo.isEmpty) {
          failed++;
          continue;
        }
        final body = await _post('updatelieuncc', {
          'M_LOT_NO': mLotNo,
          'LOTNCC': lotNcc,
        });
        if (_isNg(body)) failed++;
      }

      if (!mounted) return;
      setState(() => _loading = false);

      if (failed == 0) {
        messenger.showSnackBar(const SnackBar(content: Text('Update LOT NCC thành công')));
      } else {
        messenger.showSnackBar(SnackBar(content: Text('Update LOT NCC xong, lỗi: $failed')));
      }
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  Future<void> _pickDate({required bool isFrom}) async {
    final initial = isFrom ? _fromDate : _toDate;
    final picked = await showDatePicker(
      context: context,
      initialDate: initial,
      firstDate: DateTime(2020, 1, 1),
      lastDate: DateTime(2100, 12, 31),
    );
    if (picked == null) return;
    setState(() {
      if (isFrom) {
        _fromDate = picked;
      } else {
        _toDate = picked;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final canUpdateLotNcc = _mode == _TraCuuMode.nhap && _isIqc();
    final showFilter = widget.showFilter;

    return Padding(
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          ValueListenableBuilder<bool>(
            valueListenable: showFilter,
            builder: (ctx, v, _) {
              if (!v) return const SizedBox.shrink();
              return Card(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Wrap(
                        spacing: 12,
                        runSpacing: 8,
                        crossAxisAlignment: WrapCrossAlignment.center,
                        children: [
                            OutlinedButton(
                              onPressed: () => _pickDate(isFrom: true),
                              child: Text('Từ: ${_ymd(_fromDate)}'),
                            ),
                            OutlinedButton(
                              onPressed: () => _pickDate(isFrom: false),
                              child: Text('Đến: ${_ymd(_toDate)}'),
                            ),
                            SizedBox(
                              width: 220,
                              child: TextField(
                                controller: _mNameCtrl,
                                decoration: const InputDecoration(labelText: 'M_NAME'),
                              ),
                            ),
                            SizedBox(
                              width: 180,
                              child: TextField(
                                controller: _mCodeCtrl,
                                decoration: const InputDecoration(labelText: 'M_CODE'),
                              ),
                            ),
                            SizedBox(
                              width: 180,
                              child: TextField(
                                controller: _codeKdCtrl,
                                decoration: const InputDecoration(labelText: 'Code KD (G_NAME)'),
                              ),
                            ),
                            SizedBox(
                              width: 180,
                              child: TextField(
                                controller: _prodRequestNoCtrl,
                                decoration: const InputDecoration(labelText: 'YCSX (PROD_REQUEST_NO)'),
                              ),
                            ),
                            SizedBox(
                              width: 180,
                              child: TextField(
                                controller: _planIdCtrl,
                                decoration: const InputDecoration(labelText: 'PLAN_ID'),
                              ),
                            ),
                            SizedBox(
                              width: 150,
                              child: TextField(
                                controller: _inNhanhCtrl,
                                decoration: const InputDecoration(labelText: 'IN_NHANH'),
                              ),
                            ),
                            SizedBox(
                              width: 150,
                              child: TextField(
                                controller: _rollNoCtrl,
                                decoration: const InputDecoration(labelText: 'STT cuộn (start-stop)'),
                              ),
                            ),
                            Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Checkbox(
                                  value: _allTime,
                                  onChanged: (v) => setState(() => _allTime = v ?? false),
                                ),
                                const Text('All Time'),
                              ],
                            ),
                            Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Checkbox(
                                  value: _justBalance,
                                  onChanged: (v) => setState(() => _justBalance = v ?? false),
                                ),
                                const Text('Chỉ cuộn có tồn'),
                              ],
                            ),
                            FilledButton.icon(
                              onPressed: _loading ? null : _loadNhap,
                              icon: const Icon(Icons.search),
                              label: const Text('Tra Nhập'),
                            ),
                            FilledButton.icon(
                              onPressed: _loading ? null : _loadXuat,
                              icon: const Icon(Icons.search),
                              label: const Text('Tra Xuất'),
                            ),
                            FilledButton.icon(
                              onPressed: _loading ? null : _loadTon,
                              icon: const Icon(Icons.search),
                              label: const Text('Tra Tồn'),
                            ),
                            if (canUpdateLotNcc) ...[
                              SizedBox(
                                width: 220,
                                child: TextField(
                                  controller: _lotNccCtrl,
                                  decoration: const InputDecoration(labelText: 'LOT NCC (update)'),
                                ),
                              ),
                              FilledButton.tonal(
                                onPressed: _loading ? null : _updateLotNcc,
                                child: const Text('Update LOT NCC'),
                              ),
                            ],
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
          const SizedBox(height: 12),
          Expanded(
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(8),
                child: _loading
                    ? const Center(child: CircularProgressIndicator())
                    : (_cols.isEmpty
                        ? const Center(child: Text('Chưa có dữ liệu'))
                        : PlutoGrid(
                            columns: _cols,
                            rows: _plutoRows,
                            onLoaded: (e) {
                              _sm = e.stateManager;
                              e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                              e.stateManager.setShowColumnFilter(true);
                            },
                            onRowChecked: (_) {
                              if (!mounted) return;
                              setState(() {});
                            },
                            configuration: const PlutoGridConfiguration(
                              columnSize: PlutoGridColumnSizeConfig(autoSizeMode: PlutoAutoSizeMode.scale),
                            ),
                          )),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _NhapLieuTab extends ConsumerStatefulWidget {
  const _NhapLieuTab();

  @override
  ConsumerState<_NhapLieuTab> createState() => _NhapLieuTabState();
}

class _NhapLieuTabState extends ConsumerState<_NhapLieuTab> {
  bool _loading = false;

  List<Map<String, dynamic>> _vendorList = const [];
  List<Map<String, dynamic>> _materialList = const [];

  Map<String, dynamic>? _selectedVendor;
  Map<String, dynamic>? _selectedMaterial;

  String _selectedFactory = 'NM1';
  String _loaiNk = '03';

  DateTime _inDate = DateTime.now();
  DateTime _expDate = DateTime.now();

  final TextEditingController _invoiceCtrl = TextEditingController();

  List<Map<String, dynamic>> _rows = const [];
  List<PlutoColumn> _cols = const [];
  List<PlutoRow> _plutoRows = const [];
  PlutoGridStateManager? _sm;

  String _s(dynamic v) => (v ?? '').toString();
  int _i(dynamic v) => int.tryParse(_s(v)) ?? 0;
  num _n(dynamic v) => num.tryParse(_s(v)) ?? 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadLists();
    });
  }

  @override
  void dispose() {
    _invoiceCtrl.dispose();
    super.dispose();
  }

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  bool _isNg(Map<String, dynamic> body) => (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  Future<Map<String, dynamic>> _post(String command, Map<String, dynamic> data) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(command, data: data);
    final body = res.data;
    if (body is Map<String, dynamic>) return body;
    return <String, dynamic>{'tk_status': 'NG', 'message': 'Bad response'};
  }

  String _ymd(DateTime dt) {
    final y = dt.year.toString().padLeft(4, '0');
    final m = dt.month.toString().padLeft(2, '0');
    final d = dt.day.toString().padLeft(2, '0');
    return '$y-$m-$d';
  }

  Future<void> _loadLists() async {
    setState(() => _loading = true);
    try {
      final vBody = await _post('selectVendorList', {});
      final mBody = await _post('getMaterialList', {});

      final vendors = (vBody['data'] is List) ? (vBody['data'] as List) : const [];
      final mats = (mBody['data'] is List) ? (mBody['data'] as List) : const [];

      final v = vendors.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();
      final m = mats.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();

      setState(() {
        _vendorList = v;
        _materialList = m;
        _selectedVendor = v.isNotEmpty ? v.first : null;
        _selectedMaterial = m.isNotEmpty ? m.first : null;
        _loading = false;
      });
    } catch (e) {
      setState(() => _loading = false);
      _snack('Lỗi load list: $e');
    }
  }

  List<PlutoColumn> _buildCols() {
    PlutoColumn c(
      String f, {
      double w = 140,
      PlutoColumnType? type,
      bool editable = true,
    }) {
      return PlutoColumn(
        title: f,
        field: f,
        width: w,
        type: type ?? PlutoColumnType.text(),
        enableSorting: true,
        enableDropToResize: true,
        readOnly: !editable,
      );
    }

    return [
      PlutoColumn(title: '', field: '__raw__', type: PlutoColumnType.text(), width: 0, hide: true),
      PlutoColumn(
        title: '✓',
        field: '__check__',
        type: PlutoColumnType.text(),
        width: 44,
        enableRowChecked: true,
        enableSorting: false,
      ),
      c('CUST_CD', w: 120, editable: false),
      c('CUST_NAME_KD', w: 160, editable: false),
      c('M_CODE', w: 140, editable: false),
      c('M_NAME', w: 180, editable: false),
      c('WIDTH_CD', w: 110, editable: false),
      c('LOT_QTY', w: 110, type: PlutoColumnType.number(), editable: true),
      c('ROLL_PER_LOT', w: 140, type: PlutoColumnType.number(), editable: true),
      c('MET_PER_ROLL', w: 140, type: PlutoColumnType.number(), editable: true),
      c('INVOICE_NO', w: 140, editable: false),
      c('EXP_DATE', w: 130, editable: false),
      c('REMARK', w: 180, editable: true),
      c('PROD_REQUEST_NO', w: 160, editable: true),
    ];
  }

  List<PlutoRow> _buildRows(List<Map<String, dynamic>> rows, List<PlutoColumn> cols) {
    Object? val(Map<String, dynamic> it, String f) {
      if (f == '__raw__') return it;
      if (f == '__check__') return '';
      return it[f];
    }

    return [
      for (final it in rows)
        PlutoRow(
          checked: false,
          cells: {
            for (final c in cols) c.field: PlutoCell(value: val(it, c.field)),
          },
        ),
    ];
  }

  List<Map<String, dynamic>> _selectedRows() {
    final sm = _sm;
    if (sm == null) return const [];
    final checked = sm.checkedRows;
    if (checked.isEmpty) return const [];
    final out = <Map<String, dynamic>>[];
    for (final r in checked) {
      final raw = r.cells['__raw__']?.value;
      if (raw is Map<String, dynamic>) out.add(raw);
    }
    return out;
  }

  Future<Map<String, dynamic>?> _pickFromList(
    List<Map<String, dynamic>> src, {
    required String title,
    required String displayField,
    required String keyField,
  }) async {
    if (!mounted) return null;

    final ctrl = TextEditingController();
    Timer? debounce;
    var view = src.take(200).toList();

    Future<void> refresh(StateSetter setSheet, String q) async {
      final query = q.trim().toLowerCase();
      view = src
          .where((e) {
            final d = _s(e[displayField]).toLowerCase();
            final k = _s(e[keyField]).toLowerCase();
            return d.contains(query) || k.contains(query);
          })
          .take(200)
          .toList();
      setSheet(() {});
    }

    final picked = await showModalBottomSheet<Map<String, dynamic>>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (ctx) {
        final scheme = Theme.of(ctx).colorScheme;
        return StatefulBuilder(
          builder: (ctx, setSheet) {
            return Padding(
              padding: EdgeInsets.only(
                left: 12,
                right: 12,
                bottom: MediaQuery.of(ctx).viewInsets.bottom + 12,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(title, style: Theme.of(ctx).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
                  const SizedBox(height: 8),
                  TextField(
                    controller: ctrl,
                    decoration: const InputDecoration(prefixIcon: Icon(Icons.search), labelText: 'Search'),
                    onChanged: (v) {
                      debounce?.cancel();
                      debounce = Timer(const Duration(milliseconds: 250), () {
                        refresh(setSheet, v);
                      });
                    },
                  ),
                  const SizedBox(height: 8),
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      'Hiển thị ${view.length} / ${src.length} (giới hạn 200)',
                      style: TextStyle(color: scheme.onSurfaceVariant),
                    ),
                  ),
                  const SizedBox(height: 8),
                  SizedBox(
                    height: MediaQuery.of(ctx).size.height * 0.55,
                    child: ListView.builder(
                      itemCount: view.length,
                      itemBuilder: (ctx, i) {
                        final it = view[i];
                        final k = _s(it[keyField]);
                        final d = _s(it[displayField]);
                        return ListTile(
                          dense: true,
                          title: Text(d.isNotEmpty ? d : k),
                          subtitle: Text(k),
                          onTap: () => Navigator.of(ctx).pop(it),
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

  Future<void> _pickVendor() async {
    final picked = await _pickFromList(
      _vendorList,
      title: 'Chọn Vendor',
      displayField: 'CUST_NAME_KD',
      keyField: 'CUST_CD',
    );
    if (picked == null) return;
    setState(() => _selectedVendor = picked);
  }

  Future<void> _pickMaterial() async {
    final picked = await _pickFromList(
      _materialList,
      title: 'Chọn Vật liệu',
      displayField: 'M_NAME',
      keyField: 'M_CODE',
    );
    if (picked == null) return;
    setState(() => _selectedMaterial = picked);
  }

  Future<void> _pickDate({required bool isInDate}) async {
    final init = isInDate ? _inDate : _expDate;
    final picked = await showDatePicker(
      context: context,
      initialDate: init,
      firstDate: DateTime(2020, 1, 1),
      lastDate: DateTime(2100, 12, 31),
    );
    if (picked == null) return;
    setState(() {
      if (isInDate) {
        _inDate = picked;
      } else {
        _expDate = picked;
      }
    });
  }

  Future<void> _addRow() async {
    final vendor = _selectedVendor;
    final mat = _selectedMaterial;
    final invoice = _invoiceCtrl.text.trim();

    if (vendor == null || mat == null || invoice.isEmpty) {
      _snack('Không được để trống: Vendor/Material/Invoice');
      return;
    }

    final row = <String, dynamic>{
      'id': DateTime.now().microsecondsSinceEpoch,
      'CUST_CD': _s(vendor['CUST_CD']),
      'CUST_NAME_KD': _s(vendor['CUST_NAME_KD']),
      'M_CODE': _s(mat['M_CODE']),
      'M_NAME': _s(mat['M_NAME']),
      'WIDTH_CD': mat['WIDTH_CD'],
      'LOT_QTY': 0,
      'ROLL_PER_LOT': 1,
      'MET_PER_ROLL': 0,
      'INVOICE_NO': invoice,
      'EXP_DATE': _ymd(_expDate),
      'REMARK': '',
      'PROD_REQUEST_NO': '',
    };

    final rows = [..._rows, row];
    final cols = _cols.isEmpty ? _buildCols() : _cols;
    final rws = _buildRows(rows, cols);

    setState(() {
      _rows = rows;
      _cols = cols;
      _plutoRows = rws;
    });
  }

  Future<void> _deleteSelected() async {
    final selected = _selectedRows();
    if (selected.isEmpty) {
      _snack('Chọn ít nhất 1 dòng');
      return;
    }

    final ids = selected.map((e) => _s(e['id'])).toSet();
    final rows = _rows.where((e) => !ids.contains(_s(e['id']))).toList();
    final cols = _cols;
    final rws = _buildRows(rows, cols);

    setState(() {
      _rows = rows;
      _plutoRows = rws;
    });
  }

  Future<String> _getNextInNo() async {
    final body = await _post('getI221Lastest_IN_NO', {});
    if (_isNg(body)) return '001';
    final data = (body['data'] is List && (body['data'] as List).isNotEmpty) ? (body['data'] as List).first : null;
    if (data is! Map) return '001';

    final cur = _s(data['MAX_IN_NO']);
    final curInt = int.tryParse(cur) ?? 0;
    return (curInt + 1).toString().padLeft(3, '0');
  }

  Future<String> _getNextLotNo(String? currentLot) async {
    if (currentLot == null || currentLot.length < 12) {
      final body = await _post('getI222Lastest_M_LOT_NO', {});
      if (_isNg(body)) return '000000000001';
      final data = (body['data'] is List && (body['data'] as List).isNotEmpty) ? (body['data'] as List).first : null;
      if (data is! Map) return '000000000001';
      currentLot = _s(data['MAX_M_LOT_NO']);
    }

    if (currentLot.length < 12) return currentLot;

    final part1 = currentLot.substring(0, 8);
    final part2 = currentLot.substring(8, 12);
    final seq = int.tryParse(part2) ?? 0;
    final next = (seq + 1).toString().padLeft(4, '0');
    return '$part1$next';
  }

  Future<void> _nhapKho() async {
    if (_rows.isEmpty) {
      _snack('Không có dữ liệu nhập kho');
      return;
    }

    if (_invoiceCtrl.text.trim().isEmpty) {
      _snack('Nhập Invoice No');
      return;
    }

    if (_selectedVendor == null || _selectedMaterial == null) {
      _snack('Chọn Vendor và Vật liệu');
      return;
    }

    for (final r in _rows) {
      final lotQty = _i(r['LOT_QTY']);
      final rollPerLot = _i(r['ROLL_PER_LOT']);
      final metPerRoll = _n(r['MET_PER_ROLL']);
      final total = lotQty * rollPerLot * metPerRoll;
      if (total == 0) {
        _snack('Có dòng tổng met = 0, kiểm tra LOT_QTY/ROLL_PER_LOT/MET_PER_ROLL');
        return;
      }
    }

    final messenger = ScaffoldMessenger.of(context);

    if (!mounted) return;
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          title: const Text('Nhập kho vật liệu'),
          content: Text('Chắc chắn muốn nhập kho ${_rows.length} dòng?'),
          actions: [
            TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Hủy')),
            FilledButton(onPressed: () => Navigator.of(ctx).pop(true), child: const Text('Nhập kho')),
          ],
        );
      },
    );
    if (confirm != true) return;

    if (!mounted) return;
    setState(() => _loading = true);

    try {
      final nextInNo = await _getNextInNo();
      var err = '';

      String? lastLotNo;

      for (var i = 0; i < _rows.length; i++) {
        final r = _rows[i];
        final seq = (i + 1).toString().padLeft(3, '0');

        final lotQty = _i(r['LOT_QTY']);
        final rollPerLot = _i(r['ROLL_PER_LOT']);
        final metPerRoll = _n(r['MET_PER_ROLL']);

        final inCfmQty = lotQty * rollPerLot * metPerRoll;
        final rollQty = lotQty * rollPerLot;

        final insI221 = await _post('insert_I221', {
          'IN_NO': nextInNo,
          'IN_SEQ': seq,
          'M_CODE': _s(r['M_CODE']),
          'IN_CFM_QTY': inCfmQty,
          'REMARK': _s(r['REMARK']),
          'FACTORY': _selectedFactory,
          'CODE_50': _loaiNk,
          'INVOICE_NO': _invoiceCtrl.text.trim(),
          'CUST_CD': _selectedVendor?['CUST_CD'],
          'ROLL_QTY': rollQty,
          'EXP_DATE': _s(r['EXP_DATE']),
        });

        if (_isNg(insI221)) {
          err += 'Lỗi I221: ${_s(insI221['message'])} | ';
          continue;
        }

        for (var j = 0; j < lotQty; j++) {
          lastLotNo = await _getNextLotNo(lastLotNo);

          final locCd = _selectedFactory == 'NM1' ? 'BE010' : 'HD001';
          final wahsCd = _selectedFactory == 'NM1' ? 'B' : 'H';

          final insI222 = await _post('insert_I222', {
            'IN_NO': nextInNo,
            'IN_SEQ': seq,
            'M_LOT_NO': lastLotNo,
            'LOC_CD': locCd,
            'WAHS_CD': wahsCd,
            'M_CODE': _s(r['M_CODE']),
            'IN_CFM_QTY': rollPerLot * metPerRoll,
            'FACTORY': _selectedFactory,
            'CUST_CD': _selectedVendor?['CUST_CD'],
            'ROLL_QTY': rollPerLot,
            'PROD_REQUEST_NO': _s(r['PROD_REQUEST_NO']),
          });

          if (_isNg(insI222)) {
            err += 'Lỗi I222: ${_s(insI222['message'])} | ';
          }
        }
      }

      await _post('updateStockM090', {});

      if (!mounted) return;
      setState(() => _loading = false);

      if (err.isEmpty) {
        messenger.showSnackBar(const SnackBar(content: Text('Nhập kho vật liệu thành công')));
        setState(() {
          _rows = const [];
          _cols = const [];
          _plutoRows = const [];
        });
      } else {
        messenger.showSnackBar(SnackBar(content: Text('Nhập kho thất bại: $err')));
      }
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final vendorLabel = _selectedVendor == null ? 'Chọn vendor' : '${_s(_selectedVendor?['CUST_CD'])} - ${_s(_selectedVendor?['CUST_NAME_KD'])}';
    final matLabel = _selectedMaterial == null ? 'Chọn vật liệu' : '${_s(_selectedMaterial?['M_CODE'])} - ${_s(_selectedMaterial?['M_NAME'])}';

    return Padding(
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Wrap(
                    spacing: 12,
                    runSpacing: 8,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: [
                      OutlinedButton(onPressed: _loading ? null : _pickVendor, child: Text(vendorLabel)),
                      OutlinedButton(onPressed: _loading ? null : _pickMaterial, child: Text(matLabel)),
                      DropdownButton<String>(
                        value: _selectedFactory,
                        items: const [
                          DropdownMenuItem(value: 'NM1', child: Text('NM1')),
                          DropdownMenuItem(value: 'NM2', child: Text('NM2')),
                        ],
                        onChanged: _loading ? null : (v) => setState(() => _selectedFactory = v ?? 'NM1'),
                      ),
                      DropdownButton<String>(
                        value: _loaiNk,
                        items: const [
                          DropdownMenuItem(value: '01', child: Text('GC')),
                          DropdownMenuItem(value: '02', child: Text('SK')),
                          DropdownMenuItem(value: '03', child: Text('KD')),
                          DropdownMenuItem(value: '04', child: Text('VN')),
                          DropdownMenuItem(value: '05', child: Text('SAMPLE')),
                          DropdownMenuItem(value: '06', child: Text('Vai bac 4')),
                          DropdownMenuItem(value: '07', child: Text('ETC')),
                        ],
                        onChanged: _loading ? null : (v) => setState(() => _loaiNk = v ?? '03'),
                      ),
                      OutlinedButton(
                        onPressed: _loading ? null : () => _pickDate(isInDate: true),
                        child: Text('Ngày nhập: ${_ymd(_inDate)}'),
                      ),
                      OutlinedButton(
                        onPressed: _loading ? null : () => _pickDate(isInDate: false),
                        child: Text('Hạn SD: ${_ymd(_expDate)}'),
                      ),
                      SizedBox(
                        width: 220,
                        child: TextField(
                          controller: _invoiceCtrl,
                          decoration: const InputDecoration(labelText: 'Invoice No'),
                        ),
                      ),
                      FilledButton(
                        onPressed: _loading ? null : _addRow,
                        child: const Text('Add'),
                      ),
                      FilledButton.tonal(
                        onPressed: _loading ? null : _deleteSelected,
                        child: const Text('Delete selected'),
                      ),
                      FilledButton(
                        onPressed: _loading ? null : _nhapKho,
                        child: const Text('Nhập kho'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          Expanded(
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(8),
                child: _loading
                    ? const Center(child: CircularProgressIndicator())
                    : (_cols.isEmpty
                        ? const Center(child: Text('Chưa có dòng nhập liệu'))
                        : PlutoGrid(
                            columns: _cols,
                            rows: _plutoRows,
                            onLoaded: (e) {
                              _sm = e.stateManager;
                              e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                            },
                            onChanged: (e) {
                              final row = e.row.cells['__raw__']?.value;
                              if (row is! Map<String, dynamic>) return;
                              final field = e.column.field;
                              if (field == '__raw__' || field == '__check__') return;
                              row[field] = e.value;
                            },
                            configuration: const PlutoGridConfiguration(
                              columnSize: PlutoGridColumnSizeConfig(autoSizeMode: PlutoAutoSizeMode.scale),
                            ),
                          )),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _XuatLieuTab extends ConsumerStatefulWidget {
  const _XuatLieuTab();

  @override
  ConsumerState<_XuatLieuTab> createState() => _XuatLieuTabState();
}

class _XuatLieuTabState extends ConsumerState<_XuatLieuTab> {
  bool _loading = false;

  List<Map<String, dynamic>> _customerList = const [];
  Map<String, dynamic>? _selectedCustomer;

  String _selectedFactory = 'NM1';
  DateTime _outDate = DateTime.now();

  final TextEditingController _giaoEmplCtrl = TextEditingController();
  final TextEditingController _nhanEmplCtrl = TextEditingController();
  String _giaoEmplName = '';
  String _nhanEmplName = '';

  final TextEditingController _planCtrl = TextEditingController();
  String _gName = '';
  String _fscGcode = '01';
  String _fscM100 = 'N';
  int _soLanOut = 1;

  final TextEditingController _lotCtrl = TextEditingController();
  String _lotInfo = '';

  List<Map<String, dynamic>> _dkRows = const [];
  List<PlutoColumn> _dkCols = const [];
  List<PlutoRow> _dkPlutoRows = const [];

  List<Map<String, dynamic>> _outRows = const [];
  List<PlutoColumn> _outCols = const [];
  List<PlutoRow> _outPlutoRows = const [];
  PlutoGridStateManager? _outSm;

  String _s(dynamic v) => (v ?? '').toString();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadCustomerList();
    });
  }

  @override
  void dispose() {
    _giaoEmplCtrl.dispose();
    _nhanEmplCtrl.dispose();
    _planCtrl.dispose();
    _lotCtrl.dispose();
    super.dispose();
  }

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  bool _isNg(Map<String, dynamic> body) => (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  Future<Map<String, dynamic>> _post(String command, Map<String, dynamic> data) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(command, data: data);
    final body = res.data;
    if (body is Map<String, dynamic>) return body;
    return <String, dynamic>{'tk_status': 'NG', 'message': 'Bad response'};
  }

  String _ymd(DateTime dt) {
    final y = dt.year.toString().padLeft(4, '0');
    final m = dt.month.toString().padLeft(2, '0');
    final d = dt.day.toString().padLeft(2, '0');
    return '$y-$m-$d';
  }

  Future<void> _loadCustomerList() async {
    setState(() => _loading = true);
    try {
      final body = await _post('selectCustomerAndVendorList', {});
      final list = (body['data'] is List) ? (body['data'] as List) : const [];
      final rows = list.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();

      setState(() {
        _customerList = rows;
        _selectedCustomer = rows.isNotEmpty ? rows.first : null;
        _loading = false;
      });
    } catch (e) {
      setState(() => _loading = false);
      _snack('Lỗi load customer list: $e');
    }
  }

  Future<void> _pickCustomer() async {
    if (!mounted) return;

    final ctrl = TextEditingController();
    Timer? debounce;
    var view = _customerList.take(200).toList();

    Future<void> refresh(StateSetter setSheet, String q) async {
      final query = q.trim().toLowerCase();
      view = _customerList
          .where((e) {
            final cd = _s(e['CUST_CD']).toLowerCase();
            final name = _s(e['CUST_NAME_KD']).toLowerCase();
            return cd.contains(query) || name.contains(query);
          })
          .take(200)
          .toList();
      setSheet(() {});
    }

    final picked = await showModalBottomSheet<Map<String, dynamic>>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setSheet) {
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
                    controller: ctrl,
                    decoration: const InputDecoration(prefixIcon: Icon(Icons.search), labelText: 'Tìm vendor'),
                    onChanged: (v) {
                      debounce?.cancel();
                      debounce = Timer(const Duration(milliseconds: 250), () {
                        refresh(setSheet, v);
                      });
                    },
                  ),
                  const SizedBox(height: 8),
                  SizedBox(
                    height: MediaQuery.of(ctx).size.height * 0.55,
                    child: ListView.builder(
                      itemCount: view.length,
                      itemBuilder: (ctx, i) {
                        final it = view[i];
                        final cd = _s(it['CUST_CD']);
                        final name = _s(it['CUST_NAME_KD']);
                        return ListTile(
                          dense: true,
                          title: Text(name.isNotEmpty ? name : cd),
                          subtitle: Text(cd),
                          onTap: () => Navigator.of(ctx).pop(it),
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
    if (picked == null) return;
    setState(() => _selectedCustomer = picked);
  }

  Future<void> _pickOutDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _outDate,
      firstDate: DateTime(2020, 1, 1),
      lastDate: DateTime(2100, 12, 31),
    );
    if (picked == null) return;
    setState(() => _outDate = picked);
  }

  Future<void> _checkEmplName({required bool isGiao, required String emplNo}) async {
    final body = await _post('checkEMPL_NO_mobile', {'EMPL_NO': emplNo});
    if (_isNg(body)) {
      setState(() {
        if (isGiao) {
          _giaoEmplName = '';
        } else {
          _nhanEmplName = '';
        }
      });
      return;
    }

    final data = (body['data'] is List && (body['data'] as List).isNotEmpty) ? (body['data'] as List).first : null;
    if (data is! Map) return;

    final name = '${_s(data['MIDLAST_NAME'])} ${_s(data['FIRST_NAME'])}'.trim();
    setState(() {
      if (isGiao) {
        _giaoEmplName = name;
      } else {
        _nhanEmplName = name;
      }
    });
  }

  Future<void> _checkPlan(String planId) async {
    final body = await _post('checkPLAN_ID', {'PLAN_ID': planId});
    if (_isNg(body)) {
      setState(() {
        _gName = '';
        _fscGcode = '01';
        _fscM100 = 'N';
      });
      return;
    }

    final data = (body['data'] is List && (body['data'] as List).isNotEmpty) ? (body['data'] as List).first : null;
    if (data is! Map) return;

    setState(() {
      _gName = _s(data['G_NAME']);
      _fscGcode = _s(data['FSC_CODE']).isEmpty ? '01' : _s(data['FSC_CODE']);
      _fscM100 = _s(data['FSC']).isEmpty ? 'N' : _s(data['FSC']);
    });
  }

  Future<void> _loadDkXuatLieu(String planId) async {
    final body = await _post('checkPLANID_O301', {'PLAN_ID': planId});
    final rawData = body['data'];
    final data = rawData is List ? rawData : const [];
    final rows = data.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();

    final cols = _buildDkCols();
    final plutoRows = _buildPlutoRows(rows, cols);

    setState(() {
      _dkRows = rows;
      _dkCols = cols;
      _dkPlutoRows = plutoRows;
    });
  }

  Future<void> _checkSoLanOut(String planId) async {
    final body = await _post('checksolanout_O302', {'PLAN_ID': planId});
    if (_isNg(body)) {
      setState(() => _soLanOut = 1);
      return;
    }

    final data = (body['data'] is List && (body['data'] as List).isNotEmpty) ? (body['data'] as List).first : null;
    if (data is! Map) {
      setState(() => _soLanOut = 1);
      return;
    }

    final cur = int.tryParse(_s(data['SOLANOUT'])) ?? 0;
    setState(() => _soLanOut = cur + 1);
  }

  List<PlutoColumn> _buildDkCols() {
    PlutoColumn c(String f, {double w = 140}) => PlutoColumn(
          title: f,
          field: f,
          type: PlutoColumnType.text(),
          width: w,
          enableSorting: true,
        );

    return [
      PlutoColumn(title: '', field: '__raw__', type: PlutoColumnType.text(), width: 0, hide: true),
      c('M_CODE', w: 120),
      c('M_NAME', w: 160),
      c('WIDTH_CD', w: 90),
      c('OUT_PRE_QTY', w: 110),
      c('OUT_CFM_QTY', w: 110),
      c('OUT_DATE', w: 120),
      c('OUT_NO', w: 120),
      c('OUT_SEQ', w: 90),
    ];
  }

  List<PlutoColumn> _buildOutCols() {
    PlutoColumn c(String f, {double w = 140}) => PlutoColumn(
          title: f,
          field: f,
          type: PlutoColumnType.text(),
          width: w,
          enableSorting: true,
        );

    return [
      PlutoColumn(title: '', field: '__raw__', type: PlutoColumnType.text(), width: 0, hide: true),
      PlutoColumn(
        title: '✓',
        field: '__check__',
        type: PlutoColumnType.text(),
        width: 44,
        enableRowChecked: true,
        enableSorting: false,
      ),
      c('M_CODE', w: 120),
      c('M_NAME', w: 160),
      c('WIDTH_CD', w: 90),
      c('M_LOT_NO', w: 150),
      c('ROLL_QTY', w: 110),
      c('UNIT_QTY', w: 110),
      c('TOTAL_QTY', w: 120),
      c('LIEUQL_SX', w: 110),
      c('WAHS_CD', w: 90),
      c('LOC_CD', w: 100),
      c('OUT_DATE', w: 120),
      c('OUT_NO', w: 120),
      c('OUT_SEQ', w: 90),
      c('IN_DATE', w: 120),
      c('USE_YN', w: 90),
      c('FSC_O302', w: 90),
      c('FSC_MCODE', w: 110),
    ];
  }

  List<PlutoRow> _buildPlutoRows(List<Map<String, dynamic>> rows, List<PlutoColumn> cols) {
    Object? val(Map<String, dynamic> it, String f) {
      if (f == '__raw__') return it;
      if (f == '__check__') return '';
      return it[f];
    }

    return [
      for (final it in rows)
        PlutoRow(
          checked: false,
          cells: {
            for (final c in cols) c.field: PlutoCell(value: val(it, c.field)),
          },
        ),
    ];
  }

  List<Map<String, dynamic>> _selectedOutRows() {
    final sm = _outSm;
    if (sm == null) return const [];
    final checked = sm.checkedRows;
    if (checked.isEmpty) return const [];
    final out = <Map<String, dynamic>>[];
    for (final r in checked) {
      final raw = r.cells['__raw__']?.value;
      if (raw is Map<String, dynamic>) out.add(raw);
    }
    return out;
  }

  Future<void> _checkLotAndAdd(String lot, String planId) async {
    final body = await _post('checkMNAMEfromLotI222XuatKho', {
      'M_LOT_NO': lot,
      'PLAN_ID': planId,
    });

    if (_isNg(body)) {
      setState(() => _lotInfo = '');
      return;
    }

    final data = (body['data'] is List && (body['data'] as List).isNotEmpty) ? (body['data'] as List).first : null;
    if (data is! Map) return;

    final mCode = _s(data['M_CODE']);
    final mName = _s(data['M_NAME']);
    final width = data['WIDTH_CD'];
    final inDate = _s(data['IN_DATE']);
    final useYn = _s(data['USE_YN']);
    final unitQty = (useYn != 'R') ? data['IN_CFM_QTY'] : data['RETURN_QTY'];
    final rollQty = data['ROLL_QTY'];
    final lieuql = data['LIEUQL_SX'];
    final wahs = _s(data['WAHS_CD']);
    final loc = _s(data['LOC_CD']);
    final fscO302 = _s(data['FSC']).isEmpty ? 'N' : _s(data['FSC']);
    final fscMcode = _s(data['FSC_CODE']).isEmpty ? '01' : _s(data['FSC_CODE']);

    final lotInfo = _dkRows.where((e) => _s(e['M_CODE']) == mCode).toList();
    final outDate = lotInfo.isNotEmpty ? _s(lotInfo.first['OUT_DATE']) : 'NG';
    final outNo = lotInfo.isNotEmpty ? _s(lotInfo.first['OUT_NO']) : 'NG';
    final outSeq = lotInfo.isNotEmpty ? _s(lotInfo.first['OUT_SEQ']) : 'NG';

    final exists = _outRows.any((e) => _s(e['M_LOT_NO']) == lot);

    setState(() {
      _lotInfo = '$mName | $width';
    });

    if (exists) {
      _snack('Lot này bắn rồi');
      _lotCtrl.clear();
      return;
    }

    if (outDate == 'NG') {
      _snack('Lot này là Liệu chưa đăng ký xuất kho');
      _lotCtrl.clear();
      return;
    }

    if (useYn == 'X') {
      _snack('Lot này đã sử dụng rồi');
      _lotCtrl.clear();
      return;
    }

    final row = <String, dynamic>{
      'id': DateTime.now().microsecondsSinceEpoch,
      'M_CODE': mCode,
      'M_NAME': mName,
      'WIDTH_CD': width,
      'M_LOT_NO': lot,
      'ROLL_QTY': rollQty,
      'UNIT_QTY': unitQty,
      'TOTAL_QTY': (num.tryParse(_s(rollQty)) ?? 0) * (num.tryParse(_s(unitQty)) ?? 0),
      'WAHS_CD': wahs,
      'LOC_CD': loc,
      'LIEUQL_SX': lieuql,
      'OUT_DATE': outDate,
      'OUT_NO': outNo,
      'OUT_SEQ': outSeq,
      'IN_DATE': inDate,
      'USE_YN': useYn,
      'FSC_O302': fscO302,
      'FSC_MCODE': fscMcode,
      'FSC_GCODE': _fscGcode,
    };

    final rows = [..._outRows, row];
    final cols = _outCols.isEmpty ? _buildOutCols() : _outCols;
    final plutoRows = _buildPlutoRows(rows, cols);

    setState(() {
      _outRows = rows;
      _outCols = cols;
      _outPlutoRows = plutoRows;
    });

    _lotCtrl.clear();
  }

  Future<void> _deleteSelectedOut() async {
    final selected = _selectedOutRows();
    if (selected.isEmpty) {
      _snack('Chọn ít nhất 1 dòng');
      return;
    }

    final ids = selected.map((e) => _s(e['id'])).toSet();
    final rows = _outRows.where((e) => !ids.contains(_s(e['id']))).toList();
    final cols = _outCols;
    final plutoRows = _buildPlutoRows(rows, cols);

    setState(() {
      _outRows = rows;
      _outPlutoRows = plutoRows;
    });
  }

  Future<void> _xuatKho() async {
    if (_outRows.isEmpty) {
      _snack('Chưa có dòng nào');
      return;
    }

    if (_planCtrl.text.trim().length < 7) {
      _snack('Nhập PLAN_ID');
      return;
    }
    if (_giaoEmplName.isEmpty || _nhanEmplName.isEmpty) {
      _snack('Nhập đủ người giao / người nhận');
      return;
    }

    if (!mounted) return;
    final messenger = ScaffoldMessenger.of(context);

    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          title: const Text('Xuất kho vật liệu'),
          content: Text('Chắc chắn muốn xuất kho ${_outRows.length} LOT?'),
          actions: [
            TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Hủy')),
            FilledButton(onPressed: () => Navigator.of(ctx).pop(true), child: const Text('Xuất kho')),
          ],
        );
      },
    );
    if (confirm != true) return;

    if (!mounted) return;
    setState(() => _loading = true);

    try {
      var err = '';
      for (final r in _outRows) {
        final fscO302 = _s(r['FSC_O302']).toUpperCase();
        final fscM100 = _fscM100.toUpperCase();

        final okFsc = (fscO302 == 'N' && fscM100 == 'N') || (fscO302 == 'Y' && fscM100 == 'Y') || (fscO302 == 'Y' && fscM100 == 'N');
        if (!okFsc) {
          err += 'Lỗi: Code FSC thì chỉ dùng liệu FSC | ';
          continue;
        }

        final body = await _post('insert_O302', {
          'OUT_DATE': _s(r['OUT_DATE']),
          'OUT_NO': _s(r['OUT_NO']),
          'OUT_SEQ': _s(r['OUT_SEQ']),
          'M_LOT_NO': _s(r['M_LOT_NO']),
          'LOC_CD': _s(r['LOC_CD']),
          'M_CODE': _s(r['M_CODE']),
          'OUT_CFM_QTY': r['TOTAL_QTY'],
          'WAHS_CD': _s(r['WAHS_CD']),
          'REMARK': '',
          'USE_YN': 'Y',
          'INS_EMPL': _giaoEmplCtrl.text.trim(),
          'FACTORY': _selectedFactory,
          'CUST_CD': _selectedCustomer?['CUST_CD'],
          'ROLL_QTY': r['ROLL_QTY'],
          'OUT_DATE_THUCTE': _ymd(_outDate).replaceAll('-', ''),
          'IN_DATE_O302': _s(r['IN_DATE']),
          'PLAN_ID': _planCtrl.text.trim(),
          'SOLANOUT': _soLanOut,
          'LIEUQL_SX': r['LIEUQL_SX'],
          'INS_RECEPTION': _nhanEmplCtrl.text.trim(),
          'FSC_O302': fscO302,
          'FSC_GCODE': _fscGcode,
          'FSC_MCODE': _s(r['FSC_MCODE']),
        });

        if (_isNg(body)) {
          err += '${_s(body['message'])} | ';
        }
      }

      if (err.isEmpty) {
        await _post('updateO301_OUT_CFM_QTY_FROM_O302', {'PLAN_ID': _planCtrl.text.trim()});
        await _post('updateStockM090', {});
      }

      if (!mounted) return;
      setState(() => _loading = false);

      if (err.isEmpty) {
        messenger.showSnackBar(const SnackBar(content: Text('Xuất kho vật liệu thành công')));
        setState(() {
          _outRows = const [];
          _outCols = const [];
          _outPlutoRows = const [];
          _planCtrl.clear();
          _lotCtrl.clear();
          _gName = '';
          _lotInfo = '';
        });
      } else {
        messenger.showSnackBar(SnackBar(content: Text('Xuất kho thất bại: $err')));
      }
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final custLabel = _selectedCustomer == null ? 'Chọn vendor' : '${_s(_selectedCustomer?['CUST_CD'])} - ${_s(_selectedCustomer?['CUST_NAME_KD'])}';

    return Padding(
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Wrap(
                    spacing: 12,
                    runSpacing: 8,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: [
                      OutlinedButton(onPressed: _loading ? null : _pickCustomer, child: Text(custLabel)),
                      DropdownButton<String>(
                        value: _selectedFactory,
                        items: const [
                          DropdownMenuItem(value: 'NM1', child: Text('NM1')),
                          DropdownMenuItem(value: 'NM2', child: Text('NM2')),
                        ],
                        onChanged: _loading ? null : (v) => setState(() => _selectedFactory = v ?? 'NM1'),
                      ),
                      OutlinedButton(
                        onPressed: _loading ? null : _pickOutDate,
                        child: Text('Ngày xuất: ${_ymd(_outDate)}'),
                      ),
                      SizedBox(
                        width: 160,
                        child: TextField(
                          controller: _giaoEmplCtrl,
                          decoration: const InputDecoration(labelText: 'Ng.Giao'),
                          onChanged: (v) {
                            if (v.trim().length >= 7) {
                              _checkEmplName(isGiao: true, emplNo: v.trim());
                            } else {
                              setState(() => _giaoEmplName = '');
                            }
                          },
                        ),
                      ),
                      if (_giaoEmplName.isNotEmpty) Text(_giaoEmplName, style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.w700)),
                      SizedBox(
                        width: 160,
                        child: TextField(
                          controller: _nhanEmplCtrl,
                          decoration: const InputDecoration(labelText: 'Ng.Nhận'),
                          onChanged: (v) {
                            if (v.trim().length >= 7) {
                              _checkEmplName(isGiao: false, emplNo: v.trim());
                            } else {
                              setState(() => _nhanEmplName = '');
                            }
                          },
                        ),
                      ),
                      if (_nhanEmplName.isNotEmpty) Text(_nhanEmplName, style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.w700)),
                      SizedBox(
                        width: 160,
                        child: TextField(
                          controller: _planCtrl,
                          decoration: const InputDecoration(labelText: 'PLAN_ID'),
                          onChanged: (v) {
                            final planId = v.trim();
                            if (planId.length >= 7) {
                              _checkPlan(planId);
                              _checkSoLanOut(planId);
                              _loadDkXuatLieu(planId);
                            } else {
                              setState(() {
                                _gName = '';
                                _lotInfo = '';
                                _dkRows = const [];
                                _dkCols = const [];
                                _dkPlutoRows = const [];
                              });
                            }
                          },
                        ),
                      ),
                      if (_gName.isNotEmpty) Text(_gName, style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.w700)),
                      SizedBox(
                        width: 200,
                        child: TextField(
                          controller: _lotCtrl,
                          decoration: const InputDecoration(labelText: 'LOT Vật liệu'),
                          onChanged: (v) {
                            final lot = v.trim();
                            if (lot.length >= 10) {
                              final planId = _planCtrl.text.trim();
                              if (planId.length >= 7 && _gName.isNotEmpty && _giaoEmplName.isNotEmpty && _nhanEmplName.isNotEmpty) {
                                _checkLotAndAdd(lot, planId);
                              } else {
                                _lotCtrl.clear();
                                _snack('Vui lòng nhập đầy đủ thông tin');
                              }
                            }
                          },
                        ),
                      ),
                      if (_lotInfo.isNotEmpty) Text(_lotInfo, style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.w700)),
                      FilledButton.tonal(
                        onPressed: _loading ? null : _deleteSelectedOut,
                        child: const Text('Delete selected'),
                      ),
                      FilledButton(
                        onPressed: _loading ? null : _xuatKho,
                        child: const Text('Xuất kho'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          Expanded(
            child: Row(
              children: [
                Expanded(
                  flex: 4,
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(8),
                      child: _dkCols.isEmpty
                          ? const Center(child: Text('DK xuất liệu (O301)'))
                          : PlutoGrid(
                              columns: _dkCols,
                              rows: _dkPlutoRows,
                              onLoaded: (e) {
                                e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                              },
                              configuration: const PlutoGridConfiguration(
                                columnSize: PlutoGridColumnSizeConfig(autoSizeMode: PlutoAutoSizeMode.scale),
                              ),
                            ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  flex: 6,
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(8),
                      child: _loading
                          ? const Center(child: CircularProgressIndicator())
                          : (_outCols.isEmpty
                              ? const Center(child: Text('Danh sách LOT chuẩn bị xuất'))
                              : PlutoGrid(
                                  columns: _outCols,
                                  rows: _outPlutoRows,
                                  onLoaded: (e) {
                                    _outSm = e.stateManager;
                                    e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                                  },
                                  configuration: const PlutoGridConfiguration(
                                    columnSize: PlutoGridColumnSizeConfig(autoSizeMode: PlutoAutoSizeMode.scale),
                                  ),
                                )),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
