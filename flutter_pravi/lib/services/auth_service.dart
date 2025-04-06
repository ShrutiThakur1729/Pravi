import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/user_model.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Get current user
  User? get currentUser => _auth.currentUser;

  // Auth state changes stream
  Stream<User?> get authStateChanges => _auth.authStateChanges();

  // Register with email and password
  Future<UserModel?> registerWithEmailAndPassword(
      String email, String password, String name) async {
    try {
      // Create user with email and password
      final UserCredential result = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
      
      final User? user = result.user;
      
      if (user != null) {
        // Create user document in Firestore
        final UserModel newUser = UserModel(
          uid: user.uid,
          email: email,
          name: name,
          preferences: {
            'theme': 'light',
            'fontSize': 'medium',
            'notifications': true,
            'highContrast': false,
            'reduceMotion': false,
          },
          interests: [],
          challenges: [],
        );
        
        await _firestore.collection('users').doc(user.uid).set(newUser.toMap());
        return newUser;
      }
      return null;
    } catch (e) {
      print(e.toString());
      return null;
    }
  }

  // Sign in with email and password
  Future<UserModel?> signInWithEmailAndPassword(
      String email, String password) async {
    try {
      final UserCredential result = await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      
      final User? user = result.user;
      
      if (user != null) {
        // Get user data from Firestore
        final DocumentSnapshot doc =
            await _firestore.collection('users').doc(user.uid).get();
        
        if (doc.exists) {
          return UserModel.fromMap(doc.data() as Map<String, dynamic>);
        }
      }
      return null;
    } catch (e) {
      print(e.toString());
      return null;
    }
  }

  // Sign out
  Future<void> signOut() async {
    try {
      return await _auth.signOut();
    } catch (e) {
      print(e.toString());
    }
  }

  // Get user data
  Future<UserModel?> getUserData(String uid) async {
    try {
      final DocumentSnapshot doc =
          await _firestore.collection('users').doc(uid).get();
      
      if (doc.exists) {
        return UserModel.fromMap(doc.data() as Map<String, dynamic>);
      }
      return null;
    } catch (e) {
      print(e.toString());
      return null;
    }
  }

  // Update user preferences
  Future<void> updateUserPreferences(String uid, Map<String, dynamic> preferences) async {
    try {
      await _firestore.collection('users').doc(uid).update({
        'preferences': preferences,
      });
    } catch (e) {
      print(e.toString());
    }
  }

  // Update user interests and challenges
  Future<void> updateUserProfile(String uid, List<String> interests, List<String> challenges) async {
    try {
      await _firestore.collection('users').doc(uid).update({
        'interests': interests,
        'challenges': challenges,
      });
    } catch (e) {
      print(e.toString());
    }
  }
}
