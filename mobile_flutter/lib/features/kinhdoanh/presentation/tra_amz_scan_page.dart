import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

import '../../../core/providers.dart';

class AmzScanPage extends ConsumerStatefulWidget {
  const AmzScanPage({super.key});

  @override
  ConsumerState<AmzScanPage> createState() => _AmzScanPageState();
}

class _AmzScanPageState extends ConsumerState<AmzScanPage> {
  late final MobileScannerController _controller;
  String? _value;
  bool _scanned = false;

  bool _loading = false;
  String? _error;
  Map<String, dynamic>? _topRow;
  int _matchCount = 0;

  String _escapeSingleQuote(String s) => s.replaceAll("'", "''");

  @override
  void initState() {
    super.initState();
    _controller = MobileScannerController(
      facing: CameraFacing.back,
      detectionSpeed: DetectionSpeed.noDuplicates,
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  ({int total, int normal, int special}) _countChars(String s) {
    int total = s.length;
    int special = 0;

    for (final rune in s.runes) {
      final cp = rune;
      final isSpecial =
          cp == 0x0A || // \n
          cp == 0x0D || // \r
          cp == 0x09 || // \t
          cp == 0x00 || // null
          cp == 0x0B || // vertical tab
          cp == 0x0C || // form feed
          cp == 0x1B || // ESC
          (cp >= 0x01 && cp <= 0x08) ||
          (cp >= 0x0E && cp <= 0x1F) ||
          cp == 0x7F;
      if (isSpecial) special++;
    }

    final normal = (total - special).clamp(0, total);
    return (total: total, normal: normal, special: special);
  }

  String _visualizeSpecials(String s) {
    final b = StringBuffer();
    for (final rune in s.runes) {
      switch (rune) {
        case 0x0A:
          b.write('\\n');
          break;
        case 0x0D:
          b.write('\\r');
          break;
        case 0x09:
          b.write('\\t');
          break;
        default:
          if (rune == 0x7F || (rune >= 0x00 && rune <= 0x1F)) {
            b.write('\\x');
            b.write(rune.toRadixString(16).padLeft(2, '0'));
          } else {
            b.write(String.fromCharCode(rune));
          }
      }
    }
    return b.toString();
  }

  bool _isSpecialRune(int cp) {
    return cp == 0x0A ||
        cp == 0x0D ||
        cp == 0x09 ||
        cp == 0x00 ||
        cp == 0x0B ||
        cp == 0x0C ||
        cp == 0x1B ||
        (cp >= 0x01 && cp <= 0x08) ||
        (cp >= 0x0E && cp <= 0x1F) ||
        cp == 0x7F;
  }

  String _specialToken(int cp) {
    switch (cp) {
      case 0x0A:
        return r'\n';
      case 0x0D:
        return r'\r';
      case 0x09:
        return r'\t';
      default:
        return r'\x' + cp.toRadixString(16).padLeft(2, '0');
    }
  }

  TextSpan _buildColoredSpan(String s, ColorScheme scheme) {
    final visibleStyle = TextStyle(
      color: scheme.onSurface,
      fontFamily: 'monospace',
      fontSize: 13,
    );
    final specialStyle = TextStyle(
      color: Colors.red.shade700,
      fontFamily: 'monospace',
      fontSize: 13,
      fontWeight: FontWeight.w700,
      backgroundColor: Colors.red.withOpacity(0.10),
    );

    final spans = <InlineSpan>[];
    for (final rune in s.runes) {
      if (_isSpecialRune(rune)) {
        spans.add(TextSpan(text: _specialToken(rune), style: specialStyle));
      } else {
        spans.add(TextSpan(text: String.fromCharCode(rune), style: visibleStyle));
      }
    }
    return TextSpan(children: spans);
  }

  bool _isNg(dynamic body) =>
      body is Map<String, dynamic> && (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  Future<void> _searchByScannedValue(String scanned) async {
    final code = scanned.trim();
    if (code.isEmpty) return;

    setState(() {
      _loading = true;
      _error = null;
      _topRow = null;
      _matchCount = 0;
    });

    try {
      final api = ref.read(apiClientProvider);
      final res = await api.postCommand(
        'traDataAMZ',
        data: {
          'ALLTIME': true,
          'FROM_DATE': '',
          'TO_DATE': '',
          'PROD_REQUEST_NO': '',
          'NO_IN': '',
          'G_NAME': '',
          'G_CODE': '',
          'DATA_AMZ': _escapeSingleQuote(code),
        },
      );

      final body = res.data;
      if (_isNg(body)) {
        setState(() {
          _loading = false;
          _error = (body is Map<String, dynamic> ? body['message'] : null)?.toString() ?? 'Không có data';
        });
        return;
      }

      final data = (body is Map<String, dynamic> ? body['data'] : null);
      final list = (data is List ? data : const [])
          .whereType<Map>()
          .map((e) => e.map((k, v) => MapEntry(k.toString().trim(), v)))
          .toList();

      setState(() {
        _loading = false;
        _matchCount = list.length;
        _topRow = list.isNotEmpty ? list.first : null;
        if (list.isEmpty) {
          _error = 'Không có data';
        }
      });
    } catch (e) {
      setState(() {
        _loading = false;
        _error = 'Lỗi: $e';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final value = _value;
    final counts = value == null ? null : _countChars(value);

    Widget infoTile({required String label, required String value, IconData? icon}) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: scheme.surface,
          border: Border.all(color: scheme.outlineVariant),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (icon != null) ...[
              Icon(icon, size: 16, color: scheme.primary),
              const SizedBox(width: 6),
            ],
            Text(
              '$label: ',
              style: TextStyle(fontWeight: FontWeight.w800, color: scheme.onSurface),
            ),
            Flexible(
              child: Text(
                value,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(color: scheme.onSurfaceVariant),
              ),
            ),
          ],
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('CMSVina Scan AMZ'),
        actions: [
          IconButton(
            tooltip: 'Bật/Tắt flash',
            onPressed: () => _controller.toggleTorch(),
            icon: const Icon(Icons.flash_on),
          ),
          IconButton(
            tooltip: 'Đổi camera',
            onPressed: () => _controller.switchCamera(),
            icon: const Icon(Icons.cameraswitch),
          ),
        ],
      ),
      body: Column(
        children: [
          if (!_scanned)
            AspectRatio(
              aspectRatio: 1.2,
              child: Card(
                margin: const EdgeInsets.all(12),
                clipBehavior: Clip.antiAlias,
                child: Stack(
                  children: [
                    MobileScanner(
                      controller: _controller,
                      onDetect: (capture) async {
                        if (_scanned) return;
                        final barcode = capture.barcodes.isNotEmpty ? capture.barcodes.first : null;
                        final raw = barcode?.rawValue;
                        if (raw == null || raw.isEmpty) return;

                        setState(() {
                          _scanned = true;
                          _value = raw;
                        });

                        await _controller.stop();
                        await _searchByScannedValue(raw);
                      },
                    ),
                    Positioned(
                      left: 12,
                      right: 12,
                      bottom: 12,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                        decoration: BoxDecoration(
                          color: Colors.black.withOpacity(0.55),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          'Đưa mã vào khung để quét...',
                          style: TextStyle(color: Colors.white),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            )
          else
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 12, 12, 0),
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    children: [
                      Icon(Icons.check_circle, color: Colors.green.shade700),
                      const SizedBox(width: 10),
                      const Expanded(
                        child: Text(
                          'Đã quét xong. Kết quả ở bên dưới.',
                          style: TextStyle(fontWeight: FontWeight.w700),
                        ),
                      ),
                      FilledButton.icon(
                        onPressed: () async {
                          await _controller.start();
                          setState(() {
                            _value = null;
                            _scanned = false;
                            _loading = false;
                            _error = null;
                            _topRow = null;
                            _matchCount = 0;
                          });
                        },
                        icon: const Icon(Icons.restart_alt),
                        label: const Text('Quét lại'),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
              children: [
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Expanded(
                              child: Text(
                                'Kết quả',
                                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                              ),
                            ),
                            TextButton.icon(
                              onPressed: value == null
                                  ? null
                                  : () async {
                                      await _controller.start();
                                      setState(() {
                                        _value = null;
                                        _scanned = false;
                                      });
                                    },
                              icon: const Icon(Icons.restart_alt),
                              label: const Text('Quét lại'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              '1) Nội dung mã',
                              style: TextStyle(fontWeight: FontWeight.w700),
                            ),
                            const SizedBox(height: 6),
                            Container(
                              width: double.infinity,
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                border: Border.all(color: scheme.outlineVariant),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: SelectableText.rich(
                                TextSpan(
                                  children: [
                                    if (value == null || value.isEmpty)
                                      TextSpan(
                                        text: '',
                                        style: TextStyle(color: scheme.onSurfaceVariant),
                                      )
                                    else
                                      _buildColoredSpan(value, scheme),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(height: 6),
                            Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    'Màu đỏ = ký tự đặc biệt/không nhìn thấy',
                                    style: TextStyle(fontSize: 12, color: scheme.onSurfaceVariant),
                                  ),
                                ),
                                IconButton(
                                  tooltip: 'Copy nội dung gốc',
                                  onPressed: value == null
                                      ? null
                                      : () {
                                          Clipboard.setData(ClipboardData(text: value));
                                        },
                                  icon: const Icon(Icons.copy),
                                ),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        if (counts != null)
                          Wrap(
                            spacing: 10,
                            runSpacing: 10,
                            children: [
                              _StatChip(
                                label: 'Tổng ký tự',
                                value: counts.total,
                                color: scheme.primary,
                              ),
                              _StatChip(
                                label: 'Ký tự thường',
                                value: counts.normal,
                                color: Colors.green.shade700,
                              ),
                              _StatChip(
                                label: 'Ký tự đặc biệt',
                                value: counts.special,
                                color: Colors.red.shade700,
                              ),
                            ],
                          ),
                        const SizedBox(height: 10),
                        if (_loading)
                          Padding(
                            padding: const EdgeInsets.symmetric(vertical: 8),
                            child: Row(
                              children: [
                                const SizedBox(
                                  width: 18,
                                  height: 18,
                                  child: CircularProgressIndicator(strokeWidth: 2),
                                ),
                                const SizedBox(width: 10),
                                Text('Đang tra dữ liệu...', style: TextStyle(color: scheme.onSurfaceVariant)),
                              ],
                            ),
                          ),
                        if (_error != null)
                          Padding(
                            padding: const EdgeInsets.only(top: 8),
                            child: Text(
                              _error ?? '',
                              style: TextStyle(color: Colors.red.shade700, fontWeight: FontWeight.w700),
                            ),
                          ),
                        if (_topRow != null) ...[
                          const SizedBox(height: 12),
                          Card(
                            color: scheme.primaryContainer.withOpacity(0.25),
                            child: Padding(
                              padding: const EdgeInsets.all(12),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      const Icon(Icons.info_outline),
                                      const SizedBox(width: 8),
                                      const Expanded(
                                        child: Text(
                                          'Thông tin AMZ',
                                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
                                        ),
                                      ),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                        decoration: BoxDecoration(
                                          color: scheme.primary.withOpacity(0.12),
                                          borderRadius: BorderRadius.circular(20),
                                        ),
                                        child: Text(
                                          'Match: $_matchCount',
                                          style: TextStyle(color: scheme.primary, fontWeight: FontWeight.w800),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 10),
                                  Wrap(
                                    spacing: 8,
                                    runSpacing: 8,
                                    children: [
                                      infoTile(
                                        label: 'G_NAME',
                                        value: (_topRow?['G_NAME'] ?? '').toString(),
                                        icon: Icons.inventory_2_outlined,
                                      ),
                                      infoTile(
                                        label: 'YCSX_NO',
                                        value: (_topRow?['PROD_REQUEST_NO'] ?? '').toString(),
                                        icon: Icons.receipt_long,
                                      ),
                                      infoTile(
                                        label: 'NO_IN',
                                        value: (_topRow?['NO_IN'] ?? '').toString(),
                                        icon: Icons.badge_outlined,
                                      ),
                                      infoTile(
                                        label: 'ROW_NO',
                                        value: (_topRow?['ROW_NO'] ?? '').toString(),
                                        icon: Icons.numbers,
                                      ),
                                      infoTile(
                                        label: 'PRINT_STATUS',
                                        value: (_topRow?['PRINT_STATUS'] ?? '').toString(),
                                        icon: Icons.print_outlined,
                                      ),
                                      infoTile(
                                        label: 'INLAI_COUNT',
                                        value: (_topRow?['INLAI_COUNT'] ?? '').toString(),
                                        icon: Icons.refresh,
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                        const SizedBox(height: 10),
                        if (value != null)
                          TextField(
                            readOnly: true,
                            maxLines: 6,
                            decoration: const InputDecoration(
                              labelText: '2) Hiển thị ký tự đặc biệt',
                              helperText: 'Ví dụ: \\n, \\r, \\t, \\x1b ...',
                              border: OutlineInputBorder(),
                            ),
                            controller: TextEditingController(text: _visualizeSpecials(value)),
                          ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: FilledButton.icon(
                                onPressed: value == null
                                    ? null
                                    : () {
                                        Navigator.of(context).pop<String>(value);
                                      },
                                icon: const Icon(Icons.check),
                                label: const Text('Dùng mã này'),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: OutlinedButton.icon(
                                onPressed: () => Navigator.of(context).pop<String>(null),
                                icon: const Icon(Icons.close),
                                label: const Text('Đóng'),
                              ),
                            ),
                          ],
                        )
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _StatChip extends StatelessWidget {
  const _StatChip({required this.label, required this.value, required this.color});

  final String label;
  final int value;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: color.withOpacity(0.10),
        border: Border.all(color: color.withOpacity(0.40)),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 10,
            height: 10,
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          ),
          const SizedBox(width: 8),
          Text(
            '$label: ',
            style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600),
          ),
          Text(
            '$value',
            style: TextStyle(color: color, fontWeight: FontWeight.w800),
          ),
        ],
      ),
    );
  }
}
