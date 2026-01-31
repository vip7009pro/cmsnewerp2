import 'package:awesome_dialog/awesome_dialog.dart';
import 'package:excel/excel.dart' as xls;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';
import 'dart:io';

import '../../../app/app_drawer.dart';
import '../../../core/config/app_config.dart';
import '../../../core/providers.dart';

class PoAndStockFullPage extends ConsumerStatefulWidget {
  const PoAndStockFullPage({super.key});

  @override
  ConsumerState<PoAndStockFullPage> createState() => _PoAndStockFullPageState();
}

class _PoAndStockFullPageState extends ConsumerState<PoAndStockFullPage> {
  final _codeCtrl = TextEditingController();
  bool _allCode = true;
  bool _showFilter = true;
  bool _lastSearchByKd = false;

  bool _loading = false;
  List<Map<String, dynamic>> _rows = const [];

  int _sumPoBalance = 0;
  int _sumTp = 0;
  int _sumBtp = 0;
  int _sumCk = 0;
  int _sumCnk = 0;
  int _sumBlock = 0;
  int _sumTongTon = 0;
  int _sumThuaThieu = 0;

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

  String _fmtInt(int v) {
    final s = v.toString();
    final buf = StringBuffer();
    for (var i = 0; i < s.length; i++) {
      final idxFromEnd = s.length - i;
      buf.write(s[i]);
      if (idxFromEnd > 1 && idxFromEnd % 3 == 1) buf.write(',');
    }
    return buf.toString();
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

  void _recalcSummary(List<Map<String, dynamic>> list) {
    var poBalance = 0;
    var tp = 0;
    var btp = 0;
    var ck = 0;
    var cnk = 0;
    var block = 0;
    var tongTon = 0;
    var thuaThieu = 0;

    for (final r in list) {
      poBalance += _toInt(r['PO_BALANCE']);
      tp += _toInt(r['TON_TP']);
      btp += _toInt(r['BTP']);
      ck += _toInt(r['TONG_TON_KIEM']);
      cnk += _toInt(r['WAIT_INPUT_WH']);
      block += _toInt(r['BLOCK_QTY']);
      tongTon += _toInt(r['GRAND_TOTAL_STOCK']);
      final tt = _toInt(r['THUA_THIEU']);
      if (tt < 0) thuaThieu += tt;
    }

    _sumPoBalance = poBalance;
    _sumTp = tp;
    _sumBtp = btp;
    _sumCk = ck;
    _sumCnk = cnk;
    _sumBlock = block;
    _sumTongTon = tongTon;
    _sumThuaThieu = thuaThieu;
  }

  Future<void> _updateBtpTonKiem() async {
    final api = ref.read(apiClientProvider);
    await api.postCommand('updateBTP_M1002', data: {});
    await api.postCommand('updateTONKIEM_M100', data: {});
  }

  Future<void> _search({required bool byKd}) async {
    _lastSearchByKd = byKd;
    if (mounted) {
      setState(() {
        _loading = true;
        _showFilter = false;
      });
    }

    try {
      await _updateBtpTonKiem();

      final api = ref.read(apiClientProvider);
      final isCms = AppConfig.company.toUpperCase() == 'CMS';

      final command = isCms
          ? (byKd ? 'traPOFullKD_NEW' : 'traPOFullCMS_New')
          : (byKd ? 'traPOFullKD2' : 'traPOFullCMS2');

      final res = await api.postCommand(
        command,
        data: {
          'allcode': _allCode,
          'codeSearch': _codeCtrl.text.trim(),
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

      final data = (body is Map<String, dynamic> ? body['data'] : null);
      final list = (data is List ? data : const [])
          .map(
            (e) => (e is Map
                ? Map<String, dynamic>.from(e)
                : <String, dynamic>{}),
          )
          .toList();

      _recalcSummary(list);

      if (!mounted) return;
      setState(() {
        _rows = list;
        _loading = false;
      });

      if (!mounted) return;
      await _showAwesome(
        context,
        type: DialogType.success,
        title: 'Thành công',
        message: 'Đã load ${list.length} dòng',
      );
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
    final sheet = excel['PO_STOCK_FULL'];

    final headers = <String>[
      'G_CODE',
      'G_NAME',
      'G_NAME_KD',
      'PO_QTY',
      'TOTAL_DELIVERED',
      'PO_BALANCE',
      'CHO_KIEM',
      'CHO_CS_CHECK',
      'CHO_KIEM_RMA',
      'TONG_TON_KIEM',
      'WAIT_INPUT_WH',
      'BTP',
      'TON_TP',
      'BLOCK_QTY',
      'GRAND_TOTAL_STOCK',
      'THUA_THIEU',
    ];

    sheet.appendRow(headers.map((e) => xls.TextCellValue(e)).toList());

    for (final r in rows) {
      sheet.appendRow([
        xls.TextCellValue((r['G_CODE'] ?? '').toString()),
        xls.TextCellValue((r['G_NAME'] ?? '').toString()),
        xls.TextCellValue((r['G_NAME_KD'] ?? '').toString()),
        xls.IntCellValue(_toInt(r['PO_QTY'])),
        xls.IntCellValue(_toInt(r['TOTAL_DELIVERED'])),
        xls.IntCellValue(_toInt(r['PO_BALANCE'])),
        xls.IntCellValue(_toInt(r['CHO_KIEM'])),
        xls.IntCellValue(_toInt(r['CHO_CS_CHECK'])),
        xls.IntCellValue(_toInt(r['CHO_KIEM_RMA'])),
        xls.IntCellValue(_toInt(r['TONG_TON_KIEM'])),
        xls.IntCellValue(_toInt(r['WAIT_INPUT_WH'])),
        xls.IntCellValue(_toInt(r['BTP'])),
        xls.IntCellValue(_toInt(r['TON_TP'])),
        xls.IntCellValue(_toInt(r['BLOCK_QTY'])),
        xls.IntCellValue(_toInt(r['GRAND_TOTAL_STOCK'])),
        xls.IntCellValue(_toInt(r['THUA_THIEU'])),
      ]);
    }

    final bytes = excel.encode();
    if (bytes == null) return;
    final dir = await getTemporaryDirectory();
    final filename =
        'PO_STOCK_FULL_${DateTime.now().millisecondsSinceEpoch}.xlsx';
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

  Widget _summaryCard(ColorScheme scheme) {
    Widget cell(String label, int value, {Color? color, bool bold = false}) {
      return Expanded(
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
          decoration: BoxDecoration(
            color: scheme.surfaceContainerHighest,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: scheme.outlineVariant),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: 11,
                  color: scheme.onSurfaceVariant,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                _fmtInt(value),
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: bold ? FontWeight.w900 : FontWeight.w800,
                  color: color ?? scheme.onSurface,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      );
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Tổng hợp',
              style: Theme.of(context)
                  .textTheme
                  .titleMedium
                  ?.copyWith(fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                cell('PO BAL', _sumPoBalance, color: Colors.blue.shade700),
                const SizedBox(width: 8),
                cell('BTP', _sumBtp, color: Colors.purple.shade700),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                cell('CK', _sumCk, color: Colors.purple.shade700),
                const SizedBox(width: 8),
                cell('CNK', _sumCnk, color: Colors.purple.shade700),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                cell('TP', _sumTp, color: Colors.purple.shade700),
                const SizedBox(width: 8),
                cell('BLOCK', _sumBlock, color: Colors.red.shade700),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                cell('TỔNG TỒN', _sumTongTon,
                    color: Colors.blue.shade700, bold: true),
                const SizedBox(width: 8),
                cell('THỪA THIẾU', _sumThuaThieu,
                    color: Colors.brown.shade700, bold: true),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _rowCard(ColorScheme scheme, Map<String, dynamic> r) {
    final gCode = (r['G_CODE'] ?? '').toString();
    final gNameKd = (r['G_NAME_KD'] ?? '').toString();
    final gName = (r['G_NAME'] ?? '').toString();

    final poQty = _toInt(r['PO_QTY']);
    final delivered = _toInt(r['TOTAL_DELIVERED']);
    final poBal = _toInt(r['PO_BALANCE']);
    final ck = _toInt(r['TONG_TON_KIEM']);
    final btp = _toInt(r['BTP']);
    final tp = _toInt(r['TON_TP']);
    final cnk = _toInt(r['WAIT_INPUT_WH']);
    final block = _toInt(r['BLOCK_QTY']);
    final tong = _toInt(r['GRAND_TOTAL_STOCK']);
    final thuaThieu = _toInt(r['THUA_THIEU']);

    Widget badge(String label, String value, {Color? color}) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        decoration: BoxDecoration(
          color: scheme.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: scheme.outlineVariant),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                color: scheme.onSurfaceVariant,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              value,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w900,
                color: color ?? scheme.onSurface,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      );
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    _lastSearchByKd
                        ? (gNameKd.isNotEmpty ? gNameKd : gName)
                        : gCode,
                    style: Theme.of(context)
                        .textTheme
                        .titleMedium
                        ?.copyWith(fontWeight: FontWeight.w900),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                if (thuaThieu < 0)
                  Text(
                    'THIẾU',
                    style: TextStyle(
                      color: Colors.brown.shade700,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
              ],
            ),
            if (!_lastSearchByKd && (gNameKd.isNotEmpty || gName.isNotEmpty)) ...[
              const SizedBox(height: 2),
              Text(
                gNameKd.isNotEmpty ? gNameKd : gName,
                style: TextStyle(color: scheme.onSurfaceVariant, fontSize: 12),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
            if (_lastSearchByKd && gCode.isNotEmpty) ...[
              const SizedBox(height: 2),
              Text(
                gCode,
                style: TextStyle(
                  color: scheme.onSurfaceVariant,
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
            const SizedBox(height: 10),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  badge('PO_QTY', _fmtInt(poQty),
                      color: Colors.blue.shade700),
                  const SizedBox(width: 6),
                  badge('DEL', _fmtInt(delivered),
                      color: Colors.blue.shade700),
                  const SizedBox(width: 6),
                  badge('PO_BAL', _fmtInt(poBal), color: Colors.red.shade700),
                  const SizedBox(width: 6),
                  badge('CK', _fmtInt(ck)),
                  const SizedBox(width: 6),
                  badge('BTP', _fmtInt(btp)),
                  const SizedBox(width: 6),
                  badge('CNK', _fmtInt(cnk)),
                  const SizedBox(width: 6),
                  badge('TP', _fmtInt(tp)),
                  const SizedBox(width: 6),
                  badge('BLOCK', _fmtInt(block),
                      color: Colors.red.shade700),
                  const SizedBox(width: 6),
                  badge('TỔNG', _fmtInt(tong),
                      color: Colors.green.shade700),
                  const SizedBox(width: 6),
                  badge('TH/TH', _fmtInt(thuaThieu),
                      color: Colors.brown.shade700),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: const Text('PO & Stock (Full)'),
        actions: [
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
        onRefresh: () => _search(byKd: false),
        child: ListView(
          padding: const EdgeInsets.all(10),
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
                        onSubmitted: (_) => _search(byKd: false),
                      ),
                      const SizedBox(height: 8),
                      SwitchListTile(
                        contentPadding: EdgeInsets.zero,
                        title: const Text('Chỉ code tồn PO'),
                        value: _allCode,
                        onChanged: (v) => setState(() => _allCode = v),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(
                            child: FilledButton(
                              onPressed: _loading
                                  ? null
                                  : () {
                                      _search(byKd: false);
                                    },
                              child: const Text('Search(G_CODE)'),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: FilledButton.tonal(
                              onPressed: _loading
                                  ? null
                                  : () {
                                      _search(byKd: true);
                                    },
                              child: const Text('Search(KD)'),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            _summaryCard(scheme),
            if (_loading)
              const Padding(
                padding: EdgeInsets.all(16),
                child: Center(child: CircularProgressIndicator()),
              )
            else if (_rows.isEmpty)
              Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  'Chưa có dữ liệu',
                  style: TextStyle(color: scheme.onSurfaceVariant),
                ),
              )
            else
              ..._rows.map((r) => _rowCard(scheme, r)),
          ],
        ),
      ),
    );
  }
}
