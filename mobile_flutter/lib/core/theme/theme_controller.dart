import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'app_theme.dart';

@immutable
class ThemeSettings {
  const ThemeSettings({required this.themeId, required this.mode});

  final AppThemeId themeId;
  final ThemeMode mode;

  ThemeSettings copyWith({AppThemeId? themeId, ThemeMode? mode}) {
    return ThemeSettings(
      themeId: themeId ?? this.themeId,
      mode: mode ?? this.mode,
    );
  }
}

class ThemeController extends StateNotifier<ThemeSettings> {
  ThemeController() : super(const ThemeSettings(themeId: AppThemeId.compactBlue, mode: ThemeMode.light)) {
    _load();
  }

  static const _kThemeId = 'theme_id';
  static const _kThemeMode = 'theme_mode';

  Future<void> _load() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final idStr = prefs.getString(_kThemeId);
      final modeStr = prefs.getString(_kThemeMode);

      final id = AppThemeId.values.firstWhere(
        (e) => e.name == idStr,
        orElse: () => state.themeId,
      );
      final mode = ThemeMode.values.firstWhere(
        (e) => e.name == modeStr,
        orElse: () => state.mode,
      );

      if (mounted) {
        state = state.copyWith(themeId: id, mode: mode);
      }
    } catch (_) {
      // Ignore load errors; keep defaults.
    }
  }

  Future<void> _save(ThemeSettings s) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_kThemeId, s.themeId.name);
      await prefs.setString(_kThemeMode, s.mode.name);
    } catch (_) {
      // Ignore save errors.
    }
  }

  void setThemeId(AppThemeId id) {
    final next = state.copyWith(themeId: id);
    state = next;
    _save(next);
  }

  void setMode(ThemeMode mode) {
    final next = state.copyWith(mode: mode);
    state = next;
    _save(next);
  }
}

final themeControllerProvider = StateNotifierProvider<ThemeController, ThemeSettings>((ref) {
  return ThemeController();
});
