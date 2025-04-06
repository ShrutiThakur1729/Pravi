import 'package:flutter/material.dart';
import 'dart:async';

class SplashScreen extends StatefulWidget {
  final Widget nextScreen;
  
  const SplashScreen({Key? key, required this.nextScreen}) : super(key: key);

  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  int _splashStep = 0;
  late AnimationController _controller;
  late Animation<double> _animation;
  
  @override
  void initState() {
    super.initState();
    
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    
    _animation = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    );
    
    _controller.forward();
    
    Timer(const Duration(milliseconds: 1500), () {
      if (mounted) {
        setState(() {
          _splashStep = 1;
          _controller.reset();
          _controller.forward();
        });
      }
    });
    
    Timer(const Duration(milliseconds: 3000), () {
      if (mounted) {
        setState(() {
          _splashStep = 2;
          _controller.reset();
          _controller.forward();
        });
      }
    });
    
    Timer(const Duration(milliseconds: 4500), () {
      if (mounted) {
        Navigator.pushReplacement(
          context,
          PageRouteBuilder(
            pageBuilder: (_, __, ___) => widget.nextScreen,
            transitionDuration: const Duration(milliseconds: 500),
            transitionsBuilder: (_, animation, __, child) {
              return FadeTransition(
                opacity: animation,
                child: child,
              );
            },
          ),
        );
      }
    });
  }
  
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Center(
        child: FadeTransition(
          opacity: _animation,
          child: _splashStep == 0
              ? Image.asset(
                  'assets/images/brain_logo.png',
                  width: 200,
                  height: 200,
                )
              : _splashStep == 1
                  ? Image.asset(
                      'assets/images/p_logo.png',
                      width: 200,
                      height: 200,
                    )
                  : Image.asset(
                      'assets/images/pravi_text_logo.png',
                      width: 240,
                      height: 100,
                    ),
        ),
      ),
    );
  }
}
