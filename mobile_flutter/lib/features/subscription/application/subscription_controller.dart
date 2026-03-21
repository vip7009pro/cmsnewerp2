import 'dart:async';

import 'package:android_id/android_id.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:in_app_purchase/in_app_purchase.dart';

import '../../../core/providers.dart';
import '../../../core/storage/secure_kv_store.dart';
import 'subscription_repository.dart';
import 'subscription_state.dart';

final subscriptionRepositoryProvider = Provider<SubscriptionRepository>((ref) {
  return SubscriptionRepository(apiClient: ref.read(apiClientProvider));
});

final subscriptionControllerProvider = NotifierProvider<SubscriptionController, SubscriptionStatus>(
  SubscriptionController.new,
);

class SubscriptionController extends Notifier<SubscriptionStatus> {
  late final SubscriptionRepository _repo = ref.read(subscriptionRepositoryProvider);
  late final SecureKvStore _secureStore = ref.read(secureKvStoreProvider);
  final InAppPurchase _iap = InAppPurchase.instance;

  static const String monthlyProductId = 'scan_monthly';
  static const String yearlyProductId = 'scan_yearly';
  static const String lifetimeProductId = 'scan_lifetime';

  StreamSubscription<List<PurchaseDetails>>? _purchaseSub;
  String? _deviceId;

  bool _initialized = false;

  @override
  SubscriptionStatus build() {
    if (!_initialized) {
      _initialized = true;
      // Run async init after first build so `state` is available.
      Future<void>.microtask(init);
    }

    ref.onDispose(() {
      _purchaseSub?.cancel();
    });

    return const SubscriptionLoading();
  }

  Future<String> _getDeviceId() async {
    if (_deviceId != null && _deviceId!.isNotEmpty) return _deviceId!;
    try {
      final androidId = AndroidId();
      final id = await androidId.getId();
      if (id != null && id.isNotEmpty) {
        _deviceId = id;
        return _deviceId!;
      }
    } catch (_) {
      // ignore
    }
    // Fallback: build ID (less stable than ANDROID_ID)
    final info = await DeviceInfoPlugin().androidInfo;
    _deviceId = info.id;
    return _deviceId!;
  }

  Future<void> init() async {
    state = const SubscriptionLoading();

    final deviceId = await _getDeviceId();

    // 1) Quick local cache check (for fast startup/offline short term)
    final cachedLifetime = await _secureStore.getSubscriptionLifetime();
    if (cachedLifetime) {
      state = const SubscriptionActive(
        snapshot: SubscriptionSnapshot(activeUntil: null, lifetime: true, trialStart: null, productId: lifetimeProductId),
      );
    }
    final cachedUntil = await _secureStore.getSubscriptionActiveUntil();
    if (!cachedLifetime && cachedUntil != null && cachedUntil.isAfter(DateTime.now())) {
      state = SubscriptionActive(
        snapshot: SubscriptionSnapshot(activeUntil: cachedUntil, lifetime: false, trialStart: null, productId: null),
      );
    }

    // 2) Server authoritative status
    try {
      final serverStatus = await _repo.getStatus(deviceId: deviceId);
      if (serverStatus.lifetime) {
        await _secureStore.setSubscriptionLifetime(true);
        await _secureStore.clearSubscriptionActiveUntil();
        state = SubscriptionActive(
          snapshot: SubscriptionSnapshot(
            activeUntil: null,
            lifetime: true,
            trialStart: serverStatus.trialStart,
            productId: serverStatus.productId ?? lifetimeProductId,
          ),
        );
      } else if (serverStatus.activeUntil != null && serverStatus.activeUntil!.isAfter(DateTime.now())) {
        await _secureStore.setSubscriptionLifetime(false);
        await _secureStore.setSubscriptionActiveUntil(serverStatus.activeUntil);
        state = SubscriptionActive(
          snapshot: SubscriptionSnapshot(
            activeUntil: serverStatus.activeUntil,
            lifetime: false,
            trialStart: serverStatus.trialStart,
            productId: serverStatus.productId,
          ),
        );
      } else {
        state = SubscriptionInactive(
          products: const <ProductDetails>[],
          snapshot: SubscriptionSnapshot(
            activeUntil: serverStatus.activeUntil,
            lifetime: serverStatus.lifetime,
            trialStart: serverStatus.trialStart,
            productId: serverStatus.productId,
          ),
        );
      }
    } catch (e) {
      // ignore server error here; user can still attempt purchase
    }

    // 3) Setup purchase listener + load products if needed
    _purchaseSub?.cancel();
    _purchaseSub = _iap.purchaseStream.listen(_onPurchaseUpdated, onError: (_) {});

    if (state is! SubscriptionActive) {
      await loadProducts();
    }
  }

  Future<void> loadProducts() async {
    final current = state;
    if (current is SubscriptionInactive) {
      state = SubscriptionInactive(products: current.products, loadingProducts: true, snapshot: current.snapshot);
    } else {
      state = const SubscriptionInactive(products: <ProductDetails>[], loadingProducts: true);
    }

    final available = await _iap.isAvailable();
    if (!available) {
      state = const SubscriptionError('Google Play Billing không khả dụng trên thiết bị này');
      return;
    }

    final response = await _iap.queryProductDetails({monthlyProductId, yearlyProductId, lifetimeProductId});
    if (response.error != null) {
      state = SubscriptionError(response.error!.message);
      return;
    }

    final products = response.productDetails.toList()
      ..sort((a, b) => a.id.compareTo(b.id));

    final current2 = state;
    state = SubscriptionInactive(
      products: products,
      loadingProducts: false,
      snapshot: current2 is SubscriptionInactive ? current2.snapshot : null,
    );
  }

  Future<void> buy(ProductDetails product) async {
    final current = state;
    if (current is SubscriptionInactive) {
      state = SubscriptionInactive(products: current.products, purchasing: true, snapshot: current.snapshot);
    }

    final purchaseParam = PurchaseParam(productDetails: product);
    await _iap.buyNonConsumable(purchaseParam: purchaseParam);
  }

  Future<void> restore() async {
    final current = state;
    if (current is SubscriptionInactive) {
      state = SubscriptionInactive(
        products: current.products,
        purchasing: true,
        loadingProducts: current.loadingProducts,
        snapshot: current.snapshot,
      );
    }

    try {
      await _iap.restorePurchases();
      // Restore triggers async events on purchaseStream. Give it a short moment,
      // then refresh from server so user sees a deterministic result.
      await Future<void>.delayed(const Duration(seconds: 2));
      await refreshFromServer();
    } catch (e) {
      state = SubscriptionError('Restore thất bại: $e');
    } finally {
      final s = state;
      if (s is SubscriptionInactive) {
        state = SubscriptionInactive(
          products: s.products,
          purchasing: false,
          loadingProducts: s.loadingProducts,
          snapshot: s.snapshot,
        );
      }
    }
  }

  Future<void> _onPurchaseUpdated(List<PurchaseDetails> purchases) async {
    for (final p in purchases) {
      if (p.status == PurchaseStatus.pending) {
        continue;
      }

      if (p.status == PurchaseStatus.error) {
        state = SubscriptionError(p.error?.message ?? 'Mua hàng thất bại');
        continue;
      }

      if (p.status == PurchaseStatus.purchased || p.status == PurchaseStatus.restored) {
        final token = p.verificationData.serverVerificationData;
        try {
          final deviceId = await _getDeviceId();
          final serverStatus = await _repo.verifyPurchase(
            deviceId: deviceId,
            productId: p.productID,
            purchaseToken: token,
          );
          if (serverStatus.lifetime) {
            await _secureStore.setSubscriptionLifetime(true);
            await _secureStore.clearSubscriptionActiveUntil();
            state = SubscriptionActive(
              snapshot: SubscriptionSnapshot(
                activeUntil: null,
                lifetime: true,
                trialStart: serverStatus.trialStart,
                productId: serverStatus.productId ?? lifetimeProductId,
              ),
            );
          } else if (serverStatus.activeUntil != null && serverStatus.activeUntil!.isAfter(DateTime.now())) {
            await _secureStore.setSubscriptionLifetime(false);
            await _secureStore.setSubscriptionActiveUntil(serverStatus.activeUntil);
            state = SubscriptionActive(
              snapshot: SubscriptionSnapshot(
                activeUntil: serverStatus.activeUntil,
                lifetime: false,
                trialStart: serverStatus.trialStart,
                productId: serverStatus.productId,
              ),
            );
          } else {
            await _secureStore.setSubscriptionLifetime(false);
            await _secureStore.clearSubscriptionActiveUntil();
            state = SubscriptionInactive(
              products: const <ProductDetails>[],
              snapshot: SubscriptionSnapshot(
                activeUntil: serverStatus.activeUntil,
                lifetime: serverStatus.lifetime,
                trialStart: serverStatus.trialStart,
                productId: serverStatus.productId,
              ),
            );
          }
        } catch (e) {
          state = SubscriptionError(e.toString());
        }
      }

      if (p.pendingCompletePurchase) {
        await _iap.completePurchase(p);
      }
    }

    if (state is! SubscriptionActive && state is! SubscriptionError) {
      // Ensure products are visible after any flow
      await loadProducts();
    }
  }

  Future<void> refreshFromServer() async {
    try {
      final deviceId = await _getDeviceId();
      final serverStatus = await _repo.getStatus(deviceId: deviceId);
      if (serverStatus.lifetime) {
        await _secureStore.setSubscriptionLifetime(true);
        await _secureStore.clearSubscriptionActiveUntil();
        state = SubscriptionActive(
          snapshot: SubscriptionSnapshot(
            activeUntil: null,
            lifetime: true,
            trialStart: serverStatus.trialStart,
            productId: serverStatus.productId ?? lifetimeProductId,
          ),
        );
        return;
      }
      if (serverStatus.activeUntil != null && serverStatus.activeUntil!.isAfter(DateTime.now())) {
        await _secureStore.setSubscriptionLifetime(false);
        await _secureStore.setSubscriptionActiveUntil(serverStatus.activeUntil);
        state = SubscriptionActive(
          snapshot: SubscriptionSnapshot(
            activeUntil: serverStatus.activeUntil,
            lifetime: false,
            trialStart: serverStatus.trialStart,
            productId: serverStatus.productId,
          ),
        );
        return;
      }
      await _secureStore.setSubscriptionLifetime(false);
      await _secureStore.clearSubscriptionActiveUntil();

      state = SubscriptionInactive(
        products: const <ProductDetails>[],
        snapshot: SubscriptionSnapshot(
          activeUntil: serverStatus.activeUntil,
          lifetime: serverStatus.lifetime,
          trialStart: serverStatus.trialStart,
          productId: serverStatus.productId,
        ),
      );
      await loadProducts();
    } catch (e) {
      state = SubscriptionError(e.toString());
    }
  }
}
