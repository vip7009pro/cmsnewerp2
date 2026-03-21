import 'package:in_app_purchase/in_app_purchase.dart';

class SubscriptionSnapshot {
  const SubscriptionSnapshot({
    required this.activeUntil,
    required this.lifetime,
    required this.trialStart,
    required this.productId,
  });

  final DateTime? activeUntil;
  final bool lifetime;
  final DateTime? trialStart;
  final String? productId;
}

sealed class SubscriptionStatus {
  const SubscriptionStatus();
}

class SubscriptionLoading extends SubscriptionStatus {
  const SubscriptionLoading();
}

class SubscriptionError extends SubscriptionStatus {
  const SubscriptionError(this.message);
  final String message;
}

class SubscriptionInactive extends SubscriptionStatus {
  const SubscriptionInactive({
    required this.products,
    this.loadingProducts = false,
    this.purchasing = false,
    this.snapshot,
  });

  final List<ProductDetails> products;
  final bool loadingProducts;
  final bool purchasing;
  final SubscriptionSnapshot? snapshot;
}

class SubscriptionActive extends SubscriptionStatus {
  const SubscriptionActive({required this.snapshot});
  final SubscriptionSnapshot snapshot;
}
