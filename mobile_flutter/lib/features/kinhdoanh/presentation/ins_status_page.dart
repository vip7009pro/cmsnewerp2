import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../app/app_drawer.dart';
import '../../../core/config/app_config.dart';
import '../../../core/providers.dart';

class InsStatusPage extends ConsumerStatefulWidget {
  const InsStatusPage({super.key});

  @override
  ConsumerState<InsStatusPage> createState() => _InsStatusPageState();
}

class _InsStatusPageState extends ConsumerState<InsStatusPage> {
  final _searchCtrl = TextEditingController();

  bool _loading = false;
  Timer? _ticker;

  List<Map<String, dynamic>> _rows = const [];

  String _factoryFilter = 'ALL';
  bool _onlyRunning = false;
  bool _showFilters = true;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadInsStatus();
      _ticker = Timer.periodic(const Duration(seconds: 3), (_) => _loadInsStatus(silent: true));
    });
  }

  @override
  void dispose() {
    _ticker?.cancel();
    _searchCtrl.dispose();
    super.dispose();
  }

  String _s(dynamic v) => (v ?? '').toString();

  Future<Map<String, dynamic>> _post(String command, Map<String, dynamic> data) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(command, data: data);
    final body = res.data;
    if (body is Map<String, dynamic>) return body;
    return <String, dynamic>{'tk_status': 'NG', 'message': 'Bad response'};
  }

  bool _isNg(Map<String, dynamic> body) => (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  Future<void> _loadInsStatus({bool silent = false}) async {
    if (!silent) setState(() => _loading = true);
    try {
      final body = await _post('getIns_Status', {});
      if (!mounted) return;

      if (_isNg(body)) {
        if (!silent) {
          setState(() {
            _loading = false;
            _rows = const [];
          });
          _snack('Lỗi: ${(body['message'] ?? 'NG').toString()}');
        }
        return;
      }

      final data = body['data'];
      final list = (data is List ? data : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList();

      setState(() {
        _rows = list;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      if (!silent) {
        setState(() => _loading = false);
        _snack('Lỗi: $e');
      }
    }
  }

  bool _matchSearch(Map<String, dynamic> it) {
    final q = _searchCtrl.text.trim().toLowerCase();
    if (q.isEmpty) return true;
    return _s(it['G_NAME']).toLowerCase().contains(q) ||
        _s(it['G_NAME_KD']).toLowerCase().contains(q) ||
        _s(it['EQ_NAME']).toLowerCase().contains(q) ||
        _s(it['CURR_PLAN_ID']).toLowerCase().contains(q) ||
        _s(it['CURR_G_CODE']).toLowerCase().contains(q);
  }

  bool _matchFactory(Map<String, dynamic> it) {
    if (_factoryFilter == 'ALL') return true;
    return _s(it['FACTORY']).trim().toUpperCase() == _factoryFilter.toUpperCase();
  }

  bool _matchOnlyRunning(Map<String, dynamic> it) {
    if (!_onlyRunning) return true;
    return _s(it['EQ_STATUS']).trim().toUpperCase() == 'START';
  }

  Future<void> _resetStatus(Map<String, dynamic> it) async {
    final eqName = _s(it['EQ_NAME']).trim();
    if (eqName.isEmpty) return;

    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          title: const Text('Xác nhận'),
          content: Text('Reset status cho máy $eqName ?'),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Hủy')),
            FilledButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Reset')),
          ],
        );
      },
    );

    if (ok != true) return;

    try {
      final body = await _post('resetStatus', {'EQ_NAME': eqName});
      if (_isNg(body)) {
        _snack('Reset failed: ${(body['message'] ?? 'NG').toString()}');
        return;
      }
      _snack('Reset OK: $eqName');
      await _loadInsStatus(silent: true);
    } catch (e) {
      _snack('Lỗi: $e');
    }
  }

  String _statusLabel(String v) {
    final s = v.trim().toUpperCase();
    if (s == 'START') return 'RUN';
    if (s == 'SETTING') return 'SET';
    if (s == 'STOP') return 'STOP';
    return s.isEmpty ? 'NA' : s;
  }

  Color _statusColor(String v, ColorScheme scheme) {
    final s = v.trim().toUpperCase();
    if (s == 'START') return Colors.green;
    if (s == 'SETTING') return Colors.amber;
    if (s == 'STOP') return Colors.red;
    return scheme.secondary;
  }

  String _statusGifAsset(String label) {
    if (label == 'RUN') return 'assets/eq_status/blink.gif';
    if (label == 'SET') return 'assets/eq_status/setting3.gif';
    return 'assets/eq_status/setting.gif';
  }

  Widget _statusIcon(String label, Color color) {
    return Image.asset(
      _statusGifAsset(label),
      width: 36,
      height: 18,
      errorBuilder: (context, error, stackTrace) {
        return Icon(
          label == 'RUN' ? Icons.play_arrow_rounded : label == 'SET' ? Icons.settings_rounded : Icons.stop_rounded,
          size: 18,
          color: color,
        );
      },
    );
  }

  Widget _inspectCard(Map<String, dynamic> it) {
    final scheme = Theme.of(context).colorScheme;

    final eqName = _s(it['EQ_NAME']).trim();
    final gNameKd = _s(it['G_NAME_KD']).trim();
    final emplCount = _s(it['EMPL_COUNT']).trim();
    final eqStatus = _s(it['EQ_STATUS']).trim();

    final label = _statusLabel(eqStatus);
    final sttColor = _statusColor(eqStatus, scheme);

    return GestureDetector(
      onDoubleTap: () => _resetStatus(it),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: sttColor.withValues(alpha: 0.55)),
          color: Color.alphaBlend(sttColor.withValues(alpha: 0.08), scheme.surfaceContainerHighest),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 10,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        padding: const EdgeInsets.all(10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    eqName,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontWeight: FontWeight.w900),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: sttColor.withValues(alpha: 0.16),
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Text(
                    label,
                    style: TextStyle(fontWeight: FontWeight.w900, color: sttColor),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            if (label == 'RUN' || label == 'SET')
              Align(alignment: Alignment.centerLeft, child: _statusIcon(label, sttColor)),
            const SizedBox(height: 6),
            Text(
              gNameKd.isEmpty ? '-' : gNameKd,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontWeight: FontWeight.w700),
            ),
            const Spacer(),
            Row(
              children: [
                const Icon(Icons.person_outline, size: 16),
                const SizedBox(width: 6),
                Text(
                  '${emplCount.isEmpty ? '-' : emplCount} người',
                  style: TextStyle(color: scheme.onSurfaceVariant, fontSize: 12),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  int _sumWhere(bool Function(Map<String, dynamic>) pred) {
    var sum = 0;
    for (final r in _rows) {
      if (!pred(r)) continue;
      sum += int.tryParse(_s(r['EMPL_COUNT'])) ?? 0;
    }
    return sum;
  }

  Widget _kpiCard({required String label, required int value, required Color color}) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(14),
        color: color.withValues(alpha: 0.12),
        border: Border.all(color: color.withValues(alpha: 0.24)),
      ),
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: TextStyle(color: color, fontWeight: FontWeight.w900)),
          const SizedBox(height: 6),
          Text(value.toString(), style: TextStyle(color: color, fontSize: 20, fontWeight: FontWeight.w900)),
        ],
      ),
    );
  }

  Widget _areaGrid(List<Map<String, dynamic>> items) {
    final filtered = items.where(_matchFactory).where(_matchSearch).where(_matchOnlyRunning).toList();
    if (filtered.isEmpty) {
      return const Center(child: Text('Không có dữ liệu'));
    }

    return LayoutBuilder(
      builder: (ctx, c) {
        final w = c.maxWidth;
        final cross = w >= 900
            ? 4
            : w >= 650
                ? 3
                : 2;
        final ratio = cross >= 4
            ? 1.05
            : cross == 3
                ? 0.98
                : 0.92;

        return GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: cross,
            crossAxisSpacing: 10,
            mainAxisSpacing: 10,
            childAspectRatio: ratio,
          ),
          itemCount: filtered.length,
          itemBuilder: (_, i) => _inspectCard(filtered[i]),
        );
      },
    );
  }

  Widget _areaPanel({required String title, required int count, required List<Map<String, dynamic>> items}) {
    final scheme = Theme.of(context).colorScheme;
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(child: Text(title, style: const TextStyle(fontWeight: FontWeight.w900))),
                Text('$count người', style: TextStyle(color: scheme.onSurfaceVariant)),
              ],
            ),
            const SizedBox(height: 10),
            _areaGrid(items),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    final nm1a = _sumWhere((r) => _s(r['KHUVUC']).trim().toUpperCase() == 'A');
    final nm1b = _sumWhere((r) => _s(r['KHUVUC']).trim().toUpperCase() == 'B');
    final nm2n = _sumWhere((r) => _s(r['KHUVUC']).trim().toUpperCase() == 'N');
    final nm2o = _sumWhere((r) => _s(r['KHUVUC']).trim().toUpperCase() == 'O');
    final nm2u = _sumWhere((r) => _s(r['KHUVUC']).trim().toUpperCase() == 'U');

    final factoryOptions = <String>['ALL', 'NM1', if (AppConfig.company == 'CMS') 'NM2'];

    InputDecoration dec(String label) => InputDecoration(
          labelText: label,
          labelStyle: TextStyle(color: scheme.onSurfaceVariant),
          filled: true,
          fillColor: scheme.surfaceContainerHighest,
        );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Inspection Status'),
        actions: [
          IconButton(
            onPressed: () => setState(() => _showFilters = !_showFilters),
            icon: Icon(_showFilters ? Icons.filter_alt_off : Icons.filter_alt),
            tooltip: _showFilters ? 'Hide filter' : 'Show filter',
          ),
          IconButton(
            onPressed: () => _loadInsStatus(),
            icon: const Icon(Icons.refresh),
            tooltip: 'Refresh',
          ),
        ],
      ),
      drawer: const AppDrawer(title: 'ERP'),
      body: RefreshIndicator(
        onRefresh: () async => _loadInsStatus(),
        child: ListView(
          padding: const EdgeInsets.all(12),
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Realtime overview',
                                style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18),
                              ),
                              const SizedBox(height: 4),
                              Text('Auto refresh 3s', style: TextStyle(color: scheme.onSurfaceVariant)),
                            ],
                          ),
                        ),
                        if (_loading) const SizedBox(width: 22, height: 22, child: CircularProgressIndicator(strokeWidth: 2)),
                      ],
                    ),
                    if (_showFilters) ...[
                      const SizedBox(height: 12),
                      LayoutBuilder(
                        builder: (ctx, c) {
                          final wide = c.maxWidth >= 700;
                          final factoryDd = DropdownButtonFormField<String>(
                            initialValue: _factoryFilter,
                            dropdownColor: scheme.surface,
                            style: TextStyle(color: scheme.onSurface),
                            items: [for (final v in factoryOptions) DropdownMenuItem(value: v, child: Text(v))],
                            onChanged: (v) => setState(() => _factoryFilter = v ?? 'ALL'),
                            decoration: dec('Factory'),
                          );

                          final searchTf = TextField(
                            controller: _searchCtrl,
                            decoration: dec('Search'),
                            onChanged: (_) => setState(() {}),
                          );

                          if (wide) {
                            return Row(
                              children: [
                                Expanded(child: factoryDd),
                                const SizedBox(width: 12),
                                Expanded(child: searchTf),
                              ],
                            );
                          }

                          return Column(
                            children: [
                              factoryDd,
                              const SizedBox(height: 12),
                              searchTf,
                            ],
                          );
                        },
                      ),
                      const SizedBox(height: 12),
                      CheckboxListTile(
                        value: _onlyRunning,
                        dense: true,
                        contentPadding: EdgeInsets.zero,
                        title: const Text('Only running (START)'),
                        controlAffinity: ListTileControlAffinity.leading,
                        onChanged: (v) => setState(() => _onlyRunning = v ?? false),
                      ),
                    ],
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            LayoutBuilder(
              builder: (ctx, c) {
                final w = c.maxWidth;
                final cross = w >= 1100
                    ? 6
                    : w >= 900
                        ? 4
                        : w >= 650
                            ? 3
                            : 2;
                return GridView.count(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisCount: cross,
                  crossAxisSpacing: 10,
                  mainAxisSpacing: 10,
                  childAspectRatio: 1.9,
                  children: [
                    _kpiCard(label: 'NM1 (A+B)', value: nm1a + nm1b, color: Colors.blue),
                    _kpiCard(label: 'Xưởng A', value: nm1a, color: Colors.teal),
                    _kpiCard(label: 'Xưởng B', value: nm1b, color: Colors.cyan),
                    if (AppConfig.company == 'CMS') ...[
                      _kpiCard(label: 'NM2 (N+O+U)', value: nm2n + nm2o + nm2u, color: Colors.amber),
                      _kpiCard(label: 'OLED', value: nm2o, color: Colors.purple),
                      _kpiCard(label: 'UV', value: nm2u, color: Colors.green),
                    ],
                  ],
                );
              },
            ),
            const SizedBox(height: 12),
            if (_rows.isEmpty && !_loading)
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Text('Chưa có dữ liệu', style: TextStyle(color: scheme.onSurfaceVariant)),
                ),
              ),
            if (_rows.isNotEmpty) ...[
              if (_factoryFilter == 'ALL' || _factoryFilter == 'NM1') ...[
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Expanded(
                              child: Text('NM1', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18)),
                            ),
                            Text('${nm1a + nm1b} người', style: TextStyle(color: scheme.onSurfaceVariant)),
                          ],
                        ),
                        const SizedBox(height: 12),
                        LayoutBuilder(
                          builder: (ctx, c) {
                            final wide = c.maxWidth >= 900;
                            final aItems = _rows.where((r) => _s(r['KHUVUC']).trim().toUpperCase() == 'A').toList();
                            final bItems = _rows.where((r) => _s(r['KHUVUC']).trim().toUpperCase() == 'B').toList();

                            final aPanel = _areaPanel(title: 'Xưởng A', count: nm1a, items: aItems);
                            final bPanel = _areaPanel(title: 'Xưởng B', count: nm1b, items: bItems);

                            if (wide) {
                              return Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Expanded(child: aPanel),
                                  const SizedBox(width: 12),
                                  Expanded(child: bPanel),
                                ],
                              );
                            }

                            return Column(
                              children: [
                                aPanel,
                                const SizedBox(height: 12),
                                bPanel,
                              ],
                            );
                          },
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 12),
              ],
              if (AppConfig.company == 'CMS' && (_factoryFilter == 'ALL' || _factoryFilter == 'NM2')) ...[
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Expanded(
                              child: Text('NM2', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18)),
                            ),
                            Text('${nm2n + nm2o + nm2u} người', style: TextStyle(color: scheme.onSurfaceVariant)),
                          ],
                        ),
                        const SizedBox(height: 12),
                        _areaPanel(
                          title: 'Hàng Thường',
                          count: nm2n,
                          items: _rows.where((r) => _s(r['KHUVUC']).trim().toUpperCase() == 'N').toList(),
                        ),
                        const SizedBox(height: 12),
                        _areaPanel(
                          title: 'OLED',
                          count: nm2o,
                          items: _rows.where((r) => _s(r['KHUVUC']).trim().toUpperCase() == 'O').toList(),
                        ),
                        const SizedBox(height: 12),
                        _areaPanel(
                          title: 'UV',
                          count: nm2u,
                          items: _rows.where((r) => _s(r['KHUVUC']).trim().toUpperCase() == 'U').toList(),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ],
          ],
        ),
      ),
    );
  }
}
