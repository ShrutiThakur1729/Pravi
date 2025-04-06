import 'package:flutter/material.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:flutter_tts/flutter_tts.dart';
import '../services/gemini_service.dart';

class ChatMessage {
  final String text;
  final bool isUser;
  final DateTime timestamp;
  
  ChatMessage({
    required this.text,
    required this.isUser,
    required this.timestamp,
  });
}

class HaruChatWidget extends StatefulWidget {
  const HaruChatWidget({Key? key}) : super(key: key);

  @override
  _HaruChatWidgetState createState() => _HaruChatWidgetState();
}

class _HaruChatWidgetState extends State<HaruChatWidget> {
  final TextEditingController _textController = TextEditingController();
  final List<ChatMessage> _messages = [];
  final stt.SpeechToText _speech = stt.SpeechToText();
  final FlutterTts _flutterTts = FlutterTts();
  bool _isListening = false;
  bool _isSending = false;
  final ScrollController _scrollController = ScrollController();
  
  late GeminiService _geminiService;
  bool _isGeminiAvailable = false;
  
  @override
  void initState() {
    super.initState();
    _initSpeechRecognizer();
    _initTextToSpeech();
    _initGemini();
    
    // Add welcome message
    _addMessage(
      'Hi there! I\'m Haru, your supportive AI assistant. How can I help you today?',
      false,
    );
  }
  
  void _initGemini() {
    try {
      _geminiService = GeminiService();
      _isGeminiAvailable = true;
    } catch (e) {
      print('Gemini service not available: $e');
      _isGeminiAvailable = false;
    }
  }
  
  void _initSpeechRecognizer() async {
    try {
      bool available = await _speech.initialize();
      if (mounted) {
        setState(() {
          print('Speech recognition available: $available');
        });
      }
    } catch (e) {
      print('Speech recognition not available: $e');
    }
  }
  
  void _initTextToSpeech() async {
    await _flutterTts.setLanguage("en-US");
    await _flutterTts.setPitch(1.0);
    await _flutterTts.setSpeechRate(0.5);
  }
  
  @override
  void dispose() {
    _textController.dispose();
    _scrollController.dispose();
    _speech.stop();
    _flutterTts.stop();
    super.dispose();
  }
  
  void _listen() async {
    if (!_isListening) {
      bool available = await _speech.initialize();
      if (available) {
        setState(() => _isListening = true);
        _speech.listen(
          onResult: (result) {
            setState(() {
              _textController.text = result.recognizedWords;
              if (result.finalResult) {
                _isListening = false;
                if (_textController.text.isNotEmpty) {
                  _handleSubmitted(_textController.text);
                }
              }
            });
          },
        );
      }
    } else {
      setState(() => _isListening = false);
      _speech.stop();
    }
  }
  
  void _speak(String text) async {
    await _flutterTts.speak(text);
  }
  
  void _addMessage(String text, bool isUser) {
    setState(() {
      _messages.add(
        ChatMessage(
          text: text,
          isUser: isUser,
          timestamp: DateTime.now(),
        ),
      );
    });
    
    // Scroll to bottom of chat
    Future.delayed(Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }
  
  Future<void> _getAIResponse(String userMessage) async {
    setState(() {
      _isSending = true;
    });
    
    try {
      String response;
      if (_isGeminiAvailable) {
        response = await _geminiService.sendMessage(userMessage);
      } else {
        // Fallback responses when Gemini is not available
        response = _getFallbackResponse(userMessage);
      }
      
      if (mounted) {
        _addMessage(response, false);
      }
    } catch (e) {
      if (mounted) {
        _addMessage(
          'I\'m sorry, I\'m having trouble processing your request right now. Could you try again?',
          false,
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isSending = false;
        });
      }
    }
  }
  
  String _getFallbackResponse(String userMessage) {
    // Simple keyword-based fallback responses
    final userMessageLower = userMessage.toLowerCase();
    
    if (userMessageLower.contains('hello') || 
        userMessageLower.contains('hi') || 
        userMessageLower.contains('hey')) {
      return 'Hello! How can I help you today?';
    } else if (userMessageLower.contains('help') || 
               userMessageLower.contains('support')) {
      return 'I\'m Haru, your AI assistant designed to provide support for neurodiverse individuals. You can ask me about coping strategies, daily planning, or learning resources. What would you like to know about?';
    } else if (userMessageLower.contains('anxious') || 
               userMessageLower.contains('anxiety') || 
               userMessageLower.contains('stress')) {
      return 'I notice you might be feeling anxious. Some helpful strategies include deep breathing, grounding exercises (like naming 5 things you can see, 4 things you can touch), and gentle movement. Would you like me to guide you through a calming exercise?';
    } else if (userMessageLower.contains('adhd') || 
               userMessageLower.contains('focus') || 
               userMessageLower.contains('concentrate')) {
      return 'For improving focus, you might try the Pomodoro technique (25 minutes of work followed by a 5-minute break), minimizing distractions in your environment, or using visual schedules. Breaking tasks into smaller steps can also help make them more manageable.';
    } else if (userMessageLower.contains('autis')) {
      return 'Autism is a neurodevelopmental condition that affects how people perceive and interact with the world. If you have questions about autism, I can provide information or resources tailored to your specific needs.';
    } else {
      return 'I\'m here to support you. Can you tell me more about what you\'re experiencing or what type of help you\'re looking for?';
    }
  }
  
  void _handleSubmitted(String text) {
    _textController.clear();
    _addMessage(text, true);
    _getAIResponse(text);
  }
  
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Expanded(
          child: Container(
            padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16.0),
            ),
            child: _messages.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.chat_outlined,
                          size: 60,
                          color: Colors.grey[400],
                        ),
                        SizedBox(height: 12),
                        Text(
                          'Chat with Haru',
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.grey[600],
                          ),
                        ),
                        SizedBox(height: 8),
                        Text(
                          'Your supportive AI companion',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[500],
                          ),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    controller: _scrollController,
                    itemCount: _messages.length,
                    padding: EdgeInsets.only(top: 8.0),
                    itemBuilder: (context, index) {
                      final message = _messages[index];
                      
                      return Align(
                        alignment: message.isUser
                            ? Alignment.centerRight
                            : Alignment.centerLeft,
                        child: Container(
                          margin: EdgeInsets.only(
                            bottom: 12,
                            left: message.isUser ? 64 : 0,
                            right: message.isUser ? 0 : 64,
                          ),
                          padding: EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 12,
                          ),
                          decoration: BoxDecoration(
                            color: message.isUser
                                ? Color(0xFF6A5ACD) // User message color
                                : Color(0xFFF0F0FF), // Haru message color
                            borderRadius: BorderRadius.circular(16.0),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              if (!message.isUser)
                                Padding(
                                  padding: const EdgeInsets.only(bottom: 4.0),
                                  child: Text(
                                    'Haru',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: Color(0xFF6A5ACD),
                                      fontSize: 12,
                                    ),
                                  ),
                                ),
                              Text(
                                message.text,
                                style: TextStyle(
                                  color: message.isUser
                                      ? Colors.white
                                      : Colors.black87,
                                ),
                              ),
                              if (message.isUser)
                                Align(
                                  alignment: Alignment.bottomRight,
                                  child: Text(
                                    'You',
                                    style: TextStyle(
                                      fontSize: 10,
                                      color: Colors.white70,
                                    ),
                                  ),
                                ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ),
        Container(
          padding: EdgeInsets.symmetric(horizontal: 8.0, vertical: 8.0),
          color: Colors.white,
          child: _isSending
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: CircularProgressIndicator(),
                  ),
                )
              : Row(
                  children: [
                    IconButton(
                      icon: Icon(
                        _isListening ? Icons.mic : Icons.mic_none,
                        color: _isListening ? Color(0xFF6A5ACD) : Colors.grey,
                      ),
                      onPressed: _listen,
                    ),
                    Expanded(
                      child: TextField(
                        controller: _textController,
                        decoration: InputDecoration(
                          hintText: 'Type a message...',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(24.0),
                            borderSide: BorderSide.none,
                          ),
                          filled: true,
                          fillColor: Colors.grey[100],
                          contentPadding: EdgeInsets.symmetric(
                            horizontal: 16.0,
                            vertical: 8.0,
                          ),
                        ),
                        textCapitalization: TextCapitalization.sentences,
                        onSubmitted: (text) {
                          if (text.isNotEmpty) {
                            _handleSubmitted(text);
                          }
                        },
                      ),
                    ),
                    IconButton(
                      icon: Icon(
                        Icons.send_rounded,
                        color: _textController.text.isEmpty
                            ? Colors.grey
                            : Color(0xFF6A5ACD),
                      ),
                      onPressed: () {
                        if (_textController.text.isNotEmpty) {
                          _handleSubmitted(_textController.text);
                        }
                      },
                    ),
                  ],
                ),
        ),
      ],
    );
  }
}
