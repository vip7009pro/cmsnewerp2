import 'dart:math' as math;
import 'dart:io';
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:barcode_widget/barcode_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../../app/app_drawer.dart';
import '../../../../core/config/app_config.dart';
import '../../../../core/providers.dart';

class DesignAmazonPage extends ConsumerStatefulWidget {
  const DesignAmazonPage({super.key});

  @override
  ConsumerState<DesignAmazonPage> createState() => _DesignAmazonPageState();
}

class _DesignAmazonPageState extends ConsumerState<DesignAmazonPage> {
  static const _mmToPx = 96 / 25.4;
  static const _pxToMm = 25.4 / 96;

  final TransformationController _tc = TransformationController();

  bool _loading = false;
  bool _didAutoFitCanvas = false;
  bool _snapEnabled = true;
  static const double _snapThresholdMm = 0.5;
  final List<double> _guideXpx = <double>[];
  final List<double> _guideYpx = <double>[];
  bool _transformRebuildQueued = false;

  void _onTransformChanged() {
    if (!mounted) return;

    if (_transformRebuildQueued) return;
    _transformRebuildQueued = true;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _transformRebuildQueued = false;
      if (!mounted) return;
      if (SchedulerBinding.instance.schedulerPhase == SchedulerPhase.persistentCallbacks) return;
      setState(() {});
    });
  }

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

  Size _measureTextSizeMm(Map<String, dynamic> comp) {
    final value = _s(comp['GIATRI']);
    final isMultiline = value.contains('\n');
    final fontPt = _d(comp['FONT_SIZE']);
    final styleFlag = _s(comp['FONT_STYLE']).toUpperCase();

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
  void initState() {
    super.initState();
    _tc.addListener(_onTransformChanged);
  }

  final TextEditingController _codeSearchCtrl = TextEditingController();
  List<Map<String, dynamic>> _codeRows = const [];

  String _gCode = '';
  String _gName = '';

  List<Map<String, dynamic>> _components = <Map<String, dynamic>>[];
  int? _selectedIdx;
  final Set<int> _selectedSet = <int>{};
  bool _multiSelectMode = false;

  final List<List<Map<String, dynamic>>> _historyPast = [];
  final List<List<Map<String, dynamic>>> _historyFuture = [];

  final TextEditingController _giatriCtrl = TextEditingController();
  final TextEditingController _posXCtrl = TextEditingController();
  final TextEditingController _posYCtrl = TextEditingController();
  final TextEditingController _wCtrl = TextEditingController();
  final TextEditingController _hCtrl = TextEditingController();
  final TextEditingController _rotateCtrl = TextEditingController();
  final TextEditingController _fontSizeCtrl = TextEditingController();
  final TextEditingController _fontStyleCtrl = TextEditingController();

  String _newComponentType = 'TEXT';

  String _s(dynamic v) => (v ?? '').toString();
  double _d(dynamic v) => double.tryParse(_s(v)) ?? 0;

  bool _isNg(dynamic body) => body is Map<String, dynamic> && (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  @override
  void dispose() {
    _tc.removeListener(_onTransformChanged);
    _tc.dispose();
    _codeSearchCtrl.dispose();

    _giatriCtrl.dispose();
    _posXCtrl.dispose();
    _posYCtrl.dispose();
    _wCtrl.dispose();
    _hCtrl.dispose();
    _rotateCtrl.dispose();
    _fontSizeCtrl.dispose();
    _fontStyleCtrl.dispose();

    super.dispose();
  }

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  double _scale() {
    final s = _tc.value.getMaxScaleOnAxis();
    if (s.isNaN || s <= 0) return 1;
    return s;
  }

  List<Map<String, dynamic>> _cloneList(List<Map<String, dynamic>> list) {
    return list.map((e) => Map<String, dynamic>.from(e)).toList();
  }

  void _commit(List<Map<String, dynamic>> next) {
    _historyPast.add(_cloneList(_components));
    _historyFuture.clear();
    setState(() {
      _components = next;
    });
  }

  void _undo() {
    if (_historyPast.isEmpty) return;
    final prev = _historyPast.removeLast();
    _historyFuture.insert(0, _cloneList(_components));
    setState(() {
      _components = _cloneList(prev);
      _selectedIdx = null;
    });
  }

  void _redo() {
    if (_historyFuture.isEmpty) return;
    final next = _historyFuture.removeAt(0);
    _historyPast.add(_cloneList(_components));
    setState(() {
      _components = _cloneList(next);
      _selectedIdx = null;
    });
  }

  Future<Map<String, dynamic>> _post(String command, Map<String, dynamic> data) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(command, data: data);
    final body = res.data;
    if (body is Map<String, dynamic>) return body;
    return <String, dynamic>{'tk_status': 'NG', 'message': 'Bad response'};
  }

  Future<void> _searchCode() async {
    setState(() => _loading = true);
    try {
      final body = await _post('codeinfo', {'G_NAME': _codeSearchCtrl.text.trim()});
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() {
          _codeRows = const [];
          _loading = false;
        });
        _snack('Không có data');
        return;
      }

      final data = body['data'];
      final rows = (data is List ? data : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList(growable: false);

      if (!mounted) return;
      setState(() {
        _codeRows = rows;
        _loading = false;
      });
      _snack('Đã load ${rows.length} dòng');
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Future<void> _loadDesign(String gCode, String gName) async {
    setState(() {
      _loading = true;
      _gCode = gCode;
      _gName = gName;
      _components = <Map<String, dynamic>>[];
      _selectedIdx = null;
      _selectedSet.clear();
      _multiSelectMode = false;
      _didAutoFitCanvas = false;
      _historyPast.clear();
      _historyFuture.clear();
    });

    try {
      final body = await _post('getAMAZON_DESIGN', {'G_CODE': gCode});
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() => _loading = false);
        _snack('Không có design');
        return;
      }

      final data = body['data'];
      final comps = (data is List ? data : const [])
          .whereType<Map>()
          .map((e) => e.map((k, v) => MapEntry(k.toString(), v)))
          .toList();

      if (!mounted) return;
      setState(() {
        _components = comps;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  void _select(int idx) {
    if (idx < 0 || idx >= _components.length) return;
    final c = _components[idx];
    setState(() => _selectedIdx = idx);

    if (!_multiSelectMode) {
      _selectedSet
        ..clear()
        ..add(idx);
    } else {
      _selectedSet.add(idx);
    }

    _giatriCtrl.text = _s(c['GIATRI']);
    _posXCtrl.text = _d(c['POS_X']).toString();
    _posYCtrl.text = _d(c['POS_Y']).toString();
    _wCtrl.text = _d(c['SIZE_W']).toString();
    _hCtrl.text = _d(c['SIZE_H']).toString();
    _rotateCtrl.text = _d(c['ROTATE']).toString();
    _fontSizeCtrl.text = _d(c['FONT_SIZE']).toString();
    _fontStyleCtrl.text = _s(c['FONT_STYLE']);
  }

  void _toggleMultiSelectFor(int idx) {
    if (idx < 0 || idx >= _components.length) return;
    setState(() {
      _multiSelectMode = true;
      if (_selectedSet.contains(idx)) {
        _selectedSet.remove(idx);
      } else {
        _selectedSet.add(idx);
      }
      _selectedIdx = _selectedSet.isEmpty ? null : idx;
    });
    if (_selectedIdx != null) {
      _select(_selectedIdx!);
    }
  }

  void _clearSelection() {
    setState(() {
      _selectedIdx = null;
      _selectedSet.clear();
      _multiSelectMode = false;
    });
  }

  void _clearGuides() {
    _guideXpx.clear();
    _guideYpx.clear();
  }

  void _setGuides({required List<double> xPx, required List<double> yPx}) {
    _guideXpx
      ..clear()
      ..addAll(xPx);
    _guideYpx
      ..clear()
      ..addAll(yPx);
  }

  ({double xMm, double yMm, List<double> gxPx, List<double> gyPx}) _snapMove({
    required double xMm,
    required double yMm,
    required double wMm,
    required double hMm,
    required Set<int> moving,
  }) {
    if (!_snapEnabled) {
      return (xMm: xMm, yMm: yMm, gxPx: const <double>[], gyPx: const <double>[]);
    }

    final othersX = <double>[];
    final othersY = <double>[];
    for (var i = 0; i < _components.length; i++) {
      if (moving.contains(i)) continue;
      final c = _components[i];
      final ox = _d(c['POS_X']);
      final oy = _d(c['POS_Y']);
      final ow = _d(c['SIZE_W']);
      final oh = _d(c['SIZE_H']);
      othersX.addAll([ox, ox + ow / 2, ox + ow]);
      othersY.addAll([oy, oy + oh / 2, oy + oh]);
    }

    double bestDx = 0;
    var bestAbsDx = double.infinity;
    double? bestGuideX;
    final anchorsX = <double, double>{
      xMm: xMm,
      xMm + wMm / 2: xMm + wMm / 2,
      xMm + wMm: xMm + wMm,
    };
    for (final ax in anchorsX.keys) {
      for (final bx in othersX) {
        final diff = bx - ax;
        final ad = diff.abs();
        if (ad <= _snapThresholdMm && ad < bestAbsDx) {
          bestAbsDx = ad;
          bestDx = diff;
          bestGuideX = bx;
        }
      }
    }

    double bestDy = 0;
    var bestAbsDy = double.infinity;
    double? bestGuideY;
    final anchorsY = <double, double>{
      yMm: yMm,
      yMm + hMm / 2: yMm + hMm / 2,
      yMm + hMm: yMm + hMm,
    };
    for (final ay in anchorsY.keys) {
      for (final by in othersY) {
        final diff = by - ay;
        final ad = diff.abs();
        if (ad <= _snapThresholdMm && ad < bestAbsDy) {
          bestAbsDy = ad;
          bestDy = diff;
          bestGuideY = by;
        }
      }
    }

    final gx = <double>[];
    final gy = <double>[];
    if (bestGuideX != null) gx.add(bestGuideX * _mmToPx);
    if (bestGuideY != null) gy.add(bestGuideY * _mmToPx);

    return (xMm: xMm + bestDx, yMm: yMm + bestDy, gxPx: gx, gyPx: gy);
  }

  ({double wMm, double hMm, List<double> gxPx, List<double> gyPx}) _snapResizeBottomRight({
    required double xMm,
    required double yMm,
    required double wMm,
    required double hMm,
    required Set<int> moving,
  }) {
    if (!_snapEnabled) {
      return (wMm: wMm, hMm: hMm, gxPx: const <double>[], gyPx: const <double>[]);
    }

    final othersX = <double>[];
    final othersY = <double>[];
    for (var i = 0; i < _components.length; i++) {
      if (moving.contains(i)) continue;
      final c = _components[i];
      final ox = _d(c['POS_X']);
      final oy = _d(c['POS_Y']);
      final ow = _d(c['SIZE_W']);
      final oh = _d(c['SIZE_H']);
      othersX.addAll([ox, ox + ow / 2, ox + ow]);
      othersY.addAll([oy, oy + oh / 2, oy + oh]);
    }

    final right = xMm + wMm;
    final cx = xMm + wMm / 2;
    double bestDw = 0;
    var bestAbsDw = double.infinity;
    double? bestGuideX;

    for (final bx in othersX) {
      final diffR = bx - right;
      final adR = diffR.abs();
      if (adR <= _snapThresholdMm && adR < bestAbsDw) {
        bestAbsDw = adR;
        bestDw = diffR;
        bestGuideX = bx;
      }
      final diffC = bx - cx;
      final adC = diffC.abs();
      if (adC <= _snapThresholdMm && adC < bestAbsDw) {
        bestAbsDw = adC;
        bestDw = diffC * 2;
        bestGuideX = bx;
      }
    }

    final bottom = yMm + hMm;
    final cy = yMm + hMm / 2;
    double bestDh = 0;
    var bestAbsDh = double.infinity;
    double? bestGuideY;

    for (final by in othersY) {
      final diffB = by - bottom;
      final adB = diffB.abs();
      if (adB <= _snapThresholdMm && adB < bestAbsDh) {
        bestAbsDh = adB;
        bestDh = diffB;
        bestGuideY = by;
      }
      final diffC = by - cy;
      final adC = diffC.abs();
      if (adC <= _snapThresholdMm && adC < bestAbsDh) {
        bestAbsDh = adC;
        bestDh = diffC * 2;
        bestGuideY = by;
      }
    }

    final nw = math.max(0.01, wMm + bestDw);
    final nh = math.max(0.01, hMm + bestDh);

    final gx = <double>[];
    final gy = <double>[];
    if (bestGuideX != null) gx.add(bestGuideX * _mmToPx);
    if (bestGuideY != null) gy.add(bestGuideY * _mmToPx);

    return (wMm: nw, hMm: nh, gxPx: gx, gyPx: gy);
  }

  static const _prefOffsetX = 'AMZ_PrintOffsetX';
  static const _prefOffsetY = 'AMZ_PrintOffsetY';
  static const _prefPrinterIp = 'AMZ_PrinterIp';
  static const _prefPrinterPort = 'AMZ_PrinterPort';
  static const _dpi = 600.0;
  static const _dotsPerMm = _dpi / 25.4;

  Future<void> _printTest() async {
    if (_components.isEmpty) {
      _snack('Chưa có component để in');
      return;
    }

    final prefs = await SharedPreferences.getInstance();
    var ip = prefs.getString(_prefPrinterIp) ?? '';
    var port = prefs.getInt(_prefPrinterPort) ?? 9100;
    var ox = prefs.getDouble(_prefOffsetX) ?? 0.0;
    var oy = prefs.getDouble(_prefOffsetY) ?? 0.0;

    if (!mounted) return;
    final ok = await showDialog<bool>(
          context: context,
          builder: (ctx) {
            final ipCtrl = TextEditingController(text: ip);
            final portCtrl = TextEditingController(text: port.toString());
            final oxCtrl = TextEditingController(text: ox.toString());
            final oyCtrl = TextEditingController(text: oy.toString());
            return AlertDialog(
              title: const Text('Print test (Zebra LAN)'),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(
                      controller: ipCtrl,
                      decoration: const InputDecoration(labelText: 'Printer IP'),
                    ),
                    TextField(
                      controller: portCtrl,
                      decoration: const InputDecoration(labelText: 'Port'),
                      keyboardType: TextInputType.number,
                    ),
                    TextField(
                      controller: oxCtrl,
                      decoration: const InputDecoration(labelText: 'Offset X (mm)'),
                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
                    ),
                    TextField(
                      controller: oyCtrl,
                      decoration: const InputDecoration(labelText: 'Offset Y (mm)'),
                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Cancel')),
                FilledButton(
                  onPressed: () {
                    ip = ipCtrl.text.trim();
                    port = int.tryParse(portCtrl.text.trim()) ?? 9100;
                    ox = double.tryParse(oxCtrl.text.trim()) ?? 0.0;
                    oy = double.tryParse(oyCtrl.text.trim()) ?? 0.0;
                    Navigator.of(ctx).pop(true);
                  },
                  child: const Text('Print'),
                ),
              ],
            );
          },
        ) ??
        false;

    if (!ok) return;
    if (ip.isEmpty) {
      _snack('Vui lòng nhập Printer IP');
      return;
    }

    await prefs.setString(_prefPrinterIp, ip);
    await prefs.setInt(_prefPrinterPort, port);
    await prefs.setDouble(_prefOffsetX, ox);
    await prefs.setDouble(_prefOffsetY, oy);

    try {
      final zpl = await _renderLabelToZpl(_cloneList(_components), offsetXmm: ox, offsetYmm: oy);
      await _sendZplToPrinter(zpl, printerIp: ip, printerPort: port);
      _snack('Đã gửi lệnh in test');
    } catch (e) {
      _snack('Print lỗi: $e');
    }
  }

  Future<void> _sendZplToPrinter(String zpl, {required String printerIp, required int printerPort}) async {
    final socket = await Socket.connect(
      printerIp.trim(),
      printerPort,
      timeout: const Duration(seconds: 5),
    );
    socket.add(Uint8List.fromList(zpl.codeUnits));
    await socket.flush();
    await socket.close();
  }

  Future<String> _renderLabelToZpl(
    List<Map<String, dynamic>> design, {
    required double offsetXmm,
    required double offsetYmm,
  }) async {
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

      final right = posX + wMm + offsetXmm;
      final bottom = posY + hMm + offsetYmm;
      maxWmm = math.max(maxWmm, right);
      maxHmm = math.max(maxHmm, bottom);
    }

    maxWmm += 1.0;
    maxHmm += 1.0;

    final wDots = math.max(1, (maxWmm * _dotsPerMm).round());
    final hDots = math.max(1, (maxHmm * _dotsPerMm).round());

    final image = await _rasterizeLabelToImage(design, wDots: wDots, hDots: hDots, offsetXmm: offsetXmm, offsetYmm: offsetYmm);
    final byteData = await image.toByteData(format: ui.ImageByteFormat.rawRgba);
    if (byteData == null) throw Exception('Failed to rasterize label');

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
    required double offsetXmm,
    required double offsetYmm,
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
                      _PrintRasterComp(
                        comp: comp,
                        dotsPerMm: _dotsPerMm,
                        offsetXmm: offsetXmm,
                        offsetYmm: offsetYmm,
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
        if (isBlack) cur |= (1 << bit);
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

  double _snap01(double mm) {
    return (mm * 10).roundToDouble() / 10;
  }

  void _deleteSelected() {
    if (_selectedSet.isEmpty) return;
    final keep = <Map<String, dynamic>>[];
    for (var i = 0; i < _components.length; i++) {
      if (_selectedSet.contains(i)) continue;
      keep.add(_components[i]);
    }
    _commit(keep);
    _clearSelection();
  }

  void _duplicateSelected() {
    if (_selectedSet.isEmpty) return;
    final next = _cloneList(_components);
    var maxNo = -1;
    for (final c in next) {
      maxNo = math.max(maxNo, int.tryParse(_s(c['DOITUONG_NO'])) ?? 0);
    }
    final newly = <int>[];
    for (final idx in _selectedSet.toList()..sort()) {
      if (idx < 0 || idx >= _components.length) continue;
      final base = Map<String, dynamic>.from(_components[idx]);
      maxNo++;
      base['DOITUONG_NO'] = maxNo;
      base['DOITUONG_STT'] = 'A$maxNo';
      base['POS_X'] = _snap01(_d(base['POS_X']) + 0.2);
      base['POS_Y'] = _snap01(_d(base['POS_Y']) + 0.2);
      next.add(base);
      newly.add(next.length - 1);
    }
    _commit(next);
    setState(() {
      _multiSelectMode = true;
      _selectedSet
        ..clear()
        ..addAll(newly);
      _selectedIdx = newly.isEmpty ? null : newly.last;
    });
    if (_selectedIdx != null) _select(_selectedIdx!);
  }

  void _bringToFront() {
    if (_selectedSet.isEmpty) return;
    final selected = _selectedSet.toList()..sort();
    final keep = <Map<String, dynamic>>[];
    final moved = <Map<String, dynamic>>[];
    for (var i = 0; i < _components.length; i++) {
      if (selected.contains(i)) {
        moved.add(_components[i]);
      } else {
        keep.add(_components[i]);
      }
    }
    final next = [...keep, ...moved];
    _commit(next);
    setState(() {
      _multiSelectMode = true;
      _selectedSet
        ..clear()
        ..addAll(List<int>.generate(moved.length, (k) => keep.length + k));
      _selectedIdx = _selectedSet.isEmpty ? null : _selectedSet.last;
    });
    if (_selectedIdx != null) _select(_selectedIdx!);
  }

  void _sendToBack() {
    if (_selectedSet.isEmpty) return;
    final selected = _selectedSet.toList()..sort();
    final keep = <Map<String, dynamic>>[];
    final moved = <Map<String, dynamic>>[];
    for (var i = 0; i < _components.length; i++) {
      if (selected.contains(i)) {
        moved.add(_components[i]);
      } else {
        keep.add(_components[i]);
      }
    }
    final next = [...moved, ...keep];
    _commit(next);
    setState(() {
      _multiSelectMode = true;
      _selectedSet
        ..clear()
        ..addAll(List<int>.generate(moved.length, (k) => k));
      _selectedIdx = _selectedSet.isEmpty ? null : _selectedSet.last;
    });
    if (_selectedIdx != null) _select(_selectedIdx!);
  }

  void _applySelectedFromForm({bool commit = true}) {
    final idx = _selectedIdx;
    if (idx == null || idx < 0 || idx >= _components.length) return;

    final next = _cloneList(_components);
    final c = Map<String, dynamic>.from(next[idx]);
    c['GIATRI'] = _giatriCtrl.text;
    c['POS_X'] = double.tryParse(_posXCtrl.text) ?? _d(c['POS_X']);
    c['POS_Y'] = double.tryParse(_posYCtrl.text) ?? _d(c['POS_Y']);
    c['SIZE_W'] = double.tryParse(_wCtrl.text) ?? _d(c['SIZE_W']);
    c['SIZE_H'] = double.tryParse(_hCtrl.text) ?? _d(c['SIZE_H']);
    c['ROTATE'] = double.tryParse(_rotateCtrl.text) ?? _d(c['ROTATE']);
    c['FONT_SIZE'] = double.tryParse(_fontSizeCtrl.text) ?? _d(c['FONT_SIZE']);
    c['FONT_STYLE'] = _fontStyleCtrl.text;

    next[idx] = c;
    if (commit) {
      _commit(next);
    } else {
      setState(() => _components = next);
    }
  }

  void _nudge({required double dxMm, required double dyMm}) {
    final idx = _selectedIdx;
    if (idx == null) return;
    final next = _cloneList(_components);
    final c = Map<String, dynamic>.from(next[idx]);
    c['POS_X'] = math.max(0, _d(c['POS_X']) + dxMm);
    c['POS_Y'] = math.max(0, _d(c['POS_Y']) + dyMm);
    next[idx] = c;
    _commit(next);
    _select(idx);
  }

  void _resizeSelected({required double dwMm, required double dhMm}) {
    final idx = _selectedIdx;
    if (idx == null) return;
    final next = _cloneList(_components);
    final c = Map<String, dynamic>.from(next[idx]);
    c['SIZE_W'] = math.max(0.01, _d(c['SIZE_W']) + dwMm);
    c['SIZE_H'] = math.max(0.01, _d(c['SIZE_H']) + dhMm);
    next[idx] = c;
    _commit(next);
    _select(idx);
  }

  void _addComponent() {
    if (_gCode.trim().isEmpty) {
      _snack('Chọn code trước');
      return;
    }

    var maxNo = -1;
    for (final c in _components) {
      maxNo = math.max(maxNo, int.tryParse(_s(c['DOITUONG_NO'])) ?? 0);
    }

    final nextNo = maxNo + 1;
    final newComp = <String, dynamic>{
      'G_CODE_MAU': _gCode,
      'DOITUONG_NO': nextNo,
      'DOITUONG_NAME': _newComponentType,
      'PHANLOAI_DT': _newComponentType,
      'DOITUONG_STT': 'A$nextNo',
      'CAVITY_PRINT': 2,
      'GIATRI': '',
      'FONT_NAME': 'Arial',
      'FONT_SIZE': 6,
      'FONT_STYLE': 'B',
      'POS_X': 0,
      'POS_Y': 0,
      'SIZE_W': 9,
      'SIZE_H': 9,
      'ROTATE': 0,
      'REMARK': '',
    };

    final next = [..._cloneList(_components), newComp];
    _commit(next);
    _select(next.length - 1);
  }

  Future<bool> _checkDesignExist(String gCode) async {
    final body = await _post('checkDesignExistAMZ', {'G_CODE': gCode});
    return !_isNg(body);
  }

  Future<void> _deleteDesign(String gCode) async {
    await _post('deleteAMZDesign', {'G_CODE': gCode});
  }

  Future<void> _saveDesign() async {
    if (_gCode.trim().isEmpty) {
      _snack('Chọn code phôi để lưu');
      return;
    }
    if (_components.isEmpty) {
      _snack('Tạo ít nhất 1 component');
      return;
    }

    final ok = await showDialog<bool>(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text('Xác nhận'),
            content: const Text('Chắc chắn muốn lưu DESIGN AMAZON? Sẽ ghi đè design cũ.'),
            actions: [
              TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Cancel')),
              FilledButton(onPressed: () => Navigator.of(ctx).pop(true), child: const Text('OK')),
            ],
          ),
        ) ??
        false;
    if (!ok) return;

    setState(() => _loading = true);
    try {
      final exist = await _checkDesignExist(_gCode);
      if (exist) {
        await _deleteDesign(_gCode);
      }

      var err = '';
      for (final c in _components) {
        final payload = Map<String, dynamic>.from(c);
        payload['G_CODE_MAU'] = _gCode;
        final body = await _post('insertAMZDesign', payload);
        if (_isNg(body)) {
          err += '| ${_s(body['message'])}';
        }
      }

      if (!mounted) return;
      setState(() => _loading = false);

      if (err.isEmpty) {
        _historyPast.clear();
        _historyFuture.clear();
        _snack('Lưu DESIGN thành công');
      } else {
        _snack('Thất bại: $err');
      }
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Size _designSizePx() {
    var maxWmm = 0.0;
    var maxHmm = 0.0;

    for (final c in _components) {
      final type = _s(c['PHANLOAI_DT']).toUpperCase();
      final posX = _d(c['POS_X']);
      final posY = _d(c['POS_Y']);

      var wMm = _d(c['SIZE_W']);
      var hMm = _d(c['SIZE_H']);

      if (type == 'TEXT') {
        final szMm = _measureTextSizeMm(c);
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

    maxWmm = math.max(10, maxWmm);
    maxHmm = math.max(10, maxHmm);

    return Size(maxWmm * _mmToPx, maxHmm * _mmToPx);
  }

  Widget _canvas() {
    final designSize = _designSizePx();

    return LayoutBuilder(
      builder: (ctx, cs) {
        final viewportW = cs.maxWidth.isFinite ? cs.maxWidth : designSize.width;
        final viewportH = cs.maxHeight.isFinite ? cs.maxHeight : designSize.height;

        final fitScaleW = viewportW / designSize.width;
        final fitScaleH = viewportH / designSize.height;
        final fitScale = math.min(1.0, math.min(fitScaleW, fitScaleH)).clamp(0.25, 10.0);

        if (!_didAutoFitCanvas && viewportW > 0 && viewportH > 0) {
          _tc.value = Matrix4.identity()..scale(fitScale);
          WidgetsBinding.instance.addPostFrameCallback((_) {
            if (!mounted) return;
            setState(() => _didAutoFitCanvas = true);
          });
        }

        const rulerThickness = 26.0;

        final viewer = InteractiveViewer(
          transformationController: _tc,
          minScale: 0.25,
          maxScale: 10,
          boundaryMargin: const EdgeInsets.all(400),
          child: Container(
            color: Colors.white,
            width: math.max(designSize.width, viewportW),
            height: math.max(designSize.height, viewportH),
            child: SizedBox(
              width: designSize.width,
              height: designSize.height,
              child: Stack(
                children: [
                  Positioned.fill(
                    child: GestureDetector(
                      behavior: HitTestBehavior.opaque,
                      onTap: _clearSelection,
                      child: const SizedBox.shrink(),
                    ),
                  ),
                  for (var i = 0; i < _components.length; i++) _compWidget(i),
                  Positioned.fill(
                    child: IgnorePointer(
                      child: CustomPaint(
                        painter: _GuidelinesPainter(xPx: _guideXpx, yPx: _guideYpx),
                      ),
                    ),
                  ),
                  if (_selectedIdx != null) _selectionOverlay(_selectedIdx!),
                ],
              ),
            ),
          ),
        );

        return AnimatedBuilder(
          animation: _tc,
          builder: (context, _) {
            return Stack(
              children: [
                Padding(
                  padding: const EdgeInsets.only(left: rulerThickness, top: rulerThickness),
                  child: viewer,
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
                Positioned(
                  left: 0,
                  top: 0,
                  width: rulerThickness,
                  height: rulerThickness,
                  child: IgnorePointer(
                    child: ColoredBox(
                      color: Color(0xFFF3F3F3),
                      child: SizedBox.shrink(),
                    ),
                  ),
                ),
              ],
            );
          },
        );
      },
    );
  }

  Widget _compWidget(int idx) {
    final c = _components[idx];
    final x = _d(c['POS_X']) * _mmToPx;
    final y = _d(c['POS_Y']) * _mmToPx;
    final w = math.max(1.0, _d(c['SIZE_W']) * _mmToPx);
    final h = math.max(1.0, _d(c['SIZE_H']) * _mmToPx);
    final rotateDeg = _d(c['ROTATE']);

    final type = _s(c['PHANLOAI_DT']).toUpperCase();
    final norm = type.replaceAll(' ', '');
    final child = switch (type) {
      'TEXT' => _textWidget(c),
      'IMAGE' => _imageWidget(c),
      '1D BARCODE' => _barcodeWidget(c, is2d: false),
      '2D MATRIX' => _barcodeWidget(c, is2d: true),
      'QRCODE' => _qrWidget(c),
      'RECTANGLE' => _rectangleWidget(c),
      'CONTAINER' => const SizedBox.shrink(),
      _ when norm.contains('BARCODE') => _barcodeWidget(c, is2d: false),
      _ when norm.contains('DATAMATRIX') => _barcodeWidget(c, is2d: true),
      _ => const SizedBox.shrink(),
    };

    return Positioned(
      left: x,
      top: y,
      child: GestureDetector(
        behavior: HitTestBehavior.translucent,
        onTap: () {
          if (_multiSelectMode) {
            _toggleMultiSelectFor(idx);
          } else {
            _select(idx);
          }
        },
        onLongPress: () => _toggleMultiSelectFor(idx),
        onPanStart: (_) {
          if (_selectedIdx != idx && !_multiSelectMode) _select(idx);
          if (_selectedSet.isEmpty) _selectedSet.add(idx);
        },
        onPanUpdate: (d) {
          final sc = _scale();
          final dxMm = (d.delta.dx * _pxToMm) / sc;
          final dyMm = (d.delta.dy * _pxToMm) / sc;

          final next = _cloneList(_components);
          final targets = _selectedSet.isEmpty ? <int>{idx} : _selectedSet;
          final moving = targets;

          final gx = <double>[];
          final gy = <double>[];
          for (final t in targets) {
            if (t < 0 || t >= next.length) continue;
            final cur = Map<String, dynamic>.from(next[t]);

            final wMm = _d(cur['SIZE_W']);
            final hMm = _d(cur['SIZE_H']);

            var nx = _d(cur['POS_X']) + dxMm;
            var ny = _d(cur['POS_Y']) + dyMm;
            nx = math.max(0.0, nx);
            ny = math.max(0.0, ny);

            final snapped = _snapMove(xMm: nx, yMm: ny, wMm: wMm, hMm: hMm, moving: moving);
            nx = snapped.xMm;
            ny = snapped.yMm;
            gx.addAll(snapped.gxPx);
            gy.addAll(snapped.gyPx);

            cur['POS_X'] = _snap01(nx);
            cur['POS_Y'] = _snap01(ny);
            next[t] = cur;
          }
          setState(() {
            _components = next;
            _setGuides(xPx: gx, yPx: gy);
          });
          if (_selectedIdx != null) _select(_selectedIdx!);
        },
        onPanEnd: (_) {
          final idxNow = _selectedIdx;
          setState(_clearGuides);
          if (idxNow != null) {
            _commit(_cloneList(_components));
            _select(idxNow);
          }
        },
        child: Transform.rotate(
          angle: rotateDeg * math.pi / 180,
          alignment: Alignment.topLeft,
          child: Container(
            decoration: BoxDecoration(
              border: _selectedSet.contains(idx)
                  ? Border.all(color: Colors.blue.withValues(alpha: 0.65), width: 1)
                  : null,
            ),
            child: SizedBox(width: w, height: h, child: child),
          ),
        ),
      ),
    );
  }

  Widget _selectionOverlay(int idx) {
    final c = _components[idx];
    final x = _d(c['POS_X']) * _mmToPx;
    final y = _d(c['POS_Y']) * _mmToPx;
    final w = math.max(1.0, _d(c['SIZE_W']) * _mmToPx);
    final h = math.max(1.0, _d(c['SIZE_H']) * _mmToPx);

    Widget handle({required Alignment align, required void Function(DragUpdateDetails d) onUpdate, required VoidCallback onEnd}) {
      return Align(
        alignment: align,
        child: GestureDetector(
          onPanUpdate: onUpdate,
          onPanEnd: (_) => onEnd(),
          child: Container(
            width: 14,
            height: 14,
            decoration: BoxDecoration(
              color: Colors.blue,
              border: Border.all(color: Colors.white, width: 1),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
        ),
      );
    }

    void commitNow() {
      final idxNow = _selectedIdx;
      setState(_clearGuides);
      if (idxNow != null) {
        _commit(_cloneList(_components));
        _select(idxNow);
      }
    }

    return Positioned(
      left: x,
      top: y,
      child: IgnorePointer(
        ignoring: false,
        child: SizedBox(
          width: w,
          height: h,
          child: Stack(
            children: [
              Positioned.fill(
                child: Container(
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.blue, width: 1.2),
                  ),
                ),
              ),
              handle(
                align: Alignment.topLeft,
                onUpdate: (d) {
                  final sc = _scale();
                  final dxMm = (d.delta.dx * _pxToMm) / sc;
                  final dyMm = (d.delta.dy * _pxToMm) / sc;
                  final next = _cloneList(_components);
                  final cur = Map<String, dynamic>.from(next[idx]);
                  var nx = math.max(0.0, _d(cur['POS_X']) + dxMm);
                  var ny = math.max(0.0, _d(cur['POS_Y']) + dyMm);
                  final nw = _snap01(math.max(0.01, _d(cur['SIZE_W']) - dxMm)).toDouble();
                  final nh = _snap01(math.max(0.01, _d(cur['SIZE_H']) - dyMm)).toDouble();

                  final snapped = _snapMove(xMm: nx, yMm: ny, wMm: nw, hMm: nh, moving: <int>{idx});
                  nx = snapped.xMm;
                  ny = snapped.yMm;

                  cur['POS_X'] = nx;
                  cur['POS_Y'] = ny;
                  cur['SIZE_W'] = nw;
                  cur['SIZE_H'] = nh;
                  next[idx] = cur;
                  setState(() {
                    _components = next;
                    _setGuides(xPx: snapped.gxPx, yPx: snapped.gyPx);
                  });
                  _select(idx);
                },
                onEnd: commitNow,
              ),
              handle(
                align: Alignment.topRight,
                onUpdate: (d) {
                  final sc = _scale();
                  final dxMm = (d.delta.dx * _pxToMm) / sc;
                  final dyMm = (d.delta.dy * _pxToMm) / sc;
                  final next = _cloneList(_components);
                  final cur = Map<String, dynamic>.from(next[idx]);
                  var ny = math.max(0.0, _d(cur['POS_Y']) + dyMm);
                  final nw = _snap01(math.max(0.01, _d(cur['SIZE_W']) + dxMm)).toDouble();
                  final nh = _snap01(math.max(0.01, _d(cur['SIZE_H']) - dyMm)).toDouble();

                  final snapped = _snapMove(xMm: _d(cur['POS_X']), yMm: ny, wMm: nw, hMm: nh, moving: <int>{idx});
                  ny = snapped.yMm;

                  cur['POS_Y'] = ny;
                  cur['SIZE_W'] = nw;
                  cur['SIZE_H'] = nh;
                  next[idx] = cur;
                  setState(() {
                    _components = next;
                    _setGuides(xPx: snapped.gxPx, yPx: snapped.gyPx);
                  });
                  _select(idx);
                },
                onEnd: commitNow,
              ),
              handle(
                align: Alignment.bottomLeft,
                onUpdate: (d) {
                  final sc = _scale();
                  final dxMm = (d.delta.dx * _pxToMm) / sc;
                  final dyMm = (d.delta.dy * _pxToMm) / sc;
                  final next = _cloneList(_components);
                  final cur = Map<String, dynamic>.from(next[idx]);
                  var nx = math.max(0.0, _d(cur['POS_X']) + dxMm);
                  final nw = _snap01(math.max(0.01, _d(cur['SIZE_W']) - dxMm)).toDouble();
                  final nh = _snap01(math.max(0.01, _d(cur['SIZE_H']) + dyMm)).toDouble();

                  final snapped = _snapMove(xMm: nx, yMm: _d(cur['POS_Y']), wMm: nw, hMm: nh, moving: <int>{idx});
                  nx = snapped.xMm;

                  cur['POS_X'] = nx;
                  cur['SIZE_W'] = nw;
                  cur['SIZE_H'] = nh;
                  next[idx] = cur;
                  setState(() {
                    _components = next;
                    _setGuides(xPx: snapped.gxPx, yPx: snapped.gyPx);
                  });
                  _select(idx);
                },
                onEnd: commitNow,
              ),
              handle(
                align: Alignment.bottomRight,
                onUpdate: (d) {
                  final sc = _scale();
                  final dwMm = (d.delta.dx * _pxToMm) / sc;
                  final dhMm = (d.delta.dy * _pxToMm) / sc;
                  final next = _cloneList(_components);
                  final cur = Map<String, dynamic>.from(next[idx]);
                  var nw = _snap01(math.max(0.01, _d(cur['SIZE_W']) + dwMm)).toDouble();
                  var nh = _snap01(math.max(0.01, _d(cur['SIZE_H']) + dhMm)).toDouble();
                  final snapped = _snapResizeBottomRight(
                    xMm: _d(cur['POS_X']),
                    yMm: _d(cur['POS_Y']),
                    wMm: nw,
                    hMm: nh,
                    moving: <int>{idx},
                  );
                  nw = snapped.wMm;
                  nh = snapped.hMm;

                  cur['SIZE_W'] = nw;
                  cur['SIZE_H'] = nh;
                  next[idx] = cur;
                  setState(() {
                    _components = next;
                    _setGuides(xPx: snapped.gxPx, yPx: snapped.gyPx);
                  });
                  _select(idx);
                },
                onEnd: commitNow,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _textWidget(Map<String, dynamic> c) {
    final value = _s(c['GIATRI']);
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
          softWrap: false,
          maxLines: null,
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
      filterQuality: FilterQuality.none,
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

  Widget _propertiesSheet() {
    final idx = _selectedIdx;
    final selected = (idx != null && idx >= 0 && idx < _components.length) ? _components[idx] : null;

    return DraggableScrollableSheet(
      initialChildSize: 0.18,
      minChildSize: 0.12,
      maxChildSize: 0.72,
      builder: (ctx, scrollCtrl) {
        return Material(
          elevation: 8,
          color: Theme.of(context).colorScheme.surface,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(14)),
          child: ListView(
            controller: scrollCtrl,
            padding: const EdgeInsets.all(12),
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      _gCode.trim().isEmpty ? 'Chưa chọn code' : '$_gCode: $_gName',
                      style: const TextStyle(fontWeight: FontWeight.w900),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  if (_multiSelectMode)
                    Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: Text(
                        'Selected: ${_selectedSet.length}',
                        style: const TextStyle(fontWeight: FontWeight.w900),
                      ),
                    ),
                  IconButton(
                    tooltip: 'Undo',
                    onPressed: _historyPast.isEmpty ? null : _undo,
                    icon: const Icon(Icons.undo),
                  ),
                  IconButton(
                    tooltip: 'Redo',
                    onPressed: _historyFuture.isEmpty ? null : _redo,
                    icon: const Icon(Icons.redo),
                  ),
                  IconButton(
                    tooltip: _multiSelectMode ? 'Exit multi-select' : 'Multi-select',
                    onPressed: () {
                      setState(() {
                        _multiSelectMode = !_multiSelectMode;
                        if (!_multiSelectMode) {
                          if (_selectedIdx != null) {
                            _selectedSet
                              ..clear()
                              ..add(_selectedIdx!);
                          } else {
                            _selectedSet.clear();
                          }
                        }
                      });
                    },
                    icon: Icon(_multiSelectMode ? Icons.layers_clear : Icons.layers),
                  ),
                  IconButton(
                    tooltip: _snapEnabled ? 'Snap ON' : 'Snap OFF',
                    onPressed: () => setState(() => _snapEnabled = !_snapEnabled),
                    icon: Icon(_snapEnabled ? Icons.grid_on : Icons.grid_off),
                  ),
                  FilledButton.icon(
                    onPressed: _loading ? null : _saveDesign,
                    icon: const Icon(Icons.save),
                    label: const Text('Save'),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: [
                  DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: _newComponentType,
                      style: TextStyle(color: Theme.of(context).colorScheme.onSurface),
                      dropdownColor: Theme.of(context).colorScheme.surface,
                      iconEnabledColor: Theme.of(context).colorScheme.onSurface,
                      onChanged: _loading
                          ? null
                          : (v) {
                              if (v == null) return;
                              setState(() => _newComponentType = v);
                            },
                      items: [
                        DropdownMenuItem(
                          value: 'TEXT',
                          child: Text('TEXT', style: TextStyle(color: Theme.of(context).colorScheme.onSurface)),
                        ),
                        DropdownMenuItem(
                          value: 'IMAGE',
                          child: Text('IMAGE', style: TextStyle(color: Theme.of(context).colorScheme.onSurface)),
                        ),
                        DropdownMenuItem(
                          value: '1D BARCODE',
                          child: Text('1D BARCODE', style: TextStyle(color: Theme.of(context).colorScheme.onSurface)),
                        ),
                        DropdownMenuItem(
                          value: '2D MATRIX',
                          child: Text('2D MATRIX', style: TextStyle(color: Theme.of(context).colorScheme.onSurface)),
                        ),
                        DropdownMenuItem(
                          value: 'QRCODE',
                          child: Text('QRCODE', style: TextStyle(color: Theme.of(context).colorScheme.onSurface)),
                        ),
                        DropdownMenuItem(
                          value: 'CONTAINER',
                          child: Text('CONTAINER', style: TextStyle(color: Theme.of(context).colorScheme.onSurface)),
                        ),
                      ],
                    ),
                  ),
                  FilledButton.icon(
                    onPressed: _loading ? null : _addComponent,
                    icon: const Icon(Icons.add),
                    label: const Text('Add'),
                  ),
                  FilledButton.icon(
                    onPressed: _selectedSet.isEmpty ? null : _duplicateSelected,
                    icon: const Icon(Icons.copy),
                    label: const Text('Duplicate'),
                  ),
                  FilledButton.icon(
                    onPressed: _selectedSet.isEmpty ? null : _sendToBack,
                    icon: const Icon(Icons.vertical_align_bottom),
                    label: const Text('To back'),
                  ),
                  FilledButton.icon(
                    onPressed: _selectedSet.isEmpty ? null : _bringToFront,
                    icon: const Icon(Icons.vertical_align_top),
                    label: const Text('To front'),
                  ),
                  FilledButton.icon(
                    style: FilledButton.styleFrom(backgroundColor: Colors.red),
                    onPressed: _selectedSet.isEmpty ? null : _deleteSelected,
                    icon: const Icon(Icons.delete),
                    label: const Text('Delete'),
                  ),
                  OutlinedButton.icon(
                    onPressed: selected == null ? null : () => _nudge(dxMm: -0.1, dyMm: 0),
                    icon: const Icon(Icons.arrow_left),
                    label: const Text('0.1'),
                  ),
                  OutlinedButton.icon(
                    onPressed: selected == null ? null : () => _nudge(dxMm: 0.1, dyMm: 0),
                    icon: const Icon(Icons.arrow_right),
                    label: const Text('0.1'),
                  ),
                  OutlinedButton.icon(
                    onPressed: selected == null ? null : () => _nudge(dxMm: 0, dyMm: -0.1),
                    icon: const Icon(Icons.arrow_upward),
                    label: const Text('0.1'),
                  ),
                  OutlinedButton.icon(
                    onPressed: selected == null ? null : () => _nudge(dxMm: 0, dyMm: 0.1),
                    icon: const Icon(Icons.arrow_downward),
                    label: const Text('0.1'),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              if (selected == null)
                const Text('Chọn 1 component để chỉnh')
              else ...[
                Text(
                  '${_s(selected['DOITUONG_STT'])} | ${_s(selected['PHANLOAI_DT'])} | NO ${_s(selected['DOITUONG_NO'])}',
                  style: const TextStyle(fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: _giatriCtrl,
                  decoration: const InputDecoration(labelText: 'GIATRI'),
                  maxLines: 2,
                  onSubmitted: (_) => _applySelectedFromForm(),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _posXCtrl,
                        decoration: const InputDecoration(labelText: 'POS_X (mm)'),
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        onSubmitted: (_) => _applySelectedFromForm(),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TextField(
                        controller: _posYCtrl,
                        decoration: const InputDecoration(labelText: 'POS_Y (mm)'),
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        onSubmitted: (_) => _applySelectedFromForm(),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _wCtrl,
                        decoration: const InputDecoration(labelText: 'SIZE_W (mm)'),
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        onSubmitted: (_) => _applySelectedFromForm(),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TextField(
                        controller: _hCtrl,
                        decoration: const InputDecoration(labelText: 'SIZE_H (mm)'),
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        onSubmitted: (_) => _applySelectedFromForm(),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _rotateCtrl,
                        decoration: const InputDecoration(labelText: 'ROTATE (deg)'),
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        onSubmitted: (_) => _applySelectedFromForm(),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TextField(
                        controller: _fontSizeCtrl,
                        decoration: const InputDecoration(labelText: 'FONT_SIZE'),
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        onSubmitted: (_) => _applySelectedFromForm(),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TextField(
                        controller: _fontStyleCtrl,
                        decoration: const InputDecoration(labelText: 'FONT_STYLE'),
                        onSubmitted: (_) => _applySelectedFromForm(),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                FilledButton(
                  onPressed: _applySelectedFromForm,
                  child: const Text('Apply'),
                ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    OutlinedButton(
                      onPressed: () => _resizeSelected(dwMm: -0.1, dhMm: 0),
                      child: const Text('W -0.1'),
                    ),
                    OutlinedButton(
                      onPressed: () => _resizeSelected(dwMm: 0.1, dhMm: 0),
                      child: const Text('W +0.1'),
                    ),
                    OutlinedButton(
                      onPressed: () => _resizeSelected(dwMm: 0, dhMm: -0.1),
                      child: const Text('H -0.1'),
                    ),
                    OutlinedButton(
                      onPressed: () => _resizeSelected(dwMm: 0, dhMm: 0.1),
                      child: const Text('H +0.1'),
                    ),
                  ],
                ),
              ],
              const SizedBox(height: 12),
              const Text('Component list', style: TextStyle(fontWeight: FontWeight.w900)),
              const SizedBox(height: 8),
              for (var i = 0; i < _components.length; i++) _compRow(i),
            ],
          ),
        );
      },
    );
  }

  Widget _compRow(int idx) {
    final c = _components[idx];
    final sel = _selectedIdx == idx;
    final title = '${_s(c['DOITUONG_STT'])} | ${_s(c['PHANLOAI_DT'])} | NO ${_s(c['DOITUONG_NO'])}';
    final sub = '${_s(c['GIATRI'])} | x:${_d(c['POS_X']).toStringAsFixed(2)} y:${_d(c['POS_Y']).toStringAsFixed(2)} w:${_d(c['SIZE_W']).toStringAsFixed(2)} h:${_d(c['SIZE_H']).toStringAsFixed(2)}';

    return Card(
      color: sel ? Theme.of(context).colorScheme.primaryContainer : null,
      child: ListTile(
        dense: true,
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w800), overflow: TextOverflow.ellipsis),
        subtitle: Text(sub, overflow: TextOverflow.ellipsis),
        onTap: () => _select(idx),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('RND / DESIGN AMAZON'),
        actions: [
          IconButton(
            tooltip: 'Search',
            onPressed: _loading ? null : _searchCode,
            icon: const Icon(Icons.search),
          ),
          IconButton(
            tooltip: 'Print test',
            onPressed: _loading ? null : _printTest,
            icon: const Icon(Icons.print),
          ),
        ],
      ),
      drawer: const AppDrawer(title: 'ERP'),
      body: Stack(
        children: [
          Column(
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
                              child: TextField(
                                controller: _codeSearchCtrl,
                                decoration: const InputDecoration(labelText: 'Search code (G_NAME)'),
                                textInputAction: TextInputAction.search,
                                onSubmitted: (_) => _searchCode(),
                              ),
                            ),
                            const SizedBox(width: 8),
                            FilledButton.icon(
                              onPressed: _loading ? null : _searchCode,
                              icon: const Icon(Icons.search),
                              label: const Text('Search'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        SizedBox(
                          height: 120,
                          child: _codeRows.isEmpty
                              ? const Center(child: Text('Chưa có data'))
                              : ListView.builder(
                                  itemCount: _codeRows.length,
                                  itemBuilder: (ctx, i) {
                                    final r = _codeRows[i];
                                    final gCode = _s(r['G_CODE']);
                                    final gName = _s(r['G_NAME']);
                                    final gNameKd = _s(r['G_NAME_KD']);
                                    return ListTile(
                                      dense: true,
                                      title: Text('$gCode: $gName', overflow: TextOverflow.ellipsis),
                                      subtitle: Text(gNameKd, overflow: TextOverflow.ellipsis),
                                      onTap: _loading
                                          ? null
                                          : () {
                                              _loadDesign(gCode, gName);
                                            },
                                    );
                                  },
                                ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              if (_loading) const LinearProgressIndicator(),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  child: Card(
                    child: ClipRect(
                      child: _gCode.trim().isEmpty
                          ? const Center(child: Text('Chọn code để load design'))
                          : _canvas(),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 12),
            ],
          ),
          Align(
            alignment: Alignment.bottomCenter,
            child: _propertiesSheet(),
          ),
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

class _GuidelinesPainter extends CustomPainter {
  _GuidelinesPainter({required this.xPx, required this.yPx});

  final List<double> xPx;
  final List<double> yPx;

  @override
  void paint(Canvas canvas, Size size) {
    if (xPx.isEmpty && yPx.isEmpty) return;
    final p = Paint()
      ..color = Colors.red.withValues(alpha: 0.75)
      ..strokeWidth = 1;

    for (final x in xPx) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), p);
    }
    for (final y in yPx) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), p);
    }
  }

  @override
  bool shouldRepaint(covariant _GuidelinesPainter oldDelegate) {
    return oldDelegate.xPx != xPx || oldDelegate.yPx != yPx;
  }
}

class _PrintRasterComp extends StatelessWidget {
  const _PrintRasterComp({
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
      final fontSizePx = fontPt <= 0 ? 18.0 : fontPt * (dotsPerMm * 0.3527777778);

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
    } else {
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
