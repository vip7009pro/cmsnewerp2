import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../kinhdoanh/presentation/tra_amz_scan_page.dart';
import '../application/subscription_controller.dart';
import '../application/subscription_state.dart';
import 'subscription_paywall_page.dart';

class SubscriptionGatePage extends ConsumerWidget {
  const SubscriptionGatePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final status = ref.watch(subscriptionControllerProvider);

    return switch (status) {
      SubscriptionLoading() => const Scaffold(
          body: Center(child: CircularProgressIndicator()),
        ),
      SubscriptionActive() => const AmzScanPage(),
      SubscriptionInactive() => const SubscriptionPaywallPage(),
      SubscriptionError(:final message) => Scaffold(
          body: Center(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(message, textAlign: TextAlign.center),
                  const SizedBox(height: 12),
                  FilledButton(
                    onPressed: () => ref.read(subscriptionControllerProvider.notifier).init(),
                    child: const Text('Thử lại'),
                  ),
                ],
              ),
            ),
          ),
        ),
    };
  }
}
