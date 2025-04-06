import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../widgets/haru_chat_widget.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundLight,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeader(),
            Expanded(
              child: _buildContent(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Logo and title
          Row(
            children: [
              Image.asset(
                'assets/images/brain_logo.png',
                width: 32,
                height: 32,
              ),
              const SizedBox(width: 8),
              const Text(
                'Pravi',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF4A4A4A),
                ),
              ),
            ],
          ),
          // Avatar
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: AppTheme.secondaryMint.withOpacity(0.3),
              shape: BoxShape.circle,
            ),
            child: const Center(
              child: Icon(
                Icons.person,
                color: AppTheme.secondaryMint,
                size: 24,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContent() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Greeting
          Text(
            'Hello Jamie!',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: AppTheme.textDark,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'How are you feeling today?',
            style: TextStyle(
              fontSize: 16,
              color: AppTheme.textDark.withOpacity(0.7),
            ),
          ),
          const SizedBox(height: 24),
          
          // Chat with Haru Card
          _buildFeatureCard(
            title: 'Chat with Haru',
            description: 'Your supportive AI companion is here to help',
            icon: Icons.chat_bubble_rounded,
            color: AppTheme.accentBlue,
            hasChatWidget: true,
          ),
          const SizedBox(height: 16),
          
          // Daily Support Card
          _buildFeatureCard(
            title: 'Daily Support',
            description: 'Track your tasks and emotions',
            icon: Icons.calendar_today_rounded,
            color: AppTheme.secondaryMint,
          ),
          const SizedBox(height: 16),
          
          // Learning Modules Card
          _buildFeatureCard(
            title: 'Learning Modules',
            description: 'Explore personalized learning content',
            icon: Icons.school_rounded,
            color: AppTheme.primaryPink,
          ),
          const SizedBox(height: 16),
          
          // Resources Card
          _buildFeatureCard(
            title: 'Resources',
            description: 'Find helpful tools and articles',
            icon: Icons.category_rounded,
            color: Colors.purple.shade300,
          ),
        ],
      ),
    );
  }

  Widget _buildFeatureCard({
    required String title,
    required String description,
    required IconData icon,
    required Color color,
    bool hasChatWidget = false,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Icon(
                    icon,
                    color: color,
                    size: 28,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF4A4A4A),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        description,
                        style: TextStyle(
                          fontSize: 14,
                          color: AppTheme.textDark.withOpacity(0.7),
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(
                  Icons.arrow_forward_ios_rounded,
                  color: color,
                  size: 16,
                ),
              ],
            ),
          ),
          if (hasChatWidget) ...[
            Container(
              height: 1,
              color: Colors.grey.withOpacity(0.1),
            ),
            SizedBox(
              height: 300,
              child: ClipRRect(
                borderRadius: const BorderRadius.only(
                  bottomLeft: Radius.circular(24),
                  bottomRight: Radius.circular(24),
                ),
                child: HaruChatWidget(),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
