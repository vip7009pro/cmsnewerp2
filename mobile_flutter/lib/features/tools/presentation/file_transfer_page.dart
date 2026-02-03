import 'dart:io';

import 'package:dio/dio.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../core/config/app_config.dart';
import '../../../../core/providers.dart';

enum _UploadStatus { pending, uploading, done, error }

class _UploadItem {
  _UploadItem({
    required this.id,
    required this.file,
  });

  final String id;
  final File file;

  int uploadedBytes = 0;
  int totalBytes = 0;
  int progress = 0;
  _UploadStatus status = _UploadStatus.pending;
  String? error;

  String get filename => file.uri.pathSegments.isNotEmpty ? file.uri.pathSegments.last : file.path;
}

class FileTransferPage extends ConsumerStatefulWidget {
  const FileTransferPage({super.key});

  @override
  ConsumerState<FileTransferPage> createState() => _FileTransferPageState();
}

class _FileTransferPageState extends ConsumerState<FileTransferPage> {
  bool _loadingServerList = false;
  bool _uploading = false;

  final List<_UploadItem> _queue = [];
  int _overallProgress = 0;

  List<Map<String, dynamic>> _serverFiles = const [];

  String _s(dynamic v) => (v ?? '').toString();
  int _i(dynamic v) => int.tryParse(_s(v)) ?? 0;

  String _toKB(int bytes) {
    final kb = bytes / 1024.0;
    return kb.toStringAsFixed(2);
  }

  String _fmtUtc(dynamic v) {
    final s = _s(v);
    if (s.isEmpty || s == 'null') return '';
    final dt = DateTime.tryParse(s);
    if (dt == null) return s;
    return DateFormat('dd/MM/yyyy HH:mm:ss').format(dt.toLocal());
  }

  Uri _downloadUri(String filename) {
    final base = AppConfig.imageBaseUrl;
    final withCtr = '${AppConfig.ctrCd}_$filename';
    return Uri.parse('$base/globalfiles/$withCtr');
  }

  Future<void> _pickFiles() async {
    final result = await FilePicker.platform.pickFiles(
      allowMultiple: true,
      withData: false,
    );
    if (result == null) return;

    final picked = result.files.where((f) => (f.path ?? '').isNotEmpty).toList();
    if (picked.isEmpty) return;

    setState(() {
      _queue
        ..clear()
        ..addAll(
          picked.map((f) {
            final file = File(f.path!);
            final stat = file.statSync();
            final id = '${file.path}__${stat.size}__${stat.modified.millisecondsSinceEpoch}';
            final it = _UploadItem(id: id, file: file);
            it.totalBytes = stat.size;
            return it;
          }),
        );
      _overallProgress = 0;
    });
  }

  void _clearQueue() {
    setState(() {
      _queue.clear();
      _overallProgress = 0;
    });
  }

  Future<void> _loadServerList() async {
    setState(() => _loadingServerList = true);
    try {
      final api = ref.read(apiClientProvider);
      final res = await api.postCommand('get_file_list', data: {});
      final body = res.data;
      if (body is! Map<String, dynamic>) {
        setState(() => _serverFiles = const []);
        return;
      }
      final status = _s(body['tk_status']).toUpperCase();
      if (status == 'NG') {
        setState(() => _serverFiles = const []);
        return;
      }
      final data = body['data'];
      final list = (data is List ? data : const [])
          .map((e) => e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})
          .toList();
      setState(() => _serverFiles = list);
    } catch (_) {
      setState(() => _serverFiles = const []);
    } finally {
      if (mounted) setState(() => _loadingServerList = false);
    }
  }

  Future<void> _deleteFromDatabase(String filename) async {
    final api = ref.read(apiClientProvider);
    await api.postCommand('delete_file', data: {'FILE_NAME': filename});
    await _loadServerList();
  }

  Future<void> _updateFileNameToDb({required String filename, required int size}) async {
    final api = ref.read(apiClientProvider);
    await api.postCommand(
      'update_file_name',
      data: {
        'FILE_NAME': filename,
        'FILE_SIZE': size,
        'CTR_CD': AppConfig.ctrCd,
      },
    );
  }

  Future<void> _uploadQueue() async {
    if (_uploading) return;
    if (_queue.isEmpty) return;

    setState(() {
      _uploading = true;
      _overallProgress = 0;
    });

    var completed = 0;
    var failed = 0;

    try {
      final api = ref.read(apiClientProvider);

      for (final it in _queue) {
        if (!mounted) return;

        setState(() {
          it.status = _UploadStatus.uploading;
          it.progress = 0;
          it.uploadedBytes = 0;
          it.error = null;
        });

        try {
          final ctrName = '${AppConfig.ctrCd}_${it.filename}';
          await api.uploadFile(
            file: it.file,
            filename: ctrName,
            uploadFolderName: 'globalfiles',
            onSendProgress: (sent, total) {
              if (!mounted) return;
              setState(() {
                it.uploadedBytes = sent;
                it.totalBytes = total;
                it.progress = total > 0 ? ((sent / total) * 100).clamp(0, 100).round() : 0;
              });
            },
          );

          await _updateFileNameToDb(filename: it.filename, size: it.totalBytes);

          if (!mounted) return;
          setState(() {
            it.status = _UploadStatus.done;
            it.progress = 100;
            it.uploadedBytes = it.totalBytes;
          });
          completed++;
        } catch (e) {
          failed++;
          if (!mounted) return;

          var msg = e.toString();
          if (e is DioException) {
            final status = e.response?.statusCode;
            final statusText = e.response?.statusMessage;
            final data = e.response?.data;
            String? serverMsg;
            String? tkStatus;
            if (data is Map) {
              serverMsg = data['message']?.toString();
              tkStatus = data['tk_status']?.toString();
            }
            msg = [
              status != null ? 'HTTP $status' : null,
              statusText,
              tkStatus != null ? 'tk_status: $tkStatus' : null,
              serverMsg != null ? 'message: $serverMsg' : null,
              e.message,
            ].whereType<String>().where((s) => s.trim().isNotEmpty).join(' | ');
          }

          setState(() {
            it.status = _UploadStatus.error;
            it.error = msg;
          });
        } finally {
          final total = _queue.length;
          setState(() {
            _overallProgress = total > 0 ? ((completed / total) * 100).round() : 0;
          });
        }
      }

      await _loadServerList();

      if (!mounted) return;
      if (failed == 0) {
        _snack('Upload thành công');
      } else if (completed == 0) {
        _snack('Upload thất bại. Kiểm tra server logs/limit');
      } else {
        _snack('Uploaded: $completed, Failed: $failed');
      }
    } finally {
      if (mounted) setState(() => _uploading = false);
    }
  }

  Future<void> _openUrl(Uri uri) async {
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      _snack('Không mở được link');
    }
  }

  void _copyLink(String filename) {
    final uri = _downloadUri(filename);
    Clipboard.setData(ClipboardData(text: uri.toString()));
    _snack('Đã copy link');
  }

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadServerList();
    });
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    final doneCount = _queue.where((e) => e.status == _UploadStatus.done).length;

    return Scaffold(
      appBar: AppBar(
        title: const Text('File Transfer'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Row(
                      children: [
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Upload Queue', style: TextStyle(fontWeight: FontWeight.w900)),
                              SizedBox(height: 2),
                              Text('Chọn nhiều file để upload (globalfiles)', style: TextStyle(fontSize: 12)),
                            ],
                          ),
                        ),
                        FilledButton(
                          onPressed: _uploading ? null : _pickFiles,
                          child: const Text('Select Files'),
                        ),
                        const SizedBox(width: 8),
                        OutlinedButton(
                          onPressed: _uploading ? null : _clearQueue,
                          child: const Text('Clear'),
                        ),
                        const SizedBox(width: 8),
                        FilledButton(
                          onPressed: (_uploading || _queue.isEmpty) ? null : _uploadQueue,
                          child: const Text('Upload'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        const Expanded(child: Text('Overall (completed files / total)')),
                        Text('$doneCount/${_queue.length}', style: const TextStyle(fontWeight: FontWeight.w900)),
                      ],
                    ),
                    const SizedBox(height: 6),
                    LinearProgressIndicator(
                      value: (_overallProgress.clamp(0, 100)) / 100.0,
                      minHeight: 10,
                      backgroundColor: scheme.surfaceContainerHighest,
                    ),
                    const SizedBox(height: 6),
                    Text('$_overallProgress%', style: TextStyle(color: scheme.onSurfaceVariant)),
                    const SizedBox(height: 12),
                    if (_queue.isEmpty)
                      Text('No files selected', style: TextStyle(color: scheme.onSurfaceVariant))
                    else
                      ConstrainedBox(
                        constraints: const BoxConstraints(maxHeight: 260),
                        child: ListView.separated(
                          itemCount: _queue.length,
                          separatorBuilder: (_, __) => const Divider(height: 12),
                          itemBuilder: (context, index) {
                            final it = _queue[index];
                            final statusText = it.status.name;
                            final statusColor = switch (it.status) {
                              _UploadStatus.done => Colors.green,
                              _UploadStatus.error => Colors.red,
                              _UploadStatus.uploading => Colors.orange,
                              _UploadStatus.pending => scheme.onSurfaceVariant,
                            };

                            return Column(
                              crossAxisAlignment: CrossAxisAlignment.stretch,
                              children: [
                                Text('${index + 1}. ${it.filename}', style: const TextStyle(fontWeight: FontWeight.w700)),
                                const SizedBox(height: 4),
                                Text('${_toKB(it.uploadedBytes)} / ${_toKB(it.totalBytes)} kB', style: TextStyle(color: scheme.onSurfaceVariant)),
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    Expanded(
                                      child: LinearProgressIndicator(
                                        value: (it.progress.clamp(0, 100)) / 100.0,
                                        minHeight: 8,
                                        backgroundColor: scheme.surfaceContainerHighest,
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Text('${it.progress}%'),
                                  ],
                                ),
                                const SizedBox(height: 6),
                                Text('Status: $statusText', style: TextStyle(color: statusColor, fontWeight: FontWeight.w900)),
                                if (it.status == _UploadStatus.error && (it.error ?? '').isNotEmpty) ...[
                                  const SizedBox(height: 4),
                                  Text(it.error!, style: const TextStyle(color: Colors.red, fontSize: 12)),
                                ],
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    Expanded(
                                      child: FilledButton.tonal(
                                        onPressed: it.status == _UploadStatus.done ? () => _openUrl(_downloadUri(it.filename)) : null,
                                        child: const Text('Download'),
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Expanded(
                                      child: FilledButton.tonal(
                                        onPressed: it.status == _UploadStatus.done ? () => _deleteFromDatabase(it.filename) : null,
                                        child: const Text('Delete'),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            );
                          },
                        ),
                      ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            Expanded(
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('Files on Server', style: TextStyle(fontWeight: FontWeight.w900)),
                                const SizedBox(height: 2),
                                Text('Total: ${_serverFiles.length}', style: TextStyle(color: scheme.onSurfaceVariant)),
                              ],
                            ),
                          ),
                          IconButton(
                            onPressed: _loadingServerList ? null : _loadServerList,
                            icon: const Icon(Icons.refresh),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Expanded(
                        child: _loadingServerList
                            ? const Center(child: CircularProgressIndicator())
                            : (_serverFiles.isEmpty
                                ? Center(child: Text('No files', style: TextStyle(color: scheme.onSurfaceVariant)))
                                : ListView.separated(
                                    itemCount: _serverFiles.length,
                                    separatorBuilder: (_, __) => const Divider(height: 1),
                                    itemBuilder: (context, index) {
                                      final f = _serverFiles[index];
                                      final filename = _s(f['FILE_NAME']);
                                      final size = _i(f['FILE_SIZE']);
                                      final empl = _s(f['INS_EMPL']);
                                      final date = _fmtUtc(f['INS_DATE']);

                                      return ListTile(
                                        leading: CircleAvatar(
                                          backgroundColor: scheme.surfaceContainerHighest,
                                          backgroundImage: empl.isEmpty ? null : NetworkImage(AppConfig.employeeImageUrl(empl)),
                                          onBackgroundImageError: (_, __) {},
                                          child: empl.isEmpty ? const Icon(Icons.person_outline) : null,
                                        ),
                                        title: Text(filename, maxLines: 1, overflow: TextOverflow.ellipsis),
                                        subtitle: Text('$date  |  $empl  |  (${_toKB(size)} kB)', maxLines: 2, overflow: TextOverflow.ellipsis),
                                        trailing: PopupMenuButton<String>(
                                          onSelected: (v) {
                                            if (v == 'download') _openUrl(_downloadUri(filename));
                                            if (v == 'copy') _copyLink(filename);
                                            if (v == 'delete') _deleteFromDatabase(filename);
                                          },
                                          itemBuilder: (ctx) => [
                                            const PopupMenuItem(value: 'download', child: Text('Download')),
                                            const PopupMenuItem(value: 'copy', child: Text('Copy Link')),
                                            const PopupMenuItem(value: 'delete', child: Text('Delete')),
                                          ],
                                        ),
                                      );
                                    },
                                  )),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
