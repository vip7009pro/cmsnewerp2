import 'dart:io';

import 'package:excel/excel.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';

class ExcelExporter {
  static Future<void> shareAsXlsx({
    required String fileName,
    required List<Map<String, dynamic>> rows,
    List<String>? columns,
  }) async {
    final excel = Excel.createExcel();
    final sheet = excel['Sheet1'];

    final cols = (columns == null || columns.isEmpty)
        ? _collectColumns(rows)
        : columns;

    final colWidths = _estimateColumnWidths(rows: rows, columns: cols);

    sheet.appendRow(cols.map((e) => TextCellValue(e)).toList(growable: false));

    for (final row in rows) {
      sheet.appendRow(
        cols.map((c) => TextCellValue(_cellText(row[c]))).toList(growable: false),
      );
    }

    for (var i = 0; i < cols.length; i++) {
      final w = colWidths[i];
      if (w != null) {
        sheet.setColumnWidth(i, w);
      }
    }

    final bytes = excel.encode();
    if (bytes == null) return;

    final dir = await getTemporaryDirectory();
    final file = File('${dir.path}/$fileName');
    await file.writeAsBytes(bytes, flush: true);

    await Share.shareXFiles([
      XFile(file.path, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    ]);
  }

  static List<String> _collectColumns(List<Map<String, dynamic>> rows) {
    final out = <String>[];
    for (final r in rows) {
      for (final k in r.keys) {
        if (!out.contains(k)) out.add(k);
      }
    }
    return out;
  }

  static String _cellText(Object? v) {
    if (v == null) return '';
    if (v is String) return v;
    if (v is num || v is bool) return v.toString();
    return v.toString();
  }

  static List<double?> _estimateColumnWidths({
    required List<Map<String, dynamic>> rows,
    required List<String> columns,
  }) {
    // Excel column width is roughly based on number of characters.
    // We'll clamp to avoid absurdly wide columns.
    final widths = List<double?>.filled(columns.length, null);
    for (var i = 0; i < columns.length; i++) {
      final c = columns[i];
      var maxLen = c.length;
      for (final r in rows) {
        final s = _cellText(r[c]);
        if (s.length > maxLen) maxLen = s.length;
      }

      final w = (maxLen + 2).clamp(8, 50).toDouble();
      widths[i] = w;
    }
    return widths;
  }
}
