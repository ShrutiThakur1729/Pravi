import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'dart:async';

class SplashScreen extends StatefulWidget {
  final VoidCallback onComplete;
  
  const SplashScreen({Key? key, required this.onComplete}) : super(key: key);

  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  int _currentStage = 0;
  final int _totalStages = 3;
  late Timer _timer;
  
  @override
  void initState() {
    super.initState();
    
    // Start the splash screen sequence
    _timer = Timer.periodic(Duration(seconds: 2), (timer) {
      setState(() {
        if (_currentStage < _totalStages - 1) {
          _currentStage++;
        } else {
          _timer.cancel();
          widget.onComplete();
        }
      });
    });
  }
  
  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }
  
  Widget _buildSplashContent() {
    switch (_currentStage) {
      case 0:
        return Image.asset(
          'assets/images/brain_logo.png',
          height: 150,
        )
        .animate()
        .scale(
          duration: 800.ms,
          curve: Curves.easeOutBack,
          begin: const Offset(0.5, 0.5),
          end: const Offset(1.0, 1.0),
        )
        .then()
        .fadeOut(
          delay: 1000.ms,
          duration: 500.ms,
        );
      case 1:
        return Image.asset(
          'assets/images/p_logo.png',
          height: 150,
        )
        .animate()
        .fade(
          duration: 500.ms,
          curve: Curves.easeIn,
        )
        .slideY(
          begin: 0.2,
          end: 0,
          duration: 500.ms,
          curve: Curves.easeOutCubic,
        )
        .then()
        .fadeOut(
          delay: 1000.ms,
          duration: 500.ms,
        );
      case 2:
        return Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(
              'assets/images/pravi_text.png',
              height: 80,
            ),
            const SizedBox(height: 16),
            Text(
              'Your Supportive Companion',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[700],
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        )
        .animate()
        .fade(
          duration: 800.ms,
          curve: Curves.easeIn,
        )
        .slideY(
          begin: 0.1,
          end: 0,
          duration: 800.ms,
          curve: Curves.easeOutCubic,
        );
      default:
        return const SizedBox.shrink();
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFFD4E6FF),
              Color(0xFFFAF5FF),
            ],
          ),
        ),
        child: Center(
          child: _buildSplashContent(),
        ),
      ),
    );
  }
}
