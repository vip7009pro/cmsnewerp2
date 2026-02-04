import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:syncfusion_flutter_charts/charts.dart';

import '../../../../../core/config/app_config.dart';
import '../../../../../core/providers.dart';
import '../../../../../core/utils/excel_exporter.dart';

class PqcReportTab extends ConsumerStatefulWidget {
  const PqcReportTab({super.key});

  @override
  ConsumerState<PqcReportTab> createState() => _PqcReportTabState();
}

class _PqcReportTabState extends ConsumerState<PqcReportTab> {
  bool _loading = false;
  bool _showFilter = true;

  ScaffoldMessengerState? _messenger;

  static const _axisLabelStyle = TextStyle(fontSize: 10, fontWeight: FontWeight.w700);
  static const _axisTitleStyle = TextStyle(fontSize: 11, fontWeight: FontWeight.w900);

  static const List<Map<String, String>> _errTable = [
    {'code': 'ERR1', 'vn': 'Loss thêm túi', 'kr': '포장 로스'},
    {'code': 'ERR2', 'vn': 'Loss bóc đầu cuối', 'kr': '초종 파괴 검사 로스'},
    {'code': 'ERR3', 'vn': 'Loss điểm nối', 'kr': '이음애 로스'},
    {'code': 'ERR4', 'vn': 'Dị vật/chấm gel', 'kr': '원단 이물/겔 점'},
    {'code': 'ERR5', 'vn': 'Nhăn VL', 'kr': '원단 주름'},
    {'code': 'ERR6', 'vn': 'Loang bẩn VL', 'kr': '얼룩'},
    {'code': 'ERR7', 'vn': 'Bóng khí VL', 'kr': '원단 기포'},
    {'code': 'ERR8', 'vn': 'Xước VL', 'kr': '원단 스크래치'},
    {'code': 'ERR9', 'vn': 'Chấm lồi lõm VL', 'kr': '원단 눌림'},
    {'code': 'ERR10', 'vn': 'Keo VL', 'kr': '원단 찐'},
    {'code': 'ERR11', 'vn': 'Lông PE VL', 'kr': '원단 버 (털 모양)'},
    {'code': 'ERR12', 'vn': 'Lỗi IN (Dây mực)', 'kr': '잉크 튐'},
    {'code': 'ERR13', 'vn': 'Lỗi IN (Mất nét)', 'kr': '글자 유실'},
    {'code': 'ERR14', 'vn': 'Lỗi IN (Lỗi màu)', 'kr': '색상 불량'},
    {'code': 'ERR15', 'vn': 'Lỗi IN (Chấm đường khử keo)', 'kr': '점착 제거 선 점 불량'},
    {'code': 'ERR16', 'vn': 'DIECUT (Lệch/Viền màu)', 'kr': '타발 편심'},
    {'code': 'ERR17', 'vn': 'DIECUT (Sâu)', 'kr': '과타발'},
    {'code': 'ERR18', 'vn': 'DIECUT (Nông)', 'kr': '미타발'},
    {'code': 'ERR19', 'vn': 'DIECUT (BAVIA)', 'kr': '타발 버'},
    {'code': 'ERR20', 'vn': 'Mất bước', 'kr': '차수 누락'},
    {'code': 'ERR21', 'vn': 'Xước', 'kr': '스크래치'},
    {'code': 'ERR22', 'vn': 'Nhăn gãy', 'kr': '주름꺽임'},
    {'code': 'ERR23', 'vn': 'Hằn', 'kr': '자국'},
    {'code': 'ERR24', 'vn': 'Sót rác', 'kr': '미 스크랩'},
    {'code': 'ERR25', 'vn': 'Bóng Khí', 'kr': '기포'},
    {'code': 'ERR26', 'vn': 'Bẩn keo bề mặt', 'kr': '표면 찐'},
    {'code': 'ERR27', 'vn': 'Chấm thủng/lồi lõm', 'kr': '찍힘'},
    {'code': 'ERR28', 'vn': 'Bụi trong', 'kr': '내면 이물'},
    {'code': 'ERR29', 'vn': 'Hụt Tape', 'kr': '테이프 줄여듬'},
    {'code': 'ERR30', 'vn': 'Bong keo', 'kr': '찐 벗겨짐'},
    {'code': 'ERR31', 'vn': 'Lấp lỗ sensor', 'kr': '센서 홀 막힘'},
    {'code': 'ERR32', 'vn': 'Marking SX', 'kr': '생산 마킹 구간 썩임'},
    {'code': 'ERR33', 'vn': 'Cong Vinyl', 'kr': '비닐 컬'},
    {'code': 'ERR34', 'vn': 'Mixing', 'kr': '혼입'},
    {'code': 'ERR35', 'vn': 'Sai thiết kế', 'kr': '설계 불량'},
    {'code': 'ERR36', 'vn': 'Sai vật liệu', 'kr': '원단 잘 못 사용'},
    {'code': 'ERR37', 'vn': 'NG kích thước', 'kr': '치수 불량'},
  ];

  bool _df = true;
  DateTime _fromDate = DateTime.now().subtract(const Duration(days: 14));
  DateTime _toDate = DateTime.now();
  final TextEditingController _custCtrl = TextEditingController();

  List<Map<String, dynamic>> _codeList = const [];
  List<Map<String, dynamic>> _selectedCodes = const [];

  List<Map<String, dynamic>> _daily = const [];
  List<Map<String, dynamic>> _weekly = const [];
  List<Map<String, dynamic>> _monthly = const [];
  List<Map<String, dynamic>> _yearly = const [];

  List<Map<String, dynamic>> _summary = const [];
  List<Map<String, dynamic>> _defectTrending = const [];
  List<Map<String, dynamic>> _pqc3Rows = const [];

  String _s(dynamic v) => (v ?? '').toString();

  double _d(dynamic v) {
    final raw = (v ?? '').toString().trim();
    if (raw.isEmpty) return 0.0;
    final normalized = raw.replaceAll(',', '').replaceAll(RegExp(r'[^0-9\.-]'), '');
    if (normalized.isEmpty) return 0.0;
    return double.tryParse(normalized) ?? 0.0;
  }

  bool _isNg(Map<String, dynamic> body) => (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  String _ymd(DateTime d) => '${d.year.toString().padLeft(4, '0')}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

  String _ddMm(String ymd) {
    try {
      final dt = DateTime.parse(ymd);
      return DateFormat('dd/MM').format(dt);
    } catch (_) {
      return ymd;
    }
  }

  String _ymdHms(String s) {
    final raw = s.trim();
    if (raw.isEmpty) return raw;
    // Accept both: "YYYY-MM-DD HH:mm:ss" and ISO "YYYY-MM-DDTHH:mm:ssZ"
    DateTime? dt;
    try {
      dt = DateTime.parse(raw.replaceFirst(' ', 'T'));
    } catch (_) {
      try {
        dt = DateTime.parse(raw);
      } catch (_) {
        dt = null;
      }
    }
    if (dt == null) return raw;
    final local = dt.isUtc ? dt.toLocal() : dt;
    return DateFormat('yyyy-MM-dd HH:mm:ss').format(local);
  }

  String _errLabel(String code) {
    final hit = _errTable.where((e) => e['code'] == code).toList();
    if (hit.isEmpty) return code;
    return '${hit.first['vn']}(${hit.first['kr']})';
  }

  Future<void> _pickDate({required bool isFrom}) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: isFrom ? _fromDate : _toDate,
      firstDate: DateTime(2020, 1, 1),
      lastDate: DateTime(2100, 12, 31),
    );
    if (picked == null) return;
    setState(() {
      if (isFrom) {
        _fromDate = picked;
      } else {
        _toDate = picked;
      }
    });
  }

  Future<Map<String, dynamic>> _post(String command, Map<String, dynamic> data) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(command, data: data);
    final body = res.data;
    if (body is Map<String, dynamic>) return body;
    return <String, dynamic>{'tk_status': 'NG', 'message': 'Bad response'};
  }

  void _snack(String msg) {
    if (!mounted) return;
    _messenger?.showSnackBar(SnackBar(content: Text(msg)));
  }

  TooltipBehavior _tooltip() => TooltipBehavior(enable: true, animationDuration: 0);

  TrackballBehavior _trackballDefectTrending({required List<String> activeKeys}) {
    return TrackballBehavior(
      enable: true,
      activationMode: ActivationMode.longPress,
      tooltipDisplayMode: TrackballDisplayMode.groupAllPoints,
      lineType: TrackballLineType.vertical,
      markerSettings: const TrackballMarkerSettings(markerVisibility: TrackballVisibilityMode.visible),
      builder: (BuildContext context, TrackballDetails details) {
        final points = details.groupingModeInfo?.points ?? const <dynamic>[];
        final label = details.point?.x?.toString() ?? '';

        final entries = <({String seriesName, double y})>[];
        for (final p in points) {
          final name = (p?.series?.name ?? '').toString();
          final rawY = p?.chartPoint?.y;
          final y = rawY is num ? rawY.toDouble() : _d(rawY);
          if (y == 0) continue;
          entries.add((seriesName: name, y: y));
        }
        entries.sort((a, b) => b.y.compareTo(a.y));

        return ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 320),
          child: Material(
            color: Colors.white,
            elevation: 4,
            borderRadius: BorderRadius.circular(10),
            child: Padding(
              padding: const EdgeInsets.all(10),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Date: $label', style: const TextStyle(fontWeight: FontWeight.w900)),
                  const SizedBox(height: 6),
                  if (entries.isEmpty)
                    const Text('No defect', style: TextStyle(color: Colors.black54))
                  else
                    for (final e in entries.take(12))
                      Padding(
                        padding: const EdgeInsets.only(bottom: 2),
                        child: Text(
                          '${e.seriesName}: ${e.y.toStringAsFixed(0)}%',
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
                        ),
                      ),
                  if (entries.length > 12)
                    Text('+${entries.length - 12} more', style: const TextStyle(fontSize: 11, color: Colors.black54)),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Future<void> _exportAll(List<Map<String, dynamic>> rows, String name) async {
    await ExcelExporter.shareAsXlsx(fileName: '$name.xlsx', rows: rows);
  }

  List<String> _selectedCodeNames() {
    return _selectedCodes.map((e) => _s(e['G_CODE']).trim()).where((e) => e.isNotEmpty).toList();
  }

  Future<void> _loadCodeList() async {
    if (!mounted) return;
    try {
      final body = await _post('selectcodeList', {'G_NAME': ''});
      if (_isNg(body)) return;
      final raw = body['data'];
      final data = raw is List ? raw : const [];
      final rows = data.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();
      if (!mounted) return;
      setState(() => _codeList = rows);
    } catch (_) {
      // ignore
    }
  }

  Future<void> _pickCodes() async {
    if (!mounted) return;

    final current = _selectedCodes;
    final selected = <Map<String, dynamic>>[...current];

    final result = await showModalBottomSheet<List<Map<String, dynamic>>>(
      context: context,
      isScrollControlled: true,
      builder: (ctx) {
        final searchCtrl = TextEditingController();
        return StatefulBuilder(
          builder: (ctx2, setState2) {
            List<Map<String, dynamic>> filtered() {
              final q = searchCtrl.text.trim().toLowerCase();
              if (q.isEmpty) return _codeList;
              return _codeList.where((r) {
                final a = _s(r['G_NAME']).toLowerCase();
                final b = _s(r['G_NAME_KD']).toLowerCase();
                final c = _s(r['G_CODE']).toLowerCase();
                return a.contains(q) || b.contains(q) || c.contains(q);
              }).toList();
            }

            bool isSel(Map<String, dynamic> r) {
              final g = _s(r['G_CODE']);
              return selected.any((e) => _s(e['G_CODE']) == g);
            }

            void toggle(Map<String, dynamic> r) {
              final g = _s(r['G_CODE']);
              final idx = selected.indexWhere((e) => _s(e['G_CODE']) == g);
              setState2(() {
                if (idx >= 0) {
                  selected.removeAt(idx);
                } else {
                  selected.add(r);
                }
              });
            }

            return SafeArea(
              child: Padding(
                padding: EdgeInsets.only(
                  left: 12,
                  right: 12,
                  top: 12,
                  bottom: MediaQuery.of(ctx2).viewInsets.bottom + 12,
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(
                      controller: searchCtrl,
                      decoration: const InputDecoration(labelText: 'Tìm code (G_CODE/G_NAME/G_NAME_KD)'),
                      onChanged: (_) => setState2(() {}),
                    ),
                    const SizedBox(height: 8),
                    SizedBox(
                      height: MediaQuery.of(ctx2).size.height * 0.6,
                      child: ListView.builder(
                        itemCount: filtered().length,
                        itemBuilder: (_, i) {
                          final r = filtered()[i];
                          final sel = isSel(r);
                          return ListTile(
                            dense: true,
                            title: Text('${_s(r['G_CODE'])} - ${_s(r['G_NAME_KD'])}'),
                            subtitle: Text(_s(r['G_NAME'])),
                            trailing: Checkbox(value: sel, onChanged: (_) => toggle(r)),
                            onTap: () => toggle(r),
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () => Navigator.of(ctx2).pop(current),
                            child: const Text('Hủy'),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: FilledButton(
                            onPressed: () => Navigator.of(ctx2).pop(selected),
                            child: Text('Chọn (${selected.length})'),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );

    if (result == null) return;
    if (!mounted) return;
    setState(() => _selectedCodes = result);
  }

  Future<void> _loadAll() async {
    if (!mounted) return;
    setState(() {
      _loading = true;
      _showFilter = false;
      _daily = const [];
      _weekly = const [];
      _monthly = const [];
      _yearly = const [];
      _summary = const [];
      _defectTrending = const [];
      _pqc3Rows = const [];
    });

    final listCode = _df ? <String>[] : _selectedCodeNames();
    final custName = _custCtrl.text.trim();

    // Web default date window depends on df. We mimic exactly.
    final td = DateTime.now();
    final dfFromDaily = DateTime.now().subtract(const Duration(days: 12));
    final dfFromWeekly = DateTime.now().subtract(const Duration(days: 70));
    final dfFromMonthly = DateTime.now().subtract(const Duration(days: 365));
    final dfFromYearly = DateTime.now().subtract(const Duration(days: 3650));
    final dfFromSummary = DateTime.now().subtract(const Duration(days: 7));
    final dfFromDefect = DateTime.now().subtract(const Duration(days: 14));
    final dfFromPqc3 = DateTime.now().subtract(const Duration(days: 7));

    try {
      Future<List<Map<String, dynamic>>> callList(String cmd, Map<String, dynamic> payload) async {
        final body = await _post(cmd, payload);
        if (_isNg(body)) return const [];
        final raw = body['data'];
        final data = raw is List ? raw : const [];
        return data.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();
      }

      final futures = <Future<void>>[
        () async {
          final rows = await callList('pqcdailyppm', {
            'FACTORY': 'ALL',
            'FROM_DATE': _df ? _ymd(dfFromDaily) : _ymd(_fromDate),
            'TO_DATE': _df ? _ymd(td) : _ymd(_toDate),
            'codeArray': _df ? [] : listCode,
            'CUST_NAME_KD': custName,
          });
          for (final r in rows) {
            final total = _d(r['TOTAL_LOT']);
            final ng = _d(r['NG_LOT']);
            r['OK_LOT'] = r['OK_LOT'] ?? (total - ng);
            if (r['KPI_VALUE'] != null) {
              r['KPI_VALUE'] = _d(r['KPI_VALUE']) / 100;
            }
          }
          if (!mounted) return;
          setState(() => _daily = rows);
        }(),
        () async {
          final rows = await callList('pqcweeklyppm', {
            'FACTORY': 'ALL',
            'FROM_DATE': _df ? _ymd(dfFromWeekly) : _ymd(_fromDate),
            'TO_DATE': _df ? _ymd(td) : _ymd(_toDate),
            'codeArray': _df ? [] : listCode,
            'CUST_NAME_KD': custName,
          });
          for (final r in rows) {
            final total = _d(r['TOTAL_LOT']);
            final ng = _d(r['NG_LOT']);
            r['OK_LOT'] = r['OK_LOT'] ?? (total - ng);
            if (r['KPI_VALUE'] != null) {
              r['KPI_VALUE'] = _d(r['KPI_VALUE']) / 100;
            }
          }
          if (!mounted) return;
          setState(() => _weekly = rows);
        }(),
        () async {
          final rows = await callList('pqcmonthlyppm', {
            'FACTORY': 'ALL',
            'FROM_DATE': _df ? _ymd(dfFromMonthly) : _ymd(_fromDate),
            'TO_DATE': _df ? _ymd(td) : _ymd(_toDate),
            'codeArray': _df ? [] : listCode,
            'CUST_NAME_KD': custName,
          });
          for (final r in rows) {
            final total = _d(r['TOTAL_LOT']);
            final ng = _d(r['NG_LOT']);
            r['OK_LOT'] = r['OK_LOT'] ?? (total - ng);
            if (r['KPI_VALUE'] != null) {
              r['KPI_VALUE'] = _d(r['KPI_VALUE']) / 100;
            }
          }
          if (!mounted) return;
          setState(() => _monthly = rows);
        }(),
        () async {
          final rows = await callList('pqcyearlyppm', {
            'FACTORY': 'ALL',
            'FROM_DATE': _df ? _ymd(dfFromYearly) : _ymd(_fromDate),
            'TO_DATE': _df ? _ymd(td) : _ymd(_toDate),
            'codeArray': _df ? [] : listCode,
            'CUST_NAME_KD': custName,
          });
          for (final r in rows) {
            final total = _d(r['TOTAL_LOT']);
            final ng = _d(r['NG_LOT']);
            r['OK_LOT'] = r['OK_LOT'] ?? (total - ng);
            if (r['KPI_VALUE'] != null) {
              r['KPI_VALUE'] = _d(r['KPI_VALUE']) / 100;
            }
          }
          if (!mounted) return;
          setState(() => _yearly = rows);
        }(),
        () async {
          final rows = await callList('getPQCSummary', {
            'FROM_DATE': _df ? _ymd(dfFromSummary) : _ymd(_fromDate),
            'TO_DATE': _df ? _ymd(td) : _ymd(_toDate),
            'codeArray': listCode,
            'CUST_NAME_KD': custName,
          });
          if (!mounted) return;
          setState(() => _summary = rows);
        }(),
        () async {
          final rows = await callList('dailyPQCDefectTrending', {
            'FROM_DATE': _df ? _ymd(dfFromDefect) : _ymd(_fromDate),
            'TO_DATE': _df ? _ymd(td) : _ymd(_toDate),
            'codeArray': listCode,
            'CUST_NAME_KD': custName,
          });
          if (!mounted) return;
          setState(() => _defectTrending = rows);
        }(),
        () async {
          // mimic traPQC3
          final rows = await callList('trapqc3data', {
            'ALLTIME': false,
            'FROM_DATE': _df ? _ymd(dfFromPqc3) : _ymd(_fromDate),
            'TO_DATE': _df ? _ymd(td) : _ymd(_toDate),
            'CUST_NAME': custName,
            'PROCESS_LOT_NO': '',
            'G_CODE': '',
            'G_NAME': '',
            'PROD_TYPE': '',
            'EMPL_NAME': '',
            'PROD_REQUEST_NO': '',
            'ID': '',
            'FACTORY': 'All',
          });
          if (!mounted) return;
          setState(() => _pqc3Rows = rows);
        }(),
      ];

      await Future.wait(futures);
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Đã load báo cáo PQC');
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Future<void> _loadPqc3ByDate(String ymd) async {
    if (ymd.trim().isEmpty) return;
    if (!mounted) return;
    final custName = _custCtrl.text.trim();
    setState(() => _loading = true);
    try {
      final body = await _post('trapqc3data', {
        'ALLTIME': false,
        'FROM_DATE': ymd,
        'TO_DATE': ymd,
        'CUST_NAME': custName,
        'PROCESS_LOT_NO': '',
        'G_CODE': '',
        'G_NAME': '',
        'PROD_TYPE': '',
        'EMPL_NAME': '',
        'PROD_REQUEST_NO': '',
        'ID': '',
        'FACTORY': 'All',
      });
      if (_isNg(body)) {
        if (!mounted) return;
        setState(() {
          _loading = false;
          _pqc3Rows = const [];
        });
        return;
      }
      final raw = body['data'];
      final data = raw is List ? raw : const [];
      final rows = data.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();
      if (!mounted) return;
      setState(() {
        _loading = false;
        _pqc3Rows = rows;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Widget _sectionTitle(String t) {
    final scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.fromLTRB(4, 10, 4, 6),
      child: Text(t, style: TextStyle(fontWeight: FontWeight.w900, color: scheme.primary)),
    );
  }

  Widget _overviewCard({
    required String title,
    required IconData icon,
    required Color accent,
    required Map<String, dynamic> row,
  }) {
    final scheme = Theme.of(context).colorScheme;
    final ok = _d(row['OK_LOT']);
    final ng = _d(row['NG_LOT']);
    final total = _d(row['TOTAL_LOT']);
    final rate = _d(row['NG_RATE']);
    final ratePct = rate * 100;

    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(14),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            accent.withValues(alpha: 0.18),
            accent.withValues(alpha: 0.06),
          ],
        ),
        border: Border.all(color: accent.withValues(alpha: 0.35)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: accent.withValues(alpha: 0.18),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(icon, color: accent),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    title,
                    style: TextStyle(
                      fontWeight: FontWeight.w900,
                      color: scheme.onSurface,
                      letterSpacing: 0.2,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: accent.withValues(alpha: 0.14),
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Text(
                    '${ratePct.toStringAsFixed(2)}%',
                    style: TextStyle(fontWeight: FontWeight.w900, color: accent),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Text('NG LOT', style: TextStyle(color: scheme.onSurfaceVariant, fontWeight: FontWeight.w800)),
            Text(
              NumberFormat.compact().format(ng),
              style: TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: scheme.onSurface),
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 12,
              runSpacing: 6,
              children: [
                _miniStat(label: 'OK', value: NumberFormat.compact().format(ok), color: const Color(0xFF16A34A)),
                _miniStat(label: 'TOTAL', value: NumberFormat.compact().format(total), color: const Color(0xFF0EA5E9)),
                _miniStat(label: 'NG_RATE', value: rate.toStringAsFixed(4), color: accent),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _miniStat({required String label, required String value, required Color color}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.85),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.22)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(label, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Colors.black.withValues(alpha: 0.65))),
          const SizedBox(height: 2),
          Text(value, style: TextStyle(fontWeight: FontWeight.w900, color: color)),
        ],
      ),
    );
  }

  Widget _responsiveQuad({required Widget a, required Widget b, required Widget c, required Widget d}) {
    return LayoutBuilder(
      builder: (ctx, cons) {
        final narrow = cons.maxWidth < 900;
        if (narrow) {
          return Column(
            children: [
              a,
              const SizedBox(height: 8),
              b,
              const SizedBox(height: 8),
              c,
              const SizedBox(height: 8),
              d,
            ],
          );
        }
        return Row(
          children: [
            Expanded(child: a),
            const SizedBox(width: 8),
            Expanded(child: b),
            const SizedBox(width: 8),
            Expanded(child: c),
            const SizedBox(width: 8),
            Expanded(child: d),
          ],
        );
      },
    );
  }

  Widget _responsivePair({required Widget a, required Widget b}) {
    return LayoutBuilder(
      builder: (ctx, c) {
        final narrow = c.maxWidth < 700;
        if (narrow) {
          return Column(
            children: [
              a,
              const SizedBox(height: 8),
              b,
            ],
          );
        }
        return Row(
          children: [
            Expanded(child: a),
            const SizedBox(width: 8),
            Expanded(child: b),
          ],
        );
      },
    );
  }

  Widget _ppmChart({
    required String title,
    required List<Map<String, dynamic>> data,
    required String xKey,
    required String xLabel,
    bool reverse = true,
  }) {
    if (data.isEmpty) return const SizedBox.shrink();

    final pts = reverse ? [...data].reversed.toList() : data;
    String x(Map<String, dynamic> r) {
      final raw = _s(r[xKey]);
      if (xKey == 'SETTING_DATE') return _ddMm(raw);
      return raw;
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                Expanded(child: Text(title, style: const TextStyle(fontWeight: FontWeight.w900))),
                IconButton(
                  onPressed: () => _exportAll(data, title.replaceAll(' ', '_')),
                  icon: const Icon(Icons.table_view),
                  tooltip: 'Export Excel',
                ),
              ],
            ),
            SizedBox(
              height: 260,
              child: SfCartesianChart(
                enableAxisAnimation: false,
                tooltipBehavior: _tooltip(),
                legend: const Legend(isVisible: true, position: LegendPosition.top),
                primaryXAxis: CategoryAxis(
                  labelRotation: -45,
                  labelStyle: _axisLabelStyle,
                  title: AxisTitle(text: xLabel, textStyle: _axisTitleStyle),
                ),
                primaryYAxis: NumericAxis(
                  numberFormat: NumberFormat.compact(),
                  labelStyle: _axisLabelStyle,
                  title: const AxisTitle(text: 'LOT', textStyle: _axisTitleStyle),
                ),
                axes: <ChartAxis>[
                  NumericAxis(
                    name: 'rate',
                    opposedPosition: true,
                    labelStyle: _axisLabelStyle,
                    title: const AxisTitle(text: 'NG Rate (%)', textStyle: _axisTitleStyle),
                    axisLabelFormatter: (v) => ChartAxisLabel('${v.value.toStringAsFixed(0)}%', v.textStyle),
                  ),
                ],
                series: <CartesianSeries<Map<String, dynamic>, String>>[
                  StackedColumnSeries<Map<String, dynamic>, String>(
                    name: 'OK_LOT',
                    animationDuration: 0,
                    dataSource: pts,
                    xValueMapper: (p, _) => x(p),
                    yValueMapper: (p, _) => _d(p['OK_LOT']),
                    color: const Color(0xFF53EB34),
                  ),
                  StackedColumnSeries<Map<String, dynamic>, String>(
                    name: 'NG_LOT',
                    animationDuration: 0,
                    dataSource: pts,
                    xValueMapper: (p, _) => x(p),
                    yValueMapper: (p, _) => _d(p['NG_LOT']),
                    color: const Color(0xFFFF0000),
                  ),
                  LineSeries<Map<String, dynamic>, String>(
                    name: 'NG_RATE(%)',
                    animationDuration: 0,
                    dataSource: pts,
                    xValueMapper: (p, _) => x(p),
                    yValueMapper: (p, _) => _d(p['NG_RATE']) * 100,
                    yAxisName: 'rate',
                    color: Colors.green,
                    markerSettings: const MarkerSettings(isVisible: true),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _defectTrendingChart() {
    if (_defectTrending.isEmpty) return const SizedBox.shrink();

    String x(Map<String, dynamic> r) => _ddMm(_s(r['INSPECT_DATE']));

    final pts = [..._defectTrending].reversed.toList();

    final first = pts.first;
    final keys = first.keys
        .where(
          (k) =>
              !<String>{
                'INSPECT_DATE',
                'INSPECT_YW',
                'INSPECT_YM',
                'INSPECT_YEAR',
                'INSPECT_MONTH',
                'INSPECT_WEEK',
                'INSPECT_TOTAL_QTY',
                'INSPECT_OK_QTY',
                'INSPECT_NG_QTY',
                'id',
              }.contains(k),
        )
        .toList();

    // Follow web behavior: skip some ERR keys (they are treated as non-trending in that chart)
    keys.removeWhere((k) => <String>{'ERR1', 'ERR2', 'ERR3', 'ERR32'}.contains(k));

    // Only keep keys that actually have non-zero values
    final activeKeys = keys.where((k) => pts.any((r) => _d(r[k]) != 0)).toList();

    final colors = <Color>[
      const Color(0xFF2563EB),
      const Color(0xFFDC2626),
      const Color(0xFF16A34A),
      const Color(0xFFF59E0B),
      const Color(0xFF7C3AED),
      const Color(0xFF0891B2),
      const Color(0xFFDB2777),
      const Color(0xFF4B5563),
      const Color(0xFF0EA5E9),
      const Color(0xFF84CC16),
    ];

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                const Expanded(child: Text('PQC Defects Trending', style: TextStyle(fontWeight: FontWeight.w900))),
                IconButton(
                  onPressed: () => _exportAll(_defectTrending, 'PQC_DefectTrending'),
                  icon: const Icon(Icons.table_view),
                  tooltip: 'Export Excel',
                ),
              ],
            ),
            SizedBox(
              height: 320,
              child: SfCartesianChart(
                enableAxisAnimation: false,
                legend: const Legend(isVisible: true, position: LegendPosition.top, toggleSeriesVisibility: false),
                tooltipBehavior: TooltipBehavior(enable: false),
                trackballBehavior: _trackballDefectTrending(activeKeys: activeKeys),
                selectionGesture: ActivationMode.singleTap,
                selectionType: SelectionType.point,
                onSelectionChanged: (args) {
                  final idx = args.pointIndex;
                  if (idx < 0 || idx >= pts.length) return;
                  final date = _s(pts[idx]['INSPECT_DATE']);
                  _loadPqc3ByDate(date);
                },
                primaryXAxis: CategoryAxis(labelRotation: -45, title: const AxisTitle(text: 'DATE')),
                primaryYAxis: NumericAxis(
                  labelStyle: _axisLabelStyle,
                  title: const AxisTitle(text: 'NG Rate (%)', textStyle: _axisTitleStyle),
                  axisLabelFormatter: (v) => ChartAxisLabel('${v.value.toStringAsFixed(0)}%', v.textStyle),
                ),
                series: <CartesianSeries<Map<String, dynamic>, String>>[
                  for (int i = 0; i < activeKeys.length; i++)
                    SplineSeries<Map<String, dynamic>, String>(
                      name: _errLabel(activeKeys[i]),
                      dataSource: pts,
                      xValueMapper: (p, _) => x(p),
                      // Web shows percent. API values are ratio (0..1). We plot 0..100 for readability.
                      yValueMapper: (p, _) => _d(p[activeKeys[i]]) * 100,
                      color: colors[i % colors.length],
                      splineType: SplineType.natural,
                      markerSettings: const MarkerSettings(isVisible: false),
                      animationDuration: 0,
                    ),
                ],
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Tip: Tap vào điểm theo ngày để lọc PQC3 defects. Long-press để xem tooltip chi tiết giống web.',
              style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant),
            ),
          ],
        ),
      ),
    );
  }

  Widget _pqc3Card(Map<String, dynamic> r) {
    final occ = _ymdHms(_s(r['OCCURR_TIME']));
    final defect = '${_s(r['ERR_CODE'])}: ${_s(r['DEFECT_PHENOMENON'])}';
    final imgUrl = '${AppConfig.imageBaseUrl}/pqc/PQC3_${(_d(r['PQC3_ID']).toInt() + 1)}.png';
    final scheme = Theme.of(context).colorScheme;

    Future<void> showImage() async {
      if (!mounted) return;
      await showDialog<void>(
        context: context,
        builder: (_) => Dialog(
          child: InteractiveViewer(
            child: AspectRatio(
              aspectRatio: 1,
              child: Image.network(imgUrl, fit: BoxFit.contain, errorBuilder: (_, __, ___) => const Center(child: Text('No image'))),
            ),
          ),
        ),
      );
    }

    return SizedBox(
      width: 340,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('OCCURRED_TIME: $occ', style: const TextStyle(fontWeight: FontWeight.w900)),
              const SizedBox(height: 6),
              Text('FACTORY: ${_s(r['FACTORY'])} | LINE: ${_s(r['LINE_NO'])}'),
              Text('CODE: ${_s(r['G_NAME_KD'])}'),
              Text('CUST: ${_s(r['CUST_NAME_KD'])}'),
              const SizedBox(height: 6),
              Text(defect, style: TextStyle(fontWeight: FontWeight.w900, color: scheme.error)),
              const SizedBox(height: 6),
              Text('INSPECT_QTY: ${_s(r['INSPECT_QTY'])} | INSPECT_NG: ${_s(r['DEFECT_QTY'])}'),
              Text('PIC: ${_s(r['LINEQC_PIC'])} | STATUS: ${_s(r['STATUS'])}'),
              if (_s(r['NG_NHAN']).isNotEmpty || _s(r['DOI_SACH']).isNotEmpty)
                Text('NG_NHAN: ${_s(r['NG_NHAN'])} | DOI_SACH: ${_s(r['DOI_SACH'])}'),
              const SizedBox(height: 8),
              Expanded(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: InkWell(
                    onTap: showImage,
                    child: Container(
                      width: double.infinity,
                      color: Colors.black.withValues(alpha: 0.04),
                      child: Image.network(
                        imgUrl,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => const Center(child: Text('No image')),
                        loadingBuilder: (c, w, p) {
                          if (p == null) return w;
                          return const Center(child: CircularProgressIndicator());
                        },
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _pqc3List() {
    if (_pqc3Rows.isEmpty) return const SizedBox.shrink();
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                Expanded(child: Text('PQC3 Defects (${_pqc3Rows.length})', style: const TextStyle(fontWeight: FontWeight.w900))),
                IconButton(
                  onPressed: () => _exportAll(_pqc3Rows, 'PQC3_Data'),
                  icon: const Icon(Icons.table_view),
                ),
              ],
            ),
            const SizedBox(height: 8),
            SizedBox(
              height: 420,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: _pqc3Rows.length > 50 ? 50 : _pqc3Rows.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (_, i) => _pqc3Card(_pqc3Rows[i]),
              ),
            ),
            if (_pqc3Rows.length > 50)
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Text(
                  'Hiển thị 50/${_pqc3Rows.length} item (vuốt ngang). Export Excel để xem tất cả.',
                  style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _summaryTable() {
    if (_summary.isEmpty) return const SizedBox.shrink();

    num sumLot = 0;
    num sumNg = 0;
    num sumAmt = 0;
    for (final r in _summary) {
      sumLot += _d(r['TOTAL_LOT']);
      sumNg += _d(r['NG_LOT']);
      sumAmt += _d(r['INSPECT_AMOUNT']);
    }
    final rate = sumLot == 0 ? 0 : (sumNg / sumLot);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                const Expanded(child: Text('PQC F-Cost Summary', style: TextStyle(fontWeight: FontWeight.w900))),
                IconButton(onPressed: () => _exportAll(_summary, 'PQC_Fcost_Summary'), icon: const Icon(Icons.table_view)),
              ],
            ),
            const SizedBox(height: 8),
            Text('TOTAL_LOT: ${NumberFormat.compact().format(sumLot)} | NG_LOT: ${NumberFormat.compact().format(sumNg)} | NG_RATE: ${(rate * 100).toStringAsFixed(2)}%'),
            Text('INSPECT_AMOUNT: ${NumberFormat.compact().format(sumAmt)}'),
          ],
        ),
      ),
    );
  }

  Widget _fcostChart({required String title, required List<Map<String, dynamic>> data, required String xKey, required String xLabel}) {
    if (data.isEmpty) return const SizedBox.shrink();
    final pts = [...data].reversed.toList();
    String x(Map<String, dynamic> r) {
      final raw = _s(r[xKey]);
      if (xKey == 'SETTING_DATE') return _ddMm(raw);
      return raw;
    }
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                Expanded(child: Text(title, style: const TextStyle(fontWeight: FontWeight.w900))),
                IconButton(onPressed: () => _exportAll(data, title.replaceAll(' ', '_')), icon: const Icon(Icons.table_view)),
              ],
            ),
            SizedBox(
              height: 260,
              child: SfCartesianChart(
                enableAxisAnimation: false,
                tooltipBehavior: _tooltip(),
                primaryXAxis: CategoryAxis(
                  labelRotation: -45,
                  labelStyle: _axisLabelStyle,
                  title: AxisTitle(text: xLabel, textStyle: _axisTitleStyle),
                ),
                primaryYAxis: NumericAxis(
                  numberFormat: NumberFormat.compact(),
                  labelStyle: _axisLabelStyle,
                  title: const AxisTitle(text: 'AMOUNT', textStyle: _axisTitleStyle),
                ),
                series: <CartesianSeries<Map<String, dynamic>, String>>[
                  ColumnSeries<Map<String, dynamic>, String>(
                    name: 'INSPECT_AMOUNT',
                    animationDuration: 0,
                    dataSource: pts,
                    xValueMapper: (p, _) => x(p),
                    yValueMapper: (p, _) => _d(p['INSPECT_AMOUNT']),
                    color: const Color(0xFF8B89FC),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _messenger = ScaffoldMessenger.maybeOf(context);
  }

  @override
  void initState() {
    super.initState();
    Future.microtask(_loadCodeList);
    Future.microtask(_loadAll);
  }

  @override
  void dispose() {
    _custCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final selectedCodeLabel = _selectedCodes.isEmpty ? 'Chọn code' : 'Đã chọn ${_selectedCodes.length} code';

    Widget filterHeader = Card(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        child: Row(
          children: [
            IconButton(
              tooltip: _showFilter ? 'Ẩn filter' : 'Hiện filter',
              onPressed: _loading ? null : () => setState(() => _showFilter = !_showFilter),
              icon: Icon(_showFilter ? Icons.filter_alt_off : Icons.filter_alt),
            ),
            const Expanded(child: Text('PQC REPORT', style: TextStyle(fontWeight: FontWeight.w900))),
          ],
        ),
      ),
    );

    Widget filterCard = !_showFilter
        ? const SizedBox.shrink()
        : Card(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Wrap(
                spacing: 12,
                runSpacing: 8,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: [
                  OutlinedButton(onPressed: _loading ? null : () => _pickDate(isFrom: true), child: Text('Từ: ${_ymd(_fromDate)}')),
                  OutlinedButton(onPressed: _loading ? null : () => _pickDate(isFrom: false), child: Text('Đến: ${_ymd(_toDate)}')),
                  SizedBox(
                    width: 220,
                    child: TextField(
                      controller: _custCtrl,
                      decoration: const InputDecoration(labelText: 'Customer (CUST_NAME_KD)'),
                    ),
                  ),
                  OutlinedButton.icon(
                    onPressed: _loading ? null : (_codeList.isEmpty ? null : _pickCodes),
                    icon: const Icon(Icons.list_alt),
                    label: Text(selectedCodeLabel),
                  ),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Checkbox(
                        value: _df,
                        onChanged: _loading
                            ? null
                            : (v) {
                                setState(() {
                                  _df = v ?? true;
                                  if (_df) _selectedCodes = const [];
                                });
                              },
                      ),
                      const Text('Default (DF)'),
                    ],
                  ),
                  FilledButton.icon(
                    onPressed: _loading ? null : _loadAll,
                    icon: const Icon(Icons.refresh),
                    label: const Text('Load'),
                  ),
                ],
              ),
            ),
          );

    Map<String, dynamic> firstOf(List<Map<String, dynamic>> data) => data.isNotEmpty ? data.first : <String, dynamic>{};

    final today = firstOf(_daily);
    final week = firstOf(_weekly);
    final month = firstOf(_monthly);
    final year = firstOf(_yearly);

    Widget overviewSection = Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text('1. OverView', style: TextStyle(fontWeight: FontWeight.w900)),
            const SizedBox(height: 8),
            _responsiveQuad(
              a: _overviewCard(title: 'TODAY NG', icon: Icons.today, accent: const Color(0xFF3B82F6), row: today),
              b: _overviewCard(title: 'THIS WEEK NG', icon: Icons.calendar_view_week, accent: const Color(0xFF10B981), row: week),
              c: _overviewCard(title: 'THIS MONTH NG', icon: Icons.calendar_view_month, accent: const Color(0xFFF59E0B), row: month),
              d: _overviewCard(title: 'THIS YEAR NG', icon: Icons.event, accent: const Color(0xFFEF4444), row: year),
            ),
          ],
        ),
      ),
    );

    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            filterHeader,
            filterCard,
            if (_loading) const LinearProgressIndicator(),
            overviewSection,
            _sectionTitle('2. PQC NG Trending'),
            _responsivePair(
              a: _ppmChart(title: 'Daily NG Rate', data: _daily, xKey: 'SETTING_DATE', xLabel: 'Ngày', reverse: true),
              b: _ppmChart(title: 'Weekly NG Rate', data: _weekly, xKey: 'SETTING_YW', xLabel: 'Tuần', reverse: true),
            ),
            const SizedBox(height: 8),
            _responsivePair(
              a: _ppmChart(title: 'Monthly NG Rate', data: _monthly, xKey: 'SETTING_YM', xLabel: 'Tháng', reverse: true),
              b: _ppmChart(title: 'Yearly NG Rate', data: _yearly, xKey: 'SETTING_YEAR', xLabel: 'Năm', reverse: true),
            ),
            _sectionTitle('2.5 PQC Defects Trending'),
            _defectTrendingChart(),
            _pqc3List(),
            _sectionTitle('3. PQC F-COST Status'),
            _summaryTable(),
            _sectionTitle('3.1 PQC F-Cost Trending'),
            _responsivePair(
              a: _fcostChart(title: 'Daily F-Cost', data: _daily, xKey: 'SETTING_DATE', xLabel: 'Ngày'),
              b: _fcostChart(title: 'Weekly F-Cost', data: _weekly, xKey: 'SETTING_YW', xLabel: 'Tuần'),
            ),
            const SizedBox(height: 8),
            _responsivePair(
              a: _fcostChart(title: 'Monthly F-Cost', data: _monthly, xKey: 'SETTING_YM', xLabel: 'Tháng'),
              b: _fcostChart(title: 'Yearly F-Cost', data: _yearly, xKey: 'SETTING_YEAR', xLabel: 'Năm'),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
