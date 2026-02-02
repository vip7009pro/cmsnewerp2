import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:pluto_grid/pluto_grid.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../app/app_drawer.dart';
import '../../../core/config/app_config.dart';
import '../../../core/providers.dart';

class QuanLyVatLieuPage extends ConsumerStatefulWidget {
  const QuanLyVatLieuPage({super.key});

  @override
  ConsumerState<QuanLyVatLieuPage> createState() => _QuanLyVatLieuPageState();
}

class _QuanLyVatLieuPageState extends ConsumerState<QuanLyVatLieuPage> {
  final _mNameCtrl = TextEditingController();

  bool _loading = false;
  bool _showFilter = true;
  bool _gridView = true;

  List<Map<String, dynamic>> _rows = const [];
  List<PlutoColumn> _gridColumns = const [];
  List<PlutoRow> _gridRows = const [];

  List<Map<String, dynamic>> _vendorList = const [];
  List<Map<String, dynamic>> _fscList = const [];

  Map<String, dynamic> _editing = <String, dynamic>{
    'M_ID': 0,
    'M_NAME': '',
    'DESCR': '',
    'CUST_CD': '0049',
    'SSPRICE': 0,
    'CMSPRICE': 0,
    'SLITTING_PRICE': 0,
    'MASTER_WIDTH': 0,
    'ROLL_LENGTH': 0,
    'USE_YN': 'Y',
    'EXP_DATE': '-',
    'FSC': 'N',
    'FSC_CODE': '01',
    'FSC_NAME': 'NO_FSC',
    'TDS_VER': 0,
    'SGS_VER': 0,
    'MSDS_VER': 0,
  };

  String _s(dynamic v) => (v ?? '').toString();
  double _d(dynamic v) {
    final raw = (v ?? '').toString().trim();
    if (raw.isEmpty) return 0.0;
    final normalized = raw.replaceAll(',', '').replaceAll(RegExp(r'[^0-9\.-]'), '');
    if (normalized.isEmpty) return 0.0;
    return double.tryParse(normalized) ?? 0.0;
  }

  int _i(dynamic v) => _d(v).round();

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
  void dispose() {
    _mNameCtrl.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadVendors();
      _loadFscList();
      _load();
    });
  }

  Future<void> _loadVendors() async {
    try {
      final body = await _post('selectVendorList', {});
      if (_isNg(body)) return;
      final data = body['data'];
      final list = (data is List ? data : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList();
      if (!mounted) return;
      setState(() => _vendorList = list);
    } catch (_) {}
  }

  Future<void> _loadFscList() async {
    try {
      final body = await _post('getFSCList', {});
      if (_isNg(body)) return;
      final data = body['data'];
      final list = (data is List ? data : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList();
      if (!mounted) return;
      setState(() => _fscList = list);
    } catch (_) {}
  }

  List<String> _prioritizedFields(List<Map<String, dynamic>> rows) {
    final keys = <String>{};
    for (final r in rows) {
      keys.addAll(r.keys);
    }

    final preferred = <String>[
      'M_ID',
      'M_NAME',
      'DESCR',
      'CUST_CD',
      'CUST_NAME_KD',
      'SSPRICE',
      'CMSPRICE',
      'SLITTING_PRICE',
      'MASTER_WIDTH',
      'ROLL_LENGTH',
      'FSC',
      'FSC_CODE',
      'FSC_NAME',
      'USE_YN',
      'EXP_DATE',
      'TDS_VER',
      'SGS_VER',
      'MSDS_VER',
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
      final isMoney = field == 'SSPRICE' || field == 'CMSPRICE' || field == 'SLITTING_PRICE';
      final isQty = field == 'MASTER_WIDTH' || field == 'ROLL_LENGTH';

      return PlutoColumn(
        title: field,
        field: field,
        type: PlutoColumnType.text(),
        width: isRaw ? 0 : (field == 'M_NAME' ? 170 : 120),
        hide: isRaw,
        enableContextMenu: false,
        enableDropToResize: true,
        renderer: (ctx) {
          if (field == '__raw__') return const SizedBox.shrink();
          final v = ctx.cell.value;
          if (isMoney) {
            final numVal = _d(v);
            return Text(
              NumberFormat.currency(locale: 'en_US', symbol: r'$', decimalDigits: 2).format(numVal),
              style: const TextStyle(color: Colors.green, fontWeight: FontWeight.w700),
            );
          }
          if (isQty) {
            return Text(NumberFormat.decimalPattern().format(_d(v)));
          }
          if (field == 'USE_YN') {
            final s = _s(v).toUpperCase();
            return Text(s, style: TextStyle(color: s == 'Y' ? Colors.green : Colors.red, fontWeight: FontWeight.w800));
          }
          if (field == 'M_NAME') {
            return Text(_s(v), style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.w800));
          }
          if (field == 'TDS_VER' || field == 'SGS_VER' || field == 'MSDS_VER') {
            final ver = _i(v);
            return Text(ver > 0 ? 'Ver.$ver' : '-');
          }
          return Text(_s(v));
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
      ),
      ...fields.where((f) => f != '__raw__').map(col),
      PlutoColumn(
        title: 'DOCS',
        field: '__docs__',
        type: PlutoColumnType.text(),
        width: 90,
        enableContextMenu: false,
        enableDropToResize: true,
        renderer: (ctx) {
          return Center(
            child: FilledButton.tonal(
              onPressed: () {
                final raw = ctx.row.cells['__raw__']?.value;
                if (raw is Map<String, dynamic>) {
                  _openDocs(raw);
                }
              },
              child: const Text('Docs'),
            ),
          );
        },
      ),
    ];
  }

  List<PlutoRow> _buildPlutoRows(List<Map<String, dynamic>> rows, List<PlutoColumn> columns) {
    Object? val(Map<String, dynamic> it, String field) {
      if (field == '__raw__') return it;
      if (field == '__docs__') return '';
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

  Future<void> _load() async {
    if (!mounted) return;
    setState(() {
      _loading = true;
      _showFilter = false;
    });

    try {
      final body = await _post('get_material_table', {
        'M_NAME': _mNameCtrl.text.trim(),
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

  Future<void> _openDocs(Map<String, dynamic> row) async {
    final mId = _i(row['M_ID']);
    final name = _s(row['M_NAME']);
    final tds = _i(row['TDS_VER']);
    final sgs = _i(row['SGS_VER']);
    final msds = _i(row['MSDS_VER']);

    if (!mounted) return;

    await showDialog<void>(
      context: context,
      builder: (ctx) {
        Widget link(String label, String url, bool enabled) {
          return ListTile(
            title: Text(label),
            subtitle: Text(url),
            trailing: Icon(enabled ? Icons.open_in_new : Icons.block),
            enabled: enabled,
            onTap: !enabled
                ? null
                : () async {
                    final u = Uri.parse(url);
                    await launchUrl(u, mode: LaunchMode.externalApplication);
                  },
          );
        }

        final base = AppConfig.imageBaseUrl;
        final tdsUrl = '$base/materialdocs/${mId}_TDS_$tds.pdf';
        final sgsUrl = '$base/materialdocs/${mId}_SGS_$sgs.pdf';
        final msdsUrl = '$base/materialdocs/${mId}_MSDS_$msds.pdf';

        return AlertDialog(
          title: Text('Material Docs: $name'),
          content: SizedBox(
            width: 520,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                link('TDS', tdsUrl, tds > 0),
                link('SGS', sgsUrl, sgs > 0),
                link('MSDS', msdsUrl, msds > 0),
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Đóng')),
          ],
        );
      },
    );
  }

  void _resetEditing() {
    setState(() {
      _editing = <String, dynamic>{
        'M_ID': 0,
        'M_NAME': '',
        'DESCR': '',
        'CUST_CD': '0049',
        'SSPRICE': 0,
        'CMSPRICE': 0,
        'SLITTING_PRICE': 0,
        'MASTER_WIDTH': 0,
        'ROLL_LENGTH': 0,
        'USE_YN': 'Y',
        'EXP_DATE': '-',
        'FSC': 'N',
        'FSC_CODE': '01',
        'FSC_NAME': 'NO_FSC',
        'TDS_VER': 0,
        'SGS_VER': 0,
        'MSDS_VER': 0,
      };
    });
  }

  Future<void> _openAddUpdateDialog() async {
    if (!mounted) return;

    List<Map<String, dynamic>> dedupeByKey(List<Map<String, dynamic>> src, String key) {
      final seen = <String>{};
      final out = <Map<String, dynamic>>[];
      for (final e in src) {
        final v = _s(e[key]);
        if (v.isEmpty) continue;
        if (seen.add(v)) out.add(e);
      }
      return out;
    }

    final vendorList = dedupeByKey(_vendorList, 'CUST_CD');
    final fscList = dedupeByKey(_fscList, 'FSC_CODE');

    bool hasValue(List<Map<String, dynamic>> list, String key, String v) {
      if (v.isEmpty) return false;
      return list.any((e) => _s(e[key]) == v);
    }

    var fscYn = _s(_editing['FSC']).toUpperCase();
    if (fscYn != 'Y' && fscYn != 'N') fscYn = 'N';
    var fscCode = _s(_editing['FSC_CODE']);
    var custCd = _s(_editing['CUST_CD']).isEmpty ? '0049' : _s(_editing['CUST_CD']);

    if (!hasValue(vendorList, 'CUST_CD', custCd)) {
      custCd = vendorList.isNotEmpty ? _s(vendorList.first['CUST_CD']) : '';
    }

    if (fscYn == 'N') {
      fscCode = '01';
    }

    if (fscYn == 'Y' && !hasValue(fscList, 'FSC_CODE', fscCode)) {
      fscCode = fscList.isNotEmpty ? _s(fscList.first['FSC_CODE']) : '01';
    }

    final edited = await showDialog<Map<String, dynamic>>(
      context: context,
      builder: (ctx) => _MaterialEditDialog(
        initial: Map<String, dynamic>.from(_editing),
        vendorList: vendorList,
        fscList: fscList,
        initialCustCd: custCd,
        initialFscYn: fscYn,
        initialFscCode: fscCode,
      ),
    );

    if (edited == null) return;
    if (!mounted) return;
    setState(() => _editing = Map<String, dynamic>.from(edited));
    await _confirmAndRun();
  }

  Future<void> _confirmAndRun() async {
    final isNew = _i(_editing['M_ID']) <= 0;
    if (isNew) {
      await _addMaterial();
    } else {
      await _updateMaterial();
    }
  }

  Future<void> _addMaterial() async {
    final mName = _s(_editing['M_NAME']).trim();
    if (mName.isEmpty) {
      _snack('M_NAME không được trống');
      return;
    }

    setState(() => _loading = true);
    try {
      final chk = await _post('checkMaterialExist', {'M_NAME': mName});
      final exists = !_isNg(chk);
      if (exists) {
        setState(() => _loading = false);
        _snack('Vật liệu đã tồn tại');
        return;
      }

      final res = await _post('addMaterial', _editing);
      setState(() => _loading = false);
      if (_isNg(res)) {
        _snack('Add thất bại: ${(res['message'] ?? 'NG').toString()}');
        return;
      }

      _snack('Thêm vật liệu thành công');
      await _load();
    } catch (e) {
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Future<void> _updateMaterial() async {
    final mId = _i(_editing['M_ID']);
    if (mId <= 0) {
      _snack('Chưa chọn vật liệu để update');
      return;
    }

    setState(() => _loading = true);
    try {
      final res = await _post('updateMaterial', _editing);
      if (!_isNg(res)) {
        await _post('updateM090FSC', _editing);
      }
      setState(() => _loading = false);

      if (_isNg(res)) {
        _snack('Update thất bại: ${(res['message'] ?? 'NG').toString()}');
        return;
      }

      _snack('Update vật liệu thành công');
      await _load();
    } catch (e) {
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Quản lý vật liệu'),
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
            onPressed: _loading ? null : _load,
            icon: const Icon(Icons.refresh),
            tooltip: 'Reload',
          ),
          IconButton(
            onPressed: () {
              _resetEditing();
              _openAddUpdateDialog();
            },
            icon: const Icon(Icons.add),
            tooltip: 'Add',
          ),
          IconButton(
            onPressed: () {
              if (_rows.isEmpty) {
                _snack('Chưa có dữ liệu');
                return;
              }
              _openAddUpdateDialog();
            },
            icon: const Icon(Icons.edit),
            tooltip: 'Update',
          ),
        ],
      ),
      drawer: const AppDrawer(title: 'ERP'),
      body: RefreshIndicator(
        onRefresh: _load,
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
                                  _mNameCtrl.clear();
                                });
                              },
                              child: const Text('Clear'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        TextField(
                          controller: _mNameCtrl,
                          decoration: const InputDecoration(labelText: 'M_NAME'),
                          textInputAction: TextInputAction.search,
                          onSubmitted: (_) => _load(),
                        ),
                        const SizedBox(height: 12),
                        SizedBox(
                          width: double.infinity,
                          child: FilledButton.icon(
                            onPressed: _loading ? null : _load,
                            icon: const Icon(Icons.search),
                            label: const Text('Load data'),
                          ),
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
                        ? Center(child: Text('Chưa có dữ liệu', style: TextStyle(color: scheme.onSurfaceVariant)))
                        : (_gridView
                            ? PlutoGrid(
                                columns: _gridColumns,
                                rows: _gridRows,
                                onLoaded: (e) {
                                  e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                                  e.stateManager.setShowColumnFilter(true);
                                },
                                onSelected: (e) {
                                  final row = e.row;
                                  if (row == null) return;
                                  final raw = row.cells['__raw__']?.value;
                                  if (raw is Map<String, dynamic>) {
                                    setState(() => _editing = Map<String, dynamic>.from(raw));
                                  }
                                },
                                onRowDoubleTap: (e) {
                                  final raw = e.row.cells['__raw__']?.value;
                                  if (raw is Map<String, dynamic>) {
                                    setState(() => _editing = Map<String, dynamic>.from(raw));
                                    _openAddUpdateDialog();
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
                                itemCount: _rows.length,
                                itemBuilder: (ctx, i) {
                                  final r = _rows[i];
                                  final title = _s(r['M_NAME']);
                                  final vendor = _s(r['CUST_NAME_KD']).isEmpty ? _s(r['CUST_CD']) : '${_s(r['CUST_NAME_KD'])} (${_s(r['CUST_CD'])})';
                                  final useYn = _s(r['USE_YN']).toUpperCase();
                                  return Card(
                                    child: ListTile(
                                      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w800)),
                                      subtitle: Text(vendor),
                                      trailing: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Text(useYn, style: TextStyle(color: useYn == 'Y' ? Colors.green : scheme.error, fontWeight: FontWeight.w900)),
                                          const SizedBox(width: 8),
                                          IconButton(
                                            tooltip: 'Docs',
                                            onPressed: () => _openDocs(r),
                                            icon: const Icon(Icons.description_outlined),
                                          ),
                                        ],
                                      ),
                                      onTap: () {
                                        setState(() => _editing = Map<String, dynamic>.from(r));
                                      },
                                      onLongPress: () {
                                        setState(() => _editing = Map<String, dynamic>.from(r));
                                        _openAddUpdateDialog();
                                      },
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

class _MaterialEditDialog extends StatefulWidget {
  const _MaterialEditDialog({
    required this.initial,
    required this.vendorList,
    required this.fscList,
    required this.initialCustCd,
    required this.initialFscYn,
    required this.initialFscCode,
  });

  final Map<String, dynamic> initial;
  final List<Map<String, dynamic>> vendorList;
  final List<Map<String, dynamic>> fscList;
  final String initialCustCd;
  final String initialFscYn;
  final String initialFscCode;

  @override
  State<_MaterialEditDialog> createState() => _MaterialEditDialogState();
}

class _MaterialEditDialogState extends State<_MaterialEditDialog> {
  late final TextEditingController _nameCtrl;
  late final TextEditingController _descrCtrl;
  late final TextEditingController _ssCtrl;
  late final TextEditingController _cmsCtrl;
  late final TextEditingController _slittingCtrl;
  late final TextEditingController _mwCtrl;
  late final TextEditingController _rlCtrl;
  late final TextEditingController _expCtrl;

  late bool _useYn;
  late String _custCd;
  late String _fscYn;
  late String _fscCode;

  String _s(dynamic v) => (v ?? '').toString();

  double _d(dynamic v) {
    final raw = (v ?? '').toString().trim();
    if (raw.isEmpty) return 0.0;
    final normalized = raw.replaceAll(',', '').replaceAll(RegExp(r'[^0-9\.-]'), '');
    if (normalized.isEmpty) return 0.0;
    return double.tryParse(normalized) ?? 0.0;
  }

  @override
  void initState() {
    super.initState();

    _nameCtrl = TextEditingController(text: _s(widget.initial['M_NAME']));
    _descrCtrl = TextEditingController(text: _s(widget.initial['DESCR']));
    _ssCtrl = TextEditingController(text: _s(widget.initial['SSPRICE']));
    _cmsCtrl = TextEditingController(text: _s(widget.initial['CMSPRICE']));
    _slittingCtrl = TextEditingController(text: _s(widget.initial['SLITTING_PRICE']));
    _mwCtrl = TextEditingController(text: _s(widget.initial['MASTER_WIDTH']));
    _rlCtrl = TextEditingController(text: _s(widget.initial['ROLL_LENGTH']));
    _expCtrl = TextEditingController(text: _s(widget.initial['EXP_DATE']));

    _useYn = _s(widget.initial['USE_YN']).toUpperCase() == 'Y';
    _custCd = widget.initialCustCd;
    _fscYn = widget.initialFscYn;
    _fscCode = widget.initialFscCode;
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _descrCtrl.dispose();
    _ssCtrl.dispose();
    _cmsCtrl.dispose();
    _slittingCtrl.dispose();
    _mwCtrl.dispose();
    _rlCtrl.dispose();
    _expCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final fillColor = scheme.surfaceContainerHighest;

    DropdownMenuItem<String> vItem(Map<String, dynamic> v) {
      final cd = _s(v['CUST_CD']);
      final name = _s(v['CUST_NAME_KD']).isEmpty ? _s(v['CUST_NAME']) : _s(v['CUST_NAME_KD']);
      return DropdownMenuItem(
        value: cd,
        child: Text(
          '$name ($cd)',
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
      );
    }

    DropdownMenuItem<String> fItem(Map<String, dynamic> f) {
      final cd = _s(f['FSC_CODE']);
      final name = _s(f['FSC_NAME']);
      return DropdownMenuItem(
        value: cd,
        child: Text(
          '$name ($cd)',
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
      );
    }

    InputDecoration dec(String label) => InputDecoration(labelText: label, filled: true, fillColor: fillColor);

    return AlertDialog(
      title: Text('Add/Update Material (M_ID: ${_s(widget.initial['M_ID'])})'),
      content: SizedBox(
        width: 520,
        child: SingleChildScrollView(
          child: Column(
            children: [
              TextField(controller: _nameCtrl, decoration: dec('M_NAME')),
              const SizedBox(height: 8),
              DropdownButtonFormField<String>(
                key: ValueKey<String>('vendor_$_custCd'),
                initialValue: _custCd.isEmpty ? null : _custCd,
                items: widget.vendorList.map(vItem).toList(),
                onChanged: (v) => setState(() => _custCd = v ?? ''),
                decoration: dec('Vendor (CUST_CD)'),
                isExpanded: true,
              ),
              const SizedBox(height: 8),
              TextField(controller: _descrCtrl, decoration: dec('DESCR')),
              const SizedBox(height: 8),
              TextField(controller: _ssCtrl, decoration: dec('OPEN_PRICE (SSPRICE)'), keyboardType: TextInputType.number),
              const SizedBox(height: 8),
              TextField(controller: _cmsCtrl, decoration: dec('ORIGIN_PRICE (CMSPRICE)'), keyboardType: TextInputType.number),
              const SizedBox(height: 8),
              TextField(controller: _slittingCtrl, decoration: dec('SLITTING_PRICE'), keyboardType: TextInputType.number),
              const SizedBox(height: 8),
              TextField(controller: _mwCtrl, decoration: dec('MASTER_WIDTH'), keyboardType: TextInputType.number),
              const SizedBox(height: 8),
              TextField(controller: _rlCtrl, decoration: dec('ROLL_LENGTH'), keyboardType: TextInputType.number),
              const SizedBox(height: 8),
              TextField(controller: _expCtrl, decoration: dec('EXP_DATE (HSD)')),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      initialValue: _fscYn,
                      items: const [
                        DropdownMenuItem(value: 'Y', child: Text('FSC: Y')),
                        DropdownMenuItem(value: 'N', child: Text('FSC: N')),
                      ],
                      onChanged: (v) {
                        setState(() {
                          _fscYn = (v ?? 'N');
                          if (_fscYn == 'N') _fscCode = '01';
                        });
                      },
                      decoration: dec('FSC'),
                      isExpanded: true,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      key: ValueKey<String>('fsc_code_${_fscYn}_$_fscCode'),
                      initialValue: (_fscYn == 'N' || _fscCode.isEmpty) ? null : _fscCode,
                      items: widget.fscList.map(fItem).toList(),
                      onChanged: _fscYn == 'N' ? null : (v) => setState(() => _fscCode = v ?? '01'),
                      decoration: dec('FSC_CODE'),
                      isExpanded: true,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              SwitchListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text('USE_YN'),
                value: _useYn,
                onChanged: (v) => setState(() => _useYn = v),
              ),
            ],
          ),
        ),
      ),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context, null), child: const Text('Hủy')),
        FilledButton(
          onPressed: () {
            final next = <String, dynamic>{
              ...widget.initial,
              'M_NAME': _nameCtrl.text.trim(),
              'DESCR': _descrCtrl.text.trim(),
              'CUST_CD': _custCd,
              'SSPRICE': _d(_ssCtrl.text),
              'CMSPRICE': _d(_cmsCtrl.text),
              'SLITTING_PRICE': _d(_slittingCtrl.text),
              'MASTER_WIDTH': _d(_mwCtrl.text),
              'ROLL_LENGTH': _d(_rlCtrl.text),
              'EXP_DATE': _expCtrl.text.trim().isEmpty ? '-' : _expCtrl.text.trim(),
              'USE_YN': _useYn ? 'Y' : 'N',
              'FSC': _fscYn,
              'FSC_CODE': _fscCode.isEmpty ? '01' : _fscCode,
            };
            Navigator.pop(context, next);
          },
          child: const Text('Lưu'),
        ),
      ],
    );
  }
}
