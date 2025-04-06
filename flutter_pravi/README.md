# Pravi - Neurodiversity Support App

Pravi is a comprehensive mobile application designed to support neurodiverse individuals across various conditions including autism, ADHD, and dyslexia. The platform focuses on personalized learning, workplace assistance, social skills coaching, and daily life support through AI-powered features.

## Features

- **AI Assistant**: Chat with Haru, a friendly and supportive AI companion powered by Google's Gemini AI
- **Daily Support**: Track tasks and manage emotions with customized coping strategies
- **Personalized Learning**: Access educational content tailored to individual needs
- **Resource Hub**: Discover helpful tools, articles, and community resources

## Getting Started

### Prerequisites

- Flutter SDK (2.17.0 or higher)
- Dart SDK
- Android Studio / XCode for emulators
- Gemini API key

### Installation

1. Clone the repository
2. Create a `.env` file in the root directory with your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
3. Run `flutter pub get` to install dependencies
4. Run `flutter run` to start the application

## Tech Stack

- **Frontend**: Flutter
- **State Management**: Provider
- **API Integration**: Google's Gemini AI
- **Storage**: Shared Preferences (local), Firebase (cloud - future)
- **Design**: Custom UI with pastel colors and accessibility features

## Contributing

Contributions to Pravi are welcome! Please feel free to submit a Pull Request.
