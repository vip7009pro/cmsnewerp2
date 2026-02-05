import 'dart:io';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:pluto_grid/pluto_grid.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../../core/config/app_config.dart';
import '../../../../../core/providers.dart';

class DocumentTab extends ConsumerStatefulWidget {
  const DocumentTab({super.key});

  @override
  ConsumerState<DocumentTab> createState() => _DocumentTabState();
}

class _DocumentTabState extends ConsumerState<DocumentTab> {
  bool _loading = false;
  bool _showFilter = true;

  final TextEditingController _docNameCtrl = TextEditingController();

  int _catId = 0;
  int _docCatId = 0;
  int _docId = 0;

  List<Map<String, dynamic>> _cat1 = const [];
  List<Map<String, dynamic>> _cat2 = const [];
  List<Map<String, dynamic>> _docList = const [];

  List<Map<String, dynamic>> _docs = const [];
  List<Map<String, dynamic>> _selected = const [];

  String _s(dynamic v) => (v ?? '').toString();
  num _n(dynamic v) => (v is num) ? v : (num.tryParse(_s(v).replaceAll(',', '')) ?? 0);

  bool _isNg(Map<String, dynamic> body) => (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  String _ymd(DateTime dt) => DateFormat('yyyy-MM-dd').format(dt);

  @override
  void initState() {
    super.initState();
    Future.microtask(_init);
  }

  @override
  void dispose() {
    _docNameCtrl.dispose();
    super.dispose();
  }

  Future<Map<String, dynamic>> _post(String cmd, Map<String, dynamic> data) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(cmd, data: data);
    final body = res.data;
    if (body is Map<String, dynamic>) return body;
    return <String, dynamic>{'tk_status': 'NG', 'message': 'Bad response'};
  }

  Future<void> _init() async {
    setState(() => _loading = true);
    try {
      await _post('autoUpdateDocUSEYN_EXP', {});

      final cat1 = await _post('loadDocCategory1', {});
      final cat2 = await _post('loadDocCategory2', {});
      final docList = await _post('loadDocList', {});

      if (!mounted) return;
      setState(() {
        _cat1 = _mapList(cat1);
        _cat2 = _mapList(cat2);
        _docList = _mapList(docList);
      });

      await _search();
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  List<Map<String, dynamic>> _mapList(Map<String, dynamic> body) {
    if (_isNg(body)) return const [];
    final raw = body['data'];
    final list = raw is List ? raw : const [];
    return list.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();
  }

  Future<void> _search() async {
    setState(() {
      _loading = true;
      _selected = const [];
    });
    try {
      final payload = {
        'DOC_NAME': _docNameCtrl.text.trim(),
        'DOC_ID': _docId,
        'CAT_ID': _catId,
        'DOC_CAT_ID': _docCatId,
      };

      final body = await _post('loadDocuments', payload);
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() => _docs = const []);
        return;
      }

      final raw = body['data'];
      final list = raw is List ? raw : const [];
      final rows = list.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();

      for (var i = 0; i < rows.length; i++) {
        rows[i]['id'] = i;
        rows[i]['REG_DATE'] = _fmtYmd(rows[i]['REG_DATE']);
        rows[i]['EXP_DATE'] = _fmtYmd(rows[i]['EXP_DATE']);
        rows[i]['INS_DATE'] = _fmtYmd(rows[i]['INS_DATE']);
        rows[i]['UPD_DATE'] = _fmtYmd(rows[i]['UPD_DATE']);
        rows[i]['REMAIN_DAYS'] = _remainDays(rows[i]);
      }

      if (!mounted) return;
      setState(() => _docs = rows);
    } catch (e) {
      _snack('Lỗi: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  String _fmtYmd(dynamic v) {
    final s = _s(v).trim();
    if (s.isEmpty) return '';
    final dt = DateTime.tryParse(s.replaceFirst(' ', 'T')) ?? DateTime.tryParse(s);
    if (dt == null) return s;
    return DateFormat('yyyy-MM-dd').format(dt.toUtc());
  }

  String _remainDays(Map<String, dynamic> row) {
    final hsd = _s(row['HSD_YN']).toUpperCase();
    if (hsd == 'N') return '';
    final exp = DateTime.tryParse(_s(row['EXP_DATE']));
    if (exp == null) return '';
    final diff = exp.difference(DateTime.now()).inDays;
    return diff > 0 ? diff.toString() : '';
  }

  Uri _downloadUrl(Map<String, dynamic> row) {
    final protocol = AppConfig.baseUrl.startsWith('https') ? 'https' : 'http';
    final host = AppConfig.baseUrl.replaceFirst(RegExp(r'^https?://'), '');
    final fileId = _n(row['FILE_ID']).toInt();
    final docId = _n(row['DOC_ID']).toInt();
    final docCatId = _n(row['DOC_CAT_ID']).toInt();
    final catId = _n(row['CAT_ID']).toInt();
    final fmt = _s(row['FORMAT_X']);
    return Uri.parse('$protocol://$host/alldocs/$fileId' '_$docId' '_$docCatId' '_$catId$fmt');
  }

  Future<int> _checkLastFileId() async {
    final body = await _post('checkLastFileID', {});
    if (_isNg(body)) return 1;
    final raw = body['data'];
    final list = raw is List ? raw : const [];
    if (list.isEmpty) return 1;
    return _n((list.first as Map)['FILE_ID']).toInt();
  }

  Future<void> _uploadDoc() async {
    if (_catId == 0) {
      _snack('Chọn phân loại tài liệu');
      return;
    }
    if (_docCatId == 0) {
      _snack('Chọn loại tài liệu');
      return;
    }
    if (_docNameCtrl.text.trim().isEmpty) {
      _snack('Nhập tên tài liệu');
      return;
    }

    final res = await FilePicker.platform.pickFiles(allowMultiple: false, withData: false);
    if (res == null || res.files.isEmpty) return;
    final f = res.files.first;
    final p = f.path;
    if (p == null || p.isEmpty) return;

    final ext = f.extension;
    if (ext == null || ext.isEmpty) {
      _snack('File không có extension');
      return;
    }

    setState(() => _loading = true);
    try {
      final lastId = await _checkLastFileId();
      final fileId = lastId + 1;

      final filename = '$fileId' '_$_docId' '_$_docCatId' '_$_catId.$ext';

      final api = ref.read(apiClientProvider);
      await api.uploadFile(file: File(p), filename: filename, uploadFolderName: 'alldocs');

      final body = await _post('insertFileData', {
        'FILE_ID': fileId,
        'DOC_ID': _docId,
        'DOC_CAT_ID': _docCatId,
        'CAT_ID': _catId,
        'REG_DATE': _ymd(DateTime.now()),
        'EXP_DATE': _ymd(DateTime.now().add(const Duration(days: 365 * 2))),
        'FORMAT_X': '.$ext',
      });
      if (_isNg(body)) throw Exception(_s(body['message']));

      _snack('Upload thành công');
      await _search();
    } catch (e) {
      _snack('Upload lỗi: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _updateDocs() async {
    if (_selected.isEmpty) {
      _snack('Chưa chọn dòng');
      return;
    }

    setState(() => _loading = true);
    try {
      for (final r in _selected) {
        await _post('updateMaterialDocData', {
          'FILE_ID': _n(r['FILE_ID']).toInt(),
          'REG_DATE': _s(r['REG_DATE']),
          'EXP_DATE': _s(r['EXP_DATE']),
          'EXP_YN': _s(r['HSD_YN']).toUpperCase(),
          'USE_YN': _s(r['USE_YN']).toUpperCase(),
        });
      }
      _snack('Cập nhật thành công');
    } catch (e) {
      _snack('Lỗi: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  @override
  Widget build(BuildContext context) {
    final docNameItems = _docList
        .where((e) => _n(e['CAT_ID']).toInt() == _catId && _n(e['DOC_CAT_ID']).toInt() == _docCatId)
        .toList();

    final cols = <PlutoColumn>[
      PlutoColumn(
        title: '✓',
        field: '__check__',
        type: PlutoColumnType.text(),
        width: 44,
        enableRowChecked: true,
        enableSorting: false,
        enableFilterMenuItem: false,
        enableColumnDrag: false,
      ),
      _col('FILE_ID', 90),
      _col('CAT_NAME', 120),
      _col('DOC_CAT_NAME', 150),
      _col('DOC_NAME', 220),
      _col('FORMAT_X', 90),
      _downloadCol(),
      _col('REG_DATE', 120, editable: true),
      _col('EXP_DATE', 120, editable: true),
      _col('REMAIN_DAYS', 120),
      _col('DOC_ID', 90),
      _col('CAT_ID', 90),
      _col('DOC_CAT_ID', 110),
      _col('HSD_YN', 90, editable: true),
      _col('USE_YN', 90, editable: true),
      _col('INS_DATE', 120),
      _col('INS_EMPL', 100),
      _col('UPD_DATE', 120),
      _col('UPD_EMPL', 100),
    ];

    final plutoRows = _docs
        .map(
          (r) => PlutoRow(
            cells: {
              '__check__': PlutoCell(value: ''),
              for (final c in cols)
                if (c.field != '__check__') c.field: PlutoCell(value: r[c.field]),
            },
          ),
        )
        .toList(growable: false);

    return Column(
      children: [
        Card(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
            child: Wrap(
              spacing: 8,
              runSpacing: 8,
              crossAxisAlignment: WrapCrossAlignment.center,
              children: [
                IconButton(
                  tooltip: _showFilter ? 'Ẩn filter' : 'Hiện filter',
                  onPressed: _loading ? null : () => setState(() => _showFilter = !_showFilter),
                  icon: Icon(_showFilter ? Icons.filter_alt_off : Icons.filter_alt),
                ),
                FilledButton.icon(
                  onPressed: _loading ? null : _search,
                  icon: const Icon(Icons.search),
                  label: const Text('Search'),
                ),
                FilledButton.icon(
                  onPressed: _loading ? null : _uploadDoc,
                  icon: const Icon(Icons.upload),
                  label: const Text('Upload Doc'),
                ),
                FilledButton.icon(
                  onPressed: _loading ? null : _updateDocs,
                  icon: const Icon(Icons.save),
                  label: const Text('Update Doc'),
                ),
              ],
            ),
          ),
        ),
        if (_showFilter)
          Card(
            child: SizedBox(
              width: double.infinity,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                child: Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                    SizedBox(width: 260, child: TextField(controller: _docNameCtrl, decoration: const InputDecoration(labelText: 'Document Name'))),
                    ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 260, minWidth: 200),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<int>(
                          isExpanded: true,
                          value: _catId,
                          dropdownColor: Theme.of(context).colorScheme.surface,
                          iconEnabledColor: Theme.of(context).colorScheme.onSurface,
                          style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w700),
                          onChanged: _loading
                              ? null
                              : (v) {
                                  setState(() {
                                    _catId = v ?? 0;
                                    _docId = 0;
                                  });
                                },
                          items: [
                            const DropdownMenuItem(value: 0, child: Text('Select Category')),
                            ..._cat1.map((e) => DropdownMenuItem(value: _n(e['CAT_ID']).toInt(), child: Text(_s(e['CAT_NAME']), overflow: TextOverflow.ellipsis))),
                          ],
                        ),
                      ),
                    ),
                    ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 300, minWidth: 240),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<int>(
                          isExpanded: true,
                          value: _docCatId,
                          dropdownColor: Theme.of(context).colorScheme.surface,
                          iconEnabledColor: Theme.of(context).colorScheme.onSurface,
                          style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w700),
                          onChanged: _loading
                              ? null
                              : (v) {
                                  setState(() {
                                    _docCatId = v ?? 0;
                                    _docId = 0;
                                  });
                                },
                          items: [
                            const DropdownMenuItem(value: 0, child: Text('Select Document Type')),
                            ..._cat2.map((e) => DropdownMenuItem(value: _n(e['DOC_CAT_ID']).toInt(), child: Text(_s(e['DOC_CAT_NAME']), overflow: TextOverflow.ellipsis))),
                          ],
                        ),
                      ),
                    ),
                    ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 360, minWidth: 260),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<int>(
                          isExpanded: true,
                          value: _docId,
                          dropdownColor: Theme.of(context).colorScheme.surface,
                          iconEnabledColor: Theme.of(context).colorScheme.onSurface,
                          style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w700),
                          onChanged: _loading ? null : (v) => setState(() => _docId = v ?? 0),
                          items: [
                            const DropdownMenuItem(value: 0, child: Text('Select Document Name')),
                            ...docNameItems.map((e) => DropdownMenuItem(value: _n(e['DOC_ID']).toInt(), child: Text(_s(e['DOC_NAME']), overflow: TextOverflow.ellipsis))),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        if (_loading) const LinearProgressIndicator(),
        Expanded(
          child: Card(
            child: _docs.isEmpty
                ? const Center(child: Text('Chưa có dữ liệu'))
                : LayoutBuilder(
                    builder: (ctx, constraints) {
                      return ClipRect(
                        child: SizedBox(
                          width: constraints.maxWidth,
                          child: PlutoGrid(
                            columns: cols,
                            rows: plutoRows,
                            onLoaded: (e) => e.stateManager.setShowColumnFilter(true),
                            onRowChecked: (e) {
                              final r = e.row;
                              if (r == null) return;
                              final fileId = _n(r.cells['FILE_ID']?.value).toInt();
                              if (fileId <= 0) return;
                              setState(() {
                                if (e.isChecked == true) {
                                  final idx = _docs.indexWhere((x) => _n(x['FILE_ID']).toInt() == fileId);
                                  if (idx >= 0) {
                                    final row = _docs[idx];
                                    final exists = _selected.any((s) => _n(s['FILE_ID']).toInt() == fileId);
                                    if (!exists) _selected = [..._selected, row];
                                  }
                                } else {
                                  _selected = _selected.where((s) => _n(s['FILE_ID']).toInt() != fileId).toList(growable: false);
                                }
                              });
                            },
                            onRowDoubleTap: (e) async {
                              final r = e.row;
                              final data = {
                                for (final c in r.cells.entries) c.key: c.value.value,
                              };
                              await launchUrl(_downloadUrl(data), mode: LaunchMode.externalApplication);
                            },
                            onChanged: (e) {
                              final id = _n(e.row.cells['FILE_ID']?.value).toInt();
                              final idx = _docs.indexWhere((x) => _n(x['FILE_ID']).toInt() == id);
                              if (idx < 0) return;
                              setState(() {
                                _docs[idx][e.column.field] = e.value;
                                _docs[idx]['REMAIN_DAYS'] = _remainDays(_docs[idx]);
                              });
                            },
                            configuration: const PlutoGridConfiguration(
                              style: PlutoGridStyleConfig(
                                rowHeight: 34,
                                columnHeight: 34,
                                cellTextStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
                                columnTextStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w900),
                                defaultCellPadding: EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ),
      ],
    );
  }

  PlutoColumn _col(String field, double width, {bool editable = false}) {
    return PlutoColumn(
      title: field,
      field: field,
      width: width,
      type: PlutoColumnType.text(),
      enableColumnDrag: false,
      enableEditingMode: editable,
    );
  }

  PlutoColumn _downloadCol() {
    return PlutoColumn(
      title: 'DOWNLOAD',
      field: 'DOWNLOAD',
      width: 130,
      type: PlutoColumnType.text(),
      enableColumnDrag: false,
      renderer: (ctx) {
        final row = {
          for (final c in ctx.row.cells.entries) c.key: c.value.value,
        };
        return OutlinedButton(
          onPressed: () => launchUrl(_downloadUrl(row), mode: LaunchMode.externalApplication),
          child: const Text('Download'),
        );
      },
    );
  }
}
