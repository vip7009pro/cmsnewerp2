import '../../../core/network/api_client.dart';

class SubscriptionServerStatus {
  const SubscriptionServerStatus({
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

class SubscriptionRepository {
  SubscriptionRepository({required ApiClient apiClient}) : _apiClient = apiClient;

  final ApiClient _apiClient;

  Future<SubscriptionServerStatus> getStatus({required String deviceId}) async {
    final res = await _apiClient.postCommand(
      'subscription_status',
      data: {
        'deviceId': deviceId,
      },
    );
    final data = res.data as Map<String, dynamic>?;
    final lifetime = (data?['lifetime'] == true) || (data?['lifetime']?.toString() == 'true');
    final trialStartStr = data?['trialStart']?.toString();
    final trialStart = (trialStartStr == null || trialStartStr.isEmpty) ? null : DateTime.tryParse(trialStartStr);
    final productId = data?['productId']?.toString();
    final activeUntilStr = data?['activeUntil']?.toString();
    if (activeUntilStr == null || activeUntilStr.isEmpty) {
      return SubscriptionServerStatus(
        activeUntil: null,
        lifetime: lifetime,
        trialStart: trialStart,
        productId: productId,
      );
    }
    return SubscriptionServerStatus(
      activeUntil: DateTime.tryParse(activeUntilStr),
      lifetime: lifetime,
      trialStart: trialStart,
      productId: productId,
    );
  }

  Future<SubscriptionServerStatus> verifyPurchase({
    required String deviceId,
    required String productId,
    required String purchaseToken,
  }) async {
    final res = await _apiClient.postCommand(
      'subscription_verify',
      data: {
        'deviceId': deviceId,
        'productId': productId,
        'purchaseToken': purchaseToken,
      },
    );
    final data = res.data as Map<String, dynamic>?;
    final lifetime = (data?['lifetime'] == true) || (data?['lifetime']?.toString() == 'true');
    final trialStartStr = data?['trialStart']?.toString();
    final trialStart = (trialStartStr == null || trialStartStr.isEmpty) ? null : DateTime.tryParse(trialStartStr);
    final serverProductId = data?['productId']?.toString();
    final activeUntilStr = data?['activeUntil']?.toString();
    if (activeUntilStr == null || activeUntilStr.isEmpty) {
      return SubscriptionServerStatus(
        activeUntil: null,
        lifetime: lifetime,
        trialStart: trialStart,
        productId: serverProductId,
      );
    }
    return SubscriptionServerStatus(
      activeUntil: DateTime.tryParse(activeUntilStr),
      lifetime: lifetime,
      trialStart: trialStart,
      productId: serverProductId,
    );
  }
}
