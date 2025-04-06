import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class CustomNavBar extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;

  const CustomNavBar({
    Key? key,
    required this.currentIndex,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 80,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(30),
          topRight: Radius.circular(30),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _buildNavItem(0, 'Home', Icons.home_rounded),
          _buildNavItem(1, 'Daily', Icons.calendar_today_rounded),
          _buildNavItem(2, 'Chat', Icons.chat_bubble_rounded),
          _buildNavItem(3, 'Learn', Icons.school_rounded),
          _buildNavItem(4, 'Profile', Icons.person_rounded),
        ],
      ),
    );
  }

  Widget _buildNavItem(int index, String label, IconData icon) {
    final isSelected = currentIndex == index;
    
    // Choose colors based on selection state
    final Color bgColor = isSelected
        ? index == 0
            ? AppTheme.primaryPink.withOpacity(0.2)
            : index == 1
                ? AppTheme.secondaryMint.withOpacity(0.2)
                : index == 2
                    ? AppTheme.accentBlue.withOpacity(0.2)
                    : index == 3
                        ? AppTheme.primaryPink.withOpacity(0.2)
                        : AppTheme.secondaryMint.withOpacity(0.2)
        : Colors.transparent;
    
    final Color iconColor = isSelected
        ? index == 0
            ? AppTheme.primaryPink
            : index == 1
                ? AppTheme.secondaryMint
                : index == 2
                    ? AppTheme.accentBlue
                    : index == 3
                        ? AppTheme.primaryPink
                        : AppTheme.secondaryMint
        : const Color(0xFFB8B8B8);
    
    return GestureDetector(
      onTap: () => onTap(index),
      child: Container(
        width: 60,
        height: 60,
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              color: iconColor,
              size: 24,
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                color: iconColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
