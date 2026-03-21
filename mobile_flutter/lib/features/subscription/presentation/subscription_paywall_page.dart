import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../application/subscription_controller.dart';
import '../application/subscription_state.dart';

class SubscriptionPaywallPage extends ConsumerWidget {
  const SubscriptionPaywallPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final status = ref.watch(subscriptionControllerProvider);

    if (status is SubscriptionError) {
      return Scaffold(
        appBar: AppBar(title: const Text('Kích hoạt Scanner Pro')),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(status.message, textAlign: TextAlign.center),
                const SizedBox(height: 12),
                FilledButton(
                  onPressed: () => ref.read(subscriptionControllerProvider.notifier).init(),
                  child: const Text('Thử lại'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    if (status is! SubscriptionInactive) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Kích hoạt Scanner Pro'),
        actions: [
          TextButton(
            onPressed: () => ref.read(subscriptionControllerProvider.notifier).restore(),
            child: const Text('Restore'),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Bạn cần subscription để tiếp tục sử dụng ứng dụng.',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
            if (status.snapshot?.trialStart != null && status.snapshot?.activeUntil != null) ...[
              const SizedBox(height: 8),
              Text(
                'Trial đến: ${status.snapshot!.activeUntil}',
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
            ],
            const SizedBox(height: 8),
            const Text(
              'Trên Google Play bạn sẽ cấu hình Trial (dùng thử) như một Offer trong gói tháng/năm.',
            ),
            const SizedBox(height: 16),
            if (status.loadingProducts || status.purchasing) const LinearProgressIndicator(),
            const SizedBox(height: 16),
            Expanded(
              child: ListView.separated(
                itemCount: status.products.length,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (context, i) {
                  final p = status.products[i];
                  return Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Text(p.title, style: const TextStyle(fontWeight: FontWeight.w700)),
                          const SizedBox(height: 4),
                          Text(p.description),
                          const SizedBox(height: 8),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(p.price, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                              FilledButton(
                                onPressed: status.purchasing
                                    ? null
                                    : () => ref.read(subscriptionControllerProvider.notifier).buy(p),
                                child: const Text('Mua'),
                              ),
                            ],
                          )
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
            OutlinedButton(
              onPressed: () => ref.read(subscriptionControllerProvider.notifier).refreshFromServer(),
              child: const Text('Kiểm tra lại trạng thái'),
            ),
          ],
        ),
      ),
    );
  }
}
