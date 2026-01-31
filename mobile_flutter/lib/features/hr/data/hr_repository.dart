import '../../../core/network/api_client.dart';
import '../../../core/utils/date_utils.dart';

class HrRepository {
  HrRepository({required ApiClient apiClient}) : _apiClient = apiClient;

  final ApiClient _apiClient;

  Future<List<Map<String, dynamic>>> getEmployees() async {
    final res = await _apiClient.postCommand('getemployee_full');
    final body = res.data;
    if (body is! Map<String, dynamic>) return [];

    final status = (body['tk_status'] ?? '').toString().toUpperCase();
    if (status == 'NG') return [];

    final data = body['data'];
    if (data is! List) return [];

    return data.whereType<Map>().map((e) => e.cast<String, dynamic>()).toList();
  }

  static Map<String, dynamic> _postProcessBangChamCongRow(Map<String, dynamic> element) {
    final out = Map<String, dynamic>.from(element);

    final dateYmd = AppDateUtils.ymdFromValue(element['DATE_COLUMN']);
    out['DATE_COLUMN'] = dateYmd.isEmpty ? (element['DATE_COLUMN'] ?? '').toString() : dateYmd;
    out['WEEKDAY'] = _weekdayShortFromYmd(out['DATE_COLUMN']?.toString() ?? '');
    out['FULL_NAME'] = '${(element['MIDLAST_NAME'] ?? '').toString().trim()} ${(element['FIRST_NAME'] ?? '').toString().trim()}'.trim();

    final calvInt = int.tryParse((element['CALV'] ?? '').toString()) ?? 0;
    out['CALV'] = calvInt == 0
        ? 'Hành Chính'
        : calvInt == 1
            ? 'Ca Ngày'
            : calvInt == 2
                ? 'Ca Đêm'
                : 'Không có ca';

    out['APPLY_DATE'] = AppDateUtils.ymdFromValue(element['APPLY_DATE']);

    final check1hm = _fmtTimeHm(element['CHECK1']);
    final check2hm = _fmtTimeHm(element['CHECK2']);
    final check3hm = _fmtTimeHm(element['CHECK3']);
    final prev1hm = _fmtTimeHm(element['PREV_CHECK1']);
    final prev2hm = _fmtTimeHm(element['PREV_CHECK2']);
    final prev3hm = _fmtTimeHm(element['PREV_CHECK3']);
    final next1hm = _fmtTimeHm(element['NEXT_CHECK1']);
    final next2hm = _fmtTimeHm(element['NEXT_CHECK2']);
    final next3hm = _fmtTimeHm(element['NEXT_CHECK3']);

    out['CHECK1'] = _fmtTimeHms(element['CHECK1']);
    out['CHECK2'] = _fmtTimeHms(element['CHECK2']);
    out['CHECK3'] = _fmtTimeHms(element['CHECK3']);
    out['PREV_CHECK1'] = _fmtTimeHms(element['PREV_CHECK1']);
    out['PREV_CHECK2'] = _fmtTimeHms(element['PREV_CHECK2']);
    out['PREV_CHECK3'] = _fmtTimeHms(element['PREV_CHECK3']);
    out['NEXT_CHECK1'] = _fmtTimeHms(element['NEXT_CHECK1']);
    out['NEXT_CHECK2'] = _fmtTimeHms(element['NEXT_CHECK2']);
    out['NEXT_CHECK3'] = _fmtTimeHms(element['NEXT_CHECK3']);

    final inOut = _tinhInOutTime3(
      calv: calvInt,
      check1: check1hm,
      check2: check2hm,
      check3: check3hm,
      prevCheck1: prev1hm,
      prevCheck2: prev2hm,
      prevCheck3: prev3hm,
      nextCheck1: next1hm,
      nextCheck2: next2hm,
      nextCheck3: next3hm,
    );

    out['IN_TIME'] = inOut.$1;
    out['OUT_TIME'] = inOut.$2;

    out['FIXED_IN_TIME'] = (element['FIXED_IN_TIME'] ?? 'X').toString();
    out['FIXED_OUT_TIME'] = (element['FIXED_OUT_TIME'] ?? 'X').toString();

    final ratetb = _calcMinutesByRate(
      inTime: out['FIXED_IN_TIME'].toString(),
      outTime: out['FIXED_OUT_TIME'].toString(),
      date: dateYmd,
    );

    final reason = (element['REASON_NAME'] ?? '').toString();
    final l100 = reason == 'Phép năm'
        ? 480
        : reason == 'Nửa phép'
            ? 240 + (ratetb['100%'] ?? 0)
            : (ratetb['100%'] ?? 0);

    out['L100'] = l100;
    out['L130'] = ratetb['130%'] ?? 0;
    out['L150'] = ratetb['150%'] ?? 0;
    out['L200'] = ratetb['200%'] ?? 0;
    out['L210'] = ratetb['210%'] ?? 0;
    out['L270'] = ratetb['270%'] ?? 0;
    out['L300'] = ratetb['300%'] ?? 0;
    out['L390'] = ratetb['390%'] ?? 0;

    out['STATUS'] = (inOut.$1 == 'Thiếu giờ vào' || inOut.$2 == 'Thiếu giờ ra') ? 'Thiếu công' : 'Đủ công';

    return out;
  }

  static String _weekdayShortFromYmd(String ymd) {
    try {
      if (ymd.length < 10) return '';
      final dt = DateTime.parse(ymd.substring(0, 10));
      switch (dt.weekday) {
        case DateTime.monday:
          return 'T2';
        case DateTime.tuesday:
          return 'T3';
        case DateTime.wednesday:
          return 'T4';
        case DateTime.thursday:
          return 'T5';
        case DateTime.friday:
          return 'T6';
        case DateTime.saturday:
          return 'T7';
        case DateTime.sunday:
          return 'CN';
      }
    } catch (_) {
      return '';
    }
    return '';
  }

  static String _fmtTimeHm(Object? v) {
    final s = (v ?? '').toString().trim();
    if (s.isEmpty || s.toUpperCase() == 'NULL') return '';
    if (RegExp(r'^\d{2}:\d{2}$').hasMatch(s)) return s;
    if (RegExp(r'^\d{2}:\d{2}:\d{2}$').hasMatch(s)) return s.substring(0, 5);
    final dt = DateTime.tryParse(s);
    if (dt == null) return '';
    final u = dt.toUtc();
    return '${u.hour.toString().padLeft(2, '0')}:${u.minute.toString().padLeft(2, '0')}';
  }

  static String _fmtTimeHms(Object? v) {
    final s = (v ?? '').toString().trim();
    if (s.isEmpty || s.toUpperCase() == 'NULL') return '';
    if (RegExp(r'^\d{2}:\d{2}:\d{2}$').hasMatch(s)) return s;
    if (RegExp(r'^\d{2}:\d{2}$').hasMatch(s)) return '$s:00';
    final dt = DateTime.tryParse(s);
    if (dt == null) return '';
    final u = dt.toUtc();
    return '${u.hour.toString().padLeft(2, '0')}:${u.minute.toString().padLeft(2, '0')}:${u.second.toString().padLeft(2, '0')}';
  }

  static (String, String) _tinhInOutTime3({
    required int calv,
    required String check1,
    required String check2,
    required String check3,
    required String prevCheck1,
    required String prevCheck2,
    required String prevCheck3,
    required String nextCheck1,
    required String nextCheck2,
    required String nextCheck3,
  }) {
    final tgv = 'Thiếu giờ vào';
    final tgr = 'Thiếu giờ ra';

    int toVal(String hm) {
      if (!RegExp(r'^\d{2}:\d{2}$').hasMatch(hm)) return 0;
      final h = int.tryParse(hm.substring(0, 2)) ?? 0;
      final m = int.tryParse(hm.substring(3, 5)) ?? 0;
      return h * 60 + m;
    }

    String fromVal(int mins) {
      final h = (mins ~/ 60) % 24;
      final m = mins % 60;
      return '${h.toString().padLeft(2, '0')}:${m.toString().padLeft(2, '0')}';
    }

    int minOf(List<int> a) => a.isEmpty ? 0 : a.reduce((x, y) => x < y ? x : y);
    int maxOf(List<int> a) => a.isEmpty ? 0 : a.reduce((x, y) => x > y ? x : y);

    final check0 = [toVal(prevCheck1), toVal(prevCheck2), toVal(prevCheck3)].where((e) => e != 0).toList();
    final check1a = [toVal(check1), toVal(check2), toVal(check3)].where((e) => e != 0).toList();
    final check2a = [toVal(nextCheck1), toVal(nextCheck2), toVal(nextCheck3)].where((e) => e != 0).toList();

    final mincheck1 = minOf(check1a);
    final maxcheck1 = maxOf(check1a);
    final mincheck2 = minOf(check2a);

    if (calv == 1 || calv == 2) {
      final inStart1 = 5 * 60 + 30;
      final inEnd1 = 8 * 60;
      final outStart1 = 20 * 60;
      final outEnd1 = 22 * 60;
      final inStart2 = 17 * 60 + 30;
      final inEnd2 = 20 * 60;
      final outStart2 = 8 * 60;
      final outEnd2 = 10 * 60;

      final inStart = calv == 1 ? inStart1 : inStart2;
      final inEnd = calv == 1 ? inEnd1 : inEnd2;
      final outStart = calv == 1 ? outStart1 : outStart2;
      final outEnd = calv == 1 ? outEnd1 : outEnd2;

      List<int> range(List<int> source, int a, int b) {
        return source.where((e) => e >= a && e <= b).toList();
      }

      range(check0, inStart, inEnd);
      range(check0, outStart, outEnd);

      final minAllCheck1 = minOf(check1a);
      final maxAllCheck1 = maxOf(check1a);

      switch (calv) {
        case 1:
          final tempIn = check1a.isNotEmpty ? fromVal(mincheck1) : tgv;
          final tempOut = check1a.isNotEmpty ? fromVal(maxcheck1) : tgr;
          var checkThieu = 'NA';
          if (mincheck1 >= inStart1 && mincheck1 <= inEnd1) {
            checkThieu = tgr;
          }
          if (mincheck1 == maxcheck1) {
            return (checkThieu == tgr ? tempIn : tgv, checkThieu != tgr ? tempOut : tgr);
          }
          return (tempIn, tempOut);
        case 2:
          final tempIn2 = check1a.isNotEmpty ? fromVal(maxcheck1) : tgv;
          final tempOut2 = check2a.isNotEmpty ? fromVal(mincheck2) : tgr;
          return (tempIn2, tempOut2);
        default:
          final tempIn3 = check1a.isNotEmpty ? fromVal(minAllCheck1) : tgv;
          final tempOut3 = check1a.isNotEmpty ? fromVal(maxAllCheck1) : tgr;
          return (tempIn3 == tempOut3 ? tempIn3 : tgv, tempIn3 == tempOut3 ? tgr : tempOut3);
      }
    }

    if (calv == 0) {
      return (check1a.isNotEmpty ? fromVal(mincheck1) : tgv, check1a.isNotEmpty ? fromVal(maxcheck1) : tgr);
    }

    return ('', '');
  }

  static const List<String> _vnHolidays = [
    '2025-01-01',
    '2025-01-28',
    '2025-01-29',
    '2025-01-30',
    '2025-01-31',
    '2025-04-30',
    '2025-05-01',
    '2025-09-01',
    '2025-09-02',
  ];

  static int _toMinutes(String hm) {
    final parts = hm.split(':');
    if (parts.length < 2) return 0;
    final h = int.tryParse(parts[0]) ?? 0;
    final m = int.tryParse(parts[1]) ?? 0;
    return h * 60 + m;
  }

  static (int, int) _intervalToMinutes(String start, String end) {
    var s = _toMinutes(start);
    var e = _toMinutes(end);
    if (e <= s) e += 24 * 60;
    return (s, e);
  }

  static int _overlapMinutes(int a1, int a2, int b1, int b2) {
    final start = a1 > b1 ? a1 : b1;
    final end = a2 < b2 ? a2 : b2;
    final v = end - start;
    return v > 0 ? v : 0;
  }

  static int _roundOvertime(int mins) {
    if (mins < 30) return 0;
    return (mins ~/ 15) * 15;
  }

  static List<({String start, String end, int rate})> _buildRules(int workType) {
    switch (workType) {
      case 1:
        return [
          (start: '08:00', end: '17:00', rate: 100),
          (start: '17:00', end: '22:00', rate: 150),
          (start: '22:00', end: '24:00', rate: 210),
        ];
      case 2:
        return [
          (start: '08:00', end: '22:00', rate: 200),
          (start: '22:00', end: '24:00', rate: 270),
        ];
      case 3:
        return [
          (start: '20:00', end: '22:00', rate: 100),
          (start: '22:00', end: '05:00', rate: 130),
          (start: '05:00', end: '08:00', rate: 210),
        ];
      case 4:
        return [
          (start: '20:00', end: '22:00', rate: 100),
          (start: '22:00', end: '24:00', rate: 130),
          (start: '00:00', end: '05:00', rate: 200),
          (start: '05:00', end: '08:00', rate: 270),
        ];
      case 5:
        return [
          (start: '20:00', end: '22:00', rate: 100),
          (start: '22:00', end: '12:00', rate: 270),
        ];
      case 6:
        return [
          (start: '08:00', end: '22:00', rate: 300),
          (start: '22:00', end: '24:00', rate: 390),
        ];
      case 7:
        return [
          (start: '20:00', end: '22:00', rate: 100),
          (start: '22:00', end: '24:00', rate: 130),
          (start: '00:00', end: '12:00', rate: 390),
        ];
      case 8:
        return [
          (start: '20:00', end: '22:00', rate: 200),
          (start: '22:00', end: '24:00', rate: 270),
          (start: '00:00', end: '12:00', rate: 390),
        ];
      case 9:
        return [
          (start: '20:00', end: '22:00', rate: 300),
          (start: '22:00', end: '12:00', rate: 390),
        ];
      default:
        return [];
    }
  }

  static int _classifyShift({
    required String inTimeStr,
    required String outTimeStr,
    required String dateStr,
  }) {
    final base = DateTime.tryParse('${dateStr.substring(0, 10)}T00:00:00');
    if (base == null) return 1;

    int? parseH(String s, int i) => int.tryParse(s.split(':')[i]);
    if (!RegExp(r'^\d{2}:\d{2}$').hasMatch(inTimeStr) || !RegExp(r'^\d{2}:\d{2}$').hasMatch(outTimeStr)) return 1;

    final inH = parseH(inTimeStr, 0);
    final inM = parseH(inTimeStr, 1);
    final outH = parseH(outTimeStr, 0);
    final outM = parseH(outTimeStr, 1);
    if (inH == null || inM == null || outH == null || outM == null) return 1;

    final inTime = DateTime(base.year, base.month, base.day, inH, inM);
    var outTime = DateTime(base.year, base.month, base.day, outH, outM);
    if (!outTime.isAfter(inTime)) {
      outTime = outTime.add(const Duration(days: 1));
    }

    final holidaysSet = _vnHolidays.map((d) => DateTime.parse(d).toLocal().toIso8601String().substring(0, 10)).toSet();
    bool isHoliday(DateTime d) => holidaysSet.contains(d.toIso8601String().substring(0, 10));
    bool isSunday(DateTime d) => d.weekday == DateTime.sunday;

    final inIsHoliday = isHoliday(inTime);
    final outIsHoliday = isHoliday(outTime);
    final inIsSunday = isSunday(inTime);
    final outIsSunday = isSunday(outTime);

    if (inTimeStr.compareTo(outTimeStr) < 0) {
      if (inIsHoliday) return 6;
      if (inIsSunday) return 2;
      return 1;
    }

    if (inIsHoliday) return 9;
    if (!inIsHoliday && outIsHoliday && inIsSunday) return 8;
    if (!inIsHoliday && outIsHoliday && !inIsSunday) return 7;
    if (!inIsHoliday && inIsSunday && !outIsHoliday) return 5;
    if (!inIsHoliday && inTime.weekday == DateTime.saturday && outIsSunday) return 4;
    return 3;
  }

  static Map<String, int> _calcMinutesByRate({
    required String inTime,
    required String outTime,
    required String date,
  }) {
    final result = <String, int>{
      '100%': 0,
      '130%': 0,
      '150%': 0,
      '200%': 0,
      '210%': 0,
      '270%': 0,
      '300%': 0,
      '390%': 0,
    };

    final dateYmd = date.length >= 10 ? date.substring(0, 10) : '';
    final isHoliday = _vnHolidays.contains(dateYmd);

    bool invalidInOut() {
      if (inTime.isEmpty || outTime.isEmpty) return true;
      if (inTime == outTime) return true;
      if (inTime == 'X' || outTime == 'X') return true;
      if (!RegExp(r'^\d{2}:\d{2}$').hasMatch(inTime) || !RegExp(r'^\d{2}:\d{2}$').hasMatch(outTime)) return true;
      return false;
    }

    if (invalidInOut() && isHoliday) {
      return {...result, '100%': 480};
    }
    if (invalidInOut() && !isHoliday) return result;

    final (start, end) = _intervalToMinutes(inTime, outTime);
    final workType = _classifyShift(inTimeStr: inTime, outTimeStr: outTime, dateStr: dateYmd);
    final rules = _buildRules(workType);
    final excludes = <(int, int)>[
      (_toMinutes('12:00'), _toMinutes('13:00')),
      (_toMinutes('00:00'), _toMinutes('01:00')),
    ];

    final expanded = <({int s, int e, int rate})>[];
    for (final r in rules) {
      final (rs, re) = _intervalToMinutes(r.start, r.end);
      expanded.add((s: rs, e: re, rate: r.rate));
      expanded.add((s: rs + 1440, e: re + 1440, rate: r.rate));
    }

    for (final r in expanded) {
      final os = start > r.s ? start : r.s;
      final oe = end < r.e ? end : r.e;
      if (oe > os) {
        var mins = oe - os;
        for (final ex in excludes) {
          mins -= _overlapMinutes(os, oe, ex.$1, ex.$2);
          mins -= _overlapMinutes(os, oe, ex.$1 + 1440, ex.$2 + 1440);
        }
        if (mins > 0) {
          final key = '${r.rate}%';
          if (r.rate > 100) {
            result[key] = (result[key] ?? 0) + _roundOvertime(mins);
          } else {
            result[key] = (result[key] ?? 0) + mins;
          }
        }
      }
    }

    return result;
  }

  Future<String?> insertEmployee(Map<String, dynamic> payload) async {
    final res = await _apiClient.postCommand('insertemployee', data: payload);
    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return (body['message'] ?? 'NG').toString();
      return null;
    }
    return 'Invalid response';
  }

  Future<String?> updateEmployee(Map<String, dynamic> payload) async {
    final res = await _apiClient.postCommand('updateemployee', data: payload);
    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return (body['message'] ?? 'NG').toString();
      return null;
    }
    return 'Invalid response';
  }

  Future<List<Map<String, dynamic>>> getMainDepts() async {
    final res = await _apiClient.postCommand('getmaindept');
    final body = res.data;
    if (body is! Map<String, dynamic>) return [];

    final status = (body['tk_status'] ?? '').toString().toUpperCase();
    if (status == 'NG') return [];

    final data = body['data'];
    if (data is! List) return [];
    return data.whereType<Map>().map((e) => _postProcessBangChamCongRow(e.cast<String, dynamic>())).toList();
  }

  Future<List<Map<String, dynamic>>> getSubDepts({int? mainDeptCode}) async {
    final res = await _apiClient.postCommand(
      'getsubdeptall',
      data: mainDeptCode == null ? {} : {'MAINDEPTCODE': mainDeptCode},
    );
    final body = res.data;
    if (body is! Map<String, dynamic>) return [];

    final status = (body['tk_status'] ?? '').toString().toUpperCase();
    if (status == 'NG') return [];

    final data = body['data'];
    if (data is! List) return [];
    return data.whereType<Map>().map((e) => _postProcessBangChamCongRow(e.cast<String, dynamic>())).toList();
  }

  Future<List<Map<String, dynamic>>> getWorkPositions({int? subDeptCode}) async {
    final res = await _apiClient.postCommand(
      'workpositionlist',
      data: subDeptCode == null ? {} : {'SUBDEPTCODE': subDeptCode},
    );
    final body = res.data;
    if (body is! Map<String, dynamic>) return [];

    final status = (body['tk_status'] ?? '').toString().toUpperCase();
    if (status == 'NG') return [];

    final data = body['data'];
    if (data is! List) return [];

    final out = <Map<String, dynamic>>[];
    for (final m in data.whereType<Map>()) {
      final e = m.cast<String, dynamic>();
      final dateYmd = AppDateUtils.ymdFromValue(e['DATE_COLUMN']);
      out.add({
        ...e,
        if (dateYmd.isNotEmpty) 'DATE_COLUMN': dateYmd,
        'APPLY_DATE': AppDateUtils.ymdFromValue(e['APPLY_DATE']),
        'WEEKDAY': _weekdayEnFromYmd(dateYmd),
      });
    }
    return out;
  }

  Future<List<Map<String, dynamic>>> getMainDeptList({required String fromDate}) async {
    final res = await _apiClient.postCommand(
      'getmaindeptlist',
      data: {
        'from_date': fromDate,
      },
    );
    final body = res.data;
    if (body is! Map<String, dynamic>) return [];

    final status = (body['tk_status'] ?? '').toString().toUpperCase();
    if (status == 'NG') return [];

    final data = body['data'];
    if (data is! List) return [];
    return data.whereType<Map>().map((e) => e.cast<String, dynamic>()).toList();
  }

  Future<List<Map<String, dynamic>>> diemDanhSummaryNhom({required String toDate}) async {
    final res = await _apiClient.postCommand(
      'diemdanhsummarynhom',
      data: {
        'todate': toDate,
      },
    );
    final body = res.data;
    if (body is! Map<String, dynamic>) return [];

    final status = (body['tk_status'] ?? '').toString().toUpperCase();
    if (status == 'NG') return [];

    final data = body['data'];
    if (data is! List) return [];
    return data.whereType<Map>().map((e) => e.cast<String, dynamic>()).toList();
  }

  Future<List<Map<String, dynamic>>> diemDanhHistoryNhom({
    required String startDate,
    required String endDate,
    required int mainDeptCode,
    required int workShiftCode,
    required int factoryCode,
  }) async {
    final res = await _apiClient.postCommand(
      'diemdanhhistorynhom',
      data: {
        'start_date': startDate,
        'end_date': endDate,
        'MAINDEPTCODE': mainDeptCode,
        'WORK_SHIFT_CODE': workShiftCode,
        'FACTORY_CODE': factoryCode,
      },
    );
    final body = res.data;
    if (body is! Map<String, dynamic>) return [];

    final status = (body['tk_status'] ?? '').toString().toUpperCase();
    if (status == 'NG') return [];

    final data = body['data'];
    if (data is! List) return [];

    final out = <Map<String, dynamic>>[];
    for (final m in data.whereType<Map>()) {
      final e = m.cast<String, dynamic>();
      out.add({
        ...e,
        'APPLY_DATE': AppDateUtils.ymdFromValue(e['APPLY_DATE']),
      });
    }
    return out;
  }

  Future<List<Map<String, dynamic>>> getDdMainDeptTb({required String fromDate, required String toDate}) async {
    final res = await _apiClient.postCommand(
      'getddmaindepttb',
      data: {
        'FROM_DATE': fromDate,
        'TO_DATE': toDate,
      },
    );
    final body = res.data;
    if (body is! Map<String, dynamic>) return [];

    final status = (body['tk_status'] ?? '').toString().toUpperCase();
    if (status == 'NG') return [];

    final data = body['data'];
    if (data is! List) return [];
    return data.whereType<Map>().map((e) => e.cast<String, dynamic>()).toList();
  }

  Future<List<Map<String, dynamic>>> loadDiemDanhFullSummaryTable({required String fromDate, required String toDate}) async {
    final res = await _apiClient.postCommand(
      'loadDiemDanhFullSummaryTable',
      data: {
        'FROM_DATE': fromDate,
        'TO_DATE': toDate,
      },
    );
    final body = res.data;
    if (body is! Map<String, dynamic>) return [];

    final status = (body['tk_status'] ?? '').toString().toUpperCase();
    if (status == 'NG') return [];

    final data = body['data'];
    if (data is! List) return [];
    return data.whereType<Map>().map((e) => e.cast<String, dynamic>()).toList();
  }

  static String _weekdayEnFromYmd(String ymd) {
    try {
      if (ymd.length < 10) return '';
      final dt = DateTime.parse(ymd.substring(0, 10));
      switch (dt.weekday) {
        case DateTime.monday:
          return 'Monday';
        case DateTime.tuesday:
          return 'Tuesday';
        case DateTime.wednesday:
          return 'Wednesday';
        case DateTime.thursday:
          return 'Thursday';
        case DateTime.friday:
          return 'Friday';
        case DateTime.saturday:
          return 'Saturday';
        case DateTime.sunday:
          return 'Sunday';
      }
    } catch (_) {
      return '';
    }
    return '';
  }

  Future<String?> insertMainDept(Map<String, dynamic> payload) async {
    final res = await _apiClient.postCommand('insertmaindept', data: payload);
    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return (body['message'] ?? 'NG').toString();
      return null;
    }
    return 'Invalid response';
  }

  Future<String?> updateMainDept(Map<String, dynamic> payload) async {
    final res = await _apiClient.postCommand('updatemaindept', data: payload);
    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return (body['message'] ?? 'NG').toString();
      return null;
    }
    return 'Invalid response';
  }

  Future<String?> deleteMainDept(Map<String, dynamic> payload) async {
    final res = await _apiClient.postCommand('deletemaindept', data: payload);
    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return (body['message'] ?? 'NG').toString();
      return null;
    }
    return 'Invalid response';
  }

  Future<String?> insertSubDept(Map<String, dynamic> payload) async {
    final res = await _apiClient.postCommand('insertsubdept', data: payload);
    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return (body['message'] ?? 'NG').toString();
      return null;
    }
    return 'Invalid response';
  }

  Future<String?> updateSubDept(Map<String, dynamic> payload) async {
    final res = await _apiClient.postCommand('updatesubdept', data: payload);
    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return (body['message'] ?? 'NG').toString();
      return null;
    }
    return 'Invalid response';
  }

  Future<String?> deleteSubDept(Map<String, dynamic> payload) async {
    final res = await _apiClient.postCommand('deletesubdept', data: payload);
    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return (body['message'] ?? 'NG').toString();
      return null;
    }
    return 'Invalid response';
  }

  Future<String?> insertWorkPosition(Map<String, dynamic> payload) async {
    final res = await _apiClient.postCommand('insertworkposition', data: payload);
    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return (body['message'] ?? 'NG').toString();
      return null;
    }
    return 'Invalid response';
  }

  Future<String?> updateWorkPosition(Map<String, dynamic> payload) async {
    final res = await _apiClient.postCommand('updateworkposition', data: payload);
    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return (body['message'] ?? 'NG').toString();
      return null;
    }
    return 'Invalid response';
  }

  Future<String?> deleteWorkPosition(Map<String, dynamic> payload) async {
    final res = await _apiClient.postCommand('deleteworkposition', data: payload);
    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return (body['message'] ?? 'NG').toString();
      return null;
    }
    return 'Invalid response';
  }

  Future<List<Map<String, dynamic>>> getDieuChuyenTeam({required String option, required int teamNameList}) async {
    final res = await _apiClient.postCommand(option, data: {'team_name_list': teamNameList});
    final body = res.data;
    if (body is! Map<String, dynamic>) return [];

    final status = (body['tk_status'] ?? '').toString().toUpperCase();
    if (status == 'NG') return [];

    final data = body['data'];
    if (data is! List) return [];
    return data.whereType<Map>().map((e) => e.cast<String, dynamic>()).toList();
  }

  Future<List<Map<String, dynamic>>> getWorkPositionsByCommand(String command) async {
    final res = await _apiClient.postCommand(command);
    final body = res.data;
    if (body is! Map<String, dynamic>) return [];

    final status = (body['tk_status'] ?? '').toString().toUpperCase();
    if (status == 'NG') return [];

    final data = body['data'];
    if (data is! List) return [];
    return data.whereType<Map>().map((e) => e.cast<String, dynamic>()).toList();
  }

  Future<String?> setTeamNhom({required String emplNo, required int teamValue}) async {
    final res = await _apiClient.postCommand('setteamnhom', data: {'teamvalue': teamValue, 'EMPL_NO': emplNo});
    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return (body['message'] ?? 'NG').toString();
      return null;
    }
    return 'Invalid response';
  }

  Future<String?> setCa({required String emplNo, required int caLv}) async {
    final res = await _apiClient.postCommand('setca', data: {'EMPL_NO': emplNo, 'CALV': caLv});
    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return (body['message'] ?? 'NG').toString();
      return null;
    }
    return 'Invalid response';
  }

  Future<String?> setNhaMay({required String emplNo, required int factory}) async {
    final res = await _apiClient.postCommand('setnhamay', data: {'EMPL_NO': emplNo, 'FACTORY': factory});
    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return (body['message'] ?? 'NG').toString();
      return null;
    }
    return 'Invalid response';
  }

  Future<String?> setEmplWorkPosition({required String emplNo, required int workPositionCode}) async {
    final res = await _apiClient.postCommand(
      'setEMPL_WORK_POSITION',
      data: {'WORK_POSITION_CODE': workPositionCode, 'EMPL_NO': emplNo},
    );
    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return (body['message'] ?? 'NG').toString();
      return null;
    }
    return 'Invalid response';
  }

  Future<List<Map<String, dynamic>>> getDiemDanhNhom({required String option, required int teamNameList}) async {
    final res = await _apiClient.postCommand(option, data: {'team_name_list': teamNameList});
    final body = res.data;
    if (body is! Map<String, dynamic>) return [];

    final status = (body['tk_status'] ?? '').toString().toUpperCase();
    if (status == 'NG') return [];

    final data = body['data'];
    if (data is! List) return [];
    return data.whereType<Map>().map((e) => e.cast<String, dynamic>()).toList();
  }

  Future<String?> setDiemDanhNhom({
    required int diemdanhValue,
    required String emplNo,
    required int currentTeam,
    required int currentCa,
  }) async {
    final res = await _apiClient.postCommand(
      'setdiemdanhnhom',
      data: {
        'diemdanhvalue': diemdanhValue,
        'EMPL_NO': emplNo,
        'CURRENT_TEAM': currentTeam,
        'CURRENT_CA': currentCa,
      },
    );

    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return (body['message'] ?? 'NG').toString();
      return null;
    }
    return 'Invalid response';
  }

  Future<String?> dangKyNghiAuto({
    required String emplNo,
    required int reasonCode,
    required String remarkContent,
  }) async {
    final today = DateTime.now();
    final y = today.year.toString().padLeft(4, '0');
    final m = today.month.toString().padLeft(2, '0');
    final d = today.day.toString().padLeft(2, '0');
    final dateStr = '$y-$m-$d';

    final res = await _apiClient.postCommand(
      'dangkynghi2_AUTO',
      data: {
        'canghi': 1,
        'reason_code': reasonCode,
        'remark_content': remarkContent,
        'ngaybatdau': dateStr,
        'ngayketthuc': dateStr,
        'EMPL_NO': emplNo,
      },
    );

    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return (body['message'] ?? 'NG').toString();
      return null;
    }
    return 'Invalid response';
  }

  Future<String?> xoaDangKyNghiAuto({required String emplNo}) async {
    final res = await _apiClient.postCommand('xoadangkynghi_AUTO', data: {'EMPL_NO': emplNo});
    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return (body['message'] ?? 'NG').toString();
      return null;
    }
    return 'Invalid response';
  }

  Future<String?> dangKyTangCaNhom({
    required String emplNo,
    required int tangCaValue,
    required String overtimeInfo,
  }) async {
    final res = await _apiClient.postCommand(
      'dangkytangcanhom',
      data: {
        'tangcavalue': tangCaValue,
        'EMPL_NO': emplNo,
        'overtime_info': overtimeInfo,
      },
    );
    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return (body['message'] ?? 'NG').toString();
      return null;
    }
    return 'Invalid response';
  }

  Future<String?> updateWorkHour({
    required String emplNo,
    required DateTime applyDate,
    required double workHour,
  }) async {
    final y = applyDate.year.toString().padLeft(4, '0');
    final m = applyDate.month.toString().padLeft(2, '0');
    final d = applyDate.day.toString().padLeft(2, '0');
    final dateStr = '$y-$m-$d';

    final res = await _apiClient.postCommand(
      'updateworkhour',
      data: {
        'EMPL_NO': emplNo,
        'APPLY_DATE': dateStr,
        'WORK_HOUR': workHour,
      },
    );
    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return (body['message'] ?? 'NG').toString();
      return null;
    }
    return 'Invalid response';
  }

  Future<String?> dangKyNghi({
    required int caNghi,
    required int reasonCode,
    required String remarkContent,
    required String ngayBatDau,
    required String ngayKetThuc,
  }) async {
    final res = await _apiClient.postCommand(
      'dangkynghi2',
      data: {
        'canghi': caNghi,
        'reason_code': reasonCode,
        'remark_content': remarkContent,
        'ngaybatdau': ngayBatDau,
        'ngayketthuc': ngayKetThuc,
      },
    );
    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return (body['message'] ?? 'NG').toString();
      return null;
    }
    return 'Invalid response';
  }

  Future<String?> dangKyTangCaCaNhan({
    required String overStart,
    required String overFinish,
  }) async {
    final res = await _apiClient.postCommand(
      'dangkytangcacanhan',
      data: {
        'over_start': overStart,
        'over_finish': overFinish,
      },
    );
    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return (body['message'] ?? 'NG').toString();
      return null;
    }
    return 'Invalid response';
  }

  Future<String?> xacNhanChamCongNhom({
    required String confirmWorktime,
    required String confirmDate,
  }) async {
    final res = await _apiClient.postCommand(
      'xacnhanchamcongnhom',
      data: {
        'confirm_worktime': confirmWorktime,
        'confirm_date': confirmDate,
      },
    );
    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return (body['message'] ?? 'NG').toString();
      return null;
    }
    return 'Invalid response';
  }

  Future<List<Map<String, dynamic>>> getPheDuyetNghi({
    required String option,
    required String fromDate,
    required String toDate,
    required bool onlyPending,
  }) async {
    final res = await _apiClient.postCommand(
      option,
      data: {
        'FROM_DATE': fromDate,
        'TO_DATE': toDate,
        'ONLY_PENDING': onlyPending,
      },
    );
    final body = res.data;
    if (body is! Map<String, dynamic>) return [];

    final status = (body['tk_status'] ?? '').toString().toUpperCase();
    if (status == 'NG') return [];

    final data = body['data'];
    if (data is! List) return [];
    return data.whereType<Map>().map((e) => e.cast<String, dynamic>()).toList();
  }

  Future<List<Map<String, dynamic>>> getLichSuDiLam({required String fromDate, required String toDate}) async {
    final res = await _apiClient.postCommand(
      'mydiemdanhnhom',
      data: {
        'from_date': fromDate,
        'to_date': toDate,
      },
    );
    final body = res.data;
    if (body is! Map<String, dynamic>) return [];

    final status = (body['tk_status'] ?? '').toString().toUpperCase();
    if (status == 'NG') return [];

    final data = body['data'];
    if (data is! List) return [];
    return data.whereType<Map>().map((e) => e.cast<String, dynamic>()).toList();
  }

  Future<List<Map<String, dynamic>>> loadBangChamCong({
    required String fromDate,
    required String toDate,
    required bool trungHiViec,
    required bool trungHiSinh,
  }) async {
    final res = await _apiClient.postCommand(
      'loadC0012',
      data: {
        'FROM_DATE': fromDate,
        'TO_DATE': toDate,
        'TRUNGHIVIEC': trungHiViec,
        'TRUNGHISINH': trungHiSinh,
      },
    );
    final body = res.data;
    if (body is! Map<String, dynamic>) return [];

    final status = (body['tk_status'] ?? '').toString().toUpperCase();
    if (status == 'NG') return [];

    final data = body['data'];
    if (data is! List) return [];
    return data.whereType<Map>().map((e) => e.cast<String, dynamic>()).toList();
  }

  Future<List<Map<String, dynamic>>> loadCaInfo() async {
    final res = await _apiClient.postCommand('loadCaInfo');
    final body = res.data;
    if (body is! Map<String, dynamic>) return [];

    final status = (body['tk_status'] ?? '').toString().toUpperCase();
    if (status == 'NG') return [];

    final data = body['data'];
    if (data is! List) return [];
    return data.whereType<Map>().map((e) => e.cast<String, dynamic>()).toList();
  }

  Future<String?> setDiemDanhNhom2({
    required String applyDate,
    required int diemDanhValue,
    required String emplNo,
    required int currentTeam,
    required int currentCa,
  }) async {
    final res = await _apiClient.postCommand(
      'setdiemdanhnhom2',
      data: {
        'APPLY_DATE': applyDate,
        'diemdanhvalue': diemDanhValue,
        'EMPL_NO': emplNo,
        'CURRENT_TEAM': currentTeam,
        'CURRENT_CA': currentCa,
      },
    );
    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return (body['message'] ?? 'NG').toString();
      return null;
    }
    return 'Invalid response';
  }

  Future<String?> fixTime({
    required String applyDate,
    required String emplNo,
    required String inTime,
    required String outTime,
    Object? workHour,
  }) async {
    final res = await _apiClient.postCommand(
      'fixTime',
      data: {
        'APPLY_DATE': applyDate,
        'EMPL_NO': emplNo,
        'IN_TIME': inTime,
        'OUT_TIME': outTime,
        if (workHour != null) 'WORK_HOUR': workHour,
      },
    );
    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return (body['message'] ?? 'NG').toString();
      return null;
    }
    return 'Invalid response';
  }

  Future<String?> fixTimeHangLoat({
    required List<Map<String, dynamic>> timeData,
  }) async {
    final res = await _apiClient.postCommand(
      'fixTimehangloat',
      data: {
        'TIME_DATA': timeData,
      },
    );
    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return (body['message'] ?? 'NG').toString();
      return null;
    }
    return 'Invalid response';
  }

  Future<String?> setCaDiemDanh({
    required String emplNo,
    required String applyDate,
    required int caLv,
  }) async {
    final res = await _apiClient.postCommand(
      'setcadiemdanh',
      data: {
        'EMPL_NO': emplNo,
        'APPLY_DATE': applyDate,
        'CALV': caLv,
      },
    );
    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return (body['message'] ?? 'NG').toString();
      return null;
    }
    return 'Invalid response';
  }

  Future<List<Map<String, dynamic>>> getBaoCaoNhanSuDiemDanhFull({required String fromDate, required String toDate}) async {
    final res = await _apiClient.postCommand(
      'diemdanhfull',
      data: {
        'from_date': fromDate,
        'to_date': toDate,
      },
    );
    final body = res.data;
    if (body is! Map<String, dynamic>) return [];

    final status = (body['tk_status'] ?? '').toString().toUpperCase();
    if (status == 'NG') return [];

    final data = body['data'];
    if (data is! List) return [];
    return data.whereType<Map>().map((e) => e.cast<String, dynamic>()).toList();
  }

  Future<String?> setPheDuyetNhom({required int offId, required int pheDuyetValue}) async {
    final res = await _apiClient.postCommand(
      'setpheduyetnhom',
      data: {
        'off_id': offId,
        'pheduyetvalue': pheDuyetValue,
      },
    );
    final body = res.data;
    if (body is Map<String, dynamic>) {
      final status = (body['tk_status'] ?? '').toString().toUpperCase();
      if (status == 'NG') return (body['message'] ?? 'NG').toString();
      return null;
    }
    return 'Invalid response';
  }
}
