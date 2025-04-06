import 'package:flutter/material.dart';
import 'package:animated_text_kit/animated_text_kit.dart';
import 'package:google_fonts/google_fonts.dart';
import 'dart:async';

// Screens
import 'screens/home_screen.dart';

void main() {
  runApp(const PraviApp());
}

class PraviApp extends StatelessWidget {
  const PraviApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Pravi',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF69B6D5), // Primary blue color
          secondary: const Color(0xFFE091B9), // Secondary pink color
          tertiary: const Color(0xFF87DFD1), // Mint green color
        ),
        useMaterial3: true,
        fontFamily: GoogleFonts.nunito().fontFamily,
        textTheme: TextTheme(
          displayLarge: const TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
          ),
          displayMedium: GoogleFonts.nunito(
            fontSize: 24,
            fontWeight: FontWeight.w600,
          ),
          bodyLarge: GoogleFonts.nunito(
            fontSize: 18,
            fontWeight: FontWeight.w400,
          ),
          bodyMedium: GoogleFonts.nunito(
            fontSize: 16,
            fontWeight: FontWeight.w400,
          ),
        ),
      ),
      home: const SplashScreenSequence(),
    );
  }
}

class SplashScreenSequence extends StatefulWidget {
  const SplashScreenSequence({super.key});

  @override
  State<SplashScreenSequence> createState() => _SplashScreenSequenceState();
}

class _SplashScreenSequenceState extends State<SplashScreenSequence> with SingleTickerProviderStateMixin {
  int _currentScreen = 0;
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  
  @override
  void initState() {
    super.initState();
    
    // Initialize animation controller
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeIn)
    );
    
    // Start the animation
    _controller.forward();
    
    // Schedule the splash screen sequence
    Timer(const Duration(milliseconds: 1500), () {
      if (mounted) {
        setState(() {
          _currentScreen = 1;
          _controller.reset();
          _controller.forward();
        });
      }
    });
    
    Timer(const Duration(milliseconds: 3000), () {
      if (mounted) {
        setState(() {
          _currentScreen = 2;
          _controller.reset();
          _controller.forward();
        });
      }
    });
    
    // Navigate to home screen after the entire sequence
    Timer(const Duration(milliseconds: 4500), () {
      if (mounted) {
        Navigator.of(context).pushReplacement(
          PageRouteBuilder(
            pageBuilder: (context, animation, secondaryAnimation) => HomeScreen(),
            transitionsBuilder: (context, animation, secondaryAnimation, child) {
              const begin = Offset(1.0, 0.0);
              const end = Offset.zero;
              const curve = Curves.easeInOut;
              var tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
              var offsetAnimation = animation.drive(tween);
              return SlideTransition(position: offsetAnimation, child: child);
            },
            transitionDuration: const Duration(milliseconds: 800),
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
          opacity: _fadeAnimation,
          child: _buildCurrentScreen(),
        ),
      ),
    );
  }
  
  Widget _buildCurrentScreen() {
    switch (_currentScreen) {
      case 0:
        // Brain logo
        return Image.asset(
          'assets/images/brain_logo.png',
          width: 200,
          height: 200,
        );
      case 1:
        // P logo
        return Image.asset(
          'assets/images/p_logo.png',
          width: 200,
          height: 200,
        );
      case 2:
        // Pravi text logo
        return Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(
              'assets/images/pravi_text.png',
              width: 240,
              height: 100,
            ),
            const SizedBox(height: 20),
            AnimatedTextKit(
              animatedTexts: [
                TypewriterAnimatedText(
                  'Supporting Neurodiversity',
                  textStyle: GoogleFonts.nunito(
                    fontSize: 20,
                    color: Colors.white,
                    fontWeight: FontWeight.w300,
                  ),
                  speed: const Duration(milliseconds: 80),
                ),
              ],
              isRepeatingAnimation: false,
            ),
          ],
        );
      default:
        return const SizedBox.shrink();
    }
  }
}
