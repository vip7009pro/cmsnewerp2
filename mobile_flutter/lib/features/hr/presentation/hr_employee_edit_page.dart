import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

import '../../../core/config/app_config.dart';
import '../../../core/providers.dart';
import '../../../core/utils/date_utils.dart';
import '../application/hr_providers.dart';

class HrEmployeeEditPage extends ConsumerStatefulWidget {
  const HrEmployeeEditPage({super.key, this.employee});

  final Map<String, dynamic>? employee;

  @override
  ConsumerState<HrEmployeeEditPage> createState() => _HrEmployeeEditPageState();
}

class _HrEmployeeEditPageState extends ConsumerState<HrEmployeeEditPage> {
  late final Map<String, dynamic> _data;
  late final TextEditingController _emplNoCtrl;
  late final TextEditingController _cmsIdCtrl;
  late final TextEditingController _firstNameCtrl;
  late final TextEditingController _midLastNameCtrl;
  late final TextEditingController _dobCtrl;
  late final TextEditingController _hometownCtrl;
  late final TextEditingController _provinceCtrl;
  late final TextEditingController _districtCtrl;
  late final TextEditingController _communeCtrl;
  late final TextEditingController _villageCtrl;
  late final TextEditingController _phoneCtrl;
  late final TextEditingController _workStartDateCtrl;
  late final TextEditingController _resignDateCtrl;
  late final TextEditingController _passwordCtrl;
  late final TextEditingController _emailCtrl;
  late final TextEditingController _remarkCtrl;

  int _sexCode = 0;
  int _workPositionCode = 0;
  int _workShiftCode = 0;
  int _positionCode = 0;
  int _jobCode = 1;
  int _factoryCode = 1;
  int _workStatusCode = 1;
  int _attGroupCode = 0;
  int _subDeptCode = 0;
  int _mainDeptCode = 0;

  bool _loading = false;
  bool _uploadingAvatar = false;

  Future<void> _uploadEmployeeAvatar() async {
    final messenger = ScaffoldMessenger.of(context);
    final emplNo = _emplNoCtrl.text.trim();
    if (emplNo.isEmpty) return;

    if (_uploadingAvatar) return;
    setState(() => _uploadingAvatar = true);

    try {
      final picker = ImagePicker();
      final picked = await picker.pickImage(source: ImageSource.gallery, imageQuality: 85);
      if (picked == null) {
        if (!mounted) return;
        setState(() => _uploadingAvatar = false);
        return;
      }

      final apiClient = ref.read(apiClientProvider);
      final uploadRes = await apiClient.uploadFile(
        file: File(picked.path),
        filename: 'NS_$emplNo.jpg',
        uploadFolderName: 'Picture_NS',
      );

      final body = uploadRes.data;
      if (body is Map<String, dynamic> && (body['tk_status'] ?? '').toString().toUpperCase() == 'NG') {
        if (!mounted) return;
        setState(() => _uploadingAvatar = false);
        messenger.showSnackBar(
          SnackBar(content: Text('Upload thất bại: ${(body['message'] ?? 'NG').toString()}')),
        );
        return;
      }

      final res = await apiClient.postCommand(
        'update_empl_image',
        data: {
          'EMPL_NO': emplNo,
          'EMPL_IMAGE': 'Y',
        },
      );

      final b2 = res.data;
      if (b2 is Map<String, dynamic> && (b2['tk_status'] ?? '').toString().toUpperCase() == 'NG') {
        if (!mounted) return;
        setState(() => _uploadingAvatar = false);
        messenger.showSnackBar(
          SnackBar(content: Text('Cập nhật avatar thất bại: ${(b2['message'] ?? 'NG').toString()}')),
        );
        return;
      }

      if (!mounted) return;
      setState(() => _uploadingAvatar = false);
      messenger.showSnackBar(const SnackBar(content: Text('Upload avatar thành công')));

      ref.invalidate(employeesProvider);
      setState(() {});
    } catch (e) {
      if (!mounted) return;
      setState(() => _uploadingAvatar = false);
      messenger.showSnackBar(SnackBar(content: Text('Lỗi upload: $e')));
    }
  }

  @override
  void initState() {
    super.initState();
    _data = {
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
    if (widget.employee != null) _data.addAll(widget.employee!);

    _emplNoCtrl = TextEditingController(text: _data['EMPL_NO'].toString());
    _cmsIdCtrl = TextEditingController(text: _data['CMS_ID'].toString());
    _firstNameCtrl = TextEditingController(text: _data['FIRST_NAME'].toString());
    _midLastNameCtrl = TextEditingController(text: _data['MIDLAST_NAME'].toString());
    _dobCtrl = TextEditingController(text: AppDateUtils.ymdFromValue(_data['DOB']));
    _hometownCtrl = TextEditingController(text: _data['HOMETOWN'].toString());
    _provinceCtrl = TextEditingController(text: _data['ADD_PROVINCE'].toString());
    _districtCtrl = TextEditingController(text: _data['ADD_DISTRICT'].toString());
    _communeCtrl = TextEditingController(text: _data['ADD_COMMUNE'].toString());
    _villageCtrl = TextEditingController(text: _data['ADD_VILLAGE'].toString());
    _phoneCtrl = TextEditingController(text: _data['PHONE_NUMBER'].toString());
    _workStartDateCtrl = TextEditingController(text: AppDateUtils.ymdFromValue(_data['WORK_START_DATE']));
    _resignDateCtrl = TextEditingController(text: AppDateUtils.ymdFromValue(_data['RESIGN_DATE']));
    _passwordCtrl = TextEditingController(text: _data['PASSWORD'].toString());
    _emailCtrl = TextEditingController(text: _data['EMAIL'].toString());
    final remarkValue = _data['REMARK'];
    _remarkCtrl = TextEditingController(text: remarkValue == null ? '' : remarkValue.toString());

    _sexCode = int.tryParse(_data['SEX_CODE'].toString()) ?? 0;
    _workPositionCode = int.tryParse(_data['WORK_POSITION_CODE'].toString()) ?? 0;
    _workShiftCode = int.tryParse(_data['WORK_SHIFT_CODE'].toString()) ?? 0;
    _positionCode = int.tryParse(_data['POSITION_CODE'].toString()) ?? 0;
    _jobCode = int.tryParse(_data['JOB_CODE'].toString()) ?? 1;
    _factoryCode = int.tryParse(_data['FACTORY_CODE'].toString()) ?? 1;
    _workStatusCode = int.tryParse(_data['WORK_STATUS_CODE'].toString()) ?? 1;
    _attGroupCode = int.tryParse(_data['ATT_GROUP_CODE'].toString()) ?? 0;
    _subDeptCode = int.tryParse(_data['SUBDEPTCODE'].toString()) ?? 0;
    _mainDeptCode = int.tryParse(_data['MAINDEPTCODE'].toString()) ?? 0;
  }

  @override
  void dispose() {
    _emplNoCtrl.dispose();
    _cmsIdCtrl.dispose();
    _firstNameCtrl.dispose();
    _midLastNameCtrl.dispose();
    _dobCtrl.dispose();
    _hometownCtrl.dispose();
    _provinceCtrl.dispose();
    _districtCtrl.dispose();
    _communeCtrl.dispose();
    _villageCtrl.dispose();
    _phoneCtrl.dispose();
    _workStartDateCtrl.dispose();
    _resignDateCtrl.dispose();
    _passwordCtrl.dispose();
    _emailCtrl.dispose();
    _remarkCtrl.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    setState(() => _loading = true);
    try {
      final payload = {
        ..._data,
        'EMPL_NO': _emplNoCtrl.text.trim(),
        'CMS_ID': _cmsIdCtrl.text.trim(),
        'FIRST_NAME': _firstNameCtrl.text.trim(),
        'MIDLAST_NAME': _midLastNameCtrl.text.trim(),
        'DOB': _dobCtrl.text.trim(),
        'HOMETOWN': _hometownCtrl.text.trim(),
        'SEX_CODE': _sexCode,
        'ADD_PROVINCE': _provinceCtrl.text.trim(),
        'ADD_DISTRICT': _districtCtrl.text.trim(),
        'ADD_COMMUNE': _communeCtrl.text.trim(),
        'ADD_VILLAGE': _villageCtrl.text.trim(),
        'PHONE_NUMBER': _phoneCtrl.text.trim(),
        'WORK_START_DATE': _workStartDateCtrl.text.trim(),
        'RESIGN_DATE': _resignDateCtrl.text.trim(),
        'PASSWORD': _passwordCtrl.text,
        'EMAIL': _emailCtrl.text.trim(),
        'REMARK': _remarkCtrl.text.trim(),
        'WORK_POSITION_CODE': _workPositionCode,
        'WORK_SHIFT_CODE': _workShiftCode,
        'POSITION_CODE': _positionCode,
        'JOB_CODE': _jobCode,
        'FACTORY_CODE': _factoryCode,
        'WORK_STATUS_CODE': _workStatusCode,
        'ATT_GROUP_CODE': _attGroupCode,
        'SUBDEPTCODE': _subDeptCode,
        'MAINDEPTCODE': _mainDeptCode,
      };

      final repo = ref.read(hrRepositoryProvider);
      final String? err = widget.employee == null ? await repo.insertEmployee(payload) : await repo.updateEmployee(payload);
      if (err != null) {
        if (!mounted) return;
        setState(() => _loading = false);
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $err')));
        return;
      }
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $e')));
      return;
    }
    if (!mounted) return;
    setState(() => _loading = false);
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Lưu thành công')));
    Navigator.of(context).pop();
    ref.invalidate(employeesProvider);
  }

  @override
  Widget build(BuildContext context) {
    final workShiftItems = <DropdownMenuItem<int>>[
      const DropdownMenuItem(value: 0, child: Text('Hành chính')),
      const DropdownMenuItem(value: 1, child: Text('Team 1')),
      const DropdownMenuItem(value: 2, child: Text('Team 2')),
      const DropdownMenuItem(value: 3, child: Text('Team 3')),
    ];
    if (!workShiftItems.any((e) => e.value == _workShiftCode)) {
      workShiftItems.insert(0, DropdownMenuItem(value: _workShiftCode, child: Text('Unknown ($_workShiftCode)')));
    }

    final positionItems = <DropdownMenuItem<int>>[
      const DropdownMenuItem(value: 0, child: Text('Manager')),
      const DropdownMenuItem(value: 1, child: Text('AM')),
      const DropdownMenuItem(value: 2, child: Text('Senior')),
      const DropdownMenuItem(value: 3, child: Text('Staff')),
      const DropdownMenuItem(value: 4, child: Text('No Pos')),
    ];
    if (!positionItems.any((e) => e.value == _positionCode)) {
      positionItems.insert(0, DropdownMenuItem(value: _positionCode, child: Text('Unknown ($_positionCode)')));
    }

    final jobItems = <DropdownMenuItem<int>>[
      const DropdownMenuItem(value: 1, child: Text('Dept Staff')),
      const DropdownMenuItem(value: 2, child: Text('Leader')),
      const DropdownMenuItem(value: 3, child: Text('Sub Leader')),
      const DropdownMenuItem(value: 4, child: Text('Worker')),
    ];
    if (!jobItems.any((e) => e.value == _jobCode)) {
      jobItems.insert(0, DropdownMenuItem(value: _jobCode, child: Text('Unknown ($_jobCode)')));
    }

    final factoryItems = <DropdownMenuItem<int>>[
      const DropdownMenuItem(value: 1, child: Text('Nhà máy 1')),
      const DropdownMenuItem(value: 2, child: Text('Nhà máy 2')),
    ];
    if (!factoryItems.any((e) => e.value == _factoryCode)) {
      factoryItems.insert(0, DropdownMenuItem(value: _factoryCode, child: Text('Unknown ($_factoryCode)')));
    }

    return Scaffold(
      appBar: AppBar(title: Text(widget.employee == null ? 'Thêm nhân viên' : 'Sửa nhân viên')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(12),
              child: Column(
                children: [
                  GestureDetector(
                    onTap: _uploadEmployeeAvatar,
                    child: Stack(
                      alignment: Alignment.bottomRight,
                      children: [
                        CircleAvatar(
                          radius: 44,
                          backgroundImage: _emplNoCtrl.text.trim().isNotEmpty
                              ? NetworkImage(AppConfig.employeeImageUrl(_emplNoCtrl.text.trim()))
                              : null,
                          child: _emplNoCtrl.text.trim().isEmpty
                              ? const Icon(Icons.person, size: 42)
                              : null,
                        ),
                        if (_uploadingAvatar)
                          const Positioned(
                            right: 2,
                            bottom: 2,
                            child: SizedBox(
                              width: 18,
                              height: 18,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            ),
                          )
                        else
                          Container(
                            decoration: BoxDecoration(
                              color: Theme.of(context).colorScheme.primary,
                              shape: BoxShape.circle,
                            ),
                            padding: const EdgeInsets.all(6),
                            child: Icon(
                              Icons.camera_alt,
                              size: 16,
                              color: Theme.of(context).colorScheme.onPrimary,
                            ),
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _emplNoCtrl,
                    decoration: const InputDecoration(labelText: 'EMPL_NO (ERP_ID)'),
                    readOnly: widget.employee != null,
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _cmsIdCtrl,
                    decoration: const InputDecoration(labelText: 'CMS_ID'),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _firstNameCtrl,
                    decoration: const InputDecoration(labelText: 'FIRST_NAME'),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _midLastNameCtrl,
                    decoration: const InputDecoration(labelText: 'MIDLAST_NAME (Họ và đệm)'),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _dobCtrl,
                    decoration: const InputDecoration(labelText: 'DOB (YYYY-MM-DD)'),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _hometownCtrl,
                    decoration: const InputDecoration(labelText: 'HOMETOWN (Quê quán)'),
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<int>(
                    initialValue: _sexCode,
                    decoration: const InputDecoration(labelText: 'SEX_CODE'),
                    items: const [
                      DropdownMenuItem(value: 0, child: Text('Nữ')),
                      DropdownMenuItem(value: 1, child: Text('Nam')),
                    ],
                    onChanged: (v) => setState(() => _sexCode = v ?? 0),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _provinceCtrl,
                    decoration: const InputDecoration(labelText: 'ADD_PROVINCE'),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _districtCtrl,
                    decoration: const InputDecoration(labelText: 'ADD_DISTRICT'),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _communeCtrl,
                    decoration: const InputDecoration(labelText: 'ADD_COMMUNE'),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _villageCtrl,
                    decoration: const InputDecoration(labelText: 'ADD_VILLAGE'),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _phoneCtrl,
                    decoration: const InputDecoration(labelText: 'PHONE_NUMBER'),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _workStartDateCtrl,
                    decoration: const InputDecoration(labelText: 'WORK_START_DATE'),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _resignDateCtrl,
                    decoration: const InputDecoration(labelText: 'RESIGN_DATE'),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _passwordCtrl,
                    decoration: const InputDecoration(labelText: 'PASSWORD'),
                    obscureText: true,
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _emailCtrl,
                    decoration: const InputDecoration(labelText: 'EMAIL'),
                  ),
                  const SizedBox(height: 12),
                  Consumer(
                    builder: (_, ref, __) {
                      final workPositionsAsync = ref.watch(workPositionsProvider(null));
                      return workPositionsAsync.when(
                        data: (positions) => DropdownButtonFormField<int>(
                          initialValue: _workPositionCode,
                          decoration: const InputDecoration(labelText: 'WORK_POSITION_CODE'),
                          items: [
                            for (final p in positions)
                              DropdownMenuItem(
                                value: int.tryParse(p['WORK_POSITION_CODE'].toString()) ?? 0,
                                child: Text(p['WORK_POSITION_NAME'].toString()),
                              ),
                          ],
                          onChanged: (v) => setState(() => _workPositionCode = v ?? 0),
                        ),
                        loading: () => const CircularProgressIndicator(),
                        error: (_, __) => const Text('Lỗi load vị trí'),
                      );
                    },
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<int>(
                    initialValue: _workShiftCode,
                    decoration: const InputDecoration(labelText: 'WORK_SHIFT_CODE'),
                    items: workShiftItems,
                    onChanged: (v) => setState(() => _workShiftCode = v ?? 0),
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<int>(
                    initialValue: _positionCode,
                    decoration: const InputDecoration(labelText: 'POSITION_CODE'),
                    items: positionItems,
                    onChanged: (v) => setState(() => _positionCode = v ?? 0),
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<int>(
                    initialValue: _jobCode,
                    decoration: const InputDecoration(labelText: 'JOB_CODE'),
                    items: jobItems,
                    onChanged: (v) => setState(() => _jobCode = v ?? 1),
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<int>(
                    initialValue: _factoryCode,
                    decoration: const InputDecoration(labelText: 'FACTORY_CODE'),
                    items: factoryItems,
                    onChanged: (v) => setState(() => _factoryCode = v ?? 1),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _remarkCtrl,
                    decoration: const InputDecoration(labelText: 'REMARK'),
                    maxLines: 3,
                  ),
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      onPressed: _save,
                      child: const Text('Lưu'),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
