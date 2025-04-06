import 'package:flutter/material.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  // Settings state
  bool _darkMode = false;
  bool _highContrast = false;
  bool _reduceMotion = false;
  bool _readingGuide = false;
  double _textSize = 1.0;
  bool _voiceControlEnabled = true;
  bool _notificationsEnabled = true;
  String _selectedLanguage = 'English';
  
  final List<String> languages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Chinese',
    'Japanese',
  ];
  
  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Settings',
            style: textTheme.displayLarge,
          ),
          const SizedBox(height: 24),
          
          // Profile section
          _buildProfileSection(),
          const SizedBox(height: 24),
          
          // Accessibility section
          _buildSettingsSection(
            'Accessibility',
            [
              _buildSwitchSetting(
                'Dark Mode',
                'Use a darker color scheme',
                Icons.dark_mode,
                _darkMode,
                (value) {
                  setState(() {
                    _darkMode = value;
                  });
                },
              ),
              _buildSwitchSetting(
                'High Contrast',
                'Increase contrast for better visibility',
                Icons.contrast,
                _highContrast,
                (value) {
                  setState(() {
                    _highContrast = value;
                  });
                },
              ),
              _buildSwitchSetting(
                'Reduce Motion',
                'Minimize animations and motion effects',
                Icons.animation,
                _reduceMotion,
                (value) {
                  setState(() {
                    _reduceMotion = value;
                  });
                },
              ),
              _buildSwitchSetting(
                'Reading Guide',
                'Show a guide line to help with reading',
                Icons.menu_book,
                _readingGuide,
                (value) {
                  setState(() {
                    _readingGuide = value;
                  });
                },
              ),
              _buildSliderSetting(
                'Text Size',
                'Adjust the size of text throughout the app',
                Icons.text_fields,
                _textSize,
                (value) {
                  setState(() {
                    _textSize = value;
                  });
                },
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Preferences section
          _buildSettingsSection(
            'Preferences',
            [
              _buildSwitchSetting(
                'Voice Control',
                'Enable voice commands and voice assistant',
                Icons.mic,
                _voiceControlEnabled,
                (value) {
                  setState(() {
                    _voiceControlEnabled = value;
                  });
                },
              ),
              _buildSwitchSetting(
                'Notifications',
                'Receive reminders and updates',
                Icons.notifications,
                _notificationsEnabled,
                (value) {
                  setState(() {
                    _notificationsEnabled = value;
                  });
                },
              ),
              _buildDropdownSetting(
                'Language',
                'Select your preferred language',
                Icons.language,
                _selectedLanguage,
                languages,
                (value) {
                  if (value != null) {
                    setState(() {
                      _selectedLanguage = value;
                    });
                  }
                },
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Account section
          _buildSettingsSection(
            'Account',
            [
              _buildActionSetting(
                'Personal Information',
                'Update your profile details',
                Icons.person,
                () {},
              ),
              _buildActionSetting(
                'Privacy Settings',
                'Manage data sharing and privacy options',
                Icons.privacy_tip,
                () {},
              ),
              _buildActionSetting(
                'Sync Data',
                'Sync your data across devices',
                Icons.sync,
                () {},
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Support section
          _buildSettingsSection(
            'Support',
            [
              _buildActionSetting(
                'Help Center',
                'Get help and support',
                Icons.help,
                () {},
              ),
              _buildActionSetting(
                'Feedback',
                'Share your thoughts and suggestions',
                Icons.feedback,
                () {},
              ),
              _buildActionSetting(
                'About Pravi',
                'Learn more about the app',
                Icons.info,
                () {},
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Sign out button
          Center(
            child: ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red[400],
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: const Text('Sign Out'),
            ),
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }
  
  Widget _buildProfileSection() {
    final colorScheme = Theme.of(context).colorScheme;
    
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            CircleAvatar(
              backgroundColor: colorScheme.primary,
              radius: 40,
              child: const Text(
                'A',
                style: TextStyle(
                  fontSize: 30,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Alex Johnson',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'alex.johnson@example.com',
                    style: TextStyle(
                      color: Colors.grey[600],
                    ),
                  ),
                  const SizedBox(height: 8),
                  OutlinedButton(
                    onPressed: () {},
                    style: OutlinedButton.styleFrom(
                      foregroundColor: colorScheme.primary,
                      side: BorderSide(color: colorScheme.primary),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text('Edit Profile'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildSettingsSection(String title, List<Widget> settings) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: Theme.of(context).textTheme.displayMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 16),
        Card(
          elevation: 2,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            children: settings,
          ),
        ),
      ],
    );
  }
  
  Widget _buildSwitchSetting(
    String title,
    String subtitle,
    IconData icon,
    bool value,
    Function(bool) onChanged,
  ) {
    final colorScheme = Theme.of(context).colorScheme;
    
    return ListTile(
      leading: Icon(
        icon,
        color: colorScheme.primary,
      ),
      title: Text(title),
      subtitle: Text(
        subtitle,
        style: TextStyle(
          color: Colors.grey[600],
          fontSize: 14,
        ),
      ),
      trailing: Switch(
        value: value,
        onChanged: onChanged,
        activeColor: colorScheme.primary,
      ),
    );
  }
  
  Widget _buildSliderSetting(
    String title,
    String subtitle,
    IconData icon,
    double value,
    Function(double) onChanged,
  ) {
    final colorScheme = Theme.of(context).colorScheme;
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ListTile(
          leading: Icon(
            icon,
            color: colorScheme.primary,
          ),
          title: Text(title),
          subtitle: Text(
            subtitle,
            style: TextStyle(
              color: Colors.grey[600],
              fontSize: 14,
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Row(
            children: [
              const Text('A', style: TextStyle(fontSize: 14)),
              Expanded(
                child: Slider(
                  value: value,
                  min: 0.5,
                  max: 1.5,
                  divisions: 4,
                  label: value.toStringAsFixed(1) + 'x',
                  onChanged: onChanged,
                  activeColor: colorScheme.primary,
                ),
              ),
              const Text('A', style: TextStyle(fontSize: 24)),
            ],
          ),
        ),
      ],
    );
  }
  
  Widget _buildDropdownSetting(
    String title,
    String subtitle,
    IconData icon,
    String value,
    List<String> options,
    Function(String?) onChanged,
  ) {
    final colorScheme = Theme.of(context).colorScheme;
    
    return ListTile(
      leading: Icon(
        icon,
        color: colorScheme.primary,
      ),
      title: Text(title),
      subtitle: Text(
        subtitle,
        style: TextStyle(
          color: Colors.grey[600],
          fontSize: 14,
        ),
      ),
      trailing: DropdownButton<String>(
        value: value,
        icon: const Icon(Icons.arrow_drop_down),
        elevation: 16,
        style: TextStyle(color: colorScheme.primary),
        underline: Container(
          height: 2,
          color: colorScheme.primary,
        ),
        onChanged: onChanged,
        items: options.map<DropdownMenuItem<String>>((String value) {
          return DropdownMenuItem<String>(
            value: value,
            child: Text(value),
          );
        }).toList(),
      ),
    );
  }
  
  Widget _buildActionSetting(
    String title,
    String subtitle,
    IconData icon,
    VoidCallback onTap,
  ) {
    final colorScheme = Theme.of(context).colorScheme;
    
    return ListTile(
      leading: Icon(
        icon,
        color: colorScheme.primary,
      ),
      title: Text(title),
      subtitle: Text(
        subtitle,
        style: TextStyle(
          color: Colors.grey[600],
          fontSize: 14,
        ),
      ),
      trailing: const Icon(Icons.chevron_right),
      onTap: onTap,
    );
  }
}