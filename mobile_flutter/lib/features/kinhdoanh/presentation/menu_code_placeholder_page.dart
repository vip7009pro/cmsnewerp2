import 'package:flutter/material.dart';

class MenuCodePlaceholderPage extends StatelessWidget {
  const MenuCodePlaceholderPage({
    super.key,
    required this.title,
    required this.menuCode,
    this.description,
  });

  final String title;
  final String menuCode;
  final String? description;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  title,
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 8),
                Text(
                  'MENU_CODE: $menuCode',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
                ),
                if ((description ?? '').isNotEmpty) ...[
                  const SizedBox(height: 12),
                  Text(description!),
                ],
                const SizedBox(height: 12),
                Text(
                  'Trang này đang là placeholder để cài route trước. Sẽ thay bằng UI/API thật sau.',
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
