import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pluto_grid/pluto_grid.dart';

import '../../../app/app_drawer.dart';
import '../../../core/providers.dart';
import '../../auth/application/auth_notifier.dart';
import '../../auth/application/auth_state.dart';

class OverMonitorPage extends ConsumerStatefulWidget {
  const OverMonitorPage({super.key});

  @override
  ConsumerState<OverMonitorPage> createState() => _OverMonitorPageState();
}

class _OverMonitorPageState extends ConsumerState<OverMonitorPage> {
  bool _loading = false;
  bool _onlyPending = true;
  bool _showFilters = true;

  _ViewMode _viewMode = _ViewMode.table;

  List<Map<String, dynamic>> _rows = [];

  List<PlutoColumn> _cols = [];
  List<PlutoRow> _gridRows = [];
  PlutoGridStateManager? _sm;

  String _s(dynamic v) => (v ?? '').toString();
  int _toInt(dynamic v) => int.tryParse((v ?? '').toString()) ?? 0;

  String _mainDept() {
    final s = ref.read(authNotifierProvider);
    if (s is AuthAuthenticated) return (s.session.user.mainDeptName ?? '').toString();
    return '';
  }

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

  bool _isNg(Map<String, dynamic> body) => (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _initGrid();
      _load();
    });
  }

  void _initGrid() {
    _cols = _buildColumns();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final body = await _post('loadProdOverData', {'ONLY_PENDING': _onlyPending});
      if (!mounted) return;
      if (_isNg(body)) {
        setState(() {
          _loading = false;
          _rows = [];
          _gridRows = [];
        });
        _snack('Lỗi: ${(body['message'] ?? 'NG').toString()}');
        return;
      }

      final data = body['data'];
      final list = (data is List ? data : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList();

      setState(() {
        _rows = list;
        _gridRows = _buildRows(_rows, _cols);
        _loading = false;
      });

      final sm = _sm;
      if (sm != null) {
        sm.removeAllRows();
        sm.appendRows(List<PlutoRow>.from(_gridRows));
      }
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Widget _dataCell(String label, String value, {Color? color, bool mono = false}) {
    final scheme = Theme.of(context).colorScheme;
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 110,
          child: Text(
            label,
            style: TextStyle(color: scheme.onSurfaceVariant, fontSize: 11, fontWeight: FontWeight.w700),
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: TextStyle(
              color: color,
              fontSize: 12,
              fontWeight: FontWeight.w800,
              fontFamily: mono ? 'monospace' : null,
            ),
          ),
        ),
      ],
    );
  }

  Widget _statusChip(String label, {required Color color}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(label, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 11)),
    );
  }

  Widget _rowCard(Map<String, dynamic> it) {
    final scheme = Theme.of(context).colorScheme;
    final handle = _s(it['HANDLE_STATUS']).trim().toUpperCase();
    final cfm = _s(it['KD_CFM']).trim().toUpperCase();

    final handleColor = handle == 'C' ? const Color(0xFF77DA41) : const Color(0xFFE7A44B);
    final cfmColor = cfm == 'Y'
        ? const Color(0xFF77DA41)
        : cfm == 'N'
            ? const Color(0xFFFF0000)
            : const Color(0xFFE7A44B);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    '${_s(it['G_CODE'])} - ${_s(it['G_NAME_KD']).isEmpty ? _s(it['G_NAME']) : _s(it['G_NAME_KD'])}',
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontWeight: FontWeight.w900),
                  ),
                ),
                const SizedBox(width: 8),
                _statusChip(handle == 'C' ? 'CLOSED' : 'PENDING', color: handleColor),
                const SizedBox(width: 6),
                _statusChip(cfm.isEmpty ? '-' : cfm, color: cfmColor),
              ],
            ),
            const SizedBox(height: 8),
            _dataCell('Customer', _s(it['CUST_NAME_KD'])),
            _dataCell('YCSX', _s(it['PROD_REQUEST_NO']), mono: true),
            _dataCell('PLAN', _s(it['PLAN_ID']), mono: true),
            _dataCell('REQ_QTY', _s(it['PROD_REQUEST_QTY']), color: Colors.blue),
            _dataCell('OVER_QTY', _s(it['OVER_QTY']), color: Colors.red),
            const SizedBox(height: 8),
            Text('Remark', style: TextStyle(color: scheme.onSurfaceVariant, fontSize: 11, fontWeight: FontWeight.w700)),
            const SizedBox(height: 4),
            TextField(
              controller: TextEditingController(text: _s(it['KD_REMARK'])),
              onChanged: (v) => it['KD_REMARK'] = v,
              decoration: const InputDecoration(
                isDense: true,
                border: OutlineInputBorder(),
                contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 10),
              ),
              maxLines: 2,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildListView() {
    if (_rows.isEmpty) {
      return const Center(child: Text('No data'));
    }
    return ListView.builder(
      itemCount: _rows.length,
      itemBuilder: (ctx, i) => _rowCard(_rows[i]),
    );
  }

  Widget _buildGridView() {
    if (_rows.isEmpty) {
      return const Center(child: Text('No data'));
    }
    return LayoutBuilder(
      builder: (ctx, c) {
        final w = c.maxWidth;
        final cross = w >= 1200
            ? 3
            : w >= 850
                ? 2
                : 1;
        return GridView.builder(
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: cross,
            crossAxisSpacing: 10,
            mainAxisSpacing: 10,
            childAspectRatio: cross == 1 ? 1.9 : 1.55,
          ),
          itemCount: _rows.length,
          itemBuilder: (ctx, i) => _rowCard(_rows[i]),
        );
      },
    );
  }

  List<PlutoColumn> _buildColumns() {
    PlutoColumn col(String field, {double width = 120, bool editable = false}) {
      return PlutoColumn(
        title: field,
        field: field,
        type: PlutoColumnType.text(),
        width: width,
        minWidth: 80,
        enableContextMenu: false,
        enableFilterMenuItem: true,
        enableSorting: true,
        enableEditingMode: editable,
        renderer: (ctx) {
          if (field == 'KD_CFM') {
            final v = (ctx.cell.value ?? '').toString().trim().toUpperCase();
            final bg = v == 'Y'
                ? const Color(0xFF77DA41)
                : v == 'N'
                    ? const Color(0xFFFF0000)
                    : const Color(0xFFE7A44B);
            return Container(
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: bg,
                borderRadius: BorderRadius.circular(4),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              child: Text(
                v.isEmpty ? '-' : v,
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 11),
              ),
            );
          }

          if (field == 'HANDLE_STATUS') {
            final v = (ctx.cell.value ?? '').toString().trim().toUpperCase();
            final bg = v == 'C' ? const Color(0xFF77DA41) : const Color(0xFFE7A44B);
            return Container(
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: bg,
                borderRadius: BorderRadius.circular(4),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              child: Text(
                v == 'C' ? 'CLOSED' : 'PENDING',
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 11),
              ),
            );
          }

          final v = (ctx.cell.value ?? '').toString();
          final st = TextStyle(
            fontSize: 11,
            fontWeight: (field == 'OVER_QTY' || field == 'PROD_REQUEST_QTY') ? FontWeight.w900 : FontWeight.normal,
            color: field == 'OVER_QTY'
                ? Colors.red
                : field == 'PROD_REQUEST_QTY'
                    ? Colors.blue
                    : field == 'AMOUNT'
                        ? const Color(0xFF7516C2)
                        : null,
          );
          return Text(v, maxLines: 1, overflow: TextOverflow.ellipsis, style: st);
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
        minWidth: 44,
        enableContextMenu: false,
        enableSorting: false,
        enableFilterMenuItem: false,
        enableRowChecked: true,
      ),
      col('AUTO_ID', width: 80),
      col('EMPL_NO', width: 90),
      col('CUST_NAME_KD', width: 120),
      col('G_CODE', width: 90),
      col('G_NAME', width: 160),
      col('G_NAME_KD', width: 160),
      col('PROD_REQUEST_NO', width: 120),
      col('PLAN_ID', width: 120),
      col('PROD_REQUEST_QTY', width: 110),
      col('OVER_QTY', width: 90),
      col('KD_CFM', width: 90),
      col('KD_EMPL_NO', width: 110),
      col('KD_CF_DATETIME', width: 140),
      col('KD_REMARK', width: 160, editable: true),
      col('HANDLE_STATUS', width: 120),
      col('INS_DATE', width: 140),
      col('INS_EMPL', width: 100),
      col('UPD_DATE', width: 140),
      col('UPD_EMPL', width: 100),
    ];
  }

  List<PlutoRow> _buildRows(List<Map<String, dynamic>> rows, List<PlutoColumn> columns) {
    Object? val(Map<String, dynamic> it, String field) {
      if (field == '__raw__') return it;
      if (field == '__check__') return '';
      return it[field];
    }

    return [
      for (final it in rows)
        PlutoRow(
          checked: false,
          cells: {
            for (final c in columns) c.field: PlutoCell(value: val(it, c.field)),
          },
        ),
    ];
  }

  List<Map<String, dynamic>> _selectedRawRows() {
    final sm = _sm;
    if (sm == null) return const [];
    final checked = sm.checkedRows;
    if (checked.isEmpty) return const [];
    return checked
        .map((r) => r.cells['__raw__']?.value)
        .whereType<Map<String, dynamic>>()
        .toList();
  }

  Future<void> _updateSelected(String value) async {
    final selected = _selectedRawRows();
    if (selected.isEmpty) {
      _snack('Chưa chọn dòng');
      return;
    }

    final dept = _mainDept().trim().toUpperCase();
    if (dept != 'KD') {
      _snack('Bạn không thuộc bộ phận kinh doanh');
      return;
    }

    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          title: const Text('Xác nhận'),
          content: Text('Update ${selected.length} dòng sang KD_CFM=$value ?'),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Hủy')),
            FilledButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Update')),
          ],
        );
      },
    );

    if (ok != true) return;

    setState(() => _loading = true);
    try {
      for (final raw in selected) {
        final handleStatus = _s(raw['HANDLE_STATUS']).trim().toUpperCase();
        if (handleStatus == 'C') continue;

        final autoId = _toInt(raw['AUTO_ID']);
        if (autoId <= 0) continue;

        final remark = _s(raw['KD_REMARK']);
        final body = await _post('updateProdOverData', {
          'AUTO_ID': autoId,
          'KD_CFM': value,
          'KD_REMARK': remark,
        });
        if (_isNg(body)) {
          _snack('Update fail ID=$autoId: ${(body['message'] ?? 'NG').toString()}');
        }
      }
    } catch (e) {
      _snack('Lỗi: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }

    await _load();
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Production Over Monitor'),
        actions: [
          IconButton(
            onPressed: () {
              setState(() {
                _viewMode = switch (_viewMode) {
                  _ViewMode.table => _ViewMode.list,
                  _ViewMode.list => _ViewMode.grid,
                  _ViewMode.grid => _ViewMode.table,
                };
              });
            },
            icon: Icon(
              switch (_viewMode) {
                _ViewMode.table => Icons.table_chart,
                _ViewMode.list => Icons.view_list,
                _ViewMode.grid => Icons.grid_view,
              },
            ),
            tooltip: 'Toggle view',
          ),
          IconButton(
            onPressed: () => setState(() => _showFilters = !_showFilters),
            icon: Icon(_showFilters ? Icons.filter_alt_off : Icons.filter_alt),
            tooltip: _showFilters ? 'Hide filter' : 'Show filter',
          ),
          IconButton(
            onPressed: _loading ? null : _load,
            icon: const Icon(Icons.refresh),
            tooltip: 'Reload',
          ),
        ],
      ),
      drawer: const AppDrawer(title: 'ERP'),
      body: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            if (_showFilters)
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    children: [
                      Expanded(
                        child: CheckboxListTile(
                          value: _onlyPending,
                          dense: true,
                          contentPadding: EdgeInsets.zero,
                          title: const Text('Pending'),
                          controlAffinity: ListTileControlAffinity.leading,
                          onChanged: (v) {
                            setState(() => _onlyPending = v ?? true);
                          },
                        ),
                      ),
                      const SizedBox(width: 8),
                      FilledButton.icon(
                        onPressed: _loading ? null : () => _updateSelected('Y'),
                        icon: const Icon(Icons.input),
                        label: const Text('Nhập'),
                      ),
                      const SizedBox(width: 8),
                      FilledButton.tonalIcon(
                        onPressed: _loading ? null : () => _updateSelected('N'),
                        icon: const Icon(Icons.cancel_outlined),
                        label: const Text('Hủy'),
                      ),
                    ],
                  ),
                ),
              ),
            if (_showFilters) const SizedBox(height: 12),
            Expanded(
              child: Card(
                child: Stack(
                  children: [
                    switch (_viewMode) {
                      _ViewMode.table => PlutoGrid(
                          columns: _cols,
                          rows: List<PlutoRow>.from(_gridRows),
                          onLoaded: (e) {
                            _sm = e.stateManager;
                            e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                            e.stateManager.setShowColumnFilter(true);
                          },
                          onRowChecked: (_) {},
                          onChanged: (e) {
                            final raw = e.row.cells['__raw__']?.value;
                            if (raw is Map<String, dynamic>) {
                              raw[e.column.field] = e.value;
                            }
                          },
                        ),
                      _ViewMode.list => _buildListView(),
                      _ViewMode.grid => _buildGridView(),
                    },
                    if (_loading)
                      Positioned.fill(
                        child: Container(
                          color: scheme.surface.withValues(alpha: 0.55),
                          child: const Center(child: CircularProgressIndicator()),
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

enum _ViewMode {
  table,
  list,
  grid,
}
