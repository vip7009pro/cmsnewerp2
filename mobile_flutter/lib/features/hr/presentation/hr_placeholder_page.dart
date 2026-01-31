import 'package:flutter/material.dart';

class HrPlaceholderPage extends StatelessWidget {
  const HrPlaceholderPage({super.key, required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: const Center(
        child: Text('Chưa implement màn này'),
      ),
    );
  }
}
