class AppDateUtils {
  static String ymd(DateTime d) {
    final y = d.year.toString().padLeft(4, '0');
    final m = d.month.toString().padLeft(2, '0');
    final dd = d.day.toString().padLeft(2, '0');
    return '$y-$m-$dd';
  }

  static String ymdFromValue(Object? value) {
    if (value == null) return '';

    if (value is DateTime) return ymd(value);

    final s = value.toString().trim();
    if (s.isEmpty || s.toLowerCase() == 'null') return '';

    if (s.length >= 10) {
      final head = s.substring(0, 10);
      if (_looksLikeYmd(head)) return head;
    }

    final parsed = DateTime.tryParse(s);
    if (parsed == null) return s;

    return ymd(parsed.toUtc());
  }

  static bool _looksLikeYmd(String s) {
    if (s.length != 10) return false;
    if (s[4] != '-' || s[7] != '-') return false;
    final y = int.tryParse(s.substring(0, 4));
    final m = int.tryParse(s.substring(5, 7));
    final d = int.tryParse(s.substring(8, 10));
    if (y == null || m == null || d == null) return false;
    return m >= 1 && m <= 12 && d >= 1 && d <= 31;
  }
}
