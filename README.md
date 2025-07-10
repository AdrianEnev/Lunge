# 💪 Lunge
> Diet & Fitness Tracking App

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=flat-square&logo=Firebase&logoColor=white)](https://firebase.google.com/)
[![Expo](https://img.shields.io/badge/expo-1C1E24?style=flat-square&logo=expo&logoColor=#D04A37)](https://expo.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

## ✨ Features That Make a Difference

### 🎯 Intelligent Fitness Tracking
- **AI-Powered Workouts**: Get personalized training plans that evolve with you
- **Comprehensive Analytics**: Deep insights into your fitness journey
- **Nutrition Made Simple**: Track macros and micros with our intuitive food diary

### 🌍 Cross-Platform Experience
- **Seamless Sync**: Pick up where you left off, on any device
- **Native Performance**: Buttery smooth animations and interactions
- **Offline First**: Your data is always accessible, even without connection

### 🤝 Social & Motivation
- **Community Challenges**: Compete with friends and stay motivated
- **Progress Sharing**: Celebrate milestones with your support network
- **Expert Guidance**: Access to professional trainers and nutritionists

## 🛠 Tech Stack

| Area       | Technologies Used |
|------------|-------------------|
| **Frontend** | React Native, Expo, TypeScript, Tailwind CSS |
| **Web**    | React 18, Vite, React Router 7, TypeScript |
| **Backend** | Node.js, Express, TypeScript, Firebase |
| **Database** | Firestore, Firebase Auth |
| **AI/ML**  | Hugging Face, Custom Models |
| **DevOps**  | Docker, GitHub Actions, Fly.io |

## 🛠 Quick Start

### Prerequisites
- Node.js 18+ & npm 9+
- Firebase project (for authentication)
- Basic understanding of React Native and Node.js

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AdrianEnev/Lunge.git
   cd Lunge
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd apps/backend
   npm install
   
   # Install mobile app dependencies
   cd ../mobile
   npm install
   
   # Install web app dependencies
   cd ../web
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env` in each app directory
   - Fill in the required values (see Configuration section below)

### Running Locally

#### Backend
```bash
cd apps/backend
npm run dev
```

#### Mobile App
```bash
cd apps/mobile
expo start
```

#### Web App
```bash
cd apps/web
npm run dev
```

## 🔧 Configuration

### Environment Variables

#### Backend (`.env`)
```
PORT=3001
FIREBASE_SERVICE_ACCOUNT=path/to/serviceAccountKey.json
STRIPE_SECRET_KEY=your_stripe_secret_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

#### Mobile (`.env`)
```
EXPO_PUBLIC_API_URL=http://your-api-url.com
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
```

## 📱 App Preview & Availability

### Lunge Mobile (iOS)
[![Download on the App Store](https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg)](https://apps.apple.com/us/app/lunge/id6739221997?platform=iphone)

The mobile app is currently available on the iOS App Store. Click the badge above to download it and start your fitness journey today!

### Lunge Web (In early development)
The web platform is currently in active development. The same great experience from Lunge Mobile will be coming to web browsers soon.

## 🌐 Deployment

### Backend (Fly.io)
```bash
fly launch  # First time
fly deploy  # Subsequent deploys
```

### Web (Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Mobile (EAS)
```bash
# Build the app
eas build --platform all

# Submit to stores
eas submit -p ios
eas submit -p android
```

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📬 Contact

- **Name**: Adrian Enev
- **Email**: [enevadria@gmail.com](mailto:enevadria@gmail.com)
- **Website**: [adrianenev.com](https://adrianenev.com)
- **GitHub**: [github.com/AdrianEnev](https://github.com/AdrianEnev)

---

<p align="center">
  Built with ❤️ and ☕ by <a href="https://github.com/AdrianEnev">Adrian Enev</a>
  <br>
  If you find this project helpful, consider giving it a ⭐️
</p>