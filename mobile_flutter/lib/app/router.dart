import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../features/auth/application/auth_notifier.dart';
import '../features/auth/application/auth_state.dart';
import '../features/auth/presentation/login_page.dart';
import '../features/hr/presentation/hr_employee_edit_page.dart';
import '../features/hr/presentation/hr_department_employee_page.dart';
import '../features/hr/presentation/diemdanh_nhom_page.dart';
import '../features/hr/presentation/dieu_chuyen_team_page.dart';
import '../features/hr/presentation/dang_ky_page.dart';
import '../features/hr/presentation/phe_duyet_nghi_page.dart';
import '../features/hr/presentation/lich_su_di_lam_page.dart';
import '../features/hr/presentation/list_cham_cong_page.dart';
import '../features/hr/presentation/bao_cao_nhan_su_page.dart';
import '../features/hr/presentation/quan_ly_cap_cao_page.dart';
import '../features/hr/presentation/quan_ly_cap_cao_ns_page.dart';
import '../features/home/presentation/home_page.dart';
import '../features/kinhdoanh/presentation/menu_code_placeholder_page.dart';
import '../features/kinhdoanh/presentation/invoice_manager_page.dart';
import '../features/kinhdoanh/presentation/plan_manager_page.dart';
import '../features/kinhdoanh/presentation/shortage_manager_page.dart';
import '../features/kinhdoanh/presentation/fcst_manager_page.dart';
import '../features/kinhdoanh/presentation/ycsx_manager_page.dart';
import '../features/kinhdoanh/presentation/po_manager_page.dart';
import '../features/kinhdoanh/presentation/po_and_stock_full_page.dart';
import '../features/kinhdoanh/presentation/thong_tin_san_pham_page.dart';
import '../features/menu/presentation/menu_page.dart';
import '../features/settings/presentation/theme_settings_page.dart';
import '../features/splash/presentation/splash_page.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/splash',
    refreshListenable: _GoRouterRefresh(ref),
    redirect: (context, state) async {
      final authState = ref.read(authNotifierProvider);

      final isSplash = state.matchedLocation == '/splash';
      final isLogin = state.matchedLocation == '/login';

      if (authState is AuthUnknown || authState is AuthLoading) {
        return isSplash ? null : '/splash';
      }

      if (authState is AuthUnauthenticated || authState is AuthError) {
        return isLogin ? null : '/login';
      }

      if (authState is AuthAuthenticated) {
        return isLogin || isSplash ? '/home' : null;
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashPage(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: '/home',
        builder: (context, state) => const HomePage(),
      ),
      GoRoute(
        path: '/menu',
        builder: (context, state) => const MenuPage(),
      ),
      GoRoute(
        path: '/nhansu/quanlyphongbannhanvien',
        builder: (context, state) => const HrDepartmentEmployeePage(),
      ),
      GoRoute(
        path: '/nhansu/edit',
        builder: (context, state) {
          final employee = state.extra as Map<String, dynamic>?;
          return HrEmployeeEditPage(employee: employee);
        },
      ),
      GoRoute(
        path: '/nhansu/diemdanhnhom',
        builder: (context, state) => const DiemDanhNhomPage(option: 'diemdanhnhom'),
      ),
      GoRoute(
        path: '/nhansu/dieuchuyenteam',
        builder: (context, state) => const DieuChuyenTeamPage(),
      ),
      GoRoute(
        path: '/nhansu/dangky',
        builder: (context, state) => const DangKyPage(),
      ),
      GoRoute(
        path: '/nhansu/pheduyetnghi',
        builder: (context, state) => const PheDuyetNghiPage(option: 'pheduyetnhom'),
      ),
      GoRoute(
        path: '/nhansu/lichsu',
        builder: (context, state) => const LichSuDiLamPage(),
      ),
      GoRoute(
        path: '/nhansu/baocaonhansu',
        builder: (context, state) => const BaoCaoNhanSuPage(),
      ),
      GoRoute(
        path: '/nhansu/quanlycapcao',
        builder: (context, state) => const QuanLyCapCaoPage(),
        routes: [
          GoRoute(
            path: 'diemdanh',
            builder: (context, state) => const DiemDanhNhomPage(option: 'diemdanhnhomBP'),
          ),
          GoRoute(
            path: 'pheduyetnghi',
            builder: (context, state) => const PheDuyetNghiPage(option: 'pheduyetnhomBP'),
          ),
          GoRoute(
            path: 'dieuchuyenteam',
            builder: (context, state) => const DieuChuyenTeamPage(option1: 'diemdanhnhomBP', option2: 'workpositionlist_BP'),
          ),
        ],
      ),
      GoRoute(
        path: '/nhansu/quanlycapcaons',
        builder: (context, state) => const QuanLyCapCaoNsPage(),
        routes: [
          GoRoute(
            path: 'diemdanh',
            builder: (context, state) => const DiemDanhNhomPage(option: 'diemdanhnhomNS'),
          ),
          GoRoute(
            path: 'pheduyetnghi',
            builder: (context, state) => const PheDuyetNghiPage(option: 'pheduyetnhomNS'),
          ),
          GoRoute(
            path: 'dieuchuyenteam',
            builder: (context, state) => const DieuChuyenTeamPage(option1: 'diemdanhnhomNS', option2: 'workpositionlist_NS'),
          ),
        ],
      ),
      GoRoute(
        path: '/nhansu/listchamcong',
        builder: (context, state) => const ListChamCongPage(),
      ),
      GoRoute(
        path: '/settings/theme',
        builder: (context, state) => const ThemeSettingsPage(),
      ),

      // Kinh doanh routes (menu reference: NavMenuCMS.tsx + CMS_MENU.tsx)
      GoRoute(
        path: '/kinhdoanh/pomanager',
        builder: (context, state) => const PoManagerPage(),
      ),
      GoRoute(
        path: '/kinhdoanh/invoicemanager',
        builder: (context, state) => const InvoiceManagerPage(),
      ),
      GoRoute(
        path: '/kinhdoanh/planmanager',
        builder: (context, state) => const PlanManagerPage(),
      ),
      GoRoute(
        path: '/kinhdoanh/shortage',
        builder: (context, state) => const ShortageManagerPage(),
      ),
      GoRoute(
        path: '/kinhdoanh/fcstmanager',
        builder: (context, state) => const FcstManagerPage(),
      ),
      GoRoute(
        path: '/kinhdoanh/ycsxmanager',
        builder: (context, state) => const YcsxManagerPage(),
      ),
      GoRoute(
        path: '/kinhdoanh/poandstockfull',
        builder: (context, state) => const PoAndStockFullPage(),
      ),
      GoRoute(
        path: '/kinhdoanh/thongtinsanpham',
        builder: (context, state) => const ThongTinSanPhamPage(),
      ),
      GoRoute(
        path: '/kinhdoanh/codeinfo',
        builder: (context, state) => const ThongTinSanPhamPage(),
      ),
      GoRoute(
        path: '/kinhdoanh/quanlycodebom',
        builder: (context, state) => const MenuCodePlaceholderPage(
          title: 'Quản lý Code BOM',
          menuCode: 'KD9',
          description: 'Web component: BOM_MANAGER',
        ),
      ),
      GoRoute(
        path: '/kinhdoanh/customermanager',
        builder: (context, state) => const MenuCodePlaceholderPage(
          title: 'Quản lý khách hàng',
          menuCode: 'KD10',
          description: 'Web component: CUST_MANAGER',
        ),
      ),
      GoRoute(
        path: '/kinhdoanh/eqstatus',
        builder: (context, state) => const MenuCodePlaceholderPage(
          title: 'EQ Status',
          menuCode: 'KD11',
          description: 'Web component: EQ_STATUS2',
        ),
      ),
      GoRoute(
        path: '/kinhdoanh/ins_status',
        builder: (context, state) => const MenuCodePlaceholderPage(
          title: 'Inspect Status',
          menuCode: 'KD12',
          description: 'Web component: INSPECT_STATUS',
        ),
      ),
      GoRoute(
        path: '/kinhdoanh/kinhdoanhreport',
        builder: (context, state) => const MenuCodePlaceholderPage(
          title: 'Báo cáo Kinh doanh',
          menuCode: 'KD13',
          description: 'Web component: KinhDoanhReport',
        ),
      ),
      GoRoute(
        path: '/kinhdoanh/quotationmanager',
        builder: (context, state) => const MenuCodePlaceholderPage(
          title: 'Quản lý giá sản phẩm',
          menuCode: 'KD14',
          description: 'Web component: QuotationTotal',
        ),
      ),
      GoRoute(
        path: '/kinhdoanh/overmonitor',
        builder: (context, state) => const MenuCodePlaceholderPage(
          title: 'Over Monitor',
          menuCode: 'KD15',
          description: 'Web component: OVER_MONITOR',
        ),
      ),
    ],
  );
});

class _GoRouterRefresh extends ChangeNotifier {
  _GoRouterRefresh(this._ref) {
    _remove = _ref.listen<AuthState>(authNotifierProvider, (prev, next) {
      notifyListeners();
    }).close;
  }

  final Ref _ref;
  late final void Function() _remove;

  @override
  void dispose() {
    _remove();
    super.dispose();
  }
}
