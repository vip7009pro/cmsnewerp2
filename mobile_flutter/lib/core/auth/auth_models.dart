class UserData {
  const UserData({
    required this.emplNo,
    required this.jobName,
    this.mainDeptName,
    this.subDeptName,
    this.cmsId,
    this.midlastName,
    this.firstName,
    this.emplImage,
    this.dob,
    this.hometown,
    this.addVillage,
    this.addCommune,
    this.addDistrict,
    this.addProvince,
    this.workPositionName,
    this.attGroupCode,
  });

  final String emplNo;
  final String jobName;
  final String? mainDeptName;
  final String? subDeptName;
  final String? cmsId;
  final String? midlastName;
  final String? firstName;
  final String? emplImage; // 'Y' or null
  final String? dob;
  final String? hometown;
  final String? addVillage;
  final String? addCommune;
  final String? addDistrict;
  final String? addProvince;
  final String? workPositionName;
  final String? attGroupCode;

  factory UserData.fromJson(Map<String, dynamic> json) {
    return UserData(
      emplNo: (json['EMPL_NO'] ?? '').toString(),
      jobName: (json['JOB_NAME'] ?? '').toString(),
      mainDeptName: json['MAINDEPTNAME']?.toString(),
      subDeptName: json['SUBDEPTNAME']?.toString(),
      cmsId: json['CMS_ID']?.toString(),
      midlastName: json['MIDLAST_NAME']?.toString(),
      firstName: json['FIRST_NAME']?.toString(),
      emplImage: json['EMPL_IMAGE']?.toString(),
      dob: json['DOB']?.toString(),
      hometown: json['HOMETOWN']?.toString(),
      addVillage: json['ADD_VILLAGE']?.toString(),
      addCommune: json['ADD_COMMUNE']?.toString(),
      addDistrict: json['ADD_DISTRICT']?.toString(),
      addProvince: json['ADD_PROVINCE']?.toString(),
      workPositionName: json['WORK_POSITION_NAME']?.toString(),
      attGroupCode: json['ATT_GROUP_CODE']?.toString(),
    );
  }
}

class AuthSession {
  const AuthSession({required this.user});

  final UserData user;
}
