import 'package:shared_preferences/shared_preferences.dart';

class AppConfig {
  static const String company = 'CMS';
  static const String ctrCd = '002';

  static const _prefKeyServerId = 'app_server_id';

  static const servers = <AppServerConfig>[
    AppServerConfig(
      id: 'server_1',
      name: 'Main Server',
      imageBaseUrl: 'http://14.160.33.94',
      baseUrl: 'http://14.160.33.94:5013',
    ),
    AppServerConfig(
      id: 'server_2',
      name: 'Sub Server',
      imageBaseUrl: 'http://14.160.33.94',
      baseUrl: 'http://14.160.33.94:3007',
    ),
  ];

  static String _serverId = servers.first.id;

  // Keep names unchanged for compatibility.
  static String imageBaseUrl = servers.first.imageBaseUrl;
  static String baseUrl = servers.first.baseUrl;

  static String get serverId => _serverId;

  static AppServerConfig get currentServer =>
      servers.firstWhere((s) => s.id == _serverId, orElse: () => servers.first);

  static Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    final savedId = prefs.getString(_prefKeyServerId);
    final found = servers.where((s) => s.id == savedId).toList();
    final id = found.isNotEmpty ? found.first.id : servers.first.id;
    _applyServer(id);
  }

  static Future<void> setServer(String id) async {
    _applyServer(id);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_prefKeyServerId, _serverId);
  }

  static void _applyServer(String id) {
    final server = servers.firstWhere((s) => s.id == id, orElse: () => servers.first);
    _serverId = server.id;
    imageBaseUrl = server.imageBaseUrl;
    baseUrl = server.baseUrl;
  }

  static String employeeImageUrl(String emplNo) {
    return '$imageBaseUrl/Picture_NS/NS_$emplNo.jpg';
  }
}

class AppServerConfig {
  final String id;
  final String name;
  final String imageBaseUrl;
  final String baseUrl;

  const AppServerConfig({
    required this.id,
    required this.name,
    required this.imageBaseUrl,
    required this.baseUrl,
  });
}
