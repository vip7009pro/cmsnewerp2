class UserData {
  const UserData({required this.emplNo, required this.jobName, this.mainDeptName});

  final String emplNo;
  final String jobName;
  final String? mainDeptName;

  factory UserData.fromJson(Map<String, dynamic> json) {
    return UserData(
      emplNo: (json['EMPL_NO'] ?? '').toString(),
      jobName: (json['JOB_NAME'] ?? '').toString(),
      mainDeptName: json['MAINDEPTNAME']?.toString(),
    );
  }
}

class AuthSession {
  const AuthSession({required this.user});

  final UserData user;
}
