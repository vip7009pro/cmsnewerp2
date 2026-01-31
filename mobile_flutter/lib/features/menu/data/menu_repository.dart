import '../../../core/network/api_client.dart';
import 'menu_models.dart';

class MenuRepository {
  MenuRepository({required ApiClient apiClient}) : _apiClient = apiClient;

  final ApiClient _apiClient;

  Future<List<MenuGroup>> loadMenu() async {
    final res = await _apiClient.postCommand('loadMenuData');
    final body = res.data;

    if (body is! Map<String, dynamic>) return [];
    final status = (body['tk_status'] ?? '').toString().toUpperCase();
    if (status == 'NG') return [];

    final data = body['data'];
    if (data is! List) return [];

    final items = data
        .whereType<Map>()
        .map((e) => MenuItemDto.fromJson(e.cast<String, dynamic>()))
        .toList();

    final Map<int, List<MenuItemDto>> grouped = {};
    for (final item in items) {
      grouped.putIfAbsent(item.menuId, () => []).add(item);
    }

    final result = grouped.entries
        .map(
          (e) => MenuGroup(
            menuId: e.key,
            title: e.value.isNotEmpty ? e.value.first.text : 'Menu ${e.key}',
            items: e.value,
          ),
        )
        .toList();

    result.sort((a, b) => a.menuId.compareTo(b.menuId));
    return result;
  }
}
