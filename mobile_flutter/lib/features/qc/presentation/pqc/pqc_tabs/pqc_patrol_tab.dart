import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../../core/config/app_config.dart';
import '../../../../../core/providers.dart';

class PqcPatrolTab extends ConsumerStatefulWidget {
  const PqcPatrolTab({super.key});

  @override
  ConsumerState<PqcPatrolTab> createState() => _PqcPatrolTabState();
}

class _PqcPatrolTabState extends ConsumerState<PqcPatrolTab> {
  bool _loading = false;
  bool _showFilter = true;

  bool _live = true;
  DateTime _fromDate = DateTime.now();
  DateTime _toDate = DateTime.now();
  bool _fullScreen = false;

  Timer? _timer;

  List<Map<String, dynamic>> _pqc3 = const [];
  List<Map<String, dynamic>> _dtc = const [];
  List<Map<String, dynamic>> _insp = const [];

  String _s(dynamic v) => (v ?? '').toString();
  num _num(dynamic v) => (v is num) ? v : (num.tryParse(_s(v).replaceAll(',', '')) ?? 0);
  bool _isNg(Map<String, dynamic> body) => (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  String _ymd(DateTime dt) => DateFormat('yyyy-MM-dd').format(dt);
  String _ymdHms(String raw) {
    final s = raw.trim();
    if (s.isEmpty) return s;
    DateTime? dt;
    try {
      dt = DateTime.parse(s.replaceFirst(' ', 'T'));
    } catch (_) {
      try {
        dt = DateTime.parse(s);
      } catch (_) {
        dt = null;
      }
    }
    if (dt == null) return s;
    final local = dt.isUtc ? dt.toLocal() : dt;
    return DateFormat('yyyy-MM-dd HH:mm:ss').format(local);
  }

  @override
  void initState() {
    super.initState();
    _fromDate = DateTime.now();
    _toDate = DateTime.now();
    _loadAll();
    _startTimerIfNeeded();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _startTimerIfNeeded() {
    _timer?.cancel();
    if (!_live) return;
    _timer = Timer.periodic(const Duration(seconds: 10), (_) {
      if (!mounted) return;
      _loadAll(silent: true);
    });
  }

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  Future<Map<String, dynamic>> _post(String command, Map<String, dynamic>? data) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(command, data: data);
    final body = res.data;
    if (body is Map<String, dynamic>) return body;
    return <String, dynamic>{'tk_status': 'NG', 'message': 'Bad response'};
  }

  Future<List<Map<String, dynamic>>> _callList(String command, Map<String, dynamic>? payload) async {
    final body = await _post(command, payload);
    if (_isNg(body)) return const [];
    final raw = body['data'];
    final data = raw is List ? raw : const [];
    return data.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();
  }

  Future<void> _pickDate({required bool isFrom}) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: isFrom ? _fromDate : _toDate,
      firstDate: DateTime(2020, 1, 1),
      lastDate: DateTime(2100, 12, 31),
    );
    if (picked == null) return;
    if (!mounted) return;
    setState(() {
      if (isFrom) {
        _fromDate = picked;
      } else {
        _toDate = picked;
      }
    });
  }

  Map<String, dynamic> _datePayload() {
    final from = _live ? _ymd(DateTime.now()) : _ymd(_fromDate);
    final to = _live ? _ymd(DateTime.now()) : _ymd(_toDate);
    return {'FROM_DATE': from, 'TO_DATE': to};
  }

  Future<void> _loadAll({bool silent = false}) async {
    if (_loading) return;
    setState(() {
      _loading = true;
      _showFilter = false;
    });
    try {
      final d = _datePayload();

      final futures = <Future<void>>[
        () async {
          final rows = await _callList('trapqc3data', {
            'ALLTIME': false,
            'FROM_DATE': d['FROM_DATE'],
            'TO_DATE': d['TO_DATE'],
            'CUST_NAME': '',
            'PROCESS_LOT_NO': '',
            'G_CODE': '',
            'G_NAME': '',
            'PROD_TYPE': '',
            'EMPL_NAME': '',
            'PROD_REQUEST_NO': '',
            'ID': '',
            'FACTORY': 'All',
          });
          for (final r in rows) {
            if (r['OCCURR_TIME'] != null) {
              r['OCCURR_TIME'] = _ymdHms(_s(r['OCCURR_TIME']));
            }
          }
          final limited = rows.length > 3 ? rows.sublist(0, 3) : rows;
          if (!mounted) return;
          setState(() => _pqc3 = limited);
        }(),
        () async {
          final rows = await _callList('loadDTCPatrol', d);
          for (final r in rows) {
            if (r['INS_DATE'] != null) {
              r['INS_DATE'] = _ymdHms(_s(r['INS_DATE']));
            }
          }
          if (!mounted) return;
          setState(() => _dtc = rows);
        }(),
        () async {
          final rows = await _callList('trainspectionpatrol', d);
          if (!mounted) return;
          setState(() => _insp = rows);
        }(),
        // header is not rendered on mobile; still call to mimic side effects
        () async {
          await _callList('getpatrolheader', d);
        }(),
      ];

      await Future.wait(futures);
      if (!mounted) return;
      setState(() => _loading = false);
      if (!silent) _snack('Đã load PATROL');
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      if (!silent) _snack('Lỗi: $e');
    }
  }

  String _subtitle() {
    if (_live) return 'Today';
    return '${_ymd(_fromDate)} → ${_ymd(_toDate)}';
  }

  Future<void> _openLink(String path) async {
    final url = Uri.parse('${AppConfig.imageBaseUrl}$path');
    await launchUrl(url, mode: LaunchMode.externalApplication);
  }

  Widget _lane({required String title, required String subtitle, required List<Map<String, dynamic>> items, required Widget Function(Map<String, dynamic> r) builder}) {
    if (items.isEmpty) return const SizedBox.shrink();
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                Expanded(child: Text(title, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16))),
                Text(subtitle, style: const TextStyle(color: Colors.black54, fontWeight: FontWeight.w700)),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(color: Colors.blue.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(999)),
                  child: Text('${items.length}', style: const TextStyle(fontWeight: FontWeight.w900, color: Colors.blue)),
                ),
              ],
            ),
            const SizedBox(height: 10),
            SizedBox(
              height: 210,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: items.length,
                separatorBuilder: (_, __) => const SizedBox(width: 10),
                itemBuilder: (context, idx) => builder(items[idx]),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _patrolCard({
    required String cust,
    required String gName,
    required String defect,
    required String eq,
    required String factory,
    required String time,
    required String empl,
    required int inspectQty,
    required int ngQty,
    required String linkPath,
  }) {
    final imgUrl = Uri.parse('${AppConfig.imageBaseUrl}$linkPath');
    return SizedBox(
      width: 320,
      child: InkWell(
        onTap: () async {
          await _openLink(linkPath);
        },
        child: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            gradient: LinearGradient(colors: [Colors.indigo.withValues(alpha: 0.10), Colors.white]),
            border: Border.all(color: Colors.black.withValues(alpha: 0.06)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Text(
                      defect,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontWeight: FontWeight.w900, color: Colors.red),
                    ),
                  ),
                  const SizedBox(width: 10),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: Container(
                      width: 92,
                      height: 68,
                      color: Colors.black.withValues(alpha: 0.05),
                      child: Image.network(
                        imgUrl.toString(),
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => const Center(
                          child: Icon(Icons.broken_image_outlined, color: Colors.black45),
                        ),
                        loadingBuilder: (context, child, progress) {
                          if (progress == null) return child;
                          return const Center(child: SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2)));
                        },
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(gName, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w900, color: Colors.blue)),
              const SizedBox(height: 6),
              Text('$cust • $factory • $eq', maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w700, color: Colors.black54)),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(child: Text(time, style: const TextStyle(fontWeight: FontWeight.w800, color: Colors.black87))),
                  const SizedBox(width: 6),
                  Text('OK:$inspectQty', style: const TextStyle(fontWeight: FontWeight.w900, color: Colors.green)),
                  const SizedBox(width: 8),
                  Text('NG:$ngQty', style: const TextStyle(fontWeight: FontWeight.w900, color: Colors.red)),
                ],
              ),
              const SizedBox(height: 4),
              Text('PIC: $empl', maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(color: Colors.black54, fontWeight: FontWeight.w700)),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final subtitle = _subtitle();

    Widget header() {
      return Card(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
          child: Row(
            children: [
              IconButton(
                tooltip: _showFilter ? 'Ẩn filter' : 'Hiện filter',
                onPressed: _loading ? null : () => setState(() => _showFilter = !_showFilter),
                icon: Icon(_showFilter ? Icons.filter_alt_off : Icons.filter_alt),
              ),
              const Expanded(child: Text('PATROL', style: TextStyle(fontWeight: FontWeight.w900))),
              FilledButton.tonal(onPressed: _loading ? null : () => _loadAll(), child: const Text('Load')),
              const SizedBox(width: 8),
              IconButton(
                tooltip: 'Full Screen',
                onPressed: () => setState(() => _fullScreen = !_fullScreen),
                icon: Icon(_fullScreen ? Icons.fullscreen_exit : Icons.fullscreen),
              ),
            ],
          ),
        ),
      );
    }

    Widget filter() {
      if (!_showFilter) return const SizedBox.shrink();
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Wrap(
            spacing: 10,
            runSpacing: 8,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Switch(
                    value: _live,
                    onChanged: (v) {
                      setState(() {
                        _live = v;
                        if (_live) {
                          _fromDate = DateTime.now();
                          _toDate = DateTime.now();
                        }
                      });
                      _startTimerIfNeeded();
                    },
                  ),
                  const Text('Live'),
                ],
              ),
              OutlinedButton(
                onPressed: _loading || _live ? null : () => _pickDate(isFrom: true),
                child: Text('FROM: ${_ymd(_fromDate)}'),
              ),
              OutlinedButton(
                onPressed: _loading || _live ? null : () => _pickDate(isFrom: false),
                child: Text('TO: ${_ymd(_toDate)}'),
              ),
              Text('Auto refresh 10s', style: TextStyle(color: _live ? Colors.blue : Colors.black45, fontWeight: FontWeight.w800)),
            ],
          ),
        ),
      );
    }

    final inspNlPk = _insp.where((e) {
      final pl = _s(e['PHANLOAI']).toUpperCase();
      return pl == 'NL' || pl == 'PK';
    }).toList();

    final pad = _fullScreen ? EdgeInsets.zero : const EdgeInsets.all(8);

    return Padding(
      padding: pad,
      child: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(child: header()),
          SliverToBoxAdapter(child: filter()),
          if (_loading) const SliverToBoxAdapter(child: LinearProgressIndicator()),
          SliverToBoxAdapter(
            child: _lane(
              title: 'PQC3',
              subtitle: subtitle,
              items: _pqc3,
              builder: (r) {
                final id = _num(r['PQC3_ID']).toInt();
                final defect = '${_s(r['ERR_CODE'])}: ${_s(r['DEFECT_PHENOMENON'])}';
                return _patrolCard(
                  cust: _s(r['CUST_NAME_KD']),
                  gName: _s(r['G_NAME_KD']).isEmpty ? _s(r['G_NAME']) : _s(r['G_NAME_KD']),
                  defect: defect,
                  eq: _s(r['LINE_NO']),
                  factory: _s(r['FACTORY']),
                  time: _s(r['OCCURR_TIME']),
                  empl: _s(r['LINEQC_PIC']),
                  inspectQty: _num(r['INSPECT_QTY']).toInt(),
                  ngQty: _num(r['DEFECT_QTY']).toInt(),
                  linkPath: '/pqc/PQC3_${id + 1}.png',
                );
              },
            ),
          ),
          SliverToBoxAdapter(
            child: _lane(
              title: 'DTC',
              subtitle: subtitle,
              items: _dtc,
              builder: (r) {
                final dtcId = _num(r['DTC_ID']).toInt();
                final vendorOrCust = _s(r['M_CODE']) != 'B0000035' ? _s(r['VENDOR']) : _s(r['CUST_NAME_KD']);
                final factory = _s(r['M_CODE']) != 'B0000035' ? _s(r['M_FACTORY']) : _s(r['FACTORY']);
                final gName = _s(r['M_CODE']) != 'B0000035' ? '${_s(r['M_NAME'])}|${_s(r['WIDTH_CD'])}' : _s(r['G_NAME_KD']);
                final link = '/DTC_PATROL/${dtcId}_${_s(r['TEST_CODE'])}${_s(r['FILE_'])}';
                return _patrolCard(
                  cust: vendorOrCust,
                  gName: gName,
                  defect: _s(r['DEFECT_PHENOMENON']),
                  eq: _s(r['TEST_NAME']),
                  factory: factory,
                  time: _s(r['INS_DATE']),
                  empl: _s(r['INS_EMPL']),
                  inspectQty: 5,
                  ngQty: 5,
                  linkPath: link,
                );
              },
            ),
          ),
          SliverToBoxAdapter(
            child: _lane(
              title: 'INS Patrol',
              subtitle: 'NL / PK',
              items: inspNlPk,
              builder: (r) {
                final id = _num(r['INS_PATROL_ID']).toInt();
                final defect = '${_s(r['ERR_CODE'])}: ${_s(r['DEFECT_PHENOMENON'])}';
                return _patrolCard(
                  cust: _s(r['CUST_NAME_KD']),
                  gName: _s(r['G_NAME_KD']),
                  defect: defect,
                  eq: _s(r['EQUIPMENT_CD']),
                  factory: _s(r['FACTORY']),
                  time: _ymdHms(_s(r['OCCURR_TIME'])),
                  empl: _s(r['INSP_PIC']),
                  inspectQty: _num(r['INSPECT_QTY']).toInt(),
                  ngQty: _num(r['DEFECT_QTY']).toInt(),
                  linkPath: '/INS_PATROL/INS_PATROL_$id.png',
                );
              },
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 12)),
        ],
      ),
    );
  }
}
