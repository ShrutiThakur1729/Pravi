import 'package:flutter/material.dart';

class AppTheme {
  static const Color primaryPink = Color(0xFFFFA5BA);
  static const Color secondaryMint = Color(0xFF97E5D7);
  static const Color accentBlue = Color(0xFFA5D4FF);
  static const Color textDark = Color(0xFF4A4A4A);
  static const Color backgroundLight = Color(0xFFF8F5FA);
  static const Color cardBackground = Color(0xFFFFFBFF);
  
  static ThemeData get lightTheme {
    return ThemeData(
      primaryColor: primaryPink,
      scaffoldBackgroundColor: backgroundLight,
      appBarTheme: const AppBarTheme(
        backgroundColor: primaryPink,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          fontFamily: 'Nunito',
          fontSize: 22,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
        iconTheme: IconThemeData(color: Colors.white),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: cardBackground,
        selectedItemColor: primaryPink,
        unselectedItemColor: Color(0xFFB8B8B8),
        showSelectedLabels: true,
        showUnselectedLabels: true,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
      textTheme: const TextTheme(
        displayLarge: TextStyle(
          fontFamily: 'Nunito',
          fontSize: 28,
          fontWeight: FontWeight.bold,
          color: textDark,
        ),
        displayMedium: TextStyle(
          fontFamily: 'Nunito',
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: textDark,
        ),
        displaySmall: TextStyle(
          fontFamily: 'Nunito',
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: textDark,
        ),
        bodyLarge: TextStyle(
          fontFamily: 'Nunito',
          fontSize: 16,
          color: textDark,
        ),
        bodyMedium: TextStyle(
          fontFamily: 'Nunito',
          fontSize: 14,
          color: textDark,
        ),
      ),
      cardTheme: CardTheme(
        color: cardBackground,
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryPink,
          foregroundColor: Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(30),
          ),
          padding: const EdgeInsets.symmetric(vertical: 15, horizontal: 25),
          textStyle: const TextStyle(
            fontFamily: 'Nunito',
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(30),
          borderSide: BorderSide.none,
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 20,
          vertical: 16,
        ),
        hintStyle: const TextStyle(
          fontFamily: 'Nunito',
          fontSize: 14,
          color: Color(0xFFB8B8B8),
        ),
      ),
      colorScheme: ColorScheme.light(
        primary: primaryPink,
        secondary: secondaryMint,
        tertiary: accentBlue,
        onPrimary: Colors.white,
        background: backgroundLight,
        surface: cardBackground,
        onBackground: textDark,
        onSurface: textDark,
      ),
    );
  }
}
