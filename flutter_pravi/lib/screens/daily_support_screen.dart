import 'package:flutter/material.dart';

class DailySupportScreen extends StatefulWidget {
  const DailySupportScreen({super.key});

  @override
  State<DailySupportScreen> createState() => _DailySupportScreenState();
}

class _DailySupportScreenState extends State<DailySupportScreen> {
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
            'Daily Support',
            style: textTheme.displayLarge,
          ),
          const SizedBox(height: 24),
          
          // Daily tasks section
          _buildSectionHeader('My Tasks', 'Manage your daily tasks'),
          const SizedBox(height: 16),
          _buildTaskList(),
          
          const SizedBox(height: 32),
          
          // Emotion tracking section
          _buildSectionHeader('Emotion Tracking', 'Monitor your emotional well-being'),
          const SizedBox(height: 16),
          _buildEmotionTracker(),
          
          const SizedBox(height: 32),
          
          // Routines section
          _buildSectionHeader('My Routines', 'Stay on track with your daily routines'),
          const SizedBox(height: 16),
          _buildRoutinesList(),
          
          const SizedBox(height: 24),
        ],
      ),
    );
  }
  
  Widget _buildSectionHeader(String title, String subtitle) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: Theme.of(context).textTheme.displayMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          subtitle,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
            color: Colors.grey[600],
          ),
        ),
      ],
    );
  }
  
  Widget _buildTaskList() {
    final colorScheme = Theme.of(context).colorScheme;
    
    // Sample tasks data
    List<Map<String, dynamic>> tasks = [
      {'title': 'Morning meditation', 'completed': true, 'time': '8:00 AM'},
      {'title': 'Team meeting', 'completed': false, 'time': '10:30 AM'},
      {'title': 'Complete learning module', 'completed': false, 'time': '2:00 PM'},
      {'title': 'Evening routine', 'completed': false, 'time': '7:00 PM'},
    ];
    
    return Column(
      children: [
        // Task filter buttons
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            _buildFilterButton('All', true),
            _buildFilterButton('Morning', false),
            _buildFilterButton('Afternoon', false),
            _buildFilterButton('Evening', false),
          ],
        ),
        const SizedBox(height: 16),
        
        // Task list
        Card(
          elevation: 2,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: tasks.map((task) {
                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8.0),
                  child: Row(
                    children: [
                      Checkbox(
                        value: task['completed'],
                        activeColor: colorScheme.primary,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(4),
                        ),
                        onChanged: (bool? value) {},
                      ),
                      Expanded(
                        child: Text(
                          task['title'],
                          style: TextStyle(
                            decoration: task['completed'] ? TextDecoration.lineThrough : null,
                            color: task['completed'] ? Colors.grey : Colors.black,
                          ),
                        ),
                      ),
                      Text(
                        task['time'],
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                );
              }).toList(),
            ),
          ),
        ),
        
        // Add task button
        Padding(
          padding: const EdgeInsets.only(top: 16.0),
          child: ElevatedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.add),
            label: const Text('Add New Task'),
            style: ElevatedButton.styleFrom(
              backgroundColor: colorScheme.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
          ),
        ),
      ],
    );
  }
  
  Widget _buildFilterButton(String label, bool isSelected) {
    final colorScheme = Theme.of(context).colorScheme;
    
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: isSelected ? colorScheme.primary : Colors.transparent,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isSelected ? colorScheme.primary : Colors.grey[300]!,
        ),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: isSelected ? Colors.white : Colors.grey[700],
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
      ),
    );
  }
  
  Widget _buildEmotionTracker() {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'How are you feeling today?',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 16),
            
            // Emotion selection
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildEmotionButton('Happy', Icons.sentiment_very_satisfied, true),
                _buildEmotionButton('Okay', Icons.sentiment_satisfied, false),
                _buildEmotionButton('Sad', Icons.sentiment_dissatisfied, false),
                _buildEmotionButton('Anxious', Icons.sentiment_very_dissatisfied, false),
              ],
            ),
            
            const SizedBox(height: 16),
            
            // Notes field
            TextField(
              maxLines: 3,
              decoration: InputDecoration(
                hintText: 'Add notes about how you\'re feeling (optional)',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                filled: true,
                fillColor: Colors.grey[100],
              ),
            ),
            
            const SizedBox(height: 16),
            
            // Save button
            Center(
              child: ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).colorScheme.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text('Save'),
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildEmotionButton(String emotion, IconData icon, bool isSelected) {
    final colorScheme = Theme.of(context).colorScheme;
    
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: isSelected ? colorScheme.primary : Colors.grey[200],
            shape: BoxShape.circle,
          ),
          child: Icon(
            icon,
            color: isSelected ? Colors.white : Colors.grey[700],
            size: 28,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          emotion,
          style: TextStyle(
            color: isSelected ? colorScheme.primary : Colors.grey[700],
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ],
    );
  }
  
  Widget _buildRoutinesList() {
    final colorScheme = Theme.of(context).colorScheme;
    
    // Sample routines data
    List<Map<String, dynamic>> routines = [
      {
        'title': 'Morning Routine',
        'time': '7:00 AM - 9:00 AM',
        'progress': 0.75,
        'tasks': ['Wake up', 'Meditation', 'Breakfast', 'Medication'],
      },
      {
        'title': 'Work Preparation',
        'time': '9:00 AM - 10:00 AM',
        'progress': 0.5,
        'tasks': ['Check calendar', 'Review tasks', 'Set goals'],
      },
      {
        'title': 'Evening Routine',
        'time': '7:00 PM - 9:00 PM',
        'progress': 0.0,
        'tasks': ['Dinner', 'Relaxation', 'Prepare for tomorrow', 'Sleep routine'],
      },
    ];
    
    return Column(
      children: routines.map((routine) {
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
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      routine['title'],
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                    ),
                    Text(
                      routine['time'],
                      style: TextStyle(
                        color: Colors.grey[600],
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                
                // Progress bar
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Progress: ${(routine['progress'] * 100).toInt()}%',
                      style: TextStyle(
                        color: Colors.grey[700],
                      ),
                    ),
                    const SizedBox(height: 8),
                    LinearProgressIndicator(
                      value: routine['progress'],
                      backgroundColor: Colors.grey[200],
                      valueColor: AlwaysStoppedAnimation<Color>(colorScheme.primary),
                      borderRadius: BorderRadius.circular(10),
                      minHeight: 10,
                    ),
                  ],
                ),
                
                // Task list
                const SizedBox(height: 16),
                ...List.generate(routine['tasks'].length, (index) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 8.0),
                    child: Row(
                      children: [
                        Icon(
                          index < (routine['tasks'].length * routine['progress'])
                              ? Icons.check_circle
                              : Icons.circle_outlined,
                          color: index < (routine['tasks'].length * routine['progress'])
                              ? colorScheme.primary
                              : Colors.grey[400],
                          size: 20,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          routine['tasks'][index],
                          style: TextStyle(
                            color: index < (routine['tasks'].length * routine['progress'])
                                ? Colors.grey[600]
                                : Colors.black,
                            decoration: index < (routine['tasks'].length * routine['progress'])
                                ? TextDecoration.lineThrough
                                : null,
                          ),
                        ),
                      ],
                    ),
                  );
                }),
                
                // Start/Continue button
                const SizedBox(height: 16),
                Center(
                  child: ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: routine['progress'] > 0
                          ? colorScheme.primary
                          : Colors.green,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: Text(
                      routine['progress'] > 0 ? 'Continue' : 'Start',
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }
}