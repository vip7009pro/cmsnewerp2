import 'dart:math' as math;
import 'dart:io';
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:barcode_widget/barcode_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../core/config/app_config.dart';
import '../../../core/providers.dart';

class TraAmzPreviewPage extends ConsumerStatefulWidget {
  const TraAmzPreviewPage({super.key, required this.rows});

  final List<Map<String, dynamic>> rows;

  @override
  ConsumerState<TraAmzPreviewPage> createState() => _TraAmzPreviewPageState();
}

class _RasterComp extends StatelessWidget {
  const _RasterComp({
    required this.comp,
    required this.dotsPerMm,
    required this.offsetXmm,
    required this.offsetYmm,
  });

  final Map<String, dynamic> comp;
  final double dotsPerMm;
  final double offsetXmm;
  final double offsetYmm;

  double _d(dynamic v) => double.tryParse((v ?? '').toString()) ?? 0;
  String _s(dynamic v) => (v ?? '').toString();

  @override
  Widget build(BuildContext context) {
    final type = _s(comp['PHANLOAI_DT']).toUpperCase();
    final x = (_d(comp['POS_X']) + offsetXmm) * dotsPerMm;
    final y = (_d(comp['POS_Y']) + offsetYmm) * dotsPerMm;
    final w = math.max(1.0, _d(comp['SIZE_W']) * dotsPerMm);
    final h = math.max(1.0, _d(comp['SIZE_H']) * dotsPerMm);
    final rotateDeg = _d(comp['ROTATE']);

    Widget child;
    if (type == 'TEXT') {
      final value = _s(comp['GIATRI']);
      final fontPt = _d(comp['FONT_SIZE']);
      final styleFlag = _s(comp['FONT_STYLE']).toUpperCase();
      final bold = styleFlag.contains('B');
      final italic = styleFlag.contains('I');
      final underline = styleFlag.contains('U');
      final fontSizePx = fontPt <= 0 ? 18.0 : fontPt * (dotsPerMm * 0.3527777778); // pt->mm->dots
      child = Align(
        alignment: Alignment.topLeft,
        child: Text(
          value,
          style: TextStyle(
            fontSize: fontSizePx,
            fontWeight: bold ? FontWeight.bold : FontWeight.normal,
            fontStyle: italic ? FontStyle.italic : FontStyle.normal,
            decoration: underline ? TextDecoration.underline : TextDecoration.none,
            color: Colors.black,
          ),
        ),
      );
    } else if (type == '1D BARCODE') {
      final data = _s(comp['GIATRI']);
      child = BarcodeWidget(
        barcode: Barcode.code128(),
        data: data,
        drawText: false,
        backgroundColor: Colors.transparent,
        errorBuilder: (_, __) => const SizedBox.shrink(),
      );
    } else if (type == '2D MATRIX') {
      final data = _s(comp['GIATRI']);
      child = BarcodeWidget(
        barcode: Barcode.dataMatrix(),
        data: data,
        drawText: false,
        backgroundColor: Colors.transparent,
        errorBuilder: (_, __) => const SizedBox.shrink(),
      );
    } else if (type == 'QRCODE') {
      final data = _s(comp['GIATRI']);
      child = BarcodeWidget(
        barcode: Barcode.qrCode(),
        data: data,
        drawText: false,
        backgroundColor: Colors.transparent,
        errorBuilder: (_, __) => const SizedBox.shrink(),
      );
    } else {
      // IMAGE + others: skip in raster for now.
      child = const SizedBox.shrink();
    }

    return Positioned(
      left: x,
      top: y,
      child: Transform.rotate(
        angle: rotateDeg * math.pi / 180,
        alignment: Alignment.topLeft,
        child: SizedBox(width: w, height: h, child: child),
      ),
    );
  }
}

class _TraAmzPreviewPageState extends ConsumerState<TraAmzPreviewPage> {
  static const _prefOffsetX = 'AMZ_PrintOffsetX';
  static const _prefOffsetY = 'AMZ_PrintOffsetY';
  static const _prefPrinterIp = 'AMZ_PrinterIp';
  static const _prefPrinterPort = 'AMZ_PrinterPort';

  static const _dpi = 600.0;
  static const _dotsPerMm = _dpi / 25.4;

  bool _loading = false;
  double _offsetXmm = 0;
  double _offsetYmm = 0;

  String _printerIp = '';
  int _printerPort = 9100;

  bool _printing = false;
  int _printedCount = 0;

  // Prepared print items: each item includes design components with DATA_1/DATA_2 applied.
  List<_LabelItem> _items = const [];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _init());
  }

  Future<void> _init() async {
    final prefs = await SharedPreferences.getInstance();
    final ox = prefs.getDouble(_prefOffsetX) ?? 0;
    final oy = prefs.getDouble(_prefOffsetY) ?? 0;
    final ip = prefs.getString(_prefPrinterIp) ?? '';
    final port = prefs.getInt(_prefPrinterPort) ?? 9100;
    if (mounted) {
      setState(() {
        _offsetXmm = ox;
        _offsetYmm = oy;
        _printerIp = ip;
        _printerPort = port;
      });
    }
    await _prepare();
  }

  bool _isNg(dynamic body) =>
      body is Map<String, dynamic> && (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  String _s(dynamic v) => (v ?? '').toString();

  double _d(dynamic v) => double.tryParse((v ?? '').toString()) ?? 0;

  Future<void> _prepare() async {
    if (widget.rows.isEmpty) return;
    setState(() => _loading = true);

    try {
      final api = ref.read(apiClientProvider);

      final unique = <String>{};
      for (final r in widget.rows) {
        final m = _s(r['G_CODE_MAU']).trim();
        if (m.isNotEmpty) unique.add(m);
      }

      final Map<String, List<Map<String, dynamic>>> designMap = {};

      for (final g in unique) {
        final res = await api.postCommand('getAMAZON_DESIGN', data: {'G_CODE': g});
        final body = res.data;
        if (_isNg(body)) {
          designMap[g] = const [];
          continue;
        }
        final data = (body is Map<String, dynamic> ? body['data'] : null);
        final list = (data is List ? data : const [])
            .whereType<Map>()
            .map((e) => e.map((k, v) => MapEntry(k.toString(), v)))
            .toList();
        designMap[g] = list;
      }

      final items = <_LabelItem>[];
      for (final r in widget.rows) {
        final g = _s(r['G_CODE_MAU']).trim();
        final base = (designMap[g] ?? const []).map((e) => Map<String, dynamic>.from(e)).toList();

        final matrices = base.where((e) => _s(e['PHANLOAI_DT']).toUpperCase() == '2D MATRIX').toList();
        if (matrices.isNotEmpty) {
          matrices[0]['GIATRI'] = _s(r['DATA_1']);
        }
        if (matrices.length > 1) {
          matrices[1]['GIATRI'] = _s(r['DATA_2']);
        }

        items.add(_LabelItem(row: r, design: base));
      }

      if (!mounted) return;
      setState(() {
        _items = items;
        _loading = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() => _loading = false);
    }
  }

  Future<void> _saveOffsets() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setDouble(_prefOffsetX, _offsetXmm);
    await prefs.setDouble(_prefOffsetY, _offsetYmm);
  }

  Future<void> _savePrinter() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_prefPrinterIp, _printerIp.trim());
    await prefs.setInt(_prefPrinterPort, _printerPort);
  }

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  Future<void> _printAll() async {
    if (_printerIp.trim().isEmpty) {
      _snack('Vui lòng nhập Printer IP');
      return;
    }
    if (_items.isEmpty) return;

    setState(() {
      _printing = true;
      _printedCount = 0;
    });

    await _saveOffsets();
    await _savePrinter();

    for (var i = 0; i < _items.length; i++) {
      if (!mounted) return;
      final item = _items[i];
      try {
        final zpl = await _renderLabelToZpl(item.design);
        await _sendZplToPrinter(zpl);
        await _updatePrintedStatus(item.row);
        if (!mounted) return;
        setState(() => _printedCount = i + 1);
      } catch (e) {
        if (!mounted) return;
        setState(() => _printing = false);
        _snack('In lỗi ở tem ${i + 1}/${_items.length}: $e');
        return;
      }
    }

    if (!mounted) return;
    setState(() => _printing = false);
    _snack('Đã gửi lệnh in ${_items.length} tem');
  }

  Future<void> _sendZplToPrinter(String zpl) async {
    final socket = await Socket.connect(
      _printerIp.trim(),
      _printerPort,
      timeout: const Duration(seconds: 5),
    );
    socket.add(Uint8List.fromList(zpl.codeUnits));
    await socket.flush();
    await socket.close();
  }

  Future<void> _updatePrintedStatus(Map<String, dynamic> row) async {
    // Placeholder: implement your backend command here once confirmed.
    // For example:
    // await ref.read(apiClientProvider).postCommand('updatePrintStatusAMZ', data: {...});
  }

  Future<String> _renderLabelToZpl(List<Map<String, dynamic>> design) async {
    var maxWmm = 0.0;
    var maxHmm = 0.0;
    for (final d in design) {
      final right = _d(d['POS_X']) + _d(d['SIZE_W']) + _offsetXmm;
      final bottom = _d(d['POS_Y']) + _d(d['SIZE_H']) + _offsetYmm;
      maxWmm = math.max(maxWmm, right);
      maxHmm = math.max(maxHmm, bottom);
    }

    final wDots = math.max(1, (maxWmm * _dotsPerMm).round());
    final hDots = math.max(1, (maxHmm * _dotsPerMm).round());

    final image = await _rasterizeLabelToImage(design, wDots: wDots, hDots: hDots);
    final byteData = await image.toByteData(format: ui.ImageByteFormat.rawRgba);
    if (byteData == null) {
      throw Exception('Failed to rasterize label');
    }

    final mono = _rgbaToMono(byteData, wDots, hDots);
    final bytesPerRow = ((wDots + 7) ~/ 8);
    final totalBytes = bytesPerRow * hDots;
    final hex = _toHex(mono);

    return '^XA\n^CI28\n^PW$wDots\n^LL$hDots\n^FO0,0\n^GFA,$totalBytes,$totalBytes,$bytesPerRow,$hex\n^XZ\n';
  }

  Future<ui.Image> _rasterizeLabelToImage(
    List<Map<String, dynamic>> design, {
    required int wDots,
    required int hDots,
  }) async {
    final key = GlobalKey();

    final entry = OverlayEntry(
      builder: (context) {
        return Positioned(
          left: -10000,
          top: -10000,
          child: Material(
            color: Colors.white,
            child: RepaintBoundary(
              key: key,
              child: SizedBox(
                width: wDots.toDouble(),
                height: hDots.toDouble(),
                child: Stack(
                  children: [
                    for (final comp in design)
                      _RasterComp(
                        comp: comp,
                        dotsPerMm: _dotsPerMm,
                        offsetXmm: _offsetXmm,
                        offsetYmm: _offsetYmm,
                      ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );

    Overlay.of(context).insert(entry);

    await Future<void>.delayed(const Duration(milliseconds: 60));

    final boundary = key.currentContext?.findRenderObject() as RenderRepaintBoundary?;
    if (boundary == null) {
      entry.remove();
      throw Exception('Cannot find RenderRepaintBoundary');
    }

    final image = await boundary.toImage(pixelRatio: 1);
    entry.remove();
    return image;
  }

  Uint8List _rgbaToMono(ByteData rgba, int width, int height) {
    final bytesPerRow = ((width + 7) ~/ 8);
    final out = Uint8List(bytesPerRow * height);
    final data = rgba.buffer.asUint8List();

    int outIdx = 0;
    int bit = 7;
    int cur = 0;

    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        final i = (y * width + x) * 4;
        final r = data[i];
        final g = data[i + 1];
        final b = data[i + 2];
        final a = data[i + 3];

        final lum = (0.299 * r + 0.587 * g + 0.114 * b);
        final isBlack = a > 0 && lum < 160;
        if (isBlack) {
          cur |= (1 << bit);
        }
        bit--;
        if (bit < 0) {
          out[outIdx++] = cur;
          cur = 0;
          bit = 7;
        }
      }

      if (bit != 7) {
        out[outIdx++] = cur;
        cur = 0;
        bit = 7;
      }
    }

    return out;
  }

  String _toHex(Uint8List bytes) {
    final sb = StringBuffer();
    for (final b in bytes) {
      sb.write(b.toRadixString(16).padLeft(2, '0').toUpperCase());
    }
    return sb.toString();
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: Text('Preview AMZ (${_items.length})'),
        actions: [
          IconButton(
            onPressed: _loading ? null : _prepare,
            icon: const Icon(Icons.refresh),
            tooltip: 'Reload design',
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: TextFormField(
                            initialValue: _offsetXmm.toString(),
                            decoration: const InputDecoration(labelText: 'Offset X (mm)'),
                            keyboardType: const TextInputType.numberWithOptions(decimal: true),
                            onChanged: (v) {
                              final d = double.tryParse(v) ?? 0;
                              setState(() => _offsetXmm = d);
                            },
                            onFieldSubmitted: (_) => _saveOffsets(),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: TextFormField(
                            initialValue: _offsetYmm.toString(),
                            decoration: const InputDecoration(labelText: 'Offset Y (mm)'),
                            keyboardType: const TextInputType.numberWithOptions(decimal: true),
                            onChanged: (v) {
                              final d = double.tryParse(v) ?? 0;
                              setState(() => _offsetYmm = d);
                            },
                            onFieldSubmitted: (_) => _saveOffsets(),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(
                          child: TextFormField(
                            initialValue: _printerIp,
                            decoration: const InputDecoration(labelText: 'Printer IP (LAN)'),
                            onChanged: (v) => setState(() => _printerIp = v),
                            onFieldSubmitted: (_) => _savePrinter(),
                          ),
                        ),
                        const SizedBox(width: 8),
                        SizedBox(
                          width: 120,
                          child: TextFormField(
                            initialValue: _printerPort.toString(),
                            decoration: const InputDecoration(labelText: 'Port'),
                            keyboardType: TextInputType.number,
                            onChanged: (v) {
                              final p = int.tryParse(v) ?? 9100;
                              setState(() => _printerPort = p);
                            },
                            onFieldSubmitted: (_) => _savePrinter(),
                          ),
                        ),
                        const SizedBox(width: 12),
                        FilledButton.icon(
                          onPressed: _loading || _items.isEmpty || _printing ? null : _printAll,
                          icon: const Icon(Icons.print),
                          label: Text(_printing ? 'Printing' : 'Print'),
                        ),
                      ],
                    ),
                    if (_printing) ...[
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(
                            child: LinearProgressIndicator(
                              value: _items.isEmpty ? null : (_printedCount / _items.length).clamp(0, 1),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Text('$_printedCount/${_items.length}'),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ),
          if (_loading) const LinearProgressIndicator(),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(12),
              itemCount: _items.length,
              itemBuilder: (ctx, i) {
                final item = _items[i];
                final meta = '${_s(item.row['G_CODE'])} | ${_s(item.row['PROD_REQUEST_NO'])} | ROW ${_s(item.row['ROW_NO'])}';

                return Card(
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(meta, style: TextStyle(color: scheme.onSurface, fontWeight: FontWeight.w600)),
                        const SizedBox(height: 8),
                        _LabelPreview(
                          design: item.design,
                          offsetXmm: _offsetXmm,
                          offsetYmm: _offsetYmm,
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _LabelItem {
  final Map<String, dynamic> row;
  final List<Map<String, dynamic>> design;

  const _LabelItem({required this.row, required this.design});
}

class _LabelPreview extends StatelessWidget {
  const _LabelPreview({
    required this.design,
    required this.offsetXmm,
    required this.offsetYmm,
  });

  final List<Map<String, dynamic>> design;
  final double offsetXmm;
  final double offsetYmm;

  static const _mmToPx = 96 / 25.4;

  double _d(dynamic v) => double.tryParse((v ?? '').toString()) ?? 0;
  String _s(dynamic v) => (v ?? '').toString();

  @override
  Widget build(BuildContext context) {
    if (design.isEmpty) {
      return const Text('Không có design');
    }

    var maxWmm = 0.0;
    var maxHmm = 0.0;
    for (final d in design) {
      final right = _d(d['POS_X']) + _d(d['SIZE_W']);
      final bottom = _d(d['POS_Y']) + _d(d['SIZE_H']);
      maxWmm = math.max(maxWmm, right);
      maxHmm = math.max(maxHmm, bottom);
    }

    final wPx = maxWmm * _mmToPx;
    final hPx = maxHmm * _mmToPx;

    return InteractiveViewer(
      minScale: 0.5,
      maxScale: 5,
      child: Container(
        color: Colors.white,
        width: wPx,
        height: hPx,
        child: Stack(
          children: [
            for (final comp in design) _buildComp(context, comp),
            // offset indicator
            Positioned(
              left: 0,
              top: 0,
              child: Text(
                'Offset: ${offsetXmm.toStringAsFixed(2)} / ${offsetYmm.toStringAsFixed(2)}',
                style: const TextStyle(fontSize: 10, color: Colors.black54),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildComp(BuildContext context, Map<String, dynamic> c) {
    final type = _s(c['PHANLOAI_DT']).toUpperCase();

    final x = (_d(c['POS_X']) + offsetXmm) * _mmToPx;
    final y = (_d(c['POS_Y']) + offsetYmm) * _mmToPx;
    final w = math.max(1.0, _d(c['SIZE_W']) * _mmToPx);
    final h = math.max(1.0, _d(c['SIZE_H']) * _mmToPx);
    final rotateDeg = _d(c['ROTATE']);

    final child = switch (type) {
      'TEXT' => _textWidget(c),
      'IMAGE' => _imageWidget(c),
      '1D BARCODE' => _barcodeWidget(c, is2d: false),
      '2D MATRIX' => _barcodeWidget(c, is2d: true),
      'QRCODE' => _qrWidget(c),
      _ => _unknownWidget(c),
    };

    return Positioned(
      left: x,
      top: y,
      child: Transform.rotate(
        angle: rotateDeg * math.pi / 180,
        alignment: Alignment.topLeft,
        child: SizedBox(width: w, height: h, child: child),
      ),
    );
  }

  Widget _textWidget(Map<String, dynamic> c) {
    final value = _s(c['GIATRI']);
    final fontPt = _d(c['FONT_SIZE']);
    final styleFlag = _s(c['FONT_STYLE']).toUpperCase();

    final bold = styleFlag.contains('B');
    final italic = styleFlag.contains('I');
    final underline = styleFlag.contains('U');

    final fontSize = fontPt <= 0 ? 12.0 : fontPt * 1.333;

    return Align(
      alignment: Alignment.topLeft,
      child: Text(
        value,
        maxLines: 10,
        overflow: TextOverflow.visible,
        style: TextStyle(
          fontSize: fontSize,
          fontWeight: bold ? FontWeight.bold : FontWeight.normal,
          fontStyle: italic ? FontStyle.italic : FontStyle.normal,
          decoration: underline ? TextDecoration.underline : TextDecoration.none,
          color: Colors.black,
        ),
      ),
    );
  }

  Widget _imageWidget(Map<String, dynamic> c) {
    final src = _s(c['GIATRI']).trim();
    final url = src.startsWith('http') ? src : '${AppConfig.imageBaseUrl}/$src';

    return Image.network(
      url,
      fit: BoxFit.contain,
      errorBuilder: (_, __, ___) => const ColoredBox(color: Colors.transparent),
    );
  }

  Widget _barcodeWidget(Map<String, dynamic> c, {required bool is2d}) {
    final data = _s(c['GIATRI']);
    if (data.isEmpty) return const SizedBox.shrink();

    final barcode = is2d ? Barcode.dataMatrix() : Barcode.code128();
    return BarcodeWidget(
      barcode: barcode,
      data: data,
      drawText: false,
      backgroundColor: Colors.transparent,
      errorBuilder: (_, __) => const SizedBox.shrink(),
    );
  }

  Widget _qrWidget(Map<String, dynamic> c) {
    final data = _s(c['GIATRI']);
    if (data.isEmpty) return const SizedBox.shrink();

    return BarcodeWidget(
      barcode: Barcode.qrCode(),
      data: data,
      drawText: false,
      backgroundColor: Colors.transparent,
      errorBuilder: (_, __) => const SizedBox.shrink(),
    );
  }

  Widget _unknownWidget(Map<String, dynamic> c) {
    return const SizedBox.shrink();
  }
}
