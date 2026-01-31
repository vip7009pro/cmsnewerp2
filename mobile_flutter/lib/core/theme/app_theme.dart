import 'package:flutter/material.dart';

enum AppThemeId {
  defaultBlue,
  compactBlue,
  green,
  purple,
  orange,
  teal,
  indigo,
  amber,
  lime,
}

class AppThemeData {
  const AppThemeData({required this.light, required this.dark});

  final ThemeData light;
  final ThemeData dark;
}

class AppThemes {
  static AppThemeData of(AppThemeId id) {
    switch (id) {
      case AppThemeId.compactBlue:
        return AppThemeData(
          light: _buildLight(seed: Colors.blue, compact: true),
          dark: _buildDark(seed: Colors.blue, compact: true),
        );
      case AppThemeId.defaultBlue:
        return AppThemeData(
          light: _buildLight(seed: Colors.blue, compact: false),
          dark: _buildDark(seed: Colors.blue, compact: false),
        );
      case AppThemeId.green:
        return AppThemeData(
          light: _buildLight(seed: Colors.green, compact: false),
          dark: _buildDark(seed: Colors.green, compact: false),
        );
      case AppThemeId.purple:
        return AppThemeData(
          light: _buildLight(seed: Colors.purple, compact: false),
          dark: _buildDark(seed: Colors.purple, compact: false),
        );
      case AppThemeId.orange:
        return AppThemeData(
          light: _buildLight(seed: Colors.orange, compact: false),
          dark: _buildDark(seed: Colors.orange, compact: false),
        );
      case AppThemeId.teal:
        return AppThemeData(
          light: _buildLight(seed: Colors.teal, compact: false),
          dark: _buildDark(seed: Colors.teal, compact: false),
        );
      case AppThemeId.indigo:
        return AppThemeData(
          light: _buildLight(seed: Colors.indigo, compact: false),
          dark: _buildDark(seed: Colors.indigo, compact: false),
        );
      case AppThemeId.amber:
        return AppThemeData(
          light: _buildLight(seed: Colors.amber, compact: false),
          dark: _buildDark(seed: Colors.amber, compact: false),
        );
      case AppThemeId.lime:
        return AppThemeData(
          light: _buildLight(seed: Colors.lime, compact: false),
          dark: _buildDark(seed: Colors.lime, compact: false),
        );
    }
  }

  static ThemeData _buildLight({required Color seed, required bool compact}) {
    final base = ThemeData(
      colorScheme: ColorScheme.fromSeed(seedColor: seed, brightness: Brightness.light),
      useMaterial3: true,
    );

    if (!compact) return base;

    return base.copyWith(
      visualDensity: VisualDensity.compact,
      inputDecorationTheme: const InputDecorationTheme(
        isDense: true,
        border: OutlineInputBorder(),
        contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      ),
    );
  }

  static ThemeData _buildDark({required Color seed, required bool compact}) {
    final base = ThemeData(
      colorScheme: ColorScheme.fromSeed(
        seedColor: seed,
        brightness: Brightness.dark,
        surface: const Color(0xFF121212), // slightly darker than default
        onSurface: const Color(0xFFE0E0E0), // lighter text for contrast
      ),
      useMaterial3: true,
    );

    if (!compact) return base;

    return base.copyWith(
      visualDensity: VisualDensity.compact,
      inputDecorationTheme: const InputDecorationTheme(
        isDense: true,
        border: OutlineInputBorder(),
        contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      ),
    );
  }
}
