import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../app/app_drawer.dart';
import '../../../core/utils/date_utils.dart';
import '../application/hr_providers.dart';

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

class _EmployeesTab extends ConsumerStatefulWidget {
  const _EmployeesTab();

  @override
  ConsumerState<_EmployeesTab> createState() => _EmployeesTabState();
}

class _EmployeesTabState extends ConsumerState<_EmployeesTab> {
  String _query = '';

  Future<void> _openEditor({Map<String, dynamic>? employee}) async {
    final repo = ref.read(hrRepositoryProvider);

    // Start from full record if editing; if creating, initialize defaults so update payload is complete.
    final data = <String, dynamic>{
      'CTR_CD': '002',
      'EMPL_NO': '',
      'CMS_ID': '',
      'NV_CCID': 0,
      'FIRST_NAME': '',
      'MIDLAST_NAME': '',
      'DOB': '',
      'HOMETOWN': '',
      'SEX_CODE': 0,
      'ADD_PROVINCE': '',
      'ADD_DISTRICT': '',
      'ADD_COMMUNE': '',
      'ADD_VILLAGE': '',
      'PHONE_NUMBER': '',
      'WORK_START_DATE': '',
      'RESIGN_DATE': '',
      'PASSWORD': '',
      'EMAIL': '',
      'WORK_POSITION_CODE': 0,
      'WORK_SHIFT_CODE': 0,
      'POSITION_CODE': 0,
      'JOB_CODE': 1,
      'FACTORY_CODE': 1,
      'WORK_STATUS_CODE': 1,
      'REMARK': '',
      'ATT_GROUP_CODE': 0,
      'SUBDEPTCODE': 0,
      'MAINDEPTCODE': 0,
    };
    if (employee != null) {
      data.addAll(employee);
    }

    String emplNo = (data['EMPL_NO'] ?? '').toString();
    String cmsId = (data['CMS_ID'] ?? '').toString();
    int nvCcid = int.tryParse((data['NV_CCID'] ?? 0).toString()) ?? 0;
    String firstName = (data['FIRST_NAME'] ?? '').toString();
    String midLastName = (data['MIDLAST_NAME'] ?? '').toString();
    String dob = AppDateUtils.ymdFromValue(data['DOB']);
    String hometown = (data['HOMETOWN'] ?? '').toString();
    String province = (data['ADD_PROVINCE'] ?? '').toString();
    String district = (data['ADD_DISTRICT'] ?? '').toString();
    String commune = (data['ADD_COMMUNE'] ?? '').toString();
    String village = (data['ADD_VILLAGE'] ?? '').toString();
    String phone = (data['PHONE_NUMBER'] ?? '').toString();
    String workStartDate = AppDateUtils.ymdFromValue(data['WORK_START_DATE']);
    String resignDate = AppDateUtils.ymdFromValue(data['RESIGN_DATE']);
    String password = (data['PASSWORD'] ?? '').toString();
    String email = (data['EMAIL'] ?? '').toString();
    String remark = (data['REMARK'] ?? '').toString();

    int sexCode = int.tryParse((data['SEX_CODE'] ?? 0).toString()) ?? 0;
    int workPositionCode = int.tryParse((data['WORK_POSITION_CODE'] ?? 0).toString()) ?? 0;
    int workShiftCode = int.tryParse((data['WORK_SHIFT_CODE'] ?? 0).toString()) ?? 0;
    int positionCode = int.tryParse((data['POSITION_CODE'] ?? 0).toString()) ?? 0;
    int jobCode = int.tryParse((data['JOB_CODE'] ?? 1).toString()) ?? 1;
    int factoryCode = int.tryParse((data['FACTORY_CODE'] ?? 1).toString()) ?? 1;
    int workStatusCode = int.tryParse((data['WORK_STATUS_CODE'] ?? 1).toString()) ?? 1;

    final isNew = employee == null || emplNo.trim().isEmpty;

    final workPositions = await ref.read(workPositionsProvider(null).future);
    if (!mounted) return;

    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setModalState) {
            int localSexCode = sexCode;
            int localWorkPositionCode = workPositionCode == 0 && workPositions.isNotEmpty
                ? int.tryParse((workPositions.first['WORK_POSITION_CODE'] ?? 0).toString()) ?? 0
                : workPositionCode;
            int localWorkShiftCode = workShiftCode;
            int localPositionCode = positionCode;
            int localJobCode = jobCode;
            int localFactoryCode = factoryCode;
            int localWorkStatusCode = workStatusCode;

            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(ctx).viewInsets.bottom,
                left: 16,
                right: 16,
                top: 16,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(isNew ? 'Thêm nhân viên' : 'Cập nhật nhân viên', style: Theme.of(ctx).textTheme.titleMedium),
                  const SizedBox(height: 12),
                  Flexible(
                    child: SingleChildScrollView(
                      child: Column(
                        children: [
                          TextFormField(
                            initialValue: emplNo,
                            decoration: const InputDecoration(labelText: 'EMPL_NO (ERP_ID)'),
                            onChanged: (v) => emplNo = v,
                          ),
                          TextFormField(
                            initialValue: cmsId,
                            decoration: const InputDecoration(labelText: 'CMS_ID (NS_ID)'),
                            onChanged: (v) => cmsId = v,
                          ),
                          TextFormField(
                            initialValue: nvCcid.toString(),
                            keyboardType: TextInputType.number,
                            decoration: const InputDecoration(labelText: 'NV_CCID (Mã chấm công)'),
                            onChanged: (v) => nvCcid = int.tryParse(v.trim()) ?? 0,
                          ),
                          TextFormField(
                            initialValue: firstName,
                            decoration: const InputDecoration(labelText: 'FIRST_NAME (Tên)'),
                            onChanged: (v) => firstName = v,
                          ),
                          TextFormField(
                            initialValue: midLastName,
                            decoration: const InputDecoration(labelText: 'MIDLAST_NAME (Họ và đệm)'),
                            onChanged: (v) => midLastName = v,
                          ),
                          TextFormField(
                            initialValue: dob,
                            decoration: const InputDecoration(labelText: 'DOB (YYYY-MM-DD)'),
                            onChanged: (v) => dob = v,
                          ),
                          TextFormField(
                            initialValue: hometown,
                            decoration: const InputDecoration(labelText: 'HOMETOWN (Quê quán)'),
                            onChanged: (v) => hometown = v,
                          ),

                          DropdownButtonFormField<int>(
                            initialValue: localSexCode,
                            decoration: const InputDecoration(labelText: 'SEX_CODE'),
                            items: const [
                              DropdownMenuItem(value: 0, child: Text('Nữ')),
                              DropdownMenuItem(value: 1, child: Text('Nam')),
                            ],
                            onChanged: (v) => setModalState(() => localSexCode = v ?? 0),
                          ),

                          TextFormField(
                            initialValue: province,
                            decoration: const InputDecoration(labelText: 'ADD_PROVINCE'),
                            onChanged: (v) => province = v,
                          ),
                          TextFormField(
                            initialValue: district,
                            decoration: const InputDecoration(labelText: 'ADD_DISTRICT'),
                            onChanged: (v) => district = v,
                          ),
                          TextFormField(
                            initialValue: commune,
                            decoration: const InputDecoration(labelText: 'ADD_COMMUNE'),
                            onChanged: (v) => commune = v,
                          ),
                          TextFormField(
                            initialValue: village,
                            decoration: const InputDecoration(labelText: 'ADD_VILLAGE'),
                            onChanged: (v) => village = v,
                          ),
                          TextFormField(
                            initialValue: phone,
                            decoration: const InputDecoration(labelText: 'PHONE_NUMBER'),
                            onChanged: (v) => phone = v,
                          ),
                          TextFormField(
                            initialValue: workStartDate,
                            decoration: const InputDecoration(labelText: 'WORK_START_DATE (YYYY-MM-DD)'),
                            onChanged: (v) => workStartDate = v,
                          ),

                          DropdownButtonFormField<int>(
                            initialValue: localWorkStatusCode,
                            decoration: const InputDecoration(labelText: 'WORK_STATUS_CODE (Trạng thái làm việc)'),
                            items: const [
                              DropdownMenuItem(value: 0, child: Text('Đã nghỉ')),
                              DropdownMenuItem(value: 1, child: Text('Đang làm')),
                              DropdownMenuItem(value: 2, child: Text('Nghỉ sinh')),
                            ],
                            onChanged: (v) {
                              setModalState(() {
                                localWorkStatusCode = v ?? 1;
                              });
                            },
                          ),

                          // Only editable when WORK_STATUS_CODE == 0 (same as web)
                          TextFormField(
                            initialValue: resignDate,
                            enabled: localWorkStatusCode == 0,
                            decoration: const InputDecoration(labelText: 'RESIGN_DATE (YYYY-MM-DD)'),
                            onChanged: (v) => resignDate = v,
                          ),

                          TextFormField(
                            initialValue: password,
                            obscureText: true,
                            decoration: const InputDecoration(labelText: 'PASSWORD'),
                            onChanged: (v) => password = v,
                          ),
                          TextFormField(
                            initialValue: email,
                            decoration: const InputDecoration(labelText: 'EMAIL'),
                            onChanged: (v) => email = v,
                          ),

                          DropdownButtonFormField<int>(
                            initialValue: localWorkPositionCode,
                            decoration: const InputDecoration(labelText: 'WORK_POSITION_CODE (Vị trí làm việc)'),
                            items: [
                              for (final wp in workPositions)
                                DropdownMenuItem(
                                  value: int.tryParse((wp['WORK_POSITION_CODE'] ?? 0).toString()) ?? 0,
                                  child: Text((wp['WORK_POSITION_NAME'] ?? '').toString()),
                                ),
                            ],
                            onChanged: (v) => setModalState(() => localWorkPositionCode = v ?? 0),
                          ),

                          DropdownButtonFormField<int>(
                            initialValue: localWorkShiftCode,
                            decoration: const InputDecoration(labelText: 'WORK_SHIFT_CODE (Team làm việc)'),
                            items: const [
                              DropdownMenuItem(value: 0, child: Text('Hành chính')),
                              DropdownMenuItem(value: 1, child: Text('TEAM 1')),
                              DropdownMenuItem(value: 2, child: Text('TEAM 2')),
                            ],
                            onChanged: (v) => setModalState(() => localWorkShiftCode = v ?? 0),
                          ),

                          DropdownButtonFormField<int>(
                            initialValue: localPositionCode,
                            decoration: const InputDecoration(labelText: 'POSITION_CODE (Cấp bậc)'),
                            items: const [
                              DropdownMenuItem(value: 0, child: Text('Manager')),
                              DropdownMenuItem(value: 1, child: Text('AM')),
                              DropdownMenuItem(value: 2, child: Text('Senior')),
                              DropdownMenuItem(value: 3, child: Text('Staff')),
                              DropdownMenuItem(value: 4, child: Text('No Pos')),
                            ],
                            onChanged: (v) => setModalState(() => localPositionCode = v ?? 0),
                          ),

                          DropdownButtonFormField<int>(
                            initialValue: localJobCode,
                            decoration: const InputDecoration(labelText: 'JOB_CODE (Chức vụ)'),
                            items: const [
                              DropdownMenuItem(value: 1, child: Text('Dept Staff')),
                              DropdownMenuItem(value: 2, child: Text('Leader')),
                              DropdownMenuItem(value: 3, child: Text('Sub Leader')),
                              DropdownMenuItem(value: 4, child: Text('Worker')),
                            ],
                            onChanged: (v) => setModalState(() => localJobCode = v ?? 1),
                          ),

                          DropdownButtonFormField<int>(
                            initialValue: localFactoryCode,
                            decoration: const InputDecoration(labelText: 'FACTORY_CODE (Nhà máy)'),
                            items: const [
                              DropdownMenuItem(value: 1, child: Text('Nhà máy 1')),
                              DropdownMenuItem(value: 2, child: Text('Nhà máy 2')),
                            ],
                            onChanged: (v) => setModalState(() => localFactoryCode = v ?? 1),
                          ),

                          TextFormField(
                            initialValue: remark,
                            decoration: const InputDecoration(labelText: 'REMARK'),
                            onChanged: (v) => remark = v,
                          ),
                          const SizedBox(height: 12),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: FilledButton(
                          onPressed: () async {
                            data['EMPL_NO'] = emplNo.trim();
                            data['CMS_ID'] = cmsId.trim();
                            data['NV_CCID'] = nvCcid;
                            data['FIRST_NAME'] = firstName.trim();
                            data['MIDLAST_NAME'] = midLastName.trim();
                            data['DOB'] = dob.trim();
                            data['HOMETOWN'] = hometown.trim();
                            data['SEX_CODE'] = localSexCode;
                            data['ADD_PROVINCE'] = province.trim();
                            data['ADD_DISTRICT'] = district.trim();
                            data['ADD_COMMUNE'] = commune.trim();
                            data['ADD_VILLAGE'] = village.trim();
                            data['PHONE_NUMBER'] = phone.trim();
                            data['WORK_START_DATE'] = workStartDate.trim();
                            data['RESIGN_DATE'] = resignDate.trim();
                            data['PASSWORD'] = password;
                            data['EMAIL'] = email.trim();
                            data['WORK_POSITION_CODE'] = localWorkPositionCode;
                            data['WORK_SHIFT_CODE'] = localWorkShiftCode;
                            data['POSITION_CODE'] = localPositionCode;
                            data['JOB_CODE'] = localJobCode;
                            data['FACTORY_CODE'] = localFactoryCode;
                            data['WORK_STATUS_CODE'] = localWorkStatusCode;
                            data['REMARK'] = remark.trim();

                            String? err;
                            if (isNew) {
                              err = await repo.insertEmployee(data);
                            } else {
                              err = await repo.updateEmployee(data);
                            }

                            if (!ctx.mounted) return;
                            if (err != null && err.isNotEmpty) {
                              ScaffoldMessenger.of(ctx).showSnackBar(SnackBar(content: Text('Lỗi: $err')));
                              return;
                            }

                            ref.invalidate(employeesProvider);
                            Navigator.of(ctx).pop();
                          },
                          child: const Text('Lưu'),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final employeesAsync = ref.watch(employeesProvider);

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  decoration: const InputDecoration(
                    prefixIcon: Icon(Icons.search),
                    labelText: 'Tìm theo tên/EMPL_NO/CMS_ID',
                    border: OutlineInputBorder(),
                  ),
                  onChanged: (v) => setState(() => _query = v.trim().toLowerCase()),
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                onPressed: () => _openEditor(),
                icon: const Icon(Icons.add),
              ),
            ],
          ),
        ),
        Expanded(
          child: employeesAsync.when(
            data: (items) {
              final filtered = items.where((e) {
                if (_query.isEmpty) return true;
                final empl = (e['EMPL_NO'] ?? '').toString().toLowerCase();
                final cms = (e['CMS_ID'] ?? '').toString().toLowerCase();
                final full = '${(e['MIDLAST_NAME'] ?? '').toString()} ${(e['FIRST_NAME'] ?? '').toString()}'.toLowerCase();
                return empl.contains(_query) || cms.contains(_query) || full.contains(_query);
              }).toList();

              if (filtered.isEmpty) {
                return const Center(child: Text('Không có dữ liệu'));
              }

              return RefreshIndicator(
                onRefresh: () async => ref.invalidate(employeesProvider),
                child: ListView.separated(
                  itemCount: filtered.length,
                  separatorBuilder: (_, __) => const Divider(height: 1),
                  itemBuilder: (context, index) {
                    final e = filtered[index];
                    final title = '${(e['MIDLAST_NAME'] ?? '').toString()} ${(e['FIRST_NAME'] ?? '').toString()}'.trim();
                    final subtitle = 'EMPL_NO: ${(e['EMPL_NO'] ?? '')} | CMS_ID: ${(e['CMS_ID'] ?? '')}\n${(e['MAINDEPTNAME'] ?? '')}/${(e['SUBDEPTNAME'] ?? '')}';
                    return ListTile(
                      title: Text(title.isEmpty ? (e['EMPL_NO'] ?? '').toString() : title),
                      subtitle: Text(subtitle),
                      trailing: const Icon(Icons.edit),
                      onTap: () => _openEditor(employee: e),
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
  }
}

class _DepartmentsTab extends ConsumerStatefulWidget {
  const _DepartmentsTab();

  @override
  ConsumerState<_DepartmentsTab> createState() => _DepartmentsTabState();
}

class _DepartmentsTabState extends ConsumerState<_DepartmentsTab> {
  int? _selectedMainDeptCode;
  int? _selectedSubDeptCode;

  Future<void> _editMainDept({Map<String, dynamic>? item}) async {
    final repo = ref.read(hrRepositoryProvider);
    final data = Map<String, dynamic>.from(item ?? <String, dynamic>{'CTR_CD': '002'});

    final codeCtrl = TextEditingController(text: (data['MAINDEPTCODE'] ?? '').toString());
    final nameCtrl = TextEditingController(text: (data['MAINDEPTNAME'] ?? '').toString());
    final nameKrCtrl = TextEditingController(text: (data['MAINDEPTNAME_KR'] ?? '').toString());

    final isNew = item == null;

    await showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(isNew ? 'Thêm MainDept' : 'Sửa MainDept'),
        content: SingleChildScrollView(
          child: Column(
            children: [
              TextField(controller: codeCtrl, decoration: const InputDecoration(labelText: 'MAINDEPTCODE')),
              TextField(controller: nameCtrl, decoration: const InputDecoration(labelText: 'MAINDEPTNAME')),
              TextField(controller: nameKrCtrl, decoration: const InputDecoration(labelText: 'MAINDEPTNAME_KR')),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(), child: const Text('Hủy')),
          FilledButton(
            onPressed: () async {
              data['MAINDEPTCODE'] = int.tryParse(codeCtrl.text.trim()) ?? data['MAINDEPTCODE'];
              data['MAINDEPTNAME'] = nameCtrl.text.trim();
              data['MAINDEPTNAME_KR'] = nameKrCtrl.text.trim();

              final err = isNew ? await repo.insertMainDept(data) : await repo.updateMainDept(data);
              if (!ctx.mounted) return;
              if (err != null && err.isNotEmpty) {
                ScaffoldMessenger.of(ctx).showSnackBar(SnackBar(content: Text('Lỗi: $err')));
                return;
              }
              ref.invalidate(mainDeptsProvider);
              Navigator.of(ctx).pop();
            },
            child: const Text('Lưu'),
          ),
        ],
      ),
    );

    codeCtrl.dispose();
    nameCtrl.dispose();
    nameKrCtrl.dispose();
  }

  Future<void> _editSubDept({Map<String, dynamic>? item}) async {
    final repo = ref.read(hrRepositoryProvider);
    final data = Map<String, dynamic>.from(item ?? <String, dynamic>{'CTR_CD': '002'});

    final mainCodeCtrl = TextEditingController(text: (data['MAINDEPTCODE'] ?? _selectedMainDeptCode ?? '').toString());
    final subCodeCtrl = TextEditingController(text: (data['SUBDEPTCODE'] ?? '').toString());
    final nameCtrl = TextEditingController(text: (data['SUBDEPTNAME'] ?? '').toString());
    final nameKrCtrl = TextEditingController(text: (data['SUBDEPTNAME_KR'] ?? '').toString());

    final isNew = item == null;

    await showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(isNew ? 'Thêm SubDept' : 'Sửa SubDept'),
        content: SingleChildScrollView(
          child: Column(
            children: [
              TextField(controller: mainCodeCtrl, decoration: const InputDecoration(labelText: 'MAINDEPTCODE')),
              TextField(controller: subCodeCtrl, decoration: const InputDecoration(labelText: 'SUBDEPTCODE')),
              TextField(controller: nameCtrl, decoration: const InputDecoration(labelText: 'SUBDEPTNAME')),
              TextField(controller: nameKrCtrl, decoration: const InputDecoration(labelText: 'SUBDEPTNAME_KR')),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(), child: const Text('Hủy')),
          FilledButton(
            onPressed: () async {
              data['MAINDEPTCODE'] = int.tryParse(mainCodeCtrl.text.trim()) ?? data['MAINDEPTCODE'];
              data['SUBDEPTCODE'] = int.tryParse(subCodeCtrl.text.trim()) ?? data['SUBDEPTCODE'];
              data['SUBDEPTNAME'] = nameCtrl.text.trim();
              data['SUBDEPTNAME_KR'] = nameKrCtrl.text.trim();

              final err = isNew ? await repo.insertSubDept(data) : await repo.updateSubDept(data);
              if (!ctx.mounted) return;
              if (err != null && err.isNotEmpty) {
                ScaffoldMessenger.of(ctx).showSnackBar(SnackBar(content: Text('Lỗi: $err')));
                return;
              }
              ref.invalidate(subDeptsProvider(_selectedMainDeptCode));
              Navigator.of(ctx).pop();
            },
            child: const Text('Lưu'),
          ),
        ],
      ),
    );

    mainCodeCtrl.dispose();
    subCodeCtrl.dispose();
    nameCtrl.dispose();
    nameKrCtrl.dispose();
  }

  Future<void> _editWorkPosition({Map<String, dynamic>? item}) async {
    final repo = ref.read(hrRepositoryProvider);
    final data = Map<String, dynamic>.from(item ?? <String, dynamic>{'CTR_CD': '002'});

    final subCodeCtrl = TextEditingController(text: (data['SUBDEPTCODE'] ?? _selectedSubDeptCode ?? '').toString());
    final wpCodeCtrl = TextEditingController(text: (data['WORK_POSITION_CODE'] ?? '').toString());
    final nameCtrl = TextEditingController(text: (data['WORK_POSITION_NAME'] ?? '').toString());
    final nameKrCtrl = TextEditingController(text: (data['WORK_POSITION_NAME_KR'] ?? '').toString());
    final attGroupCtrl = TextEditingController(text: (data['ATT_GROUP_CODE'] ?? '').toString());

    final isNew = item == null;

    await showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(isNew ? 'Thêm Work Position' : 'Sửa Work Position'),
        content: SingleChildScrollView(
          child: Column(
            children: [
              TextField(controller: subCodeCtrl, decoration: const InputDecoration(labelText: 'SUBDEPTCODE')),
              TextField(controller: wpCodeCtrl, decoration: const InputDecoration(labelText: 'WORK_POSITION_CODE')),
              TextField(controller: nameCtrl, decoration: const InputDecoration(labelText: 'WORK_POSITION_NAME')),
              TextField(controller: nameKrCtrl, decoration: const InputDecoration(labelText: 'WORK_POSITION_NAME_KR')),
              TextField(controller: attGroupCtrl, decoration: const InputDecoration(labelText: 'ATT_GROUP_CODE')),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(), child: const Text('Hủy')),
          FilledButton(
            onPressed: () async {
              data['SUBDEPTCODE'] = int.tryParse(subCodeCtrl.text.trim()) ?? data['SUBDEPTCODE'];
              data['WORK_POSITION_CODE'] = int.tryParse(wpCodeCtrl.text.trim()) ?? data['WORK_POSITION_CODE'];
              data['WORK_POSITION_NAME'] = nameCtrl.text.trim();
              data['WORK_POSITION_NAME_KR'] = nameKrCtrl.text.trim();
              data['ATT_GROUP_CODE'] = int.tryParse(attGroupCtrl.text.trim()) ?? data['ATT_GROUP_CODE'];

              final err = isNew ? await repo.insertWorkPosition(data) : await repo.updateWorkPosition(data);
              if (!ctx.mounted) return;
              if (err != null && err.isNotEmpty) {
                ScaffoldMessenger.of(ctx).showSnackBar(SnackBar(content: Text('Lỗi: $err')));
                return;
              }
              ref.invalidate(workPositionsProvider(_selectedSubDeptCode));
              Navigator.of(ctx).pop();
            },
            child: const Text('Lưu'),
          ),
        ],
      ),
    );

    subCodeCtrl.dispose();
    wpCodeCtrl.dispose();
    nameCtrl.dispose();
    nameKrCtrl.dispose();
    attGroupCtrl.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final mainAsync = ref.watch(mainDeptsProvider);
    final subAsync = ref.watch(subDeptsProvider(_selectedMainDeptCode));
    final wpAsync = ref.watch(workPositionsProvider(_selectedSubDeptCode));

    return Column(
      children: [
        Expanded(
          child: mainAsync.when(
            data: (items) {
              return Card(
                margin: const EdgeInsets.all(12),
                child: Column(
                  children: [
                    ListTile(
                      title: const Text('Main Dept'),
                      trailing: IconButton(
                        onPressed: () => _editMainDept(),
                        icon: const Icon(Icons.add),
                      ),
                    ),
                    const Divider(height: 1),
                    Expanded(
                      child: ListView.builder(
                        itemCount: items.length,
                        itemBuilder: (context, index) {
                          final m = items[index];
                          final code = int.tryParse((m['MAINDEPTCODE'] ?? '').toString());
                          final selected = code != null && code == _selectedMainDeptCode;
                          return ListTile(
                            selected: selected,
                            title: Text('${m['MAINDEPTNAME'] ?? ''}'),
                            subtitle: Text('CODE: ${m['MAINDEPTCODE'] ?? ''}'),
                            onTap: () {
                              setState(() {
                                _selectedMainDeptCode = code;
                                _selectedSubDeptCode = null;
                              });
                            },
                            trailing: IconButton(
                              icon: const Icon(Icons.edit),
                              onPressed: () => _editMainDept(item: m),
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              );
            },
            error: (e, _) => Center(child: Text('Lỗi main dept: $e')),
            loading: () => const Center(child: CircularProgressIndicator()),
          ),
        ),
        Expanded(
          child: subAsync.when(
            data: (items) {
              return Card(
                margin: const EdgeInsets.fromLTRB(12, 0, 12, 12),
                child: Column(
                  children: [
                    ListTile(
                      title: const Text('Sub Dept'),
                      subtitle: Text('MAINDEPTCODE: ${_selectedMainDeptCode ?? '-'}'),
                      trailing: IconButton(
                        onPressed: _selectedMainDeptCode == null ? null : () => _editSubDept(),
                        icon: const Icon(Icons.add),
                      ),
                    ),
                    const Divider(height: 1),
                    Expanded(
                      child: ListView.builder(
                        itemCount: items.length,
                        itemBuilder: (context, index) {
                          final s = items[index];
                          final code = int.tryParse((s['SUBDEPTCODE'] ?? '').toString());
                          final selected = code != null && code == _selectedSubDeptCode;
                          return ListTile(
                            selected: selected,
                            title: Text('${s['SUBDEPTNAME'] ?? ''}'),
                            subtitle: Text('CODE: ${s['SUBDEPTCODE'] ?? ''}'),
                            onTap: () {
                              setState(() {
                                _selectedSubDeptCode = code;
                              });
                            },
                            trailing: IconButton(
                              icon: const Icon(Icons.edit),
                              onPressed: () => _editSubDept(item: s),
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              );
            },
            error: (e, _) => Center(child: Text('Lỗi sub dept: $e')),
            loading: () => const Center(child: CircularProgressIndicator()),
          ),
        ),
        Expanded(
          child: wpAsync.when(
            data: (items) {
              return Card(
                margin: const EdgeInsets.fromLTRB(12, 0, 12, 12),
                child: Column(
                  children: [
                    ListTile(
                      title: const Text('Work Position'),
                      subtitle: Text('SUBDEPTCODE: ${_selectedSubDeptCode ?? '-'}'),
                      trailing: IconButton(
                        onPressed: _selectedSubDeptCode == null ? null : () => _editWorkPosition(),
                        icon: const Icon(Icons.add),
                      ),
                    ),
                    const Divider(height: 1),
                    Expanded(
                      child: ListView.builder(
                        itemCount: items.length,
                        itemBuilder: (context, index) {
                          final w = items[index];
                          return ListTile(
                            title: Text('${w['WORK_POSITION_NAME'] ?? ''}'),
                            subtitle: Text('CODE: ${w['WORK_POSITION_CODE'] ?? ''} | ATT_GROUP: ${w['ATT_GROUP_CODE'] ?? ''}'),
                            trailing: IconButton(
                              icon: const Icon(Icons.edit),
                              onPressed: () => _editWorkPosition(item: w),
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              );
            },
            error: (e, _) => Center(child: Text('Lỗi work position: $e')),
            loading: () => const Center(child: CircularProgressIndicator()),
          ),
        ),
      ],
    );
  }
}
