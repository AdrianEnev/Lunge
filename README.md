# 🏋️‍♂️ Lunge: AI Fitness Tracker
- Mobile frontend written on React Native (tailwind css + expo)
- Web frontend written on React + React Router v7 (tailwind css + vite)
- Backend with Node.js + Express

### 🚀 Features:
#### Lunge Mobile
- [x] Create your own custom workout split
- [x] Keep track of your workouts and view in depth statistics
- [x] Track your food and macronutrient intake
- [x] Add friends and view their statistics
- [x] Generate personalized workout splits using AI
- [x] Set specific daily goals, depending on your lifestyle
- [x] Create up to 2 accounts per device, using your email of choice
- [x] Available in Bulgarian, English, German, French, Italian, Spanish and Russian
- [x] Involves monitoring NSFW usernames/profile pictures via AI integration
#### Lunge Web
- [x] View statistics about your mobile Lunge account
- [x] Manage your account settings
- [x] View your friends list

#### 📦 Getting Started
- npx installed ✅
- expo installed ✅

#### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AdrianEnev/Lunge.git
   cd Lunge

2. **Install Dependencies**
### For mobile
cd mobile
npm install

### For web
cd ../web
npm install

### For backend
cd ../backend
npm install

3. **Set up environment variables**
Create .env files in all three directiories
### mobile/.env:
EXPO_PUBLIC_BACKEND_URL=
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=

### web/.env
VITE_REACT_APP_API_KEY=
VITE_REACT_APP_AUTH_DOMAIN=
VITE_REACT_APP_PROJECT_ID=
VITE_REACT_APP_STORAGE_BUCKET=
VITE_REACT_APP_MESSAGING_SENDER_ID=
VITE_REACT_APP_APP_ID=
VITE_REACT_APP_MEASUREMENT_ID=
VITE_REACT_BACKEND_URL=

### backend/.env
BACKEND_HUGGINGFACE_API_TOKEN=
BACKEND_FIREBASE_API_KEY=
BACKEND_FIREBASE_AUTH_DOMAIN=
BACKEND_FIREBASE_PROJECT_ID=
BACKEND_FIREBASE_STORAGE_BUCKET=
BACKEND_FIREBASE_MESSAGING_SENDER_ID=
BACKEND_FIREBASE_APP_ID=
BACKEND_FIREBASE_MEASUREMENT_ID=
BACKEND_GPT_PAT=
BACKEND_GPT_MODEL_VERSION_ID=
BACKEND_EDAMAM_APP_ID=
BACKEND_EDAMAM_APP_KEY=
BACKEND_STRIPE_PUBLISHABLE_KEY=
BACKEND_STRIPE_SECRET_KEY=
BACKEND_FIREBASE_ADMIN_PATH=config/your_firebase_admin_config_file
BACKEND_APP_DEBUG=true
BACKEND_PORT=3000

4 **Run the app**
### In one terminal for the backend
cd backend
npm run dev

### In another terminal for mobile or web
cd mobile/cd web
npm run dev

### Note
Before deploying the backend:
package.json -> prefix _moduleAliases with dist/...
example: "@config": "config", -> "@config": "dist/config",