import 'package:flutter/material.dart';

class LearningScreen extends StatefulWidget {
  const LearningScreen({super.key});

  @override
  State<LearningScreen> createState() => _LearningScreenState();
}

class _LearningScreenState extends State<LearningScreen> {
  int _selectedTab = 0;
  
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
            'Learning',
            style: textTheme.displayLarge,
          ),
          const SizedBox(height: 24),
          
          // Learning modules tabs
          _buildTabs(),
          const SizedBox(height: 24),
          
          // Learning content based on selected tab
          _selectedTab == 0
              ? _buildModuleList()
              : _selectedTab == 1
                  ? _buildInProgressModules()
                  : _buildCompletedModules(),
        ],
      ),
    );
  }
  
  Widget _buildTabs() {
    final colorScheme = Theme.of(context).colorScheme;
    
    return Container(
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          _buildTabButton('All Modules', 0),
          _buildTabButton('In Progress', 1),
          _buildTabButton('Completed', 2),
        ],
      ),
    );
  }
  
  Widget _buildTabButton(String label, int index) {
    final colorScheme = Theme.of(context).colorScheme;
    final isSelected = _selectedTab == index;
    
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            _selectedTab = index;
          });
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? colorScheme.primary : Colors.transparent,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Center(
            child: Text(
              label,
              style: TextStyle(
                color: isSelected ? Colors.white : Colors.grey[700],
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ),
        ),
      ),
    );
  }
  
  Widget _buildModuleList() {
    // Sample module data
    final List<Map<String, dynamic>> modules = [
      {
        'title': 'Executive Functioning',
        'description': 'Learn strategies to improve organization, planning, and time management',
        'lessons': 5,
        'duration': '2 hours',
        'progress': 0.7,
        'imageAsset': 'assets/images/brain_logo.png',
      },
      {
        'title': 'Social Skills',
        'description': 'Develop better communication and social interaction abilities',
        'lessons': 6,
        'duration': '3 hours',
        'progress': 0.3,
        'imageAsset': 'assets/images/brain_logo.png',
      },
      {
        'title': 'Emotional Regulation',
        'description': 'Learn techniques to identify and manage emotions effectively',
        'lessons': 4,
        'duration': '1.5 hours',
        'progress': 0.0,
        'imageAsset': 'assets/images/brain_logo.png',
      },
      {
        'title': 'Sensory Processing',
        'description': 'Understand and manage sensory sensitivities in daily life',
        'lessons': 3,
        'duration': '1 hour',
        'progress': 0.0,
        'imageAsset': 'assets/images/brain_logo.png',
      },
      {
        'title': 'Focus and Attention',
        'description': 'Improve concentration and reduce distractions',
        'lessons': 4,
        'duration': '1.5 hours',
        'progress': 0.0,
        'imageAsset': 'assets/images/brain_logo.png',
      },
    ];
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Search bar
        Container(
          margin: const EdgeInsets.only(bottom: 16),
          decoration: BoxDecoration(
            color: Colors.grey[100],
            borderRadius: BorderRadius.circular(24),
          ),
          child: TextField(
            decoration: InputDecoration(
              hintText: 'Search modules',
              prefixIcon: const Icon(Icons.search),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(24),
                borderSide: BorderSide.none,
              ),
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 12,
              ),
            ),
          ),
        ),
        
        // Module cards
        ...modules.map((module) => _buildModuleCard(module)).toList(),
      ],
    );
  }
  
  Widget _buildInProgressModules() {
    // Filter only in-progress modules
    final List<Map<String, dynamic>> modules = [
      {
        'title': 'Executive Functioning',
        'description': 'Learn strategies to improve organization, planning, and time management',
        'lessons': 5,
        'duration': '2 hours',
        'progress': 0.7,
        'imageAsset': 'assets/images/brain_logo.png',
      },
      {
        'title': 'Social Skills',
        'description': 'Develop better communication and social interaction abilities',
        'lessons': 6,
        'duration': '3 hours',
        'progress': 0.3,
        'imageAsset': 'assets/images/brain_logo.png',
      },
    ];
    
    return modules.isEmpty
        ? _buildEmptyState('No modules in progress', 'Start a module to see it here')
        : Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: modules.map((module) => _buildModuleCard(module)).toList(),
          );
  }
  
  Widget _buildCompletedModules() {
    // No completed modules yet
    return _buildEmptyState(
      'No completed modules yet',
      'Your completed modules will appear here',
    );
  }
  
  Widget _buildEmptyState(String title, String subtitle) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 48.0),
        child: Column(
          children: [
            Icon(
              Icons.school_outlined,
              size: 80,
              color: Colors.grey[400],
            ),
            const SizedBox(height: 16),
            Text(
              title,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.grey[700],
              ),
            ),
            const SizedBox(height: 8),
            Text(
              subtitle,
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                setState(() {
                  _selectedTab = 0; // Switch to "All Modules"
                });
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).colorScheme.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: const Text('Browse All Modules'),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildModuleCard(Map<String, dynamic> module) {
    final colorScheme = Theme.of(context).colorScheme;
    
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Image.asset(
                  module['imageAsset'],
                  width: 50,
                  height: 50,
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        module['title'],
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        module['description'],
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 14,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            
            // Module info
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildModuleInfoItem(Icons.assignment, '${module['lessons']} Lessons'),
                _buildModuleInfoItem(Icons.access_time, module['duration']),
                if (module['progress'] > 0)
                  _buildModuleInfoItem(
                    Icons.check_circle,
                    '${(module['progress'] * 100).toInt()}% Complete',
                  ),
              ],
            ),
            
            const SizedBox(height: 16),
            
            // Progress bar (if started)
            if (module['progress'] > 0) ...[
              LinearProgressIndicator(
                value: module['progress'],
                backgroundColor: Colors.grey[200],
                valueColor: AlwaysStoppedAnimation<Color>(colorScheme.primary),
                borderRadius: BorderRadius.circular(10),
                minHeight: 8,
              ),
              const SizedBox(height: 16),
            ],
            
            // Action button
            Center(
              child: ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: module['progress'] > 0
                      ? colorScheme.primary
                      : Colors.green,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: Text(
                  module['progress'] > 0 ? 'Continue' : 'Start',
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildModuleInfoItem(IconData icon, String text) {
    return Column(
      children: [
        Icon(
          icon,
          color: Colors.grey[700],
          size: 20,
        ),
        const SizedBox(height: 4),
        Text(
          text,
          style: TextStyle(
            color: Colors.grey[700],
            fontSize: 12,
          ),
        ),
      ],
    );
  }
}