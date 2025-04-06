import 'package:flutter/material.dart';
import '../screens/home/home_screen.dart';
import '../screens/daily_support/daily_support_screen.dart';
import '../widgets/custom_nav_bar.dart';
import '../widgets/haru_chat_widget.dart';

class MainLayout extends StatefulWidget {
  const MainLayout({Key? key}) : super(key: key);

  @override
  _MainLayoutState createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  int _currentIndex = 0;
  late final List<Widget> _screens;
  
  @override
  void initState() {
    super.initState();
    _screens = [
      HomeScreen(),
      DailySupportScreen(),
      // Full chat screen
      Scaffold(
        body: SafeArea(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: Color(0xFF97E5D7).withOpacity(0.3),
                        shape: BoxShape.circle,
                      ),
                      child: Center(
                        child: Text(
                          'H',
                          style: TextStyle(
                            color: Color(0xFF97E5D7),
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Haru',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF4A4A4A),
                      ),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: HaruChatWidget(),
              ),
            ],
          ),
        ),
      ),
      // Learning modules screen (placeholder)
      Container(
        color: Colors.white,
        child: Center(
          child: Text(
            'Learning Modules Coming Soon',
            style: TextStyle(fontSize: 18),
          ),
        ),
      ),
      // Profile screen (placeholder)
      Container(
        color: Colors.white,
        child: Center(
          child: Text(
            'Profile Screen Coming Soon',
            style: TextStyle(fontSize: 18),
          ),
        ),
      ),
    ];
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: CustomNavBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
    );
  }
}
