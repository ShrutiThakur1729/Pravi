import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class GeminiService {
  final String apiKey;
  final String modelName = 'gemini-pro';
  final String baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  
  GeminiService() : apiKey = dotenv.env['GEMINI_API_KEY'] ?? '';
  
  Future<String> sendMessage(String message) async {
    if (apiKey.isEmpty) {
      return 'API key is not configured. Please check your environment setup.';
    }
    
    final url = '$baseUrl/$modelName:generateContent?key=$apiKey';
    
    final Map<String, dynamic> requestBody = {
      'contents': [
        {
          'role': 'user',
          'parts': [
            {
              'text': message
            }
          ]
        }
      ],
      'generationConfig': {
        'temperature': 0.7,
        'topK': 40,
        'topP': 0.95,
        'maxOutputTokens': 1024,
      },
      'safetySettings': [
        {
          'category': 'HARM_CATEGORY_HARASSMENT',
          'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          'category': 'HARM_CATEGORY_HATE_SPEECH',
          'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          'category': 'HARM_CATEGORY_DANGEROUS_CONTENT',
          'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    };
    
    try {
      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode(requestBody),
      );
      
      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        
        if (responseData['candidates'] != null && 
            responseData['candidates'].isNotEmpty && 
            responseData['candidates'][0]['content'] != null &&
            responseData['candidates'][0]['content']['parts'] != null &&
            responseData['candidates'][0]['content']['parts'].isNotEmpty) {
          return responseData['candidates'][0]['content']['parts'][0]['text'];
        } else {
          return 'Sorry, I couldn\'t generate a response. Please try again.';
        }
      } else {
        print('API Error: ${response.statusCode} - ${response.body}');
        return 'Sorry, I encountered an error. Please try again later.';
      }
    } catch (e) {
      print('Exception during API call: $e');
      return 'I\'m having trouble connecting right now. Can we try again in a moment?';
    }
  }
  
  Future<List<String>> generateCopingStrategies(String emotion) async {
    final prompt = 'I\'m feeling $emotion. Can you provide 3-5 short coping strategies or techniques to help me manage this emotion? Format each strategy as a brief, actionable sentence.';
    
    final response = await sendMessage(prompt);
    
    // Parse the response to extract strategies
    List<String> strategies = [];
    
    // Try to extract numbered or bulleted items
    final numberedRegExp = RegExp(r'\d+\.\s+(.*?)(?=\d+\.|$)', dotAll: true);
    final bulletedRegExp = RegExp(r'[\-\•]\s+(.*?)(?=[\-\•]|$)', dotAll: true);
    
    Iterable<RegExpMatch> matches = numberedRegExp.allMatches(response);
    
    if (matches.isEmpty) {
      matches = bulletedRegExp.allMatches(response);
    }
    
    if (matches.isNotEmpty) {
      for (final match in matches) {
        final strategy = match.group(1)?.trim();
        if (strategy != null && strategy.isNotEmpty) {
          strategies.add(strategy);
        }
      }
    }
    
    // If we couldn't extract structured strategies, just split by lines
    if (strategies.isEmpty) {
      strategies = response
          .split('\n')
          .where((line) => line.trim().isNotEmpty)
          .map((line) => line.trim())
          .toList();
    }
    
    // Limit to 5 strategies at most
    strategies = strategies.take(5).toList();
    
    // If still empty, provide fallback
    if (strategies.isEmpty) {
      strategies = [
        'Take slow, deep breaths to calm your body and mind.',
        'Practice a brief mindfulness exercise focusing on your surroundings.',
        'Try a short walk or gentle movement to shift your energy.',
        'Write down your thoughts to externalize your feelings.',
        'Reach out to someone you trust for support.',
      ];
    }
    
    return strategies;
  }
}
