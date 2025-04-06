import 'package:google_generative_ai/google_generative_ai.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class GeminiService {
  static GeminiService? _instance;
  late final GenerativeModel _model;
  late final ChatSession _chatSession;
  
  // Private constructor
  GeminiService._() {
    final apiKey = dotenv.env['GEMINI_API_KEY'] ?? '';
    if (apiKey.isEmpty) {
      throw Exception('GEMINI_API_KEY is not set in environment variables');
    }
    
    // Initialize the Gemini model
    _model = GenerativeModel(
      model: 'gemini-1.5-pro',
      apiKey: apiKey,
      safetySettings: [
        SafetySetting(
          category: HarmCategory.harassment,
          threshold: HarmBlockThreshold.medium,
        ),
        SafetySetting(
          category: HarmCategory.hateSpeech,
          threshold: HarmBlockThreshold.medium,
        ),
      ],
    );
    
    // Start a chat session
    _chatSession = _model.startChat(
      history: [
        Content.text(
          'You are Haru, an AI assistant designed to help neurodiverse individuals. '
          'Your tone is friendly, supportive, and patient. You provide clear and '
          'helpful responses without overwhelming the user. You understand the unique '
          'challenges faced by people with autism, ADHD, dyslexia, and other '
          'neurodivergent conditions. Always offer practical advice and emotional support.'
        ),
      ],
    );
  }
  
  // Singleton factory
  factory GeminiService() {
    _instance ??= GeminiService._();
    return _instance!;
  }
  
  // Method to send a message and get a response
  Future<String> sendMessage(String message) async {
    try {
      final response = await _chatSession.sendMessage(Content.text(message));
      final responseText = response.text ?? 'I couldn\'t generate a response. Please try again.';
      return responseText;
    } catch (e) {
      // If the API call fails, return a graceful error message
      return 'I\'m having trouble connecting right now. This is just a demo, but the full version would use Google\'s Gemini AI to provide personalized support.';
    }
  }
  
  // Method to generate coping strategies for emotions
  Future<List<String>> generateCopingStrategies(String emotion) async {
    try {
      final prompt = 'Generate 3 brief, effective coping strategies for someone feeling $emotion. '
          'Make them practical and suitable for neurodiverse individuals. Format as a short list.';
      
      final response = await _model.generateContent(Content.text(prompt));
      final responseText = response.text ?? '';
      
      // Parse the response into a list of strategies
      final strategies = responseText
          .split('\n')
          .where((line) => line.trim().isNotEmpty)
          .take(3)
          .toList();
      
      return strategies.isEmpty ? 
        ['Take deep breaths', 'Go for a short walk', 'Listen to calming music'] : 
        strategies;
    } catch (e) {
      // Return default strategies if the API call fails
      return [
        'Take deep breaths',
        'Go for a short walk',
        'Listen to calming music',
      ];
    }
  }
  
  // Method to generate learning recommendations
  Future<List<Map<String, String>>> generateLearningRecommendations(List<String> interests) async {
    try {
      final interestsText = interests.join(', ');
      final prompt = 'Generate 3 personalized learning module recommendations for a neurodiverse '
          'individual with these interests or challenges: $interestsText. '
          'For each recommendation, provide a title and a brief description. '
          'Make them specific, practical, and helpful.';
      
      final response = await _model.generateContent(Content.text(prompt));
      final responseText = response.text ?? '';
      
      // For demo purposes, return simplified parsing
      // In a production app, you would want more robust parsing
      final lines = responseText.split('\n').where((line) => line.trim().isNotEmpty).toList();
      
      List<Map<String, String>> recommendations = [];
      String currentTitle = '';
      String currentDescription = '';
      
      for (var line in lines) {
        if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') ||
            line.startsWith('•') || line.startsWith('-')) {
          // This looks like a title
          if (currentTitle.isNotEmpty) {
            // Save the previous recommendation
            recommendations.add({
              'title': currentTitle,
              'description': currentDescription,
            });
            currentDescription = '';
          }
          currentTitle = line.replaceFirst(RegExp(r'^[1-3]\.|\•|\-'), '').trim();
        } else if (currentTitle.isNotEmpty) {
          // This is part of the description
          currentDescription += ' ' + line.trim();
        }
      }
      
      // Add the last recommendation
      if (currentTitle.isNotEmpty) {
        recommendations.add({
          'title': currentTitle,
          'description': currentDescription,
        });
      }
      
      // If we couldn't parse properly, return default recommendations
      if (recommendations.isEmpty) {
        return _getDefaultRecommendations();
      }
      
      return recommendations;
    } catch (e) {
      return _getDefaultRecommendations();
    }
  }
  
  // Default recommendations when the API fails
  List<Map<String, String>> _getDefaultRecommendations() {
    return [
      {
        'title': 'Executive Function Skills',
        'description': 'Learn practical strategies to improve organization, time management, and planning.',
      },
      {
        'title': 'Social Communication',
        'description': 'Develop techniques for better understanding social cues and expressing yourself clearly.',
      },
      {
        'title': 'Sensory Processing',
        'description': 'Discover ways to manage sensory sensitivities and create comfortable environments.',
      },
    ];
  }
}
