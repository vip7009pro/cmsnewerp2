class MenuItemDto {
  const MenuItemDto({
    required this.menuId,
    required this.text,
    required this.link,
    required this.menuIcon,
    required this.iconColor,
    required this.subText,
    required this.subLink,
    required this.subMenuIcon,
    required this.subIconColor,
    this.menuCode,
    this.pageId,
  });

  final int menuId;
  final String text;
  final String link;
  final String menuIcon;
  final String iconColor;
  final String subText;
  final String subLink;
  final String subMenuIcon;
  final String subIconColor;
  final String? menuCode;
  final int? pageId;

  factory MenuItemDto.fromJson(Map<String, dynamic> json) {
    return MenuItemDto(
      menuId: int.tryParse((json['MenuID'] ?? 0).toString()) ?? 0,
      text: (json['Text'] ?? '').toString(),
      link: (json['Link'] ?? '').toString(),
      menuIcon: (json['MenuIcon'] ?? '').toString(),
      iconColor: (json['IconColor'] ?? '').toString(),
      subText: (json['SubText'] ?? '').toString(),
      subLink: (json['SubLink'] ?? '').toString(),
      subMenuIcon: (json['SubMenuIcon'] ?? '').toString(),
      subIconColor: (json['SubIconColor'] ?? '').toString(),
      menuCode: json['MenuCode']?.toString(),
      pageId: json['PAGE_ID'] is int ? json['PAGE_ID'] as int : int.tryParse((json['PAGE_ID'] ?? '').toString()),
    );
  }
}

class MenuGroup {
  const MenuGroup({required this.menuId, required this.title, required this.items});

  final int menuId;
  final String title;
  final List<MenuItemDto> items;
}
