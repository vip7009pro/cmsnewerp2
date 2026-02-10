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

  String _imageUrl(String src) {
    final s = src.trim();
    if (s.isEmpty) return '';
    if (s.startsWith('http://') || s.startsWith('https://')) return s;
    return '${AppConfig.imageBaseUrl}/$s';
  }

  Widget _barcodeFill(Barcode barcode, String data) {
    if (data.isEmpty) return const SizedBox.shrink();
    return ClipRect(
      child: FittedBox(
        fit: BoxFit.fill,
        alignment: Alignment.topLeft,
        child: BarcodeWidget(
          barcode: barcode,
          data: data,
          drawText: false,
          padding: EdgeInsets.zero,
          backgroundColor: Colors.transparent,
          errorBuilder: (_, __) => const SizedBox.shrink(),
        ),
      ),
    );
  }

  Widget _dataMatrixSquare(String data) {
    if (data.isEmpty) return const SizedBox.shrink();
    return LayoutBuilder(
      builder: (ctx, cs) {
        final w = cs.maxWidth.isFinite ? cs.maxWidth : 0.0;
        final h = cs.maxHeight.isFinite ? cs.maxHeight : 0.0;
        final side = math.max(1.0, math.min(w, h));
        return Center(
          child: SizedBox(
            width: side,
            height: side,
            child: BarcodeWidget(
              barcode: Barcode.dataMatrix(),
              data: data,
              drawText: false,
              padding: EdgeInsets.zero,
              backgroundColor: Colors.transparent,
              errorBuilder: (_, __) => const SizedBox.shrink(),
            ),
          ),
        );
      },
    );
  }

  Widget _rectangleWidget() {
    final raw = _s(comp['COLOR']).trim();
    Color color = Colors.white;
    if (raw.isNotEmpty) {
      final v = raw.toUpperCase();
      if (v == 'WHITE') color = Colors.white;
      if (v == 'BLACK') color = Colors.black;
      if (v == 'RED') color = Colors.red;
      if (v == 'GREEN') color = Colors.green;
      if (v == 'BLUE') color = Colors.blue;
      if (v.startsWith('#')) {
        final hex = v.substring(1);
        final parsed = int.tryParse(hex.length == 6 ? 'FF$hex' : hex, radix: 16);
        if (parsed != null) color = Color(parsed);
      }
    }
    return ColoredBox(color: color);
  }

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
      final isMultiline = value.contains('\n');
      final fontPt = _d(comp['FONT_SIZE']);
      final styleFlag = _s(comp['FONT_STYLE']).toUpperCase();
      final remark = _s(comp['REMARK']).toUpperCase().trim();
      final bold = styleFlag.contains('B');
      final italic = styleFlag.contains('I');
      final underline = styleFlag.contains('U');
      final fontSizePx = fontPt <= 0 ? 18.0 : fontPt * (dotsPerMm * 0.3527777778); // pt->mm->dots

      final highlight = remark == 'HIGHTLIGHT';
      final bg = highlight ? Colors.black : Colors.white;
      final fg = highlight ? Colors.white : Colors.black;
      child = Align(
        alignment: Alignment.topLeft,
        child: ColoredBox(
          color: bg,
          child: Text(
            value,
            softWrap: isMultiline,
            maxLines: isMultiline ? null : 1,
            overflow: TextOverflow.visible,
            style: TextStyle(
              fontSize: fontSizePx,
              fontWeight: bold ? FontWeight.bold : FontWeight.normal,
              fontStyle: italic ? FontStyle.italic : FontStyle.normal,
              decoration: underline ? TextDecoration.underline : TextDecoration.none,
              color: fg,
            ),
          ),
        ),
      );
    } else if (type == '1D BARCODE') {
      child = _barcodeFill(Barcode.code128(), _s(comp['GIATRI']));
    } else if (type == '2D MATRIX') {
      child = _dataMatrixSquare(_s(comp['GIATRI']));
    } else if (type == 'QRCODE') {
      child = _barcodeFill(Barcode.qrCode(), _s(comp['GIATRI']));
    } else if (type == 'IMAGE') {
      final url = _imageUrl(_s(comp['GIATRI']));
      if (url.isEmpty) {
        child = const SizedBox.shrink();
      } else {
        child = Image(
          image: NetworkImage(url),
          fit: BoxFit.contain,
          filterQuality: FilterQuality.none,
          errorBuilder: (_, __, ___) => const SizedBox.shrink(),
        );
      }
    } else if (type == 'RECTANGLE') {
      child = _rectangleWidget();
    } else {
      // Others: skip.
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

  Size _measureTextSizeDots(Map<String, dynamic> comp) {
    final value = _s(comp['GIATRI']);
    final isMultiline = value.contains('\n');
    final fontPt = _d(comp['FONT_SIZE']);
    final styleFlag = _s(comp['FONT_STYLE']).toUpperCase();

    final bold = styleFlag.contains('B');
    final italic = styleFlag.contains('I');

    final fontSizeDots = fontPt <= 0 ? 18.0 : fontPt * (_dotsPerMm * 0.3527777778);

    final tp = TextPainter(
      text: TextSpan(
        text: value,
        style: TextStyle(
          fontSize: fontSizeDots,
          fontWeight: bold ? FontWeight.bold : FontWeight.normal,
          fontStyle: italic ? FontStyle.italic : FontStyle.normal,
          color: Colors.black,
        ),
      ),
      textDirection: TextDirection.ltr,
      maxLines: isMultiline ? null : 1,
    );
    tp.layout();
    return tp.size;
  }

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

      // Preload all images to improve raster print fidelity.
      final urls = <String>{};
      for (final it in items) {
        for (final c in it.design) {
          final type = _s(c['PHANLOAI_DT']).toUpperCase();
          if (type != 'IMAGE') continue;
          final src = _s(c['GIATRI']).trim();
          if (src.isEmpty) continue;
          final url = src.startsWith('http://') || src.startsWith('https://')
              ? src
              : '${AppConfig.imageBaseUrl}/$src';
          urls.add(url);
        }
      }
      for (final u in urls) {
        try {
          await precacheImage(NetworkImage(u), context);
        } catch (_) {
          // ignore: keep printing even if some images fail
        }
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
    final prodRequestNo = _s(row['PROD_REQUEST_NO']).trim();
    final rowNo = int.tryParse(_s(row['ROW_NO']).trim()) ?? 0;
    final currentInlai = int.tryParse(_s(row['INLAI_COUNT']).trim()) ?? 0;
    final payload = <String, dynamic>{
      'PROD_REQUEST_NO': prodRequestNo,
      'ROW_NO': rowNo,
      'PRINT_STATUS': 'OK',
      'INLAI_COUNT': currentInlai + 1,
    };

    final api = ref.read(apiClientProvider);
    final res = await api.postCommand('updatePrintStatus', data: payload);
    final body = res.data;
    if (_isNg(body)) {
      throw Exception('Update PRINT_STATUS failed: ${_s(body is Map<String, dynamic> ? body['message'] : '')}');
    }

    row['PRINT_STATUS'] = 'OK';
    row['INLAI_COUNT'] = currentInlai + 1;
    if (mounted) setState(() {});
  }

  Future<String> _renderLabelToZpl(List<Map<String, dynamic>> design) async {
    var maxWmm = 0.0;
    var maxHmm = 0.0;
    for (final d in design) {
      final type = _s(d['PHANLOAI_DT']).toUpperCase();
      final posX = _d(d['POS_X']);
      final posY = _d(d['POS_Y']);

      var wMm = _d(d['SIZE_W']);
      var hMm = _d(d['SIZE_H']);

      if (type == 'TEXT') {
        final szDots = _measureTextSizeDots(d);
        wMm = math.max(wMm, szDots.width / _dotsPerMm);
        hMm = math.max(hMm, szDots.height / _dotsPerMm);
      }

      final right = posX + wMm + _offsetXmm;
      final bottom = posY + hMm + _offsetYmm;
      maxWmm = math.max(maxWmm, right);
      maxHmm = math.max(maxHmm, bottom);
    }

    maxWmm += 1.0;
    maxHmm += 1.0;

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
                  clipBehavior: Clip.antiAlias,
                  child: InkWell(
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => _TraAmzLabelPreviewDetailPage(
                            title: meta,
                            design: item.design,
                            offsetXmm: _offsetXmm,
                            offsetYmm: _offsetYmm,
                          ),
                        ),
                      );
                    },
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

  static Size measureTextSizeMm(Map<String, dynamic> c) {
    double d(dynamic v) => double.tryParse((v ?? '').toString()) ?? 0;
    String s(dynamic v) => (v ?? '').toString();

    final value = s(c['GIATRI']);
    final isMultiline = value.contains('\n');
    final fontPt = d(c['FONT_SIZE']);
    final styleFlag = s(c['FONT_STYLE']).toUpperCase();

    final bold = styleFlag.contains('B');
    final italic = styleFlag.contains('I');

    final fontSizePx = fontPt <= 0 ? 12.0 : fontPt * 1.333;

    final tp = TextPainter(
      text: TextSpan(
        text: value,
        style: TextStyle(
          fontSize: fontSizePx,
          fontWeight: bold ? FontWeight.bold : FontWeight.normal,
          fontStyle: italic ? FontStyle.italic : FontStyle.normal,
          color: Colors.black,
        ),
      ),
      textDirection: TextDirection.ltr,
      maxLines: isMultiline ? null : 1,
    );
    tp.layout();
    return Size(tp.size.width / _mmToPx, tp.size.height / _mmToPx);
  }

  @override
  Widget build(BuildContext context) {
    if (design.isEmpty) {
      return const Text('Không có design');
    }

    var maxWmm = 0.0;
    var maxHmm = 0.0;
    for (final d in design) {
      final type = _s(d['PHANLOAI_DT']).toUpperCase();
      final posX = _d(d['POS_X']);
      final posY = _d(d['POS_Y']);

      var wMm = _d(d['SIZE_W']);
      var hMm = _d(d['SIZE_H']);

      if (type == 'TEXT') {
        final szMm = measureTextSizeMm(d);
        wMm = math.max(wMm, szMm.width);
        hMm = math.max(hMm, szMm.height);
      }

      final right = posX + wMm;
      final bottom = posY + hMm;
      maxWmm = math.max(maxWmm, right);
      maxHmm = math.max(maxHmm, bottom);
    }

    maxWmm += 1.0;
    maxHmm += 1.0;

    final wPx = maxWmm * _mmToPx;
    final hPx = maxHmm * _mmToPx;

    return InteractiveViewer(
      minScale: 0.5,
      maxScale: 5,
      child: _LabelCanvas(
        design: design,
        offsetXmm: offsetXmm,
        offsetYmm: offsetYmm,
        wPx: wPx,
        hPx: hPx,
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
      'RECTANGLE' => _rectangleWidget(c),
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
    final isMultiline = value.contains('\n');
    final fontPt = _d(c['FONT_SIZE']);
    final styleFlag = _s(c['FONT_STYLE']).toUpperCase();
    final remark = _s(c['REMARK']).toUpperCase().trim();

    final bold = styleFlag.contains('B');
    final italic = styleFlag.contains('I');
    final underline = styleFlag.contains('U');

    final fontSize = fontPt <= 0 ? 12.0 : fontPt * 1.333;

    final highlight = remark == 'HIGHTLIGHT';
    final bg = highlight ? Colors.black : Colors.white;
    final fg = highlight ? Colors.white : Colors.black;

    return Align(
      alignment: Alignment.topLeft,
      child: ColoredBox(
        color: bg,
        child: Text(
          value,
          softWrap: isMultiline,
          maxLines: isMultiline ? null : 1,
          overflow: TextOverflow.visible,
          textHeightBehavior: const TextHeightBehavior(
            applyHeightToFirstAscent: false,
            applyHeightToLastDescent: false,
          ),
          strutStyle: StrutStyle(
            fontSize: fontSize,
            height: 1.0,
            forceStrutHeight: true,
          ),
          style: TextStyle(
            fontSize: fontSize,
            height: 1.0,
            fontWeight: bold ? FontWeight.bold : FontWeight.normal,
            fontStyle: italic ? FontStyle.italic : FontStyle.normal,
            decoration: underline ? TextDecoration.underline : TextDecoration.none,
            color: fg,
          ),
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

    if (is2d) {
      return LayoutBuilder(
        builder: (ctx, cs) {
          final w = cs.maxWidth.isFinite ? cs.maxWidth : 0.0;
          final h = cs.maxHeight.isFinite ? cs.maxHeight : 0.0;
          final side = math.max(1.0, math.min(w, h));
          return Center(
            child: SizedBox(
              width: side,
              height: side,
              child: BarcodeWidget(
                barcode: Barcode.dataMatrix(),
                data: data,
                drawText: false,
                padding: EdgeInsets.zero,
                backgroundColor: Colors.transparent,
                errorBuilder: (_, __) => const SizedBox.shrink(),
              ),
            ),
          );
        },
      );
    }

    return ClipRect(
      child: FittedBox(
        fit: BoxFit.fill,
        alignment: Alignment.topLeft,
        child: BarcodeWidget(
          barcode: Barcode.code128(),
          data: data,
          drawText: false,
          padding: EdgeInsets.zero,
          backgroundColor: Colors.transparent,
          errorBuilder: (_, __) => const SizedBox.shrink(),
        ),
      ),
    );
  }

  Widget _qrWidget(Map<String, dynamic> c) {
    final data = _s(c['GIATRI']);
    if (data.isEmpty) return const SizedBox.shrink();

    return LayoutBuilder(
      builder: (ctx, cs) {
        final w = cs.maxWidth.isFinite ? cs.maxWidth : 0.0;
        final h = cs.maxHeight.isFinite ? cs.maxHeight : 0.0;
        final side = math.max(1.0, math.min(w, h));
        return Center(
          child: SizedBox(
            width: side,
            height: side,
            child: BarcodeWidget(
              barcode: Barcode.qrCode(),
              data: data,
              drawText: false,
              padding: EdgeInsets.zero,
              backgroundColor: Colors.transparent,
              errorBuilder: (_, __) => const SizedBox.shrink(),
            ),
          ),
        );
      },
    );
  }

  Widget _rectangleWidget(Map<String, dynamic> c) {
    final raw = _s(c['COLOR']).trim();
    Color color = Colors.white;
    if (raw.isNotEmpty) {
      final v = raw.toUpperCase();
      if (v == 'WHITE') color = Colors.white;
      if (v == 'BLACK') color = Colors.black;
      if (v == 'RED') color = Colors.red;
      if (v == 'GREEN') color = Colors.green;
      if (v == 'BLUE') color = Colors.blue;
      if (v.startsWith('#')) {
        final hex = v.substring(1);
        final parsed = int.tryParse(hex.length == 6 ? 'FF$hex' : hex, radix: 16);
        if (parsed != null) color = Color(parsed);
      }
    }
    return ColoredBox(color: color);
  }

  Widget _unknownWidget(Map<String, dynamic> c) {
    return const SizedBox.shrink();
  }
}

class _TraAmzLabelPreviewDetailPage extends StatefulWidget {
  const _TraAmzLabelPreviewDetailPage({
    required this.title,
    required this.design,
    required this.offsetXmm,
    required this.offsetYmm,
  });

  final String title;
  final List<Map<String, dynamic>> design;
  final double offsetXmm;
  final double offsetYmm;

  @override
  State<_TraAmzLabelPreviewDetailPage> createState() => _TraAmzLabelPreviewDetailPageState();
}

class _TraAmzLabelPreviewDetailPageState extends State<_TraAmzLabelPreviewDetailPage> {
  static const _mmToPx = 96 / 25.4;

  final TransformationController _tc = TransformationController();

  double _d(dynamic v) => double.tryParse((v ?? '').toString()) ?? 0;

  @override
  void dispose() {
    _tc.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    var maxWmm = 0.0;
    var maxHmm = 0.0;
    for (final d in widget.design) {
      final type = (d['PHANLOAI_DT'] ?? '').toString().toUpperCase();
      final posX = _d(d['POS_X']);
      final posY = _d(d['POS_Y']);

      var wMm = _d(d['SIZE_W']);
      var hMm = _d(d['SIZE_H']);

      if (type == 'TEXT') {
        final szMm = _LabelPreview.measureTextSizeMm(d);
        wMm = math.max(wMm, szMm.width);
        hMm = math.max(hMm, szMm.height);
      }

      final right = posX + wMm;
      final bottom = posY + hMm;
      maxWmm = math.max(maxWmm, right);
      maxHmm = math.max(maxHmm, bottom);
    }

    maxWmm += 1.0;
    maxHmm += 1.0;

    final wPx = maxWmm * _mmToPx;
    final hPx = maxHmm * _mmToPx;

    const rulerThickness = 26.0;

    final viewer = InteractiveViewer(
      transformationController: _tc,
      constrained: false,
      boundaryMargin: const EdgeInsets.all(2000),
      minScale: 0.2,
      maxScale: 10,
      child: _LabelCanvas(
        design: widget.design,
        offsetXmm: widget.offsetXmm,
        offsetYmm: widget.offsetYmm,
        wPx: wPx,
        hPx: hPx,
      ),
    );

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: LayoutBuilder(
        builder: (context, cs) {
          return AnimatedBuilder(
            animation: _tc,
            builder: (context, _) {
              return Stack(
                children: [
                  Padding(
                    padding: const EdgeInsets.only(left: rulerThickness, top: rulerThickness),
                    child: SizedBox.expand(child: viewer),
                  ),
                  Positioned(
                    left: rulerThickness,
                    right: 0,
                    top: 0,
                    height: rulerThickness,
                    child: IgnorePointer(
                      child: CustomPaint(
                        painter: _MmRulerPainter(
                          axis: Axis.horizontal,
                          tcValue: _tc.value,
                          mmToPx: _mmToPx,
                          thickness: rulerThickness,
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    left: 0,
                    top: rulerThickness,
                    bottom: 0,
                    width: rulerThickness,
                    child: IgnorePointer(
                      child: CustomPaint(
                        painter: _MmRulerPainter(
                          axis: Axis.vertical,
                          tcValue: _tc.value,
                          mmToPx: _mmToPx,
                          thickness: rulerThickness,
                        ),
                      ),
                    ),
                  ),
                  const Positioned(
                    left: 0,
                    top: 0,
                    width: rulerThickness,
                    height: rulerThickness,
                    child: IgnorePointer(
                      child: ColoredBox(color: Color(0xFFF3F3F3)),
                    ),
                  ),
                ],
              );
            },
          );
        },
      ),
    );
  }

}

class _LabelCanvas extends StatelessWidget {
  const _LabelCanvas({
    required this.design,
    required this.offsetXmm,
    required this.offsetYmm,
    required this.wPx,
    required this.hPx,
  });

  final List<Map<String, dynamic>> design;
  final double offsetXmm;
  final double offsetYmm;
  final double wPx;
  final double hPx;

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      width: wPx,
      height: hPx,
      child: Stack(
        children: [
          for (final comp in design)
            _LabelPreview(
              design: const [],
              offsetXmm: offsetXmm,
              offsetYmm: offsetYmm,
            )._buildComp(context, comp),
        ],
      ),
    );
  }
}

class _MmRulerPainter extends CustomPainter {
  _MmRulerPainter({
    required this.axis,
    required this.tcValue,
    required this.mmToPx,
    required this.thickness,
  });

  final Axis axis;
  final Matrix4 tcValue;
  final double mmToPx;
  final double thickness;

  @override
  void paint(Canvas canvas, Size size) {
    final posBg = Paint()..color = Colors.white;
    canvas.drawRect(Offset.zero & size, posBg);

    final negBg = Paint()..color = const Color(0xFFE3E3E3);
    final zero = MatrixUtils.transformPoint(tcValue, const Offset(0, 0));
    if (axis == Axis.horizontal) {
      final x0 = zero.dx;
      if (x0 > 0) {
        canvas.drawRect(Rect.fromLTWH(0, 0, x0.clamp(0, size.width), size.height), negBg);
      }
    } else {
      final y0 = zero.dy;
      if (y0 > 0) {
        canvas.drawRect(Rect.fromLTWH(0, 0, size.width, y0.clamp(0, size.height)), negBg);
      }
    }

    final border = Paint()
      ..color = const Color(0xFFBDBDBD)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1;
    canvas.drawRect(Offset.zero & size, border);

    final scale = tcValue.getMaxScaleOnAxis();
    final mmToScreen = mmToPx * (scale.isFinite && scale > 0 ? scale : 1.0);

    var stepMm = 1.0;
    if (mmToScreen < 6) stepMm = 10.0;
    if (mmToScreen >= 6 && mmToScreen < 12) stepMm = 5.0;

    double screenPosForMm(double mm) {
      final designPx = mm * mmToPx;
      final p = axis == Axis.horizontal ? Offset(designPx, 0) : Offset(0, designPx);
      final sp = MatrixUtils.transformPoint(tcValue, p);
      return axis == Axis.horizontal ? sp.dx : sp.dy;
    }

    double mmForScreenPos(double screen) {
      final inv = Matrix4.inverted(tcValue);
      final p = axis == Axis.horizontal ? Offset(screen, 0) : Offset(0, screen);
      final dp = MatrixUtils.transformPoint(inv, p);
      final design = axis == Axis.horizontal ? dp.dx : dp.dy;
      return design / mmToPx;
    }

    final visibleStartMm = mmForScreenPos(0);
    final visibleEndMm = mmForScreenPos(axis == Axis.horizontal ? size.width : size.height);
    final startMm = math.min(visibleStartMm, visibleEndMm);
    final endMm = math.max(visibleStartMm, visibleEndMm);

    final first = (startMm / stepMm).floorToDouble() * stepMm;
    final last = (endMm / stepMm).ceilToDouble() * stepMm;

    final tickPaint = Paint()
      ..color = Colors.black
      ..strokeWidth = 1;

    for (var m = first; m <= last; m += stepMm) {
      final sp = screenPosForMm(m);
      final isMajor10 = (m.round() % 10 == 0);
      final isMajor5 = !isMajor10 && (m.round() % 5 == 0);
      final tickLen = isMajor10
          ? thickness * 0.8
          : isMajor5
              ? thickness * 0.55
              : thickness * 0.35;

      if (axis == Axis.horizontal) {
        canvas.drawLine(Offset(sp, thickness), Offset(sp, thickness - tickLen), tickPaint);
      } else {
        canvas.drawLine(Offset(thickness, sp), Offset(thickness - tickLen, sp), tickPaint);
      }

      if (isMajor10) {
        final text = TextSpan(
          text: m.round().toString(),
          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: Colors.black),
        );
        final tp = TextPainter(text: text, textDirection: TextDirection.ltr);
        tp.layout();
        if (axis == Axis.horizontal) {
          tp.paint(canvas, Offset(sp + 2, 2));
        } else {
          tp.paint(canvas, Offset(2, sp - tp.height / 2));
        }
      }
    }
  }

  @override
  bool shouldRepaint(covariant _MmRulerPainter oldDelegate) {
    return oldDelegate.tcValue != tcValue || oldDelegate.axis != axis;
  }
}
