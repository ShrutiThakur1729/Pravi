class UserModel {
  final String uid;
  final String email;
  final String name;
  final String? profileImageUrl;
  final Map<String, dynamic> preferences;
  final List<String> interests;
  final List<String> challenges;

  UserModel({
    required this.uid,
    required this.email,
    required this.name,
    this.profileImageUrl,
    required this.preferences,
    required this.interests,
    required this.challenges,
  });

  factory UserModel.fromMap(Map<String, dynamic> map) {
    return UserModel(
      uid: map['uid'] ?? '',
      email: map['email'] ?? '',
      name: map['name'] ?? '',
      profileImageUrl: map['profileImageUrl'],
      preferences: Map<String, dynamic>.from(map['preferences'] ?? {}),
      interests: List<String>.from(map['interests'] ?? []),
      challenges: List<String>.from(map['challenges'] ?? []),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'uid': uid,
      'email': email,
      'name': name,
      'profileImageUrl': profileImageUrl,
      'preferences': preferences,
      'interests': interests,
      'challenges': challenges,
    };
  }

  UserModel copyWith({
    String? uid,
    String? email,
    String? name,
    String? profileImageUrl,
    Map<String, dynamic>? preferences,
    List<String>? interests,
    List<String>? challenges,
  }) {
    return UserModel(
      uid: uid ?? this.uid,
      email: email ?? this.email,
      name: name ?? this.name,
      profileImageUrl: profileImageUrl ?? this.profileImageUrl,
      preferences: preferences ?? this.preferences,
      interests: interests ?? this.interests,
      challenges: challenges ?? this.challenges,
    );
  }
}
