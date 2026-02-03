import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pluto_grid/pluto_grid.dart';

import '../../../../../core/providers.dart';
import '../../../../auth/application/auth_notifier.dart';
import '../../../../auth/application/auth_state.dart';

enum _BlockLoai { all, nvl, btp, sp }

class IqcBlockingTab extends ConsumerStatefulWidget {
  const IqcBlockingTab({super.key});

  @override
  ConsumerState<IqcBlockingTab> createState() => _IqcBlockingTabState();
}

class _IqcBlockingTabState extends ConsumerState<IqcBlockingTab> {
  bool _loading = false;

  _BlockLoai _loai = _BlockLoai.all;
  bool _onlyPending = true;

  final TextEditingController _vendorLotCtrl = TextEditingController();
  final TextEditingController _defectCtrl = TextEditingController();
  final TextEditingController _remarkCtrl = TextEditingController();
  final TextEditingController _ncrIdCtrl = TextEditingController(text: '0');
  final TextEditingController _mLotNoCtrl = TextEditingController();

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

  String _emplNo() {
    final a = ref.read(authNotifierProvider);
    if (a is AuthAuthenticated) return a.session.user.emplNo;
    return '';
  }

  String _subDept() {
    final a = ref.read(authNotifierProvider);
    if (a is AuthAuthenticated) return (a.session.user.subDeptName ?? '').trim();
    return '';
  }

  bool _isIqc() => _subDept().toUpperCase() == 'IQC';
  bool _canClose() {
    final sd = _subDept().toUpperCase();
    if (sd == 'MUA' || sd == 'IQC') return true;
    return _emplNo().toUpperCase() == 'NHU1903';
  }

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  int _ncrId() => int.tryParse(_ncrIdCtrl.text.trim()) ?? 0;
  String _plsp() {
    switch (_loai) {
      case _BlockLoai.nvl:
        return 'NVL';
      case _BlockLoai.btp:
        return 'BTP';
      case _BlockLoai.sp:
        return 'SP';
      case _BlockLoai.all:
        return 'ALL';
    }
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
        readOnly: true,
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

  Future<void> _loadBlocking() async {
    final messenger = ScaffoldMessenger.of(context);
    setState(() => _loading = true);

    try {
      final body = await _post('loadBlockingData', {
        'ONLY_PENDING': _onlyPending,
        'LOT_VENDOR': _vendorLotCtrl.text.trim(),
        'M_LOT_NO': _mLotNoCtrl.text.trim(),
        'DEFECT': _defectCtrl.text.trim(),
        'NCR_ID': _ncrId(),
        'PLSP': _plsp(),
      });

      if (_isNg(body)) {
        if (!mounted) return;
        setState(() {
          _loading = false;
          _rows = const [];
          _cols = const [];
          _plutoRows = const [];
        });
        messenger.showSnackBar(const SnackBar(content: Text('Không có dữ liệu')));
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
        _rows = rows;
        _cols = cols;
        _plutoRows = plutoRows;
      });

      messenger.showSnackBar(SnackBar(content: Text('Đã load: ${rows.length} dòng')));
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  Future<void> _updateStock() async {
    await _post('updateStockM090', {});
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
        final plBlock = _s(r['PL_BLOCK']).toUpperCase();
        if (plBlock == 'FAILING') {
          final body = await _post('updateQCPASS_FAILING', {
            'FAIL_ID': r['BLOCK_ID'],
            'M_LOT_NO': _s(r['M_LOT_NO']),
            'PLAN_ID_SUDUNG': r['PLAN_ID'],
            'VALUE': value,
          });
          if (_isNg(body)) failed++;
        } else if (plBlock == 'HOLDING') {
          final body = await _post('updateQCPASS_HOLDING', {
            'M_LOT_NO': _s(r['M_LOT_NO']),
            'ID': r['BLOCK_ID'],
            'USE_YN': _s(r['USE_YN']),
            'VALUE': value,
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
                'USE_YN': _s(r['USE_YN']),
                'VALUE': value,
              });
              if (_isNg(upd)) failed++;
            }
          }
        }
      }

      await _updateStock();

      if (!mounted) return;
      setState(() => _loading = false);
      if (failed == 0) {
        messenger.showSnackBar(const SnackBar(content: Text('SET thành công')));
      } else {
        messenger.showSnackBar(SnackBar(content: Text('Xong, lỗi: $failed')));
      }
      await _loadBlocking();
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  Future<void> _setClose(String value) async {
    final selected = _checkedRawRows();
    if (selected.isEmpty) {
      _snack('Chọn ít nhất 1 dòng');
      return;
    }
    if (!_canClose()) {
      _snack('Bạn không phải người bộ phận MUA/IQC');
      return;
    }

    final messenger = ScaffoldMessenger.of(context);
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('SET CLOSE STATUS'),
        content: Text('Chắc chắn SET ${value == 'C' ? 'CLOSED' : 'PENDING'} cho ${selected.length} dòng?'),
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
        final plBlock = _s(r['PL_BLOCK']).toUpperCase();
        if (plBlock == 'FAILING') {
          final body = await _post('updateCLOSE_FAILING', {
            'FAIL_ID': r['BLOCK_ID'],
            'M_LOT_NO': _s(r['M_LOT_NO']),
            'PLAN_ID_SUDUNG': r['PLAN_ID'],
            'VALUE': value,
          });
          if (_isNg(body)) failed++;
        } else if (plBlock == 'HOLDING') {
          final body = await _post('updateCLOSE_HOLDING', {
            'HOLD_ID': r['BLOCK_ID'],
            'VALUE': value,
          });
          if (_isNg(body)) failed++;
        }
      }

      if (!mounted) return;
      setState(() => _loading = false);
      if (failed == 0) {
        messenger.showSnackBar(const SnackBar(content: Text('SET thành công')));
      } else {
        messenger.showSnackBar(SnackBar(content: Text('Xong, lỗi: $failed')));
      }
      await _loadBlocking();
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
        title: const Text('UPDATE NCR_ID'),
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
        final plBlock = _s(r['PL_BLOCK']).toUpperCase();
        if (plBlock == 'FAILING') {
          final body = await _post('updateNCRIDForFailing', {
            'FAIL_ID': r['BLOCK_ID'],
            'NCR_ID': ncrId,
          });
          if (_isNg(body)) failed++;
        } else if (plBlock == 'HOLDING') {
          final body = await _post('updateNCRIDForHolding', {
            'HOLD_ID': r['BLOCK_ID'],
            'NCR_ID': ncrId,
          });
          if (_isNg(body)) failed++;
        }
      }

      if (!mounted) return;
      setState(() => _loading = false);
      if (failed == 0) {
        messenger.showSnackBar(const SnackBar(content: Text('UPDATE thành công')));
      } else {
        messenger.showSnackBar(SnackBar(content: Text('Xong, lỗi: $failed')));
      }
      await _loadBlocking();
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  @override
  void initState() {
    super.initState();
    // web calls updateReasonHoldingFromIQC1 on mount.
    Future.microtask(() => _post('updateReasonHoldingFromIQC1', {}));
    Future.microtask(_loadBlocking);
  }

  @override
  void dispose() {
    _vendorLotCtrl.dispose();
    _defectCtrl.dispose();
    _remarkCtrl.dispose();
    _ncrIdCtrl.dispose();
    _mLotNoCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final isIqc = _isIqc();
    final canClose = _canClose();

    return Padding(
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Wrap(
                spacing: 12,
                runSpacing: 8,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: [
                  DropdownButton<_BlockLoai>(
                    value: _loai,
                    items: const [
                      DropdownMenuItem(value: _BlockLoai.all, child: Text('ALL')),
                      DropdownMenuItem(value: _BlockLoai.nvl, child: Text('Vật Liệu')),
                      DropdownMenuItem(value: _BlockLoai.btp, child: Text('Bán Thành Phẩm')),
                      DropdownMenuItem(value: _BlockLoai.sp, child: Text('Sản Phẩm')),
                    ],
                    onChanged: _loading ? null : (v) => setState(() => _loai = v ?? _BlockLoai.all),
                  ),
                  SizedBox(width: 180, child: TextField(controller: _vendorLotCtrl, decoration: const InputDecoration(labelText: 'VENDOR LOT'))),
                  SizedBox(width: 200, child: TextField(controller: _defectCtrl, decoration: const InputDecoration(labelText: 'DEFECT PHENOMENON'))),
                  SizedBox(width: 160, child: TextField(controller: _mLotNoCtrl, decoration: const InputDecoration(labelText: 'M_LOT_NO'))),
                  SizedBox(width: 180, child: TextField(controller: _remarkCtrl, decoration: const InputDecoration(labelText: 'Remark'))),
                  SizedBox(
                    width: 120,
                    child: TextField(
                      controller: _ncrIdCtrl,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: 'NCR_ID'),
                    ),
                  ),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Checkbox(value: _onlyPending, onChanged: _loading ? null : (v) => setState(() => _onlyPending = v ?? true)),
                      const Text('ONLY PENDING'),
                    ],
                  ),
                  FilledButton.icon(
                    onPressed: _loading ? null : _loadBlocking,
                    icon: const Icon(Icons.search),
                    label: const Text('Tra Data'),
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
                    child: const Text('UPDATE NCR_ID'),
                  ),
                  FilledButton.tonal(
                    onPressed: (_loading || !canClose) ? null : () => _setClose('C'),
                    child: const Text('SET CLOSED'),
                  ),
                  FilledButton.tonal(
                    onPressed: (_loading || !canClose) ? null : () => _setClose('P'),
                    child: const Text('SET PENDING'),
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
