# NumbReX - React Native Mobile Game

A minimalistic code-cracking game built with React Native and Expo, featuring three exciting game modes and responsive design for Android devices.

## 🎮 Game Features

### Game Modes
- **Classic Mode**: Traditional gameplay with progressive difficulty through 60+ stages
- **Speed Mode**: Race against time to solve as many codes as possible in 60 seconds
- **Survival Mode**: One mistake ends your run - high risk, high reward gameplay

### Key Features
- Progressive difficulty with boss levels every 10 stages
- Dynamic digit count from 3-6 digits based on stage/mode
- Haptic feedback for enhanced mobile experience
- Responsive design for all Android screen sizes
- Minimalistic UI with clean color scheme
- Touch-friendly input system with auto-focus navigation

## 🛠️ Technical Stack

- **React Native**: 0.74.5
- **Expo**: Latest SDK
- **TypeScript**: For type safety
- **Expo Haptics**: Touch feedback
- **React Native Reanimated**: Smooth animations

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd numbrex_native
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on Android:
```bash
npx expo run:android
```

## 📱 Play Store Deployment

### Build for Production

1. Install EAS CLI:
```bash
npm install -g @expo/eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure the project:
```bash
eas build:configure
```

4. Build for Android:
```bash
eas build --platform android --profile production
```

### App Configuration
- **Package Name**: `com.numbrex.app`
- **Version Code**: 1
- **Target SDK**: Latest Android API level
- **Permissions**: VIBRATE (for haptic feedback)

## 🎯 Game Mechanics

### Feedback System
- **Green**: Correct digit in correct position
- **Yellow**: Correct digit in wrong position  
- **Red**: Wrong digit (not in the sequence)

### Scoring
- **Classic Mode**: Progress through stages
- **Speed Mode**: Points for each solved code + time bonus
- **Survival Mode**: Multiplying rewards based on streak

## 🎨 Design Philosophy

- Minimalistic and clean interface
- No gradients - solid colors only
- Consistent color scheme matching original web version
- Touch-friendly UI elements
- Professional appearance suitable for app stores

## 📋 Project Structure

```
src/
├── components/
│   ├── GameModeSelector.tsx
│   ├── NumberGame.tsx
│   ├── GameStats.tsx
│   ├── GuessRow.tsx
│   └── DigitInput.tsx
└── utils/
    └── gameLogic.ts
```

## 🔧 Configuration Files

- `app.json`: Expo configuration
- `eas.json`: Build configuration for EAS
- `package.json`: Dependencies and scripts

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues and support, please create an issue in the repository or contact the development team.

---

Built with ❤️ using React Native and Expo
