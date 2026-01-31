class AppConfig {
  static const String baseUrl = 'http://14.160.33.94:3007';
  static const String imageBaseUrl = 'http://14.160.33.94';
  static const String company = 'CMS';
  static const String ctrCd = '002';

  static String employeeImageUrl(String emplNo) {
    return '$imageBaseUrl/Picture_NS/NS_$emplNo.jpg';
  }
}
