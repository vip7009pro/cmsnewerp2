import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../app/app_drawer.dart';
import '../../../core/utils/date_utils.dart';
import '../application/hr_providers.dart';

class PheDuyetNghiPage extends ConsumerStatefulWidget {
  const PheDuyetNghiPage({super.key, this.option = 'pheduyetnhom', this.embedded = false});

  final String option;
  final bool embedded;

  @override
  ConsumerState<PheDuyetNghiPage> createState() => _PheDuyetNghiPageState();
}

class _PheDuyetNghiPageState extends ConsumerState<PheDuyetNghiPage> {
  late DateTime _fromDate;
  late DateTime _toDate;
  bool _onlyPending = true;

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _fromDate = DateTime(now.year, now.month, 1);
    _toDate = DateTime(now.year, now.month + 1, 1).subtract(const Duration(days: 0));
  }

  Future<void> _pickFrom() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _fromDate,
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
    );
    if (picked == null) return;
    setState(() {
      _fromDate = picked;
      if (_toDate.isBefore(_fromDate)) _toDate = _fromDate;
    });
  }

  Future<void> _pickTo() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _toDate,
      firstDate: _fromDate,
      lastDate: DateTime(2100),
    );
    if (picked == null) return;
    setState(() => _toDate = picked);
  }

  @override
  Widget build(BuildContext context) {
    final key = (widget.option, AppDateUtils.ymd(_fromDate), AppDateUtils.ymd(_toDate), _onlyPending);
    final dataAsync = ref.watch(pheDuyetNghiProvider(key));

    final body = Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(8),
          child: Column(
            children: [
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: _pickFrom,
                      icon: const Icon(Icons.date_range),
                      label: Text('From: ${AppDateUtils.ymd(_fromDate)}'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: _pickTo,
                      icon: const Icon(Icons.date_range),
                      label: Text('To: ${AppDateUtils.ymd(_toDate)}'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Row(
                children: [
                  Expanded(
                    child: SwitchListTile.adaptive(
                      contentPadding: EdgeInsets.zero,
                      title: const Text('Only Pending'),
                      value: _onlyPending,
                      onChanged: (v) => setState(() => _onlyPending = v),
                    ),
                  ),
                  const SizedBox(width: 8),
                  FilledButton.icon(
                    onPressed: () => ref.invalidate(pheDuyetNghiProvider(key)),
                    icon: const Icon(Icons.search),
                    label: const Text('Search'),
                  ),
                ],
              ),
            ],
          ),
        ),
        const Divider(height: 1),
        Expanded(
          child: dataAsync.when(
            data: (items) {
              if (items.isEmpty) return const Center(child: Text('Không có dữ liệu'));
              return RefreshIndicator(
                onRefresh: () async => ref.invalidate(pheDuyetNghiProvider(key)),
                child: ListView.separated(
                  itemCount: items.length,
                  separatorBuilder: (_, __) => const Divider(height: 1),
                  itemBuilder: (context, index) {
                    final it = items[index];
                    final offId = int.tryParse((it['OFF_ID'] ?? '').toString()) ?? index;
                    return _PheDuyetRow(
                      key: ValueKey(offId),
                      option: widget.option,
                      filterKey: key,
                      item: it,
                    );
                  },
                ),
              );
            },
            error: (e, _) => Center(child: Text('Lỗi: $e')),
            loading: () => const Center(child: CircularProgressIndicator()),
          ),
        ),
      ],
    );

    if (widget.embedded) return body;

    return Scaffold(
      appBar: AppBar(title: const Text('Phê duyệt nghỉ')),
      drawer: const AppDrawer(title: 'Menu'),
      body: body,
    );
  }
}

class _PheDuyetRow extends ConsumerStatefulWidget {
  const _PheDuyetRow({super.key, required this.option, required this.filterKey, required this.item});

  final String option;
  final (String, String, String, bool) filterKey;
  final Map<String, dynamic> item;

  @override
  ConsumerState<_PheDuyetRow> createState() => _PheDuyetRowState();
}

class _PheDuyetRowState extends ConsumerState<_PheDuyetRow> {
  bool _forcePreset = false;

  String _fullName() {
    final full = (widget.item['FULL_NAME'] ?? '').toString().trim();
    if (full.isNotEmpty) return full;
    return '${(widget.item['MIDLAST_NAME'] ?? '').toString()} ${(widget.item['FIRST_NAME'] ?? '').toString()}'.trim();
  }

  void _resetToPreset() {
    setState(() => _forcePreset = true);
  }

  Future<void> _set(BuildContext context, int value) async {
    final messenger = ScaffoldMessenger.of(context);
    final repo = ref.read(hrRepositoryProvider);
    final offId = int.tryParse((widget.item['OFF_ID'] ?? '').toString());
    if (offId == null) return;

    if (value == 1) {
      final onOff = widget.item['ON_OFF'];
      final reasonName = (widget.item['REASON_NAME'] ?? '').toString();
      final canApprove = (onOff == 0 || onOff == null || reasonName == 'Nửa phép');
      if (!canApprove) {
        if (!mounted) return;
        messenger.showSnackBar(const SnackBar(content: Text('Đã điểm danh đi làm, không phê duyệt nghỉ được')));
        return;
      }
    }

    if (value == 3) {
      final ok = await showDialog<bool>(
        context: context,
        builder: (ctx) => AlertDialog(
          title: const Text('Xóa đăng ký nghỉ'),
          content: const Text('Chắc chắn muốn xóa đăng ký nghỉ đã chọn?'),
          actions: [
            TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Hủy')),
            FilledButton(onPressed: () => Navigator.of(ctx).pop(true), child: const Text('Xóa')),
          ],
        ),
      );
      if (ok != true) return;
    }

    final err = await repo.setPheDuyetNhom(offId: offId, pheDuyetValue: value);
    if (!mounted) return;

    if (err != null) {
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $err')));
      return;
    }

    setState(() => _forcePreset = false);
    ref.invalidate(pheDuyetNghiProvider(widget.filterKey));
  }

  @override
  Widget build(BuildContext context) {
    final approval = int.tryParse((widget.item['APPROVAL_STATUS'] ?? '').toString());
    final emplNo = (widget.item['EMPL_NO'] ?? '').toString();
    final cmsId = (widget.item['CMS_ID'] ?? '').toString();
    final requestDate = AppDateUtils.ymdFromValue(widget.item['REQUEST_DATE']);
    final applyDate = AppDateUtils.ymdFromValue(widget.item['APPLY_DATE']);
    final reasonName = (widget.item['REASON_NAME'] ?? '').toString();
    final caNghi = (widget.item['CA_NGHI'] ?? '').toString();
    final remark = (widget.item['REMARK'] ?? '').toString();

    final showPreset = _forcePreset || (approval != 0 && approval != 1 && approval != 3);

    Widget actions;
    if (showPreset) {
      actions = Wrap(
        spacing: 6,
        children: [
          FilledButton.tonal(onPressed: () => _set(context, 1), child: const Text('Duyệt')),
          OutlinedButton(onPressed: () => _set(context, 0), child: const Text('Từ chối')),
        ],
      );
    } else if (approval == 0) {
      actions = Row(
        children: [
          const Expanded(child: Text('Từ chối', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold))),
          TextButton(onPressed: _resetToPreset, child: const Text('RESET')),
          TextButton(onPressed: () => _set(context, 3), child: const Text('XÓA')),
        ],
      );
    } else if (approval == 1) {
      actions = Row(
        children: [
          const Expanded(child: Text('Phê duyệt', style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold))),
          TextButton(onPressed: _resetToPreset, child: const Text('RESET')),
          TextButton(onPressed: () => _set(context, 3), child: const Text('XÓA')),
        ],
      );
    } else if (approval == 3) {
      actions = const Text('Đã xóa', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold));
    } else {
      actions = Wrap(
        spacing: 6,
        children: [
          FilledButton.tonal(onPressed: () => _set(context, 1), child: const Text('Duyệt')),
          OutlinedButton(onPressed: () => _set(context, 0), child: const Text('Từ chối')),
        ],
      );
    }

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('${_fullName()} ($emplNo | $cmsId)', style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text('Request: $requestDate | Apply: $applyDate | Ca: $caNghi'),
          Text('Lý do: $reasonName | Remark: $remark'),
          const SizedBox(height: 6),
          actions,
        ],
      ),
    );
  }
}
