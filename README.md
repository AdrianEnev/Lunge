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
Replace .env.example files with .env and fill out values

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