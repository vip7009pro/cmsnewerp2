import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

class DtcScanPage extends StatefulWidget {
  const DtcScanPage({super.key, this.title = 'Scan'});

  final String title;

  @override
  State<DtcScanPage> createState() => _DtcScanPageState();
}

class _DtcScanPageState extends State<DtcScanPage> {
  final MobileScannerController _controller = MobileScannerController(
    detectionSpeed: DetectionSpeed.normal,
    facing: CameraFacing.back,
  );

  bool _locked = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        actions: [
          IconButton(
            onPressed: () => _controller.toggleTorch(),
            icon: const Icon(Icons.flash_on),
          ),
          IconButton(
            onPressed: () => _controller.switchCamera(),
            icon: const Icon(Icons.cameraswitch),
          ),
        ],
      ),
      body: MobileScanner(
        controller: _controller,
        onDetect: (capture) {
          if (_locked) return;
          final barcodes = capture.barcodes;
          if (barcodes.isEmpty) return;
          final raw = barcodes.first.rawValue;
          if (raw == null || raw.trim().isEmpty) return;
          _locked = true;
          Navigator.of(context).pop(raw.trim());
        },
      ),
    );
  }
}
