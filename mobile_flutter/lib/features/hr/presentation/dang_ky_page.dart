import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../app/app_drawer.dart';
import '../../../core/utils/date_utils.dart';
import '../application/hr_providers.dart';

class DangKyPage extends StatelessWidget {
  const DangKyPage({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Đăng ký'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Đăng ký nghỉ'),
              Tab(text: 'Đăng ký tăng ca'),
              Tab(text: 'Xác nhận chấm công'),
            ],
          ),
        ),
        drawer: const AppDrawer(title: 'Menu'),
        body: const TabBarView(
          children: [
            _DangKyNghiTab(),
            _DangKyTangCaTab(),
            _XacNhanChamCongTab(),
          ],
        ),
      ),
    );
  }
}

class _DangKyNghiTab extends ConsumerStatefulWidget {
  const _DangKyNghiTab();

  @override
  ConsumerState<_DangKyNghiTab> createState() => _DangKyNghiTabState();
}

class _DangKyNghiTabState extends ConsumerState<_DangKyNghiTab> {
  int caNghi = 1;
  int reasonCode = 1;
  final TextEditingController reasonCtrl = TextEditingController();

  DateTime fromDate = DateTime.now();
  DateTime toDate = DateTime.now();

  @override
  void dispose() {
    reasonCtrl.dispose();
    super.dispose();
  }

  Future<void> _pickFrom() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: fromDate,
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
    );
    if (picked == null) return;
    setState(() {
      fromDate = picked;
      if (toDate.isBefore(fromDate)) toDate = fromDate;
    });
  }

  Future<void> _pickTo() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: toDate,
      firstDate: fromDate,
      lastDate: DateTime(2100),
    );
    if (picked == null) return;
    setState(() => toDate = picked);
  }

  void _clear() {
    setState(() {
      caNghi = 1;
      reasonCode = 1;
      fromDate = DateTime.now();
      toDate = DateTime.now();
      reasonCtrl.text = '';
    });
  }

  Future<void> _submit() async {
    final repo = ref.read(hrRepositoryProvider);
    final err = await repo.dangKyNghi(
      caNghi: caNghi,
      reasonCode: reasonCode,
      remarkContent: reasonCtrl.text.trim(),
      ngayBatDau: AppDateUtils.ymd(fromDate),
      ngayKetThuc: AppDateUtils.ymd(toDate),
    );

    if (!mounted) return;

    if (err != null) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $err')));
      return;
    }
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Đăng ký nghỉ thành công')));
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(12),
      children: [
        DropdownButtonFormField<int>(
          initialValue: caNghi,
          decoration: const InputDecoration(labelText: 'Ca nghỉ', border: OutlineInputBorder()),
          items: const [
            DropdownMenuItem(value: 1, child: Text('Ca 1')),
            DropdownMenuItem(value: 2, child: Text('Ca 2')),
          ],
          onChanged: (v) => setState(() => caNghi = v ?? 1),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: _pickFrom,
                icon: const Icon(Icons.date_range),
                label: Text('From: ${AppDateUtils.ymd(fromDate)}'),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: OutlinedButton.icon(
                onPressed: _pickTo,
                icon: const Icon(Icons.date_range),
                label: Text('To: ${AppDateUtils.ymd(toDate)}'),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        DropdownButtonFormField<int>(
          initialValue: reasonCode,
          decoration: const InputDecoration(labelText: 'Kiểu nghỉ', border: OutlineInputBorder()),
          items: const [
            DropdownMenuItem(value: 1, child: Text('Phép năm')),
            DropdownMenuItem(value: 2, child: Text('Nửa phép')),
            DropdownMenuItem(value: 3, child: Text('Việc riêng')),
            DropdownMenuItem(value: 4, child: Text('Nghỉ ốm')),
            DropdownMenuItem(value: 5, child: Text('Chế độ')),
            DropdownMenuItem(value: 6, child: Text('Lý do khác')),
          ],
          onChanged: (v) => setState(() => reasonCode = v ?? 1),
        ),
        const SizedBox(height: 12),
        TextField(
          controller: reasonCtrl,
          decoration: const InputDecoration(
            labelText: 'Lý do cụ thể',
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(child: FilledButton(onPressed: _submit, child: const Text('Đăng ký'))),
            const SizedBox(width: 8),
            Expanded(child: OutlinedButton(onPressed: _clear, child: const Text('Clear'))),
          ],
        ),
      ],
    );
  }
}

class _DangKyTangCaTab extends ConsumerStatefulWidget {
  const _DangKyTangCaTab();

  @override
  ConsumerState<_DangKyTangCaTab> createState() => _DangKyTangCaTabState();
}

class _DangKyTangCaTabState extends ConsumerState<_DangKyTangCaTab> {
  final TextEditingController startCtrl = TextEditingController();
  final TextEditingController finishCtrl = TextEditingController();

  @override
  void dispose() {
    startCtrl.dispose();
    finishCtrl.dispose();
    super.dispose();
  }

  void _clear() {
    startCtrl.text = '';
    finishCtrl.text = '';
  }

  Future<void> _submit() async {
    final repo = ref.read(hrRepositoryProvider);
    final err = await repo.dangKyTangCaCaNhan(
      overStart: startCtrl.text.trim(),
      overFinish: finishCtrl.text.trim(),
    );

    if (!mounted) return;

    if (err != null) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $err')));
      return;
    }
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Đăng ký tăng ca thành công')));
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(12),
      children: [
        TextField(
          controller: startCtrl,
          decoration: const InputDecoration(labelText: 'Thời gian bắt đầu', hintText: '1700', border: OutlineInputBorder()),
        ),
        const SizedBox(height: 12),
        TextField(
          controller: finishCtrl,
          decoration: const InputDecoration(labelText: 'Thời gian kết thúc', hintText: '2000', border: OutlineInputBorder()),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(child: FilledButton(onPressed: _submit, child: const Text('Đăng ký'))),
            const SizedBox(width: 8),
            Expanded(child: OutlinedButton(onPressed: _clear, child: const Text('Clear'))),
          ],
        ),
      ],
    );
  }
}

class _XacNhanChamCongTab extends ConsumerStatefulWidget {
  const _XacNhanChamCongTab();

  @override
  ConsumerState<_XacNhanChamCongTab> createState() => _XacNhanChamCongTabState();
}

class _XacNhanChamCongTabState extends ConsumerState<_XacNhanChamCongTab> {
  String confirmType = 'GD';
  DateTime confirmDate = DateTime.now();
  final TextEditingController timeCtrl = TextEditingController();

  @override
  void dispose() {
    timeCtrl.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: confirmDate,
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
    );
    if (picked == null) return;
    setState(() => confirmDate = picked);
  }

  void _clear() {
    setState(() {
      confirmType = 'GD';
      confirmDate = DateTime.now();
      timeCtrl.text = '';
    });
  }

  Future<void> _submit() async {
    final repo = ref.read(hrRepositoryProvider);
    final confirmWorktime = '$confirmType:${timeCtrl.text.trim()}';

    final err = await repo.xacNhanChamCongNhom(
      confirmWorktime: confirmWorktime,
      confirmDate: AppDateUtils.ymd(confirmDate),
    );

    if (!mounted) return;

    if (err != null) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $err')));
      return;
    }
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Xác nhận chấm công thành công')));
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(12),
      children: [
        DropdownButtonFormField<String>(
          initialValue: confirmType,
          decoration: const InputDecoration(labelText: 'Kiểu xác nhận', border: OutlineInputBorder()),
          items: const [
            DropdownMenuItem(value: 'GD', child: Text('Quên giờ vào')),
            DropdownMenuItem(value: 'GS', child: Text('Quên giờ về')),
            DropdownMenuItem(value: 'CA', child: Text('Quên cả giờ vào - giờ về')),
          ],
          onChanged: (v) => setState(() => confirmType = v ?? 'GD'),
        ),
        const SizedBox(height: 12),
        OutlinedButton.icon(
          onPressed: _pickDate,
          icon: const Icon(Icons.date_range),
          label: Text('Date: ${AppDateUtils.ymd(confirmDate)}'),
        ),
        const SizedBox(height: 12),
        TextField(
          controller: timeCtrl,
          decoration: const InputDecoration(labelText: 'Time', hintText: '0800-1700', border: OutlineInputBorder()),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(child: FilledButton(onPressed: _submit, child: const Text('Đăng ký'))),
            const SizedBox(width: 8),
            Expanded(child: OutlinedButton(onPressed: _clear, child: const Text('Clear'))),
          ],
        ),
      ],
    );
  }
}
