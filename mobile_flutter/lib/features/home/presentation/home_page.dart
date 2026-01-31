import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

import '../../../app/app_drawer.dart';
import '../../../core/config/app_config.dart';
import '../../auth/application/auth_notifier.dart';
import '../../auth/application/auth_state.dart';
import '../../../core/providers.dart';

class HomePage extends ConsumerStatefulWidget {
  const HomePage({super.key});

  @override
  ConsumerState<HomePage> createState() => _HomePageState();
}

class _HomePageState extends ConsumerState<HomePage> {
  Map<String, dynamic>? _myChamCong;
  Map<String, dynamic>? _summaryData;
  bool _loading = false;
  bool _uploadingAvatar = false;

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    if (mounted) {
      setState(() => _loading = true);
    }
    try {
      final apiClient = ref.read(apiClientProvider);
      
      // Fetch today's check-in/out
      final chamCongRes = await apiClient.postCommand('checkMYCHAMCONG');
      if (chamCongRes.data['tk_status'] != 'NG') {
        final data = chamCongRes.data['data'][0];
        final minTime = data['MIN_TIME']?.substring(11, 19) ?? 'Chưa chấm';
        var maxTime = data['MAX_TIME']?.substring(11, 19) ?? 'Chưa chấm';

        if (minTime == maxTime) {
          maxTime = 'Chưa chấm';
        }

        if (mounted) {
          setState(() {
            _myChamCong = {
              'MIN_TIME': minTime,
              'MAX_TIME': maxTime,
            };
          });
        }
      }

      // Fetch summary data
      final summaryQueries = [
        'workdaycheck',
        'tangcadaycheck', 
        'nghidaycheck',
        'countxacnhanchamcong',
        'countthuongphat',
      ];
      
      final summary = <String, dynamic>{};
      for (final cmd in summaryQueries) {
        final res = await apiClient.postCommand(cmd);
        if (res.data['data']?.isNotEmpty == true) {
          summary[cmd] = res.data['data'][0];
        }
      }
      if (mounted) {
        setState(() => _summaryData = summary);
      }
    } catch (e) {
      // Handle error silently for now
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authNotifierProvider);
    final session = authState is AuthAuthenticated ? authState.session : null;
    final user = session?.user;

    return Scaffold(
      appBar: AppBar(
        title: const Text('ERP'),
        actions: [
          IconButton(
            onPressed: () => ref.read(authNotifierProvider.notifier).logout(),
            icon: const Icon(Icons.logout),
            tooltip: 'Logout',
          ),
        ],
      ),
      drawer: const AppDrawer(title: 'ERP'),
      body: RefreshIndicator(
        onRefresh: _fetchData,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header Card: Avatar + Name + Department + IN/OUT
              Card(
                elevation: 2,
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    children: [
                      // Avatar
                      GestureDetector(
                        onTap: _uploadAvatar,
                        child: CircleAvatar(
                          radius: 36,
                          backgroundImage: user?.emplImage == 'Y'
                              ? NetworkImage(AppConfig.employeeImageUrl(user?.emplNo ?? ''))
                              : null,
                          child: user?.emplImage != 'Y'
                              ? Text(
                                  (user?.firstName?.isNotEmpty == true ? user!.firstName![0] : '?').toUpperCase(),
                                  style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                                )
                              : null,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '${user?.midlastName ?? ''} ${user?.firstName ?? ''}'.trim(),
                              style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 4),
                            Text('Main Dept: ${user?.mainDeptName ?? '-'}'),
                            Text('Sub Dept: ${user?.subDeptName ?? '-'}'),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Text(
                                  user?.cmsId ?? '-',
                                  style: Theme.of(context).textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w500),
                                ),
                                const SizedBox(width: 12),
                                Text(
                                  user?.emplNo ?? '-',
                                  style: Theme.of(context).textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w500),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 12),

              // Today Check-in/out Card
              Card(
                elevation: 2,
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'IN/OUT: ${DateTime.now().year}-${DateTime.now().month.toString().padLeft(2, '0')}-${DateTime.now().day.toString().padLeft(2, '0')}',
                        style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              decoration: BoxDecoration(
                                color: Colors.green.shade100,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Column(
                                children: [
                                  const Text('IN', style: TextStyle(fontWeight: FontWeight.bold)),
                                  const SizedBox(height: 4),
                                  Text(
                                    _myChamCong?['MIN_TIME'] ?? 'Chưa chấm',
                                    style: TextStyle(color: Colors.green.shade800),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              decoration: BoxDecoration(
                                color: Colors.red.shade100,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Column(
                                children: [
                                  const Text('OUT', style: TextStyle(fontWeight: FontWeight.bold)),
                                  const SizedBox(height: 4),
                                  Text(
                                    _myChamCong?['MAX_TIME'] ?? 'Chưa chấm',
                                    style: TextStyle(color: Colors.red.shade800),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 12),

              // Employee Info Card
              Card(
                elevation: 2,
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.info_outline),
                          const SizedBox(width: 8),
                          Text(
                            'Thông tin nhân viên',
                            style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      _infoRow('Ngày sinh', user?.dob?.substring(0, 10) ?? '-'),
                      _infoRow('Quê quán', user?.hometown ?? '-'),
                      _infoRow('Địa chỉ', '${user?.addVillage ?? '-'} - ${user?.addCommune ?? '-'} - ${user?.addDistrict ?? '-'} - ${user?.addProvince ?? '-'}'),
                      _infoRow('Vị trí làm việc', user?.workPositionName ?? '-'),
                      _infoRow('Nhóm điểm danh', user?.attGroupCode?.toString() ?? '-'),
                      _infoRow('Chức vụ', user?.jobName ?? '-'),
                      const SizedBox(height: 12),
                      SizedBox(
                        width: double.infinity,
                        child: OutlinedButton.icon(
                          onPressed: _changePassword,
                          icon: const Icon(Icons.lock_outline),
                          label: const Text('Change password'),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 12),

              // Summary Card
              Card(
                elevation: 2,
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.bar_chart),
                          const SizedBox(width: 8),
                          Text(
                            'Summary',
                            style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      if (_loading)
                        const Center(child: CircularProgressIndicator())
                      else
                        Column(
                          children: [
                            _summaryRow('Tổng số ngày công', _summaryData?['workdaycheck']?['WORK_DAY'] ?? 0),
                            _summaryRow('Số ngày đi làm', _summaryData?['workdaycheck']?['WORK_DAY'] ?? 0),
                            _summaryRow('Số ngày tăng ca', _summaryData?['tangcadaycheck']?['TANGCA_DAY'] ?? 0),
                            _summaryRow('Số ngày quên chấm công', _summaryData?['countxacnhanchamcong']?['COUTNXN'] ?? 0),
                            _summaryRow('Số ngày đăng ký nghỉ', _summaryData?['nghidaycheck']?['NGHI_DAY'] ?? 0),
                            _summaryRow(
                              'Thưởng phạt',
                              'Khen thưởng ${_summaryData?['countthuongphat']?['THUONG'] ?? 0}, Kỷ luật ${_summaryData?['countthuongphat']?['PHAT'] ?? 0}',
                            ),
                          ],
                        ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _infoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              '$label:',
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }

  Widget _summaryRow(String label, dynamic value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        children: [
          Expanded(
            flex: 2,
            child: Text(
              '$label:',
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
          Expanded(child: Text(value.toString())),
        ],
      ),
    );
  }

  Future<void> _uploadAvatar() async {
    final messenger = ScaffoldMessenger.of(context);
    final authState = ref.read(authNotifierProvider);
    final session = authState is AuthAuthenticated ? authState.session : null;
    final user = session?.user;
    final emplNo = user?.emplNo ?? '';
    if (emplNo.isEmpty) return;

    if (_uploadingAvatar) return;
    setState(() => _uploadingAvatar = true);

    try {
      final picker = ImagePicker();
      final picked = await picker.pickImage(source: ImageSource.gallery, imageQuality: 85);
      if (picked == null) {
        if (mounted) setState(() => _uploadingAvatar = false);
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

      await ref.read(authNotifierProvider.notifier).refreshSession();

      if (!mounted) return;
      setState(() => _uploadingAvatar = false);
      messenger.showSnackBar(const SnackBar(content: Text('Upload avatar thành công')));
    } catch (e) {
      if (!mounted) return;
      setState(() => _uploadingAvatar = false);
      messenger.showSnackBar(SnackBar(content: Text('Lỗi upload: $e')));
    }
  }

  Future<void> _changePassword() async {
    final messenger = ScaffoldMessenger.of(context);
    final secureStore = ref.read(secureKvStoreProvider);
    final currentSavedPw = await secureStore.getPassword();
    final username = await secureStore.getUsername();
    if (!mounted) return;

    final currentCtrl = TextEditingController();
    final newCtrl = TextEditingController();

    final ok = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Change Password'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: currentCtrl,
                decoration: const InputDecoration(labelText: 'Pass hiện tại'),
                obscureText: true,
              ),
              const SizedBox(height: 12),
              TextField(
                controller: newCtrl,
                decoration: const InputDecoration(labelText: 'Pass mới'),
                obscureText: true,
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Huỷ')),
            FilledButton(onPressed: () => Navigator.pop(context, true), child: const Text('Đổi')),
          ],
        );
      },
    );

    if (ok != true) return;

    final currentPw = currentCtrl.text;
    final newPw = newCtrl.text;
    if (newPw.isEmpty) {
      messenger.showSnackBar(const SnackBar(content: Text('Pass mới không được rỗng')));
      return;
    }

    if ((currentSavedPw ?? '') != currentPw) {
      messenger.showSnackBar(const SnackBar(content: Text('Pass hiện tại không đúng')));
      return;
    }

    try {
      final apiClient = ref.read(apiClientProvider);
      final res = await apiClient.postCommand('changepassword', data: {'PASSWORD': newPw});
      final body = res.data;
      if (body is Map<String, dynamic> && (body['tk_status'] ?? '').toString().toUpperCase() == 'NG') {
        messenger.showSnackBar(
          SnackBar(content: Text('Đổi mật khẩu thất bại: ${(body['message'] ?? 'NG').toString()}')),
        );
        return;
      }

      if (username != null) {
        await secureStore.setCredentials(username, newPw);
      }

      if (!mounted) return;
      messenger.showSnackBar(const SnackBar(content: Text('Thay đổi mật khẩu thành công')));
    } catch (e) {
      if (!mounted) return;
      messenger.showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }
}
