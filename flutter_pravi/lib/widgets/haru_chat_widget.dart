import 'package:flutter/material.dart';
import '../services/gemini_service.dart';
import '../theme/app_theme.dart';

class HaruChatWidget extends StatefulWidget {
  const HaruChatWidget({Key? key}) : super(key: key);

  @override
  _HaruChatWidgetState createState() => _HaruChatWidgetState();
}

class _HaruChatWidgetState extends State<HaruChatWidget> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final GeminiService _geminiService = GeminiService();
  
  final List<Map<String, dynamic>> _messages = [
    {
      'isUser': false,
      'message': 'Hi there! I\'m Haru, your personal assistant. How can I help you today?',
      'timestamp': DateTime.now().subtract(const Duration(minutes: 5)),
    },
  ];
  
  bool _isTyping = false;
  
  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }
  
  void _sendMessage() async {
    if (_messageController.text.trim().isEmpty) return;
    
    final userMessage = _messageController.text.trim();
    _messageController.clear();
    
    setState(() {
      _messages.add({
        'isUser': true,
        'message': userMessage,
        'timestamp': DateTime.now(),
      });
      _isTyping = true;
    });
    
    _scrollToBottom();
    
    try {
      final response = await _geminiService.sendMessage(userMessage);
      
      setState(() {
        _messages.add({
          'isUser': false,
          'message': response,
          'timestamp': DateTime.now(),
        });
        _isTyping = false;
      });
      
      _scrollToBottom();
    } catch (e) {
      setState(() {
        _messages.add({
          'isUser': false,
          'message': 'I\'m having trouble connecting right now. Can we try again in a moment?',
          'timestamp': DateTime.now(),
        });
        _isTyping = false;
      });
      
      _scrollToBottom();
    }
  }
  
  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }
  
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Expanded(
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            decoration: BoxDecoration(
              color: AppTheme.backgroundLight,
              image: DecorationImage(
                image: AssetImage('assets/images/ui_reference.png'),
                opacity: 0.05,
                fit: BoxFit.cover,
              ),
            ),
            child: ListView.builder(
              controller: _scrollController,
              itemCount: _messages.length + (_isTyping ? 1 : 0),
              padding: const EdgeInsets.only(top: 16, bottom: 16),
              itemBuilder: (context, index) {
                if (index == _messages.length) {
                  // Show typing indicator
                  return _buildMessage(
                    isUser: false,
                    message: 'Typing...',
                    timestamp: DateTime.now(),
                    isTyping: true,
                  );
                }
                
                final message = _messages[index];
                return _buildMessage(
                  isUser: message['isUser'],
                  message: message['message'],
                  timestamp: message['timestamp'],
                );
              },
            ),
          ),
        ),
        _buildInputArea(),
      ],
    );
  }
  
  Widget _buildMessage({
    required bool isUser,
    required String message,
    required DateTime timestamp,
    bool isTyping = false,
  }) {
    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: EdgeInsets.only(
          top: 8,
          bottom: 8,
          left: isUser ? 64 : 0,
          right: isUser ? 0 : 64,
        ),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: isUser 
              ? AppTheme.primaryPink.withOpacity(0.9)
              : Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 5,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (!isUser && !isTyping) ...[
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 30,
                    height: 30,
                    decoration: BoxDecoration(
                      color: AppTheme.secondaryMint.withOpacity(0.3),
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: Text(
                        'H',
                        style: TextStyle(
                          color: AppTheme.secondaryMint,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'Haru',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: AppTheme.textDark,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
            ],
            isTyping
                ? Row(
                    children: [
                      _buildTypingDot(0),
                      _buildTypingDot(1),
                      _buildTypingDot(2),
                    ],
                  )
                : Text(
                    message,
                    style: TextStyle(
                      color: isUser ? Colors.white : AppTheme.textDark,
                      fontSize: 15,
                    ),
                  ),
            const SizedBox(height: 4),
            Text(
              '${timestamp.hour}:${timestamp.minute.toString().padLeft(2, '0')}',
              style: TextStyle(
                color: isUser 
                    ? Colors.white.withOpacity(0.7)
                    : Colors.grey[500],
                fontSize: 10,
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildTypingDot(int index) {
    return Container(
      margin: EdgeInsets.only(right: 4),
      child: AnimatedOpacity(
        opacity: _isTyping ? 1.0 : 0.2,
        duration: Duration(milliseconds: 500 + (index * 100)),
        child: Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(
            color: AppTheme.secondaryMint,
            shape: BoxShape.circle,
          ),
        ),
      ),
    );
  }
  
  Widget _buildInputArea() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: Row(
        children: [
          IconButton(
            icon: Icon(
              Icons.sentiment_satisfied_alt,
              color: AppTheme.secondaryMint,
            ),
            onPressed: () {
              // Add emoji picker functionality
            },
          ),
          Expanded(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(30),
              ),
              child: TextField(
                controller: _messageController,
                decoration: const InputDecoration(
                  hintText: 'Type a message...',
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.symmetric(vertical: 12),
                ),
                onSubmitted: (_) => _sendMessage(),
              ),
            ),
          ),
          const SizedBox(width: 8),
          Container(
            width: 45,
            height: 45,
            decoration: BoxDecoration(
              color: AppTheme.primaryPink,
              shape: BoxShape.circle,
            ),
            child: IconButton(
              icon: const Icon(
                Icons.send_rounded,
                color: Colors.white,
              ),
              onPressed: _sendMessage,
            ),
          ),
        ],
      ),
    );
  }
}
