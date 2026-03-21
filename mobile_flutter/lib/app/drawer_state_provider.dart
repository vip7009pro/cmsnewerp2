import 'package:flutter_riverpod/flutter_riverpod.dart';

final openDrawerOnHomeProvider = NotifierProvider<OpenDrawerOnHomeNotifier, bool>(OpenDrawerOnHomeNotifier.new);

class OpenDrawerOnHomeNotifier extends Notifier<bool> {
  @override
  bool build() => false;

  void setOpen(bool value) {
    state = value;
  }
}
