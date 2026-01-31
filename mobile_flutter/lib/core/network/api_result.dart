class ApiResult<T> {
  const ApiResult({required this.ok, this.data, this.message});

  final bool ok;
  final T? data;
  final String? message;
}
