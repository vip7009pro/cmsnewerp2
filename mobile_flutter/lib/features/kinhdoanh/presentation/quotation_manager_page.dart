import 'dart:async';
import 'dart:io';

import 'package:excel/excel.dart' as xls;
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:path_provider/path_provider.dart';
import 'package:pluto_grid/pluto_grid.dart';
import 'package:share_plus/share_plus.dart';

import '../../../app/app_drawer.dart';
import '../../../core/config/app_config.dart';
import '../../../core/providers.dart';
import '../../auth/application/auth_notifier.dart';
import '../../auth/application/auth_state.dart';

enum _PriceViewMode { lastPrice, ngang, doc }

enum _UploadStatus { ready, ng }

class QuotationManagerPage extends ConsumerStatefulWidget {
  const QuotationManagerPage({super.key});

  @override
  ConsumerState<QuotationManagerPage> createState() => _QuotationManagerPageState();
}

class _QuotationManagerPageState extends ConsumerState<QuotationManagerPage> {
  DateTime _fromDate = DateTime.now();
  DateTime _toDate = DateTime.now();
  bool _allTime = true;
  bool _showFilter = true;

  final _codeKdCtrl = TextEditingController();
  final _codeCmsCtrl = TextEditingController();
  final _mNameCtrl = TextEditingController();
  final _custNameCtrl = TextEditingController();

  _PriceViewMode _mode = _PriceViewMode.ngang;

  bool _loading = false;

  List<Map<String, dynamic>> _rows = const [];

  List<PlutoColumn> _gridColumns = const [];
  List<PlutoRow> _gridRows = const [];

  final Set<int> _selectedRowIndexes = <int>{};

  List<Map<String, dynamic>> _customerList = const [];
  List<Map<String, dynamic>> _codeList = const [];

  bool _showUpGia = false;
  List<Map<String, dynamic>> _uploadRows = const [];

  String _ymd(DateTime dt) => DateFormat('yyyy-MM-dd').format(dt);

  String _s(dynamic v) => (v ?? '').toString();

  String _fmtDateShort(String ymd) {
    if (ymd.length >= 10 && ymd[4] == '-' && ymd[7] == '-') {
      final y = int.tryParse(ymd.substring(0, 4));
      final m = int.tryParse(ymd.substring(5, 7));
      final d = int.tryParse(ymd.substring(8, 10));
      if (y != null && m != null && d != null) {
        return DateFormat('dd/MM/yyyy').format(DateTime(y, m, d));
      }
    }
    final dt = DateTime.tryParse(ymd);
    if (dt != null) return DateFormat('dd/MM/yyyy').format(dt.toLocal());
    return ymd;
  }

  Future<void> _pickDate({required bool from}) async {
    final init = from ? _fromDate : _toDate;
    final picked = await showDatePicker(
      context: context,
      initialDate: init,
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

  List<PlutoColumn> _buildColumns(List<Map<String, dynamic>> list) {
    if (list.isEmpty) return const [];
    final keys = list.first.keys.toList();

    bool isNumericKey(String k) {
      for (final r in list.take(200)) {
        final v = r[k];
        if (v == null) continue;
        final s = v.toString();
        if (s.isEmpty) continue;
        if (num.tryParse(s.replaceAll(',', '')) != null) return true;
      }
      return false;
    }

    return keys.map((k) {
      final isNum = isNumericKey(k);
      return PlutoColumn(
        title: k,
        field: k,
        type: isNum ? PlutoColumnType.number() : PlutoColumnType.text(),
        enableSorting: true,
        width: 140,
        renderer: (ctx) {
          final v = ctx.cell.value;
          if (v == null) return const SizedBox.shrink();
          final s = v.toString();
          if (k.toUpperCase().contains('DATE') && s.isNotEmpty) {
            return Text(_fmtDateShort(s));
          }
          return Text(s);
        },
      );
    }).toList();
  }

  List<PlutoRow> _buildRows(List<Map<String, dynamic>> list, List<PlutoColumn> cols) {
    return List<PlutoRow>.generate(list.length, (i) {
      final r = list[i];
      final cells = <String, PlutoCell>{};
      for (final c in cols) {
        cells[c.field] = PlutoCell(value: r[c.field]);
      }
      return PlutoRow(cells: cells);
    });
  }

  List<Map<String, dynamic>> _selectedRows() {
    if (_rows.isEmpty || _selectedRowIndexes.isEmpty) return const [];
    return _selectedRowIndexes
        .where((i) => i >= 0 && i < _rows.length)
        .map((i) => _rows[i])
        .toList();
  }

  Future<void> _ensureLists() async {
    if (_customerList.isNotEmpty && _codeList.isNotEmpty) return;
    final api = ref.read(apiClientProvider);

    try {
      final resCust = await api.postCommand('selectcustomerList', data: {});
      final b1 = resCust.data;
      final cust = (b1 is Map<String, dynamic> ? b1['data'] : null);
      final custList = (cust is List ? cust : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList();

      final resCode = await api.postCommand('loadM100UpGia', data: {});
      final b2 = resCode.data;
      final code = (b2 is Map<String, dynamic> ? b2['data'] : null);
      final codeList = (code is List ? code : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList();

      if (!mounted) return;
      setState(() {
        _customerList = custList;
        _codeList = codeList;
      });
    } catch (_) {
      // ignore
    }
  }

  Future<void> _dongboGiaPoIfNeeded() async {
    final base = AppConfig.baseUrl;
    final company = AppConfig.company.toUpperCase();
    if (company != 'CMS') return;

    if (base == 'http://222.252.1.63:3007') return;
    if (base == 'http://222.252.1.214:3007') return;
    if (base == 'https://erp.printvietnam.com.vn:3007') return;

    try {
      final api = ref.read(apiClientProvider);
      await api.postCommand('dongbogiasptupo', data: {});
    } catch (_) {
      // ignore
    }
  }

  Future<void> _loadPrice(_PriceViewMode mode) async {
    if (!mounted) return;
    setState(() {
      _loading = true;
      _mode = mode;
      _selectedRowIndexes.clear();
    });

    try {
      final api = ref.read(apiClientProvider);
      final cmd = switch (mode) {
        _PriceViewMode.ngang => 'loadbanggia',
        _PriceViewMode.doc => 'loadbanggia2',
        _PriceViewMode.lastPrice => 'loadbanggiamoinhat',
      };

      final res = await api.postCommand(
        cmd,
        data: {
          'ALLTIME': _allTime,
          'FROM_DATE': _ymd(_fromDate),
          'TO_DATE': _ymd(_toDate),
          'M_NAME': _mNameCtrl.text.trim(),
          'G_CODE': _codeCmsCtrl.text.trim(),
          'G_NAME': _codeKdCtrl.text.trim(),
          'CUST_NAME_KD': _custNameCtrl.text.trim(),
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
          .asMap()
          .entries
          .map((e) {
            final idx = e.key;
            final item = e.value;
            final m = item is Map ? Map<String, dynamic>.from(item) : <String, dynamic>{};
            m['id'] = idx;
            return m;
          })
          .toList();

      final cols = _buildColumns(list);
      final gridRows = _buildRows(list, cols);

      if (!mounted) return;
      setState(() {
        _rows = list;
        _gridColumns = cols;
        _gridRows = gridRows;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  Future<void> _approveSelected() async {
    final messenger = ScaffoldMessenger.of(context);
    final selected = _selectedRows();
    if (selected.isEmpty) {
      messenger.showSnackBar(const SnackBar(content: Text('Chọn ít nhất 1 dòng')));
      return;
    }

    try {
      final api = ref.read(apiClientProvider);
      var ok = 0;
      var failed = 0;
      for (final r in selected) {
        final finalV = (_s(r['FINAL']).toUpperCase() == 'Y') ? 'N' : 'Y';
        final payload = Map<String, dynamic>.from(r);
        payload['FINAL'] = finalV;
        final res = await api.postCommand('pheduyetgia', data: payload);
        final body = res.data;
        if (body is Map<String, dynamic> && (body['tk_status'] ?? '').toString().toUpperCase() == 'NG') {
          failed++;
        } else {
          ok++;
        }
      }
      if (!mounted) return;
      messenger.showSnackBar(SnackBar(content: Text('Approve OK: $ok, Fail: $failed')));
      await _loadPrice(_mode);
    } catch (e) {
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  Future<void> _updateSelected() async {
    final messenger = ScaffoldMessenger.of(context);
    final selected = _selectedRows();
    if (selected.isEmpty) {
      messenger.showSnackBar(const SnackBar(content: Text('Chọn ít nhất 1 dòng (Bảng giá dọc)')));
      return;
    }

    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Update giá hàng loạt'),
        content: Text('Chắc chắn muốn update ${selected.length} dòng?'),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Hủy')),
          FilledButton(onPressed: () => Navigator.of(ctx).pop(true), child: const Text('Update')),
        ],
      ),
    );
    if (ok != true) return;

    try {
      final api = ref.read(apiClientProvider);
      var done = 0;
      var failed = 0;
      for (final r in selected) {
        final res = await api.postCommand('updategia', data: Map<String, dynamic>.from(r));
        final body = res.data;
        if (body is Map<String, dynamic> && (body['tk_status'] ?? '').toString().toUpperCase() == 'NG') {
          failed++;
        } else {
          done++;
        }
      }
      if (!mounted) return;
      messenger.showSnackBar(SnackBar(content: Text('Update OK: $done, Fail: $failed')));
      await _loadPrice(_mode);
    } catch (e) {
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  Future<void> _deleteSelected() async {
    final messenger = ScaffoldMessenger.of(context);
    final selected = _selectedRows();
    if (selected.isEmpty) {
      messenger.showSnackBar(const SnackBar(content: Text('Chọn ít nhất 1 dòng (Bảng giá dọc)')));
      return;
    }

    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Xóa giá hàng loạt'),
        content: Text('Chắc chắn muốn xóa ${selected.length} dòng?'),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Hủy')),
          FilledButton(onPressed: () => Navigator.of(ctx).pop(true), child: const Text('Xóa')),
        ],
      ),
    );
    if (ok != true) return;

    try {
      final api = ref.read(apiClientProvider);
      var done = 0;
      var failed = 0;
      for (final r in selected) {
        final res = await api.postCommand('deletegia', data: Map<String, dynamic>.from(r));
        final body = res.data;
        if (body is Map<String, dynamic> && (body['tk_status'] ?? '').toString().toUpperCase() == 'NG') {
          failed++;
        } else {
          done++;
        }
      }
      if (!mounted) return;
      messenger.showSnackBar(SnackBar(content: Text('Delete OK: $done, Fail: $failed')));
      await _loadPrice(_mode);
    } catch (e) {
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  Future<void> _exportExcel() async {
    if (_rows.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Chưa có dữ liệu để xuất')));
      return;
    }

    final excel = xls.Excel.createExcel();
    final sheet = excel['BANGGIA'];
    final keys = _rows.first.keys.toList();

    sheet.appendRow(keys.map((h) => xls.TextCellValue(h)).toList());
    for (final r in _rows) {
      sheet.appendRow(keys.map((k) => xls.TextCellValue(_s(r[k]))).toList());
    }

    final bytes = excel.encode();
    if (bytes == null) return;
    final dir = await getTemporaryDirectory();
    final filename = 'BANGGIA_${DateTime.now().millisecondsSinceEpoch}.xlsx';
    final file = File('${dir.path}/$filename');
    await file.writeAsBytes(bytes, flush: true);

    await Share.shareXFiles([
      XFile(file.path, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    ]);
  }

  Future<void> _pickExcelAndParse() async {
    final messenger = ScaffoldMessenger.of(context);
    await _ensureLists();

    final result = await FilePicker.platform.pickFiles(
      allowMultiple: false,
      withData: true,
      type: FileType.custom,
      allowedExtensions: const ['xlsx', 'xls'],
    );
    if (result == null || result.files.isEmpty) return;

    final bytes = result.files.first.bytes;
    if (bytes == null) {
      messenger.showSnackBar(const SnackBar(content: Text('Không đọc được file')));
      return;
    }

    try {
      final book = xls.Excel.decodeBytes(bytes);
      if (book.tables.isEmpty) {
        messenger.showSnackBar(const SnackBar(content: Text('File excel không có sheet')));
        return;
      }
      final firstSheetName = book.tables.keys.first;
      final table = book.tables[firstSheetName];
      if (table == null || table.rows.isEmpty) {
        messenger.showSnackBar(const SnackBar(content: Text('Sheet rỗng')));
        return;
      }

      final headerRow = table.rows.first;
      final headers = headerRow.map((c) => (c?.value ?? '').toString()).toList();
      final dataRows = table.rows.skip(1).toList();

      final parsed = <Map<String, dynamic>>[];
      for (var i = 0; i < dataRows.length; i++) {
        final row = dataRows[i];
        final m = <String, dynamic>{'id': i};
        for (var c = 0; c < headers.length; c++) {
          final k = headers[c];
          if (k.trim().isEmpty) continue;
          m[k] = (c < row.length ? row[c]?.value : null);
        }

        final gCode = _s(m['G_CODE']);
        final custCd = _s(m['CUST_CD']);
        final code = _codeList.where((e) => _s(e['G_CODE']) == gCode).toList();
        final cust = _customerList.where((e) => _s(e['CUST_CD']) == custCd).toList();

        if (cust.isNotEmpty) {
          m['CUST_NAME_KD'] = _s(cust.first['CUST_NAME_KD']);
          m['CUST_NAME'] = _s(cust.first['CUST_NAME']);
        }
        if (code.isNotEmpty) {
          m['G_NAME'] = _s(code.first['G_NAME']);
          m['G_NAME_KD'] = _s(code.first['G_NAME_KD']);
          m['PROD_MAIN_MATERIAL'] = _s(code.first['PROD_MAIN_MATERIAL']);
        }

        final status = (code.isNotEmpty && cust.isNotEmpty) ? _UploadStatus.ready : _UploadStatus.ng;
        m['CHECKSTATUS'] = status == _UploadStatus.ready ? 'READY' : 'NG';
        m['PRICE_DATE'] = _s(m['PRICE_DATE']).isEmpty ? _ymd(DateTime.now()) : _s(m['PRICE_DATE']);

        parsed.add(m);
      }

      if (!mounted) return;
      setState(() {
        _uploadRows = parsed;
      });

      messenger.showSnackBar(SnackBar(content: Text('Đã load ${parsed.length} dòng')));
    } catch (e) {
      messenger.showSnackBar(SnackBar(content: Text('Lỗi đọc excel: $e')));
    }
  }

  Future<Map<String, dynamic>?> _pickCustomerSheet({String? keyword}) async {
    await _ensureLists();

    if (!mounted) return null;

    final searchCtrl = TextEditingController(text: keyword ?? '');
    Timer? debounce;

    List<Map<String, dynamic>> base = _customerList;
    List<Map<String, dynamic>> view = base.take(200).toList();

    Future<void> refresh(StateSetter setSheetState, String q) async {
      final query = q.trim().toLowerCase();
      view = base
          .where((e) {
            final cd = _s(e['CUST_CD']).toLowerCase();
            final name = _s(e['CUST_NAME_KD']).toLowerCase();
            return cd.contains(query) || name.contains(query);
          })
          .take(200)
          .toList();
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
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      'Hiển thị ${view.length} / ${base.length} (giới hạn 200)',
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
                        final cd = _s(r['CUST_CD']);
                        final name = _s(r['CUST_NAME_KD']);
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

  Future<Map<String, dynamic>?> _pickCodeSheet({String? keyword}) async {
    await _ensureLists();

    if (!mounted) return null;

    final searchCtrl = TextEditingController(text: keyword ?? '');
    Timer? debounce;

    List<Map<String, dynamic>> base = _codeList;
    List<Map<String, dynamic>> view = base.take(200).toList();

    Future<void> refresh(StateSetter setSheetState, String q) async {
      final query = q.trim().toLowerCase();
      view = base
          .where((e) {
            final gCode = _s(e['G_CODE']).toLowerCase();
            final gName = _s(e['G_NAME']).toLowerCase();
            final gNameKd = _s(e['G_NAME_KD']).toLowerCase();
            return gCode.contains(query) || gName.contains(query) || gNameKd.contains(query);
          })
          .take(200)
          .toList();
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
                      labelText: 'Tìm code (G_CODE / G_NAME)',
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
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      'Hiển thị ${view.length} / ${base.length} (giới hạn 200)',
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
                        final gCode = _s(r['G_CODE']);
                        final gNameKd = _s(r['G_NAME_KD']);
                        final gName = _s(r['G_NAME']);
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

  Future<void> _uploadGia() async {
    final messenger = ScaffoldMessenger.of(context);
    if (_uploadRows.isEmpty) {
      messenger.showSnackBar(const SnackBar(content: Text('Chưa có dữ liệu up giá')));
      return;
    }

    final ready = _uploadRows.where((r) => _s(r['CHECKSTATUS']).toUpperCase() == 'READY').toList();
    if (ready.isEmpty) {
      messenger.showSnackBar(const SnackBar(content: Text('Không có dòng READY')));
      return;
    }

    try {
      final api = ref.read(apiClientProvider);
      var ok = 0;
      var failed = 0;
      for (final r in ready) {
        final res = await api.postCommand('upgiasp', data: Map<String, dynamic>.from(r));
        final body = res.data;
        if (body is Map<String, dynamic> && (body['tk_status'] ?? '').toString().toUpperCase() == 'NG') {
          failed++;
        } else {
          ok++;
        }
      }

      if (!mounted) return;
      messenger.showSnackBar(SnackBar(content: Text('Up giá OK: $ok, Fail: $failed')));
    } catch (e) {
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  Future<void> _addUploadRow() async {
    await _ensureLists();

    if (!mounted) return;

    final cust = await _pickCustomerSheet();
    if (cust == null) return;
    final code = await _pickCodeSheet();
    if (code == null) return;

    final moqCtrl = TextEditingController(text: '1');
    final priceCtrl = TextEditingController();
    final bepCtrl = TextEditingController();
    var priceDate = _ymd(DateTime.now());

    Future<void> pickPriceDate(StateSetter setSheetState) async {
      if (!mounted) return;
      DateTime initial = DateTime.now();
      final dt = DateTime.tryParse(priceDate);
      if (dt != null) initial = dt;
      final picked = await showDatePicker(
        context: context,
        initialDate: initial,
        firstDate: DateTime(2020, 1, 1),
        lastDate: DateTime(2100, 12, 31),
      );
      if (picked == null) return;
      priceDate = _ymd(picked);
      setSheetState(() {});
    }

    if (!mounted) return;

    final ok = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setSheetState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 12,
                right: 12,
                bottom: MediaQuery.of(ctx).viewInsets.bottom + 12,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text('Add giá', style: Theme.of(ctx).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
                  const SizedBox(height: 8),
                  Text('Customer: ${_s(cust['CUST_CD'])} - ${_s(cust['CUST_NAME_KD'])}'),
                  Text('Code: ${_s(code['G_CODE'])} - ${_s(code['G_NAME_KD'])}'),
                  const SizedBox(height: 12),
                  TextField(controller: moqCtrl, decoration: const InputDecoration(labelText: 'MOQ'), keyboardType: TextInputType.number),
                  const SizedBox(height: 8),
                  TextField(controller: priceCtrl, decoration: const InputDecoration(labelText: 'Price (PROD_PRICE)'), keyboardType: const TextInputType.numberWithOptions(decimal: true)),
                  const SizedBox(height: 8),
                  TextField(controller: bepCtrl, decoration: const InputDecoration(labelText: 'BEP'), keyboardType: const TextInputType.numberWithOptions(decimal: true)),
                  const SizedBox(height: 8),
                  OutlinedButton(
                    onPressed: () => pickPriceDate(setSheetState),
                    child: Text('PriceDate: ${_fmtDateShort(priceDate)}'),
                  ),
                  const SizedBox(height: 12),
                  FilledButton(
                    onPressed: () => Navigator.of(ctx).pop(true),
                    child: const Text('Add'),
                  ),
                ],
              ),
            );
          },
        );
      },
    );

    if (ok != true) return;

    final row = <String, dynamic>{
      'id': _uploadRows.length + 1,
      'CUST_CD': _s(cust['CUST_CD']),
      'CUST_NAME_KD': _s(cust['CUST_NAME_KD']),
      'G_CODE': _s(code['G_CODE']),
      'G_NAME': _s(code['G_NAME']),
      'G_NAME_KD': _s(code['G_NAME_KD']),
      'PROD_MAIN_MATERIAL': _s(code['PROD_MAIN_MATERIAL']),
      'MOQ': int.tryParse(moqCtrl.text.trim()) ?? 1,
      'PROD_PRICE': num.tryParse(priceCtrl.text.trim()) ?? 0,
      'BEP': num.tryParse(bepCtrl.text.trim()) ?? 0,
      'PRICE_DATE': priceDate,
      'CHECKSTATUS': 'READY',
      'DUPLICATE': 1,
    };

    if (!mounted) return;
    setState(() {
      _uploadRows = [..._uploadRows, row];
    });
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      await _ensureLists();
      await _dongboGiaPoIfNeeded();
      await _loadPrice(_PriceViewMode.ngang);
    });
  }

  @override
  void dispose() {
    _codeKdCtrl.dispose();
    _codeCmsCtrl.dispose();
    _mNameCtrl.dispose();
    _custNameCtrl.dispose();
    super.dispose();
  }

  Widget _buildGrid(ColorScheme scheme) {
    if (_gridColumns.isEmpty) {
      return Center(child: Text('Chưa có dữ liệu', style: TextStyle(color: scheme.onSurfaceVariant)));
    }

    return PlutoGrid(
      columns: _gridColumns,
      rows: _gridRows,
      mode: PlutoGridMode.selectWithOneTap,
      onLoaded: (event) {
        event.stateManager.setShowColumnFilter(true);
      },
      onRowChecked: (event) {
        final rowIdx = event.rowIdx;
        if (rowIdx == null) return;
        setState(() {
          if (event.isChecked == true) {
            _selectedRowIndexes.add(rowIdx);
          } else {
            _selectedRowIndexes.remove(rowIdx);
          }
        });
      },
      configuration: PlutoGridConfiguration(
        style: PlutoGridStyleConfig(
          gridBorderColor: scheme.outlineVariant,
          activatedColor: scheme.primaryContainer,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final selectedCount = _selectedRowIndexes.length;

    final authState = ref.watch(authNotifierProvider);
    final loggedIn = authState is AuthAuthenticated;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Quotation Manager'),
        actions: [
          IconButton(
            onPressed: () => setState(() => _showFilter = !_showFilter),
            icon: Icon(_showFilter ? Icons.filter_alt_off : Icons.filter_alt),
          ),
          PopupMenuButton<String>(
            onSelected: (v) async {
              if (v == 'last') await _loadPrice(_PriceViewMode.lastPrice);
              if (v == 'ngang') await _loadPrice(_PriceViewMode.ngang);
              if (v == 'doc') await _loadPrice(_PriceViewMode.doc);
              if (v == 'approve') await _approveSelected();
              if (v == 'update') await _updateSelected();
              if (v == 'delete') await _deleteSelected();
              if (v == 'upgia') setState(() => _showUpGia = !_showUpGia);
              if (v == 'export') await _exportExcel();
            },
            itemBuilder: (ctx) => [
              const PopupMenuItem(value: 'last', child: Text('Last Price')),
              const PopupMenuItem(value: 'ngang', child: Text('Giá Ngang')),
              const PopupMenuItem(value: 'doc', child: Text('Giá Dọc')),
              const PopupMenuDivider(),
              PopupMenuItem(value: 'approve', enabled: selectedCount >= 1, child: const Text('Approve')),
              PopupMenuItem(value: 'update', enabled: selectedCount >= 1, child: const Text('Update')),
              PopupMenuItem(value: 'delete', enabled: selectedCount >= 1, child: const Text('Delete')),
              const PopupMenuDivider(),
              const PopupMenuItem(value: 'upgia', child: Text('Up Giá (Import/Add)')),
              const PopupMenuItem(value: 'export', child: Text('Xuất Excel')),
            ],
          ),
        ],
      ),
      drawer: const AppDrawer(title: 'ERP'),
      body: !loggedIn
          ? const Center(child: Text('Vui lòng đăng nhập'))
          : RefreshIndicator(
              onRefresh: () => _loadPrice(_mode),
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
                                      _mNameCtrl.clear();
                                      _custNameCtrl.clear();
                                      _allTime = true;
                                      _fromDate = DateTime.now();
                                      _toDate = DateTime.now();
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
                            SwitchListTile(
                              contentPadding: EdgeInsets.zero,
                              title: const Text('All time'),
                              value: _allTime,
                              onChanged: (v) => setState(() => _allTime = v),
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Expanded(child: TextField(controller: _codeKdCtrl, decoration: const InputDecoration(labelText: 'Code KD'), textInputAction: TextInputAction.next)),
                                const SizedBox(width: 12),
                                Expanded(child: TextField(controller: _codeCmsCtrl, decoration: const InputDecoration(labelText: 'Code ERP'), textInputAction: TextInputAction.next)),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Expanded(child: TextField(controller: _mNameCtrl, decoration: const InputDecoration(labelText: 'Tên liệu (M_NAME)'), textInputAction: TextInputAction.next)),
                                const SizedBox(width: 12),
                                Expanded(child: TextField(controller: _custNameCtrl, decoration: const InputDecoration(labelText: 'Tên KH (CUST_NAME_KD)'), textInputAction: TextInputAction.next)),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Row(
                              children: [
                                Expanded(
                                  child: FilledButton(
                                    onPressed: _loading ? null : () => _loadPrice(_PriceViewMode.lastPrice),
                                    child: const Text('Last Price'),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: FilledButton.tonal(
                                    onPressed: _loading ? null : () => _loadPrice(_PriceViewMode.ngang),
                                    child: const Text('Giá Ngang'),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: FilledButton.tonal(
                                    onPressed: _loading ? null : () => _loadPrice(_PriceViewMode.doc),
                                    child: const Text('Giá Dọc'),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 10),
                            Row(
                              children: [
                                Expanded(
                                  child: FilledButton.tonal(
                                    onPressed: (_loading || selectedCount == 0) ? null : _approveSelected,
                                    child: const Text('Approve'),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: FilledButton.tonal(
                                    onPressed: (_loading || selectedCount == 0) ? null : _updateSelected,
                                    child: const Text('Update'),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: FilledButton.tonal(
                                    onPressed: (_loading || selectedCount == 0) ? null : _deleteSelected,
                                    child: const Text('Delete'),
                                  ),
                                ),
                              ],
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
                            'Mode: ${_mode.name}  |  Kết quả: ${_rows.length} dòng',
                            style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
                          ),
                        ),
                        Text('Selected: $selectedCount', style: TextStyle(color: scheme.onSurfaceVariant)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    SizedBox(height: 520, child: _buildGrid(scheme)),
                  ],
                  const SizedBox(height: 12),
                  if (_showUpGia)
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                const Expanded(
                                  child: Text('Up Giá', style: TextStyle(fontWeight: FontWeight.w900)),
                                ),
                                IconButton(
                                  onPressed: () => setState(() => _showUpGia = false),
                                  icon: const Icon(Icons.close),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Expanded(
                                  child: FilledButton.tonal(
                                    onPressed: _pickExcelAndParse,
                                    child: const Text('Import Excel'),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: FilledButton.tonal(
                                    onPressed: _addUploadRow,
                                    child: const Text('Add Row'),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: FilledButton(
                                    onPressed: _uploadGia,
                                    child: const Text('Up Giá'),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text('Rows: ${_uploadRows.length}', style: TextStyle(color: scheme.onSurfaceVariant)),
                            const SizedBox(height: 8),
                            if (_uploadRows.isEmpty)
                              Text('Chưa có dữ liệu upload', style: TextStyle(color: scheme.onSurfaceVariant))
                            else
                              ConstrainedBox(
                                constraints: const BoxConstraints(maxHeight: 360),
                                child: ListView.separated(
                                  itemCount: _uploadRows.length,
                                  separatorBuilder: (_, __) => const Divider(height: 1),
                                  itemBuilder: (ctx, i) {
                                    final r = _uploadRows[i];
                                    final status = _s(r['CHECKSTATUS']);
                                    final statusColor = status.toUpperCase() == 'READY' ? Colors.green : Colors.red;
                                    return ListTile(
                                      dense: true,
                                      title: Text('${_s(r['CUST_CD'])} | ${_s(r['G_CODE'])} | MOQ:${_s(r['MOQ'])} | Price:${_s(r['PROD_PRICE'])}'),
                                      subtitle: Text('${_s(r['CUST_NAME_KD'])} | ${_s(r['G_NAME_KD'])} | ${_s(r['PRICE_DATE'])}'),
                                      trailing: Text(status, style: TextStyle(color: statusColor, fontWeight: FontWeight.w900)),
                                    );
                                  },
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
