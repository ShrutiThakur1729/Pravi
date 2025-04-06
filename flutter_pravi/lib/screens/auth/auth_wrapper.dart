import 'package:flutter/material.dart';
import 'login_screen.dart';
import 'signup_screen.dart';

class AuthWrapper extends StatefulWidget {
  const AuthWrapper({Key? key}) : super(key: key);

  @override
  _AuthWrapperState createState() => _AuthWrapperState();
}

class _AuthWrapperState extends State<AuthWrapper> {
  bool _showLogin = true;
  
  void _toggleView() {
    setState(() {
      _showLogin = !_showLogin;
    });
  }
  
  @override
  Widget build(BuildContext context) {
    if (_showLogin) {
      return LoginScreen(showSignupScreen: _toggleView);
    } else {
      return SignupScreen(showLoginScreen: _toggleView);
    }
  }
}
