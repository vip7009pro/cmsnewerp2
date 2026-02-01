import 'dart:io';

import 'package:awesome_dialog/awesome_dialog.dart';
import 'package:excel/excel.dart' as xls;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:path_provider/path_provider.dart';
import 'package:pluto_grid/pluto_grid.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../app/app_drawer.dart';
import '../../../core/config/app_config.dart';
import '../../../core/providers.dart';

class ThongTinSanPhamPage extends ConsumerStatefulWidget {
  const ThongTinSanPhamPage({super.key});

  @override
  ConsumerState<ThongTinSanPhamPage> createState() =>
      _ThongTinSanPhamPageState();
}

class _ThongTinSanPhamPageState extends ConsumerState<ThongTinSanPhamPage> {
  final _codeCtrl = TextEditingController();
  bool _cndb = false;
  bool _activeOnly = true;
  bool _showFilter = true;
  bool _gridView = true;

  bool _loading = false;
  List<Map<String, dynamic>> _rows = const [];
  List<PlutoColumn> _gridColumns = const [];
  List<PlutoRow> _gridRows = const [];

  @override
  void dispose() {
    _codeCtrl.dispose();
    super.dispose();
  }

  int _toInt(dynamic v) {
    if (v == null) return 0;
    if (v is int) return v;
    if (v is num) return v.toInt();
    return int.tryParse(v.toString().replaceAll(',', '')) ?? 0;
  }

  String _fmtNum(dynamic v) {
    if (v == null) return '';
    if (v is num) {
      final s = v.toString();
      return s.endsWith('.0') ? s.substring(0, s.length - 2) : s;
    }
    return v.toString();
  }

  Future<void> _showAwesome(
    BuildContext ctx, {
    required DialogType type,
    String? title,
    required String message,
  }) async {
    if (!mounted) return;
    await AwesomeDialog(
      context: ctx,
      dialogType: type,
      animType: AnimType.scale,
      title: title,
      desc: message,
      dismissOnTouchOutside: true,
      btnOkOnPress: () {},
    ).show();
  }

  Future<void> _openUrl(String url) async {
    final uri = Uri.tryParse(url);
    if (uri == null) {
      if (!mounted) return;
      await _showAwesome(
        context,
        type: DialogType.error,
        title: 'Không hợp lệ',
        message: 'URL không hợp lệ: $url',
      );
      return;
    }
    final ok = await launchUrl(uri, mode: LaunchMode.externalApplication);
    if (!ok) {
      if (!mounted) return;
      await _showAwesome(
        context,
        type: DialogType.error,
        title: 'Thất bại',
        message: 'Không mở được link: $url',
      );
    }
  }

  String? _resolveAppsheetUrl({
    required String gCode,
    required dynamic rawValue,
  }) {
    final v = (rawValue ?? '').toString().trim();
    if (v.isEmpty) return null;
    final u = v.toUpperCase();
    if (u == 'N' || u == '0') return null;
    if (v.startsWith('http://') || v.startsWith('https://')) return v;
    if (v.contains('://')) return v;
    return '${AppConfig.imageBaseUrl}/appsheet/Appsheet_$gCode.docx?v=${DateTime.now().millisecondsSinceEpoch}';
  }

  String? _resolveBanVeUrl({
    required String gCode,
    required dynamic rawValue,
  }) {
    final v = (rawValue ?? '').toString().trim();
    if (v.isEmpty) return null;
    final u = v.toUpperCase();
    if (u == 'N' || u == '0') return null;
    return '${AppConfig.imageBaseUrl}/banve/$gCode.pdf?v=${DateTime.now().millisecondsSinceEpoch}';
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
      'G_C_R',
      'G_CG',
      'G_LG',
      'G_SG_L',
      'G_SG_R',
      'CAVITY',
      'PACK_DRT',
      'KNIFE_TYPE',
      'KNIFE_LIFECYCLE',
      'KNIFE_PRICE',
      'CODE_33',
      'ROLE_EA_QTY',
      'PROCESS_TYPE',
      'EQ1',
      'EQ2',
      'EQ3',
      'EQ4',
      'PROD_DIECUT_STEP',
      'PROD_PRINT_TIMES',
      'BANVE',
      'APPSHEET',
      'NO_INSPECTION',
      'USE_YN',
      'PDBV',
      'QL_HSD',
      'EXP_DATE',
      'FACTORY',
      'FSC',
      'FSC_CODE',
      'PO_TYPE',
      'PROD_DVT',
      'APPROVED_YN',
      'UPD_DATE',
      'UPD_EMPL',
      'UPD_COUNT',
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
      final isBanVe = field == 'BANVE';
      final isAppSheet = field == 'APPSHEET';

      return PlutoColumn(
        title: field,
        field: field,
        type: PlutoColumnType.text(),
        width: (isBanVe || isAppSheet) ? 120 : 120,
        minWidth: (isBanVe || isAppSheet) ? 110 : 90,
        enableSorting: true,
        enableFilterMenuItem: true,
        renderer: (ctx) {
          if (!isBanVe && !isAppSheet) {
            final v = (ctx.cell.value ?? '').toString();
            return Text(
              v,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontSize: 11),
            );
          }

          final raw = ctx.row.cells['__raw__']?.value;
          if (raw is! Map<String, dynamic>) return const SizedBox.shrink();
          final gCode = (raw['G_CODE'] ?? '').toString();
          if (gCode.isEmpty) return const SizedBox.shrink();

          if (isBanVe) {
            final url = _resolveBanVeUrl(gCode: gCode, rawValue: raw['BANVE']);
            if (url == null) return const SizedBox.shrink();
            return _miniButton(
              label: 'PDF',
              onTap: () => _openUrl(url),
            );
          }

          final url = _resolveAppsheetUrl(gCode: gCode, rawValue: raw['APPSHEET']);
          if (url == null) return const SizedBox.shrink();
          return _miniButton(
            label: 'DOCX',
            onTap: () => _openUrl(url),
          );
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
        enableSorting: false,
        enableFilterMenuItem: false,
      ),
      for (final f in fields) col(f),
    ];
  }

  List<PlutoRow> _buildPlutoRows(
    List<Map<String, dynamic>> rows,
    List<PlutoColumn> columns,
  ) {
    Object? val(Map<String, dynamic> it, String field) {
      if (field == '__raw__') return it;
      return (it[field] ?? '').toString();
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

  Widget _miniButton({required String label, required VoidCallback onTap}) {
    return Align(
      alignment: Alignment.centerLeft,
      child: TextButton(
        onPressed: onTap,
        style: TextButton.styleFrom(
          minimumSize: const Size(10, 24),
          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 0),
          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
          visualDensity: VisualDensity.compact,
        ),
        child: Text(label, style: const TextStyle(fontSize: 11)),
      ),
    );
  }

  Widget _listItem(ColorScheme scheme, Map<String, dynamic> r) {
    final gCode = (r['G_CODE'] ?? '').toString();
    final gName = (r['G_NAME'] ?? '').toString();
    final gNameKd = (r['G_NAME_KD'] ?? '').toString();
    final cust = (r['CUST_NAME_KD'] ?? r['CUST_NAME'] ?? '').toString();
    final model = (r['PROD_MODEL'] ?? '').toString();
    final prodType = (r['PROD_TYPE'] ?? '').toString();
    final code12 = (r['CODE_12'] ?? '').toString();
    final poType = (r['PO_TYPE'] ?? '').toString();
    final fsc = (r['FSC'] ?? '').toString();
    final qlHsd = (r['QL_HSD'] ?? '').toString();
    final expDate = (r['EXP_DATE'] ?? '').toString();
    final width = _fmtNum(r['G_WIDTH']);
    final length = _fmtNum(r['G_LENGTH']);
    final pd = _fmtNum(r['PD']);
    final cavity = _fmtNum(r['CAVITY']);

    final banveUrl = _resolveBanVeUrl(gCode: gCode, rawValue: r['BANVE']);
    final appsheetUrl = _resolveAppsheetUrl(gCode: gCode, rawValue: r['APPSHEET']);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    gCode,
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                if (banveUrl != null)
                  _miniButton(label: 'PDF', onTap: () => _openUrl(banveUrl)),
                if (appsheetUrl != null)
                  _miniButton(label: 'DOCX', onTap: () => _openUrl(appsheetUrl)),
              ],
            ),
            const SizedBox(height: 2),
            if (gNameKd.isNotEmpty || gName.isNotEmpty)
              Text(
                gNameKd.isNotEmpty ? gNameKd : gName,
                style: TextStyle(fontSize: 12, color: scheme.onSurfaceVariant),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            if (cust.isNotEmpty)
              Text(
                cust,
                style: TextStyle(fontSize: 12, color: scheme.onSurfaceVariant, fontWeight: FontWeight.w700),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            const SizedBox(height: 6),
            Wrap(
              spacing: 8,
              runSpacing: 4,
              children: [
                if (code12.isNotEmpty)
                  Text('C12: $code12', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                if (prodType.isNotEmpty)
                  Text('TYPE: $prodType', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                if (model.isNotEmpty)
                  Text('MODEL: $model', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                if (width.isNotEmpty)
                  Text('W: $width', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                if (length.isNotEmpty)
                  Text('L: $length', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                if (pd.isNotEmpty)
                  Text('PD: $pd', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                if (cavity.isNotEmpty)
                  Text('CAV: $cavity', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                if (poType.isNotEmpty)
                  Text('PO: $poType', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                if (fsc.isNotEmpty)
                  Text('FSC: $fsc', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                if (qlHsd.isNotEmpty)
                  Text('HSD: $qlHsd', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                if (expDate.isNotEmpty && expDate != '0')
                  Text('EXP: $expDate', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildList(ColorScheme scheme) {
    return ListView.builder(
      itemCount: _rows.length,
      itemBuilder: (ctx, i) => _listItem(scheme, _rows[i]),
    );
  }

  Future<void> _search() async {
    if (mounted) {
      setState(() {
        _loading = true;
        _showFilter = false;
      });
    }

    try {
      final api = ref.read(apiClientProvider);
      final res = await api.postCommand(
        'codeinfo',
        data: {
          'G_NAME': _codeCtrl.text.trim(),
          'CNDB': _cndb,
          'ACTIVE_ONLY': _activeOnly,
        },
      );

      final body = res.data;
      if (body is Map<String, dynamic> &&
          (body['tk_status'] ?? '').toString().toUpperCase() == 'NG') {
        if (!mounted) return;
        setState(() => _loading = false);
        await _showAwesome(
          context,
          type: DialogType.error,
          title: 'Thất bại',
          message: (body['message'] ?? 'NG').toString(),
        );
        return;
      }

      final data = (res.data['data'] as List?) ?? const [];
      final rows = data
          .whereType<Map>()
          .map((e) => e.map((k, v) => MapEntry(k.toString(), v)))
          .toList();

      final cols = _buildPlutoColumns(rows);
      final rws = _buildPlutoRows(rows, cols);

      if (!mounted) return;
      setState(() {
        _rows = rows;
        _gridColumns = cols;
        _gridRows = rws;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      await _showAwesome(
        context,
        type: DialogType.error,
        title: 'Lỗi',
        message: e.toString(),
      );
    }
  }

  Future<void> _exportExcel() async {
    final rows = _rows;
    if (rows.isEmpty) {
      if (!mounted) return;
      await _showAwesome(
        context,
        type: DialogType.warning,
        title: 'Chưa có dữ liệu',
        message: 'Chưa có dữ liệu để xuất',
      );
      return;
    }

    final excel = xls.Excel.createExcel();
    final sheet = excel['CODEINFO'];

    final headers = <String>[
      'G_CODE',
      'G_NAME',
      'G_NAME_KD',
      'CUST_NAME_KD',
      'CUST_NAME',
      'CUST_CD',
      'CODE_12',
      'PROD_TYPE',
      'PROD_MODEL',
      'PROD_PROJECT',
      'PROD_MAIN_MATERIAL',
      'G_WIDTH',
      'G_LENGTH',
      'PD',
      'CAVITY',
      'G_C',
      'G_C_R',
      'G_CG',
      'G_LG',
      'BANVE',
      'APPSHEET',
      'USE_YN',
      'PDBV',
      'QL_HSD',
      'EXP_DATE',
      'FSC',
      'FSC_CODE',
      'PO_TYPE',
      'PROD_DVT',
      'UPD_DATE',
      'UPD_EMPL',
      'UPD_COUNT',
    ];

    sheet.appendRow(headers.map((e) => xls.TextCellValue(e)).toList());

    for (final r in rows) {
      sheet.appendRow([
        xls.TextCellValue((r['G_CODE'] ?? '').toString()),
        xls.TextCellValue((r['G_NAME'] ?? '').toString()),
        xls.TextCellValue((r['G_NAME_KD'] ?? '').toString()),
        xls.TextCellValue((r['CUST_NAME_KD'] ?? '').toString()),
        xls.TextCellValue((r['CUST_NAME'] ?? '').toString()),
        xls.TextCellValue((r['CUST_CD'] ?? '').toString()),
        xls.TextCellValue((r['CODE_12'] ?? '').toString()),
        xls.TextCellValue((r['PROD_TYPE'] ?? '').toString()),
        xls.TextCellValue((r['PROD_MODEL'] ?? '').toString()),
        xls.TextCellValue((r['PROD_PROJECT'] ?? '').toString()),
        xls.TextCellValue((r['PROD_MAIN_MATERIAL'] ?? '').toString()),
        xls.TextCellValue(_fmtNum(r['G_WIDTH'])),
        xls.TextCellValue(_fmtNum(r['G_LENGTH'])),
        xls.TextCellValue(_fmtNum(r['PD'])),
        xls.TextCellValue(_fmtNum(r['CAVITY'])),
        xls.TextCellValue(_fmtNum(r['G_C'])),
        xls.TextCellValue(_fmtNum(r['G_C_R'])),
        xls.TextCellValue(_fmtNum(r['G_CG'])),
        xls.TextCellValue(_fmtNum(r['G_LG'])),
        xls.TextCellValue((r['BANVE'] ?? '').toString()),
        xls.TextCellValue((r['APPSHEET'] ?? '').toString()),
        xls.TextCellValue((r['USE_YN'] ?? '').toString()),
        xls.TextCellValue((r['PDBV'] ?? '').toString()),
        xls.TextCellValue((r['QL_HSD'] ?? '').toString()),
        xls.TextCellValue((r['EXP_DATE'] ?? '').toString()),
        xls.TextCellValue((r['FSC'] ?? '').toString()),
        xls.TextCellValue((r['FSC_CODE'] ?? '').toString()),
        xls.TextCellValue((r['PO_TYPE'] ?? '').toString()),
        xls.TextCellValue((r['PROD_DVT'] ?? '').toString()),
        xls.TextCellValue((r['UPD_DATE'] ?? '').toString()),
        xls.TextCellValue((r['UPD_EMPL'] ?? '').toString()),
        xls.IntCellValue(_toInt(r['UPD_COUNT'])),
      ]);
    }

    final bytes = excel.encode();
    if (bytes == null) return;
    final dir = await getTemporaryDirectory();
    final filename =
        'CODEINFO_${DateTime.now().millisecondsSinceEpoch}.xlsx';
    final file = File('${dir.path}/$filename');
    await file.writeAsBytes(bytes, flush: true);

    await Share.shareXFiles([
      XFile(
        file.path,
        mimeType:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ),
    ]);
  }

  Widget _buildGrid(ColorScheme scheme) {
    final cols = _gridColumns;
    final rws = _gridRows;
    if (cols.isEmpty) return const SizedBox.shrink();

    return PlutoGrid(
      columns: cols,
      rows: rws,
      onLoaded: (e) {
        e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
        e.stateManager.setShowColumnFilter(true);
      },
      configuration: PlutoGridConfiguration(
        columnSize: const PlutoGridColumnSizeConfig(
          autoSizeMode: PlutoAutoSizeMode.scale,
        ),
        style: PlutoGridStyleConfig(
          enableCellBorderVertical: true,
          enableCellBorderHorizontal: true,
          rowHeight: 28,
          columnHeight: 28,
          cellTextStyle: const TextStyle(fontSize: 11),
          columnTextStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Thông tin sản phẩm'),
        actions: [
          IconButton(
            onPressed: () {
              setState(() => _gridView = !_gridView);
            },
            icon: Icon(_gridView ? Icons.view_agenda : Icons.grid_on),
            tooltip: _gridView ? 'List view' : 'Grid view',
          ),
          PopupMenuButton<String>(
            onSelected: (v) {
              if (v == 'excel') _exportExcel();
            },
            itemBuilder: (ctx) => const [
              PopupMenuItem(
                value: 'excel',
                child: Text('Xuất Excel'),
              ),
            ],
          ),
          IconButton(
            onPressed: () {
              setState(() => _showFilter = !_showFilter);
            },
            icon: Icon(_showFilter ? Icons.filter_alt_off : Icons.filter_alt),
            tooltip: _showFilter ? 'Ẩn bộ lọc' : 'Hiện bộ lọc',
          ),
        ],
      ),
      drawer: const AppDrawer(title: 'ERP'),
      body: RefreshIndicator(
        onRefresh: _search,
        child: Padding(
          padding: const EdgeInsets.all(10),
          child: Column(
            children: [
              if (_showFilter)
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        TextField(
                          controller: _codeCtrl,
                          decoration: const InputDecoration(
                            labelText: 'Code',
                            hintText: 'Nhập code vào đây',
                            prefixIcon: Icon(Icons.search),
                          ),
                          textInputAction: TextInputAction.search,
                          onSubmitted: (_) => _search(),
                        ),
                        const SizedBox(height: 8),
                        SwitchListTile(
                          contentPadding: EdgeInsets.zero,
                          title: const Text('CNDB'),
                          value: _cndb,
                          onChanged: (v) => setState(() => _cndb = v),
                        ),
                        SwitchListTile(
                          contentPadding: EdgeInsets.zero,
                          title: const Text('Active only'),
                          value: _activeOnly,
                          onChanged: (v) => setState(() => _activeOnly = v),
                        ),
                        const SizedBox(height: 8),
                        SizedBox(
                          width: double.infinity,
                          child: FilledButton(
                            onPressed: _loading ? null : _search,
                            child: const Text('Tìm code'),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              const SizedBox(height: 8),
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
                        : (_gridView ? _buildGrid(scheme) : _buildList(scheme)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
