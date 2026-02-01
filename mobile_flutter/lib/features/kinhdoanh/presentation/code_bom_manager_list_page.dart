import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pluto_grid/pluto_grid.dart';

import '../../../app/app_drawer.dart';
import '../../../core/providers.dart';
import 'code_bom_manager_page.dart';

class CodeBomManagerListPage extends ConsumerStatefulWidget {
  const CodeBomManagerListPage({super.key});

  @override
  ConsumerState<CodeBomManagerListPage> createState() => _CodeBomManagerListPageState();
}

class _CodeBomManagerListPageState extends ConsumerState<CodeBomManagerListPage> {
  final _codeCtrl = TextEditingController();
  final _offlineFilterCtrl = TextEditingController();

  bool _loading = false;
  bool _showFilter = true;
  bool _activeOnly = true;
  bool _cndb = false;

  bool _gridView = true;

  List<Map<String, dynamic>> _rows = const [];
  List<Map<String, dynamic>> _filteredRows = const [];

  List<PlutoColumn> _gridColumns = const [];
  List<PlutoRow> _gridRows = const [];

  @override
  void dispose() {
    _codeCtrl.dispose();
    _offlineFilterCtrl.dispose();
    super.dispose();
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

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  List<String> _prioritizedFields(List<Map<String, dynamic>> rows) {
    final keys = <String>{};
    for (final r in rows) {
      keys.addAll(r.keys);
    }

    final preferred = <String>[
      'G_CODE',
      'G_NAME',
      'G_NAME_KD',
      'CUST_NAME_KD',
      'CUST_NAME',
      'CUST_CD',
      'CODE_12',
      'PROD_TYPE',
      'PROD_PROJECT',
      'PROD_MODEL',
      'PROD_MAIN_MATERIAL',
      'G_WIDTH',
      'G_LENGTH',
      'PD',
      'G_C',
      'CAVITY',
      'USE_YN',
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
      final isRaw = field == '__raw__';
      return PlutoColumn(
        title: field,
        field: field,
        type: PlutoColumnType.text(),
        width: isRaw ? 0 : 120,
        hide: isRaw,
        enableContextMenu: false,
        enableDropToResize: true,
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

  void _applyOfflineFilter() {
    final q = _offlineFilterCtrl.text.trim().toLowerCase();
    if (q.isEmpty) {
      setState(() => _filteredRows = _rows);
      return;
    }

    bool match(Map<String, dynamic> r) {
      final gCode = (r['G_CODE'] ?? '').toString().toLowerCase();
      final gName = (r['G_NAME'] ?? '').toString().toLowerCase();
      final gNameKd = (r['G_NAME_KD'] ?? '').toString().toLowerCase();
      final model = (r['PROD_MODEL'] ?? '').toString().toLowerCase();
      return gCode.contains(q) || gName.contains(q) || gNameKd.contains(q) || model.contains(q);
    }

    setState(() => _filteredRows = _rows.where(match).toList());
  }

  Future<void> _search() async {
    if (!mounted) return;
    setState(() {
      _loading = true;
      _showFilter = false;
    });

    try {
      final body = await _post('codeinforRnD', {
        'G_NAME': _codeCtrl.text.trim(),
        'CNDB': _cndb,
        'ACTIVE_ONLY': _activeOnly,
      });

      if (_isNg(body)) {
        setState(() => _loading = false);
        _snack('Lỗi: ${(body['message'] ?? 'NG').toString()}');
        return;
      }

      final data = body['data'];
      final list = (data is List ? data : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList();

      final cols = _buildPlutoColumns(list);
      final rws = _buildPlutoRows(list, cols);

      if (!mounted) return;
      setState(() {
        _rows = list;
        _filteredRows = list;
        _gridColumns = cols;
        _gridRows = rws;
        _loading = false;
      });

      _snack('Đã load ${list.length} dòng');
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Future<void> _openDetail({String? gCode}) async {
    await Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => CodeBomManagerPage(initialGCode: gCode),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    final list = _filteredRows;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Quản lý Code BOM'),
        actions: [
          IconButton(
            onPressed: () => setState(() => _showFilter = !_showFilter),
            icon: Icon(_showFilter ? Icons.filter_alt_off : Icons.filter_alt),
            tooltip: _showFilter ? 'Ẩn bộ lọc' : 'Hiện bộ lọc',
          ),
          IconButton(
            onPressed: () => setState(() => _gridView = !_gridView),
            icon: Icon(_gridView ? Icons.view_agenda : Icons.grid_on),
            tooltip: _gridView ? 'List view' : 'Grid view',
          ),
          IconButton(
            onPressed: () => _openDetail(gCode: null),
            icon: const Icon(Icons.add),
            tooltip: 'Tạo mới code',
          ),
        ],
      ),
      drawer: const AppDrawer(title: 'ERP'),
      body: RefreshIndicator(
        onRefresh: _search,
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
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
                                  _codeCtrl.clear();
                                  _offlineFilterCtrl.clear();
                                  _applyOfflineFilter();
                                });
                              },
                              child: const Text('Clear'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        TextField(
                          controller: _codeCtrl,
                          decoration: const InputDecoration(labelText: 'Tra cứu online (G_NAME)'),
                          textInputAction: TextInputAction.search,
                          onSubmitted: (_) => _search(),
                        ),
                        const SizedBox(height: 8),
                        SwitchListTile(
                          contentPadding: EdgeInsets.zero,
                          title: const Text('ACTIVE_ONLY'),
                          value: _activeOnly,
                          onChanged: (v) => setState(() => _activeOnly = v),
                        ),
                        SwitchListTile(
                          contentPadding: EdgeInsets.zero,
                          title: const Text('CNDB'),
                          value: _cndb,
                          onChanged: (v) => setState(() => _cndb = v),
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
                        const Divider(height: 24),
                        TextField(
                          controller: _offlineFilterCtrl,
                          decoration: const InputDecoration(labelText: 'Lọc offline trong list', prefixIcon: Icon(Icons.filter_list)),
                          onChanged: (_) => _applyOfflineFilter(),
                        ),
                      ],
                    ),
                  ),
                ),
              const SizedBox(height: 12),
              Expanded(
                child: _loading
                    ? const Center(child: CircularProgressIndicator())
                    : _rows.isEmpty
                        ? Center(
                            child: Text(
                              'Chưa có dữ liệu',
                              style: TextStyle(color: scheme.onSurfaceVariant),
                            ),
                          )
                        : (_gridView
                            ? PlutoGrid(
                                columns: _gridColumns,
                                rows: _gridRows,
                                onLoaded: (e) {
                                  e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                                  e.stateManager.setShowColumnFilter(true);
                                },
                                onRowDoubleTap: (e) {
                                  final raw = e.row.cells['__raw__']?.value;
                                  if (raw is Map<String, dynamic>) {
                                    _openDetail(gCode: (raw['G_CODE'] ?? '').toString());
                                  }
                                },
                                onSelected: (e) {
                                  final row = e.row;
                                  if (row == null) return;
                                  final raw = row.cells['__raw__']?.value;
                                  if (raw is Map<String, dynamic>) {
                                    _openDetail(gCode: (raw['G_CODE'] ?? '').toString());
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
                              )
                            : ListView.builder(
                                itemCount: list.length,
                                itemBuilder: (ctx, i) {
                                  final r = list[i];
                                  return Card(
                                    child: ListTile(
                                      title: Text(
                                        (r['G_CODE'] ?? '').toString(),
                                        style: const TextStyle(fontWeight: FontWeight.w800),
                                      ),
                                      subtitle: Text((r['G_NAME_KD'] ?? r['G_NAME'] ?? '').toString()),
                                      onTap: () => _openDetail(gCode: (r['G_CODE'] ?? '').toString()),
                                    ),
                                  );
                                },
                              )),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
