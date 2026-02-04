import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:pluto_grid/pluto_grid.dart';

import '../../../../../core/providers.dart';

class PqcDaoFilmHandoverTab extends ConsumerStatefulWidget {
  const PqcDaoFilmHandoverTab({super.key});

  @override
  ConsumerState<PqcDaoFilmHandoverTab> createState() => _PqcDaoFilmHandoverTabState();
}

class _PqcDaoFilmHandoverTabState extends ConsumerState<PqcDaoFilmHandoverTab> {
  bool _loading = false;
  bool _showFilter = true;

  DateTime _handoverDate = DateTime.now();

  List<Map<String, dynamic>> _customers = const [];
  Map<String, dynamic>? _selectedCustomer;

  List<Map<String, dynamic>> _codes = const [];
  Map<String, dynamic>? _selectedCode;

  String _plph = 'PH';
  String _pltl = 'D';
  String _pldao = 'PVC';
  String _plfilm = 'CTF';
  String _ldph = 'New Code';

  final TextEditingController _rndCtrl = TextEditingController();
  final TextEditingController _qcCtrl = TextEditingController();
  final TextEditingController _sxCtrl = TextEditingController();
  final TextEditingController _qtyCtrl = TextEditingController(text: '0');
  final TextEditingController _ohpQtyCtrl = TextEditingController(text: '0');
  final TextEditingController _maDaoFilmCtrl = TextEditingController();
  final TextEditingController _viTriTlCtrl = TextEditingController();
  final TextEditingController _widthCtrl = TextEditingController(text: '0');
  final TextEditingController _lengthCtrl = TextEditingController(text: '0');
  final TextEditingController _remarkCtrl = TextEditingController();

  List<PlutoColumn> _cols = const [];
  List<PlutoRow> _plutoRows = const [];

  String _s(dynamic v) => (v ?? '').toString();
  num _num(dynamic v) => (v is num) ? v : (num.tryParse(_s(v).replaceAll(',', '')) ?? 0);
  bool _isNg(Map<String, dynamic> body) => (body['tk_status'] ?? '').toString().toUpperCase() == 'NG';

  String _ymd(DateTime dt) => DateFormat('yyyy-MM-dd').format(dt);

  @override
  void initState() {
    super.initState();
    _initLoad();
  }

  @override
  void dispose() {
    _rndCtrl.dispose();
    _qcCtrl.dispose();
    _sxCtrl.dispose();
    _qtyCtrl.dispose();
    _ohpQtyCtrl.dispose();
    _maDaoFilmCtrl.dispose();
    _viTriTlCtrl.dispose();
    _widthCtrl.dispose();
    _lengthCtrl.dispose();
    _remarkCtrl.dispose();
    super.dispose();
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

  Future<List<Map<String, dynamic>>> _callList(String command, Map<String, dynamic>? data) async {
    final body = await _post(command, data);
    if (_isNg(body)) return const [];
    final raw = body['data'];
    final list = raw is List ? raw : const [];
    return list.map((e) => (e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{})).toList();
  }

  Future<void> _initLoad() async {
    setState(() {
      _loading = true;
      _showFilter = false;
    });
    try {
      await Future.wait([
        _loadCustomers(),
        _loadCodes(''),
        _loadTable(),
      ]);
    } catch (e) {
      _snack('Lỗi init: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _loadCustomers() async {
    final rows = await _callList('selectCustomerAndVendorList', {});
    if (!mounted) return;
    setState(() {
      _customers = rows;
      _selectedCustomer = rows.isNotEmpty ? rows.first : null;
    });
  }

  Future<void> _loadCodes(String gName) async {
    final rows = await _callList('selectcodeList', {'G_NAME': gName});
    if (!mounted) return;
    setState(() {
      _codes = rows;
      _selectedCode ??= rows.isNotEmpty ? rows.first : null;
    });
  }

  PlutoColumn _col(String f, {double w = 140, PlutoColumnType? type}) {
    return PlutoColumn(title: f, field: f, width: w, type: type ?? PlutoColumnType.text());
  }

  List<PlutoColumn> _buildCols(List<Map<String, dynamic>> rows) {
    if (rows.isEmpty) return const [];
    final keys = rows.first.keys.map((e) => e.toString()).toList();
    final prefer = const [
      'KNIFE_FILM_ID',
      'FACTORY_NAME',
      'NGAYBANGIAO',
      'G_CODE',
      'G_NAME',
      'PROD_TYPE',
      'CUST_NAME_KD',
      'LOAIBANGIAO_PDP',
      'LOAIPHATHANH',
      'SOLUONG',
      'SOLUONGOHP',
      'LYDOBANGIAO',
      'PQC_EMPL_NO',
      'RND_EMPL_NO',
      'SX_EMPL_NO',
      'REMARK',
      'CFM_GIAONHAN',
      'CFM_INS_EMPL',
      'CFM_DATE',
      'KNIFE_FILM_STATUS',
      'MA_DAO',
      'TOTAL_PRESS',
      'CUST_CD',
      'KNIFE_TYPE',
    ];
    final ordered = <String>[...prefer.where(keys.contains), ...keys.where((k) => !prefer.contains(k))];
    return [
      PlutoColumn(title: '', field: '__raw__', type: PlutoColumnType.text(), width: 0, hide: true),
      ...ordered.map((f) {
        final isNum = const <String>{'SOLUONG', 'SOLUONGOHP', 'TOTAL_PRESS'}.contains(f);
        return _col(f, type: isNum ? PlutoColumnType.number() : PlutoColumnType.text());
      }),
    ];
  }

  List<PlutoRow> _buildRows(List<Map<String, dynamic>> rows, List<PlutoColumn> cols) {
    return rows.map((r) {
      final cells = <String, PlutoCell>{'__raw__': PlutoCell(value: r)};
      for (final c in cols) {
        if (c.field == '__raw__') continue;
        cells[c.field] = PlutoCell(value: r[c.field]);
      }
      return PlutoRow(cells: cells);
    }).toList();
  }

  Future<void> _loadTable() async {
    setState(() {
      _loading = true;
      _showFilter = false;
    });
    try {
      final rows = await _callList('loadquanlygiaonhan', {});
      for (final r in rows) {
        final d = _s(r['NGAYBANGIAO']);
        if (d.isNotEmpty) {
          r['NGAYBANGIAO'] = d.length > 10 ? d.substring(0, 10) : d;
        }
        final cfm = _s(r['CFM_DATE']);
        if (cfm.isNotEmpty) {
          r['CFM_DATE'] = cfm.length > 10 ? cfm.substring(0, 10) : cfm;
        }
      }
      final cols = _buildCols(rows);
      final plutoRows = _buildRows(rows, cols);
      if (!mounted) return;
      setState(() {
        _cols = cols;
        _plutoRows = plutoRows;
      });
      _snack('Đã load: ${rows.length} dòng');
    } catch (e) {
      _snack('Lỗi load: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _pickHandoverDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _handoverDate,
      firstDate: DateTime(2020, 1, 1),
      lastDate: DateTime(2100, 12, 31),
    );
    if (picked == null) return;
    if (!mounted) return;
    setState(() => _handoverDate = picked);
  }

  String _validateAdd() {
    if (_rndCtrl.text.trim().length < 7 || _qcCtrl.text.trim().length < 7) {
      return 'NG: Mã nhân viên phải bằng 7 ký tự';
    }
    if (_num(_qtyCtrl.text) <= 0) {
      return 'NG: Tổng số lượng dao/film phải lớn hơn 0';
    }
    if (_selectedCustomer == null) return 'NG: Chưa chọn customer';
    if (_selectedCode == null) return 'NG: Chưa chọn code';
    return '';
  }

  Future<void> _add() async {
    final err = _validateAdd();
    if (err.isNotEmpty) {
      _snack(err);
      return;
    }
    setState(() {
      _loading = true;
      _showFilter = false;
    });
    try {
      final body = await _post('addbangiaodaofilmtailieu', {
        'FACTORY': 'NM1',
        'NGAYBANGIAO': _ymd(_handoverDate),
        'G_CODE': _selectedCode?['G_CODE'],
        'LOAIBANGIAO_PDP': _pltl,
        'LOAIPHATHANH': _plph,
        'SOLUONG': _num(_qtyCtrl.text),
        'SOLUONGOHP': _num(_ohpQtyCtrl.text),
        'LYDOBANGIAO': _ldph,
        'PQC_EMPL_NO': _qcCtrl.text.trim(),
        'RND_EMPL_NO': _rndCtrl.text.trim(),
        'SX_EMPL_NO': _sxCtrl.text.trim(),
        'REMARK': _remarkCtrl.text,
        'MA_DAO': _maDaoFilmCtrl.text,
        'CUST_CD': _selectedCustomer?['CUST_CD'],
        'G_WIDTH': _num(_widthCtrl.text),
        'G_LENGTH': _num(_lengthCtrl.text),
        'KNIFE_TYPE': _pldao,
      });
      if (_isNg(body)) {
        _snack('Thất bại: ${_s(body['message'])}');
        return;
      }
      _snack('Thêm thành công');
      await _loadTable();
    } catch (e) {
      _snack('Lỗi thêm: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _pickCustomer() async {
    final picked = await _pickFromList(
      title: 'Chọn Customer',
      items: _customers,
      display: (e) => '${_s(e['CUST_CD'])}: ${_s(e['CUST_NAME_KD'])}',
    );
    if (picked == null) return;
    setState(() => _selectedCustomer = picked);
  }

  Future<void> _pickCode() async {
    final picked = await _pickFromList(
      title: 'Chọn Code',
      items: _codes,
      display: (e) => '${_s(e['G_CODE'])}: ${_s(e['G_NAME'])}',
      onSearch: (q) async {
        await _loadCodes(q);
      },
    );
    if (picked == null) return;
    setState(() => _selectedCode = picked);
  }

  Future<Map<String, dynamic>?> _pickFromList({
    required String title,
    required List<Map<String, dynamic>> items,
    required String Function(Map<String, dynamic>) display,
    Future<void> Function(String q)? onSearch,
  }) async {
    final ctrl = TextEditingController();
    Map<String, dynamic>? selected;
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      builder: (context) {
        final media = MediaQuery.of(context);
        return Padding(
          padding: EdgeInsets.only(bottom: media.viewInsets.bottom),
          child: SizedBox(
            height: media.size.height * 0.75,
            child: StatefulBuilder(
              builder: (context, setModal) {
                final q = ctrl.text.trim().toUpperCase();
                final filtered = q.isEmpty
                    ? items
                    : items.where((e) => display(e).toUpperCase().contains(q)).toList();
                return Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(8),
                      child: Row(
                        children: [
                          Expanded(child: Text(title, style: const TextStyle(fontWeight: FontWeight.w900))),
                          IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(Icons.close)),
                        ],
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8),
                      child: TextField(
                        controller: ctrl,
                        decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'Search'),
                        onChanged: (v) async {
                          setModal(() {});
                          if (onSearch != null) {
                            await onSearch(v.trim());
                            setModal(() {});
                          }
                        },
                      ),
                    ),
                    const SizedBox(height: 8),
                    Expanded(
                      child: ListView.builder(
                        itemCount: filtered.length,
                        itemBuilder: (context, idx) {
                          final e = filtered[idx];
                          return ListTile(
                            title: Text(display(e), maxLines: 2, overflow: TextOverflow.ellipsis),
                            onTap: () {
                              selected = e;
                              Navigator.pop(context);
                            },
                          );
                        },
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
        );
      },
    );
    ctrl.dispose();
    return selected;
  }

  @override
  Widget build(BuildContext context) {
    Widget header() {
      return Card(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
          child: Row(
            children: [
              IconButton(
                tooltip: _showFilter ? 'Ẩn form' : 'Hiện form',
                onPressed: _loading ? null : () => setState(() => _showFilter = !_showFilter),
                icon: Icon(_showFilter ? Icons.filter_alt_off : Icons.filter_alt),
              ),
              const Expanded(child: Text('Giao Nhận Dao Film', style: TextStyle(fontWeight: FontWeight.w900))),
              FilledButton.tonal(onPressed: _loading ? null : _loadTable, child: const Text('Refresh')),
              const SizedBox(width: 8),
              FilledButton.tonal(onPressed: _loading ? null : _add, child: const Text('Thêm')),
            ],
          ),
        ),
      );
    }

    Widget form() {
      if (!_showFilter) return const SizedBox.shrink();
      final isDaoOrMatDao = _pltl == 'D' || _pltl == 'M';
      final isFilm = _pltl == 'F';
      final isTaiLieu = _pltl == 'T';
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Wrap(
                spacing: 10,
                runSpacing: 10,
                children: [
                  SizedBox(
                    width: 240,
                    child: OutlinedButton.icon(
                      onPressed: _loading ? null : _pickCustomer,
                      icon: const Icon(Icons.people),
                      label: Text(
                        _selectedCustomer == null ? 'Select customer' : '${_s(_selectedCustomer?['CUST_CD'])}: ${_s(_selectedCustomer?['CUST_NAME_KD'])}',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ),
                  SizedBox(
                    width: 320,
                    child: OutlinedButton.icon(
                      onPressed: _loading ? null : _pickCode,
                      icon: const Icon(Icons.qr_code_2),
                      label: Text(
                        _selectedCode == null ? 'Select code' : '${_s(_selectedCode?['G_CODE'])}: ${_s(_selectedCode?['G_NAME'])}',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ),
                  SizedBox(
                    width: 200,
                    child: OutlinedButton.icon(
                      onPressed: _loading ? null : _pickHandoverDate,
                      icon: const Icon(Icons.date_range),
                      label: Text('Ngày: ${_ymd(_handoverDate)}'),
                    ),
                  ),
                  SizedBox(
                    width: 170,
                    child: DropdownButtonFormField<String>(
                      initialValue: _plph,
                      isExpanded: true,
                      decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'PL phát hành'),
                      onChanged: _loading ? null : (v) => setState(() => _plph = v ?? 'PH'),
                      items: const [
                        DropdownMenuItem(value: 'PH', child: Text('PHÁT HÀNH')),
                        DropdownMenuItem(value: 'TH', child: Text('THU HỒI')),
                      ],
                    ),
                  ),
                  SizedBox(
                    width: 170,
                    child: DropdownButtonFormField<String>(
                      initialValue: _pltl,
                      isExpanded: true,
                      decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'PL tài liệu'),
                      onChanged: _loading
                          ? null
                          : (v) {
                              setState(() {
                                _pltl = v ?? 'D';
                              });
                            },
                      items: const [
                        DropdownMenuItem(value: 'F', child: Text('FILM')),
                        DropdownMenuItem(value: 'D', child: Text('DAO')),
                        DropdownMenuItem(value: 'T', child: Text('TÀI LIỆU')),
                        DropdownMenuItem(value: 'M', child: Text('MẮT DAO')),
                      ],
                    ),
                  ),
                  SizedBox(
                    width: 170,
                    child: DropdownButtonFormField<String>(
                      initialValue: _ldph,
                      isExpanded: true,
                      decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'PL bàn giao'),
                      onChanged: _loading ? null : (v) => setState(() => _ldph = v ?? 'New Code'),
                      items: const [
                        DropdownMenuItem(value: 'New Code', child: Text('New Code')),
                        DropdownMenuItem(value: 'ECN', child: Text('ECN')),
                        DropdownMenuItem(value: 'Update', child: Text('Update')),
                        DropdownMenuItem(value: 'Amendment', child: Text('Amendment')),
                      ],
                    ),
                  ),
                  SizedBox(
                    width: 150,
                    child: TextField(
                      controller: _rndCtrl,
                      enabled: !_loading,
                      decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'NV RND'),
                    ),
                  ),
                  SizedBox(
                    width: 150,
                    child: TextField(
                      controller: _qcCtrl,
                      enabled: !_loading,
                      decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'NV QC'),
                    ),
                  ),
                  SizedBox(
                    width: 150,
                    child: TextField(
                      controller: _sxCtrl,
                      enabled: !_loading,
                      decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'NV SX'),
                    ),
                  ),
                  SizedBox(
                    width: 170,
                    child: TextField(
                      controller: _qtyCtrl,
                      enabled: !_loading,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'SL Dao/film/TL'),
                    ),
                  ),
                  if (isFilm)
                    SizedBox(
                      width: 170,
                      child: TextField(
                        controller: _ohpQtyCtrl,
                        enabled: !_loading,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'OHP FILM QTY'),
                      ),
                    ),
                  if (isDaoOrMatDao)
                    SizedBox(
                      width: 170,
                      child: DropdownButtonFormField<String>(
                        initialValue: _pldao,
                        isExpanded: true,
                        decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'Phân loại dao'),
                        onChanged: _loading ? null : (v) => setState(() => _pldao = v ?? 'PVC'),
                        items: const [
                          DropdownMenuItem(value: 'PVC', child: Text('PVC')),
                          DropdownMenuItem(value: 'PINACLE', child: Text('PINACLE')),
                        ],
                      ),
                    ),
                  if (isFilm)
                    SizedBox(
                      width: 170,
                      child: DropdownButtonFormField<String>(
                        initialValue: _plfilm,
                        isExpanded: true,
                        decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'Phân loại film'),
                        onChanged: _loading ? null : (v) => setState(() => _plfilm = v ?? 'CTF'),
                        items: const [
                          DropdownMenuItem(value: 'CTF', child: Text('CTF')),
                          DropdownMenuItem(value: 'CTP', child: Text('CTP')),
                        ],
                      ),
                    ),
                  if (_pltl == 'D' || _pltl == 'F')
                    SizedBox(
                      width: 170,
                      child: TextField(
                        controller: _maDaoFilmCtrl,
                        enabled: !_loading,
                        decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'Mã Dao/Film'),
                      ),
                    ),
                  if (isTaiLieu)
                    SizedBox(
                      width: 220,
                      child: TextField(
                        controller: _viTriTlCtrl,
                        enabled: !_loading,
                        decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'Vị trí tài liệu'),
                      ),
                    ),
                  if (!isTaiLieu)
                    SizedBox(
                      width: 140,
                      child: TextField(
                        controller: _widthCtrl,
                        enabled: !_loading,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'Rộng'),
                      ),
                    ),
                  if (!isTaiLieu)
                    SizedBox(
                      width: 140,
                      child: TextField(
                        controller: _lengthCtrl,
                        enabled: !_loading,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'Dài'),
                      ),
                    ),
                  SizedBox(
                    width: 260,
                    child: TextField(
                      controller: _remarkCtrl,
                      enabled: !_loading,
                      decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'Remark'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      );
    }

    Widget grid() {
      return Card(
        margin: EdgeInsets.zero,
        child: _cols.isEmpty
            ? const Center(child: Text('Chưa có dữ liệu'))
            : PlutoGrid(
                columns: _cols,
                rows: _plutoRows,
                onLoaded: (e) => e.stateManager.setShowColumnFilter(true),
                configuration: PlutoGridConfiguration(
                  style: PlutoGridStyleConfig(
                    rowHeight: 34,
                    columnHeight: 34,
                    cellTextStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
                    columnTextStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900),
                    defaultCellPadding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                  ),
                ),
              ),
      );
    }

    return Padding(
      padding: const EdgeInsets.all(8),
      child: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(child: header()),
          if (_loading) const SliverToBoxAdapter(child: LinearProgressIndicator()),
          SliverToBoxAdapter(child: form()),
          SliverFillRemaining(hasScrollBody: true, child: grid()),
        ],
      ),
    );
  }
}
