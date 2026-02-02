import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pluto_grid/pluto_grid.dart';

import '../../../../core/config/app_config.dart';
import '../../../../core/providers.dart';

class TestTableDtcTab extends ConsumerStatefulWidget {
  const TestTableDtcTab({super.key});

  @override
  ConsumerState<TestTableDtcTab> createState() => _TestTableDtcTabState();
}

class _AddTestItemDialog extends StatefulWidget {
  const _AddTestItemDialog();

  @override
  State<_AddTestItemDialog> createState() => _AddTestItemDialogState();
}

class _AddTestItemDialogState extends State<_AddTestItemDialog> {
  final TextEditingController _testNameCtrl = TextEditingController();
  final TextEditingController _testCodeCtrl = TextEditingController();

  @override
  void dispose() {
    _testNameCtrl.dispose();
    _testCodeCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Add Test Item'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          TextField(
            controller: _testCodeCtrl,
            decoration: const InputDecoration(labelText: 'TEST_CODE'),
            keyboardType: TextInputType.number,
          ),
          TextField(
            controller: _testNameCtrl,
            decoration: const InputDecoration(labelText: 'TEST_NAME'),
          ),
        ],
      ),
      actions: [
        TextButton(onPressed: () => Navigator.of(context).pop(), child: const Text('Cancel')),
        FilledButton(
          onPressed: () {
            Navigator.of(context).pop({
              'TEST_CODE': _testCodeCtrl.text.trim(),
              'TEST_NAME': _testNameCtrl.text.trim(),
            });
          },
          child: const Text('Add'),
        ),
      ],
    );
  }
}

class _AddTestPointDialog extends StatefulWidget {
  const _AddTestPointDialog({required this.testCode, required this.testName});

  final int testCode;
  final String testName;

  @override
  State<_AddTestPointDialog> createState() => _AddTestPointDialogState();
}

class _AddTestPointDialogState extends State<_AddTestPointDialog> {
  final TextEditingController _pointCodeCtrl = TextEditingController();
  final TextEditingController _pointNameCtrl = TextEditingController();

  @override
  void dispose() {
    _pointCodeCtrl.dispose();
    _pointNameCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Add Test Point'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text('TEST: ${widget.testName} (${widget.testCode})'),
          const SizedBox(height: 8),
          TextField(
            controller: _pointCodeCtrl,
            decoration: const InputDecoration(labelText: 'POINT_CODE'),
            keyboardType: TextInputType.number,
          ),
          TextField(
            controller: _pointNameCtrl,
            decoration: const InputDecoration(labelText: 'POINT_NAME'),
          ),
        ],
      ),
      actions: [
        TextButton(onPressed: () => Navigator.of(context).pop(), child: const Text('Cancel')),
        FilledButton(
          onPressed: () {
            Navigator.of(context).pop({
              'POINT_CODE': _pointCodeCtrl.text.trim(),
              'POINT_NAME': _pointNameCtrl.text.trim(),
            });
          },
          child: const Text('Add'),
        ),
      ],
    );
  }
}

class _TestTableDtcTabState extends ConsumerState<TestTableDtcTab> {
  bool _loading = false;

  int? _loadingPointForTestCode;

  Map<String, dynamic>? _selectedTest;

  List<PlutoColumn> _testCols = const [];
  List<PlutoRow> _testRows = const [];

  List<PlutoColumn> _pointCols = const [];
  List<PlutoRow> _pointRows = const [];

  String _s(dynamic v) => (v ?? '').toString();
  int _i(dynamic v) => int.tryParse(_s(v)) ?? 0;

  Future<Map<String, dynamic>> _post(String command, Map<String, dynamic> data) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(command, data: data);
    final body = res.data;
    if (body is Map<String, dynamic>) return body;
    return <String, dynamic>{'tk_status': 'NG', 'message': 'Bad response'};
  }

  Future<void> _selectTestAndLoadPoints({required int testCode, Map<String, dynamic>? raw}) async {
    if (testCode <= 0) return;
    if (_loadingPointForTestCode == testCode && _loading) return;
    _loadingPointForTestCode = testCode;
    setState(() {
      if (raw != null) _selectedTest = raw;
      _pointCols = const [];
      _pointRows = const [];
    });
    await _loadPointList(testCode);
  }

  bool _isNg(Map<String, dynamic> body) => (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadTestList();
    });
  }

  List<PlutoColumn> _buildTestCols() {
    PlutoColumn c(String f, {double w = 140}) => PlutoColumn(
          title: f,
          field: f,
          width: w,
          enableContextMenu: false,
          enableDropToResize: true,
          type: PlutoColumnType.text(),
        );

    return [
      PlutoColumn(title: '', field: '__raw__', type: PlutoColumnType.text(), width: 0, hide: true, enableContextMenu: false),
      c('TEST_CODE', w: 120),
      c('TEST_NAME', w: 220),
      c('TEST_TIME', w: 140),
    ];
  }

  List<PlutoColumn> _buildPointCols() {
    PlutoColumn c(String f, {double w = 140}) => PlutoColumn(
          title: f,
          field: f,
          width: w,
          enableContextMenu: false,
          enableDropToResize: true,
          type: PlutoColumnType.text(),
        );

    return [
      PlutoColumn(title: '', field: '__raw__', type: PlutoColumnType.text(), width: 0, hide: true, enableContextMenu: false),
      c('POINT_CODE', w: 120),
      c('POINT_NAME', w: 220),
      c('TEST_CODE', w: 120),
      c('TEST_NAME', w: 220),
    ];
  }

  List<PlutoRow> _rowsFromList(List<Map<String, dynamic>> list, List<PlutoColumn> cols) {
    Object? val(Map<String, dynamic> it, String field) {
      if (field == '__raw__') return it;
      return it[field];
    }

    return [
      for (final it in list)
        PlutoRow(
          cells: {for (final c in cols) c.field: PlutoCell(value: val(it, c.field))},
        ),
    ];
  }

  Future<void> _loadTestList() async {
    setState(() => _loading = true);
    try {
      final body = await _post('loadDtcTestList', {});
      if (_isNg(body)) {
        _snack('Không load được test list');
        return;
      }
      final data = body['data'];
      final list = (data is List ? data : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList();
      final cols = _buildTestCols();
      if (!mounted) return;
      setState(() {
        _testCols = cols;
        _testRows = _rowsFromList(list, cols);
        if (_selectedTest == null && list.isNotEmpty) {
          _selectedTest = list.first;
        }
      });
      if (_selectedTest != null) {
        await _loadPointList(_i(_selectedTest?['TEST_CODE']));
      }
    } catch (e) {
      _snack('Lỗi: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _loadPointList(int testCode) async {
    if (testCode <= 0) {
      setState(() {
        _pointCols = const [];
        _pointRows = const [];
      });
      return;
    }

    setState(() => _loading = true);
    try {
      final body = await _post('loadDtcTestPointList', {'TEST_CODE': testCode});
      if (_isNg(body)) {
        _snack('Không load được point list');
        return;
      }
      final data = body['data'];
      final list = (data is List ? data : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList();
      final cols = _buildPointCols();
      if (!mounted) return;
      setState(() {
        _pointCols = cols;
        _pointRows = _rowsFromList(list, cols);
      });
    } catch (e) {
      _snack('Lỗi: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _openAddTestItem() async {
    final res = await showDialog<Map<String, dynamic>>(
      context: context,
      builder: (ctx) => const _AddTestItemDialog(),
    );
    if (res == null) return;

    final name = _s(res['TEST_NAME']).trim();
    final code = _i(res['TEST_CODE']);

    if (name.isEmpty) {
      _snack('Thiếu TEST_NAME');
      return;
    }

    if (AppConfig.company != 'CMS' && code <= 0) {
      _snack('Thiếu TEST_CODE');
      return;
    }

    setState(() => _loading = true);
    try {
      final body = await _post('addTestItem', {
        'TEST_CODE': AppConfig.company != 'CMS' ? code : -1,
        'TEST_NAME': name,
      });
      if (_isNg(body)) {
        _snack('Thêm thất bại: ${_s(body['message'])}');
      } else {
        _snack('Thêm thành công');
        await _loadTestList();
      }
    } catch (e) {
      _snack('Lỗi: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _openAddTestPoint() async {
    if (_selectedTest == null) {
      _snack('Chọn Test Item trước');
      return;
    }

    final res = await showDialog<Map<String, dynamic>>(
      context: context,
      builder: (ctx) => _AddTestPointDialog(
        testCode: _i(_selectedTest?['TEST_CODE']),
        testName: _s(_selectedTest?['TEST_NAME']),
      ),
    );
    if (res == null) return;

    final pointCode = _i(res['POINT_CODE']);
    final pointName = _s(res['POINT_NAME']).trim();

    final testCode = _i(_selectedTest?['TEST_CODE']);
    if (testCode <= 0 || pointCode <= 0 || pointName.isEmpty) {
      _snack('Thiếu dữ liệu');
      return;
    }

    setState(() => _loading = true);
    try {
      final body = await _post('addTestPoint', {
        'TEST_CODE': testCode,
        'POINT_CODE': pointCode,
        'POINT_NAME': pointName,
      });
      if (_isNg(body)) {
        _snack('Thêm thất bại: ${_s(body['message'])}');
      } else {
        _snack('Thêm thành công');
        await _loadPointList(testCode);
      }
    } catch (e) {
      _snack('Lỗi: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (AppConfig.company != 'CMS') {
      return const Center(child: Text('Tab này chỉ dành cho CMS'));
    }

    final scheme = Theme.of(context).colorScheme;

    return Padding(
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              Expanded(
                child: Text('Quản lý hạng mục ĐTC', style: TextStyle(color: scheme.primary, fontWeight: FontWeight.w900)),
              ),
              IconButton(
                onPressed: _loading ? null : _openAddTestItem,
                icon: const Icon(Icons.add_circle_outline),
                tooltip: 'Add Test Item',
              ),
              IconButton(
                onPressed: _loading ? null : _loadTestList,
                icon: const Icon(Icons.refresh),
                tooltip: 'Refresh',
              ),
            ],
          ),
          const SizedBox(height: 8),
          Expanded(
            child: LayoutBuilder(
              builder: (context, constraints) {
                final leftH = constraints.maxHeight * 0.45;
                // bottom uses Expanded to avoid RenderFlex overflow

                return Column(
                  children: [
                    SizedBox(
                      height: leftH,
                      child: _loading && _testCols.isEmpty
                          ? const Center(child: CircularProgressIndicator())
                          : PlutoGrid(
                              columns: _testCols.isEmpty ? _buildTestCols() : _testCols,
                              rows: _testRows,
                              onLoaded: (e) {
                                e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                              },
                              onRowDoubleTap: (event) async {
                                final testCode = _i(event.row.cells['TEST_CODE']?.value);
                                if (testCode <= 0) return;
                                final raw = event.row.cells['__raw__']?.value;
                                await _selectTestAndLoadPoints(
                                  testCode: testCode,
                                  raw: (raw is Map<String, dynamic>) ? raw : null,
                                );
                              },
                              onSelected: (event) async {
                                final row = event.row;
                                if (row == null) return;
                                final testCode = _i(row.cells['TEST_CODE']?.value);
                                if (testCode <= 0) return;
                                final raw = row.cells['__raw__']?.value;
                                await _selectTestAndLoadPoints(
                                  testCode: testCode,
                                  raw: (raw is Map<String, dynamic>) ? raw : null,
                                );
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
                            ),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            _selectedTest == null
                                ? 'Test Points'
                                : 'Test Points - ${_s(_selectedTest?['TEST_NAME'])} (${_s(_selectedTest?['TEST_CODE'])})',
                            style: const TextStyle(fontWeight: FontWeight.w900),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        IconButton(
                          onPressed: _loading ? null : _openAddTestPoint,
                          icon: const Icon(Icons.add_circle_outline),
                          tooltip: 'Add Test Point',
                        ),
                        IconButton(
                          onPressed: (_loading || _selectedTest == null)
                              ? null
                              : () => _loadPointList(_i(_selectedTest?['TEST_CODE'])),
                          icon: const Icon(Icons.refresh),
                          tooltip: 'Refresh',
                        ),
                      ],
                    ),
                    Expanded(
                      child: _loading && _pointCols.isEmpty
                          ? const Center(child: CircularProgressIndicator())
                          : PlutoGrid(
                              columns: _pointCols.isEmpty ? _buildPointCols() : _pointCols,
                              rows: _pointRows,
                              onLoaded: (e) {
                                e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
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
                            ),
                    ),
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
