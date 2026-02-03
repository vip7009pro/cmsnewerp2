import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pluto_grid/pluto_grid.dart';

import '../../../../../core/providers.dart';
import '../../../../auth/application/auth_notifier.dart';
import '../../../../auth/application/auth_state.dart';

class IqcHoldingTab extends ConsumerStatefulWidget {
  const IqcHoldingTab({super.key});

  @override
  ConsumerState<IqcHoldingTab> createState() => _IqcHoldingTabState();
}

class _IqcHoldingTabState extends ConsumerState<IqcHoldingTab> {
  bool _loading = false;
  bool _showFilter = true;

  DateTime _fromDate = DateTime.now();
  DateTime _toDate = DateTime.now();
  bool _allTime = true;

  final TextEditingController _mNameCtrl = TextEditingController();
  final TextEditingController _mCodeCtrl = TextEditingController();
  final TextEditingController _mLotCtrl = TextEditingController();
  final TextEditingController _idCtrl = TextEditingController();
  final TextEditingController _ncrIdCtrl = TextEditingController(text: '0');
  String _mStatus = 'ALL';

  List<Map<String, dynamic>> _rows = const [];
  List<PlutoColumn> _cols = const [];
  List<PlutoRow> _plutoRows = const [];
  PlutoGridStateManager? _sm;

  String _s(dynamic v) => (v ?? '').toString();
  bool _isNg(Map<String, dynamic> body) => (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  Future<Map<String, dynamic>> _post(String command, Map<String, dynamic> data) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(command, data: data);
    final body = res.data;
    if (body is Map<String, dynamic>) return body;
    return <String, dynamic>{'tk_status': 'NG', 'message': 'Bad response'};
  }

  String _subDept() {
    final a = ref.read(authNotifierProvider);
    if (a is AuthAuthenticated) return (a.session.user.subDeptName ?? '').trim();
    return '';
  }

  bool _isIqc() => _subDept().toUpperCase() == 'IQC';

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  int _ncrId() => int.tryParse(_ncrIdCtrl.text.trim()) ?? 0;

  String _ymd(DateTime d) => '${d.year.toString().padLeft(4, '0')}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

  Future<void> _pickDate({required bool isFrom}) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: isFrom ? _fromDate : _toDate,
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

  List<Map<String, dynamic>> _checkedRawRows() {
    final checked = _sm?.checkedRows ?? const [];
    return checked
        .map((r) => (r.cells['__raw__']?.value as Map<String, dynamic>?) ?? <String, dynamic>{})
        .where((e) => e.isNotEmpty)
        .toList();
  }

  List<PlutoColumn> _buildColumns(List<Map<String, dynamic>> rows) {
    if (rows.isEmpty) return const [];
    final keys = rows.first.keys.map((e) => e.toString()).toList();

    PlutoColumn col(String f) {
      return PlutoColumn(
        title: f,
        field: f,
        type: rows.any((r) => r[f] is num) ? PlutoColumnType.number() : PlutoColumnType.text(),
        width: 140,
        enableSorting: true,
        enableFilterMenuItem: true,
        readOnly: f != 'REASON',
      );
    }

    return [
      PlutoColumn(title: '', field: '__raw__', type: PlutoColumnType.text(), width: 0, hide: true),
      PlutoColumn(
        title: '',
        field: '__check__',
        type: PlutoColumnType.text(),
        width: 44,
        enableRowChecked: true,
        enableSorting: false,
        enableFilterMenuItem: false,
      ),
      for (final f in keys) col(f),
    ];
  }

  List<PlutoRow> _buildRows(List<Map<String, dynamic>> rows, List<PlutoColumn> cols) {
    return rows
        .map(
          (r) => PlutoRow(
            cells: {
              for (final c in cols)
                c.field: PlutoCell(
                  value: c.field == '__raw__'
                      ? r
                      : (c.field == '__check__' ? '' : r[c.field]),
                ),
            },
          ),
        )
        .toList();
  }

  Future<void> _loadHolding() async {
    final messenger = ScaffoldMessenger.of(context);
    setState(() => _loading = true);

    try {
      final body = await _post('traholdingmaterial', {
        'ALLTIME': _allTime,
        'FROM_DATE': _ymd(_fromDate),
        'TO_DATE': _ymd(_toDate),
        'M_NAME': _mNameCtrl.text.trim(),
        'M_CODE': _mCodeCtrl.text.trim(),
        'M_LOT_NO': _mLotCtrl.text.trim(),
        'M_STATUS': _mStatus,
        'ID': _idCtrl.text.trim(),
      });

      if (_isNg(body)) {
        if (!mounted) return;
        setState(() {
          _loading = false;
          _rows = const [];
          _cols = const [];
          _plutoRows = const [];
        });
        messenger.showSnackBar(SnackBar(content: Text('Lỗi: ${_s(body['message'])}')));
        return;
      }

      final raw = body['data'];
      final arr = raw is List ? raw : const [];
      final rows = arr.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();
      final cols = _buildColumns(rows);
      final plutoRows = _buildRows(rows, cols);

      if (!mounted) return;
      setState(() {
        _loading = false;
        _showFilter = false;
        _rows = rows;
        _cols = cols;
        _plutoRows = plutoRows;
      });

      messenger.showSnackBar(SnackBar(content: Text('Đã load ${rows.length} dòng')));
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  Future<void> _setQCPass(String value) async {
    final selected = _checkedRawRows();
    if (selected.isEmpty) {
      _snack('Chọn ít nhất 1 dòng');
      return;
    }
    if (!_isIqc()) {
      _snack('Bạn không phải người bộ phận IQC');
      return;
    }

    final messenger = ScaffoldMessenger.of(context);
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('SET QC PASS'),
        content: Text('Chắc chắn SET ${value == 'Y' ? 'PASS' : 'FAIL'} cho ${selected.length} dòng?'),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Hủy')),
          FilledButton(onPressed: () => Navigator.of(ctx).pop(true), child: const Text('OK')),
        ],
      ),
    );
    if (ok != true) return;

    setState(() => _loading = true);
    try {
      var failed = 0;
      for (final r in selected) {
        final body = await _post('updateQCPASS_HOLDING', {
          'M_LOT_NO': _s(r['M_LOT_NO']),
          'ID': r['HOLD_ID'],
          'VALUE': value,
          'USE_YN': _s(r['USE_YN']),
        });
        if (_isNg(body)) {
          failed++;
          continue;
        }

        final chk = await _post('checkM_LOT_NO', {'M_LOT_NO': _s(r['M_LOT_NO'])});
        if (!_isNg(chk)) {
          final raw = chk['data'];
          final arr = raw is List ? raw : const [];
          final useYnI222 = (arr.isNotEmpty && arr.first is Map) ? _s((arr.first as Map)['USE_YN']) : 'X';
          if (useYnI222 != 'X') {
            final upd = await _post('updateQCPASSI222_M_LOT_NO', {
              'M_LOT_NO': _s(r['M_LOT_NO']),
              'VALUE': value,
              'USE_YN': _s(r['USE_YN']),
            });
            if (_isNg(upd)) failed++;
          }
        }
      }

      if (!mounted) return;
      setState(() => _loading = false);
      if (failed == 0) {
        messenger.showSnackBar(const SnackBar(content: Text('SET thành công')));
      } else {
        messenger.showSnackBar(SnackBar(content: Text('Xong, lỗi: $failed')));
      }
      await _loadHolding();
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  Future<void> _updateReason() async {
    final selected = _checkedRawRows();
    if (selected.isEmpty) {
      _snack('Chọn ít nhất 1 dòng');
      return;
    }

    final reason = _s(selected.first['REASON']).trim();
    if (reason.isEmpty) {
      _snack('Nhập REASON (sửa ở cột REASON trước)');
      return;
    }

    final messenger = ScaffoldMessenger.of(context);
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Update Reason'),
        content: Text('Update REASON cho ${selected.length} dòng?'),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Hủy')),
          FilledButton(onPressed: () => Navigator.of(ctx).pop(true), child: const Text('OK')),
        ],
      ),
    );
    if (ok != true) return;

    setState(() => _loading = true);
    try {
      var failed = 0;
      for (final r in selected) {
        final body = await _post('updateMaterialHoldingReason', {
          'HOLD_ID': r['HOLD_ID'],
          'REASON': reason,
        });
        if (_isNg(body)) failed++;
      }

      if (!mounted) return;
      setState(() => _loading = false);
      if (failed == 0) {
        messenger.showSnackBar(const SnackBar(content: Text('Update thành công')));
      } else {
        messenger.showSnackBar(SnackBar(content: Text('Xong, lỗi: $failed')));
      }
      await _loadHolding();
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  Future<void> _updateNcrId() async {
    final selected = _checkedRawRows();
    if (selected.isEmpty) {
      _snack('Chọn ít nhất 1 dòng');
      return;
    }
    if (!_isIqc()) {
      _snack('Bạn không phải người bộ phận IQC');
      return;
    }
    final ncrId = _ncrId();
    if (ncrId == 0) {
      _snack('NCR ID phải khác 0');
      return;
    }

    final messenger = ScaffoldMessenger.of(context);
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('UPDATE NCR ID'),
        content: Text('Chắc chắn UPDATE NCR_ID=$ncrId cho ${selected.length} dòng?'),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Hủy')),
          FilledButton(onPressed: () => Navigator.of(ctx).pop(true), child: const Text('OK')),
        ],
      ),
    );
    if (ok != true) return;

    setState(() => _loading = true);
    try {
      var failed = 0;
      for (final r in selected) {
        final body = await _post('updateNCRIDForHolding', {
          'HOLD_ID': r['HOLD_ID'],
          'NCR_ID': ncrId,
        });
        if (_isNg(body)) failed++;
      }

      if (!mounted) return;
      setState(() => _loading = false);
      if (failed == 0) {
        messenger.showSnackBar(const SnackBar(content: Text('UPDATE thành công')));
      } else {
        messenger.showSnackBar(SnackBar(content: Text('Xong, lỗi: $failed')));
      }
      await _loadHolding();
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  @override
  void initState() {
    super.initState();
    Future.microtask(() => _post('updateReasonHoldingFromIQC1', {}));
    Future.microtask(_loadHolding);
  }

  @override
  void dispose() {
    _mNameCtrl.dispose();
    _mCodeCtrl.dispose();
    _mLotCtrl.dispose();
    _idCtrl.dispose();
    _ncrIdCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final isIqc = _isIqc();

    Widget filterHeader = Card(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        child: Row(
          children: [
            IconButton(
              tooltip: _showFilter ? 'Ẩn filter' : 'Hiện filter',
              onPressed: _loading ? null : () => setState(() => _showFilter = !_showFilter),
              icon: Icon(_showFilter ? Icons.filter_alt_off : Icons.filter_alt),
            ),
            const Expanded(child: Text('HOLDING', style: TextStyle(fontWeight: FontWeight.w900))),
          ],
        ),
      ),
    );

    return Padding(
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          filterHeader,
          if (_showFilter)
            Card(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Wrap(
                  spacing: 12,
                  runSpacing: 8,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                  OutlinedButton(onPressed: _loading ? null : () => _pickDate(isFrom: true), child: Text('Từ: ${_ymd(_fromDate)}')),
                  OutlinedButton(onPressed: _loading ? null : () => _pickDate(isFrom: false), child: Text('Đến: ${_ymd(_toDate)}')),
                  SizedBox(width: 180, child: TextField(controller: _mNameCtrl, decoration: const InputDecoration(labelText: 'Tên liệu (M_NAME)'))),
                  SizedBox(width: 160, child: TextField(controller: _mCodeCtrl, decoration: const InputDecoration(labelText: 'Mã liệu (M_CODE)'))),
                  SizedBox(width: 160, child: TextField(controller: _mLotCtrl, decoration: const InputDecoration(labelText: 'LOT CMS (M_LOT_NO)'))),
                  DropdownButton<String>(
                    value: _mStatus,
                    items: const [
                      DropdownMenuItem(value: 'ALL', child: Text('ALL')),
                      DropdownMenuItem(value: 'Y', child: Text('ĐÃ PASS')),
                      DropdownMenuItem(value: 'N', child: Text('CHƯA PASS')),
                    ],
                    onChanged: _loading ? null : (v) => setState(() => _mStatus = v ?? 'ALL'),
                  ),
                  SizedBox(
                    width: 120,
                    child: TextField(
                      controller: _ncrIdCtrl,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: 'NCR ID'),
                    ),
                  ),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Checkbox(value: _allTime, onChanged: _loading ? null : (v) => setState(() => _allTime = v ?? true)),
                      const Text('All Time'),
                    ],
                  ),
                  FilledButton.icon(
                    onPressed: _loading ? null : _loadHolding,
                    icon: const Icon(Icons.search),
                    label: const Text('Tra Holding'),
                  ),
                  FilledButton.tonal(
                    onPressed: _loading ? null : _updateReason,
                    child: const Text('Update Reason'),
                  ),
                  FilledButton.tonal(
                    onPressed: (_loading || !isIqc) ? null : () => _setQCPass('Y'),
                    child: const Text('SET PASS'),
                  ),
                  FilledButton.tonal(
                    onPressed: (_loading || !isIqc) ? null : () => _setQCPass('N'),
                    child: const Text('SET FAIL'),
                  ),
                  FilledButton.tonal(
                    onPressed: (_loading || !isIqc) ? null : _updateNcrId,
                    child: const Text('UPDATE NCR ID'),
                  ),
                  Text('Rows: ${_rows.length}', style: TextStyle(color: scheme.onSurfaceVariant)),
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
                        ? const Center(child: Text('Chưa có dữ liệu'))
                        : PlutoGrid(
                            columns: _cols,
                            rows: _plutoRows,
                            onLoaded: (e) {
                              _sm = e.stateManager;
                              e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                              e.stateManager.setShowColumnFilter(true);
                            },
                            onChanged: (e) {
                              // keep local raw data in sync for editable fields.
                              if (e.row.cells['__raw__']?.value is Map<String, dynamic>) {
                                final raw = e.row.cells['__raw__']!.value as Map<String, dynamic>;
                                raw[e.column.field] = e.value;
                              }
                            },
                            configuration: const PlutoGridConfiguration(
                              columnSize: PlutoGridColumnSizeConfig(autoSizeMode: PlutoAutoSizeMode.scale),
                            ),
                            createFooter: (sm) => PlutoPagination(sm),
                          )),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
