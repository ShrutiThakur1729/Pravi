import 'package:flutter/material.dart';
import '../../services/gemini_service.dart';

class DailySupportScreen extends StatefulWidget {
  const DailySupportScreen({Key? key}) : super(key: key);

  @override
  _DailySupportScreenState createState() => _DailySupportScreenState();
}

class _DailySupportScreenState extends State<DailySupportScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final GeminiService _geminiService = GeminiService();
  
  // For emotion tracker
  String _selectedEmotion = '';
  List<String> _copingStrategies = [];
  bool _loadingStrategies = false;
  
  // For task list
  final TextEditingController _taskController = TextEditingController();
  final List<Map<String, dynamic>> _tasks = [
    {
      'title': 'Morning meditation',
      'completed': true,
      'time': '8:00 AM',
    },
    {
      'title': 'Work on project',
      'completed': false,
      'time': '10:00 AM',
    },
    {
      'title': 'Lunch break',
      'completed': false,
      'time': '12:30 PM',
    },
    {
      'title': 'Exercise',
      'completed': false,
      'time': '5:00 PM',
    },
  ];
  
  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }
  
  @override
  void dispose() {
    _tabController.dispose();
    _taskController.dispose();
    super.dispose();
  }
  
  Future<void> _getCopingStrategies(String emotion) async {
    setState(() {
      _loadingStrategies = true;
      _selectedEmotion = emotion;
    });
    
    try {
      final strategies = await _geminiService.generateCopingStrategies(emotion);
      setState(() {
        _copingStrategies = strategies;
        _loadingStrategies = false;
      });
    } catch (e) {
      setState(() {
        _copingStrategies = [
          'Take deep breaths',
          'Go for a short walk',
          'Listen to calming music',
        ];
        _loadingStrategies = false;
      });
    }
  }
  
  void _addTask() {
    if (_taskController.text.isNotEmpty) {
      setState(() {
        _tasks.add({
          'title': _taskController.text,
          'completed': false,
          'time': '${DateTime.now().hour}:${DateTime.now().minute.toString().padLeft(2, '0')} ${DateTime.now().hour >= 12 ? 'PM' : 'AM'}',
        });
        _taskController.clear();
      });
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
        child: SafeArea(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Text(
                  'Daily Support',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF6A5ACD),
                  ),
                ),
              ),
              Container(
                margin: EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.5),
                  borderRadius: BorderRadius.circular(24),
                ),
                child: TabBar(
                  controller: _tabController,
                  indicator: BoxDecoration(
                    borderRadius: BorderRadius.circular(24),
                    color: Color(0xFF6A5ACD),
                  ),
                  labelColor: Colors.white,
                  unselectedLabelColor: Color(0xFF6A5ACD),
                  tabs: [
                    Tab(
                      text: 'Tasks',
                      icon: Icon(Icons.check_circle_outline),
                    ),
                    Tab(
                      text: 'Emotions',
                      icon: Icon(Icons.mood),
                    ),
                  ],
                ),
              ),
              SizedBox(height: 16),
              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    // Tasks Tab
                    _buildTasksTab(),
                    
                    // Emotions Tab
                    _buildEmotionsTab(),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
  
  Widget _buildTasksTab() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        children: [
          // Add new task
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _taskController,
                  decoration: InputDecoration(
                    hintText: 'Add a new task',
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                    contentPadding: EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 16,
                    ),
                  ),
                  onSubmitted: (_) => _addTask(),
                ),
              ),
              SizedBox(width: 8),
              Container(
                decoration: BoxDecoration(
                  color: Color(0xFF6A5ACD),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: IconButton(
                  icon: Icon(Icons.add, color: Colors.white),
                  onPressed: _addTask,
                ),
              ),
            ],
          ),
          SizedBox(height: 16),
          
          // Task list
          Expanded(
            child: _tasks.isEmpty
                ? Center(
                    child: Text(
                      'No tasks yet. Add one to get started!',
                      style: TextStyle(
                        color: Colors.grey[600],
                        fontSize: 16,
                      ),
                    ),
                  )
                : ListView.builder(
                    itemCount: _tasks.length,
                    itemBuilder: (context, index) {
                      final task = _tasks[index];
                      return Container(
                        margin: EdgeInsets.only(bottom: 12),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.05),
                              blurRadius: 10,
                              offset: Offset(0, 4),
                            ),
                          ],
                        ),
                        child: ListTile(
                          leading: Checkbox(
                            value: task['completed'],
                            shape: CircleBorder(),
                            activeColor: Color(0xFF6A5ACD),
                            onChanged: (value) {
                              setState(() {
                                task['completed'] = value;
                              });
                            },
                          ),
                          title: Text(
                            task['title'],
                            style: TextStyle(
                              decoration: task['completed']
                                  ? TextDecoration.lineThrough
                                  : null,
                              color: task['completed']
                                  ? Colors.grey[500]
                                  : Colors.black87,
                            ),
                          ),
                          subtitle: Text(
                            task['time'],
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[600],
                            ),
                          ),
                          trailing: IconButton(
                            icon: Icon(Icons.delete_outline, color: Colors.red[300]),
                            onPressed: () {
                              setState(() {
                                _tasks.removeAt(index);
                              });
                            },
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildEmotionsTab() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'How are you feeling today?',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),
          SizedBox(height: 16),
          
          // Emotion grid
          Container(
            padding: EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  offset: Offset(0, 4),
                ),
              ],
            ),
            child: GridView.count(
              shrinkWrap: true,
              crossAxisCount: 3,
              childAspectRatio: 1.3,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              physics: NeverScrollableScrollPhysics(),
              children: [
                _buildEmotionButton('Happy', Colors.amber, '😊'),
                _buildEmotionButton('Calm', Colors.blue, '😌'),
                _buildEmotionButton('Energetic', Colors.orange, '⚡'),
                _buildEmotionButton('Anxious', Colors.purple, '😰'),
                _buildEmotionButton('Sad', Colors.indigo, '😢'),
                _buildEmotionButton('Frustrated', Colors.red, '😤'),
                _buildEmotionButton('Overwhelmed', Colors.teal, '😵'),
                _buildEmotionButton('Tired', Colors.brown, '😪'),
                _buildEmotionButton('Confused', Colors.grey, '🤔'),
              ],
            ),
          ),
          SizedBox(height: 24),
          
          // Coping strategies section
          if (_selectedEmotion.isNotEmpty) ...[
            Text(
              _loadingStrategies
                  ? 'Finding strategies...'
                  : 'Strategies for feeling $_selectedEmotion',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
            SizedBox(height: 16),
            _loadingStrategies
                ? Center(child: CircularProgressIndicator())
                : Container(
                    padding: EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          blurRadius: 10,
                          offset: Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      children: _copingStrategies.map((strategy) {
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 8.0),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Icon(
                                Icons.lightbulb_outline,
                                color: Color(0xFF6A5ACD),
                                size: 20,
                              ),
                              SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  strategy,
                                  style: TextStyle(
                                    fontSize: 16,
                                    color: Colors.black87,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        );
                      }).toList(),
                    ),
                  ),
          ],
        ],
      ),
    );
  }
  
  Widget _buildEmotionButton(String emotion, Color color, String emoji) {
    final isSelected = _selectedEmotion == emotion;
    
    return GestureDetector(
      onTap: () {
        _getCopingStrategies(emotion);
      },
      child: Container(
        decoration: BoxDecoration(
          color: isSelected ? color.withOpacity(0.3) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? color : Colors.grey.withOpacity(0.3),
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              emoji,
              style: TextStyle(fontSize: 24),
            ),
            SizedBox(height: 4),
            Text(
              emotion,
              style: TextStyle(
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
