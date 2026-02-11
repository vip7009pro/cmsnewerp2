import 'package:barcode_widget/barcode_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pluto_grid/pluto_grid.dart';

import '../../../../app/app_drawer.dart';
import '../../../../core/providers.dart';

class ProductBarcodeManagerPage extends ConsumerStatefulWidget {
  const ProductBarcodeManagerPage({super.key});

  @override
  ConsumerState<ProductBarcodeManagerPage> createState() => _ProductBarcodeManagerPageState();
}

class _ProductBarcodeManagerPageState extends ConsumerState<ProductBarcodeManagerPage> {
  bool _loading = false;

  List<Map<String, dynamic>> _codeList = const [];
  String _selectedGCode = '6A00001B';

  final TextEditingController _codeSearchCtrl = TextEditingController();

  List<Map<String, dynamic>> _rows = const [];
  Map<String, dynamic> _selectedRow = {
    'G_CODE': '',
    'G_NAME': '',
    'BARCODE_STT': '',
    'BARCODE_TYPE': '1D',
    'BARCODE_RND': '',
    'BARCODE_INSP': '',
    'BARCODE_RELI': '',
    'STATUS': '',
    'SX_STATUS': '',
  };

  String _s(dynamic v) => (v ?? '').toString();

  final TextEditingController _barcodeSttCtrl = TextEditingController();
  final TextEditingController _barcodeRndCtrl = TextEditingController();
  final TextEditingController _barcodeReliCtrl = TextEditingController();
  final TextEditingController _barcodeInspCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _init();
    });
  }

  @override
  void dispose() {
    _codeSearchCtrl.dispose();
    _barcodeSttCtrl.dispose();
    _barcodeRndCtrl.dispose();
    _barcodeReliCtrl.dispose();
    _barcodeInspCtrl.dispose();
    super.dispose();
  }

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

  Future<void> _init() async {
    await Future.wait([
      _loadBarcodeTable(),
    ]);
  }

  Future<void> _loadCodeList(String gName) async {
    try {
      final body = await _post('selectcodeList', {'G_NAME': gName});
      if (_isNg(body)) return;
      final data = body['data'];
      final list = (data is List ? data : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList(growable: false);
      if (!mounted) return;
      setState(() {
        _codeList = list;

        final codes = _codeList.map((e) => _s(e['G_CODE'])).where((x) => x.isNotEmpty).toSet();
        if (_selectedGCode.isEmpty || !codes.contains(_selectedGCode)) {
          _selectedGCode = codes.isNotEmpty ? codes.first : '';
        }
      });
    } catch (_) {}
  }

  Future<void> _searchCodes() async {
    final kw = _s(_codeSearchCtrl.text).trim();
    if (kw.isEmpty) {
      setState(() => _codeList = const []);
      return;
    }
    await _loadCodeList(kw);
  }

  Future<void> _loadBarcodeTable() async {
    setState(() => _loading = true);
    try {
      final body = await _post('loadbarcodemanager', {});
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() {
          _rows = const [];
          _loading = false;
        });
        _snack('Lỗi: ${_s(body['message'])}');
        return;
      }

      final data = body['data'];
      final list = (data is List ? data : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .map((e) {
        return {
          ...e,
          'SX_STATUS': e['SX_STATUS'] ?? 'NO',
        };
      }).toList(growable: false);

      if (!mounted) return;
      setState(() {
        _rows = list;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Map<String, dynamic> _payloadSelectedRow() {
    return {
      'G_CODE': _s(_selectedRow['G_CODE']).isEmpty ? _selectedGCode : _selectedRow['G_CODE'],
      'BARCODE_INSP': _selectedRow['BARCODE_INSP'] ?? '',
      'BARCODE_RELI': _selectedRow['BARCODE_RELI'] ?? '',
      'BARCODE_RND': _selectedRow['BARCODE_RND'] ?? '',
      'BARCODE_STT': _selectedRow['BARCODE_STT'] ?? '',
      'BARCODE_TYPE': _selectedRow['BARCODE_TYPE'] ?? '1D',
      'G_NAME': _selectedRow['G_NAME'] ?? '',
      'STATUS': _selectedRow['STATUS'] ?? '',
      'SX_STATUS': _selectedRow['SX_STATUS'] ?? 'NO',
    };
  }

  Future<void> _addBarcode() async {
    final payload = _payloadSelectedRow();
    try {
      final chk = await _post('checkbarcodeExist', payload);
      final exist = !_isNg(chk);
      if (exist) {
        _snack('Barcode đã tồn tại');
        return;
      }

      final body = await _post('addBarcode', payload);
      if (_isNg(body)) {
        _snack('Thêm barcode thất bại: ${_s(body['message'])}');
        return;
      }
      _snack('Thêm barcode thành công');
      await _loadBarcodeTable();
    } catch (e) {
      _snack('Lỗi: $e');
    }
  }

  Future<void> _updateBarcode() async {
    final payload = _payloadSelectedRow();
    try {
      final body = await _post('updateBarcode', payload);
      if (_isNg(body)) {
        _snack('Update barcode thất bại: ${_s(body['message'])}');
        return;
      }
      _snack('Update barcode thành công');
      await _loadBarcodeTable();
    } catch (e) {
      _snack('Lỗi: $e');
    }
  }

  Future<void> _deleteBarcode() async {
    if (_s(_selectedRow['SX_STATUS']).toUpperCase() != 'NO') {
      _snack('Barcode đã được sản xuất, không thể xóa');
      return;
    }

    final ok = await showDialog<bool>(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text('Xác nhận'),
            content: const Text('Bạn có chắc chắn muốn xóa barcode này không?'),
            actions: [
              TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Cancel')),
              FilledButton(onPressed: () => Navigator.of(ctx).pop(true), child: const Text('OK')),
            ],
          ),
        ) ??
        false;
    if (!ok) return;

    final payload = _payloadSelectedRow();
    try {
      final body = await _post('deleteBarcode', payload);
      if (_isNg(body)) {
        _snack('Delete barcode thất bại: ${_s(body['message'])}');
        return;
      }
      _snack('Delete barcode thành công');
      await _loadBarcodeTable();
    } catch (e) {
      _snack('Lỗi: $e');
    }
  }

  Widget _barcodePreview() {
    final type = _s(_selectedRow['BARCODE_TYPE']).toUpperCase();
    final data = _s(_selectedRow['BARCODE_RND']);
    if (data.trim().isEmpty) return const SizedBox.shrink();

    Barcode bc;
    if (type == 'QR') {
      bc = Barcode.qrCode();
    } else if (type == 'MATRIX') {
      bc = Barcode.dataMatrix();
    } else {
      bc = Barcode.code128();
    }

    final double h = type == '1D' ? 60 : 120;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: SizedBox(
          height: h,
          child: BarcodeWidget(
            barcode: bc,
            data: data,
            drawText: false,
          ),
        ),
      ),
    );
  }

  List<PlutoColumn> _buildColumns() {
    PlutoColumn col(String f, {double w = 120, bool editable = false, Widget Function(PlutoColumnRendererContext ctx)? renderer}) {
      return PlutoColumn(
        title: f,
        field: f,
        type: PlutoColumnType.text(),
        width: w,
        enableColumnDrag: false,
        enableDropToResize: true,
        enableContextMenu: false,
        enableEditingMode: editable,
        renderer: renderer,
      );
    }

    return [
      PlutoColumn(title: '', field: '__raw__', type: PlutoColumnType.text(), width: 0, hide: true),
      col('G_CODE', w: 90),
      col('G_NAME', w: 220),
      col('BARCODE_STT', w: 120),
      col('BARCODE_TYPE', w: 120),
      col('BARCODE_RND', w: 160),
      col('BARCODE_INSP', w: 160),
      col('BARCODE_RELI', w: 160),
      col(
        'STATUS',
        w: 120,
        renderer: (ctx) {
          final v = _s(ctx.cell.value).toUpperCase();
          final ok = v == 'OK';
          final bg = ok ? const Color(0xFF13DC0C) : Colors.red;
          return Container(
            alignment: Alignment.center,
            color: bg,
            child: Text(ok ? 'OK' : 'NG', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900)),
          );
        },
      ),
      col('CODE_VISUALIZE', w: 260, renderer: (_) => _barcodePreview()),
      col('SX_STATUS', w: 120),
    ];
  }

  List<PlutoRow> _buildGridRows(List<Map<String, dynamic>> rows, List<PlutoColumn> cols) {
    return [
      for (final r in rows)
        PlutoRow(
          cells: {
            '__raw__': PlutoCell(value: r),
            for (final c in cols)
              if (c.field != '__raw__') c.field: PlutoCell(value: r[c.field == 'CODE_VISUALIZE' ? 'BARCODE_RND' : c.field]),
          },
        ),
    ];
  }

  void _syncFormFromSelectedRow() {
    _barcodeSttCtrl.text = _s(_selectedRow['BARCODE_STT']);
    _barcodeRndCtrl.text = _s(_selectedRow['BARCODE_RND']);
    _barcodeReliCtrl.text = _s(_selectedRow['BARCODE_RELI']);
    _barcodeInspCtrl.text = _s(_selectedRow['BARCODE_INSP']);
  }

  @override
  Widget build(BuildContext context) {
    final cols = _buildColumns();
    final gridRows = _buildGridRows(_rows, cols);

    final codeItems = _codeList
        .map((e) => {
              'G_CODE': _s(e['G_CODE']),
              'G_NAME': _s(e['G_NAME']),
            })
        .where((e) => (e['G_CODE'] ?? '').toString().isNotEmpty)
        .fold<Map<String, Map<String, String>>>({}, (acc, e) {
          // Deduplicate by G_CODE to satisfy DropdownButton assertion.
          acc.putIfAbsent(e['G_CODE']!, () => {'G_CODE': e['G_CODE']!, 'G_NAME': e['G_NAME']!});
          return acc;
        })
        .values
        .toList(growable: false);

    final String? selectedGCodeValue = (() {
      if (_selectedGCode.isEmpty) {
        return codeItems.isNotEmpty ? _s(codeItems.first['G_CODE']) : null;
      }

      final matchCount = codeItems.where((e) => _s(e['G_CODE']) == _selectedGCode).length;
      if (matchCount == 1) return _selectedGCode;

      // If 0 match (or somehow >1), do not provide a value to DropdownButton.
      // This prevents runtime assertion.
      return codeItems.isNotEmpty ? _s(codeItems.first['G_CODE']) : null;
    })();

    // Keep state consistent to avoid DropdownButton holding a value that is not in the menu.
    if (selectedGCodeValue != null && selectedGCodeValue != _selectedGCode) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (!mounted) return;
        if (_selectedGCode == selectedGCodeValue) return;
        setState(() {
          _selectedGCode = selectedGCodeValue;
          _selectedRow['G_CODE'] = selectedGCodeValue;
        });
      });
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('RND / PRODUCT BARCODE MANAGER'),
        actions: [
          IconButton(
            onPressed: _loading ? null : _loadBarcodeTable,
            icon: const Icon(Icons.refresh),
            tooltip: 'Refresh',
          ),
        ],
      ),
      drawer: const AppDrawer(title: 'ERP'),
      body: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(8),
                child: Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                    SizedBox(
                      width: 200,
                      child: TextField(
                        controller: _codeSearchCtrl,
                        decoration: const InputDecoration(labelText: 'Tìm G_NAME', hintText: 'nhập từ khóa'),
                        onSubmitted: (_) => _searchCodes(),
                      ),
                    ),
                    FilledButton.icon(
                      onPressed: _loading ? null : _searchCodes,
                      icon: const Icon(Icons.search),
                      label: const Text('Search'),
                    ),
                    ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 280),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          isExpanded: true,
                          value: selectedGCodeValue,
                          style: const TextStyle(color: Colors.black, fontWeight: FontWeight.w700),
                          dropdownColor: Colors.white,
                          onChanged: _loading
                              ? null
                              : (v) {
                                  if (v == null) return;
                                  setState(() {
                                    _selectedGCode = v;
                                    _selectedRow['G_CODE'] = v;
                                  });
                                },
                          items: codeItems
                              .map(
                                (e) => DropdownMenuItem(
                                  value: _s(e['G_CODE']),
                                  child: Text('${_s(e['G_CODE'])}: ${_s(e['G_NAME'])}', overflow: TextOverflow.ellipsis),
                                ),
                              )
                              .toList(growable: false),
                        ),
                      ),
                    ),
                    SizedBox(
                      width: 180,
                      child: TextField(
                        controller: _barcodeSttCtrl,
                        decoration: const InputDecoration(labelText: 'STT BARCODE'),
                        onChanged: (v) => _selectedRow['BARCODE_STT'] = v,
                      ),
                    ),
                    ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 220),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          isExpanded: true,
                          value: _s(_selectedRow['BARCODE_TYPE']).isEmpty ? '1D' : _s(_selectedRow['BARCODE_TYPE']),
                          style: const TextStyle(color: Colors.black, fontWeight: FontWeight.w700),
                          dropdownColor: Colors.white,
                          onChanged: _loading
                              ? null
                              : (v) {
                                  setState(() {
                                    _selectedRow['BARCODE_TYPE'] = v ?? '1D';
                                  });
                                },
                          items: const [
                            DropdownMenuItem(value: '1D', child: Text('1D BARCODE')),
                            DropdownMenuItem(value: 'MATRIX', child: Text('2D MATRIX')),
                            DropdownMenuItem(value: 'QR', child: Text('QR CODE')),
                          ],
                        ),
                      ),
                    ),
                    SizedBox(
                      width: 220,
                      child: TextField(
                        controller: _barcodeRndCtrl,
                        decoration: const InputDecoration(labelText: 'BARCODE RND'),
                        onChanged: (v) => setState(() => _selectedRow['BARCODE_RND'] = v),
                      ),
                    ),
                    SizedBox(
                      width: 220,
                      child: TextField(
                        enabled: false,
                        decoration: const InputDecoration(labelText: 'BARCODE DTC'),
                        controller: _barcodeReliCtrl,
                      ),
                    ),
                    SizedBox(
                      width: 220,
                      child: TextField(
                        enabled: false,
                        decoration: const InputDecoration(labelText: 'BARCODE KT'),
                        controller: _barcodeInspCtrl,
                      ),
                    ),
                    FilledButton(
                      onPressed: _loading ? null : _addBarcode,
                      child: const Text('Add'),
                    ),
                    FilledButton(
                      onPressed: _loading ? null : _updateBarcode,
                      child: const Text('Update'),
                    ),
                    FilledButton(
                      onPressed: _loading ? null : _deleteBarcode,
                      style: FilledButton.styleFrom(backgroundColor: Colors.red),
                      child: const Text('Delete'),
                    ),
                  ],
                ),
              ),
            ),
            if (_loading) const LinearProgressIndicator(),
            const SizedBox(height: 8),
            Expanded(
              child: ClipRect(
                child: PlutoGrid(
                  columns: cols,
                  rows: gridRows,
                  onLoaded: (e) {
                    e.stateManager.setShowColumnFilter(true);
                    e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                  },
                  onSelected: (e) {
                    final row = e.row;
                    if (row == null) return;
                    final raw = row.cells['__raw__']?.value;
                    if (raw is! Map<String, dynamic>) return;
                    setState(() {
                      _selectedRow = Map<String, dynamic>.from(raw);
                      _selectedGCode = _s(raw['G_CODE']).isEmpty ? _selectedGCode : _s(raw['G_CODE']);
                      _syncFormFromSelectedRow();
                    });
                  },
                  configuration: const PlutoGridConfiguration(
                    columnSize: PlutoGridColumnSizeConfig(autoSizeMode: PlutoAutoSizeMode.none),
                    style: PlutoGridStyleConfig(
                      rowHeight: 40,
                      columnHeight: 34,
                      cellTextStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
                      columnTextStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w900),
                      defaultCellPadding: EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
