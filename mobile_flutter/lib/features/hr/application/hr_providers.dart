import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/providers.dart';
import '../data/hr_repository.dart';

final hrRepositoryProvider = Provider<HrRepository>((ref) {
  return HrRepository(apiClient: ref.read(apiClientProvider));
});

final employeesProvider = FutureProvider.autoDispose<List<Map<String, dynamic>>>((ref) async {
  return ref.read(hrRepositoryProvider).getEmployees();
});

final mainDeptsProvider = FutureProvider.autoDispose<List<Map<String, dynamic>>>((ref) async {
  return ref.read(hrRepositoryProvider).getMainDepts();
});

final subDeptsProvider = FutureProvider.autoDispose.family<List<Map<String, dynamic>>, int?>((ref, mainDeptCode) async {
  return ref.read(hrRepositoryProvider).getSubDepts(mainDeptCode: mainDeptCode);
});

final workPositionsProvider = FutureProvider.autoDispose.family<List<Map<String, dynamic>>, int?>((ref, subDeptCode) async {
  return ref.read(hrRepositoryProvider).getWorkPositions(subDeptCode: subDeptCode);
});

final workPositionsByCommandProvider = FutureProvider.autoDispose.family<List<Map<String, dynamic>>, String>((ref, command) async {
  return ref.read(hrRepositoryProvider).getWorkPositionsByCommand(command);
});

final caInfoProvider = FutureProvider.autoDispose<List<Map<String, dynamic>>>((ref) async {
  return ref.read(hrRepositoryProvider).loadCaInfo();
});

final dieuChuyenTeamProvider = FutureProvider.autoDispose.family<List<Map<String, dynamic>>, (String, int)>(
  (ref, key) async {
    final (option, teamNameList) = key;
    return ref.read(hrRepositoryProvider).getDieuChuyenTeam(option: option, teamNameList: teamNameList);
  },
);

final pheDuyetNghiProvider = FutureProvider.autoDispose.family<
    List<Map<String, dynamic>>,
    (String option, String fromDate, String toDate, bool onlyPending)>(
  (ref, key) async {
    final (option, fromDate, toDate, onlyPending) = key;
    return ref.read(hrRepositoryProvider).getPheDuyetNghi(
          option: option,
          fromDate: fromDate,
          toDate: toDate,
          onlyPending: onlyPending,
        );
  },
);

final diemDanhNhomProvider = FutureProvider.autoDispose.family<List<Map<String, dynamic>>, (String, int)>(
  (ref, key) async {
    final (option, teamNameList) = key;
    return ref.read(hrRepositoryProvider).getDiemDanhNhom(option: option, teamNameList: teamNameList);
  },
);

final lichSuDiLamProvider = FutureProvider.autoDispose.family<List<Map<String, dynamic>>, (String fromDate, String toDate)>(
  (ref, key) async {
    final (fromDate, toDate) = key;
    return ref.read(hrRepositoryProvider).getLichSuDiLam(fromDate: fromDate, toDate: toDate);
  },
);

final listChamCongProvider = FutureProvider.autoDispose.family<
    List<Map<String, dynamic>>,
    (String fromDate, String toDate, bool trungHiViec, bool trungHiSinh)>(
  (ref, key) async {
    final (fromDate, toDate, trungHiViec, trungHiSinh) = key;
    return ref.read(hrRepositoryProvider).loadBangChamCong(
          fromDate: fromDate,
          toDate: toDate,
          trungHiViec: trungHiViec,
          trungHiSinh: trungHiSinh,
        );
  },
);

final baoCaoNhanSuProvider = FutureProvider.autoDispose.family<List<Map<String, dynamic>>, (String fromDate, String toDate)>(
  (ref, key) async {
    final (fromDate, toDate) = key;
    return ref.read(hrRepositoryProvider).getBaoCaoNhanSuDiemDanhFull(fromDate: fromDate, toDate: toDate);
  },
);

final mainDeptListProvider = FutureProvider.autoDispose.family<List<Map<String, dynamic>>, String>((ref, fromDate) async {
  return ref.read(hrRepositoryProvider).getMainDeptList(fromDate: fromDate);
});

final diemDanhSummaryNhomProvider = FutureProvider.autoDispose.family<List<Map<String, dynamic>>, String>((ref, toDate) async {
  return ref.read(hrRepositoryProvider).diemDanhSummaryNhom(toDate: toDate);
});

final diemDanhHistoryNhomProvider = FutureProvider.autoDispose.family<
    List<Map<String, dynamic>>,
    (String startDate, String endDate, int mainDeptCode, int workShiftCode, int factoryCode)>(
  (ref, key) async {
    final (startDate, endDate, mainDeptCode, workShiftCode, factoryCode) = key;
    return ref.read(hrRepositoryProvider).diemDanhHistoryNhom(
          startDate: startDate,
          endDate: endDate,
          mainDeptCode: mainDeptCode,
          workShiftCode: workShiftCode,
          factoryCode: factoryCode,
        );
  },
);

final ddMainDeptTbProvider = FutureProvider.autoDispose.family<List<Map<String, dynamic>>, (String fromDate, String toDate)>(
  (ref, key) async {
    final (fromDate, toDate) = key;
    return ref.read(hrRepositoryProvider).getDdMainDeptTb(fromDate: fromDate, toDate: toDate);
  },
);

final diemDanhFullSummaryProvider = FutureProvider.autoDispose.family<List<Map<String, dynamic>>, (String fromDate, String toDate)>(
  (ref, key) async {
    final (fromDate, toDate) = key;
    return ref.read(hrRepositoryProvider).loadDiemDanhFullSummaryTable(fromDate: fromDate, toDate: toDate);
  },
);
