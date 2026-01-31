import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../app/app_drawer.dart';
import '../../../core/config/app_config.dart';
import '../application/hr_providers.dart';
import 'hr_employee_edit_page.dart';

class HrDepartmentEmployeePage extends StatelessWidget {
  const HrDepartmentEmployeePage({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Nhân sự'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Nhân viên'),
              Tab(text: 'Phòng ban'),
            ],
          ),
        ),
        drawer: const AppDrawer(title: 'Menu'),
        body: const TabBarView(
          children: [
            _EmployeesTab(),
            _DepartmentsTab(),
          ],
        ),
      ),
    );
  }
}

class _EmployeesTab extends ConsumerWidget {
  const _EmployeesTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final employeesAsync = ref.watch(employeesProvider);

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(8),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  decoration: const InputDecoration(
                    labelText: 'Tìm kiếm',
                    border: OutlineInputBorder(),
                    isDense: true,
                  ),
                  onChanged: (v) {
                    // TODO: implement search filter
                  },
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                onPressed: () => _openEditor(context, ref),
                icon: const Icon(Icons.add),
                tooltip: 'Thêm nhân viên',
              ),
            ],
          ),
        ),
        Expanded(
          child: employeesAsync.when(
            data: (items) {
              if (items.isEmpty) return const Center(child: Text('Không có dữ liệu'));
              return ListView.separated(
                itemCount: items.length,
                separatorBuilder: (_, __) => const Divider(height: 1),
                itemBuilder: (context, index) {
                  final emp = items[index];
                  final emplNo = (emp['EMPL_NO'] ?? '').toString();
                  final fullName = '${emp['MIDLAST_NAME'] ?? ''} ${emp['FIRST_NAME'] ?? ''}'.trim();
                  final cmsId = (emp['CMS_ID'] ?? '').toString();
                  final mainDept = (emp['MAINDEPTNAME'] ?? '').toString();
                  final subDept = (emp['SUBDEPTNAME'] ?? '').toString();
                  final workPos = (emp['WORK_POSITION_NAME'] ?? '').toString();

                  return ListTile(
                    leading: CircleAvatar(
                      backgroundImage: NetworkImage(AppConfig.employeeImageUrl(emplNo)),
                      child: emplNo.isEmpty
                          ? null
                          : Text(
                              fullName.isNotEmpty ? fullName[0].toUpperCase() : '?',
                              style: const TextStyle(fontWeight: FontWeight.bold),
                            ),
                    ),
                    title: Text(fullName.isEmpty ? emplNo : fullName),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('CMS ID: $cmsId'),
                        Text('Main Dept: $mainDept'),
                        Text('Sub Dept: $subDept'),
                        Text('Vị trí: $workPos'),
                      ],
                    ),
                    trailing: IconButton(
                      icon: const Icon(Icons.edit),
                      onPressed: () => _openEditor(context, ref, employee: emp),
                    ),
                    onTap: () => _openEditor(context, ref, employee: emp),
                  );
                },
              );
            },
            error: (e, _) => Center(child: Text('Lỗi: $e')),
            loading: () => const Center(child: CircularProgressIndicator()),
          ),
        ),
      ],
    );
  }

  Future<void> _openEditor(BuildContext context, WidgetRef ref, {Map<String, dynamic>? employee}) async {
    await Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => HrEmployeeEditPage(employee: employee),
      ),
    );
  }
}

class _DepartmentsTab extends ConsumerWidget {
  const _DepartmentsTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return const _DepartmentsTabBody();
  }
}

class _DepartmentsTabBody extends ConsumerStatefulWidget {
  const _DepartmentsTabBody();

  @override
  ConsumerState<_DepartmentsTabBody> createState() => _DepartmentsTabBodyState();
}

class _DepartmentsTabBodyState extends ConsumerState<_DepartmentsTabBody> {
  int _tableSelection = 1; // 1: MainDept, 2: SubDept, 3: WorkPosition

  int? _selectedMainDeptCode;
  int? _selectedSubDeptCode;

  Future<void> _addOrEditMainDept({Map<String, dynamic>? item}) async {
    final codeCtrl = TextEditingController(text: (item?['MAINDEPTCODE'] ?? '').toString());
    final nameCtrl = TextEditingController(text: (item?['MAINDEPTNAME'] ?? '').toString());
    final nameKrCtrl = TextEditingController(text: (item?['MAINDEPTNAME_KR'] ?? '').toString());

    final ok = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(item == null ? 'Thêm bộ phận' : 'Sửa bộ phận'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: codeCtrl,
                decoration: const InputDecoration(labelText: 'MAINDEPTCODE'),
                keyboardType: TextInputType.number,
                enabled: item == null,
              ),
              const SizedBox(height: 12),
              TextField(
                controller: nameCtrl,
                decoration: const InputDecoration(labelText: 'MAINDEPTNAME'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: nameKrCtrl,
                decoration: const InputDecoration(labelText: 'MAINDEPTNAME_KR'),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Huỷ')),
            FilledButton(onPressed: () => Navigator.pop(context, true), child: const Text('Lưu')),
          ],
        );
      },
    );
    if (ok != true) return;

    final code = int.tryParse(codeCtrl.text.trim()) ?? 0;
    final payload = <String, dynamic>{
      'CTR_CD': '002',
      'MAINDEPTCODE': item == null ? code : (int.tryParse((item['MAINDEPTCODE'] ?? 0).toString()) ?? 0),
      'MAINDEPTNAME': nameCtrl.text.trim(),
      'MAINDEPTNAME_KR': nameKrCtrl.text.trim(),
    };

    final repo = ref.read(hrRepositoryProvider);
    final err = item == null ? await repo.insertMainDept(payload) : await repo.updateMainDept(payload);
    if (!mounted) return;
    if (err != null) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $err')));
      return;
    }
    ref.invalidate(mainDeptsProvider);
  }

  Future<void> _deleteMainDept(Map<String, dynamic> item) async {
    final code = int.tryParse((item['MAINDEPTCODE'] ?? 0).toString()) ?? 0;
    final ok = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Xoá bộ phận'),
        content: Text('Xác nhận xoá MAINDEPTCODE=$code?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Huỷ')),
          FilledButton(onPressed: () => Navigator.pop(context, true), child: const Text('Xoá')),
        ],
      ),
    );
    if (ok != true) return;
    final repo = ref.read(hrRepositoryProvider);
    final err = await repo.deleteMainDept({'MAINDEPTCODE': code});
    if (!mounted) return;
    if (err != null) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $err')));
      return;
    }
    if (_selectedMainDeptCode == code) {
      setState(() {
        _selectedMainDeptCode = null;
        _selectedSubDeptCode = null;
      });
    }
    ref.invalidate(mainDeptsProvider);
  }

  Future<void> _addOrEditSubDept({Map<String, dynamic>? item}) async {
    final mainCode = item == null ? (_selectedMainDeptCode ?? 0) : (int.tryParse((item['MAINDEPTCODE'] ?? 0).toString()) ?? 0);
    if (mainCode == 0) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Chọn bộ phận trước')));
      return;
    }

    final codeCtrl = TextEditingController(text: (item?['SUBDEPTCODE'] ?? '').toString());
    final nameCtrl = TextEditingController(text: (item?['SUBDEPTNAME'] ?? '').toString());
    final nameKrCtrl = TextEditingController(text: (item?['SUBDEPTNAME_KR'] ?? '').toString());

    final ok = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(item == null ? 'Thêm phòng ban' : 'Sửa phòng ban'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('MAINDEPTCODE: $mainCode'),
              const SizedBox(height: 12),
              TextField(
                controller: codeCtrl,
                decoration: const InputDecoration(labelText: 'SUBDEPTCODE'),
                keyboardType: TextInputType.number,
                enabled: item == null,
              ),
              const SizedBox(height: 12),
              TextField(
                controller: nameCtrl,
                decoration: const InputDecoration(labelText: 'SUBDEPTNAME'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: nameKrCtrl,
                decoration: const InputDecoration(labelText: 'SUBDEPTNAME_KR'),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Huỷ')),
            FilledButton(onPressed: () => Navigator.pop(context, true), child: const Text('Lưu')),
          ],
        );
      },
    );
    if (ok != true) return;

    final code = int.tryParse(codeCtrl.text.trim()) ?? 0;
    final payload = <String, dynamic>{
      'CTR_CD': '002',
      'MAINDEPTCODE': mainCode,
      'SUBDEPTCODE': item == null ? code : (int.tryParse((item['SUBDEPTCODE'] ?? 0).toString()) ?? 0),
      'SUBDEPTNAME': nameCtrl.text.trim(),
      'SUBDEPTNAME_KR': nameKrCtrl.text.trim(),
    };
    final repo = ref.read(hrRepositoryProvider);
    final err = item == null ? await repo.insertSubDept(payload) : await repo.updateSubDept(payload);
    if (!mounted) return;
    if (err != null) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $err')));
      return;
    }
    ref.invalidate(subDeptsProvider(mainCode));
  }

  Future<void> _deleteSubDept(Map<String, dynamic> item) async {
    final mainCode = int.tryParse((item['MAINDEPTCODE'] ?? 0).toString()) ?? 0;
    final code = int.tryParse((item['SUBDEPTCODE'] ?? 0).toString()) ?? 0;
    final ok = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Xoá phòng ban'),
        content: Text('Xác nhận xoá SUBDEPTCODE=$code?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Huỷ')),
          FilledButton(onPressed: () => Navigator.pop(context, true), child: const Text('Xoá')),
        ],
      ),
    );
    if (ok != true) return;
    final repo = ref.read(hrRepositoryProvider);
    final err = await repo.deleteSubDept({'MAINDEPTCODE': mainCode, 'SUBDEPTCODE': code});
    if (!mounted) return;
    if (err != null) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $err')));
      return;
    }
    if (_selectedSubDeptCode == code) {
      setState(() => _selectedSubDeptCode = null);
    }
    ref.invalidate(subDeptsProvider(mainCode));
  }

  Future<void> _addOrEditWorkPosition({Map<String, dynamic>? item}) async {
    final subCode = item == null ? (_selectedSubDeptCode ?? 0) : (int.tryParse((item['SUBDEPTCODE'] ?? 0).toString()) ?? 0);
    if (subCode == 0) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Chọn phòng ban trước')));
      return;
    }

    final codeCtrl = TextEditingController(text: (item?['WORK_POSITION_CODE'] ?? '').toString());
    final nameCtrl = TextEditingController(text: (item?['WORK_POSITION_NAME'] ?? '').toString());
    final nameKrCtrl = TextEditingController(text: (item?['WORK_POSITION_NAME_KR'] ?? '').toString());
    final attGroupCtrl = TextEditingController(text: (item?['ATT_GROUP_CODE'] ?? '').toString());

    final ok = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(item == null ? 'Thêm Work Position' : 'Sửa Work Position'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('SUBDEPTCODE: $subCode'),
              const SizedBox(height: 12),
              TextField(
                controller: codeCtrl,
                decoration: const InputDecoration(labelText: 'WORK_POSITION_CODE'),
                keyboardType: TextInputType.number,
                enabled: item == null,
              ),
              const SizedBox(height: 12),
              TextField(
                controller: nameCtrl,
                decoration: const InputDecoration(labelText: 'WORK_POSITION_NAME'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: nameKrCtrl,
                decoration: const InputDecoration(labelText: 'WORK_POSITION_NAME_KR'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: attGroupCtrl,
                decoration: const InputDecoration(labelText: 'ATT_GROUP_CODE'),
                keyboardType: TextInputType.number,
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Huỷ')),
            FilledButton(onPressed: () => Navigator.pop(context, true), child: const Text('Lưu')),
          ],
        );
      },
    );
    if (ok != true) return;

    final code = int.tryParse(codeCtrl.text.trim()) ?? 0;
    final attGroup = int.tryParse(attGroupCtrl.text.trim()) ?? 0;
    final payload = <String, dynamic>{
      'CTR_CD': '002',
      'SUBDEPTCODE': subCode,
      'WORK_POSITION_CODE': item == null ? code : (int.tryParse((item['WORK_POSITION_CODE'] ?? 0).toString()) ?? 0),
      'WORK_POSITION_NAME': nameCtrl.text.trim(),
      'WORK_POSITION_NAME_KR': nameKrCtrl.text.trim(),
      'ATT_GROUP_CODE': attGroup,
    };
    final repo = ref.read(hrRepositoryProvider);
    final err = item == null ? await repo.insertWorkPosition(payload) : await repo.updateWorkPosition(payload);
    if (!mounted) return;
    if (err != null) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $err')));
      return;
    }
    ref.invalidate(workPositionsProvider(subCode));
  }

  Future<void> _deleteWorkPosition(Map<String, dynamic> item) async {
    final subCode = int.tryParse((item['SUBDEPTCODE'] ?? 0).toString()) ?? 0;
    final code = int.tryParse((item['WORK_POSITION_CODE'] ?? 0).toString()) ?? 0;
    final ok = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Xoá Work Position'),
        content: Text('Xác nhận xoá WORK_POSITION_CODE=$code?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Huỷ')),
          FilledButton(onPressed: () => Navigator.pop(context, true), child: const Text('Xoá')),
        ],
      ),
    );
    if (ok != true) return;
    final repo = ref.read(hrRepositoryProvider);
    final err = await repo.deleteWorkPosition({'SUBDEPTCODE': subCode, 'WORK_POSITION_CODE': code});
    if (!mounted) return;
    if (err != null) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $err')));
      return;
    }
    ref.invalidate(workPositionsProvider(subCode));
  }

  @override
  Widget build(BuildContext context) {
    final mainDeptsAsync = ref.watch(mainDeptsProvider);

    final selectedMain = _selectedMainDeptCode;
    final subDeptsAsync = selectedMain == null || selectedMain == 0 ? const AsyncValue<List<Map<String, dynamic>>>.data([]) : ref.watch(subDeptsProvider(selectedMain));

    final selectedSub = _selectedSubDeptCode;
    final workPosAsync = selectedSub == null || selectedSub == 0 ? const AsyncValue<List<Map<String, dynamic>>>.data([]) : ref.watch(workPositionsProvider(selectedSub));

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(8),
          child: Row(
            children: [
              Expanded(
                child: SegmentedButton<int>(
                  segments: const [
                    ButtonSegment(value: 1, label: Text('MainDept')),
                    ButtonSegment(value: 2, label: Text('SubDept')),
                    ButtonSegment(value: 3, label: Text('WorkPos')),
                  ],
                  selected: {_tableSelection},
                  onSelectionChanged: (s) {
                    setState(() => _tableSelection = s.first);
                  },
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                onPressed: () {
                  if (_tableSelection == 1) {
                    _addOrEditMainDept();
                  } else if (_tableSelection == 2) {
                    _addOrEditSubDept();
                  } else {
                    _addOrEditWorkPosition();
                  }
                },
                icon: const Icon(Icons.add),
                tooltip: 'Add/Update',
              ),
            ],
          ),
        ),
        if (_tableSelection == 2 || _tableSelection == 3)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: mainDeptsAsync.when(
              data: (items) {
                final codes = items
                    .map((e) => int.tryParse((e['MAINDEPTCODE'] ?? 0).toString()) ?? 0)
                    .where((e) => e != 0)
                    .toList();

                final selected = (_selectedMainDeptCode != null && codes.contains(_selectedMainDeptCode)) ? _selectedMainDeptCode : null;

                return DropdownButtonFormField<int>(
                  initialValue: selected,
                  decoration: const InputDecoration(labelText: 'MAINDEPT', isDense: true),
                  items: [
                    const DropdownMenuItem(value: null, child: Text('Chọn bộ phận')),
                    for (final d in items)
                      DropdownMenuItem(
                        value: int.tryParse((d['MAINDEPTCODE'] ?? 0).toString()) ?? 0,
                        child: Text((d['MAINDEPTNAME'] ?? '').toString()),
                      ),
                  ],
                  onChanged: (v) {
                    setState(() {
                      _selectedMainDeptCode = v;
                      _selectedSubDeptCode = null;
                    });
                  },
                );
              },
              loading: () => const LinearProgressIndicator(),
              error: (e, _) => Text('Lỗi: $e'),
            ),
          ),
        if (_tableSelection == 3)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: subDeptsAsync.when(
              data: (items) {
                final codes = items
                    .map((e) => int.tryParse((e['SUBDEPTCODE'] ?? 0).toString()) ?? 0)
                    .where((e) => e != 0)
                    .toList();

                final selected = (_selectedSubDeptCode != null && codes.contains(_selectedSubDeptCode)) ? _selectedSubDeptCode : null;

                return DropdownButtonFormField<int>(
                  initialValue: selected,
                  decoration: const InputDecoration(labelText: 'SUBDEPT', isDense: true),
                  items: [
                    const DropdownMenuItem(value: null, child: Text('Chọn phòng ban')),
                    for (final d in items)
                      DropdownMenuItem(
                        value: int.tryParse((d['SUBDEPTCODE'] ?? 0).toString()) ?? 0,
                        child: Text((d['SUBDEPTNAME'] ?? '').toString()),
                      ),
                  ],
                  onChanged: (v) {
                    setState(() => _selectedSubDeptCode = v);
                  },
                );
              },
              loading: () => const LinearProgressIndicator(),
              error: (e, _) => Text('Lỗi: $e'),
            ),
          ),
        const SizedBox(height: 8),
        Expanded(
          child: Builder(
            builder: (context) {
              if (_tableSelection == 1) {
                return mainDeptsAsync.when(
                  data: (items) {
                    if (items.isEmpty) return const Center(child: Text('Không có dữ liệu'));
                    return ListView.separated(
                      itemCount: items.length,
                      separatorBuilder: (_, __) => const Divider(height: 1),
                      itemBuilder: (context, index) {
                        final d = items[index];
                        final code = int.tryParse((d['MAINDEPTCODE'] ?? 0).toString()) ?? 0;
                        final name = (d['MAINDEPTNAME'] ?? '').toString();
                        final nameKr = (d['MAINDEPTNAME_KR'] ?? '').toString();
                        final selected = _selectedMainDeptCode == code;
                        return ListTile(
                          selected: selected,
                          title: Text(name.isEmpty ? 'Dept $code' : name),
                          subtitle: Text('${code.toString()} | $nameKr'),
                          onTap: () {
                            setState(() {
                              _selectedMainDeptCode = code;
                              _selectedSubDeptCode = null;
                            });
                          },
                          trailing: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              IconButton(icon: const Icon(Icons.edit), onPressed: () => _addOrEditMainDept(item: d)),
                              IconButton(icon: const Icon(Icons.delete_outline), onPressed: () => _deleteMainDept(d)),
                            ],
                          ),
                        );
                      },
                    );
                  },
                  loading: () => const Center(child: CircularProgressIndicator()),
                  error: (e, _) => Center(child: Text('Lỗi: $e')),
                );
              }

              if (_tableSelection == 2) {
                final mainCode = _selectedMainDeptCode;
                if (mainCode == null || mainCode == 0) return const Center(child: Text('Chọn bộ phận'));
                return subDeptsAsync.when(
                  data: (items) {
                    if (items.isEmpty) return const Center(child: Text('Không có dữ liệu'));
                    return ListView.separated(
                      itemCount: items.length,
                      separatorBuilder: (_, __) => const Divider(height: 1),
                      itemBuilder: (context, index) {
                        final d = items[index];
                        final code = int.tryParse((d['SUBDEPTCODE'] ?? 0).toString()) ?? 0;
                        final name = (d['SUBDEPTNAME'] ?? '').toString();
                        final nameKr = (d['SUBDEPTNAME_KR'] ?? '').toString();
                        final selected = _selectedSubDeptCode == code;
                        return ListTile(
                          selected: selected,
                          title: Text(name.isEmpty ? 'SubDept $code' : name),
                          subtitle: Text('${code.toString()} | $nameKr'),
                          onTap: () {
                            setState(() => _selectedSubDeptCode = code);
                          },
                          trailing: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              IconButton(icon: const Icon(Icons.edit), onPressed: () => _addOrEditSubDept(item: d)),
                              IconButton(icon: const Icon(Icons.delete_outline), onPressed: () => _deleteSubDept(d)),
                            ],
                          ),
                        );
                      },
                    );
                  },
                  loading: () => const Center(child: CircularProgressIndicator()),
                  error: (e, _) => Center(child: Text('Lỗi: $e')),
                );
              }

              final subCode = _selectedSubDeptCode;
              if (subCode == null || subCode == 0) return const Center(child: Text('Chọn phòng ban'));
              return workPosAsync.when(
                data: (items) {
                  if (items.isEmpty) return const Center(child: Text('Không có dữ liệu'));
                  return ListView.separated(
                    itemCount: items.length,
                    separatorBuilder: (_, __) => const Divider(height: 1),
                    itemBuilder: (context, index) {
                      final d = items[index];
                      final code = int.tryParse((d['WORK_POSITION_CODE'] ?? 0).toString()) ?? 0;
                      final name = (d['WORK_POSITION_NAME'] ?? '').toString();
                      final nameKr = (d['WORK_POSITION_NAME_KR'] ?? '').toString();
                      final attGroup = (d['ATT_GROUP_CODE'] ?? '').toString();
                      return ListTile(
                        title: Text(name.isEmpty ? 'WorkPos $code' : name),
                        subtitle: Text('${code.toString()} | $nameKr | ATT_GROUP=$attGroup'),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(icon: const Icon(Icons.edit), onPressed: () => _addOrEditWorkPosition(item: d)),
                            IconButton(icon: const Icon(Icons.delete_outline), onPressed: () => _deleteWorkPosition(d)),
                          ],
                        ),
                      );
                    },
                  );
                },
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (e, _) => Center(child: Text('Lỗi: $e')),
              );
            },
          ),
        ),
      ],
    );
  }
}
