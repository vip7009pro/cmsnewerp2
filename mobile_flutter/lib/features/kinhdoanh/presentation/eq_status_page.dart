import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pluto_grid/pluto_grid.dart';

import '../../../app/app_drawer.dart';
import '../../../core/config/app_config.dart';
import '../../../core/providers.dart';
import '../../auth/application/auth_notifier.dart';
import '../../auth/application/auth_state.dart';

class EqStatusPage extends ConsumerStatefulWidget {
  const EqStatusPage({super.key});

  @override
  ConsumerState<EqStatusPage> createState() => _EqStatusPageState();
}

class _EqStatusPageState extends ConsumerState<EqStatusPage> {
  final _searchCtrl = TextEditingController();

  bool _loading = false;
  List<Map<String, dynamic>> _eqStatus = const [];
  List<String> _eqSeries = const [];

  String _factoryFilter = 'ALL';
  String _seriesFilter = 'ALL';
  bool _onlyRunning = false;
  bool _showFilters = true;

  Timer? _ticker;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadEqStatus();
      _ticker = Timer.periodic(const Duration(seconds: 3), (_) => _loadEqStatus(silent: true));
    });
  }

  @override
  void dispose() {
    _ticker?.cancel();
    _searchCtrl.dispose();
    super.dispose();
  }

  String _s(dynamic v) => (v ?? '').toString();

  String _emplNo() {
    final s = ref.read(authNotifierProvider);
    if (s is AuthAuthenticated) return s.session.user.emplNo;
    return '';
  }

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  Future<Map<String, dynamic>> _post(String command, Map<String, dynamic> data) async {
    final api = ref.read(apiClientProvider);
    final res = await api.postCommand(command, data: data);
    final body = res.data;
    if (body is Map<String, dynamic>) return body;
    return <String, dynamic>{'tk_status': 'NG', 'message': 'Bad response'};
  }

  bool _isNg(Map<String, dynamic> body) {
    return (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';
  }

  Future<void> _loadEqStatus({bool silent = false}) async {
    if (!silent) setState(() => _loading = true);
    try {
      final body = await _post('checkEQ_STATUS', {});
      if (!mounted) return;

      if (_isNg(body)) {
        if (!silent) {
          setState(() {
            _loading = false;
            _eqStatus = const [];
            _eqSeries = const [];
          });
          _snack('Lỗi: ${(body['message'] ?? 'NG').toString()}');
        }
        return;
      }

      final data = body['data'];
      final list = (data is List ? data : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList();

      final series = <String>{};
      for (final it in list) {
        final s = _s(it['EQ_SERIES']).trim();
        if (s.isNotEmpty) series.add(s);
      }

      setState(() {
        _eqStatus = list;
        _eqSeries = series.toList()..sort();
        if (_seriesFilter != 'ALL' && !_eqSeries.contains(_seriesFilter)) {
          _seriesFilter = 'ALL';
        }
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
    return _s(it['CURR_PLAN_ID']).toLowerCase().contains(q) ||
        _s(it['CURR_G_CODE']).toLowerCase().contains(q) ||
        _s(it['G_NAME_KD']).toLowerCase().contains(q) ||
        _s(it['EQ_NAME']).toLowerCase().contains(q) ||
        _s(it['EQ_CODE']).toLowerCase().contains(q);
  }

  bool _matchOnlyRunning(Map<String, dynamic> it) {
    if (!_onlyRunning) return true;
    return _s(it['EQ_STATUS']).trim().toUpperCase() == 'MASS';
  }

  Future<void> _toggleMachineActive(Map<String, dynamic> it) async {
    final eqCode = _s(it['EQ_CODE']).trim();
    if (eqCode.isEmpty) return;
    final current = _s(it['EQ_ACTIVE']).trim().toUpperCase();
    final next = current == 'OK' ? 'NG' : 'OK';

    try {
      final body = await _post('toggleMachineActiveStatus', {
        'EQ_CODE': eqCode,
        'EQ_ACTIVE': next,
      });
      if (_isNg(body)) {
        _snack('Toggle thất bại: ${(body['message'] ?? 'NG').toString()}');
        return;
      }
      _snack('Đã đổi trạng thái: $eqCode -> $next');
      await _loadEqStatus(silent: true);
    } catch (e) {
      _snack('Lỗi: $e');
    }
  }

  Color _statusColor(String status, ColorScheme scheme) {
    final s = status.trim().toUpperCase();
    if (s == 'MASS' || s == 'RUN' || s == 'RUNNING') return Colors.green;
    if (s == 'SETTING' || s == 'SET') return Colors.amber;
    if (s == 'STOP') return Colors.red;
    return scheme.secondary;
  }

  String _statusLabel(String v) {
    final s = v.trim().toUpperCase();
    if (s == 'MASS') return 'RUN';
    if (s == 'SETTING') return 'SET';
    if (s == 'STOP') return 'STOP';
    return s.isEmpty ? 'NA' : s;
  }

  String _statusGifAsset(String label) {
    // Web uses: public/blink.gif, public/setting.gif, public/setting3.gif
    // For Flutter you need to copy these into mobile_flutter/assets/eq_status/ and declare in pubspec.yaml.
    if (label == 'RUN') return 'assets/eq_status/blink.gif';
    if (label == 'SET') return 'assets/eq_status/setting.gif';
    return 'assets/eq_status/setting3.gif';
  }

  Widget _statusIcon(String label, Color color) {
    return Image.asset(
      _statusGifAsset(label),
      width: 20,
      height: 20,
      errorBuilder: (context, error, stackTrace) {
        return Icon(
          label == 'RUN' ? Icons.play_arrow_rounded : label == 'SET' ? Icons.settings_rounded : Icons.stop_rounded,
          size: 18,
          color: color,
        );
      },
    );
  }

  Widget _machineCard(Map<String, dynamic> it) {
    final scheme = Theme.of(context).colorScheme;
    final eqName = _s(it['EQ_NAME']).trim();
    final eqCode = _s(it['EQ_CODE']).trim();
    final eqStatus = _s(it['EQ_STATUS']).trim();
    final eqActive = _s(it['EQ_ACTIVE']).trim().toUpperCase();

    final gName = _s(it['G_NAME_KD']).trim();
    final planId = _s(it['CURR_PLAN_ID']).trim();
    final gCode = _s(it['CURR_G_CODE']).trim();
    final step = _s(it['STEP']).trim();

    final activeOk = eqActive == 'OK';
    final sttColor = _statusColor(eqStatus, scheme);
    final border = activeOk ? sttColor.withValues(alpha: 0.55) : scheme.error;
    final bg = activeOk ? sttColor.withValues(alpha: 0.10) : scheme.error.withValues(alpha: 0.10);

    return GestureDetector(
      onDoubleTap: () => _toggleMachineActive(it),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: border),
          color: Color.alphaBlend(bg, scheme.surfaceContainerHighest),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.06),
              blurRadius: 12,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        padding: const EdgeInsets.all(5),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              children: [
                Container(
                  width: 28,
                  height: 28,
                  decoration: BoxDecoration(
                    color: sttColor.withValues(alpha: 0.18),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Center(child: _statusIcon(_statusLabel(eqStatus), sttColor)),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    eqName.isEmpty ? eqCode : eqName,
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
                    border: Border.all(color: sttColor.withValues(alpha: 0.35)),
                  ),
                  child: Text(
                    _statusLabel(eqStatus),
                    style: TextStyle(
                      fontWeight: FontWeight.w800,
                      color: sttColor,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: activeOk ? Colors.green.withValues(alpha: 0.18) : Colors.red.withValues(alpha: 0.18),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    activeOk ? 'ACTIVE' : 'INACTIVE',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                      color: activeOk ? Colors.green.shade800 : Colors.red.shade800,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                if (eqCode.isNotEmpty)
                  Text(
                    eqCode,
                    style: TextStyle(color: scheme.onSurfaceVariant, fontSize: 12),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
              ],
            ),
            const SizedBox(height: 8),
            if (gName.isNotEmpty)
              Text(
                gName,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontWeight: FontWeight.w700),
              )
            else
              Text(
                gCode.isEmpty ? '-' : gCode,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontWeight: FontWeight.w700),
              ),
            const SizedBox(height: 4),
            Row(
              children: [
                Expanded(
                  child: Text(
                    'PLAN: ${planId.isEmpty ? '-' : planId}  |  STEP: ${step.isEmpty ? '-' : step}',
                    style: TextStyle(color: scheme.onSurfaceVariant, fontSize: 12),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
            /* const SizedBox(height: 4),
            Text(
              'UPD: ${updDate.isEmpty ? '-' : updDate}  |  ${updEmpl.isEmpty ? '-' : updEmpl}',
              style: TextStyle(color: scheme.onSurfaceVariant, fontSize: 11),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ), */
           
          ],
        ),
      ),
    );
  }

  Widget _summaryChips(List<Map<String, dynamic>> items) {
    final scheme = Theme.of(context).colorScheme;

    int countByStatus(String stt) {
      final s = stt.toUpperCase();
      return items.where((e) => _s(e['EQ_STATUS']).trim().toUpperCase() == s).length;
    }

    final run = countByStatus('MASS');
    final set = countByStatus('SETTING');
    final stop = countByStatus('STOP');

    Widget chip(String label, int value, Color color) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.14),
          borderRadius: BorderRadius.circular(999),
          border: Border.all(color: color.withValues(alpha: 0.25)),
        ),
        child: Text(
          '$label $value',
          style: TextStyle(fontWeight: FontWeight.w800, color: color),
        ),
      );
    }

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        chip('RUN', run, scheme.primary),
        chip('SET', set, Colors.orange.shade700),
        chip('STOP', stop, scheme.error),
      ],
    );
  }

  Widget _factoryPanel(String factory) {
    final scheme = Theme.of(context).colorScheme;

    if (_factoryFilter != 'ALL' && factory.toUpperCase() != _factoryFilter.toUpperCase()) {
      return const SizedBox.shrink();
    }

    final eqByFactory = _eqStatus.where((e) => _s(e['FACTORY']).trim().toUpperCase() == factory.toUpperCase()).toList();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        factory,
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${eqByFactory.length} machines',
                        style: TextStyle(color: scheme.onSurfaceVariant),
                      ),
                    ],
                  ),
                ),
                _summaryChips(eqByFactory),
              ],
            ),
            const SizedBox(height: 12),
            for (final series in _eqSeries) ...[
              Builder(
                builder: (ctx) {
                  if (_seriesFilter != 'ALL' && series != _seriesFilter) {
                    return const SizedBox.shrink();
                  }
                  final seriesMachines = eqByFactory.where((e) {
                    final n = _s(e['EQ_NAME']).trim();
                    final prefix = n.length >= 2 ? n.substring(0, 2) : '';
                    return prefix == series;
                  }).where(_matchSearch).where(_matchOnlyRunning).toList();

                  if (seriesMachines.isEmpty) return const SizedBox.shrink();

                  int countStatus(String stt) {
                    final s = stt.toUpperCase();
                    return seriesMachines.where((e) => _s(e['EQ_STATUS']).trim().toUpperCase() == s).length;
                  }

                  final run = countStatus('MASS');
                  final set = countStatus('SETTING');
                  final stop = countStatus('STOP');

                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              series,
                              style: const TextStyle(fontWeight: FontWeight.w900),
                            ),
                            const SizedBox(width: 8),
                            Wrap(
                              spacing: 8,
                              children: [
                                _miniBadge('RUN', run, Colors.green.shade700),
                                _miniBadge('SET', set, Colors.orange.shade700),
                                _miniBadge('STOP', stop, Colors.red.shade700),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        LayoutBuilder(
                          builder: (ctx, c) {
                            final w = c.maxWidth;
                            final cross = w >= 1100
                                ? 5
                                : w >= 900
                                    ? 4
                                    : w >= 650
                                        ? 3
                                        : 2;
                            final ratio = cross >= 5
                                ? 0.95
                                : cross == 4
                                    ? 0.90
                                    : cross == 3
                                        ? 0.82
                                        : 1.0;
                            return GridView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: cross,
                                crossAxisSpacing: 10,
                                mainAxisSpacing: 10,
                                childAspectRatio: ratio,
                              ),
                              itemCount: seriesMachines.length,
                              itemBuilder: (_, i) => _machineCard(seriesMachines[i]),
                            );
                          },
                        ),
                      ],
                    ),
                  );
                },
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _miniBadge(String label, int value, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.16),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        '$label $value',
        style: TextStyle(color: color, fontWeight: FontWeight.w900, fontSize: 12),
      ),
    );
  }

  Future<void> _openEqManager() async {
    final rows = _eqStatus;
    final cols = _buildEqManagerColumns();
    final rws = _buildEqManagerRows(rows, cols);

    final selectedEqCodes = <String>{};
    PlutoGridStateManager? sm;

    await showDialog<void>(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx2, setLocal) {
            return AlertDialog(
              title: const Text('EQ Manager'),
              content: SizedBox(
                width: 980,
                height: 560,
                child: PlutoGrid(
                  columns: cols,
                  rows: rws,
                  onLoaded: (e) {
                    sm = e.stateManager;
                    e.stateManager.setSelectingMode(PlutoGridSelectingMode.row);
                    e.stateManager.setShowColumnFilter(true);
                  },
                  onRowChecked: (e) {
                    final cur = sm;
                    if (cur == null) return;
                    final checked = cur.checkedRows;
                    setLocal(() {
                      selectedEqCodes
                        ..clear()
                        ..addAll(
                          checked
                              .map((r) => r.cells['__raw__']?.value)
                              .whereType<Map<String, dynamic>>()
                              .map((raw) => _s(raw['EQ_CODE']).trim())
                              .where((v) => v.isNotEmpty),
                        );
                    });
                  },
                ),
              ),
              actions: [
                TextButton(onPressed: () => Navigator.pop(ctx2), child: const Text('Đóng')),
                FilledButton.icon(
                  onPressed: () async {
                    await _openAddMachineDialog();
                    if (!ctx2.mounted) return;
                    Navigator.pop(ctx2);
                    await _loadEqStatus();
                  },
                  icon: const Icon(Icons.add),
                  label: const Text('Add'),
                ),
                FilledButton.icon(
                  onPressed: () async {
                    if (selectedEqCodes.isEmpty) {
                      _snack('Chưa chọn máy');
                      return;
                    }
                    final eqCodes = selectedEqCodes.toList()..sort();
                    final ok = await showDialog<bool>(
                      context: ctx2,
                      builder: (c2) {
                        return AlertDialog(
                          title: const Text('Xác nhận'),
                          content: Text('Xóa ${eqCodes.length} máy: ${eqCodes.join(', ')} ?'),
                          actions: [
                            TextButton(onPressed: () => Navigator.pop(c2, false), child: const Text('Hủy')),
                            FilledButton(onPressed: () => Navigator.pop(c2, true), child: const Text('Xóa')),
                          ],
                        );
                      },
                    );
                    if (ok != true) return;
                    for (final eqCode in eqCodes) {
                      await _deleteMachine(eqCode);
                    }
                    if (!ctx2.mounted) return;
                    Navigator.pop(ctx2);
                    await _loadEqStatus();
                  },
                  icon: const Icon(Icons.delete_outline),
                  label: const Text('Delete'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  List<PlutoColumn> _buildEqManagerColumns() {
    PlutoColumn col(String field, {double width = 120}) {
      return PlutoColumn(
        title: field,
        field: field,
        type: PlutoColumnType.text(),
        width: width,
        minWidth: 80,
        enableContextMenu: false,
        enableFilterMenuItem: true,
        enableSorting: true,
        renderer: (ctx) {
          if (field != 'EQ_ACTIVE') {
            return Text(
              (ctx.cell.value ?? '').toString(),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontSize: 11),
            );
          }
          final v = (ctx.cell.value ?? '').toString().trim().toUpperCase();
          final ok = v == 'OK';
          return Container(
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: ok ? const Color(0xFF77DA41) : const Color(0xFFFF0000),
              borderRadius: BorderRadius.circular(4),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
            child: Text(
              v,
              style: TextStyle(color: ok ? Colors.black : Colors.white, fontWeight: FontWeight.w800, fontSize: 11),
            ),
          );
        },
      );
    }

    return [
      PlutoColumn(
        title: '',
        field: '__raw__',
        type: PlutoColumnType.text(),
        width: 0,
        hide: true,
        enableContextMenu: false,
      ),
      PlutoColumn(
        title: '✓',
        field: '__check__',
        type: PlutoColumnType.text(),
        width: 44,
        minWidth: 44,
        enableContextMenu: false,
        enableSorting: false,
        enableFilterMenuItem: false,
        enableRowChecked: true,
      ),
      col('EQ_CODE', width: 110),
      col('FACTORY', width: 90),
      col('EQ_NAME', width: 120),
      col('EQ_SERIES', width: 90),
      col('EQ_ACTIVE', width: 90),
      col('EQ_OP', width: 80),
      col('EQ_STATUS', width: 100),
      col('CURR_PLAN_ID', width: 120),
      col('CURR_G_CODE', width: 120),
      col('INS_EMPL', width: 90),
      col('INS_DATE', width: 120),
      col('UPD_EMPL', width: 90),
      col('UPD_DATE', width: 120),
    ];
  }

  List<PlutoRow> _buildEqManagerRows(List<Map<String, dynamic>> rows, List<PlutoColumn> columns) {
    Object? val(Map<String, dynamic> it, String field) {
      if (field == '__raw__') return it;
      if (field == '__check__') return '';
      return it[field];
    }

    return [
      for (final it in rows)
        PlutoRow(
          cells: {
            for (final c in columns) c.field: PlutoCell(value: val(it, c.field)),
          },
        ),
    ];
  }

  Future<void> _openAddMachineDialog() async {
    final factoryCtrl = TextEditingController(text: 'NM1');
    final eqCodeCtrl = TextEditingController(text: '');
    final eqNameCtrl = TextEditingController(text: '');
    final eqOpCtrl = TextEditingController(text: '1');
    String eqActive = 'OK';

    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) {
        final scheme = Theme.of(ctx).colorScheme;
        final fillColor = scheme.surfaceContainerHighest;
        const contentPad = EdgeInsets.symmetric(horizontal: 12, vertical: 12);

        InputDecoration dec(String label) => InputDecoration(
              labelText: label,
              labelStyle: TextStyle(color: scheme.onSurfaceVariant),
              filled: true,
              fillColor: fillColor,
              contentPadding: contentPad,
            );

        return StatefulBuilder(
          builder: (ctx2, setLocal) {
            return AlertDialog(
              title: const Text('Add machine'),
              content: SizedBox(
                width: 520,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    DropdownButtonFormField<String>(
                      key: ValueKey(factoryCtrl.text),
                      initialValue: factoryCtrl.text,
                      dropdownColor: scheme.surface,
                      style: TextStyle(color: scheme.onSurface),
                      items: const [
                        DropdownMenuItem(value: 'NM1', child: Text('NM1')),
                        DropdownMenuItem(value: 'NM2', child: Text('NM2')),
                      ],
                      onChanged: (v) {
                        factoryCtrl.text = (v ?? 'NM1');
                        setLocal(() {});
                      },
                      decoration: dec('Factory'),
                    ),
                    const SizedBox(height: 12),
                    TextField(controller: eqCodeCtrl, decoration: dec('EQ Code')),
                    const SizedBox(height: 12),
                    TextField(controller: eqNameCtrl, decoration: dec('EQ Name')),
                    const SizedBox(height: 12),
                    TextField(controller: eqOpCtrl, decoration: dec('EQ OP'), keyboardType: TextInputType.number),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      key: ValueKey(eqActive),
                      initialValue: eqActive,
                      dropdownColor: scheme.surface,
                      style: TextStyle(color: scheme.onSurface),
                      items: const [
                        DropdownMenuItem(value: 'OK', child: Text('OK')),
                        DropdownMenuItem(value: 'NG', child: Text('NG')),
                      ],
                      onChanged: (v) {
                        eqActive = (v ?? 'OK');
                        setLocal(() {});
                      },
                      decoration: dec('EQ Active'),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(onPressed: () => Navigator.pop(ctx2, false), child: const Text('Hủy')),
                FilledButton(onPressed: () => Navigator.pop(ctx2, true), child: const Text('Add')),
              ],
            );
          },
        );
      },
    );

    if (ok != true) return;

    final factory = factoryCtrl.text.trim().isEmpty ? 'NM1' : factoryCtrl.text.trim();
    final eqCode = eqCodeCtrl.text.trim();
    final eqName = eqNameCtrl.text.trim();
    final eqOp = int.tryParse(eqOpCtrl.text.trim()) ?? 1;

    if (eqCode.isEmpty || eqName.isEmpty) {
      _snack('EQ_CODE / EQ_NAME không được để trống');
      return;
    }

    setState(() => _loading = true);
    try {
      final body = await _post('addMachine', {
        'FACTORY': factory,
        'EQ_CODE': eqCode,
        'EQ_NAME': eqName,
        'EQ_ACTIVE': eqActive,
        'EQ_OP': eqOp,
      });
      setState(() => _loading = false);
      if (_isNg(body)) {
        _snack('Add machine failed: ${(body['message'] ?? 'NG').toString()}');
        return;
      }
      _snack('Add machine successfully');
      await _loadEqStatus();
    } catch (e) {
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  Future<void> _deleteMachine(String eqCode) async {
    setState(() => _loading = true);
    try {
      final body = await _post('deleteMachine', {'EQ_CODE': eqCode});
      setState(() => _loading = false);
      if (_isNg(body)) {
        _snack('Delete machine failed: ${(body['message'] ?? 'NG').toString()}');
        return;
      }
      _snack('Delete machine successfully');
    } catch (e) {
      setState(() => _loading = false);
      _snack('Lỗi: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final canManage = _emplNo() == 'NHU1903';

    final factoryOptions = <String>['ALL', 'NM1', if (AppConfig.company == 'CMS') 'NM2'];
    final seriesOptions = <String>['ALL', ..._eqSeries];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Equipment Status'),
        actions: [
          IconButton(
            onPressed: () => setState(() => _showFilters = !_showFilters),
            icon: Icon(_showFilters ? Icons.filter_alt_off : Icons.filter_alt),
            tooltip: _showFilters ? 'Hide filter' : 'Show filter',
          ),
          IconButton(
            onPressed: () => _loadEqStatus(),
            icon: const Icon(Icons.refresh),
            tooltip: 'Refresh',
          ),
          if (canManage)
            IconButton(
              onPressed: () async {
                await _loadEqStatus();
                if (!mounted) return;
                await _openEqManager();
              },
              icon: const Icon(Icons.settings),
              tooltip: 'EQ Manager',
            ),
        ],
      ),
      drawer: const AppDrawer(title: 'ERP'),
      body: RefreshIndicator(
        onRefresh: () async => _loadEqStatus(),
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
                              Text(
                                'Auto refresh 3s',
                                style: TextStyle(color: scheme.onSurfaceVariant),
                              ),
                            ],
                          ),
                        ),
                        if (_loading) const SizedBox(width: 22, height: 22, child: CircularProgressIndicator(strokeWidth: 2)),
                      ],
                    ),
                    if (_showFilters) ...[
                      const SizedBox(height: 12),
                      TextField(
                        controller: _searchCtrl,
                        decoration: InputDecoration(
                          labelText: 'Search plan / G-name',
                          labelStyle: TextStyle(color: scheme.onSurfaceVariant),
                          prefixIcon: const Icon(Icons.search),
                          filled: true,
                          fillColor: scheme.surfaceContainerHighest,
                        ),
                        onChanged: (_) => setState(() {}),
                      ),
                      const SizedBox(height: 12),
                      LayoutBuilder(
                        builder: (ctx, c) {
                          final wide = c.maxWidth >= 700;

                          InputDecoration ddDec(String label) => InputDecoration(
                                labelText: label,
                                labelStyle: TextStyle(color: scheme.onSurfaceVariant),
                                filled: true,
                                fillColor: scheme.surfaceContainerHighest,
                              );

                          final children = [
                            DropdownButtonFormField<String>(
                              initialValue: _factoryFilter,
                              dropdownColor: scheme.surface,
                              style: TextStyle(color: scheme.onSurface),
                              items: [
                                for (final v in factoryOptions) DropdownMenuItem(value: v, child: Text(v)),
                              ],
                              onChanged: (v) => setState(() => _factoryFilter = v ?? 'ALL'),
                              decoration: ddDec('Factory'),
                            ),
                            DropdownButtonFormField<String>(
                              key: ValueKey('${_eqSeries.join('|')}|$_seriesFilter'),
                              initialValue: seriesOptions.contains(_seriesFilter) ? _seriesFilter : 'ALL',
                              dropdownColor: scheme.surface,
                              style: TextStyle(color: scheme.onSurface),
                              items: [
                                for (final v in seriesOptions) DropdownMenuItem(value: v, child: Text(v)),
                              ],
                              onChanged: (v) => setState(() => _seriesFilter = v ?? 'ALL'),
                              decoration: ddDec('Series'),
                            ),
                          ];

                          if (wide) {
                            return Row(
                              children: [
                                Expanded(child: children[0]),
                                const SizedBox(width: 12),
                                Expanded(child: children[1]),
                              ],
                            );
                          }

                          return Column(
                            children: [
                              children[0],
                              const SizedBox(height: 12),
                              children[1],
                            ],
                          );
                        },
                      ),
                      const SizedBox(height: 12),
                      CheckboxListTile(
                        value: _onlyRunning,
                        dense: true,
                        contentPadding: EdgeInsets.zero,
                        title: const Text('Only running (MASS)'),
                        controlAffinity: ListTileControlAffinity.leading,
                        onChanged: (v) => setState(() => _onlyRunning = v ?? false),
                      ),
                    ],
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            if (_eqStatus.isEmpty && !_loading)
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Text(
                    'Chưa có dữ liệu',
                    style: TextStyle(color: scheme.onSurfaceVariant),
                  ),
                ),
              ),
            if (_eqStatus.isNotEmpty) ...[
              _factoryPanel('NM1'),
              if (AppConfig.company == 'CMS') ...[
                const SizedBox(height: 12),
                _factoryPanel('NM2'),
              ],
            ],
          ],
        ),
      ),
    );
  }
}
