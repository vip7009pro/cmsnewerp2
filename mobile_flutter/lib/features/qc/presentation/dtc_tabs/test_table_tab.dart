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

class _TestTableDtcTabState extends ConsumerState<TestTableDtcTab> {
  bool _loading = false;

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
    final testNameCtrl = TextEditingController();
    final testCodeCtrl = TextEditingController();

    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          title: const Text('Add Test Item'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: testCodeCtrl,
                decoration: const InputDecoration(labelText: 'TEST_CODE'),
                keyboardType: TextInputType.number,
                enabled: AppConfig.company != 'CMS',
              ),
              TextField(
                controller: testNameCtrl,
                decoration: const InputDecoration(labelText: 'TEST_NAME'),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Cancel')),
            FilledButton(onPressed: () => Navigator.of(ctx).pop(true), child: const Text('Add')),
          ],
        );
      },
    );

    if (ok != true) {
      testNameCtrl.dispose();
      testCodeCtrl.dispose();
      return;
    }

    final name = testNameCtrl.text.trim();
    final code = int.tryParse(testCodeCtrl.text.trim()) ?? 0;
    testNameCtrl.dispose();
    testCodeCtrl.dispose();

    if (name.isEmpty) {
      _snack('Thiếu TEST_NAME');
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

    final pointCodeCtrl = TextEditingController();
    final pointNameCtrl = TextEditingController();

    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          title: const Text('Add Test Point'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('TEST: ${_s(_selectedTest?['TEST_NAME'])} (${_s(_selectedTest?['TEST_CODE'])})'),
              const SizedBox(height: 8),
              TextField(
                controller: pointCodeCtrl,
                decoration: const InputDecoration(labelText: 'POINT_CODE'),
                keyboardType: TextInputType.number,
              ),
              TextField(
                controller: pointNameCtrl,
                decoration: const InputDecoration(labelText: 'POINT_NAME'),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Cancel')),
            FilledButton(onPressed: () => Navigator.of(ctx).pop(true), child: const Text('Add')),
          ],
        );
      },
    );

    if (ok != true) {
      pointCodeCtrl.dispose();
      pointNameCtrl.dispose();
      return;
    }

    final pointCode = int.tryParse(pointCodeCtrl.text.trim()) ?? 0;
    final pointName = pointNameCtrl.text.trim();
    pointCodeCtrl.dispose();
    pointNameCtrl.dispose();

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
                final rightH = constraints.maxHeight * 0.55;

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
                                final raw = event.row.cells['__raw__']?.value;
                                if (raw is Map<String, dynamic>) {
                                  setState(() => _selectedTest = raw);
                                  await _loadPointList(_i(raw['TEST_CODE']));
                                }
                              },
                              onSelected: (event) async {
                                final raw = event.row?.cells['__raw__']?.value;
                                if (raw is Map<String, dynamic>) {
                                  setState(() => _selectedTest = raw);
                                  await _loadPointList(_i(raw['TEST_CODE']));
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
                    SizedBox(
                      height: rightH - 44,
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
